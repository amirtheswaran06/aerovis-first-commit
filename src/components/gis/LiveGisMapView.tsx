import React, { useState, useEffect, useMemo } from 'react';
import { 
  Map as MapIcon, 
  Bus as BusIcon, 
  AlertTriangle, 
  Layers, 
  Eye, 
  Filter, 
  Navigation, 
  ShieldCheck, 
  Radio, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Construction, 
  TrafficCone, 
  Video, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Info,
  Crosshair,
  Globe,
  Satellite,
  Locate,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Bus, Incident, RoadDefect, TrafficHotspot, NavTab } from '../../types';
import { GoogleGisMap } from './GoogleGisMap';
import { CITY_PRESETS, CityPreset, reverseGeocodeCity, getCityLocalizedItems } from './gisUtils';

interface LiveGisMapViewProps {
  buses: Bus[];
  incidents: Incident[];
  roadDefects: RoadDefect[];
  trafficHotspots: TrafficHotspot[];
  onNavigate: (tab: NavTab) => void;
  onSelectIncident: (incident: Incident) => void;
  onSelectBus: (bus: Bus) => void;
}

export const LiveGisMapView: React.FC<LiveGisMapViewProps> = ({
  buses,
  incidents,
  roadDefects,
  trafficHotspots,
  onNavigate,
  onSelectIncident,
  onSelectBus
}) => {
  // Mode: 'gmaps' (Google Maps Platform) or 'tactical' (SVG Vector Grid)
  const [mapEngine, setMapEngine] = useState<'gmaps' | 'tactical'>('gmaps');
  const [mapType, setMapType] = useState<string>('hybrid'); // roadmap, hybrid, satellite, terrain

  // User location and city centering
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cityName, setCityName] = useState<string>('Detecting User Location...');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'detecting' | 'locked' | 'denied' | 'custom'>('detecting');
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>({ lat: 13.0827, lng: 80.2707 });
  const [currentZoom, setCurrentZoom] = useState<number>(11.5); // Whole city view zoom
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('chennai');

  // Selected vehicle / node
  const [selectedBusId, setSelectedBusId] = useState<string>('BUS-104');

  // Layer filters
  const [showBuses, setShowBuses] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showDefects, setShowDefects] = useState<boolean>(true);
  const [showTrafficHeatmap, setShowTrafficHeatmap] = useState<boolean>(true);
  const [showBusStops, setShowBusStops] = useState<boolean>(true);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC1ytvz5SMOHJtT82VjSyDijpFcyagZWD0';

  // Request browser geolocation on mount to detect user's whole city
  const detectUserCity = () => {
    setGeoStatus('detecting');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setCurrentCenter({ lat, lng });
          setCurrentZoom(11.5); // Whole city view
          setGeoStatus('locked');

          // Reverse geocode to get human city name
          const detectedCity = await reverseGeocodeCity(lat, lng);
          setCityName(detectedCity);
          setSelectedPresetId('user_location');
        },
        (error) => {
          console.warn('Geolocation access not available or denied:', error.message);
          setGeoStatus('denied');
          // Fall back to default city preset (Chennai)
          const fallback = CITY_PRESETS[0];
          setCityName(fallback.name + ', ' + fallback.country);
          setCurrentCenter({ lat: fallback.lat, lng: fallback.lng });
          setCurrentZoom(fallback.zoom);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setGeoStatus('denied');
      const fallback = CITY_PRESETS[0];
      setCityName(fallback.name + ', ' + fallback.country);
      setCurrentCenter({ lat: fallback.lat, lng: fallback.lng });
    }
  };

  useEffect(() => {
    detectUserCity();
  }, []);

  // Handle switching city preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'user_location' && userLocation) {
      setCurrentCenter(userLocation);
      setCurrentZoom(11.5);
      setGeoStatus('locked');
      return;
    }
    const preset = CITY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCurrentCenter({ lat: preset.lat, lng: preset.lng });
      setCurrentZoom(preset.zoom);
      setCityName(`${preset.name}, ${preset.country}`);
      setGeoStatus('custom');
    }
  };

  // Reset to Whole City view (Level 11.5)
  const handleWholeCityView = () => {
    setCurrentZoom(11.5);
    if (userLocation && selectedPresetId === 'user_location') {
      setCurrentCenter(userLocation);
    } else {
      const preset = CITY_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset) setCurrentCenter({ lat: preset.lat, lng: preset.lng });
    }
  };

  // Focus on user exact coordinates
  const handleLocateUser = () => {
    if (userLocation) {
      setCurrentCenter(userLocation);
      setCurrentZoom(15);
    } else {
      detectUserCity();
    }
  };

  // Dynamically project municipal buses across the current city center
  const localizedData = useMemo(() => {
    return getCityLocalizedItems(currentCenter.lat, currentCenter.lng);
  }, [currentCenter.lat, currentCenter.lng]);

  const localizedBuses = useMemo(() => {
    return buses.map((bus, idx) => {
      const offset = localizedData.busOffsets[idx % localizedData.busOffsets.length];
      return {
        ...bus,
        lat: currentCenter.lat + offset.lat,
        lng: currentCenter.lng + offset.lng,
        locationName: `${offset.route} (${cityName})`
      };
    });
  }, [buses, currentCenter, localizedData, cityName]);

  const localizedDefects = useMemo(() => {
    return roadDefects.map((defect, idx) => {
      const offset = localizedData.defectOffsets[idx % localizedData.defectOffsets.length];
      return {
        ...defect,
        coordinates: [currentCenter.lat + offset.lat, currentCenter.lng + offset.lng] as [number, number],
        location: `${offset.label}, ${cityName}`
      };
    });
  }, [roadDefects, currentCenter, localizedData, cityName]);

  const activeBus = localizedBuses.find((b) => b.id === selectedBusId) || localizedBuses[0];

  return (
    <div className="space-y-4 pb-12">
      {/* Top GIS Header with City Detection & Whole City Controls */}
      <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-[#F97316]" />
                Live City GIS & Fleet Telematics
              </h1>

              {/* Status Badge */}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 ${
                geoStatus === 'locked'
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                  : geoStatus === 'detecting'
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                {geoStatus === 'detecting' ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>DETECTING USER CITY...</span>
                  </>
                ) : geoStatus === 'locked' ? (
                  <>
                    <Crosshair className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span>USER CITY LOCKED (GPS)</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>WHOLE CITY ACTIVE</span>
                  </>
                )}
              </span>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                GOOGLE MAPS POWERED
              </span>
            </div>

            <p className="text-xs text-gray-400 flex flex-wrap items-center gap-2">
              <span>Whole city surveillance center for:</span>
              <strong className="text-white font-mono bg-[#181B22] px-2 py-0.5 rounded border border-[#262C38]">
                {cityName}
              </strong>
              <span className="text-gray-500">•</span>
              <span className="text-cyan-400 font-mono">
                {currentCenter.lat.toFixed(4)}° N, {currentCenter.lng.toFixed(4)}° E
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Whole City Metro Coverage: ~35 km radius</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={detectUserCity}
              className="px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-mono border border-cyan-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Detect and center on your actual city location"
            >
              <Locate className="w-3.5 h-3.5" />
              <span>Locate My City</span>
            </button>

            <button
              onClick={handleWholeCityView}
              className="px-3 py-1.5 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Fit whole city metropolitan area"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Whole City (11.5x)</span>
            </button>

            {/* City Preset Switcher */}
            <div className="relative">
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="bg-[#171A20] text-gray-200 text-xs font-mono px-3 py-1.5 rounded border border-[#252B38] hover:border-gray-500 focus:outline-none focus:border-[#F97316] cursor-pointer"
              >
                {userLocation && (
                  <option value="user_location">📍 My Location: {cityName.split(',')[0]}</option>
                )}
                {CITY_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}, {preset.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Engine and Visual Style Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E222A]">
          {/* Map Engine Toggle */}
          <div className="flex items-center gap-1.5 bg-[#0A0C10] p-1 rounded-md border border-[#222834]">
            <button
              onClick={() => setMapEngine('gmaps')}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                mapEngine === 'gmaps'
                  ? 'bg-[#F97316] text-white font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Maps Platform</span>
            </button>

            <button
              onClick={() => setMapEngine('tactical')}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                mapEngine === 'tactical'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Tactical Dark Vector Grid</span>
            </button>
          </div>

          {/* Google Maps Layer Style (Only visible when GMaps active) */}
          {mapEngine === 'gmaps' && (
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-gray-400 hidden sm:inline mr-1">Layer:</span>
              {[
                { id: 'hybrid', label: 'Hybrid Satellite' },
                { id: 'roadmap', label: 'Roadmap' },
                { id: 'satellite', label: 'Satellite' },
                { id: 'terrain', label: 'Terrain' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setMapType(style.id)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    mapType === style.id
                      ? 'bg-[#232A38] text-white border border-gray-600 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Viewport & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive GIS Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0B0D12] border border-[#1E222A] rounded-lg relative overflow-hidden flex flex-col min-h-[640px]">
          {/* Layer Controls Bar */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-[#111318]/90 backdrop-blur-md p-1.5 rounded-md border border-[#232730] text-xs font-mono shadow-xl">
            <button
              onClick={() => setShowBuses(!showBuses)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                showBuses ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold' : 'text-gray-400'
              }`}
            >
              <BusIcon className="w-3 h-3" />
              <span>Buses ({buses.length})</span>
            </button>

            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                showIncidents ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold' : 'text-gray-400'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-[#F97316]" />
              <span>Incidents ({incidents.length})</span>
            </button>

            <button
              onClick={() => setShowDefects(!showDefects)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                showDefects ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-gray-400'
              }`}
            >
              <Construction className="w-3 h-3 text-amber-400" />
              <span>Defects ({roadDefects.length})</span>
            </button>

            <button
              onClick={() => setShowTrafficHeatmap(!showTrafficHeatmap)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                showTrafficHeatmap ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' : 'text-gray-400'
              }`}
            >
              <TrafficCone className="w-3 h-3 text-purple-400" />
              <span>Congestion ({trafficHotspots.length})</span>
            </button>

            <button
              onClick={() => setShowBusStops(!showBusStops)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                showBusStops ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-gray-400'
              }`}
            >
              <span>Stops</span>
            </button>
          </div>

          {/* Map Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 shadow-xl">
            <button
              onClick={() => setCurrentZoom((z) => Math.min(z + 1, 18))}
              className="w-8 h-8 rounded bg-[#111318]/90 border border-[#232730] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentZoom((z) => Math.max(z - 1, 9))}
              className="w-8 h-8 rounded bg-[#111318]/90 border border-[#232730] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleWholeCityView}
              className="w-8 h-8 rounded bg-[#111318]/90 border border-[#232730] flex items-center justify-center text-[#F97316] hover:text-white cursor-pointer"
              title="Reset to Whole City"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Map Rendering Engine */}
          {mapEngine === 'gmaps' ? (
            <GoogleGisMap
              apiKey={googleMapsApiKey}
              center={currentCenter}
              zoom={currentZoom}
              userLocation={userLocation}
              cityName={cityName}
              buses={localizedBuses}
              incidents={incidents}
              roadDefects={localizedDefects}
              trafficHotspots={trafficHotspots}
              selectedBusId={selectedBusId}
              onSelectBus={(bus) => {
                setSelectedBusId(bus.id);
                onSelectBus(bus);
              }}
              onSelectIncident={onSelectIncident}
              showBuses={showBuses}
              showIncidents={showIncidents}
              showDefects={showDefects}
              showTrafficHeatmap={showTrafficHeatmap}
              showBusStops={showBusStops}
              mapType={mapType}
              onWholeCityClick={handleWholeCityView}
              onLocateUserClick={handleLocateUser}
            />
          ) : (
            /* Fallback Tactical SVG Canvas (Styled Dark Vector Grid) */
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[580px] select-none">
              {/* Grid & Map Tiles */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#151821_1px,transparent_1px),linear-gradient(to_bottom,#151821_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />

              {/* Waterway / Coastal indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-blue-950/20 to-transparent border-l border-blue-900/10 pointer-events-none" />

              {/* SVG Transit Corridors & Road Network */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40,80 L 180,140 L 320,180 L 520,280 L 740,320" stroke="#252A36" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M 40,80 L 180,140 L 320,180 L 520,280 L 740,320" stroke="#374151" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M 120,440 L 260,340 L 380,240 L 540,160 L 720,120" stroke="#F97316" strokeWidth="5" strokeDasharray="8 4" fill="none" opacity="0.85" />
                <path d="M 520,40 L 540,160 L 580,300 L 640,460" stroke="#10B981" strokeWidth="4" fill="none" opacity="0.8" />
                <path d="M 80,260 L 220,220 L 380,240 L 600,260" stroke="#06B6D4" strokeWidth="3" fill="none" opacity="0.75" />

                {/* User Radar Ping in Vector Canvas */}
                {userLocation && (
                  <g transform="translate(380, 240)">
                    <circle r="22" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.4">
                      <animate attributeName="r" from="6" to="30" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="6" fill="#06B6D4" />
                  </g>
                )}
              </svg>

              {/* Interactive Vector Pins */}
              {showBuses && localizedBuses.map((bus, bIdx) => {
                const busPositions = [
                  { top: '46%', left: '49%' },
                  { top: '28%', left: '66%' },
                  { top: '62%', left: '38%' },
                  { top: '36%', left: '22%' }
                ];
                const pos = busPositions[bIdx % busPositions.length];
                const isSelected = bus.id === activeBus.id;

                return (
                  <div
                    key={bus.id}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                    onClick={() => {
                      setSelectedBusId(bus.id);
                      onSelectBus(bus);
                    }}
                  >
                    <div className={`p-1.5 px-2 rounded-md border flex items-center gap-1.5 shadow-2xl backdrop-blur-md ${
                      isSelected
                        ? 'bg-[#1C2028] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.4)]'
                        : 'bg-[#111318]/95 border-[#2A303C]'
                    }`}>
                      <BusIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono text-xs font-bold text-white">{bus.id}</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                        {bus.speedKmH}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom GIS Status Footer */}
          <div className="p-3 bg-[#0E1015] border-t border-[#1E222A] flex flex-wrap items-center justify-between text-xs font-mono text-gray-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-gray-300">
                  Target City: <strong className="text-white">{cityName.split(',')[0]}</strong> ({currentCenter.lat.toFixed(4)}° N, {currentCenter.lng.toFixed(4)}° E)
                </span>
              </span>
              <span>•</span>
              <span className="text-cyan-400">Whole City Scale: Zoom {currentZoom}</span>
              <span>•</span>
              <span>GPS NTP Sync: 4.2ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#F97316]">
                {localizedBuses.length} Fleet Vehicles Telemetred
              </span>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Inspection Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-[#111318] border border-[#1E222A] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">
                    {activeBus.id}
                  </h3>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    activeBus.status === 'ALERT'
                      ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {activeBus.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{activeBus.name}</p>
              </div>

              <span className="text-xs font-mono text-cyan-400">
                {activeBus.route}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">CITY SECTOR</span>
                <span className="text-white font-bold truncate block">{cityName.split(',')[0]}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">CORRIDOR</span>
                <span className="text-white font-bold truncate block">{activeBus.locationName}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">SPEED & HEADING</span>
                <span className="text-white font-bold">{activeBus.speedKmH} km/h • {activeBus.heading}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">CAMERAS ACTIVE</span>
                <span className="text-emerald-400 font-bold">{activeBus.camerasOnline} / 4 Streams OK</span>
              </div>
            </div>

            {/* Live Camera Matrix Feed */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold">
                  Live Edge AI Streams ({cityName.split(',')[0]} Fleet):
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  REAL-TIME RTSP
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {activeBus.cameras?.map((cam) => (
                  <div
                    key={cam.id}
                    className="p-2 rounded bg-[#0A0C0F] border border-[#1C2028] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-gray-300 block">{cam.name}</span>
                      <span className="text-[10px] text-gray-400">{cam.lastDetection}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {cam.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Whole City Surveillance Telemetry Box */}
            <div className="mt-4 p-3 rounded bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] mb-1">
                <Locate className="w-3.5 h-3.5" />
                <span>Metropolitan Coverage Profile</span>
              </div>
              <p className="text-[10px] text-gray-300 leading-relaxed">
                Google Maps coordinates synchronized to <strong className="text-white">{cityName}</strong>.
                {userLocation ? ' User GPS coordinates locked.' : ' Whole-city metropolitan view active.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#1E222A]">
            <button
              onClick={() => onNavigate('live-ai-vision')}
              className="w-full py-2.5 px-3 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium font-sans flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live AI Vision for {activeBus.id}</span>
            </button>

            <button
              onClick={() => onNavigate('fleet-intelligence')}
              className="w-full py-2 px-3 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 hover:text-white text-xs font-mono border border-[#232730] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Fleet Diagnostic Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

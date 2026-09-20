import React, { useState, useEffect, useMemo } from 'react';
import { 
  Video, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Activity, 
  ArrowUpRight, 
  ChevronRight, 
  Bus as BusIcon, 
  Clock, 
  Eye, 
  Search, 
  Filter, 
  MapPin, 
  Radio, 
  Sparkles,
  ExternalLink,
  Shield,
  Gauge,
  Cpu,
  Camera,
  Map,
  Construction,
  TrafficCone,
  Globe,
  Locate,
  Crosshair,
  Loader2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Compass,
  Navigation
} from 'lucide-react';
import { Bus, Incident, AIEvent, NavTab, RoadDefect, TrafficHotspot } from '../../types';
import { ROAD_DEFECTS, TRAFFIC_HOTSPOTS } from '../../data/mockData';
import { GoogleGisMap } from '../gis/GoogleGisMap';
import { CITY_PRESETS, reverseGeocodeCity, getCityLocalizedItems } from '../gis/gisUtils';

interface CommandCenterProps {
  buses: Bus[];
  incidents: Incident[];
  aiEvents: AIEvent[];
  roadDefects?: RoadDefect[];
  trafficHotspots?: TrafficHotspot[];
  onNavigate: (tab: NavTab) => void;
  onSelectIncident: (incident: Incident) => void;
  onSelectBus: (bus: Bus) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  buses,
  incidents,
  aiEvents,
  roadDefects,
  trafficHotspots,
  onNavigate,
  onSelectIncident,
  onSelectBus
}) => {
  const [selectedBusId, setSelectedBusId] = useState<string>('BUS-104');

  const effectiveRoadDefects = roadDefects && roadDefects.length > 0 ? roadDefects : ROAD_DEFECTS;
  const effectiveTrafficHotspots = trafficHotspots && trafficHotspots.length > 0 ? trafficHotspots : TRAFFIC_HOTSPOTS;

  // Map Engine & State
  const [mapEngine, setMapEngine] = useState<'gmaps' | 'tactical'>('gmaps');
  const [mapType, setMapType] = useState<string>('hybrid');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cityName, setCityName] = useState<string>('Detecting User Location...');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'detecting' | 'locked' | 'denied' | 'custom'>('detecting');
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>({ lat: 13.0827, lng: 80.2707 });
  const [currentZoom, setCurrentZoom] = useState<number>(11.5);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('chennai');

  // Layer Toggles
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
          setCurrentZoom(11.5);
          setGeoStatus('locked');

          const detectedCity = await reverseGeocodeCity(lat, lng);
          setCityName(detectedCity);
          setSelectedPresetId('user_location');
        },
        (error) => {
          setGeoStatus('denied');
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

  const handleWholeCityView = () => {
    setCurrentZoom(11.5);
    if (userLocation && selectedPresetId === 'user_location') {
      setCurrentCenter(userLocation);
    } else {
      const preset = CITY_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset) setCurrentCenter({ lat: preset.lat, lng: preset.lng });
    }
  };

  const handleLocateUser = () => {
    if (userLocation) {
      setCurrentCenter(userLocation);
      setCurrentZoom(15);
    } else {
      detectUserCity();
    }
  };

  // Localized items mapped dynamically to the active city center
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
        locationName: `${offset.route} (${cityName.split(',')[0]})`
      };
    });
  }, [buses, currentCenter, localizedData, cityName]);

  const localizedDefects = useMemo(() => {
    return effectiveRoadDefects.map((defect, idx) => {
      const offset = localizedData.defectOffsets[idx % localizedData.defectOffsets.length];
      return {
        ...defect,
        coordinates: [currentCenter.lat + offset.lat, currentCenter.lng + offset.lng] as [number, number],
        location: `${offset.label}, ${cityName.split(',')[0]}`
      };
    });
  }, [effectiveRoadDefects, currentCenter, localizedData, cityName]);

  const activeBus = localizedBuses.find((b) => b.id === selectedBusId) || localizedBuses[0] || buses[0];
  const activeIncidentsCount = incidents.filter(i => i.status === 'NEW' || i.status === 'UNDER_REVIEW' || i.status === 'ASSIGNED' || i.status === 'RESPONDING').length || 12;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Operational Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white font-sans">
              AEROVIS COMMAND CENTER
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM OPERATIONAL
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[11px] font-mono">
              DEMO ENVIRONMENT
            </div>
          </div>
          <p className="text-xs lg:text-sm text-gray-400 max-w-2xl">
            City-scale transportation intelligence from mobile AI vision. Turning ordinary buses into distributed sensing platforms.
          </p>
        </div>

        {/* Primary Action Button (MVP Primary Workflow) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('live-gis-map')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#171A20] hover:bg-[#222734] border border-[#2B3240] text-gray-200 text-xs font-mono transition-colors cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Open GIS Map</span>
          </button>

          <button
            onClick={() => onNavigate('live-ai-vision')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#F97316] hover:bg-[#EA580C] text-white font-medium text-xs lg:text-sm transition-all shadow-[0_0_16px_rgba(249,115,22,0.25)] cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Analyze Footage</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TOP METRICS (As required by Prompt: 6 High-Quality Operational Metrics clearly labeled DEMO DATA) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* ACTIVE INCIDENTS */}
        <div className="p-3.5 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-medium uppercase font-mono">ACTIVE INCIDENTS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#F97316]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">
              {activeIncidentsCount}
            </div>
            <div className="mt-1 text-[10px] text-amber-400 font-mono flex items-center justify-between">
              <span>Action Queue</span>
              <span>DEMO DATA</span>
            </div>
          </div>
        </div>

        {/* BUSES MONITORED */}
        <div className="p-3.5 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-medium uppercase font-mono">BUSES MONITORED</span>
            <BusIcon className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">
              247
            </div>
            <div className="mt-1 text-[10px] text-gray-400 font-mono flex items-center justify-between">
              <span>Active Fleets</span>
              <span className="text-amber-400">DEMO DATA</span>
            </div>
          </div>
        </div>

        {/* AI EVENTS TODAY */}
        <div className="p-3.5 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-medium uppercase font-mono">AI EVENTS TODAY</span>
            <Activity className="w-3.5 h-3.5 text-[#F97316]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">
              1,284
            </div>
            <div className="mt-1 text-[10px] text-gray-400 font-mono flex items-center justify-between">
              <span>+14.2% Peak</span>
              <span className="text-amber-400">DEMO DATA</span>
            </div>
          </div>
        </div>

        {/* EVIDENCE VERIFIED */}
        <div className="p-3.5 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-medium uppercase font-mono">EVIDENCE VERIFIED</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              96.8%
            </div>
            <div className="mt-1 text-[10px] text-gray-400 font-mono flex items-center justify-between">
              <span>S3 Lock Sealed</span>
              <span className="text-amber-400">DEMO DATA</span>
            </div>
          </div>
        </div>

        {/* CAMERAS ONLINE */}
        <div className="p-3.5 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-medium uppercase font-mono">CAMERAS ONLINE</span>
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white">
              1,184 <span className="text-xs text-gray-400 font-normal">/ 1,200</span>
            </div>
            <div className="mt-1 text-[10px] text-gray-400 font-mono flex items-center justify-between">
              <span>98.6% Operational</span>
              <span className="text-amber-400">DEMO DATA</span>
            </div>
          </div>
        </div>

        {/* AVG INFERENCE */}
        <div className="p-3.5 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-medium uppercase font-mono">AVG INFERENCE</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-cyan-400">
              14.2 <span className="text-xs text-gray-400 font-normal">ms</span>
            </div>
            <div className="mt-1 text-[10px] text-gray-400 font-mono flex items-center justify-between">
              <span>TensorRT Edge</span>
              <span className="text-amber-400">DEMO DATA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Central Interactive Fleet Network Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Live City GIS & Fleet Telematics Map (8 Cols) */}
        <div className="lg:col-span-8 bg-[#111318] border border-[#1E222A] rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#1E222A]">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-[#F97316] animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-white font-sans">
                    Live GIS Transit Grid & Mobile Edge Sensing
                  </h2>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    LIVE MAP
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <span>Whole City Center:</span>
                  <strong className="text-white font-mono">{cityName.split(',')[0]}</strong>
                  <span className="text-gray-500">•</span>
                  <span className="text-cyan-400 font-mono">
                    {currentCenter.lat.toFixed(4)}°, {currentCenter.lng.toFixed(4)}°
                  </span>
                  {geoStatus === 'locked' && (
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                      <Locate className="w-2.5 h-2.5" /> GPS Locked
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Map Action Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Engine Toggle */}
              <div className="flex items-center gap-1 bg-[#0A0C10] p-0.5 rounded border border-[#222834]">
                <button
                  onClick={() => setMapEngine('gmaps')}
                  className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                    mapEngine === 'gmaps'
                      ? 'bg-[#F97316] text-white font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Google Maps Platform"
                >
                  <Globe className="w-3 h-3" />
                  <span>Google Map</span>
                </button>
                <button
                  onClick={() => setMapEngine('tactical')}
                  className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                    mapEngine === 'tactical'
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Tactical Dark Vector Grid"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Vector Grid</span>
                </button>
              </div>

              {/* Whole City Zoom & Locate */}
              <button
                onClick={handleWholeCityView}
                className="px-2 py-1 rounded bg-[#F97316]/20 hover:bg-[#F97316]/30 text-[#F97316] border border-[#F97316]/40 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to Whole City View"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Whole City</span>
              </button>

              <button
                onClick={detectUserCity}
                className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Detect & Locate My City via GPS"
              >
                <Locate className="w-3 h-3" />
                <span>Locate</span>
              </button>

              {/* City selector */}
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="bg-[#171A20] text-gray-200 text-[10px] font-mono px-2 py-1 rounded border border-[#252B38] focus:outline-none focus:border-[#F97316] cursor-pointer max-w-[110px] truncate"
              >
                {userLocation && (
                  <option value="user_location">📍 {cityName.split(',')[0]}</option>
                )}
                {CITY_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>

              {/* Full View Navigation */}
              <button
                onClick={() => onNavigate('live-gis-map')}
                className="px-2 py-1 rounded bg-[#171A20] hover:bg-[#232A38] text-gray-300 hover:text-white border border-[#232730] text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Open Dedicated Fullscreen GIS View"
              >
                <ArrowUpRight className="w-3 h-3 text-[#F97316]" />
                <span className="hidden sm:inline">Full Map</span>
              </button>
            </div>
          </div>

          {/* Layer Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setShowBuses(!showBuses)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  showBuses ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold' : 'text-gray-400'
                }`}
              >
                <BusIcon className="w-2.5 h-2.5" />
                <span>Buses ({localizedBuses.length})</span>
              </button>

              <button
                onClick={() => setShowIncidents(!showIncidents)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  showIncidents ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold' : 'text-gray-400'
                }`}
              >
                <AlertTriangle className="w-2.5 h-2.5 text-[#F97316]" />
                <span>Incidents ({incidents.length})</span>
              </button>

              <button
                onClick={() => setShowDefects(!showDefects)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  showDefects ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-gray-400'
                }`}
              >
                <Construction className="w-2.5 h-2.5 text-amber-400" />
                <span>Defects ({localizedDefects.length})</span>
              </button>

              <button
                onClick={() => setShowTrafficHeatmap(!showTrafficHeatmap)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  showTrafficHeatmap ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' : 'text-gray-400'
                }`}
              >
                <TrafficCone className="w-2.5 h-2.5 text-purple-400" />
                <span>Congestion ({effectiveTrafficHotspots.length})</span>
              </button>

              <button
                onClick={() => setShowBusStops(!showBusStops)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  showBusStops ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-gray-400'
                }`}
              >
                <span>Transit Stops</span>
              </button>
            </div>

            {mapEngine === 'gmaps' && (
              <div className="flex items-center gap-1 text-[10px]">
                {['hybrid', 'roadmap', 'satellite'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMapType(type)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                      mapType === type
                        ? 'bg-[#232A38] text-white border border-gray-600 font-bold'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Viewport Box */}
          <div className="relative w-full rounded-lg border border-[#1A1E26] overflow-hidden bg-[#0A0C10]">
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
                trafficHotspots={effectiveTrafficHotspots}
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
                heightClass="h-[460px]"
                onWholeCityClick={handleWholeCityView}
                onLocateUserClick={handleLocateUser}
              />
            ) : (
              /* Tactical Vector Map Canvas */
              <div className="relative w-full h-[460px] bg-[#0A0C0F] flex items-center justify-center select-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#151821_1px,transparent_1px),linear-gradient(to_bottom,#151821_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 40,80 L 180,140 L 320,180 L 520,280 L 740,320" stroke="#252A36" strokeWidth="12" fill="none" strokeLinecap="round" />
                  <path d="M 40,80 L 180,140 L 320,180 L 520,280 L 740,320" stroke="#374151" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M 120,440 L 260,340 L 380,240 L 540,160 L 720,120" stroke="#F97316" strokeWidth="5" strokeDasharray="8 4" fill="none" opacity="0.85" />
                  <path d="M 520,40 L 540,160 L 580,300 L 640,460" stroke="#10B981" strokeWidth="4" fill="none" opacity="0.8" />
                  <path d="M 80,260 L 220,220 L 380,240 L 600,260" stroke="#06B6D4" strokeWidth="3" fill="none" opacity="0.75" />
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
          </div>

          {/* Quick Filter Categories Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E222A]">
            <button
              onClick={() => onNavigate('fleet-intelligence')}
              className="p-2 rounded bg-[#0A0C0F] hover:bg-[#151820] border border-[#1A1E26] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>FLEET HEALTH</span>
                <BusIcon className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-xs font-bold text-white mt-1">4 Active / 4 Online</div>
            </button>

            <button
              onClick={() => onNavigate('road-intelligence')}
              className="p-2 rounded bg-[#0A0C0F] hover:bg-[#151820] border border-[#1A1E26] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>ROAD DEFECTS</span>
                <Construction className="w-3 h-3 text-[#F97316]" />
              </div>
              <div className="text-xs font-bold text-white mt-1">6 Defects Flagged</div>
            </button>

            <button
              onClick={() => onNavigate('traffic-intelligence')}
              className="p-2 rounded bg-[#0A0C0F] hover:bg-[#151820] border border-[#1A1E26] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>HOTSPOTS</span>
                <TrafficCone className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-xs font-bold text-white mt-1">3 Congestion Zones</div>
            </button>

            <button
              onClick={() => onNavigate('public-safety-center')}
              className="p-2 rounded bg-[#0A0C0F] hover:bg-[#151820] border border-[#1A1E26] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>PUBLIC SAFETY</span>
                <Shield className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-white mt-1">1 Search Case Active</div>
            </button>
          </div>
        </div>

        {/* Right: Selected Bus Telemetry & Camera Health (4 Cols) */}
        <div className="lg:col-span-4 bg-[#111318] border border-[#1E222A] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white font-mono">
                    {activeBus.id}
                  </h3>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    activeBus.status === 'ALERT'
                      ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {activeBus.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{activeBus.name}</p>
                <p className="text-[10px] text-cyan-400 font-mono mt-0.5 truncate flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span>{activeBus.locationName}</span>
                </p>
              </div>

              <button
                onClick={() => onNavigate('fleet-intelligence')}
                className="text-[11px] font-mono text-[#F97316] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Details</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Vehicle Specs Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">CURRENT SPEED</span>
                <span className="text-white font-bold">{activeBus.speedKmH} km/h</span>
              </div>
              <div className="p-2 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">AI INFERENCE</span>
                <span className="text-emerald-400 font-bold">{activeBus.aiStatus}</span>
              </div>
              <div className="p-2 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">CAMERAS</span>
                <span className="text-white font-bold">{activeBus.camerasOnline} / 4 ONLINE</span>
              </div>
              <div className="p-2 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <span className="text-gray-400 text-[10px] block">NETWORK</span>
                <span className="text-cyan-400 font-bold">{activeBus.networkStatus}</span>
              </div>
            </div>

            {/* 4 Conceptual Cameras Status */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-gray-400 block font-semibold">
                Onboard Vision Stream Matrix (4 Feeds):
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {activeBus.cameras?.map((cam) => (
                  <div
                    key={cam.id}
                    className="p-2 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="text-gray-200 block truncate">{cam.name}</span>
                      <span className="text-[10px] text-gray-400">{cam.lastDetection}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold shrink-0">
                      {cam.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('live-ai-vision')}
            className="w-full py-2 px-3 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 hover:text-white text-xs font-mono border border-[#232730] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Open {activeBus.id} Live Vision</span>
          </button>
        </div>
      </div>

      {/* Incidents & AI Events Split Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Incidents List (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-sm font-semibold text-white font-sans">
                  Active Incidents Requiring Verification
                </h3>
              </div>
              <button
                onClick={() => onNavigate('incident-center')}
                className="text-xs text-[#F97316] hover:underline font-mono cursor-pointer"
              >
                View All ({incidents.length})
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {incidents.slice(0, 4).map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className="p-3 rounded-lg bg-[#0E1015] border border-[#1C2028] hover:border-[#F97316]/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        incident.severity === 'CRITICAL' ? 'bg-red-500' : incident.severity === 'HIGH' ? 'bg-[#F97316]' : 'bg-amber-400'
                      }`} />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#F97316] transition-colors">
                          {incident.eventType}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                          {incident.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs text-emerald-400 block font-bold">
                        {incident.confidence}% Conf
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {incident.relativeTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#181C24] flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 font-bold">{incident.busId}</span>
                      <span>•</span>
                      <span className="truncate max-w-[160px]">{incident.location}</span>
                    </div>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent AI Event Ingestion Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white font-sans">
                  Live AI Detection Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Ingest
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {aiEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-gray-500 text-[10px] shrink-0">{event.timestamp}</span>
                    <span className="text-[#F97316] font-bold shrink-0">{event.busId}</span>
                    <span className="text-gray-300 truncate">{event.event}</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-bold shrink-0 ml-2">
                    {event.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E222A] flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Edge Model: AEROVIS v1.4</span>
            <span className="text-cyan-400">2,480 FPS City-Wide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

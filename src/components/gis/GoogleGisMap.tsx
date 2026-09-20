import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { 
  Bus as BusIcon, 
  AlertTriangle, 
  Construction, 
  TrafficCone, 
  Navigation, 
  Eye, 
  Radio, 
  Crosshair,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { Bus, Incident, RoadDefect, TrafficHotspot } from '../../types';

interface GoogleGisMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  userLocation: { lat: number; lng: number } | null;
  cityName: string;
  buses: Bus[];
  incidents: Incident[];
  roadDefects: RoadDefect[];
  trafficHotspots: TrafficHotspot[];
  selectedBusId: string;
  onSelectBus: (bus: Bus) => void;
  onSelectIncident: (incident: Incident) => void;
  onSelectDefect?: (defect: RoadDefect) => void;
  showBuses: boolean;
  showIncidents: boolean;
  showDefects: boolean;
  showTrafficHeatmap: boolean;
  showBusStops: boolean;
  mapType: string;
  heightClass?: string;
  onWholeCityClick: () => void;
  onLocateUserClick: () => void;
}

// Controller component to smoothly pan/zoom Google Map instance
function MapCameraHandler({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center.lat, center.lng, zoom]);

  return null;
}

export const GoogleGisMap: React.FC<GoogleGisMapProps> = ({
  apiKey,
  center,
  zoom,
  userLocation,
  cityName,
  buses,
  incidents,
  roadDefects,
  trafficHotspots,
  selectedBusId,
  onSelectBus,
  onSelectIncident,
  showBuses,
  showIncidents,
  showDefects,
  showTrafficHeatmap,
  showBusStops,
  mapType,
  heightClass = 'h-[620px]',
  onWholeCityClick,
  onLocateUserClick
}) => {
  const [activeInfo, setActiveInfo] = useState<{
    type: 'user' | 'bus' | 'incident' | 'defect' | 'hotspot';
    position: { lat: number; lng: number };
    title: string;
    subtitle: string;
    details: string;
    severity?: string;
    raw?: any;
  } | null>(null);

  return (
    <div className={`relative w-full ${heightClass} rounded-b-lg overflow-hidden bg-[#0A0C10]`}>
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={center}
          defaultZoom={zoom}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Synchronize camera when user switches city or clicks Whole City */}
          <MapCameraHandler center={center} zoom={zoom} />

          {/* 1. USER LOCATION & WHOLE CITY RADAR BEACON */}
          {userLocation && (
            <AdvancedMarker
              position={userLocation}
              title={`Observer Location: ${cityName}`}
              onClick={() => {
                setActiveInfo({
                  type: 'user',
                  position: userLocation,
                  title: 'Local User Post',
                  subtitle: cityName,
                  details: `GPS Coordinates: ${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E. Entire city perimeter active with municipal bus telemetry.`,
                  severity: 'LOW'
                });
              }}
            >
              <div className="relative flex items-center justify-center cursor-pointer group">
                <div className="absolute -inset-3 rounded-full bg-cyan-500/25 animate-ping pointer-events-none" />
                <div className="w-8 h-8 rounded-full bg-cyan-950/90 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] backdrop-blur-md">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="absolute top-full mt-1 px-1.5 py-0.5 rounded bg-[#0A0C10]/90 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 whitespace-nowrap shadow-md pointer-events-none">
                  My Location
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* 2. MUNICIPAL BUS FLEET PINS */}
          {showBuses && buses.map((bus) => {
            const isSelected = bus.id === selectedBusId;
            const isAlert = bus.status === 'ALERT';

            return (
              <AdvancedMarker
                key={bus.id}
                position={{ lat: bus.lat, lng: bus.lng }}
                title={`${bus.id} • ${bus.route}`}
                onClick={() => {
                  onSelectBus(bus);
                  setActiveInfo({
                    type: 'bus',
                    position: { lat: bus.lat, lng: bus.lng },
                    title: `${bus.id} - ${bus.name}`,
                    subtitle: `${bus.route} • ${bus.locationName}`,
                    details: `Speed: ${bus.speedKmH} km/h • Heading: ${bus.heading} • Driver: ${bus.driverId} • Cameras: ${bus.camerasOnline}/${bus.cameraCount} Online`,
                    severity: bus.status,
                    raw: bus
                  });
                }}
              >
                <div
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-mono shadow-2xl backdrop-blur-md ${
                      isSelected
                        ? 'bg-[#181B22] border-[#F97316] text-white shadow-[0_0_18px_rgba(249,115,22,0.7)] ring-2 ring-[#F97316]/40'
                        : isAlert
                        ? 'bg-[#181214] border-red-500 text-red-300 shadow-[0_0_14px_rgba(239,68,68,0.5)]'
                        : 'bg-[#0E1118]/95 border-[#2A313E] text-gray-200'
                    }`}
                  >
                    <BusIcon
                      className={`w-3.5 h-3.5 ${
                        isAlert ? 'text-red-400 animate-pulse' : isSelected ? 'text-[#F97316]' : 'text-emerald-400'
                      }`}
                    />
                    <span className="font-bold text-[11px]">{bus.id}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {bus.speedKmH}k
                    </span>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* 3. ROAD DEFECTS (Potholes, Hazards) */}
          {showDefects && roadDefects.map((defect) => {
            const lat = defect.coordinates ? defect.coordinates[0] : center.lat;
            const lng = defect.coordinates ? defect.coordinates[1] : center.lng;

            return (
              <AdvancedMarker
                key={defect.id}
                position={{ lat, lng }}
                title={`${defect.defectType || defect.type} (${defect.severity})`}
                onClick={() => {
                  setActiveInfo({
                    type: 'defect',
                    position: { lat, lng },
                    title: `${defect.defectType || defect.type} [${defect.severity}]`,
                    subtitle: defect.location,
                    details: `Detected by ${defect.busId} • Confidence: ${defect.confidence}% • Action: ${defect.actionRequired}`,
                    severity: defect.severity,
                    raw: defect
                  });
                }}
              >
                <div className="relative cursor-pointer group">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                    defect.severity === 'CRITICAL'
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : defect.severity === 'HIGH'
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300'
                      : 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                  }`}>
                    <Construction className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* 4. ACTIVE PUBLIC SAFETY INCIDENTS */}
          {showIncidents && incidents.map((incident, idx) => {
            // Coordinate projection around city
            const lat = center.lat + (idx === 0 ? 0.012 : idx === 1 ? -0.028 : 0.045);
            const lng = center.lng + (idx === 0 ? 0.008 : idx === 1 ? 0.019 : -0.025);

            return (
              <AdvancedMarker
                key={incident.id}
                position={{ lat, lng }}
                title={`${incident.eventType} • ${incident.location}`}
                onClick={() => {
                  onSelectIncident(incident);
                  setActiveInfo({
                    type: 'incident',
                    position: { lat, lng },
                    title: `ALERT: ${incident.eventType}`,
                    subtitle: incident.location,
                    details: `Status: ${incident.status} • Bus: ${incident.busId} • Assigned: ${incident.assignedAuthority} • ${incident.description}`,
                    severity: incident.severity,
                    raw: incident
                  });
                }}
              >
                <div className="relative cursor-pointer group">
                  <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                  <div className="relative w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-125">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* 5. TRAFFIC CONGESTION HOTSPOTS */}
          {showTrafficHeatmap && trafficHotspots.map((hotspot, idx) => {
            const lat = center.lat + (idx === 0 ? 0.015 : idx === 1 ? -0.032 : 0.042);
            const lng = center.lng + (idx === 0 ? 0.025 : idx === 1 ? 0.038 : -0.018);

            return (
              <AdvancedMarker
                key={hotspot.id}
                position={{ lat, lng }}
                title={`Traffic Bottleneck: ${hotspot.location}`}
                onClick={() => {
                  setActiveInfo({
                    type: 'hotspot',
                    position: { lat, lng },
                    title: `Traffic Congestion: ${hotspot.location}`,
                    subtitle: `${hotspot.corridor || 'Key Corridor'} (${hotspot.density || 'HIGH'})`,
                    details: `Average Speed: ${hotspot.averageSpeedKmH} km/h • Estimated Delay: +${hotspot.estimatedDelayMin} min • Bottleneck Cause: ${hotspot.bottleneckCause}`,
                    severity: 'HIGH',
                    raw: hotspot
                  });
                }}
              >
                <div className="relative cursor-pointer group">
                  <div className="w-7 h-7 rounded-full bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-lg group-hover:scale-125 transition-transform">
                    <TrafficCone className="w-3.5 h-3.5 text-purple-300" />
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* 6. BUS STOPS / TRANSIT TERMINALS */}
          {showBusStops && [
            { name: `${cityName} Central Station`, lat: center.lat + 0.008, lng: center.lng + 0.005 },
            { name: `${cityName} Civic Hub`, lat: center.lat - 0.015, lng: center.lng + 0.018 },
            { name: 'Tech Park Expressway Gate', lat: center.lat + 0.032, lng: center.lng - 0.012 },
            { name: 'Metro Interchange Station', lat: center.lat - 0.029, lng: center.lng + 0.035 }
          ].map((stop, sIdx) => (
            <AdvancedMarker
              key={sIdx}
              position={{ lat: stop.lat, lng: stop.lng }}
              title={stop.name}
              onClick={() => {
                setActiveInfo({
                  type: 'user',
                  position: { lat: stop.lat, lng: stop.lng },
                  title: 'Transit Bus Stop',
                  subtitle: stop.name,
                  details: 'Equipped with High-Definition Surveillance & Public SOS Pillar',
                  severity: 'LOW'
                });
              }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[#111318] border-2 border-[#F97316] shadow-md hover:scale-150 transition-transform cursor-pointer" />
            </AdvancedMarker>
          ))}

          {/* 7. INTERACTIVE INFOWINDOW */}
          {activeInfo && (
            <InfoWindow
              position={activeInfo.position}
              onCloseClick={() => setActiveInfo(null)}
              headerDisabled={false}
            >
              <div className="p-2 max-w-xs text-gray-900 font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${
                    activeInfo.severity === 'CRITICAL' || activeInfo.type === 'incident'
                      ? 'bg-red-500'
                      : activeInfo.severity === 'ALERT'
                      ? 'bg-orange-500'
                      : 'bg-emerald-500'
                  }`} />
                  <h4 className="font-bold text-xs text-gray-900 font-mono leading-tight">
                    {activeInfo.title}
                  </h4>
                </div>
                <p className="text-[11px] font-semibold text-gray-700 mb-1">{activeInfo.subtitle}</p>
                <p className="text-[10px] text-gray-600 leading-relaxed">{activeInfo.details}</p>
                {activeInfo.type === 'bus' && (
                  <button
                    onClick={() => {
                      if (activeInfo.raw) onSelectBus(activeInfo.raw);
                      setActiveInfo(null);
                    }}
                    className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-[#F97316] text-white hover:bg-[#EA580C] w-full text-center transition-colors cursor-pointer"
                  >
                    Focus Bus in Side Panel
                  </button>
                )}
                {activeInfo.type === 'incident' && (
                  <button
                    onClick={() => {
                      if (activeInfo.raw) onSelectIncident(activeInfo.raw);
                      setActiveInfo(null);
                    }}
                    className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 w-full text-center transition-colors cursor-pointer"
                  >
                    View Forensic Incident Dossier
                  </button>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating View Shortcuts on Map Canvas */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={onWholeCityClick}
          className="px-3 py-1.5 rounded-md bg-[#111318]/90 backdrop-blur-md border border-[#F97316]/50 hover:border-[#F97316] text-white text-xs font-mono flex items-center gap-1.5 shadow-xl transition-colors cursor-pointer"
          title="Frame entire metropolitan city perimeter"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Whole City View (Zoom {zoom})</span>
        </button>

        <button
          onClick={onLocateUserClick}
          className="px-3 py-1.5 rounded-md bg-[#111318]/90 backdrop-blur-md border border-[#232730] hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-1.5 shadow-xl transition-colors cursor-pointer"
          title="Center on user's exact coordinates"
        >
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span>Focus User Post</span>
        </button>
      </div>
    </div>
  );
};

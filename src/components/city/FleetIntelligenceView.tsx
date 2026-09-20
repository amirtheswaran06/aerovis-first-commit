import React, { useState } from 'react';
import { 
  Bus as BusIcon, 
  Activity, 
  Video, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Fuel, 
  Gauge, 
  Camera, 
  CheckCircle2, 
  Filter, 
  Search, 
  ArrowUpRight,
  ChevronRight,
  Radio
} from 'lucide-react';
import { Bus, NavTab } from '../../types';

interface FleetIntelligenceViewProps {
  buses: Bus[];
  onNavigate: (tab: NavTab) => void;
  onSelectBus: (bus: Bus) => void;
}

export const FleetIntelligenceView: React.FC<FleetIntelligenceViewProps> = ({
  buses,
  onNavigate,
  onSelectBus
}) => {
  const [selectedBusId, setSelectedBusId] = useState<string>('BUS-104');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ALERT' | 'NORMAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBuses = buses.filter((bus) => {
    const matchesStatus = statusFilter === 'ALL' || bus.status === statusFilter;
    const matchesSearch = bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (bus.routeNumber || bus.route || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <BusIcon className="w-5 h-5 text-[#F97316]" />
              Fleet Intelligence & Sensor Mesh
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              247 FLEET NODES ACTIVE
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Real-time monitoring of onboard compute nodes, multi-camera telemetry health, driver dynamics, and mobile urban sensing.
          </p>
        </div>

        {/* Global Summary Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-[#171A20] border border-[#232730] text-xs font-mono">
            <span className="text-gray-400">Online Rate: </span>
            <span className="text-emerald-400 font-bold">98.6%</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-[#171A20] border border-[#232730] text-xs font-mono">
            <span className="text-gray-400">Edge Inference: </span>
            <span className="text-cyan-400 font-bold">14.2 ms</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Bus Roster + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bus List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#111318] border border-[#1E222A]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by bus ID, route, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded bg-[#0A0C0F] border border-[#232730] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['ALL', 'ALERT', 'NORMAL'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-[#F97316] text-white font-bold'
                      : 'bg-[#171A20] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-3">
            {filteredBuses.map((bus) => {
              const isSelected = bus.id === activeBus.id;
              return (
                <div
                  key={bus.id}
                  onClick={() => {
                    setSelectedBusId(bus.id);
                    onSelectBus(bus);
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181C24] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.2)]'
                      : 'bg-[#111318] border-[#1E222A] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        bus.status === 'ALERT'
                          ? 'bg-[#F97316]/20 text-[#F97316]'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        <BusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-white">{bus.id}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0C0F] text-cyan-400 border border-[#232730]">
                            Route #{bus.routeNumber}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            bus.status === 'ALERT'
                              ? 'bg-[#F97316]/20 text-[#F97316] font-bold'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {bus.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{bus.name} • Driver: {bus.driverName}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">{bus.speedKmH} km/h</div>
                      <div className="text-[10px] text-gray-400 font-mono">{bus.locationName.split(' ')[0]}</div>
                    </div>
                  </div>

                  {/* Telemetry Row */}
                  <div className="mt-3 pt-3 border-t border-[#1C2028] grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-1.5 rounded bg-[#0A0C0F]">
                      <span className="text-gray-400 text-[9px] block">CAMERAS</span>
                      <span className="text-emerald-400 font-bold">{bus.camerasOnline} / 4 OK</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#0A0C0F]">
                      <span className="text-gray-400 text-[9px] block">AI STATUS</span>
                      <span className="text-white font-bold">{bus.aiStatus}</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#0A0C0F]">
                      <span className="text-gray-400 text-[9px] block">NETWORK</span>
                      <span className="text-cyan-400 font-bold">{bus.networkStatus}</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#0A0C0F]">
                      <span className="text-gray-400 text-[9px] block">LAST EVENT</span>
                      <span className="text-amber-400 font-bold truncate block">{bus.lastEvent}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Vehicle Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">{activeBus.id}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30">
                  {activeBus.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{activeBus.name}</p>
            </div>

            <button
              onClick={() => onNavigate('live-gis-map')}
              className="text-xs font-mono text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Track on Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time Telemetry Gauges */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-gray-400 font-semibold">
              Vehicle Health & Dynamics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <div className="flex items-center justify-between text-gray-400 text-[10px]">
                  <span>SPEED</span>
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white mt-1">{activeBus.speedKmH} km/h</div>
                <div className="text-[9px] text-gray-400 mt-0.5">Limit: 50 km/h (Corridor)</div>
              </div>

              <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
                <div className="flex items-center justify-between text-gray-400 text-[10px]">
                  <span>EDGE TPU</span>
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1">42°C</div>
                <div className="text-[9px] text-gray-400 mt-0.5">Load: 38% • 30 FPS</div>
              </div>
            </div>
          </div>

          {/* 4-Camera Diagnostics Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-gray-400 font-semibold">
              Onboard Vision Camera Diagnostics
            </h3>
            <div className="space-y-2">
              {activeBus.cameras?.map((cam) => (
                <div
                  key={cam.id}
                  className="p-2.5 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-white block font-medium">{cam.name}</span>
                      <span className="text-[10px] text-gray-400">Last: {cam.lastDetection}</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-500/10">
                    {cam.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button to Launch Vision */}
          <div className="pt-2 border-t border-[#1E222A] space-y-2">
            <button
              onClick={() => onNavigate('live-ai-vision')}
              className="w-full py-2.5 px-3 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live AI Vision Stream ({activeBus.id})</span>
            </button>

            <button
              onClick={() => onNavigate('incident-center')}
              className="w-full py-2 px-3 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 hover:text-white text-xs font-mono border border-[#232730] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#F97316]" />
              <span>View Incident History for {activeBus.id}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

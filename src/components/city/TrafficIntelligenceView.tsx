import React, { useState } from 'react';
import { 
  TrafficCone, 
  Clock, 
  TrendingUp, 
  MapPin, 
  AlertCircle, 
  Activity, 
  Send, 
  CheckCircle2, 
  Bus as BusIcon, 
  Sliders,
  ShieldAlert,
  Gauge
} from 'lucide-react';
import { TrafficHotspot, NavTab } from '../../types';
import { TRAFFIC_HOTSPOTS } from '../../data/mockData';

interface TrafficIntelligenceViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const TrafficIntelligenceView: React.FC<TrafficIntelligenceViewProps> = ({
  onNavigate
}) => {
  const [hotspots] = useState<TrafficHotspot[]>(TRAFFIC_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<TrafficHotspot>(TRAFFIC_HOTSPOTS[0]);
  const [retimeStatus, setRetimeStatus] = useState<string | null>(null);

  const handleRecommendRetime = (hotspotId: string) => {
    setRetimeStatus(`Signal retiming advisory transmitted to Traffic Police Adaptive Signal Control System (ATCS) for ${selectedHotspot.location}. Green phase extended by +22s.`);
    setTimeout(() => setRetimeStatus(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <TrafficCone className="w-5 h-5 text-[#F97316]" />
              Traffic Intelligence & Transit Hotspots
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
              FLEET-DERIVED FLOW CONGESTION
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Correlating onboard camera queue length estimates with GPS travel times to detect bottlenecks, delay points, and bus lane encroachments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded bg-[#171A20] border border-[#232730] text-xs font-mono">
            <span className="text-gray-400">Avg City Bus Delay: </span>
            <span className="text-amber-400 font-bold">+11.4 min</span>
          </div>
          <button
            onClick={() => onNavigate('live-gis-map')}
            className="px-3 py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Heatmap on GIS Map</span>
          </button>
        </div>
      </div>

      {retimeStatus && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{retimeStatus}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hotspots List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono uppercase text-gray-400 font-semibold px-1">
            Active Traffic Congestion Hotspots ({hotspots.length})
          </div>

          {hotspots.map((hotspot) => {
            const isSelected = hotspot.id === selectedHotspot.id;
            return (
              <div
                key={hotspot.id}
                onClick={() => setSelectedHotspot(hotspot)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#181C24] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.2)]'
                    : 'bg-[#111318] border-[#1E222A] hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{hotspot.location}</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        hotspot.density === 'VERY_HIGH' ? 'bg-red-500/20 text-red-400' :
                        hotspot.density === 'HIGH' ? 'bg-[#F97316]/20 text-[#F97316]' :
                        'bg-amber-400/20 text-amber-400'
                      }`}>
                        {hotspot.density} ({hotspot.densityPct}%)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{hotspot.bottleneckCause}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-red-400">
                      +{hotspot.estimatedDelayMin} min
                    </span>
                    <span className="text-[10px] text-gray-400 block font-mono">Transit Delay</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>Avg Speed: <strong className="text-cyan-400">{hotspot.averageSpeedKmH} km/h</strong></span>
                    <span>•</span>
                    <span>Fleet Reports: {hotspot.busReportsCount} Buses</span>
                  </div>
                  <span className="text-purple-400">Bottleneck Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Hotspot Detail & Signal Retiming (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-white">{selectedHotspot.location}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">
                  {selectedHotspot.density}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Delay: +{selectedHotspot.estimatedDelayMin} minutes</p>
            </div>
            <span className="text-xs font-mono text-purple-400">{selectedHotspot.averageSpeedKmH} km/h</span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
              <span className="text-gray-400 text-[10px] block">PRIMARY CAUSE</span>
              <span className="text-white font-bold mt-1 block truncate">{selectedHotspot.bottleneckCause}</span>
            </div>
            <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
              <span className="text-gray-400 text-[10px] block">AFFECTED FLEET</span>
              <span className="text-cyan-400 font-bold mt-1 block">{selectedHotspot.busReportsCount} Buses in Corridor</span>
            </div>
          </div>

          {/* Vehicle Composition */}
          <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] space-y-2 text-xs font-mono">
            <span className="text-gray-400 text-[10px] block">TRAFFIC CORRIDOR COMPOSITION</span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>Cars: <span className="text-white font-bold">{selectedHotspot.vehicleComposition.carsPct}%</span></div>
              <div>2-Wheelers: <span className="text-white font-bold">{selectedHotspot.vehicleComposition.twoWheelersPct}%</span></div>
              <div>Buses: <span className="text-[#F97316] font-bold">{selectedHotspot.vehicleComposition.busesPct}%</span></div>
            </div>
          </div>

          {/* AI Signal Retiming Recommendation */}
          <div className="p-3.5 rounded-lg bg-[#14121A] border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>AI Adaptive Signal Control Advisory</span>
            </div>
            <p className="text-xs text-gray-300">
              Extend transit corridor green cycle by <strong className="text-white">+22 seconds</strong> between 17:00 - 19:30. Reduces bus delay by an estimated 38% across this corridor.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#1E222A] space-y-2">
            <button
              onClick={() => handleRecommendRetime(selectedHotspot.id)}
              className="w-full py-2.5 px-3 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Transmit Signal Retiming to ATCS</span>
            </button>

            <button
              onClick={() => onNavigate('live-gis-map')}
              className="w-full py-2 px-3 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 hover:text-white text-xs font-mono border border-[#232730] flex items-center justify-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Focus on GIS Congestion Layer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

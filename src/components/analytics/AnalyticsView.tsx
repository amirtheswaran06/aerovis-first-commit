import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  PieChart, 
  Bus as BusIcon, 
  Construction,
  Download
} from 'lucide-react';
import { NavTab } from '../../types';

interface AnalyticsViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#F97316]" />
              Citywide Intelligence Analytics
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
              HISTORICAL TELEMETRY (DEMO)
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Longitudinal trends across 247 buses: incident density by hour, detection confidence curves, road degradation velocity, and multi-agency response latencies.
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="px-3.5 py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Package</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A]">
          <span className="text-[11px] font-mono uppercase text-gray-400">TOTAL AI DETECTIONS (30D)</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">42,890</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">+18.4% vs prev period</div>
        </div>

        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A]">
          <span className="text-[11px] font-mono uppercase text-gray-400">MEAN TIME TO VERIFY</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">1.8 min</div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Human-in-the-loop</div>
        </div>

        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A]">
          <span className="text-[11px] font-mono uppercase text-gray-400">ROAD HAZARDS LOGGED</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">148</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">112 Dispatched to GCC</div>
        </div>

        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A]">
          <span className="text-[11px] font-mono uppercase text-gray-400">EVIDENCE INTEGRITY</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">100.0%</div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Zero cryptographic tampering</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detection Volume by Hour of Day (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <h3 className="text-sm font-semibold text-white">
              Incident Frequency by Time of Day (24h Distribution)
            </h3>
            <span className="text-xs font-mono text-gray-400">Peak: 08:30 & 18:15</span>
          </div>

          {/* Bar Chart Simulation */}
          <div className="h-56 flex items-end justify-between gap-1 pt-6 px-2">
            {[
              { time: '00', val: 8 },
              { time: '02', val: 4 },
              { time: '04', val: 6 },
              { time: '06', val: 28 },
              { time: '08', val: 86 },
              { time: '10', val: 64 },
              { time: '12', val: 52 },
              { time: '14', val: 48 },
              { time: '16', val: 72 },
              { time: '18', val: 94 },
              { time: '20', val: 58 },
              { time: '22', val: 24 }
            ].map((bar) => (
              <div key={bar.time} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div
                  style={{ height: `${bar.val}%` }}
                  className="w-full bg-[#1F2430] group-hover:bg-[#F97316] rounded-t transition-all relative"
                >
                  <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-[#0A0C0F] text-white px-1 rounded border border-[#232730]">
                    {bar.val}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-gray-500">{bar.time}h</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-gray-400 flex items-center justify-between pt-2 border-t border-[#1C2028]">
            <span>Correlated with peak passenger boarding density</span>
            <span className="text-[#F97316]">Morning & Evening Rush</span>
          </div>
        </div>

        {/* AI Event Categories Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <h3 className="text-sm font-semibold text-white">Event Classification Breakdown</h3>
            <span className="text-xs font-mono text-gray-400">Total: 1,284 Events</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Passenger Safety (Stumbles, Harsh Braking)', count: '412 (32%)', color: 'bg-[#F97316]' },
              { label: 'Road Surface Hazards (Potholes, Cracks)', count: '318 (25%)', color: 'bg-amber-400' },
              { label: 'Traffic Bottlenecks & Encroachment', count: '294 (23%)', color: 'bg-purple-500' },
              { label: 'Bus Stop Crowd & Boarding Anomaly', count: '154 (12%)', color: 'bg-cyan-400' },
              { label: 'Public Safety & Transit Inquiries', count: '106 (8%)', color: 'bg-emerald-400' }
            ].map((cat, cIdx) => (
              <div key={cIdx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300">{cat.label}</span>
                  <span className="text-white font-bold">{cat.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#171A20] overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.count.split('(')[1].replace(')', '') }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Construction, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  Send, 
  ExternalLink, 
  FileText, 
  Bus as BusIcon, 
  Sparkles,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { RoadDefect, NavTab } from '../../types';
import { ROAD_DEFECTS } from '../../data/mockData';

interface RoadIntelligenceViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const RoadIntelligenceView: React.FC<RoadIntelligenceViewProps> = ({
  onNavigate
}) => {
  const [defects, setDefects] = useState<RoadDefect[]>(ROAD_DEFECTS);
  const [selectedDefect, setSelectedDefect] = useState<RoadDefect>(ROAD_DEFECTS[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [workOrderNotice, setWorkOrderNotice] = useState<string | null>(null);

  const filtered = defects.filter((d) => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesSearch = (d.defectType || d.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.busId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDispatchRepair = (defectId: string) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === defectId ? { ...d, status: 'SCHEDULED_REPAIR' } : d))
    );
    if (selectedDefect.id === defectId) {
      setSelectedDefect((prev) => ({ ...prev, status: 'SCHEDULED_REPAIR' }));
    }
    setWorkOrderNotice(`Municipal Work Order #WO-2026-${Math.floor(1000 + Math.random() * 9000)} dispatched to Greater Chennai Corporation (GCC Works Dept).`);
    setTimeout(() => setWorkOrderNotice(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <Construction className="w-5 h-5 text-[#F97316]" />
              Road Intelligence & Defect Registry
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
              AI ROAD SURFACE INFERENCE
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Continuous road surface inspection powered by front-facing bus cameras. Automatically logging potholes, lane marking degradations, and waterlogging without dedicated sensor vehicles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('live-gis-map')}
            className="px-3 py-2 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-mono border border-[#232730] flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Map Hazards</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Works Report</span>
          </button>
        </div>
      </div>

      {workOrderNotice && (
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{workOrderNotice}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Defect List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#111318] border border-[#1E222A]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search defect type, road, or bus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded bg-[#0A0C0F] border border-[#232730] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div className="flex items-center gap-1">
              {['ALL', 'REPORTED', 'VERIFIED', 'SCHEDULED_REPAIR'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#F97316] text-white font-bold'
                      : 'bg-[#171A20] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'ALL' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((defect) => {
              const isSelected = defect.id === selectedDefect.id;
              return (
                <div
                  key={defect.id}
                  onClick={() => setSelectedDefect(defect)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181C24] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.2)]'
                      : 'bg-[#111318] border-[#1E222A] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                        defect.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                        defect.severity === 'HIGH' ? 'bg-[#F97316]/20 text-[#F97316]' :
                        'bg-amber-400/20 text-amber-400'
                      }`}>
                        <Construction className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{defect.defectType || defect.type}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0C0F] text-gray-400">
                            {defect.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{defect.location}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        defect.status === 'SCHEDULED_REPAIR'
                          ? 'bg-blue-500/20 text-blue-300'
                          : defect.status === 'RESOLVED' || defect.status === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {defect.status?.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] font-mono text-gray-500 mt-1">{defect.detectedTime || defect.timestamp}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 font-bold">{defect.busId}</span>
                      <span>•</span>
                      <span>Conf: {defect.confidence}%</span>
                    </div>
                    <span className="text-amber-400">Severity: {defect.severity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspection & Dispatch Action (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-white">{selectedDefect.id}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  selectedDefect.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-[#F97316]/20 text-[#F97316]'
                }`}>
                  {selectedDefect.severity}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">{selectedDefect.defectType || selectedDefect.type}</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">{selectedDefect.confidence}% AI Conf</span>
          </div>

          {/* AI Vision Snapshot Simulation */}
          <div className="relative h-44 rounded-lg bg-[#0A0C0F] border border-[#232730] overflow-hidden flex items-center justify-center">
            {/* Visual simulated road surface with bounding box */}
            <div className="absolute inset-0 bg-[radial-gradient(#1A1E26_1px,transparent_1px)] bg-[size:12px_12px] opacity-80" />
            <div className="relative z-10 p-3 w-48 h-28 border-2 border-[#F97316] bg-[#F97316]/10 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#F97316] font-bold">
                <span>{selectedDefect.defectType || selectedDefect.type}</span>
                <span>{selectedDefect.confidence}%</span>
              </div>
              <div className="text-center text-[10px] font-mono text-gray-400">
                Depth ~14cm • Area ~0.8m²
              </div>
              <div className="text-[9px] font-mono text-gray-500 flex justify-between">
                <span>{selectedDefect.busId}</span>
                <span>CAM-01</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#111318]/90 text-[10px] font-mono text-gray-400 border border-[#232730]">
              Captured: {selectedDefect.detectedTime || selectedDefect.timestamp}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26] flex justify-between">
              <span className="text-gray-400">EXACT LOCATION</span>
              <span className="text-white font-bold">{selectedDefect.location}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26] flex justify-between">
              <span className="text-gray-400">REPORTING BUS</span>
              <span className="text-cyan-400 font-bold">{selectedDefect.busId}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26] flex justify-between">
              <span className="text-gray-400">RESPONSIBLE AGENCY</span>
              <span className="text-gray-200">Greater Chennai Corp (GCC)</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-[#1E222A] space-y-2">
            <button
              onClick={() => handleDispatchRepair(selectedDefect.id)}
              disabled={selectedDefect.status === 'SCHEDULED_REPAIR'}
              className={`w-full py-2.5 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                selectedDefect.status === 'SCHEDULED_REPAIR'
                  ? 'bg-[#171A20] text-gray-500 cursor-not-allowed border border-[#232730]'
                  : 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-sm'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {selectedDefect.status === 'SCHEDULED_REPAIR'
                  ? 'Repair Work Order Already Dispatched'
                  : 'Dispatch Municipal Repair Order'}
              </span>
            </button>

            <button
              onClick={() => onNavigate('live-gis-map')}
              className="w-full py-2 px-3 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 hover:text-white text-xs font-mono border border-[#232730] flex items-center justify-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Locate on City GIS Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

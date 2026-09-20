import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Camera, 
  Lock, 
  ChevronRight, 
  Eye, 
  Download,
  Hash
} from 'lucide-react';
import { EvidenceRecord } from '../../types';

interface EvidenceLibraryViewProps {
  evidenceList: EvidenceRecord[];
  onSelectEvidence: (evidence: EvidenceRecord) => void;
  onVerifyEvidence: (evidenceId: string) => void;
}

export const EvidenceLibraryView: React.FC<EvidenceLibraryViewProps> = ({
  evidenceList,
  onSelectEvidence,
  onVerifyEvidence
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBusFilter, setSelectedBusFilter] = useState<string>('All');

  const busFilters = ['All', 'BUS-104', 'BUS-207', 'BUS-312'];

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceCamera.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedBusFilter !== 'All' && item.busId !== selectedBusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Evidence Library
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Searchable repository of cryptographically sealed AI safety evidence packages.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-gray-400 bg-[#0A0C0F] px-3 py-1.5 rounded border border-[#1C2028]">
          <span className="text-emerald-400 font-bold">{filteredEvidence.length}</span>
          <span>sealed packages</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#111318] border border-[#1E222A]">
          {busFilters.map((bus) => {
            const isActive = selectedBusFilter === bus;
            return (
              <button
                key={bus}
                onClick={() => setSelectedBusFilter(bus)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F97316] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#171A20]'
                }`}
              >
                {bus}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search evidence ID, camera, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111318] border border-[#1E222A] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316]/50 font-mono"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvidence.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectEvidence(item)}
            className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] hover:border-[#F97316]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            {/* Top Info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white group-hover:text-[#F97316] transition-colors">
                  {item.id}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              <h3 className="text-xs font-semibold text-gray-200 mt-2 line-clamp-1">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 mt-1">
                <span className="text-white font-bold">{item.busId}</span>
                <span>•</span>
                <span className="truncate">{item.sourceCamera.split('(')[0]}</span>
              </div>
            </div>

            {/* Visual Keyframe Thumbnail */}
            <div className="relative rounded-md overflow-hidden border border-[#232730] bg-[#0A0C0F] aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#1E2430_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

              <div className="text-center p-2 z-10">
                <span className="px-2 py-0.5 rounded bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] text-[10px] font-mono font-bold">
                  Frame #{item.frameNumber} Keyframe
                </span>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-gray-400 bg-black/70 px-1.5 py-0.2 rounded">
                {item.timestamp.split(' ')[1]} UTC
              </div>
              <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-emerald-400 bg-black/70 px-1.5 py-0.2 rounded">
                Conf {item.confidence}%
              </div>
            </div>

            {/* Cryptographic Hash & Actions */}
            <div className="space-y-2 pt-2 border-t border-[#1E222A]">
              <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
                <span>Input SHA-256:</span>
                <span className="text-[#F97316] truncate max-w-[140px]">
                  {item.inputHash}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerifyEvidence(item.id);
                  }}
                  className="w-full py-1.5 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-mono border border-[#262C38] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Verify Provenance</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

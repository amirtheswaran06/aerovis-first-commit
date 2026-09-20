import React, { useState } from 'react';
import { 
  UserSearch, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Search, 
  Clock, 
  MapPin, 
  Camera, 
  Bus as BusIcon, 
  Send, 
  FileText, 
  CheckCircle2, 
  Info,
  Radio
} from 'lucide-react';
import { MissingPersonCase, NavTab, UserRole } from '../../types';
import { MISSING_PERSON_CASES } from '../../data/mockData';

interface MissingPersonSearchViewProps {
  onNavigate: (tab: NavTab) => void;
  userRole?: UserRole;
}

export const MissingPersonSearchView: React.FC<MissingPersonSearchViewProps> = ({
  onNavigate,
  userRole = 'PUBLIC_SAFETY_OFFICER'
}) => {
  const [cases, setCases] = useState<MissingPersonCase[]>(MISSING_PERSON_CASES);
  const [selectedCase, setSelectedCase] = useState<MissingPersonCase>(MISSING_PERSON_CASES[0]);
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);

  // New Search Form state (Non-biometric parameters)
  const [clothingUpper, setClothingUpper] = useState<string>('Navy Blue Jacket');
  const [clothingLower, setClothingLower] = useState<string>('Khaki Trousers');
  const [accessory, setAccessory] = useState<string>('Red Backpack');
  const [timeWindow, setTimeWindow] = useState<string>('Last 6 Hours');

  const handleBroadcastAlert = () => {
    setBroadcastNotice(`AMBER Transit Alert dispatched to all 247 fleet onboard Driver Display Units (DDU) and Railway Protection Force (RPF) central desk.`);
    setTimeout(() => setBroadcastNotice(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Authorization & Privacy Shield */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-[#F97316]" />
              Authorized Missing Person Search
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              RESTRICTED LAW-ENFORCEMENT ACCESS
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Correlating reported clothing, bag accessories, and height band signatures across citywide bus boarding cameras without facial biometrics.
          </p>
        </div>

        {/* Privacy Mandate Shield */}
        <div className="p-2.5 rounded bg-[#0A0C0F] border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Biometric Privacy Guaranteed: No Facial Recognition Model Active</span>
        </div>
      </div>

      {broadcastNotice && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{broadcastNotice}</span>
        </div>
      )}

      {/* Main Layout: Search Criteria + Sighting Chronology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active AMBER Cases & Search Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Case Selector */}
          <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-gray-400 font-semibold">
                Active AMBER Transit Case
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                {selectedCase.status}
              </span>
            </div>

            <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{selectedCase.caseId}</span>
                <span className="text-gray-400">{selectedCase.reportedAt}</span>
              </div>
              <p className="text-xs text-gray-300">{selectedCase.personDescription}</p>
              <div className="pt-2 border-t border-[#161922] flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Auth Agency: {(selectedCase.assignedOfficer || 'Chennai Police Command').split('(')[0]}</span>
                <span className="text-emerald-400">{(selectedCase.sightings || []).length} Bus Sightings</span>
              </div>
            </div>
          </div>

          {/* Non-Biometric Visual Query Builder */}
          <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-gray-400 font-semibold">
                Non-Biometric Visual Query Filters
              </span>
              <span className="text-[10px] font-mono text-cyan-400">YOLOv8-Attr Model</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <label className="text-gray-400 text-[10px] block mb-1">UPPER CLOTHING SIGNATURE</label>
                <input
                  type="text"
                  value={clothingUpper}
                  onChange={(e) => setClothingUpper(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-[10px] block mb-1">LOWER CLOTHING SIGNATURE</label>
                <input
                  type="text"
                  value={clothingLower}
                  onChange={(e) => setClothingLower(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-[10px] block mb-1">CARRIED ACCESSORY / BACKPACK</label>
                <input
                  type="text"
                  value={accessory}
                  onChange={(e) => setAccessory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-[10px] block mb-1">DETECTION TIME WINDOW</label>
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
                >
                  <option>Last 2 Hours</option>
                  <option>Last 6 Hours</option>
                  <option>Last 24 Hours</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleBroadcastAlert}
              className="w-full mt-2 py-2.5 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Broadcast Fleet AMBER Alert</span>
            </button>
          </div>
        </div>

        {/* Right: Sighting Chronology Across Buses (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div>
              <h3 className="text-sm font-semibold text-white font-sans">
                Chronological Transit Sightings (Correlation Trail)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Multi-camera detections matching case #{selectedCase.caseId}
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-mono text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>

          <div className="space-y-3">
            {(selectedCase.sightings || []).map((sighting, sIdx) => (
              <div
                key={sighting.id}
                className="p-3.5 rounded-lg bg-[#0E1015] border border-[#1C2028] space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center text-xs font-mono text-[#F97316] font-bold">
                      {sIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{sighting.busId}</span>
                        <span className="text-[10px] font-mono text-gray-400">({sighting.camera})</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                          {sighting.confidence}% Match
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-0.5">{sighting.location}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-gray-400">
                    {sighting.timestamp}
                  </span>
                </div>

                <div className="p-2 rounded bg-[#0A0C0F] border border-[#161922] text-xs font-mono text-gray-300 flex items-center justify-between">
                  <span>Track Vector: {sighting.trackId}</span>
                  <button
                    onClick={() => onNavigate('cross-fleet-tracking')}
                    className="text-[#F97316] hover:underline flex items-center gap-1"
                  >
                    <span>Handover Path</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Footnote */}
          <div className="pt-3 border-t border-[#1E222A] text-[11px] font-mono text-gray-400 flex items-center justify-between">
            <span>Audit Ref: AWS-AUDIT-2026-MP992</span>
            <span className="text-emerald-400">Zero Biometric Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

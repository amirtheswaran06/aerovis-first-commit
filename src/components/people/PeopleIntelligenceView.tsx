import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Bus as BusIcon, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { TrackedPerson } from '../../types';
import { TRACKED_PEOPLE } from '../../data/mockData';

interface PeopleIntelligenceViewProps {
  onSelectPerson?: (person: TrackedPerson) => void;
}

export const PeopleIntelligenceView: React.FC<PeopleIntelligenceViewProps> = ({
  onSelectPerson
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('P-024');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('P-024');

  const filteredPeople = TRACKED_PEOPLE.filter(
    (p) =>
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.busId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePerson =
    TRACKED_PEOPLE.find((p) => p.id === selectedPersonId) || TRACKED_PEOPLE[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Person Intelligence
            </h1>
            <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
              Cross-camera / cross-bus intelligence — prototype
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Audit anonymous kinematic trajectories and passenger safety correlations across fleet corridors.
          </p>
        </div>

        {/* Privacy Mandate Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1015] border border-[#222834] text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Biometric Privacy Preserved: No Face Recognition</span>
        </div>
      </div>

      {/* Mandatory Privacy Disclaimer Notice */}
      <div className="p-3.5 rounded-lg bg-[#0E1015] border border-[#232730] flex items-start gap-3 text-xs text-gray-400">
        <Info className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-200">Public Privacy Compliance Notice:</strong> Face recognition and biometric identity matching are strictly disabled in AEROVIS. Tracking is calculated using anonymous kinematic bounding-box trajectory correlation, optical flow, and multi-camera temporal handoffs.
        </p>
      </div>

      {/* Main Grid: Search & List (5 Cols) + Journey Details (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search & Person List (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-4 space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1.5">
              Search Person or Tracking ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search e.g. P-024, P-031..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0C0F] border border-[#1E222A] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316] font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredPeople.map((person) => {
              const isSelected = person.id === activePerson.id;
              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonId(person.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1C2028] border-[#F97316] shadow-sm'
                      : 'bg-[#0E1015] border-[#1C2028] hover:border-[#282F3D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#F97316]">
                      {person.id}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {person.confidence}% Match
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-white mt-1">
                    {person.label}
                  </h4>

                  <div className="mt-2 text-[11px] font-mono text-gray-400 grid grid-cols-2 gap-1 pt-2 border-t border-[#181C24]">
                    <div>Bus: <span className="text-gray-200">{person.busId}</span></div>
                    <div>Dwell: <span className="text-gray-200">{Math.round(person.dwellTimeSeconds / 60)}m</span></div>
                    <div>First: <span className="text-gray-200">{person.firstDetected}</span></div>
                    <div>Last: <span className="text-gray-200">{person.lastDetected}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Journey Timeline & Cross-Bus Corridor Analysis (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#F97316]">{activePerson.id}</span>
                <span className="text-xs text-gray-400">Kinematic Re-ID Stream</span>
              </div>
              <p className="text-xs text-white font-medium mt-0.5">
                {activePerson.label}
              </p>
            </div>

            <div className="text-right text-xs font-mono">
              <span className="text-emerald-400 font-bold block">{activePerson.status}</span>
              <span className="text-[10px] text-gray-400">Confidence {activePerson.confidence}%</span>
            </div>
          </div>

          {/* Cross-Bus Journey Timeline as detailed in prompt */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono mb-4">
              Cross-Camera / Cross-Bus Trajectory
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#262C38]">
              {activePerson.trajectory.map((stop, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#111318] border-2 border-[#F97316]" />

                  <div className="p-3 rounded-lg bg-[#0E1015] border border-[#1C2028] space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {stop.point}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 px-1 py-0.2 rounded bg-[#171A20]">
                          {stop.type}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[#F97316]">
                        {stop.time}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {stop.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Correlation Metadata */}
          <div className="p-3.5 rounded bg-[#0A0C0F] border border-[#1A1E26] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-gray-400">
            <div>
              <span className="text-[10px] block">ASSOCIATION METHOD</span>
              <span className="text-gray-200">Kinematic Re-ID</span>
            </div>
            <div>
              <span className="text-[10px] block">COLOR HISTOGRAM CORR</span>
              <span className="text-emerald-400">0.962 (Cosine)</span>
            </div>
            <div>
              <span className="text-[10px] block">SPATIAL-TEMPORAL WINDOW</span>
              <span className="text-gray-200">±15s Transit Handoff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

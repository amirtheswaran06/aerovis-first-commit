import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Lightbulb, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Send, 
  Radio,
  Eye,
  Bus as BusIcon
} from 'lucide-react';
import { StopSafetyProfile, NavTab } from '../../types';
import { STOP_SAFETY_PROFILES } from '../../data/mockData';

interface WomensSafetyViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const WomensSafetyView: React.FC<WomensSafetyViewProps> = ({
  onNavigate
}) => {
  const [profiles, setProfiles] = useState<StopSafetyProfile[]>(STOP_SAFETY_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<StopSafetyProfile>(STOP_SAFETY_PROFILES[0]);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const handleDispatchPatrol = (stopName: string) => {
    setDispatchAlert(`Emergency Transit Police Mobile Patrol dispatched to ${stopName}. Estimated arrival 4.2 minutes.`);
    setTimeout(() => setDispatchAlert(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-pink-400" />
              Women's & Commuter Safety Network
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold">
              SAFE PASSAGE INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Proactive auditing of bus stop lighting levels, isolated late-night waiting environments, and crowd density anomalies using bus exterior camera vision.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded bg-[#171A20] border border-[#232730] text-xs font-mono">
            <span className="text-gray-400">Night Route Coverage: </span>
            <span className="text-emerald-400 font-bold">100% Monitored</span>
          </div>
        </div>
      </div>

      {dispatchAlert && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* Main Grid: Stop Safety Profiles + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stops List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono uppercase text-gray-400 font-semibold px-1">
            Corridor Stop Safety Profiles ({profiles.length})
          </div>

          {profiles.map((profile) => {
            const isSelected = profile.stopId === selectedProfile.stopId;
            return (
              <div
                key={profile.stopId}
                onClick={() => setSelectedProfile(profile)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#181C24] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.2)]'
                    : 'bg-[#111318] border-[#1E222A] hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{profile.stopName}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0C0F] text-gray-400">
                        {profile.stopId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-3 font-mono">
                      <span>Lighting: <strong className={profile.lightingLevel === 'ADEQUATE' ? 'text-emerald-400' : 'text-amber-400'}>{profile.lightingLevel}</strong></span>
                      <span>•</span>
                      <span>SOS Booth: {profile.sosEmergencyBooth ? 'Installed' : 'Missing'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-base font-bold font-mono ${
                      (profile.safetyIndex ?? 80) >= 85 ? 'text-emerald-400' : (profile.safetyIndex ?? 80) >= 70 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {profile.safetyIndex ?? 80}/100
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">Safety Index</div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>Last AI Audit: {profile.lastAudit}</span>
                  <span className="text-cyan-400">Night Ridership: {profile.nightRidershipIndex}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Stop Safety Inspector & Action Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-white">{selectedProfile.stopName}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  (selectedProfile.safetyIndex ?? 80) >= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'
                }`}>
                  Score: {selectedProfile.safetyIndex ?? 80}/100
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{selectedProfile.stopId}</p>
            </div>
          </div>

          {/* Safety Attributes Matrix */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">AMBIENT LIGHTING (LUX)</span>
                <span className={`font-bold mt-0.5 block ${selectedProfile.lightingLevel === 'ADEQUATE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedProfile.lightingLevel}
                </span>
              </div>
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>

            <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">SOS EMERGENCY BEACON</span>
                <span className={`font-bold mt-0.5 block ${selectedProfile.sosEmergencyBooth ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedProfile.sosEmergencyBooth ? 'OPERATIONAL (DIRECT RPF LINK)' : 'NOT INSTALLED - REQUEST DISPATCH'}
                </span>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">NIGHT COMMUTER VOLUME</span>
                <span className="text-cyan-400 font-bold mt-0.5 block">
                  {selectedProfile.nightRidershipIndex}
                </span>
              </div>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-[#1E222A] space-y-2">
            <button
              onClick={() => handleDispatchPatrol(selectedProfile.stopName)}
              className="w-full py-2.5 px-3 rounded bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Women's Safety Mobile Patrol</span>
            </button>

            <button
              onClick={() => onNavigate('live-gis-map')}
              className="w-full py-2 px-3 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 hover:text-white text-xs font-mono border border-[#232730] flex items-center justify-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Locate Stop on GIS Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

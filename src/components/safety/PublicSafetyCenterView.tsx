import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserSearch, 
  AlertTriangle, 
  GitMerge, 
  HeartHandshake, 
  Radio, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Clock, 
  Send, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Incident, MissingPersonCase, StopSafetyProfile, NavTab, UserRole } from '../../types';
import { MISSING_PERSON_CASES, STOP_SAFETY_PROFILES } from '../../data/mockData';

interface PublicSafetyCenterViewProps {
  incidents: Incident[];
  onNavigate: (tab: NavTab) => void;
  onSelectIncident: (incident: Incident) => void;
  userRole?: UserRole;
}

export const PublicSafetyCenterView: React.FC<PublicSafetyCenterViewProps> = ({
  incidents,
  onNavigate,
  onSelectIncident,
  userRole = 'PUBLIC_SAFETY_OFFICER'
}) => {
  const safetyIncidents = incidents.filter(i => i.category === 'safety' || i.category === 'passenger');
  const activeCases = MISSING_PERSON_CASES.filter(c => c.status === 'SEARCH_ACTIVE');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#F97316]" />
              Public Safety Operations Desk
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold">
              TRANSIT POLICE & DISPATCH
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Correlating passenger safety incidents, emergency dispatch vectors, authorized missing person search requests, and stop lighting safety indices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171A20] border border-[#232730] text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Biometric Shield Active</span>
          </div>
        </div>
      </div>

      {/* 4 Public Safety Sub-module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Missing Person Search */}
        <div 
          onClick={() => onNavigate('missing-person-search')}
          className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] hover:border-[#F97316] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-gray-300">Missing Person Search</span>
              <UserSearch className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {activeCases.length} Active Case
            </div>
            <p className="text-xs text-gray-400 mt-1">
              AMBER Transit Protocol. Non-biometric multi-bus sighting correlation.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-[#F97316]">
            <span>Authorized Access</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Cross-Fleet Tracking */}
        <div 
          onClick={() => onNavigate('cross-fleet-tracking')}
          className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-gray-300">Cross-Fleet Handover</span>
              <GitMerge className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              3 Correlated Stops
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Multi-camera kinematic track continuity across bus transfers.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>Inspect Trajectory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Women's & Commuter Safety */}
        <div 
          onClick={() => onNavigate('womens-safety')}
          className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] hover:border-pink-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-gray-300">Women's Safety</span>
              <HeartHandshake className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              94.2% Index
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Poorly lit stops, crowd density anomalies, SOS beacon integration.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-pink-400">
            <span>Safety Profiles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Incident Center */}
        <div 
          onClick={() => onNavigate('incident-center')}
          className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] hover:border-red-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-gray-300">Incident Center</span>
              <AlertTriangle className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {safetyIncidents.length} Safety Incidents
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Active verification queue, police notification, and dispatch response.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C2028] flex items-center justify-between text-xs font-mono text-red-400">
            <span>Manage Queue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Safety Incident Stream & Stop Lighting Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Safety Incidents (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F97316]" />
              <h3 className="text-sm font-semibold text-white">High Priority Public Safety Alerts</h3>
            </div>
            <button
              onClick={() => onNavigate('incident-center')}
              className="text-xs font-mono text-[#F97316] hover:underline cursor-pointer"
            >
              Full Registry
            </button>
          </div>

          <div className="space-y-2.5">
            {safetyIncidents.slice(0, 3).map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="p-3.5 rounded-lg bg-[#0E1015] border border-[#1C2028] hover:border-[#F97316]/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{incident.eventType}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{incident.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                    {incident.severity}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#181C24] flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>{incident.busId} • {incident.location}</span>
                  <span className="text-emerald-400">{incident.confidence}% Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bus Stop Safety Audits (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-semibold text-white">Transit Stop Safety Profiles</h3>
            </div>
            <button
              onClick={() => onNavigate('womens-safety')}
              className="text-xs font-mono text-pink-400 hover:underline cursor-pointer"
            >
              All Stops
            </button>
          </div>

          <div className="space-y-2.5">
            {STOP_SAFETY_PROFILES.slice(0, 3).map((stop) => (
              <div
                key={stop.stopId}
                className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="text-white font-bold">{stop.stopName}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Lighting: <span className={stop.lightingLevel === 'ADEQUATE' ? 'text-emerald-400' : 'text-amber-400'}>{stop.lightingLevel}</span> • SOS: {stop.sosEmergencyBooth ? 'Available' : 'None'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    (stop.safetyIndex ?? 80) >= 85 ? 'text-emerald-400' : (stop.safetyIndex ?? 80) >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {stop.safetyIndex ?? 80}/100
                  </div>
                  <div className="text-[9px] text-gray-500">Safety Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

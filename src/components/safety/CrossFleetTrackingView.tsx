import React, { useState } from 'react';
import { 
  GitMerge, 
  Bus as BusIcon, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Activity, 
  ArrowRight, 
  Lock, 
  FileText,
  Sparkles
} from 'lucide-react';
import { NavTab } from '../../types';

interface CrossFleetTrackingViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const CrossFleetTrackingView: React.FC<CrossFleetTrackingViewProps> = ({
  onNavigate
}) => {
  const [selectedTrajectory, setSelectedTrajectory] = useState<string>('TRK-CORR-094');

  const trajectorySteps = [
    {
      id: 'step-1',
      busId: 'BUS-104',
      route: 'Route 12 (Anna Salai)',
      camera: 'CAM-03 (Boarding Gate Sensor)',
      timestamp: '13:42:10 UTC',
      location: 'Anna Nagar West Terminal',
      event: 'Boarded vehicle via front door',
      trackId: 'P-024',
      embeddingDistance: '0.04 (98.2% match)',
      status: 'VERIFIED'
    },
    {
      id: 'step-2',
      busId: 'BUS-104',
      route: 'Route 12 (Anna Salai)',
      camera: 'CAM-04 (Forward Interior Cabin)',
      timestamp: '13:58:34 UTC',
      location: 'Central Metro Intermodal Hub',
      event: 'Stood up, prepared for egress',
      trackId: 'P-024',
      embeddingDistance: '0.02 (99.1% match)',
      status: 'VERIFIED'
    },
    {
      id: 'step-3',
      busId: 'BUS-104',
      route: 'Route 12 (Anna Salai)',
      camera: 'CAM-02 (Rear Exit Camera)',
      timestamp: '14:02:18 UTC',
      location: 'Central Station Main Bay 3',
      event: 'Egressed vehicle onto pedestrian concourse',
      trackId: 'P-024',
      embeddingDistance: '0.05 (97.4% match)',
      status: 'VERIFIED'
    },
    {
      id: 'step-4',
      busId: 'BUS-312',
      route: 'Route 23C (Poonamallee Exp)',
      camera: 'CAM-03 (Boarding Gate Sensor)',
      timestamp: '14:11:05 UTC',
      location: 'Central Station Transit Concourse Bay 7',
      event: 'Handover: Boarded connecting fleet vehicle BUS-312',
      trackId: 'P-031 (Correlated to P-024)',
      embeddingDistance: '0.08 (94.6% match)',
      status: 'CROSS-FLEET CORRELATED'
    },
    {
      id: 'step-5',
      busId: 'BUS-312',
      route: 'Route 23C (Poonamallee Exp)',
      camera: 'CAM-04 (Forward Interior Cabin)',
      timestamp: '14:26:40 UTC',
      location: 'Poonamallee High Rd / Kilpauk',
      event: 'Seated in mid-cabin passenger bay',
      trackId: 'P-031',
      embeddingDistance: '0.06 (96.2% match)',
      status: 'ACTIVE EN-ROUTE'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-[#F97316]" />
              Cross-Fleet Tracking & Trajectory Handover
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
              RE-IDENTIFICATION EMBEDDING MESH
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Reconstructing continuous passenger journey trails across multiple transit vehicles without facial recognition. Powered by visual attribute embeddings and spatiotemporal reachability graphs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171A20] border border-[#232730]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP-Compliant ReID</span>
          </span>
        </div>
      </div>

      {/* Trajectory Timeline Visualization */}
      <div className="bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E222A]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono">{selectedTrajectory}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] font-bold">
                BUS-104 → BUS-312 HANDOVER
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Subject kinematic continuity established across Central Intermodal Hub.
            </p>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 rounded bg-[#171A20] hover:bg-[#222834] border border-[#2B3240] text-gray-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Generate Handover Dossier</span>
          </button>
        </div>

        {/* Steps Journey Pipeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#F97316] before:via-cyan-500 before:to-emerald-500">
          {trajectorySteps.map((step, idx) => (
            <div key={step.id} className="relative group">
              {/* Timeline Pin */}
              <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold bg-[#111318] ${
                step.status.includes('HANDOVER') || step.status.includes('CROSS-FLEET')
                  ? 'border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                  : 'border-[#F97316] text-[#F97316]'
              }`}>
                {idx + 1}
              </div>

              {/* Step Card */}
              <div className="p-4 rounded-lg bg-[#0E1015] border border-[#1C2028] hover:border-[#F97316]/50 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white text-sm">{step.busId}</span>
                    <span className="text-gray-400">({step.route})</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded font-bold ${
                      step.status.includes('CORRELATED') ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">{step.timestamp}</span>
                </div>

                <p className="text-xs text-gray-200 font-medium">{step.event}</p>

                <div className="pt-2 border-t border-[#181C24] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate">{step.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate">{step.camera}</span>
                  </div>
                  <div className="text-right sm:text-right text-emerald-400 font-bold">
                    ReID Cosine: {step.embeddingDistance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

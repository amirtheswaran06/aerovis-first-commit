import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Cpu, 
  Hash, 
  ExternalLink,
  Download,
  Share2,
  FileCheck2,
  CheckCircle2,
  Camera
} from 'lucide-react';
import { Incident, EvidenceRecord, NavTab } from '../../types';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onVerifyEvidence: (evidenceId: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onVerifyEvidence
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#111318] border border-[#262C38] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E222A] flex items-center justify-between sticky top-0 bg-[#111318] z-10">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${
              incident.severity === 'CRITICAL' ? 'bg-red-500' : incident.severity === 'HIGH' ? 'bg-[#F97316]' : 'bg-amber-400'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400 font-bold">{incident.id}</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {incident.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-sans mt-0.5">
                {incident.eventType}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#1A1E26] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
              <span className="text-gray-400 text-[10px] block">BUS ID</span>
              <span className="text-white font-bold">{incident.busId}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
              <span className="text-gray-400 text-[10px] block">CAMERA</span>
              <span className="text-white truncate block">{incident.camera.split('(')[0]}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
              <span className="text-gray-400 text-[10px] block">CONFIDENCE</span>
              <span className="text-emerald-400 font-bold">{incident.confidence}%</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26]">
              <span className="text-gray-400 text-[10px] block">MODEL</span>
              <span className="text-gray-300 truncate block">Vision v1.4</span>
            </div>
          </div>

          {/* Description & Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Location: {incident.location}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{incident.timestamp}</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed p-3 rounded bg-[#0E1015] border border-[#1C2028]">
              {incident.description}
            </p>
          </div>

          {/* Captured Evidence Frame */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Captured Evidence Frame
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> NTP Synchronized
              </span>
            </div>

            {/* Simulated Evidence Frame with HUD */}
            <div className="relative rounded-lg overflow-hidden border border-[#232730] bg-[#07080A] aspect-video flex items-center justify-center">
              {/* Perspective background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#161922_1px,transparent_1px),linear-gradient(to_bottom,#161922_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

              {/* Watermarked Snapshot Details */}
              <div className="relative text-center p-6 space-y-3">
                <div className="inline-block px-3 py-1 rounded bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] text-xs font-mono font-bold">
                  {incident.boundingBoxes?.[0]?.label || 'AI Vision Keyframe Bounding Polygon'}
                </div>
                <p className="text-xs text-gray-400 font-mono max-w-md">
                  Frame #4,289 isolated from continuous reel. Motion vector jerk -4.2 m/s² correlated with passenger equilibrium delta.
                </p>
              </div>

              {/* Top Camera Watermark */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-400 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                {incident.busId} • {incident.camera}
              </div>

              {/* Bottom Hash Watermark */}
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/20">
                HASH: {incident.inputHash.slice(0, 16)}...
              </div>
            </div>

            {/* Technical Verification Manifest Box */}
            <div className="p-3.5 rounded-lg bg-[#0A0C0F] border border-[#1A1E26] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-gray-400 text-[10px] block">EVIDENCE ID</span>
                <span className="text-white font-bold">{incident.evidenceId}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">SOURCE CAMERA</span>
                <span className="text-gray-300">{incident.camera.split('(')[0]}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">TIMESTAMP (UTC)</span>
                <span className="text-gray-300">{incident.timestamp}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">INPUT SHA-256 HASH</span>
                <span className="text-[#F97316] truncate block">{incident.inputHash}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#1E222A] bg-[#0E1015] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="text-[11px] font-mono text-gray-400">
            Status: <span className="text-emerald-400 font-bold">VERIFIED PROVENANCE</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 py-2 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 text-xs font-mono border border-[#232730] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onVerifyEvidence(incident.evidenceId);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

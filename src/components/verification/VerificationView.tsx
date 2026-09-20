import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Hash, 
  Camera, 
  FileText, 
  Lock, 
  ChevronRight, 
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Download
} from 'lucide-react';
import { EvidenceRecord, ProvenanceNode } from '../../types';
import { DEMO_PROVENANCE_NODES } from '../../data/mockData';

interface VerificationViewProps {
  evidenceList: EvidenceRecord[];
  activeEvidenceId?: string;
  onSelectEvidence: (evidence: EvidenceRecord) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  evidenceList,
  activeEvidenceId,
  onSelectEvidence
}) => {
  const currentEvidence = 
    evidenceList.find((ev) => ev.id === activeEvidenceId) || evidenceList[0];

  const nodes: ProvenanceNode[] = currentEvidence?.provenanceChain || DEMO_PROVENANCE_NODES;
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || 'prov-1');

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Evidence Verification
            </h1>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED
            </span>
          </div>
          <p className="text-xs lg:text-sm text-gray-400 max-w-2xl">
            Verify that an AI-generated event can be traced back to its source, model and processing record.
          </p>
        </div>

        {/* Prototype Verification Disclaimer Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1015] border border-[#1E222A] text-xs font-mono text-amber-400">
          <Info className="w-3.5 h-3.5" />
          <span>Cryptographic Verification — Prototype Demonstration</span>
        </div>
      </div>

      {/* Selected Evidence Context Banner */}
      <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#171A20] text-emerald-400 border border-[#232730]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Inspecting Evidence ID:</span>
              <span className="text-white font-bold">{currentEvidence.id}</span>
              <span className="text-emerald-400 font-medium">({currentEvidence.busId})</span>
            </div>
            <p className="text-gray-400 text-[11px] mt-0.5">
              Incident {currentEvidence.incidentId} • Keyframe #{currentEvidence.frameNumber} • SHA-256 Validated
            </p>
          </div>
        </div>

        {/* Evidence selector dropdown if multiple */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={currentEvidence.id}
            onChange={(e) => {
              const found = evidenceList.find((ev) => ev.id === e.target.value);
              if (found) onSelectEvidence(found);
            }}
            className="bg-[#0A0C0F] border border-[#232730] text-gray-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#F97316] font-mono w-full sm:w-auto"
          >
            {evidenceList.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} - {ev.busId} ({ev.timestamp.split(' ')[1]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Provenance Chain Horizontal Stepper */}
      <div className="bg-[#111318] border border-[#1E222A] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
            Cryptographic Provenance Chain (7 Nodes)
          </h3>
          <span className="text-[11px] font-mono text-gray-400">
            Click any node to inspect audit ledger
          </span>
        </div>

        {/* Nodes Grid / Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {nodes.map((node, index) => {
            const isSelected = node.id === activeNode.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3 rounded-lg text-left transition-all border relative cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C2028] border-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                    : 'bg-[#0A0C0F] border-[#1A1E26] hover:border-[#282F3D]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-[#F97316] text-white' : 'bg-[#171A20] text-gray-400'
                  }`}>
                    {node.stepNumber}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <h4 className="text-xs font-semibold text-white truncate">
                  {node.label}
                </h4>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  {node.subtitle}
                </p>

                <div className="mt-2 text-[9px] font-mono text-gray-400 truncate">
                  {node.timestamp.split(' ')[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep Node Inspection & Verification Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Technical Inspection (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#F97316] px-1.5 py-0.5 rounded bg-[#F97316]/10 border border-[#F97316]/20">
                Node #{activeNode.stepNumber}
              </span>
              <h3 className="text-sm font-semibold text-white font-sans">
                {activeNode.label}
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Provenance Intact
            </span>
          </div>

          <p className="text-xs text-gray-300">
            {activeNode.subtitle}
          </p>

          {/* Verified Items Checklist for this node */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">
              Node Audit Verifications:
            </span>
            <div className="space-y-1.5">
              {activeNode.verifiedDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#0A0C0F] border border-[#1A1E26] flex items-center gap-2 text-xs font-mono text-gray-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Data Map */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">
              Technical Metadata Manifest:
            </span>
            <div className="p-3 rounded bg-[#08090B] border border-[#1A1E26] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {Object.entries(activeNode.technicalData).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-400 text-[10px] block">{key}</span>
                  <span className="text-gray-200 break-all">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Verification Checklist & Seals (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
              <h3 className="text-sm font-semibold text-white font-sans">
                Verification Ledger
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                5 of 5 Passed
              </span>
            </div>

            {/* Checklist Items as requested in prompt */}
            <div className="mt-4 space-y-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between">
                <span className="text-gray-300">✓ Source recorded</span>
                <span className="text-emerald-400 font-bold">CAM-04 Verified</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between">
                <span className="text-gray-300">✓ Timestamp verified</span>
                <span className="text-emerald-400 font-bold">NTP Atomic Sync</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between">
                <span className="text-gray-300">✓ Model version recorded</span>
                <span className="text-emerald-400 font-bold">Vision v1.4-edge</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between">
                <span className="text-gray-300">✓ Inference recorded</span>
                <span className="text-emerald-400 font-bold">TensorRT INT8 (19ms)</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1015] border border-[#1C2028] flex items-center justify-between">
                <span className="text-gray-300">✓ Evidence hash generated</span>
                <span className="text-emerald-400 font-bold">SHA-256 Match</span>
              </div>
            </div>
          </div>

          {/* Overall Verified Seal Banner */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-sm font-mono">
              <ShieldCheck className="w-5 h-5" />
              <span>STATUS: VERIFIED</span>
            </div>
            <p className="text-[11px] text-gray-300">
              Evidence package integrity confirmed against S3 Object Lock & AWS KMS master keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

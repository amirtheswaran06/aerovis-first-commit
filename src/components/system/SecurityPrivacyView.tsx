import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  EyeOff, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  UserCheck, 
  Server,
  Download
} from 'lucide-react';
import { NavTab } from '../../types';

interface SecurityPrivacyViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const SecurityPrivacyView: React.FC<SecurityPrivacyViewProps> = ({ onNavigate }) => {
  const [downloadLogNotice, setDownloadLogNotice] = useState<string | null>(null);

  const auditLogs = [
    {
      id: 'LOG-8801',
      timestamp: '2026-09-20 14:02:45 UTC',
      actor: 'Officer R. Sundaram (RPF Desk #4)',
      role: 'PUBLIC_SAFETY_OFFICER',
      action: 'Authorized Person Search query executed (Case #AMBER-2026-042)',
      complianceStatus: 'VERIFIED COMPLIANT'
    },
    {
      id: 'LOG-8798',
      timestamp: '2026-09-20 13:58:12 UTC',
      actor: 'CMTC Fleet Dispatch #402',
      role: 'TRANSPORT_AUTHORITY',
      action: 'Verified evidence package EVT-40291 generated and KMS sealed',
      complianceStatus: 'VERIFIED COMPLIANT'
    },
    {
      id: 'LOG-8792',
      timestamp: '2026-09-20 13:45:00 UTC',
      actor: 'GCC Urban Planning Analyst #12',
      role: 'ANALYST',
      action: 'Exported anonymized Road Defect Summary (Zero PII included)',
      complianceStatus: 'VERIFIED COMPLIANT'
    },
    {
      id: 'LOG-8785',
      timestamp: '2026-09-20 13:30:19 UTC',
      actor: 'System Admin (Automated Job)',
      role: 'SYSTEM_ADMIN',
      action: 'KMS Key Rotation & S3 Object Lock retention policy validated',
      complianceStatus: 'VERIFIED COMPLIANT'
    }
  ];

  const handleDownloadLogs = () => {
    setDownloadLogNotice('Immutable compliance audit log archive downloaded (SHA-256 sealed).');
    setTimeout(() => setDownloadLogNotice(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#F97316]" />
              Security, Privacy & Compliance Governance
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              DPDP ACT 2023 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            AEROVIS operates under a strict privacy-first architecture: zero facial recognition databases, edge face blurring, cryptographic evidence sealing, and auditable access logging.
          </p>
        </div>

        <button
          onClick={handleDownloadLogs}
          className="px-3.5 py-2 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-mono border border-[#232730] flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Export Compliance Audit Log</span>
        </button>
      </div>

      {downloadLogNotice && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadLogNotice}</span>
        </div>
      )}

      {/* 3 Privacy Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] space-y-2">
          <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Edge Privacy & Zero Biometrics</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Faces and personal license plates are blurred on edge Jetson devices before cloud transmission. No facial embedding database is ever maintained.
          </p>
          <div className="text-[10px] font-mono text-emerald-400 pt-1">DPDP 2023 §9 Mandate Passed</div>
        </div>

        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] space-y-2">
          <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Cryptographic Provenance</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Every video frame, incident detection, and work order carries an immutable SHA-256 hash anchored in AWS KMS and S3 Object Lock (WORM).
          </p>
          <div className="text-[10px] font-mono text-blue-400 pt-1">Court-Admissible Evidence Standard</div>
        </div>

        <div className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] space-y-2">
          <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Strict Role-Based Access Control</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Law enforcement search tools require sworn officer credentials. All queries, exports, and inspections are recorded in an append-only audit trail.
          </p>
          <div className="text-[10px] font-mono text-purple-400 pt-1">ISO 27001 Access Control Certified</div>
        </div>
      </div>

      {/* Immutable Access Audit Trail */}
      <div className="bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
          <h3 className="text-sm font-semibold text-white">Recent Authorized Operational Logs</h3>
          <span className="text-xs font-mono text-emerald-400">Tamper-Evident Ledger</span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-[#0E1015] border border-[#1C2028] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#F97316] font-bold">{log.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-white">{log.actor}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#171A20] text-gray-400 border border-[#232730]">
                    {log.role}
                  </span>
                </div>
                <p className="text-gray-300 text-xs font-sans">{log.action}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-emerald-400 block font-bold">
                  {log.complianceStatus}
                </span>
                <span className="text-[10px] text-gray-500 block">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

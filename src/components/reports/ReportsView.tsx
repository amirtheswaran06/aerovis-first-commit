import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  Sparkles, 
  Send,
  Building,
  Lock
} from 'lucide-react';
import { IntelligenceReportRequest, NavTab } from '../../types';
import { INITIAL_REPORT_REQUESTS } from '../../data/mockData';

interface ReportsViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<IntelligenceReportRequest[]>(INITIAL_REPORT_REQUESTS);
  const [selectedReport, setSelectedReport] = useState<IntelligenceReportRequest>(INITIAL_REPORT_REQUESTS[0]);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Generator form
  const [reportTitle, setReportTitle] = useState<string>('Daily Transit Safety & Incident Audit');
  const [reportType, setReportType] = useState<string>('EXECUTIVE_SUMMARY');
  const [targetAgency, setTargetAgency] = useState<string>('Metropolitan Transport Corporation (MTC)');

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: IntelligenceReportRequest = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: reportTitle,
      type: reportType as any,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      targetAgency: targetAgency,
      status: 'READY_FOR_DOWNLOAD',
      format: 'PDF',
      fileSizeBytes: '1.8 MB',
      checksumSha256: `sha256:${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`
    };

    setReports([newRep, ...reports]);
    setSelectedReport(newRep);
    setDownloadNotice(`Generated report "${newRep.title}" ready for export.`);
    setTimeout(() => setDownloadNotice(null), 5000);
  };

  const handleDownload = (report: IntelligenceReportRequest) => {
    setDownloadNotice(`Downloading ${report.title} (${report.format} • ${report.fileSizeBytes}) with cryptographic audit seal.`);
    setTimeout(() => setDownloadNotice(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F97316]" />
              Intelligence Dossiers & Authority Reports
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              AUDIT-SEALED EXPORTS
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Automated generation of formal municipal road hazard packages, law enforcement incident packages, and transport executive briefings with SHA-256 provenance anchors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded bg-[#171A20] border border-[#232730]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KMS Evidence Signed</span>
          </span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Grid: Generator & Reports Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Instant Generator (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <h3 className="text-sm font-semibold text-white">Generate Intelligence Dossier</h3>
            <span className="text-[10px] font-mono text-cyan-400">PDF / JSON / Audit Zip</span>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-gray-400 text-[10px] block mb-1">REPORT TITLE</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1">DOSSIER CATEGORY</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
              >
                <option value="EXECUTIVE_SUMMARY">Executive Transit Summary</option>
                <option value="ROAD_DEFECTS_DISPATCH">Road Surface & Pothole Work Order</option>
                <option value="SAFETY_INCIDENT_AUDIT">Forensic Incident & Provenance Package</option>
                <option value="MISSING_PERSON_CHRONOLOGY">Missing Person Transit Sightings Chronology</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1">TARGET RECIPIENT AGENCY</label>
              <input
                type="text"
                value={targetAgency}
                onChange={(e) => setTargetAgency(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0A0C0F] border border-[#232730] text-gray-200 focus:outline-none focus:border-[#F97316]"
                required
              />
            </div>

            <div className="p-3 rounded bg-[#0A0C0F] border border-[#181C24] space-y-1 text-[11px] text-gray-400">
              <div className="flex justify-between">
                <span>Cryptographic Hash:</span>
                <span className="text-emerald-400">SHA-256 Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>KMS Signing Key:</span>
                <span className="text-gray-300">AWS KMS ap-south-1</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium font-sans flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Compile & Sign Report</span>
            </button>
          </form>
        </div>

        {/* Right: Generated Reports Library (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
            <h3 className="text-sm font-semibold text-white">Signed Reports Archive ({reports.length})</h3>
            <span className="text-xs font-mono text-gray-400">Tamper-evident</span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg bg-[#0E1015] border border-[#1C2028] hover:border-[#F97316]/50 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center text-[#F97316] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{report.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Agency: {report.targetAgency}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                    {(report.status || 'VERIFIED').replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-2 rounded bg-[#0A0C0F] border border-[#161922] text-[11px] font-mono text-gray-400 flex flex-wrap items-center justify-between gap-1">
                  <span>{report.id} • {report.format} ({report.fileSizeBytes})</span>
                  <span className="text-gray-500 truncate max-w-[200px]">{report.checksumSha256}</span>
                </div>

                <div className="pt-2 border-t border-[#181C24] flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">{report.generatedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(report)}
                      className="px-3 py-1 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 hover:text-white border border-[#232730] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onNavigate('verification')}
                      className="text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Verify Seal</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

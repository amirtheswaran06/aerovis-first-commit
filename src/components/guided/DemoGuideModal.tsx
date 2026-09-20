import React from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Video, 
  Layers, 
  AlertTriangle, 
  FileCheck2, 
  ShieldCheck, 
  LayoutDashboard
} from 'lucide-react';
import { NavTab } from '../../types';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Command Center',
      desc: 'View "Transportation Intelligence", KPI metrics, and the schematic fleet network (BUS-104, BUS-207, BUS-312).',
      actionTab: 'command-center' as NavTab,
      btnText: 'Go to Command Center'
    },
    {
      step: 2,
      title: 'Analyze Footage',
      desc: 'Click "Analyze Footage" on the dashboard hero to open the primary video intelligence pipeline.',
      actionTab: 'video-analysis' as NavTab,
      btnText: 'Open Video Analysis'
    },
    {
      step: 3,
      title: 'Load Bus Footage',
      desc: 'Select "Try Demo Footage" or drag and drop any recorded bus video file (MP4/WebM).',
      actionTab: 'video-analysis' as NavTab,
      btnText: 'Launch Footage Ingestion'
    },
    {
      step: 4,
      title: 'Real-Time AI Processing',
      desc: 'Observe the 6-stage pipeline: Video Received → Frame Extraction → Object Detection → Tracking → Event Analysis → Evidence Generation.',
      actionTab: 'video-analysis' as NavTab,
      btnText: 'Inspect Pipeline'
    },
    {
      step: 5,
      title: 'Detection & Tracked Identities',
      desc: 'Inspect detected people (P-024, P-031, P-042), vehicles, and bounding box telemetry overlays on the synchronized canvas video player.',
      actionTab: 'video-analysis' as NavTab,
      btnText: 'View Detections'
    },
    {
      step: 6,
      title: 'Generated Safety Incident',
      desc: 'Review the automatically flagged incident (e.g. Passenger Stumble during Harsh Braking jerk -4.2 m/s²).',
      actionTab: 'incidents' as NavTab,
      btnText: 'Inspect Incidents'
    },
    {
      step: 7,
      title: 'Evidence Package',
      desc: 'Examine the captured keyframe, camera source (CAM-04), NTP timestamp, model version, and SHA-256 hash.',
      actionTab: 'evidence' as NavTab,
      btnText: 'Open Evidence Library'
    },
    {
      step: 8,
      title: 'Cryptographic Provenance Verification',
      desc: 'Audit the 7-node chain: Camera Source → Video Input → Frame → AI Model → Inference → Event → Evidence Record (VERIFIED).',
      actionTab: 'verification' as NavTab,
      btnText: 'Verify Provenance'
    },
    {
      step: 9,
      title: 'Live Fleet Synchronization',
      desc: 'Return to Command Center to see the newly generated event and incident dynamically populated in the live feed.',
      actionTab: 'command-center' as NavTab,
      btnText: 'Return to Command Center'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#111318] border border-[#262C38] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E222A] flex items-center justify-between sticky top-0 bg-[#111318] z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                3-Minute Hackathon Demo Guide
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                AWS × WeMakeDevs "First Commit" Evaluation Storyboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#1A1E26] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Steps */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-300">
            Follow this 9-step demonstration journey to showcase the complete end-to-end vision pipeline:
          </p>

          <div className="space-y-2.5 pt-1">
            {demoSteps.map((s) => (
              <div
                key={s.step}
                className="p-3 rounded-lg bg-[#0A0C0F] border border-[#1A1E26] flex items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#171A20] border border-[#232730] text-[#F97316] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate(s.actionTab);
                  }}
                  className="px-2.5 py-1.5 rounded bg-[#171A20] hover:bg-[#F97316] hover:text-white text-gray-300 text-xs font-mono border border-[#232730] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>{s.btnText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E222A] bg-[#0E1015] flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-400">
            AEROVIS: See. Understand. Verify. Respond.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#F97316] text-white text-xs font-medium hover:bg-[#EA580C] transition-colors cursor-pointer"
          >
            Start Demonstration
          </button>
        </div>
      </div>
    </div>
  );
};

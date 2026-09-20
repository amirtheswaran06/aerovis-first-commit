import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Database, 
  Lock, 
  Cloud, 
  Video, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { NavTab } from '../../types';

interface DataFlowTopologyViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DataFlowTopologyView: React.FC<DataFlowTopologyViewProps> = ({ onNavigate }) => {
  const [selectedNode, setSelectedNode] = useState<string>('EDGE_TPU');

  const pipelineNodes = [
    {
      id: 'ONBOARD_CAMS',
      title: '1. Onboard Cameras',
      category: 'EDGE SENSORS',
      desc: '4x 1080p H.264 video streams per bus (Front road, interior cabin, boarding gate, rear exit). Synchronized to GPS NTP clock.',
      throughput: '1,200 Cameras • 240 MB/s',
      tech: 'GMSL2 / Sony IMX415 CMOS Sensors'
    },
    {
      id: 'EDGE_TPU',
      title: '2. Edge Jetson Orin / TPU',
      category: 'ONBOARD INFERENCE',
      desc: 'Local INT8 TensorRT neural inference at 30 FPS. Runs AEROVIS Vision Engine v1.4 for real-time person kinematics, vehicle tracking, and pothole detection.',
      throughput: '14.2 ms latency • 97.4% accuracy',
      tech: 'NVIDIA Jetson Orin Nano 8GB / TensorRT'
    },
    {
      id: 'INGEST_GATEWAY',
      title: '3. MQTT / 5G Gateway',
      category: 'TELEMETRY MESH',
      desc: 'Transmits compressed telemetry events, bounding box coordinates, and cryptographic frame hashes via secure mutual-TLS 5G transit link.',
      throughput: '4.8 ms network latency • mTLS 1.3',
      tech: 'AWS IoT Core / MQTT over TLS'
    },
    {
      id: 'AWS_STREAMING',
      title: '4. AWS Kinesis & EventBridge',
      category: 'CLOUD ROUTING',
      desc: 'High-throughput event streaming engine that routes safety incidents to emergency queues and telemetry to analytical pipelines.',
      throughput: '10,000 events/sec capacity',
      tech: 'Amazon Kinesis Data Streams / EventBridge'
    },
    {
      id: 'EVIDENCE_SEAL',
      title: '5. AWS S3 Object Lock & KMS',
      category: 'IMMUTABLE EVIDENCE',
      desc: 'Stores tamper-evident incident video snippets and EXIF metadata sealed with asymmetric KMS signatures for legal chain of custody.',
      throughput: 'WORM Compliant • SHA-256 Hashes',
      tech: 'Amazon S3 Object Lock + AWS KMS'
    },
    {
      id: 'COMMAND_CENTER',
      title: '6. Operations Center',
      category: 'WEB PRESENTATION',
      desc: 'React 19 + TypeScript real-time operations interface with sub-second WebSocket event notifications and GIS map dispatch.',
      throughput: 'Live Telemetry HUD • Instant Verification',
      tech: 'Vite / Tailwind CSS / WebSockets'
    }
  ];

  const activeNodeInfo = pipelineNodes.find(n => n.id === selectedNode) || pipelineNodes[1];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <Network className="w-5 h-5 text-[#F97316]" />
              Data Flow Architecture & Pipeline Topology
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              AWS ARCHITECTURE BLUEPRINT
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            End-to-end data pipeline tracing video packets from onboard bus cameras to edge neural inference, AWS cloud streaming, immutable evidence sealing, and web UI.
          </p>
        </div>

        <button
          onClick={() => onNavigate('system-health')}
          className="px-3.5 py-2 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-mono border border-[#232730] flex items-center gap-1.5 cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-[#F97316]" />
          <span>System Health & Telemetry</span>
        </button>
      </div>

      {/* Architecture Visual Topology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pipelineNodes.map((node, nIdx) => {
          const isSelected = node.id === selectedNode;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#181C24] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.2)]'
                  : 'bg-[#111318] border-[#1E222A] hover:border-gray-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
                  <span className="text-[#F97316] font-bold">{node.category}</span>
                  <span>Node {nIdx + 1}/6</span>
                </div>
                <h3 className="text-sm font-bold text-white">{node.title}</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{node.desc}</p>
              </div>

              <div className="pt-2 border-t border-[#1C2028] text-[11px] font-mono flex items-center justify-between text-gray-400">
                <span className="text-emerald-400 truncate max-w-[160px]">{node.throughput}</span>
                <span className="text-cyan-400 font-bold">{node.tech.split('/')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Panel for Selected Node */}
      <div className="p-5 rounded-lg bg-[#111318] border border-[#1E222A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Pipeline Component Specifications: {activeNodeInfo.title}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">STATUS: ACTIVE & MONITORED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
            <span className="text-gray-400 text-[10px] block">TECHNOLOGY STACK</span>
            <span className="text-white font-bold mt-1 block">{activeNodeInfo.tech}</span>
          </div>

          <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
            <span className="text-gray-400 text-[10px] block">THROUGHPUT & SCALE</span>
            <span className="text-cyan-400 font-bold mt-1 block">{activeNodeInfo.throughput}</span>
          </div>

          <div className="p-3 rounded bg-[#0A0C0F] border border-[#1A1E26]">
            <span className="text-gray-400 text-[10px] block">FAILOVER REDUNDANCY</span>
            <span className="text-emerald-400 font-bold mt-1 block">Dual AZ Multi-Region Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

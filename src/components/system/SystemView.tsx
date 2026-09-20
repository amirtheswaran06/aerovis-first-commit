import React from 'react';
import { 
  Cpu, 
  Database, 
  Server, 
  ShieldCheck, 
  Cloud, 
  Code, 
  ExternalLink, 
  Layers, 
  Activity,
  FileCode2,
  HardDrive
} from 'lucide-react';
import { AWS_SERVICES_STATUS } from '../../data/mockData';

export const SystemView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            System & Infrastructure
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            AWS Cloud Architecture & Edge Ingestion Topology (AWS × WeMakeDevs First Commit).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded border border-amber-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>Configured Prototype</span>
        </div>
      </div>

      {/* AWS Cloud Infrastructure Cards (Labeled as Configured / Prototype) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
          AWS Cloud Architecture (ap-south-1 Mumbai)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AWS_SERVICES_STATUS.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-lg bg-[#111318] border border-[#1E222A] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-[#171A20] text-[#F97316] border border-[#232730]">
                    {srv.id === 's3' && <HardDrive className="w-4 h-4" />}
                    {srv.id === 'dynamodb' && <Database className="w-4 h-4" />}
                    {srv.id === 'apigateway' && <Server className="w-4 h-4" />}
                    {srv.id === 'lambda' && <Cpu className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-mono">
                      {srv.service}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {srv.role}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {srv.status} (Prototype)
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 block mt-1">
                    {srv.region}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-300 bg-[#0E1015] p-2.5 rounded border border-[#1C2028]">
                {srv.details}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
                <span>Metric: {srv.metrics}</span>
                <span className="text-emerald-400">Spec Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Architecture Pipeline Flow Diagram */}
      <div className="p-5 rounded-lg bg-[#111318] border border-[#1E222A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E222A]">
          <div>
            <h3 className="text-sm font-semibold text-white font-sans">
              AEROVIS End-to-End Edge-to-Cloud Pipeline
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Video Ingest → Neural Inference → Event Broker → KMS Evidence Anchor
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400">AWS Hackathon MVP</span>
        </div>

        <div className="p-4 rounded-lg bg-[#08090B] border border-[#1A1E26] overflow-x-auto">
          <div className="min-w-[640px] flex items-center justify-between text-center font-mono text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded bg-[#111318] border border-[#232730] w-36">
              <span className="text-[#F97316] font-bold block text-sm">1. Bus Cam</span>
              <span className="text-[10px] text-gray-400 mt-1 block">RTSP / 1080p @ 30fps</span>
            </div>

            <div className="text-gray-600">➔</div>

            {/* Step 2 */}
            <div className="p-3 rounded bg-[#111318] border border-[#232730] w-36">
              <span className="text-white font-bold block text-sm">2. Edge Vision</span>
              <span className="text-[10px] text-gray-400 mt-1 block">YOLO-World + ByteTrack</span>
            </div>

            <div className="text-gray-600">➔</div>

            {/* Step 3 */}
            <div className="p-3 rounded bg-[#111318] border border-[#232730] w-36">
              <span className="text-blue-400 font-bold block text-sm">3. AWS Gateway</span>
              <span className="text-[10px] text-gray-400 mt-1 block">API Gateway + Lambda</span>
            </div>

            <div className="text-gray-600">➔</div>

            {/* Step 4 */}
            <div className="p-3 rounded bg-[#111318] border border-[#232730] w-36">
              <span className="text-emerald-400 font-bold block text-sm">4. Evidence Vault</span>
              <span className="text-[10px] text-gray-400 mt-1 block">S3 Lock + DynamoDB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

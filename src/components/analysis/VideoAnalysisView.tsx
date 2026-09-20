import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Video as VideoIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ChevronRight, 
  AlertTriangle, 
  ArrowRight,
  Maximize2,
  FileVideo,
  Layers,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { 
  ProcessingStage, 
  ProcessingStageId, 
  Incident, 
  EvidenceRecord, 
  TimelineDetectionPoint, 
  BoundingBox,
  NavTab
} from '../../types';
import { apiService, AnalysisRunResult } from '../../services/apiService';

interface VideoAnalysisViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenIncidentDetail: (incident: Incident) => void;
  onOpenEvidenceDetail: (evidence: EvidenceRecord) => void;
}

export const VideoAnalysisView: React.FC<VideoAnalysisViewProps> = ({
  onNavigate,
  onOpenIncidentDetail,
  onOpenEvidenceDetail
}) => {
  // State: 'idle' | 'processing' | 'result'
  const [analysisState, setAnalysisState] = useState<'idle' | 'processing' | 'result'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);
  const [activeBusId, setActiveBusId] = useState<string>('BUS-104');
  const [activeCamera, setActiveCamera] = useState<string>('CAM-04 (Forward Interior Cabin)');

  // Preset Footage Option
  const [selectedPreset, setSelectedPreset] = useState<'cabin_stumble' | 'road_hazard' | 'door_ingress'>('cabin_stumble');

  // Stages State
  const [stages, setStages] = useState<ProcessingStage[]>(apiService.createDemoStages());
  const [processingPercent, setProcessingPercent] = useState<number>(0);

  // Results State
  const [analysisResult, setAnalysisResult] = useState<AnalysisRunResult | null>(null);
  const [activeTimelineStep, setActiveTimelineStep] = useState<TimelineDetectionPoint | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showTelemetryHud, setShowTelemetryHud] = useState<boolean>(true);

  // Video / Canvas Playback Simulation
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(23);
  const totalDurationSec = 30;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handle Drag & Drop
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoObjectUrl(url);
    startAnalysis(file.name);
  };

  const handleRunDemoPreset = () => {
    let filename = 'BUS104_CAM04_20260920_140218_RAW.mp4';
    if (selectedPreset === 'road_hazard') {
      filename = 'BUS207_CAM01_20260920_135410_FRONT.mp4';
      setActiveBusId('BUS-207');
      setActiveCamera('CAM-01 (External Front 4K)');
    } else if (selectedPreset === 'door_ingress') {
      filename = 'BUS312_CAM03_20260920_134802_DOOR.mp4';
      setActiveBusId('BUS-312');
      setActiveCamera('CAM-03 (Boarding Gate Sensor)');
    } else {
      setActiveBusId('BUS-104');
      setActiveCamera('CAM-04 (Forward Interior Cabin)');
    }

    startAnalysis(filename);
  };

  const startAnalysis = async (filename: string) => {
    setAnalysisState('processing');
    setProcessingPercent(5);

    const freshStages = apiService.createDemoStages();
    setStages(freshStages);

    try {
      const result = await apiService.runFootageAnalysis(
        filename,
        activeBusId,
        activeCamera,
        (stageId, status, detail) => {
          setStages((prev) =>
            prev.map((s) => {
              if (s.id === stageId) {
                return { ...s, status, detail: detail || s.detail };
              }
              return s;
            })
          );
          // Update percent
          setProcessingPercent((prev) => Math.min(prev + 16, 100));
        }
      );

      setProcessingPercent(100);
      setAnalysisResult(result);
      setActiveTimelineStep(result.timeline[result.timeline.length - 1]);
      setCurrentTimeSec(23);
      setAnalysisState('result');
    } catch (err) {
      console.error(err);
      setAnalysisState('idle');
    }
  };

  // Video scrubber and animation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && analysisState === 'result') {
      timer = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, analysisState]);

  // Synchronize active timeline step when time advances
  useEffect(() => {
    if (!analysisResult) return;
    const matched = [...analysisResult.timeline]
      .reverse()
      .find((step) => currentTimeSec >= step.second);
    if (matched) {
      setActiveTimelineStep(matched);
    }
  }, [currentTimeSec, analysisResult]);

  // Canvas CCTV Simulation Render
  useEffect(() => {
    if (analysisState !== 'result' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderCCTV = () => {
      ctx.fillStyle = '#0B0D12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle perspective grid representing bus cabin or roadway
      ctx.strokeStyle = '#171B24';
      ctx.lineWidth = 1;

      if (selectedPreset === 'cabin_stumble') {
        // Draw bus interior corridor perspective
        ctx.beginPath();
        // Ceiling rails
        ctx.moveTo(canvas.width * 0.25, 0);
        ctx.lineTo(canvas.width * 0.4, canvas.height * 0.45);
        ctx.moveTo(canvas.width * 0.75, 0);
        ctx.lineTo(canvas.width * 0.6, canvas.height * 0.45);

        // Floor aisle
        ctx.moveTo(canvas.width * 0.35, canvas.height);
        ctx.lineTo(canvas.width * 0.45, canvas.height * 0.45);
        ctx.moveTo(canvas.width * 0.65, canvas.height);
        ctx.lineTo(canvas.width * 0.55, canvas.height * 0.45);
        ctx.stroke();

        // Passenger seats outlines
        ctx.fillStyle = '#121620';
        for (let i = 0; i < 4; i++) {
          const y = canvas.height * 0.45 + i * 35;
          ctx.fillRect(canvas.width * 0.08, y, canvas.width * 0.2, 26);
          ctx.fillRect(canvas.width * 0.72, y, canvas.width * 0.2, 26);
        }

        // Standing Handrails
        ctx.strokeStyle = '#2B3242';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.32, 0);
        ctx.lineTo(canvas.width * 0.32, canvas.height);
        ctx.moveTo(canvas.width * 0.68, 0);
        ctx.lineTo(canvas.width * 0.68, canvas.height);
        ctx.stroke();
      } else {
        // Forward Road View
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.55);
        ctx.lineTo(canvas.width, canvas.height * 0.55);
        // Road lane perspective
        ctx.moveTo(canvas.width * 0.48, canvas.height * 0.55);
        ctx.lineTo(canvas.width * 0.1, canvas.height);
        ctx.moveTo(canvas.width * 0.52, canvas.height * 0.55);
        ctx.lineTo(canvas.width * 0.9, canvas.height);
        ctx.stroke();
      }

      // Draw active bounding boxes
      if (showBoundingBoxes && activeTimelineStep) {
        activeTimelineStep.boundingBoxes.forEach((bb) => {
          const x = (bb.x / 100) * canvas.width;
          const y = (bb.y / 100) * canvas.height;
          const w = (bb.width / 100) * canvas.width;
          const h = (bb.height / 100) * canvas.height;

          // Box border
          ctx.strokeStyle = bb.category === 'hazard' ? '#EF4444' : '#F97316';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, w, h);

          // Corner bracket accents
          const corner = 6;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          // top-left
          ctx.beginPath();
          ctx.moveTo(x, y + corner);
          ctx.lineTo(x, y);
          ctx.lineTo(x + corner, y);
          ctx.stroke();

          // Label pill
          ctx.fillStyle = bb.category === 'hazard' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(249, 115, 22, 0.9)';
          ctx.fillRect(x, y - 18, Math.max(w * 1.3, 140), 18);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px IBM Plex Mono, monospace';
          ctx.fillText(`${bb.label} [${bb.confidence}%]`, x + 4, y - 5);

          // Center tracking point
          ctx.fillStyle = '#F97316';
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Camera Telemetry HUD Overlay
      if (showTelemetryHud) {
        ctx.fillStyle = 'rgba(8, 9, 11, 0.75)';
        ctx.fillRect(10, 10, 310, 52);
        ctx.strokeStyle = '#232730';
        ctx.strokeRect(10, 10, 310, 52);

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(22, 26, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '11px IBM Plex Mono, monospace';
        ctx.fillText(`REC ● ${activeBusId} :: ${activeCamera}`, 34, 28);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '10px IBM Plex Mono, monospace';
        const formattedSec = currentTimeSec < 10 ? `0${currentTimeSec}` : `${currentTimeSec}`;
        ctx.fillText(`TIME: 2026-09-20 14:02:${formattedSec} UTC | FPS: 29.97`, 20, 48);

        // Watermark right top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '10px IBM Plex Mono, monospace';
        ctx.fillText('AEROVIS VISION ENGINE v1.4', canvas.width - 170, 24);
      }

      animId = requestAnimationFrame(renderCCTV);
    };

    animId = requestAnimationFrame(renderCCTV);
    return () => cancelAnimationFrame(animId);
  }, [analysisState, showBoundingBoxes, showTelemetryHud, activeTimelineStep, currentTimeSec, activeBusId, activeCamera, selectedPreset]);

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Analyze Bus Footage
            </h1>
            <span className="text-[10px] font-mono text-[#F97316] px-2 py-0.5 rounded bg-[#F97316]/10 border border-[#F97316]/20">
              Primary MVP Pipeline
            </span>
          </div>
          <p className="text-xs lg:text-sm text-gray-400 max-w-2xl">
            Upload prerecorded footage to simulate an onboard camera feed and generate AI safety intelligence.
          </p>
        </div>

        {/* Action / Reset */}
        {analysisState === 'result' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAnalysisState('idle');
                setSelectedFile(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#171A20] hover:bg-[#20242E] text-gray-300 text-xs font-mono border border-[#232730] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another Video</span>
            </button>
          </div>
        )}
      </div>

      {/* STATE 1: IDLE / UPLOAD VIEW */}
      {analysisState === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Upload Area (8 Cols) */}
          <div className="lg:col-span-8 bg-[#111318] border border-[#1E222A] rounded-lg p-6">
            <h2 className="text-sm font-semibold text-white mb-2">Footage Ingestion</h2>
            <p className="text-xs text-gray-400 mb-5">
              Simulate an edge bus-camera upload or drop a recorded camera reel (MP4, MOV, WebM).
            </p>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 lg:p-12 text-center transition-all ${
                isDragging
                  ? 'border-[#F97316] bg-[#F97316]/5'
                  : 'border-[#262C38] bg-[#0A0C0F] hover:border-[#3B4456]'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#171A20] border border-[#232730] flex items-center justify-center text-[#F97316] mb-4">
                <Upload className="w-6 h-6" />
              </div>

              <h3 className="text-base font-semibold text-white mb-1">
                Drop bus footage here
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                or choose a video file from your computer
              </p>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-medium border border-[#2B3242] cursor-pointer transition-colors">
                <FileVideo className="w-4 h-4 text-[#F97316]" />
                <span>Select Video File</span>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-mono text-gray-400">
                <span>Formats: MP4, MOV, WebM</span>
                <span>•</span>
                <span>Max: 1080p @ 60fps</span>
                <span>•</span>
                <span>Audio stripped</span>
              </div>
            </div>

            {/* Quick Demo Footage Button */}
            <div className="mt-6 p-4 rounded-lg bg-[#0E1015] border border-[#1E222A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  <h4 className="text-xs font-semibold text-white">
                    Want to test without uploading a video?
                  </h4>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Load prerecorded high-resolution bus telemetry footage to test the full pipeline.
                </p>
              </div>

              <button
                onClick={handleRunDemoPreset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-md bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium transition-all shadow-[0_0_12px_rgba(249,115,22,0.25)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Try Demo Footage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right 4 Cols: Pipeline Preset Configuration */}
          <div className="lg:col-span-4 bg-[#111318] border border-[#1E222A] rounded-lg p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Demo Footage Scenarios</h3>
              <p className="text-xs text-gray-400 mb-4">
                Select a simulated transit incident scenario to analyze:
              </p>

              <div className="space-y-3">
                {/* Scenario 1 */}
                <div
                  onClick={() => setSelectedPreset('cabin_stumble')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPreset === 'cabin_stumble'
                      ? 'bg-[#171A20] border-[#F97316]/60 shadow-sm'
                      : 'bg-[#0E1015] border-[#1C2028] hover:border-[#282F3D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">BUS-104 (Cabin Stumble)</span>
                    <span className="text-[10px] font-mono text-amber-400 px-1 py-0.2 rounded bg-amber-400/10">Recommended</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    CAM-04 Forward Interior: Standing passenger loses balance during harsh vehicle braking jerk.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-400 flex items-center gap-2">
                    <span>Route 12</span>
                    <span>•</span>
                    <span>Decel: -4.2 m/s²</span>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div
                  onClick={() => setSelectedPreset('road_hazard')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPreset === 'road_hazard'
                      ? 'bg-[#171A20] border-[#F97316]/60 shadow-sm'
                      : 'bg-[#0E1015] border-[#1C2028] hover:border-[#282F3D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">BUS-207 (Road Hazard)</span>
                    <span className="text-[10px] font-mono text-red-400 px-1 py-0.2 rounded bg-red-400/10">Critical</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    CAM-01 External 4K: Construction barricade obstruction in rapid bus transit corridor.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-400 flex items-center gap-2">
                    <span>Anna Nagar Roundabout</span>
                    <span>•</span>
                    <span>Speed: 18 km/h</span>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div
                  onClick={() => setSelectedPreset('door_ingress')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPreset === 'door_ingress'
                      ? 'bg-[#171A20] border-[#F97316]/60 shadow-sm'
                      : 'bg-[#0E1015] border-[#1C2028] hover:border-[#282F3D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">BUS-312 (Door Cycle Ingress)</span>
                    <span className="text-[10px] font-mono text-blue-400 px-1 py-0.2 rounded bg-blue-400/10">Safety</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    CAM-03 Entrance Gate: Passenger foot caught in pneumatic door seal during boarding.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-400 flex items-center gap-2">
                    <span>Central Station Terminal</span>
                    <span>•</span>
                    <span>Dwell: 42s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model & Architecture specs */}
            <div className="mt-5 p-3 rounded bg-[#0A0C0F] border border-[#1A1E26] text-[11px] font-mono text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Inference Pipeline:</span>
                <span className="text-gray-200">AEROVIS-v1.4b</span>
              </div>
              <div className="flex justify-between">
                <span>Precision:</span>
                <span className="text-emerald-400">INT8 TensorRT</span>
              </div>
              <div className="flex justify-between">
                <span>NTP Clock Drift:</span>
                <span className="text-emerald-400">&lt; 0.5 ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: MULTI-STAGE PROCESSING EXPERIENCE */}
      {analysisState === 'processing' && (
        <div className="max-w-3xl mx-auto bg-[#111318] border border-[#1E222A] rounded-lg p-6 lg:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <Cpu className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white font-sans">
              Processing Bus Footage
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Simulating edge AI ingestion, frame extraction, tracking, and evidence synthesis...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Pipeline Execution</span>
              <span className="text-[#F97316] font-bold">{processingPercent}%</span>
            </div>
            <div className="h-2 w-full bg-[#1A1E26] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#EA580C] to-[#F97316] transition-all duration-300"
                style={{ width: `${processingPercent}%` }}
              />
            </div>
          </div>

          {/* 6 Stages List */}
          <div className="space-y-2.5 pt-2">
            {stages.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isProcessing = stage.status === 'processing';

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                    isCompleted
                      ? 'bg-[#0E1015] border-[#1C2320]'
                      : isProcessing
                      ? 'bg-[#171A20] border-[#F97316]/40 shadow-sm'
                      : 'bg-[#0A0C0F] border-[#161920] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isProcessing
                          ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40 animate-pulse'
                          : 'bg-[#181B22] text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : stage.title.split('.')[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-200">
                        {stage.title}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {stage.detail || stage.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isCompleted && (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
                    {isProcessing && (
                      <span className="text-[11px] font-mono text-[#F97316] animate-pulse">
                        Processing...
                      </span>
                    )}
                    {!isCompleted && !isProcessing && (
                      <span className="text-[11px] font-mono text-gray-400">
                        Waiting...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 3: ANALYSIS RESULT (SPLIT SCREEN) */}
      {analysisState === 'result' && analysisResult && (
        <div className="space-y-6">
          {/* Top Banner with Quick Jump to Evidence / Verification */}
          <div className="p-3.5 rounded-lg bg-[#0F131A] border border-[#F97316]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <div>
                <span className="text-xs font-bold text-white">AI Vision Analysis Complete</span>
                <span className="text-xs text-gray-400 ml-2">
                  Generated Incident: <span className="text-white font-mono">{analysisResult.incident.id}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenIncidentDetail(analysisResult.incident)}
                className="px-3 py-1.5 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-medium border border-[#2A3140] transition-colors"
              >
                View Incident
              </button>
              <button
                onClick={() => onOpenEvidenceDetail(analysisResult.evidence)}
                className="px-3 py-1.5 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Evidence Provenance</span>
              </button>
            </div>
          </div>

          {/* Split Screen Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Video Player / Video Preview (7 Cols) */}
            <div className="lg:col-span-7 bg-[#111318] border border-[#1E222A] rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1E222A] mb-3">
                  <div className="flex items-center gap-2">
                    <VideoIcon className="w-4 h-4 text-[#F97316]" />
                    <h3 className="text-sm font-semibold text-white font-sans">
                      Footage Inspection Preview
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-[#171A20]">
                      {activeBusId} • {activeCamera.split('(')[0]}
                    </span>
                  </div>

                  {/* Toggle overlays */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                      className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-colors ${
                        showBoundingBoxes
                          ? 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]/40'
                          : 'bg-[#171A20] text-gray-400 border-[#232730]'
                      }`}
                    >
                      {showBoundingBoxes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>Bounding Boxes</span>
                    </button>

                    <button
                      onClick={() => setShowTelemetryHud(!showTelemetryHud)}
                      className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-colors ${
                        showTelemetryHud
                          ? 'bg-[#171A20] text-emerald-400 border-emerald-500/30'
                          : 'bg-[#171A20] text-gray-400 border-[#232730]'
                      }`}
                    >
                      <span>HUD</span>
                    </button>
                  </div>
                </div>

                {/* Video Canvas Stage */}
                <div className="relative rounded-lg overflow-hidden border border-[#1E2430] bg-black aspect-video flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={360}
                    className="w-full h-full object-contain"
                  />

                  {/* Live Watermark / Camera Status */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>SYNCHRONIZED FEED</span>
                  </div>
                </div>

                {/* Video Playback Controls */}
                <div className="mt-3 p-2.5 rounded bg-[#0A0C0F] border border-[#1A1E26] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded hover:bg-[#1C2028] text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setCurrentTimeSec(0)}
                        className="p-1.5 rounded hover:bg-[#1C2028] text-gray-400 hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-gray-200">
                        00:{currentTimeSec < 10 ? `0${currentTimeSec}` : currentTimeSec} / 00:30
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-gray-400">Rate: 1.0x</span>
                      <span>•</span>
                      <span className="text-emerald-400">TensorRT FP16</span>
                    </div>
                  </div>

                  {/* Scrubbing Bar */}
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={0}
                      max={totalDurationSec}
                      value={currentTimeSec}
                      onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#1E232E] rounded-lg appearance-none cursor-pointer accent-[#F97316]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Video Metadata */}
              <div className="mt-4 pt-3 border-t border-[#1E222A] grid grid-cols-3 gap-2 text-[11px] font-mono text-gray-400">
                <div>
                  <span className="text-gray-400 block text-[10px]">FRAME RATE</span>
                  <span className="text-gray-200">29.97 FPS (Zero-Loss)</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">SENSOR RESOLUTION</span>
                  <span className="text-gray-200">1920 × 1080 HDR</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">INGEST CHECKSUM</span>
                  <span className="text-[#F97316] truncate block">0x9B41F0A2</span>
                </div>
              </div>
            </div>

            {/* RIGHT: AI Analysis Panel & Tracking Timeline (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* AI Analysis Summary Card */}
              <div className="bg-[#111318] border border-[#1E222A] rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E222A]">
                  <h3 className="text-sm font-semibold text-white font-sans">
                    AI Analysis
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Confidence: 97%
                  </span>
                </div>

                {/* Detected Objects Grid */}
                <div>
                  <div className="text-[11px] font-mono text-gray-400 mb-2 uppercase">
                    Detected Objects
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded bg-[#0E1015] border border-[#1C2028]">
                      <span className="text-[10px] font-mono text-gray-400 block">People</span>
                      <span className="text-lg font-bold font-mono text-white">8</span>
                    </div>
                    <div className="p-2 rounded bg-[#0E1015] border border-[#1C2028]">
                      <span className="text-[10px] font-mono text-gray-400 block">Vehicles</span>
                      <span className="text-lg font-bold font-mono text-white">2</span>
                    </div>
                    <div className="p-2 rounded bg-[#0E1015] border border-[#1C2028]">
                      <span className="text-[10px] font-mono text-gray-400 block">Hazards</span>
                      <span className="text-lg font-bold font-mono text-red-400">1</span>
                    </div>
                  </div>
                </div>

                {/* Tracked Identities */}
                <div>
                  <div className="text-[11px] font-mono text-gray-400 mb-2 uppercase">
                    Tracked Identities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.trackedIdentities.map((id) => (
                      <span
                        key={id}
                        onClick={() => onNavigate('people')}
                        className="px-2.5 py-1 rounded bg-[#171A20] hover:bg-[#202530] text-gray-200 text-xs font-mono border border-[#242A36] cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                        <span>{id}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Events */}
                <div>
                  <div className="text-[11px] font-mono text-gray-400 mb-2 uppercase">
                    Events
                  </div>
                  <div className="p-2.5 rounded bg-[#161410] border border-[#F97316]/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        Passenger movement
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">00:04 - 00:23</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#F97316] font-medium">
                      <span>Potential safety event</span>
                      <span className="font-mono text-[11px]">97% Confidence</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-[#111318] border border-[#1E222A] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E222A]">
                  <h3 className="text-sm font-semibold text-white font-sans">
                    Tracking Timeline
                  </h3>
                  <span className="text-[11px] font-mono text-gray-400">
                    Click step to jump video
                  </span>
                </div>

                <div className="space-y-2">
                  {analysisResult.timeline.map((item) => {
                    const isSelected = activeTimelineStep?.timeOffset === item.timeOffset;

                    return (
                      <div
                        key={item.timeOffset}
                        onClick={() => {
                          setActiveTimelineStep(item);
                          setCurrentTimeSec(item.second);
                        }}
                        className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1C2028] border-[#F97316] shadow-sm'
                            : 'bg-[#0E1015] border-[#1C2028] hover:border-[#282F3D]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#F97316] text-[11px]">
                              {item.timeOffset}
                            </span>
                            <span className="font-medium text-gray-200">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">
                            {item.confidence}%
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 pl-12 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action buttons */}
                <div className="pt-2 border-t border-[#1E222A] flex items-center gap-2">
                  <button
                    onClick={() => onOpenEvidenceDetail(analysisResult.evidence)}
                    className="flex-1 py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Provenance</span>
                  </button>
                  <button
                    onClick={() => onNavigate('command-center')}
                    className="px-3 py-2 rounded bg-[#171A20] hover:bg-[#202530] text-gray-300 text-xs font-medium border border-[#232730] transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

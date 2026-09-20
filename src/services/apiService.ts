import {
  Incident,
  AIEvent,
  EvidenceRecord,
  ProcessingStage,
  ProcessingStageId,
  TimelineDetectionPoint,
  ProvenanceNode,
  RoadDefect,
  TrafficHotspot,
  MissingPersonCase,
  VehicleIntelligenceRecord,
  StopSafetyProfile,
  IntelligenceReportRequest
} from '../types';
import {
  INITIAL_INCIDENTS,
  INITIAL_AI_EVENTS,
  INITIAL_EVIDENCE_RECORDS,
  DEMO_TIMELINE_POINTS,
  DEMO_PROVENANCE_NODES,
  ROAD_DEFECTS,
  TRAFFIC_HOTSPOTS,
  MISSING_PERSON_CASES,
  VEHICLE_INTELLIGENCE_RECORDS,
  STOP_SAFETY_PROFILES,
  INITIAL_REPORT_REQUESTS
} from '../data/mockData';

export interface AnalysisRunResult {
  incident: Incident;
  evidence: EvidenceRecord;
  aiEvent: AIEvent;
  timeline: TimelineDetectionPoint[];
  detectedCounts: {
    people: number;
    vehicles: number;
    hazards: number;
  };
  trackedIdentities: string[];
  overallConfidence: number;
}

class AerovisApiService {
  private incidents: Incident[] = [...INITIAL_INCIDENTS];
  private aiEvents: AIEvent[] = [...INITIAL_AI_EVENTS];
  private evidenceRecords: EvidenceRecord[] = [...INITIAL_EVIDENCE_RECORDS];
  private roadDefects: RoadDefect[] = [...ROAD_DEFECTS];
  private trafficHotspots: TrafficHotspot[] = [...TRAFFIC_HOTSPOTS];
  private missingPersonCases: MissingPersonCase[] = [...MISSING_PERSON_CASES];
  private vehicleRecords: VehicleIntelligenceRecord[] = [...VEHICLE_INTELLIGENCE_RECORDS];
  private stopProfiles: StopSafetyProfile[] = [...STOP_SAFETY_PROFILES];
  private reports: IntelligenceReportRequest[] = [...INITIAL_REPORT_REQUESTS];

  public getIncidents(): Incident[] {
    return [...this.incidents];
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.find((inc) => inc.id === id);
  }

  public getAIEvents(): AIEvent[] {
    return [...this.aiEvents];
  }

  public getEvidenceList(): EvidenceRecord[] {
    return [...this.evidenceRecords];
  }

  public getEvidenceById(id: string): EvidenceRecord | undefined {
    return this.evidenceRecords.find((ev) => ev.id === id);
  }

  public getRoadDefects(): RoadDefect[] {
    return [...this.roadDefects];
  }

  public getTrafficHotspots(): TrafficHotspot[] {
    return [...this.trafficHotspots];
  }

  public getMissingPersonCases(): MissingPersonCase[] {
    return [...this.missingPersonCases];
  }

  public getVehicleRecords(): VehicleIntelligenceRecord[] {
    return [...this.vehicleRecords];
  }

  public getStopProfiles(): StopSafetyProfile[] {
    return [...this.stopProfiles];
  }

  public getReports(): IntelligenceReportRequest[] {
    return [...this.reports];
  }

  public addReport(newReport: IntelligenceReportRequest): void {
    this.reports = [newReport, ...this.reports];
  }

  public addProcessedResults(result: AnalysisRunResult): void {
    // Prepend new incident
    this.incidents = [result.incident, ...this.incidents];
    // Prepend new AI event
    this.aiEvents = [result.aiEvent, ...this.aiEvents];
    // Prepend new evidence record
    this.evidenceRecords = [result.evidence, ...this.evidenceRecords];
  }

  public createDemoStages(): ProcessingStage[] {
    return [
      {
        id: 'video_received',
        title: '1. Video received',
        description: 'Multiplexed onboard bus video stream container verified and integrity checksum validated.',
        status: 'pending'
      },
      {
        id: 'frame_extraction',
        title: '2. Frame extraction',
        description: 'Keyframe isolation at 30fps with NTP atomic clock timestamp synchronization.',
        status: 'pending'
      },
      {
        id: 'object_detection',
        title: '3. Object detection',
        description: 'AEROVIS Vision Engine v1.4 multi-class spatial inference (passengers, vehicles, obstacles).',
        status: 'pending'
      },
      {
        id: 'tracking',
        title: '4. Tracking',
        description: 'Kinematic trajectory association using ByteTrack with persistent identification vectors.',
        status: 'pending'
      },
      {
        id: 'event_analysis',
        title: '5. Event analysis',
        description: 'Correlating vehicle deceleration sensor telemetry with passenger kinematic instability.',
        status: 'pending'
      },
      {
        id: 'evidence_generation',
        title: '6. Evidence generation',
        description: 'Generating tamper-evident cryptographic hash, EXIF manifest and AWS S3 audit anchor.',
        status: 'pending'
      }
    ];
  }

  public async runFootageAnalysis(
    fileOrDemoName: string,
    busId: string,
    camera: string,
    onStageUpdate: (stageId: ProcessingStageId, status: 'processing' | 'completed', detail?: string) => void
  ): Promise<AnalysisRunResult> {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Stage 1: Video Received
    onStageUpdate('video_received', 'processing', 'Validating video payload and codec header...');
    await delay(600);
    onStageUpdate('video_received', 'completed', 'H.264 High Profile / 1080p @ 30fps validated');

    // Stage 2: Frame extraction
    onStageUpdate('frame_extraction', 'processing', 'Extracting keyframes & syncing NTP clock...');
    await delay(700);
    onStageUpdate('frame_extraction', 'completed', '720 frames indexed (Offset: +0.4ms)');

    // Stage 3: Object detection
    onStageUpdate('object_detection', 'processing', 'Executing AEROVIS Vision Engine v1.4 INT8 inference...');
    await delay(800);
    onStageUpdate('object_detection', 'completed', '8 passengers, 2 vehicles, 1 hazard detected (Conf: 97%)');

    // Stage 4: Tracking
    onStageUpdate('tracking', 'processing', 'Associating kinematic tracks P-024, P-031, P-042...');
    await delay(750);
    onStageUpdate('tracking', 'completed', 'Trajectories linked across 240 continuous frames');

    // Stage 5: Event analysis
    onStageUpdate('event_analysis', 'processing', 'Cross-referencing accelerometer jerk & passenger posture...');
    await delay(750);
    onStageUpdate('event_analysis', 'completed', 'Critical event flagged: Passenger Instability during Deceleration');

    // Stage 6: Evidence generation
    onStageUpdate('evidence_generation', 'processing', 'Generating SHA-256 frame hash and cryptographic seal...');
    await delay(800);
    onStageUpdate('evidence_generation', 'completed', 'Cryptographically verified evidence record created');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const incidentId = `INC-2026-${randomSuffix}`;
    const evidenceId = `EVT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const timestampStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const fullTimestamp = `2026-09-20 ${timestampStr}`;

    const newIncident: Incident = {
      id: incidentId,
      title: 'Passenger Instability during Harsh Deceleration',
      eventType: 'Passenger Safety Event',
      category: 'passenger',
      busId: busId,
      camera: camera,
      location: 'Anna Salai / Central Corridor',
      timestamp: fullTimestamp,
      relativeTime: 'Just now',
      confidence: 97,
      severity: 'HIGH',
      status: 'NEW',
      verificationStatus: 'VERIFIED',
      assignedAuthority: 'Metropolitan Transport Corporation (MTC)',
      description: `AI vision detected passenger P-024 stumble during rapid deceleration on ${busId}. Correlated with ${camera} telemetry stream.`,
      evidenceId: evidenceId,
      model: 'AEROVIS Vision Engine v1.4-edge',
      inputHash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      boundingBoxes: [
        {
          id: 'bb-new-1',
          label: 'Passenger Stumble (P-024)',
          trackId: 'P-024',
          x: 42,
          y: 35,
          width: 16,
          height: 48,
          confidence: 97,
          category: 'person'
        }
      ]
    };

    const newEvidence: EvidenceRecord = {
      id: evidenceId,
      incidentId: incidentId,
      title: `Deceleration Stumble Evidence Package (${busId})`,
      sourceCamera: camera,
      busId: busId,
      timestamp: fullTimestamp,
      ntpSynced: true,
      model: 'AEROVIS Vision Engine v1.4-edge',
      confidence: 97,
      inputHash: newIncident.inputHash,
      frameNumber: 4289,
      frameHash: `sha256:${newIncident.inputHash.slice(0, 32)}`,
      cryptographicSignature: `3045022100${Math.random().toString(16).substring(2, 18)}...sig`,
      kmsKeyId: 'arn:aws:kms:ap-south-1:481539128801:key/aerovis-evidence-key',
      s3Uri: `s3://aerovis-evidence-vault-demo/${busId}/2026-09-20/${evidenceId}.pkg`,
      verificationStatus: 'VERIFIED',
      boundingBoxes: newIncident.boundingBoxes || [],
      provenanceChain: DEMO_PROVENANCE_NODES
    };

    const newAIEvent: AIEvent = {
      id: `EV-${randomSuffix}`,
      timestamp: timestampStr,
      busId: busId,
      event: 'Passenger safety stumble detected',
      confidence: 97,
      verificationStatus: 'VERIFIED',
      severity: 'HIGH',
      trackId: 'P-024',
      camera: camera,
      location: 'Anna Salai / Central Corridor',
      category: 'passenger'
    };

    const result: AnalysisRunResult = {
      incident: newIncident,
      evidence: newEvidence,
      aiEvent: newAIEvent,
      timeline: DEMO_TIMELINE_POINTS,
      detectedCounts: {
        people: 8,
        vehicles: 2,
        hazards: 1
      },
      trackedIdentities: ['P-024', 'P-031', 'P-042'],
      overallConfidence: 97
    };

    this.addProcessedResults(result);
    return result;
  }
}

export const apiService = new AerovisApiService();

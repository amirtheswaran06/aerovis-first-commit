export type UserRole = 
  | 'SYSTEM_ADMIN' 
  | 'TRANSPORT_AUTHORITY' 
  | 'TRAFFIC_AUTHORITY' 
  | 'PUBLIC_SAFETY_OFFICER' 
  | 'ANALYST';

export type NavTab = 
  // PRIMARY MONITORING
  | 'command-center' 
  | 'live-gis-map' 
  | 'live-ai-vision'
  | 'video-analysis'
  // CITY INTELLIGENCE
  | 'fleet-intelligence' 
  | 'road-intelligence' 
  | 'traffic-intelligence'
  // PUBLIC SAFETY
  | 'public-safety-center' 
  | 'person-intelligence' 
  | 'people'
  | 'missing-person-search' 
  | 'incident-center' 
  | 'incidents'
  | 'cross-fleet-tracking' 
  | 'womens-safety'
  // INTELLIGENCE & REPORTS
  | 'analytics' 
  | 'evidence' 
  | 'verification'
  | 'reports'
  // SYSTEM
  | 'system-health' 
  | 'system'
  | 'data-flow' 
  | 'security-privacy';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'NEW' | 'UNDER_REVIEW' | 'ASSIGNED' | 'RESPONDING' | 'RESOLVED';

export type VerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'NOT_VERIFIED' | 'SIMULATED';

export type EventCategory = 'road' | 'traffic' | 'driver' | 'passenger' | 'safety';

export interface BoundingBox {
  id: string;
  label: string;
  trackId: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  confidence: number;
  color?: string;
  category: 'person' | 'vehicle' | 'hazard' | 'sign' | 'road';
}

export interface Incident {
  id: string;
  title: string;
  eventType: string;
  category: EventCategory;
  busId: string;
  camera: string;
  location: string;
  timestamp: string;
  relativeTime: string;
  confidence: number;
  severity: Severity;
  status: IncidentStatus;
  verificationStatus: VerificationStatus;
  assignedAuthority: string;
  description: string;
  evidenceId: string;
  model: string;
  inputHash: string;
  thumbnailUrl?: string;
  boundingBoxes?: BoundingBox[];
  crossFleetTrail?: {
    busId: string;
    time: string;
    location: string;
    confidence: number;
  }[];
}

export interface AIEvent {
  id: string;
  timestamp: string;
  busId: string;
  event: string;
  confidence: number;
  verificationStatus: VerificationStatus;
  severity: Severity;
  trackId?: string;
  camera?: string;
  location?: string;
  category?: EventCategory;
}

export interface BusCamera {
  id: string;
  name: string;
  type: 'FRONT_ROAD' | 'REAR_TRAFFIC' | 'SIDE_INFRA' | 'INTERIOR_CABIN';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  fps: number;
  resolution: string;
  aiActive: boolean;
  lastDetection: string;
}

export interface Bus {
  id: string;
  registrationNumber: string;
  name: string;
  route: string;
  routeNumber?: string;
  driverName?: string;
  status: 'OPERATIONAL' | 'WARNING' | 'ALERT' | 'MAINTENANCE';
  aiStatus: 'AI ACTIVE' | 'AI DEGRADED' | 'STANDBY';
  gpsStatus: 'ONLINE' | 'SEARCHING' | 'OFFLINE';
  networkStatus: '5G CONNECTED' | '4G BACKUP' | 'OFFLINE';
  speedKmH: number;
  heading: string;
  driverId: string;
  locationName: string;
  cameraCount: number;
  camerasOnline: number;
  activeIncidentsCount: number;
  lat: number;
  lng: number;
  lastEvent: string;
  lastSeen: string;
  cameras: BusCamera[];
  recentEvents: string[];
  routeStops: { name: string; time: string; passed: boolean }[];
}

export interface RoadDefect {
  id: string;
  defectType: 'Pothole' | 'Road Damage' | 'Waterlogging' | 'Missing Divider' | 'Missing Zebra Crossing' | 'Damaged Traffic Sign' | 'Road Obstacle';
  type?: string;
  location: string;
  severity: Severity;
  busId: string;
  camera: string;
  confidence: number;
  status: 'NEW' | 'UNDER_REVIEW' | 'ASSIGNED' | 'RESOLVED' | 'SCHEDULED_REPAIR' | 'VERIFIED';
  detectedTime: string;
  timestamp?: string;
  actionRequired: string;
  depthEstimatedMm?: number;
  surfaceAreaSqM?: number;
  coordinates: [number, number];
  evidenceId: string;
}

export interface TrafficHotspot {
  id: string;
  location: string;
  corridor?: string;
  congestionLevel?: string;
  description?: string;
  avgDelayMinutes?: number;
  peakHours?: string;
  affectedBuses?: string[];
  cause?: string;
  density: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  densityPct: number;
  averageSpeedKmH: number;
  estimatedDelayMin: number;
  bottleneckCause: string;
  vehicleComposition: {
    carsPct: number;
    twoWheelersPct: number;
    autoRickshawsPct: number;
    busesPct: number;
    trucksPct: number;
  };
  hourlyTrend: { hour: string; speed: number; volume: number }[];
  busReportsCount: number;
}

export interface MissingPersonCase {
  caseId: string;
  name: string;
  age: number;
  gender: string;
  reportedDate: string;
  reportedAt?: string;
  lastKnownLocation: string;
  authorizedAgency: string;
  assignedOfficer?: string;
  caseStatus: 'ACTIVE_SEARCH' | 'UNDER_HUMAN_REVIEW' | 'RESOLVED' | 'ARCHIVED';
  status?: string;
  photoDescription: string;
  personDescription?: string;
  physicalMarkers: string[];
  potentialMatches: {
    matchId: string;
    busId: string;
    camera: string;
    timestamp: string;
    location: string;
    confidence: number;
    trackingId: string;
    humanVerificationStatus: 'HUMAN_VERIFICATION_REQUIRED' | 'CONFIRMED' | 'REJECTED';
    officerNotes?: string;
    evidenceFrameId: string;
  }[];
  sightings?: {
    id: string;
    busId: string;
    camera: string;
    timestamp: string;
    location: string;
    confidence: number;
    trackId: string;
  }[];
}

export interface VehicleIntelligenceRecord {
  searchId: string;
  vehicleType: 'Car' | 'Motorcycle' | 'Auto-Rickshaw' | 'Bus' | 'Truck' | 'Van';
  color: string;
  licensePlateAnonymized: string;
  lastDetected: string;
  sourceBus: string;
  camera: string;
  heading: string;
  confidence: number;
  incidentCorrelation: string;
  trail: {
    busId: string;
    time: string;
    location: string;
    speed: number;
    confidence: number;
  }[];
}

export interface StopSafetyProfile {
  id: string;
  stopId?: string;
  stopName: string;
  route: string;
  safetyScore: number; // 0 - 100
  safetyIndex?: number;
  lightingCondition: 'HIGH' | 'ADEQUATE' | 'LOW' | 'CRITICAL_DARK';
  lightingLevel?: string;
  sosEmergencyBooth?: boolean;
  crowdDensity: 'SPARSE' | 'MODERATE' | 'CROWDED' | 'OVERCROWDED';
  recentAlertsCount: number;
  status: 'NORMAL' | 'ATTENTION' | 'ELEVATED_RISK';
  lastPatrolTime: string;
  lastAudit?: string;
  nightRidershipIndex?: string;
  cabinSafetyIndicators: string;
  recommendedAction: string;
}

export interface TrackedPerson {
  id: string; // e.g. P-024
  label: string;
  firstDetected: string;
  lastDetected: string;
  busId: string;
  confidence: number;
  status: 'ACTIVE_TRANSIT' | 'EXITED' | 'TRANSFERRING';
  dwellTimeSeconds: number;
  trajectory: {
    point: string;
    time: string;
    busId: string;
    type: 'BOARDED' | 'TRANSIT' | 'TRANSFER' | 'SAFETY_FLAG';
    detail: string;
    confidence: number;
    camera: string;
  }[];
}

export interface ProvenanceNode {
  id: string;
  stepNumber: number;
  label: string;
  subtitle: string;
  timestamp: string;
  hash: string;
  status: 'VERIFIED' | 'CHECKING' | 'PENDING';
  verifiedDetails: string[];
  technicalData: Record<string, string>;
}

export interface EvidenceRecord {
  id: string;
  incidentId: string;
  title: string;
  sourceCamera: string;
  busId: string;
  timestamp: string;
  ntpSynced: boolean;
  model: string;
  confidence: number;
  inputHash: string;
  frameNumber: number;
  frameHash: string;
  cryptographicSignature: string;
  kmsKeyId: string;
  s3Uri: string;
  verificationStatus: VerificationStatus;
  snapshotUrl?: string;
  boundingBoxes: BoundingBox[];
  provenanceChain: ProvenanceNode[];
}

export type ProcessingStageId = 
  | 'video_received'
  | 'frame_extraction'
  | 'object_detection'
  | 'tracking'
  | 'event_analysis'
  | 'evidence_generation'
  | 'completed';

export interface ProcessingStage {
  id: ProcessingStageId;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  timestamp?: string;
  detail?: string;
}

export interface VideoMetadata {
  filename: string;
  fileSize: string;
  durationSeconds: number;
  resolution: string;
  fps: number;
  codec: string;
  busId: string;
  camera: string;
}

export interface TimelineDetectionPoint {
  timeOffset: string; // e.g. "00:04"
  second: number;
  title: string;
  trackId: string;
  type: 'detection' | 'tracking' | 'zone' | 'event';
  severity: Severity;
  confidence: number;
  description: string;
  boundingBoxes: BoundingBox[];
}

export interface IntelligenceReportRequest {
  id: string;
  reportType?: 'Road Maintenance Report' | 'Traffic Incident Report' | 'Public Safety Report' | 'Missing Person Investigation Report' | 'Fleet AI Telemetry Report' | 'Evidence Dossier';
  title?: string;
  type?: string;
  targetAgency?: string;
  status?: string;
  format?: string;
  fileSizeBytes?: string;
  checksumSha256?: string;
  dateRange?: string;
  location?: string;
  incidentType?: string;
  agency?: string;
  busId?: string;
  severity?: string;
  generatedAt: string;
  summary?: string;
  recordsCount?: number;
}

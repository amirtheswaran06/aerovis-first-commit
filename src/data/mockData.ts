import {
  Bus,
  Incident,
  AIEvent,
  TrackedPerson,
  EvidenceRecord,
  TimelineDetectionPoint,
  ProvenanceNode,
  RoadDefect,
  TrafficHotspot,
  MissingPersonCase,
  VehicleIntelligenceRecord,
  StopSafetyProfile,
  IntelligenceReportRequest
} from '../types';

export const INITIAL_BUSES: Bus[] = [
  {
    id: 'BUS-104',
    registrationNumber: 'TN-01-AN-4421',
    name: 'Tata Starbus EV Urban',
    route: 'Route 12 (Anna Salai - Guindy)',
    status: 'ALERT',
    aiStatus: 'AI ACTIVE',
    gpsStatus: 'ONLINE',
    networkStatus: '5G CONNECTED',
    lastEvent: 'Harsh Braking Event Detected',
    lastSeen: '2 min ago',
    speedKmH: 24,
    heading: 'South-South-West (198°)',
    driverId: 'DRV-4091 (R. Kumar)',
    locationName: 'Anna Salai Junction',
    cameraCount: 4,
    camerasOnline: 4,
    activeIncidentsCount: 1,
    lat: 13.0425,
    lng: 80.2472,
    cameras: [
      {
        id: 'CAM-01',
        name: 'CAM 01 — FRONT ROAD & HAZARD',
        type: 'FRONT_ROAD',
        status: 'ONLINE',
        fps: 30,
        resolution: '4K (3840x2160)',
        aiActive: true,
        lastDetection: 'Pothole detected (94%)'
      },
      {
        id: 'CAM-02',
        name: 'CAM 02 — REAR TRAFFIC',
        type: 'REAR_TRAFFIC',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p (1920x1080)',
        aiActive: true,
        lastDetection: 'Tailgating vehicle flagged (88%)'
      },
      {
        id: 'CAM-03',
        name: 'CAM 03 — SIDEWALK & INFRA',
        type: 'SIDE_INFRA',
        status: 'ONLINE',
        fps: 25,
        resolution: '1080p (1920x1080)',
        aiActive: true,
        lastDetection: 'Pedestrian boarding zone clear (98%)'
      },
      {
        id: 'CAM-04',
        name: 'CAM 04 — CABIN SAFETY',
        type: 'INTERIOR_CABIN',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p HDR',
        aiActive: true,
        lastDetection: 'Passenger stumble / jerk alert (94%)'
      }
    ],
    recentEvents: [
      '14:02:18 — Decel -4.2 m/s² logged by forward IMU',
      '14:00:10 — Corridor transit through DMS Office stop',
      '13:55:40 — Automatic passenger count: 38 seated, 12 standing'
    ],
    routeStops: [
      { name: 'Simpsons / Mount Road', time: '13:40', passed: true },
      { name: 'Thousand Lights', time: '13:50', passed: true },
      { name: 'Anna Salai Junction', time: '14:02', passed: true },
      { name: 'Saidapet Metro', time: '14:15', passed: false },
      { name: 'Guindy Industrial Estate', time: '14:30', passed: false }
    ]
  },
  {
    id: 'BUS-207',
    registrationNumber: 'TN-02-CD-8812',
    name: 'Ashok Leyland Electric Metro',
    route: 'Route 23C (Anna Nagar - Thiruvanmiyur)',
    status: 'ALERT',
    aiStatus: 'AI ACTIVE',
    gpsStatus: 'ONLINE',
    networkStatus: '5G CONNECTED',
    lastEvent: 'Road Hazard Detected',
    lastSeen: '8 min ago',
    speedKmH: 18,
    heading: 'South-East (142°)',
    driverId: 'DRV-1182 (S. Murugan)',
    locationName: 'Anna Nagar West Roundabout',
    cameraCount: 4,
    camerasOnline: 4,
    activeIncidentsCount: 1,
    lat: 13.0850,
    lng: 80.2101,
    cameras: [
      {
        id: 'CAM-01',
        name: 'CAM 01 — FRONT ROAD & HAZARD',
        type: 'FRONT_ROAD',
        status: 'ONLINE',
        fps: 30,
        resolution: '4K (3840x2160)',
        aiActive: true,
        lastDetection: 'Debris obstacle on lane (91%)'
      },
      {
        id: 'CAM-02',
        name: 'CAM 02 — REAR TRAFFIC',
        type: 'REAR_TRAFFIC',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Normal trailing flow'
      },
      {
        id: 'CAM-03',
        name: 'CAM 03 — SIDEWALK & INFRA',
        type: 'SIDE_INFRA',
        status: 'ONLINE',
        fps: 25,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Missing curb divider flagged'
      },
      {
        id: 'CAM-04',
        name: 'CAM 04 — CABIN SAFETY',
        type: 'INTERIOR_CABIN',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p HDR',
        aiActive: true,
        lastDetection: 'Normal occupancy (28 passengers)'
      }
    ],
    recentEvents: [
      '13:54:10 — Unsecured roadwork barricade isolated',
      '13:48:22 — Crosswalk zebra compliance checked',
      '13:41:05 — Bus departed Thirumangalam junction'
    ],
    routeStops: [
      { name: 'Anna Nagar Depot', time: '13:30', passed: true },
      { name: 'Anna Nagar West Roundabout', time: '13:54', passed: true },
      { name: 'Chetpet Flyover', time: '14:15', passed: false },
      { name: 'Nungambakkam', time: '14:30', passed: false },
      { name: 'Thiruvanmiyur Terminus', time: '15:10', passed: false }
    ]
  },
  {
    id: 'BUS-312',
    registrationNumber: 'TN-07-G-9931',
    name: 'Volvo B8RLE City Low Floor',
    route: 'Route 19B (Central Station - Kelambakkam)',
    status: 'WARNING',
    aiStatus: 'AI ACTIVE',
    gpsStatus: 'ONLINE',
    networkStatus: '4G BACKUP',
    lastEvent: 'Passenger Safety Event',
    lastSeen: '14 min ago',
    speedKmH: 0,
    heading: 'North (05°)',
    driverId: 'DRV-8820 (K. Anbarasan)',
    locationName: 'Central Station Terminal A3',
    cameraCount: 4,
    camerasOnline: 4,
    activeIncidentsCount: 1,
    lat: 13.0827,
    lng: 80.2757,
    cameras: [
      {
        id: 'CAM-01',
        name: 'CAM 01 — FRONT ROAD & HAZARD',
        type: 'FRONT_ROAD',
        status: 'ONLINE',
        fps: 30,
        resolution: '4K',
        aiActive: true,
        lastDetection: 'Station yard pedestrian crossing'
      },
      {
        id: 'CAM-02',
        name: 'CAM 02 — REAR TRAFFIC',
        type: 'REAR_TRAFFIC',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Bus bay approach safe'
      },
      {
        id: 'CAM-03',
        name: 'CAM 03 — SIDEWALK & INFRA',
        type: 'SIDE_INFRA',
        status: 'ONLINE',
        fps: 25,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'High-density commuter platform'
      },
      {
        id: 'CAM-04',
        name: 'CAM 04 — CABIN SAFETY',
        type: 'INTERIOR_CABIN',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p HDR',
        aiActive: true,
        lastDetection: 'Boarding disbalance flagged (87%)'
      }
    ],
    recentEvents: [
      '13:48:02 — Door cycle disbalance flagged by pose estimation',
      '13:44:11 — Stationary boarding at Terminal Bay A3',
      '13:35:00 — Route scheduled start initiated'
    ],
    routeStops: [
      { name: 'Central Station Terminal A3', time: '13:45', passed: true },
      { name: 'LIC Building', time: '14:05', passed: false },
      { name: 'Adyar Gate', time: '14:35', passed: false },
      { name: 'Kelambakkam Bus Stand', time: '15:25', passed: false }
    ]
  },
  {
    id: 'BUS-418',
    registrationNumber: 'TN-14-R-2018',
    name: 'Olectra K9 Electric Fast Transit',
    route: 'Route 570 (CMBT - Siruseri SIPCOT)',
    status: 'OPERATIONAL',
    aiStatus: 'AI ACTIVE',
    gpsStatus: 'ONLINE',
    networkStatus: '5G CONNECTED',
    lastEvent: 'Route Checkpoint Cleared',
    lastSeen: 'Just now',
    speedKmH: 42,
    heading: 'South (180°)',
    driverId: 'DRV-3044 (M. Vignesh)',
    locationName: 'OMR Sholinganallur Junction',
    cameraCount: 4,
    camerasOnline: 4,
    activeIncidentsCount: 0,
    lat: 12.9010,
    lng: 80.2279,
    cameras: [
      {
        id: 'CAM-01',
        name: 'CAM 01 — FRONT ROAD & HAZARD',
        type: 'FRONT_ROAD',
        status: 'ONLINE',
        fps: 30,
        resolution: '4K',
        aiActive: true,
        lastDetection: 'Expressway clear, lane speed 42 km/h'
      },
      {
        id: 'CAM-02',
        name: 'CAM 02 — REAR TRAFFIC',
        type: 'REAR_TRAFFIC',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Normal trailing separation'
      },
      {
        id: 'CAM-03',
        name: 'CAM 03 — SIDEWALK & INFRA',
        type: 'SIDE_INFRA',
        status: 'ONLINE',
        fps: 25,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Bus shelter lighting verified'
      },
      {
        id: 'CAM-04',
        name: 'CAM 04 — CABIN SAFETY',
        type: 'INTERIOR_CABIN',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p HDR',
        aiActive: true,
        lastDetection: 'Cabin stable, occupancy 44/50'
      }
    ],
    recentEvents: [
      '14:04:12 — Checkpoint cleared: Sholinganallur signal',
      '13:58:30 — Average corridor speed 38.6 km/h',
      '13:50:00 — Trajectory synchronized with fleet cloud'
    ],
    routeStops: [
      { name: 'CMBT Koyambedu', time: '13:00', passed: true },
      { name: 'Velachery MRTS', time: '13:35', passed: true },
      { name: 'Perungudi Toll', time: '13:48', passed: true },
      { name: 'OMR Sholinganallur Junction', time: '14:04', passed: true },
      { name: 'Siruseri SIPCOT', time: '14:25', passed: false }
    ]
  },
  {
    id: 'BUS-117',
    registrationNumber: 'TN-01-BZ-5509',
    name: 'Tata Starbus EV Commuter',
    route: 'Route 70A (Koyambedu - Tambaram)',
    status: 'OPERATIONAL',
    aiStatus: 'AI ACTIVE',
    gpsStatus: 'ONLINE',
    networkStatus: '5G CONNECTED',
    lastEvent: 'Potential Missing Person Visual Match',
    lastSeen: '1 min ago',
    speedKmH: 31,
    heading: 'South-West (220°)',
    driverId: 'DRV-5092 (T. Selvam)',
    locationName: 'Kathipara Grade Separator',
    cameraCount: 4,
    camerasOnline: 4,
    activeIncidentsCount: 1,
    lat: 13.0067,
    lng: 80.2018,
    cameras: [
      {
        id: 'CAM-01',
        name: 'CAM 01 — FRONT ROAD & HAZARD',
        type: 'FRONT_ROAD',
        status: 'ONLINE',
        fps: 30,
        resolution: '4K',
        aiActive: true,
        lastDetection: 'Flyover approach flow normal'
      },
      {
        id: 'CAM-02',
        name: 'CAM 02 — REAR TRAFFIC',
        type: 'REAR_TRAFFIC',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Following vehicle flow 35 km/h'
      },
      {
        id: 'CAM-03',
        name: 'CAM 03 — SIDEWALK & INFRA',
        type: 'SIDE_INFRA',
        status: 'ONLINE',
        fps: 25,
        resolution: '1080p',
        aiActive: true,
        lastDetection: 'Bus bay crowd density moderate'
      },
      {
        id: 'CAM-04',
        name: 'CAM 04 — CABIN SAFETY',
        type: 'INTERIOR_CABIN',
        status: 'ONLINE',
        fps: 30,
        resolution: '1080p HDR',
        aiActive: true,
        lastDetection: 'Authorized visual match flagged (87%)'
      }
    ],
    recentEvents: [
      '14:01:10 — Visual similarity correlation flagged on Case MP-2026-014',
      '13:52:00 — Departed Ashok Nagar Metro stop',
      '13:45:12 — Cabin occupancy 32 passengers'
    ],
    routeStops: [
      { name: 'Koyambedu Market', time: '13:30', passed: true },
      { name: 'Ashok Pillar', time: '13:52', passed: true },
      { name: 'Kathipara Junction', time: '14:02', passed: true },
      { name: 'Airport Metro', time: '14:18', passed: false },
      { name: 'Tambaram West', time: '14:45', passed: false }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-091',
    title: 'Harsh Braking & Dynamic Weight Shift',
    eventType: 'Harsh Braking',
    category: 'driver',
    busId: 'BUS-104',
    camera: 'CAM-04 (Cabin Safety Sensor)',
    location: 'Route 12 / Anna Salai Junction',
    timestamp: '2026-09-20 14:02:18',
    relativeTime: '2 min ago',
    confidence: 94,
    severity: 'MEDIUM',
    status: 'ACTIVE' as any,
    verificationStatus: 'VERIFIED',
    assignedAuthority: 'Chennai Metropolitan Transport Corporation (MTC)',
    description: 'Sudden longitudinal deceleration (-4.2 m/s²) correlated with forward cabin visual tracking showing standing passenger loss of equilibrium.',
    evidenceId: 'EVT-7F31A9',
    model: 'AEROVIS Vision Engine v1.4-edge',
    inputHash: 'a84f59c19b02e731d8e124802b1154f91d2',
    boundingBoxes: [
      {
        id: 'bb-1',
        label: 'Passenger Stumble',
        trackId: 'P-024',
        x: 42,
        y: 35,
        width: 16,
        height: 48,
        confidence: 94,
        category: 'person'
      }
    ]
  },
  {
    id: 'INC-2026-089',
    title: 'Road Hazard: Debris & Unsecured Barricade',
    eventType: 'Road Hazard',
    category: 'road',
    busId: 'BUS-207',
    camera: 'CAM-01 (External Front 4K HDR)',
    location: 'Anna Nagar West Roundabout',
    timestamp: '2026-09-20 13:54:10',
    relativeTime: '8 min ago',
    confidence: 91,
    severity: 'CRITICAL',
    status: 'UNDER_REVIEW' as any,
    verificationStatus: 'VERIFIED',
    assignedAuthority: 'Greater Chennai Corporation (GCC) Works Dept',
    description: 'Unsecured roadwork barricade partially obstructing bus corridor lane. Forward vision engine detected collision risk with 91% confidence.',
    evidenceId: 'EVT-4C88B2',
    model: 'AEROVIS Vision Engine v1.4-edge',
    inputHash: 'fe20993bc510e11894d0763bbad7721840c',
    boundingBoxes: [
      {
        id: 'bb-2',
        label: 'Road Hazard / Debris',
        trackId: 'HZ-009',
        x: 55,
        y: 52,
        width: 22,
        height: 28,
        confidence: 91,
        category: 'hazard'
      }
    ]
  },
  {
    id: 'INC-2026-085',
    title: 'Passenger Safety Event: Aisle Instability at Turn',
    eventType: 'Public Safety',
    category: 'passenger',
    busId: 'BUS-312',
    camera: 'CAM-04 (Interior Center Aisle)',
    location: 'Central Station Terminal A3',
    timestamp: '2026-09-20 13:48:02',
    relativeTime: '14 min ago',
    confidence: 87,
    severity: 'HIGH',
    status: 'ASSIGNED' as any,
    verificationStatus: 'VERIFIED',
    assignedAuthority: 'Railway Protection Force / Transit Safety',
    description: 'Elderly passenger disbalance during vehicle boarding while doors were cycling. Detected via spatial-temporal pose estimation.',
    evidenceId: 'EVT-9E12F4',
    model: 'AEROVIS Vision Engine v1.4-edge',
    inputHash: '77d3aa05e94b21008cbef3219488a104cb3',
    boundingBoxes: [
      {
        id: 'bb-3',
        label: 'Passenger Disbalance',
        trackId: 'P-031',
        x: 36,
        y: 28,
        width: 20,
        height: 54,
        confidence: 87,
        category: 'person'
      }
    ]
  },
  {
    id: 'INC-2026-078',
    title: 'Hit & Run: Commercial Vehicle Side Impact',
    eventType: 'Hit & Run',
    category: 'traffic',
    busId: 'BUS-117',
    camera: 'CAM-02 (Rear Traffic 1080p)',
    location: 'Poonamallee High Road Junction',
    timestamp: '2026-09-20 10:42:15',
    relativeTime: '3 hours ago',
    confidence: 96,
    severity: 'CRITICAL',
    status: 'RESPONDING' as any,
    verificationStatus: 'VERIFIED',
    assignedAuthority: 'Greater Chennai Traffic Police (GCTP)',
    description: 'White Light Commercial Vehicle struck two-wheeler in corridor and fled without stopping. Cross-fleet correlation generated across BUS-204, BUS-117, and BUS-309.',
    evidenceId: 'EVT-1A9903',
    model: 'AEROVIS Vision Engine v1.4-edge',
    inputHash: '99bf44318c504a77e112d098ba43219f',
    crossFleetTrail: [
      { busId: 'BUS-204', time: '10:42', location: 'Poonamallee High Road', confidence: 96 },
      { busId: 'BUS-117', time: '10:51', location: 'Koyambedu Grade', confidence: 92 },
      { busId: 'BUS-309', time: '11:03', location: 'Kathipara Junction', confidence: 89 }
    ]
  },
  {
    id: 'INC-2026-064',
    title: 'Waterlogging & Severe Silt Accumulation',
    eventType: 'Waterlogging',
    category: 'road',
    busId: 'BUS-418',
    camera: 'CAM-01 (Front Road & Hazard)',
    location: 'Velachery Main Road Subway',
    timestamp: '2026-09-20 09:15:30',
    relativeTime: '5 hours ago',
    confidence: 93,
    severity: 'HIGH',
    status: 'RESOLVED' as any,
    verificationStatus: 'VERIFIED',
    assignedAuthority: 'Chennai Metro Water & Drainage',
    description: 'Underpass road surface flooded with water depth estimated at 180mm. Real-time fleet alert redirected 14 municipal buses to bypass flyover.',
    evidenceId: 'EVT-6D2088',
    model: 'AEROVIS Vision Engine v1.4-edge',
    inputHash: 'c44e9910d8a7003bf2a8e310bc94471a'
  }
];

export const INITIAL_AI_EVENTS: AIEvent[] = [
  {
    id: 'EV-1008',
    timestamp: '14:02:18',
    busId: 'BUS-104',
    event: 'Person detected (Standing aisle)',
    confidence: 98,
    verificationStatus: 'VERIFIED',
    severity: 'LOW',
    trackId: 'P-024',
    camera: 'CAM-04',
    location: 'Anna Salai Junction',
    category: 'passenger'
  },
  {
    id: 'EV-1007',
    timestamp: '14:01:43',
    busId: 'BUS-207',
    event: 'Road hazard detected (Barricade)',
    confidence: 91,
    verificationStatus: 'VERIFIED',
    severity: 'CRITICAL',
    trackId: 'HZ-009',
    camera: 'CAM-01',
    location: 'Anna Nagar West Roundabout',
    category: 'road'
  },
  {
    id: 'EV-1006',
    timestamp: '13:58:04',
    busId: 'BUS-104',
    event: 'Harsh braking (-4.2 m/s²)',
    confidence: 94,
    verificationStatus: 'VERIFIED',
    severity: 'MEDIUM',
    trackId: 'VEH-104',
    camera: 'CAM-04',
    location: 'Anna Salai Junction',
    category: 'driver'
  },
  {
    id: 'EV-1005',
    timestamp: '13:54:19',
    busId: 'BUS-312',
    event: 'Door cycle obstacle alert',
    confidence: 89,
    verificationStatus: 'VERIFIED',
    severity: 'HIGH',
    trackId: 'P-031',
    camera: 'CAM-04',
    location: 'Central Station Terminal A3',
    category: 'passenger'
  },
  {
    id: 'EV-1004',
    timestamp: '13:50:11',
    busId: 'BUS-418',
    event: 'Bus stop dwell time clearance',
    confidence: 99,
    verificationStatus: 'VERIFIED',
    severity: 'LOW',
    trackId: 'BUS-418',
    camera: 'CAM-03',
    location: 'OMR Sholinganallur',
    category: 'traffic'
  },
  {
    id: 'EV-1003',
    timestamp: '13:42:00',
    busId: 'BUS-117',
    event: 'Potential visual match correlation',
    confidence: 87,
    verificationStatus: 'PENDING_REVIEW',
    severity: 'HIGH',
    trackId: 'P-088',
    camera: 'CAM-04',
    location: 'Kathipara Grade Separator',
    category: 'safety'
  }
];

export const ROAD_DEFECTS: RoadDefect[] = [
  {
    id: 'DEF-801',
    defectType: 'Pothole',
    location: 'Poonamallee High Road near Shenoy Nagar',
    severity: 'CRITICAL',
    busId: 'BUS-104',
    camera: 'CAM-01 (Front Road)',
    confidence: 95,
    status: 'NEW',
    detectedTime: '13:42:10',
    actionRequired: 'Asphalt cold patch required urgently; risk to two-wheelers',
    depthEstimatedMm: 85,
    surfaceAreaSqM: 0.72,
    coordinates: [13.0789, 80.2241],
    evidenceId: 'EVT-7F31A9'
  },
  {
    id: 'DEF-802',
    defectType: 'Missing Divider',
    location: 'Kathipara Flyover North Ingress Lane',
    severity: 'CRITICAL',
    busId: 'BUS-117',
    camera: 'CAM-01 (Front Road)',
    confidence: 96,
    status: 'UNDER_REVIEW',
    detectedTime: '13:10:45',
    actionRequired: 'Median concrete barrier displaced by 1.8m into fast corridor',
    coordinates: [13.0067, 80.2018],
    evidenceId: 'EVT-1A9903'
  },
  {
    id: 'DEF-803',
    defectType: 'Waterlogging',
    location: 'Velachery MRTS Underpass Subway',
    severity: 'HIGH',
    busId: 'BUS-418',
    camera: 'CAM-01 (Front Road)',
    confidence: 93,
    status: 'ASSIGNED',
    detectedTime: '09:15:30',
    actionRequired: 'Pump deployment requested; water depth 180mm',
    surfaceAreaSqM: 42.0,
    coordinates: [12.9785, 80.2184],
    evidenceId: 'EVT-6D2088'
  },
  {
    id: 'DEF-804',
    defectType: 'Damaged Traffic Sign',
    location: 'Anna Salai Mount Road near Spencers Plaza',
    severity: 'MEDIUM',
    busId: 'BUS-104',
    camera: 'CAM-01 (Front Road)',
    confidence: 94,
    status: 'UNDER_REVIEW',
    detectedTime: '11:20:00',
    actionRequired: 'No Right Turn sign bent 45 degrees, obstructed by tree branch',
    coordinates: [13.0612, 80.2611],
    evidenceId: 'EVT-7F31A9'
  },
  {
    id: 'DEF-805',
    defectType: 'Missing Zebra Crossing',
    location: 'Central Station Terminal Gate 2 Pedestrian Ingress',
    severity: 'HIGH',
    busId: 'BUS-312',
    camera: 'CAM-01 (Front Road)',
    confidence: 91,
    status: 'NEW',
    detectedTime: '12:05:14',
    actionRequired: 'Thermoplastic repaint required; worn down <15% visibility',
    coordinates: [13.0827, 80.2757],
    evidenceId: 'EVT-9E12F4'
  },
  {
    id: 'DEF-806',
    defectType: 'Road Obstacle',
    location: 'Anna Nagar West Roundabout Sector 4',
    severity: 'CRITICAL',
    busId: 'BUS-207',
    camera: 'CAM-01 (Front Road)',
    confidence: 92,
    status: 'ASSIGNED',
    detectedTime: '13:54:10',
    actionRequired: 'Loose metal construction scaffolding on road margin',
    coordinates: [13.0850, 80.2101],
    evidenceId: 'EVT-4C88B2'
  }
];

export const TRAFFIC_HOTSPOTS: TrafficHotspot[] = [
  {
    id: 'HOT-101',
    location: 'Kathipara Grade Separator (Junction 5)',
    density: 'VERY_HIGH',
    densityPct: 92,
    averageSpeedKmH: 14.2,
    estimatedDelayMin: 18,
    bottleneckCause: 'Multi-corridor convergence (GST Rd + Inner Ring Rd + 100 Ft Rd)',
    busReportsCount: 24,
    vehicleComposition: {
      carsPct: 41,
      twoWheelersPct: 39,
      autoRickshawsPct: 11,
      busesPct: 6,
      trucksPct: 3
    },
    hourlyTrend: [
      { hour: '09:00', speed: 12, volume: 420 },
      { hour: '10:00', speed: 10, volume: 480 },
      { hour: '11:00', speed: 18, volume: 390 },
      { hour: '12:00', speed: 24, volume: 310 },
      { hour: '13:00', speed: 20, volume: 340 },
      { hour: '14:00', speed: 14, volume: 460 }
    ]
  },
  {
    id: 'HOT-102',
    location: 'Anna Salai / Nandanam Junction',
    density: 'HIGH',
    densityPct: 84,
    averageSpeedKmH: 19.5,
    estimatedDelayMin: 11,
    bottleneckCause: 'Metro station construction diversion & lane constriction',
    busReportsCount: 18,
    vehicleComposition: {
      carsPct: 46,
      twoWheelersPct: 34,
      autoRickshawsPct: 12,
      busesPct: 7,
      trucksPct: 1
    },
    hourlyTrend: [
      { hour: '09:00', speed: 15, volume: 390 },
      { hour: '10:00', speed: 14, volume: 410 },
      { hour: '11:00', speed: 22, volume: 330 },
      { hour: '12:00', speed: 26, volume: 290 },
      { hour: '13:00', speed: 24, volume: 305 },
      { hour: '14:00', speed: 19, volume: 380 }
    ]
  },
  {
    id: 'HOT-103',
    location: 'OMR Tidal Park Signal (Taramani)',
    density: 'HIGH',
    densityPct: 78,
    averageSpeedKmH: 22.0,
    estimatedDelayMin: 9,
    bottleneckCause: 'IT Corridor peak shift change & signal cycle imbalance',
    busReportsCount: 15,
    vehicleComposition: {
      carsPct: 52,
      twoWheelersPct: 35,
      autoRickshawsPct: 8,
      busesPct: 4,
      trucksPct: 1
    },
    hourlyTrend: [
      { hour: '09:00', speed: 18, volume: 360 },
      { hour: '10:00', speed: 16, volume: 390 },
      { hour: '11:00', speed: 28, volume: 280 },
      { hour: '12:00', speed: 32, volume: 240 },
      { hour: '13:00', speed: 30, volume: 260 },
      { hour: '14:00', speed: 22, volume: 350 }
    ]
  }
];

export const MISSING_PERSON_CASES: MissingPersonCase[] = [
  {
    caseId: 'MP-2026-014',
    name: 'Authorized Search: Child Alert (Ref #A-901)',
    age: 11,
    gender: 'Male',
    reportedDate: '2026-09-20 09:30 UTC',
    lastKnownLocation: 'Anna Nagar West Primary School Gate',
    authorizedAgency: 'Greater Chennai Police — Missing Child Protection Unit',
    caseStatus: 'UNDER_HUMAN_REVIEW',
    photoDescription: 'Yellow striped collar t-shirt, blue school bag, black sandals',
    physicalMarkers: ['Approx 135cm height', 'Yellow pattern shirt', 'Blue satchel bag'],
    potentialMatches: [
      {
        matchId: 'MATCH-001',
        busId: 'BUS-117',
        camera: 'CAM-04 (Cabin Safety Camera)',
        timestamp: '10:47:05 UTC',
        location: 'Anna Nagar West / Koyambedu Connector',
        confidence: 87,
        trackingId: 'P-088',
        humanVerificationStatus: 'HUMAN_VERIFICATION_REQUIRED',
        officerNotes: 'Visual similarity high on clothing pattern and satchel shape. Awaiting station officer visual confirmation at CMBT Terminal.',
        evidenceFrameId: 'EVT-1A9903'
      },
      {
        matchId: 'MATCH-002',
        busId: 'BUS-207',
        camera: 'CAM-03 (Sidewalk Ingress)',
        timestamp: '10:12:30 UTC',
        location: 'Thirumangalam Metro Station Footpath',
        confidence: 76,
        trackingId: 'P-074',
        humanVerificationStatus: 'HUMAN_VERIFICATION_REQUIRED',
        officerNotes: 'Brief sidewalk occlusion. Confidence below automatic threshold; human review queued.',
        evidenceFrameId: 'EVT-4C88B2'
      }
    ]
  },
  {
    caseId: 'MP-2026-009',
    name: 'Authorized Search: Senior Citizen Alert',
    age: 74,
    gender: 'Female',
    reportedDate: '2026-09-19 16:00 UTC',
    lastKnownLocation: 'Mylapore Tank Bus Terminus',
    authorizedAgency: 'Tamil Nadu Senior Citizen Helpline / Police',
    caseStatus: 'ACTIVE_SEARCH',
    photoDescription: 'Green cotton saree, walking cane, silver spectacles',
    physicalMarkers: ['Slow gait with walking cane', 'Green textile profile'],
    potentialMatches: []
  }
];

export const VEHICLE_INTELLIGENCE_RECORDS: VehicleIntelligenceRecord[] = [
  {
    searchId: 'VEH-INVEST-402',
    vehicleType: 'Van',
    color: 'White / Silver Trim',
    licensePlateAnonymized: 'TN-09-AX-****',
    lastDetected: '11:03:15',
    sourceBus: 'BUS-309',
    camera: 'CAM-01 (Front Road)',
    heading: 'South towards Tambaram (210°)',
    confidence: 96,
    incidentCorrelation: 'INC-2026-078 (Hit & Run at Poonamallee High Road)',
    trail: [
      {
        busId: 'BUS-204',
        time: '10:42',
        location: 'Poonamallee High Road (Impact Site)',
        speed: 54,
        confidence: 96
      },
      {
        busId: 'BUS-117',
        time: '10:51',
        location: 'Koyambedu Grade Separator (Rapid transit)',
        speed: 58,
        confidence: 92
      },
      {
        busId: 'BUS-309',
        time: '11:03',
        location: 'Kathipara Flyover Ingress',
        speed: 48,
        confidence: 89
      }
    ]
  }
];

export const STOP_SAFETY_PROFILES: StopSafetyProfile[] = [
  {
    id: 'STOP-01',
    stopName: 'Ambattur Feeder Depot Stop',
    route: 'Route 70A Feeder',
    safetyScore: 62,
    lightingCondition: 'LOW',
    crowdDensity: 'SPARSE',
    recentAlertsCount: 1,
    status: 'ATTENTION',
    lastPatrolTime: '13:15 UTC',
    cabinSafetyIndicators: 'Interior cabin lighting normal; platform shadow zone detected by CAM-03',
    recommendedAction: 'Alert GCC Electrical Dept for streetlamp restoration; schedule transit police check.'
  },
  {
    id: 'STOP-02',
    stopName: 'Guindy Race Course Transit Platform',
    route: 'Route 12 Corridor',
    safetyScore: 88,
    lightingCondition: 'HIGH',
    crowdDensity: 'MODERATE',
    recentAlertsCount: 0,
    status: 'NORMAL',
    lastPatrolTime: '13:45 UTC',
    cabinSafetyIndicators: 'Continuous CCTV coverage; active emergency SOS pillar online',
    recommendedAction: 'Standard monitoring.'
  },
  {
    id: 'STOP-03',
    stopName: 'Central Station Terminal A3 Bay',
    route: 'Route 19B',
    safetyScore: 74,
    lightingCondition: 'ADEQUATE',
    crowdDensity: 'CROWDED',
    recentAlertsCount: 2,
    status: 'ATTENTION',
    lastPatrolTime: '13:50 UTC',
    cabinSafetyIndicators: 'Heavy boarding surge; multiple door proximity alerts detected',
    recommendedAction: 'Deploy marshals during 14:00 - 15:30 turnaround.'
  },
  {
    id: 'STOP-04',
    stopName: 'OMR Sholinganallur Junction Shelter',
    route: 'Route 570',
    safetyScore: 92,
    lightingCondition: 'HIGH',
    crowdDensity: 'MODERATE',
    recentAlertsCount: 0,
    status: 'NORMAL',
    lastPatrolTime: '14:00 UTC',
    cabinSafetyIndicators: 'All 4 bus cameras online; clear platform line-of-sight',
    recommendedAction: 'Standard operational sweep.'
  }
];

export const TRACKED_PEOPLE: TrackedPerson[] = [
  {
    id: 'P-024',
    label: 'Passenger P-024 (Aisle Kinematic Re-ID)',
    firstDetected: '14:02:04',
    lastDetected: '14:23:18',
    busId: 'BUS-104',
    confidence: 97,
    status: 'ACTIVE_TRANSIT',
    dwellTimeSeconds: 1274,
    trajectory: [
      {
        point: 'BUS-104 (Poonamallee High Road)',
        time: '10:42',
        busId: 'BUS-104',
        type: 'BOARDED',
        detail: 'Entered via front boarding door, CAM-02 optical flow',
        confidence: 98,
        camera: 'CAM-02'
      },
      {
        point: 'Transit Point (Anna Salai Metro Interchange)',
        time: '10:51',
        busId: 'BUS-104',
        type: 'TRANSFER',
        detail: 'Disembarked at multi-modal platform B4; temporal correlation ±12s',
        confidence: 94,
        camera: 'CAM-03'
      },
      {
        point: 'BUS-309 (Kathipara Corridor Ingress)',
        time: '11:03',
        busId: 'BUS-309',
        type: 'TRANSIT',
        detail: 'Kinematic trajectory matched at platform transfer bay',
        confidence: 91,
        camera: 'CAM-04'
      }
    ]
  },
  {
    id: 'P-031',
    label: 'Passenger P-031 (Doorway Ingress)',
    firstDetected: '13:47:30',
    lastDetected: '13:56:45',
    busId: 'BUS-312',
    confidence: 93,
    status: 'EXITED',
    dwellTimeSeconds: 555,
    trajectory: [
      {
        point: 'Central Station Terminal A3',
        time: '13:48',
        busId: 'BUS-312',
        type: 'SAFETY_FLAG',
        detail: 'Instability logged during bus turn entry',
        confidence: 93,
        camera: 'CAM-04'
      },
      {
        point: 'Central Station Main Gate',
        time: '13:56',
        busId: 'BUS-312',
        type: 'TRANSIT',
        detail: 'Normal departure verified by station exit camera',
        confidence: 89,
        camera: 'CAM-03'
      }
    ]
  },
  {
    id: 'P-042',
    label: 'Passenger P-042 (Seated Cabin Forward)',
    firstDetected: '13:30:12',
    lastDetected: '14:12:00',
    busId: 'BUS-104',
    confidence: 96,
    status: 'ACTIVE_TRANSIT',
    dwellTimeSeconds: 2508,
    trajectory: [
      {
        point: 'Guindy Industrial Estate Stop',
        time: '13:30',
        busId: 'BUS-104',
        type: 'BOARDED',
        detail: 'Seated row 3 right side window',
        confidence: 96,
        camera: 'CAM-04'
      },
      {
        point: 'Anna Salai Corridor',
        time: '14:02',
        busId: 'BUS-104',
        type: 'TRANSIT',
        detail: 'Neutral witness to deceleration event',
        confidence: 95,
        camera: 'CAM-04'
      }
    ]
  }
];

export const DEMO_PROVENANCE_NODES: ProvenanceNode[] = [
  {
    id: 'prov-1',
    stepNumber: 1,
    label: 'Camera Source',
    subtitle: 'Hardware capture device validation',
    timestamp: '2026-09-20 14:02:18.112 UTC',
    hash: 'cam_hw_9a2f7188b0',
    status: 'VERIFIED',
    verifiedDetails: [
      'Device MAC: 00:1B:44:11:3A:F8',
      'Model: Axis P3935-LR Onboard Bus Cam',
      'Optical calibration profile #C-88 verified',
      'Firmware: v2.4.11-hardened (Signed)'
    ],
    technicalData: {
      'Sensor ID': 'SENSOR-BUS104-CAM04',
      'Firmware Build': '2.4.11-sha256-signed',
      'Aperture / Exposure': 'f/1.6, 1/250s auto-ISO',
      'Hardware Tamper Seal': 'UNCOMPROMISED (Hardware Enclave)'
    }
  },
  {
    id: 'prov-2',
    stepNumber: 2,
    label: 'Video Input',
    subtitle: 'Continuous stream reel segment',
    timestamp: '2026-09-20 14:02:18.240 UTC',
    hash: 'stream_seg_812c9d',
    status: 'VERIFIED',
    verifiedDetails: [
      'H.265 Main Profile @ Level 4.1',
      'Bitrate: 8,420 kbps constant',
      'Zero dropped frames in 60s buffer',
      'Watermark SHA-256 header matched'
    ],
    technicalData: {
      'Stream Chunk ID': 'CHUNK-20260920-140218-104',
      'Resolution': '1920x1080 @ 30fps',
      'Audio Carrier': 'AAC-LC 48kHz (Cabin telemetry mute)',
      'Ingress Buffer Delay': '42ms'
    }
  },
  {
    id: 'prov-3',
    stepNumber: 3,
    label: 'Frame Extraction',
    subtitle: 'Atomic keyframe capture (#4,289)',
    timestamp: '2026-09-20 14:02:18.304 UTC',
    hash: 'frame_sha_e4179b0',
    status: 'VERIFIED',
    verifiedDetails: [
      'Frame #4,289 isolated',
      'NTP synchronization drift: <0.4ms',
      'Raw pixel tensor checksum validated',
      'RGB 8-bit normalized'
    ],
    technicalData: {
      'Frame Index': '4289 / 90000',
      'Color Space': 'sRGB ITU-R BT.709',
      'NTP Reference': 'time.google.com (Stratum 1)',
      'Pixel Hash': 'e4179b0cc8129841fa00921bb8831'
    }
  },
  {
    id: 'prov-4',
    stepNumber: 4,
    label: 'AI Model',
    subtitle: 'AEROVIS Vision Engine v1.4-edge',
    timestamp: '2026-09-20 14:02:18.322 UTC',
    hash: 'model_weights_77f0a',
    status: 'VERIFIED',
    verifiedDetails: [
      'Model: AEROVIS-Vision-v1.4-TensorRT',
      'Weight manifest: SHA-256 validated',
      'Quantization: INT8 TensorRT calibrated',
      'Edge TPU acceleration confirmed'
    ],
    technicalData: {
      'Architecture': 'YOLO-World + ByteTrack + Spatial Pose',
      'Parameters': '48.2M INT8 Quantized',
      'Weights Hash': '77f0a12e8b91cc098124faee09',
      'Inference Engine': 'NVIDIA TensorRT 10.2'
    }
  },
  {
    id: 'prov-5',
    stepNumber: 5,
    label: 'Inference',
    subtitle: 'Bounding boxes & class probabilities',
    timestamp: '2026-09-20 14:02:18.341 UTC',
    hash: 'infer_log_d9910c',
    status: 'VERIFIED',
    verifiedDetails: [
      'Latency: 19ms compute time',
      'Passenger Stumble confidence: 94.2%',
      'Kinematic vector: -4.2 m/s² correlation',
      'Non-maximum suppression IoU 0.65'
    ],
    technicalData: {
      'Inference Time': '19.14 ms',
      'Bounding Boxes Detected': '3 entities',
      'Keypoint Skeletal Count': '17 body landmarks',
      'Confidence Matrix': 'Max: 0.98, Min: 0.88'
    }
  },
  {
    id: 'prov-6',
    stepNumber: 6,
    label: 'Event Generation',
    subtitle: 'Safety incident rule correlation',
    timestamp: '2026-09-20 14:02:18.360 UTC',
    hash: 'event_rec_3309a1',
    status: 'VERIFIED',
    verifiedDetails: [
      'Safety Rule #SR-409 triggered',
      'Longitudinal Jerk threshold exceeded',
      'Assigned Severity: SAFETY ALERT (Medium)',
      'Incident ID INC-2026-091 created'
    ],
    technicalData: {
      'Rule Engine': 'AEROVIS Temporal Complex Event Processor',
      'Telemetry Sync': 'CAN-Bus Brake Pressure 48 bar',
      'Audit Trigger': 'RULE_CABIN_STUMBLE_DECEL',
      'Event UUID': '550e8400-e29b-41d4-a716-446655440000'
    }
  },
  {
    id: 'prov-7',
    stepNumber: 7,
    label: 'Evidence Record',
    subtitle: 'Cryptographically sealed dossier',
    timestamp: '2026-09-20 14:02:18.410 UTC',
    hash: 'a84f59c19b02e731d8e124802b1154f91d2',
    status: 'VERIFIED',
    verifiedDetails: [
      'Evidence ID: EVT-7F31A9',
      'Input SHA-256 seal: a84f...91d2',
      'S3 Object Lock Compliance retention applied',
      'AWS KMS master key signature affixed'
    ],
    technicalData: {
      'S3 Bucket': 's3://aerovis-evidence-vault-ap-south-1/2026/09/20/',
      'Object Lock': 'COMPLIANCE MODE (7-Year Legal Hold)',
      'KMS Key ARN': 'arn:aws:kms:ap-south-1:481539128801:key/aerovis-sec',
      'Verification Status': 'VERIFIED BY BACKEND'
    }
  }
];

export const INITIAL_EVIDENCE_RECORDS: EvidenceRecord[] = [
  {
    id: 'EVT-7F31A9',
    incidentId: 'INC-2026-091',
    title: 'Sealed Cabin Telemetry & Keyframe Dossier',
    sourceCamera: 'CAM-04 (Cabin Safety Camera)',
    busId: 'BUS-104',
    timestamp: '2026-09-20 14:02:18 UTC',
    ntpSynced: true,
    model: 'AEROVIS Vision Engine v1.4-edge',
    confidence: 94,
    inputHash: 'a84f59c19b02e731d8e124802b1154f91d2',
    frameNumber: 4289,
    frameHash: 'e4179b0cc8129841fa00921bb8831',
    cryptographicSignature: 'sig_rsa_4096_8192a_sealed',
    kmsKeyId: 'arn:aws:kms:ap-south-1:481539128801:key/aerovis-sec',
    s3Uri: 's3://aerovis-evidence-vault-ap-south-1/2026/09/20/EVT-7F31A9.pkg',
    verificationStatus: 'VERIFIED',
    boundingBoxes: [
      {
        id: 'bb-1',
        label: 'Passenger Stumble',
        trackId: 'P-024',
        x: 42,
        y: 35,
        width: 16,
        height: 48,
        confidence: 94,
        category: 'person'
      }
    ],
    provenanceChain: DEMO_PROVENANCE_NODES
  },
  {
    id: 'EVT-4C88B2',
    incidentId: 'INC-2026-089',
    title: 'Roadwork Corridor Obstacle Keyframe Dossier',
    sourceCamera: 'CAM-01 (External Front 4K HDR)',
    busId: 'BUS-207',
    timestamp: '2026-09-20 13:54:10 UTC',
    ntpSynced: true,
    model: 'AEROVIS Vision Engine v1.4-edge',
    confidence: 91,
    inputHash: 'fe20993bc510e11894d0763bbad7721840c',
    frameNumber: 2110,
    frameHash: 'cc10984ba1024e819b4412c01994',
    cryptographicSignature: 'sig_rsa_4096_4412e_sealed',
    kmsKeyId: 'arn:aws:kms:ap-south-1:481539128801:key/aerovis-sec',
    s3Uri: 's3://aerovis-evidence-vault-ap-south-1/2026/09/20/EVT-4C88B2.pkg',
    verificationStatus: 'VERIFIED',
    boundingBoxes: [
      {
        id: 'bb-2',
        label: 'Road Hazard / Debris',
        trackId: 'HZ-009',
        x: 55,
        y: 52,
        width: 22,
        height: 28,
        confidence: 91,
        category: 'hazard'
      }
    ],
    provenanceChain: DEMO_PROVENANCE_NODES
  },
  {
    id: 'EVT-9E12F4',
    incidentId: 'INC-2026-085',
    title: 'Boarding Door Proximity & Pose Estimation Dossier',
    sourceCamera: 'CAM-04 (Interior Center Aisle)',
    busId: 'BUS-312',
    timestamp: '2026-09-20 13:48:02 UTC',
    ntpSynced: true,
    model: 'AEROVIS Vision Engine v1.4-edge',
    confidence: 87,
    inputHash: '77d3aa05e94b21008cbef3219488a104cb3',
    frameNumber: 890,
    frameHash: '88ab2194091ca02213e4',
    cryptographicSignature: 'sig_rsa_4096_7718b_sealed',
    kmsKeyId: 'arn:aws:kms:ap-south-1:481539128801:key/aerovis-sec',
    s3Uri: 's3://aerovis-evidence-vault-ap-south-1/2026/09/20/EVT-9E12F4.pkg',
    verificationStatus: 'VERIFIED',
    boundingBoxes: [
      {
        id: 'bb-3',
        label: 'Passenger Disbalance',
        trackId: 'P-031',
        x: 36,
        y: 28,
        width: 20,
        height: 54,
        confidence: 87,
        category: 'person'
      }
    ],
    provenanceChain: DEMO_PROVENANCE_NODES
  },
  {
    id: 'EVT-1A9903',
    incidentId: 'INC-2026-078',
    title: 'Cross-Fleet Hit & Run Multi-Camera Ingestion Package',
    sourceCamera: 'CAM-02 (Rear Traffic 1080p)',
    busId: 'BUS-117',
    timestamp: '2026-09-20 10:42:15 UTC',
    ntpSynced: true,
    model: 'AEROVIS Vision Engine v1.4-edge',
    confidence: 96,
    inputHash: '99bf44318c504a77e112d098ba43219f',
    frameNumber: 15400,
    frameHash: '5510c8192a0011bba8714',
    cryptographicSignature: 'sig_rsa_4096_1189c_sealed',
    kmsKeyId: 'arn:aws:kms:ap-south-1:481539128801:key/aerovis-sec',
    s3Uri: 's3://aerovis-evidence-vault-ap-south-1/2026/09/20/EVT-1A9903.pkg',
    verificationStatus: 'VERIFIED',
    boundingBoxes: [
      {
        id: 'bb-4',
        label: 'Commercial Vehicle Fled',
        trackId: 'VEH-402',
        x: 48,
        y: 40,
        width: 26,
        height: 32,
        confidence: 96,
        category: 'vehicle'
      }
    ],
    provenanceChain: DEMO_PROVENANCE_NODES
  }
];

export const DEMO_TIMELINE_POINTS: TimelineDetectionPoint[] = [
  {
    timeOffset: '00:04',
    second: 4,
    title: 'P-024 detected',
    trackId: 'P-024',
    type: 'detection',
    severity: 'LOW',
    confidence: 98,
    description: 'Passenger P-024 identified via frontal pose estimation while boarding.',
    boundingBoxes: [
      {
        id: 'bb-t1',
        label: 'Person (P-024)',
        trackId: 'P-024',
        x: 38,
        y: 30,
        width: 14,
        height: 44,
        confidence: 98,
        category: 'person'
      }
    ]
  },
  {
    timeOffset: '00:09',
    second: 9,
    title: 'P-024 tracked',
    trackId: 'P-024',
    type: 'tracking',
    severity: 'LOW',
    confidence: 96,
    description: 'Continuous ByteTrack trajectory maintained across cabin lighting variation.',
    boundingBoxes: [
      {
        id: 'bb-t2',
        label: 'Person (P-024) Tracked',
        trackId: 'P-024',
        x: 40,
        y: 32,
        width: 15,
        height: 46,
        confidence: 96,
        category: 'person'
      },
      {
        id: 'bb-t2-2',
        label: 'Person (P-042)',
        trackId: 'P-042',
        x: 65,
        y: 42,
        width: 14,
        height: 40,
        confidence: 95,
        category: 'person'
      }
    ]
  },
  {
    timeOffset: '00:16',
    second: 16,
    title: 'P-024 enters region',
    trackId: 'P-024',
    type: 'zone',
    severity: 'MEDIUM',
    confidence: 95,
    description: 'Passenger entered designated unseated aisle corridor without holding safety handrails.',
    boundingBoxes: [
      {
        id: 'bb-t3',
        label: 'P-024 In Dynamic Corridor',
        trackId: 'P-024',
        x: 41,
        y: 34,
        width: 16,
        height: 47,
        confidence: 95,
        category: 'person'
      }
    ]
  },
  {
    timeOffset: '00:23',
    second: 23,
    title: 'Safety event generated',
    trackId: 'P-024',
    type: 'event',
    severity: 'CRITICAL',
    confidence: 94,
    description: 'Vehicle deceleration spike (-4.2 m/s²) caused passenger stumble; safety event generated & locked into evidence package.',
    boundingBoxes: [
      {
        id: 'bb-t4',
        label: 'Safety Alert: Passenger Stumble',
        trackId: 'P-024',
        x: 42,
        y: 35,
        width: 16,
        height: 48,
        confidence: 94,
        category: 'person'
      },
      {
        id: 'bb-t4-2',
        label: 'Vehicle Decel Vector (-4.2m/s²)',
        trackId: 'VEH-104',
        x: 10,
        y: 82,
        width: 25,
        height: 12,
        confidence: 99,
        category: 'vehicle'
      }
    ]
  }
];

export const AWS_SERVICES_STATUS = [
  {
    id: 's3',
    service: 'Amazon S3',
    role: 'Tamper-Evident Evidence Vault',
    status: 'Configured',
    statusType: 'prototype' as const,
    region: 'ap-south-1 (Mumbai)',
    details: 'Object Lock (Compliance Mode) + KMS Server-Side Encryption enabled',
    metrics: '248 Evidence Packages Staged'
  },
  {
    id: 'dynamodb',
    service: 'Amazon DynamoDB',
    role: 'Event Metadata & Provenance Store',
    status: 'Configured',
    statusType: 'prototype' as const,
    region: 'ap-south-1 (Mumbai)',
    details: 'Single-table design with GSI on BusId-Timestamp and EventType',
    metrics: '1,284 Event Records Partitioned'
  },
  {
    id: 'apigateway',
    service: 'Amazon API Gateway',
    role: 'Fleet Ingestion & Query Endpoint',
    status: 'Configured',
    statusType: 'prototype' as const,
    region: 'ap-south-1 (Mumbai)',
    details: 'mTLS Client-Certificate authentication for bus edge units',
    metrics: 'p99 Latency: 22ms'
  },
  {
    id: 'lambda',
    service: 'AWS Lambda',
    role: 'Serverless Event Processing & Verification',
    status: 'Configured',
    statusType: 'prototype' as const,
    region: 'ap-south-1 (Mumbai)',
    details: 'Python 3.12 runtime with OpenVINO / ONNX runtime layer',
    metrics: 'Concurrency: 100 provisioned'
  }
];

export const INITIAL_REPORT_REQUESTS: IntelligenceReportRequest[] = [
  {
    id: 'REP-2026-001',
    reportType: 'Road Maintenance Report',
    dateRange: 'Past 7 Days',
    location: 'Chennai Central & Anna Salai Corridors',
    incidentType: 'Potholes, Road Debris, Missing Dividers',
    agency: 'Greater Chennai Corporation (GCC)',
    busId: 'All Active Buses',
    severity: 'CRITICAL & HIGH',
    generatedAt: '2026-09-20 12:00 UTC',
    summary: 'Identified 18 high-priority road surface defects across 4 primary bus transit corridors with photographic GPS coordinates.',
    recordsCount: 18
  },
  {
    id: 'REP-2026-002',
    reportType: 'Traffic Incident Report',
    dateRange: 'Past 24 Hours',
    location: 'Kathipara Grade Separator & Poonamallee Rd',
    incidentType: 'Hit & Run, Sudden Deceleration, Bottlenecks',
    agency: 'Greater Chennai Traffic Police',
    busId: 'BUS-104, BUS-117, BUS-204',
    severity: 'All Severities',
    generatedAt: '2026-09-20 11:30 UTC',
    summary: 'Cross-fleet movement correlation reconstructed for hit-and-run incident INC-2026-078 across 3 bus visual sightings.',
    recordsCount: 34
  },
  {
    id: 'REP-2026-003',
    reportType: 'Evidence Dossier',
    dateRange: 'Current Operational Shift',
    location: 'Fleet Wide',
    incidentType: 'Verified Evidence Records',
    agency: 'Metropolitan Transport Corporation (MTC)',
    busId: 'All Monitored Fleet',
    severity: 'VERIFIED ONLY',
    generatedAt: '2026-09-20 14:05 UTC',
    summary: 'Cryptographic audit manifest of 4 sealed evidence packages with SHA-256 validation certificates.',
    recordsCount: 4
  }
];

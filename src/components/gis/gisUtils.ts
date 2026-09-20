export interface CityPreset {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  corridors: string[];
}

export const CITY_PRESETS: CityPreset[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    lat: 13.0827,
    lng: 80.2707,
    zoom: 11.5,
    corridors: ['Anna Salai', 'OMR Expressway', 'Poonamallee High Rd', 'GST Road']
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    zoom: 11.5,
    corridors: ['Outer Ring Road', 'Hosur Road', 'Bellary Road', 'Old Airport Road']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    zoom: 11.5,
    corridors: ['Western Express Hwy', 'Eastern Express Hwy', 'SV Road', 'Bandra-Worli']
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    zoom: 11.5,
    corridors: ['Ring Road', 'Outer Ring Road', 'NH-48', 'Mathura Road']
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    zoom: 12,
    corridors: ['Market Street', 'Van Ness Ave', 'Geary Blvd', '101 Bayshore']
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    zoom: 11.5,
    corridors: ['A40 Oxford St', 'A10 Kingsland', 'A3 Southwark', 'A13 Commercial Rd']
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    zoom: 12,
    corridors: ['PIE Expressway', 'AYE Corridor', 'CTE Tunnel', 'Orchard Corridor']
  }
];

// Helper to reverse geocode user coordinates into city name
export async function reverseGeocodeCity(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'AEROVIS-Transit-Intelligence/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.municipality || addr.county || addr.state || 'Local Metro Area';
      const country = addr.country || '';
      return country ? `${city}, ${country}` : city;
    }
  } catch {
    // ignore network error and fall back
  }
  return `City (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
}

// Generate realistic localized fleet items distributed across the user's city
export function getCityLocalizedItems(centerLat: number, centerLng: number) {
  // Dispersal radius for whole-city scale (~12-18km radius)
  const busOffsets = [
    { lat: 0.025, lng: 0.015, route: 'Line 104 - City Central Express' },
    { lat: -0.035, lng: 0.042, route: 'Line 207 - IT & Tech Corridor' },
    { lat: 0.048, lng: -0.032, route: 'Line 312 - Western Arterial' },
    { lat: -0.018, lng: -0.045, route: 'Line 405 - Harbor / Metro Ring' },
    { lat: 0.062, lng: 0.028, route: 'Line 518 - Northern Suburban' },
    { lat: -0.055, lng: -0.012, route: 'Line 119 - South Transit Link' }
  ];

  const defectOffsets = [
    { lat: 0.018, lng: 0.022, type: 'Pothole', severity: 'HIGH' as const, label: 'Deep Pothole on Median Lane' },
    { lat: -0.022, lng: 0.031, type: 'Road Damage', severity: 'CRITICAL' as const, label: 'Asphalt Subsidence near Intersection' },
    { lat: 0.038, lng: -0.019, type: 'Waterlogging', severity: 'MEDIUM' as const, label: 'Stormwater Accumulation' },
    { lat: -0.041, lng: -0.028, type: 'Missing Divider', severity: 'LOW' as const, label: 'Damaged Reflector Bollard' }
  ];

  const incidentOffsets = [
    { lat: 0.012, lng: 0.008, title: 'Sudden Braking & Near Collision', severity: 'HIGH' as const, bus: 'BUS-104' },
    { lat: -0.028, lng: 0.019, title: 'Bus Lane Encroachment Hazard', severity: 'MEDIUM' as const, bus: 'BUS-207' },
    { lat: 0.045, lng: -0.025, title: 'SOS Pillar Signal Triggered', severity: 'CRITICAL' as const, bus: 'BUS-312' }
  ];

  const hotspotOffsets = [
    { lat: 0.015, lng: 0.025, name: 'Downtown Central Junction', congestion: '88% Peak Congestion', speed: '11 km/h' },
    { lat: -0.032, lng: 0.038, name: 'Tech Park Expressway Toll Gate', congestion: '92% Heavy Bottleneck', speed: '9 km/h' },
    { lat: 0.042, lng: -0.018, name: 'Metro Interchange Overpass', congestion: '74% Moderate Flow', speed: '18 km/h' }
  ];

  const busStops = [
    { name: 'City Central Station', lat: centerLat + 0.008, lng: centerLng + 0.005 },
    { name: 'Metro Civic Plaza', lat: centerLat - 0.015, lng: centerLng + 0.018 },
    { name: 'University Campus Gate', lat: centerLat + 0.032, lng: centerLng - 0.012 },
    { name: 'Financial Hub Bus Terminal', lat: centerLat - 0.029, lng: centerLng + 0.035 },
    { name: 'Grand West Avenue', lat: centerLat + 0.022, lng: centerLng - 0.038 },
    { name: 'South Harbor Junction', lat: centerLat - 0.042, lng: centerLng - 0.015 }
  ];

  return {
    busOffsets,
    defectOffsets,
    incidentOffsets,
    hotspotOffsets,
    busStops
  };
}

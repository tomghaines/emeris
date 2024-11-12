interface Satellite {
  _id: string;
  satelliteId: number;
  name: string;
  date: string;
  longitudeDeg: number;
  latitudeDeg: number;
  height: number;
  velocity: number;
  elevation: number;
  azimuth: number;
  rangeSat: number;
  doppler: number;
  heading: number;
  lastUpdateTimestamp: string;
}

const EARTH_RADIUS = 6371; // km
const EARTH_MU = 398600.4418; // km³/s²
const EARTH_ROTATION_RATE = 360 / 86400; // degrees per second

const getSimulatedPosition = (
  satellite: Satellite,
  lastUpdateTimestamp: string
) => {
  if (!isValidSatelliteData(satellite)) {
    console.error('Invalid satellite data detected. Skipping simulation.');
    return null;
  }

  const elapsedTime =
    (Date.now() - new Date(lastUpdateTimestamp).getTime()) / 1000;

  // Generate a unique but consistent orbital parameter for each satellite
  const satelliteHash = hashCode(satellite._id);

  // Assign unique orbital characteristics based on satellite ID
  const orbitalParams = {
    inclination: 30 + (satelliteHash % 60), // Inclination between 30° and 90°
    phase: (satelliteHash % 360) * (Math.PI / 180), // Initial phase in radians
    period: calculateOrbitalPeriod(satellite.height),
    precessionRate: 0.5 + (satelliteHash % 100) / 100, // Unique precession rate
  };

  // Calculate position in orbit
  const meanMotion = (2 * Math.PI) / orbitalParams.period;
  const currentPhase =
    (meanMotion * elapsedTime + orbitalParams.phase) % (2 * Math.PI);

  // Calculate new position using orbital parameters
  const newPosition = calculateOrbitalPosition(
    satellite,
    currentPhase,
    orbitalParams.inclination,
    elapsedTime,
    orbitalParams.precessionRate
  );

  return {
    ...newPosition,
    velocity: satellite.velocity + Math.sin(currentPhase) * 0.1,
    elevation: satellite.elevation,
    azimuth: calculateAzimuth(
      newPosition.latitude,
      newPosition.longitude,
      currentPhase
    ),
    rangeSat: calculateRange(
      satellite.height,
      newPosition.latitude,
      newPosition.longitude
    ),
    doppler: satellite.doppler + Math.sin(currentPhase) * 100,
    heading: calculateHeading(
      satellite.latitudeDeg,
      satellite.longitudeDeg,
      newPosition.latitude,
      newPosition.longitude
    ),
  };
};

const calculateOrbitalPosition = (
  satellite: Satellite,
  phase: number,
  inclination: number,
  elapsedTime: number,
  precessionRate: number
): { latitude: number; longitude: number; height: number } => {
  // Convert inclination to radians
  const inclinationRad = (inclination * Math.PI) / 180;

  // Calculate latitude variation
  const latitudeVariation = Math.sin(phase) * inclination;
  const newLatitude = normalizeLatitude(latitudeVariation);

  // Calculate longitude progression with precession
  const baseSpeed = satellite.velocity / (EARTH_RADIUS + satellite.height);
  const longitudeChange = (baseSpeed * elapsedTime * precessionRate) % 360;

  // Add some longitudinal variation based on latitude
  const longitudeVariation = Math.cos(phase) * 5;
  const newLongitude = normalizeLongitude(
    satellite.longitudeDeg + longitudeChange + longitudeVariation
  );

  // Add slight height variation
  const heightVariation = Math.sin(phase * 2) * 10;
  const newHeight = satellite.height + heightVariation;

  return {
    latitude: newLatitude,
    longitude: newLongitude,
    height: newHeight,
  };
};

// Helper function to generate consistent hash from satellite ID
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const calculateOrbitalPeriod = (height: number): number => {
  const radius = EARTH_RADIUS + height;
  return 2 * Math.PI * Math.sqrt(Math.pow(radius, 3) / EARTH_MU);
};

const normalizeLatitude = (lat: number): number => {
  return Math.max(-90, Math.min(90, lat));
};

const normalizeLongitude = (lon: number): number => {
  return ((lon + 180) % 360) - 180;
};

const calculateAzimuth = (lat: number, lon: number, phase: number): number => {
  const baseAzimuth =
    (Math.atan2(
      Math.sin((lon * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180),
      Math.sin((lat * Math.PI) / 180)
    ) *
      180) /
    Math.PI;

  return (baseAzimuth + 360) % 360;
};

const calculateRange = (height: number, lat: number, lon: number): number => {
  // Simple range calculation from Earth's center
  const x =
    (EARTH_RADIUS + height) *
    Math.cos((lat * Math.PI) / 180) *
    Math.cos((lon * Math.PI) / 180);
  const y =
    (EARTH_RADIUS + height) *
    Math.cos((lat * Math.PI) / 180) *
    Math.sin((lon * Math.PI) / 180);
  const z = (EARTH_RADIUS + height) * Math.sin((lat * Math.PI) / 180);

  return Math.sqrt(x * x + y * y + z * z);
};

const calculateHeading = (
  oldLat: number,
  oldLon: number,
  newLat: number,
  newLon: number
): number => {
  const dLon = ((newLon - oldLon) * Math.PI) / 180;
  const oldLatRad = (oldLat * Math.PI) / 180;
  const newLatRad = (newLat * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(newLatRad);
  const x =
    Math.cos(oldLatRad) * Math.sin(newLatRad) -
    Math.sin(oldLatRad) * Math.cos(newLatRad) * Math.cos(dLon);

  const heading = (Math.atan2(y, x) * 180) / Math.PI;
  return (heading + 360) % 360;
};

const isValidSatelliteData = (satellite: Satellite): boolean => {
  return !(
    satellite.velocity > 1e5 ||
    satellite.height < 0 ||
    Math.abs(satellite.latitudeDeg) > 90 ||
    Math.abs(satellite.longitudeDeg) > 180 ||
    isNaN(satellite.latitudeDeg) ||
    isNaN(satellite.longitudeDeg) ||
    isNaN(satellite.velocity) ||
    isNaN(satellite.height) ||
    isNaN(satellite.elevation) ||
    isNaN(satellite.azimuth) ||
    isNaN(satellite.rangeSat) ||
    isNaN(satellite.doppler) ||
    isNaN(satellite.heading)
  );
};

export default getSimulatedPosition;

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
const getSimulatedPosition = (
  satellite: Satellite,
  lastUpdateTimestamp: string
) => {
  if (
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
  ) {
    console.error('Suspicious satellite data detected. Skipping simulation.');
    return null;
  }

  // Calculate elapsed time in seconds
  const elapsedTime =
    (Date.now() - new Date(lastUpdateTimestamp).getTime()) / 1000;

  // Distance traveled based on velocity and elapsed time
  const distanceTravelled = (satellite.velocity * elapsedTime) / 1000; // converting to km

  // Earth radius in kilometers
  const earthRadius = 6371;

  // Convert fixed heading to radians
  const headingRadians = (satellite.heading * Math.PI) / 180;

  // Calculate changes in latitude and longitude using spherical trigonometry
  const deltaLatitude =
    (distanceTravelled / earthRadius) *
    Math.cos(headingRadians) *
    (180 / Math.PI);
  const simulatedLatitude = satellite.latitudeDeg + deltaLatitude;

  const deltaLongitude =
    (distanceTravelled /
      (earthRadius * Math.cos((simulatedLatitude * Math.PI) / 180))) *
    Math.sin(headingRadians) *
    (180 / Math.PI);
  const simulatedLongitude = satellite.longitudeDeg + deltaLongitude;

  // Normalize latitude and longitude within valid ranges
  const normalizedLatitude = Math.max(-90, Math.min(90, simulatedLatitude));
  const normalizedLongitude =
    ((((simulatedLongitude + 180) % 360) + 360) % 360) - 180;

  // Adding minor fluctuations to other attributes as previously
  const heightFluctuation = (Math.random() - 0.5) * 20;
  const simulatedHeight = satellite.height + heightFluctuation;

  const velocityFluctuation = (Math.random() - 0.5) * 0.1 * satellite.velocity;
  const simulatedVelocity = satellite.velocity + velocityFluctuation;

  const azimuthRotationRate = 0.1;
  const azimuthFluctuation = (Math.random() - 0.5) * 2;
  const simulatedAzimuth =
    (satellite.azimuth +
      azimuthRotationRate * elapsedTime +
      azimuthFluctuation) %
    360;

  const elevationFluctuation = (Math.random() - 0.5) * 1;
  const simulatedElevation = Math.max(
    0,
    satellite.elevation + elevationFluctuation
  );

  const rangeFluctuation = (Math.random() - 0.5) * 100;
  const simulatedRange = satellite.rangeSat + rangeFluctuation;

  const dopplerFluctuation = (Math.random() - 0.5) * 0.4;
  const simulatedDoppler = satellite.doppler + dopplerFluctuation;

  return {
    velocity: simulatedVelocity,
    height: simulatedHeight,
    latitude: normalizedLatitude,
    longitude: normalizedLongitude,
    heading: satellite.heading, // No fluctuation - fixed heading
    azimuth: simulatedAzimuth,
    elevation: simulatedElevation,
    rangeSat: simulatedRange,
    doppler: simulatedDoppler,
  };
};

export default getSimulatedPosition;

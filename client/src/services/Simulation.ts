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
  const elapsedTime =
    (Date.now() - new Date(lastUpdateTimestamp).getTime()) / 1000; // Convert ms to seconds

  const velocityFluctuation = (Math.random() - 0.5) * 0.1; // ±10% variation in velocity
  const simulatedVelocity = satellite.velocity + velocityFluctuation;

  const headingFluctuation = (Math.random() - 0.5) * 1; // ±1 degree variation in heading
  const simulatedHeading = satellite.heading + headingFluctuation;

  const normalizedHeading = ((simulatedHeading % 360) + 360) % 360;

  const headingRadians = (normalizedHeading * Math.PI) / 180;

  const earthRadius = 6371;

  const distanceTravelled = simulatedVelocity * elapsedTime;

  const deltaLatitude = (distanceTravelled / earthRadius) * (180 / Math.PI);
  const deltaLongitude =
    ((distanceTravelled / earthRadius) * (180 / Math.PI)) /
    Math.cos((satellite.latitudeDeg * Math.PI) / 180);

  // Calculate new latitude and longitude based on heading
  const simulatedLatitude =
    satellite.latitudeDeg + deltaLatitude * Math.cos(headingRadians);
  const simulatedLongitude =
    satellite.longitudeDeg + deltaLongitude * Math.sin(headingRadians);

  // Simulate height with random fluctuation within ±10 meters
  const heightFluctuation = (Math.random() - 0.5) * 20; // ±10 meters
  const simulatedHeight = satellite.height + heightFluctuation;

  const azimuthRotationRate = 0.1; // Degrees per second
  const azimuthFluctuation = (Math.random() - 0.5) * 2; // ±1 degree
  const simulatedAzimuth =
    (satellite.azimuth +
      azimuthRotationRate * elapsedTime +
      azimuthFluctuation) %
    360;

  const elevationFluctuation = (Math.random() - 0.5) * 1; // ±0.5 degrees
  const simulatedElevation = Math.max(
    0,
    satellite.elevation +
      Math.sin(elapsedTime * 0.1) * 0.05 +
      elevationFluctuation
  );

  const rangeFluctuation = (Math.random() - 0.5) * 100; // ±50 meters
  const simulatedRange = satellite.rangeSat + rangeFluctuation;

  const dopplerFluctuation = (Math.random() - 0.5) * 0.4; // ±0.2 Hz
  const simulatedDoppler = satellite.doppler + dopplerFluctuation;

  return {
    latitude: simulatedLatitude,
    longitude: simulatedLongitude,
    height: simulatedHeight,
    velocity: simulatedVelocity,
    azimuth: simulatedAzimuth,
    elevation: simulatedElevation,
    rangeSat: simulatedRange,
    doppler: simulatedDoppler,
    heading: normalizedHeading,
  };
};

export default getSimulatedPosition;

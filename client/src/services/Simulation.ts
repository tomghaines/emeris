interface Satellite {
  _id: string;
  satelliteId: number;
  name: string;
  date: string;
  longitudeDeg: number;
  latitudeDeg: number;
  height: number;
  azimuth: number;
  elevation: number;
  rangeSat: number;
  doppler: number;
  lastUpdateTimestamp: string;
}

const getSimulatedPosition = (
  satellite: Satellite,
  lastUpdateTimestamp: string
) => {
  const elapsedTime =
    (Date.now() - new Date(lastUpdateTimestamp).getTime()) / 1000; // 1000 Seconds
  const movementRate = 0.65; // 65 degrees per second

  // Simple lat long simulation
  const simulatedLatitude = satellite.latitudeDeg + movementRate * elapsedTime;
  const simulatedLongitude =
    satellite.longitudeDeg + movementRate * elapsedTime;

  return { latitude: simulatedLatitude, longitude: simulatedLongitude };
};

export default getSimulatedPosition;

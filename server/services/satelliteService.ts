import {
  twoline2satrec,
  sgp4,
  eciToEcf,
  eciToGeodetic,
  gstime,
  degreesToRadians,
  geodeticToEcf,
  ecfToLookAngles,
  dopplerFactor,
  EciVec3,
  PositionAndVelocity,
  degreesLong,
  degreesLat,
} from 'satellite.js';

export interface SatelliteData {
  latitudeDeg: number;
  longitudeDeg: number;
  height: number;
  velocity: number;
  elevation: number;
  doppler: number;
  azimuth: number;
  rangeSat: number;
  heading: number;
}

export const convertTLEData = (
  tleLineOne: string,
  tleLineTwo: string
): SatelliteData | null => {
  // New satellite record
  const satrec = twoline2satrec(tleLineOne, tleLineTwo);

  // Get current epoch for satellite
  const epoch = new Date();

  // Convert date object to Julian date
  function getJulianDate(date: Date): number {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    const jd =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    return jd + (hour - 12) / 24 + minute / 1440 + second / 86400;
  }

  // Convert epoch to Julian date
  const jd = getJulianDate(epoch);

  // Calculate position and velocity
  const positionAndVelocity: PositionAndVelocity = sgp4(satrec, jd);

  if (!positionAndVelocity.position || !positionAndVelocity.velocity) {
    console.error('Error: sgp4 calculation failed', positionAndVelocity);
    return null;
  } else {
    const positionECI = positionAndVelocity.position as EciVec3<number>;
    const velocityECI = positionAndVelocity.velocity as EciVec3<number>;

    // Extract velocity components
    const velocityMagnitude = Math.sqrt(
      Math.pow(velocityECI.x, 2) +
        Math.pow(velocityECI.y, 2) +
        Math.pow(velocityECI.z, 2)
    );

    // Heading (direction of velocity) in degrees
    const heading = Math.atan2(velocityECI.y, velocityECI.x) * (180 / Math.PI);

    // Observer location (example)
    const observerGround = {
      longitude: degreesToRadians(-122.0308),
      latitude: degreesToRadians(36.9613422),
      height: 0.37,
    };

    // Greenwich Mean Sidereal Time (GMST)
    const gmst = gstime(new Date());

    // ECF calculations for satellite's position
    const positionECF = eciToEcf(positionECI, gmst);
    const observerECF = geodeticToEcf(observerGround);
    const positionGround = eciToGeodetic(positionECI, gmst);

    // Look Angles and Doppler
    const lookAngles = ecfToLookAngles(observerGround, positionECF);
    const doppler = dopplerFactor(observerECF, positionECF, velocityECI);

    // Extracting satellite's position
    const longitude = positionGround.longitude;
    const latitude = positionGround.latitude;
    const height = positionGround.height;

    // Convert to degrees
    const longitudeDeg = degreesLong(longitude);
    const latitudeDeg = degreesLat(latitude);

    return {
      latitudeDeg: parseFloat(latitudeDeg.toFixed(3)),
      longitudeDeg: parseFloat(longitudeDeg.toFixed(3)),
      height: parseFloat(height.toFixed(3)),
      elevation: parseFloat(lookAngles.elevation.toFixed(3)),
      doppler: parseFloat(doppler.toFixed(3)),
      azimuth: parseFloat(lookAngles.azimuth.toFixed(3)),
      rangeSat: parseFloat(lookAngles.rangeSat.toFixed(3)),
      velocity: parseFloat(velocityMagnitude.toFixed(3)),
      heading: parseFloat(heading.toFixed(3)),
    };
  }
};

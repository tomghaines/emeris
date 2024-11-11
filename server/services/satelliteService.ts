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
  // Step 1: Validate TLE length
  if (
    !tleLineOne ||
    !tleLineTwo ||
    tleLineOne.length !== 69 ||
    tleLineTwo.length !== 69
  ) {
    console.error('Invalid TLE data: TLE lines must be 69 characters long');
    return null;
  }

  // Step 2: Parse TLE data
  const satrec = twoline2satrec(tleLineOne, tleLineTwo);
  console.debug('Satellite Record:', satrec);
  if (!satrec) {
    console.error('Failed to parse TLE data');
    return null;
  }

  const epoch = new Date();
  console.debug('TLE Parsed:', satrec);

  // Step 3: Convert to Julian date
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

  const jd = getJulianDate(epoch);
  console.debug('Julian Date:', jd);

  // Step 4: Calculate position and velocity
  const positionAndVelocity: PositionAndVelocity = sgp4(satrec, jd);
  console.debug('Position and Velocity:', positionAndVelocity);

  if (!positionAndVelocity.position || !positionAndVelocity.velocity) {
    console.error('SGP4 calculation failed for TLE data:', {
      tleLineOne,
      tleLineTwo,
      jd,
      positionAndVelocity,
    });
    return null;
  }

  console.debug('Position and Velocity:', positionAndVelocity);

  const positionECI = positionAndVelocity.position as EciVec3<number>;
  const velocityECI = positionAndVelocity.velocity as EciVec3<number>;

  // Step 5: Calculate velocity magnitude
  const velocityMagnitude = Math.sqrt(
    Math.pow(velocityECI.x, 2) +
      Math.pow(velocityECI.y, 2) +
      Math.pow(velocityECI.z, 2)
  );

  console.debug('Position ECI:', positionECI);
  console.debug('Velocity Magnitude:', velocityMagnitude);

  // Step 6: Calculate heading (direction of velocity)
  const heading = Math.atan2(velocityECI.y, velocityECI.x) * (180 / Math.PI);
  console.debug('Heading (Degrees):', heading);

  // Step 7: Validate data range
  if (
    positionECI.x > 1e9 ||
    positionECI.y > 1e9 ||
    positionECI.z > 1e9 ||
    velocityMagnitude > 1e5 || // Unreasonably high velocity
    Math.abs(positionECI.x) < 1e-3 ||
    Math.abs(positionECI.y) < 1e-3 ||
    Math.abs(positionECI.z) < 1e-3
  ) {
    console.error('Suspicious data detected. Skipping satellite.');
    return null;
  }

  // Step 8: Observer ground location
  const observerGround = {
    longitude: degreesToRadians(-122.0308), // Example coordinates
    latitude: degreesToRadians(36.9613422),
    height: 0.37,
  };

  // Step 9: Calculate GMST (Greenwich Mean Sidereal Time)
  const gmst = gstime(new Date());
  console.debug('GMST:', gmst);

  // Step 10: Convert from ECI to ECF
  const positionECF = eciToEcf(positionECI, gmst);
  console.debug('Position (ECF):', positionECF);

  // Step 11: Convert observer location from Geodetic to ECF
  const observerECF = geodeticToEcf(observerGround);
  console.debug('Observer Position (ECF):', observerECF);

  // Step 12: Convert ECI position to geodetic
  const positionGround = eciToGeodetic(positionECI, gmst);
  console.debug('Position (Ground):', positionGround);

  // Step 13: Calculate look angles and Doppler factor
  const lookAngles = ecfToLookAngles(observerGround, positionECF);
  const doppler = dopplerFactor(observerECF, positionECF, velocityECI);

  console.debug('Look Angles:', lookAngles);
  console.debug('Doppler Factor:', doppler);

  // Step 14: Extract position data
  const longitude = positionGround.longitude;
  const latitude = positionGround.latitude;
  const height = positionGround.height;

  // Step 15: Validate satellite position data
  if (Math.abs(latitude) > 90) {
    console.error('Invalid latitude after conversion:', latitude);
    return null;
  }
  if (
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180 ||
    height < 100 ||
    height > 40000
  ) {
    console.error('Invalid satellite position:', {
      latitude,
      longitude,
      height,
    });
    return null;
  }

  // Step 16: Final output data
  const longitudeDeg = degreesLong(longitude);
  const latitudeDeg = degreesLat(latitude);

  console.log(
    `Satellite Position (Lat: ${latitudeDeg}, Lon: ${longitudeDeg}, Alt: ${height})`
  );
  console.log(`Velocity: ${velocityMagnitude}, Heading: ${heading}`);

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
};

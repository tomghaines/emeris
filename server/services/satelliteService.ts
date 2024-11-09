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
  elevation: number;
  doppler: number;
  azimuth: number;
  rangeSat: number;
}

// Sample TLEs
// const lineOne =
//   '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992';
// const lineTwo =
//   '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';

export const convertTLEData = (
  tleLineOne: string,
  tleLineTwo: string
): SatelliteData | null => {
  // New satellite record
  const satrec = twoline2satrec(tleLineOne, tleLineTwo);

  // console.log('Satellite record:', satrec);

  // Get current epoch for satellite
  const epoch = new Date();
  // console.log('Epoch:', epoch);

  // Convert date object to julian date
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
  // console.log('Julian Date:', jd);

  // Calculate position and velocity
  const positionAndVelocity: PositionAndVelocity = sgp4(satrec, jd);

  if (!positionAndVelocity.position || !positionAndVelocity.velocity) {
    console.error('Error: sgp4 calculation failed', positionAndVelocity);
    return null;
  } else {
    const positionECI = positionAndVelocity.position as EciVec3<number>;
    const velocityECI = positionAndVelocity.velocity as EciVec3<number>;

    // Convert degrees to radians for observer location (Example coordinates)
    const observerGround = {
      longitude: degreesToRadians(-122.0308), // Convert this to user location later
      latitude: degreesToRadians(36.9613422), // Convert this to user location later
      height: 0.37, // Convert this to user location later
    };

    // Greenwich Mean Sidereal Time (GMST) to bridge between ECI & ECF position calculations
    const gmst = gstime(new Date());

    // ECF calculations to find satellite's position relative to the Earth's surface (NOT ECI)
    const positionECF = eciToEcf(positionECI, gmst);
    const observerECF = geodeticToEcf(observerGround);
    const positionGround = eciToGeodetic(positionECI, gmst);

    // Calculate Look Angles and Doppler Factor
    const lookAngles = ecfToLookAngles(observerGround, positionECF);
    const doppler = dopplerFactor(observerECF, positionECF, velocityECI);

    // Look Angles
    const azimuth = lookAngles.azimuth;
    const elevation = lookAngles.elevation;
    const rangeSat = lookAngles.rangeSat;

    // Geodetic coordinates
    const longitude = positionGround.longitude;
    const latitude = positionGround.latitude;
    const height = positionGround.height;

    // Convert radians to degrees
    const longitudeDeg = degreesLong(longitude);
    const latitudeDeg = degreesLat(latitude);

    // console.log('Longitude (degrees):', longitudeDeg);
    // console.log('Latitude (degrees):', latitudeDeg);
    // console.log('Height (km):', height);
    // console.log('Azimuth:', azimuth);
    // console.log('Elevation:', elevation);
    // console.log('Range (km):', rangeSat);
    // console.log('Doppler Factor:', doppler);

    return {
      latitudeDeg: parseFloat(latitudeDeg.toFixed(3)),
      longitudeDeg: parseFloat(longitudeDeg.toFixed(3)),
      height: parseFloat(height.toFixed(3)),
      elevation: parseFloat(elevation.toFixed(3)),
      doppler: parseFloat(doppler.toFixed(3)),
      azimuth: parseFloat(azimuth.toFixed(3)),
      rangeSat: parseFloat(rangeSat.toFixed(3)),
    };
  }
  // console.log(result);
};

// convertTLEData(lineOne, lineTwo);

// satelliteService.ts

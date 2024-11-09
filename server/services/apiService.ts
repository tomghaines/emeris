import axios from 'axios';
import { format } from 'date-fns';
import Satellite from '../models/SatelliteDataModel';
import { convertTLEData } from './satelliteService';

const celestrakAPI =
  'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle';
const MAX_SATELLITES = 250; // Set limit

export const fetchAndSaveTLEData = async () => {
  try {
    const response = await axios.get<string>(celestrakAPI);
    const rawData = response.data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    const satellites = [];
    for (let i = 0; i < rawData.length; i += 3) {
      const name = rawData[i];
      const line1 = rawData[i + 1];
      const line2 = rawData[i + 2];

      if (name && line1 && line2) {
        const satelliteInfo = convertTLEData(line1, line2);
        if (satelliteInfo) {
          const formattedSatellite = {
            name,
            date: format(new Date(), 'dd-MM-yyyy'),
            latitudeDeg: satelliteInfo.latitudeDeg,
            longitudeDeg: satelliteInfo.longitudeDeg,
            height: satelliteInfo.height,
            azimuth: satelliteInfo.azimuth,
            elevation: satelliteInfo.elevation,
            rangeSat: satelliteInfo.rangeSat,
            doppler: satelliteInfo.doppler,
            lastUpdateTimeStamp: new Date(),
          };

          // Save each satellite to db
          await Satellite.create(formattedSatellite);
          satellites.push(formattedSatellite);
        }
      }
    }

    // After saving check if need to remove excess satellites
    const satelliteCount = await Satellite.countDocuments();
    if (satelliteCount > MAX_SATELLITES) {
      const excessCount = satelliteCount - MAX_SATELLITES;
      console.log(
        `Too many satellites in DB. Deleting ${excessCount} old entries...`
      );

      // Find oldest satellites based on date
      const satellitesToDelete = await Satellite.find()
        .sort({ date: 1 })
        .limit(excessCount);

      // Delete them
      const satelliteIdsToDelete = satellitesToDelete.map(
        (satellite) => satellite._id
      );
      await Satellite.deleteMany({ _id: { $in: satelliteIdsToDelete } });
      console.log(`${excessCount} satellites removed.`);
    }

    return satellites;
  } catch (err) {
    console.error('Error fetching or saving TLE data:', err);
    throw err;
  }
};

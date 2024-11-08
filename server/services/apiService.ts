import axios from 'axios';
import { format } from 'date-fns';
import { convertTLEData } from './satelliteService';

interface Satellite {
  name: string;
  date: string;
  latitudeDeg: number;
  longitudeDeg: number;
  height: number;
  elevation: number;
  doppler: number;
  azimuth: number;
  range: number;
  err?: string;
}

const celestrakAPI =
  'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle';

export const getTLEs = async () => {
  try {
    const response = await axios.get<string>(celestrakAPI);

    const rawData = response.data
      .split('\n')
      .map((line) => line.replace(/\r/g, '').trim())
      .filter((line) => line !== ''); // Remove empty lines

    const satellites: Satellite[] = [];
    for (let i = 0; i < rawData.length; i += 3) {
      const name = rawData[i]?.trim();
      const line1 = rawData[i + 1]?.trim();
      const line2 = rawData[i + 2]?.trim();

      if (
        name &&
        line1?.startsWith('1') &&
        line2?.startsWith('2') &&
        name.length > 0 &&
        line1.length > 0 &&
        line2.length > 0
      ) {
        let satelliteInfo: {
          latitudeDeg: number;
          longitudeDeg: number;
          height: number;
          elevation: number;
          doppler: number;
          azimuth: number;
          rangeSat: number;
        } | null = null;
        try {
          satelliteInfo = convertTLEData(line1, line2);
        } catch (err) {
          console.error(`Error calculating SGP4 for satellite ${name}:`, err);
          continue;
        }

        if (satelliteInfo === null) {
          console.error(
            `Skipping satellite ${name} due to conversion failure.`
          );
          continue;
        }

        const fmtDate = format(new Date(), 'dd-MM-yyyy');

        satellites.push({
          name,
          date: fmtDate,
          latitudeDeg: satelliteInfo.latitudeDeg,
          longitudeDeg: satelliteInfo.longitudeDeg,
          height: satelliteInfo.height,
          elevation: satelliteInfo.elevation,
          doppler: satelliteInfo.doppler,
          azimuth: satelliteInfo.azimuth,
          range: satelliteInfo.rangeSat,
        });

        if (satellites.length >= 100) break;
      } else {
        console.error('Skipping invalid satellite data:', {
          name,
          line1,
          line2,
        });
      }
    }

    console.log('Processed Satellites:', satellites);
    return satellites;
  } catch (err) {
    console.error('Error fetching TLE data from Celestrak:', err);
  }
};

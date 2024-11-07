import axios from 'axios';
import { format } from 'date-fns';
import { convertTLEData } from './satelliteService';

interface Satellite {
  satelliteId: number;
  name: string;
  date: string;
  line1: string;
  line2: string;
}

export const getTLEs = async () => {
  try {
    const response = await axios.get<{ member: Satellite[] }>(
      'https://tle.ivanstanojevic.me/api/tle'
    );

    const data = response.data.member.map((satellite) => {
      const { line1, line2, satelliteId, name, date } = satellite;
      let satelliteInfo: object | null = null;
      try {
        satelliteInfo = convertTLEData(line1, line2);
      } catch (err) {
        console.error(
          `Error calculating SGEP4 for satellite ${satelliteId}:`,
          err
        );
        return { satelliteId, name, date, err: 'SGP4 calculation failed' };
      }

      const fmtDate = format(new Date(date), 'dd-MM-yyyy');
      return {
        satelliteId: satellite.satelliteId,
        name: satellite.name,
        date: fmtDate,
        ...satelliteInfo,
      };
    });
    return data;
  } catch (err) {
    console.error('Error fetching TLE data:', err);
  }
};

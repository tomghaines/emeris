import axios from 'axios';

export const getSatelliteData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/satellites');
    console.log(response.data);
    console.log(
      'SatalliteAPI.ts response.data.lastUpdateTimestamp:',
      response.data.lastUpdateTimestamp
    );
    return response;
  } catch (err) {
    console.error('Error fetching satellite data from API', err);
  }
};

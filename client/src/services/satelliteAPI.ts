import axios from 'axios';

export const getSatelliteData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/satellites');
    return response;
  } catch (err) {
    console.error('Error fetching satellite data from API', err);
  }
};

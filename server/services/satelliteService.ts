import axios from 'axios';
import satellite, { EciVec3, PositionAndVelocity } from 'satellite.js';

export const getTLEs = async () => {
  try {
    const response = await axios.get('https://tle.ivanstanojevic.me/api/tle');
    return response.data;
  } catch (err) {
    console.error('Error:', err);
  }
};

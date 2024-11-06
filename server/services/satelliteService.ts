import axios from 'axios';

export const getTLEs = async () => {
  try {
    const response = await axios.get('https://tle.ivanstanojevic.me/api/tle');
    return response.data;
  } catch (err) {
    console.error('Error:', err);
  }
};

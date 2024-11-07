import { useEffect, useState } from 'react';
import { getSatelliteData } from '../../services/satelliteAPI';

const SatelliteData = () => {
  const [satelliteData, setSateliteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataFromService = async () => {
      try {
        const response = await getSatelliteData();
        console.log(response.data);
        setSateliteData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching satellite data from the service', err);
        setLoading(true);
      }
    };
    fetchDataFromService();
  }, []);

  if (loading) return <p>Loading data</p>;

  return (
    <div>
      {satelliteData &&
        satelliteData.map((satellite) => (
          <div key={satellite.satelliteId}>
            <h3>Name: {satellite.name}</h3>
            <p>ID: {satellite.satelliteId}</p>
            <p>Date: {satellite.date}</p>
            <p>Longitude: {satellite.longitudeDeg}</p>
            <p>Latitude: {satellite.latitudeDeg}</p>
            <p>Height: {satellite.height}</p>
            <p>Elevation: {satellite.elevation}</p>
            <p>Doppler Factor: {satellite.doppler}</p>
            <p>Azimuth: {satellite.azimuth}</p>
            <p>Range: {satellite.rangeSat}</p>
          </div>
        ))}
    </div>
  );
};

export default SatelliteData;

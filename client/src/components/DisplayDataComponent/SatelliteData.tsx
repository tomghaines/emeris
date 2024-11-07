import { useEffect, useState } from 'react';
import { getSatelliteData } from '../../services/satelliteAPI';

const SatelliteData = () => {
  interface Satellite {
    satelliteId: number;
    name: string;
    date: string;
    longitudeDeg: number;
    latitudeDeg: number;
    height: number;
    azimuth: number;
    elevation: number;
    rangeSat: number;
    doppler: number;
  }
  const [satelliteData, setSateliteData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataFromService = async () => {
      try {
        const response = await getSatelliteData();
        if (response?.data) {
          setSateliteData(response.data);
          setLoading(false);
        } else {
          setSateliteData([]);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        setSateliteData([]);
        setLoading(true);
      }
    };
    fetchDataFromService();
  }, []);

  if (loading) return <p>Loading data</p>;

  return (
    <div>
      {satelliteData.length > 0 ? (
        satelliteData.map((satellite: Satellite) => (
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
        ))
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default SatelliteData;

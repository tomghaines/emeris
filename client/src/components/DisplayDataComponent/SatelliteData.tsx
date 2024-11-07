import { useEffect, useState } from 'react';
import { getSatelliteData } from '../../services/satelliteAPI';

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

const mockData: Satellite[] = [
  {
    satelliteId: 25544,
    name: 'ISS (ZARYA)',
    date: '2024-11-07T08:50:54+00:00',
    longitudeDeg: 0,
    latitudeDeg: 0,
    height: 0,
    azimuth: 0,
    elevation: 0,
    rangeSat: 0,
    doppler: 0,
  },
  {
    satelliteId: 40075,
    name: 'AISSAT 2',
    date: '2023-12-28T11:59:02+00:00',
    longitudeDeg: 0,
    latitudeDeg: 0,
    height: 0,
    azimuth: 0,
    elevation: 0,
    rangeSat: 0,
    doppler: 0,
  },
  {
    satelliteId: 36797,
    name: 'AISSAT 1',
    date: '2024-11-06T14:26:09+00:00',
    longitudeDeg: 0,
    latitudeDeg: 0,
    height: 0,
    azimuth: 0,
    elevation: 0,
    rangeSat: 0,
    doppler: 0,
  },
  {
    satelliteId: 43694,
    name: 'PROXIMA I',
    date: '2024-05-18T00:08:26+00:00',
    longitudeDeg: 0,
    latitudeDeg: 0,
    height: 0,
    azimuth: 0,
    elevation: 0,
    rangeSat: 0,
    doppler: 0,
  },
];

const SatelliteData = () => {
  const [satelliteData, setSateliteData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const useMockData = true; // ! Change here to switch between api and mock data

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);

      if (useMockData) {
        setSateliteData(mockData);
        setLoading(false);
      } else {
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
      }
    };
    fetchDataFromService();
  }, [useMockData]);

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

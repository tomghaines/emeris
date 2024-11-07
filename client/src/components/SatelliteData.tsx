import { useEffect, useState } from 'react';
import MainTable from './DisplayDataComponent/MainTable';
import Map from './MapComponent/Map';
import { MockData } from '../services/mockData';
import { getSatelliteData } from '../services/satelliteAPI';

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

const SatelliteData = () => {
  const [satelliteData, setSatelliteData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const useMockData = true; // ! Change to switch data source

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);
      if (useMockData) {
        setSatelliteData(MockData);
      } else {
        try {
          const response = await getSatelliteData();
          setSatelliteData(response?.data || []);
        } catch (err) {
          console.error('Error fetching satellite data:', err);
        }
      }
      setLoading(false);
    };
    fetchDataFromService();
  }, [useMockData]);
  return (
    <div className="h-screen overflow-hidden">
      <div className="h-3/4">
        <Map satelliteData={satelliteData} loading={loading} />
      </div>
      <div className="h-1/4 overflow-scroll w-full">
        <MainTable satelliteData={satelliteData} loading={loading} />
      </div>
    </div>
  );
};

export default SatelliteData;

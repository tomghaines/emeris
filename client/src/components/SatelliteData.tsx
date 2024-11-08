import { useEffect, useState } from 'react';
import MainTable from './DisplayDataComponent/MainTable';
import Map from './MapComponent/Map';
import { MockData } from '../services/mockData';
import { getSatelliteData } from '../services/satelliteAPI';
import StatusBar from './StatusBar';

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
  const useMockData = false; // ! Change to switch data source

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
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 z-10 w-full">
        <StatusBar satelliteData={satelliteData} loading={loading} />
      </div>
      <div className="h-3/4 z-0">
        <Map satelliteData={satelliteData} loading={loading} />
      </div>
      <div className="h-1/4 overflow-hidden w-full">
        <MainTable satelliteData={satelliteData} loading={loading} />
      </div>
    </div>
  );
};

export default SatelliteData;

import { useEffect, useState } from 'react';
import Map from './MapComponent/Map';
import { getSatelliteData } from '../services/satelliteAPI';
import StatusBar from './StatusBar';
import SideBar from './SideBarComponent/SideBar';
import getSimulatedPosition from '../services/Simulation';

interface Satellite {
  _id: string;
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
  lastUpdateTimestamp: string;
}

const SatelliteData = () => {
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string | null>(
    null
  );
  const [satelliteData, setSatelliteData] = useState<Satellite[]>([]);
  const [simulatedSatelliteData, setSimulatedData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<string | null>(
    null
  );
  const useMockData = false;

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);
      try {
        const response = await getSatelliteData();
        const satelliteArray = response?.data?.satellites || [];
        setSatelliteData(satelliteArray);
        setLastUpdateTimestamp(response?.data?.lastUpdateTimestamp || null);

        console.log('Fetched Satellite Data:', satelliteArray);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromService();
  }, [useMockData]);

  useEffect(() => {
    if (!lastUpdateTimestamp || satelliteData.length === 0) return;

    const interval = setInterval(() => {
      setSimulatedData((prevData) => {
        const updatedData = satelliteData.map((satellite) => {
          const simulatedPosition = getSimulatedPosition(
            satellite,
            lastUpdateTimestamp
          );
          return {
            ...satellite,
            latitudeDeg: simulatedPosition.latitude,
            longitudeDeg: simulatedPosition.longitude,
          };
        });
        console.log('Simulated Data After Update:', updatedData);
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdateTimestamp, satelliteData]);

  if (loading || satelliteData.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-bold text-center text-lg">
          Loading satellite data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="border-2 border-neutral-900 fixed top-0 z-10 w-full">
        <StatusBar satelliteData={satelliteData} loading={loading} />
      </div>
      <div className="flex flex-col h-full w-3/4 overflow-hidden">
        <div className="border-2 border-neutral-900 h-full z-0">
          <Map
            satelliteData={satelliteData}
            loading={loading}
            selectedSatelliteId={selectedSatelliteId}
            onSatelliteSelect={setSelectedSatelliteId}
          />
        </div>
      </div>
      <div className="border-2 border-neutral-900 w-1/4 overflow-hidden">
        <SideBar
          satelliteData={simulatedSatelliteData}
          loading={loading}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={setSelectedSatelliteId}
        />
      </div>
    </div>
  );
};

export default SatelliteData;

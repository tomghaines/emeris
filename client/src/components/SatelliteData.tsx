import { useEffect, useRef, useState } from 'react';
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
  velocity: number;
  height: number;
  longitudeDeg: number | undefined;
  latitudeDeg: number | undefined;
  heading: number;
  azimuth: number;
  elevation: number;
  rangeSat: number;
  doppler: number;

  lastUpdateTimestamp: string;
}

const SatelliteData = () => {
  const satelliteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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
            height: simulatedPosition.height,
            velocity: simulatedPosition.velocity,
            elevation: simulatedPosition.elevation,
            azimuth: simulatedPosition.azimuth,
            doppler: simulatedPosition.doppler,
            rangeSat: simulatedPosition.rangeSat,
            heading: simulatedPosition.heading,
          };
        });
        console.log('Simulated Data After Update:', updatedData);
        return updatedData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [satelliteData, lastUpdateTimestamp]);

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
    <div className="flex h-screen p-2 gap-2  bg-[#0e0e0e]">
      <div className="flex flex-col h-full w-3/4 relative">
        <div className="top-0 z-10 absolute m-3 rounded-md">
          <StatusBar satelliteData={satelliteData} loading={loading} />
        </div>
        <div className="h-full z-0 overflow-hidden p-0 bg-[#02050A] rounded-lg">
          <Map
            satelliteData={simulatedSatelliteData}
            loading={loading}
            selectedSatelliteId={selectedSatelliteId}
            onSatelliteSelect={setSelectedSatelliteId}
            satelliteRefs={satelliteRefs}
          />
        </div>
      </div>
      <div
        className="w-1/4 overflow-hidden p-0 bg-[#02050A] rounded-lg
      "
      >
        <SideBar
          satelliteData={simulatedSatelliteData}
          loading={loading}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={setSelectedSatelliteId}
          satelliteRefs={satelliteRefs}
        />
      </div>
    </div>
  );
};

export default SatelliteData;

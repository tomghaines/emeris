import { useEffect, useState } from 'react';
// import MainTable from './DisplayDataComponent/MainTable';
import Map from './MapComponent/Map';
import { getSatelliteData } from '../services/satelliteAPI';
import StatusBar from './StatusBar';
import SideBar from './SideBarComponent/SideBar';

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
}

const SatelliteData = () => {
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string | null>(
    null
  );
  const [satelliteData, setSatelliteData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const useMockData = false; // Set to true for mock data

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);
      try {
        if (useMockData) {
          // Mock data setup here
          // setSatelliteData(MockData);
        } else {
          const response = await getSatelliteData();
          setSatelliteData(response?.data || []);
        }
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        // You can set an error state here and display it to the user
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromService();
  }, [useMockData]);

  // Early return if data is still loading or if no data is available
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
    // <div className="flex">
    //   <div className="border-2 border-neutral-900 fixed top-0 z-10 w-full">
    //     <StatusBar satelliteData={satelliteData} loading={loading} />
    //   </div>
    //   <div className="flex flex-col h-screen w-3/4">
    //     <div className="border-2 border-neutral-900 h-full z-0">
    //       <Map
    //         satelliteData={satelliteData}
    //         loading={loading}
    //         selectedSatelliteId={selectedSatelliteId}
    //         onSatelliteSelect={setSelectedSatelliteId}
    //       />
    //     </div>
    //     {/* <div className="border-2 border-neutral-900 h-1/4 overflow-hidden w-full">
    //       <MainTable
    //         satelliteData={satelliteData}
    //         loading={loading}
    //         selectedSatelliteId={selectedSatelliteId}
    //         onSatelliteSelect={setSelectedSatelliteId}
    //       />
    //     </div> */}
    //   </div>
    //   <div className="border-2 border-neutral-900 w-1/4 overflow-hidden">
    //     <SideBar
    //       satelliteData={satelliteData}
    //       loading={loading}
    //       selectedSatelliteId={selectedSatelliteId}
    //       onSatelliteSelect={setSelectedSatelliteId}
    //     />
    //   </div>
    // </div>
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
          satelliteData={satelliteData}
          loading={loading}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={setSelectedSatelliteId}
        />
      </div>
    </div>
  );
};

export default SatelliteData;

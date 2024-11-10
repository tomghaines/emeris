import { useEffect, useState } from 'react';
// import MainTable from './DisplayDataComponent/MainTable';
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
  const [loading, setLoading] = useState(true);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<string | null>(
    null
  );
  const useMockData = false; // ! Set to true for mock data

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);
      try {
        if (useMockData) {
          // Mock data setup here
          // setSatelliteData(MockData);
        } else {
          const response = await getSatelliteData();
          console.log('API Response:', response);
          setSatelliteData(response?.data || []);
          setLastUpdateTimestamp(response?.data.lastUpdateTimestamp || null);

          console.log(
            'Fetched Last Update Timestamp:',
            response?.data.lastUpdateTimestamp
          );
        }
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        // You can set an error state here and display it to the user
      } finally {
        setLoading(false);
      }
    };
    // const fetchDataFromService = async () => {
    //   setLoading(true);
    //   try {
    //     if (useMockData) {
    //       // Mock data setup here if needed
    //     } else {
    //       const response = await getSatelliteData();
    //       console.log('API Response:', response);

    //       const satelliteArray = response?.data?.satellites || [];
    //       setSatelliteData(satelliteArray);

    //       // Log the entire structure of the first satellite object
    //       console.log(
    //         'Keys in first satellite object:',
    //         Object.keys(satelliteArray[0])
    //       );
    //       console.log('Full first satellite object:', satelliteArray[0]);

    //       // Set timestamp if it exists
    //       const firstTimestamp = satelliteArray[0]?.lastUpdateTimestamp || null;
    //       setLastUpdateTimestamp(firstTimestamp);

    //       console.log('Fetched Last Update Timestamp:', firstTimestamp);
    //     }
    //   } catch (err) {
    //     console.error('Error fetching satellite data:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchDataFromService();
  }, [useMockData]);

  useEffect(() => {
    if (lastUpdateTimestamp) {
      const interval = setInterval(() => {
        setSatelliteData((prevData) => {
          if (prevData && Array.isArray(prevData.satellites)) {
            return {
              ...prevData,
              satellites: prevData.satellites.map((satellite) => {
                const simulatedPosition = getSimulatedPosition(
                  satellite,
                  lastUpdateTimestamp
                );
                return {
                  ...satellite,
                  latitudeDeg: simulatedPosition.latitude,
                  longitudeDeg: simulatedPosition.longitude,
                };
              }),
            };
          } else {
            console.error(
              'prevData does not have a satellites array:',
              prevData
            );
            return prevData;
          }
        });
      }, 1000); // Update position every second

      return () => clearInterval(interval);
    }
  }, [lastUpdateTimestamp]);
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

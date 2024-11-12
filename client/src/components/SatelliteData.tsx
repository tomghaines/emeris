import { useEffect, useRef, useState } from 'react';
import Map from './Map/Map';
import { getSatelliteData } from '../services/satelliteAPI';
import StatusBar from './StatusBar';
import SideBar from './SideBarComponent/SideBar';
import getSimulatedPosition from '../services/Simulation';
import debounce from 'lodash.debounce';

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
  const debouncedUpdateMarkerPositions = debounce((satellites: Satellite[]) => {
    updateMarkerPositions(satellites);
  }, 100);
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string | null>(
    null
  );
  const [satelliteData, setSatelliteData] = useState<Satellite[]>([]);
  const [simulatedSatelliteData, setSimulatedData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<string | null>(
    null
  );
  const [trackedSatellites, setTrackedSatellites] = useState<string[]>([]);
  const [trackedSatelliteCount, setTrackedSatelliteCount] = useState(0);
  const satelliteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

  const handleTrackSatellite = (id: string) => {
    setTrackedSatellites((prevTracked) => {
      const isAlreadyTracked = prevTracked.includes(id);
      let updatedTrackedSatellites;

      if (isAlreadyTracked) {
        updatedTrackedSatellites = prevTracked.filter((satId) => satId !== id);
      } else {
        updatedTrackedSatellites = [...prevTracked, id];
      }

      // Log the satellites after updating state
      // console.log('Updated Tracked Satellites:', updatedTrackedSatellites);
      setTrackedSatelliteCount(updatedTrackedSatellites.length);

      return updatedTrackedSatellites;
    });
  };

  const useMockData = false;

  useEffect(() => {
    // Log when tracked satellites are updated
    // console.log('Tracked Satellites Updated:', trackedSatellites);
  }, [trackedSatellites]);

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);
      try {
        const response = await getSatelliteData();
        const satelliteArray = response?.data?.satellites || [];
        setSatelliteData(satelliteArray);
        setLastUpdateTimestamp(response?.data?.lastUpdateTimestamp || null);
        // console.log('Fetched Satellite Data:', satelliteArray);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromService();
  }, [useMockData]);

  const updateMarkerPositions = (satellites: Satellite[]) => {
    satellites.forEach((satellite) => {
      const marker = markerRefs.current[satellite._id];
      if (marker) {
        marker.setLatLng([
          satellite.latitudeDeg || 0,
          satellite.longitudeDeg || 0,
        ]);
      }
    });
  };

  useEffect(() => {
    if (!lastUpdateTimestamp || satelliteData.length === 0) return;

    const interval = setInterval(() => {
      setSimulatedData(() => {
        const updatedData = satelliteData.map((satellite) => {
          const simulatedPosition = getSimulatedPosition(
            satellite,
            lastUpdateTimestamp
          );
          return {
            ...satellite,
            latitudeDeg: simulatedPosition?.latitude,
            longitudeDeg: simulatedPosition?.longitude,
            height: simulatedPosition?.height,
            velocity: simulatedPosition?.velocity,
            elevation: simulatedPosition?.elevation,
            azimuth: simulatedPosition?.azimuth,
            doppler: simulatedPosition?.doppler,
            rangeSat: simulatedPosition?.rangeSat,
            heading: simulatedPosition?.heading,
          };
        });

        debouncedUpdateMarkerPositions(updatedData);
        // console.log('Simulated Data After Update:', updatedData);
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [satelliteData, lastUpdateTimestamp, debouncedUpdateMarkerPositions]);

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
    <div className="flex h-screen p-2 gap-2 bg-[#02050A]">
      <div className="flex flex-col h-full w-3/4 relative">
        <div className="top-0 z-10 absolute m-2">
          <StatusBar
            satelliteData={satelliteData}
            loading={loading}
            trackedSatelliteCount={trackedSatelliteCount}
            trackedSatellites={trackedSatellites}
          />
        </div>
        <div className="h-full z-0 overflow-hidden rounded-md">
          <Map
            satelliteData={simulatedSatelliteData}
            loading={loading}
            selectedSatelliteId={selectedSatelliteId}
            onSatelliteSelect={setSelectedSatelliteId}
            trackedSatellites={trackedSatellites}
            ref={mapRef}
            markerRefs={markerRefs}
          />
        </div>
      </div>
      <div className="w-1/4 overflow-hidden p-0 bg-[#02050A]">
        <SideBar
          satelliteData={simulatedSatelliteData}
          loading={loading}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={setSelectedSatelliteId}
          satelliteRefs={satelliteRefs}
          handleTrackSatellite={handleTrackSatellite}
          trackedSatellites={trackedSatellites}
          mapRef={mapRef}
          markerRefs={markerRefs}
        />
      </div>
    </div>
  );
};

export default SatelliteData;

import { useEffect, useState } from 'react';
import { getSatelliteData } from '../../services/satelliteAPI';
import TableCol from './TableCol';

import { MockData } from '../../services/mockData';

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

const mockData = MockData;

const SatelliteData = () => {
  const [satelliteData, setSatelliteData] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const useMockData = false; // ! Change to switch data source

  useEffect(() => {
    const fetchDataFromService = async () => {
      setLoading(true);

      if (useMockData) {
        setSatelliteData(mockData);
        setLoading(false);
      } else {
        try {
          const response = await getSatelliteData();
          if (response?.data) {
            setSatelliteData(response.data);
            setLoading(false);
          } else {
            setSatelliteData([]);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error fetching satellite data:', err);
          setSatelliteData([]);
          setLoading(true);
        }
      }
    };
    fetchDataFromService();
  }, [useMockData]);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <p className="font-bold text-center text-large">Loading data</p>
      </div>
    );

  const tableHeaders: string[] = [
    'ID',
    'NAME',
    'DATE',
    'LATITUDE',
    'LONGITUDE',
    'HEIGHT',
    'ELEVATION',
    'DOPPLER',
    'AZIMUTH',
    'RANGE',
  ];

  return (
    <div className="w-full flex flex-col bg-slate-900 justify-center p-2">
      <div className="flex flex-row text-white">
        {tableHeaders.map((header) => {
          return <TableCol key={header} type="header" data={header} />;
        })}
      </div>

      {satelliteData.length > 0 ? (
        satelliteData.map((satellite: Satellite) => (
          <div key={satellite.satelliteId} className="flex flex-row text-white">
            {Object.values(satellite).map((value, index) => (
              <TableCol
                key={`${satellite.satelliteId}-${index}`}
                type="data"
                data={value.toString()}
              />
            ))}
          </div>
        ))
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default SatelliteData;

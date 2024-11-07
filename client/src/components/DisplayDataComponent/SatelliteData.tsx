import { useEffect, useState } from 'react';
import { getSatelliteData } from '../../services/satelliteAPI';
import TableCol from './TableCol';

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
  const useMockData = true; // ! Change to switch data source

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

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <p className="font-bold text-center text-large">Loading data</p>
      </div>
    );

  const tableHeaders: string[] = [
    'NAME',
    'ID',
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

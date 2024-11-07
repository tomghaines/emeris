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
    name: 'AISSAT 2',
    satelliteId: 40075,
    date: '2023-12-28T11:59:02+00:00',
    latitudeDeg: -12.183,
    longitudeDeg: 60.169,
    height: 576.358,
    elevation: -1.342,
    doppler: 1.0,
    azimuth: 6.195,
    rangeSat: 13015.492,
  },
  {
    name: 'AISSAT 1',
    satelliteId: 36797,
    date: '2024-11-06T14:26:09+00:00',
    latitudeDeg: 48.98,
    longitudeDeg: -30.787,
    height: 411.708,
    elevation: -0.506,
    doppler: 1.0,
    azimuth: 0.821,
    rangeSat: 6972.135,
  },
  {
    name: 'PROXIMA I',
    satelliteId: 43694,
    date: '2024-05-18T00:08:26+00:00',
    latitudeDeg: 27.444,
    longitudeDeg: -113.889,
    height: 435406.994,
    elevation: 1.363,
    doppler: 1.0,
    azimuth: 2.476,
    rangeSat: 435541.663,
  },
  {
    name: 'NORSAT 1',
    satelliteId: 42826,
    date: '2023-12-28T12:04:24+00:00',
    latitudeDeg: -15.255,
    longitudeDeg: -14.047,
    height: 510.585,
    elevation: -0.963,
    doppler: 1.0,
    azimuth: 1.6,
    rangeSat: 11077.55,
  },
  {
    name: 'NOAA 18',
    satelliteId: 28654,
    date: '2024-11-07T03:27:33+00:00',
    latitudeDeg: 74.216,
    longitudeDeg: 34.769,
    height: 857.996,
    elevation: -0.498,
    doppler: 1.0,
    azimuth: 0.116,
    rangeSat: 7630.704,
  },
  {
    name: 'NAYIF-1 (EO-88)',
    satelliteId: 42017,
    date: '2023-07-17T15:27:12+00:00',
    latitudeDeg: -11.56,
    longitudeDeg: 179.32,
    height: 12525.792,
    elevation: -0.052,
    doppler: 1.0,
    azimuth: 4.205,
    rangeSat: 18121.898,
  },
  {
    name: 'NOAA 19',
    satelliteId: 33591,
    date: '2024-11-07T02:47:26+00:00',
    latitudeDeg: -63.864,
    longitudeDeg: -119.067,
    height: 870.629,
    elevation: -0.828,
    doppler: 1.0,
    azimuth: 3.118,
    rangeSat: 10475.134,
  },
  {
    name: 'KKS-1 (KISEKI)',
    satelliteId: 33499,
    date: '2024-11-06T20:50:49+00:00',
    latitudeDeg: 70.108,
    longitudeDeg: -60.673,
    height: 527.005,
    elevation: -0.308,
    doppler: 1.0,
    azimuth: 0.43,
    rangeSat: 5207.837,
  },
  {
    name: 'NOAA 15',
    satelliteId: 25338,
    date: '2024-11-07T02:19:04+00:00',
    latitudeDeg: 17.991,
    longitudeDeg: 176.982,
    height: 801.061,
    elevation: -0.382,
    doppler: 1.0,
    azimuth: 4.677,
    rangeSat: 6439.893,
  },
  {
    name: 'NORSAT 3',
    satelliteId: 48272,
    date: '2023-12-28T10:31:07+00:00',
    latitudeDeg: 3.707,
    longitudeDeg: 95.324,
    height: 530.926,
    elevation: -1.083,
    doppler: 1.0,
    azimuth: 5.433,
    rangeSat: 11868.799,
  },
  {
    name: 'PROXIMA II',
    satelliteId: 43696,
    date: '2024-05-20T08:55:28+00:00',
    latitudeDeg: 33.587,
    longitudeDeg: 26.657,
    height: 286848.659,
    elevation: -0.259,
    doppler: 1.0,
    azimuth: 0.462,
    rangeSat: 294807.265,
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

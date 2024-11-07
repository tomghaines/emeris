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
    satelliteId: 40075,
    name: 'AISSAT 2',
    date: '2023-12-28T11:59:02+00:00',
    longitudeDeg: 60.16919369575363,
    latitudeDeg: -12.1826286514067,
    height: 576.3576431441088,
    azimuth: 6.194640786079299,
    elevation: -1.342044572922383,
    rangeSat: 13015.492433104962,
    doppler: 1.0000157408779022,
  },
  {
    satelliteId: 36797,
    name: 'AISSAT 1',
    date: '2024-11-06T14:26:09+00:00',
    longitudeDeg: -30.787476975483766,
    latitudeDeg: 48.980070659534654,
    height: 411.70771095525106,
    azimuth: 0.8213107577675656,
    elevation: -0.5064214001227728,
    rangeSat: 6972.134678793205,
    doppler: 1.0000214363439723,
  },
  {
    satelliteId: 43694,
    name: 'PROXIMA I',
    date: '2024-05-18T00:08:26+00:00',
    longitudeDeg: -113.88949780343069,
    latitudeDeg: 27.444325818332935,
    height: 435406.9942496478,
    azimuth: 2.4756197774843844,
    elevation: 1.362965996408169,
    rangeSat: 435541.6631545734,
    doppler: 1.0000009498666387,
  },

  {
    satelliteId: 42826,
    name: 'NORSAT 1',
    date: '2023-12-28T12:04:24+00:00',
    longitudeDeg: -14.04667133095054,
    latitudeDeg: -15.255334000975578,
    height: 510.5846599992183,
    azimuth: 1.6000549032503608,
    elevation: -0.9630666582412898,
    rangeSat: 11077.550102869307,
    doppler: 1.0000169438108006,
  },
  {
    satelliteId: 28654,
    name: 'NOAA 18',
    date: '2024-11-07T03:27:33+00:00',
    longitudeDeg: 34.769320136756505,
    latitudeDeg: 74.21574731087183,
    height: 857.9961979927757,
    azimuth: 0.11626228209386236,
    elevation: -0.49827460053945694,
    rangeSat: 7630.703793718591,
    doppler: 1.0000147611145627,
  },

  {
    satelliteId: 42017,
    name: 'NAYIF-1 (EO-88)',
    date: '2023-07-17T15:27:12+00:00',
    longitudeDeg: 179.3198029361396,
    latitudeDeg: -11.55985741853794,
    height: 12525.791908923315,
    azimuth: 4.2049845344504,
    elevation: -0.05210441703408116,
    rangeSat: 18121.898126528988,
    doppler: 1.0000079630039131,
  },
  {
    satelliteId: 33591,
    name: 'NOAA 19',
    date: '2024-11-07T02:47:26+00:00',
    longitudeDeg: -119.06667620868554,
    latitudeDeg: -63.86415813653357,
    height: 870.6287628199289,
    azimuth: 3.1182293655907123,
    elevation: -0.8280023052680449,
    rangeSat: 10475.134073426121,
    doppler: 1.000008482092669,
  },
  {
    satelliteId: 33499,
    name: 'KKS-1 (KISEKI)',
    date: '2024-11-06T20:50:49+00:00',
    longitudeDeg: -60.67301305819089,
    latitudeDeg: 70.10794307610223,
    height: 527.0050364155586,
    azimuth: 0.4297029683944791,
    elevation: -0.3077952138920756,
    rangeSat: 5207.837226445255,
    doppler: 1.0000216888880837,
  },

  {
    satelliteId: 25338,
    name: 'NOAA 15',
    date: '2024-11-07T02:19:04+00:00',
    longitudeDeg: 176.98180642155114,
    latitudeDeg: 17.990560399927013,
    height: 801.0607192388788,
    azimuth: 4.677323759016974,
    elevation: -0.3815846356435428,
    rangeSat: 6439.893016383888,
    doppler: 1.0000022697637199,
  },
  {
    satelliteId: 48272,
    name: 'NORSAT 3',
    date: '2023-12-28T10:31:07+00:00',
    longitudeDeg: 95.3235122518062,
    latitudeDeg: 3.706664088864362,
    height: 530.9256509466541,
    azimuth: 5.4325971200852194,
    elevation: -1.0827438715452407,
    rangeSat: 11868.799288870649,
    doppler: 1.0000082919938533,
  },
  {
    satelliteId: 43696,
    name: 'PROXIMA II',
    date: '2024-05-20T08:55:28+00:00',
    longitudeDeg: 26.65706452552225,
    latitudeDeg: 33.58743028910266,
    height: 286848.65867254924,
    azimuth: 0.4617555444765742,
    elevation: -0.2593492978202176,
    rangeSat: 294807.2649169364,
    doppler: 1.0000021305470177,
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

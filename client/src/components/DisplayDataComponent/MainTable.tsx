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

interface SatalliteProps {
  satelliteData: Satellite[];
  loading: boolean;
}

const MainTable: React.FC<SatalliteProps> = ({ satelliteData, loading }) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-bold text-center text-large">Loading data</p>
      </div>
    );
  }

  const filteredSatellites = satelliteData.filter(
    (satellite) =>
      satellite.latitudeDeg !== undefined &&
      satellite.longitudeDeg !== undefined
  );

  return (
    <div className="w-full flex flex-col bg-slate-900 justify-center p-2">
      <div className="flex flex-row text-white">
        {tableHeaders.map((header) => {
          return <TableCol key={header} type="header" data={header} />;
        })}
      </div>

      {filteredSatellites.length > 0 ? (
        filteredSatellites.map((satellite: Satellite) => (
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

export default MainTable;

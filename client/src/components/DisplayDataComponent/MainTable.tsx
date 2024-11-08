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
    <div
      id="table"
      className="w-full flex flex-col p-4 items-start gap-2 bg-neutral-950"
    >
      <div
        id="table-header"
        className="flex justify-between items-center self-stretch rounded-md bg-neutral-900"
      >
        {tableHeaders.map((header) => (
          <TableCol key={header} type="header" data={header} />
        ))}
      </div>

      <div className="table-body overflow-y-auto max-h-64 w-full">
        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite: Satellite) => (
            <div
              key={satellite.satelliteId}
              id="table-row"
              className="flex justify-between items-center self-stretch rounded-md bg-neutral-950"
            >
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
    </div>
  );
};

export default MainTable;
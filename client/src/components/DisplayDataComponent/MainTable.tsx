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

interface SatelliteProps {
  satelliteData: Satellite[];
  loading: boolean;
  selectedSatelliteId: number | null;
  onSatelliteSelect: (id: number | null) => void;
}

const MainTable: React.FC<SatelliteProps> = ({
  satelliteData,
  loading,
  selectedSatelliteId,
  onSatelliteSelect,
}) => {
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
    <div className="w-full flex flex-col p-4 items-start gap-2 bg-neutral-950">
      <div className="flex justify-between items-center self-stretch rounded-md bg-neutral-900">
        {tableHeaders.map((header) => (
          <TableCol key={header} type="header" data={header} />
        ))}
      </div>

      <div className="table-body overflow-y-auto max-h-64 w-full">
        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite: Satellite) => (
            <div
              key={satellite.satelliteId}
              className={`flex justify-between items-center self-stretch rounded-md bg-neutral-950 ${
                satellite.satelliteId === selectedSatelliteId
                  ? 'bg-blue-500' // Add style for selected row
                  : ''
              }`}
              onClick={() => onSatelliteSelect(satellite.satelliteId)}
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

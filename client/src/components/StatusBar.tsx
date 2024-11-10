import { format } from 'date-fns';

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

interface StatusBarProps {
  satelliteData: Satellite[];
  loading: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ satelliteData, loading }) => {
  const date = new Date();
  const fmtDate = format(date, 'dd-MM-yyyy');
  const fmtTime = format(date, 'HH:mm');

  const satellites = satelliteData?.satellites || [];
  const totalSatellites = satellites.length;
  const trackedSatellites = satellites.filter(
    (satellite) =>
      satellite.latitudeDeg !== undefined &&
      satellite.longitudeDeg !== undefined
  ).length;
  const untrackedSatellites = totalSatellites - trackedSatellites;

  return (
    <>
      <div className=" flex flex-row items-center justify-between py-1 px-4 bg-neutral-900">
        <div>LOGO</div>
        <div className="flex flex-row items-center text-right gap-5">
          <div>Total: {totalSatellites}</div>
          <div>Untracked: {untrackedSatellites}</div>
          <div>{fmtDate}</div>
          <div>{fmtTime}</div>
        </div>
      </div>
    </>
  );
};

export default StatusBar;

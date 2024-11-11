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
  // const fmtDate = format(date, 'dd-MM-yyyy');
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
      <div className="flex w-auto gap-2">
        <div className="bg-transparent p-2 rounded-sm font-bold flex items-center justify-center">
          <img
            className="w-5 pr-1"
            src="../../../public/icons/map/sidebar/clockicon.png"
            alt=""
          />
          {fmtTime}
        </div>
        <div className="bg-transparent p-2 rounded-sm font-bold flex items-center justify-center">
          <img
            className="w-5 pr-1"
            src="../../../public/icons/map/sidebar/sourceicon.png"
            alt=""
          />
          TLE
        </div>
        <div className="bg-transparent p-2 rounded-sm font-bold flex items-center justify-center">
          <img
            className="w-5 pr-1"
            src="../../../public/icons/map/sidebar/totalicon.png"
            alt=""
          />
          Total: {totalSatellites}
        </div>
        <div className="bg-transparent p-2 rounded-sm font-bold flex items-center justify-center">
          <img
            className="w-5 pr-1"
            src="../../../public/icons/map/sidebar/trackingicon.png"
            alt=""
          />
          Tracking: {trackedSatellites}
        </div>
      </div>
    </>
  );
};

export default StatusBar;

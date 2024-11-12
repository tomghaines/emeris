import { format } from 'date-fns';
import { useState, useEffect } from 'react';

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
  trackedSatelliteCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  satelliteData,
  trackedSatelliteCount,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Render time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const satellites = satelliteData || [];
  const totalSatellites = satellites.length;
  const avgAltitude =
    satellites.reduce((acc, sat) => acc + sat.height, 0) / totalSatellites;

  // Calculate statistics
  const stats = {
    highestSat: Math.max(...satellites.map((s) => s.height)),
    lowestSat: Math.min(...satellites.map((s) => s.height)),
    avgAltitude: avgAltitude,
    visibleSats: satellites.filter((s) => s.elevation > 0).length,
  };

  return (
    <div className="flex flex-col gap-2 bg-[#000F2C]/90 backdrop-blur-sm rounded-md border border-[#FFFFFF15] p-2 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-[#FFFFFF15] pr-4">
          <div className="bg-transparent font-bold flex items-center">
            <div className="flex flex-col">
              <span className="text-lg">{format(currentTime, 'HH:mm:ss')}</span>
              <span className="text-xs text-gray-400">
                {format(currentTime, 'dd MMM yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusItem
            icon="/icons/map/sidebar/sourceicon.png"
            label="Source"
            value="TLE"
            tooltip="Two-Line Element Set Data Source"
          />
          <StatusItem
            icon="/icons/map/sidebar/totalicon.png"
            label="Total"
            value={totalSatellites}
            tooltip="Total number of satellites"
          />
          <StatusItem
            icon="/icons/map/sidebar/trackingicon.png"
            label="Tracking"
            value={trackedSatelliteCount}
            tooltip="Currently tracked satellites"
            highlighted={trackedSatelliteCount > 0}
          />
          <StatusItem
            icon="/icons/map/sidebar/eyeicon.png"
            label="Visible"
            value={stats.visibleSats}
            tooltip="Satellites currently visible above horizon"
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto bg-[#1B64F315] hover:bg-[#1B64F330] rounded-md transition-all duration-300"
        >
          <img
            className={`w-6 h-6 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            src="/icons/map/sidebar/expandedicon.png"
            alt="Expand"
          />
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#FFFFFF15] mt-1">
          <DetailItem
            label="Average Altitude"
            value={`${stats.avgAltitude.toFixed(0)} km`}
          />
          <DetailItem
            label="Highest Satellite"
            value={`${stats.highestSat.toFixed(0)} km`}
          />
          <DetailItem
            label="Lowest Satellite"
            value={`${stats.lowestSat.toFixed(0)} km`}
          />
        </div>
      )}
    </div>
  );
};

interface StatusItemProps {
  icon: string;
  label: string;
  value: string | number;
  tooltip: string;
  highlighted?: boolean;
}

const StatusItem = ({
  icon,
  label,
  value,
  tooltip,
  highlighted = false,
}: StatusItemProps) => (
  <div className="flex gap-2" title={tooltip}>
    <img className="w-4 h-4" src={icon} alt={label} />
    <div className="flex flex-col">
      <span className="text-xs text-gray-400">{label}</span>
      <span
        className={`font-bold ${highlighted ? 'text-[#1BF3A4]' : 'text-white'}`}
      >
        {value}
      </span>
    </div>
  </div>
);

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div className="flex items-center justify-between bg-[#1B64F310] p-2 rounded-md">
    <div className="flex flex-col">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  </div>
);

export default StatusBar;

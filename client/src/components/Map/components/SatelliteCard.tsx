import { Satellite } from '../utils/constants';

interface SatelliteCardProps {
  satellite: Satellite;
  trackedSatellites: string[] | null;
}

export const SatelliteCard = ({
  satellite,
  trackedSatellites,
}: SatelliteCardProps) => {
  return (
    <div
      className={`border-[1px] rounded-md w-full p-3 
        ${
          trackedSatellites?.includes(satellite._id)
            ? 'bg-[#000F2C] border-[#1bf3a450] text-[#1BF3A4]'
            : 'bg-[#000F2C] border-[#FFFFFF15] text-[#467dff]'
        }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base">{satellite.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full 
          ${
            trackedSatellites?.includes(satellite._id)
              ? 'bg-[#034838] text-[#1BF3A4]'
              : 'bg-[#1b64f315] text-[#467dff]'
          }`}
        >
          {trackedSatellites?.includes(satellite._id)
            ? 'Tracking'
            : 'Not tracked'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Altitude', value: satellite.height, unit: 'km' },
          { label: 'Velocity', value: satellite.velocity, unit: 'km/s' },
          { label: 'Latitude', value: satellite.latitudeDeg, unit: '°' },
          { label: 'Longitude', value: satellite.longitudeDeg, unit: '°' },
          { label: 'Azimuth', value: satellite.azimuth, unit: '°' },
          { label: 'Elevation', value: satellite.elevation, unit: '°' },
        ].map(({ label, value, unit }) => (
          <div key={label} className="flex flex-col">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="font-medium text-sm">
              {value.toFixed(2)}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { memo, useMemo } from 'react';
import { Circle } from 'react-leaflet';
import { Satellite, MAP_CONSTANTS } from '../utils/constants';

interface CoverageProps {
  satellite: Satellite;
  color: string;
}

export const CoverageCircle = memo(({ satellite, color }: CoverageProps) => {
  const radius = useMemo(() => {
    const centralAngle =
      Math.acos(
        MAP_CONSTANTS.EARTH_RADIUS /
          (MAP_CONSTANTS.EARTH_RADIUS + satellite.height)
      ) -
      (MAP_CONSTANTS.MIN_ELEVATION_ANGLE * Math.PI) / 180;
    return MAP_CONSTANTS.EARTH_RADIUS * centralAngle * 1000; // Convert to meters
  }, [satellite.height]);

  return (
    <Circle
      center={[satellite.latitudeDeg, satellite.longitudeDeg]}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.1,
        weight: 1,
      }}
    />
  );
});

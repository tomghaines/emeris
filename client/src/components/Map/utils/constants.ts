export const MAP_CONSTANTS = {
  DEFAULT_CENTER: [25, 0],
  DEFAULT_ZOOM: 2,
  MIN_ZOOM: 2,
  MAX_ZOOM: 12,
  EARTH_RADIUS: 6371, // km
  MIN_ELEVATION_ANGLE: 10, // degrees
} as const;

export const MARKER_COLORS = {
  DEFAULT: '#FF6B6B',
  SELECTED: '#467DFF',
  TRACKED: '#1BF3A4',
} as const;

export interface Satellite {
  _id: string;
  name: string;
  date: string;
  longitudeDeg: number;
  latitudeDeg: number;
  height: number;
  velocity: number;
  azimuth: number;
  elevation: number;
  rangeSat: number;
  doppler: number;
  heading: number;
}

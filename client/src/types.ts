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

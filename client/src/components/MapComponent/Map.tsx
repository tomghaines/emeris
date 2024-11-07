import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './map.css';
import 'leaflet/dist/leaflet.css';

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

interface MapProps {
  satelliteData: Satellite[];
  loading: boolean;
}

const Map: React.FC<MapProps> = ({ satelliteData, loading }) => {
  const center: LatLngExpression = [0, 0];
  const zoom = 2;
  const minZoom = 2;
  const maxZoom = 12;

  const mapKey = import.meta.env.VITE_MAPTILER_API_KEY;

  if (loading) return <div>Loading map...</div>;

  const filteredSatellites = satelliteData.filter(
    (satellite) =>
      satellite.latitudeDeg !== undefined &&
      satellite.longitudeDeg !== undefined
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/backdrop-dark/{z}/{x}/{y}.png?key=${mapKey}`}
        attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
      />
      {filteredSatellites.map((satellite) => {
        const { latitudeDeg, longitudeDeg, satelliteId } = satellite;

        if (latitudeDeg !== undefined && longitudeDeg !== undefined) {
          return (
            <Marker key={satelliteId} position={[latitudeDeg, longitudeDeg]}>
              <Popup>
                <div>
                  <strong>{satellite.name}</strong>
                </div>
              </Popup>
            </Marker>
          );
        } else {
          console.warn('Invalid satellite data:', satellite);
          return null;
        }
      })}
    </MapContainer>
  );
};

export default Map;

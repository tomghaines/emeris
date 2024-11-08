import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './map.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

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
  selectedSatelliteId: number | null;
  onSatelliteSelect: (id: number | null) => void;
}

const Map: React.FC<MapProps> = ({
  satelliteData,
  loading,
  selectedSatelliteId,
  onSatelliteSelect,
}) => {
  const center: LatLngExpression = [25, 0];
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

  // Handle centering the map on a selected satellite
  const CenterMapOnSelectedSatellite = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedSatelliteId !== null) {
        const selectedSatellite = filteredSatellites.find(
          (sat) => sat.satelliteId === selectedSatelliteId
        );
        if (selectedSatellite) {
          map.setView(
            [selectedSatellite.latitudeDeg, selectedSatellite.longitudeDeg],
            3
          );
        }
      }
    });

    return null; // Doesn’t render anything on the map
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <CenterMapOnSelectedSatellite />
      <TileLayer
        url={`https://api.maptiler.com/maps/backdrop-dark/{z}/{x}/{y}.png?key=${mapKey}`}
        attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
      />
      {filteredSatellites.map((satellite) => {
        const { latitudeDeg, longitudeDeg, satelliteId } = satellite;

        if (latitudeDeg !== undefined && longitudeDeg !== undefined) {
          return (
            <Marker
              key={satelliteId}
              position={[latitudeDeg, longitudeDeg]}
              eventHandlers={{
                click: () => onSatelliteSelect(satellite.satelliteId),
              }}
            >
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

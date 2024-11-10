import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './map.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

interface Satellite {
  _id: string;
  name: string;
  date: string;
  longitudeDeg: number;
  latitudeDeg: number;
  height: number;
  azimuth: number;
  elevation: number;
  rangeSat: number;
  doppler: number;
  lastUpdateTimestamp: string;
}

interface MapProps {
  satelliteData: Satellite[];
  loading: boolean;
  selectedSatelliteId: string | null;
  onSatelliteSelect: (id: string | null) => void;
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
  console.log(satelliteData);
  const satellites = satelliteData?.satellites || [];
  const filteredSatellites = satellites.filter(
    (satellite) =>
      satellite.latitudeDeg !== undefined &&
      satellite.longitudeDeg !== undefined
  );

  // Handle centering on marker on a selected satellite
  const CenterMapOnSelectedSatellite = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedSatelliteId !== null) {
        const selectedSatellite = filteredSatellites.find(
          (sat) => sat._id === selectedSatelliteId
        );
        if (selectedSatellite) {
          map.setView(
            [selectedSatellite.latitudeDeg, selectedSatellite.longitudeDeg],
            2
          );
        }
      }
    });

    return null;
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
        const { latitudeDeg, longitudeDeg, _id } = satellite;

        if (latitudeDeg !== undefined && longitudeDeg !== undefined) {
          return (
            <Marker
              key={_id}
              position={[latitudeDeg, longitudeDeg]}
              eventHandlers={{
                click: () => onSatelliteSelect(satellite._id),
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

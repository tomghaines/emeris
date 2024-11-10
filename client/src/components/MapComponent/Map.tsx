import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect, useMemo } from 'react';
import './map.css';
import 'leaflet/dist/leaflet.css';

interface Satellite {
  _id: string;
  name: string;
  longitudeDeg: number;
  latitudeDeg: number;
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
  const mapKey = import.meta.env.VITE_MAPTILER_API_KEY;

  if (loading) return <div>Loading map...</div>;

  // Function to center map on a selected satellite
  const CenterMapOnSelectedSatellite = () => {
    const map = useMap();

    // Optimize satellite lookup
    const selectedSatellite = useMemo(() => {
      return satelliteData.find((sat) => sat._id === selectedSatelliteId);
    }, [selectedSatelliteId, satelliteData]);

    useEffect(() => {
      if (selectedSatellite) {
        map.setView(
          [selectedSatellite.latitudeDeg, selectedSatellite.longitudeDeg],
          map.getZoom()
        );
      }
    }, [selectedSatellite, map]);

    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={2}
      maxZoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <CenterMapOnSelectedSatellite />
      <TileLayer
        url={`https://api.maptiler.com/maps/backdrop-dark/{z}/{x}/{y}.png?key=${mapKey}`}
        attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
      />
      {satelliteData.map((satellite) => (
        <Marker
          key={satellite._id}
          position={[satellite.latitudeDeg, satellite.longitudeDeg]}
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
      ))}
    </MapContainer>
  );
};

export default Map;

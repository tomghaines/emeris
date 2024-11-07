import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { MockData } from '../../services/mockData';

const mockData = MockData;

const Map = () => {
  const [satellites, setSatellites] = useState(mockData);
  const [mapKey, setMapKey] = useState<string | null>(null);

  useEffect(() => {
    setMapKey(import.meta.env.VITE_MAPTILER_API_KEY);
  }, []);

  // const updateSatellites = (newData: typeof mockData) => {
  //   setSatellites(newData);
  // };

  const center: LatLngExpression = [0, 0];
  const zoom = 2;
  const minZoom = 2;
  const maxZoom = 12;

  if (!mapKey) return <div>Map Loading</div>;

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
        attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        tileSize={256}
      />

      {satellites.map((satellite) => (
        <Marker
          key={satellite.satelliteId}
          position={[satellite.latitudeDeg, satellite.longitudeDeg]}
        >
          <Popup></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;

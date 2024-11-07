import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { MockData } from '../../services/mockData';

const mockData = MockData;

const Map = () => {
  const [mapKey, setMapKey] = useState<string | null>(null);

  useEffect(() => {
    setMapKey(import.meta.env.VITE_MAPTILER_API_KEY);
  }, []);

  const markers = [
    { geocode: [35.6844, 139.753], popUp: 'Tokyo' },
    { geocode: [48.8566, 2.3522], popUp: 'Paris' },
    { geocode: [51.5074, -0.1278], popUp: 'London' },
  ];

  const center: LatLngExpression = [0, 0];
  const zoom = 3;
  const minZoom = 3;
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        tileSize={256}
      />

      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode}>
          <Popup>{marker.popUp}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;

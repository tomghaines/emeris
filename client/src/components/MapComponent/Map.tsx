import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const Map = () => {
  const markers = [
    {
      geocode: [-12.183, 60.169],
      popUp: 'popup',
    },
    {
      geocode: [48.98, -30.787],
      popUp: 'popup',
    },
    {
      geocode: [-15.255, -14.047],
      popUp: 'popup',
    },
  ];

  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={2}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
      />
      {markers.map((marker) => (
        <Marker position={marker.geocode}></Marker>
      ))}
    </MapContainer>
  ); // change these coords to centre of map
};

export default Map;

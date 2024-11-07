import { MapContainer } from 'react-leaflet';

const Map = () => {
  return <MapContainer center={[48.8566, 2.3522]} zoom={10}></MapContainer>; // change these coords to centre of map
};

export default Map;

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
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
  satelliteRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
}

const Map: React.FC<MapProps> = ({
  satelliteData,
  loading,
  selectedSatelliteId,
  onSatelliteSelect,
  satelliteRefs,
}) => {
  const center: LatLngExpression = [25, 0];
  const zoom = 2;
  const mapKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const mapRef = useRef(null);

  const customIcon = new L.icon({
    iconUrl: '../../../public/icons/map/sidebar/menudotg.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32],
    opacity: 0.5,
  });

  if (loading) return <div>Loading map...</div>;

  // Function to center map on a selected satellite
  // const CenterMapOnSelectedSatellite = () => {
  //   const map = useMap();

  //   // Optimize satellite lookup
  //   const selectedSatellite = useMemo(() => {
  //     return satelliteData.find((sat) => sat._id === selectedSatelliteId);
  //   }, [selectedSatelliteId, satelliteData]);

  //   useEffect(() => {
  //     if (selectedSatellite) {
  //       map.setView(
  //         [selectedSatellite.latitudeDeg, selectedSatellite.longitudeDeg],
  //         map.getZoom()
  //       );
  //     }
  //   }, [selectedSatellite, map]);

  //   return null;
  // };

  // Function to handle map clicks and select the satellite from the map
  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng; // Get the coordinates of the clicked position
    const clickedSatellite = satelliteData.find(
      (satellite) =>
        satellite.latitudeDeg === lat && satellite.longitudeDeg === lng
    );

    if (clickedSatellite) {
      onSatelliteSelect(clickedSatellite._id); // Update the sidebar and trigger scrolling
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={2}
      maxZoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      onClick={handleMapClick} // Listen to the map click event
    >
      {/* <CenterMapOnSelectedSatellite /> */}
      <TileLayer
        url={`https://api.maptiler.com/maps/backdrop-dark/{z}/{x}/{y}.png?key=${mapKey}`}
        attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
      />
      {satelliteData.map((satellite) => (
        <Marker
          key={satellite._id}
          icon={customIcon}
          position={[satellite.latitudeDeg, satellite.longitudeDeg]}
          eventHandlers={{
            click: () => onSatelliteSelect(satellite._id), // Update sidebar when a marker is clicked
            mouseover: (e) => {
              e.target.setOpacity(0.5);
            },
            mouseout: (e) => {
              e.target.setOpacity(1);
            },
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

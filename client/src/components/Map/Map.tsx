import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { SatelliteMarker } from './components/SatelliteMarker';
import { CoverageCircle } from './components/CoverageCircle';
import { Satellite, MAP_CONSTANTS } from './utils/constants';
import { MARKER_COLORS } from './utils/constants';
import './styles/map.css';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  satelliteData: Satellite[];
  loading: boolean;
  selectedSatelliteId: string | null;
  onSatelliteSelect: (id: string | null) => void;
  trackedSatellites: string[] | null;
  markerRefs: React.RefObject<{ [key: string]: LeafletMarker | null }>;
}

const Map = forwardRef<LeafletMap | null, MapProps>(
  (
    {
      satelliteData,
      loading,
      selectedSatelliteId,
      onSatelliteSelect,
      trackedSatellites = [],
      markerRefs,
    },
    ref
  ) => {
    const mapRef = useRef<LeafletMap | null>(null);

    useImperativeHandle(ref, () => mapRef.current || null);

    const [showCoverage, setShowCoverage] = useState(false);
    const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('satellite');

    const mapKey = import.meta.env.VITE_MAPTILER_API_KEY;

    const filteredSatellites = satelliteData;

    if (loading) {
      return (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-[#000F2C]/80 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1BF3A4]" />
        </div>
      );
    }

    return (
      <div className="relative h-full w-full">
        {/* Control Panel */}
        <div className="absolute bottom-2 left-2 z-[1000] flex flex-col gap-4">
          <div className="bg-transparent rounded-lg backdrop-blur-sm shadow-lg">
            <button
              onClick={() =>
                setMapStyle((prev) => (prev === 'dark' ? 'satellite' : 'dark'))
              }
              className="w-full px-3 py-2 bg-[#000F2C] text-white rounded-md border border-[#FFFFFF15] 
                 hover:border-[#1B64F360] transition-all duration-300"
            >
              {mapStyle === 'dark' ? 'Satellite View' : 'Dark View'}
            </button>

            <button
              onClick={() => setShowCoverage((prev) => !prev)}
              className={`w-full px-3 py-2 rounded-md border transition-all duration-300 mt-2
          ${
            showCoverage
              ? 'bg-[#034838] text-[#1BF3A4] border-[#1BF3A4]'
              : 'bg-[#000F2C] text-white border-[#FFFFFF15] hover:border-[#1B64F360]'
          }`}
            >
              Coverage
            </button>
          </div>
        </div>

        <div className="absolute inset-0">
          <MapContainer
            center={MAP_CONSTANTS.DEFAULT_CENTER}
            zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
            minZoom={MAP_CONSTANTS.MIN_ZOOM}
            maxZoom={MAP_CONSTANTS.MAX_ZOOM}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            ref={(map) => {
              mapRef.current = map;
            }}
            className={mapStyle === 'satellite' ? 'satellite-map' : ''}
          >
            <TileLayer
              url={
                mapStyle === 'dark'
                  ? `https://api.maptiler.com/maps/backdrop-dark/{z}/{x}/{y}.png?key=${mapKey}`
                  : `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${mapKey}`
              }
              attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
            />
            <ZoomControl position="bottomright" />

            {filteredSatellites.map((satellite) => (
              <div key={satellite._id}>
                <SatelliteMarker
                  satellite={satellite}
                  isSelected={satellite._id === selectedSatelliteId}
                  isTracked={trackedSatellites?.includes(satellite._id)}
                  onClick={() => onSatelliteSelect(satellite._id)}
                  markerRef={(marker) => {
                    if (marker) {
                      markerRefs.current[satellite._id] = marker;
                    } else {
                      delete markerRefs.current[satellite._id];
                    }
                  }}
                />

                {showCoverage && trackedSatellites?.includes(satellite._id) && (
                  <CoverageCircle
                    satellite={satellite}
                    color={MARKER_COLORS.TRACKED}
                  />
                )}
              </div>
            ))}
          </MapContainer>
        </div>
      </div>
    );
  }
);

export default Map;

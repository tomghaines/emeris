import { memo, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import { MarkerFactory } from '../utils/markerUtils';
import { SatelliteCard } from './SatelliteCard';
import { Satellite } from '../utils/constants';
import L from 'leaflet';

interface SatelliteMarkerProps {
  satellite: Satellite;
  isSelected: boolean;
  isTracked: boolean;
  onClick: () => void;
  markerRef?: (marker: LeafletMarker | null) => void;
}

export const SatelliteMarker = memo(
  ({
    satellite,
    isSelected,
    isTracked,
    onClick,
    markerRef,
  }: SatelliteMarkerProps) => {
    const markerType = useMemo(() => {
      if (isTracked) return 'tracked';
      if (isSelected) return 'selected';
      return 'default';
    }, [isTracked, isSelected]);

    const icon = useMemo(
      () => MarkerFactory.getMarker(markerType, satellite._id),
      [markerType, satellite._id]
    );

    const position = useMemo(
      () => new L.LatLng(satellite.latitudeDeg, satellite.longitudeDeg),
      [satellite.latitudeDeg, satellite.longitudeDeg]
    );

    return (
      <Marker
        position={position}
        icon={icon}
        ref={markerRef}
        eventHandlers={{
          click: onClick,
          add: (e) => {
            const marker = e.target;
            marker.getElement()?.classList.add('leaflet-marker-fade');
          },
        }}
      >
        <Popup className="satellite-popup">
          <SatelliteCard
            satellite={satellite}
            trackedSatellites={isTracked ? [satellite._id] : []}
          />
        </Popup>
      </Marker>
    );
  }
);

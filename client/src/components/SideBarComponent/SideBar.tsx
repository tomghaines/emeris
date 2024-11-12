import { useEffect, useState } from 'react';
import type { Satellite } from '../Map/utils/constants';
import type { Marker } from 'leaflet';

interface SideBarProps {
  satelliteData: Satellite[];
  loading: boolean;
  selectedSatelliteId: string | null;
  onSatelliteSelect: (id: string | null) => void;
  satelliteRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
  handleTrackSatellite: (id: string) => void;
  trackedSatellites: string[] | null;
  mapRef: React.RefObject<L.Map | null>;
  markerRefs: React.RefObject<{ [key: string]: Marker | null }>;
}

const SideBar = ({
  satelliteData,
  loading,
  selectedSatelliteId,
  onSatelliteSelect,
  satelliteRefs,
  handleTrackSatellite,
  trackedSatellites,
  mapRef,
  markerRefs,
}: SideBarProps) => {
  const [openSatDropdown, setOpenSatDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'tracked' | 'selected'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'name' | 'altitude' | 'velocity'>(
    'name'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (selectedSatelliteId) {
      setOpenSatDropdown(selectedSatelliteId);
    }
  }, [selectedSatelliteId]);

  useEffect(() => {
    if (
      selectedSatelliteId &&
      satelliteRefs.current &&
      satelliteRefs.current[selectedSatelliteId]
    ) {
      satelliteRefs.current[selectedSatelliteId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedSatelliteId, satelliteRefs]);

  const getFilteredAndSortedSatellites = () => {
    const filtered = satelliteData
      .filter(
        (satellite) =>
          satellite.latitudeDeg !== undefined &&
          satellite.longitudeDeg !== undefined
      )
      .filter((satellite) =>
        satellite.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((satellite) => {
        switch (filterMode) {
          case 'tracked':
            return trackedSatellites?.includes(satellite._id);
          case 'selected':
            return satellite._id === selectedSatelliteId;
          default:
            return true;
        }
      });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'altitude':
          comparison = a.height - b.height;
          break;
        case 'velocity':
          comparison = a.velocity - b.velocity;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filteredSatellites = getFilteredAndSortedSatellites();

  const handleSortChange = (newSortBy: 'name' | 'altitude' | 'velocity') => {
    if (sortBy === newSortBy) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const handleSatelliteClick = (_id: string) => {
    setOpenSatDropdown((prevId) => (prevId === _id ? null : _id));
    onSatelliteSelect(_id);

    const satellite = filteredSatellites.find((s) => s._id === _id);
    if (mapRef.current && markerRefs.current && markerRefs.current[_id]) {
      markerRefs.current[_id]?.openPopup();
      mapRef.current.flyTo(
        [satellite?.latitudeDeg || 0, satellite?.longitudeDeg || 0],
        4,
        {
          duration: 1.5,
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#000F2C]/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1BF3A4]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-center h-full">
      <div className="w-full mb-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search satellites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-[#000F2C] border-[1px] border-[#FFFFFF15] rounded-md 
               text-white placeholder-gray-400 focus:outline-none focus:border-[#1B64F360]
               pr-16"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <span className="text-gray-400 text-sm">
              {filteredSatellites.length}/{satelliteData.length}
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white ml-2"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { mode: 'all', label: 'All', count: satelliteData.length },
            {
              mode: 'tracked',
              label: 'Tracked',
              count: trackedSatellites?.length || 0,
            },
            {
              mode: 'selected',
              label: 'Selected',
              count: selectedSatelliteId ? 1 : 0,
            },
          ].map(({ mode, label, count }) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode as any)}
              className={`px-3 py-2 rounded-md font-semibold border-[1px] transition-all duration-300 
                text-sm flex flex-riw items-center justify-center gap-1
                ${
                  filterMode === mode
                    ? mode === 'tracked'
                      ? 'bg-[#034838] border-[#1BF3A4] text-[#1BF3A4]'
                      : 'bg-[#1B64F3] border-[#1B64F3] text-white'
                    : 'bg-[#000F2C] border-[#FFFFFF15] text-gray-400 hover:border-[#1B64F360]'
                }`}
            >
              <span>{label}</span>
              <span className="text-xs opacity-75">({count})</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { key: 'name', label: 'Name' },
            { key: 'altitude', label: 'Altitude' },
            { key: 'velocity', label: 'Velocity' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSortChange(key as any)}
              className={`px-3 py-1.5 rounded-md text-xs border-[1px] transition-all duration-300 flex items-center gap-1
                ${
                  sortBy === key
                    ? 'bg-[#1B64F3] border-[#1B64F3] text-white'
                    : 'bg-[#000F2C] border-[#FFFFFF15] text-gray-400 hover:border-[#1B64F360]'
                }`}
            >
              {label}
              {sortBy === key && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="satellite-list w-full overflow-y-auto flex-1 gap-2">
        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite: Satellite) => (
            <div
              ref={(el) =>
                satelliteRefs.current
                  ? (satelliteRefs.current[satellite._id] = el)
                  : null
              }
              key={satellite._id}
              className="satellite-item mb-3"
            >
              <div
                className={`flex flex-col w-full items-center rounded-md border-[1px] 
                  ${
                    trackedSatellites?.includes(satellite._id)
                      ? 'border-[#1bf3a450] bg-[#000F2C] hover:border-[#1bf3a470] text-[#1BF3A4]'
                      : 'border-[#FFFFFF15] hover:border-[#1B64F360] hover:bg-[#000F2C]'
                  }  
                  ${
                    satellite._id === selectedSatelliteId
                      ? 'bg-[#000F2C] border-[#1b63f325]'
                      : 'bg-[#000715]'
                  }
                  transition-all duration-300`}
              >
                <div
                  onClick={() => handleSatelliteClick(satellite._id)}
                  className="flex w-full items-center justify-between cursor-pointer p-2.5 text-[#d4d4d4] hover:text-[#fff]"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src="/icons/map/sidebar/menudotb.png"
                      alt=""
                    />
                    <span className="font-bold">{satellite.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{satellite.height.toFixed(0)} km</span>
                    <span>{satellite.velocity.toFixed(1)} km/s</span>
                  </div>
                </div>

                {openSatDropdown === satellite._id && (
                  <div className="satellite-details flex gap-2 text-[#ebebeb] tracking-wide flex-col p-2.5 mt-[-8px] bg-transparent w-full">
                    <div className="flex flex-col gap-1.5">
                      {[
                        {
                          label: 'Velocity',
                          value: satellite.velocity,
                          unit: 'km/s',
                        },
                        {
                          label: 'Altitude',
                          value: satellite.height,
                          unit: 'km',
                        },
                        {
                          label: 'Latitude',
                          value: satellite.latitudeDeg,
                          unit: '°',
                        },
                        {
                          label: 'Longitude',
                          value: satellite.longitudeDeg,
                          unit: '°',
                        },
                        {
                          label: 'Heading',
                          value: satellite.heading,
                          unit: '°',
                        },
                        {
                          label: 'Azimuth',
                          value: satellite.azimuth,
                          unit: '°',
                        },
                        {
                          label: 'Range',
                          value: satellite.rangeSat,
                          unit: 'km',
                        },
                        {
                          label: 'Doppler',
                          value: satellite.doppler,
                          unit: '°',
                        },
                      ].map(({ label, value, unit }) => (
                        <div key={label} className="flex items-center px-2">
                          <img
                            className="w-5 h-5 mr-1.5"
                            src={`/icons/map/sidebar/${label.toLowerCase()}icon.png`}
                            alt=""
                          />
                          <p className="w-full flex justify-between">
                            <strong>{label}:</strong> {value.toFixed(4)} {unit}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex p-2 w-full mt-2">
                      <button
                        onClick={() => handleTrackSatellite(satellite._id)}
                        className={`flex p-2 w-full items-center justify-center font-semibold border-[1px] border-[#FFFFFF10] rounded ${
                          trackedSatellites?.includes(satellite._id)
                            ? 'bg-[#410C19] text-[#F31B4F] hover:bg-[#F31B4F] hover:text-[#410C19] hover:border-[#F31B4F] ease-out duration-300'
                            : 'bg-[#034838] text-[#1BF3A4] hover:bg-[#1BF3A4] hover:text-[#034838] hover:border-[#1BF3A4] ease-out duration-300'
                        }`}
                      >
                        {trackedSatellites?.includes(satellite._id)
                          ? 'UN-TRACK'
                          : 'TRACK'}{' '}
                        {satellite.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-4">
            <p className="text-lg mb-2">No satellites found</p>
            <p className="text-sm">
              {searchQuery
                ? 'Try adjusting your search terms'
                : filterMode === 'tracked'
                ? 'No tracked satellites yet'
                : filterMode === 'selected'
                ? 'No satellite selected'
                : 'No satellites available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;

// import { useEffect, useRef, useState } from 'react';

interface Satellite {
  _id: string;
  name: string;
  date: string;
  longitudeDeg: number;
  latitudeDeg: number;
  height: number;
  velocity: number;
  azimuth: number;
  elevation: number;
  rangeSat: number;
  doppler: number;
  heading: number;
}

interface SideBarProps {
  satelliteData: Satellite[];
  loading: boolean;
  selectedSatelliteId: string | null;
  onSatelliteSelect: (id: string | null) => void;
}

import { useEffect, useState } from 'react';

interface Satellite {
  _id: string;
  name: string;
  date: string;
  longitudeDeg: number;
  latitudeDeg: number;
  height: number;
  velocity: number;
  azimuth: number;
  elevation: number;
  rangeSat: number;
  doppler: number;
  heading: number;
}

interface SideBarProps {
  satelliteData: Satellite[];
  loading: boolean;
  selectedSatelliteId: string | null;
  onSatelliteSelect: (id: string | null) => void;
  satelliteRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
}

const SideBar = ({
  satelliteData,
  loading,
  selectedSatelliteId,
  onSatelliteSelect,
  satelliteRefs,
}: SideBarProps) => {
  const [openSatDropdown, setOpenSatDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSatelliteId) {
      setOpenSatDropdown(selectedSatelliteId); // Auto-open dropdown for selected satellite
    }
  }, [selectedSatelliteId]);

  useEffect(() => {
    if (selectedSatelliteId && satelliteRefs.current[selectedSatelliteId]) {
      // Scroll selected satellite into view when
      satelliteRefs.current[selectedSatelliteId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedSatelliteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-bold text-center text-large">Loading data...</p>
      </div>
    );
  }

  const filteredSatellites = satelliteData.filter(
    (satellite) =>
      satellite.latitudeDeg !== undefined &&
      satellite.longitudeDeg !== undefined
  );

  const handleSatelliteClick = (_id: string) => {
    setOpenSatDropdown((prevId) => (prevId === _id ? null : _id));
    onSatelliteSelect(_id);
  };

  return (
    <div className="p-3 flex flex-col items-start justify-center h-full overflow-auto">
      <div className="satellite-list w-full overflow-y-auto flex-1 gap-2">
        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite: Satellite) => (
            <div
              ref={(el) => (satelliteRefs.current[satellite._id] = el)}
              key={satellite._id}
              className="satellite-item mb-3 br"
            >
              <div
                className={`flex flex-col w-full items-center rounded-md border-[1px] border-[#FFFFFF15] hover:border-[#1B64F360] hover:bg-[#000F2C] ease-out duration-300 ${
                  satellite._id === selectedSatelliteId
                    ? 'bg-[#000F2C] border-[#1b63f325]'
                    : 'bg-[#000715]'
                }`}
              >
                <div
                  onClick={() => handleSatelliteClick(satellite._id)}
                  className="flex flex-row w-full gap-2 cursor-pointer h-full p-2.5 text-[#d4d4d4] hover:text-[#fff] ease-out duration-300"
                >
                  <img
                    className="w-5 h-5 mr-[-5px]"
                    src="/icons/map/sidebar/menudotb.png"
                    alt=""
                  />
                  <span className="font-bold">{satellite.name}</span>
                </div>

                {openSatDropdown === satellite._id && (
                  <div className="satellite-details flex gap-2 text-[#ebebeb] tracking-wide flex-col p-2.5 mt-[-8px]  bg-transparrent w-full">
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
                            <strong>{label}:</strong> {value.toFixed(3)} {unit}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex p-2 w-full mt-2">
                      <button className="flex p-2 w-full items-center justify-center font-semibold bg-[#034838] text-[#1BF3A4] border-[1px] border-[#FFFFFF10] rounded hover:bg-[#1BF3A4] hover:text-[#034838] hover:border-[#1BF3A4] ease-out duration-300">
                        TRACK {satellite.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No data to display</p>
        )}
      </div>
    </div>
  );
};

export default SideBar;

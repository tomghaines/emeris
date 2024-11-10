import { useState } from 'react';

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

const SideBar = ({
  satelliteData,
  loading,
  selectedSatelliteId,
  onSatelliteSelect,
}: SideBarProps) => {
  const [openSatDropdown, setOpenSatDropdown] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-bold text-center text-large">Loading data</p>
      </div>
    );
  }

  // Make sure data is structured correctly
  const satellites = satelliteData || [];
  const filteredSatellites = satellites.filter(
    (satellite) =>
      satellite.latitudeDeg !== undefined &&
      satellite.longitudeDeg !== undefined
  );

  const handleSatelliteClick = (_id: string) => {
    setOpenSatDropdown((prevId) => (prevId === _id ? null : _id));
    onSatelliteSelect(_id);
  };

  return (
    <div className="p-2 gap-2 flex flex-col items-start justify-center h-full overflow-hidden ">
      <div className="satellite-list w-full overflow-y-auto flex-1 gap-2">
        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite: Satellite) => (
            <div key={satellite._id} className="satellite-item mb-2 br">
              <div
                className={`flex flex-col w-full gap-2 items-center  rounded-md border-[1px] border-[#FFFFFF15] hover:border-[#1B64F3] hover:bg-[#000F2C] ease-out duration-300 ${
                  satellite._id === selectedSatelliteId
                    ? 'bg-[#000F2C] border-[#1B64F3]'
                    : 'bg-[#000715]'
                }`}
              >
                <div
                  onClick={() => handleSatelliteClick(satellite._id)}
                  className="flex flex-row w-full gap-2 cursor-pointer h-full p-2.5"
                >
                  <span
                    className={`text-sm ${
                      openSatDropdown === satellite._id ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </span>
                  <span className="text-[#fffff] font-bold">
                    {satellite.name}
                  </span>
                </div>

                {openSatDropdown === satellite._id && (
                  <div className="satellite-details flex gap-2 text-[#ebebeb] tracking-wide flex-col p-2.5 mt-[-8px]  bg-transparrent w-full">
                    {/* <p>
                    <strong>Date:</strong> {satellite.date}
                    </p> */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/velocityicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Velocity:</strong>{' '}
                          {JSON.stringify(
                            satellite.velocity.toFixed(3)
                          ).replace(/"([^"]+)"/g, '$1')}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/altitudeicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Altitude:</strong>{' '}
                          {JSON.stringify(satellite.height.toFixed(3)).replace(
                            /"([^"]+)"/g,
                            '$1'
                          )}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/latitudeicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Latitude:</strong>{' '}
                          {JSON.stringify(
                            satellite.latitudeDeg.toFixed(3)
                          ).replace(/"([^"]+)"/g, '$1')}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-cente px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/longitudeicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Longitude:</strong>{' '}
                          {JSON.stringify(
                            satellite.longitudeDeg.toFixed(3)
                          ).replace(/"([^"]+)"/g, '$1')}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/headingicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Heading:</strong>{' '}
                          {JSON.stringify(satellite.heading.toFixed(3)).replace(
                            /"([^"]+)"/g,
                            '$1'
                          )}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/azimuthicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Azimuth:</strong>{' '}
                          {JSON.stringify(satellite.azimuth.toFixed(3)).replace(
                            /"([^"]+)"/g,
                            '$1'
                          )}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/rangeicon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Range:</strong>{' '}
                          {JSON.stringify(
                            satellite.rangeSat.toFixed(3)
                          ).replace(/"([^"]+)"/g, '$1')}{' '}
                          km/s
                        </p>
                      </div>
                      <div className="flex items-center px-2">
                        <img
                          className="w-5 h-5 mr-1.5"
                          src="../../../public/icons/map/sidebar/dopplericon.png"
                          alt=""
                        />
                        <p className="w-full flex justify-between">
                          <strong>Doppler Factor:</strong>{' '}
                          {JSON.stringify(satellite.doppler.toFixed(3)).replace(
                            /"([^"]+)"/g,
                            '$1'
                          )}{' '}
                          km/s
                        </p>
                      </div>
                    </div>
                    <div className="flex p-2 w-full ">
                      <button className="flex p-2 w-full items-center justify-center font-semibold bg-[#034838] text-[#1BF3A4] border-[1px] border-[#FFFFFF10] rounded hover:bg-[#1BF3A4] hover:text-[#034838] hover:border-[#1BF3A4] ease-out duration-300">
                        TRACK SATELLITE
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

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
    <div className="pt-7 flex flex-col items-start justify-center h-full overflow-hidden">
      <h2 className="text-lg font-bold text-white">Satellites</h2>
      <div className="satellite-list w-full overflow-y-auto flex-1">
        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite: Satellite) => (
            <div key={satellite._id} className="satellite-item m-1 mr-3">
              <div
                className={`flex w-full gap-2 items-center p-2 rounded-md cursor-pointer ${
                  satellite._id === selectedSatelliteId
                    ? 'bg-blue-500'
                    : 'bg-neutral-900'
                }`}
                onClick={() => handleSatelliteClick(satellite._id)}
              >
                <span
                  className={`text-sm ${
                    openSatDropdown === satellite._id ? 'rotate-90' : ''
                  }`}
                >
                  ▶
                </span>
                <span className="text-white">{satellite.name}</span>
              </div>

              {openSatDropdown === satellite._id && (
                <div className="satellite-details p-2 bg-neutral-800 mt-2 rounded-md">
                  {/* <p>
                    <strong>Date:</strong> {satellite.date}
                  </p> */}
                  <p>
                    <strong>Velocity:</strong>{' '}
                    {JSON.stringify(satellite.velocity.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}{' '}
                    km/s
                  </p>
                  <p>
                    <strong>Altitude:</strong>{' '}
                    {JSON.stringify(satellite.height.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}{' '}
                    km
                  </p>
                  <p>
                    <strong>Latitude:</strong>{' '}
                    {JSON.stringify(satellite.latitudeDeg.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}
                    °
                  </p>
                  <p>
                    <strong>Longitude:</strong>{' '}
                    {JSON.stringify(satellite.longitudeDeg.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}
                    °
                  </p>

                  <p>
                    <strong>Heading:</strong>{' '}
                    {JSON.stringify(satellite.heading.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}
                    °
                  </p>
                  <p>
                    <strong>Azimuth:</strong>{' '}
                    {JSON.stringify(satellite.azimuth.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}
                    °
                  </p>
                  {/* <p>
                    <strong>Elevation:</strong>{' '}
                    {JSON.stringify(satellite.elevation.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}
                    °
                  </p> */}
                  <p>
                    <strong>Range:</strong>{' '}
                    {JSON.stringify(satellite.rangeSat.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}{' '}
                    km
                  </p>
                  <p>
                    <strong>Doppler:</strong>{' '}
                    {JSON.stringify(satellite.doppler.toFixed(3)).replace(
                      /"([^"]+)"/g,
                      '$1'
                    )}{' '}
                    Hz
                  </p>
                </div>
              )}
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

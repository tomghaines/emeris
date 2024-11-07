import './App.css';
import Map from './components/MapComponent/Map';
import SatelliteData from './components/DisplayDataComponent/SatelliteData';

function App() {
  return (
    <>
      <div className="h-screen overflow-hidden">
        <div className="h-3/4">
          <Map />
        </div>
        <div className="h-1/4 overflow-scroll w-full">
          <SatelliteData />
        </div>
      </div>
    </>
  );
}

export default App;

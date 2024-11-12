import './App.css';

import SatelliteData from './components/SatelliteData';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`absolute z-50 w-screen h-screen bg-black transition-opacity duration-500 ${
            loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <LoadingScreen />
        </div>
        <div
          className={`transition-opacity duration-500 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <SatelliteData />
        </div>
      </div>
    </>
  );
}

export default App;

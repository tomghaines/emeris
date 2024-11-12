import { useEffect, useState } from 'react';
import './spinner.css';

const LoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Circle
  const size = 140;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setLoadingProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#02050A] w-screen h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-grid opacity-5" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-12">
          <svg className="transform -rotate-90 w-[140px] h-[140px]">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#467DFF10"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeLinecap="round"
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              fill="none"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset:
                  circumference - (loadingProgress / 100) * circumference,
                transition: 'stroke-dashoffset 0.3s ease-out',
                filter: 'drop-shadow(0 0 2px #467DFF)',
              }}
            />

            <defs>
              <linearGradient
                id="progress-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#467DFF" />
                <stop offset="100%" stopColor="#1BF3A4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-[#467DFF] to-[#1BF3A4] 
                          bg-clip-text text-transparent tracking-wider mb-1"
            >
              EMERIS
            </h1>
            <span className="text-[#467DFF] text-sm font-medium tracking-widest">
              {loadingProgress}%
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <div
            className="w-1 h-1 rounded-full bg-[#1BF3A4] animate-pulse"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-1 h-1 rounded-full bg-[#1BF3A4] animate-pulse"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-1 h-1 rounded-full bg-[#1BF3A4] animate-pulse"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

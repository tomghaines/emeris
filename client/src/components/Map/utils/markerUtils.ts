import L from 'leaflet';

export const createCustomMarker = (
  color: string,
  glowColor: string,
  size: number,
  pulse: boolean = false
) => {
  const svgTemplate = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-${color}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="
            0 0 0 0 ${glowColor === '#FFA500' ? '1' : '0'}
            0 0 0 0 ${glowColor === '#1BF3A4' ? '1' : '0'}
            0 0 0 0 ${glowColor === '#467DFF' ? '1' : '0'}
            0 0 0 0.6 0" />
          <feBlend in="SourceGraphic" in2="blur" mode="screen" />
        </filter>
      </defs>

      <!-- Outer Glow Circle -->
      <circle
        cx="12"
        cy="12"
        r="6"
        fill="${color}"
        filter="url(#glow-${color})"
        opacity="0.4"
      />

      <!-- Main Circle -->
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="${color}"
        stroke="#000F2C"
        stroke-width="0.5"
      />

      <!-- Inner Circle -->
      ${
        pulse
          ? `
        <circle
          cx="12"
          cy="12"
          r="2"
          fill="#ffffff"
          opacity="0.7"
        />
      `
          : ''
      }

      <!-- Center Dot -->
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  `;

  const base64Svg = btoa(svgTemplate);

  return new L.DivIcon({
    html: `<div class="custom-marker ${pulse ? 'pulse' : ''}"
                style="width: ${size}px; height: ${size}px;">
             <img src="data:image/svg+xml;base64,${base64Svg}"
                  width="${size}"
                  height="${size}"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));" />
           </div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

export const MarkerFactory = {
  markerCache: new Map(),

  getMarker(type: 'default' | 'selected' | 'tracked', id: string) {
    const cacheKey = `${type}-${id}`;
    if (!this.markerCache.has(cacheKey)) {
      const markerConfig = {
        default: {
          color: '#FFA500',
          glowColor: '#FFA500',
          size: 16,
          pulse: false,
        },
        selected: {
          color: '#467DFF',
          glowColor: '#467DFF',
          size: 20,
          pulse: true,
        },
        tracked: {
          color: '#1BF3A4',
          glowColor: '#1BF3A4',
          size: 16,
          pulse: false,
        },
      }[type];

      this.markerCache.set(
        cacheKey,
        createCustomMarker(
          markerConfig.color,
          markerConfig.glowColor,
          markerConfig.size,
          markerConfig.pulse
        )
      );
    }
    return this.markerCache.get(cacheKey);
  },

  clearCache() {
    this.markerCache.clear();
  },
};

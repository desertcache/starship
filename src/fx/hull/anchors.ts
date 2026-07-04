// TODO(v1.1): replace with live export from assembly

export interface StationSlice {
  x: number;      // Position along the long axis (world Z)
  halfW: number;  // Half-width (along X)
  halfH: number;  // Half-height (along Y)
  yCenter: number; // Mid-height coordinate (along Y)
}

export interface AnchorFrame {
  position: [number, number, number]; // [x, y, z]
  normal: [number, number, number];   // [nx, ny, nz]
}

export interface InteriorAnchors {
  slices: StationSlice[];
  canopy: AnchorFrame;
  engineAxis: AnchorFrame;
  cargoDoor: AnchorFrame;
  portholes: AnchorFrame[];
}

export const interiorAnchors: InteriorAnchors = {
  // Z-stations tracing the ship interior from cockpit nose (-25) to portal-room stern (25)
  slices: [
    {
      // Cockpit nose (cockpit.ts W=6, H=3, Z spans -25 to -20)
      x: -25.0,
      halfW: 3.0,
      halfH: 1.5,
      yCenter: 1.5,
    },
    {
      // Cockpit aft bulkhead (cockpit.ts W=6, H=3, Z spans -25 to -20)
      x: -20.0,
      halfW: 3.0,
      halfH: 1.5,
      yCenter: 1.5,
    },
    {
      // Quarters start (quarters.ts placement at X=-4 and X=+4, W=5, H=3, Z spans -18.5 to -13.5)
      // Total X footprint spans from X=-6.5 to X=+6.5
      x: -18.5,
      halfW: 6.5,
      halfH: 1.5,
      yCenter: 1.5,
    },
    {
      // Quarters end (quarters.ts placement at X=-4 and X=+4, W=5, H=3, Z spans -18.5 to -13.5)
      // Total X footprint spans from X=-6.5 to X=+6.5
      x: -13.5,
      halfW: 6.5,
      halfH: 1.5,
      yCenter: 1.5,
    },
    {
      // Corridor aft / galley fore boundary (corridor.ts placement at Z=-12, galley.ts W=6, Z spans -4 to 2)
      x: -4.0,
      halfW: 3.0,
      halfH: 1.5,
      yCenter: 1.5,
    },
    {
      // Galley aft / engineering fore boundary (galley.ts placement at Z=-1, engineering.ts W=6, Z spans 2 to 9)
      x: 2.0,
      halfW: 3.0,
      halfH: 1.5,
      yCenter: 1.5,
    },
    {
      // Engineering aft / cargo bay fore boundary (engineering.ts placement at Z=5.5, cargoBay.ts W=8, H=5, Z spans 9 to 18)
      x: 9.0,
      halfW: 4.0,
      halfH: 2.5,
      yCenter: 2.5,
    },
    {
      // Cargo bay aft / portal-room fore boundary (cargoBay.ts placement at Z=13.5, W=8, H=5, portalRoom.ts W=8, H=3.6, Z spans 18 to 25)
      x: 18.0,
      halfW: 4.0,
      halfH: 2.5,
      yCenter: 2.5,
    },
    {
      // Portal-room aft wall (portalRoom.ts placement at Z=21.5, W=8, H=3.6, Z spans 18 to 25)
      x: 25.0,
      halfW: 4.0,
      halfH: 1.8,
      yCenter: 1.8,
    },
  ],

  // Cockpit window canopy (cockpit.ts window center at Z=-25, YBot=0.7, H=1.9, so YCenter=1.65)
  canopy: {
    position: [0.0, 1.65, -25.0],
    normal: [0.0, 0.0, -1.0],
  },

  // Engine thrust axis at the stern (assembly.ts engineering/stern end at Z=25.0)
  engineAxis: {
    position: [0.0, 1.8, 25.0],
    normal: [0.0, 0.0, 1.0],
  },

  // Cargo bay side cargo door (cargoBay.ts W=8, H=5, centered at Z=13.5, port side X=-4.0, mid-height Y=2.5)
  cargoDoor: {
    position: [-4.0, 2.5, 13.5],
    normal: [-1.0, 0.0, 0.0],
  },

  // Portholes along the corridors and quarters
  portholes: [
    {
      // Corridor port porthole P2 (corridor.ts local Z=-6.0 -> world Z=-18.0, X=-1.5, Y=1.4)
      position: [-1.5, 1.4, -18.0],
      normal: [-1.0, 0.0, 0.0],
    },
    {
      // Quarters A port porthole (quarters.ts local X=-2.5 -> world X=-6.5, Z=-16.0, Y=1.6)
      position: [-6.5, 1.6, -16.0],
      normal: [-1.0, 0.0, 0.0],
    },
    {
      // Corridor port porthole P1 (corridor.ts local Z=3.0 -> world Z=-9.0, X=-1.5, Y=1.45)
      position: [-1.5, 1.45, -9.0],
      normal: [-1.0, 0.0, 0.0],
    },
    {
      // Corridor starboard porthole P2 (corridor.ts local Z=-6.0 -> world Z=-18.0, X=1.5, Y=1.4)
      position: [1.5, 1.4, -18.0],
      normal: [1.0, 0.0, 0.0],
    },
    {
      // Quarters B starboard porthole (quarters.ts local X=2.5 -> world X=6.5, Z=-16.0, Y=1.6)
      position: [6.5, 1.6, -16.0],
      normal: [1.0, 0.0, 0.0],
    },
    {
      // Corridor starboard porthole P1 (corridor.ts local Z=3.0 -> world Z=-9.0, X=1.5, Y=1.45)
      position: [1.5, 1.45, -9.0],
      normal: [1.0, 0.0, 0.0],
    },
  ],
};

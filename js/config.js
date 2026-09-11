// Game Configuration & Constants
export const CONFIG = {
  // World parameters (expanded arena: 2.64x larger area)
  WORLD_RADIUS: 5200,
  HEX_SIZE: 56,
  
  // Snake physics & balance
  BASE_SPEED: 210,            // Normal speed in pixels/sec
  BOOST_SPEED: 430,           // Boost speed in pixels/sec
  BASE_TURN_SPEED: 5.2,       // Radians per second (responsive steering)
  BASE_RADIUS: 13,            // Base body segment radius for starter snake
  SEGMENT_DISTANCE: 10,       // Distance between body segments
  START_MASS: 20,             // Initial starting mass
  MIN_BOOST_MASS: 15,         // Minimum mass required to boost
  BOOST_MASS_RATE: 3.5,       // Mass lost per second while boosting
  BOOST_DROP_INTERVAL: 0.14,  // Seconds between boost orb drops
  
  // Mass & growth scaling (natural, progressive growth)
  MASS_TO_RADIUS_EXP: 0.36,   // Radius growth exponent
  MAX_RADIUS: 46,             // Maximum body segment radius
  MASS_TO_LENGTH_RATIO: 0.28, // Segments added per mass unit (balanced from 0.65)
  
  // Food parameters (clean, non-crowded distribution)
  MAX_FOOD_COUNT: 1300,       // Balanced food count across expanded arena
  SPECIAL_PREY_COUNT: 5,
  PREY_BASE_SPEED: 190,
  PREY_FLEE_SPEED: 370,
  PREY_MASS_VALUE: 20,        // Mass value of special firefly prey
  
  // Bot population & behavior
  BOT_COUNT: 32,
  MIN_BOT_COUNT: 20,
  MAX_BOT_COUNT: 55,
  BOT_RESPAWN_DELAY: 3.0,     // Seconds before respawning a dead bot

  // Bot AI tuning distances (centralised to avoid magic numbers in bot.js / game.js)
  BOT_BOUNDARY_WARN_DIST: 320,    // Distance from boundary where bot steers toward center
  BOT_FEELER_BOUNDARY_MARGIN: 90, // Feeler endpoint boundary safety margin
  BOT_SAFE_SPAWN_MIN_DIST: 1200,  // Min distance from player when spawning a bot
  BOT_SAFE_SPAWN_ATTEMPTS: 25,    // Max placement tries to satisfy the distance constraint
  BOT_CUT_OFF_DETECT_DIST: 260,   // Distance threshold to detect an incoming cut-off threat
  BOT_HEAD_JOUST_DIST: 220,       // Distance at which to switch to head-joust mode
  BOT_CUT_OFF_MAX_DIST: 360,      // Max distance for sprint cut-off boost engagement
  BOT_CUT_OFF_MIN_DIST: 45,       // Min distance below which cut-off boost is not triggered
  BOT_HUNT_RADIUS: 650,           // Search radius for hunting targets
  BOT_FEAST_SEARCH_RADIUS: 450,   // Search radius for death-drop clusters
  BOT_FOOD_SEARCH_RADIUS: 380,    // Search radius for ambient food foraging
  BOT_COIL_TARGET_DIST: 420,      // Max distance to start encirclement coil
  BOT_COIL_MIN_MASS: 70,          // Minimum mass to attempt coiling tactics

  // Spatial hash grid
  SPATIAL_CELL_SIZE: 150,

  // Visuals & Particles
  MAX_PARTICLES: 600,
  CAMERA_SMOOTHING: 0.12,
  BASE_ZOOM: 0.78,            // Expansive initial camera field of view
  MIN_ZOOM: 0.35,             // Zoom out for massive snakes
  MAX_ZOOM: 0.85,
};

// Skin Definitions with rich color schemes, diverse patterns, and distinctive themes
export const SKINS = [
  {
    id: 'neon-cyan',
    name: 'Electric Neon',
    primary: '#00f3ff',
    secondary: '#0055ff',
    accent: '#ffffff',
    pattern: 'stripes',
    glow: '#00f3ff',
    eyeColor: '#ffffff',
    pupilColor: '#001133'
  },
  {
    id: 'magma-fire',
    name: 'Magma Blaze',
    primary: '#ff3700',
    secondary: '#ffaa00',
    accent: '#ffe600',
    pattern: 'gradient',
    glow: '#ff5500',
    eyeColor: '#fff5ea',
    pupilColor: '#440000'
  },
  {
    id: 'rainbow-chroma',
    name: 'Rainbow Chroma',
    primary: '#ff0055',
    secondary: '#00ffcc',
    accent: '#ffea00',
    pattern: 'rainbow',
    glow: '#ffffff',
    eyeColor: '#ffffff',
    pupilColor: '#1a1a2e'
  },
  {
    id: 'cyber-violet',
    name: 'Cyberpunk Violet',
    primary: '#d900ff',
    secondary: '#1c053a',
    accent: '#00ffff',
    pattern: 'neon-rim',
    glow: '#ff00aa',
    eyeColor: '#ffffff',
    pupilColor: '#220033'
  },
  {
    id: 'toxic-slime',
    name: 'Toxic Acid',
    primary: '#39ff14',
    secondary: '#005511',
    accent: '#ffff00',
    pattern: 'dots',
    glow: '#39ff14',
    eyeColor: '#f0fff0',
    pupilColor: '#003300'
  },
  {
    id: 'golden-dragon',
    name: 'Golden Dragon',
    primary: '#ffd700',
    secondary: '#cc7700',
    accent: '#ffffff',
    pattern: 'scales',
    glow: '#ffcc00',
    eyeColor: '#ffffff',
    pupilColor: '#332200'
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    primary: '#e0f7fa',
    secondary: '#00bcd4',
    accent: '#ffffff',
    pattern: 'gradient',
    glow: '#80deea',
    eyeColor: '#ffffff',
    pupilColor: '#00363a'
  },
  {
    id: 'bumblebee',
    name: 'Hazard Hornet',
    primary: '#ffeb3b',
    secondary: '#181818',
    accent: '#ffffff',
    pattern: 'rings',
    glow: '#fdd835',
    eyeColor: '#ffffff',
    pupilColor: '#000000'
  },
  {
    id: 'midnight-phantom',
    name: 'Midnight Phantom',
    primary: '#0d1127',
    secondary: '#7c4dff',
    accent: '#00f0ff',
    pattern: 'spine',
    glow: '#651fff',
    eyeColor: '#e8eaf6',
    pupilColor: '#0d1137'
  },
  {
    id: 'candy-swirl',
    name: 'Candy Swirl',
    primary: '#ff4081',
    secondary: '#69f0ae',
    accent: '#ffffff',
    pattern: 'candy',
    glow: '#ff4081',
    eyeColor: '#ffffff',
    pupilColor: '#37474f'
  },
  {
    id: 'blood-ruby',
    name: 'Blood Ruby',
    primary: '#e53935',
    secondary: '#1a0000',
    accent: '#ff8a80',
    pattern: 'neon-rim',
    glow: '#b71c1c',
    eyeColor: '#ffebee',
    pupilColor: '#2b0000'
  },
  {
    id: 'emerald-viper',
    name: 'Emerald Viper',
    primary: '#00e676',
    secondary: '#004d40',
    accent: '#b9f6ca',
    pattern: 'scales',
    glow: '#00c853',
    eyeColor: '#e8f5e9',
    pupilColor: '#00291f'
  },
  {
    id: 'coral-danger',
    name: 'Coral Danger',
    primary: '#ff1744',
    secondary: '#ffd600',
    accent: '#111111',
    pattern: 'tricolor',
    glow: '#ff5252',
    eyeColor: '#ffffff',
    pupilColor: '#111111'
  },
  {
    id: 'tiger-fury',
    name: 'Tiger Fury',
    primary: '#ff9100',
    secondary: '#212121',
    accent: '#ffffff',
    pattern: 'stripes',
    glow: '#ff6d00',
    eyeColor: '#fff8e1',
    pupilColor: '#3e2723'
  },
  {
    id: 'deep-abyss',
    name: 'Deep Abyss',
    primary: '#050811',
    secondary: '#00e5ff',
    accent: '#ffffff',
    pattern: 'spine',
    glow: '#00b0ff',
    eyeColor: '#e1f5fe',
    pupilColor: '#01579b'
  },
  {
    id: 'vaporwave-80s',
    name: 'Vaporwave 84',
    primary: '#00f5d4',
    secondary: '#7b2cbf',
    accent: '#f72585',
    pattern: 'tricolor',
    glow: '#f72585',
    eyeColor: '#ffffff',
    pupilColor: '#240046'
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    primary: '#ff6f00',
    secondary: '#ffff00',
    accent: '#ffffff',
    pattern: 'spine',
    glow: '#ffab00',
    eyeColor: '#ffffff',
    pupilColor: '#bf360c'
  },
  {
    id: 'zebra-strike',
    name: 'Zebra Strike',
    primary: '#f5f5f5',
    secondary: '#121212',
    accent: '#888888',
    pattern: 'stripes',
    glow: '#ffffff',
    eyeColor: '#ffffff',
    pupilColor: '#000000'
  },
  {
    id: 'poison-dart',
    name: 'Poison Dart',
    primary: '#2979ff',
    secondary: '#111111',
    accent: '#00e5ff',
    pattern: 'dots',
    glow: '#2979ff',
    eyeColor: '#e3f2fd',
    pupilColor: '#0d47a1'
  },
  {
    id: 'cherry-sakura',
    name: 'Cherry Blossom',
    primary: '#f8bbd0',
    secondary: '#ffffff',
    accent: '#c2185b',
    pattern: 'dots',
    glow: '#f48fb1',
    eyeColor: '#ffffff',
    pupilColor: '#880e4f'
  },
  {
    id: 'matrix-cyber',
    name: 'Matrix Code',
    primary: '#0a100d',
    secondary: '#00ff41',
    accent: '#b9f6ca',
    pattern: 'dots',
    glow: '#00ff41',
    eyeColor: '#e8f5e9',
    pupilColor: '#003300'
  },
  {
    id: 'obsidian-lava',
    name: 'Obsidian Lava',
    primary: '#1c1917',
    secondary: '#ff4500',
    accent: '#ffa500',
    pattern: 'scales',
    glow: '#ff4500',
    eyeColor: '#fff3e0',
    pupilColor: '#3e2723'
  },
  {
    id: 'amethyst-crown',
    name: 'Amethyst Crystal',
    primary: '#9c27b0',
    secondary: '#e1bee7',
    accent: '#4a148c',
    pattern: 'gradient',
    glow: '#ba68c8',
    eyeColor: '#f3e5f5',
    pupilColor: '#311b92'
  },
  {
    id: 'rio-carnival',
    name: 'Rio Carnival',
    primary: '#ffd600',
    secondary: '#00c853',
    accent: '#2979ff',
    pattern: 'tricolor',
    glow: '#ffd600',
    eyeColor: '#ffffff',
    pupilColor: '#004d40'
  },
  {
    id: 'desert-diamond',
    name: 'Desert Rattler',
    primary: '#d7ccc8',
    secondary: '#5d4037',
    accent: '#ffb74d',
    pattern: 'scales',
    glow: '#a1887f',
    eyeColor: '#efebe9',
    pupilColor: '#3e2723'
  },
  {
    id: 'synthwave-sunset',
    name: 'Synthwave Sun',
    primary: '#ff007f',
    secondary: '#7928ca',
    accent: '#ffbe0b',
    pattern: 'gradient',
    glow: '#ff007f',
    eyeColor: '#ffffff',
    pupilColor: '#3f0071'
  },
  {
    id: 'laser-lime',
    name: 'Laser Lime',
    primary: '#ccff00',
    secondary: '#1b2a00',
    accent: '#ffffff',
    pattern: 'neon-rim',
    glow: '#ccff00',
    eyeColor: '#ffffff',
    pupilColor: '#1b2a00'
  },
  {
    id: 'watermelon-splash',
    name: 'Watermelon Splash',
    primary: '#ff1744',
    secondary: '#00e676',
    accent: '#111111',
    pattern: 'rings',
    glow: '#ff5252',
    eyeColor: '#ffffff',
    pupilColor: '#003300'
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    primary: '#80d8ff',
    secondary: '#ff80ab',
    accent: '#ffffff',
    pattern: 'candy',
    glow: '#80d8ff',
    eyeColor: '#ffffff',
    pupilColor: '#37474f'
  },
  {
    id: 'galaxy-star',
    name: 'Starlight Void',
    primary: '#0a0a23',
    secondary: '#ffffff',
    accent: '#9d4edd',
    pattern: 'dots',
    glow: '#c77dff',
    eyeColor: '#ffffff',
    pupilColor: '#10002b'
  },
  {
    id: 'steampunk-copper',
    name: 'Steampunk Copper',
    primary: '#b87333',
    secondary: '#cd7f32',
    accent: '#4a2c00',
    pattern: 'scales',
    glow: '#d4af37',
    eyeColor: '#fff8e1',
    pupilColor: '#2e1c0c'
  },
  {
    id: 'aquamarine-tide',
    name: 'Aquamarine Tide',
    primary: '#64ffda',
    secondary: '#00695c',
    accent: '#e0f2f1',
    pattern: 'gradient',
    glow: '#1de9b6',
    eyeColor: '#e0f2f1',
    pupilColor: '#004d40'
  },
  {
    id: 'phantom-ghost',
    name: 'Phantom Specter',
    primary: '#80d8ff',
    secondary: '#0a192f',
    accent: '#ffffff',
    pattern: 'neon-rim',
    glow: '#00e5ff',
    eyeColor: '#e1f5fe',
    pupilColor: '#002171'
  },
  {
    id: 'dark-matter',
    name: 'Dark Matter',
    primary: '#09090b',
    secondary: '#e11d48',
    accent: '#fda4af',
    pattern: 'spine',
    glow: '#f43f5e',
    eyeColor: '#ffe4e6',
    pupilColor: '#4c0519'
  },
  {
    id: 'hyper-orange',
    name: 'Hyper Orange',
    primary: '#ff5722',
    secondary: '#260a00',
    accent: '#ffccbc',
    pattern: 'neon-rim',
    glow: '#ff5722',
    eyeColor: '#fbe9e7',
    pupilColor: '#3e1300'
  },
  {
    id: 'glitch-static',
    name: 'Glitch Static',
    primary: '#00ffff',
    secondary: '#ff0055',
    accent: '#ffff00',
    pattern: 'tricolor',
    glow: '#00ffff',
    eyeColor: '#ffffff',
    pupilColor: '#111111'
  }
];

// Bot AI Personalities
export const BOT_PERSONALITIES = {
  FORAGER: {
    name: 'Forager',
    foodAttraction: 1.6,
    snakeAvoidance: 1.5,
    boostChance: 0.35,
    huntingAggression: 0.9,
    feelerLength: 140
  },
  HUNTER: {
    name: 'Hunter',
    foodAttraction: 0.7,
    snakeAvoidance: 0.95,
    boostChance: 0.85,
    huntingAggression: 2.5,
    feelerLength: 180
  },
  SCAVENGER: {
    name: 'Scavenger',
    foodAttraction: 2.0,
    snakeAvoidance: 1.2,
    boostChance: 0.60,
    huntingAggression: 1.4,
    feelerLength: 150
  },
  COILER: {
    name: 'Coiler',
    foodAttraction: 0.8,
    snakeAvoidance: 1.1,
    boostChance: 0.70,
    huntingAggression: 2.0,
    feelerLength: 170
  }
};

// Bot Names pool
export const BOT_NAMES = [
  'ViperX', 'NeonShadow', 'GlitchWorm', 'Slinky', 'SlythLord',
  'ApexPredator', 'CosmicCoil', 'Hyperion', 'ZeroG', 'Kaa',
  'Ouroboros', 'Python3', 'Worminator', 'SneakyNoodle', 'TitanBoa',
  'GhostRider', 'Draco', 'CobraKai', 'Venomous', 'Sparky',
  'NeonPulse', 'DangerNoodle', 'Abyss', 'Quicksilver', 'Vortex',
  'Solaris', 'Nirvana', 'ByteMe', 'TurboWorm', 'Zenith',
  'BlackMamba', 'Hydra', 'Leviathan', 'CrimsonTide', 'Nemesis',
  'Starlight', 'Eclipse', 'Thunderbolt', 'Ragnarok', 'Kraken'
];

// Normalize angle into [-PI, PI] range.
// Uses a single closed-form expression: O(1), branch-free, NaN-safe.
export function normalizeAngle(angle) {
  return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
}

// Generate uniform random coordinates within a circular disc or ring
export function randomInCircle(minRadius = 0, maxRadius = CONFIG.WORLD_RADIUS) {
  const r = minRadius + Math.sqrt(Math.random()) * (maxRadius - minRadius);
  const theta = Math.random() * Math.PI * 2;
  return {
    x: Math.cos(theta) * r,
    y: Math.sin(theta) * r
  };
}

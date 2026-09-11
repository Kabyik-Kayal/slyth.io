(() => {
  // js/config.js
  var CONFIG = {
    // World parameters (expanded arena: 2.64x larger area)
    WORLD_RADIUS: 5200,
    HEX_SIZE: 56,
    // Snake physics & balance
    BASE_SPEED: 210,
    // Normal speed in pixels/sec
    BOOST_SPEED: 430,
    // Boost speed in pixels/sec
    BASE_TURN_SPEED: 5.2,
    // Radians per second (responsive steering)
    BASE_RADIUS: 13,
    // Base body segment radius for starter snake
    SEGMENT_DISTANCE: 10,
    // Distance between body segments
    START_MASS: 20,
    // Initial starting mass
    MIN_BOOST_MASS: 15,
    // Minimum mass required to boost
    BOOST_MASS_RATE: 3.5,
    // Mass lost per second while boosting
    BOOST_DROP_INTERVAL: 0.14,
    // Seconds between boost orb drops
    // Mass & growth scaling (natural, progressive growth)
    MASS_TO_RADIUS_EXP: 0.36,
    // Radius growth exponent
    MAX_RADIUS: 46,
    // Maximum body segment radius
    MASS_TO_LENGTH_RATIO: 0.28,
    // Segments added per mass unit (balanced from 0.65)
    // Food parameters (clean, non-crowded distribution)
    MAX_FOOD_COUNT: 1300,
    // Balanced food count across expanded arena
    SPECIAL_PREY_COUNT: 5,
    PREY_BASE_SPEED: 190,
    PREY_FLEE_SPEED: 370,
    PREY_MASS_VALUE: 20,
    // Mass value of special firefly prey
    // Bot population & behavior
    BOT_COUNT: 32,
    MIN_BOT_COUNT: 20,
    MAX_BOT_COUNT: 55,
    BOT_RESPAWN_DELAY: 3,
    // Seconds before respawning a dead bot
    // Bot AI tuning distances (centralised to avoid magic numbers in bot.js / game.js)
    BOT_BOUNDARY_WARN_DIST: 320,
    // Distance from boundary where bot steers toward center
    BOT_FEELER_BOUNDARY_MARGIN: 90,
    // Feeler endpoint boundary safety margin
    BOT_SAFE_SPAWN_MIN_DIST: 1200,
    // Min distance from player when spawning a bot
    BOT_SAFE_SPAWN_ATTEMPTS: 25,
    // Max placement tries to satisfy the distance constraint
    BOT_CUT_OFF_DETECT_DIST: 260,
    // Distance threshold to detect an incoming cut-off threat
    BOT_HEAD_JOUST_DIST: 220,
    // Distance at which to switch to head-joust mode
    BOT_CUT_OFF_MAX_DIST: 200,
    // Max distance for sprint cut-off boost engagement (tightened so bots don't boost from afar)
    BOT_CUT_OFF_MIN_DIST: 45,
    // Min distance below which cut-off boost is not triggered
    BOT_HUNT_RADIUS: 650,
    // Search radius for hunting targets
    BOT_FEAST_SEARCH_RADIUS: 450,
    // Search radius for death-drop clusters
    BOT_FOOD_SEARCH_RADIUS: 380,
    // Search radius for ambient food foraging
    BOT_COIL_TARGET_DIST: 420,
    // Max distance to start encirclement coil
    BOT_COIL_MIN_MASS: 70,
    // Minimum mass to attempt coiling tactics
    // Spatial hash grid
    SPATIAL_CELL_SIZE: 150,
    // Visuals & Particles
    MAX_PARTICLES: 600,
    CAMERA_SMOOTHING: 0.12,
    BASE_ZOOM: 0.78,
    // Expansive initial camera field of view
    MIN_ZOOM: 0.35,
    // Zoom out for massive snakes
    MAX_ZOOM: 0.85
  };
  var SKINS = [
    {
      id: "neon-cyan",
      name: "Electric Neon",
      primary: "#00f3ff",
      secondary: "#0055ff",
      accent: "#ffffff",
      pattern: "stripes",
      glow: "#00f3ff",
      eyeColor: "#ffffff",
      pupilColor: "#001133"
    },
    {
      id: "magma-fire",
      name: "Magma Blaze",
      primary: "#ff3700",
      secondary: "#ffaa00",
      accent: "#ffe600",
      pattern: "gradient",
      glow: "#ff5500",
      eyeColor: "#fff5ea",
      pupilColor: "#440000"
    },
    {
      id: "rainbow-chroma",
      name: "Rainbow Chroma",
      primary: "#ff0055",
      secondary: "#00ffcc",
      accent: "#ffea00",
      pattern: "rainbow",
      glow: "#ffffff",
      eyeColor: "#ffffff",
      pupilColor: "#1a1a2e"
    },
    {
      id: "cyber-violet",
      name: "Cyberpunk Violet",
      primary: "#d900ff",
      secondary: "#1c053a",
      accent: "#00ffff",
      pattern: "neon-rim",
      glow: "#ff00aa",
      eyeColor: "#ffffff",
      pupilColor: "#220033"
    },
    {
      id: "toxic-slime",
      name: "Toxic Acid",
      primary: "#39ff14",
      secondary: "#005511",
      accent: "#ffff00",
      pattern: "dots",
      glow: "#39ff14",
      eyeColor: "#f0fff0",
      pupilColor: "#003300"
    },
    {
      id: "golden-dragon",
      name: "Golden Dragon",
      primary: "#ffd700",
      secondary: "#cc7700",
      accent: "#ffffff",
      pattern: "scales",
      glow: "#ffcc00",
      eyeColor: "#ffffff",
      pupilColor: "#332200"
    },
    {
      id: "arctic-frost",
      name: "Arctic Frost",
      primary: "#e0f7fa",
      secondary: "#00bcd4",
      accent: "#ffffff",
      pattern: "gradient",
      glow: "#80deea",
      eyeColor: "#ffffff",
      pupilColor: "#00363a"
    },
    {
      id: "bumblebee",
      name: "Hazard Hornet",
      primary: "#ffeb3b",
      secondary: "#181818",
      accent: "#ffffff",
      pattern: "rings",
      glow: "#fdd835",
      eyeColor: "#ffffff",
      pupilColor: "#000000"
    },
    {
      id: "midnight-phantom",
      name: "Midnight Phantom",
      primary: "#0d1127",
      secondary: "#7c4dff",
      accent: "#00f0ff",
      pattern: "spine",
      glow: "#651fff",
      eyeColor: "#e8eaf6",
      pupilColor: "#0d1137"
    },
    {
      id: "candy-swirl",
      name: "Candy Swirl",
      primary: "#ff4081",
      secondary: "#69f0ae",
      accent: "#ffffff",
      pattern: "candy",
      glow: "#ff4081",
      eyeColor: "#ffffff",
      pupilColor: "#37474f"
    },
    {
      id: "blood-ruby",
      name: "Blood Ruby",
      primary: "#e53935",
      secondary: "#1a0000",
      accent: "#ff8a80",
      pattern: "neon-rim",
      glow: "#b71c1c",
      eyeColor: "#ffebee",
      pupilColor: "#2b0000"
    },
    {
      id: "emerald-viper",
      name: "Emerald Viper",
      primary: "#00e676",
      secondary: "#004d40",
      accent: "#b9f6ca",
      pattern: "scales",
      glow: "#00c853",
      eyeColor: "#e8f5e9",
      pupilColor: "#00291f"
    },
    {
      id: "coral-danger",
      name: "Coral Danger",
      primary: "#ff1744",
      secondary: "#ffd600",
      accent: "#111111",
      pattern: "tricolor",
      glow: "#ff5252",
      eyeColor: "#ffffff",
      pupilColor: "#111111"
    },
    {
      id: "tiger-fury",
      name: "Tiger Fury",
      primary: "#ff9100",
      secondary: "#212121",
      accent: "#ffffff",
      pattern: "stripes",
      glow: "#ff6d00",
      eyeColor: "#fff8e1",
      pupilColor: "#3e2723"
    },
    {
      id: "deep-abyss",
      name: "Deep Abyss",
      primary: "#050811",
      secondary: "#00e5ff",
      accent: "#ffffff",
      pattern: "spine",
      glow: "#00b0ff",
      eyeColor: "#e1f5fe",
      pupilColor: "#01579b"
    },
    {
      id: "vaporwave-80s",
      name: "Vaporwave 84",
      primary: "#00f5d4",
      secondary: "#7b2cbf",
      accent: "#f72585",
      pattern: "tricolor",
      glow: "#f72585",
      eyeColor: "#ffffff",
      pupilColor: "#240046"
    },
    {
      id: "solar-flare",
      name: "Solar Flare",
      primary: "#ff6f00",
      secondary: "#ffff00",
      accent: "#ffffff",
      pattern: "spine",
      glow: "#ffab00",
      eyeColor: "#ffffff",
      pupilColor: "#bf360c"
    },
    {
      id: "zebra-strike",
      name: "Zebra Strike",
      primary: "#f5f5f5",
      secondary: "#121212",
      accent: "#888888",
      pattern: "stripes",
      glow: "#ffffff",
      eyeColor: "#ffffff",
      pupilColor: "#000000"
    },
    {
      id: "poison-dart",
      name: "Poison Dart",
      primary: "#2979ff",
      secondary: "#111111",
      accent: "#00e5ff",
      pattern: "dots",
      glow: "#2979ff",
      eyeColor: "#e3f2fd",
      pupilColor: "#0d47a1"
    },
    {
      id: "cherry-sakura",
      name: "Cherry Blossom",
      primary: "#f8bbd0",
      secondary: "#ffffff",
      accent: "#c2185b",
      pattern: "dots",
      glow: "#f48fb1",
      eyeColor: "#ffffff",
      pupilColor: "#880e4f"
    },
    {
      id: "matrix-cyber",
      name: "Matrix Code",
      primary: "#0a100d",
      secondary: "#00ff41",
      accent: "#b9f6ca",
      pattern: "dots",
      glow: "#00ff41",
      eyeColor: "#e8f5e9",
      pupilColor: "#003300"
    },
    {
      id: "obsidian-lava",
      name: "Obsidian Lava",
      primary: "#1c1917",
      secondary: "#ff4500",
      accent: "#ffa500",
      pattern: "scales",
      glow: "#ff4500",
      eyeColor: "#fff3e0",
      pupilColor: "#3e2723"
    },
    {
      id: "amethyst-crown",
      name: "Amethyst Crystal",
      primary: "#9c27b0",
      secondary: "#e1bee7",
      accent: "#4a148c",
      pattern: "gradient",
      glow: "#ba68c8",
      eyeColor: "#f3e5f5",
      pupilColor: "#311b92"
    },
    {
      id: "rio-carnival",
      name: "Rio Carnival",
      primary: "#ffd600",
      secondary: "#00c853",
      accent: "#2979ff",
      pattern: "tricolor",
      glow: "#ffd600",
      eyeColor: "#ffffff",
      pupilColor: "#004d40"
    },
    {
      id: "desert-diamond",
      name: "Desert Rattler",
      primary: "#d7ccc8",
      secondary: "#5d4037",
      accent: "#ffb74d",
      pattern: "scales",
      glow: "#a1887f",
      eyeColor: "#efebe9",
      pupilColor: "#3e2723"
    },
    {
      id: "synthwave-sunset",
      name: "Synthwave Sun",
      primary: "#ff007f",
      secondary: "#7928ca",
      accent: "#ffbe0b",
      pattern: "gradient",
      glow: "#ff007f",
      eyeColor: "#ffffff",
      pupilColor: "#3f0071"
    },
    {
      id: "laser-lime",
      name: "Laser Lime",
      primary: "#ccff00",
      secondary: "#1b2a00",
      accent: "#ffffff",
      pattern: "neon-rim",
      glow: "#ccff00",
      eyeColor: "#ffffff",
      pupilColor: "#1b2a00"
    },
    {
      id: "watermelon-splash",
      name: "Watermelon Splash",
      primary: "#ff1744",
      secondary: "#00e676",
      accent: "#111111",
      pattern: "rings",
      glow: "#ff5252",
      eyeColor: "#ffffff",
      pupilColor: "#003300"
    },
    {
      id: "cotton-candy",
      name: "Cotton Candy",
      primary: "#80d8ff",
      secondary: "#ff80ab",
      accent: "#ffffff",
      pattern: "candy",
      glow: "#80d8ff",
      eyeColor: "#ffffff",
      pupilColor: "#37474f"
    },
    {
      id: "galaxy-star",
      name: "Starlight Void",
      primary: "#0a0a23",
      secondary: "#ffffff",
      accent: "#9d4edd",
      pattern: "dots",
      glow: "#c77dff",
      eyeColor: "#ffffff",
      pupilColor: "#10002b"
    },
    {
      id: "steampunk-copper",
      name: "Steampunk Copper",
      primary: "#b87333",
      secondary: "#cd7f32",
      accent: "#4a2c00",
      pattern: "scales",
      glow: "#d4af37",
      eyeColor: "#fff8e1",
      pupilColor: "#2e1c0c"
    },
    {
      id: "aquamarine-tide",
      name: "Aquamarine Tide",
      primary: "#64ffda",
      secondary: "#00695c",
      accent: "#e0f2f1",
      pattern: "gradient",
      glow: "#1de9b6",
      eyeColor: "#e0f2f1",
      pupilColor: "#004d40"
    },
    {
      id: "phantom-ghost",
      name: "Phantom Specter",
      primary: "#80d8ff",
      secondary: "#0a192f",
      accent: "#ffffff",
      pattern: "neon-rim",
      glow: "#00e5ff",
      eyeColor: "#e1f5fe",
      pupilColor: "#002171"
    },
    {
      id: "dark-matter",
      name: "Dark Matter",
      primary: "#09090b",
      secondary: "#e11d48",
      accent: "#fda4af",
      pattern: "spine",
      glow: "#f43f5e",
      eyeColor: "#ffe4e6",
      pupilColor: "#4c0519"
    },
    {
      id: "hyper-orange",
      name: "Hyper Orange",
      primary: "#ff5722",
      secondary: "#260a00",
      accent: "#ffccbc",
      pattern: "neon-rim",
      glow: "#ff5722",
      eyeColor: "#fbe9e7",
      pupilColor: "#3e1300"
    },
    {
      id: "glitch-static",
      name: "Glitch Static",
      primary: "#00ffff",
      secondary: "#ff0055",
      accent: "#ffff00",
      pattern: "tricolor",
      glow: "#00ffff",
      eyeColor: "#ffffff",
      pupilColor: "#111111"
    }
  ];
  var BOT_PERSONALITIES = {
    FORAGER: {
      name: "Forager",
      foodAttraction: 1.6,
      snakeAvoidance: 1.5,
      boostChance: 0.12,
      huntingAggression: 0.6,
      feelerLength: 140
    },
    HUNTER: {
      name: "Hunter",
      foodAttraction: 0.7,
      snakeAvoidance: 0.95,
      boostChance: 0.4,
      huntingAggression: 1.8,
      feelerLength: 180
    },
    SCAVENGER: {
      name: "Scavenger",
      foodAttraction: 2,
      snakeAvoidance: 1.2,
      boostChance: 0.25,
      huntingAggression: 1,
      feelerLength: 150
    },
    COILER: {
      name: "Coiler",
      foodAttraction: 0.8,
      snakeAvoidance: 1.1,
      boostChance: 0.3,
      huntingAggression: 1.5,
      feelerLength: 170
    }
  };
  var BOT_NAMES = [
    "ViperX",
    "NeonShadow",
    "GlitchWorm",
    "Slinky",
    "SlythLord",
    "ApexPredator",
    "CosmicCoil",
    "Hyperion",
    "ZeroG",
    "Kaa",
    "Ouroboros",
    "Python3",
    "Worminator",
    "SneakyNoodle",
    "TitanBoa",
    "GhostRider",
    "Draco",
    "CobraKai",
    "Venomous",
    "Sparky",
    "NeonPulse",
    "DangerNoodle",
    "Abyss",
    "Quicksilver",
    "Vortex",
    "Solaris",
    "Nirvana",
    "ByteMe",
    "TurboWorm",
    "Zenith",
    "BlackMamba",
    "Hydra",
    "Leviathan",
    "CrimsonTide",
    "Nemesis",
    "Starlight",
    "Eclipse",
    "Thunderbolt",
    "Ragnarok",
    "Kraken"
  ];
  function normalizeAngle(angle) {
    return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
  }
  function randomInCircle(minRadius = 0, maxRadius = CONFIG.WORLD_RADIUS) {
    const r = minRadius + Math.sqrt(Math.random()) * (maxRadius - minRadius);
    const theta = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(theta) * r,
      y: Math.sin(theta) * r
    };
  }

  // js/audio.js
  var AudioEngine = class {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.boostOsc = null;
      this.boostGain = null;
      this.boostFilter = null;
      this.isBoostPlaying = false;
      this.muted = (localStorage.getItem("slyth_muted") ?? localStorage.getItem("slither_muted")) === "true";
      this.volume = parseFloat(localStorage.getItem("slyth_volume") ?? localStorage.getItem("slither_volume") ?? "0.4");
      this.lastEatTime = 0;
      this.comboCount = 0;
    }
    init() {
      if (this.ctx) {
        if (this.ctx.state === "suspended") {
          this.ctx.resume();
        }
        return;
      }
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.initBoostSound();
      } catch (e) {
        console.warn("Web Audio API not supported or blocked:", e);
      }
    }
    initBoostSound() {
      if (!this.ctx) return;
      this.boostOsc = this.ctx.createOscillator();
      this.boostOsc.type = "sawtooth";
      this.boostOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
      this.boostFilter = this.ctx.createBiquadFilter();
      this.boostFilter.type = "lowpass";
      this.boostFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.boostFilter.Q.setValueAtTime(3, this.ctx.currentTime);
      this.boostGain = this.ctx.createGain();
      this.boostGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.boostOsc.connect(this.boostFilter);
      this.boostFilter.connect(this.boostGain);
      this.boostGain.connect(this.masterGain);
      this.boostOsc.start();
    }
    setMuted(muted) {
      this.muted = muted;
      localStorage.setItem("slyth_muted", this.muted);
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : this.volume, now + 0.05);
      }
    }
    setVolume(volume) {
      this.volume = Math.max(0, Math.min(1, volume));
      localStorage.setItem("slyth_volume", this.volume);
      if (this.masterGain && this.ctx && !this.muted) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
      }
    }
    playEat(massValue = 1) {
      if (!this.ctx || this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      if (now - this.lastEatTime < 0.25) {
        this.comboCount = Math.min(this.comboCount + 1, 16);
      } else {
        this.comboCount = 0;
      }
      this.lastEatTime = now;
      const baseFreq = 480 + this.comboCount * 32 + Math.min(massValue * 8, 200);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    }
    startBoost() {
      if (!this.ctx || this.isBoostPlaying || this.muted) return;
      this.init();
      if (!this.boostGain) return;
      this.isBoostPlaying = true;
      const now = this.ctx.currentTime;
      this.boostGain.gain.cancelScheduledValues(now);
      this.boostGain.gain.linearRampToValueAtTime(0.22, now + 0.12);
    }
    stopBoost() {
      if (!this.ctx || !this.isBoostPlaying) return;
      if (!this.boostGain) return;
      this.isBoostPlaying = false;
      const now = this.ctx.currentTime;
      this.boostGain.gain.cancelScheduledValues(now);
      this.boostGain.gain.linearRampToValueAtTime(0, now + 0.15);
    }
    playDeath() {
      if (!this.ctx || this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.38);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      noiseSource.start(now);
      osc.start(now);
      noiseSource.stop(now + 0.4);
      osc.stop(now + 0.4);
    }
    playKill() {
      if (!this.ctx || this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = now + idx * 0.07;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(1e-3, noteTime + 0.18);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.2);
      });
    }
    playPreyCaught() {
      if (!this.ctx || this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.28);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };
  var sound = new AudioEngine();

  // js/spatialGrid.js
  var SpatialGrid = class {
    constructor(cellSize = 140) {
      this.cellSize = cellSize;
      this.cells = /* @__PURE__ */ new Map();
      this.queryId = 0;
    }
    clear() {
      this.cells.clear();
    }
    // Convert world coordinates to cell coordinate
    toCellCoord(val) {
      return Math.floor(val / this.cellSize);
    }
    // Encode two cell coordinates into a single integer key.
    // Using a large prime stride (100003) ensures no collisions within realistic
    // cell ranges (±~75 cells at world-radius 5200 with cell-size 150).
    cellKey(gx, gy) {
      return gx * 100003 + gy;
    }
    // Insert an entity with (x, y, radius)
    insert(entity) {
      const minGx = this.toCellCoord(entity.x - entity.radius);
      const maxGx = this.toCellCoord(entity.x + entity.radius);
      const minGy = this.toCellCoord(entity.y - entity.radius);
      const maxGy = this.toCellCoord(entity.y + entity.radius);
      for (let gx = minGx; gx <= maxGx; gx++) {
        for (let gy = minGy; gy <= maxGy; gy++) {
          const key = this.cellKey(gx, gy);
          let cell = this.cells.get(key);
          if (!cell) {
            cell = [];
            this.cells.set(key, cell);
          }
          cell.push(entity);
        }
      }
    }
    // Query all entities within circular area
    queryCircle(x, y, radius, outResults = []) {
      this.queryId++;
      const currentQueryId = this.queryId;
      const minGx = this.toCellCoord(x - radius);
      const maxGx = this.toCellCoord(x + radius);
      const minGy = this.toCellCoord(y - radius);
      const maxGy = this.toCellCoord(y + radius);
      for (let gx = minGx; gx <= maxGx; gx++) {
        for (let gy = minGy; gy <= maxGy; gy++) {
          const key = this.cellKey(gx, gy);
          const cell = this.cells.get(key);
          if (!cell) continue;
          for (let i = 0; i < cell.length; i++) {
            const entity = cell[i];
            if (entity._lastQueryId === currentQueryId) continue;
            entity._lastQueryId = currentQueryId;
            const dx = entity.x - x;
            const dy = entity.y - y;
            const combinedR = radius + entity.radius;
            if (dx * dx + dy * dy <= combinedR * combinedR) {
              outResults.push(entity);
            }
          }
        }
      }
      return outResults;
    }
    // Query all entities intersecting a bounding box (e.g. camera viewport)
    queryRect(minX, minY, maxX, maxY, outResults = []) {
      this.queryId++;
      const currentQueryId = this.queryId;
      const minGx = this.toCellCoord(minX);
      const maxGx = this.toCellCoord(maxX);
      const minGy = this.toCellCoord(minY);
      const maxGy = this.toCellCoord(maxY);
      for (let gx = minGx; gx <= maxGx; gx++) {
        for (let gy = minGy; gy <= maxGy; gy++) {
          const key = this.cellKey(gx, gy);
          const cell = this.cells.get(key);
          if (!cell) continue;
          for (let i = 0; i < cell.length; i++) {
            const entity = cell[i];
            if (entity._lastQueryId === currentQueryId) continue;
            entity._lastQueryId = currentQueryId;
            if (entity.x + entity.radius >= minX && entity.x - entity.radius <= maxX && entity.y + entity.radius >= minY && entity.y - entity.radius <= maxY) {
              outResults.push(entity);
            }
          }
        }
      }
      return outResults;
    }
  };

  // js/particle.js
  var Particle = class {
    constructor() {
      this.active = false;
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.radius = 2;
      this.color = "#ffffff";
      this.alpha = 1;
      this.decay = 0.02;
      this.type = "spark";
      this.maxRadius = 10;
    }
    reset(x, y, vx, vy, radius, color, decay, type = "spark", maxRadius = 10) {
      this.active = true;
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = radius;
      this.color = color;
      this.alpha = 1;
      this.decay = decay;
      this.type = type;
      this.maxRadius = maxRadius;
    }
    update(dt) {
      if (!this.active) return false;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.alpha -= this.decay * dt * 60;
      if (this.type === "ring") {
        this.radius += (this.maxRadius - this.radius) * 8 * dt;
      } else {
        this.radius = Math.max(0.5, this.radius - 1.2 * dt);
        this.vx *= Math.pow(0.92, dt * 60);
        this.vy *= Math.pow(0.92, dt * 60);
      }
      if (this.alpha <= 0.01) {
        this.active = false;
        return false;
      }
      return true;
    }
    draw(ctx) {
      if (!this.active || this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      if (this.type === "ring") {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = Math.max(1, 3 * this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
  var ParticleManager = class {
    constructor(maxParticles = CONFIG.MAX_PARTICLES) {
      this.pool = [];
      this.maxParticles = maxParticles;
      this.poolIdx = 0;
      for (let i = 0; i < this.maxParticles; i++) {
        this.pool.push(new Particle());
      }
    }
    getFreeParticle() {
      for (let i = 0; i < this.maxParticles; i++) {
        const idx = (this.poolIdx + i) % this.maxParticles;
        if (!this.pool[idx].active) {
          this.poolIdx = (idx + 1) % this.maxParticles;
          return this.pool[idx];
        }
      }
      const p = this.pool[this.poolIdx];
      this.poolIdx = (this.poolIdx + 1) % this.maxParticles;
      return p;
    }
    // Emit boost trail embers
    spawnBoostParticle(x, y, angle, color) {
      const p = this.getFreeParticle();
      if (!p) return;
      const spread = (Math.random() - 0.5) * 0.8;
      const speed = 40 + Math.random() * 70;
      const dir = angle + Math.PI + spread;
      const vx = Math.cos(dir) * speed;
      const vy = Math.sin(dir) * speed;
      p.reset(
        x + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 6,
        vx,
        vy,
        2 + Math.random() * 2.5,
        color,
        0.035 + Math.random() * 0.02,
        "spark"
      );
    }
    // Emit burst when food orbs are eaten
    spawnEatSparkle(x, y, color) {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const p = this.getFreeParticle();
        if (!p) continue;
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 90;
        p.reset(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          1.8 + Math.random() * 2,
          color,
          0.04 + Math.random() * 0.03,
          "spark"
        );
      }
    }
    // Emit dramatic death shockwave & explosion debris
    spawnDeathExplosion(x, y, color, radius) {
      const ring = this.getFreeParticle();
      if (ring) {
        ring.reset(x, y, 0, 0, 10, color, 0.03, "ring", radius * 3.5);
      }
      const count = 18 + Math.floor(Math.random() * 10);
      for (let i = 0; i < count; i++) {
        const p = this.getFreeParticle();
        if (!p) continue;
        const angle = i / count * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 120 + Math.random() * 220;
        p.reset(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          3 + Math.random() * 4,
          color,
          0.025 + Math.random() * 0.02,
          "spark"
        );
      }
    }
    // Firefly prey sparkle trail
    spawnPreyTrail(x, y, color) {
      const p = this.getFreeParticle();
      if (!p) return;
      p.reset(
        x + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        2.5 + Math.random() * 2,
        color,
        0.05,
        "spark"
      );
    }
    update(dt) {
      for (let i = 0; i < this.maxParticles; i++) {
        if (this.pool[i].active) {
          this.pool[i].update(dt);
        }
      }
    }
    draw(ctx, minX, minY, maxX, maxY) {
      for (let i = 0; i < this.maxParticles; i++) {
        const p = this.pool[i];
        if (p.active) {
          if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
            p.draw(ctx);
          }
        }
      }
    }
  };

  // js/food.js
  var FOOD_COLORS = [
    "#ff1744",
    "#f50057",
    "#d500f9",
    "#651fff",
    "#2979ff",
    "#00e5ff",
    "#1de9b6",
    "#00e676",
    "#76ff03",
    "#ffea00",
    "#ff9100",
    "#ff3d00"
  ];
  var Food = class {
    constructor(x, y, mass = 1, color = null, type = "ambient") {
      this.x = x;
      this.y = y;
      this.mass = mass;
      this.type = type;
      this.color = color || FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)];
      this.baseRadius = type === "prey" ? 9 : Math.min(12, Math.max(3, 2.5 + Math.sqrt(mass) * 1.6));
      this.radius = this.baseRadius;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.driftAngle = Math.random() * Math.PI * 2;
      this.driftSpeed = 4 + Math.random() * 8;
      this.eaten = false;
      this._lastQueryId = 0;
      if (this.type === "prey") {
        this.vx = (Math.random() - 0.5) * CONFIG.PREY_BASE_SPEED;
        this.vy = (Math.random() - 0.5) * CONFIG.PREY_BASE_SPEED;
        this.angle = Math.atan2(this.vy, this.vx);
        this.turnTimer = 0;
        this.isFleeing = false;
      }
    }
    update(dt, snakes = [], particleManager = null) {
      this.pulsePhase += dt * (this.type === "prey" ? 7 : 3);
      const pulseFactor = 1 + Math.sin(this.pulsePhase) * (this.type === "prey" ? 0.28 : 0.14);
      this.radius = this.baseRadius * pulseFactor;
      if (this.type === "ambient") {
        this.x += Math.cos(this.driftAngle) * this.driftSpeed * dt;
        this.y += Math.sin(this.driftAngle) * this.driftSpeed * dt;
        const dist = Math.hypot(this.x, this.y);
        if (dist > CONFIG.WORLD_RADIUS - 50) {
          this.driftAngle = Math.atan2(-this.y, -this.x) + (Math.random() - 0.5) * 0.5;
        }
      } else if (this.type === "prey") {
        this.updatePrey(dt, snakes, particleManager);
      }
    }
    updatePrey(dt, snakes, particleManager) {
      let nearestDist = Infinity;
      let fleeDx = 0;
      let fleeDy = 0;
      for (let i = 0; i < snakes.length; i++) {
        const s = snakes[i];
        if (s.dead) continue;
        const dx = this.x - s.x;
        const dy = this.y - s.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 320 && dist < nearestDist) {
          nearestDist = dist;
          fleeDx = dx;
          fleeDy = dy;
        }
      }
      if (nearestDist < 320 && (fleeDx !== 0 || fleeDy !== 0)) {
        this.isFleeing = true;
        const targetAngle = Math.atan2(fleeDy, fleeDx);
        const diff = normalizeAngle(targetAngle - this.angle);
        this.angle += Math.sign(diff) * Math.min(Math.abs(diff), 8 * dt);
        const speed = CONFIG.PREY_FLEE_SPEED;
        this.vx = Math.cos(this.angle) * speed;
        this.vy = Math.sin(this.angle) * speed;
      } else {
        this.isFleeing = false;
        this.turnTimer -= dt;
        if (this.turnTimer <= 0) {
          this.turnTimer = 0.5 + Math.random() * 1.5;
          this.angle += (Math.random() - 0.5) * 1.5;
          const speed = CONFIG.PREY_BASE_SPEED;
          this.vx = Math.cos(this.angle) * speed;
          this.vy = Math.sin(this.angle) * speed;
        }
      }
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter > CONFIG.WORLD_RADIUS - 80) {
        const angleToCenter = Math.atan2(-this.y, -this.x);
        this.angle = angleToCenter + (Math.random() - 0.5) * 0.4;
        this.vx = Math.cos(this.angle) * CONFIG.PREY_BASE_SPEED;
        this.vy = Math.sin(this.angle) * CONFIG.PREY_BASE_SPEED;
      }
      if (particleManager && Math.random() < 0.6) {
        particleManager.spawnPreyTrail(this.x, this.y, "#ffff55");
      }
    }
    draw(ctx) {
      ctx.save();
      if (this.type === "prey") {
        ctx.shadowColor = "#ffff00";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffea00";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "death") {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.type === "boost" ? 8 : 4;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
  var FoodManager = class {
    constructor(spatialGrid, particleManager) {
      this.spatialGrid = spatialGrid;
      this.particles = particleManager;
      this.foods = [];
      this.visibleFoods = [];
    }
    // Populate initial world foods
    init() {
      this.foods = [];
      for (let i = 0; i < CONFIG.MAX_FOOD_COUNT; i++) {
        this.spawnRandomAmbientFood();
      }
      for (let i = 0; i < CONFIG.SPECIAL_PREY_COUNT; i++) {
        this.spawnSpecialPrey();
      }
    }
    spawnRandomAmbientFood() {
      const { x, y } = randomInCircle(0, CONFIG.WORLD_RADIUS - 80);
      const mass = 0.35 + Math.random() * 0.45;
      const food = new Food(x, y, mass, null, "ambient");
      this.foods.push(food);
    }
    spawnSpecialPrey() {
      const { x, y } = randomInCircle(0, CONFIG.WORLD_RADIUS - 200);
      const prey = new Food(x, y, CONFIG.PREY_MASS_VALUE, "#ffea00", "prey");
      this.foods.push(prey);
    }
    // Spawn food dropped during snake boost
    spawnBoostDrop(x, y, color) {
      const spread = (Math.random() - 0.5) * 8;
      const food = new Food(x + spread, y + spread, 0.5, color, "boost");
      this.foods.push(food);
    }
    // Spawn trail of orbs when a snake dies
    spawnDeathDrops(segments, skinColor) {
      const step = Math.max(2, Math.floor(segments.length / 35));
      for (let i = 0; i < segments.length; i += step) {
        const seg = segments[i];
        const count = 1 + (Math.random() < 0.35 ? 1 : 0);
        for (let k = 0; k < count; k++) {
          const offsetDist = Math.random() * (seg.radius || 10) * 0.7;
          const offsetAngle = Math.random() * Math.PI * 2;
          const x = seg.x + Math.cos(offsetAngle) * offsetDist;
          const y = seg.y + Math.sin(offsetAngle) * offsetDist;
          const mass = 1 + Math.random() * 1.5;
          const food = new Food(x, y, mass, skinColor, "death");
          this.foods.push(food);
        }
      }
    }
    update(dt, snakes) {
      this.spatialGrid.clear();
      let preyCount = 0;
      for (let i = this.foods.length - 1; i >= 0; i--) {
        const f = this.foods[i];
        if (f.eaten) {
          this.foods.splice(i, 1);
          continue;
        }
        f.update(dt, snakes, this.particles);
        if (f.type === "prey") {
          preyCount++;
        }
        this.spatialGrid.insert(f);
      }
      const missing = CONFIG.MAX_FOOD_COUNT - this.foods.length;
      if (missing > 0) {
        const batchSize = missing > 100 ? Math.min(8, Math.ceil(missing / 50)) : 1;
        if (Math.random() < 0.4) {
          for (let b = 0; b < batchSize; b++) {
            this.spawnRandomAmbientFood();
          }
        }
      }
      if (preyCount < CONFIG.SPECIAL_PREY_COUNT && Math.random() < 0.05) {
        this.spawnSpecialPrey();
      }
    }
    draw(ctx, minX, minY, maxX, maxY) {
      this.visibleFoods.length = 0;
      this.spatialGrid.queryRect(minX, minY, maxX, maxY, this.visibleFoods);
      for (let i = 0; i < this.visibleFoods.length; i++) {
        if (typeof this.visibleFoods[i].draw === "function") {
          this.visibleFoods[i].draw(ctx);
        }
      }
    }
  };

  // js/skinRenderer.js
  function drawSkinSegment(ctx, x, y, radius, skin, index, totalSegments, phase = 0, angle = 0, perpAngle = Math.PI / 2) {
    const pattern = skin.pattern || "stripes";
    const secColor = skin.secondary || skin.primary;
    const accentColor = skin.accent || secColor;
    let segColor = skin.primary;
    let drawDot = false;
    let drawSpine = false;
    let drawScales = false;
    let drawNeonRim = false;
    if (pattern === "stripes") {
      segColor = Math.floor(index / 2) % 2 === 0 ? skin.primary : secColor;
    } else if (pattern === "candy") {
      segColor = index % 2 === 0 ? skin.primary : secColor;
    } else if (pattern === "rings") {
      segColor = index % 4 === 0 ? secColor : skin.primary;
    } else if (pattern === "tricolor") {
      const mod = index % 3;
      segColor = mod === 0 ? skin.primary : mod === 1 ? secColor : accentColor;
    } else if (pattern === "gradient") {
      const t = index / totalSegments;
      segColor = t < 0.4 ? skin.primary : t < 0.75 ? secColor : accentColor;
    } else if (pattern === "rainbow") {
      const hue = (phase * 25 + index * 9) % 360;
      segColor = `hsl(${hue}, 95%, 55%)`;
    } else if (pattern === "dots") {
      segColor = skin.primary;
      drawDot = index % 2 === 0;
    } else if (pattern === "spine") {
      segColor = skin.primary;
      drawSpine = true;
    } else if (pattern === "scales") {
      segColor = index % 2 === 0 ? skin.primary : secColor;
      drawScales = true;
    } else if (pattern === "neon-rim") {
      drawNeonRim = true;
      segColor = skin.primary;
    }
    ctx.fillStyle = segColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (drawNeonRim) {
      ctx.fillStyle = secColor;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.66, 0, Math.PI * 2);
      ctx.fill();
    } else if (drawDot) {
      ctx.fillStyle = secColor;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (drawSpine) {
      ctx.fillStyle = secColor;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (drawScales) {
      ctx.fillStyle = accentColor;
      const scaleR = radius * 0.52;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * scaleR, y + Math.sin(angle) * scaleR);
      ctx.lineTo(x + Math.cos(perpAngle) * (scaleR * 0.65), y + Math.sin(perpAngle) * (scaleR * 0.65));
      ctx.lineTo(x - Math.cos(angle) * scaleR, y - Math.sin(angle) * scaleR);
      ctx.lineTo(x - Math.cos(perpAngle) * (scaleR * 0.65), y - Math.sin(perpAngle) * (scaleR * 0.65));
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.22, y - radius * 0.22, radius * 0.44, 0, Math.PI * 2);
    ctx.fill();
  }

  // js/snake.js
  var Snake = class {
    constructor(id, name, x, y, skinId = "neon-cyan", isPlayer = false) {
      this.id = id;
      this.name = name || "Snake";
      this.isPlayer = isPlayer;
      this.skin = SKINS.find((s) => s.id === skinId) || SKINS[0];
      this.x = x;
      this.y = y;
      this.angle = Math.random() * Math.PI * 2;
      this.targetAngle = this.angle;
      this.speed = CONFIG.BASE_SPEED;
      this.isBoosting = false;
      this.mass = CONFIG.START_MASS;
      this.radius = CONFIG.BASE_RADIUS;
      this.dead = false;
      this.kills = 0;
      this.score = 0;
      this.wigglePhase = Math.random() * 100;
      this.boostTimer = 0;
      this.invulnerableTimer = isPlayer ? 3 : 1.5;
      this.distToCursor = Infinity;
      this.ptsStart = 0;
      this.segments = [];
      this.initSegments();
      this.foodEatenCount = 0;
      this.timeAlive = 0;
    }
    initSegments() {
      this.pts = [];
      this.ptsStart = 0;
      this.segments = [];
      const excessMass = Math.max(0, this.mass - CONFIG.START_MASS);
      this.radius = Math.min(
        CONFIG.MAX_RADIUS,
        CONFIG.BASE_RADIUS + Math.pow(excessMass, CONFIG.MASS_TO_RADIUS_EXP) * 0.95
      );
      const targetSegCount = Math.floor(16 + this.mass * CONFIG.MASS_TO_LENGTH_RATIO);
      const segDist = CONFIG.SEGMENT_DISTANCE;
      const ptSpacing = 2.5;
      const ptsPerSeg = 4;
      const totalPts = targetSegCount * ptsPerSeg;
      const curveRate = targetSegCount > 35 ? Math.random() < 0.5 ? 6e-3 : -6e-3 : 0;
      let curX = this.x;
      let curY = this.y;
      let curAngle = this.angle;
      for (let i = 0; i < totalPts; i++) {
        this.pts.push({
          x: curX,
          y: curY,
          angle: curAngle
        });
        curAngle += curveRate;
        curX -= Math.cos(curAngle) * ptSpacing;
        curY -= Math.sin(curAngle) * ptSpacing;
      }
      this.pts.reverse();
      const headIdx = this.pts.length - 1;
      for (let i = 0; i < targetSegCount; i++) {
        const ptIndex = Math.max(0, headIdx - i * ptsPerSeg);
        const pt = this.pts[ptIndex];
        const taper = i > targetSegCount - 8 ? Math.max(0.35, (targetSegCount - i) / 8) : 1;
        this.segments.push({
          x: pt.x,
          y: pt.y,
          radius: this.radius * taper,
          angle: pt.angle,
          _lastQueryId: 0,
          snakeId: this.id,
          isHead: i === 0,
          index: i
        });
      }
      this.score = Math.floor(this.mass * 10 + this.kills * 250);
    }
    update(dt, foodManager, particleManager, soundEngine) {
      if (this.dead) return;
      this.timeAlive += dt;
      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
      }
      if (isNaN(this.mass) || this.mass < 1) {
        this.mass = CONFIG.START_MASS;
      }
      const excessMass = Math.max(0, this.mass - CONFIG.START_MASS);
      this.radius = Math.min(
        CONFIG.MAX_RADIUS,
        CONFIG.BASE_RADIUS + Math.pow(excessMass, CONFIG.MASS_TO_RADIUS_EXP) * 0.95
      );
      const canBoost = this.isBoosting && this.mass > CONFIG.MIN_BOOST_MASS;
      const currentSpeed = canBoost ? CONFIG.BOOST_SPEED : CONFIG.BASE_SPEED;
      this.speed += (currentSpeed - this.speed) * Math.min(1, 10 * dt);
      if (canBoost) {
        this.mass = Math.max(CONFIG.MIN_BOOST_MASS, this.mass - CONFIG.BOOST_MASS_RATE * dt);
        this.boostTimer += dt;
        if (this.boostTimer >= CONFIG.BOOST_DROP_INTERVAL) {
          this.boostTimer = 0;
          const tail = this.segments[this.segments.length - 1];
          if (tail) {
            foodManager.spawnBoostDrop(tail.x, tail.y, this.skin.primary);
          }
        }
        if (particleManager && this.segments.length > 0) {
          const tail = this.segments[this.segments.length - 1];
          particleManager.spawnBoostParticle(tail.x, tail.y, tail.angle, this.skin.glow);
        }
        if (this.isPlayer && soundEngine) {
          soundEngine.startBoost();
        }
      } else {
        this.boostTimer = 0;
        if (this.isPlayer && soundEngine) {
          soundEngine.stopBoost();
        }
      }
      const turnScale = Math.max(0.55, 1 - (this.radius - CONFIG.BASE_RADIUS) * 0.012);
      let turnSpeed = CONFIG.BASE_TURN_SPEED * turnScale;
      if (this.isPlayer && this.distToCursor < 120) {
        const closeFactor = Math.max(0, 1 - this.distToCursor / 120);
        turnSpeed += closeFactor * 3.6;
      }
      const maxTurn = turnSpeed * dt;
      const angleDiff = normalizeAngle(this.targetAngle - this.angle);
      const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxTurn);
      this.currentTurnRate = Math.abs(turnAmount) / (maxTurn || 1);
      const moveDist = this.speed * dt;
      const ptSpacing = 2.5;
      const ptsPerSeg = 4;
      const steps = Math.max(1, Math.round(moveDist / ptSpacing));
      const stepDist = moveDist / steps;
      const stepTurn = turnAmount / steps;
      for (let s = 0; s < steps; s++) {
        this.angle += stepTurn;
        this.x += Math.cos(this.angle) * stepDist;
        this.y += Math.sin(this.angle) * stepDist;
        this.pts.push({
          x: this.x,
          y: this.y,
          angle: this.angle
        });
      }
      const targetSegCount = Math.floor(16 + this.mass * CONFIG.MASS_TO_LENGTH_RATIO);
      const maxPts = targetSegCount * ptsPerSeg;
      const ptsLen = this.pts.length - this.ptsStart;
      const excess = ptsLen - maxPts;
      if (excess > 40) {
        this.ptsStart += excess;
        if (this.ptsStart > maxPts) {
          this.pts = this.pts.slice(this.ptsStart);
          this.ptsStart = 0;
        }
      }
      const activePtsLen = this.pts.length - this.ptsStart;
      const actualSegCount = Math.min(targetSegCount, Math.floor(activePtsLen / ptsPerSeg) + 1);
      while (this.segments.length < actualSegCount) {
        const idx = this.segments.length;
        this.segments.push({
          x: this.x,
          y: this.y,
          radius: this.radius,
          angle: this.angle,
          _lastQueryId: 0,
          snakeId: this.id,
          isHead: idx === 0,
          index: idx
        });
      }
      while (this.segments.length > actualSegCount && this.segments.length > 15) {
        this.segments.pop();
      }
      const headIdx = this.pts.length - 1;
      for (let i = 0; i < this.segments.length; i++) {
        const ptIndex = Math.max(this.ptsStart, headIdx - i * ptsPerSeg);
        const pt = this.pts[ptIndex];
        const cur = this.segments[i];
        cur.x = pt.x;
        cur.y = pt.y;
        cur.angle = pt.angle;
        cur.index = i;
        cur.isHead = i === 0;
        const taper = i > this.segments.length - 8 ? Math.max(0.35, (this.segments.length - i) / 8) : 1;
        cur.radius = this.radius * taper;
      }
      const wiggleSpeed = this.speed / CONFIG.BASE_SPEED * 12;
      this.wigglePhase += wiggleSpeed * dt;
      this.score = Math.floor(this.mass * 10 + this.kills * 250);
    }
    // Check and consume nearby food orbs
    eatFood(foodManager, soundEngine, particleManager) {
      if (this.dead) return;
      const eatRadius = this.radius + 10;
      const nearby = foodManager.spatialGrid.queryCircle(this.x, this.y, eatRadius);
      for (let i = 0; i < nearby.length; i++) {
        const food = nearby[i];
        if (food.eaten) continue;
        const dx = this.x - food.x;
        const dy = this.y - food.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= this.radius + food.radius + 2) {
          food.eaten = true;
          const foodMass = typeof food.mass === "number" && !isNaN(food.mass) ? food.mass : 0.45;
          this.mass = (isNaN(this.mass) ? CONFIG.START_MASS : this.mass) + foodMass;
          this.foodEatenCount++;
          if (this.isPlayer && soundEngine) {
            if (food.type === "prey") {
              soundEngine.playPreyCaught();
            } else {
              soundEngine.playEat(foodMass);
            }
          }
          if (particleManager) {
            particleManager.spawnEatSparkle(food.x, food.y, food.color || "#00f3ff");
          }
        }
      }
    }
    // Check collision against world boundary and other snakes.
    // snakeMap: Map<id, Snake> built once per frame in Game.update() for O(1) lookups.
    checkCollisions(allSnakes, spatialGrid, soundEngine, particleManager, foodManager, snakeMap) {
      if (this.dead) return false;
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter + this.radius >= CONFIG.WORLD_RADIUS) {
        this.die(foodManager, particleManager, soundEngine);
        return true;
      }
      if (this.invulnerableTimer > 0) return false;
      const checkRadius = this.radius * 1.1;
      const candidates = spatialGrid.queryCircle(this.x, this.y, checkRadius + CONFIG.MAX_RADIUS);
      const resolvedSnakeMap = snakeMap || (allSnakes ? new Map(allSnakes.map((s) => [s.id, s])) : /* @__PURE__ */ new Map());
      for (let i = 0; i < candidates.length; i++) {
        const seg = candidates[i];
        if (seg.snakeId === void 0 || seg.snakeId === this.id) continue;
        const otherSnake = resolvedSnakeMap.get(seg.snakeId);
        if (!otherSnake || otherSnake.dead || otherSnake.invulnerableTimer > 0) continue;
        if (seg.isHead) {
          const headDist = Math.hypot(this.x - otherSnake.x, this.y - otherSnake.y);
          if (headDist < this.radius + otherSnake.radius) {
            if (this.mass < otherSnake.mass) {
              otherSnake.kills++;
              this.die(foodManager, particleManager, soundEngine);
              return true;
            } else if (this.mass === otherSnake.mass) {
              this.die(foodManager, particleManager, soundEngine);
              otherSnake.die(foodManager, particleManager, soundEngine);
              return true;
            }
          }
          continue;
        }
        const dx = this.x - seg.x;
        const dy = this.y - seg.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.radius * 0.85 + seg.radius * 0.85) {
          otherSnake.kills++;
          if (otherSnake.isPlayer && soundEngine) {
            soundEngine.playKill();
          }
          this.die(foodManager, particleManager, soundEngine);
          return true;
        }
      }
      return false;
    }
    die(foodManager, particleManager, soundEngine) {
      if (this.dead) return;
      this.dead = true;
      if (this.isPlayer && soundEngine) {
        soundEngine.stopBoost();
        soundEngine.playDeath();
      }
      foodManager.spawnDeathDrops(this.segments, this.skin.primary);
      if (particleManager) {
        particleManager.spawnDeathExplosion(this.x, this.y, this.skin.primary, this.radius);
      }
    }
    // Render snake with animated eyes, expressive skins, and slither wiggle
    draw(ctx, minX, minY, maxX, maxY) {
      if (this.dead || this.segments.length === 0) return;
      const margin = this.radius * 3;
      let anyVisible = false;
      for (let i = 0; i < this.segments.length; i += 4) {
        const s = this.segments[i];
        if (s.x >= minX - margin && s.x <= maxX + margin && s.y >= minY - margin && s.y <= maxY + margin) {
          anyVisible = true;
          break;
        }
      }
      if (!anyVisible) return;
      ctx.save();
      const turnDamping = Math.max(0, 1 - (this.currentTurnRate || 0) * 1.8);
      const wiggleAmp = Math.min(5, 1.8 + this.speed / CONFIG.BASE_SPEED * 1.5) * turnDamping;
      for (let i = this.segments.length - 1; i >= 1; i--) {
        const seg = this.segments[i];
        const perpAngle = seg.angle + Math.PI / 2;
        const waveFactor = Math.min(1, i / 6);
        const wiggleOffset = Math.sin(this.wigglePhase - i * 0.32) * wiggleAmp * waveFactor;
        const drawX = seg.x + Math.cos(perpAngle) * wiggleOffset;
        const drawY = seg.y + Math.sin(perpAngle) * wiggleOffset;
        drawSkinSegment(
          ctx,
          drawX,
          drawY,
          seg.radius,
          this.skin,
          i,
          this.segments.length,
          this.wigglePhase,
          seg.angle,
          perpAngle
        );
      }
      this.drawHead(ctx);
      this.drawNameTag(ctx);
      ctx.restore();
    }
    drawHead(ctx) {
      const head = this.segments[0];
      const headRadius = this.radius * 1.08;
      if (this.invulnerableTimer > 0) {
        ctx.save();
        const pulse = 1 + Math.sin(this.timeAlive * 12) * 0.1;
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 14;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -this.timeAlive * 28;
        ctx.beginPath();
        ctx.arc(head.x, head.y, headRadius * 1.45 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = this.skin.primary;
      ctx.shadowColor = this.skin.glow;
      ctx.shadowBlur = this.isBoosting ? 24 : 8;
      ctx.beginPath();
      ctx.arc(head.x, head.y, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (this.isBoosting) {
        ctx.save();
        ctx.strokeStyle = this.skin.glow;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = this.skin.glow;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(head.x, head.y, headRadius * 1.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      const eyeForwardOffset = headRadius * 0.38;
      const eyeLateralOffset = headRadius * 0.55;
      const eyeRadius = Math.max(3.5, headRadius * 0.36);
      const perpAngle = this.angle + Math.PI / 2;
      const fwdX = Math.cos(this.angle) * eyeForwardOffset;
      const fwdY = Math.sin(this.angle) * eyeForwardOffset;
      const latX = Math.cos(perpAngle) * eyeLateralOffset;
      const latY = Math.sin(perpAngle) * eyeLateralOffset;
      const leftEyeX = head.x + fwdX + latX;
      const leftEyeY = head.y + fwdY + latY;
      const rightEyeX = head.x + fwdX - latX;
      const rightEyeY = head.y + fwdY - latY;
      ctx.fillStyle = this.skin.eyeColor || "#ffffff";
      ctx.beginPath();
      ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
      ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
      const pupilRadius = this.isBoosting ? eyeRadius * 0.65 : eyeRadius * 0.48;
      const lookDiff = normalizeAngle(this.targetAngle - this.angle);
      const lookAngle = this.angle + lookDiff * 0.7;
      const lookDist = eyeRadius * 0.35;
      const pupilOffX = Math.cos(lookAngle) * lookDist;
      const pupilOffY = Math.sin(lookAngle) * lookDist;
      ctx.fillStyle = this.skin.pupilColor || "#000000";
      ctx.beginPath();
      ctx.arc(leftEyeX + pupilOffX, leftEyeY + pupilOffY, pupilRadius, 0, Math.PI * 2);
      ctx.arc(rightEyeX + pupilOffX, rightEyeY + pupilOffY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(leftEyeX + pupilOffX - pupilRadius * 0.35, leftEyeY + pupilOffY - pupilRadius * 0.35, pupilRadius * 0.35, 0, Math.PI * 2);
      ctx.arc(rightEyeX + pupilOffX - pupilRadius * 0.35, rightEyeY + pupilOffY - pupilRadius * 0.35, pupilRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    drawNameTag(ctx) {
      const head = this.segments[0];
      const tagY = head.y - this.radius - 14;
      ctx.save();
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const metrics = ctx.measureText(this.name);
      const tagWidth = metrics.width + 14;
      const tagHeight = 18;
      ctx.fillStyle = "rgba(10, 15, 25, 0.72)";
      ctx.beginPath();
      ctx.roundRect(head.x - tagWidth / 2, tagY - tagHeight / 2, tagWidth, tagHeight, 6);
      ctx.fill();
      ctx.fillStyle = this.isPlayer ? "#00f3ff" : "#ffffff";
      ctx.fillText(this.name, head.x, tagY);
      ctx.restore();
    }
  };

  // js/bot.js
  var BotSnake = class extends Snake {
    constructor(id, name, x, y, skinId, personalityType = "HUNTER") {
      super(id, name, x, y, skinId, false);
      this.personality = BOT_PERSONALITIES[personalityType] || BOT_PERSONALITIES.HUNTER;
      this.personalityType = personalityType;
      this.decisionTimer = 0;
      this.huntTarget = null;
      this.wanderAngle = this.angle;
      this.wanderTimer = 0;
      this.tacticalMode = "WANDER";
      this.cutOffTimer = 0;
      this.boostCooldown = Math.random() * 2;
      this.boostDuration = 0;
      this._scratchCandidates = [];
    }
    // snakeMap: Map<id, Snake> built once per frame in Game.update() for O(1) lookups.
    updateAI(dt, allSnakes, foodManager, spatialGrid, snakeMap) {
      if (this.dead) return;
      this.decisionTimer -= dt;
      this.wanderTimer -= dt;
      if (this.cutOffTimer > 0) this.cutOffTimer -= dt;
      if (this.boostCooldown > 0) this.boostCooldown -= dt;
      if (this.isBoosting) {
        this.boostDuration += dt;
        if (this.boostDuration > 0.65) {
          this.isBoosting = false;
          this.boostDuration = 0;
          this.boostCooldown = 2.5 + Math.random() * 2;
        }
      } else {
        this.boostDuration = 0;
      }
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter > CONFIG.WORLD_RADIUS - CONFIG.BOT_BOUNDARY_WARN_DIST) {
        const toCenter = Math.atan2(-this.y, -this.x);
        this.targetAngle = toCenter + (Math.random() - 0.5) * 0.4;
        this.isBoosting = false;
        this.tacticalMode = "WANDER";
        return;
      }
      const avoidance = this.evaluateSensoryFeelers(spatialGrid, snakeMap);
      if (avoidance.danger) {
        this.targetAngle = avoidance.suggestedAngle;
        if (avoidance.highDanger && this.boostCooldown <= 0 && this.mass > 25 && Math.random() < this.personality.boostChance) {
          this.isBoosting = true;
        } else {
          this.isBoosting = false;
        }
        return;
      }
      const defense = this.detectIncomingCutOff(allSnakes);
      if (defense.threat) {
        this.targetAngle = defense.evasiveAngle;
        this.isBoosting = false;
        return;
      }
      if (this.decisionTimer <= 0) {
        this.decisionTimer = 0.12 + Math.random() * 0.14;
        this.evaluateTactics(allSnakes, foodManager, spatialGrid);
      }
    }
    // Cast 5 ray feelers forward to detect real obstacles (enemy bodies, walls).
    // snakeMap: Map<id, Snake> for O(1) id->snake lookup inside the tight feeler loop.
    evaluateSensoryFeelers(spatialGrid, snakeMap) {
      const feelerDist = this.personality.feelerLength + this.radius * 1.2;
      const feelerAngles = [
        0,
        // Center
        -Math.PI * 0.14,
        // Mid-left (~25 deg)
        Math.PI * 0.14,
        // Mid-right (~25 deg)
        -Math.PI * 0.32,
        // Wide-left (~58 deg)
        Math.PI * 0.32
        // Wide-right (~58 deg)
      ];
      let leftPressure = 0;
      let rightPressure = 0;
      let dangerFound = false;
      let highDanger = false;
      for (let f = 0; f < feelerAngles.length; f++) {
        const rayAngle = this.angle + feelerAngles[f];
        const rayEndX = this.x + Math.cos(rayAngle) * feelerDist;
        const rayEndY = this.y + Math.sin(rayAngle) * feelerDist;
        const endDistFromCenter = Math.hypot(rayEndX, rayEndY);
        if (endDistFromCenter >= CONFIG.WORLD_RADIUS - CONFIG.BOT_FEELER_BOUNDARY_MARGIN) {
          dangerFound = true;
          highDanger = true;
          if (feelerAngles[f] < 0) leftPressure += 3.5;
          else if (feelerAngles[f] > 0) rightPressure += 3.5;
          else {
            leftPressure += 2;
            rightPressure += 2;
          }
        }
        const samplePoints = 3;
        for (let s = 1; s <= samplePoints; s++) {
          const sampleDist = feelerDist / samplePoints * s;
          const sx = this.x + Math.cos(rayAngle) * sampleDist;
          const sy = this.y + Math.sin(rayAngle) * sampleDist;
          this._scratchCandidates.length = 0;
          spatialGrid.queryCircle(sx, sy, this.radius + 12, this._scratchCandidates);
          for (let c = 0; c < this._scratchCandidates.length; c++) {
            const item = this._scratchCandidates[c];
            if (item.snakeId === void 0 || item.snakeId === this.id) continue;
            if (item.isHead) {
              const otherSnake = snakeMap.get(item.snakeId);
              if (otherSnake && this.mass > otherSnake.mass * 1.15) {
                continue;
              }
            }
            dangerFound = true;
            const threatWeight = (samplePoints - s + 1) * 2.2;
            if (s === 1) highDanger = true;
            if (feelerAngles[f] < 0) {
              leftPressure += threatWeight;
            } else if (feelerAngles[f] > 0) {
              rightPressure += threatWeight;
            } else {
              leftPressure += threatWeight * 0.6;
              rightPressure += threatWeight * 0.6;
            }
          }
        }
      }
      if (!dangerFound) {
        return { danger: false };
      }
      let steerDelta = 0;
      if (leftPressure > rightPressure) {
        steerDelta = Math.PI * 0.52;
      } else if (rightPressure > leftPressure) {
        steerDelta = -Math.PI * 0.52;
      } else {
        steerDelta = (Math.random() < 0.5 ? 1 : -1) * Math.PI * 0.6;
      }
      return {
        danger: true,
        highDanger,
        suggestedAngle: this.angle + steerDelta
      };
    }
    // Detect when another snake is boosting across our nose to cut us off
    detectIncomingCutOff(allSnakes) {
      for (let i = 0; i < allSnakes.length; i++) {
        const other = allSnakes[i];
        if (other.id === this.id || other.dead || other.invulnerableTimer > 0) continue;
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.BOT_CUT_OFF_DETECT_DIST && other.isBoosting) {
          const angleToOther = Math.atan2(dy, dx);
          const relAngle = normalizeAngle(angleToOther - this.angle);
          if (Math.abs(relAngle) < Math.PI * 0.35) {
            const cross = dx * Math.sin(other.angle) - dy * Math.cos(other.angle);
            const evasiveDelta = cross > 0 ? -Math.PI * 0.55 : Math.PI * 0.55;
            return {
              threat: true,
              evasiveAngle: this.angle + evasiveDelta
            };
          }
        }
      }
      return { threat: false };
    }
    // Tactical combat evaluator
    evaluateTactics(allSnakes, foodManager, spatialGrid) {
      const deathDropCluster = this.findDeathDropCluster(foodManager);
      if (deathDropCluster && (this.personality.foodAttraction >= 1 || Math.random() < 0.6)) {
        this.targetAngle = Math.atan2(deathDropCluster.y - this.y, deathDropCluster.x - this.x);
        this.isBoosting = this.boostCooldown <= 0 && deathDropCluster.dist > 80 && deathDropCluster.dist < CONFIG.BOT_FEAST_SEARCH_RADIUS && this.mass > 25 && Math.random() < this.personality.boostChance;
        this.tacticalMode = "FEAST";
        return;
      }
      if (this.personality.huntingAggression > 0.6 && this.mass > 22) {
        const prey = this.findHuntingTarget(allSnakes);
        if (prey) {
          const distToPrey = Math.hypot(prey.x - this.x, prey.y - this.y);
          if (this.mass > prey.mass * 1.35 && distToPrey < CONFIG.BOT_HEAD_JOUST_DIST) {
            this.targetAngle = Math.atan2(prey.y - this.y, prey.x - this.x);
            this.isBoosting = this.boostCooldown <= 0 && this.mass > 25;
            this.tacticalMode = "HEAD_JOUST";
            return;
          }
          const leadDist = Math.max(70, Math.min(CONFIG.BOT_HEAD_JOUST_DIST, prey.speed * 0.7));
          const predX = prey.x + Math.cos(prey.angle) * leadDist;
          const predY = prey.y + Math.sin(prey.angle) * leadDist;
          const cross = (this.x - prey.x) * Math.sin(prey.angle) - (this.y - prey.y) * Math.cos(prey.angle);
          const cutSide = cross >= 0 ? -1 : 1;
          const offset = this.radius * 1.4 + prey.radius * 1.2;
          const cutTargetX = predX + cutSide * Math.sin(prey.angle) * offset;
          const cutTargetY = predY - cutSide * Math.cos(prey.angle) * offset;
          this.targetAngle = Math.atan2(cutTargetY - this.y, cutTargetX - this.x);
          if (this.boostCooldown <= 0 && distToPrey < CONFIG.BOT_CUT_OFF_MAX_DIST && distToPrey > CONFIG.BOT_CUT_OFF_MIN_DIST && Math.random() < this.personality.boostChance) {
            this.isBoosting = true;
            this.cutOffTimer = 0.45;
          } else if (this.cutOffTimer <= 0) {
            this.isBoosting = false;
          }
          this.tacticalMode = "CUT_OFF";
          return;
        }
      }
      if (this.mass > CONFIG.BOT_COIL_MIN_MASS && (this.personalityType === "COILER" || this.mass > 250)) {
        const coilPrey = this.findCoilTarget(allSnakes);
        if (coilPrey) {
          const angleToVictim = Math.atan2(coilPrey.y - this.y, coilPrey.x - this.x);
          const orbitDir = this.id.charCodeAt(0) % 2 === 0 ? 1 : -1;
          this.targetAngle = angleToVictim + orbitDir * (Math.PI * 0.5 + 0.22);
          this.isBoosting = this.boostCooldown <= 0 && this.mass > 50 && Math.random() < 0.25;
          this.tacticalMode = "COIL";
          return;
        }
      }
      const bestFood = this.findBestFood(foodManager);
      if (bestFood && bestFood.dist < CONFIG.BOT_FOOD_SEARCH_RADIUS) {
        this.targetAngle = Math.atan2(bestFood.y - this.y, bestFood.x - this.x);
        this.isBoosting = false;
        this.tacticalMode = "WANDER";
        return;
      }
      if (this.wanderTimer <= 0) {
        this.wanderTimer = 1 + Math.random() * 2;
        this.wanderAngle = this.angle + (Math.random() - 0.5) * 1;
      }
      this.targetAngle = this.wanderAngle;
      this.isBoosting = false;
      this.tacticalMode = "WANDER";
    }
    // Find nearest high-value death drop cluster
    findDeathDropCluster(foodManager) {
      let best = null;
      let highestValue = 0;
      const nearby = foodManager.spatialGrid.queryCircle(this.x, this.y, CONFIG.BOT_FEAST_SEARCH_RADIUS);
      for (let i = 0; i < nearby.length; i++) {
        const f = nearby[i];
        if (f.eaten || f.mass === void 0) continue;
        if (f.type === "death" || f.type === "prey" || f.mass > 1.8) {
          const dist = Math.hypot(f.x - this.x, f.y - this.y);
          const val = f.mass * 20 / (dist + 30);
          if (val > highestValue) {
            highestValue = val;
            best = { x: f.x, y: f.y, mass: f.mass, dist };
          }
        }
      }
      return best;
    }
    // Find best enemy snake to hunt and kill
    findHuntingTarget(allSnakes) {
      let bestTarget = null;
      let bestScore = -Infinity;
      for (let i = 0; i < allSnakes.length; i++) {
        const other = allSnakes[i];
        if (other.id === this.id || other.dead || other.invulnerableTimer > 0) continue;
        const dist = Math.hypot(other.x - this.x, other.y - this.y);
        if (dist > CONFIG.BOT_HUNT_RADIUS) continue;
        let score = (CONFIG.BOT_HUNT_RADIUS - dist) * 1.5;
        if (other.isPlayer) {
          score += 200;
        }
        if (other.mass < this.mass) {
          score += 120;
        } else if (other.mass > this.mass * 2.5) {
          score += 80;
        }
        if (score > bestScore) {
          bestScore = score;
          bestTarget = other;
        }
      }
      return bestTarget;
    }
    // Find smaller snake to enclose in a death coil
    findCoilTarget(allSnakes) {
      for (let i = 0; i < allSnakes.length; i++) {
        const other = allSnakes[i];
        if (other.id === this.id || other.dead || other.invulnerableTimer > 0) continue;
        if (other.mass < this.mass * 0.5) {
          const dist = Math.hypot(other.x - this.x, other.y - this.y);
          if (dist < CONFIG.BOT_COIL_TARGET_DIST) {
            return other;
          }
        }
      }
      return null;
    }
    // Find ambient food
    findBestFood(foodManager) {
      let best = null;
      let highestScore = -Infinity;
      const nearby = foodManager.spatialGrid.queryCircle(this.x, this.y, CONFIG.BOT_FOOD_SEARCH_RADIUS);
      for (let i = 0; i < nearby.length; i++) {
        const f = nearby[i];
        if (f.eaten || f.mass === void 0) continue;
        const dist = Math.hypot(f.x - this.x, f.y - this.y);
        if (dist < 5) continue;
        const score = f.mass * 15 / (dist + 25);
        if (score > highestScore) {
          highestScore = score;
          best = { x: f.x, y: f.y, mass: f.mass, dist };
        }
      }
      return best;
    }
  };

  // js/renderer.js
  var HEX_VERTEX_OFFSETS = Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    return {
      dx: CONFIG.HEX_SIZE * Math.cos(angle),
      dy: CONFIG.HEX_SIZE * Math.sin(angle)
    };
  });
  var Renderer = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: false });
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraInitialized = false;
      this.zoom = CONFIG.BASE_ZOOM || 0.78;
      this.targetZoom = CONFIG.BASE_ZOOM || 0.78;
      this.viewport = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
      this.boundaryPulse = 0;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    resetCamera(x, y) {
      this.cameraX = x;
      this.cameraY = y;
      this.cameraInitialized = true;
    }
    updateCamera(targetX, targetY, targetRadius, isBoosting = false, dt = 0.016) {
      if (!this.cameraInitialized) {
        this.cameraX = targetX;
        this.cameraY = targetY;
        this.cameraInitialized = true;
      } else {
        const followSpeed = isBoosting ? 14 : 9.5;
        const lerp = Math.min(1, followSpeed * dt);
        this.cameraX += (targetX - this.cameraX) * lerp;
        this.cameraY += (targetY - this.cameraY) * lerp;
      }
      const baseZoom = CONFIG.BASE_ZOOM || 0.78;
      const sizeZoomRatio = baseZoom - (targetRadius - CONFIG.BASE_RADIUS) * 0.01;
      const boostZoomMultiplier = isBoosting ? 0.9 : 1;
      this.targetZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, sizeZoomRatio * boostZoomMultiplier));
      this.zoom += (this.targetZoom - this.zoom) * Math.min(1, 0.08 * dt * 60);
      const halfW = this.width / (2 * this.zoom) + 100;
      const halfH = this.height / (2 * this.zoom) + 100;
      this.viewport.minX = this.cameraX - halfW;
      this.viewport.minY = this.cameraY - halfH;
      this.viewport.maxX = this.cameraX + halfW;
      this.viewport.maxY = this.cameraY + halfH;
      this.boundaryPulse += dt * 2.5;
    }
    render(gameState) {
      const { player, snakes, foodManager, particleManager } = gameState;
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.fillStyle = "#0a0d14";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.save();
      ctx.translate(this.width / 2, this.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.cameraX, -this.cameraY);
      this.drawHexGrid(ctx);
      this.drawBoundary(ctx);
      foodManager.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);
      particleManager.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);
      for (let i = 0; i < snakes.length; i++) {
        const s = snakes[i];
        if (!s.isPlayer && !s.dead) {
          s.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);
        }
      }
      if (player && !player.dead) {
        player.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);
      }
      ctx.restore();
    }
    // Draw optimized hexagonal honeycomb grid
    drawHexGrid(ctx) {
      const size = CONFIG.HEX_SIZE;
      const h = size * Math.sqrt(3);
      const vertDist = size * 1.5;
      const horizDist = h;
      const startRow = Math.floor(this.viewport.minY / vertDist) - 1;
      const endRow = Math.ceil(this.viewport.maxY / vertDist) + 1;
      const startCol = Math.floor(this.viewport.minX / horizDist) - 1;
      const endCol = Math.ceil(this.viewport.maxX / horizDist) + 1;
      ctx.strokeStyle = "rgba(25, 45, 75, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let r = startRow; r <= endRow; r++) {
        const y = r * vertDist;
        const xOffset = r % 2 !== 0 ? horizDist / 2 : 0;
        for (let c = startCol; c <= endCol; c++) {
          const x = c * horizDist + xOffset;
          if (Math.hypot(x, y) > CONFIG.WORLD_RADIUS + size) continue;
          for (let i = 0; i < 6; i++) {
            const v = HEX_VERTEX_OFFSETS[i];
            if (i === 0) ctx.moveTo(x + v.dx, y + v.dy);
            else ctx.lineTo(x + v.dx, y + v.dy);
          }
          ctx.closePath();
        }
      }
      ctx.stroke();
    }
    // Draw energetic circular boundary forcefield
    drawBoundary(ctx) {
      const R = CONFIG.WORLD_RADIUS;
      const pulse = Math.sin(this.boundaryPulse);
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, R + 3e3, 0, Math.PI * 2);
      ctx.arc(0, 0, R, 0, Math.PI * 2, true);
      ctx.fillStyle = "rgba(5, 7, 12, 0.88)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 30, 80, 0.35)";
      ctx.lineWidth = 18 + pulse * 4;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#ff1744";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#ff1744";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.save();
      ctx.setLineDash([20, 25]);
      ctx.lineDashOffset = -this.boundaryPulse * 15;
      ctx.strokeStyle = "rgba(255, 230, 240, 0.75)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, R - 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    }
  };

  // js/ui.js
  function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return char;
      }
    });
  }
  var UIManager = class {
    constructor(game) {
      this.game = game;
      this.hudElement = document.getElementById("hud");
      this.scoreVal = document.getElementById("score-val");
      this.lengthVal = document.getElementById("length-val");
      this.killsVal = document.getElementById("kills-val");
      this.rankVal = document.getElementById("rank-val");
      this.leaderboardList = document.getElementById("leaderboard-list");
      this.minimapCanvas = document.getElementById("minimap-canvas");
      this.minimapCtx = this.minimapCanvas.getContext("2d");
      this.startMenu = document.getElementById("start-menu");
      this.gameOverMenu = document.getElementById("game-over-menu");
      this.nicknameInput = document.getElementById("nickname-input");
      this.playBtn = document.getElementById("play-btn");
      this.restartBtn = document.getElementById("restart-btn");
      this.changeSkinBtn = document.getElementById("change-skin-btn");
      this.skinPrevBtn = document.getElementById("skin-prev-btn");
      this.skinNextBtn = document.getElementById("skin-next-btn");
      this.skinNameLabel = document.getElementById("skin-name");
      this.skinCanvas = document.getElementById("skin-preview-canvas");
      this.skinCtx = this.skinCanvas.getContext("2d");
      this.finalScore = document.getElementById("final-score");
      this.finalLength = document.getElementById("final-length");
      this.finalKills = document.getElementById("final-kills");
      this.finalTime = document.getElementById("final-time");
      this.finalRank = document.getElementById("final-rank");
      this.bestScoreVal = document.getElementById("best-score-val");
      this.muteBtn = document.getElementById("mute-btn");
      this.volumeSlider = document.getElementById("volume-slider");
      this.botCountBtns = document.querySelectorAll(".bot-count-btn");
      this.selectedSkinIndex = 0;
      this.previewPhase = 0;
      this.highestRankAchieved = 999;
      this.loadProfile();
      this.initEventListeners();
    }
    loadProfile() {
      const savedNick = localStorage.getItem("slyth_nickname") || localStorage.getItem("slither_nickname");
      if (savedNick) {
        this.nicknameInput.value = savedNick;
      }
      const savedSkin = localStorage.getItem("slyth_skin") || localStorage.getItem("slither_skin");
      if (savedSkin) {
        const idx = SKINS.findIndex((s) => s.id === savedSkin);
        if (idx !== -1) this.selectedSkinIndex = idx;
      }
      const savedBest = localStorage.getItem("slyth_best_score") || localStorage.getItem("slither_best_score") || "0";
      if (this.bestScoreVal) {
        this.bestScoreVal.textContent = savedBest;
      }
    }
    initEventListeners() {
      this.playBtn.addEventListener("click", () => {
        this.startGame();
      });
      this.nicknameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.startGame();
        }
      });
      this.restartBtn.addEventListener("click", () => {
        this.gameOverMenu.classList.add("hidden");
        this.startGame();
      });
      if (this.changeSkinBtn) {
        this.changeSkinBtn.addEventListener("click", () => {
          this.gameOverMenu.classList.add("hidden");
          this.startMenu.classList.remove("hidden");
        });
      }
      this.skinPrevBtn.addEventListener("click", () => {
        this.selectedSkinIndex = (this.selectedSkinIndex - 1 + SKINS.length) % SKINS.length;
        this.updateSkinPreview();
      });
      this.skinNextBtn.addEventListener("click", () => {
        this.selectedSkinIndex = (this.selectedSkinIndex + 1) % SKINS.length;
        this.updateSkinPreview();
      });
      if (this.muteBtn) {
        this.muteBtn.addEventListener("click", () => {
          const isMuted = !this.game.sound.muted;
          this.game.sound.setMuted(isMuted);
          this.updateMuteButtonUI();
        });
        this.updateMuteButtonUI();
      }
      if (this.volumeSlider) {
        this.volumeSlider.value = this.game.sound.volume;
        this.volumeSlider.addEventListener("input", (e) => {
          this.game.sound.setVolume(parseFloat(e.target.value));
          if (this.game.sound.muted) {
            this.game.sound.setMuted(false);
            this.updateMuteButtonUI();
          }
        });
      }
      this.botCountBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.botCountBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.game.setBotCount(parseInt(btn.dataset.count, 10));
        });
      });
      this.updateSkinPreview();
    }
    updateMuteButtonUI() {
      if (!this.muteBtn) return;
      if (this.game.sound.muted) {
        this.muteBtn.textContent = "\u{1F507} Muted";
        this.muteBtn.classList.add("muted");
      } else {
        this.muteBtn.textContent = "\u{1F50A} Sound On";
        this.muteBtn.classList.remove("muted");
      }
    }
    startGame() {
      const nick = this.nicknameInput.value.trim() || "Player";
      const skin = SKINS[this.selectedSkinIndex];
      localStorage.setItem("slyth_nickname", nick);
      localStorage.setItem("slyth_skin", skin.id);
      this.startMenu.classList.add("hidden");
      this.gameOverMenu.classList.add("hidden");
      this.hudElement.classList.remove("hidden");
      this.highestRankAchieved = 999;
      this.game.start(nick, skin.id);
    }
    showGameOver(stats) {
      this.hudElement.classList.add("hidden");
      this.gameOverMenu.classList.remove("hidden");
      const score = Math.floor(stats.mass * 10);
      const length = stats.segments.length;
      const kills = stats.kills;
      const timeSec = Math.floor(stats.timeAlive);
      const mins = Math.floor(timeSec / 60);
      const secs = timeSec % 60;
      const timeFormatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      this.finalScore.textContent = score;
      this.finalLength.textContent = length;
      this.finalKills.textContent = kills;
      this.finalTime.textContent = timeFormatted;
      this.finalRank.textContent = `#${Math.min(this.highestRankAchieved, stats.rank || 1)}`;
      const best = parseInt(localStorage.getItem("slyth_best_score") || localStorage.getItem("slither_best_score") || "0", 10);
      if (score > best) {
        localStorage.setItem("slyth_best_score", score);
        this.bestScoreVal.textContent = score;
      } else {
        this.bestScoreVal.textContent = best;
      }
    }
    updateSkinPreview() {
      const skin = SKINS[this.selectedSkinIndex];
      this.skinNameLabel.textContent = skin.name;
      this.renderSkinPreview(skin);
    }
    // Draw animated snake preview in the menu
    renderSkinPreview(skin) {
      const ctx = this.skinCtx;
      const w = this.skinCanvas.width;
      const h = this.skinCanvas.height;
      ctx.clearRect(0, 0, w, h);
      const centerX = w / 2;
      const centerY = h / 2;
      const segmentCount = 14;
      const radius = 10;
      this.previewPhase += 0.05;
      for (let i = segmentCount - 1; i >= 0; i--) {
        const x = centerX - (i - segmentCount / 2) * 11;
        const y = centerY + Math.sin(this.previewPhase + i * 0.45) * 16;
        drawSkinSegment(ctx, x, y, radius, skin, i, segmentCount, this.previewPhase * 1.6);
        if (i === 0) {
          ctx.fillStyle = skin.eyeColor || "#ffffff";
          ctx.beginPath();
          ctx.arc(x + 4, y - 4, 3.5, 0, Math.PI * 2);
          ctx.arc(x + 4, y + 4, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = skin.pupilColor || "#000000";
          ctx.beginPath();
          ctx.arc(x + 5, y - 4, 1.8, 0, Math.PI * 2);
          ctx.arc(x + 5, y + 4, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    updateHUD(player, totalSnakes) {
      if (!player || player.dead) return;
      this.scoreVal.textContent = Math.floor(player.mass * 10);
      this.lengthVal.textContent = player.segments.length;
      this.killsVal.textContent = player.kills;
      this.rankVal.textContent = `#${player.rank || 1} of ${totalSnakes}`;
      if (player.rank && player.rank < this.highestRankAchieved) {
        this.highestRankAchieved = player.rank;
      }
    }
    updateLeaderboard(rankedSnakes, player) {
      let html = "";
      const topCount = Math.min(10, rankedSnakes.length);
      for (let i = 0; i < topCount; i++) {
        const s = rankedSnakes[i];
        const isSelf = player && s.id === player.id;
        const score = Math.floor(s.mass * 10);
        const rowClass = isSelf ? "leaderboard-row self" : "leaderboard-row";
        const safeName = escapeHTML(s.name);
        html += `
        <div class="${rowClass}">
          <span class="rank">#${i + 1}</span>
          <span class="name" title="${safeName}">${safeName}</span>
          <span class="score">${score}</span>
        </div>
      `;
      }
      if (player && !player.dead && player.rank > 10) {
        const safePlayerName = escapeHTML(player.name);
        html += `
        <div class="leaderboard-divider">...</div>
        <div class="leaderboard-row self pinned">
          <span class="rank">#${player.rank}</span>
          <span class="name">${safePlayerName}</span>
          <span class="score">${Math.floor(player.mass * 10)}</span>
        </div>
      `;
      }
      this.leaderboardList.innerHTML = html;
    }
    drawMinimap(snakes, player, foods) {
      const ctx = this.minimapCtx;
      const w = this.minimapCanvas.width;
      const h = this.minimapCanvas.height;
      const mapRadius = w / 2 - 4;
      const scale = mapRadius / CONFIG.WORLD_RADIUS;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.fillStyle = "rgba(10, 16, 26, 0.78)";
      ctx.beginPath();
      ctx.arc(0, 0, mapRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, mapRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, mapRadius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffea00";
      for (let i = 0; i < foods.length; i++) {
        const f = foods[i];
        if (f.type === "prey") {
          ctx.beginPath();
          ctx.arc(f.x * scale, f.y * scale, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = "rgba(255, 75, 75, 0.75)";
      for (let i = 0; i < snakes.length; i++) {
        const s = snakes[i];
        if (s.isPlayer || s.dead) continue;
        const mx = s.x * scale;
        const my = s.y * scale;
        const r = Math.max(1.5, Math.min(3.5, s.radius * scale * 1.8));
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (player && !player.dead) {
        const px = player.x * scale;
        const py = player.y * scale;
        ctx.fillStyle = "rgba(0, 243, 255, 0.35)";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(player.angle) * 7, py + Math.sin(player.angle) * 7);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  // js/game.js
  var Game = class {
    constructor() {
      this.canvas = document.getElementById("game-canvas");
      this.renderer = new Renderer(this.canvas);
      this.foodGrid = new SpatialGrid(CONFIG.SPATIAL_CELL_SIZE);
      this.snakeGrid = new SpatialGrid(CONFIG.SPATIAL_CELL_SIZE);
      this.particleManager = new ParticleManager();
      this.foodManager = new FoodManager(this.foodGrid, this.particleManager);
      this.sound = sound;
      this.state = "MENU";
      this.player = null;
      this.snakes = [];
      this.botCount = CONFIG.BOT_COUNT;
      this.botRespawnQueue = [];
      this.lastTime = performance.now();
      this.leaderboardTimer = 0;
      this.minimapTimer = 0;
      this.skinPreviewTimer = 0;
      this.mouseX = window.innerWidth / 2;
      this.mouseY = window.innerHeight / 2;
      this.isMouseDown = false;
      this.isSpaceDown = false;
      this.keys = {};
      this.ui = new UIManager(this);
      this.initInputs();
      this.initWorld();
      requestAnimationFrame((t) => this.loop(t));
    }
    initWorld() {
      this.foodManager.init();
    }
    setBotCount(count) {
      this.botCount = Math.max(CONFIG.MIN_BOT_COUNT, Math.min(CONFIG.MAX_BOT_COUNT, count));
    }
    initInputs() {
      window.addEventListener("mousemove", (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.updatePlayerTargetAngle();
      });
      window.addEventListener("mousedown", (e) => {
        if (e.target.closest("#start-menu") || e.target.closest("#game-over-menu")) return;
        if (e.button === 0) {
          this.isMouseDown = true;
          this.sound.init();
        }
      });
      window.addEventListener("mouseup", (e) => {
        if (e.button === 0) {
          this.isMouseDown = false;
        }
      });
      window.addEventListener("contextmenu", (e) => {
        if (this.state === "PLAYING") {
          e.preventDefault();
        }
      });
      window.addEventListener("keydown", (e) => {
        this.keys[e.code] = true;
        if (e.code === "Space") {
          this.isSpaceDown = true;
          e.preventDefault();
        }
        if (e.code === "Escape" && this.state === "PLAYING") {
          this.state = "PAUSED";
        } else if (e.code === "Escape" && this.state === "PAUSED") {
          this.state = "PLAYING";
        }
      });
      window.addEventListener("keyup", (e) => {
        this.keys[e.code] = false;
        if (e.code === "Space") {
          this.isSpaceDown = false;
        }
      });
      window.addEventListener("touchstart", (e) => {
        if (e.target.closest("#start-menu") || e.target.closest("#game-over-menu")) return;
        if (e.touches.length > 0) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
          this.updatePlayerTargetAngle();
          this.sound.init();
        }
        if (e.touches.length > 1) {
          this.isMouseDown = true;
        }
      }, { passive: false });
      window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
          this.updatePlayerTargetAngle();
        }
      }, { passive: false });
      window.addEventListener("touchend", (e) => {
        if (e.touches.length === 0) {
          this.isMouseDown = false;
        }
      });
      const touchBoostBtn = document.getElementById("touch-boost-btn");
      if (touchBoostBtn) {
        touchBoostBtn.addEventListener("touchstart", (e) => {
          e.preventDefault();
          this.isMouseDown = true;
        });
        touchBoostBtn.addEventListener("touchend", (e) => {
          e.preventDefault();
          this.isMouseDown = false;
        });
      }
    }
    updatePlayerTargetAngle() {
      if (!this.player || this.player.dead || this.state !== "PLAYING") return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = this.mouseX - centerX;
      const dy = this.mouseY - centerY;
      const dist = Math.hypot(dx, dy);
      this.player.distToCursor = dist;
      if (dist > 10) {
        this.player.targetAngle = Math.atan2(dy, dx);
      }
    }
    start(playerName, skinId) {
      this.sound.init();
      const startX = (Math.random() - 0.5) * 600;
      const startY = (Math.random() - 0.5) * 600;
      this.player = new Snake("player", playerName, startX, startY, skinId, true);
      this.renderer.resetCamera(startX, startY);
      this.snakes = [this.player];
      this.botRespawnQueue = [];
      const shuffledNames = [...BOT_NAMES].sort(() => Math.random() - 0.5);
      const playerSkinId = typeof skinId === "string" && skinId ? skinId : "neon-cyan";
      const availableSkins = SKINS.filter((s) => s.id !== playerSkinId);
      const shuffledSkins = [...availableSkins].sort(() => Math.random() - 0.5);
      const titanCount = Math.max(2, Math.round(this.botCount * 0.08));
      const heavyCount = Math.max(3, Math.round(this.botCount * 0.15));
      const challengerCount = Math.max(6, Math.round(this.botCount * 0.28));
      const juvenileCount = Math.max(0, this.botCount - (titanCount + heavyCount + challengerCount));
      const personalities = ["HUNTER", "FORAGER", "SCAVENGER", "COILER"];
      let nameIdx = 0;
      const botTiers = [
        {
          count: titanCount,
          getMass: (i) => Math.round(520 + Math.random() * 220 - i * 120),
          getKills: () => Math.floor(4 + Math.random() * 4),
          getPersonality: (i) => i % 2 === 0 ? "COILER" : "HUNTER"
        },
        {
          count: heavyCount,
          getMass: () => Math.round(170 + Math.random() * 150),
          getKills: () => Math.floor(2 + Math.random() * 3),
          getPersonality: (i) => personalities[(i + 1) % personalities.length]
        },
        {
          count: challengerCount,
          getMass: () => Math.round(60 + Math.random() * 80),
          getKills: () => Math.floor(Math.random() * 2),
          getPersonality: (i) => personalities[(i + 2) % personalities.length]
        },
        {
          count: juvenileCount,
          getMass: () => Math.round(CONFIG.START_MASS + Math.random() * 25),
          getKills: () => 0,
          getPersonality: (i) => personalities[i % personalities.length]
        }
      ];
      for (const tier of botTiers) {
        for (let i = 0; i < tier.count; i++) {
          const skin = shuffledSkins[nameIdx % shuffledSkins.length].id;
          const bot = this.spawnBot(tier.getPersonality(i), tier.getMass(i), tier.getKills(), skin);
          if (shuffledNames[nameIdx]) bot.name = shuffledNames[nameIdx];
          nameIdx++;
        }
      }
      this.updateLeaderboardAndRankings();
      this.state = "PLAYING";
      this.lastTime = performance.now();
    }
    spawnBot(personality = null, customMass = null, customKills = null, customSkin = null) {
      const id = `bot_${Math.random().toString(36).substring(2, 9)}`;
      const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      let skinId = customSkin;
      if (!skinId) {
        const livingSkinIds = new Set(this.snakes.filter((s) => !s.dead).map((s) => s.skin.id));
        const unusedSkins = SKINS.filter((s) => !livingSkinIds.has(s.id));
        if (unusedSkins.length > 0) {
          skinId = unusedSkins[Math.floor(Math.random() * unusedSkins.length)].id;
        } else {
          skinId = SKINS[Math.floor(Math.random() * SKINS.length)].id;
        }
      }
      let mass;
      let kills = 0;
      if (typeof customMass === "number") {
        mass = customMass;
        kills = typeof customKills === "number" ? customKills : 0;
      } else {
        const roll = Math.random();
        if (roll < 0.68) {
          mass = Math.round(CONFIG.START_MASS + Math.random() * 25);
          kills = 0;
        } else if (roll < 0.92) {
          mass = Math.round(55 + Math.random() * 75);
          kills = Math.floor(1 + Math.random() * 2);
        } else {
          mass = Math.round(150 + Math.random() * 140);
          kills = Math.floor(2 + Math.random() * 3);
        }
      }
      let x, y, distToPlayer;
      let attempts = 0;
      const maxRadius = mass > 200 ? CONFIG.WORLD_RADIUS * 0.65 : CONFIG.WORLD_RADIUS - 1e3;
      const minRadius = mass > 200 ? 900 : 700;
      do {
        const pos = randomInCircle(minRadius, maxRadius);
        x = pos.x;
        y = pos.y;
        distToPlayer = this.player ? Math.hypot(x - this.player.x, y - this.player.y) : 2500;
        attempts++;
      } while (distToPlayer < CONFIG.BOT_SAFE_SPAWN_MIN_DIST && attempts < CONFIG.BOT_SAFE_SPAWN_ATTEMPTS);
      const bot = new BotSnake(id, name, x, y, skinId, personality || "HUNTER");
      bot.mass = mass;
      bot.kills = kills;
      bot.initSegments();
      this.snakes.push(bot);
      return bot;
    }
    loop(currentTime) {
      requestAnimationFrame((t) => this.loop(t));
      const dt = Math.min(0.06, (currentTime - this.lastTime) / 1e3);
      this.lastTime = currentTime;
      if (this.state === "MENU") {
        this.skinPreviewTimer += dt;
        if (this.skinPreviewTimer > 0.03) {
          this.skinPreviewTimer = 0;
          this.ui.updateSkinPreview();
        }
        return;
      }
      if (this.state === "PAUSED") return;
      this.update(dt);
      this.render();
    }
    update(dt) {
      this.updatePlayerTargetAngle();
      if (this.player && !this.player.dead) {
        this.player.isBoosting = this.isMouseDown || this.isSpaceDown;
      }
      this.snakeGrid.clear();
      for (let i = 0; i < this.snakes.length; i++) {
        const s = this.snakes[i];
        if (s.dead) continue;
        for (let j = 0; j < s.segments.length; j++) {
          this.snakeGrid.insert(s.segments[j]);
        }
      }
      const snakeMap = /* @__PURE__ */ new Map();
      for (let i = 0; i < this.snakes.length; i++) {
        snakeMap.set(this.snakes[i].id, this.snakes[i]);
      }
      this.foodManager.update(dt, this.snakes);
      this.particleManager.update(dt);
      for (let i = 0; i < this.snakes.length; i++) {
        const s = this.snakes[i];
        if (s instanceof BotSnake && !s.dead) {
          s.updateAI(dt, this.snakes, this.foodManager, this.snakeGrid, snakeMap);
        }
      }
      for (let i = 0; i < this.snakes.length; i++) {
        const s = this.snakes[i];
        if (!s.dead) {
          s.update(dt, this.foodManager, this.particleManager, this.sound);
          s.eatFood(this.foodManager, this.sound, this.particleManager);
        }
      }
      for (let i = 0; i < this.snakes.length; i++) {
        const s = this.snakes[i];
        if (!s.dead) {
          const died = s.checkCollisions(this.snakes, this.snakeGrid, this.sound, this.particleManager, this.foodManager, snakeMap);
          if (died && s.isPlayer) {
            this.handlePlayerDeath();
          } else if (died) {
            this.botRespawnQueue.push({ time: CONFIG.BOT_RESPAWN_DELAY });
          }
        }
      }
      for (let i = this.botRespawnQueue.length - 1; i >= 0; i--) {
        this.botRespawnQueue[i].time -= dt;
        if (this.botRespawnQueue[i].time <= 0) {
          this.botRespawnQueue.splice(i, 1);
          if (this.snakes.filter((s) => !s.isPlayer && !s.dead).length < this.botCount) {
            this.spawnBot();
          }
        }
      }
      this.snakes = this.snakes.filter((s) => !s.dead || s.isPlayer);
      if (this.player && !this.player.dead) {
        const isBoosting = this.player.isBoosting && this.player.mass > CONFIG.MIN_BOOST_MASS;
        this.renderer.updateCamera(this.player.x, this.player.y, this.player.radius, isBoosting, dt);
      }
      this.leaderboardTimer += dt;
      if (this.leaderboardTimer >= 0.25) {
        this.leaderboardTimer = 0;
        this.updateLeaderboardAndRankings();
      }
      this.minimapTimer += dt;
      if (this.minimapTimer >= 0.08) {
        this.minimapTimer = 0;
        this.ui.drawMinimap(this.snakes, this.player, this.foodManager.foods);
      }
    }
    updateLeaderboardAndRankings() {
      const livingSnakes = this.snakes.filter((s) => !s.dead);
      livingSnakes.sort((a, b) => b.mass - a.mass);
      for (let i = 0; i < livingSnakes.length; i++) {
        livingSnakes[i].rank = i + 1;
      }
      this.ui.updateLeaderboard(livingSnakes, this.player);
      this.ui.updateHUD(this.player, livingSnakes.length);
    }
    handlePlayerDeath() {
      this.state = "GAMEOVER";
      setTimeout(() => {
        this.ui.showGameOver(this.player);
      }, 650);
    }
    render() {
      this.renderer.render({
        player: this.player,
        snakes: this.snakes,
        foodManager: this.foodManager,
        particleManager: this.particleManager
      });
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    window.slythGame = game;
    window.slitherGame = game;
  });
})();

# 🐍 Slyth.io - Complete Offline Playable Game

A high-performance, feature-complete offline clone of the classic **Slyth.io** (inspired by Slither.io) built with pure HTML5 Canvas, Web Audio API, and modern ES6 JavaScript.

**100% Offline & Zero Dependencies**: Runs directly in any web browser without needing an internet connection, node packages, or server backends.

---

## 🎮 How to Play

### Quick Start
You can launch the game using either of these methods:
1. **Direct File Launch**: Double-click `index.html` in your file explorer to open it in Chrome, Edge, Firefox, or Safari.
2. **Local HTTP Server** (Recommended for local module security policies):
   ```powershell
   # Using Python
   python -m http.server 8080

   # Or using Node
   npx serve .
   ```
   Then open `http://localhost:8080` in your browser.

---

## 🕹️ Controls

| Platform | Action | Control |
| :--- | :--- | :--- |
| **Desktop** | **Steer** | Move mouse cursor around the screen |
| | **Boost / Sprint** | Hold **Left Mouse Button** or **Spacebar** |
| | **Pause Game** | Press **Escape** |
| **Mobile / Tablet** | **Steer** | Touch and drag finger across the screen |
| | **Boost / Sprint** | Tap and hold the on-screen **BOOST** button or double-finger touch |

---

## ✨ Features & Mechanics

### 1. Authentic Snake Kinematics & Slither Wiggle
- **Rope Segment Physics**: Smooth trailing segments with fixed-distance constraints.
- **Organic Sinusoidal Slithering**: Lateral wave oscillation overlaid on movement heading.
- **Dynamic Mass Scaling**:
  - Gaining mass increases your length and segment radius logarithmically.
  - Smooth dynamic camera zoom-out as you grow, ensuring wide visibility.
- **Expressive Animated Eyes**: Dual forward-facing eyes with pupils that track your movement target and dilate during high-speed boosting.

### 2. Boost Acceleration System
- Speed increases by ~2.1x during boost.
- Drains mass gradually while dropping glowing energy pellets behind your tail.
- Requires minimum mass threshold (18 mass) to prevent over-depletion.

### 3. 12 Distinct Aesthetic Skins
- **Electric Neon** (Cyan & Deep Blue)
- **Magma Blaze** (Fire Orange & Gold)
- **Rainbow Chroma** (Real-time shifting spectral hues)
- **Cyberpunk Violet** (Hot Pink & Electric Purple)
- **Toxic Acid** (Lime Green & Emerald)
- **Golden Dragon** (Gold & Amber with dark accents)
- **Arctic Frost** (Ice Cyan & Frost White)
- **Bumblebee** (Alternating Yellow & Black Bands)
- **Midnight Phantom** (Deep Indigo & Ultraviolet)
- **Candy Swirl** (Pastel Pink & Mint)
- **Blood Ruby** (Deep Crimson & Charcoal)
- **Emerald Viper** (Jade & Neon Green)
- Live interactive S-curve animated skin preview in the start menu.

### 4. 4 AI Bot Personalities (20 - 45 Active Bots)
- **Foragers**: Wander peacefully vacuuming ambient food and steering clear of conflicts.
- **Hunters**: Compute leading intercept trajectories to boost and cut off player and other bots.
- **Scavengers**: Detect large death explosions and swarm to devour the dropped mass.
- **Coilers**: Target smaller snakes and encircle them into a deadly spiral trap.
- **Multi-Ray Sensory Feelers**: Bots cast forward sensory rays (-60° to +60°) to detect snake bodies and arena walls, swerving away from imminent collisions.
- **Continuous World Density**: Dead bots automatically respawn off-screen to keep the arena populated.

### 5. Dynamic Food Ecosystem
- **Ambient Food**: 1,800+ drifting, pulsing glowing pellets scattered across the 6,400px diameter arena.
- **Boost Drops**: Energy orbs dropped along the path of accelerating snakes.
- **Death Orbs**: Huge clusters of high-value energy released along the entire spine of a defeated snake.
- **Fleeing Prey (Fireflies)**: Fast, evasive golden fireflies that dart away when approached and leave sparkle trails. Eating them awards massive score boosts!

### 6. Procedural Web Audio API (No External Audio Files)
- **Zero Asset Loading Friction**: All sounds synthesized in real-time using oscillators, gain nodes, and biquad filters.
- Ascending pitch eating chime combos.
- Deep filtered boost jet roar.
- Impactful death burst crunch & shockwave audio.
- Enemy slain fanfare arpeggios.
- Arena boundary warning alarms.
- Integrated mute toggle and master volume slider with `localStorage` persistence.

### 7. Performance & Optimization
- **2D Spatial Hash Grid**: Rapid $O(1)$ spatial queries for collision detection and viewport culling.
- **Zero Garbage Collection Particles**: Object-pooled particle engine for smooth 60+ FPS gameplay with hundreds of simultaneous particles.
- **Device Pixel Ratio Scaling**: Ultra-crisp rendering on Retina / 4K displays.

---

## 📁 Project Structure

```
slyth.io/
├── index.html           # Main HTML5 entry point and UI markup
├── css/
│   └── style.css        # Cyber-neon styling, glassmorphism, responsive layout
├── js/
│   ├── config.js        # Game constants, physics balance, skin palettes, bot names
│   ├── audio.js         # Web Audio API sound synthesizer
│   ├── spatialGrid.js   # 2D spatial hash grid for collision & culling
│   ├── particle.js      # Object-pooled particle effects
│   ├── food.js          # Ambient food, boost drops, death orbs, and fleeing prey
│   ├── snake.js         # Snake kinematics, wiggle wave, eyes, and skin drawing
│   ├── bot.js           # AI controller: feelers, hunting, coiling, avoidance
│   ├── renderer.js      # Camera transforms, hex grid, boundary shield, layers
│   ├── ui.js            # Leaderboard, circular radar minimap, HUD, skin preview
│   └── game.js          # Main game loop, input coordinator, bot spawner
└── README.md            # Documentation and instructions
```

---

## 🏆 Scoring & Leaderboard
- **Score**: Calculated as `Mass * 10 + Kills * 250`.
- **Leaderboard**: Real-time Top 10 rankings in the top-right corner.
- **Radar Minimap**: Bottom-right radar tracking arena boundaries, food hotspots, bot positions, and player direction.
- **Local Persistence**: Saves your custom nickname, selected skin, volume preference, and all-time High Score across sessions.

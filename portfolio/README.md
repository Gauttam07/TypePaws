# HARSH GAUTAM — Retro-Futurist HUD Portfolio

An Awwwards-inspired, high-craft personal portfolio built with zero build step (HTML5, Vanilla ES6+ JavaScript, CSS3, and WebGL). Inspired by the retro-futurist telemetry and design engineering of [haoqi.design](https://haoqi.design/).

---

## ⚡ Key Highlights & Features

1. **Retro-Futurist HUD Telemetry**:
   - **Live Timezone Clock**: Top status indicator showing GMT and local IST time format (`GMT+5:30 IST HH:MM:SS`).
   - **Real-time Mouse Coordinates**: Real-time pointer telemetry (`0420 X 0815 Y`) rendered in tabular monospace font.
   - **Dotted Bounding Box Hover States**: Signature `border: 2px dotted` active indicator around buttons and links.
   - **Passcode Cypher Matrix Decryption**: Interactive confidential block (`■■■■■■`) that scrambles into revealed text with synthesized audio ticks on hover or click.
   - **Animated Vector Signature**: Hand-drawn signature with CSS stroke dashoffset interpolation.

2. **Full-Screen WebGL Interactive Stage**:
   - **Mouse Fluid Paintbrush**: Real-time velocity-based light trails and phosphor wake that follow pointer movement.
   - **Wave Ripple Refraction**: Click interactions generate expanding concentric shockwaves distorting the underlying grid.
   - **Dual Color Modes**: Dynamic uniforms adjust smoothly between deep carbon dark mode (`#0e1011`) with acid lime (`#C0FE04`) and warm paper light mode (`#FBFAF4`).
   - **Dither & Blue Noise Grain**: Film grain and dot matrix overlay for tactile texture.

3. **Web Audio API Synthesizer (Zero External Audio Files)**:
   - **Hover Ticks**: Ultra-short 12ms micro-clicks (1400Hz exponential drop).
   - **Tactile Switch Clicks**: Dual-frequency mechanical relay snap.
   - **Audio Mode Toggle (`SOUND[|]` vs `SOUND[O]`)**: Harmonic chimes on state change.
   - **Theme Shift Sound**: Sub-bass resonance and sweep.

4. **Curated Work & Interactive Canvases**:
   - **Asymmetric 12-Column Editorial Grid**: Layout with variable spans and alignments matching contemporary design engineering portfolios.
   - **Procedural Canvas Visualizers**:
     - `TypePaws™`: Real-time streaming ASCII typography matrix and pulsing caret.
     - `NeuralCanvas GL`: Procedural rotating geometric torus and orbiting satellites.
     - `FlowEngine`: Interactive gravitational node constellation.
     - `VectorForge`: Parametric morphing isometric polygons.
     - `CyberHUD`: Oscilloscope audio waveforms and telemetry graphs.
   - **Project Detail Drawer**: Modal dialog displaying architecture specs, technology badges, live preview links, and GitHub repositories.

---

## 🚀 Running the Project

### Option 1: Using npm / npx
```bash
# In the root folder:
npm run portfolio
# Or:
npx serve portfolio
```

### Option 2: Using Python HTTP server
```bash
python -m http.server 3000
# Then open http://localhost:3000/portfolio/
```

### Option 3: Double-click / Local File
You can also open [index.html](file:///d:/Typeing%20Practice/portfolio/index.html) directly in any modern browser!

---

## 📁 Project Structure

```
portfolio/
├── index.html          # Semantic HUD structure, header, hero, work, and footer
├── css/
│   └── style.css       # Design tokens, dotted hover states, 12-column grid, responsive breakpoints
├── js/
│   ├── webgl.js        # WebGL fragment shader, mouse trail physics, ripple refraction
│   ├── audio.js        # Web Audio API procedural sound engine
│   ├── hud.js          # Live clock, coordinate tracker, cypher decoders, theme toggling
│   └── projects.js     # Data store, canvas procedural visualizers, modal drawer
└── README.md
```

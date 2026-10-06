/**
 * RETRO-FUTURIST WEBGL BACKGROUND & INTERACTIVE CURSOR PAINTBRUSH SHADER
 * Inspired by haoqi.design's Awwwards-winning WebGL interactive stage
 */

(function () {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported, falling back to static background');
    return;
  }

  // Vertex Shader: Fullscreen quad
  const vsSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = (aPosition + 1.0) * 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  // Fragment Shader: Mouse paintbrush fluid wake, ripple refraction, subtle grain & chromatic glow
  const fsSource = `
    precision highp float;
    varying vec2 vUv;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uPrevMouse;
    uniform float uMouseSpeed;
    uniform float uTheme; // 0.0 = dark, 1.0 = light
    
    // Trail positions (up to 8 points)
    uniform vec2 uTrail[8];
    uniform float uTrailAge[8];

    // Ripple wave info: vec3(x, y, age)
    uniform vec3 uRipple;

    // Pseudo-random noise for retro grain
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 p = uv * aspect;

      // Base background color
      vec3 darkBg = vec3(0.055, 0.063, 0.067); // #0e1011
      vec3 lightBg = vec3(0.984, 0.984, 0.980); // #FBFBFA clean luminous alabaster
      vec3 bg = mix(darkBg, lightBg, uTheme);

      // Accent color: Acid Lime #C0FE04 in dark, Cyber-Olive #4D7C0F in light
      vec3 darkAccent = vec3(0.753, 0.996, 0.016);
      vec3 lightAccent = vec3(0.302, 0.486, 0.059);
      vec3 accent = mix(darkAccent, lightAccent, uTheme);

      // Secondary glow color
      vec3 darkGlow = vec3(0.12, 0.72, 0.95);
      vec3 lightGlow = vec3(0.18, 0.58, 0.88);
      vec3 cyberGlow = mix(darkGlow, lightGlow, uTheme);

      // --- 1. RIPPLE REFRACTION ---
      vec2 rippleCenter = uRipple.xy * aspect;
      float rippleAge = uRipple.z;
      vec2 disp = vec2(0.0);
      if (rippleAge > 0.0 && rippleAge < 1.0) {
        float rDist = length(p - rippleCenter);
        float waveRadius = rippleAge * 0.9;
        float waveWidth = 0.08;
        float wave = sin((rDist - waveRadius) * 45.0) * exp(-rDist * 3.5) * (1.0 - rippleAge);
        float ring = smoothstep(waveWidth, 0.0, abs(rDist - waveRadius)) * wave;
        disp += normalize(p - rippleCenter + 0.0001) * ring * 0.035;
      }

      // Apply ripple displacement
      vec2 distortedP = p + disp;

      // --- 2. MOUSE CURSOR PAINTBRUSH & TRAIL ACCUMULATION ---
      float trailIntensity = 0.0;
      float glowTrail = 0.0;

      for (int i = 0; i < 8; i++) {
        vec2 trailP = uTrail[i] * aspect;
        float age = uTrailAge[i];
        if (age < 1.0) {
          float d = length(distortedP - trailP);
          float radius = 0.14 * (1.0 + age * 0.5);
          float falloff = smoothstep(radius, 0.0, d);
          float weight = (1.0 - age) * falloff;
          trailIntensity += weight;
          glowTrail += weight * (1.0 - smoothstep(0.0, radius * 1.8, d));
        }
      }

      // Direct cursor point glow
      vec2 mouseP = uMouse * aspect;
      float directDist = length(distortedP - mouseP);
      float directGlow = smoothstep(0.18, 0.0, directDist) * 0.5;

      float totalEnergy = clamp(trailIntensity * 0.7 + directGlow + glowTrail * 0.3, 0.0, 1.0);

      // --- 3. RETRO SUBTLE GRID ACCENTUATION UNDER CURSOR ---
      vec2 gridUv = fract(uv * vec2(uResolution.x / 64.0, uResolution.y / 64.0));
      float gridDots = smoothstep(0.08, 0.0, length(gridUv - 0.5));
      float activeGrid = gridDots * totalEnergy * (uTheme > 0.5 ? 0.15 : 0.6);

      // --- 4. COLOR COMPOSITION & PHOSPHOR WAKE ---
      vec3 trailColor = mix(cyberGlow, accent, clamp(totalEnergy * 1.4, 0.0, 1.0));
      
      vec3 finalColor = bg;
      if (uTheme < 0.5) {
        // Dark mode: Additive glow
        finalColor += trailColor * (totalEnergy * 0.35);
        finalColor += accent * activeGrid;
      } else {
        // Light mode: Clean, luminous highlight without dirty subtraction
        finalColor = mix(finalColor, trailColor, totalEnergy * 0.07);
        finalColor += vec3(0.015) * totalEnergy;
      }

      // --- 5. FILM GRAIN / DITHER ---
      float grainIntensity = uTheme > 0.5 ? 0.008 : 0.022;
      float grain = (hash(uv + fract(uTime * 17.1)) - 0.5) * grainIntensity;
      finalColor += grain;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Shader compilation helper
  function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  // Fullscreen quad buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]),
    gl.STATIC_DRAW
  );

  const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
  const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
  const uTimeLoc = gl.getUniformLocation(program, 'uTime');
  const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
  const uPrevMouseLoc = gl.getUniformLocation(program, 'uPrevMouse');
  const uMouseSpeedLoc = gl.getUniformLocation(program, 'uMouseSpeed');
  const uThemeLoc = gl.getUniformLocation(program, 'uTheme');
  const uRippleLoc = gl.getUniformLocation(program, 'uRipple');

  const trailLocs = [];
  const trailAgeLocs = [];
  for (let i = 0; i < 8; i++) {
    trailLocs.push(gl.getUniformLocation(program, `uTrail[${i}]`));
    trailAgeLocs.push(gl.getUniformLocation(program, `uTrailAge[${i}]`));
  }

  // Trail state
  const TRAIL_COUNT = 8;
  const trail = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    trail.push({ x: 0.5, y: 0.5, age: 1.0 });
  }

  let ripple = { x: 0.5, y: 0.5, age: 1.0 };

  const mouse = { x: 0.5, y: 0.5 };
  const prevMouse = { x: 0.5, y: 0.5 };
  let mouseSpeed = 0;
  let lastTrailTime = 0;

  // Window resize handler
  let width = 0;
  let height = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse & touch interaction
  window.addEventListener('pointermove', (e) => {
    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = 1.0 - (e.clientY / window.innerHeight); // Invert for WebGL UV

    const dx = mouse.x - prevMouse.x;
    const dy = mouse.y - prevMouse.y;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);

    // Push to trail at controlled frequency
    const now = performance.now();
    if (now - lastTrailTime > 32) {
      lastTrailTime = now;
      // Shift trail
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        trail[i].x = trail[i - 1].x;
        trail[i].y = trail[i - 1].y;
        trail[i].age = trail[i - 1].age;
      }
      trail[0].x = mouse.x;
      trail[0].y = mouse.y;
      trail[0].age = 0.0;
    }
  }, { passive: true });

  // Ripple on click
  window.addEventListener('pointerdown', (e) => {
    ripple.x = e.clientX / window.innerWidth;
    ripple.y = 1.0 - (e.clientY / window.innerHeight);
    ripple.age = 0.01;
  }, { passive: true });

  // Render loop
  let startTime = performance.now();
  function render() {
    const now = performance.now();
    const elapsed = (now - startTime) * 0.001;

    // Decay trail ages
    for (let i = 0; i < TRAIL_COUNT; i++) {
      trail[i].age = Math.min(1.0, trail[i].age + 0.022);
    }

    // Expand ripple
    if (ripple.age < 1.0) {
      ripple.age += 0.025;
    }

    // Decay speed
    mouseSpeed *= 0.92;

    // Theme detection
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const themeVal = isLight ? 1.0 : 0.0;

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(uTimeLoc, elapsed);
    gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
    gl.uniform2f(uPrevMouseLoc, prevMouse.x, prevMouse.y);
    gl.uniform1f(uMouseSpeedLoc, mouseSpeed);
    gl.uniform1f(uThemeLoc, themeVal);
    gl.uniform3f(uRippleLoc, ripple.x, ripple.y, ripple.age);

    for (let i = 0; i < TRAIL_COUNT; i++) {
      gl.uniform2f(trailLocs[i], trail[i].x, trail[i].y);
      gl.uniform1f(trailAgeLocs[i], trail[i].age);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

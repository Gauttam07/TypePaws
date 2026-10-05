/**
 * TypePaws - Cute Reactive Cartoon Mascot System
 * Manages animated SVG characters (Barnaby the Cat, Pip the Hamster, Bubbles the Blob)
 * with states: idle, typing, high-speed typing, funny cartoon error reaction, and victory!
 */

class MascotController {
  constructor(containerId = 'mascot-container') {
    this.container = document.getElementById(containerId);
    this.currentSkin = 'cat'; // 'cat' | 'hamster' | 'blob'
    this.state = 'idle';
    this.errorTimeout = null;
    this.encouragementTimeout = null;
    this.errorQuotes = [
      "Oopsie! 🐾",
      "Bonk! 😹",
      "Wrong paw! 😸",
      "Almost! Try again!",
      "Meowch! Hehe",
      "Tiny slip! You got this!",
      "Boop! Keep going!",
      "Paws slipped! 🐱"
    ];
    this.cheerQuotes = [
      "Pawsome rhythm! 🔥",
      "Purr-fect accuracy! ✨",
      "Zoomies engaged! ⚡",
      "Look at those claws fly! 🐾",
      "You're in the zone! 🚀",
      "Typing superstar! ⭐"
    ];
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  setSkin(skin) {
    if (['cat', 'hamster', 'blob'].includes(skin)) {
      this.currentSkin = skin;
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="mascot-wrapper ${this.state} skin-${this.currentSkin}">
        <!-- Speech Bubble -->
        <div class="mascot-bubble" id="mascot-speech">Ready to clack! 🐾</div>

        <!-- Mascot SVG Stage -->
        <div class="mascot-stage" id="mascot-stage">
          ${this.getSvgForSkin(this.currentSkin)}
        </div>

        <!-- Mascot Name & Mood Tag -->
        <div class="mascot-badge" id="mascot-badge">
          <span class="badge-dot"></span>
          <span class="badge-text" id="mascot-status-text">Barnaby: Cheering you on</span>
        </div>
      </div>
    `;
  }

  getSvgForSkin(skin) {
    if (skin === 'hamster') {
      return this.getHamsterSvg();
    }
    if (skin === 'blob') {
      return this.getBlobSvg();
    }
    return this.getCatSvg();
  }

  /**
   * Barnaby the Cat SVG
   */
  getCatSvg() {
    return `
      <svg class="mascot-svg cat-svg" viewBox="0 0 200 180" width="100%" height="100%">
        <defs>
          <radialGradient id="catGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#ffb74d" />
            <stop offset="85%" stop-color="#f57c00" />
            <stop offset="100%" stop-color="#e65100" />
          </radialGradient>
          <radialGradient id="earInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffcdd2" />
            <stop offset="100%" stop-color="#f48fb1" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Tail -->
        <path class="cat-tail" d="M 155 125 Q 185 105 178 80 Q 170 65 158 75" fill="none" stroke="#f57c00" stroke-width="12" stroke-linecap="round" />

        <!-- Body -->
        <ellipse class="cat-body" cx="100" cy="120" rx="55" ry="45" fill="url(#catGradient)" />
        <ellipse cx="100" cy="125" rx="35" ry="28" fill="#ffe0b2" opacity="0.9" />

        <!-- Ears -->
        <g class="cat-ears">
          <!-- Left Ear -->
          <polygon class="ear-left" points="55,65 30,22 80,48" fill="#f57c00" stroke="#e65100" stroke-width="2" />
          <polygon points="56,60 40,32 74,48" fill="url(#earInner)" />
          <!-- Right Ear -->
          <polygon class="ear-right" points="145,65 170,22 120,48" fill="#f57c00" stroke="#e65100" stroke-width="2" />
          <polygon points="144,60 160,32 126,48" fill="url(#earInner)" />
        </g>

        <!-- Head -->
        <circle class="cat-head" cx="100" cy="75" r="46" fill="url(#catGradient)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))" />

        <!-- Cheeks -->
        <ellipse cx="70" cy="88" rx="8" ry="5" fill="#ff8a80" opacity="0.6" class="cat-blush" />
        <ellipse cx="130" cy="88" rx="8" ry="5" fill="#ff8a80" opacity="0.6" class="cat-blush" />

        <!-- Eyes Group -->
        <g class="cat-eyes" id="cat-eyes-group">
          <!-- Normal Happy Eyes -->
          <g class="eye-normal">
            <circle cx="78" cy="74" r="8" fill="#2d3748" />
            <circle cx="81" cy="71" r="3" fill="#ffffff" />
            <circle cx="122" cy="74" r="8" fill="#2d3748" />
            <circle cx="125" cy="71" r="3" fill="#ffffff" />
          </g>

          <!-- Typing Focused / Star Eyes (Shown when fast) -->
          <g class="eye-star" style="display: none;">
            <path d="M 78 68 Q 78 78 86 78 Q 78 78 78 88 Q 78 78 70 78 Q 78 78 78 68" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
            <path d="M 122 68 Q 122 78 130 78 Q 122 78 122 88 Q 122 78 114 78 Q 122 78 122 68" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
          </g>

          <!-- Funny Shock / Mistake Eyes (Shown on Error) -->
          <g class="eye-shock" style="display: none;">
            <!-- Huge wide cartoon eyes with tiny vibrating pupils -->
            <ellipse cx="76" cy="74" rx="13" ry="14" fill="#ffffff" stroke="#2d3748" stroke-width="2.5" />
            <circle class="shock-pupil-left" cx="76" cy="74" r="3.5" fill="#2d3748" />
            <ellipse cx="124" cy="74" rx="13" ry="14" fill="#ffffff" stroke="#2d3748" stroke-width="2.5" />
            <circle class="shock-pupil-right" cx="124" cy="74" r="3.5" fill="#2d3748" />
          </g>
        </g>

        <!-- Whiskers -->
        <g stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85">
          <line x1="50" y1="78" x2="25" y2="74" />
          <line x1="50" y1="84" x2="28" y2="88" />
          <line x1="150" y1="78" x2="175" y2="74" />
          <line x1="150" y1="84" x2="172" y2="88" />
        </g>

        <!-- Nose -->
        <polygon points="96,82 104,82 100,87" fill="#d81b60" />

        <!-- Mouth -->
        <g id="cat-mouth-group">
          <!-- Normal / Happy Smile -->
          <path class="mouth-smile" d="M 94 87 Q 100 93 100 87 Q 100 93 106 87" fill="none" stroke="#2d3748" stroke-width="2.2" stroke-linecap="round" />
          <!-- Funny Surprised 'O' Mouth on Error -->
          <ellipse class="mouth-shock" cx="100" cy="94" rx="6" ry="8" fill="#b91c1c" stroke="#2d3748" stroke-width="2" style="display: none;" />
        </g>

        <!-- Sweat Drop (Appears on error!) -->
        <g class="mascot-sweatdrop" id="cat-sweat" style="display: none; transform-origin: 150px 45px;">
          <path d="M 145 40 C 145 35 152 26 152 26 C 152 26 159 35 159 40 C 159 45 153 48 149 48 C 146 48 145 44 145 40 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
          <ellipse cx="149" cy="38" rx="2" ry="4" fill="#ffffff" opacity="0.8" />
        </g>

        <!-- Mini Laptop & Typing Paws -->
        <g class="mini-laptop" transform="translate(60, 125)">
          <!-- Laptop Screen -->
          <rect x="12" y="-18" width="56" height="34" rx="3" fill="#334155" stroke="#1e293b" stroke-width="1.5" />
          <rect x="15" y="-15" width="50" height="28" rx="2" fill="#0284c7" opacity="0.9" />
          <!-- Glowing screen code lines -->
          <line x1="19" y1="-9" x2="40" y2="-9" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" />
          <line x1="19" y1="-3" x2="55" y2="-3" stroke="#f0f9ff" stroke-width="2" stroke-linecap="round" />
          <line x1="19" y1="3" x2="48" y2="3" stroke="#a7f3d0" stroke-width="2" stroke-linecap="round" />
          <!-- Laptop Base / Keyboard -->
          <polygon points="5,16 75,16 68,26 12,26" fill="#64748b" stroke="#334155" stroke-width="1.5" />
          <rect x="22" y="18" width="36" height="5" rx="1" fill="#94a3b8" />
        </g>

        <!-- Tapping Paws -->
        <g class="cat-paws">
          <ellipse class="paw-left" cx="78" cy="144" rx="12" ry="8" fill="#ffe0b2" stroke="#f57c00" stroke-width="2" />
          <ellipse class="paw-right" cx="122" cy="144" rx="12" ry="8" fill="#ffe0b2" stroke="#f57c00" stroke-width="2" />
        </g>

        <!-- Celebration Party Hat & Confetti (Hidden by default) -->
        <g id="cat-party-props" style="display: none;">
          <polygon points="100,10 75,55 125,55" fill="#ec4899" stroke="#be185d" stroke-width="2" />
          <circle cx="100" cy="8" r="6" fill="#fbbf24" />
          <circle cx="85" cy="40" r="3" fill="#67e8f9" />
          <circle cx="112" cy="35" r="4" fill="#a7f3d0" />
          <!-- Confetti Sparks -->
          <circle cx="35" cy="40" r="4" fill="#f43f5e" />
          <rect x="160" y="30" width="8" height="8" rx="2" fill="#8b5cf6" transform="rotate(25 160 30)" />
          <circle cx="170" cy="65" r="5" fill="#10b981" />
          <polygon points="40,90 48,95 44,103" fill="#fbbf24" />
        </g>
      </svg>
    `;
  }

  /**
   * Pip the Hamster SVG
   */
  getHamsterSvg() {
    return `
      <svg class="mascot-svg hamster-svg" viewBox="0 0 200 180" width="100%" height="100%">
        <!-- Body -->
        <ellipse cx="100" cy="115" rx="55" ry="48" fill="#d97706" />
        <ellipse cx="100" cy="120" rx="38" ry="34" fill="#fef3c7" />
        <!-- Ears -->
        <circle cx="55" cy="55" r="16" fill="#d97706" />
        <circle cx="55" cy="55" r="9" fill="#fbcfe8" />
        <circle cx="145" cy="55" r="16" fill="#d97706" />
        <circle cx="145" cy="55" r="9" fill="#fbcfe8" />
        <!-- Head -->
        <circle cx="100" cy="80" r="44" fill="#f59e0b" />
        <!-- Big Hamster Cheeks -->
        <circle cx="68" cy="92" r="18" fill="#fef3c7" />
        <circle cx="132" cy="92" r="18" fill="#fef3c7" />
        <ellipse cx="60" cy="92" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
        <ellipse cx="140" cy="92" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
        <!-- Eyes -->
        <g id="hamster-eyes">
          <circle cx="80" cy="75" r="7" fill="#1e293b" />
          <circle cx="82" cy="73" r="2.5" fill="#fff" />
          <circle cx="120" cy="75" r="7" fill="#1e293b" />
          <circle cx="122" cy="73" r="2.5" fill="#fff" />
        </g>
        <!-- Nose & Buck Teeth -->
        <ellipse cx="100" cy="86" rx="4" ry="3" fill="#ec4899" />
        <rect cx="96" cy="92" x="97" y="90" width="3" height="5" fill="#fff" stroke="#1e293b" stroke-width="0.7" />
        <rect cx="100" cy="92" x="101" y="90" width="3" height="5" fill="#fff" stroke="#1e293b" stroke-width="0.7" />
        <!-- Paws -->
        <ellipse class="paw-left" cx="78" cy="138" rx="10" ry="7" fill="#fde68a" />
        <ellipse class="paw-right" cx="122" cy="138" rx="10" ry="7" fill="#fde68a" />
      </svg>
    `;
  }

  /**
   * Bubbles the Blob SVG
   */
  getBlobSvg() {
    return `
      <svg class="mascot-svg blob-svg" viewBox="0 0 200 180" width="100%" height="100%">
        <path d="M 60 70 C 40 100 45 140 80 150 C 120 160 160 150 165 110 C 170 70 140 45 100 45 C 75 45 65 60 60 70 Z" fill="#38bdf8" />
        <ellipse cx="80" cy="95" rx="6" ry="8" fill="#0f172a" />
        <circle cx="82" cy="93" r="2" fill="#fff" />
        <ellipse cx="120" cy="95" rx="6" ry="8" fill="#0f172a" />
        <circle cx="122" cy="93" r="2" fill="#fff" />
        <ellipse cx="70" cy="108" rx="7" ry="4" fill="#f472b6" opacity="0.6" />
        <ellipse cx="130" cy="108" rx="7" ry="4" fill="#f472b6" opacity="0.6" />
        <path d="M 94 105 Q 100 115 106 105" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    `;
  }

  /**
   * Action: Keystroke hit (tap paws)
   */
  onKeystroke(wpm = 30) {
    const wrapper = this.container ? this.container.querySelector('.mascot-wrapper') : null;
    if (!wrapper) return;

    // Reset error state if it was active
    if (this.state === 'error') {
      this.clearErrorState();
    }

    this.state = 'typing';
    wrapper.classList.remove('idle', 'error', 'celebrate');
    wrapper.classList.add('typing');

    // Toggle paw tap animation class
    const pawLeft = this.container.querySelector('.paw-left');
    const pawRight = this.container.querySelector('.paw-right');
    if (pawLeft && pawRight) {
      if (Math.random() > 0.5) {
        pawLeft.classList.toggle('tap-down');
      } else {
        pawRight.classList.toggle('tap-down');
      }
    }

    // High speed effect if > 60 WPM
    const starEyes = this.container.querySelector('.eye-star');
    const normalEyes = this.container.querySelector('.eye-normal');
    if (wpm >= 55 && starEyes && normalEyes) {
      starEyes.style.display = 'block';
      normalEyes.style.display = 'none';
      this.updateBubble("Super Sonic Speed! ⚡", false);
    } else if (starEyes && normalEyes && this.state !== 'error') {
      starEyes.style.display = 'none';
      normalEyes.style.display = 'block';
    }

    // Idle reset timer after stopping typing for 1.5s
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.onIdle();
    }, 1500);
  }

  /**
   * Action: Wrong Key Pressed!
   * Shows a brief, funny cartoon animation: surprised face, sweat drop, bonk wobble.
   * Completely light, encouraging, and resets in 450ms!
   */
  onError(expectedKey = '') {
    const wrapper = this.container ? this.container.querySelector('.mascot-wrapper') : null;
    if (!wrapper) return;

    this.state = 'error';
    wrapper.classList.remove('typing', 'celebrate');
    wrapper.classList.add('error', 'mascot-bonk');

    // Switch eyes to cartoon shock
    const eyeShock = this.container.querySelector('.eye-shock');
    const eyeNormal = this.container.querySelector('.eye-normal');
    const eyeStar = this.container.querySelector('.eye-star');
    if (eyeShock) eyeShock.style.display = 'block';
    if (eyeNormal) eyeNormal.style.display = 'none';
    if (eyeStar) eyeStar.style.display = 'none';

    // Switch mouth to funny 'O'
    const mouthSmile = this.container.querySelector('.mouth-smile');
    const mouthShock = this.container.querySelector('.mouth-shock');
    if (mouthSmile) mouthSmile.style.display = 'none';
    if (mouthShock) mouthShock.style.display = 'block';

    // Show comical sweatdrop
    const sweat = this.container.querySelector('#cat-sweat');
    if (sweat) sweat.style.display = 'block';

    // Pick a funny, light encouraging quote
    const randomQuote = this.errorQuotes[Math.floor(Math.random() * this.errorQuotes.length)];
    this.updateBubble(randomQuote, true);

    const statusText = document.getElementById('mascot-status-text');
    if (statusText) statusText.innerText = "Barnaby: Oopsie! Shaking it off...";

    // Reset back to cheerful typing state smoothly after 450ms
    clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.clearErrorState();
    }, 450);
  }

  clearErrorState() {
    const wrapper = this.container ? this.container.querySelector('.mascot-wrapper') : null;
    if (!wrapper) return;

    wrapper.classList.remove('error', 'mascot-bonk');
    this.state = 'typing';

    const eyeShock = this.container.querySelector('.eye-shock');
    const eyeNormal = this.container.querySelector('.eye-normal');
    if (eyeShock) eyeShock.style.display = 'none';
    if (eyeNormal) eyeNormal.style.display = 'block';

    const mouthSmile = this.container.querySelector('.mouth-smile');
    const mouthShock = this.container.querySelector('.mouth-shock');
    if (mouthSmile) mouthSmile.style.display = 'block';
    if (mouthShock) mouthShock.style.display = 'none';

    const sweat = this.container.querySelector('#cat-sweat');
    if (sweat) sweat.style.display = 'none';

    const statusText = document.getElementById('mascot-status-text');
    if (statusText) statusText.innerText = "Barnaby: Ready & focused!";
  }

  onIdle() {
    if (this.state === 'error' || this.state === 'celebrate') return;
    this.state = 'idle';
    const wrapper = this.container ? this.container.querySelector('.mascot-wrapper') : null;
    if (wrapper) {
      wrapper.classList.remove('typing', 'error');
      wrapper.classList.add('idle');
    }
    const statusText = document.getElementById('mascot-status-text');
    if (statusText) statusText.innerText = "Barnaby: Waiting for your paws";
  }

  /**
   * Action: Lesson Completed Celebration!
   */
  onCelebrate(wpm = 45, accuracy = 98) {
    const wrapper = this.container ? this.container.querySelector('.mascot-wrapper') : null;
    if (!wrapper) return;

    this.state = 'celebrate';
    wrapper.classList.remove('typing', 'error', 'idle');
    wrapper.classList.add('celebrate');

    // Show party hat & confetti
    const partyProps = this.container.querySelector('#cat-party-props');
    if (partyProps) partyProps.style.display = 'block';

    let cheer = "PAWSOME JOB! 🏆🎉";
    if (accuracy === 100) cheer = "FLAWLESS 100%! 🌟 Purr-fection!";
    else if (wpm > 60) cheer = "BLISTERING SPEED! ⚡🔥 Unstoppable!";

    this.updateBubble(cheer, false);

    const statusText = document.getElementById('mascot-status-text');
    if (statusText) statusText.innerText = "Barnaby: Victorious celebration!";
  }

  updateBubble(text, isError = false) {
    const bubble = document.getElementById('mascot-speech');
    if (!bubble) return;
    bubble.innerText = text;
    bubble.classList.remove('pop', 'bubble-error');
    void bubble.offsetWidth; // trigger reflow
    bubble.classList.add('pop');
    if (isError) bubble.classList.add('bubble-error');
  }
}

// Global instance
window.mascot = null;
document.addEventListener('DOMContentLoaded', () => {
  window.mascot = new MascotController('mascot-container');
});

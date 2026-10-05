/**
 * TypePaws - Interactive Touch-Typing Virtual Keyboard
 * Visualizes finger zones (Pinky to Pinky), highlights active target keys,
 * and shows live keystroke ripples to encourage touch typing without looking down.
 */

class VirtualKeyboard {
  constructor(containerId = 'virtual-keyboard-container') {
    this.container = document.getElementById(containerId);
    this.enabled = true;
    this.layout = [
      // Row 1: Numbers & Symbols
      [
        { key: '`', shift: '~', finger: 'lp', code: 'Backquote' },
        { key: '1', shift: '!', finger: 'lp', code: 'Digit1' },
        { key: '2', shift: '@', finger: 'lr', code: 'Digit2' },
        { key: '3', shift: '#', finger: 'lm', code: 'Digit3' },
        { key: '4', shift: '$', finger: 'li', code: 'Digit4' },
        { key: '5', shift: '%', finger: 'li', code: 'Digit5' },
        { key: '6', shift: '^', finger: 'ri', code: 'Digit6' },
        { key: '7', shift: '&', finger: 'ri', code: 'Digit7' },
        { key: '8', shift: '*', finger: 'rm', code: 'Digit8' },
        { key: '9', shift: '(', finger: 'rr', code: 'Digit9' },
        { key: '0', shift: ')', finger: 'rp', code: 'Digit0' },
        { key: '-', shift: '_', finger: 'rp', code: 'Minus' },
        { key: '=', shift: '+', finger: 'rp', code: 'Equal' },
        { key: 'Backspace', width: 'wide-backspace', finger: 'rp', code: 'Backspace' }
      ],
      // Row 2: Top Row
      [
        { key: 'Tab', width: 'wide-tab', finger: 'lp', code: 'Tab' },
        { key: 'q', shift: 'Q', finger: 'lp', code: 'KeyQ' },
        { key: 'w', shift: 'W', finger: 'lr', code: 'KeyW' },
        { key: 'e', shift: 'E', finger: 'lm', code: 'KeyE' },
        { key: 'r', shift: 'R', finger: 'li', code: 'KeyR' },
        { key: 't', shift: 'T', finger: 'li', code: 'KeyT' },
        { key: 'y', shift: 'Y', finger: 'ri', code: 'KeyY' },
        { key: 'u', shift: 'U', finger: 'ri', code: 'KeyU' },
        { key: 'i', shift: 'I', finger: 'rm', code: 'KeyI' },
        { key: 'o', shift: 'O', finger: 'rr', code: 'KeyO' },
        { key: 'p', shift: 'P', finger: 'rp', code: 'KeyP' },
        { key: '[', shift: '{', finger: 'rp', code: 'BracketLeft' },
        { key: ']', shift: '}', finger: 'rp', code: 'BracketRight' },
        { key: '\\', shift: '|', finger: 'rp', code: 'Backslash' }
      ],
      // Row 3: Home Row
      [
        { key: 'Caps', width: 'wide-caps', finger: 'lp', code: 'CapsLock' },
        { key: 'a', shift: 'A', finger: 'lp', code: 'KeyA' },
        { key: 's', shift: 'S', finger: 'lr', code: 'KeyS' },
        { key: 'd', shift: 'D', finger: 'lm', code: 'KeyD' },
        { key: 'f', shift: 'F', finger: 'li', bump: true, code: 'KeyF' },
        { key: 'g', shift: 'G', finger: 'li', code: 'KeyG' },
        { key: 'h', shift: 'H', finger: 'ri', code: 'KeyH' },
        { key: 'j', shift: 'J', finger: 'ri', bump: true, code: 'KeyJ' },
        { key: 'k', shift: 'K', finger: 'rm', code: 'KeyK' },
        { key: 'l', shift: 'L', finger: 'rr', code: 'KeyL' },
        { key: ';', shift: ':', finger: 'rp', code: 'Semicolon' },
        { key: "'", shift: '"', finger: 'rp', code: 'Quote' },
        { key: 'Enter', width: 'wide-enter', finger: 'rp', code: 'Enter' }
      ],
      // Row 4: Bottom Row
      [
        { key: 'Shift', width: 'wide-shift-l', finger: 'lp', code: 'ShiftLeft' },
        { key: 'z', shift: 'Z', finger: 'lp', code: 'KeyZ' },
        { key: 'x', shift: 'X', finger: 'lr', code: 'KeyX' },
        { key: 'c', shift: 'C', finger: 'lm', code: 'KeyC' },
        { key: 'v', shift: 'V', finger: 'li', code: 'KeyV' },
        { key: 'b', shift: 'B', finger: 'li', code: 'KeyB' },
        { key: 'n', shift: 'N', finger: 'ri', code: 'KeyN' },
        { key: 'm', shift: 'M', finger: 'ri', code: 'KeyM' },
        { key: ',', shift: '<', finger: 'rm', code: 'Comma' },
        { key: '.', shift: '>', finger: 'rr', code: 'Period' },
        { key: '/', shift: '?', finger: 'rp', code: 'Slash' },
        { key: 'Shift', width: 'wide-shift-r', finger: 'rp', code: 'ShiftRight' }
      ],
      // Row 5: Space
      [
        { key: 'Ctrl', width: 'wide-mod', finger: 'lp', code: 'ControlLeft' },
        { key: 'Alt', width: 'wide-mod', finger: 'th', code: 'AltLeft' },
        { key: 'Space', width: 'wide-space', finger: 'th', code: 'Space' },
        { key: 'Alt', width: 'wide-mod', finger: 'th', code: 'AltRight' },
        { key: 'Ctrl', width: 'wide-mod', finger: 'rp', code: 'ControlRight' }
      ]
    ];
    this.fingerNames = {
      lp: 'Left Pinky',
      lr: 'Left Ring',
      lm: 'Left Middle',
      li: 'Left Index',
      th: 'Thumb',
      ri: 'Right Index',
      rm: 'Right Middle',
      rr: 'Right Ring',
      rp: 'Right Pinky'
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    if (!this.container) return;
    let html = `<div class="kb-board" id="kb-board">`;

    this.layout.forEach((row, rIdx) => {
      html += `<div class="kb-row kb-row-${rIdx}">`;
      row.forEach(k => {
        const widthClass = k.width ? `kb-${k.width}` : '';
        const bumpClass = k.bump ? 'has-bump' : '';
        const fingerClass = `finger-${k.finger}`;
        const keyDisplay = k.shift ? `<span class="k-shift">${k.shift}</span><span class="k-main">${k.key.toUpperCase()}</span>` : `<span class="k-single">${k.key}</span>`;

        html += `
          <div class="kb-key ${widthClass} ${bumpClass} ${fingerClass}" data-key="${k.key.toLowerCase()}" data-shift="${(k.shift || '').toLowerCase()}" data-code="${k.code}">
            ${keyDisplay}
            ${k.bump ? '<span class="bump-dot"></span>' : ''}
          </div>
        `;
      });
      html += `</div>`;
    });

    html += `</div>`;

    // Finger guide legend
    html += `
      <div class="kb-legend">
        <span class="legend-item"><span class="legend-dot dot-lp"></span> L. Pinky</span>
        <span class="legend-item"><span class="legend-dot dot-lr"></span> L. Ring</span>
        <span class="legend-item"><span class="legend-dot dot-lm"></span> L. Middle</span>
        <span class="legend-item"><span class="legend-dot dot-li"></span> L. Index</span>
        <span class="legend-item"><span class="legend-dot dot-th"></span> Thumbs</span>
        <span class="legend-item"><span class="legend-dot dot-ri"></span> R. Index</span>
        <span class="legend-item"><span class="legend-dot dot-rm"></span> R. Middle</span>
        <span class="legend-item"><span class="legend-dot dot-rr"></span> R. Ring</span>
        <span class="legend-item"><span class="legend-dot dot-rp"></span> R. Pinky</span>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Highlights the expected target key for touch typing practice
   */
  setTargetKey(char) {
    if (!this.enabled || !this.container) return;

    // Clear previous target
    const prevTargets = this.container.querySelectorAll('.kb-key.target, .kb-key.shift-target');
    prevTargets.forEach(el => el.classList.remove('target', 'shift-target'));

    if (!char) return;

    const lower = char.toLowerCase();
    const isUpper = char !== lower && char.match(/[A-Z]/);
    const isSpecialShift = '~!@#$%^&*()_+{}|:"<>?'.includes(char);

    // If shift is needed, highlight appropriate Shift key
    if (isUpper || isSpecialShift) {
      // Determine which hand types the main key; use the OPPOSITE shift key
      const mainKeyEl = this.findKeyElement(char);
      const isLeftHand = mainKeyEl && (mainKeyEl.classList.contains('finger-lp') || mainKeyEl.classList.contains('finger-lr') || mainKeyEl.classList.contains('finger-lm') || mainKeyEl.classList.contains('finger-li'));

      const shiftSelector = isLeftHand ? '[data-code="ShiftRight"]' : '[data-code="ShiftLeft"]';
      const shiftEl = this.container.querySelector(shiftSelector);
      if (shiftEl) shiftEl.classList.add('shift-target');
    }

    // Highlight target letter / symbol
    const targetEl = this.findKeyElement(char);
    if (targetEl) {
      targetEl.classList.add('target');
    }
  }

  findKeyElement(char) {
    if (!this.container) return null;
    if (char === ' ') {
      return this.container.querySelector('[data-code="Space"]');
    }
    const lower = char.toLowerCase();
    // Search by data-key or data-shift
    let el = this.container.querySelector(`[data-key="${lower}"]`);
    if (!el) {
      el = this.container.querySelector(`[data-shift="${lower}"]`);
    }
    return el;
  }

  /**
   * Flash key on user press
   */
  highlightPressedKey(code) {
    if (!this.container) return;
    const el = this.container.querySelector(`[data-code="${code}"]`);
    if (el) {
      el.classList.add('active-press');
      setTimeout(() => el.classList.remove('active-press'), 120);
    }
  }

  toggle(visible) {
    this.enabled = visible;
    if (this.container) {
      this.container.style.display = visible ? 'block' : 'none';
    }
  }
}

window.virtualKeyboard = null;
document.addEventListener('DOMContentLoaded', () => {
  window.virtualKeyboard = new VirtualKeyboard('virtual-keyboard-container');
});

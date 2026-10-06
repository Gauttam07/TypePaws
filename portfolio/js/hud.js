/**
 * HARSH GAUTTAM PORTFOLIO HUD CONTROLLER
 * Includes: Telemetry Clock, Coordinates, Theme Switcher,
 * 3D Card Tilt (Gatsby-NetlifyCMS), Random Reveal Cypher, Huyml Live Preview Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  const audio = window.hudAudio;

  // =========================================================================
  // 1. INITIAL SYSTEM LOADER
  // =========================================================================
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderMeta = document.getElementById('loader-meta');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 16) + 12;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderMeta) loaderMeta.textContent = 'SYSTEMS NOMINAL // PORTFOLIO READY';

      setTimeout(() => {
        if (loader) loader.classList.add('loaded');
      }, 350);
    } else {
      if (loaderBar) loaderBar.style.width = `${loadProgress}%`;
      if (loaderMeta && loadProgress > 50) {
        loaderMeta.textContent = 'CALIBRATING HUD & 3D TILT SUBSYSTEMS...';
      }
    }
  }, 40);

  // =========================================================================
  // 2. LIVE TELEMETRY CLOCK (GMT + LOCAL TIME)
  // =========================================================================
  const clockElement = document.getElementById('hud-clock');
  function updateClock() {
    if (!clockElement) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const offsetMin = -now.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(offsetMin) / 60);
    const offsetRemainingMin = Math.abs(offsetMin) % 60;
    const tzStr = `GMT${sign}${offsetHours}${offsetRemainingMin > 0 ? ':' + String(offsetRemainingMin).padStart(2, '0') : ''}`;

    clockElement.textContent = `${tzStr} IST ${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // =========================================================================
  // 3. REAL-TIME MOUSE COORDINATES
  // =========================================================================
  const coordsElement = document.getElementById('hud-coords');
  window.addEventListener('pointermove', (e) => {
    if (!coordsElement) return;
    const x = String(e.clientX).padStart(4, '0');
    const y = String(e.clientY).padStart(4, '0');
    coordsElement.textContent = `${x} X ${y} Y`;
  }, { passive: true });

  // =========================================================================
  // 4. THEME TOGGLE (DARK [D] vs LIGHT [L])
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const themes = ['dark', 'light'];
  // Predefault opening theme: Dark theme
  let savedTheme = localStorage.getItem('hud_theme_mode');
  if (!savedTheme) {
    savedTheme = 'dark';
    localStorage.setItem('hud_theme_mode', 'dark');
    localStorage.setItem('hud_theme', 'dark');
  }

  if (savedTheme && themes.includes(savedTheme)) {
    currentThemeIdx = themes.indexOf(savedTheme);
  } else {
    currentThemeIdx = 0; // 0 = dark mode
  }

  function applyTheme(idx) {
    const theme = themes[idx];
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hud_theme_mode', theme);
    localStorage.setItem('hud_theme', theme);
    if (themeToggle) {
      themeToggle.querySelector('span').textContent = theme === 'dark' ? 'THEME[D]' : 'THEME[L]';
    }
  }
  applyTheme(currentThemeIdx);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      applyTheme(currentThemeIdx);
      if (audio) audio.playThemeShift();
    });
  }

  // =========================================================================
  // 5. SOUND TOGGLE (SOUND[|] vs SOUND[O])
  // =========================================================================
  const soundToggle = document.getElementById('sound-toggle');
  function updateSoundUI() {
    if (!soundToggle || !audio) return;
    const isEnabled = audio.isEnabled();
    soundToggle.querySelector('span').textContent = isEnabled ? 'SOUND[|]' : 'SOUND[O]';
    soundToggle.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
  }
  updateSoundUI();

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (audio) {
        audio.toggleSound();
        updateSoundUI();
      }
    });
  }

  // =========================================================================
  // 6. 3D CARD TILT EFFECT (From gatsby-netlifycms React Tilt)
  // =========================================================================
  const tiltCards = document.querySelectorAll('.project-tilt-card');
  tiltCards.forEach((card) => {
    let bounds;

    function onMouseEnter(e) {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease, border-color 0.25s ease';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width) - 0.5;
      const yPct = (mouseY / bounds.height) - 0.5;

      const maxTilt = 8; // degrees
      const rotX = -yPct * maxTilt;
      const rotY = xPct * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    }

    function onMouseLeave() {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.25s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });

  // =========================================================================
  // 7. RANDOM REVEAL CYPHER EFFECT (From gatsby-netlifycms React Random Reveal)
  // =========================================================================
  const cypherElements = document.querySelectorAll('[data-reveal]');
  cypherElements.forEach((el) => {
    const originalText = el.getAttribute('data-reveal') || el.textContent;
    const glyphs = '0123456789ABCDEF!@#$%&<>/';
    let isDecoding = false;

    function runDecode() {
      if (isDecoding) return;
      isDecoding = true;
      let step = 0;
      const maxSteps = 12;

      const interval = setInterval(() => {
        step++;
        if (audio) audio.playDecode();

        el.textContent = originalText
          .split('')
          .map((c, i) => {
            if (c === ' ') return ' ';
            if (step > i + 3) return c;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');

        if (step >= maxSteps + originalText.length) {
          clearInterval(interval);
          el.textContent = originalText;
          isDecoding = false;
        }
      }, 40);
    }

    el.addEventListener('mouseenter', runDecode);
  });

  // =========================================================================
  // 8. LIVE PREVIEW MODAL (TypePaws & Interactive Projects)
  // =========================================================================
  const previewModal = document.getElementById('live-preview-modal');
  const previewIframe = document.getElementById('preview-iframe');
  const previewTitle = document.getElementById('preview-title');
  const previewExternal = document.getElementById('preview-external');
  const previewClose = document.getElementById('preview-close');

  const previewButtons = document.querySelectorAll('[data-preview-url]');
  previewButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const url = btn.getAttribute('data-preview-url');
      const title = btn.getAttribute('data-preview-title') || 'LIVE PROJECT PREVIEW';

      if (previewModal && previewIframe) {
        previewIframe.src = url;
        if (previewTitle) previewTitle.textContent = title;
        if (previewExternal) previewExternal.href = url;
        previewModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (audio) audio.playClick();
      }
    });
  });

  if (previewClose) {
    previewClose.addEventListener('click', closePreview);
  }

  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) closePreview();
    });
  }

  function closePreview() {
    if (!previewModal) return;
    previewModal.classList.remove('open');
    if (previewIframe) previewIframe.src = '';
    document.body.style.overflow = '';
    if (audio) audio.playClick();
  }

  // =========================================================================
  // 8B. FLOATING CLOUD-SHAPED 3D-STYLE POPUP MODAL (Node Details)
  // =========================================================================
  const NODE_DETAILS = {
    'exp-bikaji': {
      title: 'Bikaji Foods International Ltd',
      subtitle: 'Forward Deployed Engineer // July – August 2024',
      badge: 'EXPERIENCE // AUTOMATION',
      whatItDoes: 'Empowers large-scale enterprise operations and workflow automation across business units using Microsoft Dynamics 365.',
      whatIBuilt: 'Automated Microsoft Dynamics 365 business workflows, improving operational efficiency by 25%. Validated workflows and system behavior, reducing manual-intervention errors by 18%. Collaborated with cross-functional teams to identify process issues, validate fixes, and improve reliability.',
      toolsUsed: ['Microsoft Dynamics 365', 'Workflow Automation', 'Validation Checks', 'Process Optimization', 'Cross-Functional Collaboration']
    },
    'exp-capgemini': {
      title: 'Capgemini',
      subtitle: 'Software Engineering Analyst Trainee // January – June 2026',
      badge: 'TRAINEE ROLE // SOFTWARE ENGINEERING',
      whatItDoes: 'Provided structured industry-aligned training in foundational software engineering principles, web development standards, and modern component architectures.',
      whatIBuilt: 'Completed software engineering and web technology training. Developed responsive pages and interface components using HTML, CSS, Bootstrap, and JavaScript. Used Git and GitHub collaboratively, debugged code, and gained exposure to React.js and component-based development.',
      toolsUsed: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'React.js (Exposure)', 'Git / GitHub', 'Debugging'],
      notice: '* Clearly labeled: Completed as a structured Software Engineering Analyst Trainee role.'
    },
    'exp-freelance': {
      title: 'Freelance Frontend Developer',
      subtitle: 'Self-Employed // Independent Frontend Work',
      badge: 'EXPERIENCE // INDEPENDENT WORK',
      whatItDoes: 'Provides custom frontend engineering, responsive interface development, and accessible web experiences for independent clients.',
      whatIBuilt: 'Built responsive web pages and components using semantic HTML, CSS, and modern JavaScript. Implemented cross-device layouts, structured mobile-first styles, and adhered strictly to validated frontend specifications.',
      toolsUsed: ['HTML5', 'CSS3', 'JavaScript', 'Vanilla JS', 'Responsive Web Design', 'Cross-Browser Standards', 'UI Architecture']
    },
    'proj-typepaws': {
      title: 'TypePaws™',
      subtitle: 'Flagship Frontend Web Application // 2025–2026',
      badge: 'FEATURED PROJECT',
      whatItDoes: 'A modern touch-typing practice web application combining structured typing pedagogy, real-time keystroke telemetry, and instant auditory feedback.',
      whatIBuilt: 'Engineered responsive typing practice interfaces, lesson progression states, live WPM/accuracy telemetry measuring zero-latency keystroke metrics, and interactive keyboard displays.',
      toolsUsed: ['Vanilla JS', 'HTML5', 'CSS3', 'Web Audio API', 'Canvas Telemetry', 'Local Storage'],
      previewUrl: 'https://gauttam07.github.io/TypePaws/',
      repoUrl: 'https://github.com/Gauttam07/TypePaws'
    },
    'proj-harmonic': {
      title: 'Harmonic Musical Web Application',
      subtitle: 'Frontend Audio & State Application',
      badge: 'WEB APPLICATION',
      whatItDoes: 'A responsive browser-based music streaming player allowing users to play tracks, organize custom playlists, and preserve playback settings across sessions.',
      whatIBuilt: 'Built a responsive music player interface with playlist management, local storage persistence for saved playlists and user audio preferences, and interactive playback controls (play, pause, skip, seek, volume).',
      toolsUsed: ['Vanilla JS', 'HTML', 'CSS', 'Web Audio APIs', 'Local Storage'],
      notice: '💡 AI Feature Concept: Mood-based playlist suggestions utilizing listener mood selection and track preferences. (Planned enhancement / concept only — not an implemented model, no training data or production claims).',
      repoUrl: 'https://github.com/Gauttam07'
    },
    'proj-banterbox': {
      title: 'BanterBox Real-Time Chat Application',
      subtitle: 'Full-Stack Real-Time Messaging System',
      badge: 'FULL-STACK PROJECT',
      whatItDoes: 'A full-stack communication platform providing real-time room messaging, user registration, and customized user profiles.',
      whatIBuilt: 'Developed real-time messaging, user authentication and onboarding flows, REST APIs, JWT-based login with secure cookie handling, MongoDB database models, and profile personalization with avatars and language preferences.',
      toolsUsed: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Cookies', 'REST APIs', 'Avatar Customization'],
      repoUrl: 'https://github.com/Gauttam07'
    },
    'proj-aiworkflow': {
      title: 'AI Workflow Testing & Validation System',
      subtitle: 'QA Automation & Verification Suite',
      badge: 'QA & TESTING',
      whatItDoes: 'An end-to-end testing and validation framework ensuring automated reliability, API schema compliance, and defect tracking across system workflows.',
      whatIBuilt: 'Created comprehensive end-to-end workflow test cases, automated functional and regression test suites, validated REST API request and response schemas using Postman, documented defect reports with clear reproduction steps, and verified code fixes alongside development teams.',
      toolsUsed: ['Python', 'Selenium', 'Postman', 'REST APIs', 'Test Case Design', 'Defect Tracking'],
      repoUrl: 'https://github.com/Gauttam07'
    },
    'proj-datapipeline': {
      title: 'Stock Market Real-Time Data Pipeline',
      subtitle: 'Cloud Data Ingestion & Storage Pipeline',
      badge: 'DATA ENGINEERING',
      whatItDoes: 'Ingests, validates, cleans, and stores high-frequency stock market time-series records into scalable cloud storage environments.',
      whatIBuilt: 'Built end-to-end data ingestion and processing workflows, implemented schema validation and automated data-cleaning routines, performed data-quality checks, established cloud storage pipelines using AWS S3 and EC2, and structured modular code with robust error handling.',
      toolsUsed: ['Python', 'SQL', 'AWS S3', 'AWS EC2', 'Schema Validation', 'Data Cleaning', 'Modular Architecture'],
      repoUrl: 'https://github.com/Gauttam07'
    },
    'proj-servicedesk': {
      title: 'Service Desk SLA & Data Quality Dashboard',
      subtitle: 'Data Analysis & KPI Monitoring Dashboard',
      badge: 'DATA ANALYSIS (EXCEL)',
      whatItDoes: 'Tracks service desk performance metrics, monitors SLA resolution compliance, and audits data quality across IT support ticket records.',
      whatIBuilt: 'Developed advanced spreadsheet formulas, data validation rules, data cleaning routines, SLA compliance calculations, KPI summary scorecards, and interactive visualization charts.',
      toolsUsed: ['Microsoft Excel', 'Advanced Formulas', 'Data Validation', 'SLA Calculations', 'KPI Summaries', 'Charts'],
      notice: '📊 Synthetic Dataset Notice: Explicitly built and analyzed using 250 synthetic ticket records for demonstration and data-validation purposes.',
      repoUrl: 'https://github.com/Gauttam07'
    }
  };

  const cloudModal = document.getElementById('cloud-detail-modal');
  const cloudBadge = document.getElementById('cloud-modal-badge');
  const cloudTitle = document.getElementById('cloud-modal-title');
  const cloudSubtitle = document.getElementById('cloud-modal-subtitle');
  const cloudWhatItDoes = document.getElementById('cloud-what-it-does');
  const cloudWhatIBuilt = document.getElementById('cloud-what-i-built');
  const cloudTools = document.getElementById('cloud-tools-list');
  const cloudNoticeBox = document.getElementById('cloud-notice-container');
  const cloudNoticeText = document.getElementById('cloud-notice-text');
  const cloudActions = document.getElementById('cloud-modal-actions');
  const cloudCloseBtn = document.getElementById('cloud-modal-close');

  function openCloudModal(nodeId) {
    const data = NODE_DETAILS[nodeId];
    if (!data || !cloudModal) return;

    if (cloudBadge) cloudBadge.textContent = data.badge;
    if (cloudTitle) cloudTitle.textContent = data.title;
    if (cloudSubtitle) cloudSubtitle.textContent = data.subtitle;
    if (cloudWhatItDoes) cloudWhatItDoes.textContent = data.whatItDoes;
    if (cloudWhatIBuilt) cloudWhatIBuilt.textContent = data.whatIBuilt;

    if (cloudTools) {
      cloudTools.innerHTML = data.toolsUsed
        .map((t) => `<span class="cloud-tool-pill">${t}</span>`)
        .join('');
    }

    if (cloudNoticeBox) {
      if (data.notice) {
        cloudNoticeBox.style.display = 'block';
        if (cloudNoticeText) cloudNoticeText.textContent = data.notice;
      } else {
        cloudNoticeBox.style.display = 'none';
      }
    }

    if (cloudActions) {
      let actionHtml = '';
      if (data.previewUrl) {
        actionHtml += `<button type="button" class="hud-btn hud-btn-primary" data-preview-url="${data.previewUrl}" data-preview-title="${data.title} Live Preview"><span>Launch Live Preview ↗</span></button>`;
        actionHtml += `<a href="${data.previewUrl}" target="_blank" rel="noopener noreferrer" class="hud-btn"><span>Open Direct Link ↗</span></a>`;
      }
      if (data.repoUrl) {
        actionHtml += `<a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="hud-btn"><span>View GitHub Repo ↗</span></a>`;
      }
      actionHtml += `<button type="button" class="hud-btn" id="cloud-action-close"><span>Done [✕]</span></button>`;
      cloudActions.innerHTML = actionHtml;

      const actionClose = document.getElementById('cloud-action-close');
      if (actionClose) actionClose.addEventListener('click', closeCloudModal);

      // Bind preview inside modal action if present
      const innerPreviewBtn = cloudActions.querySelector('[data-preview-url]');
      if (innerPreviewBtn) {
        innerPreviewBtn.addEventListener('click', (e) => {
          closeCloudModal();
          const url = innerPreviewBtn.getAttribute('data-preview-url');
          const title = innerPreviewBtn.getAttribute('data-preview-title');
          if (previewModal && previewIframe) {
            previewIframe.src = url;
            if (previewTitle) previewTitle.textContent = title;
            if (previewExternal) previewExternal.href = url;
            previewModal.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        });
      }
    }

    cloudModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (audio) audio.playClick();
  }

  function closeCloudModal() {
    if (!cloudModal) return;
    cloudModal.classList.remove('open');
    document.body.style.overflow = '';
    if (audio) audio.playClick();
  }

  // Bind interactive card nodes
  const interactiveNodes = document.querySelectorAll('[data-node-id]');
  interactiveNodes.forEach((node) => {
    const nodeId = node.getAttribute('data-node-id');
    node.addEventListener('click', (e) => {
      // If click was on an action link or button, let that action fire
      if (e.target.closest('a') || e.target.closest('button[data-preview-url]')) return;
      openCloudModal(nodeId);
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a') || e.target.closest('button[data-preview-url]')) return;
        e.preventDefault();
        openCloudModal(nodeId);
      }
    });
  });

  if (cloudCloseBtn) {
    cloudCloseBtn.addEventListener('click', closeCloudModal);
  }

  if (cloudModal) {
    cloudModal.addEventListener('click', (e) => {
      if (e.target === cloudModal) closeCloudModal();
    });
  }

  // Global Escape key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (previewModal && previewModal.classList.contains('open')) {
        closePreview();
      } else if (cloudModal && cloudModal.classList.contains('open')) {
        closeCloudModal();
      }
    }
  });

  // =========================================================================
  // 9. CLIPBOARD COPY TOAST (Email button)
  // =========================================================================
  const toast = document.getElementById('hud-toast');
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`COPIED TO CLIPBOARD: ${textToCopy}`);
        });
      }
    });
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  // =========================================================================
  // 10. INTERACTIVE BUTTON SOUND BINDINGS
  // =========================================================================
  const interactiveSelectors = 'button, a, .hud-btn, .project-tilt-card, .pillar-card, .exp-card';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (audio) audio.playHoverTick();
    });
    el.addEventListener('click', () => {
      if (audio) audio.playClick();
    });
  });

  // =========================================================================
  // 11. DISCREET TELEMETRY VISITOR COUNTER (Local Storage + Global Service)
  // =========================================================================
  function initVisitorTelemetry() {
    const counterElements = document.querySelectorAll('.visitor-count-val');
    if (!counterElements.length) return;

    // 1. Local Storage tracking per client browser
    let localCount = parseInt(localStorage.getItem('hud_site_views') || '0', 10);
    const sessionSeen = sessionStorage.getItem('hud_session_seen');
    if (!sessionSeen) {
      localCount += 1;
      localStorage.setItem('hud_site_views', String(localCount));
      sessionStorage.setItem('hud_session_seen', '1');
    }

    // 2. Read any cached global count
    const cachedGlobal = localStorage.getItem('hud_global_views');
    const initialDisplay = cachedGlobal ? parseInt(cachedGlobal, 10) : (localCount || 1);
    updateCounterDisplay(initialDisplay);

    // 3. Fetch live global visitor count (cross-user counter for GitHub Pages)
    const pageId = 'harshgauttam.portfolio';
    const endpoint = `https://visitor-badge.laobi.icu/badge?page_id=${encodeURIComponent(pageId)}&_t=${Date.now()}`;

    fetch(endpoint, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Bad response');
        return res.text();
      })
      .then((svgText) => {
        const match = svgText.match(/<text[^>]*>(\d+)<\/text>\s*(?:<a|<\/g>)/);
        if (match && match[1]) {
          const liveCount = parseInt(match[1], 10);
          localStorage.setItem('hud_global_views', String(liveCount));
          updateCounterDisplay(liveCount);
        }
      })
      .catch(() => {
        // Fallback to local storage if offline
        const fallback = cachedGlobal ? parseInt(cachedGlobal, 10) : (localCount || 1);
        updateCounterDisplay(fallback);
      });

    function updateCounterDisplay(num) {
      if (!num || isNaN(num)) return;
      const formatted = num >= 1000 ? num.toLocaleString() : String(num);
      counterElements.forEach((el) => {
        el.textContent = formatted;
      });
    }
  }
  initVisitorTelemetry();
});

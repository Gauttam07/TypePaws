/**
 * TypePaws - Main Application Controller
 * Coordinates the typing engine, learning paths, live statistics, navigation,
 * animations, results screen, and user interactions.
 */

class TypePawsApp {
  constructor() {
    this.currentView = 'dashboard'; // 'dashboard' | 'practice' | 'lessons'
    this.currentLevelKey = 'beginner';
    this.currentSectionFilter = 'all'; // 'all' | 1 | 2 | 3 | 4 | 5
    this.currentLesson = null;
    
    // Typing Engine State
    this.lessonText = "";
    this.currentIndex = 0;
    this.correctChars = 0;
    this.totalKeystrokes = 0;
    this.errorCount = 0;
    this.isPracticing = false;
    this.isPaused = false;
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.targetDuration = 0; // 0 = passage completion, or 15, 30, 60 seconds
    this.wpmHistory = [];

    this.init();
  }

  init() {
    // Sync settings & theme
    const settings = window.storageManager.getSettings();
    if (settings.darkMode) {
      document.body.classList.add('dark-theme');
    }
    if (window.soundEngine) {
      window.soundEngine.setMuted(settings.soundMuted);
      window.soundEngine.setVolume(settings.volume);
      window.soundEngine.setTheme(settings.soundTheme);
    }

    this.currentLevelKey = window.storageManager.getCurrentLevel();

    this.bindEvents();
    this.updateHeaderLevelBadge();
    this.updateAuthUI();
    this.renderDashboard();

    // Check first-time onboarding
    if (!window.storageManager.data.hasChosenInitialLevel) {
      this.showLevelSelectionModal(true);
    }
  }

  bindEvents() {
    // Navigation items
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        if (view) this.switchView(view);
      });
    });

    // Auth trigger button
    const authNavBtn = document.getElementById('auth-nav-btn');
    if (authNavBtn) {
      authNavBtn.addEventListener('click', () => this.openAuthModal('signup', false));
    }

    // User profile dropdown toggle
    const userPillBtn = document.getElementById('user-pill-btn');
    const userDropdown = document.getElementById('user-dropdown-card');
    if (userPillBtn && userDropdown) {
      userPillBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
      });
      document.addEventListener('click', () => {
        userDropdown.classList.remove('open');
      });
    }

    const btnDropdownProfile = document.getElementById('btn-dropdown-profile');
    if (btnDropdownProfile) {
      btnDropdownProfile.addEventListener('click', () => {
        this.switchView('dashboard');
        if (userDropdown) userDropdown.classList.remove('open');
      });
    }

    const btnDropdownReset = document.getElementById('btn-dropdown-reset');
    if (btnDropdownReset) {
      btnDropdownReset.addEventListener('click', () => this.resetAllToZero());
    }

    const btnDropdownLogout = document.getElementById('btn-dropdown-logout');
    if (btnDropdownLogout) {
      btnDropdownLogout.addEventListener('click', () => this.handleLogout());
    }

    // Auth modal tabs
    const tabSignup = document.getElementById('tab-btn-signup');
    const tabLogin = document.getElementById('tab-btn-login');
    const formSignup = document.getElementById('form-signup');
    const formLogin = document.getElementById('form-login');

    if (tabSignup && tabLogin && formSignup && formLogin) {
      tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        formSignup.style.display = 'block';
        formLogin.style.display = 'none';
      });
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        formLogin.style.display = 'block';
        formSignup.style.display = 'none';
      });
    }

    // Mascot Avatar selection options
    document.querySelectorAll('.avatar-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    // Quick demo login button
    const demoBtn = document.getElementById('btn-quick-demo-login');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const idInput = document.getElementById('login-identifier');
        const pwInput = document.getElementById('login-password');
        if (idInput) idInput.value = 'demo';
        if (pwInput) pwInput.value = 'password';
        this.handleLogIn();
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Audio toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => this.toggleAudio());
    }

    // Level selector trigger in header
    const levelBadge = document.getElementById('current-level-badge');
    if (levelBadge) {
      levelBadge.addEventListener('click', () => this.showLevelSelectionModal(false));
    }

    // Settings modal triggers
    const settingsBtn = document.getElementById('settings-nav-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openModal('settings-modal'));
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          this.closeAllModals();
        }
      });
    });

    // Practice Arena Input Handler
    const inputArea = document.getElementById('typing-hidden-input');
    const arenaBox = document.getElementById('typing-arena-box');

    if (arenaBox && inputArea) {
      arenaBox.addEventListener('click', () => {
        inputArea.focus();
      });
    }

    if (inputArea) {
      inputArea.addEventListener('input', (e) => this.handleInput(e));
      inputArea.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Arena Controls
    const restartBtn = document.getElementById('practice-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartPractice());
    }

    const nextBtn = document.getElementById('practice-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.startNextLesson());
    }

    const keyboardToggleBtn = document.getElementById('toggle-keyboard-hints');
    if (keyboardToggleBtn) {
      keyboardToggleBtn.addEventListener('click', () => this.toggleVirtualKeyboard());
    }

    // Results Modal actions
    const resNextBtn = document.getElementById('results-next-btn');
    if (resNextBtn) resNextBtn.addEventListener('click', () => {
      this.closeModal('results-modal');
      this.startNextLesson();
    });

    const resRetryBtn = document.getElementById('results-retry-btn');
    if (resRetryBtn) resRetryBtn.addEventListener('click', () => {
      this.closeModal('results-modal');
      this.restartPractice();
    });

    const resLessonsBtn = document.getElementById('results-lessons-btn');
    if (resLessonsBtn) resLessonsBtn.addEventListener('click', () => {
      this.closeModal('results-modal');
      this.switchView('lessons');
    });

    const resShareBtn = document.getElementById('results-share-btn');
    if (resShareBtn) resShareBtn.addEventListener('click', () => this.shareResults());

    // Global keyboard shortcut: Tab to restart, Esc to pause, auto-focus input in practice mode
    window.addEventListener('keydown', (e) => {
      // If user is in practice view and not focused on input/select/modal, redirect focus to hidden input
      if (this.currentView === 'practice') {
        const activeModal = document.querySelector('.modal-overlay.open');
        const isFormField = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if (!activeModal && !isFormField && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          const inputArea = document.getElementById('typing-hidden-input');
          if (inputArea) {
            inputArea.focus();
          }
        }
      }

      if (e.key === 'Tab' && this.currentView === 'practice') {
        e.preventDefault();
        this.restartPractice();
      }
    });

    // Mobile nav hamburger
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinksContainer) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
      });
    }

    // Settings form listeners
    this.bindSettingsEvents();
  }

  bindSettingsEvents() {
    const soundThemeSelect = document.getElementById('setting-sound-theme');
    if (soundThemeSelect) {
      soundThemeSelect.value = window.storageManager.data.settings.soundTheme;
      soundThemeSelect.addEventListener('change', (e) => {
        window.soundEngine.setTheme(e.target.value);
        window.storageManager.updateSettings({ soundTheme: e.target.value });
      });
    }

    const mascotSkinSelect = document.getElementById('setting-mascot-skin');
    if (mascotSkinSelect) {
      mascotSkinSelect.value = window.storageManager.data.settings.mascotSkin;
      mascotSkinSelect.addEventListener('change', (e) => {
        if (window.mascot) window.mascot.setSkin(e.target.value);
        window.storageManager.updateSettings({ mascotSkin: e.target.value });
      });
    }

    const volumeSlider = document.getElementById('setting-volume');
    if (volumeSlider) {
      volumeSlider.value = window.storageManager.data.settings.volume * 100;
      volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        window.soundEngine.setVolume(val);
        window.storageManager.updateSettings({ volume: val });
      });
    }

    const timerSelect = document.getElementById('setting-timer-mode');
    if (timerSelect) {
      timerSelect.value = window.storageManager.data.settings.timerMode;
      timerSelect.addEventListener('change', (e) => {
        window.storageManager.updateSettings({ timerMode: e.target.value });
      });
    }

    const resetBtn = document.getElementById('btn-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetAllToZero();
      });
    }
  }

  // --- VIEW SWITCHING ---
  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav button
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Close mobile menu if open
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) navLinksContainer.classList.remove('open');

    // Switch view containers
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) targetSec.classList.add('active');

    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'lessons') {
      this.renderLessonsView();
    } else if (viewName === 'practice') {
      if (!this.currentLesson) {
        // Resume where left off
        const nextNum = window.storageManager.data.lastLesson[this.currentLevelKey] || 1;
        this.loadLessonByNumber(this.currentLevelKey, nextNum);
      }
      setTimeout(() => {
        const inputArea = document.getElementById('typing-hidden-input');
        if (inputArea) inputArea.focus();
      }, 100);
    }
  }

  // --- LEVEL SELECTION MODAL ---
  showLevelSelectionModal(isOnboarding = false) {
    const modal = document.getElementById('level-selection-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('level-modal-title');
    if (modalTitle) {
      modalTitle.innerText = isOnboarding
        ? "Welcome to TypePaws! Choose Your Path"
        : "Switch Your Typing Path";
    }

    // Populate paths list with interactive cards
    const container = document.getElementById('level-selection-cards');
    if (container) {
      const levels = [
        {
          key: 'beginner',
          title: 'Beginner: Kitten Steps',
          tag: 'Home Row to Flow',
          wpm: '0 - 30 WPM',
          desc: 'Perfect for starters! Master anchor keys ASDF & JKL;, top and bottom rows, capital letters, and first smooth sentences.',
          icon: '🐾',
          badge: 'Most Popular',
          color: 'var(--color-primary)'
        },
        {
          key: 'intermediate',
          title: 'Intermediate: Cattitude Cruise',
          tag: 'Speed, Digraphs & Numbers',
          wpm: '30 - 60 WPM',
          desc: 'For typists ready to accelerate! Conquer punctuation, quotation marks, common word clusters (-tion, -ment), numbers, and real-world stories.',
          icon: '⚡',
          badge: 'Rhythm Builder',
          color: 'var(--color-secondary)'
        },
        {
          key: 'advanced',
          title: 'Advanced: Sonic Claws',
          tag: 'Fluent Touch Typing',
          wpm: '60 - 100+ WPM',
          desc: 'Touch-type without glancing at keys! Master tricky finger gymnastics, code syntax & symbols, tongue twisters, and speed marathons.',
          icon: '🔥',
          badge: 'Blind Touch Master',
          color: 'var(--color-accent)'
        }
      ];

      container.innerHTML = levels.map(lvl => {
        const isCurrent = this.currentLevelKey === lvl.key;
        const stats = window.storageManager.getLevelStats(lvl.key);
        return `
          <div class="level-select-card ${isCurrent ? 'selected' : ''}" data-level="${lvl.key}">
            <div class="level-card-header">
              <span class="level-card-icon">${lvl.icon}</span>
              <span class="level-card-badge">${lvl.badge}</span>
            </div>
            <h3 class="level-card-title">${lvl.title}</h3>
            <div class="level-card-wpm">Target: ${lvl.wpm}</div>
            <p class="level-card-desc">${lvl.desc}</p>
            <div class="level-card-progress-bar">
              <div class="progress-fill" style="width: ${stats.percent}%;"></div>
            </div>
            <div class="level-card-footer">
              <span class="progress-text">${stats.completedCount} / 100 Lessons</span>
              <button class="btn btn-sm ${isCurrent ? 'btn-outline' : 'btn-primary'} btn-choose-level">
                ${isCurrent ? 'Current Path' : 'Select Path'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.level-select-card').forEach(card => {
        card.addEventListener('click', () => {
          const selectedKey = card.dataset.level;
          this.selectLevel(selectedKey);
          this.closeModal('level-selection-modal');
        });
      });
    }

    this.openModal('level-selection-modal');
  }

  selectLevel(levelKey) {
    this.currentLevelKey = levelKey;
    window.storageManager.setCurrentLevel(levelKey);
    this.updateHeaderLevelBadge();
    
    // If on lessons view, reload
    if (this.currentView === 'lessons') {
      this.renderLessonsView();
    } else {
      this.renderDashboard();
    }
  }

  updateHeaderLevelBadge() {
    const badge = document.getElementById('current-level-badge');
    if (!badge) return;
    const info = window.LESSONS_DATA[this.currentLevelKey];
    if (info) {
      badge.innerHTML = `<span class="badge-icon">${info.icon}</span> <span class="badge-label">${info.name.split(':')[0]}</span> <span class="badge-chevron">▾</span>`;
    }
  }

  // --- DASHBOARD VIEW ---
  renderDashboard() {
    const levelInfo = window.LESSONS_DATA[this.currentLevelKey];
    const levelStats = window.storageManager.getLevelStats(this.currentLevelKey);
    const globalStats = window.storageManager.data.stats;

    // Hero Continue Card
    const heroTitle = document.getElementById('dash-hero-title');
    const heroSubtitle = document.getElementById('dash-hero-subtitle');
    const heroProgressText = document.getElementById('dash-hero-progress-text');
    const heroProgressBar = document.getElementById('dash-hero-progress-bar');
    const resumeBtn = document.getElementById('dash-resume-btn');

    const nextLessonNum = levelStats.nextLessonNum;
    const nextLesson = levelInfo.lessons.find(l => l.number === nextLessonNum) || levelInfo.lessons[0];

    if (heroTitle) heroTitle.innerText = `Welcome to ${levelInfo.name}`;
    if (heroSubtitle) heroSubtitle.innerText = levelInfo.subtitle;
    if (heroProgressText) heroProgressText.innerText = `${levelStats.completedCount} of 100 Practice Lessons Completed (${levelStats.percent}%)`;
    if (heroProgressBar) heroProgressBar.style.width = `${levelStats.percent}%`;

    if (resumeBtn) {
      resumeBtn.innerHTML = `<span>▶</span> Resume Lesson #${nextLesson.number}: ${nextLesson.title}`;
      resumeBtn.onclick = () => {
        this.startLesson(nextLesson);
      };
    }

    // Quick Stats Cards
    const avgWpmEl = document.getElementById('stat-avg-wpm');
    const topWpmEl = document.getElementById('stat-top-wpm');
    const testsCountEl = document.getElementById('stat-tests-completed');
    const streakEl = document.getElementById('stat-streak-days');
    const timeEl = document.getElementById('stat-total-time');

    if (avgWpmEl) avgWpmEl.innerText = globalStats.averageWpm || '--';
    if (topWpmEl) topWpmEl.innerText = globalStats.topWpm || '--';
    if (testsCountEl) testsCountEl.innerText = globalStats.testsCompleted;
    if (streakEl) streakEl.innerText = globalStats.streakDays > 0 ? `${globalStats.streakDays} Days 🔥` : '0 Days';
    if (timeEl) {
      const mins = Math.floor(globalStats.totalTimeSeconds / 60);
      timeEl.innerText = mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} mins`;
    }

    // Render Canvas Chart
    setTimeout(() => {
      if (window.performanceChart) {
        window.performanceChart.render(window.storageManager.data.recentTests);
      }
    }, 50);

    // Badges Showcase
    const badgesContainer = document.getElementById('dash-badges-grid');
    if (badgesContainer) {
      badgesContainer.innerHTML = window.storageManager.data.badges.map(b => `
        <div class="badge-card ${b.unlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon-wrap">${b.icon}</div>
          <div class="badge-info">
            <h4 class="badge-name">${b.name}</h4>
            <p class="badge-desc">${b.desc}</p>
            <span class="badge-status">${b.unlocked ? `Unlocked (${b.date})` : 'Locked'}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // --- LESSONS VIEW (100 numbered practice lessons per level) ---
  renderLessonsView() {
    const levelInfo = window.LESSONS_DATA[this.currentLevelKey];
    const completedMap = window.storageManager.getCompletedLessons();

    // Section title & desc
    const titleEl = document.getElementById('lessons-level-title');
    const descEl = document.getElementById('lessons-level-desc');
    if (titleEl) titleEl.innerText = `${levelInfo.icon} ${levelInfo.name}`;
    if (descEl) descEl.innerText = `${levelInfo.subtitle} • 100 Progressive Practice Lessons across 5 Curated Sections`;

    // Filter bar
    const filterContainer = document.getElementById('lessons-section-filters');
    if (filterContainer) {
      const filters = [
        { id: 'all', title: 'All 100 Lessons' },
        ...levelInfo.sections.map(s => ({ id: s.id, title: `${s.title.split(':')[0]} (${s.range})` }))
      ];

      filterContainer.innerHTML = filters.map(f => `
        <button class="filter-tab ${this.currentSectionFilter === f.id ? 'active' : ''}" data-section="${f.id}">
          ${f.title}
        </button>
      `).join('');

      filterContainer.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const sec = btn.dataset.section === 'all' ? 'all' : parseInt(btn.dataset.section);
          this.currentSectionFilter = sec;
          this.renderLessonsView();
        });
      });
    }

    // Filter lessons
    let filtered = levelInfo.lessons;
    if (this.currentSectionFilter !== 'all') {
      filtered = levelInfo.lessons.filter(l => l.sectionId === this.currentSectionFilter);
    }

    // Grid of Lessons
    const grid = document.getElementById('lessons-grid');
    if (grid) {
      grid.innerHTML = filtered.map(lesson => {
        const progress = completedMap[lesson.id];
        const isDone = !!progress;
        const starsHtml = isDone
          ? '★'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars)
          : '☆☆☆';

        return `
          <div class="lesson-card ${isDone ? 'completed' : ''}" data-lesson-id="${lesson.id}">
            <div class="lesson-card-top">
              <span class="lesson-number">#${lesson.number}</span>
              <span class="lesson-diff-tag diff-${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
            </div>
            <h4 class="lesson-title">${lesson.title}</h4>
            <div class="lesson-focus">Focus: <code>${lesson.focus}</code></div>
            <p class="lesson-snippet">"${lesson.text.substring(0, 48)}..."</p>
            <div class="lesson-card-footer">
              <div class="lesson-stars ${isDone ? 'active' : ''}">${starsHtml}</div>
              <div class="lesson-best-wpm">${isDone ? `${progress.bestWpm} WPM` : `Target: ${lesson.targetWpm} WPM`}</div>
              <button class="btn btn-sm ${isDone ? 'btn-outline' : 'btn-primary'} btn-start-lesson">
                ${isDone ? 'Practice Again' : 'Start'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.lesson-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const id = card.dataset.lessonId;
          const lessonObj = levelInfo.lessons.find(l => l.id === id);
          if (lessonObj) {
            this.startLesson(lessonObj);
          }
        });
      });
    }
  }

  // --- PRACTICE ARENA ENGINE ---
  startLesson(lesson) {
    this.currentLesson = lesson;
    this.lessonText = lesson.text;
    this.currentIndex = 0;
    this.correctChars = 0;
    this.totalKeystrokes = 0;
    this.errorCount = 0;
    this.isPracticing = false;
    this.isPaused = false;
    this.elapsedSeconds = 0;
    this.startTime = null;
    this.wpmHistory = [];
    clearInterval(this.timerInterval);

    // Apply timer mode from settings if any
    const settingsTimer = window.storageManager.data.settings.timerMode;
    if (settingsTimer === '15' || settingsTimer === '30' || settingsTimer === '60') {
      this.targetDuration = parseInt(settingsTimer);
    } else {
      this.targetDuration = 0; // passage completion
    }

    // Switch to practice view
    this.switchView('practice');

    // Update practice headers
    const badgeEl = document.getElementById('practice-lesson-badge');
    const titleEl = document.getElementById('practice-lesson-title');
    const focusEl = document.getElementById('practice-lesson-focus');
    const descEl = document.getElementById('practice-lesson-desc');

    if (badgeEl) badgeEl.innerText = `${window.LESSONS_DATA[this.currentLevelKey].name.split(':')[0]} • Lesson #${lesson.number}`;
    if (titleEl) titleEl.innerText = lesson.title;
    if (focusEl) focusEl.innerText = `Focus: ${lesson.focus}`;
    if (descEl) descEl.innerText = lesson.description;

    // Reset stats UI
    this.updateStatsDisplay(0, 100, 0, 0, 0);

    // Render characters
    this.renderTextSpans();

    // Reset mascot state
    if (window.mascot) {
      window.mascot.onIdle();
      window.mascot.updateBubble("Ready when you are! Start typing anytime 🐾", false);
    }

    // Highlight initial key on virtual keyboard
    if (window.virtualKeyboard && this.lessonText.length > 0) {
      window.virtualKeyboard.setTargetKey(this.lessonText[0]);
    }

    // Focus input
    const inputArea = document.getElementById('typing-hidden-input');
    if (inputArea) {
      inputArea.value = "";
      inputArea.focus();
    }
  }

  loadLessonByNumber(levelKey, num) {
    const list = window.LESSONS_DATA[levelKey].lessons;
    const lesson = list.find(l => l.number === num) || list[0];
    this.startLesson(lesson);
  }

  renderTextSpans() {
    const container = document.getElementById('sample-text-display');
    if (!container) return;

    let html = "";
    for (let i = 0; i < this.lessonText.length; i++) {
      const char = this.lessonText[i];
      const displayChar = char === ' ' ? ' ' : char;
      const spaceClass = char === ' ' ? 'char-space' : '';
      const currentClass = i === 0 ? 'current' : '';
      html += `<span class="char-span ${spaceClass} ${currentClass}" data-index="${i}">${displayChar}</span>`;
    }
    container.innerHTML = html;

    // Caret element
    const caret = document.createElement('div');
    caret.className = 'typing-caret';
    caret.id = 'typing-caret';
    container.appendChild(caret);

    this.positionCaret();
  }

  positionCaret() {
    const container = document.getElementById('sample-text-display');
    const caret = document.getElementById('typing-caret');
    if (!container || !caret) return;

    const currentChar = container.querySelector(`.char-span[data-index="${this.currentIndex}"]`);
    if (currentChar) {
      const parentRect = container.getBoundingClientRect();
      const charRect = currentChar.getBoundingClientRect();
      const left = charRect.left - parentRect.left;
      const top = charRect.top - parentRect.top;
      caret.style.transform = `translate(${left}px, ${top}px)`;
      caret.style.height = `${charRect.height}px`;
      caret.style.display = 'block';
    } else {
      // End of text
      caret.style.display = 'none';
    }
  }

  startTimer() {
    this.isPracticing = true;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;

      // Check countdown timer mode
      if (this.targetDuration > 0 && this.elapsedSeconds >= this.targetDuration) {
        this.finishPractice();
        return;
      }

      this.recalculateStats();
    }, 1000);
  }

  handleKeyDown(e) {
    if (['Alt', 'Control', 'Meta', 'Shift', 'CapsLock', 'Tab'].includes(e.key)) {
      return; // Ignore modifiers
    }

    if (!this.isPracticing && !this.isPaused) {
      this.startTimer();
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      this.handleBackspace();
      return;
    }

    // Process character keystroke
    if (e.key.length === 1) {
      e.preventDefault();
      this.processChar(e.key);
    }
  }

  handleInput(e) {
    // Fallback for mobile virtual keyboards where e.data is populated
    if (e.data && e.data.length > 0) {
      const char = e.data[e.data.length - 1];
      if (!this.isPracticing) this.startTimer();
      this.processChar(char);
      e.target.value = "";
    }
  }

  processChar(typedChar) {
    if (this.currentIndex >= this.lessonText.length) return;

    this.totalKeystrokes++;
    const expectedChar = this.lessonText[this.currentIndex];
    const container = document.getElementById('sample-text-display');
    const span = container ? container.querySelector(`.char-span[data-index="${this.currentIndex}"]`) : null;

    if (typedChar === expectedChar) {
      // Correct!
      this.correctChars++;
      if (span) {
        span.classList.remove('current', 'incorrect');
        span.classList.add('correct');
      }

      // Audio feedback
      if (window.soundEngine) {
        window.soundEngine.playKeyClick(typedChar);
      }

      // Mascot reaction
      const currentWpm = this.calculateCurrentWpm();
      if (window.mascot) {
        window.mascot.onKeystroke(currentWpm);
      }

      // Virtual keyboard pressed ripple
      if (window.virtualKeyboard) {
        window.virtualKeyboard.highlightPressedKey(this.getKeyboardCode(typedChar));
      }

      this.currentIndex++;

      // Check completion
      if (this.currentIndex >= this.lessonText.length) {
        this.finishPractice();
        return;
      }

      // Highlight next target key
      if (window.virtualKeyboard && this.currentIndex < this.lessonText.length) {
        window.virtualKeyboard.setTargetKey(this.lessonText[this.currentIndex]);
      }
    } else {
      // Wrong Key Pressed!
      this.errorCount++;
      if (span) {
        span.classList.remove('current');
        span.classList.add('incorrect', 'shake-char');
        setTimeout(() => span.classList.remove('shake-char'), 300);
      }

      // Sound: cartoon boop
      if (window.soundEngine) {
        window.soundEngine.playError();
      }

      // Mascot cartoon reaction!
      if (window.mascot) {
        window.mascot.onError(expectedChar);
      }

      // Move forward anyway so practice does not stall
      this.currentIndex++;

      if (this.currentIndex >= this.lessonText.length) {
        this.finishPractice();
        return;
      }

      if (window.virtualKeyboard && this.currentIndex < this.lessonText.length) {
        window.virtualKeyboard.setTargetKey(this.lessonText[this.currentIndex]);
      }
    }

    // Update active cursor span
    const nextSpan = container ? container.querySelector(`.char-span[data-index="${this.currentIndex}"]`) : null;
    if (nextSpan) nextSpan.classList.add('current');

    this.positionCaret();
    this.recalculateStats();
  }

  handleBackspace() {
    if (this.currentIndex > 0) {
      const container = document.getElementById('sample-text-display');
      
      // Remove current highlight from old index
      const curSpan = container ? container.querySelector(`.char-span[data-index="${this.currentIndex}"]`) : null;
      if (curSpan) curSpan.classList.remove('current');

      this.currentIndex--;

      const prevSpan = container ? container.querySelector(`.char-span[data-index="${this.currentIndex}"]`) : null;
      if (prevSpan) {
        if (prevSpan.classList.contains('correct')) {
          this.correctChars = Math.max(0, this.correctChars - 1);
        }
        prevSpan.classList.remove('correct', 'incorrect');
        prevSpan.classList.add('current');
      }

      this.positionCaret();

      if (window.virtualKeyboard) {
        window.virtualKeyboard.setTargetKey(this.lessonText[this.currentIndex]);
      }

      this.recalculateStats();
    }
  }

  calculateCurrentWpm() {
    if (this.elapsedSeconds === 0) return 0;
    const words = this.correctChars / 5;
    const minutes = this.elapsedSeconds / 60;
    return Math.round(words / minutes);
  }

  recalculateStats() {
    const wpm = this.calculateCurrentWpm();
    const accuracy = this.totalKeystrokes === 0
      ? 100
      : Math.max(0, Math.round((this.correctChars / this.totalKeystrokes) * 100));

    const progressPercent = Math.min(100, Math.round((this.currentIndex / this.lessonText.length) * 100));

    this.updateStatsDisplay(wpm, accuracy, this.elapsedSeconds, this.errorCount, progressPercent);
  }

  updateStatsDisplay(wpm, accuracy, timeSeconds, errors, progressPercent) {
    const wpmEl = document.getElementById('live-stat-wpm');
    const accEl = document.getElementById('live-stat-acc');
    const timeEl = document.getElementById('live-stat-time');
    const errEl = document.getElementById('live-stat-errors');
    const barEl = document.getElementById('practice-progress-bar');
    const pctEl = document.getElementById('practice-progress-pct');

    if (wpmEl) wpmEl.innerText = wpm;
    if (accEl) accEl.innerText = `${accuracy}%`;
    if (timeEl) {
      if (this.targetDuration > 0) {
        const remaining = Math.max(0, this.targetDuration - timeSeconds);
        timeEl.innerText = `${remaining}s`;
      } else {
        const mins = Math.floor(timeSeconds / 60);
        const secs = timeSeconds % 60;
        timeEl.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }
    if (errEl) errEl.innerText = errors;
    if (barEl) barEl.style.width = `${progressPercent}%`;
    if (pctEl) pctEl.innerText = `${progressPercent}%`;
  }

  finishPractice() {
    clearInterval(this.timerInterval);
    this.isPracticing = false;

    const timeSpent = Math.max(1, this.elapsedSeconds);
    const finalWpm = Math.round((this.correctChars / 5) / (timeSpent / 60));
    const finalAccuracy = this.totalKeystrokes === 0
      ? 100
      : Math.max(0, Math.round((this.correctChars / this.totalKeystrokes) * 100));

    const result = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      timeSeconds: timeSpent,
      errors: this.errorCount,
      completed: true
    };

    // Audio & Mascot celebration
    if (window.soundEngine) window.soundEngine.playVictory();
    if (window.mascot) window.mascot.onCelebrate(finalWpm, finalAccuracy);

    // Save result to persistence
    window.storageManager.recordLessonResult(this.currentLesson, result);

    // Launch celebratory confetti burst
    this.launchConfetti();

    // Check if user completed 10 lessons as guest -> trigger sign up / login milestone modal!
    const isTenthLesson = window.storageManager.shouldPromptAuth();

    // Show Results Modal
    setTimeout(() => {
      this.showResultsModal(result);

      if (isTenthLesson) {
        setTimeout(() => {
          this.closeModal('results-modal');
          this.openAuthModal('signup', true);
        }, 1800);
      }
    }, 600);
  }

  showResultsModal(result) {
    const lesson = this.currentLesson;

    // Stars
    let stars = 1;
    let verdict = "Good effort! Practice makes paws swift!";
    let grade = "B";

    if (result.accuracy >= 97 && result.wpm >= (lesson.targetWpm || 25)) {
      stars = 3;
      verdict = "Purr-fect touch typing master! Barnaby is singing!";
      grade = "S";
    } else if (result.accuracy >= 92) {
      stars = 2;
      verdict = "Great pace and solid control! Keep the rhythm going!";
      grade = "A";
    }

    const modalStars = document.getElementById('results-stars');
    const modalWpm = document.getElementById('results-wpm');
    const modalAcc = document.getElementById('results-accuracy');
    const modalTime = document.getElementById('results-time');
    const modalErrors = document.getElementById('results-errors');
    const modalGrade = document.getElementById('results-grade-badge');
    const modalVerdict = document.getElementById('results-mascot-verdict');
    const modalLessonName = document.getElementById('results-lesson-name');

    if (modalStars) modalStars.innerHTML = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    if (modalWpm) modalWpm.innerText = result.wpm;
    if (modalAcc) modalAcc.innerText = `${result.accuracy}%`;
    if (modalTime) modalTime.innerText = `${result.timeSeconds}s`;
    if (modalErrors) modalErrors.innerText = result.errors;
    if (modalGrade) modalGrade.innerText = `Grade ${grade}`;
    if (modalVerdict) modalVerdict.innerText = `"${verdict}"`;
    if (modalLessonName) modalLessonName.innerText = `Lesson #${lesson.number}: ${lesson.title}`;

    this.openModal('results-modal');
  }

  startNextLesson() {
    const curNum = this.currentLesson ? this.currentLesson.number : 1;
    if (curNum < 100) {
      this.loadLessonByNumber(this.currentLevelKey, curNum + 1);
    } else {
      alert("Congratulations! You have completed all 100 lessons in this path! You can practice any lesson or switch to the next level!");
      this.switchView('lessons');
    }
  }

  restartPractice() {
    if (this.currentLesson) {
      this.startLesson(this.currentLesson);
    }
  }

  shareResults() {
    const lesson = this.currentLesson;
    const wpmEl = document.getElementById('results-wpm');
    const accEl = document.getElementById('results-accuracy');
    const wpm = wpmEl ? wpmEl.innerText : 40;
    const acc = accEl ? accEl.innerText : '98%';

    const text = `🐾 I just scored ${wpm} WPM with ${acc} accuracy on TypePaws (${lesson.title})! 🐱✨ Practice touch-typing with cute cartoon paws!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Results copied to clipboard! Share with your friends!");
      });
    } else {
      prompt("Copy your typing score:", text);
    }
  }

  toggleVirtualKeyboard() {
    const kbContainer = document.getElementById('virtual-keyboard-container');
    const btn = document.getElementById('toggle-keyboard-hints');
    if (!kbContainer) return;

    const isHidden = kbContainer.style.display === 'none';
    kbContainer.style.display = isHidden ? 'block' : 'none';
    if (btn) {
      btn.classList.toggle('active', isHidden);
      btn.innerText = isHidden ? '⌨ Hide Keyboard' : '⌨ Show Keyboard';
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    window.storageManager.updateSettings({ darkMode: isDark });

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.innerHTML = isDark ? '☀️' : '🌙';

    if (window.performanceChart) {
      window.performanceChart.render(window.storageManager.data.recentTests);
    }
  }

  toggleAudio() {
    const settings = window.storageManager.getSettings();
    const newMuted = !settings.soundMuted;
    window.storageManager.updateSettings({ soundMuted: newMuted });
    if (window.soundEngine) window.soundEngine.setMuted(newMuted);

    const btn = document.getElementById('audio-toggle-btn');
    if (btn) btn.innerHTML = newMuted ? '🔇' : '🔔';
  }

  // --- MODAL UTILITIES ---
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }

  launchConfetti() {
    // Canvas celebratory confetti burst
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const particles = [];
    const colors = ['#f43f5e', '#38bdf8', '#4ade80', '#fbbf24', '#a855f7', '#ec4899'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rSpeed;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive && frame < 120) {
        requestAnimationFrame(animate);
      } else {
        canvas.style.display = 'none';
      }
    };

    requestAnimationFrame(animate);
  }

  getKeyboardCode(char) {
    if (char === ' ') return 'Space';
    const codeMap = {
      ';': 'Semicolon',
      ':': 'Semicolon',
      "'": 'Quote',
      '"': 'Quote',
      ',': 'Comma',
      '<': 'Comma',
      '.': 'Period',
      '>': 'Period',
      '/': 'Slash',
      '?': 'Slash',
      '-': 'Minus',
      '_': 'Minus',
      '=': 'Equal',
      '+': 'Equal',
      '[': 'BracketLeft',
      '{': 'BracketLeft',
      ']': 'BracketRight',
      '}': 'BracketRight',
      '\\': 'Backslash',
      '|': 'Backslash',
      '`': 'Backquote',
      '~': 'Backquote',
      '!': 'Digit1',
      '@': 'Digit2',
      '#': 'Digit3',
      '$': 'Digit4',
      '%': 'Digit5',
      '^': 'Digit6',
      '&': 'Digit7',
      '*': 'Digit8',
      '(': 'Digit9',
      ')': 'Digit0'
    };
    if (codeMap[char]) return codeMap[char];
    if (/[0-9]/.test(char)) return `Digit${char}`;
    if (/[a-zA-Z]/.test(char)) return `Key${char.toUpperCase()}`;
    return '';
  }

  // --- AUTHENTICATION & ZERO-RESET HANDLERS ---

  updateAuthUI() {
    const authBtn = document.getElementById('auth-nav-btn');
    const userMenu = document.getElementById('user-profile-menu');
    const user = window.storageManager.data.currentUser;

    if (user) {
      if (authBtn) authBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';

      const avatarIcon = document.getElementById('user-avatar-icon');
      const nameLabel = document.getElementById('user-name-label');
      const dropAvatar = document.getElementById('dropdown-avatar');
      const dropUser = document.getElementById('dropdown-username');
      const dropEmail = document.getElementById('dropdown-email');

      if (avatarIcon) avatarIcon.innerText = user.avatar || '🐱';
      if (nameLabel) nameLabel.innerText = user.username || 'Typist';
      if (dropAvatar) dropAvatar.innerText = user.avatar || '🐱';
      if (dropUser) dropUser.innerText = user.username || 'Typist';
      if (dropEmail) dropEmail.innerText = user.email || '';
    } else {
      if (authBtn) authBtn.style.display = 'inline-flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  openAuthModal(tab = 'signup', isMilestone = false) {
    const banner = document.getElementById('auth-milestone-banner');
    const errAlert = document.getElementById('auth-error-alert');
    if (banner) banner.style.display = isMilestone ? 'block' : 'none';
    if (errAlert) {
      errAlert.style.display = 'none';
      errAlert.innerText = '';
    }

    const tabSignup = document.getElementById('tab-btn-signup');
    const tabLogin = document.getElementById('tab-btn-login');

    if (tab === 'login') {
      if (tabLogin) tabLogin.click();
    } else {
      if (tabSignup) tabSignup.click();
    }

    this.openModal('auth-modal');
  }

  handleSignUp() {
    const usernameInput = document.getElementById('signup-username');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const selAvatar = document.querySelector('.avatar-option.selected');
    const avatar = selAvatar ? selAvatar.dataset.avatar : '🐱';
    const errAlert = document.getElementById('auth-error-alert');

    try {
      const user = window.storageManager.signUp(usernameInput.value, emailInput.value, passwordInput.value, avatar);
      this.closeModal('auth-modal');
      this.updateAuthUI();
      this.renderDashboard();
      if (usernameInput) usernameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
      alert(`🎉 Welcome to TypePaws, ${user.username}! Your progress is now safely saved to your account!`);
    } catch (err) {
      if (errAlert) {
        errAlert.innerText = err.message;
        errAlert.style.display = 'block';
      } else {
        alert(err.message);
      }
    }
  }

  handleLogIn() {
    const identifierInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');
    const errAlert = document.getElementById('auth-error-alert');

    try {
      const user = window.storageManager.logIn(identifierInput.value, passwordInput.value);
      this.closeModal('auth-modal');
      this.updateAuthUI();
      this.currentLevelKey = window.storageManager.getCurrentLevel();
      this.updateHeaderLevelBadge();
      this.renderDashboard();
      if (identifierInput) identifierInput.value = '';
      if (passwordInput) passwordInput.value = '';
      alert(`🐾 Welcome back, ${user.username}! Your stats and lessons have been loaded.`);
    } catch (err) {
      if (errAlert) {
        errAlert.innerText = err.message;
        errAlert.style.display = 'block';
      } else {
        alert(err.message);
      }
    }
  }

  handleLogout() {
    window.storageManager.logOut();
    this.updateAuthUI();
    this.renderDashboard();
    const userDropdown = document.getElementById('user-dropdown-card');
    if (userDropdown) userDropdown.classList.remove('open');
    alert("You have logged out. All active session progress has been reset to 0 for guest mode.");
  }

  /**
   * ALWAYS RESET TO 0 EVERYTHING
   * Wipes all completed lessons, resets stats to 0, locks badges, resets last lesson to #1.
   */
  resetAllToZero() {
    if (confirm("Are you sure you want to reset everything back to 0? All completed lessons, scores, and streak records will be wiped.")) {
      window.storageManager.resetEverythingToZero();
      this.currentLevelKey = 'beginner';
      this.currentLesson = null;
      this.updateHeaderLevelBadge();
      this.renderDashboard();
      this.closeAllModals();
      const userDropdown = document.getElementById('user-dropdown-card');
      if (userDropdown) userDropdown.classList.remove('open');
      alert("✨ Everything has been reset to 0! All lessons and stats are back to starting point.");
    }
  }
}

// Instantiate on DOM load
window.app = null;
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TypePawsApp();
});

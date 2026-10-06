/**
 * TypePaws - Storage, Profile & Badges Manager
 * Handles local persistence, progress tracking across the 3 learning paths,
 * badge milestones, user authentication (Sign Up / Log In), and clean 0-state resets.
 */

const STORAGE_KEY = 'typepaws_user_data_v2'; // Bumped version to start cleanly at 0
const ACCOUNTS_KEY = 'typepaws_accounts_v2';

class StorageManager {
  constructor() {
    this.accounts = this.loadAccounts();
    this.data = this.load();

    // If current user is DemoTypist, ensure the 100 completed beginner lessons are present so Long Paragraphs is open
    if (this.data.currentUser && (this.data.currentUser.username.toLowerCase() === 'demotypist' || this.data.currentUser.email === 'demo@typepaws.org')) {
      const demoAcc = this.getDemoTypistAccount();
      this.data.completedLessons = demoAcc.data.completedLessons;
      this.data.stats = demoAcc.data.stats;
      this.data.lastLesson.beginner = 100;
      this.save();
    }
  }

  getDemoTypistAccount() {
    const demoCompleted = {};
    // 100 Beginner lessons completed & passed (Long Paragraphs open)
    for (let i = 1; i <= 100; i++) {
      demoCompleted[`b_${i}`] = {
        completed: true,
        passed: true,
        stars: 3,
        bestWpm: 38 + (i % 8),
        bestAccuracy: 98,
        lastPracticed: new Date().toISOString()
      };
    }

    // Intermediate lessons 1-5 completed & passed (Lesson 6 benchmark unlocked!)
    for (let i = 1; i <= 5; i++) {
      demoCompleted[`i_${i}`] = {
        completed: true,
        passed: true,
        stars: 3,
        bestWpm: 40 + (i * 2),
        bestAccuracy: 96,
        lastPracticed: new Date().toISOString()
      };
    }

    // Advanced lessons 1-5 completed & passed (Lesson 6 benchmark unlocked!)
    for (let i = 1; i <= 5; i++) {
      demoCompleted[`a_${i}`] = {
        completed: true,
        passed: true,
        stars: 3,
        bestWpm: 58 + (i * 2),
        bestAccuracy: 97,
        lastPracticed: new Date().toISOString()
      };
    }

    const defaultBadges = [
      { id: 'first_clack', name: 'First Clack', icon: '🐾', desc: 'Complete your very first typing exercise', unlocked: true, date: 'Completed' },
      { id: 'ten_club', name: '10-Lesson Scholar', icon: '🎓', desc: 'Finish 10 practice lessons', unlocked: true, date: 'Completed' },
      { id: 'home_row_hero', name: 'Home Row Hero', icon: '🏰', desc: 'Complete all 20 home row lessons', unlocked: true, date: 'Completed' },
      { id: 'speed_cheetah', name: 'Speed Cheetah', icon: '⚡', desc: 'Reach 40+ WPM in any lesson', unlocked: true, date: 'Completed' },
      { id: 'bullseye', name: 'Purr-fect Bullseye', icon: '🎯', desc: 'Score 100% accuracy on a lesson', unlocked: true, date: 'Completed' },
      { id: 'streak_flame', name: 'Streak Flame', icon: '🔥', desc: 'Practice 3 days in a row', unlocked: true, date: 'Completed' },
      { id: 'sonic_claws', name: 'Sonic Claws', icon: '🚀', desc: 'Reach 60+ WPM in any lesson', unlocked: false, date: null },
      { id: 'centurion', name: 'The Centurion', icon: '👑', desc: 'Complete 50 lessons in any path', unlocked: true, date: 'Completed' },
      { id: 'zen_master', name: 'Blind Touch Zen', icon: '🧘', desc: 'Complete an Advanced lesson with 98%+ accuracy', unlocked: false, date: null }
    ];

    return {
      id: 'user_demotypist',
      username: 'DemoTypist',
      email: 'demo@typepaws.org',
      password: 'password',
      avatar: '🐱',
      createdAt: new Date().toISOString(),
      data: {
        completedLessons: demoCompleted,
        stats: {
          totalTimeSeconds: 6800,
          testsCompleted: 110,
          averageWpm: 48,
          topWpm: 68,
          streakDays: 7,
          totalErrors: 72,
          totalKeystrokes: 48000,
          averageAccuracy: 98.2
        },
        recentTests: [
          { label: 'Lesson #98', wpm: 41, accuracy: 97 },
          { label: 'Lesson #99', wpm: 45, accuracy: 98 },
          { label: 'Lesson #100', wpm: 46, accuracy: 100 },
          { label: 'Inter #5', wpm: 48, accuracy: 96 },
          { label: 'Adv #5', wpm: 66, accuracy: 98 }
        ],
        badges: defaultBadges,
        lastLesson: {
          beginner: 100,
          intermediate: 6,
          advanced: 6
        },
        currentLevel: 'intermediate',
        settings: {
          darkMode: false,
          soundTheme: 'mechanical',
          volume: 0.5,
          soundMuted: false,
          keyboardHints: true,
          mascotSkin: 'cat',
          timerMode: 'passage'
        }
      }
    };
  }

  loadAccounts() {
    let accounts = [];
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      if (raw) accounts = JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to load accounts:", e);
    }

    // Always ensure DemoTypist exists with the full 100 beginner lessons completed
    const demoAcc = this.getDemoTypistAccount();
    const existingIdx = accounts.findIndex(a => 
      a.username.toLowerCase() === 'demotypist' || a.email.toLowerCase() === 'demo@typepaws.org'
    );
    if (existingIdx === -1) {
      accounts.push(demoAcc);
    } else {
      accounts[existingIdx] = demoAcc;
    }

    return accounts;
  }

  saveAccounts() {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(this.accounts));
    } catch (e) {
      console.warn("Failed to save accounts:", e);
    }
  }

  /**
   * Fresh Default Data: EVERYTHING STARTS AT 0
   */
  getDefaultData() {
    return {
      currentUser: null, // null = Guest, or { id, username, email, avatar }
      hasChosenInitialLevel: false,
      currentLevel: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
      lastLesson: {
        beginner: 1,
        intermediate: 1,
        advanced: 1
      },
      completedLessons: {}, // 0 completed lessons!
      stats: {
        totalTimeSeconds: 0,
        testsCompleted: 0,
        averageWpm: 0,
        topWpm: 0,
        streakDays: 0,
        totalErrors: 0,
        totalKeystrokes: 0,
        averageAccuracy: 100
      },
      recentTests: [], // Empty history
      badges: [
        { id: 'first_clack', name: 'First Clack', icon: '🐾', desc: 'Complete your very first typing exercise', unlocked: false, date: null },
        { id: 'ten_club', name: '10-Lesson Scholar', icon: '🎓', desc: 'Finish 10 practice lessons', unlocked: false, date: null },
        { id: 'home_row_hero', name: 'Home Row Hero', icon: '🏰', desc: 'Complete all 20 home row lessons', unlocked: false, date: null },
        { id: 'speed_cheetah', name: 'Speed Cheetah', icon: '⚡', desc: 'Reach 40+ WPM in any lesson', unlocked: false, date: null },
        { id: 'bullseye', name: 'Purr-fect Bullseye', icon: '🎯', desc: 'Score 100% accuracy on a lesson', unlocked: false, date: null },
        { id: 'streak_flame', name: 'Streak Flame', icon: '🔥', desc: 'Practice 3 days in a row', unlocked: false, date: null },
        { id: 'sonic_claws', name: 'Sonic Claws', icon: '🚀', desc: 'Reach 60+ WPM in any lesson', unlocked: false, date: null },
        { id: 'centurion', name: 'The Centurion', icon: '👑', desc: 'Complete 50 lessons in any path', unlocked: false, date: null },
        { id: 'zen_master', name: 'Blind Touch Zen', icon: '🧘', desc: 'Complete an Advanced lesson with 98%+ accuracy', unlocked: false, date: null }
      ],
      settings: {
        darkMode: false,
        soundTheme: 'mechanical',
        volume: 0.5,
        soundMuted: false,
        keyboardHints: true,
        mascotSkin: 'cat',
        timerMode: 'passage' // 'passage' | '15' | '30' | '60'
      }
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.getDefaultData(), ...parsed };
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }
    return this.getDefaultData();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      // If a user is logged in, sync their account record too
      if (this.data.currentUser) {
        const accIdx = this.accounts.findIndex(a => a.id === this.data.currentUser.id);
        if (accIdx !== -1) {
          this.accounts[accIdx].data = {
            completedLessons: this.data.completedLessons,
            stats: this.data.stats,
            recentTests: this.data.recentTests,
            badges: this.data.badges,
            lastLesson: this.data.lastLesson,
            currentLevel: this.data.currentLevel,
            settings: this.data.settings
          };
          this.saveAccounts();
        }
      }
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }

  getCurrentLevel() {
    return this.data.currentLevel || 'beginner';
  }

  setCurrentLevel(lvl) {
    if (['beginner', 'intermediate', 'advanced'].includes(lvl)) {
      this.data.currentLevel = lvl;
      this.data.hasChosenInitialLevel = true;
      this.save();
    }
  }

  getCompletedLessons() {
    return this.data.completedLessons || {};
  }

  getLessonProgress(lessonId) {
    return this.data.completedLessons[lessonId] || null;
  }

  /**
   * Benchmark Rules:
   * - Beginner: NO benchmark required (lessons 1-100: completing passes).
   * - Intermediate: Lessons 1-5 grace period (no benchmark). Lessons 6-100: Min 35 WPM & 90% Acc.
   * - Advanced: Lessons 1-5 grace period (no benchmark). Lessons 6-100: Min 55 WPM & 94% Acc.
   */
  getBenchmark(levelKey, lessonNumber) {
    const lvl = levelKey || this.data.currentLevel || 'beginner';
    const num = typeof lessonNumber === 'number' ? lessonNumber : parseInt(lessonNumber);

    if (lvl === 'beginner') {
      return {
        required: false,
        minWpm: 0,
        minAccuracy: 0,
        description: "No benchmark required — complete to pass"
      };
    }

    if (lvl === 'intermediate') {
      if (num <= 5) {
        return {
          required: false,
          minWpm: 0,
          minAccuracy: 0,
          description: "Intro grace lesson — complete to pass"
        };
      }
      return {
        required: true,
        minWpm: 35,
        minAccuracy: 90,
        description: "Benchmark: 35+ WPM & 90%+ Accuracy"
      };
    }

    if (lvl === 'advanced') {
      if (num <= 5) {
        return {
          required: false,
          minWpm: 0,
          minAccuracy: 0,
          description: "Intro grace lesson — complete to pass"
        };
      }
      return {
        required: true,
        minWpm: 55,
        minAccuracy: 94,
        description: "Benchmark: 55+ WPM & 94%+ Accuracy"
      };
    }

    return { required: false, minWpm: 0, minAccuracy: 0, description: "Complete to pass" };
  }

  /**
   * Check whether a given lesson performance meets the pass requirement
   */
  isLessonPassed(levelKey, lessonNumber, result) {
    const bench = this.getBenchmark(levelKey, lessonNumber);
    if (!bench.required) {
      return true; // No benchmark required (Beginner or Lessons 1-5)
    }
    return result.wpm >= bench.minWpm && result.accuracy >= bench.minAccuracy;
  }

  /**
   * Check whether a lesson is unlocked for practice:
   * - Lesson 1 of any path is always unlocked.
   * - Lesson N is unlocked only if Lesson N-1 is passed!
   * - In Intermediate & Advanced paths, Lessons > 5 COMPULSORILY require Sign Up / Log In!
   */
  isLessonUnlocked(levelKey, lessonNumber) {
    const lvl = levelKey || this.data.currentLevel || 'beginner';
    const num = typeof lessonNumber === 'number' ? lessonNumber : parseInt(lessonNumber);

    if (num <= 1) return true; // Lesson 1 is always unlocked

    // Compulsory Sign Up / Log In after Lesson 5 in Intermediate or Advanced
    if ((lvl === 'intermediate' || lvl === 'advanced') && num > 5 && !this.data.currentUser) {
      return false; // Locked until user creates an account or logs in
    }

    const prefix = lvl === 'beginner' ? 'b_' : (lvl === 'intermediate' ? 'i_' : 'a_');
    const prevId = `${prefix}${num - 1}`;
    const prevRecord = this.data.completedLessons[prevId];

    if (!prevRecord) return false;

    // For beginner, completing counts as passed
    if (lvl === 'beginner') {
      return !!prevRecord.completed;
    }

    // For intermediate & advanced, must be passed (met benchmark or grace)
    return !!prevRecord.passed;
  }

  /**
   * Check if sign up / log in is required for this lesson:
   * Compulsory for Intermediate and Advanced lessons > 5 if not logged in.
   */
  isAuthRequiredForLesson(levelKey, lessonNumber) {
    const lvl = levelKey || this.data.currentLevel || 'beginner';
    const num = typeof lessonNumber === 'number' ? lessonNumber : parseInt(lessonNumber);
    return (lvl === 'intermediate' || lvl === 'advanced') && num > 5 && !this.data.currentUser;
  }

  /**
   * Check whether Long Paragraph Arena is unlocked:
   * Must have completed ALL 100 Beginner lessons!
   */
  isParagraphArenaUnlocked() {
    const bStats = this.getLevelStats('beginner');
    return bStats.completedCount >= 100;
  }

  recordLessonResult(lesson, result) {
    const id = lesson.id;
    const lvl = lesson.level || (lesson.id.startsWith('b_') ? 'beginner' : (lesson.id.startsWith('i_') ? 'intermediate' : (lesson.id.startsWith('a_') ? 'advanced' : this.data.currentLevel)));
    const prev = this.data.completedLessons[id];
    
    // Check if passed according to level & benchmark rules
    const passed = this.isLessonPassed(lvl, lesson.number, result);
    const benchmark = this.getBenchmark(lvl, lesson.number);

    // Calculate stars: 3 stars if acc >= 97% and wpm >= target, 2 stars if acc >= 92%, 1 star otherwise
    let stars = 1;
    if (result.accuracy >= 97 && result.wpm >= (lesson.targetWpm || 25)) {
      stars = 3;
    } else if (result.accuracy >= 92) {
      stars = 2;
    }

    const bestWpm = Math.max(result.wpm, prev ? prev.bestWpm : 0);
    const bestAcc = Math.max(result.accuracy, prev ? prev.bestAccuracy : 0);
    const bestStars = Math.max(stars, prev ? prev.stars : 1);
    const wasPassed = prev ? (prev.passed || passed) : passed;

    this.data.completedLessons[id] = {
      completed: true,
      passed: wasPassed,
      stars: bestStars,
      bestWpm: bestWpm,
      bestAccuracy: bestAcc,
      lastPracticed: new Date().toISOString()
    };

    // Update last active lesson for this level ONLY if passed!
    if (passed && lesson.number < 100) {
      this.data.lastLesson[lvl] = Math.max(this.data.lastLesson[lvl] || 1, lesson.number + 1);
    }

    // Update aggregate stats
    const stats = this.data.stats;
    stats.testsCompleted += 1;
    stats.totalTimeSeconds += result.timeSeconds;
    stats.totalErrors += result.errors;
    stats.totalKeystrokes += Math.round(result.wpm * 5 * (result.timeSeconds / 60));
    stats.topWpm = Math.max(stats.topWpm, result.wpm);
    
    // Average calculations
    if (stats.testsCompleted === 1) {
      stats.averageWpm = result.wpm;
      stats.averageAccuracy = result.accuracy;
      stats.streakDays = 1;
    } else {
      stats.averageWpm = Math.round((stats.averageWpm * 0.8) + (result.wpm * 0.2));
      stats.averageAccuracy = parseFloat(((stats.averageAccuracy * 0.8) + (result.accuracy * 0.2)).toFixed(1));
    }

    // Append to recent tests history
    this.data.recentTests.push({
      label: `Lesson #${lesson.number}`,
      wpm: result.wpm,
      accuracy: result.accuracy
    });
    if (this.data.recentTests.length > 12) {
      this.data.recentTests.shift();
    }

    // Check badges
    this.checkBadges(result, lesson);

    this.save();

    return {
      passed,
      benchmark,
      stars: bestStars,
      bestWpm,
      bestAccuracy: bestAcc
    };
  }

  checkBadges(result, lesson) {
    const unlock = (badgeId) => {
      const b = this.data.badges.find(x => x.id === badgeId);
      if (b && !b.unlocked) {
        b.unlocked = true;
        b.date = 'Just now';
        return b;
      }
      return null;
    };

    const unlocked = [];

    // First Clack
    if (this.data.stats.testsCompleted >= 1) {
      const b = unlock('first_clack');
      if (b) unlocked.push(b);
    }
    // 10-Lesson Scholar (Prompt login after 10th lesson!)
    if (this.data.stats.testsCompleted >= 10) {
      const b = unlock('ten_club');
      if (b) unlocked.push(b);
    }
    // Speed Cheetah (40+ WPM)
    if (result.wpm >= 40) {
      const b = unlock('speed_cheetah');
      if (b) unlocked.push(b);
    }
    // Sonic Claws (60+ WPM)
    if (result.wpm >= 60) {
      const b = unlock('sonic_claws');
      if (b) unlocked.push(b);
    }
    // Bullseye (100% accuracy)
    if (result.accuracy === 100) {
      const b = unlock('bullseye');
      if (b) unlocked.push(b);
    }
    // Blind Touch Zen (Advanced lesson with 98%+)
    if (this.data.currentLevel === 'advanced' && result.accuracy >= 98) {
      const b = unlock('zen_master');
      if (b) unlocked.push(b);
    }
    // Centurion (50 lessons completed)
    const totalDone = Object.keys(this.data.completedLessons).length;
    if (totalDone >= 50) {
      const b = unlock('centurion');
      if (b) unlocked.push(b);
    }

    return unlocked;
  }

  /**
   * Check if we should prompt the user to sign up or log in.
   * Triggered when completing the 10th lesson as an unauthenticated guest!
   */
  shouldPromptAuth() {
    return !this.data.currentUser && this.data.stats.testsCompleted === 10;
  }

  // --- USER AUTHENTICATION SYSTEM ---

  signUp(username, email, password, avatar = '🐱') {
    username = (username || '').trim();
    email = (email || '').trim().toLowerCase();

    if (!username || !email) {
      throw new Error("Please enter both username and email.");
    }

    // Check if email already registered
    const existing = this.accounts.find(a => a.email === email || a.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      throw new Error("An account with this email or username already exists. Please log in.");
    }

    const userId = 'user_' + Date.now();
    const newUser = {
      id: userId,
      username,
      email,
      password: password || '123456',
      avatar: avatar || '🐱',
      createdAt: new Date().toISOString(),
      data: {
        // Carry over the current progress (e.g. the 10 completed lessons!)
        completedLessons: { ...this.data.completedLessons },
        stats: { ...this.data.stats },
        recentTests: [ ...this.data.recentTests ],
        badges: [ ...this.data.badges ],
        lastLesson: { ...this.data.lastLesson },
        currentLevel: this.data.currentLevel,
        settings: { ...this.data.settings }
      }
    };

    this.accounts.push(newUser);
    this.saveAccounts();

    this.data.currentUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar
    };
    this.save();

    return this.data.currentUser;
  }

  logIn(identifier, password) {
    identifier = (identifier || '').trim().toLowerCase();
    
    // Explicit Demo / DemoTypist login: always loads open Long Paragraphs version
    if (identifier === 'demo' || identifier === 'demotypist' || identifier === 'guest' || identifier === 'demo@typepaws.org') {
      const demoAcc = this.getDemoTypistAccount();
      const idx = this.accounts.findIndex(a => a.username.toLowerCase() === 'demotypist');
      if (idx !== -1) {
        this.accounts[idx] = demoAcc;
      } else {
        this.accounts.push(demoAcc);
      }
      this.saveAccounts();

      this.data.currentUser = {
        id: demoAcc.id,
        username: demoAcc.username,
        email: demoAcc.email,
        avatar: demoAcc.avatar
      };
      this.data.completedLessons = demoAcc.data.completedLessons;
      this.data.stats = demoAcc.data.stats;
      this.data.recentTests = demoAcc.data.recentTests;
      this.data.badges = demoAcc.data.badges;
      this.data.lastLesson = demoAcc.data.lastLesson;
      this.data.currentLevel = demoAcc.data.currentLevel;
      if (demoAcc.data.settings) this.data.settings = { ...this.data.settings, ...demoAcc.data.settings };

      this.save();
      return this.data.currentUser;
    }

    // Find account by email or username
    const acc = this.accounts.find(a => 
      a.email.toLowerCase() === identifier || 
      a.username.toLowerCase() === identifier
    );

    if (!acc) {
      throw new Error("Account not found. Please check your credentials or Sign Up!");
    }

    if (password && acc.password && acc.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    // Restore user session & their progress
    this.data.currentUser = {
      id: acc.id,
      username: acc.username,
      email: acc.email,
      avatar: acc.avatar
    };

    if (acc.data) {
      this.data.completedLessons = acc.data.completedLessons || {};
      this.data.stats = acc.data.stats || this.getDefaultData().stats;
      this.data.recentTests = acc.data.recentTests || [];
      this.data.badges = acc.data.badges || this.getDefaultData().badges;
      this.data.lastLesson = acc.data.lastLesson || { beginner: 1, intermediate: 1, advanced: 1 };
      this.data.currentLevel = acc.data.currentLevel || 'beginner';
      if (acc.data.settings) this.data.settings = { ...this.data.settings, ...acc.data.settings };
    }

    this.save();
    return this.data.currentUser;
  }

  logOut() {
    this.save(); // save current state to user account
    // Reset to clean 0 guest state
    this.data = this.getDefaultData();
    this.save();
  }

  /**
   * ALWAYS RESET TO 0 EVERYTHING
   * Completely resets all lessons, stats, time, errors, badges, and records back to 0.
   */
  resetEverythingToZero() {
    const keepUser = this.data.currentUser;
    const keepLevel = this.data.currentLevel;
    const keepSettings = this.data.settings;

    this.data = this.getDefaultData();
    this.data.currentUser = keepUser;
    this.data.currentLevel = keepLevel || 'beginner';
    this.data.settings = keepSettings;
    this.data.hasChosenInitialLevel = true;

    this.save();
  }

  getLevelStats(lvlKey) {
    const prefix = lvlKey === 'beginner' ? 'b_' : (lvlKey === 'intermediate' ? 'i_' : 'a_');
    const comp = this.data.completedLessons;
    let completedCount = 0;
    let passedCount = 0;
    let totalStars = 0;
    let highestWpm = 0;
    let nextLessonNum = 1;

    for (let i = 1; i <= 100; i++) {
      const item = comp[`${prefix}${i}`];
      if (item && item.completed) {
        completedCount++;
        totalStars += item.stars || 0;
        if (item.bestWpm > highestWpm) highestWpm = item.bestWpm;
        if (item.passed || (lvlKey === 'beginner' && item.completed)) {
          passedCount++;
        }
      }
    }

    // Determine the next lesson to practice: first lesson in sequence that is not yet passed
    for (let i = 1; i <= 100; i++) {
      const item = comp[`${prefix}${i}`];
      const isPassed = item && (item.passed || (lvlKey === 'beginner' && item.completed));
      if (!isPassed) {
        nextLessonNum = i;
        break;
      }
      if (i === 100 && isPassed) {
        nextLessonNum = 100;
      }
    }

    return {
      completedCount,
      passedCount,
      totalCount: 100,
      percent: Math.round((completedCount / 100) * 100),
      totalStars,
      maxStars: 300,
      highestWpm,
      nextLessonNum
    };
  }

  /**
   * Demo & Test Helper:
   * Quickly marks all 100 beginner lessons as completed so the user can test the Long Paragraph Arena.
   */
  unlockAllBeginnerForTesting() {
    for (let i = 1; i <= 100; i++) {
      this.data.completedLessons[`b_${i}`] = {
        completed: true,
        passed: true,
        stars: 3,
        bestWpm: 35 + (i % 8),
        bestAccuracy: 98,
        lastPracticed: new Date().toISOString()
      };
    }
    this.data.lastLesson.beginner = 100;
    this.data.stats.testsCompleted = Math.max(this.data.stats.testsCompleted, 100);
    this.data.stats.averageWpm = 40;
    this.data.stats.topWpm = 48;
    this.save();
  }

  /**
   * Demo & Test Helper:
   * Sets Intermediate and Advanced lessons 1-5 as completed and passed,
   * unlocking Lesson 6 so the user can test the benchmark passing requirement.
   */
  setIntermediateAndAdvancedToLesson5() {
    for (let i = 1; i <= 5; i++) {
      this.data.completedLessons[`i_${i}`] = {
        completed: true,
        passed: true,
        stars: 3,
        bestWpm: 40 + (i * 2),
        bestAccuracy: 96,
        lastPracticed: new Date().toISOString()
      };
      this.data.completedLessons[`a_${i}`] = {
        completed: true,
        passed: true,
        stars: 3,
        bestWpm: 58 + (i * 2),
        bestAccuracy: 97,
        lastPracticed: new Date().toISOString()
      };
    }
    this.data.lastLesson.intermediate = 6;
    this.data.lastLesson.advanced = 6;
    this.data.stats.testsCompleted = Math.max(this.data.stats.testsCompleted, 10);
    this.save();
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(partial) {
    this.data.settings = { ...this.data.settings, ...partial };
    this.save();
  }
}

// Global instance
window.storageManager = new StorageManager();

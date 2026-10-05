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
  }

  loadAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to load accounts:", e);
    }
    return [];
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

  recordLessonResult(lesson, result) {
    const id = lesson.id;
    const prev = this.data.completedLessons[id];
    
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

    this.data.completedLessons[id] = {
      completed: true,
      stars: bestStars,
      bestWpm: bestWpm,
      bestAccuracy: bestAcc,
      lastPracticed: new Date().toISOString()
    };

    // Update last active lesson for this level
    const lvl = this.data.currentLevel;
    if (lesson.number < 100) {
      this.data.lastLesson[lvl] = lesson.number + 1;
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
    
    // Find account by email or username
    const acc = this.accounts.find(a => 
      a.email.toLowerCase() === identifier || 
      a.username.toLowerCase() === identifier
    );

    if (!acc) {
      // Demo / Quick guest login if not found
      if (identifier === 'demo' || identifier === 'guest') {
        return this.signUp('DemoTypist', 'demo@typepaws.org', 'password', '🐱');
      }
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
    let totalStars = 0;
    let highestWpm = 0;

    for (let i = 1; i <= 100; i++) {
      const item = comp[`${prefix}${i}`];
      if (item && item.completed) {
        completedCount++;
        totalStars += item.stars;
        if (item.bestWpm > highestWpm) highestWpm = item.bestWpm;
      }
    }

    return {
      completedCount,
      totalCount: 100,
      percent: Math.round((completedCount / 100) * 100),
      totalStars,
      maxStars: 300,
      highestWpm,
      nextLessonNum: this.data.lastLesson[lvlKey] || 1
    };
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

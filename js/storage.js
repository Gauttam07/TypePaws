/**
 * TypePaws - Storage, Profile & Badges Manager
 * Handles local persistence, progress tracking across the 3 learning paths,
 * badge milestones, and realistic seed data for instant polish.
 */

const STORAGE_KEY = 'typepaws_user_data_v1';

class StorageManager {
  constructor() {
    this.data = this.load();
  }

  getDefaultData() {
    // Realistic placeholder seed data showing a learner moving through paths
    const seedCompleted = {};
    
    // Seed some beginner lessons (Lessons 1-13)
    for (let i = 1; i <= 13; i++) {
      const wpm = 22 + Math.floor(i * 1.5) + Math.floor(Math.random() * 4);
      const acc = 94 + Math.floor(Math.random() * 6);
      const stars = acc >= 98 && wpm >= 30 ? 3 : (acc >= 94 ? 2 : 1);
      seedCompleted[`b_${i}`] = {
        completed: true,
        stars: stars,
        bestWpm: wpm,
        bestAccuracy: acc,
        date: new Date(Date.now() - (14 - i) * 86400000).toISOString()
      };
    }

    return {
      hasChosenInitialLevel: false, // will show welcome prompt if false, but seeded so they can see progress
      currentLevel: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
      lastLesson: {
        beginner: 14,
        intermediate: 1,
        advanced: 1
      },
      completedLessons: seedCompleted,
      stats: {
        totalTimeSeconds: 3840,
        testsCompleted: 13,
        averageWpm: 34,
        topWpm: 46,
        streakDays: 4,
        totalErrors: 28,
        totalKeystrokes: 6420,
        averageAccuracy: 96.5
      },
      recentTests: [
        { label: 'Day 1', wpm: 24, accuracy: 93 },
        { label: 'Day 2', wpm: 27, accuracy: 95 },
        { label: 'Day 3', wpm: 31, accuracy: 96 },
        { label: 'Day 4', wpm: 35, accuracy: 97 },
        { label: 'Day 5', wpm: 38, accuracy: 96 },
        { label: 'Day 6', wpm: 42, accuracy: 98 },
        { label: 'Today', wpm: 46, accuracy: 99 }
      ],
      badges: [
        { id: 'first_clack', name: 'First Clack', icon: '🐾', desc: 'Completed your very first typing exercise', unlocked: true, date: '4 days ago' },
        { id: 'home_row_hero', name: 'Home Row Hero', icon: '🏰', desc: 'Completed 10 home row lessons', unlocked: true, date: '2 days ago' },
        { id: 'speed_cheetah', name: 'Speed Cheetah', icon: '⚡', desc: 'Reached 40+ WPM in any lesson', unlocked: true, date: 'Yesterday' },
        { id: 'bullseye', name: 'Purr-fect Bullseye', icon: '🎯', desc: 'Scored 100% accuracy on a lesson', unlocked: true, date: 'Today' },
        { id: 'streak_flame', name: 'Streak Flame', icon: '🔥', desc: 'Practiced 3 days in a row', unlocked: true, date: 'Yesterday' },
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
        // Merge with defaults in case of missing keys
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
    // result: { wpm, accuracy, timeSeconds, errors, completed }
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

    // Update global aggregate stats
    const stats = this.data.stats;
    stats.testsCompleted += 1;
    stats.totalTimeSeconds += result.timeSeconds;
    stats.totalErrors += result.errors;
    stats.totalKeystrokes += Math.round(result.wpm * 5 * (result.timeSeconds / 60));
    stats.topWpm = Math.max(stats.topWpm, result.wpm);
    // Exponential moving average for wpm and accuracy
    stats.averageWpm = Math.round((stats.averageWpm * 0.8) + (result.wpm * 0.2));
    stats.averageAccuracy = parseFloat(((stats.averageAccuracy * 0.8) + (result.accuracy * 0.2)).toFixed(1));

    // Append to recent tests history
    this.data.recentTests.push({
      label: `Test ${stats.testsCompleted}`,
      wpm: result.wpm,
      accuracy: result.accuracy
    });
    if (this.data.recentTests.length > 12) {
      this.data.recentTests.shift();
    }

    // Check and unlock badges
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

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.getDefaultData();
    // Clear completed for genuine fresh start
    this.data.completedLessons = {};
    this.data.stats.testsCompleted = 0;
    this.data.stats.totalTimeSeconds = 0;
    this.data.stats.averageWpm = 0;
    this.data.stats.topWpm = 0;
    this.data.hasChosenInitialLevel = false;
    this.data.recentTests = [];
    this.save();
  }
}

// Global instance
window.storageManager = new StorageManager();

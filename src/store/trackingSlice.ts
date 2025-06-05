import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  DailyCheckIn, 
  WeeklyProgress, 
  MonthlyProgress, 
  Streak, 
  Achievement,
  ProgressDashboard,
  UserPreferences,
  AppTheme
} from '@/types/tracking';

interface TrackingState {
  // Check-ins
  dailyCheckIns: DailyCheckIn[];
  currentCheckIn: DailyCheckIn | null;
  
  // Progress
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
  dashboard: ProgressDashboard | null;
  
  // Streaks and Achievements
  streaks: Streak[];
  achievements: Achievement[];
  
  // User Preferences
  preferences: UserPreferences | null;
  currentTheme: AppTheme | null;
  
  // UI State
  isCheckingIn: boolean;
  dashboardLoading: boolean;
  selectedPeriod: 'week' | 'month' | 'quarter' | 'year';
  
  // Hydration
  isHydrated: boolean;
}

// Default themes
const lightTheme: AppTheme = {
  id: 'light',
  name: 'Light Theme',
  type: 'light',
  colors: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Monaco, monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  }
};

const darkTheme: AppTheme = {
  id: 'dark',
  name: 'Dark Theme',
  type: 'dark',
  colors: {
    primary: '#A78BFA',
    secondary: '#06B6D4',
    accent: '#FBBF24',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Monaco, monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  }
};

const initialState: TrackingState = {
  dailyCheckIns: [],
  currentCheckIn: null,
  weeklyProgress: [],
  monthlyProgress: [],
  dashboard: null,
  streaks: [],
  achievements: [],
  preferences: null,
  currentTheme: lightTheme,
  isCheckingIn: false,
  dashboardLoading: false,
  selectedPeriod: 'month',
  isHydrated: false
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    // Hydration
    hydrateTracking: (state) => {
      if (typeof window !== 'undefined') {
        const storedCheckIns = localStorage.getItem('lifestyle-checkins');
        const storedStreaks = localStorage.getItem('lifestyle-streaks');
        const storedAchievements = localStorage.getItem('lifestyle-achievements');
        const storedPreferences = localStorage.getItem('lifestyle-preferences');
        
        if (storedCheckIns) {
          state.dailyCheckIns = JSON.parse(storedCheckIns);
        }
        if (storedStreaks) {
          state.streaks = JSON.parse(storedStreaks);
        }
        if (storedAchievements) {
          state.achievements = JSON.parse(storedAchievements);
        }
        if (storedPreferences) {
          const prefs = JSON.parse(storedPreferences);
          state.preferences = prefs;
          state.currentTheme = prefs.theme;
        }
      }
      state.isHydrated = true;
    },

    // Daily Check-ins
    startCheckIn: (state, action: PayloadAction<{ planId: string; userId: string }>) => {
      state.isCheckingIn = true;
      const today = new Date().toISOString().split('T')[0];
      
      state.currentCheckIn = {
        id: `checkin-${Date.now()}`,
        date: today,
        userId: action.payload.userId,
        planId: action.payload.planId,
        mood: 5,
        energy: 5,
        productivity: 5,
        stress: 5,
        completedActivities: [],
        progressPhotos: [],
        notes: '',
        wins: [],
        challenges: [],
        metrics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    updateCheckIn: (state, action: PayloadAction<Partial<DailyCheckIn>>) => {
      if (state.currentCheckIn) {
        state.currentCheckIn = {
          ...state.currentCheckIn,
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      }
    },

    saveCheckIn: (state) => {
      if (state.currentCheckIn) {
        const existingIndex = state.dailyCheckIns.findIndex(
          checkin => checkin.date === state.currentCheckIn!.date
        );
        
        if (existingIndex >= 0) {
          state.dailyCheckIns[existingIndex] = state.currentCheckIn;
        } else {
          state.dailyCheckIns.push(state.currentCheckIn);
        }
        
        // Update streaks
        updateStreaks(state);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('lifestyle-checkins', JSON.stringify(state.dailyCheckIns));
          localStorage.setItem('lifestyle-streaks', JSON.stringify(state.streaks));
        }
        
        state.currentCheckIn = null;
        state.isCheckingIn = false;
      }
    },

    cancelCheckIn: (state) => {
      state.currentCheckIn = null;
      state.isCheckingIn = false;
    },

    // Streaks
    addStreak: (state, action: PayloadAction<Omit<Streak, 'id'>>) => {
      const newStreak: Streak = {
        ...action.payload,
        id: `streak-${Date.now()}`
      };
      state.streaks.push(newStreak);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifestyle-streaks', JSON.stringify(state.streaks));
      }
    },

    updateStreak: (state, action: PayloadAction<{ id: string; updates: Partial<Streak> }>) => {
      const index = state.streaks.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.streaks[index] = { ...state.streaks[index], ...action.payload.updates };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('lifestyle-streaks', JSON.stringify(state.streaks));
        }
      }
    },

    // Achievements
    unlockAchievement: (state, action: PayloadAction<Omit<Achievement, 'id' | 'unlockedAt'>>) => {
      const newAchievement: Achievement = {
        ...action.payload,
        id: `achievement-${Date.now()}`,
        unlockedAt: new Date().toISOString()
      };
      state.achievements.push(newAchievement);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifestyle-achievements', JSON.stringify(state.achievements));
      }
    },

    // Themes and Preferences
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.currentTheme = action.payload;
      
      if (state.preferences) {
        state.preferences.theme = action.payload;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('lifestyle-preferences', JSON.stringify(state.preferences));
        }
      }
    },

    toggleTheme: (state) => {
      const newTheme = state.currentTheme?.type === 'light' ? darkTheme : lightTheme;
      state.currentTheme = newTheme;
      
      if (state.preferences) {
        state.preferences.theme = newTheme;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('lifestyle-preferences', JSON.stringify(state.preferences));
        }
      }
    },

    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
      } else {
        state.preferences = {
          userId: action.payload.userId || '',
          theme: state.currentTheme || lightTheme,
          accessibility: {
            highContrast: false,
            reducedMotion: false,
            fontSize: 'medium',
            keyboardNavigation: false
          },
          notifications: {
            dailyCheckIn: true,
            weeklyProgress: true,
            goalDeadlines: true,
            streakReminders: true,
            motivationalMessages: false
          },
          dashboard: {
            defaultView: 'overview',
            chartPreferences: [],
            hiddenSections: []
          },
          ...action.payload
        };
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifestyle-preferences', JSON.stringify(state.preferences));
      }
    },

    // Dashboard
    setDashboard: (state, action: PayloadAction<ProgressDashboard>) => {
      state.dashboard = action.payload;
      state.dashboardLoading = false;
    },

    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.dashboardLoading = action.payload;
    },

    setSelectedPeriod: (state, action: PayloadAction<'week' | 'month' | 'quarter' | 'year'>) => {
      state.selectedPeriod = action.payload;
    }
  }
});

// Helper function to update streaks
function updateStreaks(state: TrackingState) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Check for daily check-in streak
  let checkInStreak = state.streaks.find(s => s.type === 'daily_checkin');
  if (!checkInStreak) {
    checkInStreak = {
      id: `streak-checkin-${Date.now()}`,
      type: 'daily_checkin',
      name: 'Daily Check-in Streak',
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: '',
      isActive: false
    };
    state.streaks.push(checkInStreak);
  }
  
  // Update streak logic
  if (checkInStreak.lastActivity === yesterday) {
    checkInStreak.currentStreak += 1;
    checkInStreak.isActive = true;
  } else if (checkInStreak.lastActivity === today) {
    // Already checked in today, don't update
    return;
  } else {
    // Streak broken, reset
    checkInStreak.currentStreak = 1;
    checkInStreak.isActive = true;
  }
  
  checkInStreak.lastActivity = today;
  
  if (checkInStreak.currentStreak > checkInStreak.longestStreak) {
    checkInStreak.longestStreak = checkInStreak.currentStreak;
  }
}

export const {
  hydrateTracking,
  startCheckIn,
  updateCheckIn,
  saveCheckIn,
  cancelCheckIn,
  addStreak,
  updateStreak,
  unlockAchievement,
  setTheme,
  toggleTheme,
  updatePreferences,
  setDashboard,
  setDashboardLoading,
  setSelectedPeriod
} = trackingSlice.actions;

export default trackingSlice.reducer; 
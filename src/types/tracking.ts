export interface DailyCheckIn {
  id: string;
  date: string; // ISO date string
  userId: string;
  planId: string;
  
  // Mood and Energy Tracking
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  productivity: number; // 1-10 scale
  stress: number; // 1-10 scale
  
  // Activity Completion
  completedActivities: CompletedActivity[];
  
  // Progress Photos
  progressPhotos: ProgressPhoto[];
  
  // Daily Notes
  notes: string;
  wins: string[];
  challenges: string[];
  
  // Quick Metrics
  metrics: DailyMetric[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CompletedActivity {
  id: string;
  activityType: 'professional' | 'fitness' | 'hobby' | 'nutrition';
  activityName: string;
  completed: boolean;
  duration?: number; // minutes
  intensity?: number; // 1-10 scale
  notes?: string;
  timestamp: string;
}

export interface ProgressPhoto {
  id: string;
  type: 'fitness' | 'hobby' | 'general';
  url: string;
  caption?: string;
  tags: string[];
  timestamp: string;
}

export interface DailyMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target?: number;
  category: 'fitness' | 'nutrition' | 'professional' | 'personal';
}

export interface WeeklyProgress {
  weekOf: string; // ISO week start date
  planId: string;
  
  // Completion Rates
  overallCompletion: number; // 0-100%
  categoryCompletion: {
    professional: number;
    fitness: number;
    hobbies: number;
    nutrition: number;
  };
  
  // Averages
  averageMood: number;
  averageEnergy: number;
  averageProductivity: number;
  
  // Streaks
  currentStreaks: Streak[];
  
  // Goals Met
  goalsMet: number;
  totalGoals: number;
  
  // Weekly Insights
  insights: WeeklyInsight[];
}

export interface MonthlyProgress {
  monthOf: string; // YYYY-MM format
  planId: string;
  
  // Monthly Stats
  totalCheckIns: number;
  averageCompletion: number;
  bestWeek: string; // ISO date
  improvementAreas: string[];
  
  // Trends
  moodTrend: 'improving' | 'declining' | 'stable';
  energyTrend: 'improving' | 'declining' | 'stable';
  completionTrend: 'improving' | 'declining' | 'stable';
  
  // Achievements
  achievementsUnlocked: Achievement[];
  
  // Comparisons
  vsLastMonth: {
    completionChange: number; // percentage change
    moodChange: number;
    energyChange: number;
  };
}

export interface Streak {
  id: string;
  type: 'daily_checkin' | 'activity_completion' | 'goal_achievement';
  name: string;
  currentStreak: number; // days
  longestStreak: number; // days
  lastActivity: string; // ISO date
  isActive: boolean;
}

export interface WeeklyInsight {
  type: 'improvement' | 'concern' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'improvement' | 'milestone';
  unlockedAt: string;
  progress?: number; // 0-100 for progressive achievements
}

export interface ProgressChart {
  type: 'line' | 'bar' | 'pie' | 'area' | 'heatmap';
  title: string;
  data: ChartDataPoint[];
  period: 'week' | 'month' | 'quarter' | 'year';
  category?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
  metadata?: any;
}

export interface HeatmapData {
  date: string;
  value: number; // 0-4 intensity level
  activities: string[];
  completionRate: number;
}

export interface ProgressDashboard {
  planId: string;
  userId: string;
  
  // Current Status
  currentStreak: number;
  todayCompletion: number;
  weekCompletion: number;
  monthCompletion: number;
  
  // Quick Stats
  stats: DashboardStat[];
  
  // Charts
  charts: ProgressChart[];
  
  // Recent Activity
  recentCheckIns: DailyCheckIn[];
  
  // Upcoming Goals
  upcomingDeadlines: GoalDeadline[];
  
  // Recommendations
  recommendations: ProgressRecommendation[];
}

export interface DashboardStat {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  color: string;
  icon: string;
}

export interface GoalDeadline {
  id: string;
  goalName: string;
  deadline: string;
  daysRemaining: number;
  progress: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface ProgressRecommendation {
  id: string;
  type: 'habit' | 'goal' | 'schedule' | 'motivation';
  title: string;
  description: string;
  actionText: string;
  priority: 'high' | 'medium' | 'low';
  basedOn: string; // What data this recommendation is based on
}

// Theme and UI Types
export interface AppTheme {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'auto';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface UserPreferences {
  userId: string;
  theme: AppTheme;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xl';
    keyboardNavigation: boolean;
  };
  notifications: {
    dailyCheckIn: boolean;
    weeklyProgress: boolean;
    goalDeadlines: boolean;
    streakReminders: boolean;
    motivationalMessages: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'detailed' | 'compact';
    chartPreferences: string[];
    hiddenSections: string[];
  };
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: string;
  category: 'navigation' | 'editing' | 'tracking' | 'general';
} 
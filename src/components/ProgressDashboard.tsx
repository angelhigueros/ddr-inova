'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  setDashboardLoading, 
  setSelectedPeriod, 
  hydrateTracking, 
  startCheckIn,
  toggleTheme,
  setDashboard
} from '@/store';
import {
  selectDashboard,
  selectDashboardLoading,
  selectSelectedPeriod,
  selectDailyCheckIns,
  selectStreaks,
  selectAchievements,
  selectCurrentTheme,
  selectTrackingIsHydrated
} from '@/store';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { 
  ProgressDashboard as DashboardType, 
  DashboardStat, 
  HeatmapData 
} from '@/types/tracking';

interface ProgressDashboardProps {
  planId: string;
  userId: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ planId, userId }) => {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(selectDashboard);
  const dashboardLoading = useAppSelector(selectDashboardLoading);
  const selectedPeriod = useAppSelector(selectSelectedPeriod);
  const dailyCheckIns = useAppSelector(selectDailyCheckIns);
  const streaks = useAppSelector(selectStreaks);
  const achievements = useAppSelector(selectAchievements);
  const currentTheme = useAppSelector(selectCurrentTheme);
  const isHydrated = useAppSelector(selectTrackingIsHydrated);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'calendar'>('overview');

  useEffect(() => {
    if (!isHydrated) {
      dispatch(hydrateTracking());
    }
  }, [dispatch, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      generateDashboardData();
    }
  }, [isHydrated, selectedPeriod, dailyCheckIns]);

  const generateDashboardData = () => {
    dispatch(setDashboardLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const mockDashboard: DashboardType = {
        planId,
        userId,
        currentStreak: getCurrentStreak(),
        todayCompletion: getTodayCompletion(),
        weekCompletion: getWeekCompletion(),
        monthCompletion: getMonthCompletion(),
        stats: generateStats(),
        charts: generateCharts(),
        recentCheckIns: dailyCheckIns.slice(-7),
        upcomingDeadlines: generateUpcomingDeadlines(),
        recommendations: generateRecommendations()
      };
      
      dispatch(setDashboard(mockDashboard));
    }, 1000);
  };

  const getCurrentStreak = () => {
    const checkInStreak = streaks.find(s => s.type === 'daily_checkin');
    return checkInStreak?.currentStreak || 0;
  };

  const getTodayCompletion = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIn = dailyCheckIns.find(c => c.date === today);
    if (!todayCheckIn) return 0;
    
    const totalActivities = todayCheckIn.completedActivities.length;
    const completedActivities = todayCheckIn.completedActivities.filter(a => a.completed).length;
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  };

  const getWeekCompletion = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekCheckIns = dailyCheckIns.filter(c => c.date >= weekStartStr);
    if (weekCheckIns.length === 0) return 0;
    
    const totalCompletion = weekCheckIns.reduce((sum, checkIn) => {
      const totalActivities = checkIn.completedActivities.length;
      const completedActivities = checkIn.completedActivities.filter(a => a.completed).length;
      return sum + (totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0);
    }, 0);
    
    return Math.round(totalCompletion / weekCheckIns.length);
  };

  const getMonthCompletion = () => {
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    
    const monthCheckIns = dailyCheckIns.filter(c => c.date >= monthStartStr);
    if (monthCheckIns.length === 0) return 0;
    
    const totalCompletion = monthCheckIns.reduce((sum, checkIn) => {
      const totalActivities = checkIn.completedActivities.length;
      const completedActivities = checkIn.completedActivities.filter(a => a.completed).length;
      return sum + (totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0);
    }, 0);
    
    return Math.round(totalCompletion / monthCheckIns.length);
  };

  const generateStats = (): DashboardStat[] => {
    return [
      {
        id: 'streak',
        name: 'Current Streak',
        value: getCurrentStreak(),
        unit: 'days',
        trend: 'up',
        trendPercentage: 15,
        color: currentTheme?.colors.success || '#10B981',
        icon: '🔥'
      },
      {
        id: 'completion',
        name: 'Week Completion',
        value: getWeekCompletion(),
        unit: '%',
        trend: 'up',
        trendPercentage: 8,
        color: currentTheme?.colors.primary || '#8B5CF6',
        icon: '📊'
      },
      {
        id: 'mood',
        name: 'Avg Mood',
        value: getAverageMood(),
        unit: '/10',
        trend: 'stable',
        color: currentTheme?.colors.warning || '#F59E0B',
        icon: '😊'
      },
      {
        id: 'achievements',
        name: 'Achievements',
        value: achievements.length,
        unit: 'unlocked',
        trend: 'up',
        trendPercentage: 25,
        color: currentTheme?.colors.accent || '#F59E0B',
        icon: '🏆'
      }
    ];
  };

  const getAverageMood = () => {
    const recentCheckIns = dailyCheckIns.slice(-7);
    if (recentCheckIns.length === 0) return 0;
    
    const totalMood = recentCheckIns.reduce((sum, checkIn) => sum + checkIn.mood, 0);
    return Math.round((totalMood / recentCheckIns.length) * 10) / 10;
  };

  const generateCharts = () => {
    return [
      {
        type: 'line' as const,
        title: 'Daily Completion Trend',
        data: generateCompletionTrendData(),
        period: selectedPeriod,
        category: 'completion'
      },
      {
        type: 'bar' as const,
        title: 'Activity Categories',
        data: generateCategoryData(),
        period: selectedPeriod,
        category: 'activities'
      },
      {
        type: 'area' as const,
        title: 'Mood & Energy Levels',
        data: generateMoodEnergyData(),
        period: selectedPeriod,
        category: 'wellbeing'
      }
    ];
  };

  const generateCompletionTrendData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const checkIn = dailyCheckIns.find(c => c.date === dateStr);
      let completion = 0;
      
      if (checkIn) {
        const totalActivities = checkIn.completedActivities.length;
        const completedActivities = checkIn.completedActivities.filter(a => a.completed).length;
        completion = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
      }
      
      return {
        date: dateStr,
        value: completion,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
    
    return last30Days;
  };

  const generateCategoryData = () => {
    const categories = ['professional', 'fitness', 'hobbies', 'nutrition'];
    const categoryStats = categories.map(category => {
      const categoryActivities = dailyCheckIns.flatMap(checkIn => 
        checkIn.completedActivities.filter(activity => activity.activityType === category)
      );
      
      const completed = categoryActivities.filter(a => a.completed).length;
      const total = categoryActivities.length;
      const completion = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        date: category,
        value: completion,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        color: getCategoryColor(category)
      };
    });
    
    return categoryStats;
  };

  const generateMoodEnergyData = () => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const checkIn = dailyCheckIns.find(c => c.date === dateStr);
      
      return {
        date: dateStr,
        value: checkIn?.mood || 0,
        mood: checkIn?.mood || 0,
        energy: checkIn?.energy || 0,
        productivity: checkIn?.productivity || 0,
        label: date.toLocaleDateString('en-US', { weekday: 'short' })
      };
    });
    
    return last14Days;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      professional: currentTheme?.colors.primary || '#8B5CF6',
      fitness: currentTheme?.colors.success || '#10B981',
      hobbies: currentTheme?.colors.warning || '#F59E0B',
      nutrition: currentTheme?.colors.secondary || '#06B6D4'
    };
    return colors[category as keyof typeof colors];
  };

  const generateUpcomingDeadlines = () => {
    return [
      {
        id: '1',
        goalName: 'Complete fitness program',
        deadline: '2024-02-15',
        daysRemaining: 5,
        progress: 75,
        priority: 'high' as const,
        category: 'fitness'
      },
      {
        id: '2',
        goalName: 'Finish online course',
        deadline: '2024-02-20',
        daysRemaining: 10,
        progress: 60,
        priority: 'medium' as const,
        category: 'professional'
      }
    ];
  };

  const generateRecommendations = () => {
    return [
      {
        id: '1',
        type: 'habit' as const,
        title: 'Maintain your streak!',
        description: 'You\'re doing great with daily check-ins. Keep it up!',
        actionText: 'Continue streak',
        priority: 'high' as const,
        basedOn: 'Current 7-day streak'
      },
      {
        id: '2',
        type: 'goal' as const,
        title: 'Focus on fitness goals',
        description: 'Your fitness completion rate could use some improvement.',
        actionText: 'Review fitness plan',
        priority: 'medium' as const,
        basedOn: 'Low fitness completion rate'
      }
    ];
  };

  const handleQuickCheckIn = () => {
    dispatch(startCheckIn({ planId, userId }));
  };

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const checkIn = dailyCheckIns.find(c => c.date === dateStr);
      
      if (checkIn) {
        const totalActivities = checkIn.completedActivities.length;
        const completedActivities = checkIn.completedActivities.filter(a => a.completed).length;
        const completion = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
        
        let intensity = 0;
        if (completion >= 80) intensity = 4;
        else if (completion >= 60) intensity = 3;
        else if (completion >= 40) intensity = 2;
        else if (completion > 0) intensity = 1;
        
        return (
          <div 
            className={`w-2 h-2 rounded-full mx-auto mt-1 ${getIntensityColor(intensity)}`}
            title={`${completion}% completion`}
          />
        );
      }
    }
    return null;
  };

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-200',
      'bg-green-200',
      'bg-green-400',
      'bg-green-600',
      'bg-green-800'
    ];
    return colors[intensity] || colors[0];
  };

  if (dashboardLoading) {
    return (
      <div 
        className="min-h-screen p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: currentTheme?.colors.background,
          color: currentTheme?.colors.text 
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" 
                 style={{ borderColor: currentTheme?.colors.primary }}>
            </div>
            <span className="ml-4 text-lg">Loading your progress...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: currentTheme?.colors.background,
        color: currentTheme?.colors.text 
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme?.colors.text }}>
              Progress Dashboard
            </h1>
            <p style={{ color: currentTheme?.colors.textSecondary }}>
              Track your lifestyle goals and celebrate your achievements
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: currentTheme?.colors.surface,
                border: `1px solid ${currentTheme?.colors.border}`
              }}
              title="Toggle theme"
            >
              {currentTheme?.type === 'light' ? '🌙' : '☀️'}
            </button>
            
            <select
              value={selectedPeriod}
              onChange={(e) => dispatch(setSelectedPeriod(e.target.value as any))}
              className="px-3 py-2 rounded-lg border transition-colors"
              style={{ 
                backgroundColor: currentTheme?.colors.surface,
                border: `1px solid ${currentTheme?.colors.border}`,
                color: currentTheme?.colors.text
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <div className="flex bg-opacity-10 rounded-lg overflow-hidden" 
                 style={{ backgroundColor: currentTheme?.colors.border }}>
              {(['overview', 'detailed', 'calendar'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === mode 
                      ? 'text-white' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: viewMode === mode 
                      ? currentTheme?.colors.primary 
                      : 'transparent',
                    color: viewMode === mode 
                      ? '#FFFFFF' 
                      : currentTheme?.colors.textSecondary
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleQuickCheckIn}
              className="px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: currentTheme?.colors.primary }}
            >
              Quick Check-in
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboard.stats.map((stat) => (
              <div
                key={stat.id}
                className="p-6 rounded-xl transition-colors"
                style={{ 
                  backgroundColor: currentTheme?.colors.surface,
                  border: `1px solid ${currentTheme?.colors.border}`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{stat.icon}</div>
                  {stat.trend && (
                    <div className={`flex items-center text-sm ${
                      stat.trend === 'up' ? 'text-green-500' : 
                      stat.trend === 'down' ? 'text-red-500' : 
                      'text-gray-500'
                    }`}>
                      {stat.trend === 'up' && '↗️'}
                      {stat.trend === 'down' && '↘️'}
                      {stat.trend === 'stable' && '➡️'}
                      {stat.trendPercentage && `${stat.trendPercentage}%`}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}{stat.unit}
                  </div>
                  <div className="text-sm" style={{ color: currentTheme?.colors.textSecondary }}>
                    {stat.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content based on view mode */}
        {viewMode === 'calendar' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div 
              className="p-6 rounded-xl"
              style={{ 
                backgroundColor: currentTheme?.colors.surface,
                border: `1px solid ${currentTheme?.colors.border}`
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Activity Calendar</h3>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={getTileContent}
                className="w-full border-none"
              />
              <div className="mt-4 flex items-center gap-2 text-sm" 
                   style={{ color: currentTheme?.colors.textSecondary }}>
                <span>Activity levels:</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-200"></div>
                  <span>None</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-200"></div>
                  <span>Low</span>
                </div>
                <div className="w-3 h-3 rounded bg-green-400"></div>
                <div className="w-3 h-3 rounded bg-green-600"></div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-800"></div>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            <div 
              className="p-6 rounded-xl"
              style={{ 
                backgroundColor: currentTheme?.colors.surface,
                border: `1px solid ${currentTheme?.colors.border}`
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Selected Day Details</h3>
              {/* Selected day details would go here */}
              <p style={{ color: currentTheme?.colors.textSecondary }}>
                Select a date on the calendar to view details for that day.
              </p>
            </div>
          </div>
        )}

        {(viewMode === 'overview' || viewMode === 'detailed') && dashboard && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Charts */}
            {dashboard.charts.map((chart, index) => (
              <div
                key={index}
                className="p-6 rounded-xl"
                style={{ 
                  backgroundColor: currentTheme?.colors.surface,
                  border: `1px solid ${currentTheme?.colors.border}`
                }}
              >
                <h3 className="text-xl font-semibold mb-4">{chart.title}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {chart.type === 'line' && (
                    <LineChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke={currentTheme?.colors.border} />
                      <XAxis 
                        dataKey="label" 
                        stroke={currentTheme?.colors.textSecondary}
                        fontSize={12}
                      />
                      <YAxis stroke={currentTheme?.colors.textSecondary} fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: currentTheme?.colors.surface,
                          border: `1px solid ${currentTheme?.colors.border}`,
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={currentTheme?.colors.primary} 
                        strokeWidth={2}
                        dot={{ fill: currentTheme?.colors.primary }}
                      />
                    </LineChart>
                  )}
                  
                  {chart.type === 'bar' && (
                    <BarChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke={currentTheme?.colors.border} />
                      <XAxis 
                        dataKey="label" 
                        stroke={currentTheme?.colors.textSecondary}
                        fontSize={12}
                      />
                      <YAxis stroke={currentTheme?.colors.textSecondary} fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: currentTheme?.colors.surface,
                          border: `1px solid ${currentTheme?.colors.border}`,
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill={currentTheme?.colors.primary} />
                    </BarChart>
                  )}
                  
                  {chart.type === 'area' && (
                    <AreaChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke={currentTheme?.colors.border} />
                      <XAxis 
                        dataKey="label" 
                        stroke={currentTheme?.colors.textSecondary}
                        fontSize={12}
                      />
                      <YAxis stroke={currentTheme?.colors.textSecondary} fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: currentTheme?.colors.surface,
                          border: `1px solid ${currentTheme?.colors.border}`,
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="mood" 
                        stackId="1" 
                        stroke={currentTheme?.colors.warning} 
                        fill={currentTheme?.colors.warning}
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="energy" 
                        stackId="2" 
                        stroke={currentTheme?.colors.success} 
                        fill={currentTheme?.colors.success}
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="productivity" 
                        stackId="3" 
                        stroke={currentTheme?.colors.primary} 
                        fill={currentTheme?.colors.primary}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'detailed' && dashboard && (
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            {/* Upcoming Deadlines */}
            <div 
              className="p-6 rounded-xl"
              style={{ 
                backgroundColor: currentTheme?.colors.surface,
                border: `1px solid ${currentTheme?.colors.border}`
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {dashboard.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-4 rounded-lg"
                       style={{ backgroundColor: currentTheme?.colors.background }}>
                    <div>
                      <div className="font-medium">{deadline.goalName}</div>
                      <div className="text-sm" style={{ color: currentTheme?.colors.textSecondary }}>
                        {deadline.daysRemaining} days remaining
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{deadline.progress}%</div>
                      <div className="w-20 h-2 rounded-full mt-1" 
                           style={{ backgroundColor: currentTheme?.colors.border }}>
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${deadline.progress}%`,
                            backgroundColor: currentTheme?.colors.primary
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div 
              className="p-6 rounded-xl"
              style={{ 
                backgroundColor: currentTheme?.colors.surface,
                border: `1px solid ${currentTheme?.colors.border}`
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              <div className="space-y-4">
                {dashboard.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-lg"
                       style={{ backgroundColor: currentTheme?.colors.background }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{rec.title}</div>
                        <div className="text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                          {rec.description}
                        </div>
                        <div className="text-xs mt-2" style={{ color: currentTheme?.colors.textSecondary }}>
                          Based on: {rec.basedOn}
                        </div>
                      </div>
                      <button
                        className="ml-4 px-3 py-1 text-sm text-white rounded transition-colors hover:opacity-90"
                        style={{ backgroundColor: currentTheme?.colors.primary }}
                      >
                        {rec.actionText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard; 
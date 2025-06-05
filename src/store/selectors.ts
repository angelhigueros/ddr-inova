import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Plans selectors
export const selectPlans = (state: RootState) => state.plans.plans;
export const selectCurrentPlan = (state: RootState) => state.plans.currentPlan;
export const selectLoading = (state: RootState) => state.plans.loading;
export const selectError = (state: RootState) => state.plans.error;
export const selectSearchTerm = (state: RootState) => state.plans.searchTerm;
export const selectFilterBy = (state: RootState) => state.plans.filterBy;
export const selectSortBy = (state: RootState) => state.plans.sortBy;
export const selectIsHydrated = (state: RootState) => state.plans.isHydrated;

// Tracking selectors
export const selectTrackingState = (state: RootState) => state.tracking;
export const selectDailyCheckIns = (state: RootState) => state.tracking.dailyCheckIns;
export const selectCurrentCheckIn = (state: RootState) => state.tracking.currentCheckIn;
export const selectIsCheckingIn = (state: RootState) => state.tracking.isCheckingIn;
export const selectWeeklyProgress = (state: RootState) => state.tracking.weeklyProgress;
export const selectMonthlyProgress = (state: RootState) => state.tracking.monthlyProgress;
export const selectDashboard = (state: RootState) => state.tracking.dashboard;
export const selectDashboardLoading = (state: RootState) => state.tracking.dashboardLoading;
export const selectStreaks = (state: RootState) => state.tracking.streaks;
export const selectAchievements = (state: RootState) => state.tracking.achievements;
export const selectUserPreferences = (state: RootState) => state.tracking.preferences;
export const selectCurrentTheme = (state: RootState) => state.tracking.currentTheme;
export const selectSelectedPeriod = (state: RootState) => state.tracking.selectedPeriod;
export const selectTrackingIsHydrated = (state: RootState) => state.tracking.isHydrated;

// Complex selectors with createSelector for memoization
export const selectFilteredAndSortedPlans = createSelector(
  [selectPlans, selectSearchTerm, selectFilterBy, selectSortBy],
  (plans, searchTerm, filterBy, sortBy) => {
    let filtered = [...plans];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.name.toLowerCase().includes(term) ||
        plan.userProfile.name.toLowerCase().includes(term) ||
        plan.userProfile.profession.toLowerCase().includes(term) ||
        plan.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply filter
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    switch (filterBy) {
      case 'favorites':
        filtered = filtered.filter(plan => plan.isFavorite);
        break;
      case 'recent':
        filtered = filtered.filter(plan => 
          new Date(plan.updatedAt) >= oneWeekAgo
        );
        break;
    }

    // Apply sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'oldest':
        filtered.sort((a, b) => 
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return filtered;
  }
);

export const selectPlanById = createSelector(
  [selectPlans, (_: RootState, planId: string) => planId],
  (plans, planId) => plans.find(plan => plan.id === planId)
);

export const selectFavoritePlans = createSelector(
  [selectPlans],
  (plans) => plans.filter(plan => plan.isFavorite)
);

export const selectRecentPlans = createSelector(
  [selectPlans],
  (plans) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return plans.filter(plan => new Date(plan.updatedAt) >= oneWeekAgo);
  }
);

export const selectAllTags = createSelector(
  [selectPlans],
  (plans) => {
    const tags = new Set<string>();
    plans.forEach(plan => {
      plan.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
);

export const selectPlanStats = createSelector(
  [selectPlans, selectFavoritePlans, selectRecentPlans],
  (plans, favorites, recent) => ({
    total: plans.length,
    favorites: favorites.length,
    recent: recent.length,
    withFeedback: plans.filter(plan => plan.feedback && plan.feedback.length > 0).length
  })
);

// Tracking complex selectors
export const selectCurrentStreak = createSelector(
  [selectStreaks],
  (streaks) => {
    const checkInStreak = streaks.find(s => s.type === 'daily_checkin');
    return checkInStreak?.currentStreak || 0;
  }
);

export const selectTodayCheckIn = createSelector(
  [selectDailyCheckIns],
  (checkIns) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(checkIn => checkIn.date === today);
  }
);

export const selectRecentCheckIns = createSelector(
  [selectDailyCheckIns],
  (checkIns) => {
    return checkIns.slice(-7); // Last 7 check-ins
  }
);

export const selectWeekProgress = createSelector(
  [selectDailyCheckIns],
  (checkIns) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekCheckIns = checkIns.filter(c => c.date >= weekStartStr);
    if (weekCheckIns.length === 0) return 0;
    
    const totalCompletion = weekCheckIns.reduce((sum, checkIn) => {
      const totalActivities = checkIn.completedActivities.length;
      const completedActivities = checkIn.completedActivities.filter(a => a.completed).length;
      return sum + (totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0);
    }, 0);
    
    return Math.round(totalCompletion / weekCheckIns.length);
  }
);

export const selectMonthProgress = createSelector(
  [selectDailyCheckIns],
  (checkIns) => {
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    
    const monthCheckIns = checkIns.filter(c => c.date >= monthStartStr);
    if (monthCheckIns.length === 0) return 0;
    
    const totalCompletion = monthCheckIns.reduce((sum, checkIn) => {
      const totalActivities = checkIn.completedActivities.length;
      const completedActivities = checkIn.completedActivities.filter(a => a.completed).length;
      return sum + (totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0);
    }, 0);
    
    return Math.round(totalCompletion / monthCheckIns.length);
  }
); 
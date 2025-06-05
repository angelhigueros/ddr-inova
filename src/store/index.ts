// Export store configuration
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Export actions
export {
  hydratePlans,
  createPlan,
  updatePlan,
  deletePlan,
  setCurrentPlan,
  loadPlan,
  duplicatePlan,
  toggleFavorite,
  addTag,
  removeTag,
  setSearchTerm,
  setFilter,
  setSortBy,
  clearCurrentPlan,
  setLoading,
  setError,
  clearAllPlans,
} from './plansSlice';

// Export actions from trackingSlice
export {
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
} from './trackingSlice';

// Export selectors
export {
  selectPlans,
  selectCurrentPlan,
  selectLoading,
  selectError,
  selectSearchTerm,
  selectFilterBy,
  selectSortBy,
  selectIsHydrated,
  selectFilteredAndSortedPlans,
  selectPlanById,
  selectFavoritePlans,
  selectRecentPlans,
  selectAllTags,
  selectPlanStats,
} from './selectors';

// Export tracking selectors
export {
  selectTrackingState,
  selectDailyCheckIns,
  selectCurrentCheckIn,
  selectIsCheckingIn,
  selectWeeklyProgress,
  selectMonthlyProgress,
  selectDashboard,
  selectDashboardLoading,
  selectStreaks,
  selectAchievements,
  selectUserPreferences,
  selectCurrentTheme,
  selectSelectedPeriod,
  selectTrackingIsHydrated,
  selectCurrentStreak,
  selectTodayCheckIn,
  selectRecentCheckIns,
  selectWeekProgress,
  selectMonthProgress
} from './selectors'; 
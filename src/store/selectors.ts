import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Basic selectors
export const selectPlans = (state: RootState) => state.plans.plans;
export const selectCurrentPlan = (state: RootState) => state.plans.currentPlan;
export const selectLoading = (state: RootState) => state.plans.loading;
export const selectError = (state: RootState) => state.plans.error;
export const selectSearchTerm = (state: RootState) => state.plans.searchTerm;
export const selectFilterBy = (state: RootState) => state.plans.filterBy;
export const selectSortBy = (state: RootState) => state.plans.sortBy;
export const selectIsHydrated = (state: RootState) => state.plans.isHydrated;

// Computed selectors
export const selectFilteredAndSortedPlans = createSelector(
  [selectPlans, selectSearchTerm, selectFilterBy, selectSortBy],
  (plans, searchTerm, filterBy, sortBy) => {
    let filteredPlans = [...plans];

    // Apply search filter
    if (searchTerm) {
      filteredPlans = filteredPlans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.userProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.userProfile.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'favorites':
        filteredPlans = filteredPlans.filter(plan => plan.isFavorite);
        break;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredPlans = filteredPlans.filter(plan => 
          new Date(plan.createdAt) > weekAgo
        );
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filteredPlans.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'name':
        filteredPlans.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filteredPlans.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filteredPlans;
  }
);

export const selectPlanById = (planId: string) =>
  createSelector(
    [selectPlans],
    (plans) => plans.find(plan => plan.id === planId)
  );

export const selectFavoritePlans = createSelector(
  [selectPlans],
  (plans) => plans.filter(plan => plan.isFavorite)
);

export const selectRecentPlans = createSelector(
  [selectPlans],
  (plans) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return plans.filter(plan => new Date(plan.createdAt) > weekAgo);
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
  [selectPlans],
  (plans) => ({
    total: plans.length,
    favorites: plans.filter(plan => plan.isFavorite).length,
    recent: plans.filter(plan => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(plan.createdAt) > weekAgo;
    }).length,
    withFeedback: plans.filter(plan => plan.feedback && plan.feedback.trim().length > 0).length,
  })
); 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LifestylePlan, UserProfile } from '@/types/lifestyle';
import { v4 as uuidv4 } from 'uuid';

interface PlansState {
  plans: LifestylePlan[];
  currentPlan: LifestylePlan | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterBy: 'all' | 'favorites' | 'recent';
  sortBy: 'newest' | 'oldest' | 'name';
  isHydrated: boolean;
}

const initialState: PlansState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
  searchTerm: '',
  filterBy: 'all',
  sortBy: 'newest',
  isHydrated: false,
};

// Helper function to save to localStorage (client-side only)
const saveToLocalStorage = (plans: LifestylePlan[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifestylePlans', JSON.stringify(plans));
    }
  } catch (error) {
    console.error('Error saving plans to localStorage:', error);
  }
};

// Helper function to load from localStorage (client-side only)
const loadFromLocalStorage = (): LifestylePlan[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const saved = localStorage.getItem('lifestylePlans');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading plans from localStorage:', error);
    return [];
  }
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    // Hydrate store with localStorage data (client-side only)
    hydratePlans: (state) => {
      if (!state.isHydrated) {
        state.plans = loadFromLocalStorage();
        state.isHydrated = true;
      }
    },

    // Create a new plan
    createPlan: (state, action: PayloadAction<{ plan: Omit<LifestylePlan, 'id' | 'createdAt' | 'updatedAt'>; name?: string }>) => {
      const { plan, name } = action.payload;
      const now = new Date().toISOString();
      const newPlan: LifestylePlan = {
        ...plan,
        id: uuidv4(),
        name: name || `${plan.userProfile.name}'s Plan - ${new Date().toLocaleDateString()}`,
        createdAt: now,
        updatedAt: now,
      };
      
      state.plans.unshift(newPlan);
      state.currentPlan = newPlan;
      saveToLocalStorage(state.plans);
    },

    // Update an existing plan
    updatePlan: (state, action: PayloadAction<{ id: string; updates: Partial<LifestylePlan> }>) => {
      const { id, updates } = action.payload;
      const planIndex = state.plans.findIndex(plan => plan.id === id);
      
      if (planIndex !== -1) {
        state.plans[planIndex] = {
          ...state.plans[planIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        if (state.currentPlan?.id === id) {
          state.currentPlan = state.plans[planIndex];
        }
        
        saveToLocalStorage(state.plans);
      }
    },

    // Delete a plan
    deletePlan: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.plans = state.plans.filter(plan => plan.id !== id);
      
      if (state.currentPlan?.id === id) {
        state.currentPlan = null;
      }
      
      saveToLocalStorage(state.plans);
    },

    // Set current plan
    setCurrentPlan: (state, action: PayloadAction<LifestylePlan | null>) => {
      state.currentPlan = action.payload;
    },

    // Load a specific plan
    loadPlan: (state, action: PayloadAction<string>) => {
      const plan = state.plans.find(plan => plan.id === action.payload);
      if (plan) {
        state.currentPlan = plan;
      }
    },

    // Duplicate a plan
    duplicatePlan: (state, action: PayloadAction<string>) => {
      const originalPlan = state.plans.find(plan => plan.id === action.payload);
      if (originalPlan) {
        const now = new Date().toISOString();
        const duplicatedPlan: LifestylePlan = {
          ...originalPlan,
          id: uuidv4(),
          name: `${originalPlan.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
          isFavorite: false,
        };
        
        state.plans.unshift(duplicatedPlan);
        saveToLocalStorage(state.plans);
      }
    },

    // Toggle favorite status
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const plan = state.plans.find(plan => plan.id === action.payload);
      if (plan) {
        plan.isFavorite = !plan.isFavorite;
        plan.updatedAt = new Date().toISOString();
        
        if (state.currentPlan?.id === action.payload) {
          state.currentPlan = plan;
        }
        
        saveToLocalStorage(state.plans);
      }
    },

    // Add tag to plan
    addTag: (state, action: PayloadAction<{ planId: string; tag: string }>) => {
      const { planId, tag } = action.payload;
      const plan = state.plans.find(plan => plan.id === planId);
      if (plan) {
        if (!plan.tags) plan.tags = [];
        if (!plan.tags.includes(tag)) {
          plan.tags.push(tag);
          plan.updatedAt = new Date().toISOString();
          saveToLocalStorage(state.plans);
        }
      }
    },

    // Remove tag from plan
    removeTag: (state, action: PayloadAction<{ planId: string; tag: string }>) => {
      const { planId, tag } = action.payload;
      const plan = state.plans.find(plan => plan.id === planId);
      if (plan && plan.tags) {
        plan.tags = plan.tags.filter(t => t !== tag);
        plan.updatedAt = new Date().toISOString();
        saveToLocalStorage(state.plans);
      }
    },

    // Set search term
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    // Set filter
    setFilter: (state, action: PayloadAction<'all' | 'favorites' | 'recent'>) => {
      state.filterBy = action.payload;
    },

    // Set sort
    setSortBy: (state, action: PayloadAction<'newest' | 'oldest' | 'name'>) => {
      state.sortBy = action.payload;
    },

    // Clear current plan
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all plans (for testing/reset)
    clearAllPlans: (state) => {
      state.plans = [];
      state.currentPlan = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lifestylePlans');
      }
    },
  },
});

export const {
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
} = plansSlice.actions;

export default plansSlice.reducer; 
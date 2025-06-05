'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LifestyleForm from '@/components/LifestyleForm';
import LifestylePlan from '@/components/LifestylePlan';
import PlansManager from '@/components/PlansManager';
import { generatePersonalizedPlan } from '@/utils/planGenerator';
import type { LifestylePlan as LifestylePlanType } from '@/types/lifestyle';
import { useAppSelector } from '@/store/hooks';
import { selectIsHydrated, selectPlans } from '@/store/selectors';
import { useKeyboardShortcuts, useFocusManagement } from '@/hooks/useKeyboardShortcuts';
import * as Yup from 'yup';

// Form validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  age: Yup.string().required('Age is required'),
  profession: Yup.string().required('Profession is required'),
  goals: Yup.array().min(1, 'Select at least one goal'),
  timeAvailable: Yup.string().required('Available time is required'),
  workStyle: Yup.string().required('Work style is required'),
  exerciseType: Yup.string().required('Exercise type is required'),
  hobbies: Yup.array().min(1, 'Select at least one hobby'),
  dietType: Yup.string().required('Diet type is required'),
  currentSkills: Yup.array(),
  learningStyle: Yup.string().required('Learning style is required'),
  motivationFactors: Yup.array(),
  currentChallenges: Yup.array(),
  preferredSchedule: Yup.string().required('Preferred schedule is required'),
  budget: Yup.string().required('Budget is required'),
  experience: Yup.string().required('Experience level is required')
});

interface FormValues {
  name: string;
  age: string;
  profession: string;
  goals: string[];
  timeAvailable: string;
  workStyle: string;
  exerciseType: string;
  hobbies: string[];
  dietType: string;
  currentSkills: string[];
  learningStyle: string;
  motivationFactors: string[];
  currentChallenges: string[];
  preferredSchedule: string;
  budget: string;
  experience: string;
}

type ViewMode = 'manage' | 'create' | 'view' | 'edit';

export default function Home() {
  const router = useRouter();
  const isHydrated = useAppSelector(selectIsHydrated);
  const plans = useAppSelector(selectPlans);
  const [currentPlan, setCurrentPlan] = useState<LifestylePlanType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('manage');

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onNavigateHome: () => setViewMode('manage'),
    onNavigateDashboard: () => {
      if (plans.length > 0) {
        router.push('/dashboard');
      }
    },
    onNavigateSettings: () => router.push('/settings'),
    onQuickEdit: () => {
      if (currentPlan && viewMode === 'view') {
        setViewMode('edit');
      }
    }
  });

  // Setup focus management
  useFocusManagement();

  const handleFormSubmit = (values: FormValues) => {
    const userProfile = {
      name: values.name,
      age: values.age,
      profession: values.profession,
      goals: values.goals,
      timeAvailable: values.timeAvailable,
      preferences: {
        workStyle: values.workStyle,
        exerciseType: values.exerciseType,
        hobbies: values.hobbies,
        dietType: values.dietType,
        learningStyle: values.learningStyle,
        preferredSchedule: values.preferredSchedule,
        budget: values.budget
      },
      currentSkills: values.currentSkills,
      motivationFactors: values.motivationFactors,
      currentChallenges: values.currentChallenges,
      experience: values.experience
    };

    const plan = generatePersonalizedPlan(userProfile);
    setCurrentPlan({
      id: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      ...plan,
    });
    setViewMode('view');
  };

  const handleCreateNew = () => {
    setCurrentPlan(null);
    setViewMode('create');
  };

  const handleViewPlan = (plan: LifestylePlanType) => {
    setCurrentPlan(plan);
    setViewMode('view');
  };

  const handleEditPlan = (plan: LifestylePlanType) => {
    setCurrentPlan(plan);
    setViewMode('edit');
  };

  const handleBackToManage = () => {
    setCurrentPlan(null);
    setViewMode('manage');
  };

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'manage') {
    return (
      <PlansManager
        onCreateNew={handleCreateNew}
        onViewPlan={handleViewPlan}
        onEditPlan={handleEditPlan}
      />
    );
  }

  if (viewMode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Plan</h1>
            <div className="flex gap-3">
              {plans.length > 0 && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  📊 Dashboard
                </button>
              )}
              <button
                onClick={handleBackToManage}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                ← Back to My Plans
              </button>
            </div>
          </div>
          <LifestyleForm
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
          />
        </div>
      </div>
    );
  }

  if ((viewMode === 'view' || viewMode === 'edit') && currentPlan) {
    return (
      <div className="min-h-screen">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {viewMode === 'edit' ? 'Edit Plan' : 'View Plan'}
              </h1>
              <div className="flex gap-3">
                {plans.length > 0 && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    📊 Dashboard
                  </button>
                )}
                <button
                  onClick={handleBackToManage}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  ← Back to My Plans
                </button>
              </div>
            </div>
          </div>
        </div>
        <LifestylePlan
          plan={currentPlan}
          onSave={handleBackToManage}
          isEditing={viewMode === 'edit'}
        />
      </div>
    );
  }

  return null;
}

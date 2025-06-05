'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import ProgressDashboard from '@/components/ProgressDashboard';
import DailyCheckIn from '@/components/DailyCheckIn';
import { useKeyboardShortcuts, useFocusManagement } from '@/hooks/useKeyboardShortcuts';

export default function DashboardPage() {
  const router = useRouter();
  const { plans } = useAppSelector(state => state.plans);
  const { currentTheme } = useAppSelector(state => state.tracking);
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onNavigateHome: () => router.push('/'),
    onNavigateDashboard: () => router.push('/dashboard'),
    onNavigateSettings: () => router.push('/settings'),
    onSearch: () => {
      // Focus search input if exists
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  // Setup focus management
  useFocusManagement();

  // Apply theme to document
  useEffect(() => {
    if (currentTheme) {
      document.documentElement.style.setProperty('--primary-color', currentTheme.colors.primary);
      document.documentElement.style.setProperty('--background-color', currentTheme.colors.background);
      document.documentElement.style.setProperty('--text-color', currentTheme.colors.text);
      
      // Add/remove dark class
      if (currentTheme.type === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [currentTheme]);

  // Redirect to home if no plans exist
  if (plans.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          backgroundColor: currentTheme?.colors.background,
          color: currentTheme?.colors.text 
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Plans Found</h1>
          <p className="mb-6" style={{ color: currentTheme?.colors.textSecondary }}>
            Create your first lifestyle plan to start tracking your progress.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: currentTheme?.colors.primary }}
          >
            Create Your First Plan
          </button>
        </div>
      </div>
    );
  }

  const currentPlan = plans[0]; // Use first plan or implement plan selection

  return (
    <div className="min-h-screen">
      {/* Header with Back to Home button */}
      <div 
        className="sticky top-0 z-10 border-b backdrop-blur-sm bg-opacity-90"
        style={{ 
          backgroundColor: currentTheme?.colors.background,
          borderColor: currentTheme?.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: currentTheme?.colors.surface,
                  border: `1px solid ${currentTheme?.colors.border}`,
                  color: currentTheme?.colors.text
                }}
              >
                ← Back to Home
              </button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: currentTheme?.colors.text }}>
                  Progress Dashboard
                </h1>
                <p className="text-sm" style={{ color: currentTheme?.colors.textSecondary }}>
                  Track your lifestyle goals and achievements
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs" style={{ color: currentTheme?.colors.textSecondary }}>
              <span>Press ? for shortcuts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <ProgressDashboard 
        planId={currentPlan.id} 
        userId={currentPlan.userProfile.name} 
      />
      <DailyCheckIn />
    </div>
  );
} 
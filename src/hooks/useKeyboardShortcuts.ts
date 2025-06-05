import { useHotkeys } from 'react-hotkeys-hook';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  startCheckIn, 
  toggleTheme, 
  setSelectedPeriod 
} from '@/store';
import type { KeyboardShortcut } from '@/types/tracking';

interface UseKeyboardShortcutsProps {
  onNavigateHome?: () => void;
  onNavigateDashboard?: () => void;
  onNavigateSettings?: () => void;
  onQuickEdit?: () => void;
  onSearch?: () => void;
}

export const useKeyboardShortcuts = (props: UseKeyboardShortcutsProps = {}) => {
  const dispatch = useAppDispatch();
  const { currentTheme, preferences } = useAppSelector(state => state.tracking);
  const { plans } = useAppSelector(state => state.plans);
  
  // Check if keyboard navigation is enabled
  const keyboardEnabled = preferences?.accessibility.keyboardNavigation !== false;

  // Navigation shortcuts
  useHotkeys('ctrl+1, cmd+1', () => {
    if (keyboardEnabled && props.onNavigateHome) {
      props.onNavigateHome();
    }
  }, { preventDefault: true });

  useHotkeys('ctrl+2, cmd+2', () => {
    if (keyboardEnabled && props.onNavigateDashboard) {
      props.onNavigateDashboard();
    }
  }, { preventDefault: true });

  useHotkeys('ctrl+3, cmd+3', () => {
    if (keyboardEnabled && props.onNavigateSettings) {
      props.onNavigateSettings();
    }
  }, { preventDefault: true });

  // Tracking shortcuts
  useHotkeys('ctrl+shift+c, cmd+shift+c', () => {
    if (keyboardEnabled && plans.length > 0) {
      const currentPlan = plans[0]; // Use first plan or current selected plan
      dispatch(startCheckIn({ 
        planId: currentPlan.id, 
        userId: currentPlan.userProfile.fullName 
      }));
    }
  }, { preventDefault: true });

  // Theme shortcuts
  useHotkeys('ctrl+shift+t, cmd+shift+t', () => {
    if (keyboardEnabled) {
      dispatch(toggleTheme());
    }
  }, { preventDefault: true });

  // Period selection shortcuts
  useHotkeys('ctrl+1', () => {
    if (keyboardEnabled) {
      dispatch(setSelectedPeriod('week'));
    }
  }, { preventDefault: true, scopes: ['dashboard'] });

  useHotkeys('ctrl+2', () => {
    if (keyboardEnabled) {
      dispatch(setSelectedPeriod('month'));
    }
  }, { preventDefault: true, scopes: ['dashboard'] });

  useHotkeys('ctrl+3', () => {
    if (keyboardEnabled) {
      dispatch(setSelectedPeriod('quarter'));
    }
  }, { preventDefault: true, scopes: ['dashboard'] });

  useHotkeys('ctrl+4', () => {
    if (keyboardEnabled) {
      dispatch(setSelectedPeriod('year'));
    }
  }, { preventDefault: true, scopes: ['dashboard'] });

  // Quick edit shortcuts
  useHotkeys('ctrl+e, cmd+e', () => {
    if (keyboardEnabled && props.onQuickEdit) {
      props.onQuickEdit();
    }
  }, { preventDefault: true });

  // Search shortcuts
  useHotkeys('ctrl+k, cmd+k', () => {
    if (keyboardEnabled && props.onSearch) {
      props.onSearch();
    }
  }, { preventDefault: true });

  // Help shortcuts
  useHotkeys('?, ctrl+/', () => {
    if (keyboardEnabled) {
      showShortcutsHelp();
    }
  }, { preventDefault: true });

  // Return available shortcuts for help display
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Ctrl+1',
      description: 'Navigate to Home',
      action: 'navigation',
      category: 'navigation'
    },
    {
      key: 'Ctrl+2',
      description: 'Navigate to Dashboard',
      action: 'navigation',
      category: 'navigation'
    },
    {
      key: 'Ctrl+3',
      description: 'Navigate to Settings',
      action: 'navigation',
      category: 'navigation'
    },
    {
      key: 'Ctrl+Shift+C',
      description: 'Quick Check-in',
      action: 'start_checkin',
      category: 'tracking'
    },
    {
      key: 'Ctrl+Shift+T',
      description: 'Toggle Theme',
      action: 'toggle_theme',
      category: 'general'
    },
    {
      key: 'Ctrl+E',
      description: 'Quick Edit',
      action: 'quick_edit',
      category: 'editing'
    },
    {
      key: 'Ctrl+K',
      description: 'Search',
      action: 'search',
      category: 'navigation'
    },
    {
      key: '?',
      description: 'Show Help',
      action: 'show_help',
      category: 'general'
    }
  ];

  const showShortcutsHelp = () => {
    // Create a modal or tooltip showing available shortcuts
    const helpModal = document.createElement('div');
    helpModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    helpModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
          <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="this.closest('.fixed').remove()">
            ✕
          </button>
        </div>
        <div class="space-y-3">
          ${shortcuts.map(shortcut => `
            <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span class="text-sm text-gray-600 dark:text-gray-300">${shortcut.description}</span>
              <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                ${shortcut.key}
              </kbd>
            </div>
          `).join('')}
        </div>
        <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Tip: Use Cmd instead of Ctrl on Mac
        </div>
      </div>
    `;
    
    // Apply theme styles
    if (currentTheme?.type === 'dark') {
      helpModal.classList.add('dark');
    }
    
    document.body.appendChild(helpModal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (helpModal.parentNode) {
        helpModal.remove();
      }
    }, 10000);
  };

  return {
    shortcuts,
    showShortcutsHelp,
    keyboardEnabled
  };
};

// Hook for focus management and accessibility
export const useFocusManagement = () => {
  const { preferences } = useAppSelector(state => state.tracking);
  const keyboardEnabled = preferences?.accessibility.keyboardNavigation !== false;

  // Tab navigation for custom components
  useHotkeys('tab', (e) => {
    if (!keyboardEnabled) return;
    
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const currentFocus = document.activeElement;
    const currentIndex = Array.from(focusableElements).indexOf(currentFocus as Element);
    
    if (e.shiftKey) {
      // Shift+Tab - previous element
      const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      (focusableElements[prevIndex] as HTMLElement)?.focus();
    } else {
      // Tab - next element
      const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
      (focusableElements[nextIndex] as HTMLElement)?.focus();
    }
  }, { preventDefault: false });

  // Escape key to close modals
  useHotkeys('escape', () => {
    if (!keyboardEnabled) return;
    
    // Close any open modals
    const modals = document.querySelectorAll('[role="dialog"], .modal, .fixed.inset-0');
    const topModal = modals[modals.length - 1] as HTMLElement;
    
    if (topModal) {
      // Try to find a close button
      const closeButton = topModal.querySelector('[aria-label="Close"], [data-close], .close') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      } else {
        // Remove modal if no close button found
        topModal.remove();
      }
    }
  }, { preventDefault: true });

  // Arrow key navigation for lists and grids
  const handleArrowNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!keyboardEnabled) return;
    
    const currentFocus = document.activeElement as HTMLElement;
    const container = currentFocus?.closest('[data-keyboard-nav]');
    
    if (!container) return;
    
    const items = container.querySelectorAll('[data-nav-item]');
    const currentIndex = Array.from(items).indexOf(currentFocus);
    
    if (currentIndex === -1) return;
    
    let targetIndex = currentIndex;
    const gridCols = parseInt(container.getAttribute('data-grid-cols') || '1');
    
    switch (direction) {
      case 'up':
        targetIndex = Math.max(0, currentIndex - gridCols);
        break;
      case 'down':
        targetIndex = Math.min(items.length - 1, currentIndex + gridCols);
        break;
      case 'left':
        targetIndex = Math.max(0, currentIndex - 1);
        break;
      case 'right':
        targetIndex = Math.min(items.length - 1, currentIndex + 1);
        break;
    }
    
    (items[targetIndex] as HTMLElement)?.focus();
  };

  useHotkeys('up', () => handleArrowNavigation('up'), { preventDefault: true });
  useHotkeys('down', () => handleArrowNavigation('down'), { preventDefault: true });
  useHotkeys('left', () => handleArrowNavigation('left'), { preventDefault: true });
  useHotkeys('right', () => handleArrowNavigation('right'), { preventDefault: true });

  return {
    keyboardEnabled,
    handleArrowNavigation
  };
};

// Hook for drag and drop keyboard alternatives
export const useKeyboardDragDrop = () => {
  const { preferences } = useAppSelector(state => state.tracking);
  const keyboardEnabled = preferences?.accessibility.keyboardNavigation !== false;

  // Space to select item for moving
  useHotkeys('space', (e) => {
    if (!keyboardEnabled) return;
    
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus?.hasAttribute('data-draggable')) {
      e.preventDefault();
      
      // Toggle selection
      const isSelected = currentFocus.hasAttribute('data-selected');
      if (isSelected) {
        currentFocus.removeAttribute('data-selected');
        currentFocus.style.outline = '';
      } else {
        // Clear other selections
        document.querySelectorAll('[data-selected]').forEach(el => {
          el.removeAttribute('data-selected');
          (el as HTMLElement).style.outline = '';
        });
        
        currentFocus.setAttribute('data-selected', 'true');
        currentFocus.style.outline = '2px solid blue';
      }
    }
  }, { preventDefault: false });

  // Enter to drop selected item
  useHotkeys('enter', (e) => {
    if (!keyboardEnabled) return;
    
    const selected = document.querySelector('[data-selected]') as HTMLElement;
    const currentFocus = document.activeElement as HTMLElement;
    
    if (selected && currentFocus?.hasAttribute('data-drop-zone') && selected !== currentFocus) {
      e.preventDefault();
      
      // Simulate drop
      const dropEvent = new CustomEvent('keyboardDrop', {
        detail: {
          draggable: selected,
          dropZone: currentFocus
        }
      });
      
      currentFocus.dispatchEvent(dropEvent);
      
      // Clear selection
      selected.removeAttribute('data-selected');
      selected.style.outline = '';
    }
  }, { preventDefault: false });

  return {
    keyboardEnabled
  };
}; 
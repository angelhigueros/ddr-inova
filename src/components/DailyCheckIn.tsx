'use client';

import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  updateCheckIn, 
  saveCheckIn, 
  cancelCheckIn,
  unlockAchievement 
} from '@/store';
import type { 
  CompletedActivity, 
  ProgressPhoto, 
} from '@/types/tracking';

const DailyCheckIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentCheckIn, isCheckingIn, currentTheme } = useAppSelector(state => state.tracking);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [newWin, setNewWin] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  if (!isCheckingIn || !currentCheckIn) {
    return null;
  }

  const totalSteps = 5;

  const handleSliderChange = (field: 'mood' | 'energy' | 'productivity' | 'stress', value: number) => {
    dispatch(updateCheckIn({ [field]: value }));
  };

  const handleNotesChange = (notes: string) => {
    dispatch(updateCheckIn({ notes }));
  };

  const addWin = () => {
    if (newWin.trim()) {
      const updatedWins = [...currentCheckIn.wins, newWin.trim()];
      dispatch(updateCheckIn({ wins: updatedWins }));
      setNewWin('');
    }
  };

  const removeWin = (index: number) => {
    const updatedWins = currentCheckIn.wins.filter((_, i) => i !== index);
    dispatch(updateCheckIn({ wins: updatedWins }));
  };

  const addChallenge = () => {
    if (newChallenge.trim()) {
      const updatedChallenges = [...currentCheckIn.challenges, newChallenge.trim()];
      dispatch(updateCheckIn({ challenges: updatedChallenges }));
      setNewChallenge('');
    }
  };

  const removeChallenge = (index: number) => {
    const updatedChallenges = currentCheckIn.challenges.filter((_, i) => i !== index);
    dispatch(updateCheckIn({ challenges: updatedChallenges }));
  };

  const toggleActivity = (activityId: string) => {
    const updatedActivities = currentCheckIn.completedActivities.map(activity =>
      activity.id === activityId 
        ? { ...activity, completed: !activity.completed }
        : activity
    );
    dispatch(updateCheckIn({ completedActivities: updatedActivities }));
  };

  const addActivity = (type: 'professional' | 'fitness' | 'hobby' | 'nutrition', name: string) => {
    const newActivity: CompletedActivity = {
      id: `activity-${Date.now()}`,
      activityType: type,
      activityName: name,
      completed: false,
      timestamp: new Date().toISOString()
    };
    
    const updatedActivities = [...currentCheckIn.completedActivities, newActivity];
    dispatch(updateCheckIn({ completedActivities: updatedActivities }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setSelectedPhotos(prev => [...prev, ...newFiles]);
      
      // Convert files to progress photos (in real app, you'd upload to server)
      const newPhotos: ProgressPhoto[] = newFiles.map(file => ({
        id: `photo-${Date.now()}-${Math.random()}`,
        type: 'general',
        url: URL.createObjectURL(file),
        caption: '',
        tags: [],
        timestamp: new Date().toISOString()
      }));
      
      const updatedPhotos = [...currentCheckIn.progressPhotos, ...newPhotos];
      dispatch(updateCheckIn({ progressPhotos: updatedPhotos }));
    }
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = currentCheckIn.progressPhotos.filter(photo => photo.id !== photoId);
    dispatch(updateCheckIn({ progressPhotos: updatedPhotos }));
    
    // Also remove from selectedPhotos if needed
    setSelectedPhotos(prev => prev.filter((_, index) => 
      currentCheckIn.progressPhotos[index]?.id !== photoId
    ));
  };

  const handleSave = () => {
    dispatch(saveCheckIn());
    
    // Check for achievements
    const completedCount = currentCheckIn.completedActivities.filter(a => a.completed).length;
    if (completedCount >= 5) {
      dispatch(unlockAchievement({
        name: 'Super Productive',
        description: 'Completed 5+ activities in a single day',
        icon: '⭐',
        category: 'completion'
      }));
    }
    
    if (currentCheckIn.mood >= 8) {
      dispatch(unlockAchievement({
        name: 'Great Mood',
        description: 'Maintained a mood rating of 8+ for the day',
        icon: '😊',
        category: 'improvement'
      }));
    }
  };

  const getSliderColor = (value: number) => {
    if (value >= 8) return currentTheme?.colors.success || '#10B981';
    if (value >= 6) return currentTheme?.colors.warning || '#F59E0B';
    if (value >= 4) return currentTheme?.colors.accent || '#F59E0B';
    return currentTheme?.colors.error || '#EF4444';
  };

  const getEmoji = (field: string, value: number) => {
    const emojis = {
      mood: ['😢', '😞', '😐', '😐', '🙂', '🙂', '😊', '😊', '😄', '🤩'],
      energy: ['😴', '😪', '😑', '😑', '🙂', '🙂', '😊', '😊', '⚡', '🔥'],
      productivity: ['📉', '📉', '📊', '📊', '📈', '📈', '🚀', '🚀', '💪', '🏆'],
      stress: ['😌', '😌', '🙂', '🙂', '😐', '😐', '😰', '😰', '😫', '🤯']
    };
    return emojis[field as keyof typeof emojis]?.[value - 1] || '🙂';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
            
            {/* Mood */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Mood</label>
                <span className="text-2xl">{getEmoji('mood', currentCheckIn.mood)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentCheckIn.mood}
                  onChange={(e) => handleSliderChange('mood', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${getSliderColor(currentCheckIn.mood)} 0%, ${getSliderColor(currentCheckIn.mood)} ${currentCheckIn.mood * 10}%, ${currentTheme?.colors.border} ${currentCheckIn.mood * 10}%, ${currentTheme?.colors.border} 100%)`
                  }}
                />
                <div className="flex justify-between text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                  <span>1</span>
                  <span className="font-medium">{currentCheckIn.mood}/10</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Energy</label>
                <span className="text-2xl">{getEmoji('energy', currentCheckIn.energy)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentCheckIn.energy}
                  onChange={(e) => handleSliderChange('energy', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${getSliderColor(currentCheckIn.energy)} 0%, ${getSliderColor(currentCheckIn.energy)} ${currentCheckIn.energy * 10}%, ${currentTheme?.colors.border} ${currentCheckIn.energy * 10}%, ${currentTheme?.colors.border} 100%)`
                  }}
                />
                <div className="flex justify-between text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                  <span>1</span>
                  <span className="font-medium">{currentCheckIn.energy}/10</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Productivity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Productivity</label>
                <span className="text-2xl">{getEmoji('productivity', currentCheckIn.productivity)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentCheckIn.productivity}
                  onChange={(e) => handleSliderChange('productivity', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${getSliderColor(currentCheckIn.productivity)} 0%, ${getSliderColor(currentCheckIn.productivity)} ${currentCheckIn.productivity * 10}%, ${currentTheme?.colors.border} ${currentCheckIn.productivity * 10}%, ${currentTheme?.colors.border} 100%)`
                  }}
                />
                <div className="flex justify-between text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                  <span>1</span>
                  <span className="font-medium">{currentCheckIn.productivity}/10</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Stress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Stress Level</label>
                <span className="text-2xl">{getEmoji('stress', currentCheckIn.stress)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentCheckIn.stress}
                  onChange={(e) => handleSliderChange('stress', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${getSliderColor(10 - currentCheckIn.stress + 1)} 0%, ${getSliderColor(10 - currentCheckIn.stress + 1)} ${currentCheckIn.stress * 10}%, ${currentTheme?.colors.border} ${currentCheckIn.stress * 10}%, ${currentTheme?.colors.border} 100%)`
                  }}
                />
                <div className="flex justify-between text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                  <span>1</span>
                  <span className="font-medium">{currentCheckIn.stress}/10</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Activity Completion</h3>
            <p style={{ color: currentTheme?.colors.textSecondary }}>
              Mark the activities you completed today:
            </p>
            
            <div className="space-y-4">
              {currentCheckIn.completedActivities.length === 0 ? (
                <div className="text-center py-8" style={{ color: currentTheme?.colors.textSecondary }}>
                  <p>No activities added yet.</p>
                  <p className="text-sm mt-2">Add some activities below to track your progress!</p>
                </div>
              ) : (
                currentCheckIn.completedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: activity.completed 
                        ? `${currentTheme?.colors.success}20` 
                        : currentTheme?.colors.surface,
                      border: `1px solid ${activity.completed 
                        ? currentTheme?.colors.success 
                        : currentTheme?.colors.border}`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          activity.completed ? 'text-white' : ''
                        }`}
                        style={{ 
                          backgroundColor: activity.completed 
                            ? currentTheme?.colors.success 
                            : 'transparent',
                          border: `2px solid ${currentTheme?.colors.success}`
                        }}
                      >
                        {activity.completed && '✓'}
                      </button>
                      <div>
                        <div className="font-medium">{activity.activityName}</div>
                        <div className="text-sm capitalize" style={{ color: currentTheme?.colors.textSecondary }}>
                          {activity.activityType}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm" style={{ color: currentTheme?.colors.textSecondary }}>
                      {activity.duration && `${activity.duration} min`}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Activities */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => addActivity('fitness', 'Workout Session')}
                className="p-3 rounded-lg border-2 border-dashed transition-colors hover:opacity-80"
                style={{ 
                  borderColor: currentTheme?.colors.success,
                  color: currentTheme?.colors.success
                }}
              >
                + Add Fitness
              </button>
              <button
                onClick={() => addActivity('professional', 'Work Task')}
                className="p-3 rounded-lg border-2 border-dashed transition-colors hover:opacity-80"
                style={{ 
                  borderColor: currentTheme?.colors.primary,
                  color: currentTheme?.colors.primary
                }}
              >
                + Add Work
              </button>
              <button
                onClick={() => addActivity('hobby', 'Hobby Time')}
                className="p-3 rounded-lg border-2 border-dashed transition-colors hover:opacity-80"
                style={{ 
                  borderColor: currentTheme?.colors.warning,
                  color: currentTheme?.colors.warning
                }}
              >
                + Add Hobby
              </button>
              <button
                onClick={() => addActivity('nutrition', 'Healthy Meal')}
                className="p-3 rounded-lg border-2 border-dashed transition-colors hover:opacity-80"
                style={{ 
                  borderColor: currentTheme?.colors.secondary,
                  color: currentTheme?.colors.secondary
                }}
              >
                + Add Nutrition
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Progress Photos</h3>
            <p style={{ color: currentTheme?.colors.textSecondary }}>
              Capture your progress with photos (optional)
            </p>

            {/* Photo Upload */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:opacity-80 cursor-pointer"
              style={{ borderColor: currentTheme?.colors.border }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-4xl mb-2">📷</div>
              <div className="font-medium">Click to upload photos</div>
              <div className="text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                JPG, PNG up to 10MB each
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoUpload(e.target.files)}
              className="hidden"
            />

            {/* Photo Preview */}
            {currentCheckIn.progressPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentCheckIn.progressPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt="Progress"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Daily Reflection</h3>
            
            {/* Wins */}
            <div className="space-y-4">
              <div>
                <label className="text-lg font-medium">Today's Wins 🎉</label>
                <p className="text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                  What went well today? Celebrate your achievements!
                </p>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWin}
                  onChange={(e) => setNewWin(e.target.value)}
                  placeholder="Add a win..."
                  className="flex-1 px-4 py-2 rounded-lg border transition-colors"
                  style={{ 
                    backgroundColor: currentTheme?.colors.surface,
                    border: `1px solid ${currentTheme?.colors.border}`,
                    color: currentTheme?.colors.text
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addWin()}
                />
                <button
                  onClick={addWin}
                  className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: currentTheme?.colors.success }}
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {currentCheckIn.wins.map((win, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${currentTheme?.colors.success}20` }}
                  >
                    <span>🎉 {win}</span>
                    <button
                      onClick={() => removeWin(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="space-y-4">
              <div>
                <label className="text-lg font-medium">Challenges Faced 💪</label>
                <p className="text-sm mt-1" style={{ color: currentTheme?.colors.textSecondary }}>
                  What was difficult today? Learning opportunities!
                </p>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  placeholder="Add a challenge..."
                  className="flex-1 px-4 py-2 rounded-lg border transition-colors"
                  style={{ 
                    backgroundColor: currentTheme?.colors.surface,
                    border: `1px solid ${currentTheme?.colors.border}`,
                    color: currentTheme?.colors.text
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
                />
                <button
                  onClick={addChallenge}
                  className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: currentTheme?.colors.warning }}
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {currentCheckIn.challenges.map((challenge, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${currentTheme?.colors.warning}20` }}
                  >
                    <span>💪 {challenge}</span>
                    <button
                      onClick={() => removeChallenge(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Additional Notes</h3>
            
            <div>
              <label className="text-lg font-medium">Daily Journal 📝</label>
              <p className="text-sm mt-1 mb-3" style={{ color: currentTheme?.colors.textSecondary }}>
                Any additional thoughts, insights, or plans for tomorrow?
              </p>
              <textarea
                value={currentCheckIn.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Write your thoughts here..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                style={{ 
                  backgroundColor: currentTheme?.colors.surface,
                  border: `1px solid ${currentTheme?.colors.border}`,
                  color: currentTheme?.colors.text
                }}
              />
            </div>

            {/* Summary */}
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: currentTheme?.colors.surface }}
            >
              <h4 className="font-semibold mb-3">Today's Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: currentTheme?.colors.textSecondary }}>Mood:</span>
                  <span className="ml-2 font-medium">{currentCheckIn.mood}/10 {getEmoji('mood', currentCheckIn.mood)}</span>
                </div>
                <div>
                  <span style={{ color: currentTheme?.colors.textSecondary }}>Energy:</span>
                  <span className="ml-2 font-medium">{currentCheckIn.energy}/10 {getEmoji('energy', currentCheckIn.energy)}</span>
                </div>
                <div>
                  <span style={{ color: currentTheme?.colors.textSecondary }}>Activities:</span>
                  <span className="ml-2 font-medium">
                    {currentCheckIn.completedActivities.filter(a => a.completed).length}/{currentCheckIn.completedActivities.length}
                  </span>
                </div>
                <div>
                  <span style={{ color: currentTheme?.colors.textSecondary }}>Photos:</span>
                  <span className="ml-2 font-medium">{currentCheckIn.progressPhotos.length}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{ backgroundColor: currentTheme?.colors.background }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: currentTheme?.colors.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: currentTheme?.colors.text }}>
                Daily Check-in
              </h2>
              <p style={{ color: currentTheme?.colors.textSecondary }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => dispatch(cancelCheckIn())}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              style={{ color: currentTheme?.colors.textSecondary }}
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span style={{ color: currentTheme?.colors.textSecondary }}>
                Step {currentStep} of {totalSteps}
              </span>
              <span style={{ color: currentTheme?.colors.textSecondary }}>
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div 
              className="w-full h-2 rounded-full"
              style={{ backgroundColor: currentTheme?.colors.border }}
            >
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${(currentStep / totalSteps) * 100}%`,
                  backgroundColor: currentTheme?.colors.primary
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t flex items-center justify-between"
          style={{ borderColor: currentTheme?.colors.border }}
        >
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:opacity-80'
            }`}
            style={{ 
              backgroundColor: currentTheme?.colors.surface,
              border: `1px solid ${currentTheme?.colors.border}`,
              color: currentTheme?.colors.text
            }}
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i + 1 === currentStep 
                    ? 'ring-2 ring-offset-2' 
                    : ''
                }`}
                style={{ 
                  backgroundColor: i + 1 <= currentStep 
                    ? currentTheme?.colors.primary 
                    : currentTheme?.colors.border,
                  ringColor: currentTheme?.colors.primary
                }}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: currentTheme?.colors.primary }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: currentTheme?.colors.success }}
            >
              Complete Check-in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn; 
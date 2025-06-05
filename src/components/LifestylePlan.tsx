import { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Star, 
  TrendingUp, 
  Calendar,
  Award,
  BookOpen,
  Dumbbell,
  Palette,
  UtensilsCrossed,
  BarChart3,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  Edit3,
  Wand2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createPlan, updatePlan } from '@/store/plansSlice';
import { analyzeFeedback, applyAdjustmentsToPlan, type FeedbackAnalysis } from '@/utils/feedbackAnalyzer';
import type { LifestylePlan as LifestylePlanType } from '@/types/lifestyle';

interface Props {
  plan: LifestylePlanType;
  onFeedback?: (feedback: string) => void;
  onSave?: () => void;
  isEditing?: boolean;
}

export default function LifestylePlan({ plan, onFeedback, onSave, isEditing = false }: Props) {
  const dispatch = useAppDispatch();
  const [feedback, setFeedback] = useState(plan.feedback || '');
  const [activeTab, setActiveTab] = useState('insights');
  const [planName, setPlanName] = useState(plan.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adjustedPlan, setAdjustedPlan] = useState<LifestylePlanType | null>(null);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use adjusted plan if available, otherwise use original plan
  const currentPlan = adjustedPlan || plan;

  const handleAnalyzeFeedback = async () => {
    if (!feedback.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = analyzeFeedback(feedback, plan);
      setFeedbackAnalysis(analysis);
      
      if (analysis.adjustments.length > 0) {
        const newPlan = applyAdjustmentsToPlan(plan, analysis.adjustments);
        setAdjustedPlan(newPlan);
        setShowAdjustments(true);
      }
    } catch (error) {
      console.error('Error analyzing feedback:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptAdjustments = () => {
    if (adjustedPlan) {
      // Save the adjusted plan
      if (isEditing && plan.id) {
        dispatch(updatePlan({
          id: plan.id,
          updates: { 
            ...adjustedPlan,
            feedback,
            updatedAt: new Date().toISOString()
          }
        }));
      } else {
        dispatch(createPlan({
          plan: { ...adjustedPlan, feedback },
          name: planName
        }));
      }
      
      setShowAdjustments(false);
      if (onSave) onSave();
    }
  };

  const handleRejectAdjustments = () => {
    setAdjustedPlan(null);
    setFeedbackAnalysis(null);
    setShowAdjustments(false);
  };

  const handleSubmitFeedback = () => {
    if (isEditing && plan.id) {
      // Update existing plan with feedback only
      dispatch(updatePlan({
        id: plan.id,
        updates: { feedback }
      }));
    } else {
      // Create new plan with feedback
      dispatch(createPlan({
        plan: { ...plan, feedback },
        name: planName
      }));
    }
    
    if (onFeedback) {
      onFeedback(feedback);
    }
    
    setFeedback('');
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    
    try {
      if (isEditing && plan.id) {
        // Update existing plan
        dispatch(updatePlan({
          id: plan.id,
          updates: { 
            name: planName,
            feedback: feedback
          }
        }));
      } else {
        // Create new plan
        dispatch(createPlan({
          plan: { ...plan, feedback },
          name: planName
        }));
      }
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePlanName = () => {
    if (isEditing && plan.id && planName.trim()) {
      dispatch(updatePlan({
        id: plan.id,
        updates: { name: planName.trim() }
      }));
    }
    setIsEditingName(false);
  };

  const tabs = [
    { id: 'insights', label: 'Personalized Insights', icon: <Star className="w-5 h-5" />, step: 1 },
    { id: 'professional', label: 'Professional', icon: <BookOpen className="w-5 h-5" />, step: 2 },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-5 h-5" />, step: 3 },
    { id: 'hobbies', label: 'Hobbies', icon: <Palette className="w-5 h-5" />, step: 4 },
    { id: 'nutrition', label: 'Nutrition', icon: <UtensilsCrossed className="w-5 h-5" />, step: 5 },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" />, step: 6 },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-5 h-5" />, step: 7 },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  // Generate personalized strengths based on user profile
  const generatePersonalizedStrengths = () => {
    const strengths = [...currentPlan.personalizedInsights.strengths];
    const userProfile = currentPlan.userProfile;
    
    // Add strengths based on specific goals
    userProfile.goals.forEach(goal => {
      switch(goal) {
        case 'Advance in my professional career':
          strengths.push('Professional ambition and long-term growth vision');
          break;
        case 'Improve my physical condition':
          strengths.push('Commitment to personal wellness and comprehensive health');
          break;
        case 'Develop new technical skills':
          strengths.push('Growth mindset and technological adaptability');
          break;
        case 'Learn a new language':
          strengths.push('Cultural openness and global communication capacity');
          break;
        case 'Develop leadership skills':
          strengths.push('Leadership vision and positive influence capacity');
          break;
        case 'Create my own business':
          strengths.push('Entrepreneurial spirit and calculated risk tolerance');
          break;
        case 'Learn creative skills':
          strengths.push('Innate creativity and artistic expression');
          break;
      }
    });

    // Add strengths based on current skills
    userProfile.currentSkills.forEach(skill => {
      switch(skill) {
        case 'Leadership':
          strengths.push('Already developed natural leadership capabilities');
          break;
        case 'Effective communication':
          strengths.push('Solid communication skills for professional growth');
          break;
        case 'Programming':
          strengths.push('Solid technical foundation in development and computational logic');
          break;
        case 'Creativity and innovation':
          strengths.push('Innovative thinking and capacity to generate unique solutions');
          break;
        case 'Data analysis':
          strengths.push('Analytical capacity and data-driven decision making');
          break;
      }
    });

    // Add strengths based on hobbies
    userProfile.preferences.hobbies.forEach(hobby => {
      switch(hobby) {
        case 'Reading and writing':
          strengths.push('Intellectual curiosity and deep analysis capacity');
          break;
        case 'Music (playing instruments)':
          strengths.push('Practice discipline and developed artistic sensitivity');
          break;
        case 'Programming as hobby':
          strengths.push('Genuine passion for technology beyond work');
          break;
        case 'Yoga and meditation':
          strengths.push('Body awareness and emotional self-regulation capacity');
          break;
        case 'Cooking and gastronomy':
          strengths.push('Practical creativity and meticulous attention to detail');
          break;
      }
    });
    
    // Add strengths based on profession
    if (userProfile.profession.toLowerCase().includes('programmer') || userProfile.profession.toLowerCase().includes('developer')) {
      strengths.push('Logical thinking and systematic resolution of complex problems');
      strengths.push('Adaptability to new technologies and emerging frameworks');
    } else if (userProfile.profession.toLowerCase().includes('teacher') || userProfile.profession.toLowerCase().includes('educator')) {
      strengths.push('Pedagogical skills and knowledge transfer capacity');
      strengths.push('Patience and methodological structuring of learning');
    } else if (userProfile.profession.toLowerCase().includes('designer')) {
      strengths.push('Aesthetic sensitivity and developed visual thinking');
      strengths.push('Conceptualization capacity and idea materialization');
    } else if (userProfile.profession.toLowerCase().includes('manager')) {
      strengths.push('Organizational skills and multidisciplinary team coordination');
      strengths.push('Strategic vision and complex decision-making capacity');
    }
    
    // Add strengths based on motivation factors
    userProfile.motivationFactors.forEach(factor => {
      switch(factor) {
        case 'Continuous learning':
          strengths.push('Insatiable thirst for knowledge and constant improvement');
          break;
        case 'Autonomy and independence':
          strengths.push('Self-discipline and exceptional self-motivation capacity');
          break;
        case 'Positive social impact':
          strengths.push('Social consciousness and service-oriented towards others');
          break;
        case 'Intellectual challenges':
          strengths.push('Natural attraction to complex and stimulating problems');
          break;
      }
    });
    
    // Remove duplicates and limit
    return [...new Set(strengths)].slice(0, 8);
  };

  // Generate personalized tips based on user profile
  const generatePersonalizedTips = () => {
    const baseTips = [...currentPlan.personalizedInsights.personalityBasedTips];
    const userProfile = currentPlan.userProfile;
    const age = userProfile.age;
    const timeAvailable = userProfile.timeAvailable;
    
    // Tips based on specific goals
    userProfile.goals.forEach(goal => {
      switch(goal) {
        case 'Advance in my professional career':
          baseTips.push(`As a ${userProfile.profession.toLowerCase()}, focus on developing the most in-demand skills in your industry. Create a 5-year career plan with specific milestones every 6 months.`);
          break;
        case 'Improve my physical condition':
          baseTips.push(`With your preference for ${userProfile.preferences.exerciseType}, design a progressive routine that adapts to your ${userProfile.preferences.preferredSchedule} schedule. Consistency beats intensity.`);
          break;
        case 'Develop new technical skills':
          baseTips.push(`Leverage your ${userProfile.preferences.learningStyle} learning style to master a new skill each quarter. Practice the 80/20 rule: 80% fundamentals, 20% experimentation.`);
          break;
        case 'Learn a new language':
          baseTips.push(`With ${userProfile.timeAvailable} available, dedicate at least 15-20 minutes daily to conversational practice. Partial immersion is more effective than sporadic long sessions.`);
          break;
        case 'Develop leadership skills':
          baseTips.push('Seek opportunities to lead small projects in your current job. Leadership develops through practice, not just studying theory.');
          break;
      }
    });

    // Tips based on current challenges
    userProfile.currentChallenges.forEach(challenge => {
      switch(challenge) {
        case 'Lack of time':
          baseTips.push(`To overcome the lack of time, implement time-blocking in your ${userProfile.preferences.preferredSchedule} schedule. Schedule your priorities as if they were important medical appointments.`);
          if (userProfile.timeAvailable === '1-3 hours') {
            baseTips.push('With limited time, use the 15-minute rule: dedicate just 15 minutes daily to each important area. It\'s surprising how much you can accomplish.');
          }
          break;
        case 'Procrastination':
          baseTips.push('Combat procrastination with the 2-minute rule: if something takes less than 2 minutes, do it immediately. For larger tasks, commit to just 5 minutes to start.');
          break;
        case 'Lack of motivation':
          baseTips.push('Create a "motivation ritual": before starting any activity, remember your "why" and visualize the desired result. Connect your actions with your deeper values.');
          break;
      }
    });

    // Tips based on learning style and schedule
    switch(userProfile.preferences.learningStyle) {
      case 'visual':
        baseTips.push(`As a visual learner, create mind maps and diagrams of your goals. Use colors and symbols to make information more memorable and accessible.`);
        break;
      case 'auditory':
        baseTips.push(`Take advantage of your ${userProfile.preferences.preferredSchedule} time to listen to educational podcasts. Record voice notes to review important concepts.`);
        break;
      case 'kinesthetic':
        baseTips.push('Your kinesthetic style needs action. Immediately practice what you learn and seek hands-on projects to consolidate knowledge.');
        break;
      case 'reading':
        baseTips.push(`Combine your love for reading with your hobbies: ${userProfile.preferences.hobbies.slice(0, 2).join(' and ')}. Create written summaries of what you learn.`);
        break;
    }

    // Tips based on budget and goals
    const budget = userProfile.preferences.budget;
    if (budget === '0-50') {
      baseTips.push('With limited budget, focus on high-quality free resources: YouTube, podcasts, public libraries, and online communities. Time investment can surpass money investment.');
    } else if (budget === '500+') {
      baseTips.push('With higher budget available, consider personalized coaching or premium courses that accelerate your progress. Invest in quality tools you use daily.');
    }

    // Tips based on experience level
    switch(userProfile.experience) {
      case 'beginner':
        baseTips.push('As a beginner, focus on building small but consistent habits. Don\'t try to change everything at once - choose 1-2 areas maximum to start.');
        break;
      case 'intermediate':
        baseTips.push('With your intermediate experience, you can handle more complex challenges. Consider teaching others what you\'ve learned - it will reinforce your own knowledge.');
        break;
      case 'advanced':
        baseTips.push('With your advanced experience, focus on optimization and helping others. Consider becoming a mentor or guide for beginners in your areas of expertise.');
        break;
    }

    // Tips based on specific hobby combinations
    const hasCreativeHobbies = userProfile.preferences.hobbies.some(h => 
      h.includes('Music') || h.includes('Painting') || h.includes('Photography') || h.includes('Writing')
    );
    const hasTechHobbies = userProfile.preferences.hobbies.some(h => 
      h.includes('Programming') || h.includes('Video games')
    );

    if (hasCreativeHobbies && hasTechHobbies) {
      baseTips.push('Your combination of creative and technical hobbies is unique. Consider projects that fuse both: game development, digital art, or creative applications.');
    }

    // Remove duplicates and limit
    return [...new Set(baseTips)].slice(0, 10);
  };

  const personalizedStrengths = generatePersonalizedStrengths();
  const personalizedTips = generatePersonalizedTips();

  return (
    <div className="bg-white shadow-lg sm:rounded-xl overflow-hidden">
      {/* Header with Plan Name */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="bg-white/90 text-purple-900 px-3 py-2 rounded-lg font-semibold text-xl flex-1"
                  onBlur={handleUpdatePlanName}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdatePlanName()}
                  autoFocus
                />
                <button
                  onClick={handleUpdatePlanName}
                  className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {planName || `${plan.userProfile.name}'s Plan`}
                </h1>
                {isEditing && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="bg-white/20 text-white p-1 rounded hover:bg-white/30 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <p className="text-purple-100 mt-1">
              For: {plan.userProfile.name} • {plan.userProfile.profession}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSavePlan}
              disabled={isSaving}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Save Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Plan Progress - Step {currentTabIndex + 1} of {tabs.length}
          </h2>
          
          {/* Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {tabs.map((tab, index) => (
                <div key={tab.id} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 cursor-pointer
                      ${index <= currentTabIndex 
                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg scale-110' 
                        : 'bg-white border-gray-300 text-gray-400 hover:border-purple-300'
                      }
                      ${activeTab === tab.id ? 'ring-4 ring-purple-200' : ''}
                    `}
                  >
                    {index < currentTabIndex ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      tab.icon
                    )}
                  </button>
                  <span className={`
                    text-xs mt-2 text-center max-w-20 leading-tight font-medium
                    ${index <= currentTabIndex ? 'text-purple-700' : 'text-gray-500'}
                  `}>
                    {tab.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -z-0">
              <div 
                className="h-full bg-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${(currentTabIndex / (tabs.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevTab}
              disabled={currentTabIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentTabIndex + 1} / {tabs.length}</span>
            </div>
            
            <button
              onClick={goToNextTab}
              disabled={currentTabIndex === tabs.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'insights' && (
          <div className="space-y-8">
            {adjustedPlan && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Adjusted Plan</span>
                </div>
                <p className="text-sm text-green-700">
                  This plan has been adjusted based on your feedback to better adapt to your needs.
                </p>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Insights</h3>
              <p className="text-gray-600">Based on your profile and goals</p>
            </div>

            {/* Use currentPlan for all data */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths using currentPlan */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Strengths
                </h4>
                <div className="space-y-3">
                  {generatePersonalizedStrengths().map((strength, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-green-700 font-medium">{strength}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Leverage this strength
                            </span>
                            {index < 3 && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                Key strength
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>💡 Based on your profile:</strong> As a {plan.userProfile.profession.toLowerCase()}, with {plan.userProfile.timeAvailable} available weekly, these strengths will give you competitive advantage in your goals.
                  </p>
                </div>
                
                {/* Strength utilization suggestions */}
                <div className="mt-4 space-y-2">
                  <h5 className="text-sm font-semibold text-green-800">🚀 How to leverage your strengths:</h5>
                  <div className="grid gap-2">
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>At work:</strong> Highlight these strengths on your CV and LinkedIn. Use them as foundation to lead projects.
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>For new skills:</strong> Connect new learning with these existing strengths.
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>In networking:</strong> Offer help in areas where you're strong, creating valuable relationships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Improvement Areas
                </h4>
                <div className="space-y-3">
                  {currentPlan.personalizedInsights.improvementAreas.map((area, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-blue-700 font-medium">{area}</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Priority: {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(10, 30 - (index * 10))}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-blue-600">
                              Initial progress: Define action plan
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>🎯 Action plan:</strong> Focus on one area at a time. Small consistent steps generate big changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Personalized Tips */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="text-xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Personalized Tips
              </h4>
              
              {/* User profile context */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  <strong>Personalized for:</strong> {currentPlan.userProfile.name}, {currentPlan.userProfile.age}, {currentPlan.userProfile.profession} | 
                  <strong> Available time:</strong> {currentPlan.userProfile.timeAvailable} | 
                  <strong> Style:</strong> {currentPlan.userProfile.preferences.workStyle}
                </p>
              </div>
              
              <div className="grid gap-4">
                {personalizedTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 relative">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-purple-700 mb-3">{tip}</p>
                        
                        {/* Context tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {index < 2 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Age group: {currentPlan.userProfile.age}
                            </span>
                          )}
                          {index >= 2 && index < 4 && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              Time: {currentPlan.userProfile.timeAvailable}
                            </span>
                          )}
                          {index >= 4 && index < 6 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Specific goals
                            </span>
                          )}
                          {index >= 6 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              Profession: {currentPlan.userProfile.profession}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                              ✓ Applied
                            </button>
                            <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                              Remind later
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-600">
                              Difficulty: {index === 0 ? '⭐' : index === 1 ? '⭐⭐' : index < 4 ? '⭐⭐' : '⭐⭐⭐'}
                            </span>
                            <span className="text-xs text-green-600">
                              Impact: {index < 3 ? 'High' : index < 6 ? 'Medium' : 'High'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>⚡ Personalized tracking:</strong> These tips are specifically designed for your profile. Implement one each week for optimal results.
                </p>
              </div>
              
              {/* Implementation timeline */}
              <div className="mt-4 bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="text-sm font-semibold text-purple-800 mb-3">📅 Suggested implementation plan:</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-xs font-medium text-purple-700 mb-2">Week 1-2 (Foundation):</h6>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Implement tips 1-2 (easier ones)</li>
                      <li>• Establish basic routines</li>
                      <li>• Create tracking system</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-xs font-medium text-purple-700 mb-2">Week 3-4 (Expansion):</h6>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Add tips 3-4</li>
                      <li>• Refine existing techniques</li>
                      <li>• Evaluate initial progress</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Style & Motivation - Enhanced */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h4 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Your Learning Style
                </h4>
                <div className="bg-white rounded-lg p-4 border border-yellow-200 mb-4">
                  <p className="text-yellow-700 font-medium mb-3">{currentPlan.personalizedInsights.preferredLearningStyle}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-yellow-800 mb-2">📚 Recommended resources:</h5>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Interactive tutorial videos</li>
                        <li>• Educational mobile apps</li>
                        <li>• Online courses with gamification</li>
                        <li>• Simulators and practical tools</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-yellow-800 mb-2">⏱️ Ideal sessions:</h5>
                      <div className="flex gap-2">
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">25-30 min</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Interactive</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Visual</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>💡 Optimize your learning:</strong> Use multiple devices and combine theory with immediate practice.
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Your Motivation Style
                </h4>
                <div className="bg-white rounded-lg p-4 border border-pink-200 mb-4">
                  <p className="text-pink-700 font-medium mb-3">{currentPlan.personalizedInsights.motivationStyle}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-pink-800 mb-2">🚀 Motivational Strategies:</h5>
                      <ul className="text-xs text-pink-700 space-y-1">
                        <li>• Try different approaches each week</li>
                        <li>• Document what works best</li>
                        <li>• Experiment with new tools</li>
                        <li>• Keep variety in your routines</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-pink-800 mb-2">📊 Motivational Tracking:</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-pink-700">Energy level</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`w-3 h-3 rounded-full ${i <= 4 ? 'bg-pink-400' : 'bg-pink-200'}`}></div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-pink-700">Curiosity</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`w-3 h-3 rounded-full ${i <= 5 ? 'bg-pink-400' : 'bg-pink-200'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-pink-100 rounded-lg p-3">
                  <p className="text-xs text-pink-800">
                    <strong>🎯 Maintain motivation:</strong> Celebrate small successes and adjust based on results.
                  </p>
                </div>
              </div>
            </div>

            {/* Time Optimization - Enhanced */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Optimization
              </h4>
              <div className="grid gap-4">
                {currentPlan.personalizedInsights.timeOptimization.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                        <span className="text-purple-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 mb-3">{tip}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Estimated time: {index === 0 ? '5-10 min' : index === 1 ? '15-30 min' : '30-60 min'}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              Impact: {index === 0 ? 'High' : index === 1 ? 'Medium' : 'High'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                              ✓ Implemented
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${10 + (index * 15)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Progress of implementation
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2">⏰ Available Time</h5>
                  <p className="text-lg font-bold text-blue-900">{currentPlan.userProfile.timeAvailable}</p>
                  <p className="text-xs text-blue-700">per week</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-green-800 mb-2">🎯 Applied Techniques</h5>
                  <p className="text-lg font-bold text-green-900">0/{currentPlan.personalizedInsights.timeOptimization.length}</p>
                  <p className="text-xs text-green-700">active strategies</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-purple-800 mb-2">📈 Efficiency</h5>
                  <p className="text-lg font-bold text-purple-900">0%</p>
                  <p className="text-xs text-purple-700">estimated improvement</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience!</h3>
              <p className="text-gray-600">Your feedback helps us automatically adjust your plan</p>
            </div>

            {/* Feedback Analysis Results */}
            {feedbackAnalysis && showAdjustments && (
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 text-white rounded-full p-3">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-blue-900 mb-3">
                        ¡Plan Adjusted Automatically!
                      </h4>
                      <p className="text-blue-800 mb-4">{feedbackAnalysis.summary}</p>
                      
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h5 className="font-semibold text-gray-800 mb-3">Adjustments made:</h5>
                        <div className="space-y-2">
                          {feedbackAnalysis.adjustments.map((adjustment, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 capitalize">
                                  {adjustment.section === 'professional' ? 'Professional Plan' :
                                   adjustment.section === 'fitness' ? 'Fitness Plan' :
                                   adjustment.section === 'hobbies' ? 'Hobbies Plan' :
                                   adjustment.section === 'nutrition' ? 'Nutrition Plan' :
                                   'Personalized Insights'}
                                </p>
                                <p className="text-sm text-gray-600">{adjustment.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Confidence of analysis:</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i <= Math.round(feedbackAnalysis.confidence * 5) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({Math.round(feedbackAnalysis.confidence * 100)}%)
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleAcceptAdjustments}
                          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-5 h-5" />
                          Accept Adjustments
                        </button>
                        <button
                          onClick={handleRejectAdjustments}
                          className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Keep Original Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Form */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      What did you think of your personalized plan?
                    </label>
                    <textarea
                      rows={6}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base transition-colors duration-200 resize-none"
                      placeholder="Example: 'The exercises are too intense for beginners', 'I like the professional plan but the hobbies don't interest me', 'I don't have time to cook such complicated meals'..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>

                  {/* Enhanced feedback guidance */}
                  <div className="bg-white rounded-lg p-6 border border-purple-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      Guide for effective feedback:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Examples of useful feedback:</h5>
                        <ul className="space-y-1 text-xs text-gray-600">
                          <li>• "The exercises are too intense"</li>
                          <li>• "I prefer more creative hobbies"</li>
                          <li>• "I don't have time to cook"</li>
                          <li>• "Professional goals are too ambitious"</li>
                          <li>• "I need more variety in routines"</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Keywords I recognize:</h5>
                        <div className="flex flex-wrap gap-1">
                          {['too intense', 'too much', "don't like", 'prefer', 'change', 'more time', 'simple', 'complicated'].map(keyword => (
                            <span key={keyword} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      type="button"
                      onClick={handleAnalyzeFeedback}
                      disabled={!feedback.trim() || isAnalyzing}
                      className="inline-flex justify-center items-center gap-2 py-4 px-8 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Analyzing Feedback...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          Analyze and Adjust Plan
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.trim()}
                      className="inline-flex justify-center items-center gap-2 py-4 px-8 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Just Save Feedback
                    </button>
                  </div>

                  {/* Analysis status */}
                  {isAnalyzing && (
                    <div className="text-center">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="font-medium text-blue-800">Analyzing your feedback...</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          I'm processing your comments to generate personalized adjustments
                        </p>
                      </div>
                    </div>
                  )}

                  {feedback.trim() && !isAnalyzing && (
                    <div className="text-center text-sm text-gray-600">
                      <p>💡 Tip: The more specific you are, the better I can adjust your plan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thank you message after feedback */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Your plan automatically adapts to your needs!</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-8">
            {adjustedPlan && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Adjusted Professional Plan</span>
                </div>
                <p className="text-sm text-blue-700">
                  Goals and deadlines have been adjusted based on your feedback.
                </p>
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Plan</h3>
            
            {/* Career Path using currentPlan */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Career Path</h4>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full px-4 py-2 font-semibold">
                    {currentPlan.professional.careerPath.currentRole}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Current</p>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-blue-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-1/3"></div>
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-1">{currentPlan.professional.careerPath.estimatedTimeframe}</p>
                </div>
                <div className="text-center">
                  <div className="bg-indigo-500 text-white rounded-full px-4 py-2 font-semibold">
                    {currentPlan.professional.careerPath.targetRole}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Target</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Salary growth potential: {currentPlan.professional.careerPath.salaryGrowthPotential}
              </p>
            </div>

            {/* Goals with Progress using currentPlan */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Professional Goals</h4>
              <div className="space-y-4">
                {currentPlan.professional.goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{goal.title}</h5>
                        <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {goal.priority === 'high' ? 'High' : goal.priority === 'medium' ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                      <h6 className="font-medium text-gray-700">Milestones:</h6>
                      {goal.milestones.map((milestone) => (
                        <label key={milestone.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={() => {/* Handle milestone toggle */}}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {milestone.title}
                          </span>
                          <span className="text-xs text-gray-500">({milestone.deadline})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Resources */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Skills to Develop</h4>
                <div className="space-y-3">
                  {currentPlan.professional.skillsToAcquire.map((skill, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{skill.name}</h5>
                        <span className="text-xs text-gray-500">{skill.estimatedTimeToLearn}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {skill.currentLevel}
                        </span>
                        <span>→</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {skill.targetLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Recommended Resources</h4>
                <div className="space-y-3">
                  {currentPlan.professional.resources.map((resource, index) => (
                    <div key={index} className="p-3 border rounded hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-600">{resource.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              resource.cost === 'free' ? 'bg-green-100 text-green-800' :
                              resource.cost === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {resource.cost === 'free' ? 'Free' : resource.cost === 'paid' ? 'Paid' : 'Subscription'}
                            </span>
                            {resource.estimatedTime && (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                {resource.estimatedTime}
                              </span>
                            )}
                          </div>
                        </div>
                        {resource.url && (
                          <ExternalLink className="w-4 h-4 text-gray-400 ml-2 cursor-pointer hover:text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fitness' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Fitness Plan</h3>
            
            {/* Workout Routines */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Exercise Routines</h4>
              <div className="grid gap-4">
                {currentPlan.fitness.workoutRoutine.map((workout, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-semibold text-lg">{workout.name}</h5>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {workout.duration} min
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          workout.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {workout.difficulty === 'beginner' ? 'Beginner' :
                           workout.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{exercise.name}</span>
                            <p className="text-sm text-gray-600">{exercise.instructions}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            {exercise.sets && exercise.reps ? 
                              `${exercise.sets} sets × ${exercise.reps} reps` :
                              `${exercise.duration} min`
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Progress Tracking
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {currentPlan.fitness.progressTracking.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">{metric.name}</h5>
                      <span className="text-sm text-gray-600">
                        {metric.currentValue} → {metric.targetValue} {metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(metric.currentValue / metric.targetValue) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tracking: {metric.trackingFrequency === 'daily' ? 'Daily' : 
                                   metric.trackingFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hobbies' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Hobbies Plan</h3>
            
            {/* Selected Hobbies */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPlan.hobbies.selectedHobbies.map((hobby, index) => (
                <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">{hobby.name}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Current level:</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        hobby.skillLevel === 'beginner' ? 'bg-yellow-100 text-yellow-800' :
                        hobby.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {hobby.skillLevel === 'beginner' ? 'Beginner' :
                         hobby.skillLevel === 'intermediate' ? 'Intermediate' : 'Advanced'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Weekly time:</span>
                      <span className="ml-2 text-sm text-gray-800">{hobby.timeCommitment}</span>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Learning goals:</h5>
                      <ul className="space-y-1">
                        {hobby.learningGoals.map((goal, goalIndex) => (
                          <li key={goalIndex} className="text-sm text-gray-700 flex items-start gap-1">
                            <span className="text-purple-500 mt-1">•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Next steps:</h5>
                      <ul className="space-y-1">
                        {hobby.nextSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Suggested Projects</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {currentPlan.hobbies.projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-semibold">{project.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        project.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.difficulty === 'easy' ? 'Easy' :
                         project.difficulty === 'medium' ? 'Medium' : 'Difficult'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <p className="text-xs text-gray-500 mb-3">Estimated duration: {project.estimatedDuration}</p>
                    
                    <div className="space-y-2">
                      <h6 className="text-sm font-medium text-gray-700">Project steps:</h6>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {project.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-purple-600 font-medium">{stepIndex + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Learning Resources</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {currentPlan.hobbies.resources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-600">{resource.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            resource.cost === 'free' ? 'bg-green-100 text-green-800' :
                            resource.cost === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {resource.cost === 'free' ? 'Free' : resource.cost === 'paid' ? 'Paid' : 'Subscription'}
                          </span>
                          {resource.rating && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              ⭐ {resource.rating}
                            </span>
                          )}
                        </div>
                      </div>
                      {resource.url && (
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-2 cursor-pointer hover:text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Plan</h3>
            
            {/* Diet Overview */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Your Dietary Plan: {currentPlan.nutrition.dietType}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Diet Type</h5>
                  <p className="text-sm text-gray-600">{currentPlan.nutrition.dietType}</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Target className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Goal</h5>
                  <p className="text-sm text-gray-600">Wellness and energy</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Tracking</h5>
                  <p className="text-sm text-gray-600">Daily</p>
                </div>
              </div>
            </div>

            {/* Weekly Meal Plan */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Weekly Meal Plan</h4>
              <div className="space-y-4">
                {currentPlan.nutrition.mealPlan.map((dayPlan, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className="font-semibold text-lg mb-3 text-purple-600">{dayPlan.day}</h5>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* Breakfast */}
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h6 className="font-medium text-yellow-800 mb-2">Breakfast</h6>
                        <p className="text-sm font-medium">{dayPlan.breakfast.name}</p>
                        <p className="text-xs text-gray-600">{dayPlan.breakfast.calories} cal</p>
                        <p className="text-xs text-gray-500">{dayPlan.breakfast.prepTime} min prep</p>
                      </div>
                      
                      {/* Lunch */}
                      <div className="bg-green-50 rounded-lg p-3">
                        <h6 className="font-medium text-green-800 mb-2">Lunch</h6>
                        <p className="text-sm font-medium">{dayPlan.lunch.name}</p>
                        <p className="text-xs text-gray-600">{dayPlan.lunch.calories} cal</p>
                        <p className="text-xs text-gray-500">{dayPlan.lunch.prepTime} min prep</p>
                      </div>
                      
                      {/* Dinner */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h6 className="font-medium text-blue-800 mb-2">Dinner</h6>
                        <p className="text-sm font-medium">{dayPlan.dinner.name}</p>
                        <p className="text-xs text-gray-600">{dayPlan.dinner.calories} cal</p>
                        <p className="text-xs text-gray-500">{dayPlan.dinner.prepTime} min prep</p>
                      </div>
                      
                      {/* Snacks */}
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h6 className="font-medium text-purple-800 mb-2">Snacks</h6>
                        {dayPlan.snacks.map((snack, snackIndex) => (
                          <div key={snackIndex}>
                            <p className="text-sm font-medium">{snack.name}</p>
                            <p className="text-xs text-gray-600">{snack.calories} cal</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Daily Totals */}
                    <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                      <span className="font-medium">Total daily: {dayPlan.totalCalories} calories</span>
                      <div className="flex gap-4">
                        <span>Protein: {dayPlan.macros.protein}g</span>
                        <span>Carbs: {dayPlan.macros.carbs}g</span>
                        <span>Fats: {dayPlan.macros.fats}g</span>
                        <span>Fiber: {dayPlan.macros.fiber}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Shopping List</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Proteins</h5>
                  <ul className="space-y-1">
                    {currentPlan.nutrition.shoppingList.proteins.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Vegetables</h5>
                  <ul className="space-y-1">
                    {currentPlan.nutrition.shoppingList.vegetables.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Fruits</h5>
                  <ul className="space-y-1">
                    {currentPlan.nutrition.shoppingList.fruits.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700">
                  Estimated weekly cost: <span className="text-green-600">{currentPlan.nutrition.shoppingList.estimatedCost}</span>
                </p>
              </div>
            </div>

            {/* Hydration Plan */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-blue-800 mb-4">Hydration Plan</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-blue-700 mb-3">Daily Goal</h5>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="font-bold">{currentPlan.nutrition.hydrationPlan.dailyWaterGoal}L</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Daily water intake goal</p>
                      <p className="text-xs text-blue-600">≈ 8-10 glasses</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-700 mb-3">Reminders</h5>
                  <ul className="space-y-1">
                    {currentPlan.nutrition.hydrationPlan.reminders.map((reminder, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {reminder}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Supplements */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Supplements</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {currentPlan.nutrition.supplements.map((supplement, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    supplement.optional ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{supplement.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${
                        supplement.optional ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'
                      }`}>
                        {supplement.optional ? 'Optional' : 'Recommended'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{supplement.purpose}</p>
                    <div className="text-xs text-gray-500">
                      <p>Dosage: {supplement.dosage}</p>
                      <p>When: {supplement.timing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {currentPlan.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50 shadow-md' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div>
                      <h4 className={`font-semibold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-sm text-green-600">
                          Unlocked: {achievement.unlockedDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${achievement.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
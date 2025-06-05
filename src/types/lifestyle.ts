export interface LifestylePlan {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userProfile: UserProfile;
  professional: ProfessionalPlan;
  fitness: FitnessPlan;
  hobbies: HobbiesPlan;
  nutrition: NutritionPlan;
  personalizedInsights: PersonalizedInsights;
  weeklySchedule: WeeklySchedule;
  achievements: Achievement[];
  feedback?: string;
  isFavorite?: boolean;
  tags?: string[];
}

export interface UserProfile {
  name: string;
  age: string;
  profession: string;
  goals: string[];
  timeAvailable: string;
  preferences: {
    workStyle: string;
    exerciseType: string;
    hobbies: string[];
    dietType: string;
    learningStyle: string;
    preferredSchedule: string;
    budget: string;
  };
  currentSkills: string[];
  motivationFactors: string[];
  currentChallenges: string[];
  experience: string;
}

export interface ProfessionalPlan {
  goals: Goal[];
  shortTermObjectives: Goal[];
  longTermObjectives: Goal[];
  skillsToAcquire: Skill[];
  careerPath: CareerPath;
  resources: Resource[];
  networking: NetworkingPlan;
  timeManagement: TimeManagementTips[];
}

export interface FitnessPlan {
  workoutRoutine: WorkoutSession[];
  weeklySchedule: WeeklyFitnessSchedule;
  fitnessGoals: Goal[];
  nutrition: FitnessNutrition;
  progressTracking: ProgressMetric[];
  equipmentNeeded: string[];
  safetyTips: string[];
}

export interface HobbiesPlan {
  selectedHobbies: DetailedHobby[];
  timeAllocation: TimeAllocation[];
  resources: Resource[];
  learningPath: LearningPath[];
  community: CommunityResource[];
  projects: Project[];
  skillProgression: SkillLevel[];
}

export interface NutritionPlan {
  dietType: string;
  mealPlan: DailyMealPlan[];
  restrictions: string[];
  recommendations: NutritionRecommendation[];
  shoppingList: ShoppingList;
  hydrationPlan: HydrationPlan;
  supplements: Supplement[];
  mealPrepTips: string[];
}

export interface PersonalizedInsights {
  strengths: string[];
  improvementAreas: string[];
  personalityBasedTips: string[];
  motivationStyle: string;
  preferredLearningStyle: string;
  timeOptimization: string[];
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  duration: number; // in minutes
  type: 'professional' | 'fitness' | 'hobby' | 'nutrition' | 'rest';
  description: string;
  completed?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  progress: number; // 0-100
  completed: boolean;
  milestones: Milestone[];
  priority: 'high' | 'medium' | 'low';
}

export interface Milestone {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
}

export interface Skill {
  name: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  targetLevel: 'beginner' | 'intermediate' | 'advanced';
  resources: Resource[];
  estimatedTimeToLearn: string;
}

export interface Resource {
  type: 'book' | 'course' | 'video' | 'article' | 'tool' | 'app';
  title: string;
  url?: string;
  description: string;
  estimatedTime?: string;
  cost: 'free' | 'paid' | 'subscription';
  rating?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon: string;
  category: 'professional' | 'fitness' | 'hobby' | 'nutrition';
}

export interface CareerPath {
  currentRole: string;
  targetRole: string;
  stepsByStep: CareerStep[];
  estimatedTimeframe: string;
  salaryGrowthPotential: string;
}

export interface CareerStep {
  step: number;
  title: string;
  description: string;
  estimatedDuration: string;
  requirements: string[];
}

export interface NetworkingPlan {
  platforms: string[];
  events: string[];
  mentorshipGoals: string[];
  industryContacts: string[];
}

export interface WorkoutSession {
  name: string;
  duration: number;
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  instructions: string;
  muscleGroups: string[];
}

export interface WeeklyFitnessSchedule {
  [key: string]: {
    workout?: WorkoutSession;
    restDay?: boolean;
    activeRecovery?: string;
  };
}

export interface ProgressMetric {
  name: string;
  unit: string;
  currentValue: number;
  targetValue: number;
  trackingFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface DetailedHobby {
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: string;
  learningGoals: string[];
  nextSteps: string[];
  communityLinks: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skills: string[];
  steps: string[];
}

export interface DailyMealPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
  macros: Macros;
}

export interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  prepTime: number;
  instructions?: string[];
}

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface ShoppingList {
  proteins: string[];
  vegetables: string[];
  fruits: string[];
  grains: string[];
  dairy: string[];
  pantryItems: string[];
  estimatedCost: string;
}

export interface HydrationPlan {
  dailyWaterGoal: number; // in liters
  reminders: string[];
  flavoringOptions: string[];
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
  optional: boolean;
}

export interface NutritionRecommendation {
  category: string;
  recommendation: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FitnessNutrition {
  preWorkout: string[];
  postWorkout: string[];
  hydrationTips: string[];
  supplementSuggestions: string[];
}

export interface TimeManagementTips {
  technique: string;
  description: string;
  timeSlot: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TimeAllocation {
  activity: string;
  weeklyHours: number;
  bestTimeSlots: string[];
  flexibility: 'high' | 'medium' | 'low';
}

export interface LearningPath {
  step: number;
  skill: string;
  duration: string;
  resources: Resource[];
  prerequisites: string[];
}

export interface CommunityResource {
  type: 'online' | 'local' | 'event';
  name: string;
  description: string;
  url?: string;
  location?: string;
  cost: 'free' | 'paid';
}

export interface SkillLevel {
  skill: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  targetLevel: 'beginner' | 'intermediate' | 'advanced';
  timeToAchieve: string;
  milestones: string[];
} 
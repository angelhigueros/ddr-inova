import type { 
  LifestylePlan, 
  Goal, 
  Skill, 
  Resource, 
  WorkoutSession, 
  DetailedHobby, 
  DailyMealPlan,
  PersonalizedInsights,
  WeeklySchedule,
  Achievement,
  CareerPath,
  NetworkingPlan,
  TimeManagementTips,
  UserProfile
} from '@/types/lifestyle';

export function generatePersonalizedPlan(userProfile: UserProfile): Omit<LifestylePlan, 'id' | 'name' | 'createdAt' | 'updatedAt'> {
  // Generate more specific insights based on detailed user profile
  const personalizedInsights = generateDetailedInsights(userProfile);
  const professionalPlan = generateProfessionalPlan(userProfile);
  const fitnessPlan = generateFitnessPlan(userProfile);
  const hobbiesPlan = generateHobbiesPlan(userProfile);
  const nutritionPlan = generateNutritionPlan(userProfile);
  const achievements = generateAchievements(userProfile);

  return {
    userProfile,
    personalizedInsights,
    professional: professionalPlan,
    fitness: fitnessPlan,
    hobbies: hobbiesPlan,
    nutrition: nutritionPlan,
    achievements
  };
}

function generateDetailedInsights(userProfile: UserProfile) {
  const strengths = [];
  const improvementAreas = [];
  const personalityBasedTips = [];
  const timeOptimization = [];

  // Generate strengths based on goals and skills
  if (userProfile.goals.includes('Advance in my professional career')) {
    strengths.push('Ambition and goal-oriented mindset');
    if (userProfile.currentSkills.includes('Leadership')) {
      strengths.push('Identified natural leadership capabilities');
    }
  }

  if (userProfile.goals.includes('Improve my physical condition')) {
    strengths.push('Commitment to personal well-being and health');
    if (userProfile.preferences.exerciseType === 'yoga') {
      strengths.push('Holistic focus on physical and mental well-being');
    }
  }

  if (userProfile.goals.includes('Develop new technical skills')) {
    strengths.push('Growth mindset and continuous learning');
    if (userProfile.currentSkills.includes('Programming')) {
      strengths.push('Solid technical base for expanding knowledge');
    }
  }

  // Generate improvement areas based on challenges
  userProfile.currentChallenges.forEach(challenge => {
    switch(challenge) {
      case 'Lack of time':
        improvementAreas.push('Effective time management and optimization');
        timeOptimization.push('Implement Pomodoro technique: 25 min work + 5 min break');
        timeOptimization.push('Use time-blocking apps to plan your day in specific blocks');
        break;
      case 'Procrastination':
        improvementAreas.push('Developing discipline and consistency');
        personalityBasedTips.push('Divide large tasks into small 2-5 minute micro-tasks to reduce mental resistance');
        break;
      case 'Lack of motivation':
        improvementAreas.push('Building intrinsic motivation systems');
        personalityBasedTips.push('Connect each activity with your fundamental values and long-term goals');
        break;
      case 'Stress and anxiety':
        improvementAreas.push('Emotional management and relaxation techniques');
        if (userProfile.preferences.exerciseType === 'yoga') {
          personalityBasedTips.push('Take advantage of your daily yoga practice to develop breathing techniques');
        }
        break;
    }
  });

  // Generate tips based on motivation factors
  userProfile.motivationFactors.forEach(factor => {
    switch(factor) {
      case 'Recognition and achievements':
        personalityBasedTips.push('Document and celebrate your small wins daily. Create a "wins journal" weekly');
        break;
      case 'Personal growth':
        personalityBasedTips.push('Dedicate 15 minutes every Sunday to reflect on your weekly growth');
        break;
      case 'Continuous learning':
        personalityBasedTips.push('Implement the "1% daily rule": learn something small but consistently every day');
        break;
      case 'Autonomy and independence':
        personalityBasedTips.push('Design routines that give you complete control over your daily agenda and decisions');
        break;
    }
  });

  // Learning style specific tips
  let preferredLearningStyle = '';
  switch(userProfile.preferences.learningStyle) {
    case 'visual':
      preferredLearningStyle = 'Visual and interactive learning with diagrams and multimedia content';
      personalityBasedTips.push('Use mind maps and flowcharts to organize new information');
      break;
    case 'auditory':
      preferredLearningStyle = 'Auditory learning with podcasts and verbal explanations';
      personalityBasedTips.push('Convert your commute time into learning sessions with educational podcasts');
      break;
    case 'kinesthetic':
      preferredLearningStyle = 'Kinesthetic learning with practice and direct experimentation';
      personalityBasedTips.push('Practice immediately what you learn - experimentation is your strength');
      break;
    case 'reading':
      preferredLearningStyle = 'Learning through reading and structured writing';
      personalityBasedTips.push('Take detailed notes and create written summaries of what you learn');
      break;
    default:
      preferredLearningStyle = 'Adaptable mixed learning style based on context';
  }

  // Motivation style based on factors
  let motivationStyle = '';
  if (userProfile.motivationFactors.includes('Intellectual challenges')) {
    motivationStyle = 'Exploration and experimentation with challenging approaches';
  } else if (userProfile.motivationFactors.includes('Collaboration with others')) {
    motivationStyle = 'Social motivation and teamwork';
  } else if (userProfile.motivationFactors.includes('Tangible results')) {
    motivationStyle = 'Results-oriented motivation with measurable outcomes';
  } else {
    motivationStyle = 'Intrinsic motivation centered on personal growth';
  }

  // Time optimization based on available time and schedule
  if (userProfile.timeAvailable === '1-3 hours') {
    timeOptimization.push('Microlearning: maximum 15-20 minutes');
    timeOptimization.push('Take advantage of dead moments: transport, waits, etc.');
  } else if (userProfile.timeAvailable === '15+ hours') {
    timeOptimization.push('Deep work sessions of 2-3 hours for complex projects');
    timeOptimization.push('Alternate between different types of activities to maintain engagement');
  }

  if (userProfile.preferences.preferredSchedule === 'morning') {
    timeOptimization.push('Take advantage of mornings for tasks requiring maximum concentration');
  } else if (userProfile.preferences.preferredSchedule === 'night') {
    timeOptimization.push('Design productive nocturnal routines that respect your natural rhythm');
  }

  return {
    strengths: strengths.slice(0, 6),
    improvementAreas: improvementAreas.slice(0, 4),
    personalityBasedTips: personalityBasedTips.slice(0, 6),
    preferredLearningStyle,
    motivationStyle,
    timeOptimization: timeOptimization.slice(0, 4)
  };
}

function generateProfessionalPlan(userProfile: UserProfile) {
  const careerGoals = userProfile.goals.filter(goal => 
    goal.includes('Advance in my professional career') || 
    goal.includes('Increase my income') || 
    goal.includes('Develop leadership skills') || 
    goal.includes('Acquire professional certifications')
  );

  // Generate career path based on profession and goals
  const currentRole = userProfile.profession || 'Current Position';
  const targetRole = generateTargetRole(userProfile.profession, careerGoals);
  const estimatedTimeframe = userProfile.timeAvailable === '15+ hours' ? '6-12 months' : '12-18 months';
  const salaryGrowthPotential = calculateSalaryGrowth(userProfile.profession);

  const goals: Goal[] = [];
  
  if (careerGoals.length > 0) {
    careerGoals.forEach((goal, index) => {
      goals.push({
        id: `prof-${index + 1}`,
        title: goal,
        description: `Specific plan for: ${goal.toLowerCase()}`,
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
        progress: 0,
        milestones: [
          {
            id: `milestone-${index + 1}-1`,
            title: 'Initial assessment and planning',
            deadline: '1 month',
            completed: false
          },
          {
            id: `milestone-${index + 1}-2`,
            title: 'Key skills development',
            deadline: '3 months',
            completed: false
          },
          {
            id: `milestone-${index + 1}-3`,
            title: 'Implementation and results',
            deadline: '6 months',
            completed: false
          }
        ]
      });
    });
  }

  // Generate skills to acquire based on missing skills and goals
  const allProfessionalSkills = ['Leadership', 'Effective Communication', 'Project Management', 'Data Analysis', 'Public Speaking'];
  const skillsToAcquire = allProfessionalSkills
    .filter(skill => !userProfile.currentSkills.includes(skill))
    .slice(0, 4)
    .map(skill => ({
      name: skill,
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate-Advanced',
      estimatedTimeToLearn: getSkillLearningTime(skill, userProfile.timeAvailable)
    }));

  // Generate resources based on budget and learning style
  const resources = generateProfessionalResources(userProfile);

  return {
    careerPath: {
      currentRole,
      targetRole,
      estimatedTimeframe,
      salaryGrowthPotential
    },
    goals,
    skillsToAcquire,
    resources
  };
}

function generateFitnessPlan(userProfile: UserProfile) {
  const fitnessGoals = userProfile.goals.filter(goal => 
    goal.includes('physical') || goal.includes('health')
  );

  // Generate workout routine based on exercise preference and available time
  const workoutRoutine = [];
  const exerciseType = userProfile.preferences.exerciseType;
  
  if (exerciseType === 'cardio') {
    workoutRoutine.push({
      name: 'Intense Cardio',
      duration: userProfile.timeAvailable === '1-3 hours' ? 20 : 30,
      difficulty: 'intermediate' as const,
      exercises: [
        { name: 'Run/Trot', instructions: 'Maintain a constant pace', duration: '15-20 min' },
        { name: 'Jumping Jacks', instructions: 'Explosive series', sets: 3, reps: 30 },
        { name: 'Burpees', instructions: 'Full movement', sets: 3, reps: 10 }
      ]
    });
  } else if (exerciseType === 'strength') {
    workoutRoutine.push({
      name: 'Strength Training',
      duration: userProfile.timeAvailable === '1-3 hours' ? 30 : 45,
      difficulty: 'intermediate' as const,
      exercises: [
        { name: 'Push-ups', instructions: 'Perfect form, control in descent', sets: 3, reps: 15 },
        { name: 'Squats', instructions: 'Lower to 90 degrees', sets: 3, reps: 20 },
        { name: 'Plank', instructions: 'Keep core activated', duration: '30-60 sec', sets: 3 }
      ]
    });
  } else if (exerciseType === 'yoga') {
    workoutRoutine.push({
      name: 'Yoga Session',
      duration: userProfile.timeAvailable === '1-3 hours' ? 25 : 45,
      difficulty: 'beginner' as const,
      exercises: [
        { name: 'Sun Salutation', instructions: 'Complete sequence, conscious breathing', duration: '10 min' },
        { name: 'Standing Poses', instructions: 'Warrior I, II, triangle', duration: '15 min' },
        { name: 'Final Relaxation', instructions: 'Savasana with meditation', duration: '10 min' }
      ]
    });
  }

  // Generate progress tracking metrics
  const progressTracking = [
    {
      name: 'Body Weight',
      currentValue: 70,
      targetValue: userProfile.goals.includes('Improve my physical condition') ? 65 : 70,
      unit: 'kg',
      trackingFrequency: 'weekly' as const
    },
    {
      name: 'Cardiovascular Resistance',
      currentValue: 20,
      targetValue: 35,
      unit: 'min',
      trackingFrequency: 'weekly' as const
    }
  ];

  return {
    workoutRoutine,
    progressTracking
  };
}

function generateHobbiesPlan(userProfile: UserProfile) {
  const selectedHobbies = userProfile.preferences.hobbies.slice(0, 3).map(hobby => {
    let skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    
    // Determine skill level based on experience
    if (userProfile.experience === 'advanced') {
      skillLevel = 'intermediate';
    } else if (userProfile.experience === 'intermediate') {
      skillLevel = 'beginner';
    }

    return {
      name: hobby,
      skillLevel,
      timeCommitment: calculateHobbyTime(userProfile.timeAvailable),
      learningGoals: generateHobbyGoals(hobby),
      nextSteps: generateHobbyNextSteps(hobby, skillLevel)
    };
  });

  // Generate projects based on hobbies
  const projects = selectedHobbies.map((hobby, index) => ({
    id: `hobby-project-${index + 1}`,
    name: generateProjectName(hobby.name),
    description: generateProjectDescription(hobby.name),
    difficulty: hobby.skillLevel === 'beginner' ? 'easy' as const : 'medium' as const,
    estimatedDuration: hobby.timeCommitment,
    steps: generateProjectSteps(hobby.name)
  }));

  // Generate learning resources
  const resources = userProfile.preferences.hobbies.slice(0, 4).map(hobby => ({
    title: `${hobby} Course`,
    description: `Learn ${hobby.toLowerCase()} from scratch with experts`,
    cost: userProfile.preferences.budget === '0-50' ? 'free' as const : 'paid' as const,
    rating: 4.5,
    url: `https://example.com/${hobby.toLowerCase().replace(' ', '-')}`
  }));

  return {
    selectedHobbies,
    projects,
    resources
  };
}

function generateNutritionPlan(userProfile: UserProfile) {
  const dietType = userProfile.preferences.dietType;
  
  // Generate weekly meal plan based on diet type
  const mealPlan = generateWeeklyMealPlan(dietType);
  
  // Generate shopping list
  const shoppingList = generateShoppingList(dietType);
  
  // Generate hydration plan
  const hydrationPlan = {
    dailyWaterGoal: 2.5,
    reminders: [
      'At wake-up - 1 glass',
      'Before each meal - 1 glass',
      'Mid-afternoon - 1 glass',
      'Before bed - 1 glass'
    ]
  };

  // Generate supplements based on diet and goals
  const supplements = generateSupplements(dietType, userProfile.goals);

  return {
    dietType,
    mealPlan,
    shoppingList,
    hydrationPlan,
    supplements
  };
}

function generateAchievements(userProfile: UserProfile) {
  const achievements = [
    {
      id: 'first-plan',
      title: 'First Plan Created',
      description: 'You have created your first personalized lifestyle plan!',
      icon: '🎯',
      unlocked: true,
      unlockedDate: new Date().toLocaleDateString()
    },
    {
      id: 'goal-setter',
      title: 'Goal Setter',
      description: `You have defined ${userProfile.goals.length} clear goals for your growth`,
      icon: '🎪',
      unlocked: userProfile.goals.length >= 3,
      unlockedDate: userProfile.goals.length >= 3 ? new Date().toLocaleDateString() : undefined
    },
    {
      id: 'self-aware',
      title: 'Self-awareness',
      description: 'You have identified your strengths and areas for improvement',
      icon: '🧠',
      unlocked: userProfile.currentChallenges.length > 0,
      unlockedDate: userProfile.currentChallenges.length > 0 ? new Date().toLocaleDateString() : undefined
    }
  ];

  return achievements;
}

// Helper functions
function getSkillLearningTime(skill: string, timeAvailable: string): string {
  const baseTime = skill === 'Leadership' ? '6-12 months' : 
                   skill === 'Data Analysis' ? '3-6 months' : '2-4 months';
  
  if (timeAvailable === '1-3 hours') return baseTime;
  if (timeAvailable === '15+ hours') return baseTime.split('-')[0] + ' months';
  return baseTime;
}

function generateProfessionalResources(userProfile: UserProfile) {
  const budget = userProfile.preferences.budget;
  const learningStyle = userProfile.preferences.learningStyle;
  
  const resources = [];
  
  if (learningStyle === 'visual' || learningStyle === 'mixed') {
    resources.push({
      title: 'Coursera Professional Courses',
      description: 'Certified professional courses in your field',
      cost: budget === '0-50' ? 'free' : 'subscription' as const,
      estimatedTime: '4-6 weeks',
      url: 'https://coursera.org'
    });
  }
  
  if (learningStyle === 'auditory' || learningStyle === 'mixed') {
    resources.push({
      title: 'LinkedIn Learning Podcasts',
      description: 'Professional podcasts and audiobooks',
      cost: 'subscription' as const,
      estimatedTime: '30 min/day',
      url: 'https://linkedin.com/learning'
    });
  }

  return resources;
}

function calculateHobbyTime(timeAvailable: string): string {
  if (timeAvailable === '1-3 hours') return '30-45 min/week';
  if (timeAvailable === '4-7 hours') return '1-2 hours/week';
  if (timeAvailable === '8-15 hours') return '2-4 hours/week';
  return '4+ hours/week';
}

function generateHobbyGoals(hobby: string): string[] {
  const goalMap: { [key: string]: string[] } = {
    'Reading and writing': ['Read 2 books per month', 'Write weekly articles', 'Participate in reading club'],
    'Music (playing instruments)': ['Learn 5 basic songs', 'Practice 30 min daily', 'Record first composition'],
    'Cooking and gastronomy': ['Master 10 base recipes', 'Experiment with new techniques', 'Host dinner for friends'],
    'Photography': ['Understand basic concepts', 'Complete 30 photos per week', 'Create first portfolio'],
    'Programming as hobby': ['Complete first personal project', 'Learn new framework', 'Contribute to open source']
  };
  
  return goalMap[hobby] || ['Learn fundamentals', 'Practice regularly', 'Create first project'];
}

function generateHobbyNextSteps(hobby: string, skillLevel: string): string[] {
  const steps = [
    `Research learning resources for ${hobby.toLowerCase()}`,
    'Establish weekly practice routine',
    'Connect with practitioner community',
    'Define first practical project'
  ];
  
  if (skillLevel === 'intermediate') {
    steps.push('Explore advanced techniques', 'Consider teaching beginners');
  }
  
  return steps;
}

function generateProjectName(hobby: string): string {
  const nameMap: { [key: string]: string } = {
    'Reading and writing': 'Personal Review Blog',
    'Music (playing instruments)': 'First Musical Recording',
    'Cooking and gastronomy': 'Personal Recipe Book',
    'Photography': 'Themed Photo Series',
    'Programming as hobby': 'Personal Web Application'
  };
  
  return nameMap[hobby] || `${hobby} Project`;
}

function generateProjectDescription(hobby: string): string {
  return `A practical project to apply and showcase your skills in ${hobby.toLowerCase()}`;
}

function generateProjectSteps(hobby: string): string[] {
  return [
    'Initial planning and design',
    'Research and resource gathering',
    'Main development/creation',
    'Review and refinement',
    'Presentation and sharing results'
  ];
}

function generateWeeklyMealPlan(dietType: string) {
  // This would generate a full weekly meal plan based on diet type
  // For brevity, returning a simplified structure
  return [
    {
      day: 'Monday',
      breakfast: { name: 'Oatmeal with fruits', calories: 300, prepTime: 10 },
      lunch: { name: 'Mediterranean salad', calories: 450, prepTime: 15 },
      dinner: { name: 'Salmon with vegetables', calories: 500, prepTime: 25 },
      snacks: [{ name: 'Dried fruits', calories: 150 }],
      totalCalories: 1400,
      macros: { protein: 85, carbs: 120, fats: 65, fiber: 25 }
    }
    // ... more days would be generated
  ];
}

function generateShoppingList(dietType: string) {
  const lists: { [key: string]: any } = {
    'balanced': {
      proteins: ['Chicken', 'Fish', 'Eggs', 'Legumes'],
      vegetables: ['Broccoli', 'Spinach', 'Tomatoes', 'Carrots'],
      fruits: ['Apples', 'Bananas', 'Berries', 'Oranges'],
      estimatedCost: '$80-120 USD'
    },
    'vegetarian': {
      proteins: ['Tofu', 'Tempeh', 'Legumes', 'Quinoa'],
      vegetables: ['Kale', 'Spinach', 'Zucchini', 'Peppers'],
      fruits: ['Avocado', 'Berries', 'Citrus', 'Mango'],
      estimatedCost: '$60-90 USD'
    }
  };
  
  return lists[dietType] || lists['balanced'];
}

function generateSupplements(dietType: string, goals: string[]) {
  const supplements = [
    {
      name: 'Multivitamin',
      purpose: 'Ensure adequate vitamin and mineral intake',
      dosage: '1 capsule daily',
      timing: 'With breakfast',
      optional: false
    }
  ];
  
  if (goals.includes('Improve my physical condition')) {
    supplements.push({
      name: 'Protein Powder',
      purpose: 'Support muscle development and recovery',
      dosage: '1 scoop (25g)',
      timing: 'Post-workout',
      optional: true
    });
  }
  
  return supplements;
} 
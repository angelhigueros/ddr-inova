import type { LifestylePlan, UserProfile } from '@/types/lifestyle';

export interface FeedbackAnalysis {
  adjustments: PlanAdjustment[];
  summary: string;
  confidence: number;
}

export interface PlanAdjustment {
  section: 'professional' | 'fitness' | 'hobbies' | 'nutrition' | 'insights';
  type: 'modify' | 'add' | 'remove' | 'replace';
  description: string;
  specificChanges: any;
}

export function analyzeFeedback(feedback: string, currentPlan: LifestylePlan): FeedbackAnalysis {
  const adjustments: PlanAdjustment[] = [];
  const feedbackLower = feedback.toLowerCase();
  
  // Analyze professional feedback
  if (feedbackLower.includes('work') || feedbackLower.includes('career') || feedbackLower.includes('professional')) {
    if (feedbackLower.includes('too ambitious') || feedbackLower.includes('too fast') || feedbackLower.includes('unrealistic')) {
      adjustments.push({
        section: 'professional',
        type: 'modify',
        description: 'Adjust professional goals to be more realistic',
        specificChanges: {
          extendTimeframes: true,
          reduceGoalComplexity: true,
          addMoreMilestones: true
        }
      });
    }
    
    if (feedbackLower.includes('more time') || feedbackLower.includes('slower') || feedbackLower.includes('step by step')) {
      adjustments.push({
        section: 'professional',
        type: 'modify',
        description: 'Extend deadlines and break down goals into smaller steps',
        specificChanges: {
          extendTimeframes: true,
          breakDownGoals: true
        }
      });
    }

    if (feedbackLower.includes('lacking') && (feedbackLower.includes('skill') || feedbackLower.includes('ability'))) {
      adjustments.push({
        section: 'professional',
        type: 'add',
        description: 'Add more specific skills based on feedback',
        specificChanges: {
          addSkills: extractMentionedSkills(feedback)
        }
      });
    }
  }

  // Analyze fitness feedback
  if (feedbackLower.includes('exercise') || feedbackLower.includes('fitness') || feedbackLower.includes('workout')) {
    if (feedbackLower.includes('too intense') || feedbackLower.includes('too difficult') || feedbackLower.includes('beginner')) {
      adjustments.push({
        section: 'fitness',
        type: 'modify',
        description: 'Reduce exercise intensity and adjust for beginners',
        specificChanges: {
          reduceDifficulty: true,
          shortenDuration: true,
          addBeginnerOptions: true
        }
      });
    }

    if (feedbackLower.includes('more variety') || feedbackLower.includes('boring') || feedbackLower.includes('repetitive')) {
      adjustments.push({
        section: 'fitness',
        type: 'add',
        description: 'Add more variety in exercise routines',
        specificChanges: {
          addVariety: true,
          alternativeExercises: true
        }
      });
    }

    if (feedbackLower.includes('injury') || feedbackLower.includes('pain') || feedbackLower.includes('limitation')) {
      adjustments.push({
        section: 'fitness',
        type: 'modify',
        description: 'Adjust exercises for physical limitations',
        specificChanges: {
          lowImpactOptions: true,
          modifyForLimitations: true
        }
      });
    }
  }

  // Analyze hobbies feedback
  if (feedbackLower.includes('hobby') || feedbackLower.includes('free time') || feedbackLower.includes('interest')) {
    if (feedbackLower.includes('don\'t like') || feedbackLower.includes('not interested') || feedbackLower.includes('change')) {
      adjustments.push({
        section: 'hobbies',
        type: 'replace',
        description: 'Replace hobbies that don\'t interest the user',
        specificChanges: {
          replaceHobbies: extractDislikedHobbies(feedback),
          suggestAlternatives: true
        }
      });
    }

    if (feedbackLower.includes('more time') || feedbackLower.includes('dedicate more')) {
      adjustments.push({
        section: 'hobbies',
        type: 'modify',
        description: 'Increase time dedicated to favorite hobbies',
        specificChanges: {
          increaseTimeAllocation: true
        }
      });
    }
  }

  // Analyze nutrition feedback
  if (feedbackLower.includes('food') || feedbackLower.includes('diet') || feedbackLower.includes('nutrition') || feedbackLower.includes('cooking')) {
    if (feedbackLower.includes('too complicated') || feedbackLower.includes('no time to cook') || feedbackLower.includes('simple')) {
      adjustments.push({
        section: 'nutrition',
        type: 'modify',
        description: 'Simplify nutrition plan with easier meals',
        specificChanges: {
          simplifyMeals: true,
          quickPrep: true,
          mealPrepFocus: true
        }
      });
    }

    if (feedbackLower.includes('allergy') || feedbackLower.includes('don\'t like') || feedbackLower.includes('vegetarian') || feedbackLower.includes('vegan')) {
      adjustments.push({
        section: 'nutrition',
        type: 'modify',
        description: 'Adjust nutrition plan for restrictions or preferences',
        specificChanges: {
          dietaryRestrictions: extractDietaryInfo(feedback)
        }
      });
    }
  }

  // Analyze general feedback about time management
  if (feedbackLower.includes('no time') || feedbackLower.includes('too busy') || feedbackLower.includes('overloaded')) {
    adjustments.push({
      section: 'insights',
      type: 'modify',
      description: 'Optimize time management and reduce general load',
      specificChanges: {
        optimizeTimeManagement: true,
        prioritizeHighImpact: true,
        reduceTotalTime: true
      }
    });
  }

  // Analyze feedback about motivation and mindset
  if (feedbackLower.includes('unmotivated') || feedbackLower.includes('overwhelmed') || feedbackLower.includes('too much')) {
    adjustments.push({
      section: 'insights',
      type: 'add',
      description: 'Add motivation strategies and overload management',
      specificChanges: {
        motivationBoost: true,
        stressManagement: true,
        smallerSteps: true
      }
    });
  }

  // Generate summary and confidence score
  const summary = generateAdjustmentSummary(adjustments);
  const confidence = calculateConfidence(feedback, adjustments);

  return {
    adjustments,
    summary,
    confidence
  };
}

function extractMentionedSkills(feedback: string): string[] {
  const skills = [];
  const skillKeywords = {
    'leadership': 'Leadership',
    'communication': 'Effective Communication',
    'programming': 'Programming',
    'marketing': 'Digital Marketing',
    'analysis': 'Data Analysis',
    'management': 'Project Management',
    'sales': 'Sales',
    'languages': 'Foreign Languages'
  };

  Object.entries(skillKeywords).forEach(([keyword, skill]) => {
    if (feedback.toLowerCase().includes(keyword)) {
      skills.push(skill);
    }
  });

  return skills;
}

function extractDislikedHobbies(feedback: string): string[] {
  const hobbies = [];
  const hobbyKeywords = {
    'reading': 'Reading and writing',
    'music': 'Music (playing instruments)',
    'cooking': 'Cooking and gastronomy',
    'photography': 'Photography',
    'sports': 'Sports (soccer, tennis, etc.)',
    'programming': 'Programming as hobby'
  };

  Object.entries(hobbyKeywords).forEach(([keyword, hobby]) => {
    if (feedback.toLowerCase().includes(keyword) && 
        (feedback.toLowerCase().includes('don\'t like') || feedback.toLowerCase().includes('not interested'))) {
      hobbies.push(hobby);
    }
  });

  return hobbies;
}

function extractDietaryInfo(feedback: string): any {
  const restrictions = [];
  const feedbackLower = feedback.toLowerCase();
  
  if (feedbackLower.includes('vegetarian')) restrictions.push('vegetarian');
  if (feedbackLower.includes('vegan')) restrictions.push('vegan');
  if (feedbackLower.includes('allergy')) restrictions.push('allergies');
  if (feedbackLower.includes('lactose')) restrictions.push('lactose-free');
  if (feedbackLower.includes('gluten')) restrictions.push('gluten-free');
  
  return restrictions;
}

function generateAdjustmentSummary(adjustments: PlanAdjustment[]): string {
  if (adjustments.length === 0) {
    return 'Your plan is well balanced according to your feedback. No major adjustments needed.';
  }

  const sections = [...new Set(adjustments.map(adj => adj.section))];
  const sectionNames = {
    professional: 'professional',
    fitness: 'fitness',
    hobbies: 'hobbies',
    nutrition: 'nutrition',
    insights: 'personal strategies'
  };

  return `Based on your feedback, I have adjusted your plan in the following areas: ${
    sections.map(s => sectionNames[s]).join(', ')
  }. The changes are designed to make the plan more realistic and aligned with your preferences.`;
}

function calculateConfidence(feedback: string, adjustments: PlanAdjustment[]): number {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence based on specific keywords
  const specificKeywords = ['very', 'too much', 'don\'t like', 'prefer', 'change', 'adjust'];
  const keywordCount = specificKeywords.reduce((count, keyword) => 
    count + (feedback.toLowerCase().includes(keyword) ? 1 : 0), 0
  );
  
  confidence += (keywordCount * 0.1);
  
  // Increase confidence based on feedback length and detail
  if (feedback.length > 100) confidence += 0.2;
  if (feedback.length > 200) confidence += 0.1;
  
  // Increase confidence if we found actionable adjustments
  confidence += (adjustments.length * 0.1);
  
  return Math.min(0.95, confidence); // Cap at 95%
}

export function applyAdjustmentsToPlan(
  currentPlan: LifestylePlan, 
  adjustments: PlanAdjustment[]
): LifestylePlan {
  // Create a deep copy to avoid mutating the original plan
  let adjustedPlan = JSON.parse(JSON.stringify(currentPlan));

  adjustments.forEach(adjustment => {
    switch (adjustment.section) {
      case 'professional':
        adjustedPlan = adjustProfessionalPlan(adjustedPlan, adjustment);
        break;
      case 'fitness':
        adjustedPlan = adjustFitnessPlan(adjustedPlan, adjustment);
        break;
      case 'hobbies':
        adjustedPlan = adjustHobbiesPlan(adjustedPlan, adjustment);
        break;
      case 'nutrition':
        adjustedPlan = adjustNutritionPlan(adjustedPlan, adjustment);
        break;
      case 'insights':
        adjustedPlan = adjustInsightsPlan(adjustedPlan, adjustment);
        break;
    }
  });

  return adjustedPlan;
}

function adjustProfessionalPlan(plan: LifestylePlan, adjustment: PlanAdjustment): LifestylePlan {
  const newPlan = { ...plan };
  
  if (adjustment.specificChanges.extendTimeframes) {
    // Create new goals array with extended deadlines
    newPlan.professional = {
      ...newPlan.professional,
      goals: newPlan.professional.goals.map(goal => ({
        ...goal,
        milestones: goal.milestones.map(milestone => ({
          ...milestone,
          deadline: extendDeadline(milestone.deadline)
        }))
      }))
    };
  }

  if (adjustment.specificChanges.addSkills) {
    const newSkills = adjustment.specificChanges.addSkills.map((skillName: string) => ({
      name: skillName,
      currentLevel: 'beginner' as const,
      targetLevel: 'intermediate' as const,
      estimatedTimeToLearn: '3-6 months'
    }));
    
    newPlan.professional = {
      ...newPlan.professional,
      skillsToAcquire: [
        ...newPlan.professional.skillsToAcquire,
        ...newSkills
      ]
    };
  }

  return newPlan;
}

function adjustFitnessPlan(plan: LifestylePlan, adjustment: PlanAdjustment): LifestylePlan {
  const newPlan = { ...plan };
  
  if (adjustment.specificChanges.reduceDifficulty) {
    newPlan.fitness = {
      ...newPlan.fitness,
      workoutRoutine: newPlan.fitness.workoutRoutine.map(workout => ({
        ...workout,
        difficulty: 'beginner' as const,
        duration: Math.max(15, workout.duration - 10),
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets ? Math.max(1, exercise.sets - 1) : exercise.sets,
          reps: exercise.reps ? Math.max(5, exercise.reps - 5) : exercise.reps
        }))
      }))
    };
  }

  if (adjustment.specificChanges.addVariety) {
    // Create new workout routine with additional exercises
    newPlan.fitness = {
      ...newPlan.fitness,
      workoutRoutine: newPlan.fitness.workoutRoutine.map(workout => ({
        ...workout,
        exercises: [
          ...workout.exercises,
          {
            name: 'Alternative Exercise: Active Walking',
            instructions: 'Slightly easier option for low-energy days',
            duration: '15-20 min'
          }
        ]
      }))
    };
  }

  return newPlan;
}

function adjustHobbiesPlan(plan: LifestylePlan, adjustment: PlanAdjustment): LifestylePlan {
  const newPlan = { ...plan };
  
  if (adjustment.specificChanges.replaceHobbies) {
    const hobbiesToReplace = adjustment.specificChanges.replaceHobbies;
    const alternativeHobbies = ['Podcasts and audiobooks', 'Meditation', 'Gardening', 'Volunteering'];
    
    newPlan.hobbies = {
      ...newPlan.hobbies,
      selectedHobbies: newPlan.hobbies.selectedHobbies.map(hobby => {
        if (hobbiesToReplace.includes(hobby.name)) {
          const alternative = alternativeHobbies[Math.floor(Math.random() * alternativeHobbies.length)];
          return {
            ...hobby,
            name: alternative,
            learningGoals: [`Explore ${alternative.toLowerCase()}`, 'Finding my personal rhythm', 'Integrating into weekly routine'],
            nextSteps: [`Research resources for ${alternative.toLowerCase()}`, 'Start with short sessions', 'Evaluate weekly progress']
          };
        }
        return { ...hobby };
      })
    };
  }

  if (adjustment.specificChanges.increaseTimeAllocation) {
    newPlan.hobbies = {
      ...newPlan.hobbies,
      selectedHobbies: newPlan.hobbies.selectedHobbies.map(hobby => ({
        ...hobby,
        timeCommitment: increaseTimeCommitment(hobby.timeCommitment)
      }))
    };
  }

  return newPlan;
}

function adjustNutritionPlan(plan: LifestylePlan, adjustment: PlanAdjustment): LifestylePlan {
  const newPlan = { ...plan };
  
  if (adjustment.specificChanges.simplifyMeals) {
    newPlan.nutrition = {
      ...newPlan.nutrition,
      mealPlan: newPlan.nutrition.mealPlan.map(day => ({
        ...day,
        breakfast: { 
          ...day.breakfast, 
          prepTime: Math.max(5, day.breakfast.prepTime - 5) 
        },
        lunch: { 
          ...day.lunch, 
          prepTime: Math.max(10, day.lunch.prepTime - 5) 
        },
        dinner: { 
          ...day.dinner, 
          prepTime: Math.max(15, day.dinner.prepTime - 10) 
        }
      }))
    };
  }

  if (adjustment.specificChanges.dietaryRestrictions) {
    newPlan.nutrition = {
      ...newPlan.nutrition,
      dietType: `${newPlan.nutrition.dietType} (adjusted for restrictions)`
    };
  }

  return newPlan;
}

function adjustInsightsPlan(plan: LifestylePlan, adjustment: PlanAdjustment): LifestylePlan {
  const newPlan = { ...plan };
  
  if (adjustment.specificChanges.optimizeTimeManagement) {
    newPlan.personalizedInsights = {
      ...newPlan.personalizedInsights,
      timeOptimization: [
        'Use time-blocking technique with smaller blocks of 15-30 minutes',
        'Identify and eliminate low-value activities in your day',
        'Combine activities: listen to educational podcasts while doing light exercise',
        'Implement "micro-habits" that require only 2-5 minutes daily'
      ]
    };
  }

  if (adjustment.specificChanges.motivationBoost) {
    newPlan.personalizedInsights = {
      ...newPlan.personalizedInsights,
      personalityBasedTips: [
        ...newPlan.personalizedInsights.personalityBasedTips,
        'Celebrate small daily achievements to maintain motivation',
        'Divide large goals into mini-targets of 1-2 weeks',
        'Create a "victory" ritual for each completed milestone'
      ]
    };
  }

  return newPlan;
}

function extendDeadline(deadline: string): string {
  // Simple deadline extension logic
  const timeMap: { [key: string]: string } = {
    '1 month': '6 weeks',
    '3 months': '4-5 months',
    '6 months': '8-9 months'
  };
  
  return timeMap[deadline] || deadline;
}

function increaseTimeCommitment(currentCommitment: string): string {
  // Simple time increase logic
  const timeMap: { [key: string]: string } = {
    '30-45 min/week': '1-2 hours/week',
    '1-2 hours/week': '2-3 hours/week',
    '2-4 hours/week': '4-6 hours/week',
    '4+ hours/week': '6+ hours/week'
  };
  
  return timeMap[currentCommitment] || currentCommitment;
} 
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
  if (feedbackLower.includes('trabajo') || feedbackLower.includes('carrera') || feedbackLower.includes('profesional')) {
    if (feedbackLower.includes('muy ambicioso') || feedbackLower.includes('demasiado rápido') || feedbackLower.includes('unrealista')) {
      adjustments.push({
        section: 'professional',
        type: 'modify',
        description: 'Ajustar objetivos profesionales para ser más realistas',
        specificChanges: {
          extendTimeframes: true,
          reduceGoalComplexity: true,
          addMoreMilestones: true
        }
      });
    }
    
    if (feedbackLower.includes('más tiempo') || feedbackLower.includes('más lento') || feedbackLower.includes('paso a paso')) {
      adjustments.push({
        section: 'professional',
        type: 'modify',
        description: 'Extender plazos y dividir objetivos en pasos más pequeños',
        specificChanges: {
          extendTimeframes: true,
          breakDownGoals: true
        }
      });
    }

    if (feedbackLower.includes('falta') && (feedbackLower.includes('habilidad') || feedbackLower.includes('skill'))) {
      adjustments.push({
        section: 'professional',
        type: 'add',
        description: 'Agregar más habilidades específicas basadas en feedback',
        specificChanges: {
          addSkills: extractMentionedSkills(feedback)
        }
      });
    }
  }

  // Analyze fitness feedback
  if (feedbackLower.includes('ejercicio') || feedbackLower.includes('fitness') || feedbackLower.includes('entrenam')) {
    if (feedbackLower.includes('muy intenso') || feedbackLower.includes('demasiado difícil') || feedbackLower.includes('principiante')) {
      adjustments.push({
        section: 'fitness',
        type: 'modify',
        description: 'Reducir intensidad de ejercicios y ajustar para principiantes',
        specificChanges: {
          reduceDifficulty: true,
          shortenDuration: true,
          addBeginnerOptions: true
        }
      });
    }

    if (feedbackLower.includes('más variedad') || feedbackLower.includes('aburrido') || feedbackLower.includes('repetitivo')) {
      adjustments.push({
        section: 'fitness',
        type: 'add',
        description: 'Agregar más variedad en rutinas de ejercicio',
        specificChanges: {
          addVariety: true,
          alternativeExercises: true
        }
      });
    }

    if (feedbackLower.includes('lesión') || feedbackLower.includes('dolor') || feedbackLower.includes('limitación')) {
      adjustments.push({
        section: 'fitness',
        type: 'modify',
        description: 'Ajustar ejercicios para limitaciones físicas',
        specificChanges: {
          lowImpactOptions: true,
          modifyForLimitations: true
        }
      });
    }
  }

  // Analyze hobbies feedback
  if (feedbackLower.includes('hobby') || feedbackLower.includes('tiempo libre') || feedbackLower.includes('interés')) {
    if (feedbackLower.includes('no me gusta') || feedbackLower.includes('no interesa') || feedbackLower.includes('cambiar')) {
      adjustments.push({
        section: 'hobbies',
        type: 'replace',
        description: 'Reemplazar hobbies que no interesan al usuario',
        specificChanges: {
          replaceHobbies: extractDislikedHobbies(feedback),
          suggestAlternatives: true
        }
      });
    }

    if (feedbackLower.includes('más tiempo') || feedbackLower.includes('dedicar más')) {
      adjustments.push({
        section: 'hobbies',
        type: 'modify',
        description: 'Aumentar tiempo dedicado a hobbies favoritos',
        specificChanges: {
          increaseTimeAllocation: true
        }
      });
    }
  }

  // Analyze nutrition feedback
  if (feedbackLower.includes('comida') || feedbackLower.includes('dieta') || feedbackLower.includes('nutrición') || feedbackLower.includes('cocina')) {
    if (feedbackLower.includes('muy complicado') || feedbackLower.includes('no tengo tiempo para cocinar') || feedbackLower.includes('simple')) {
      adjustments.push({
        section: 'nutrition',
        type: 'modify',
        description: 'Simplificar plan nutricional con comidas más fáciles',
        specificChanges: {
          simplifyMeals: true,
          quickPrep: true,
          mealPrepFocus: true
        }
      });
    }

    if (feedbackLower.includes('alergia') || feedbackLower.includes('no me gusta') || feedbackLower.includes('vegetariano') || feedbackLower.includes('vegano')) {
      adjustments.push({
        section: 'nutrition',
        type: 'modify',
        description: 'Ajustar plan nutricional por restricciones o preferencias',
        specificChanges: {
          dietaryRestrictions: extractDietaryInfo(feedback)
        }
      });
    }
  }

  // Analyze general feedback about time management
  if (feedbackLower.includes('no tengo tiempo') || feedbackLower.includes('muy ocupado') || feedbackLower.includes('sobrecargado')) {
    adjustments.push({
      section: 'insights',
      type: 'modify',
      description: 'Optimizar gestión de tiempo y reducir carga general',
      specificChanges: {
        optimizeTimeManagement: true,
        prioritizeHighImpact: true,
        reduceTotalTime: true
      }
    });
  }

  // Analyze feedback about motivation and mindset
  if (feedbackLower.includes('desmotiv') || feedbackLower.includes('abrumado') || feedbackLower.includes('demasiado')) {
    adjustments.push({
      section: 'insights',
      type: 'add',
      description: 'Agregar estrategias de motivación y manejo de sobrecarga',
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
    'liderazgo': 'Liderazgo',
    'comunicación': 'Comunicación efectiva',
    'programación': 'Programación',
    'marketing': 'Marketing digital',
    'análisis': 'Análisis de datos',
    'gestión': 'Gestión de proyectos',
    'ventas': 'Ventas',
    'idiomas': 'Idiomas extranjeros'
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
    'lectura': 'Lectura y escritura',
    'música': 'Música (tocar instrumentos)',
    'cocina': 'Cocina y gastronomía',
    'fotografía': 'Fotografía',
    'deporte': 'Deportes (fútbol, tenis, etc.)',
    'programación': 'Programación por hobby'
  };

  Object.entries(hobbyKeywords).forEach(([keyword, hobby]) => {
    if (feedback.toLowerCase().includes(keyword) && 
        (feedback.toLowerCase().includes('no me gusta') || feedback.toLowerCase().includes('no interesa'))) {
      hobbies.push(hobby);
    }
  });

  return hobbies;
}

function extractDietaryInfo(feedback: string): any {
  const restrictions = [];
  const feedbackLower = feedback.toLowerCase();
  
  if (feedbackLower.includes('vegetariano')) restrictions.push('vegetariano');
  if (feedbackLower.includes('vegano')) restrictions.push('vegano');
  if (feedbackLower.includes('alergia')) restrictions.push('alergias');
  if (feedbackLower.includes('lactosa')) restrictions.push('sin lactosa');
  if (feedbackLower.includes('gluten')) restrictions.push('sin gluten');
  
  return restrictions;
}

function generateAdjustmentSummary(adjustments: PlanAdjustment[]): string {
  if (adjustments.length === 0) {
    return 'Tu plan está bien equilibrado según tu feedback. No se necesitan ajustes mayores.';
  }

  const sections = [...new Set(adjustments.map(adj => adj.section))];
  const sectionNames = {
    professional: 'profesional',
    fitness: 'fitness',
    hobbies: 'hobbies',
    nutrition: 'nutrición',
    insights: 'estrategias personales'
  };

  return `Basándome en tu feedback, he ajustado tu plan en las siguientes áreas: ${
    sections.map(s => sectionNames[s]).join(', ')
  }. Los cambios están diseñados para hacer el plan más realista y alineado con tus preferencias.`;
}

function calculateConfidence(feedback: string, adjustments: PlanAdjustment[]): number {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence based on specific keywords
  const specificKeywords = ['muy', 'demasiado', 'no me gusta', 'prefiero', 'cambiar', 'ajustar'];
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
      estimatedTimeToLearn: '3-6 meses'
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
            name: 'Ejercicio alternativo: Caminata activa',
            instructions: 'Opción más suave para días de baja energía',
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
    const alternativeHobbies = ['Podcasts y audiolibros', 'Meditación', 'Jardinería', 'Voluntariado'];
    
    newPlan.hobbies = {
      ...newPlan.hobbies,
      selectedHobbies: newPlan.hobbies.selectedHobbies.map(hobby => {
        if (hobbiesToReplace.includes(hobby.name)) {
          const alternative = alternativeHobbies[Math.floor(Math.random() * alternativeHobbies.length)];
          return {
            ...hobby,
            name: alternative,
            learningGoals: [`Explorar ${alternative.toLowerCase()}`, 'Encontrar mi ritmo personal', 'Integrar en rutina semanal'],
            nextSteps: [`Investigar recursos para ${alternative.toLowerCase()}`, 'Comenzar con sesiones cortas', 'Evaluar progreso semanal']
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
      dietType: `${newPlan.nutrition.dietType} (ajustado por restricciones)`
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
        'Usa la técnica de time-blocking con bloques más pequeños de 15-30 minutos',
        'Identifica y elimina actividades de bajo valor en tu día',
        'Combina actividades: escucha podcasts educativos mientras haces ejercicio suave',
        'Implementa "micro-hábitos" que requieren solo 2-5 minutos diarios'
      ]
    };
  }

  if (adjustment.specificChanges.motivationBoost) {
    newPlan.personalizedInsights = {
      ...newPlan.personalizedInsights,
      personalityBasedTips: [
        ...newPlan.personalizedInsights.personalityBasedTips,
        'Celebra pequeños logros diarios para mantener la motivación',
        'Divide objetivos grandes en mini-metas de 1-2 semanas',
        'Crea un ritual de "victoria" para cada hito completado'
      ]
    };
  }

  return newPlan;
}

function extendDeadline(deadline: string): string {
  // Simple deadline extension logic
  const timeMap: { [key: string]: string } = {
    '1 mes': '6 semanas',
    '3 meses': '4-5 meses',
    '6 meses': '8-9 meses'
  };
  
  return timeMap[deadline] || deadline;
}

function increaseTimeCommitment(currentCommitment: string): string {
  // Simple time increase logic
  const timeMap: { [key: string]: string } = {
    '30-45 min/semana': '1-2 horas/semana',
    '1-2 horas/semana': '2-3 horas/semana',
    '2-4 horas/semana': '4-6 horas/semana',
    '4+ horas/semana': '6+ horas/semana'
  };
  
  return timeMap[currentCommitment] || currentCommitment;
} 
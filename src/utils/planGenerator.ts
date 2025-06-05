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
  if (userProfile.goals.includes('Avanzar en mi carrera profesional')) {
    strengths.push('Ambición profesional y orientación a objetivos');
    if (userProfile.currentSkills.includes('Liderazgo')) {
      strengths.push('Capacidades naturales de liderazgo identificadas');
    }
  }

  if (userProfile.goals.includes('Mejorar mi condición física')) {
    strengths.push('Compromiso con el bienestar personal y la salud');
    if (userProfile.preferences.exerciseType === 'yoga') {
      strengths.push('Enfoque holístico hacia el bienestar físico y mental');
    }
  }

  if (userProfile.goals.includes('Desarrollar nuevas habilidades técnicas')) {
    strengths.push('Mentalidad de crecimiento y aprendizaje continuo');
    if (userProfile.currentSkills.includes('Programación')) {
      strengths.push('Base técnica sólida para expandir conocimientos');
    }
  }

  // Generate improvement areas based on challenges
  userProfile.currentChallenges.forEach(challenge => {
    switch(challenge) {
      case 'Falta de tiempo':
        improvementAreas.push('Optimización y gestión efectiva del tiempo');
        timeOptimization.push('Implementa la técnica Pomodoro: 25 min trabajo + 5 min descanso');
        timeOptimization.push('Usa apps de time-blocking para planificar tu día en bloques específicos');
        break;
      case 'Procrastinación':
        improvementAreas.push('Desarrollo de disciplina y consistencia');
        personalityBasedTips.push('Divide tareas grandes en micro-tareas de 2-5 minutos para reducir la resistencia mental');
        break;
      case 'Falta de motivación':
        improvementAreas.push('Construcción de sistemas de motivación intrínseca');
        personalityBasedTips.push('Conecta cada actividad con tus valores fundamentales y objetivos a largo plazo');
        break;
      case 'Estrés y ansiedad':
        improvementAreas.push('Gestión emocional y técnicas de relajación');
        if (userProfile.preferences.exerciseType === 'yoga') {
          personalityBasedTips.push('Aprovecha tu práctica de yoga para desarrollar técnicas de respiración diaria');
        }
        break;
    }
  });

  // Generate tips based on motivation factors
  userProfile.motivationFactors.forEach(factor => {
    switch(factor) {
      case 'Reconocimiento y logros':
        personalityBasedTips.push('Documenta y celebra tus pequeños wins diarios. Crea un "journal de logros" semanal');
        break;
      case 'Crecimiento personal':
        personalityBasedTips.push('Dedica 15 minutos cada domingo a reflexionar sobre tu crecimiento de la semana');
        break;
      case 'Aprendizaje continuo':
        personalityBasedTips.push('Implementa la regla del "1% diario": aprende algo pequeño pero consistente cada día');
        break;
      case 'Autonomía e independencia':
        personalityBasedTips.push('Diseña rutinas que te den control total sobre tu agenda y decisiones diarias');
        break;
    }
  });

  // Learning style specific tips
  let preferredLearningStyle = '';
  switch(userProfile.preferences.learningStyle) {
    case 'visual':
      preferredLearningStyle = 'Aprendizaje visual e interactivo con diagramas y contenido multimedia';
      personalityBasedTips.push('Usa mapas mentales y diagramas de flujo para organizar nueva información');
      break;
    case 'auditivo':
      preferredLearningStyle = 'Aprendizaje auditivo con podcasts y explicaciones verbales';
      personalityBasedTips.push('Convierte tu tiempo de commute en sesiones de aprendizaje con podcasts educativos');
      break;
    case 'kinestesico':
      preferredLearningStyle = 'Aprendizaje kinestésico con práctica y experimentación directa';
      personalityBasedTips.push('Practica inmediatamente lo que aprendes - la experimentación es tu fortaleza');
      break;
    case 'lectura':
      preferredLearningStyle = 'Aprendizaje mediante lectura y escritura estructurada';
      personalityBasedTips.push('Toma notas detalladas y crea resúmenes escritos de lo que aprendes');
      break;
    default:
      preferredLearningStyle = 'Aprendizaje mixto adaptable según el contexto';
  }

  // Motivation style based on factors
  let motivationStyle = '';
  if (userProfile.motivationFactors.includes('Desafíos intelectuales')) {
    motivationStyle = 'Exploración y experimentación con enfoques desafiantes';
  } else if (userProfile.motivationFactors.includes('Colaboración con otros')) {
    motivationStyle = 'Motivación social y trabajo en equipo';
  } else if (userProfile.motivationFactors.includes('Resultados tangibles')) {
    motivationStyle = 'Orientación a resultados medibles y logros concretos';
  } else {
    motivationStyle = 'Motivación intrínseca centrada en crecimiento personal';
  }

  // Time optimization based on available time and schedule
  if (userProfile.timeAvailable === '1-3 horas') {
    timeOptimization.push('Microaprendizaje: sesiones de 15-20 minutos máximo');
    timeOptimization.push('Aprovecha momentos muertos: transporte, esperas, etc.');
  } else if (userProfile.timeAvailable === '15+ horas') {
    timeOptimization.push('Sesiones de deep work de 2-3 horas para proyectos complejos');
    timeOptimization.push('Alterna entre diferentes tipos de actividades para mantener el engagement');
  }

  if (userProfile.preferences.preferredSchedule === 'mañana') {
    timeOptimization.push('Aprovecha las mañanas para tareas que requieren máxima concentración');
  } else if (userProfile.preferences.preferredSchedule === 'noche') {
    timeOptimization.push('Diseña rutinas nocturnas productivas que respeten tu ritmo natural');
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
    goal.includes('carrera') || goal.includes('profesional') || goal.includes('liderazgo') || goal.includes('ingresos')
  );

  // Generate career path based on profession and goals
  let currentRole = userProfile.profession;
  let targetRole = '';
  let estimatedTimeframe = '';
  let salaryGrowthPotential = '';

  if (userProfile.profession.toLowerCase().includes('programador') || userProfile.profession.toLowerCase().includes('desarrollador')) {
    if (careerGoals.some(goal => goal.includes('liderazgo'))) {
      targetRole = 'Senior Developer / Tech Lead';
      estimatedTimeframe = '2-3 años';
      salaryGrowthPotential = '+40-60%';
    } else {
      targetRole = 'Senior Developer / Architect';
      estimatedTimeframe = '1-2 años';
      salaryGrowthPotential = '+30-50%';
    }
  } else if (userProfile.profession.toLowerCase().includes('diseñador')) {
    targetRole = 'Senior Designer / Design Lead';
    estimatedTimeframe = '2-3 años';
    salaryGrowthPotential = '+35-55%';
  } else {
    targetRole = 'Senior ' + userProfile.profession;
    estimatedTimeframe = '2-4 años';
    salaryGrowthPotential = '+25-45%';
  }

  // Generate goals based on user input and skills
  const goals = [];
  
  if (careerGoals.length > 0) {
    careerGoals.forEach((goal, index) => {
      goals.push({
        id: `prof-${index + 1}`,
        title: goal,
        description: `Plan específico para: ${goal.toLowerCase()}`,
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
        progress: 0,
        milestones: [
          {
            id: `milestone-${index + 1}-1`,
            title: 'Evaluación inicial y planificación',
            deadline: '1 mes',
            completed: false
          },
          {
            id: `milestone-${index + 1}-2`,
            title: 'Desarrollo de habilidades clave',
            deadline: '3 meses',
            completed: false
          },
          {
            id: `milestone-${index + 1}-3`,
            title: 'Implementación y resultados',
            deadline: '6 meses',
            completed: false
          }
        ]
      });
    });
  }

  // Generate skills to acquire based on missing skills and goals
  const allProfessionalSkills = ['Liderazgo', 'Comunicación efectiva', 'Gestión de proyectos', 'Análisis de datos', 'Presentaciones públicas'];
  const skillsToAcquire = allProfessionalSkills
    .filter(skill => !userProfile.currentSkills.includes(skill))
    .slice(0, 4)
    .map(skill => ({
      name: skill,
      currentLevel: 'Principiante',
      targetLevel: 'Intermedio-Avanzado',
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
    goal.includes('física') || goal.includes('salud')
  );

  // Generate workout routine based on exercise preference and available time
  const workoutRoutine = [];
  const exerciseType = userProfile.preferences.exerciseType;
  
  if (exerciseType === 'cardio') {
    workoutRoutine.push({
      name: 'Cardio Intensivo',
      duration: userProfile.timeAvailable === '1-3 horas' ? 20 : 30,
      difficulty: 'intermediate' as const,
      exercises: [
        { name: 'Correr/Trotar', instructions: 'Mantén un ritmo constante', duration: '15-20 min' },
        { name: 'Jumping Jacks', instructions: 'Series explosivas', sets: 3, reps: 30 },
        { name: 'Burpees', instructions: 'Movimiento completo', sets: 3, reps: 10 }
      ]
    });
  } else if (exerciseType === 'fuerza') {
    workoutRoutine.push({
      name: 'Entrenamiento de Fuerza',
      duration: userProfile.timeAvailable === '1-3 horas' ? 30 : 45,
      difficulty: 'intermediate' as const,
      exercises: [
        { name: 'Flexiones', instructions: 'Forma perfecta, control en bajada', sets: 3, reps: 15 },
        { name: 'Sentadillas', instructions: 'Baja hasta 90 grados', sets: 3, reps: 20 },
        { name: 'Plancha', instructions: 'Mantén el core activado', duration: '30-60 seg', sets: 3 }
      ]
    });
  } else if (exerciseType === 'yoga') {
    workoutRoutine.push({
      name: 'Sesión de Yoga',
      duration: userProfile.timeAvailable === '1-3 horas' ? 25 : 45,
      difficulty: 'beginner' as const,
      exercises: [
        { name: 'Saludo al Sol', instructions: 'Secuencia completa, respiración consciente', duration: '10 min' },
        { name: 'Posturas de pie', instructions: 'Guerrero I, II, triángulo', duration: '15 min' },
        { name: 'Relajación final', instructions: 'Savasana con meditación', duration: '10 min' }
      ]
    });
  }

  // Generate progress tracking metrics
  const progressTracking = [
    {
      name: 'Peso corporal',
      currentValue: 70,
      targetValue: userProfile.goals.includes('Mejorar mi condición física') ? 65 : 70,
      unit: 'kg',
      trackingFrequency: 'weekly' as const
    },
    {
      name: 'Resistencia cardiovascular',
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
    if (userProfile.experience === 'avanzado') {
      skillLevel = 'intermediate';
    } else if (userProfile.experience === 'intermedio') {
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
    title: `Curso de ${hobby}`,
    description: `Aprende ${hobby.toLowerCase()} desde cero con expertos`,
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
      'Al despertar - 1 vaso',
      'Antes de cada comida - 1 vaso',
      'Media tarde - 1 vaso',
      'Antes de dormir - 1 vaso'
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
      title: 'Primer Plan Creado',
      description: '¡Has creado tu primer plan de estilo de vida personalizado!',
      icon: '🎯',
      unlocked: true,
      unlockedDate: new Date().toLocaleDateString()
    },
    {
      id: 'goal-setter',
      title: 'Establecedor de Metas',
      description: `Has definido ${userProfile.goals.length} objetivos claros para tu crecimiento`,
      icon: '🎪',
      unlocked: userProfile.goals.length >= 3,
      unlockedDate: userProfile.goals.length >= 3 ? new Date().toLocaleDateString() : undefined
    },
    {
      id: 'self-aware',
      title: 'Autoconocimiento',
      description: 'Has identificado tus fortalezas y áreas de mejora',
      icon: '🧠',
      unlocked: userProfile.currentChallenges.length > 0,
      unlockedDate: userProfile.currentChallenges.length > 0 ? new Date().toLocaleDateString() : undefined
    }
  ];

  return achievements;
}

// Helper functions
function getSkillLearningTime(skill: string, timeAvailable: string): string {
  const baseTime = skill === 'Liderazgo' ? '6-12 meses' : 
                   skill === 'Análisis de datos' ? '3-6 meses' : '2-4 meses';
  
  if (timeAvailable === '1-3 horas') return baseTime;
  if (timeAvailable === '15+ horas') return baseTime.split('-')[0] + ' meses';
  return baseTime;
}

function generateProfessionalResources(userProfile: UserProfile) {
  const budget = userProfile.preferences.budget;
  const learningStyle = userProfile.preferences.learningStyle;
  
  const resources = [];
  
  if (learningStyle === 'visual' || learningStyle === 'mixto') {
    resources.push({
      title: 'Coursera Professional Courses',
      description: 'Cursos con certificación profesional en tu área',
      cost: budget === '0-50' ? 'free' : 'subscription' as const,
      estimatedTime: '4-6 semanas',
      url: 'https://coursera.org'
    });
  }
  
  if (learningStyle === 'auditivo' || learningStyle === 'mixto') {
    resources.push({
      title: 'LinkedIn Learning Podcasts',
      description: 'Podcasts profesionales y audiobooks especializados',
      cost: 'subscription' as const,
      estimatedTime: '30 min/día',
      url: 'https://linkedin.com/learning'
    });
  }

  return resources;
}

function calculateHobbyTime(timeAvailable: string): string {
  if (timeAvailable === '1-3 horas') return '30-45 min/semana';
  if (timeAvailable === '4-7 horas') return '1-2 horas/semana';
  if (timeAvailable === '8-15 horas') return '2-4 horas/semana';
  return '4+ horas/semana';
}

function generateHobbyGoals(hobby: string): string[] {
  const goalMap: { [key: string]: string[] } = {
    'Lectura y escritura': ['Leer 2 libros por mes', 'Escribir artículos semanales', 'Participar en club de lectura'],
    'Música (tocar instrumentos)': ['Aprender 5 canciones básicas', 'Practicar 30 min diarios', 'Grabar primera composición'],
    'Cocina y gastronomía': ['Dominar 10 recetas base', 'Experimentar con nuevas técnicas', 'Organizar cena para amigos'],
    'Fotografía': ['Entender conceptos básicos', 'Completar 30 fotos por semana', 'Crear primer portfolio'],
    'Programación por hobby': ['Completar primer proyecto personal', 'Aprender nuevo framework', 'Contribuir a open source']
  };
  
  return goalMap[hobby] || ['Aprender fundamentos', 'Practicar regularmente', 'Crear primer proyecto'];
}

function generateHobbyNextSteps(hobby: string, skillLevel: string): string[] {
  const steps = [
    `Investigar recursos de aprendizaje para ${hobby.toLowerCase()}`,
    'Establecer rutina de práctica semanal',
    'Conectar con comunidad de practicantes',
    'Definir primer proyecto práctico'
  ];
  
  if (skillLevel === 'intermediate') {
    steps.push('Explorar técnicas avanzadas', 'Considerar enseñar a principiantes');
  }
  
  return steps;
}

function generateProjectName(hobby: string): string {
  const nameMap: { [key: string]: string } = {
    'Lectura y escritura': 'Blog Personal de Reseñas',
    'Música (tocar instrumentos)': 'Primera Grabación Musical',
    'Cocina y gastronomía': 'Recetario Personal',
    'Fotografía': 'Serie Fotográfica Temática',
    'Programación por hobby': 'Aplicación Web Personal'
  };
  
  return nameMap[hobby] || `Proyecto de ${hobby}`;
}

function generateProjectDescription(hobby: string): string {
  return `Un proyecto práctico para aplicar y mostrar tus habilidades en ${hobby.toLowerCase()}`;
}

function generateProjectSteps(hobby: string): string[] {
  return [
    'Planificación y diseño inicial',
    'Investigación y recopilación de recursos',
    'Desarrollo/Creación principal',
    'Revisión y refinamiento',
    'Presentación y compartir resultados'
  ];
}

function generateWeeklyMealPlan(dietType: string) {
  // This would generate a full weekly meal plan based on diet type
  // For brevity, returning a simplified structure
  return [
    {
      day: 'Lunes',
      breakfast: { name: 'Avena con frutas', calories: 300, prepTime: 10 },
      lunch: { name: 'Ensalada mediterránea', calories: 450, prepTime: 15 },
      dinner: { name: 'Salmón con vegetales', calories: 500, prepTime: 25 },
      snacks: [{ name: 'Frutos secos', calories: 150 }],
      totalCalories: 1400,
      macros: { protein: 85, carbs: 120, fats: 65, fiber: 25 }
    }
    // ... more days would be generated
  ];
}

function generateShoppingList(dietType: string) {
  const lists: { [key: string]: any } = {
    'balanceada': {
      proteins: ['Pollo', 'Pescado', 'Huevos', 'Legumbres'],
      vegetables: ['Brócoli', 'Espinacas', 'Tomates', 'Zanahorias'],
      fruits: ['Manzanas', 'Plátanos', 'Berries', 'Naranjas'],
      estimatedCost: '$80-120 USD'
    },
    'vegetariana': {
      proteins: ['Tofu', 'Tempeh', 'Legumbres', 'Quinoa'],
      vegetables: ['Kale', 'Espinacas', 'Calabacín', 'Pimientos'],
      fruits: ['Aguacate', 'Berries', 'Cítricos', 'Mango'],
      estimatedCost: '$60-90 USD'
    }
  };
  
  return lists[dietType] || lists['balanceada'];
}

function generateSupplements(dietType: string, goals: string[]) {
  const supplements = [
    {
      name: 'Multivitamínico',
      purpose: 'Asegurar ingesta adecuada de vitaminas y minerales',
      dosage: '1 cápsula diaria',
      timing: 'Con el desayuno',
      optional: false
    }
  ];
  
  if (goals.includes('Mejorar mi condición física')) {
    supplements.push({
      name: 'Proteína en polvo',
      purpose: 'Apoyar desarrollo y recuperación muscular',
      dosage: '1 scoop (25g)',
      timing: 'Post-entrenamiento',
      optional: true
    });
  }
  
  return supplements;
} 
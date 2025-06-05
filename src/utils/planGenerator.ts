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

export function generatePersonalizedPlan(userProfile: UserProfile): Omit<LifestylePlan, 'id' | 'createdAt' | 'updatedAt' | 'name'> {
  const ageNumber = parseInt(userProfile.age);
  const timeHours = parseInt(userProfile.timeAvailable.split('-')[0]) || 2;
  
  return {
    userProfile,
    professional: generateProfessionalPlan(userProfile),
    fitness: generateFitnessPlan(userProfile),
    hobbies: generateHobbiesPlan(userProfile),
    nutrition: generateNutritionPlan(userProfile),
    personalizedInsights: generatePersonalizedInsights(userProfile),
    weeklySchedule: generateWeeklySchedule(userProfile),
    achievements: generateAchievements(userProfile)
  };
}

function generatePersonalizedInsights(userProfile: UserProfile): PersonalizedInsights {
  const ageNumber = parseInt(userProfile.age);
  const timeHours = parseInt(userProfile.timeAvailable.split('-')[0]) || 2;
  
  let strengths: string[] = [];
  let improvementAreas: string[] = [];
  let personalityBasedTips: string[] = [];
  let motivationStyle = '';
  let preferredLearningStyle = '';
  
  // Analyze based on goals
  if (userProfile.goals.includes('Carrera')) {
    strengths.push('Enfoque en crecimiento profesional');
    personalityBasedTips.push('Tu orientación profesional sugiere que disfrutas de desafíos estructurados');
  }
  
  if (userProfile.goals.includes('Salud')) {
    strengths.push('Consciencia sobre la importancia del bienestar');
    personalityBasedTips.push('Tu interés en la salud indica que valoras la consistencia y el progreso gradual');
  }
  
  if (userProfile.goals.includes('Creatividad')) {
    strengths.push('Mente creativa y curiosa');
    personalityBasedTips.push('Tu lado creativo se beneficia de sesiones de lluvia de ideas y experimentación libre');
  }
  
  // Age-based insights
  if (ageNumber < 25) {
    improvementAreas.push('Establecimiento de rutinas sólidas');
    motivationStyle = 'Exploración y experimentación con diferentes enfoques';
    preferredLearningStyle = 'Aprendizaje visual e interactivo con tecnología';
  } else if (ageNumber < 35) {
    improvementAreas.push('Balance trabajo-vida personal');
    motivationStyle = 'Logros medibles y progreso visible hacia objetivos específicos';
    preferredLearningStyle = 'Aprendizaje estructurado con aplicación práctica inmediata';
  } else {
    improvementAreas.push('Adaptación a nuevas tecnologías y metodologías');
    motivationStyle = 'Impacto positivo y transferencia de conocimiento a otros';
    preferredLearningStyle = 'Aprendizaje basado en experiencia con mentoría';
  }
  
  // Time-based optimization
  const timeOptimization: string[] = [];
  if (timeHours < 3) {
    timeOptimization.push('Implementa la técnica Pomodoro para maximizar sesiones cortas');
    timeOptimization.push('Aprovecha tiempos muertos (transporte, esperas) para aprendizaje pasivo');
    timeOptimization.push('Combina actividades (audiobooks durante ejercicio)');
  } else if (timeHours < 5) {
    timeOptimization.push('Divide tu tiempo en bloques temáticos para mayor efectividad');
    timeOptimization.push('Dedica 80% a una prioridad principal y 20% a exploración');
    timeOptimization.push('Programa sesiones de deep work sin interrupciones');
  } else {
    timeOptimization.push('Implementa la regla 50/30/20: 50% prioridades, 30% desarrollo, 20% exploración');
    timeOptimization.push('Incluye tiempo para reflexión y planificación semanal');
    timeOptimization.push('Considera mentorear a otros como forma de consolidar aprendizaje');
  }
  
  return {
    strengths,
    improvementAreas,
    personalityBasedTips,
    motivationStyle,
    preferredLearningStyle,
    timeOptimization
  };
}

function generateProfessionalPlan(userProfile: UserProfile) {
  const profession = userProfile.profession.toLowerCase();
  const workStyle = userProfile.preferences.workStyle;
  
  // Generate career path based on profession and work style
  const careerPath: CareerPath = {
    currentRole: userProfile.profession,
    targetRole: getTargetRole(profession, workStyle),
    stepsByStep: getCareerSteps(profession, workStyle),
    estimatedTimeframe: '2-3 años',
    salaryGrowthPotential: '25-40% incremento'
  };
  
  const goals: Goal[] = [
    {
      id: 'prof-1',
      title: `Dominar tecnologías clave en ${userProfile.profession}`,
      description: 'Desarrollar expertise en las herramientas y tecnologías más demandadas en tu campo',
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 20,
      completed: false,
      milestones: [
        { id: 'm1', title: 'Completar curso fundacional', deadline: '2024-02-15', completed: false },
        { id: 'm2', title: 'Construir proyecto personal', deadline: '2024-03-30', completed: false },
        { id: 'm3', title: 'Obtener certificación', deadline: '2024-05-15', completed: false }
      ],
      priority: 'high'
    }
  ];
  
  const skills: Skill[] = getRelevantSkills(profession, workStyle);
  const resources: Resource[] = getCareerResources(profession, workStyle);
  const networking: NetworkingPlan = getNetworkingPlan(profession);
  const timeManagement: TimeManagementTips[] = getTimeManagementTips();
  
  return {
    goals,
    shortTermObjectives: goals.slice(0, 2),
    longTermObjectives: goals.slice(2),
    skillsToAcquire: skills,
    careerPath,
    resources,
    networking,
    timeManagement
  };
}

function generateFitnessPlan(userProfile: UserProfile) {
  const exerciseType = userProfile.preferences.exerciseType;
  const timeHours = parseInt(userProfile.timeAvailable.split('-')[0]) || 2;
  
  const workoutRoutine: WorkoutSession[] = getWorkoutSessions(exerciseType, timeHours);
  const fitnessGoals: Goal[] = [
    {
      id: 'fit-1',
      title: 'Establecer rutina de ejercicio consistente',
      description: 'Ejercitarse al menos 3 veces por semana durante 4 semanas consecutivas',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      completed: false,
      milestones: [
        { id: 'f1', title: 'Primera semana completa', deadline: '2024-01-15', completed: false },
        { id: 'f2', title: 'Dos semanas consecutivas', deadline: '2024-01-22', completed: false }
      ],
      priority: 'high'
    }
  ];
  
  return {
    workoutRoutine,
    weeklySchedule: generateFitnessSchedule(exerciseType),
    fitnessGoals,
    nutrition: {
      preWorkout: ['Banana con mantequilla de maní', 'Avena con frutas'],
      postWorkout: ['Batido de proteína', 'Yogurt griego con berries'],
      hydrationTips: ['Bebe 500ml de agua 2 horas antes', 'Hidrata cada 15-20min durante ejercicio'],
      supplementSuggestions: ['Proteína en polvo', 'Creatina (opcional)', 'Multivitamínico']
    },
    progressTracking: [
      { name: 'Peso corporal', unit: 'kg', currentValue: 70, targetValue: 68, trackingFrequency: 'weekly' },
      { name: 'Cardio resistencia', unit: 'minutos', currentValue: 20, targetValue: 45, trackingFrequency: 'weekly' }
    ],
    equipmentNeeded: getEquipmentForExerciseType(exerciseType),
    safetyTips: [
      'Siempre calienta antes de ejercitarte',
      'Mantén buena forma sobre intensidad',
      'Escucha a tu cuerpo y descansa cuando lo necesites'
    ]
  };
}

function generateHobbiesPlan(userProfile: UserProfile) {
  const selectedHobbies: DetailedHobby[] = userProfile.preferences.hobbies.map(hobby => ({
    name: hobby,
    skillLevel: 'beginner',
    timeCommitment: '3-5 horas por semana',
    learningGoals: getHobbyLearningGoals(hobby),
    nextSteps: getHobbyNextSteps(hobby),
    communityLinks: getHobbyCommunities(hobby)
  }));
  
  return {
    selectedHobbies,
    timeAllocation: [
      { activity: 'Práctica principal', weeklyHours: 4, bestTimeSlots: ['Evenings', 'Weekends'], flexibility: 'medium' },
      { activity: 'Teoría/Estudio', weeklyHours: 2, bestTimeSlots: ['Morning', 'Lunch break'], flexibility: 'high' }
    ],
    resources: getHobbyResources(userProfile.preferences.hobbies),
    learningPath: getHobbyLearningPath(userProfile.preferences.hobbies[0] || 'Reading'),
    community: getHobbyCommunitiesDetailed(userProfile.preferences.hobbies),
    projects: getHobbyProjects(userProfile.preferences.hobbies),
    skillProgression: selectedHobbies.map(hobby => ({
      skill: hobby.name,
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      timeToAchieve: '6 meses',
      milestones: [`Completar primer proyecto de ${hobby.name}`, `Unirse a comunidad local`, 'Enseñar a un principiante']
    }))
  };
}

function generateNutritionPlan(userProfile: UserProfile) {
  const dietType = userProfile.preferences.dietType;
  const mealPlan: DailyMealPlan[] = generateWeeklyMealPlan(dietType);
  
  return {
    dietType: dietType || 'Balanceado',
    mealPlan,
    restrictions: userProfile.preferences.dietType ? [userProfile.preferences.dietType] : [],
    recommendations: [
      { category: 'Hidratación', recommendation: 'Bebe 2-3 litros de agua al día', reason: 'Mantiene el metabolismo activo', priority: 'high' },
      { category: 'Timing', recommendation: 'Come cada 3-4 horas', reason: 'Estabiliza niveles de azúcar en sangre', priority: 'medium' }
    ],
    shoppingList: generateShoppingList(dietType),
    hydrationPlan: {
      dailyWaterGoal: 2.5,
      reminders: ['Al despertar', 'Antes de cada comida', 'Durante ejercicio'],
      flavoringOptions: ['Limón', 'Pepino', 'Menta', 'Frutas congeladas']
    },
    supplements: [
      { name: 'Vitamina D', dosage: '1000 IU', timing: 'Con desayuno', purpose: 'Salud ósea e inmune', optional: false },
      { name: 'Omega-3', dosage: '1g', timing: 'Con cena', purpose: 'Salud cardiovascular', optional: true }
    ],
    mealPrepTips: [
      'Prepara proteínas los domingos para toda la semana',
      'Corta vegetales después de comprarlos',
      'Prepara snacks saludables en porciones individuales'
    ]
  };
}

function generateWeeklySchedule(userProfile: UserProfile): WeeklySchedule {
  // This would generate a detailed weekly schedule based on all the plans
  // For brevity, I'll create a simplified version
  const baseActivity = {
    id: 'base-1',
    name: 'Rutina matutina',
    duration: 30,
    type: 'rest' as const,
    description: 'Tiempo para prepararse para el día',
    priority: 'medium' as const
  };
  
  return {
    monday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Inicio de semana productiva' },
    tuesday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Día de desarrollo profesional' },
    wednesday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Punto medio - evaluación' },
    thursday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Preparación para fin de semana' },
    friday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Cierre de semana' },
    saturday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Tiempo para hobbies' },
    sunday: { morning: [baseActivity], afternoon: [], evening: [], notes: 'Descanso y planificación' }
  };
}

function generateAchievements(userProfile: UserProfile): Achievement[] {
  return [
    {
      id: 'ach-1',
      title: 'Primer Plan Creado',
      description: 'Has creado tu primer plan de estilo de vida personalizado',
      unlocked: true,
      unlockedDate: new Date().toISOString().split('T')[0],
      icon: '🎯',
      category: 'professional'
    },
    {
      id: 'ach-2',
      title: 'Semana Completa',
      description: 'Completa una semana siguiendo tu plan',
      unlocked: false,
      icon: '📅',
      category: 'professional'
    }
  ];
}

// Helper functions (simplified for brevity)
function getTargetRole(profession: string, workStyle: string): string {
  const roleMap: { [key: string]: string } = {
    'desarrollador': 'Senior Developer / Tech Lead',
    'diseñador': 'Creative Director / UX Lead',
    'marketing': 'Marketing Manager / Strategy Lead',
    'ventas': 'Sales Manager / Business Development',
    'estudiante': `Junior ${profession} Professional`
  };
  return roleMap[profession] || 'Senior Professional';
}

function getCareerSteps(profession: string, workStyle: string) {
  return [
    {
      step: 1,
      title: 'Desarrollar habilidades fundamentales',
      description: 'Dominar las competencias básicas de tu campo',
      estimatedDuration: '3-6 meses',
      requirements: ['Curso especializado', 'Proyecto práctico', 'Feedback de expertos']
    },
    {
      step: 2,
      title: 'Ganar experiencia práctica',
      description: 'Aplicar conocimientos en proyectos reales',
      estimatedDuration: '6-12 meses',
      requirements: ['Portfolio sólido', 'Referencias profesionales', 'Networking activo']
    }
  ];
}

function getRelevantSkills(profession: string, workStyle: string): Skill[] {
  return [
    {
      name: 'Liderazgo',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      resources: [
        {
          type: 'book',
          title: 'The 7 Habits of Highly Effective People',
          description: 'Principios fundamentales de liderazgo efectivo',
          cost: 'paid',
          estimatedTime: '2 semanas'
        }
      ],
      estimatedTimeToLearn: '6 meses'
    }
  ];
}

function getCareerResources(profession: string, workStyle: string): Resource[] {
  return [
    {
      type: 'course',
      title: `Especialización en ${profession}`,
      url: 'https://coursera.org',
      description: 'Curso completo para avanzar en tu carrera',
      estimatedTime: '3 meses',
      cost: 'paid',
      rating: 4.5
    }
  ];
}

function getNetworkingPlan(profession: string): NetworkingPlan {
  return {
    platforms: ['LinkedIn', 'GitHub', 'Twitter profesional'],
    events: ['Conferencias de industria', 'Meetups locales', 'Webinars especializados'],
    mentorshipGoals: ['Encontrar mentor senior', 'Mentorear a junior', 'Participar en comunidades'],
    industryContacts: ['Colegas actuales', 'Ex-compañeros', 'Profesionales en empresas objetivo']
  };
}

function getTimeManagementTips(): TimeManagementTips[] {
  return [
    {
      technique: 'Técnica Pomodoro',
      description: '25 minutos de trabajo enfocado + 5 minutos de descanso',
      timeSlot: 'Mañanas',
      difficulty: 'easy'
    },
    {
      technique: 'Time Blocking',
      description: 'Asignar bloques específicos del día a diferentes tipos de actividades',
      timeSlot: 'Todo el día',
      difficulty: 'medium'
    }
  ];
}

function getWorkoutSessions(exerciseType: string, timeHours: number): WorkoutSession[] {
  const routines: { [key: string]: WorkoutSession[] } = {
    'cardio': [
      {
        name: 'Cardio HIIT',
        duration: 30,
        exercises: [
          { name: 'Jumping Jacks', duration: 60, instructions: 'Mantén ritmo constante', muscleGroups: ['Cardio'] },
          { name: 'Burpees', sets: 3, reps: 10, instructions: 'Forma correcta sobre velocidad', muscleGroups: ['Full body'] }
        ],
        difficulty: 'intermediate',
        equipment: ['Ninguno']
      }
    ],
    'fuerza': [
      {
        name: 'Entrenamiento de Fuerza',
        duration: 45,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 12, instructions: 'Mantén línea recta del cuerpo', muscleGroups: ['Pecho', 'Brazos'] },
          { name: 'Squats', sets: 3, reps: 15, instructions: 'Baja hasta que muslos estén paralelos', muscleGroups: ['Piernas'] }
        ],
        difficulty: 'beginner',
        equipment: ['Peso corporal']
      }
    ]
  };
  
  return routines[exerciseType] || routines['cardio'];
}

function getEquipmentForExerciseType(exerciseType: string): string[] {
  const equipment: { [key: string]: string[] } = {
    'cardio': ['Zapatos deportivos', 'Ropa cómoda', 'Botella de agua'],
    'fuerza': ['Pesas ajustables', 'Banda elástica', 'Colchoneta'],
    'yoga': ['Colchoneta de yoga', 'Bloques', 'Correa'],
    'deportes': ['Equipamiento específico del deporte'],
    'mixto': ['Zapatos deportivos', 'Pesas ligeras', 'Colchoneta']
  };
  
  return equipment[exerciseType] || equipment['cardio'];
}

function generateFitnessSchedule(exerciseType: string) {
  return {
    monday: { workout: getWorkoutSessions(exerciseType, 1)[0] },
    tuesday: { restDay: true },
    wednesday: { workout: getWorkoutSessions(exerciseType, 1)[0] },
    thursday: { activeRecovery: 'Caminata de 20 minutos' },
    friday: { workout: getWorkoutSessions(exerciseType, 1)[0] },
    saturday: { activeRecovery: 'Yoga o estiramiento' },
    sunday: { restDay: true }
  };
}

// Additional helper functions would continue here...
// For brevity, I'm including key ones that demonstrate the concept

function getHobbyLearningGoals(hobby: string): string[] {
  const goals: { [key: string]: string[] } = {
    'Lectura': ['Leer 12 libros al año', 'Diversificar géneros', 'Unirse a club de lectura'],
    'Música': ['Aprender instrumento básico', 'Entender teoría musical', 'Tocar primera canción completa'],
    'Fotografía': ['Dominar regla de tercios', 'Entender exposición', 'Crear primer portfolio'],
    'Cocina': ['Dominar 10 recetas básicas', 'Entender técnicas fundamentales', 'Cocinar sin receta'],
    'Arte': ['Completar primer proyecto', 'Aprender técnica específica', 'Exponer trabajo'],
    'Tecnología': ['Completar primer proyecto de código', 'Entender conceptos fundamentales', 'Contribuir a proyecto open source']
  };
  
  return goals[hobby] || ['Aprender fundamentos', 'Practicar regularmente', 'Unirse a comunidad'];
}

function getHobbyNextSteps(hobby: string): string[] {
  return [
    'Investigar recursos de aprendizaje',
    'Dedicar 30 minutos diarios de práctica',
    'Conectar con otros entusiastas',
    'Establecer primer proyecto pequeño'
  ];
}

function getHobbyCommunities(hobby: string): string[] {
  return [
    'Grupos de Facebook especializados',
    'Subreddits relacionados',
    'Comunidades locales',
    'Canales de YouTube educativos'
  ];
}

function generateWeeklyMealPlan(dietType: string): DailyMealPlan[] {
  // Simplified meal plan generation
  const sampleMeal = {
    name: 'Ensalada mediterránea',
    ingredients: ['Lechuga', 'Tomate', 'Pepino', 'Aceitunas', 'Queso feta'],
    calories: 350,
    prepTime: 15
  };
  
  return [
    {
      day: 'Lunes',
      breakfast: sampleMeal,
      lunch: sampleMeal,
      dinner: sampleMeal,
      snacks: [sampleMeal],
      totalCalories: 1500,
      macros: { protein: 80, carbs: 150, fats: 60, fiber: 25 }
    }
    // ... more days would be generated
  ];
}

function generateShoppingList(dietType: string) {
  const lists: { [key: string]: any } = {
    'vegetariano': {
      proteins: ['Tofu', 'Lentejas', 'Garbanzos', 'Quinoa'],
      vegetables: ['Espinaca', 'Brócoli', 'Zanahorias', 'Pimientos'],
      fruits: ['Manzanas', 'Bananas', 'Berries', 'Naranjas'],
      grains: ['Avena', 'Arroz integral', 'Pan integral'],
      dairy: ['Yogur griego', 'Leche de almendra', 'Queso'],
      pantryItems: ['Aceite de oliva', 'Especias', 'Nueces'],
      estimatedCost: '$80-100 por semana'
    }
  };
  
  return lists[dietType] || lists['vegetariano'];
}

function getHobbyResources(hobbies: string[]): Resource[] {
  return [
    {
      type: 'app',
      title: 'Duolingo (para idiomas)',
      description: 'App para aprender idiomas de forma gamificada',
      cost: 'free',
      rating: 4.7
    },
    {
      type: 'course',
      title: 'MasterClass',
      description: 'Cursos de expertos en diversas áreas creativas',
      cost: 'subscription',
      rating: 4.5
    }
  ];
}

function getHobbyLearningPath(hobby: string) {
  return [
    {
      step: 1,
      skill: 'Fundamentos básicos',
      duration: '2-4 semanas',
      resources: [],
      prerequisites: []
    },
    {
      step: 2,
      skill: 'Práctica estructurada',
      duration: '2-3 meses',
      resources: [],
      prerequisites: ['Fundamentos básicos']
    }
  ];
}

function getHobbyCommunitiesDetailed(hobbies: string[]) {
  return [
    {
      type: 'online' as const,
      name: 'Reddit Communities',
      description: 'Comunidades activas para cada hobby',
      url: 'https://reddit.com',
      cost: 'free' as const
    }
  ];
}

function getHobbyProjects(hobbies: string[]) {
  return [
    {
      id: 'proj-1',
      name: 'Primer proyecto personal',
      description: 'Crear algo significativo usando tu nuevo hobby',
      estimatedDuration: '2-4 semanas',
      difficulty: 'easy' as const,
      skills: ['Creatividad', 'Persistencia'],
      steps: ['Planificación', 'Ejecución', 'Refinamiento', 'Compartir']
    }
  ];
} 
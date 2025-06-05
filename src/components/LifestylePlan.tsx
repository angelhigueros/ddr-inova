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
  Edit3
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createPlan, updatePlan } from '@/store/plansSlice';
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

  const handleSubmitFeedback = () => {
    if (isEditing && plan.id) {
      // Update existing plan with feedback
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
    { id: 'insights', label: 'Insights Personalizados', icon: <Star className="w-5 h-5" />, step: 1 },
    { id: 'professional', label: 'Profesional', icon: <BookOpen className="w-5 h-5" />, step: 2 },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-5 h-5" />, step: 3 },
    { id: 'hobbies', label: 'Hobbies', icon: <Palette className="w-5 h-5" />, step: 4 },
    { id: 'nutrition', label: 'Nutrición', icon: <UtensilsCrossed className="w-5 h-5" />, step: 5 },
    { id: 'achievements', label: 'Logros', icon: <Award className="w-5 h-5" />, step: 6 },
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
    const strengths = [...plan.personalizedInsights.strengths];
    const userProfile = plan.userProfile;
    
    // Add strengths based on profession
    if (userProfile.profession.toLowerCase().includes('programador') || userProfile.profession.toLowerCase().includes('desarrollador')) {
      strengths.push('Pensamiento lógico y resolución sistemática de problemas');
      strengths.push('Capacidad de aprendizaje continuo y adaptación tecnológica');
    } else if (userProfile.profession.toLowerCase().includes('profesor') || userProfile.profession.toLowerCase().includes('educador')) {
      strengths.push('Habilidades comunicativas y capacidad de enseñanza');
      strengths.push('Paciencia y estructuración del conocimiento');
    } else if (userProfile.profession.toLowerCase().includes('diseñador')) {
      strengths.push('Creatividad visual y pensamiento estético');
      strengths.push('Atención al detalle y sensibilidad artística');
    } else if (userProfile.profession.toLowerCase().includes('gerente') || userProfile.profession.toLowerCase().includes('manager')) {
      strengths.push('Liderazgo natural y habilidades organizativas');
      strengths.push('Capacidad de coordinación y toma de decisiones');
    }
    
    // Add strengths based on work style
    if (userProfile.preferences.workStyle === 'remoto') {
      strengths.push('Autodisciplina y capacidad de trabajo independiente');
      strengths.push('Flexibilidad y adaptabilidad al trabajo digital');
    } else if (userProfile.preferences.workStyle === 'hibrido') {
      strengths.push('Versatilidad para diferentes entornos de trabajo');
      strengths.push('Equilibrio entre colaboración e independencia');
    }
    
    // Add strengths based on exercise preferences
    if (userProfile.preferences.exerciseType === 'yoga') {
      strengths.push('Enfoque en el bienestar mental y físico integral');
      strengths.push('Capacidad de concentración y mindfulness');
    } else if (userProfile.preferences.exerciseType === 'fuerza') {
      strengths.push('Determinación y persistencia en objetivos físicos');
      strengths.push('Disciplina para rutinas estructuradas');
    } else if (userProfile.preferences.exerciseType === 'deportes') {
      strengths.push('Espíritu colaborativo y trabajo en equipo');
      strengths.push('Competitividad saludable y motivación social');
    }
    
    // Add strengths based on hobbies
    if (userProfile.preferences.hobbies.some(hobby => hobby.toLowerCase().includes('lectura'))) {
      strengths.push('Curiosidad intelectual y capacidad de concentración');
      strengths.push('Análisis crítico y expansión continua del conocimiento');
    }
    if (userProfile.preferences.hobbies.some(hobby => hobby.toLowerCase().includes('música'))) {
      strengths.push('Sensibilidad artística y disciplina de práctica');
      strengths.push('Capacidad de expresión emocional y creatividad');
    }
    if (userProfile.preferences.hobbies.some(hobby => hobby.toLowerCase().includes('cocina'))) {
      strengths.push('Creatividad práctica y atención a los detalles');
      strengths.push('Paciencia y experimentación controlada');
    }
    
    return strengths.slice(0, 6); // Limit to 6 strengths
  };

  // Generate personalized tips based on user profile
  const generatePersonalizedTips = () => {
    const baseTips = [...plan.personalizedInsights.personalityBasedTips];
    const userProfile = plan.userProfile;
    const age = userProfile.age;
    const timeAvailable = userProfile.timeAvailable;
    const goals = userProfile.goals;
    
    // Tips based on age group
    if (age === '18-25') {
      baseTips.push('Aprovecha esta etapa para experimentar y definir tus pasiones. Establece rutinas de aprendizaje que te acompañarán toda la vida.');
      baseTips.push('Invierte tiempo en networking y construcción de relaciones profesionales. Son fundamentales para tu crecimiento futuro.');
    } else if (age === '26-35') {
      baseTips.push('Enfócate en especialización y desarrollo de expertise. Es el momento ideal para consolidar tu carrera profesional.');
      baseTips.push('Equilibra ambición profesional con bienestar personal. Establece límites claros entre trabajo y vida personal.');
    } else if (age === '36-45') {
      baseTips.push('Capitaliza tu experiencia mentoreando a otros. Esto reforzará tu propio conocimiento y expandirá tu red profesional.');
      baseTips.push('Considera diversificar tus ingresos o explorar nuevas áreas que complementen tu expertise actual.');
    } else if (age === '46-55') {
      baseTips.push('Enfócate en liderar y transferir conocimiento. Tu experiencia es invaluable para las nuevas generaciones.');
      baseTips.push('Mantén activa tu curiosidad y adaptabilidad. El aprendizaje continuo es clave para mantenerse relevante.');
    } else if (age === '56+') {
      baseTips.push('Considera roles de consultoría o mentoría que aprovechen tu vasta experiencia y conocimiento acumulado.');
      baseTips.push('Enfócate en proyectos que te apasionen y aporten significado personal, más allá del beneficio económico.');
    }
    
    // Tips based on available time
    if (timeAvailable === '1-3 horas') {
      baseTips.push('Maximiza tu tiempo con técnicas de microaprendizaje. 15-20 minutos diarios pueden generar grandes resultados a largo plazo.');
      baseTips.push('Prioriza actividades de alto impacto. Enfócate en las tareas que generen el 80% de tus resultados.');
    } else if (timeAvailable === '15+ horas') {
      baseTips.push('Con más tiempo disponible, puedes permitirte explorar proyectos más ambiciosos y de largo plazo.');
      baseTips.push('Considera dividir tu tiempo en bloques temáticos para mantener el enfoque y evitar la dispersión.');
    }
    
    // Tips based on goals
    if (goals.some(goal => goal.toLowerCase().includes('carrera') || goal.toLowerCase().includes('profesional'))) {
      baseTips.push('Desarrolla un plan de carrera a 5 años con hitos específicos. Revísalo y ajústalo cada 6 meses.');
      baseTips.push('Identifica las habilidades más demandadas en tu industria y créate un plan de desarrollo específico.');
    }
    
    if (goals.some(goal => goal.toLowerCase().includes('salud') || goal.toLowerCase().includes('fitness'))) {
      baseTips.push('Integra el ejercicio en tu rutina diaria como si fuera una cita médica importante. La consistencia es más valiosa que la intensidad.');
      baseTips.push('Combina ejercicio con aprendizaje: escucha podcasts o audiolibros mientras caminas o haces cardio.');
    }
    
    if (goals.some(goal => goal.toLowerCase().includes('habilidad') || goal.toLowerCase().includes('aprender'))) {
      baseTips.push('Aplica la regla del 1% diario: mejora un poco cada día. En un año habrás mejorado 37 veces.');
      baseTips.push('Enseña lo que aprendes. Explicar conceptos a otros consolidará tu propio aprendizaje.');
    }
    
    // Tips based on profession
    if (userProfile.profession.toLowerCase().includes('programador') || userProfile.profession.toLowerCase().includes('desarrollador')) {
      baseTips.push('Mantente actualizado con las últimas tecnologías, pero enfócate en dominar los fundamentos que trascienden frameworks específicos.');
      baseTips.push('Contribuye a proyectos open source. Es una excelente forma de aprender, hacer networking y construir tu portafolio.');
    }
    
    return baseTips.slice(0, 8); // Limit to 8 tips
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
                  {planName || `Plan de ${plan.userProfile.name}`}
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
              Para: {plan.userProfile.name} • {plan.userProfile.profession}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSavePlan}
              disabled={isSaving}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Progreso del Plan - Paso {currentTabIndex + 1} de {tabs.length}
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
              Anterior
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentTabIndex + 1} / {tabs.length}</span>
            </div>
            
            <button
              onClick={goToNextTab}
              disabled={currentTabIndex === tabs.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Tus Insights Personalizados</h3>
              <p className="text-gray-600">Basado en tu perfil y objetivos</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tus Fortalezas
                </h4>
                <div className="space-y-3">
                  {personalizedStrengths.map((strength, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-green-700 font-medium">{strength}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Potencia esta fortaleza
                            </span>
                            {index < 3 && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                Fortaleza clave
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
                    <strong>💡 Basado en tu perfil:</strong> Como {plan.userProfile.profession.toLowerCase()}, con {plan.userProfile.timeAvailable} disponibles semanalmente, estas fortalezas te darán ventaja competitiva en tus objetivos.
                  </p>
                </div>
                
                {/* Strength utilization suggestions */}
                <div className="mt-4 space-y-2">
                  <h5 className="text-sm font-semibold text-green-800">🚀 Cómo aprovechar tus fortalezas:</h5>
                  <div className="grid gap-2">
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>En tu trabajo:</strong> Destaca estas fortalezas en tu CV y LinkedIn. Úsalas como base para liderar proyectos.
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>Para nuevas habilidades:</strong> Conecta el aprendizaje nuevo con estas fortalezas existentes.
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>En networking:</strong> Ofrece ayuda en áreas donde eres fuerte, creando relaciones valiosas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Áreas de Mejora
                </h4>
                <div className="space-y-3">
                  {plan.personalizedInsights.improvementAreas.map((area, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-blue-700 font-medium">{area}</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Prioridad: {index === 0 ? 'Alta' : index === 1 ? 'Media' : 'Baja'}
                              </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(10, 30 - (index * 10))}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-blue-600">
                              Progreso inicial: Definir plan de acción
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>🎯 Plan de acción:</strong> Enfócate en un área a la vez. Pequeños pasos consistentes generan grandes cambios.
                  </p>
                </div>
              </div>
            </div>

            {/* Personalized Tips */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="text-xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Consejos Personalizados
              </h4>
              
              {/* User profile context */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  <strong>Personalizado para:</strong> {plan.userProfile.name}, {plan.userProfile.age}, {plan.userProfile.profession} | 
                  <strong> Tiempo disponible:</strong> {plan.userProfile.timeAvailable} | 
                  <strong> Estilo:</strong> {plan.userProfile.preferences.workStyle}
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
                              Grupo etario: {plan.userProfile.age}
                            </span>
                          )}
                          {index >= 2 && index < 4 && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              Tiempo: {plan.userProfile.timeAvailable}
                            </span>
                          )}
                          {index >= 4 && index < 6 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Objetivos específicos
                            </span>
                          )}
                          {index >= 6 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              Profesión: {plan.userProfile.profession}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                              ✓ Aplicado
                            </button>
                            <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                              Recordar después
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-600">
                              Dificultad: {index === 0 ? '⭐' : index === 1 ? '⭐⭐' : index < 4 ? '⭐⭐' : '⭐⭐⭐'}
                            </span>
                            <span className="text-xs text-green-600">
                              Impacto: {index < 3 ? 'Alto' : index < 6 ? 'Medio' : 'Alto'}
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
                  <strong>⚡ Seguimiento personalizado:</strong> Estos consejos están específicamente diseñados para tu perfil. Implementa uno cada semana para resultados óptimos.
                </p>
              </div>
              
              {/* Implementation timeline */}
              <div className="mt-4 bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="text-sm font-semibold text-purple-800 mb-3">📅 Plan de implementación sugerido:</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-xs font-medium text-purple-700 mb-2">Semana 1-2 (Fundación):</h6>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Implementar consejos 1-2 (más fáciles)</li>
                      <li>• Establecer rutinas básicas</li>
                      <li>• Crear sistema de seguimiento</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-xs font-medium text-purple-700 mb-2">Semana 3-4 (Expansión):</h6>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Agregar consejos 3-4</li>
                      <li>• Refinar técnicas existentes</li>
                      <li>• Evaluar progreso inicial</li>
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
                  Tu Estilo de Aprendizaje
                </h4>
                <div className="bg-white rounded-lg p-4 border border-yellow-200 mb-4">
                  <p className="text-yellow-700 font-medium mb-3">{plan.personalizedInsights.preferredLearningStyle}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-yellow-800 mb-2">📚 Recursos recomendados:</h5>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Videos tutoriales interactivos</li>
                        <li>• Aplicaciones móviles educativas</li>
                        <li>• Cursos online con gamificación</li>
                        <li>• Simuladores y herramientas prácticas</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-yellow-800 mb-2">⏱️ Sesiones ideales:</h5>
                      <div className="flex gap-2">
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">25-30 min</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Interactivo</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Visual</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>💡 Optimiza tu aprendizaje:</strong> Usa múltiples dispositivos y combina teoría con práctica inmediata.
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Tu Estilo de Motivación
                </h4>
                <div className="bg-white rounded-lg p-4 border border-pink-200 mb-4">
                  <p className="text-pink-700 font-medium mb-3">{plan.personalizedInsights.motivationStyle}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-pink-800 mb-2">🚀 Estrategias motivacionales:</h5>
                      <ul className="text-xs text-pink-700 space-y-1">
                        <li>• Prueba diferentes enfoques cada semana</li>
                        <li>• Documenta qué métodos funcionan mejor</li>
                        <li>• Experimenta con nuevas herramientas</li>
                        <li>• Mantén variedad en tus rutinas</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-pink-800 mb-2">📊 Seguimiento motivacional:</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-pink-700">Nivel de energía</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`w-3 h-3 rounded-full ${i <= 4 ? 'bg-pink-400' : 'bg-pink-200'}`}></div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-pink-700">Curiosidad</span>
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
                    <strong>🎯 Mantén la motivación:</strong> Celebra los pequeños experimentos exitosos y ajusta según los resultados.
                  </p>
                </div>
              </div>
            </div>

            {/* Time Optimization - Enhanced */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Optimización del Tiempo
              </h4>
              <div className="grid gap-4">
                {plan.personalizedInsights.timeOptimization.map((tip, index) => (
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
                              Tiempo estimado: {index === 0 ? '5-10 min' : index === 1 ? '15-30 min' : '30-60 min'}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              Impacto: {index === 0 ? 'Alto' : index === 1 ? 'Medio' : 'Alto'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                              ✓ Implementado
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
                          Progreso de implementación
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2">⏰ Tiempo Disponible</h5>
                  <p className="text-lg font-bold text-blue-900">{plan.userProfile.timeAvailable}</p>
                  <p className="text-xs text-blue-700">por semana</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-green-800 mb-2">🎯 Técnicas Aplicadas</h5>
                  <p className="text-lg font-bold text-green-900">0/{plan.personalizedInsights.timeOptimization.length}</p>
                  <p className="text-xs text-green-700">estrategias activas</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-purple-800 mb-2">📈 Eficiencia</h5>
                  <p className="text-lg font-bold text-purple-900">0%</p>
                  <p className="text-xs text-purple-700">mejora estimada</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">¡Comparte tu Experiencia!</h3>
              <p className="text-gray-600">Tu feedback nos ayuda a mejorar y personalizar aún más tu plan</p>
            </div>

            {/* Feedback Form */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      ¿Qué te pareció tu plan personalizado?
                    </label>
                    <textarea
                      rows={6}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base transition-colors duration-200 resize-none"
                      placeholder="Cuéntanos qué aspectos te gustaron más, qué mejorías sugieres, y cómo se siente este plan personalizado para tu estilo de vida..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-purple-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Algunas preguntas para guiarte:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• ¿Los insights personalizados fueron precisos y útiles?</li>
                      <li>• ¿El plan profesional se alinea con tus objetivos de carrera?</li>
                      <li>• ¿Las rutinas de fitness son apropiadas para tu nivel y tiempo disponible?</li>
                      <li>• ¿Los hobbies y proyectos sugeridos te emocionan?</li>
                      <li>• ¿El plan nutricional es realista y atractivo para ti?</li>
                      <li>• ¿Qué funcionalidades adicionales te gustaría ver?</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      type="button"
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.trim()}
                      className="inline-flex justify-center items-center gap-2 py-4 px-8 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <MessageSquare className="w-5 h-5" />
                      {isEditing ? 'Actualizar Feedback' : 'Enviar Feedback y Guardar'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFeedback('')}
                      className="inline-flex justify-center items-center gap-2 py-4 px-6 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer"
                    >
                      Limpiar
                    </button>
                  </div>

                  {feedback.trim() && (
                    <div className="text-center text-sm text-gray-600">
                      <p>¡Gracias por tomarte el tiempo de compartir tu experiencia con nosotros! 🙏</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thank you message after feedback */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">¡Has completado tu plan de estilo de vida personalizado!</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Profesional</h3>
            
            {/* Career Path */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Ruta de Carrera</h4>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full px-4 py-2 font-semibold">
                    {plan.professional.careerPath.currentRole}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Actual</p>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-blue-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-1/3"></div>
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-1">{plan.professional.careerPath.estimatedTimeframe}</p>
                </div>
                <div className="text-center">
                  <div className="bg-indigo-500 text-white rounded-full px-4 py-2 font-semibold">
                    {plan.professional.careerPath.targetRole}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Objetivo</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Potencial de crecimiento salarial: {plan.professional.careerPath.salaryGrowthPotential}
              </p>
            </div>

            {/* Goals with Progress */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Objetivos Profesionales</h4>
              <div className="space-y-4">
                {plan.professional.goals.map((goal) => (
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
                        {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
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
                      <h6 className="font-medium text-gray-700">Hitos:</h6>
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
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Habilidades a Desarrollar</h4>
                <div className="space-y-3">
                  {plan.professional.skillsToAcquire.map((skill, index) => (
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
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Recursos Recomendados</h4>
                <div className="space-y-3">
                  {plan.professional.resources.map((resource, index) => (
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
                              {resource.cost === 'free' ? 'Gratis' : resource.cost === 'paid' ? 'Pago' : 'Suscripción'}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan de Fitness</h3>
            
            {/* Workout Routines */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Rutinas de Ejercicio</h4>
              <div className="grid gap-4">
                {plan.fitness.workoutRoutine.map((workout, index) => (
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
                          {workout.difficulty === 'beginner' ? 'Principiante' :
                           workout.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
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
                Seguimiento de Progreso
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {plan.fitness.progressTracking.map((metric, index) => (
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
                      Seguimiento: {metric.trackingFrequency === 'daily' ? 'Diario' : 
                                   metric.trackingFrequency === 'weekly' ? 'Semanal' : 'Mensual'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hobbies' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan de Hobbies</h3>
            
            {/* Selected Hobbies */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.hobbies.selectedHobbies.map((hobby, index) => (
                <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">{hobby.name}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nivel actual:</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        hobby.skillLevel === 'beginner' ? 'bg-yellow-100 text-yellow-800' :
                        hobby.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {hobby.skillLevel === 'beginner' ? 'Principiante' :
                         hobby.skillLevel === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Tiempo semanal:</span>
                      <span className="ml-2 text-sm text-gray-800">{hobby.timeCommitment}</span>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Objetivos de aprendizaje:</h5>
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
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Próximos pasos:</h5>
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
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Proyectos Sugeridos</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {plan.hobbies.projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-semibold">{project.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        project.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.difficulty === 'easy' ? 'Fácil' :
                         project.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <p className="text-xs text-gray-500 mb-3">Duración estimada: {project.estimatedDuration}</p>
                    
                    <div className="space-y-2">
                      <h6 className="text-sm font-medium text-gray-700">Pasos del proyecto:</h6>
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
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Recursos de Aprendizaje</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {plan.hobbies.resources.map((resource, index) => (
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
                            {resource.cost === 'free' ? 'Gratis' : resource.cost === 'paid' ? 'Pago' : 'Suscripción'}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan de Nutrición</h3>
            
            {/* Diet Overview */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Tu Plan Alimentario: {plan.nutrition.dietType}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Tipo de Dieta</h5>
                  <p className="text-sm text-gray-600">{plan.nutrition.dietType}</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Target className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Objetivo</h5>
                  <p className="text-sm text-gray-600">Bienestar y energía</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Seguimiento</h5>
                  <p className="text-sm text-gray-600">Diario</p>
                </div>
              </div>
            </div>

            {/* Weekly Meal Plan */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Plan Semanal de Comidas</h4>
              <div className="space-y-4">
                {plan.nutrition.mealPlan.map((dayPlan, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className="font-semibold text-lg mb-3 text-purple-600">{dayPlan.day}</h5>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* Breakfast */}
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h6 className="font-medium text-yellow-800 mb-2">Desayuno</h6>
                        <p className="text-sm font-medium">{dayPlan.breakfast.name}</p>
                        <p className="text-xs text-gray-600">{dayPlan.breakfast.calories} cal</p>
                        <p className="text-xs text-gray-500">{dayPlan.breakfast.prepTime} min prep</p>
                      </div>
                      
                      {/* Lunch */}
                      <div className="bg-green-50 rounded-lg p-3">
                        <h6 className="font-medium text-green-800 mb-2">Almuerzo</h6>
                        <p className="text-sm font-medium">{dayPlan.lunch.name}</p>
                        <p className="text-xs text-gray-600">{dayPlan.lunch.calories} cal</p>
                        <p className="text-xs text-gray-500">{dayPlan.lunch.prepTime} min prep</p>
                      </div>
                      
                      {/* Dinner */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h6 className="font-medium text-blue-800 mb-2">Cena</h6>
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
                      <span className="font-medium">Total diario: {dayPlan.totalCalories} calorías</span>
                      <div className="flex gap-4">
                        <span>Proteína: {dayPlan.macros.protein}g</span>
                        <span>Carbos: {dayPlan.macros.carbs}g</span>
                        <span>Grasas: {dayPlan.macros.fats}g</span>
                        <span>Fibra: {dayPlan.macros.fiber}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Lista de Compras</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Proteínas</h5>
                  <ul className="space-y-1">
                    {plan.nutrition.shoppingList.proteins.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Vegetales</h5>
                  <ul className="space-y-1">
                    {plan.nutrition.shoppingList.vegetables.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Frutas</h5>
                  <ul className="space-y-1">
                    {plan.nutrition.shoppingList.fruits.map((item, index) => (
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
                  Costo estimado semanal: <span className="text-green-600">{plan.nutrition.shoppingList.estimatedCost}</span>
                </p>
              </div>
            </div>

            {/* Hydration Plan */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-blue-800 mb-4">Plan de Hidratación</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-blue-700 mb-3">Objetivo Diario</h5>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="font-bold">{plan.nutrition.hydrationPlan.dailyWaterGoal}L</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Meta de agua diaria</p>
                      <p className="text-xs text-blue-600">≈ 8-10 vasos</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-700 mb-3">Recordatorios</h5>
                  <ul className="space-y-1">
                    {plan.nutrition.hydrationPlan.reminders.map((reminder, index) => (
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
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Suplementos Recomendados</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {plan.nutrition.supplements.map((supplement, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    supplement.optional ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{supplement.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${
                        supplement.optional ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'
                      }`}>
                        {supplement.optional ? 'Opcional' : 'Recomendado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{supplement.purpose}</p>
                    <div className="text-xs text-gray-500">
                      <p>Dosis: {supplement.dosage}</p>
                      <p>Cuándo: {supplement.timing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Tus Logros</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.achievements.map((achievement) => (
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
                          Desbloqueado: {achievement.unlockedDate}
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
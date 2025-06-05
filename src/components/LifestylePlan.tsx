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
    const strengths = [...currentPlan.personalizedInsights.strengths];
    const userProfile = currentPlan.userProfile;
    
    // Add strengths based on specific goals
    userProfile.goals.forEach(goal => {
      switch(goal) {
        case 'Avanzar en mi carrera profesional':
          strengths.push('Ambición profesional y visión de crecimiento a largo plazo');
          break;
        case 'Mejorar mi condición física':
          strengths.push('Compromiso con el bienestar personal y salud integral');
          break;
        case 'Desarrollar nuevas habilidades técnicas':
          strengths.push('Mentalidad de crecimiento y adaptabilidad tecnológica');
          break;
        case 'Aprender un nuevo idioma':
          strengths.push('Apertura cultural y capacidad de comunicación global');
          break;
        case 'Desarrollar habilidades de liderazgo':
          strengths.push('Visión de liderazgo y capacidad de influencia positiva');
          break;
        case 'Crear un negocio propio':
          strengths.push('Espíritu emprendedor y tolerancia al riesgo calculado');
          break;
        case 'Aprender habilidades creativas':
          strengths.push('Creatividad innata y expresión artística');
          break;
      }
    });

    // Add strengths based on current skills
    userProfile.currentSkills.forEach(skill => {
      switch(skill) {
        case 'Liderazgo':
          strengths.push('Capacidades naturales de liderazgo ya desarrolladas');
          break;
        case 'Comunicación efectiva':
          strengths.push('Habilidades comunicativas sólidas para el crecimiento profesional');
          break;
        case 'Programación':
          strengths.push('Base técnica sólida en desarrollo y lógica computacional');
          break;
        case 'Creatividad e innovación':
          strengths.push('Pensamiento innovador y capacidad de generar soluciones únicas');
          break;
        case 'Análisis de datos':
          strengths.push('Capacidad analítica y toma de decisiones basada en datos');
          break;
      }
    });

    // Add strengths based on hobbies
    userProfile.preferences.hobbies.forEach(hobby => {
      switch(hobby) {
        case 'Lectura y escritura':
          strengths.push('Curiosidad intelectual y capacidad de análisis profundo');
          break;
        case 'Música (tocar instrumentos)':
          strengths.push('Disciplina de práctica y sensibilidad artística desarrollada');
          break;
        case 'Programación por hobby':
          strengths.push('Pasión genuina por la tecnología más allá del trabajo');
          break;
        case 'Yoga y meditación':
          strengths.push('Consciencia corporal y capacidad de autorregulación emocional');
          break;
        case 'Cocina y gastronomía':
          strengths.push('Creatividad práctica y atención meticulosa a los detalles');
          break;
      }
    });
    
    // Add strengths based on profession
    if (userProfile.profession.toLowerCase().includes('programador') || userProfile.profession.toLowerCase().includes('desarrollador')) {
      strengths.push('Pensamiento lógico y resolución sistemática de problemas complejos');
      strengths.push('Adaptabilidad a nuevas tecnologías y frameworks emergentes');
    } else if (userProfile.profession.toLowerCase().includes('profesor') || userProfile.profession.toLowerCase().includes('educador')) {
      strengths.push('Habilidades pedagógicas y capacidad de transferir conocimiento');
      strengths.push('Paciencia y estructuración metodológica del aprendizaje');
    } else if (userProfile.profession.toLowerCase().includes('diseñador')) {
      strengths.push('Sensibilidad estética y pensamiento visual desarrollado');
      strengths.push('Capacidad de conceptualización y materialización de ideas');
    } else if (userProfile.profession.toLowerCase().includes('gerente') || userProfile.profession.toLowerCase().includes('manager')) {
      strengths.push('Habilidades organizativas y coordinación de equipos multidisciplinarios');
      strengths.push('Visión estratégica y capacidad de toma de decisiones complejas');
    }
    
    // Add strengths based on motivation factors
    userProfile.motivationFactors.forEach(factor => {
      switch(factor) {
        case 'Aprendizaje continuo':
          strengths.push('Sed insaciable de conocimiento y mejora constante');
          break;
        case 'Autonomía e independencia':
          strengths.push('Autodisciplina y capacidad de automotivación excepcional');
          break;
        case 'Impacto social positivo':
          strengths.push('Consciencia social y orientación hacia el servicio a otros');
          break;
        case 'Desafíos intelectuales':
          strengths.push('Atracción natural hacia problemas complejos y estimulantes');
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
        case 'Avanzar en mi carrera profesional':
          baseTips.push(`Como ${userProfile.profession.toLowerCase()}, enfócate en desarrollar las habilidades más demandadas en tu industria. Crea un plan de carrera a 5 años con hitos específicos cada 6 meses.`);
          break;
        case 'Mejorar mi condición física':
          baseTips.push(`Con tu preferencia por ${userProfile.preferences.exerciseType}, diseña una rutina progresiva que se adapte a tu horario ${userProfile.preferences.preferredSchedule}. La consistencia vence a la intensidad.`);
          break;
        case 'Desarrollar nuevas habilidades técnicas':
          baseTips.push(`Aprovecha tu estilo de aprendizaje ${userProfile.preferences.learningStyle} para dominar una nueva habilidad cada trimestre. Practica el 80/20: 80% fundamentos, 20% experimentación.`);
          break;
        case 'Aprender un nuevo idioma':
          baseTips.push(`Con ${userProfile.timeAvailable} disponibles, dedica al menos 15-20 minutos diarios a práctica conversacional. La inmersión partial es más efectiva que sesiones largas esporádicas.`);
          break;
        case 'Desarrollar habilidades de liderazgo':
          baseTips.push('Busca oportunidades de liderar proyectos pequeños en tu trabajo actual. El liderazgo se desarrolla practicando, no solo estudiando teoría.');
          break;
      }
    });

    // Tips based on current challenges
    userProfile.currentChallenges.forEach(challenge => {
      switch(challenge) {
        case 'Falta de tiempo':
          baseTips.push(`Para superar la falta de tiempo, implementa time-blocking en tu agenda ${userProfile.preferences.preferredSchedule}. Programa tus prioridades como si fueran citas médicas importantes.`);
          break;
        case 'Procrastinación':
          baseTips.push('Usa la regla de los 2 minutos: si algo toma menos de 2 minutos, hazlo inmediatamente. Para tareas más largas, comprométete solo con 5 minutos iniciales.');
          break;
        case 'Falta de motivación':
          baseTips.push(`Conecta cada actividad con tus motivadores principales: ${userProfile.motivationFactors.slice(0, 2).join(' y ')}. Visualiza el "por qué" antes del "cómo".`);
          break;
        case 'Estrés y ansiedad':
          baseTips.push(`Aprovecha tu interés en ${userProfile.preferences.hobbies.find(h => h.includes('yoga') || h.includes('meditación')) || 'actividades relajantes'} para crear un ritual diario de 10 minutos de descompresión.`);
          break;
        case 'Perfeccionismo':
          baseTips.push('Adopta el mindset "hecho es mejor que perfecto". Establece deadlines artificiales y cúmplelos, incluso si el resultado no es perfecto.');
          break;
      }
    });

    // Tips based on learning style and schedule
    switch(userProfile.preferences.learningStyle) {
      case 'visual':
        baseTips.push(`Como aprendiz visual, crea mapas mentales y diagramas de tus objetivos. Usa colores y símbolos para hacer la información más memorable y accesible.`);
        break;
      case 'auditivo':
        baseTips.push(`Aprovecha tu tiempo de ${userProfile.preferences.preferredSchedule} para escuchar podcasts educativos. Graba notas de voz para repasar conceptos importantes.`);
        break;
      case 'kinestesico':
        baseTips.push('Tu estilo kinestésico necesita acción. Practica inmediatamente lo que aprendes y busca proyectos hands-on para consolidar conocimientos.');
        break;
      case 'lectura':
        baseTips.push(`Combina tu amor por la lectura con tus hobbies: ${userProfile.preferences.hobbies.slice(0, 2).join(' y ')}. Crea resúmenes escritos de lo que aprendes.`);
        break;
    }

    // Tips based on budget and goals
    const budget = userProfile.preferences.budget;
    if (budget === '0-50') {
      baseTips.push('Con presupuesto limitado, enfócate en recursos gratuitos de alta calidad: YouTube, podcasts, bibliotecas públicas, y comunidades online. La inversión en tiempo puede superar la inversión en dinero.');
    } else if (budget === '500+') {
      baseTips.push('Con mayor presupuesto disponible, considera coaching personalizado o cursos premium que aceleren tu progreso. Invierte en herramientas de calidad que uses diariamente.');
    }

    // Tips based on experience level
    switch(userProfile.experience) {
      case 'principiante':
        baseTips.push('Como principiante, enfócate en construir hábitos pequeños pero consistentes. No intentes cambiar todo a la vez - elige 1-2 áreas máximo para empezar.');
        break;
      case 'intermedio':
        baseTips.push('Con tu experiencia intermedia, es tiempo de especializarte. Elige un área donde ya tienes base y profundiza para convertirte en experto.');
        break;
      case 'avanzado':
        baseTips.push('Con tu experiencia avanzada, considera mentorear a otros. Enseñar consolidará tu conocimiento y expandirá tu red profesional.');
        break;
    }

    // Tips based on specific hobby combinations
    const hasCreativeHobbies = userProfile.preferences.hobbies.some(h => 
      h.includes('Música') || h.includes('Pintura') || h.includes('Fotografía') || h.includes('Escritura')
    );
    const hasTechHobbies = userProfile.preferences.hobbies.some(h => 
      h.includes('Programación') || h.includes('Videojuegos')
    );

    if (hasCreativeHobbies && hasTechHobbies) {
      baseTips.push('Tu combinación de hobbies creativos y técnicos es única. Considera proyectos que fusionen ambos: desarrollo de videojuegos, arte digital, o aplicaciones creativas.');
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
            {adjustedPlan && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Plan Ajustado</span>
                </div>
                <p className="text-sm text-green-700">
                  Este plan ha sido ajustado basándose en tu feedback para mejor adaptarse a tus necesidades.
                </p>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Tus Insights Personalizados</h3>
              <p className="text-gray-600">Basado en tu perfil y objetivos</p>
            </div>

            {/* Use currentPlan for all data */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths using currentPlan */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tus Fortalezas
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
                  {currentPlan.personalizedInsights.improvementAreas.map((area, index) => (
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
                  <strong>Personalizado para:</strong> {currentPlan.userProfile.name}, {currentPlan.userProfile.age}, {currentPlan.userProfile.profession} | 
                  <strong> Tiempo disponible:</strong> {currentPlan.userProfile.timeAvailable} | 
                  <strong> Estilo:</strong> {currentPlan.userProfile.preferences.workStyle}
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
                              Grupo etario: {currentPlan.userProfile.age}
                            </span>
                          )}
                          {index >= 2 && index < 4 && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              Tiempo: {currentPlan.userProfile.timeAvailable}
                            </span>
                          )}
                          {index >= 4 && index < 6 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Objetivos específicos
                            </span>
                          )}
                          {index >= 6 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              Profesión: {currentPlan.userProfile.profession}
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
                  <p className="text-yellow-700 font-medium mb-3">{currentPlan.personalizedInsights.preferredLearningStyle}</p>
                  
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
                  <p className="text-pink-700 font-medium mb-3">{currentPlan.personalizedInsights.motivationStyle}</p>
                  
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
                  <p className="text-lg font-bold text-blue-900">{currentPlan.userProfile.timeAvailable}</p>
                  <p className="text-xs text-blue-700">por semana</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-semibold text-green-800 mb-2">🎯 Técnicas Aplicadas</h5>
                  <p className="text-lg font-bold text-green-900">0/{currentPlan.personalizedInsights.timeOptimization.length}</p>
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
              <p className="text-gray-600">Tu feedback nos ayuda a ajustar automáticamente tu plan</p>
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
                        ¡Plan Ajustado Automáticamente!
                      </h4>
                      <p className="text-blue-800 mb-4">{feedbackAnalysis.summary}</p>
                      
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h5 className="font-semibold text-gray-800 mb-3">Ajustes realizados:</h5>
                        <div className="space-y-2">
                          {feedbackAnalysis.adjustments.map((adjustment, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 capitalize">
                                  {adjustment.section === 'professional' ? 'Plan Profesional' :
                                   adjustment.section === 'fitness' ? 'Plan de Fitness' :
                                   adjustment.section === 'hobbies' ? 'Plan de Hobbies' :
                                   adjustment.section === 'nutrition' ? 'Plan de Nutrición' :
                                   'Insights Personalizados'}
                                </p>
                                <p className="text-sm text-gray-600">{adjustment.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Confianza del análisis:</span>
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
                          Aceptar Ajustes
                        </button>
                        <button
                          onClick={handleRejectAdjustments}
                          className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Mantener Plan Original
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
                      ¿Qué te pareció tu plan personalizado?
                    </label>
                    <textarea
                      rows={6}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base transition-colors duration-200 resize-none"
                      placeholder="Ejemplo: 'Los ejercicios son muy intensos para principiantes', 'Me gusta el plan profesional pero los hobbies no me interesan', 'No tengo tiempo para cocinar comidas tan complicadas'..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>

                  {/* Enhanced feedback guidance */}
                  <div className="bg-white rounded-lg p-6 border border-purple-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      Guía para feedback efectivo:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de feedback útil:</h5>
                        <ul className="space-y-1 text-xs text-gray-600">
                          <li>• "Los ejercicios son muy intensos"</li>
                          <li>• "Prefiero hobbies más creativos"</li>
                          <li>• "No tengo tiempo para cocinar"</li>
                          <li>• "Los objetivos profesionales son muy ambiciosos"</li>
                          <li>• "Necesito más variedad en las rutinas"</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Palabras clave que reconozco:</h5>
                        <div className="flex flex-wrap gap-1">
                          {['muy intenso', 'demasiado', 'no me gusta', 'prefiero', 'cambiar', 'más tiempo', 'simple', 'complicado'].map(keyword => (
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
                          Analizando Feedback...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          Analizar y Ajustar Plan
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
                      Solo Guardar Feedback
                    </button>
                  </div>

                  {/* Analysis status */}
                  {isAnalyzing && (
                    <div className="text-center">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="font-medium text-blue-800">Analizando tu feedback...</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          Estoy procesando tus comentarios para generar ajustes personalizados
                        </p>
                      </div>
                    </div>
                  )}

                  {feedback.trim() && !isAnalyzing && (
                    <div className="text-center text-sm text-gray-600">
                      <p>💡 Tip: Cuanto más específico seas, mejor podré ajustar tu plan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thank you message after feedback */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">¡Tu plan se adapta automáticamente a tus necesidades!</span>
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
                  <span className="font-semibold text-blue-800">Plan Profesional Ajustado</span>
                </div>
                <p className="text-sm text-blue-700">
                  Los objetivos y plazos han sido ajustados según tu feedback.
                </p>
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Profesional</h3>
            
            {/* Career Path using currentPlan */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Ruta de Carrera</h4>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full px-4 py-2 font-semibold">
                    {currentPlan.professional.careerPath.currentRole}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Actual</p>
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
                  <p className="text-sm text-gray-600 mt-1">Objetivo</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Potencial de crecimiento salarial: {currentPlan.professional.careerPath.salaryGrowthPotential}
              </p>
            </div>

            {/* Goals with Progress using currentPlan */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Objetivos Profesionales</h4>
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
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Recursos Recomendados</h4>
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
              {currentPlan.hobbies.selectedHobbies.map((hobby, index) => (
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
                {currentPlan.hobbies.projects.map((project) => (
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
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Tu Plan Alimentario: {currentPlan.nutrition.dietType}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                  <h5 className="font-semibold">Tipo de Dieta</h5>
                  <p className="text-sm text-gray-600">{currentPlan.nutrition.dietType}</p>
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
                {currentPlan.nutrition.mealPlan.map((dayPlan, index) => (
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
                    {currentPlan.nutrition.shoppingList.proteins.map((item, index) => (
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
                    {currentPlan.nutrition.shoppingList.vegetables.map((item, index) => (
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
                  Costo estimado semanal: <span className="text-green-600">{currentPlan.nutrition.shoppingList.estimatedCost}</span>
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
                      <span className="font-bold">{currentPlan.nutrition.hydrationPlan.dailyWaterGoal}L</span>
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
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Suplementos Recomendados</h4>
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
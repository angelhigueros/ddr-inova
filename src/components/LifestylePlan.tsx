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
import type { LifestylePlan as LifestylePlanType, Goal, Achievement } from '@/types/lifestyle';

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
  const [goalProgress, setGoalProgress] = useState<{ [key: string]: boolean }>({});
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

  const toggleGoalProgress = (goalId: string) => {
    setGoalProgress(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
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
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tus Fortalezas
                </h4>
                <ul className="space-y-2">
                  {plan.personalizedInsights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-green-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Áreas de Mejora
                </h4>
                <ul className="space-y-2">
                  {plan.personalizedInsights.improvementAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-blue-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Personalized Tips */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-purple-800 mb-4">Consejos Personalizados</h4>
              <div className="grid gap-4">
                {plan.personalizedInsights.personalityBasedTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-purple-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Style & Motivation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">Tu Estilo de Aprendizaje</h4>
                <p className="text-yellow-700">{plan.personalizedInsights.preferredLearningStyle}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-pink-800 mb-3">Tu Estilo de Motivación</h4>
                <p className="text-pink-700">{plan.personalizedInsights.motivationStyle}</p>
              </div>
            </div>

            {/* Time Optimization */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Optimización del Tiempo
              </h4>
              <div className="grid gap-3">
                {plan.personalizedInsights.timeOptimization.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded border">
                    <div className="bg-purple-100 rounded-full p-1">
                      <span className="text-purple-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
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
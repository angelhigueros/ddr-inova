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
  RefreshCw,
  Printer
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
  const [activeTab, setActiveTab] = useState<'insights' | 'professional' | 'fitness' | 'hobbies' | 'nutrition' | 'achievements'>('insights');
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [adjustedPlan, setAdjustedPlan] = useState<LifestylePlanType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [planName, setPlanName] = useState(plan.name || '');
  const [isEditingName, setIsEditingName] = useState(false);

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
    if (feedback.trim()) {
      handleAnalyzeFeedback();
    }
  };

  const handleSavePlan = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
      } catch (error) {
        console.error('Error saving plan:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePrintPlan = () => {
    // Store the current active tab
    const currentActiveTab = activeTab;
    
    // Create a comprehensive print view
    const printContent = generatePrintContent();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Plan de Estilo de Vida - ${currentPlan.userProfile.name}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #333;
              margin: 0;
              padding: 20px;
              background: white;
            }
            
            .plan-header {
              text-align: center;
              border-bottom: 3px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .plan-title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #2d3748;
            }
            
            .plan-subtitle {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 5px;
            }
            
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #2d3748;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
              margin-bottom: 20px;
              page-break-after: avoid;
            }
            
            .subsection {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #e2e8f0;
              border-radius: 5px;
              background: #f7fafc;
            }
            
            .subsection-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #2d3748;
            }
            
            .content-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .content-item {
              border: 1px solid #e2e8f0;
              padding: 10px;
              border-radius: 3px;
              background: white;
            }
            
            .strength-item, .tip-item {
              margin-bottom: 10px;
              padding: 8px;
              border-left: 4px solid #3182ce;
              background: #f7fafc;
            }
            
            .goal-item {
              margin-bottom: 15px;
              padding: 10px;
              border: 1px solid #e2e8f0;
              background: white;
            }
            
            .milestone {
              margin-left: 15px;
              margin-bottom: 5px;
              font-size: 11px;
            }
            
            .workout-exercise {
              margin-bottom: 8px;
              padding: 5px;
              background: #f0f4f8;
              border-left: 3px solid #3182ce;
            }
            
            .hobby-project {
              margin-bottom: 15px;
              padding: 10px;
              border: 1px solid #e2e8f0;
              background: #f9fafb;
            }
            
            .meal-day {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #e2e8f0;
              background: white;
              page-break-inside: avoid;
            }
            
            .meal-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-top: 10px;
            }
            
            .meal-item {
              padding: 8px;
              border: 1px solid #e2e8f0;
              border-radius: 3px;
              background: #f7fafc;
              text-align: center;
            }
            
            .achievement {
              display: inline-block;
              margin: 5px;
              padding: 10px;
              border: 1px solid #e2e8f0;
              border-radius: 5px;
              background: #f0fff4;
              min-width: 200px;
            }
            
            .achievement.unlocked {
              background: #f0fff4;
              border-color: #68d391;
            }
            
            .achievement.locked {
              background: #f7fafc;
              border-color: #e2e8f0;
              opacity: 0.6;
            }
            
            .tag {
              display: inline-block;
              font-size: 10px;
              padding: 2px 6px;
              margin: 2px;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              background: #edf2f7;
            }
            
            .progress-bar {
              width: 100%;
              height: 6px;
              background: #e2e8f0;
              border-radius: 3px;
              margin: 5px 0;
            }
            
            .progress-fill {
              height: 100%;
              background: #3182ce;
              border-radius: 3px;
            }
            
            ul, ol {
              margin: 10px 0 10px 20px;
            }
            
            li {
              margin-bottom: 5px;
            }
            
            @page {
              margin: 1in;
              size: A4;
            }
            
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const generatePrintContent = () => {
    const userProfile = currentPlan.userProfile;
    const personalizedStrengths = currentPlan.personalizedInsights.strengths;
    const personalizedTips = currentPlan.personalizedInsights.personalityBasedTips;
    
    return `
      <div class="plan-header">
        <div class="plan-title">Plan de Estilo de Vida Personalizado</div>
        <div class="plan-subtitle">Para: ${userProfile.name}</div>
        <div class="plan-subtitle">${userProfile.profession} • ${userProfile.age}</div>
        <div class="plan-subtitle">Generado el: ${new Date().toLocaleDateString('es-ES')}</div>
      </div>

      <!-- Insights Personalizados -->
      <div class="section">
        <div class="section-title">🎯 Insights Personalizados</div>
        
        <div class="subsection">
          <div class="subsection-title">Tus Fortalezas</div>
          ${personalizedStrengths.map((strength: string, index: number) => `
            <div class="strength-item">
              <strong>${index + 1}.</strong> ${strength}
            </div>
          `).join('')}
        </div>

        <div class="subsection">
          <div class="subsection-title">Áreas de Mejora</div>
          ${currentPlan.personalizedInsights.improvementAreas.map((area: string, index: number) => `
            <div class="strength-item">
              <strong>${index + 1}.</strong> ${area}
            </div>
          `).join('')}
        </div>

        <div class="subsection">
          <div class="subsection-title">Consejos Personalizados</div>
          ${personalizedTips.slice(0, 8).map((tip: string, index: number) => `
            <div class="tip-item">
              <strong>${index + 1}.</strong> ${tip}
            </div>
          `).join('')}
        </div>

        <div class="content-grid">
          <div class="content-item">
            <div class="subsection-title">Estilo de Aprendizaje</div>
            <p>${currentPlan.personalizedInsights.preferredLearningStyle}</p>
          </div>
          <div class="content-item">
            <div class="subsection-title">Estilo de Motivación</div>
            <p>${currentPlan.personalizedInsights.motivationStyle}</p>
          </div>
        </div>

        <div class="subsection">
          <div class="subsection-title">Optimización del Tiempo</div>
          ${currentPlan.personalizedInsights.timeOptimization.map((tip: string, index: number) => `
            <div class="tip-item">
              <strong>${index + 1}.</strong> ${tip}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Plan Profesional -->
      <div class="section page-break">
        <div class="section-title">💼 Plan Profesional</div>
        
        <div class="subsection">
          <div class="subsection-title">Ruta de Carrera</div>
          <p><strong>Rol Actual:</strong> ${currentPlan.professional.careerPath.currentRole}</p>
          <p><strong>Objetivo:</strong> ${currentPlan.professional.careerPath.targetRole}</p>
          <p><strong>Tiempo Estimado:</strong> ${currentPlan.professional.careerPath.estimatedTimeframe}</p>
          <p><strong>Potencial de Crecimiento:</strong> ${currentPlan.professional.careerPath.salaryGrowthPotential}</p>
        </div>

        <div class="subsection">
          <div class="subsection-title">Objetivos Profesionales</div>
          ${currentPlan.professional.goals.map(goal => `
            <div class="goal-item">
              <div><strong>${goal.title}</strong></div>
              <div style="font-size: 11px; color: #666; margin: 5px 0;">${goal.description}</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${goal.progress}%"></div>
              </div>
              <div style="font-size: 10px;">Progreso: ${goal.progress}%</div>
              <div style="margin-top: 8px;">
                <strong style="font-size: 11px;">Hitos:</strong>
                ${goal.milestones.map(milestone => `
                  <div class="milestone">
                    ${milestone.completed ? '✓' : '○'} ${milestone.title} (${milestone.deadline})
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="subsection">
          <div class="subsection-title">Habilidades a Desarrollar</div>
          ${currentPlan.professional.skillsToAcquire.map(skill => `
            <div class="content-item">
              <strong>${skill.name}</strong><br>
              <span class="tag">${skill.currentLevel}</span> → <span class="tag">${skill.targetLevel}</span><br>
              <small>Tiempo estimado: ${skill.estimatedTimeToLearn}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Plan de Fitness -->
      <div class="section page-break">
        <div class="section-title">🏋️ Plan de Fitness</div>
        
        ${currentPlan.fitness.workoutRoutine.map(workout => `
          <div class="subsection">
            <div class="subsection-title">${workout.name}</div>
            <p><strong>Duración:</strong> ${workout.duration} minutos • <strong>Dificultad:</strong> ${workout.difficulty}</p>
            <div style="margin-top: 10px;">
              <strong>Ejercicios:</strong>
              ${workout.exercises.map(exercise => `
                <div class="workout-exercise">
                  <strong>${exercise.name}</strong><br>
                  <small>${exercise.instructions}</small><br>
                  ${exercise.sets && exercise.reps ? `<span class="tag">${exercise.sets} sets × ${exercise.reps} reps</span>` : ''}
                  ${exercise.duration ? `<span class="tag">${exercise.duration}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <div class="subsection">
          <div class="subsection-title">Seguimiento de Progreso</div>
          ${currentPlan.fitness.progressTracking.map(metric => `
            <div class="content-item">
              <strong>${metric.name}</strong><br>
              <span>${metric.currentValue} → ${metric.targetValue} ${metric.unit}</span><br>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(metric.currentValue / metric.targetValue) * 100}%"></div>
              </div>
              <small>Seguimiento: ${metric.trackingFrequency}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Plan de Hobbies -->
      <div class="section page-break">
        <div class="section-title">🎨 Plan de Hobbies</div>
        
        <div class="subsection">
          <div class="subsection-title">Hobbies Seleccionados</div>
          ${currentPlan.hobbies.selectedHobbies.map(hobby => `
            <div class="content-item">
              <strong>${hobby.name}</strong><br>
              <span class="tag">Nivel: ${hobby.skillLevel}</span>
              <span class="tag">${hobby.timeCommitment}</span><br>
              <div style="margin-top: 8px;">
                <strong>Objetivos:</strong>
                <ul>
                  ${hobby.learningGoals.map(goal => `<li>${goal}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="subsection">
          <div class="subsection-title">Proyectos Sugeridos</div>
          ${currentPlan.hobbies.projects.map(project => `
            <div class="hobby-project">
              <strong>${project.name}</strong> 
              <span class="tag">${project.difficulty}</span><br>
              <div style="margin: 5px 0; font-size: 11px;">${project.description}</div>
              <div><strong>Duración:</strong> ${project.estimatedDuration}</div>
              <div style="margin-top: 8px;">
                <strong>Pasos:</strong>
                <ol>
                  ${project.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Plan de Nutrición -->
      <div class="section page-break">
        <div class="section-title">🥗 Plan de Nutrición</div>
        
        <div class="subsection">
          <div class="subsection-title">Tipo de Dieta: ${currentPlan.nutrition.dietType}</div>
        </div>

        <div class="subsection">
          <div class="subsection-title">Plan Semanal de Comidas</div>
          ${currentPlan.nutrition.mealPlan.map(dayPlan => `
            <div class="meal-day">
              <strong>${dayPlan.day}</strong> - ${dayPlan.totalCalories} calorías
              <div class="meal-grid">
                <div class="meal-item">
                  <strong>Desayuno</strong><br>
                  ${dayPlan.breakfast.name}<br>
                  <small>${dayPlan.breakfast.calories} cal • ${dayPlan.breakfast.prepTime} min</small>
                </div>
                <div class="meal-item">
                  <strong>Almuerzo</strong><br>
                  ${dayPlan.lunch.name}<br>
                  <small>${dayPlan.lunch.calories} cal • ${dayPlan.lunch.prepTime} min</small>
                </div>
                <div class="meal-item">
                  <strong>Cena</strong><br>
                  ${dayPlan.dinner.name}<br>
                  <small>${dayPlan.dinner.calories} cal • ${dayPlan.dinner.prepTime} min</small>
                </div>
                <div class="meal-item">
                  <strong>Snacks</strong><br>
                  ${dayPlan.snacks.map(snack => `${snack.name} (${snack.calories} cal)`).join('<br>')}
                </div>
              </div>
              <div style="margin-top: 10px; font-size: 11px;">
                <strong>Macros:</strong> Proteína: ${dayPlan.macros.protein}g | Carbos: ${dayPlan.macros.carbs}g | Grasas: ${dayPlan.macros.fats}g | Fibra: ${dayPlan.macros.fiber}g
              </div>
            </div>
          `).join('')}
        </div>

        <div class="content-grid">
          <div class="content-item">
            <div class="subsection-title">Lista de Compras</div>
            <div><strong>Proteínas:</strong> ${currentPlan.nutrition.shoppingList.proteins.join(', ')}</div>
            <div><strong>Vegetales:</strong> ${currentPlan.nutrition.shoppingList.vegetables.join(', ')}</div>
            <div><strong>Frutas:</strong> ${currentPlan.nutrition.shoppingList.fruits.join(', ')}</div>
            <div style="margin-top: 10px;"><strong>Costo estimado:</strong> ${currentPlan.nutrition.shoppingList.estimatedCost}</div>
          </div>
          <div class="content-item">
            <div class="subsection-title">Plan de Hidratación</div>
            <div><strong>Meta diaria:</strong> ${currentPlan.nutrition.hydrationPlan.dailyWaterGoal}L</div>
            <div style="margin-top: 8px;"><strong>Recordatorios:</strong></div>
            <ul>
              ${currentPlan.nutrition.hydrationPlan.reminders.map(reminder => `<li>${reminder}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="subsection">
          <div class="subsection-title">Suplementos</div>
          ${currentPlan.nutrition.supplements.map(supplement => `
            <div class="content-item">
              <strong>${supplement.name}</strong> 
              <span class="tag">${supplement.optional ? 'Opcional' : 'Recomendado'}</span><br>
              <div style="font-size: 11px; margin: 5px 0;">${supplement.purpose}</div>
              <div><strong>Dosis:</strong> ${supplement.dosage}</div>
              <div><strong>Cuándo:</strong> ${supplement.timing}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Logros -->
      <div class="section page-break">
        <div class="section-title">🏆 Logros</div>
        <div style="text-align: center;">
          ${currentPlan.achievements.map(achievement => `
            <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
              <div style="font-size: 24px; margin-bottom: 5px;">${achievement.icon}</div>
              <div><strong>${achievement.title}</strong></div>
              <div style="font-size: 11px; margin: 5px 0;">${achievement.description}</div>
              ${achievement.unlocked && achievement.unlockedDate ? `<div style="font-size: 10px; color: #666;">Desbloqueado: ${achievement.unlockedDate}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p>Plan generado por el Sistema de Planificación de Estilo de Vida</p>
        <p>Fecha de impresión: ${new Date().toLocaleString('es-ES')}</p>
        ${adjustedPlan ? '<p><strong>Nota:</strong> Este plan ha sido ajustado basándose en tu feedback</p>' : ''}
      </div>
    `;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-purple-50 to-blue-50 min-h-screen">
      {/* Plan Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Plan de Estilo de Vida Personalizado
            </h1>
            <p className="text-gray-600">Para {currentPlan.userProfile.name}</p>
            <p className="text-sm text-gray-500">
              {currentPlan.userProfile.profession} • {currentPlan.userProfile.age} años
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handlePrintPlan}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Imprimir Plan
            </button>
            
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

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {[
            { key: 'insights', label: '🎯 Insights', icon: Target },
            { key: 'professional', label: '💼 Profesional', icon: TrendingUp },
            { key: 'fitness', label: '🏋️ Fitness', icon: Dumbbell },
            { key: 'hobbies', label: '🎨 Hobbies', icon: Palette },
            { key: 'nutrition', label: '🥗 Nutrición', icon: UtensilsCrossed },
            { key: 'achievements', label: '🏆 Logros', icon: Award }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Tab content would go here - you'll need to implement the tab rendering logic */}
        <div>Content for {activeTab}</div>
      </div>

      {/* Feedback Section */}
      {!showAdjustments && (
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            ¿Cómo te parece tu plan?
          </h3>
          <p className="text-gray-600 mb-4">
            Compártenos tu opinión para mejorar y personalizar aún más tu plan de estilo de vida.
          </p>
          
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Por ejemplo: 'El plan de fitness es muy intenso para mí', 'Me gustaría más variedad en comidas', 'Necesito más tiempo para los hobbies'..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              <strong>Ejemplos de feedback útil:</strong> "muy intenso", "aburrido", "falta tiempo", "muy complicado", "me gusta", "no interesa"
            </div>
            
            <button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim() || isAnalyzing}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Analizar y Sugerir Mejoras
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Feedback Analysis Results */}
      {showAdjustments && feedbackAnalysis && (
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">Análisis de tu Feedback</h3>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {Math.round(feedbackAnalysis.confidence * 100)}% Precisión
            </span>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-blue-800">{feedbackAnalysis.summary}</p>
          </div>

          {feedbackAnalysis.adjustments.length > 0 && (
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-800">Ajustes Sugeridos:</h4>
              {feedbackAnalysis.adjustments.map((adjustment, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-800 capitalize">{adjustment.section}</h5>
                      <p className="text-gray-600 text-sm">{adjustment.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAcceptAdjustments}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Aplicar Ajustes
            </button>
            
            <button
              onClick={handleRejectAdjustments}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Mantener Original
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
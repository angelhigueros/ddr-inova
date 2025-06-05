'use client';

import { useState } from 'react';
import LifestyleForm from '@/components/LifestyleForm';
import LifestylePlan from '@/components/LifestylePlan';
import PlansManager from '@/components/PlansManager';
import { generatePersonalizedPlan } from '@/utils/planGenerator';
import type { LifestylePlan as LifestylePlanType } from '@/types/lifestyle';
import { useAppSelector } from '@/store/hooks';
import { selectIsHydrated } from '@/store/selectors';
import * as Yup from 'yup';

// Form validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('El nombre es requerido'),
  age: Yup.string().required('La edad es requerida'),
  profession: Yup.string().required('La profesión es requerida'),
  goals: Yup.array().min(1, 'Selecciona al menos un objetivo').required('Al menos un objetivo es requerido'),
  timeAvailable: Yup.string().required('El tiempo disponible es requerido'),
  workStyle: Yup.string().required('El estilo de trabajo es requerido'),
  exerciseType: Yup.string().required('El tipo de ejercicio es requerido'),
  hobbies: Yup.array().min(1, 'Selecciona al menos un hobby').required('Al menos un hobby es requerido'),
  dietType: Yup.string().required('El tipo de dieta es requerido'),
  currentSkills: Yup.array(),
  learningStyle: Yup.string().required('El estilo de aprendizaje es requerido'),
  motivationFactors: Yup.array().min(1, 'Selecciona al menos un factor de motivación'),
  currentChallenges: Yup.array(),
  preferredSchedule: Yup.string().required('El horario preferido es requerido'),
  budget: Yup.string().required('El presupuesto es requerido'),
  experience: Yup.string().required('El nivel de experiencia es requerido')
});

interface FormValues {
  name: string;
  age: string;
  profession: string;
  goals: string[];
  timeAvailable: string;
  workStyle: string;
  exerciseType: string;
  hobbies: string[];
  dietType: string;
  currentSkills: string[];
  learningStyle: string;
  motivationFactors: string[];
  currentChallenges: string[];
  preferredSchedule: string;
  budget: string;
  experience: string;
}

type ViewMode = 'manage' | 'create' | 'view' | 'edit';

export default function Home() {
  const isHydrated = useAppSelector(selectIsHydrated);
  const [currentPlan, setCurrentPlan] = useState<LifestylePlanType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('manage');

  const handleFormSubmit = (values: FormValues) => {
    const userProfile = {
      name: values.name,
      age: values.age,
      profession: values.profession,
      goals: values.goals,
      timeAvailable: values.timeAvailable,
      preferences: {
        workStyle: values.workStyle,
        exerciseType: values.exerciseType,
        hobbies: values.hobbies,
        dietType: values.dietType,
        learningStyle: values.learningStyle,
        preferredSchedule: values.preferredSchedule,
        budget: values.budget
      },
      currentSkills: values.currentSkills,
      motivationFactors: values.motivationFactors,
      currentChallenges: values.currentChallenges,
      experience: values.experience
    };

    const plan = generatePersonalizedPlan(userProfile);
    setCurrentPlan({
      id: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      ...plan,
    });
    setViewMode('view');
  };

  const handleCreateNew = () => {
    setCurrentPlan(null);
    setViewMode('create');
  };

  const handleViewPlan = (plan: LifestylePlanType) => {
    setCurrentPlan(plan);
    setViewMode('view');
  };

  const handleEditPlan = (plan: LifestylePlanType) => {
    setCurrentPlan(plan);
    setViewMode('edit');
  };

  const handleBackToManage = () => {
    setCurrentPlan(null);
    setViewMode('manage');
  };

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'manage') {
    return (
      <PlansManager
        onCreateNew={handleCreateNew}
        onViewPlan={handleViewPlan}
        onEditPlan={handleEditPlan}
      />
    );
  }

  if (viewMode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Plan</h1>
            <button
              onClick={handleBackToManage}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              ← Volver a Mis Planes
            </button>
          </div>
          <LifestyleForm
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
          />
        </div>
      </div>
    );
  }

  if ((viewMode === 'view' || viewMode === 'edit') && currentPlan) {
    return (
      <div className="min-h-screen">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {viewMode === 'edit' ? 'Editar Plan' : 'Ver Plan'}
              </h1>
              <button
                onClick={handleBackToManage}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                ← Volver a Mis Planes
              </button>
            </div>
          </div>
        </div>
        <LifestylePlan
          plan={currentPlan}
          onSave={handleBackToManage}
          isEditing={viewMode === 'edit'}
        />
      </div>
    );
  }

  return null;
}

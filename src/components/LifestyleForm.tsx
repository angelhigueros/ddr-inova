'use client';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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

interface Props {
  onSubmit: (values: FormValues) => void;
  validationSchema: Yup.ObjectSchema<any>;
  initialValues?: Partial<FormValues>;
}

const goalOptions = [
  'Avanzar en mi carrera profesional',
  'Mejorar mi condición física',
  'Desarrollar nuevas habilidades técnicas',
  'Aprender un nuevo idioma',
  'Mejorar mi equilibrio trabajo-vida',
  'Aumentar mis ingresos',
  'Desarrollar habilidades de liderazgo',
  'Mejorar mi salud mental',
  'Crear un negocio propio',
  'Aprender habilidades creativas',
  'Mejorar mis relaciones sociales',
  'Desarrollar disciplina y hábitos',
  'Adquirir certificaciones profesionales',
  'Mejorar mi productividad',
  'Encontrar mi propósito de vida'
];

const hobbyOptions = [
  'Lectura y escritura',
  'Música (tocar instrumentos)',
  'Cocina y gastronomía',
  'Fotografía',
  'Pintura y dibujo',
  'Deportes (fútbol, tenis, etc.)',
  'Jardinería',
  'Videojuegos',
  'Programación por hobby',
  'Viajes y exploración',
  'Yoga y meditación',
  'Baile',
  'Manualidades y DIY',
  'Podcasts y audiolibros',
  'Cine y series',
  'Coleccionismo',
  'Voluntariado',
  'Idiomas extranjeros',
  'Ajedrez y juegos de mesa',
  'Astronomía'
];

const currentSkillsOptions = [
  'Comunicación efectiva',
  'Liderazgo',
  'Programación',
  'Diseño gráfico',
  'Marketing digital',
  'Análisis de datos',
  'Gestión de proyectos',
  'Ventas',
  'Idiomas extranjeros',
  'Presentaciones públicas',
  'Escritura técnica',
  'Negociación',
  'Trabajo en equipo',
  'Resolución de problemas',
  'Creatividad e innovación'
];

const motivationFactorsOptions = [
  'Reconocimiento y logros',
  'Crecimiento personal',
  'Estabilidad financiera',
  'Flexibilidad de horarios',
  'Impacto social positivo',
  'Desafíos intelectuales',
  'Colaboración con otros',
  'Autonomía e independencia',
  'Aprendizaje continuo',
  'Competencia sana',
  'Creatividad y expresión',
  'Resultados tangibles'
];

const currentChallengesOptions = [
  'Falta de tiempo',
  'Procrastinación',
  'Falta de motivación',
  'Dificultad para concentrarse',
  'Estrés y ansiedad',
  'Falta de recursos económicos',
  'Miedo al fracaso',
  'Falta de disciplina',
  'Sobrecarga de trabajo',
  'Falta de dirección clara',
  'Perfeccionismo',
  'Dificultad para establecer prioridades'
];

export default function LifestyleForm({ onSubmit, validationSchema, initialValues }: Props) {
  const defaultValues: FormValues = {
    name: '',
    age: '',
    profession: '',
    goals: [],
    timeAvailable: '',
    workStyle: '',
    exerciseType: '',
    hobbies: [],
    dietType: '',
    currentSkills: [],
    learningStyle: '',
    motivationFactors: [],
    currentChallenges: [],
    preferredSchedule: '',
    budget: '',
    experience: '',
    ...initialValues
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Crea tu Plan de Estilo de Vida Personalizado
        </h1>
        <p className="text-xl text-purple-100">
          Completa el formulario para generar tu plan personalizado
        </p>
      </div>

      <div className="p-8">
        <Formik
          initialValues={defaultValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <span className="text-purple-600 text-lg">👤</span>
                    </div>
                    Información Personal
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tu nombre completo"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Edad
                    </label>
                    <Field
                      name="age"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tu edad</option>
                      <option value="18-25">18-25 años</option>
                      <option value="26-35">26-35 años</option>
                      <option value="36-45">36-45 años</option>
                      <option value="46-55">46-55 años</option>
                      <option value="56+">56+ años</option>
                    </Field>
                    {errors.age && touched.age && (
                      <div className="text-red-500 text-sm mt-1">{errors.age}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profesión/Ocupación
                    </label>
                    <Field
                      name="profession"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tu profesión actual"
                    />
                    {errors.profession && touched.profession && (
                      <div className="text-red-500 text-sm mt-1">{errors.profession}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tiempo Disponible (horas por semana)
                    </label>
                    <Field
                      name="timeAvailable"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tiempo disponible</option>
                      <option value="1-3 horas">1-3 horas por semana</option>
                      <option value="4-7 horas">4-7 horas por semana</option>
                      <option value="8-15 horas">8-15 horas por semana</option>
                      <option value="15+ horas">15+ horas por semana</option>
                    </Field>
                    {errors.timeAvailable && touched.timeAvailable && (
                      <div className="text-red-500 text-sm mt-1">{errors.timeAvailable}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nivel de Experiencia en Desarrollo Personal
                    </label>
                    <Field
                      name="experience"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tu nivel</option>
                      <option value="principiante">Principiante - Nuevo en esto</option>
                      <option value="intermedio">Intermedio - Algo de experiencia</option>
                      <option value="avanzado">Avanzado - Mucha experiencia</option>
                    </Field>
                    {errors.experience && touched.experience && (
                      <div className="text-red-500 text-sm mt-1">{errors.experience}</div>
                    )}
                  </div>
                </div>

                {/* Goals and Preferences */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <span className="text-blue-600 text-lg">🎯</span>
                    </div>
                    Objetivos y Preferencias
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Objetivos Principales (selecciona los que apliquen)
                    </label>
                    <div className="grid md:grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {goalOptions.map((goal) => (
                        <label key={goal} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={values.goals.includes(goal)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('goals', [...values.goals, goal]);
                              } else {
                                setFieldValue('goals', values.goals.filter(g => g !== goal));
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{goal}</span>
                        </label>
                      ))}
                    </div>
                    {errors.goals && touched.goals && (
                      <div className="text-red-500 text-sm mt-1">{errors.goals}</div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Seleccionados: {values.goals.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estilo de Trabajo Preferido
                    </label>
                    <Field
                      name="workStyle"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tu estilo</option>
                      <option value="remoto">Trabajo remoto</option>
                      <option value="presencial">Trabajo presencial</option>
                      <option value="hibrido">Trabajo híbrido</option>
                      <option value="freelance">Freelance/Independiente</option>
                    </Field>
                    {errors.workStyle && touched.workStyle && (
                      <div className="text-red-500 text-sm mt-1">{errors.workStyle}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Ejercicio Preferido
                    </label>
                    <Field
                      name="exerciseType"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tipo de ejercicio</option>
                      <option value="cardio">Cardio y resistencia</option>
                      <option value="fuerza">Entrenamiento de fuerza</option>
                      <option value="yoga">Yoga y flexibilidad</option>
                      <option value="deportes">Deportes en equipo</option>
                      <option value="mixto">Entrenamiento mixto</option>
                      <option value="caminata">Caminatas y actividades suaves</option>
                    </Field>
                    {errors.exerciseType && touched.exerciseType && (
                      <div className="text-red-500 text-sm mt-1">{errors.exerciseType}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Dieta Preferida
                    </label>
                    <Field
                      name="dietType"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tipo de dieta</option>
                      <option value="balanceada">Dieta balanceada</option>
                      <option value="vegetariana">Vegetariana</option>
                      <option value="vegana">Vegana</option>
                      <option value="keto">Keto/Cetogénica</option>
                      <option value="mediterranea">Mediterránea</option>
                      <option value="paleo">Paleo</option>
                    </Field>
                    {errors.dietType && touched.dietType && (
                      <div className="text-red-500 text-sm mt-1">{errors.dietType}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Detailed Information */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <span className="text-green-600 text-lg">🎨</span>
                    </div>
                    Intereses y Habilidades
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hobbies e Intereses (selecciona los que te gusten)
                    </label>
                    <div className="grid md:grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {hobbyOptions.map((hobby) => (
                        <label key={hobby} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={values.hobbies.includes(hobby)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('hobbies', [...values.hobbies, hobby]);
                              } else {
                                setFieldValue('hobbies', values.hobbies.filter(h => h !== hobby));
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{hobby}</span>
                        </label>
                      ))}
                    </div>
                    {errors.hobbies && touched.hobbies && (
                      <div className="text-red-500 text-sm mt-1">{errors.hobbies}</div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Seleccionados: {values.hobbies.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Habilidades Actuales (selecciona las que ya tienes)
                    </label>
                    <div className="grid md:grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {currentSkillsOptions.map((skill) => (
                        <label key={skill} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={values.currentSkills.includes(skill)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('currentSkills', [...values.currentSkills, skill]);
                              } else {
                                setFieldValue('currentSkills', values.currentSkills.filter(s => s !== skill));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Seleccionadas: {values.currentSkills.length}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <span className="text-orange-600 text-lg">⚡</span>
                    </div>
                    Estilo Personal
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estilo de Aprendizaje Preferido
                    </label>
                    <Field
                      name="learningStyle"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tu estilo</option>
                      <option value="visual">Visual (videos, diagramas, imágenes)</option>
                      <option value="auditivo">Auditivo (podcasts, explicaciones)</option>
                      <option value="kinestesico">Kinestésico (práctica, experimentación)</option>
                      <option value="lectura">Lectura/Escritura (libros, notas)</option>
                      <option value="mixto">Mixto (combinación de varios)</option>
                    </Field>
                    {errors.learningStyle && touched.learningStyle && (
                      <div className="text-red-500 text-sm mt-1">{errors.learningStyle}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Qué te motiva más? (selecciona los que apliquen)
                    </label>
                    <div className="grid md:grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {motivationFactorsOptions.map((factor) => (
                        <label key={factor} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={values.motivationFactors.includes(factor)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('motivationFactors', [...values.motivationFactors, factor]);
                              } else {
                                setFieldValue('motivationFactors', values.motivationFactors.filter(f => f !== factor));
                              }
                            }}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{factor}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Seleccionados: {values.motivationFactors.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Principales Desafíos Actuales (selecciona los que enfrentas)
                    </label>
                    <div className="grid md:grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {currentChallengesOptions.map((challenge) => (
                        <label key={challenge} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={values.currentChallenges.includes(challenge)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('currentChallenges', [...values.currentChallenges, challenge]);
                              } else {
                                setFieldValue('currentChallenges', values.currentChallenges.filter(c => c !== challenge));
                              }
                            }}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">{challenge}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Seleccionados: {values.currentChallenges.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Horario Preferido para Actividades
                    </label>
                    <Field
                      name="preferredSchedule"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tu horario preferido</option>
                      <option value="mañana">Mañana temprano (6-9 AM)</option>
                      <option value="media-mañana">Media mañana (9-12 PM)</option>
                      <option value="tarde">Tarde (12-6 PM)</option>
                      <option value="noche">Noche (6-10 PM)</option>
                      <option value="flexible">Flexible - depende del día</option>
                    </Field>
                    {errors.preferredSchedule && touched.preferredSchedule && (
                      <div className="text-red-500 text-sm mt-1">{errors.preferredSchedule}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Presupuesto Mensual para Desarrollo Personal
                    </label>
                    <Field
                      name="budget"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Selecciona tu presupuesto</option>
                      <option value="0-50">$0 - $50 USD</option>
                      <option value="50-100">$50 - $100 USD</option>
                      <option value="100-200">$100 - $200 USD</option>
                      <option value="200-500">$200 - $500 USD</option>
                      <option value="500+">$500+ USD</option>
                    </Field>
                    {errors.budget && touched.budget && (
                      <div className="text-red-500 text-sm mt-1">{errors.budget}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-3 py-4 px-12 border border-transparent rounded-lg shadow-sm text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="text-2xl">✨</span>
                  {isSubmitting ? 'Generando tu plan...' : 'Generar Mi Plan Personalizado'}
                  <span className="text-2xl">🚀</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 
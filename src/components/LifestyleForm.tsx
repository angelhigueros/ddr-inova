'use client';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  name: string;
  age: string;
  profession: string;
  goals: string;
  timeAvailable: string;
  workStyle: string;
  exerciseType: string;
  hobbies: string;
  dietType: string;
}

interface Props {
  onSubmit: (values: FormValues) => void;
  validationSchema: Yup.ObjectSchema<any>;
  initialValues?: Partial<FormValues>;
}

export default function LifestyleForm({ onSubmit, validationSchema, initialValues }: Props) {
  const defaultValues: FormValues = {
    name: '',
    age: '',
    profession: '',
    goals: '',
    timeAvailable: '',
    workStyle: '',
    exerciseType: '',
    hobbies: '',
    dietType: '',
    ...initialValues
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Crea tu Plan de Estilo de Vida Personalizado
        </h1>
        <p className="text-xl text-purple-100">
          Responde algunas preguntas para generar tu plan personalizado
        </p>
      </div>

      <div className="p-8">
        <Formik
          initialValues={defaultValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Objetivos Principales (separados por comas)
                    </label>
                    <Field
                      name="goals"
                      as="textarea"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Ejemplo: Mejorar mi condición física, Desarrollar nuevas habilidades, Avanzar en mi carrera"
                    />
                    {errors.goals && touched.goals && (
                      <div className="text-red-500 text-sm mt-1">{errors.goals}</div>
                    )}
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
                    </Field>
                    {errors.exerciseType && touched.exerciseType && (
                      <div className="text-red-500 text-sm mt-1">{errors.exerciseType}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hobbies e Intereses (separados por comas)
                    </label>
                    <Field
                      name="hobbies"
                      as="textarea"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Ejemplo: Lectura, Fotografía, Cocina, Programación"
                    />
                    {errors.hobbies && touched.hobbies && (
                      <div className="text-red-500 text-sm mt-1">{errors.hobbies}</div>
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
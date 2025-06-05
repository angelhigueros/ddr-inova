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
  'Advance in my professional career',
  'Improve my physical condition',
  'Develop new technical skills',
  'Learn a new language',
  'Improve my work-life balance',
  'Increase my income',
  'Develop leadership skills',
  'Improve my mental health',
  'Start my own business',
  'Learn creative skills',
  'Improve my social relationships',
  'Develop discipline and habits',
  'Acquire professional certifications',
  'Improve my productivity',
  'Find my life purpose'
];

const hobbyOptions = [
  'Reading and writing',
  'Music (playing instruments)',
  'Cooking and gastronomy',
  'Photography',
  'Painting and drawing',
  'Sports (soccer, tennis, etc.)',
  'Gardening',
  'Video games',
  'Programming as hobby',
  'Travel and exploration',
  'Yoga and meditation',
  'Dancing',
  'Crafts and DIY',
  'Podcasts and audiobooks',
  'Movies and series',
  'Collecting',
  'Volunteering',
  'Foreign languages',
  'Chess and board games',
  'Astronomy'
];

const currentSkillsOptions = [
  'Effective communication',
  'Leadership',
  'Programming',
  'Graphic design',
  'Digital marketing',
  'Data analysis',
  'Project management',
  'Sales',
  'Foreign languages',
  'Public speaking',
  'Technical writing',
  'Negotiation',
  'Teamwork',
  'Problem solving',
  'Creativity and innovation'
];

const motivationFactorsOptions = [
  'Recognition and achievements',
  'Personal growth',
  'Financial stability',
  'Schedule flexibility',
  'Positive social impact',
  'Intellectual challenges',
  'Collaboration with others',
  'Autonomy and independence',
  'Continuous learning',
  'Healthy competition',
  'Creativity and expression',
  'Tangible results'
];

const currentChallengesOptions = [
  'Lack of time',
  'Procrastination',
  'Lack of motivation',
  'Stress and anxiety',
  'Lack of financial resources',
  'Work overload',
  'Lack of discipline',
  'Social distractions',
  'Lack of clear direction',
  'Lack of emotional support'
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
          Create Your Personalized Lifestyle Plan
        </h1>
        <p className="text-xl text-purple-100">
          Complete the form to generate your personalized plan
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
                    Personal Information
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age
                    </label>
                    <Field
                      name="age"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select your age</option>
                      <option value="18-25">18-25 years</option>
                      <option value="26-35">26-35 years</option>
                      <option value="36-45">36-45 years</option>
                      <option value="46-55">46-55 years</option>
                      <option value="56+">56+ years</option>
                    </Field>
                    {errors.age && touched.age && (
                      <div className="text-red-500 text-sm mt-1">{errors.age}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profession/Occupation
                    </label>
                    <Field
                      name="profession"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your current profession"
                    />
                    {errors.profession && touched.profession && (
                      <div className="text-red-500 text-sm mt-1">{errors.profession}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time Available (hours per week)
                    </label>
                    <Field
                      name="timeAvailable"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select time available</option>
                      <option value="1-3 hours">1-3 hours per week</option>
                      <option value="4-7 hours">4-7 hours per week</option>
                      <option value="8-15 hours">8-15 hours per week</option>
                      <option value="15+ hours">15+ hours per week</option>
                    </Field>
                    {errors.timeAvailable && touched.timeAvailable && (
                      <div className="text-red-500 text-sm mt-1">{errors.timeAvailable}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Level of Experience in Personal Development
                    </label>
                    <Field
                      name="experience"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select your level</option>
                      <option value="beginner">Beginner - New to this</option>
                      <option value="intermediate">Intermediate - Some experience</option>
                      <option value="advanced">Advanced - Lots of experience</option>
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
                    Goals and Preferences
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Main Goals (select those that apply)
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
                    <p className="text-xs text-gray-500 mt-1">Selected: {values.goals.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Work Style
                    </label>
                    <Field
                      name="workStyle"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select your style</option>
                      <option value="remoto">Remote work</option>
                      <option value="presencial">On-site work</option>
                      <option value="hibrido">Hybrid work</option>
                      <option value="freelance">Freelance/Independent</option>
                    </Field>
                    {errors.workStyle && touched.workStyle && (
                      <div className="text-red-500 text-sm mt-1">{errors.workStyle}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Exercise Type
                    </label>
                    <Field
                      name="exerciseType"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select exercise type</option>
                      <option value="cardio">Cardio and resistance</option>
                      <option value="fuerza">Strength training</option>
                      <option value="yoga">Yoga and flexibility</option>
                      <option value="deportes">Team sports</option>
                      <option value="mixto">Mixed training</option>
                      <option value="caminata">Easy walks and activities</option>
                    </Field>
                    {errors.exerciseType && touched.exerciseType && (
                      <div className="text-red-500 text-sm mt-1">{errors.exerciseType}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Diet Type
                    </label>
                    <Field
                      name="dietType"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select diet type</option>
                      <option value="balanceada">Balanced diet</option>
                      <option value="vegetariana">Vegetarian</option>
                      <option value="vegana">Vegan</option>
                      <option value="keto">Keto/Cetogenic</option>
                      <option value="mediterranea">Mediterranean</option>
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
                    Interests and Skills
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hobbies and Interests (select those you like)
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
                    <p className="text-xs text-gray-500 mt-1">Selected: {values.hobbies.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Current Skills (select those you already have)
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
                    <p className="text-xs text-gray-500 mt-1">Selected: {values.currentSkills.length}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <span className="text-orange-600 text-lg">⚡</span>
                    </div>
                    Personal Style
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Learning Style
                    </label>
                    <Field
                      name="learningStyle"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select your style</option>
                      <option value="visual">Visual (videos, diagrams, images)</option>
                      <option value="auditivo">Auditory (podcasts, explanations)</option>
                      <option value="kinestesico">Kinesthetic (practice, experimentation)</option>
                      <option value="lectura">Reading/Writing (books, notes)</option>
                      <option value="mixto">Mixed (combination of several)</option>
                    </Field>
                    {errors.learningStyle && touched.learningStyle && (
                      <div className="text-red-500 text-sm mt-1">{errors.learningStyle}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What motivates you the most? (select those that apply)
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
                    <p className="text-xs text-gray-500 mt-1">Selected: {values.motivationFactors.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Main Current Challenges (select those you face)
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
                    <p className="text-xs text-gray-500 mt-1">Selected: {values.currentChallenges.length}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Schedule for Activities
                    </label>
                    <Field
                      name="preferredSchedule"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select your preferred schedule</option>
                      <option value="morning">Early morning (6-9 AM)</option>
                      <option value="mid-morning">Mid-morning (9-12 PM)</option>
                      <option value="afternoon">Afternoon (12-6 PM)</option>
                      <option value="evening">Evening (6-10 PM)</option>
                      <option value="flexible">Flexible - depends on the day</option>
                    </Field>
                    {errors.preferredSchedule && touched.preferredSchedule && (
                      <div className="text-red-500 text-sm mt-1">{errors.preferredSchedule}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Budget for Personal Development
                    </label>
                    <Field
                      name="budget"
                      as="select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select your budget</option>
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
                  {isSubmitting ? 'Generating your plan...' : 'Generate My Personalized Plan'}
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
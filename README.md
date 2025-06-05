# Lifestyle Planner

A Next.js application that helps users create personalized lifestyle plans based on their preferences and goals. The application generates comprehensive plans covering professional development, fitness routines, hobbies, and nutrition.

## Features

- User preference collection through an intuitive form
- Personalized plan generation for multiple life aspects:
  - Professional development
  - Fitness and exercise
  - Hobbies and interests
  - Nutrition and diet
- Interactive plan viewing with tabbed navigation
- Timeline navigation system with progress tracking
- Advanced feedback system for plan refinement and adjustments
- Redux state management for plan persistence
- Immutable state handling for reliable plan modifications

## Technologies Used

- Next.js 15.3.3 with Turbopack
- TypeScript
- Tailwind CSS
- Redux Toolkit for state management
- Lucide React for icons
- Formik for form handling
- Yup for form validation

## Development History

### 1. Project Initialization
Ejecutar comando para crear proyecto React/Next

### 2. Base Mockup Creation with AI Assistance
**Utilizar cursor y Claude sonnet 4 para creación de maqueta base**

**Input:**
```
Crea un esquema base de una app React/Next con la siguiente estructura
- Form with 4 categories
Plan profesional
Plan de entrenamiento
Plan de hobbys
Plan de nutricion
- El usuario debe poder ingresar lineamientos especificos para su estilo de vida, en base a eso generar un estilo de vida
- Form para retroalimentacion
```

**Output:**
```
Te ayudo a crear una aplicación web completa de planificación de estilo de vida usando React. Esta aplicación permitirá a los usuarios generar planes personalizados y ajustarlos según su retroalimentación.

He creado una aplicación completa de planificación de estilo de vida con las siguientes características principales:

Características Principales:
 Formulario de Perfil
Información personal (nombre, edad, profesión)
Selección de objetivos múltiples
Preferencias de trabajo, ejercicio, dieta y hobbies
Tiempo disponible por día

 Generación de Planes Personalizados
Plan Profesional: Objetivos de carrera, horarios y recursos
Plan de Entrenamiento: Rutinas personalizadas según preferencias
Plan de Hobbies: Actividades y horarios para desarrollo personal
Plan de Nutrición: Planes de comida y guías nutricionales

Funciones Interactivas
Secciones expandibles/colapsables
Edición en línea de secciones
Sistema de retroalimentación con calificaciones por estrellas
Ajuste automático del plan basado en feedback

Diseño y UX
Interfaz moderna con gradientes y animaciones
Design responsive para diferentes dispositivos
Iconos intuitivos de Lucide React
Flujo de usuario claro en 3 pasos

Flujo de la Aplicación:
Formulario: El usuario completa su perfil y preferencias
Plan Generado: Se muestra un plan personalizado en 4 áreas principales
Retroalimentación: El usuario califica y comenta cada sección
Ajuste: El plan se modifica según la retroalimentación

La aplicación simula la generación inteligente de planes basándose en las respuestas del usuario, creando recomendaciones específicas para cada área de la vida. ¿Te gustaría que ajuste alguna funcionalidad específica o añada alguna característica adicional?
```

### 3. Bug Fixes and Basic Improvements
- Corregir errores simples
- Botones no funcionaban
- Manejo de inputs fallaba (no se escribían los espacios)
- Cambios en CSS
- Cursor no tiene la propiedad pointer en los botones y links

### 4. Component Structure Enhancement
- Crear componentes del plan de vida con React y estructura de carpetas
- Cree un componente plantilla de la estructura que seguirá cada categoría

### 5. Plan Enhancement and Interactivity
**Utilizar cursor y Claude sonnet 4 para ampliar el plan de vida, con sugerencias e ideas nuevas de como mostrar la información en el componente actual**

**Input:**
```
Amplia el plan de vida, hazlo mas interesante e interactivo.
piensa en ideas de como realmente ayudar al usuario con la informacion que dio al principio
```

**Output:**
```
¡Excelente! He ampliado significativamente el plan de vida para que sea mucho más interesante, interactivo y útil. Aquí están las mejoras principales que implementé:

Nuevas Funcionalidades Implementadas:

1. Análisis Personalizado Inteligente
Insights personalizados basados en edad, objetivos y tiempo disponible
Análisis de fortalezas y áreas de mejora específicas
Consejos personalizados según perfil psicológico
Estilo de aprendizaje y motivación adaptados
Optimización del tiempo con técnicas específicas

2. Plan Profesional Avanzado
Ruta de carrera visual con progreso y objetivos salariales
Metas con progreso tracking y fechas límite
Hitos interactivos con checkboxes para marcar completados
Habilidades detalladas con niveles actuales y objetivos
Recursos específicos con links, costos y ratings
Plan de networking con plataformas y eventos
Técnicas de gestión del tiempo personalizadas

3. Plan de Fitness Interactivo
Rutinas detalladas con ejercicios específicos, sets y repeticiones
Tracking de progreso con barras visuales y métricas
Calendarios de entrenamiento semanales
Información nutricional para pre/post entrenamiento
Equipamiento necesario específico por tipo de ejercicio
Consejos de seguridad personalizados

4. Plan de Hobbies Enriquecido
Hobbies detallados con niveles de habilidad y tiempo de compromiso
Objetivos de aprendizaje específicos para cada hobby
Proyectos sugeridos con pasos detallados y niveles de dificultad
Recursos de aprendizaje categorizados con costos y ratings
Progresión de habilidades con hitos y timeframes

5. Plan Nutricional Completo
Planes de comida semanales con macronutrientes detallados
Listas de compras interactivas con checkboxes
Plan de hidratación con metas diarias y recordatorios
Suplementos recomendados con dosis y propósitos
Estimaciones de costos semanales
Consejos de meal prep personalizados

6. Sistema de Logros
Achievements desbloqueables basados en progreso
Iconos y fechas de desbloqueo
Categorización por área (profesional, fitness, hobbies, nutrición)

7. Interfaz Completamente Interactiva
6 tabs navegables con iconos lucide-react
Progress bars animadas para objetivos y métricas
Checkboxes funcionales para tareas y compras
Cards hover effects y transiciones suaves
Color coding por prioridad y estado
Responsive design mejorado

 Inteligencia del Sistema:
El nuevo generador de planes analiza profundamente:
Edad del usuario → Adapta estrategias y estilos de aprendizaje
Profesión → Genera rutas de carrera específicas
Objetivos seleccionados → Personaliza fortalezas y consejos
Tiempo disponible → Optimiza técnicas y distribución
Preferencias → Crea contenido ultra-personalizado

 Valor Real para el Usuario:
Planificación Actionable: Cada objetivo tiene pasos concretos y fechas
Tracking de Progreso: Barras visuales y métricas para seguimiento
Recursos Específicos: Links, costos, timeframes para cada recomendación
Personalización Profunda: Contenido adaptado a su perfil único
Motivación Continua: Sistema de logros y feedback visual
Practicidad: Listas de compras, equipamiento, horarios específicos

El plan ahora es verdaderamente un sistema completo de gestión de estilo de vida que puede ayudar al usuario a lograr objetivos reales con un roadmap claro y herramientas interactivas de seguimiento.

¿Te gustaría que agregue alguna funcionalidad específica adicional o que mejore algún aspecto en particular?
```

### 6. State Management Implementation
Implementar sistema redux para manejo de estado y poder llevar registro de planes generados

### 7. Timeline Navigation System
**Utilizar cursor y Claude sonnet 4 para implementar timeline para navegar entre pestañas del plan de vida y pedir feedback al final**

**Input:**
```
El feedback se pide al final, agrega un timeline para ir navegando entre categorias (Insights ..., profesional, Fitnes, etc, Feedback) y en ese apartado se pueda enviar un feedback general
```

**Output:**
```
Perfecto! He implementado exitosamente el sistema de timeline y feedback mejorado. Aquí están las nuevas funcionalidades:

 Nuevo Sistema de Timeline y Navegación:

1. Timeline Visual Progresivo
Barra de progreso visual que muestra el avance entre categorías
7 pasos totales: Insights → Profesional → Fitness → Hobbies → Nutrición → Logros → Feedback
Indicadores de estado:
 Completados (con check verde)
 Actual (resaltado con anillo púrpura)
 Pendientes (en gris)

2. Navegación Mejorada
Botones Anterior/Siguiente para navegar secuencialmente
Clicks directos en el timeline para saltar a cualquier sección
Contador de progreso (Paso X de 7)
Transiciones suaves entre secciones

3. Sección de Feedback Dedicada
Tab final separado exclusivamente para feedback
Formulario mejorado con:
Textarea más grande y cómoda
Preguntas guía para orientar el feedback
Botones de envío y limpiar
Mensaje de agradecimiento
Feedback integral sobre todo el plan (no por secciones)

Mejoras de UX:
Timeline Intuitivo
Apply to page.tsx
Flujo Guiado
El usuario puede navegar libremente o seguir el flujo secuencial
Cada paso se marca como "visitado" visualmente
El progreso se mantiene durante la sesión

Feedback Contextual
Preguntas específicas para guiar el feedback:
¿Los insights fueron precisos?
¿El plan profesional se alinea con tus objetivos?
¿Las rutinas de fitness son apropiadas?
¿Los hobbies te emocionan?
¿El plan nutricional es realista?
¿Qué funcionalidades adicionales quieres?

 Características Técnicas:
Estado Persistente
Navegación fluida sin perder datos
Progress tracking visual
Botones deshabilitados inteligentemente

Responsive Design
Timeline adaptable a móviles
Navegación táctil optimizada
Iconos y texto escalables

Interactividad Mejorada
Hover effects en elementos del timeline
Transiciones suaves entre estados
Feedback visual inmediato

El sistema ahora ofrece una experiencia mucho más guiada y profesional, donde el usuario puede navegar su plan de vida como un journey estructurado, culminando con un feedback comprehensivo sobre toda la experiencia.

¿Te gustaría que agregue alguna funcionalidad adicional al timeline o modifique algún aspecto del flujo de navegación?
```

### 8. Code Optimization and Enhancement
**Utilizar Cursor y Claude sonnet 4 para mejorar el código existente**

**Input:**
```
en Tus Insights Personalizados, modifica

Tus Fortalezas
Áreas de Mejora
Establecimiento de rutinas sólidas
Consejos Personalizados
Tu Estilo de Aprendizaje
Aprendizaje visual e interactivo con tecnología

Tu Estilo de Motivación
Exploración y experimentación con diferentes enfoques

para dar un mejor detalle y seguimiento
```

**Output:**
```
Perfecto! He mejorado significativamente la sección de "Tus Insights Personalizados" con las siguientes mejoras:

 Mejoras Implementadas:

1. Fortalezas Mejoradas:
Diseño visual más atractivo con cards individuales
Etiquetas motivacionales para potenciar cada fortaleza
Consejos contextuales para aprovechar las fortalezas

2. Áreas de Mejora con Seguimiento:
Sistema de prioridades (Alta, Media, Baja)
Barras de progreso para cada área
Indicadores de estado del progreso
Plan de acción específico

3. Consejos Personalizados Interactivos:
Numeración visual para orden de aplicación
Botones de seguimiento (Aplicado, Recordar después)
Indicadores de dificultad 
Sistema de tracking de consistencia

4. Estilo de Aprendizaje Detallado:
Recursos específicos recomendados (videos, apps, cursos)
Duración óptima de sesiones de aprendizaje
Etiquetas de características (Interactivo, Visual)
Consejos de optimización

5. Estilo de Motivación Avanzado:
Estrategias específicas de motivación
Sistema de seguimiento visual (barras de energía y curiosidad)
Métricas motivacionales en tiempo real
Consejos para mantener la motivación

6. Optimización del Tiempo Mejorada:
Estimaciones de tiempo para cada estrategia
Indicadores de impacto (Alto, Medio, Bajo)
Botones de implementación para tracking
Barras de progreso individuales
Dashboard de métricas (tiempo disponible, técnicas aplicadas, eficiencia)

7. Características Adicionales:
Diseño responsive mejorado
Colores temáticos para cada sección
Iconografía consistente
Elementos interactivos para mejor engagement
Sistema de feedback visual

Estos cambios proporcionan:
 Mejor seguimiento del progreso
 Más detalles actionables
 Elementos interactivos para engagement
 Información específica y útil
Sistema de métricas para motivación

¿Te gustaría que ajuste algún aspecto específico o añada alguna funcionalidad adicional?
```

### 9. Code Refactoring
Refactorizar el código para tener una mejor estructura.

### 10. Feedback-Based Plan Modification
Implementar la opción de cambiar el plan por medio del feedback, implementando la UI con react y utilizando claude sonnet 4 para crear mock data con los planes personalizados por cada categoría

### 11. Immutability Issue Resolution
**Corregir errores con claude sonnet 4**

**Input:**
```
Analyze the code, the component and logic and try to fix the next issue without modifying the current functionality

Error: Cannot assign to read only property 'workoutRoutine' of object '#<Object>'

Call Stack
5

adjustFitnessPlan
.next\static\chunks\src_cdfa97ea._.js (1867:40)
<unknown>
.next\static\chunks\src_cdfa97ea._.js (1819:32)
```

**Output:**
```
El error indica que estamos intentando modificar una propiedad de solo lectura. Esto ocurre porque el plan que viene de Redux está siendo tratado como inmutable. Necesito hacer una copia profunda (deep copy) de los objetos anidados para poder modificarlos.

Voy a corregir el archivo feedbackAnalyzer.ts para manejar correctamente la inmutabilidad:

Perfecto! He corregido el error de inmutabilidad. Los cambios principales son:

 Solución al Error de Inmutabilidad

Problema:
Redux mantiene el estado como inmutable
Intentábamos modificar directamente propiedades de objetos inmutables
Error: Cannot assign to read only property

Solución Implementada:
Deep Copy Inicial:
Apply
Spread Operator para Objetos Anidados:
Apply
Inmutabilidad Consistente: Todos los niveles de anidación ahora usan el patrón de spread operator

Funciones Corregidas:
adjustProfessionalPlan - Manejo correcto de goals y skills
adjustFitnessPlan - Manejo correcto de workoutRoutine
adjustHobbiesPlan - Manejo correcto de selectedHobbies
adjustNutritionPlan - Manejo correcto de mealPlan
adjustInsightsPlan - Manejo correcto de personalizedInsights

Mejoras Adicionales:
Agregué función increaseTimeCommitment para hobbies
Todas las modificaciones mantienen la estructura inmutable
Protección completa contra mutaciones accidentales

Ahora el sistema de feedback debería funcionar sin errores de inmutabilidad. ¡El plan se puede ajustar correctamente basándose en el feedback del usuario! 🚀
```

### 12. Translation Project
**Final comprehensive translation from Spanish to English of all application content**

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd ddr-inova
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Main layout component
│   ├── page.tsx            # Home page
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── LifestylePlan.tsx   # Main plan display component
│   ├── LifestyleForm.tsx   # User input form
│   └── PlansManager.tsx    # Plan management interface
├── store/
│   ├── index.ts           # Redux store configuration
│   └── plansSlice.ts      # Plans state management
├── utils/
│   ├── planGenerator.ts   # Plan generation logic
│   └── feedbackAnalyzer.ts # Feedback analysis system
└── types/
    └── lifestyle.ts       # TypeScript interfaces
```

## Key Features

### Interactive Timeline Navigation
Navigate through 7 comprehensive sections:
- **Insights:** Personalized analysis and recommendations
- **Professional:** Career development and skill tracking
- **Fitness:** Workout routines and progress monitoring
- **Hobbies:** Personal interests and learning goals
- **Nutrition:** Meal planning and dietary guidance
- **Achievements:** Progress milestones and accomplishments
- **Feedback:** Comprehensive plan evaluation and adjustment

### Intelligent Plan Generation
The system analyzes user input to create personalized recommendations covering all aspects of lifestyle planning with actionable steps, specific resources, and progress tracking capabilities.

### Advanced Feedback System
Comprehensive feedback analysis that automatically adjusts plans based on user input, maintaining immutable state integrity while providing real-time plan modifications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
**Command:** Create React/Next project
- Initial setup of Next.js project structure
- Basic configuration and dependencies

### 2. Base Mockup Creation with AI Assistance
**Tool:** Cursor + Claude Sonnet 4

**Prompt:** 
Create a base schema for a React/Next app with the following structure:
- Form with 4 categories: Professional Plan, Training Plan, Hobbies Plan, Nutrition Plan
- User should be able to input specific guidelines for their lifestyle, based on that generate a lifestyle plan
- Form for feedback

**Output:** Complete lifestyle planning application with:
- **Profile Form:** Personal information, multiple objective selection, work/exercise/diet/hobby preferences, available time per day
- **Personalized Plan Generation:** Professional, Training, Hobbies, and Nutrition plans
- **Interactive Functions:** Expandable/collapsible sections, inline editing, star rating feedback system, automatic plan adjustment based on feedback
- **Modern Design:** Responsive UI with gradients, animations, intuitive Lucide React icons

### 3. Bug Fixes and Basic Improvements
**Issues Resolved:**
- Non-functional buttons
- Input handling failures (space writing issues)
- CSS modifications
- Added cursor pointer property for buttons and links

### 4. Component Structure Enhancement
- Created lifestyle plan components with React
- Implemented proper folder structure
- Developed template component for category structure consistency

### 5. Plan Enhancement and Interactivity
**Tool:** Cursor + Claude Sonnet 4

**Prompt:** Expand the lifestyle plan, make it more interesting and interactive. Think of ideas on how to really help the user with the information they provided initially.

**Major Improvements:**
- **Intelligent Personal Analysis:** Personalized insights, strengths/improvement areas analysis, custom advice, learning styles, time optimization techniques
- **Advanced Professional Plan:** Visual career path with salary goals, interactive milestones, detailed skills tracking, specific resources with ratings
- **Interactive Fitness Plan:** Detailed routines with sets/reps, visual progress tracking, weekly calendars, pre/post workout nutrition
- **Enriched Hobbies Plan:** Skill levels, learning objectives, detailed projects, categorized learning resources
- **Complete Nutritional Plan:** Weekly meal plans with macronutrients, interactive shopping lists, hydration goals, supplement recommendations
- **Achievement System:** Unlockable achievements, progress tracking, categorization by area

### 6. State Management Implementation
**Technology:** Redux Toolkit
- Implemented Redux for state management
- Added plan persistence and tracking capabilities
- Created plans slice for comprehensive state handling

### 7. Timeline Navigation System
**Tool:** Cursor + Claude Sonnet 4

**Prompt:** Add a timeline to navigate between categories (Insights, Professional, Fitness, etc., Feedback) and add a section where general feedback can be sent.

**Features Added:**
- **Visual Progressive Timeline:** 7-step progress bar (Insights → Professional → Fitness → Hobbies → Nutrition → Achievements → Feedback)
- **Enhanced Navigation:** Previous/Next buttons, direct timeline clicks, smooth transitions
- **Dedicated Feedback Section:** Comprehensive feedback form with guided questions, integral plan evaluation

### 8. Code Optimization and Enhancement
**Tool:** Cursor + Claude Sonnet 4

**Improvements to Personalized Insights:**
- Enhanced strengths display with motivational tags
- Improvement areas with priority system and progress bars
- Interactive personalized advice with tracking buttons
- Detailed learning styles with specific resources
- Advanced motivation system with energy/curiosity metrics
- Time optimization with impact indicators and dashboard

### 9. Code Refactoring
- Improved code structure and organization
- Enhanced maintainability and scalability
- Better component separation and reusability

### 10. Feedback-Based Plan Modification
- Implemented UI for plan changes via feedback
- Created mock data for personalized plans by category
- Added plan adjustment capabilities based on user input

### 11. Immutability Issue Resolution
**Tool:** Claude Sonnet 4

**Problem:** Error: Cannot assign to read only property 'workoutRoutine' of object
**Solution:** 
- Implemented deep copy handling for nested objects
- Used spread operator for immutable state updates
- Fixed all plan adjustment functions (Professional, Fitness, Hobbies, Nutrition, Insights)
- Added proper immutability protection throughout the feedback system

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

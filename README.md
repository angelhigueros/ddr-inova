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
- Feedback system for plan refinement

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Formik for form handling
- Yup for form validation

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd lifestyle-planner
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
│   ├── layout.tsx    # Main layout component
│   ├── page.tsx      # Home page with form
│   └── globals.css   # Global styles
├── components/
│   └── LifestylePlan.tsx  # Plan display component
└── types/
    └── lifestyle.ts   # TypeScript interfaces
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

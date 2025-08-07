# Smart Contact Manager Frontend

A modern React JavaScript application for managing contacts, built with Vite and Tailwind CSS.

## Features

- **Contact Management**: Add, view, edit, and delete contacts
- **Search Functionality**: Quickly find contacts by name, email, or phone
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean and intuitive interface using Tailwind CSS
- **Fast Development**: Built with Vite for lightning-fast development experience

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **JavaScript ES6+** - Modern JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **ESLint** - Code linting for consistent code quality

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── Layout.tsx      # Main layout wrapper
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── ContactsPage.tsx # Contact list view
│   └── AddContactPage.tsx # Add new contact form
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind

## Converting from HTML Thymeleaf

This project structure is designed to make it easy to convert HTML Thymeleaf pages to React components:

1. **Layout Components**: Use the `Layout` component to wrap your pages
2. **Page Components**: Create new page components in the `pages/` directory
3. **Styling**: Convert your existing CSS to Tailwind utility classes
4. **Forms**: Use controlled components with React state management
5. **Navigation**: Update navigation links to use the React router (when implemented)

## Development Guidelines

- Use functional components with React hooks
- Follow JavaScript ES6+ best practices
- Use Tailwind CSS for all styling
- Keep components modular and reusable
- Implement proper error handling and loading states
- Use PropTypes for prop validation when needed

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all components are properly typed
4. Test your changes
5. Submit a pull request
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

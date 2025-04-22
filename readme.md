# MENA - Hair Care Application

A mobile application built with React Native and Expo for personalized hair care routines and community interactions.

## Project Structure

```
├── app/                    # Main app screens using Expo Router
│   ├── (app)/              # Public app screens
│   │   ├── (protected)/    # Protected app screens (require authentication)
│   │   └── setup/          # Hair profile setup screens
│   └── _layout.tsx         # Root layout
├── assets/                 # Static assets like images, fonts
├── components/             # Reusable UI components
│   ├── ui/                 # UI components like Button, Input, Card, etc.
│   └── primitives/         # Low-level primitive components
├── config/                 # Configuration files
├── constants/              # Application constants
├── context/                # React context providers
├── lib/                    # Utility libraries
├── services/               # API services and data fetching
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Type System

The application uses TypeScript with strict typing to ensure type safety across the codebase. Key type definitions include:

- `auth.ts`: Authentication-related types
- `user.ts`: User profile and achievement types
- `profile.ts`: Hair profile specific types
- `ui.ts`: UI component props types
- `api.ts`: API response and data model types

## Key Features

- **Authentication**: Secure login and registration using Supabase
- **Hair Profile**: Personalized hair profile creation and management
- **Routine Management**: Custom hair care routines
- **Community**: Social features for hair care tips and community support
- **Product Recommendations**: Personalized product recommendations

## Component System

The app uses a component-based architecture with reusable UI components:

- **Button**: Customizable button with variants, sizes, and icons
- **Input**: Form input fields with validation
- **Typography**: Text components with consistent styling
- **Card**: Content containers for displaying information
- **Form**: Form handling components with validation

## Providers

- **SupabaseProvider**: Manages authentication state
- **SetupProvider**: Manages hair profile setup state

## API Services

API interactions are abstracted through service functions that handle data fetching, error management, and type safety.

## Getting Started

### Prerequisites

- Node.js (>=16.0.0)
- Yarn or npm
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mena.git
cd mena
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Start the development server
```bash
yarn start
# or
npm start
```

4. Run on device or emulator
```bash
# For iOS
yarn ios
# For Android
yarn android
```

## Code Standards

- **Strict Typing**: All files use strict typing with interfaces/types
- **Component Structure**: Components are small, focused, and reusable
- **Error Handling**: Consistent error handling across the application
- **Code Formatting**: Consistent code style with ESLint and Prettier

## License

This project is licensed under the MIT License - see the LICENSE file for details.

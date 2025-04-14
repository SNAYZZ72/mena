# MENA App Setup Process

This document provides an overview of the user setup process implementation for the MENA hair care application.

## Overview

The setup process is a critical part of the user onboarding experience in MENA. It occurs after user registration and before accessing the main app functionality. During this process, we collect essential information about the user's hair profile to provide personalized recommendations and experiences.

## User Flow

1. **Launch** → The app starts with a splash screen
2. **Onboarding** → First-time users see educational slides about the app
3. **Sign Up/Login** → Users create an account or sign in
4. **Setup** → New users complete the hair profile questionnaire
5. **Main App** → Users access the full app functionality

## Setup Process Steps

The setup process consists of the following steps:

1. **Welcome** (Introduction to setup)
2. **Gender** (User selects their gender)
3. **Hair Type** (User identifies their hair type)
4. **Hair Concerns** (User selects their main hair concerns)
5. **Hair Goals** (User selects their hair care goals)
6. **Routine Preferences** (User sets time and product preferences)
7. **Completion** (Summary of profile and confirmation)

## Technical Implementation

### Context Provider

The setup flow is managed by the `SetupProvider` context, which handles:

- Tracking current step and progress
- Storing and updating hair profile data
- Saving completed profile to Supabase
- Navigation between steps

### Reusable Components

The setup UI is built with reusable components:

- `SetupScreen`: A wrapper component providing consistent layout
- `ProgressBar`: Shows progress through the setup flow
- `OptionCard`, `RadioOption`, `CheckboxOption`, etc.: Various option selectors
- `ButtonOption`, `GridOption`: Specialized selection components

### Data Structure

The hair profile data is structured as follows:

```typescript
type HairProfile = {
  gender?: string;
  hairType?: string;
  hairLength?: string;
  hairDensity?: string;
  hairTexture?: string;
  scalpCondition?: string;
  hairConcerns?: string[];
  hairGoals?: string[];
  routinePreference?: string;
  productPreference?: string;
};
```

### Database Schema

The profile data is stored in the `hair_profiles` table in Supabase:

```sql
CREATE TABLE IF NOT EXISTS mena.hair_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gender TEXT,
  hair_type TEXT,
  hair_length TEXT,
  hair_density TEXT,
  hair_texture TEXT,
  scalp_condition TEXT,
  hair_concerns TEXT[],
  hair_goals TEXT[],
  routine_preference TEXT,
  product_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);
```

### Integration with Authentication Flow

The setup process is integrated with the authentication flow:

1. When a user completes registration, they're marked as a "new user"
2. New users are automatically redirected to the setup flow
3. After completing setup, users are redirected to the main app
4. When returning to the app, existing users bypass the setup flow

## Extending the Setup Process

The setup process is designed to be flexible and extensible:

1. Add new question screens to `app/(app)/setup/`
2. Update the `SetupProvider` to include new data fields
3. Update the Supabase database schema if needed
4. Add new screen to the navigation stack in `app/(app)/setup/_layout.tsx`

## Customization

The setup UI can be customized by:

1. Modifying the styles in `components/ui/setup-components.tsx`
2. Updating the color scheme (primary color is currently `#AA8AD2`)
3. Adding new question types and components as needed
4. Changing the inspirational messages on the screens

## Best Practices

- Keep questions concise and easy to understand
- Provide visual aids where possible to help users
- Limit the number of options to prevent choice overload
- Use appropriate input types (single-select, multi-select) for each question
- Allow users to skip non-essential questions
- Show progress to keep users motivated
- Provide a summary at the end to confirm their selections
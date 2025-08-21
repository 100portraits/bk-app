# Component Theme Migration Guide

## Color System Overview
- **Primary color system**: `zinc` (not gray)
- **Accent colors**: Variable based on user preference
- **Dark mode**: Supported via `dark:` prefix

## Migration Rules

### 1. Purple → Accent (PRIORITY)
All purple colors should be replaced with accent:
```
bg-purple-50 → bg-accent-50
bg-purple-100 → bg-accent-100
bg-purple-200 → bg-accent-200
bg-purple-300 → bg-accent-300
bg-purple-400 → bg-accent-400
bg-purple-500 → bg-accent-500
bg-purple-600 → bg-accent-600
bg-purple-700 → bg-accent-700
bg-purple-800 → bg-accent-800
bg-purple-900 → bg-accent-900
bg-purple-950 → bg-accent-950

text-purple-* → text-accent-*
border-purple-* → border-accent-*
hover:bg-purple-* → hover:bg-accent-*
hover:text-purple-* → hover:text-accent-*
focus:ring-purple-* → focus:ring-accent-*
ring-purple-* → ring-accent-*
divide-purple-* → divide-accent-*
```

### 2. Gray → Zinc (IMPORTANT)
Replace all gray with zinc:
```
gray-50 → zinc-50
gray-100 → zinc-100
gray-200 → zinc-200
gray-300 → zinc-300
gray-400 → zinc-400
gray-500 → zinc-500
gray-600 → zinc-600
gray-700 → zinc-700
gray-800 → zinc-800
gray-900 → zinc-900
gray-950 → zinc-950
```

### 3. Dark Mode Support
Add dark mode variants to all color classes:

#### Text Colors
```
text-zinc-900 → text-zinc-900 dark:text-white
text-zinc-800 → text-zinc-800 dark:text-zinc-200
text-zinc-700 → text-zinc-700 dark:text-zinc-300
text-zinc-600 → text-zinc-600 dark:text-zinc-400
text-zinc-500 → text-zinc-500 dark:text-zinc-400
text-zinc-400 → text-zinc-400 dark:text-zinc-500
text-white → text-white (no change needed)
```

#### Background Colors
```
bg-white → bg-white dark:bg-zinc-800
bg-zinc-50 → bg-zinc-50 dark:bg-zinc-900
bg-zinc-100 → bg-zinc-100 dark:bg-zinc-800
bg-zinc-200 → bg-zinc-200 dark:bg-zinc-700
```

#### Border Colors
```
border-zinc-200 → border-zinc-200 dark:border-zinc-700
border-zinc-300 → border-zinc-300 dark:border-zinc-600
border-zinc-400 → border-zinc-400 dark:border-zinc-600
border-zinc-500 → border-zinc-500 dark:border-zinc-500
```

#### Hover States
```
hover:bg-zinc-50 → hover:bg-zinc-50 dark:hover:bg-zinc-800
hover:bg-zinc-100 → hover:bg-zinc-100 dark:hover:bg-zinc-800
hover:bg-zinc-200 → hover:bg-zinc-200 dark:hover:bg-zinc-700
hover:text-zinc-* → hover:text-zinc-* dark:hover:text-zinc-*
```

#### Focus States
```
focus:ring-zinc-* → focus:ring-zinc-* dark:focus:ring-zinc-*
focus:border-zinc-* → focus:border-zinc-* dark:focus:border-zinc-*
```

#### Divide Colors
```
divide-zinc-200 → divide-zinc-200 dark:divide-zinc-700
```

### 4. Special Cases

#### Accent Colors with Dark Mode
```
bg-accent-50 → bg-accent-50 dark:bg-accent-950
bg-accent-100 → bg-accent-100 dark:bg-accent-900
text-accent-600 → text-accent-600 dark:text-accent-400
text-accent-700 → text-accent-700 dark:text-accent-300
```

#### Input/Form Elements
```
bg-white border-zinc-300 → bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600
placeholder-zinc-400 → placeholder-zinc-400 dark:placeholder-zinc-500
```

#### Shadows
```
shadow-sm → shadow-sm dark:shadow-zinc-700/20
shadow-md → shadow-md dark:shadow-zinc-700/30
```

## Component Migration Checklist

For each component:

1. **Replace all `gray` with `zinc`**
2. **Replace all `purple` with `accent`**
3. **Add dark mode variants to:**
   - Text colors
   - Background colors
   - Border colors
   - Hover states
   - Focus states
4. **Test special elements:**
   - Buttons (primary, secondary, ghost)
   - Cards (backgrounds, borders)
   - Inputs (backgrounds, borders, placeholders)
   - Navigation items
   - Badges/Pills
   - Modals/Dialogs

## Common Patterns

### Card Component
```jsx
// Before
className="bg-white border border-gray-200 text-gray-900"

// After
className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
```

### Button Component (Primary)
```jsx
// Before
className="bg-purple-500 hover:bg-purple-600 text-white"

// After
className="bg-accent-500 hover:bg-accent-600 text-white"
```

### Button Component (Secondary)
```jsx
// Before
className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"

// After
className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600"
```

### Input Component
```jsx
// Before
className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"

// After
className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
```

## Testing After Migration

1. Toggle between light and dark modes
2. Change accent colors and verify all accent elements update
3. Check hover/focus states in both modes
4. Verify text contrast is readable in both modes
5. Test form inputs and interactive elements
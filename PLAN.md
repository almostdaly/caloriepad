# CaloriePad - Food Intake Tracking App Plan

## 🎯 Project Overview

A minimalistic food intake tracking app that integrates with Apple Health data to provide a running total of calories consumed vs calories burned. The app focuses on simplicity and native iOS experience rather than precise calorie counting.

## ⚠️ CRITICAL DEVELOPMENT GUIDELINES

### Component Architecture Rules (MUST FOLLOW)

**🚨 RECURRING ISSUE**: Components grow too large and violate single responsibility principle.

**MANDATORY COMPONENT PATTERNS:**

```typescript
// ✅ CORRECT: Single responsibility, prop-driven components
interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
}: SearchInputProps) {
  // Does ONE thing: handles search input with clear functionality
}

// ✅ CORRECT: Compose complex functionality
function QuickAddFood() {
  return (
    <View>
      <SearchInput />
      <SuggestionsList />
      <CalorieControls />
      <TotalDisplay />
    </View>
  );
}

// ❌ WRONG: Monolithic component doing everything
function QuickAddFood() {
  // 500+ lines handling search, suggestions, controls, animation, etc.
}
```

**REQUIRED COMPONENT BREAKDOWN RULES:**

1. ✅ Component > 150 lines = immediate refactor required
2. ✅ One component = one responsibility (search, display, control, etc.)
3. ✅ Props-driven, no internal state when possible
4. ✅ Create component folders with index.ts exports
5. ✅ Use composition pattern for complex UIs
6. ✅ Extract reusable logic into custom hooks

### CODE ARCHITECTURE STANDARDS (NEW - MANDATORY)

**🚨 ENFORCED**: Single component per file, maximum 150 lines per component

**COMPONENT ORGANIZATION STRUCTURE:**

```
components/
├── common/              # Shared components (Button, Input, etc.)
├── food/               # Food feature components
├── today/              # Today screen components
├── settings/           # Settings screen components
└── [screen]/           # Other screen-specific components
```

**FILE NAMING STANDARDS:**

- One component per file, named exactly as the component
- Folder structure: `ComponentName/index.ts` + `ComponentName.tsx`
- Services split by domain: `foodService.ts`, `healthService.ts`, etc.
- Utilities extracted to: `utils/formatters.ts`, `utils/validators.ts`

**SIZE LIMITS (ENFORCED):**

- Components: 150 lines maximum
- Services: 200 lines maximum
- Props: 5 maximum (use config objects beyond this)
- useState hooks: 3 maximum per component

### Dark Mode Styling Rules (MUST FOLLOW)

**🚨 RECURRING ISSUE**: Components keep having dark mode styling problems.

**MANDATORY PATTERN FOR ALL COMPONENTS:**

```typescript
// ✅ CORRECT: Always do this pattern
const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];

// ✅ CORRECT: Use colors object throughout component
<ThemedView style={[styles.container, {
  backgroundColor: colors.cardBackground,
  borderColor: colors.cardBorder
}]}>
  <ThemedText style={{ color: colors.text }}>Content</ThemedText>
</ThemedView>

// ❌ WRONG: Never hardcode opacity or use inline Colors[colorScheme]
<ThemedText style={{ opacity: 0.7 }}>Text</ThemedText> // Use colors.textSecondary instead
<View style={{ backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }} /> // Use colors variable
```

**REQUIRED CHECKS BEFORE ANY COMPONENT IS COMPLETE:**

1. ✅ Extract `colors` variable at component start
2. ✅ All nested ThemedViews use `backgroundColor: 'transparent'`
3. ✅ All text colors explicitly set with `color: colors.text/textSecondary`
4. ✅ No hardcoded `opacity` values - use semantic color names
5. ✅ All cards have `borderColor: colors.cardBorder`
6. ✅ Test in BOTH light and dark modes before marking complete

**This pattern MUST be followed religiously to prevent dark mode issues from recurring.**

## 🛠 Technical Stack

- **Framework**: React Native with Expo SDK 50+
- **Platform**: iOS primary, Android secondary
- **Build**: Expo EAS Build
- **State Management**: React Context + useReducer
- **Storage**: AsyncStorage for local persistence
- **Health Integration**: `expo-health` or `react-native-health` for Apple HealthKit
- **Navigation**: Expo Router (file-based routing)
- **Styling**: Native styling with theme support
- **Icons**: Expo Vector Icons + SF Symbols for iOS

## 🏗 Architecture Overview

### Core Components

```
app/
├── (tabs)/
│   ├── index.tsx          # Today's tracking (main screen)
│   ├── favorites.tsx      # Quick-add favorites
│   ├── history.tsx        # Past entries
│   └── settings.tsx       # App settings
├── food/
│   ├── add.tsx           # Add new food item
│   ├── search.tsx        # Search food database
│   └── details.tsx       # Food item details
└── _layout.tsx
```

### Data Models

```typescript
interface FoodItem {
  id: string;
  name: string;
  caloriesPerServing: number;
  servingSize: string;
  category: "food" | "drink" | "snack";
  isFavorite: boolean;
  createdAt: Date;
}

interface FoodEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  totalCalories: number;
  timestamp: Date;
  notes?: string;
}

interface DayData {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number; // from Apple Health
  netCalories: number;
}
```

## 🎨 UI/UX Design Principles

### Design Language

- **Minimalistic**: Clean, uncluttered interface
- **Native iOS**: Use iOS design patterns and SF Symbols
- **One-handed use**: Primary actions easily accessible
- **Quick entry**: Minimize taps to add items

### Color Scheme

- **Light Mode**: iOS system colors with custom accent
- **Dark Mode**: True black backgrounds with subtle grays
- **Accent Color**: Health green (#30D158) for positive actions

### Key Screens Layout

1. **Today Screen**: Running total, recent entries, quick-add favoritesm stats oriented, numeric and cool visualizations
2. **Add Food Screen**: Search/browse with calorie estimates, simple & minimalistic
3. **Favorites Screen**: One-tap add for common items
4. **History Screen**: Past days with trends

## 📊 Current Progress Status

**Overall Progress: 85% Complete**

✅ **COMPLETED**: Phase 1 (Core Foundation) + Phase 2 (Food Database & Entry) + Phase 3 (Today Screen & Tracking) + Phase 4 (Developer Tools) + Phase 3.5 (Architecture Refactoring) + **Phase 5 (User Onboarding)**  
⏳ **PENDING**: Phase 6 (Apple Health Integration) + Phase 7 (History & Polish)

**📱 Note**: HealthKit functionality requires a physical iOS device - it's not available in the iOS Simulator. This is normal Apple behavior.

**Key Achievements:**

- Beautiful, functional main tracking interface
- Complete theme system and navigation
- All data models and storage infrastructure
- Real-time calorie calculations and progress tracking
- Professional iOS-style design with health-focused colors
- **NEW**: Clean, decoupled component architecture
- **NEW**: Removed unused Expo boilerplate components
- **NEW**: UI design approved for both light and dark modes
- **NEW**: Complete food database with 20+ common foods
- **NEW**: Full food search and category filtering
- **NEW**: Working "Add Food" functionality with confirmation dialogs
- **NEW**: Food entries now display in real-time on Today screen
- **NEW**: Developer tools for testing and debugging
- **NEW**: Proper onboarding flow with real Apple Health permission requests
- **NEW**: Modern @kingstinct/react-native-healthkit integration

## 🚀 Implementation Phases

### Phase 1: Core Foundation (Week 1) ✅ COMPLETED

- [x] Set up Expo project with EAS
- [x] Implement basic navigation structure (5-tab layout)
- [x] Create theme system with light/dark mode
- [x] Set up AsyncStorage data layer
- [x] Basic food entry models
- [x] **BONUS**: React Context state management implemented
- [x] **BONUS**: All tab screens scaffolded

### Phase 2: Food Database & Entry (Week 2) ✅ COMPLETED

- [x] Create simple food database (JSON file with common foods)
- [x] Implement add food functionality
- [x] Build search and browse interface
- [x] Add quantity/serving size selection
- [x] Implement favorites system (display only - add/remove functionality pending)
- [x] **BONUS**: Category filtering and search functionality
- [x] **BONUS**: Professional food selection UI with icons

### Phase 3: Today Screen & Tracking (Week 3) ✅ COMPLETED

- [x] Build main tracking interface
- [x] Real-time calorie counter
- [x] Quick-add favorites section
- [x] Recent entries list
- [x] Daily summary view
- [x] **BONUS**: Beautiful progress bar and health-focused UI
- [x] **BONUS**: Net calorie calculation display
- [x] **BONUS**: Goal tracking with visual indicators

### Phase 4: Developer Tools (Week 4A) ✅ COMPLETED

- [x] Set up HealthKit permissions (integrated with onboarding)
- [x] Add hidden developer settings screen
- [x] Accessible from settings page via pressable (development mode only)
- [x] Create new "Developer Mode" screen with the following features:
  - [x] Reset today's log functionality
  - [x] Reset custom food data functionality
  - [x] Reset all data (factory reset) functionality - needs to re ask for permissions from health
- [x] Ensure developer features are never shown in release builds
- [x] Add proper confirmation dialogs for destructive actions

### Phase 3.5: Architecture Refactoring ✅ COMPLETED

- [x] Refactor all components to single responsibility principle
- [x] Enforce 150-200 line component size limits
- [x] Organize components by feature area (food/, today/, common/)
- [x] Extract business logic to services and utilities
- [x] Implement proper composition patterns
- [x] Colocate styles within component files
- [x] Break down large components (QuickAddFood, FoodSearchList, etc.)
- [x] Ensure one component per file with clean exports

### Phase 5: User Onboarding (Week 4B) ✅ COMPLETED

- [x] Create first-time user onboarding flow
- [x] Request Apple Health permissions for the following data types:
  - [x] `HKQuantityTypeIdentifierBasalEnergyBurned`
  - [x] `HKQuantityTypeIdentifierActiveEnergyBurned`
  - [x] `HKQuantityTypeIdentifierHeight`
  - [x] `HKQuantityTypeIdentifierBodyMass`
  - [x] `HKCharacteristicTypeIdentifierBiologicalSex`
  - [x] `HKCharacteristicTypeIdentifierDateOfBirth`
- [x] Update data storage model to include `hasOnboarded` boolean
- [x] Design clean, welcoming onboarding screens
- [x] Show onboarding only on first app launch
- [x] Handle permission grant/deny gracefully

### Phase 6: Apple Health Integration (Week 5) ⏳ PENDING

- [ ] Fetch active energy burned data
- [x] Calculate net calories (consumed - burned) - _UI ready, needs data source_
- [x] Display health data in UI - _UI implemented_
- [ ] Handle permission states gracefully
- [ ] Implement user profile data from health characteristics

### Phase 7: History & Polish (Week 6) ⏳ PENDING

- [ ] Build history/trends screen - _Placeholder created_
- [ ] Add edit/delete functionality
- [ ] Implement data export
- [ ] Performance optimization
- [ ] App icon and splash screen

## 🍎 Apple Health Integration Strategy

### Required Permissions

**Energy & Activity Data:**

- `HKQuantityTypeIdentifierActiveEnergyBurned`
- `HKQuantityTypeIdentifierBasalEnergyBurned`

**Physical Characteristics:**

- `HKQuantityTypeIdentifierHeight`
- `HKQuantityTypeIdentifierBodyMass`
- `HKCharacteristicTypeIdentifierBiologicalSex`
- `HKCharacteristicTypeIdentifierDateOfBirth`

### Data Synchronization

- Fetch daily active energy on app launch
- Update every hour when app is active
- Cache health data locally to reduce API calls
- Graceful fallback when health data unavailable

### Privacy Considerations

- Clear permission requests with explanations
- Local data storage only
- Option to use app without health integration

## 💾 Local Storage Strategy

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  FOOD_DATABASE: "@caloriepad/food_database",
  DAILY_ENTRIES: "@caloriepad/entries_", // + date
  FAVORITES: "@caloriepad/favorites",
  USER_SETTINGS: "@caloriepad/settings",
  HEALTH_CACHE: "@caloriepad/health_cache",
  ONBOARDING_STATUS: "@caloriepad/onboarding_status",
};
```

### Data Persistence

- Daily entries stored separately by date
- Favorites list updated immediately
- Health data cached with timestamps
- Settings persisted on change

## 📱 Key Features Breakdown

### Quick Add System

- Floating action button on main screen
- Swipe gestures for common actions
- Voice search integration (future)
- Barcode scanning (future enhancement)

### Calorie Reference Database

- ~200 common foods with estimates
- Categories: meals, snacks, drinks
- Serving size variations
- User can add custom items
- Is there an open source/public API we can use for this data?

### Smart Suggestions

- Learn from user patterns
- Suggest foods based on time of day
- Promote healthy choices subtly

## 🔧 Development Considerations

### Performance

- Lazy load food database
- Optimize list rendering with VirtualizedList
- Minimize health data API calls
- Efficient AsyncStorage operations

### Error Handling

- Graceful health permission failures
- Offline functionality
- Data corruption recovery
- User-friendly error messages

## 📋 Success Metrics

- < 3 taps to add a food item
- < 2 seconds app launch time
- 95% uptime for health data sync
- Intuitive first-use experience

## 🚧 Future Enhancements (Post-MVP)

- Apple Watch companion app
- Meal planning suggestions
- Photo food logging
- Integration with other health apps
- Export to Apple Health (nutrition data)

---

## Next Steps

1. Review and refine this plan
2. Set up development environment
3. Create basic project structure
4. Begin Phase 1 implementation

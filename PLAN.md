# CaloriePad - Food Intake Tracking App Plan

## 🎯 Project Overview

A minimalistic food intake tracking app that integrates with Apple Health data to provide a running total of calories consumed vs calories burned. The app focuses on simplicity and native iOS experience rather than precise calorie counting.

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

**Overall Progress: ~65% Complete**

✅ **COMPLETED**: Phase 1 (Core Foundation) + Phase 3 (Today Screen)  
🚧 **IN PROGRESS**: Phase 2 (Food Database & Entry)  
⏳ **PENDING**: Phase 4 (Apple Health) + Phase 5 (Polish)

**Key Achievements:**

- Beautiful, functional main tracking interface
- Complete theme system and navigation
- All data models and storage infrastructure
- Real-time calorie calculations and progress tracking
- Professional iOS-style design with health-focused colors

**Next Priority:**

- Complete Phase 2 (Food Database & Entry functionality)
- Refactor the UI screens and split into pure, prop driven and clean components
- Delete any unused components that ship with expo create (parallax and all that)
- PAUSE and ask for screenshots of the UI and feedback from the user to check if designs are correct before continuing

---

## 🚀 Implementation Phases

### Phase 1: Core Foundation (Week 1) ✅ COMPLETED

- [x] Set up Expo project with EAS
- [x] Implement basic navigation structure (5-tab layout)
- [x] Create theme system with light/dark mode
- [x] Set up AsyncStorage data layer
- [x] Basic food entry models
- [x] **BONUS**: React Context state management implemented
- [x] **BONUS**: All tab screens scaffolded

### Phase 2: Food Database & Entry (Week 2) 🚧 IN PROGRESS

- [ ] Create simple food database (JSON file with common foods)
- [ ] Implement add food functionality
- [ ] Build search and browse interface
- [ ] Add quantity/serving size selection
- [x] Implement favorites system (display only - add/remove functionality pending)

### Phase 3: Today Screen & Tracking (Week 3) ✅ COMPLETED

- [x] Build main tracking interface
- [x] Real-time calorie counter
- [x] Quick-add favorites section
- [x] Recent entries list
- [x] Daily summary view
- [x] **BONUS**: Beautiful progress bar and health-focused UI
- [x] **BONUS**: Net calorie calculation display
- [x] **BONUS**: Goal tracking with visual indicators

### Phase 4: Apple Health Integration (Week 4) ⏳ PENDING

- [ ] Set up HealthKit permissions
- [ ] Fetch active energy burned data
- [x] Calculate net calories (consumed - burned) - _UI ready, needs data source_
- [x] Display health data in UI - _UI implemented_
- [ ] Handle permission states gracefully

### Phase 5: History & Polish (Week 5) ⏳ PENDING

- [ ] Build history/trends screen - _Placeholder created_
- [ ] Add edit/delete functionality
- [ ] Implement data export
- [ ] Performance optimization
- [ ] App icon and splash screen

## 🍎 Apple Health Integration Strategy

### Required Permissions

- `HKQuantityTypeIdentifierActiveEnergyBurned`
- `HKQuantityTypeIdentifierBasalEnergyBurned` (optional)

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

# Gymaxxing — Full Product & Engineering Plan

## 0. Project Identity

**Working name:** Gymaxxing  
**Product type:** Expo (React Native) training log for iOS and Android  
**Core idea:** A free, MIT-licensed, local-first app that makes workout logging fast, then turns history into progression. Optional cloud sync. Visual rules live in `DESIGN.md`. Distribution is GitHub only: https://github.com/n4bi10p/gymaxxing

### Product thesis

Do not build another generic "fitness tracker."

Build a **Personal Training OS**:

> PLAN → TRAIN → LOG → ANALYZE → ADAPT → PROGRESS

The app should feel like a serious tool for people who lift, not a calorie-counting app with a workout tab.

### Primary design principle

During a workout, the user is tired, sweaty, distracted, and has very little patience.

Therefore:

- Logging must require minimal taps.
- Previous performance must always be visible.
- Rest timers must be automatic.
- Important information must be glanceable.
- Advanced analytics can be detailed outside the active workout.
- Never sacrifice usability for visual effects.

---

# 1. Target User

## Primary user

A young gym-goer who wants to:

- Build muscle / get lean and strong.
- Follow structured workouts.
- Track every working set.
- Progress weights and reps.
- Understand whether training is improving.
- Track bodyweight and measurements.
- Eventually connect sleep, recovery, nutrition, and Apple Health.
- Have a smart coach that uses their actual training history.

## Secondary users

- Strength trainees
- Hypertrophy-focused lifters
- Beginners learning progressive overload
- Intermediate lifters
- People following PPL / Upper-Lower / Full Body / custom programs

## Product personality

The product should feel:

- Technical
- Minimal
- Premium
- Dark
- Data-driven
- Slightly cyberpunk / terminal-inspired
- Modern native Apple
- Serious rather than gimmicky

Avoid:

- Excessive neon
- Cluttered dashboards
- Fake "AI magic"
- Gamification that feels childish
- Overly aggressive bodybuilding language
- Huge gradients everywhere
- UI that makes logging slower

---

# 2. Product Positioning

## Positioning statement

> Gym OS is a native iOS training system that lets you log workouts in seconds, understand your progression, and eventually adapt your training based on performance and recovery.

## Differentiation

Existing fitness apps commonly specialize in one or more of:

- Fast workout logging
- Social fitness
- Automated workout generation
- Nutrition tracking
- General health tracking

Gym OS should combine:

1. Excellent workout logging
2. Progressive-overload intelligence
3. Training analytics
4. Apple ecosystem integration
5. Recovery context
6. AI coaching
7. Privacy-first architecture

The **logger must be excellent before AI is added**.

---

# 3. Product Principles

## Principle 1 — Workout first

The active workout experience is the most important screen in the entire app.

## Principle 2 — Minimum interaction

A user should be able to log a normal set with approximately:

1. Enter weight
2. Enter reps
3. Tap complete

Everything else should be remembered or automatically inferred when possible.

## Principle 3 — Previous performance is context

Every exercise should show previous relevant performance.

Example:

```text
BENCH PRESS

LAST SESSION
60 kg × 8
60 kg × 8
60 kg × 7

TODAY
60 kg × 8
60 kg × 8
60 kg × __
```

## Principle 4 — Local-first

Workout data should remain usable without an internet connection.

Cloud sync is a synchronization layer, not a requirement for basic functionality.

## Principle 5 — Deterministic before AI

Use normal algorithms for:

- PR detection
- Estimated 1RM
- Volume
- Progressive overload recommendations
- Training frequency
- Volume trends
- Exercise history

Use AI for:

- Natural-language explanations
- Coaching conversations
- Flexible workout modifications
- Summarization
- Food estimation
- Personalized insights where deterministic logic is insufficient

## Principle 6 — Never fake precision

Nutrition estimates, recovery scores, calorie burn, and AI recommendations must be clearly presented as estimates when they are estimates.

---

# 4. Core User Journey

## First launch

```text
Launch
  ↓
Welcome
  ↓
Choose goals
  ↓
Choose experience level
  ↓
Choose training days
  ↓
Choose training style
  ↓
Optional body metrics
  ↓
Optional Apple Health permission
  ↓
Create first routine
  ↓
Home
```

### Goal options

- Build muscle
- Get stronger
- Lose fat
- General fitness
- Improve consistency
- Custom

### Experience

- Beginner
- Intermediate
- Advanced

### Training days

1–7 days per week.

### Training styles

- Push / Pull / Legs
- Upper / Lower
- Full Body
- Bro Split
- Strength
- Hypertrophy
- Custom

---

# 5. Main App Navigation

Use a native tab-based architecture.

Recommended tabs:

```text
HOME
WORKOUT
PROGRESS
NUTRITION
PROFILE
```

Alternative if WORKOUT is a central action:

```text
HOME | PROGRESS | + WORKOUT | NUTRITION | PROFILE
```

The active workout should take over the UI rather than remain buried inside navigation.

---

# 6. HOME

Home is the user's daily command center.

## Sections

### Today's training

```text
TODAY

PUSH

5 exercises
~52 min

[ START WORKOUT ]
```

### Current streak

```text
CURRENT STREAK
12 workouts
```

### Quick stats

- Weekly workouts
- Weekly volume
- Current bodyweight
- Protein target
- Recent PR

### Recovery

If recovery data exists:

```text
RECOVERY

82 / 100

Sleep       8h 12m
HRV         +6%
RHR         normal
```

If data does not exist:

Do not invent a score.

Show:

> Recovery data unavailable. Connect Apple Health to add sleep and heart-rate context.

### Recent achievement

```text
NEW PR

Bench Press
65 kg × 8
+2 reps
```

---

# 7. WORKOUT SYSTEM

This is the core feature.

## Workout lifecycle

```text
NOT STARTED
    ↓
ACTIVE
    ↓
PAUSED
    ↓
COMPLETED
```

## Starting a workout

Options:

- Start today's planned workout
- Start from routine
- Start empty workout
- Repeat previous workout

## Active workout header

Display:

- Workout name
- Elapsed duration
- Exercise count / current exercise
- Finish button

Example:

```text
PUSH A
01:24:18

Exercise 2 of 6
```

---

# 8. EXERCISE LOGGING

Every exercise contains sets.

## Set model

Each set should support:

- Weight
- Reps
- Duration
- Distance where relevant
- RPE
- RIR
- Rest
- Set type
- Notes
- Completion state

## Set types

- Warm-up
- Working
- Drop set
- Failure
- AMRAP
- Back-off
- Top set
- Myo-rep

## Default hypertrophy workflow

Keep the UI simple.

```text
60 kg    8 reps    ✓
60 kg    8 reps    ✓
60 kg    7 reps    ✓
```

## Set completion

On completion:

1. Save set
2. Calculate current exercise state
3. Detect possible PR
4. Start rest timer
5. Prepare next set
6. Show next target

---

# 9. PREVIOUS PERFORMANCE

This is mandatory.

When opening an exercise, show:

```text
LAST SESSION

60 × 8
60 × 8
60 × 7

BEST

65 × 8

TODAY TARGET

60 × 8+
```

Previous performance should be pulled from the user's actual history.

Do not use fabricated examples in production.

---

# 10. REST TIMER

The timer should be deeply integrated into set completion.

## Behavior

When a set is completed:

```text
REST
01:32
```

The user can:

- Pause
- Skip
- Add 15 sec
- Subtract 15 sec
- Set custom rest

## Presets

- 30 sec
- 45 sec
- 60 sec
- 90 sec
- 120 sec
- 180 sec
- Custom

## Default rest by exercise type

Configurable.

Example defaults:

- Heavy compound: 150 sec
- Moderate compound: 120 sec
- Isolation: 60–90 sec

Do not present defaults as universal scientific truth.

---

# 11. WORKOUT COMPLETION

After finishing:

```text
WORKOUT COMPLETE

PUSH A

Duration       58m
Exercises      6
Sets           18
Volume         7,240 kg
PRs            2

[ VIEW SUMMARY ]
```

## Summary sections

- Duration
- Volume
- Sets
- Reps
- PRs
- Exercise performance
- Muscle group volume
- Notes
- Calories if available from Apple Health

---

# 12. ROUTINES / PROGRAMS

Users need reusable templates.

## Routine model

```text
Routine
 ├── Day
 │    ├── Exercise
 │    │    ├── Target sets
 │    │    ├── Rep range
 │    │    ├── Target weight
 │    │    ├── Rest
 │    │    └── Notes
```

Example:

```text
PUSH A

Bench Press
3 × 6–8

Incline DB Press
3 × 8–10

Shoulder Press
3 × 8–10

Lateral Raise
3 × 12–15

Tricep Pushdown
3 × 10–15
```

## Routine features

- Create
- Edit
- Duplicate
- Reorder
- Archive
- Delete
- Rename
- Add notes
- Add exercise
- Remove exercise
- Reorder exercises

---

# 13. PROGRAM SYSTEM

A program is a collection of routines over a schedule.

Example:

```text
PPL

Monday    Push
Tuesday   Pull
Wednesday Legs
Thursday  Rest
Friday    Push
Saturday  Pull
Sunday    Legs
```

Support:

- Weekly schedules
- Rest days
- Custom schedules
- Program start date
- Program duration
- Program completion

Do not force a fixed schedule on users.

---

# 14. EXERCISE DATABASE

The app needs a robust exercise database.

## Exercise fields

- ID
- Name
- Aliases
- Primary muscle
- Secondary muscles
- Equipment
- Movement pattern
- Exercise type
- Instructions
- Difficulty
- Unilateral flag
- Default rest
- Default rep range
- Video URL if later supported
- Image URL if later supported

## Muscle groups

- Chest
- Back
- Lats
- Traps
- Shoulders
- Biceps
- Triceps
- Forearms
- Abs
- Obliques
- Glutes
- Quads
- Hamstrings
- Calves
- Adductors

## Equipment

- Barbell
- Dumbbell
- Cable
- Machine
- Smith machine
- Kettlebell
- Bodyweight
- Resistance band
- Other

## Search

Search must support:

- Exercise name
- Alias
- Muscle
- Equipment

Example:

Typing `lat` should surface:

- Lat Pulldown
- Lat Prayer
- Straight Arm Pulldown

---

# 15. PROGRESSIVE OVERLOAD ENGINE

Build this as a deterministic domain service.

## Inputs

- Previous sets
- Current sets
- Rep targets
- Weight
- RPE
- RIR
- Exercise history
- Recent trend

## Basic recommendation rules

Example:

```text
IF user reaches top of rep range
AND RPE is acceptable
THEN consider increasing load.

IF user misses minimum reps
THEN maintain or reduce load.

IF performance improves consistently
THEN increase target.

IF performance declines repeatedly
THEN flag possible fatigue / recovery issue.
```

These are training heuristics, not medical rules.

## Recommendation output

```text
NEXT TARGET

62.5 kg × 6–8

Reason:
You completed 60 kg × 8
for all working sets at RPE 7–8.
```

Keep explanations understandable.

---

# 16. STRENGTH CALCULATIONS

Support estimated 1RM.

Default formula:

```text
Epley:

1RM = weight × (1 + reps / 30)
```

Potentially support multiple formulas internally.

Do not pretend estimated 1RM is a measured 1RM.

## Track

- Best weight
- Best reps
- Best estimated 1RM
- Best volume
- Best set
- Rep PR
- Weight PR
- Volume PR

---

# 17. PR ENGINE

PR types:

```text
WEIGHT PR
REP PR
VOLUME PR
ESTIMATED 1RM PR
EXERCISE PR
```

Example:

```text
NEW PR

BENCH PRESS

65 kg × 8

Previous:
65 kg × 6

+2 reps
```

PR detection must compare against historical records.

---

# 18. TRAINING VOLUME

Calculate:

```text
volume = weight × reps
```

For multiple sets:

```text
total volume = Σ(weight × reps)
```

Track:

- Per exercise
- Per workout
- Per muscle
- Per week
- Per month
- Per program

## Important

For bodyweight movements, volume requires a defined strategy.

Possible MVP approach:

- Do not calculate tonnage for pure bodyweight movements.
- Track reps instead.

---

# 19. TRAINING ANALYTICS

Create a Progress dashboard.

## Charts

### Strength

- Estimated 1RM over time
- Best set over time

### Volume

- Weekly volume
- Monthly volume
- Muscle-group volume

### Consistency

- Workouts per week
- Workout streak
- Days trained
- Missed planned sessions

### Body

- Weight trend
- Measurements
- Progress photos

---

# 20. TRAINING INTELLIGENCE

A dedicated page for useful insights.

Example:

```text
TRAINING INTELLIGENCE

Your bench volume increased 12%
over the last 4 weeks.

Your average RPE stayed stable.

Your lower-body training frequency
has dropped from 2.0 to 1.0 sessions/week.

Your pull volume is higher than
your push volume over the last month.
```

Avoid fake precision.

Insights must be generated only when enough data exists.

---

# 21. MUSCLE VOLUME

Aggregate exercises to muscle groups.

Example:

```text
CHEST
14 working sets

BACK
16 working sets

QUADS
12 working sets

HAMSTRINGS
8 working sets
```

Do not overstate that set counts represent exact physiological stimulus.

Use wording such as:

> Logged working sets

rather than:

> Exact muscle stimulus.

---

# 22. BODY TRACKING

Track:

- Bodyweight
- Chest
- Waist
- Arms
- Forearms
- Shoulders
- Thighs
- Calves
- Neck
- Optional body-fat estimate

## Weight graph

Use:

- Daily points
- Weekly average
- Trend line

Avoid reacting strongly to a single day's weight.

## Progress photos

Support:

- Front
- Side
- Back
- Custom

Photos should be private and local-first.

---

# 23. NUTRITION

Nutrition should be a secondary module, not the core MVP.

## Daily dashboard

```text
CALORIES
2,480 / 2,700

PROTEIN
132 / 140g

CARBS
290 / 320g

FAT
72 / 80g
```

## Meals

- Breakfast
- Lunch
- Dinner
- Snack
- Custom

## Food entries

- Name
- Quantity
- Unit
- Calories
- Protein
- Carbs
- Fat
- Fiber
- Source
- Confidence

---

# 24. AI FOOD ESTIMATION

Later feature.

User can enter:

> 3 eggs + 4 pav + banana

AI returns an estimate.

The app must show:

```text
ESTIMATED

Calories ~650
Protein ~28g

Confidence: Medium
```

Never present AI nutrition estimates as laboratory measurements.

---

# 25. APPLE HEALTH / HEALTHKIT

HealthKit integration should be a major iOS feature.

Potential read data:

- Steps
- Active energy
- Resting heart rate
- Heart rate
- HRV
- Sleep
- Body weight
- Height
- Walking/running distance
- Other relevant authorized metrics

Potential write data:

- Completed workouts
- Weight if appropriate

## Permissions

Ask only when needed.

Do not request every permission on first launch.

Explain why a permission is useful before requesting it.

Example:

> Connect Apple Health to bring sleep and heart-rate context into your training insights.

---

# 26. RECOVERY

Recovery is a context system, not a medical diagnostic system.

Potential signals:

- Sleep duration
- HRV trend
- Resting heart rate trend
- Recent training load
- Workout frequency
- Subjective fatigue
- User-reported soreness

## Recovery score

If implemented, document:

- Inputs
- Weighting
- Normalization
- Missing-data behavior

Never produce a score from missing data.

Example:

```text
RECOVERY

82 / 100

Based on:
Sleep
HRV trend
RHR trend
Recent training load
```

If HRV/sleep unavailable:

```text
RECOVERY CONTEXT

Limited data

Connect Apple Health to improve recovery insights.
```

---

# 27. SUBJECTIVE CHECK-IN

Allow users to report:

- Energy
- Soreness
- Stress
- Motivation
- Sleep quality

Use simple sliders.

Example:

```text
ENERGY
1 ─────●──── 5

SORENESS
1 ──●──────── 5
```

This data can inform training suggestions.

---

# 28. AI COACH

The AI coach should sit above the deterministic training engine.

## User examples

> I only have 40 minutes today.

> My bench has stalled.

> Can you replace barbell squats?

> I missed leg day. What should I do?

> Why did my volume drop this month?

> Give me a summary of my last 4 weeks.

## AI should have access to structured context

```text
User Profile
Training Goal
Program
Workout History
Exercise History
Progression Data
Recovery Context
Nutrition Context
Preferences
```

Do not send unnecessary private data.

---

# 29. AI COACH SAFETY

The coach must not:

- Diagnose injuries
- Diagnose diseases
- Claim certainty about pain
- Give dangerous medical instructions
- Encourage extreme dieting
- Encourage dehydration
- Encourage performance-enhancing drug use
- Treat estimated nutrition as exact
- Pretend to be a physician

For pain/injury language:

- Recommend stopping painful movement
- Suggest a pain-free alternative where appropriate
- Recommend professional medical evaluation for persistent/severe symptoms

---

# 30. AI WORKOUT ADAPTATION

Example:

```text
USER:
I only have 45 minutes.

ENGINE:
Original estimated time = 67 min

AI:
Remove low-priority accessories.
Keep primary compounds.
Reduce rest where reasonable.

OUTPUT:
42–45 minute workout.
```

The AI should modify a structured workout object rather than returning free-form text only.

---

# 31. SMART EXERCISE SUBSTITUTIONS

Every exercise should optionally have substitution relationships.

Example:

```text
Barbell Bench Press
    ↓
Dumbbell Bench Press
    ↓
Machine Chest Press
```

Substitution filters:

- Equipment
- Muscle group
- Movement pattern
- Difficulty
- User preference

AI can select from these deterministic candidates.

---

# 32. APPLE WATCH

Post-MVP.

Features:

- Start workout
- Current exercise
- Current set
- Log reps
- Log weight
- Rest timer
- Heart rate
- Workout duration
- Complete set
- Finish workout

The Watch app should not replicate the entire phone app.

It should focus on **glanceable training controls**.

---

# 33. LIVE ACTIVITIES / DYNAMIC ISLAND

Use ActivityKit for active rest timers.

Example:

```text
REST
01:24

Next:
Bench Press
60 × 8
```

The user should be able to see timer state from the lock screen / Dynamic Island.

---

# 34. WIDGETS

Widget ideas:

### Today's Workout

```text
PUSH A
6 exercises
START
```

### Progress

```text
BENCH
72.5 kg
+5.4%
```

### Streak

```text
12
WORKOUT STREAK
```

### Bodyweight

```text
55.0 kg
7-day trend
```

---

# 35. GAMIFICATION

Keep it subtle.

## XP

XP can be based on:

- Workout completion
- Consistency
- PRs
- Program completion

Avoid rewarding dangerous behavior such as excessive volume or excessive training frequency.

## Achievements

Examples:

- First workout
- 10 workouts
- 50 workouts
- First PR
- 100k logged kg
- First 100 kg squat
- 30-day consistency

Do not create achievements that encourage unsafe training.

---

# 36. SOCIAL — FUTURE

Do not build in MVP.

Possible future features:

- Friends
- Workout sharing
- PR sharing
- Programs
- Challenges
- Leaderboards

Privacy should be opt-in.

Never expose health data by default.

---

# 37. PRIVACY

Core philosophy:

> Your body. Your data.

## Local-first

Workout logging should work offline.

## Sync

Use Apple's ecosystem where practical.

Potential:

- CloudKit
- Private database
- iCloud sync

## Sensitive information

Treat these as private:

- Body measurements
- Weight
- Nutrition
- Sleep
- HRV
- Health data
- Progress photos
- Training notes

Never make sensitive information public by default.

---

# 38. TECH STACK

Gymaxxing is one Expo (React Native, New Architecture) + TypeScript codebase for iOS and Android. SDK 57 at the time of the scaffold. Dev client only, not Expo Go.

- App: Expo Router, Reanimated, Gesture Handler, FlashList is optional later, `expo-haptics`, Lucide, plain StyleSheet plus tokens from `@gymaxxing/theme`.
- Glass: `expo-glass-effect` on iOS 26. Android uses `@gymaxxing/native` (AGSL rim) behind `GlassSurface`, with an opaque fallback.
- Navigation: iOS native tabs (`expo-router/unstable-native-tabs` on SDK 57) plus a bottom accessory. Android uses a floating glass dock.
- Data: PowerSync with `@op-engineering/op-sqlite` and the Drizzle schema in `@gymaxxing/schemas`. The app calls `init()` and does not call `connect()` until the user turns on Cloud sync.
- Engine: `@gymaxxing/engine`, pure TypeScript, Vitest. Volume, Epley 1RM, PR detection, progression, units.
- Health: a `HealthProvider` interface. HealthKit and Health Connect stay off until a free Apple ID can sign them.
- AI: bring your own key in secure storage. The key is never synced. The engine stays authoritative.

## Distribution

No App Store, Play Store, TestFlight, or EAS.

- Android: a signed APK from GitHub Actions (`android-release.yml`), installed locally with `expo run:android` during development.
- iOS: an unsigned IPA from a `macos-26` runner (`ios-unsigned.yml`), sideloaded with SideStore nightly on iOS 26.6.2. JavaScript reloads over LAN Metro after the dev client is installed.

## Minimum OS

Design targets are iOS 26.6.2 (iPhone 14) and Android 15. Older versions fall back to opaque glass.

---

# 39. DOMAIN MODULES

```text
apps/mobile          Expo Router screens, GlassSurface, repositories
packages/engine      training math
packages/theme       scheme x accent
packages/schemas     Zod, Drizzle tables, sync status copy
packages/exercise-db original exercise catalog
modules/gymaxxing-native
                     Android accent + Liquid Glass view
infra                Supabase migration, PowerSync sync rules, compose file
```

Screens talk to repositories. Repositories talk to PowerSync. The engine never imports React.

# 40. DATA MODEL

## UserProfile

Fields:

- id
- name
- age
- height
- goal
- experience
- trainingDays
- preferredUnitSystem
- createdAt
- updatedAt

Do not require demographic information that does not improve the product.

## Exercise

- id
- name
- aliases
- primaryMuscle
- secondaryMuscles
- equipment
- movementPattern
- isUnilateral
- instructions
- defaultRepMin
- defaultRepMax
- defaultRest

## Workout

- id
- name
- routineId
- startedAt
- completedAt
- duration
- notes
- status

## ExerciseSession

- id
- workoutId
- exerciseId
- order
- notes

## Set

- id
- exerciseSessionId
- order
- type
- weight
- reps
- duration
- distance
- rpe
- rir
- restDuration
- completedAt

## Routine

- id
- name
- description
- createdAt
- updatedAt

## RoutineExercise

- id
- routineId
- exerciseId
- order
- targetSets
- targetRepMin
- targetRepMax
- targetWeight
- targetRPE
- restSeconds
- notes

## BodyMeasurement

- id
- date
- type
- value
- unit

## NutritionEntry

- id
- date
- meal
- foodName
- quantity
- calories
- protein
- carbs
- fat
- fiber
- confidence

## RecoveryEntry

- id
- date
- sleep
- energy
- soreness
- stress
- motivation
- hrv
- restingHeartRate

---

# 41. UNIT SYSTEM

Support:

- Metric
- Imperial

Metric defaults:

- kg
- cm

Imperial:

- lb
- ft/in

All calculations should use normalized internal units.

Display conversion should happen at the presentation layer.

---

# 42. DESIGN SYSTEM

## Visual direction

Dark-first.

Base palette should be mostly:

- Near-black background
- Dark surfaces
- White / near-white text
- Muted secondary text
- One accent color
- Minimal semantic colors

Do not hardcode colors throughout the app.

Use semantic tokens.

Example:

```text
Color.background
Color.surface
Color.primary
Color.secondaryText
Color.success
Color.warning
Color.danger
```

## Typography

Use Apple's native system typography.

Prioritize:

- Large numbers
- Compact labels
- Clear hierarchy
- Monospaced typography only where it improves the technical aesthetic

## Components

Build reusable components:

- MetricCard
- StatRow
- ExerciseCard
- SetRow
- RestTimer
- PrimaryButton
- SecondaryButton
- ProgressChart
- PRBadge
- EmptyState
- SectionHeader
- WorkoutHeader
- ExercisePicker
- NumberInput
- MetricInput

---

# 43. ACTIVE WORKOUT UI

This screen deserves the most design attention.

## Requirements

- Large exercise name
- Current set state
- Previous performance
- Fast weight input
- Fast rep input
- Complete-set button
- Rest timer
- Add set
- Skip exercise
- Exercise notes
- Workout elapsed time

## Interaction principle

A user should rarely navigate away from the workout.

Avoid modal overload.

---

# 44. NUMBER INPUT UX

Weight and reps need specialized input.

Example:

```text
WEIGHT

[-] 60.0 kg [+]
```

Rep count:

```text
REPS

[-] 8 [+]
```

Also support keyboard input.

Remember the last weight automatically.

---

# 45. OFFLINE-FIRST

The app must support:

- Starting workouts offline
- Logging sets offline
- Completing workouts offline
- Viewing history offline
- Viewing routines offline
- Viewing progress based on cached local data

Sync later.

Do not block workouts behind network availability.

---

# 46. ERROR HANDLING

Errors should be human.

Bad:

> CoreDataError 134060

Good:

> We couldn't save this set. Your workout is still stored locally and will retry syncing.

For HealthKit:

> Apple Health access was not granted. You can enable it later in Settings.

---

# 47. NOTIFICATIONS

Optional notifications:

- Planned workout reminder
- Missed workout reminder
- Rest timer completion
- Program milestone
- PR notification

Avoid spam.

All notifications must be opt-in where appropriate.

---

# 48. SEARCH

Global exercise search should be fast.

Support:

- Fuzzy matching
- Muscle filters
- Equipment filters
- Recently used
- Favorites

Example:

```text
SEARCH EXERCISES

bench

Chest
  Bench Press
  Incline Bench Press
  Close-Grip Bench Press
```

---

# 49. FAVORITES / RECENT EXERCISES

Users should be able to:

- Favorite exercises
- See recently used exercises
- Pin common exercises

This dramatically improves workout creation speed.

---

# 50. DATA EXPORT

Add export capability later.

Formats:

- CSV
- JSON

Allow users to export their workout history.

Privacy principle:

> Users should be able to leave with their data.

---

# 51. TESTING STRATEGY

## Unit tests

Test:

- Volume calculations
- 1RM calculations
- PR detection
- Progressive overload recommendations
- Unit conversion
- Recovery calculations
- Nutrition totals

## Integration tests

Test:

- Workout → sets → history
- Routine → workout generation
- HealthKit → data ingestion
- CloudKit sync

## UI tests

Test:

- Start workout
- Add exercise
- Complete set
- Rest timer
- Finish workout
- View history

## Performance

Active workout interactions should feel instant.

Do not perform heavy analytics synchronously during set logging.

---

# 52. SECURITY

- No secrets in the repo. Server URLs and the Supabase anon key live in the device secure store. The AI provider key does too, and it is not a synced column.
- Row level security on the optional Supabase schema limits every table to `auth.uid()`.
- Local data is the default. Cloud sync is opt-in.
- Backups are JSON the user exports on purpose. They contain training data, not credentials.

---

# 53. AI BACKEND

There is no required backend.

The coach, when it exists, calls the provider the user chose with the key on the device. A self-hosted proxy is allowed later. It must not be required to log a set.

Structured output is validated before it is shown. The deterministic engine remains the source of progression advice. The model does not write history.

---

# 54. AI ARCHITECTURE

```text
on-device engine  ->  suggestion shown in the app
optional model    ->  validated JSON  ->  user accepts or ignores
```

The model never inserts sets, edits history, or receives the API key from another phone via sync.

# 55. ANALYTICS EVENT MODEL

If analytics are implemented, keep events privacy-conscious.

Potential local events:

- workout_started
- set_completed
- workout_completed
- routine_created
- exercise_added
- pr_achieved
- health_connected

Avoid collecting sensitive health information for product analytics unless there is a strong reason and explicit consent.

---

# 56. MVP SCOPE

## MUST HAVE

### Onboarding

- [ ] Goal
- [ ] Experience
- [ ] Training days
- [ ] Units

### Exercise

- [ ] Exercise database
- [ ] Search
- [ ] Favorites
- [ ] Recent exercises

### Workout

- [ ] Start workout
- [ ] Add exercise
- [ ] Log sets
- [ ] Weight
- [ ] Reps
- [ ] Warm-up / working sets
- [ ] Previous performance
- [ ] Rest timer
- [ ] Finish workout
- [ ] Workout summary

### Routines

- [ ] Create routine
- [ ] Edit routine
- [ ] Duplicate routine
- [ ] Start routine

### Progress

- [ ] Workout history
- [ ] PR detection
- [ ] Volume
- [ ] Estimated 1RM
- [ ] Basic charts

### Body

- [ ] Bodyweight
- [ ] Basic measurements

### Settings

- [ ] Units
- [ ] Appearance
- [ ] Data export placeholder
- [ ] Privacy settings

---

# 57. PHASE 2

- [ ] HealthKit
- [ ] Nutrition
- [ ] Body measurements
- [ ] Progress photos
- [ ] Widgets
- [ ] Live Activities
- [ ] Dynamic Island
- [ ] Notifications
- [ ] CloudKit sync

---

# 58. PHASE 3

- [ ] Progressive overload engine
- [ ] Training intelligence
- [ ] Recovery context
- [ ] Adaptive workouts
- [ ] Exercise substitutions
- [ ] AI coach
- [ ] AI workout modifications

---

# 59. PHASE 4

- [ ] Apple Watch
- [ ] Social
- [ ] Challenges
- [ ] Program sharing
- [ ] Advanced nutrition
- [ ] AI food estimation
- [ ] Advanced analytics
- [ ] Data export/import

---

# 60. DEVELOPMENT ORDER

Do not attempt to build everything simultaneously.

## Sprint 1 — Foundation

- Create native iOS project
- Set up SwiftUI
- Set up SwiftData
- Create design tokens
- Create navigation
- Create core domain models
- Seed exercise database

## Sprint 2 — Workout engine

- Workout model
- Exercise session
- Set model
- Active workout
- Set logging
- Previous performance
- Rest timer

## Sprint 3 — Routines

- Routine creation
- Routine editor
- Routine execution
- Workout generation

## Sprint 4 — History & PRs

- Workout history
- Exercise history
- PR engine
- Volume
- Estimated 1RM

## Sprint 5 — Progress

- Charts
- Bodyweight
- Measurements
- Training intelligence foundation

## Sprint 6 — Apple ecosystem

- HealthKit
- Widgets
- Live Activities

## Sprint 7 — Intelligence

- Progressive overload
- Recovery
- Adaptive workouts

## Sprint 8 — AI

- Coach backend
- Context builder
- Structured outputs
- Safety layer
- AI chat

## Sprint 9 — Polish

- Animation
- Accessibility
- Performance
- Empty states
- Error states
- Onboarding refinement
- App icon
- Launch screen

---

# 61. DEFINITION OF DONE

A feature is not complete just because it compiles.

Every feature must have:

- Functional implementation
- Loading state
- Empty state
- Error state
- Accessibility labels
- Dark mode support
- Unit tests where logic is involved
- Offline behavior defined
- Data persistence
- Migration strategy if schema changes
- No hardcoded secrets
- No fake production data

---

# 62. MVP SUCCESS CRITERIA

The first release should answer:

### Can I start a workout in <10 seconds?

Yes.

### Can I log a set in <3 taps?

Target: yes.

### Can I see what I did last time?

Yes.

### Can I finish a workout without internet?

Yes.

### Can I see my PRs?

Yes.

### Can I see whether I'm progressing?

Yes.

### Can I create my own program?

Yes.

### Can I trust that my data is mine?

Yes.

---

# 63. FUTURE PRODUCT NORTH STAR

Eventually the system should feel like:

```text
                    GYM OS

                      ↓

              KNOWS YOUR TRAINING
                      ↓
             KNOWS YOUR PROGRESS
                      ↓
              KNOWS YOUR HABITS
                      ↓
            UNDERSTANDS YOUR GOALS
                      ↓
              USES HEALTH CONTEXT
                      ↓
                 RECOMMENDS
                      ↓
              ADAPTS YOUR PLAN
                      ↓
                YOU GET STRONGER
```

The app should gradually move from:

> "I log what I did."

to:

> "I know what I should do next, and I understand why."

---

# 64. BUILDING WITH CURSOR

Implement one vertical slice at a time. `DESIGN.md` wins on visual questions. `AGENTS.md` lists the commands.

- Do not invent colors, spacing, or glass outside the theme.
- Do not commit `ios/` or `android/`.
- Add native libraries with `pnpm exec expo install` from `apps/mobile`.
- A schema change updates `packages/schemas`, `infra/supabase`, and `infra/powersync` together.
- Run `pnpm test` and `pnpm typecheck` before considering a slice done.

---

# 65. FIRST IMPLEMENTATION SLICE

The first product slice is the local logger:

1. Exercise search from `@gymaxxing/exercise-db`.
2. PowerSync local database, no `connect()`.
3. Start a workout, log a set, see the previous session, run the rest timer, finish, and read it back from history.

The engine tests land before the screen depends on them.

---

# 66. IMPLEMENTATION NOTES

- Bundle id: `com.n4bi10p.gymaxxing`.
- License: MIT.
- Accent follows the device: Silver by default, Material You on Android when the user picks System, picker on both platforms, light and dark.
- iOS 26 uses native Liquid Glass. Android emulates the control layer and falls back to an opaque rim.
- Free Apple ID sideload limits apply. Export a backup before a re-sign.
- Do not target Expo Go or EAS.

# 67. SAMPLE USER FLOW

## User starts Push workout

```text
HOME
 ↓
START PUSH
 ↓
ACTIVE WORKOUT

Bench Press
Previous:
60 × 8
60 × 8
60 × 7

Today:
60 × 8
[COMPLETE]
 ↓
REST 01:30
 ↓
Next Set
 ↓
60 × 8
 ↓
...
 ↓
FINISH
 ↓
WORKOUT SUMMARY
 ↓
PR DETECTION
 ↓
PROGRESS UPDATED
```

---

# 68. SAMPLE PROGRESS FLOW

```text
PROGRESS
 ↓
Bench Press
 ↓
Strength
 ↓
Estimated 1RM

Week 1    65.2
Week 2    66.8
Week 3    68.1
Week 4    70.4
```

Then:

> Your estimated bench 1RM increased 8% over the selected period.

Only show this if the underlying data supports the calculation.

---

# 69. SAMPLE AI COACH FLOW

```text
USER

I only have 40 minutes today.

↓

CONTEXT BUILDER

Current program
Today's routine
Recent fatigue
Exercise priorities

↓

TRAINING ENGINE

Estimated duration = 65 min

↓

AI

Reduce low-priority accessories.

↓

VALIDATOR

Check exercise IDs
Check sets
Check reps
Check equipment

↓

OUTPUT

40-minute workout
```

---

# 70. PRODUCT ROADMAP SUMMARY

```text
V0.1
████████████
Core workout logger

V0.2
████████████
Progress + body + Health

V0.3
████████████
Training intelligence

V0.4
████████████
AI coach

V1.0
████████████
Full Personal Training OS
```

---

# 71. FINAL PRODUCT REQUIREMENT

The final app should feel like a product a serious lifter would keep open for years.

The most important loop is:

```text
OPEN APP
 ↓
START WORKOUT
 ↓
LOG SET
 ↓
REST
 ↓
LOG SET
 ↓
FINISH
 ↓
SEE PROGRESS
 ↓
RETURN NEXT SESSION
```

Everything else exists to improve this loop.

**Build the boring fundamentals extremely well before adding flashy AI.**

The killer feature is not "AI."

The killer feature is:

> **The app remembers how you train, understands how you're progressing, and helps you decide what to do next.**

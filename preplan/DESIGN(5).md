# GYM OS — DESIGN.md
> Master visual language, interaction system, component specification, and implementation contract for the GYM OS mobile application.

**Status:** Source of truth  
**Platforms:** iOS + Android  
**Stack:** React Native + Expo + TypeScript  
**Primary theme:** Dark / OLED  
**Visual direction:** Premium futuristic fitness OS, restrained glassmorphism, data-forward, native-mobile

---

# 0. PURPOSE OF THIS DOCUMENT

This document defines how GYM OS must look, feel, move, and behave.

It is intended to be read by:
- Replit Agent
- AI coding agents
- UI/UX designers
- frontend engineers
- future contributors

This is not merely a moodboard. It is an implementation contract.

Do not invent visual values screen-by-screen. Every production screen must derive from this system.

If a screen conflicts with this document, this document wins unless the design system itself is deliberately revised.

---

# 1. PRODUCT DESIGN THESIS

GYM OS is not supposed to look like a generic workout tracker.

It should feel like:

> A personal training operating system from the near future.

The product combines:
- strength training
- workout planning
- exercise logging
- body analytics
- progress tracking
- nutrition
- recovery
- health data
- training intelligence
- AI-assisted coaching

The visual system should communicate intelligence and performance without looking clinical, childish, aggressively masculine, or like a gaming HUD.

The intended emotional response is:

> “This feels expensive, intelligent, calm, fast, and built specifically for training.”

---

# 2. REFERENCE DESIGN ANALYSIS

The supplied references share a strong common language. The goal is to extract that language rather than reproduce any one reference.

## 2.1 Shared characteristics

### Near-black canvas
The interfaces rarely use a visually flat pure-black page. They use near-black backgrounds with subtly differentiated surfaces.

### Oversized information
Important values such as:
- bodyweight
- volume
- workout duration
- training score
- calories
- distance
- PRs

are intentionally oversized.

The number itself becomes part of the visual composition.

### Soft card hierarchy
Cards are differentiated using:
- slight luminance changes
- translucency
- subtle outlines
- blur
- spacing
- elevation

rather than obvious borders.

### Rounded geometry
Large cards commonly use approximately 20–32px visual corner radii.

Small controls use compact radii or pills.

### Minimal chroma
Most screens are nearly monochrome.

Accent color appears only in:
- active navigation
- selected states
- charts
- progress
- PRs
- muscle highlighting
- key calls to action

### Data integrated into cards
Graphs are not placed inside obvious “analytics widgets.” They appear integrated into the surface.

### Anatomical visualization
Human/muscle figures act as a central visual device for:
- muscles trained
- planned muscles
- recovery
- training distribution

### Floating navigation
Navigation feels detached from the screen edge and often behaves like a glass dock.

### Editorial composition
The best references do not simply stack identical cards. They use:
- asymmetric card sizes
- wide hero modules
- compact statistics
- horizontal carousels
- negative space
- overlapping layers

### Restrained futuristic treatment
The futuristic feeling comes from:
- depth
- blur
- atmospheric light
- data
- motion
- precision

not from sci-fi fonts, neon outlines, or decorative HUD clutter.

---

# 3. DESIGN NORTH STAR

Use this sentence to evaluate every screen:

> Apple-like restraint + premium fitness analytics + translucent depth + subtle futuristic atmosphere.

The app must feel:
- premium
- dark
- tactile
- modern
- calm
- athletic
- technical
- intelligent
- native
- precise

The app must NOT feel:
- template-driven
- web-like
- crypto-themed
- gamer-themed
- excessively cyberpunk
- excessively neon
- cluttered
- skeuomorphic
- childish
- cartoonish
- visually noisy

---

# 4. CORE DESIGN PRINCIPLES

## 4.1 Data is the visual content

GYM OS does not need excessive illustration.

Training data itself should create visual interest.

Examples:
- `55.0 kg`
- `18 workouts`
- `326 sets`
- `72.5 kg estimated 1RM`
- `+8.2%`
- a muscle heatmap
- an 8-week strength curve

## 4.2 Depth over decoration

Create depth using:
1. canvas
2. atmospheric lighting
3. translucent surfaces
4. borders/highlights
5. foreground information

Do not add decoration merely to make a screen look “futuristic.”

## 4.3 Hierarchy over density

A screen should have one obvious visual entry point.

The user should understand the most important information in approximately one second.

## 4.4 Workout usability overrides aesthetics

During a workout the user may be:
- sweating
- moving
- holding equipment
- tired
- using one hand
- looking at the phone briefly

Active workout controls therefore need larger touch targets and simpler layouts than analytics screens.

## 4.5 Glass is a material, not a gimmick

Glassmorphism must communicate hierarchy and depth.

It must never reduce:
- legibility
- contrast
- performance
- usability

## 4.6 One accent is enough

Most of the product is neutral.

Accent color has meaning precisely because it is uncommon.

---

# 5. VISUAL LAYER MODEL

Every screen should conceptually follow:

```text
SYSTEM BACKGROUND
        ↓
ATMOSPHERIC GRADIENT / LIGHT
        ↓
PAGE CONTENT
        ↓
GLASS SURFACES
        ↓
DATA / TYPOGRAPHY
        ↓
FLOATING CONTROLS
        ↓
SYSTEM OVERLAYS / SHEETS
```

Avoid flattening everything into equally elevated cards.

---

# 6. COLOR SYSTEM

## 6.1 Foundation

```ts
export const palette = {
  black: '#000000',

  background: {
    primary: '#070708',
    secondary: '#0A0A0C',
    elevated: '#0D0D10',
  },

  white: '#F7F7F8',
};
```

Do not use pure black as the universal page background. Pure black may be used strategically around OLED/system regions.

---

# 7. SURFACE SYSTEM

```ts
surface = {
  ghost: 'rgba(255,255,255,0.025)',
  subtle: 'rgba(255,255,255,0.035)',
  regular: 'rgba(255,255,255,0.055)',
  elevated: 'rgba(255,255,255,0.075)',
  prominent: 'rgba(255,255,255,0.10)',
  pressed: 'rgba(255,255,255,0.12)',
}
```

Use `ghost` for barely perceptible grouping.

Use `subtle` for secondary cards.

Use `regular` as the standard glass surface.

Use `elevated` for interactive/floating cards.

Use `prominent` sparingly for high-priority controls.

---

# 8. TEXT COLORS

```ts
text = {
  primary: '#F5F5F7',
  secondary: 'rgba(245,245,247,0.66)',
  tertiary: 'rgba(245,245,247,0.40)',
  disabled: 'rgba(245,245,247,0.25)',
  inverse: '#080809',
}
```

Do not use full white for every label.

Hierarchy must be visible through luminance.

---

# 9. PRIMARY ACCENT

Default direction:

```ts
accent = {
  primary: '#7C5CFF',
  bright: '#8B7CFF',
  muted: '#6750D8',
  soft: 'rgba(124,92,255,0.18)',
  faint: 'rgba(124,92,255,0.08)',
}
```

The accent is a controlled electric violet/indigo.

It is used for:
- active state
- selected state
- primary data emphasis
- progress
- muscle highlighting
- current chart series
- PR treatment
- AI intelligence cues
- key navigation state

It is NOT a default background for every card.

---

# 10. SEMANTIC COLORS

```ts
semantic = {
  success: '#66E3A3',
  warning: '#F3C969',
  danger: '#FF6B6B',
  info: '#7EA7FF',
}
```

Examples:
- successful progression → success
- recovery caution → warning
- destructive action → danger
- informational state → info

Do not use semantic colors decoratively.

---

# 11. BORDERS

```ts
border = {
  faint: 'rgba(255,255,255,0.045)',
  default: 'rgba(255,255,255,0.075)',
  strong: 'rgba(255,255,255,0.12)',
  accent: 'rgba(124,92,255,0.35)',
}
```

Default border width:
- `1px`

Avoid:
- 2–3px outlines around standard cards
- glowing borders everywhere
- bright white outlines

---

# 12. GLASS MATERIAL SYSTEM

Glass should combine:
- translucent fill
- background blur where supported
- hairline border
- optional inner highlight
- low-opacity shadow
- contextual ambient glow

## Glass variants

### Ghost Glass
For background grouping.

```text
fill: surface.ghost
border: faint
blur: low
```

### Regular Glass
Default card.

```text
fill: surface.regular
border: default
blur: medium
```

### Elevated Glass
Floating controls, dock, sheets.

```text
fill: surface.elevated
border: strong
blur: high
shadow: medium
```

### Prominent Glass
Rare hero/primary interaction surface.

```text
fill: surface.prominent
border: strong
blur: high
shadow: elevated
```

---

# 13. GLASS IMPLEMENTATION

For Expo/React Native, use platform-appropriate blur primitives where available.

The implementation must degrade gracefully.

Conceptually:

```tsx
<BlurView intensity={...}>
  <View style={glassSurfaceStyle}>
    {children}
  </View>
</BlurView>
```

Do not create expensive full-screen blur layers unnecessarily.

Blur should be localized.

On devices/platforms where true blur is undesirable or unavailable, fall back to an opaque/translucent surface that preserves contrast.

---

# 14. ATMOSPHERIC LIGHTING

The page background may contain very soft radial/linear gradients.

Suggested composition:

```text
TOP RIGHT
violet
5–9% opacity

LOWER LEFT
cool blue
3–6% opacity
```

Some screens may use a contextual glow behind:
- body visualization
- PR card
- AI Coach
- recovery score

Rule:

> Glow belongs behind content, not on top of content.

Never use giant obvious neon blobs.

---

# 15. TYPOGRAPHY

Use system typography.

iOS should naturally resolve to Apple's system font.

Android should use the platform equivalent unless a deliberate cross-platform font decision is later made.

Do not use a “futuristic” display font.

The future-facing character comes from composition, not novelty typography.

---

# 16. TYPE SCALE

Suggested semantic tokens:

```ts
type = {
  heroMetric: {
    size: 56,
    lineHeight: 60,
    weight: '700',
    tracking: -1.8,
  },

  display: {
    size: 38,
    lineHeight: 42,
    weight: '700',
    tracking: -1.1,
  },

  screenTitle: {
    size: 32,
    lineHeight: 38,
    weight: '700',
    tracking: -0.8,
  },

  sectionTitle: {
    size: 22,
    lineHeight: 28,
    weight: '600',
    tracking: -0.35,
  },

  cardTitle: {
    size: 17,
    lineHeight: 22,
    weight: '600',
  },

  body: {
    size: 16,
    lineHeight: 22,
    weight: '400',
  },

  bodySmall: {
    size: 14,
    lineHeight: 20,
    weight: '400',
  },

  label: {
    size: 12,
    lineHeight: 16,
    weight: '600',
    tracking: 0.25,
  },

  micro: {
    size: 11,
    lineHeight: 14,
    weight: '500',
  },
}
```

Respect accessibility scaling.

---

# 17. NUMERIC TYPOGRAPHY

Metrics are a signature element.

Examples:

```text
55.0
kg

17
workouts

326
sets

359.7k
volume
```

Use:
- tabular numerals when useful
- strong contrast
- large size
- small secondary unit

Do not make the unit visually compete with the number.

---

# 18. SPACING

Base system:

```ts
spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  section: 64,
}
```

Default phone horizontal content inset:

```text
20px
```

Hero regions may use 24px.

Spacing is a visual feature. Do not aggressively compress screens.

---

# 19. RADII

```ts
radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  hero: 32,
  pill: 999,
}
```

Typical:
- small input → 12–16
- card → 20–24
- hero card → 28–32
- bottom sheet → 28–32 top corners
- pill → full radius

---

# 20. SHADOWS

Dark interfaces require subtle shadows.

Use:
- low opacity
- broad radius
- soft falloff

Conceptual levels:

```ts
shadows = {
  subtle: {
    opacity: 0.10,
    radius: 12,
    offsetY: 6,
  },

  medium: {
    opacity: 0.14,
    radius: 24,
    offsetY: 10,
  },

  floating: {
    opacity: 0.20,
    radius: 36,
    offsetY: 16,
  },
}
```

Never use harsh web-style drop shadows.

---

# 21. SCREEN CONTAINER

Create a canonical `<Screen />` primitive.

Responsibilities:
- safe area
- background
- optional atmospheric gradient
- keyboard handling
- standard horizontal padding
- status-bar treatment
- scroll behavior

Screens must not independently recreate these rules.

---

# 22. CARD SYSTEM

Core primitives:

```text
GlassSurface
GlassCard
MetricCard
HeroCard
InsightCard
WorkoutCard
ExerciseCard
ProgressCard
BodyMetricCard
NutritionMetricCard
RecoveryCard
```

Do not create a new generic card style for every feature.

---

# 23. GLASS CARD ANATOMY

Typical structure:

```text
┌──────────────────────────────┐
│ LABEL                    icon│
│                              │
│ 359.7k                       │
│ volume                       │
│                              │
│          chart               │
│                              │
│ +8.2% vs last period         │
└──────────────────────────────┘
```

A card does not require every element.

Prefer one strong visual idea per card.

---

# 24. BUTTON SYSTEM

Required variants:

```text
PrimaryButton
SecondaryButton
GlassButton
IconButton
DangerButton
TextButton
```

## Primary button

For dominant actions:
- Start Workout
- Complete Set
- Save Routine

Suggested:
- high-contrast near-white fill with dark text OR controlled accent treatment
- large radius
- minimum height 52–56
- strong typography

The white-button treatment is particularly appropriate for workout-start actions because it creates extreme clarity on the dark canvas.

## Glass button

Used for:
- filters
- secondary actions
- settings
- contextual controls

## Icon button

Minimum touch area:
- 44 × 44 pt

Prefer:
- 48 × 48

---

# 25. PILLS / CHIPS

Use for:
- filters
- exercise equipment
- time range
- selected date
- muscle filters
- compact metadata

Avoid turning every label into a pill.

Default chip should be quiet.

Selected chip may use:
- brighter surface
- accent tint
- stronger text

---

# 26. ICONOGRAPHY

Use one consistent icon family.

Recommended character:
- geometric
- outline-first
- rounded stroke
- minimal

Use a single library such as Lucide-compatible icons if technically appropriate.

Do not mix:
- emoji
- filled SF-symbol-like icons
- outline icons
- random SVG packs

within the same hierarchy.

---

# 27. NAVIGATION ARCHITECTURE

Primary navigation:

```text
HOME
WORKOUT
PROGRESS
NUTRITION
PROFILE
```

Potential visual arrangement:

```text
┌───────────────────────────────────┐
│  Home   Workout   ●   Stats   Me  │
└───────────────────────────────────┘
```

A central workout action may be elevated if it improves the interaction model.

Do not force a central FAB if it makes navigation ambiguous.

---

# 28. FLOATING TAB BAR

The tab bar should visually float.

Characteristics:
- horizontal inset
- bottom safe-area awareness
- translucent elevated surface
- blur
- subtle border
- 22–28 radius
- optional shadow

Active:
- bright icon
- accent indicator or accent icon

Inactive:
- tertiary text/icon

Do not use five bright labels simultaneously.

---

# 29. HOME SCREEN COMPOSITION

Home should answer:

1. What am I training today?
2. What should I do now?
3. How consistent have I been?
4. Am I progressing?
5. Is there anything important to know?

Recommended hierarchy:

```text
GREETING / CONTEXT

TODAY'S WORKOUT HERO

QUICK METRICS

30-DAY CONSISTENCY

TRAINING PROGRESS

BODY / RECOVERY

TRAINING INSIGHT
```

Do not put every available statistic on Home.

---

# 30. HOME HEADER

Example:

```text
Good evening, Nabil.

Ready to train?
```

Alternative compact header:

```text
TODAY
Friday, 3 October
```

Avoid excessive motivational copy.

---

# 31. TODAY'S WORKOUT HERO

This is the primary Home card.

Example:

```text
TODAY

Push

Chest · Shoulders · Triceps

~62 min        6 exercises

[ START WORKOUT ]
```

Potential right-side visual:
- subtle anatomy figure
- abstract training glyph
- progress ring

Do not overcrowd it.

---

# 32. ANATOMY HERO

A human body visualization may be used to show today's target muscles.

Treatment:
- dark line-art body
- inactive muscle regions nearly invisible
- target muscles accent-lit
- subtle halo beneath figure
- front/back view only where needed

Do not copy proprietary anatomy art from reference products.

Use an original or properly licensed asset.

---

# 33. QUICK METRIC GRID

Recommended 3-column arrangement where width permits:

```text
17          326          359.7k
WORKOUTS    SETS         VOLUME
```

On narrower layouts, use:
- horizontal scroll
- 2-column layout

Each metric card should have:
- icon
- metric
- label
- optional delta

No mini paragraph inside a quick metric.

---

# 34. CONSISTENCY GRID

Use a contribution/calendar pattern inspired by the references.

Example:

```text
LAST 30 DAYS                         17 / 24

● ○ ● ● ● ○ ● ○ ● ●
● ● ○ ● ● ● ○ ● ○ ●
● ● ● ○ ● ● ● ○ ● ○
```

Intensity can represent:
- no workout
- completed workout
- planned/completed distinction

Do not imply training more frequently is always better.

Rest days are valid.

---

# 35. PROGRESS PREVIEW

Home gets a summary, not the entire analytics suite.

Example:

```text
VOLUME
8-week trend

363.2k kg

        ╭────
    ╭───╯
────╯
```

One metric + one graph + one useful comparison.

---

# 36. INSIGHT CARD

Example:

```text
TRAINING INSIGHT

Your bench press estimated 1RM
has increased across your last
four comparable sessions.

VIEW DETAILS →
```

Insights must be based on real data.

No fabricated AI insight.

---

# 37. WORKOUT LIBRARY

Screen title:

```text
Workouts
```

Top actions:
- filter
- create

Layout can use asymmetrical folder-like cards inspired by the references.

Categories:
- Today
- Programs
- Routines
- Recent

---

# 38. ROUTINE CARD

Example:

```text
PUSH A

6 exercises

Chest · Shoulders · Triceps

Last trained 2d ago
```

Possible visual elements:
- progress ring
- small muscle map
- frequency
- menu

Avoid excessive metadata.

---

# 39. ACTIVE WORKOUT — PRIMARY UX

This is the most important operational screen.

Visual effects must be reduced here if they slow interaction.

Top:

```text
PUSH A                           •••

42:18
Workout time
```

Then current exercise.

---

# 40. CURRENT EXERCISE HEADER

```text
BENCH PRESS

Chest · Compound

LAST SESSION
60 × 8   60 × 8   60 × 7
```

Optional:
- exercise thumbnail
- instructions
- history shortcut

Keep previous performance visible.

---

# 41. SET TABLE

Columns:

```text
SET      PREVIOUS      KG      REPS      ✓
```

Example:

```text
1        60 × 8        60       8        ✓
2        60 × 8        60       8        ✓
3        60 × 7        60       7        ○
```

Rows should be touch-friendly.

Completed rows become quieter.

Current row receives elevated/accent treatment.

---

# 42. ACTIVE SET MODE

For an even faster focused interaction, support a prominent current-set card:

```text
SET 3

60.0 kg       8 reps

−  +           −  +

[ COMPLETE SET ]
```

Large targets.

No tiny steppers.

Keyboard entry should remain possible.

---

# 43. COMPLETE SET INTERACTION

Sequence:

```text
tap Complete
     ↓
short haptic
     ↓
row becomes completed
     ↓
PR check
     ↓
rest timer appears
     ↓
next set becomes current
```

Animation should take roughly 180–300ms and never block input.

---

# 44. REST TIMER

Rest timer should behave like a floating training instrument.

Example:

```text
REST

01:32

NEXT
60 kg × 8

[-15]        SKIP        [+15]
```

Possible presentation:
- floating bottom glass card
- compact persistent banner
- circular progress ring

It must remain accessible while navigating within the workout.

---

# 45. WORKOUT FINISH

Finish action should not be accidentally triggered.

Use:
- top-right action → confirmation sheet
or
- deliberate bottom action

Summary:

```text
WORKOUT COMPLETE

Push A

58 min
18 sets
7,240 kg volume
2 PRs
```

Use a subtle celebratory glow.

No forced confetti.

---

# 46. PR MOMENT

PRs deserve premium emphasis.

Example:

```text
PERSONAL BEST

BENCH PRESS

65 kg × 8

+2 reps
```

Treatment:
- elevated glass
- subtle violet halo
- tiny success accent
- medium haptic
- optional animated number

Do not use flashing effects.

---

# 47. PROGRESS SCREEN

The Progress screen is the analytical core.

Suggested sections:

```text
PROGRESS

[ 4W ] [ 8W ] [ 6M ] [ 1Y ]

STRENGTH
VOLUME
CONSISTENCY
MUSCLE GROUPS
BODY
PERSONAL RECORDS
```

Use progressive disclosure.

Do not show six full graphs at once.

---

# 48. SEGMENTED CONTROLS

Segmented controls should use glass.

Example:

```text
┌────────────────────────────┐
│ 4W   [8W]   6M   1Y        │
└────────────────────────────┘
```

Selected:
- brighter surface
- primary text
- subtle accent

---

# 49. CHART LANGUAGE

Supported:
- line
- area
- bar
- progress ring
- heatmap
- contribution grid
- body map

Chart rules:
- minimal axes
- subtle or absent grid
- one dominant series
- accent stroke
- faint gradient fill
- selected point can glow
- labels only where useful

Avoid chart-library default styling.

---

# 50. LINE CHART

Visual style:

```text
72.5 ─                    ●
                     ╭────╯
                 ╭───╯
             ╭───╯
         ╭───╯
65.0 ────╯
```

Use smoothness carefully. Do not visually imply measurements between sparse points with misleading curves.

---

# 51. MUSCLE MAP

Muscle visualization is a signature component.

Modes:
- Today's workout
- This week
- Last week
- Program distribution
- Recent training

State hierarchy:

```text
untrained:
very dark neutral

light activity:
accent at low opacity

moderate:
accent medium

high:
accent stronger
```

Do not imply that brighter = biologically exact muscle growth.

Label this as training distribution / logged sets.

---

# 52. TRAINED AREAS CARD

Example:

```text
TRAINED AREAS

[ THIS WEEK ]  LAST WEEK

      FRONT       BACK

CHEST           12 sets
BACK            15 sets
QUADS           10 sets
```

The body visualization should occupy most of the visual area.

---

# 53. BODY TRACKING

Body screen:

```text
BODY

55.0 kg
current weight

7-day average
54.8 kg

[ chart ]

MEASUREMENTS
Chest
Waist
Arms
Thighs

PROGRESS PHOTOS
```

Progress photos require privacy-first treatment.

---

# 54. NUTRITION

Nutrition should visually belong to GYM OS rather than looking like a separate calorie app.

Hero:

```text
2,480
kcal today

2,700 target
```

Macro grid:

```text
132g          290g
PROTEIN       CARBS

72g           31g
FAT           FIBER
```

Optional progress rings/bars.

Avoid four giant saturated macro colors.

---

# 55. RECOVERY

Recovery visual tone should be calmer than workout screens.

Example:

```text
RECOVERY

82
GOOD

Sleep            8h 12m
HRV trend        +6%
Resting HR       baseline
Training load    moderate
```

Never visually imply medical diagnosis.

If insufficient data:

```text
RECOVERY CONTEXT

Not enough data yet.

Connect health data or continue
logging to build your baseline.
```

---

# 56. AI COACH

The AI experience should feel embedded into the operating system.

Do NOT clone ChatGPT.

Landing:

```text
COACH

Good evening.

Your Push session is scheduled today.

You have progressed on bench press
for three comparable sessions.

What do you want to do?

[ Start planned workout ]
[ Make it 45 minutes ]
[ Review progress ]
```

Conversation may exist deeper in the experience.

---

# 57. AI VISUAL TREATMENT

Use a subtle intelligence motif:
- violet atmospheric glow
- tiny waveform/spark glyph
- elevated glass surface

Do not:
- put gradient borders around every AI element
- use robot imagery
- label every generated sentence “AI”

---

# 58. PROFILE

Profile should feel like a system dashboard.

Example:

```text
NABIL

Build muscle
6 training days

BODY
55.0 kg
170 cm

TRAINING
Intermediate
Metric

HEALTH
Apple Health / Health Connect

APP
Appearance
Notifications
Privacy
Export
```

Use grouped glass sections.

---

# 59. SETTINGS

Settings hierarchy:

```text
PROFILE

TRAINING
Units
Rest timer
Training days
RPE / RIR

HEALTH
Health integration

NOTIFICATIONS

PRIVACY
Data controls
Export

APP
Appearance
Haptics
About
```

Avoid creating one card per row.

Use grouped surfaces.

---

# 60. BOTTOM SHEETS

Use bottom sheets for:
- exercise picker
- set options
- filters
- date range
- edit metric
- exercise substitutions
- routine actions

Visual:
- elevated glass/opaque fallback
- 28–32 top radius
- drag indicator
- clear title
- safe area
- keyboard-aware

---

# 61. INPUTS

Inputs should not resemble web forms.

Use:
- large numeric fields
- stepper controls
- inline editing
- wheels/pickers where appropriate
- bottom sheets

For gym logging:

```text
WEIGHT
60.0 kg

[ −2.5 ] [ − ] [ + ] [ +2.5 ]
```

Keep keyboard input available.

---

# 62. SEARCH

Exercise search:

```text
SEARCH EXERCISES

[ Search exercises... ]

RECENT

Bench Press
Lat Pulldown
Lateral Raise

CHEST

Incline Dumbbell Press
Machine Chest Press
...
```

Search field uses subtle glass.

Filters appear as chips.

---

# 63. MOTION SYSTEM

Motion should communicate physicality.

Motion categories:

### Micro
100–180ms
- button state
- check state
- chip selection

### Standard
180–260ms
- card expansion
- navigation state
- chart selection

### Expressive
260–420ms
- PR reveal
- sheet presentation
- workout completion

Prefer spring physics for:
- cards
- draggable surfaces
- navigation indicator
- selection

---

# 64. MOTION RULES

Animation must be:
- interruptible
- fast
- purposeful
- consistent

Never animate:
- every card on every load
- large background glows continuously
- charts unnecessarily
- workout controls in a way that delays logging

Respect reduced-motion settings.

---

# 65. HAPTICS

Recommended:

```text
selection:
filters / tabs

light:
set edit / normal action

medium:
set completion

success:
PR / workout completion

warning:
destructive confirmation
```

Avoid haptic spam.

---

# 66. LOADING

Prefer skeletons matching actual layout.

Glass skeleton:
- same card dimensions
- quiet animated luminance
- no aggressive shimmer

For instant local data, do not show artificial loaders.

---

# 67. EMPTY STATES

Example:

```text
NO WORKOUTS YET

Your training history starts
with your first session.

[ CREATE ROUTINE ]
```

Keep empty states minimal.

Avoid generic stock illustrations.

---

# 68. ERRORS

Human language only.

Example:

```text
COULDN'T SYNC

Your workout is saved on this device.
We'll retry when you're online.

[ TRY AGAIN ]
```

Do not expose implementation terminology.

---

# 69. OFFLINE STATE

Because training logging is local-first, offline should not look like failure.

Optional small indicator:

```text
Offline · saved locally
```

Never prevent set logging because cloud sync is unavailable.

---

# 70. IMAGE / MEDIA LANGUAGE

If photography is introduced:
- monochrome or desaturated
- high contrast
- cinematic
- integrated under gradients
- never generic smiling-stock-gym photography

Exercise demonstrations should prioritize clarity over mood.

---

# 71. RESPONSIVE LAYOUT

Do not hardcode for one iPhone screenshot.

Support:
- compact phones
- standard phones
- large phones
- Android aspect ratios

Use:
- flex layout
- safe areas
- max/min dimensions
- adaptive grids

Avoid absolute positioning for core content.

---

# 72. PLATFORM ADAPTATION

Shared:
- visual language
- typography hierarchy
- spacing
- glass
- cards
- charts
- accent

Platform-specific:
- system permissions
- health integration
- native dialogs
- back navigation
- system share sheets
- status bar behavior
- widgets
- live activity / ongoing notification

Do not make Android pretend to literally be iOS.

---

# 73. ACCESSIBILITY

Required:
- VoiceOver
- TalkBack
- accessible labels
- scalable text where practical
- sufficient contrast
- reduced motion
- 44pt minimum interactive target
- no color-only status communication

Glass must never compromise readability.

If visual purity and accessibility conflict, accessibility wins.

---

# 74. DESIGN TOKENS FILE STRUCTURE

```text
src/
└── design-system/
    ├── tokens/
    │   ├── colors.ts
    │   ├── typography.ts
    │   ├── spacing.ts
    │   ├── radii.ts
    │   ├── shadows.ts
    │   ├── motion.ts
    │   └── index.ts
    │
    ├── primitives/
    │   ├── Screen.tsx
    │   ├── GlassSurface.tsx
    │   ├── Text.tsx
    │   ├── Stack.tsx
    │   ├── Row.tsx
    │   └── Divider.tsx
    │
    ├── components/
    │   ├── GlassCard.tsx
    │   ├── HeroCard.tsx
    │   ├── MetricCard.tsx
    │   ├── GlassButton.tsx
    │   ├── PrimaryButton.tsx
    │   ├── IconButton.tsx
    │   ├── Pill.tsx
    │   ├── SegmentedControl.tsx
    │   ├── SectionHeader.tsx
    │   ├── FloatingTabBar.tsx
    │   ├── BottomSheet.tsx
    │   ├── EmptyState.tsx
    │   ├── Skeleton.tsx
    │   └── ErrorState.tsx
    │
    ├── fitness/
    │   ├── WorkoutCard.tsx
    │   ├── ExerciseCard.tsx
    │   ├── SetRow.tsx
    │   ├── RestTimer.tsx
    │   ├── PRCard.tsx
    │   ├── MuscleMap.tsx
    │   ├── ConsistencyGrid.tsx
    │   ├── ProgressChart.tsx
    │   ├── MacroCard.tsx
    │   └── RecoveryCard.tsx
    │
    └── index.ts
```

---

# 75. TOKEN USAGE CONTRACT

Never do this in product screens:

```tsx
<View
  style={{
    backgroundColor: '#161618',
    borderRadius: 27,
    padding: 19,
  }}
/>
```

Instead:

```tsx
<GlassCard
  variant="regular"
  radius="xl"
  padding="lg"
/>
```

The design system must own visual values.

---

# 76. COMPONENT API PRINCIPLES

Components should accept semantic props.

Good:

```tsx
<MetricCard
  label="Weekly volume"
  value="12.4k"
  unit="kg"
  trend={8.2}
  trendDirection="up"
/>
```

Bad:

```tsx
<MetricCard
  fontSize={41}
  color="#fff"
  border="#292929"
  radius={27}
/>
```

Screens should describe meaning, not restyle the system.

---

# 77. DESIGN SYSTEM SHOWCASE

Before building production screens, implement a hidden development route:

```text
/design-system
```

This screen must demonstrate:

## Foundation
- background
- accent
- semantic colors
- text hierarchy

## Typography
- hero
- display
- screen title
- section
- body
- label
- metrics

## Glass
- ghost
- subtle
- regular
- elevated
- prominent

## Controls
- primary button
- secondary button
- glass button
- icon button
- pills
- segmented controls

## Fitness
- metric cards
- workout card
- exercise row
- set row
- PR card
- rest timer
- consistency grid
- muscle map placeholder
- chart

## States
- loading
- empty
- error
- disabled
- pressed
- selected

## Navigation
- floating tab bar
- bottom sheet sample

Do not proceed to mass screen implementation until this showcase visually passes review.

---

# 78. DESIGN REVIEW CHECKLIST

For every screen:

## Hierarchy
- Is the primary information obvious?
- Is there one dominant action?
- Are secondary details quieter?

## Composition
- Is there enough negative space?
- Are card sizes intentionally varied?
- Does the screen avoid dashboard soup?

## Glass
- Is blur restrained?
- Is contrast sufficient?
- Are borders nearly invisible?
- Does depth feel intentional?

## Color
- Is accent rare enough to remain meaningful?
- Are semantic colors used semantically?

## Typography
- Are metrics large enough?
- Are labels quieter than values?
- Is line length reasonable?

## Interaction
- Are primary targets large?
- Can workout interactions happen quickly?
- Are haptics/motion purposeful?

## Technical
- Are tokens used?
- Are components reused?
- Does it adapt across screen sizes?
- Does it support accessibility?

---

# 79. ANTI-PATTERNS

Never produce:

## Purple soup
Purple gradient on every surface.

## Glass soup
Every piece of text inside a separate glass pill.

## Card soup
Ten equally sized cards stacked endlessly.

## Dashboard soup
Every available statistic shown simultaneously.

## Cyberpunk cosplay
Neon borders, techno fonts, HUD brackets, scanning animations.

## Generic SaaS
Desktop-style panels, tiny controls, web navigation patterns.

## Generic Expo
Default navigation and unstyled native controls mixed with custom UI.

## Fake native
Pixel-copying iOS patterns onto Android regardless of platform behavior.

## Fake intelligence
Random AI insights or recovery scores without data.

---

# 80. FUTURISM RULE

Futuristic does NOT mean more decoration.

Futuristic means:
- cleaner
- faster
- smarter
- more contextual
- more responsive
- more spatial
- less cluttered

The UI should look plausible as a premium fitness product several years ahead, not as science-fiction concept art.

---

# 81. GLASSMORPHISM QUALITY RULE

The correct result:

```text
dark environment
+
barely visible atmospheric light
+
soft translucent material
+
hairline highlight
+
sharp readable content
```

The incorrect result:

```text
purple gradient
+
50% opacity card
+
huge blur
+
white border
+
glowing text
```

When uncertain, reduce the effect by 30%.

---

# 82. VISUAL DENSITY TARGET

Home:
- medium

Active workout:
- medium-high information, low interaction complexity

Progress:
- medium

Nutrition:
- medium

Coach:
- low-medium

Settings:
- medium-low

Never optimize all screens for the same density.

---

# 83. ORIGINALITY REQUIREMENT

The supplied references are inspiration only.

Do not:
- copy logos
- copy brand names
- copy exact illustrations
- recreate exact proprietary screens
- duplicate exact layouts pixel-for-pixel

Instead extract:
- material language
- hierarchy
- spacing
- data treatment
- composition
- motion philosophy

and create an original GYM OS identity.

---

# 84. IMPLEMENTATION ORDER FOR REPLIT

## Stage 1 — Foundation only

Implement:
1. tokens
2. Screen
3. typography
4. GlassSurface
5. GlassCard
6. buttons
7. pills
8. icon buttons
9. segmented controls
10. section headers

## Stage 2 — Visual showcase

Implement `/design-system`.

Do not build product screens yet.

## Stage 3 — Fitness primitives

Implement:
- MetricCard
- WorkoutCard
- ExerciseCard
- SetRow
- RestTimer
- PRCard
- ConsistencyGrid
- ProgressChart
- MuscleMap shell

## Stage 4 — Navigation

Implement floating navigation and app shell.

## Stage 5 — Product screens

Build in this order:
1. Home
2. Workout Library
3. Routine Detail
4. Active Workout
5. Workout Summary
6. Progress
7. Exercise Detail
8. Body
9. Nutrition
10. Recovery
11. Coach
12. Profile
13. Settings

---

# 85. REPLIT AGENT DIRECTIVE

When this file exists in the repository, treat it as authoritative.

Before creating or modifying UI:

1. Read `DESIGN.md`.
2. Inspect the design-system directory.
3. Reuse existing tokens.
4. Reuse existing primitives.
5. Do not introduce arbitrary colors.
6. Do not introduce arbitrary radii.
7. Do not introduce arbitrary spacing.
8. Do not introduce another icon family.
9. Do not create one-off glass implementations.
10. Do not bypass accessibility.
11. Do not make production screens depend on hardcoded mock data.
12. Preserve cross-platform behavior.
13. Keep workout interactions extremely fast.
14. Prefer restraint over visual noise.
15. If a required pattern does not exist, extend the design system first.

---

# 86. FIRST REPLIT TASK

Use this exact implementation goal:

> Read DESIGN.md completely. Do not build the application screens yet. Implement the design-system foundation and create a `/design-system` development showcase route that renders every token, typography style, glass variant, button, chip, metric card, workout card, set row, chart style, rest timer, state treatment, and floating navigation primitive. The purpose of this task is visual calibration. Use reusable typed components and production-quality architecture. Do not hardcode screen-specific visual values. Do not add AI, backend, authentication, HealthKit, Health Connect, or production business logic during this task.

---

# 87. VISUAL ACCEPTANCE TARGET

The showcase is successful when:

- black feels rich rather than flat
- glass is visible but restrained
- text remains extremely crisp
- the accent feels special
- cards have depth without heavy borders
- large metrics look premium
- spacing feels intentional
- controls look touchable
- navigation looks floating rather than web-like
- the interface looks excellent without animation
- the app does not resemble a generic React Native template

Only after this passes visual review should full screens be built.

---

# 88. DESIGN MANTRA

```text
DARK
GLASS
DATA
SPACE
DEPTH
MOTION
RESTRAINT
```

And above all:

> GYM OS should feel like a beautifully engineered training instrument, not a decorated fitness dashboard.

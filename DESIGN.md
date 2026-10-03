# Gymaxxing — DESIGN.md

> Final design system and implementation contract for the Gymaxxing mobile app (iOS + Android). Free and open source (MIT): https://github.com/n4bi10p/gymaxxing

**Status:** Source of truth. Supersedes `preplan/DESIGN(5).md`.
**Platforms:** iOS + Android
**Stack:** Expo (React Native, New Architecture) + TypeScript
**Design targets:** iOS 26 (iPhone 14) and Android 15. This is a personal, free, open-source app distributed through GitHub, so glass Tiers A and B are the designed experience; older OS versions get the Tier D opaque fallback on a best-effort basis (Section 7.4).
**Schemes:** Dark (pitch black) and Light (frosted porcelain), both built for v1. Follows the device by default.
**Default accent:** Silver. Android adds "System" (Material You). Both platforms have an accent picker.
**Glass language:** iOS Liquid Glass. On iOS 26+ it is the native material; on Android it is emulated (blur, lens refraction, specular rim) and degrades gracefully.
**Visual direction:** Premium glass, data-forward, calm, native-feeling.

---

# 0. HOW TO USE THIS DOCUMENT

This is an implementation contract, not a moodboard. It is read by engineers, designers and AI coding agents.

- Every production screen derives from this system. Do not invent colors, radii, spacing or glass values per screen.
- If a screen conflicts with this document, this document wins until the document is deliberately revised.
- If a required pattern does not exist, extend the design system first, then use it.
- Accessibility beats visual purity. Workout usability beats both.

---

# 1. WHAT CHANGED FROM THE PREVIOUS DESIGN.md

The previous version was written before all ten references were analysed together and before the platform decision was final. These are the deliberate changes.

1. **Accent is no longer a single hardcoded violet.** The accent is a runtime value resolved from the user's choice, the device (Android Material You) or the silver default. Both iOS and Android have an accent picker. No component may reference a fixed accent hex. (Section 5.)
2. **Base canvas is true pitch black `#000000`.** The old doc avoided pure black. Nearly every reference (Dropset, Lift AI, Turn Steps, Dashboard shots) uses true black, glass reads best against it, and it matches the owner's device theme. (Section 6.)
3. **Default accent is silver.** Violet is demoted to one optional preset. The references are mostly monochrome with a single cool highlight; silver preserves that restraint.
4. **Primary CTA is a high-contrast pill regardless of accent.** Near-white on dark, near-black on light. Seen in Lift AI, "Today's workout", Nike Run Club. It is always the strongest contrast on the screen and never depends on the accent.
5. **Navigation is 4 tabs for the MVP** (Home, Workout, Progress, Profile) plus a persistent **mini workout bar** (from the Dropset "in progress" drawer). Nutrition joins as a tab when it ships.
6. **New components taken from the references:** folder-tab cards, dashed "selected/planned" outline, pill-shaped consistency grid, week strip with check circles, dot-scale muscle cards ("Growing" with 0 to 18 dots), 2x2 summary grid, program progress track with milestones, splits-style set table, horizontal bar zones, date capsules, pill input with quick-action chips.
7. **Glass follows the iOS Liquid Glass language.** Glass is a material for the controls and navigation layer (tab bar, toolbars, buttons, sheets, mini bar). Content cards use cheap translucent fills. iOS 26+ uses the native material; Android emulates it with a native module; older devices degrade in four tiers. (Sections 7 and 21.)
8. **Light and dark are both v1.** Both schemes are fully specified (Section 6), both follow the device by default, and both are in the design-system showcase gate.
9. **Navigation is platform-split.** iOS uses native tabs (automatic Liquid Glass on iOS 26, and a native bottom accessory for the mini workout bar). Android uses a custom floating glass dock. The raised center action is dropped for parity. (Section 12.)
10. **Cursor-oriented rules.** The doc is written to be consumed by Cursor agents through project rules, not by Replit.

---

# 2. DESIGN THESIS AND NORTH STAR

Gymaxxing is a personal training instrument, not a decorated fitness dashboard. The name is playful; the UI voice is not. Copy stays calm, precise and restrained: no slang, no hype, no emoji in product text.

> Apple-like restraint + premium fitness analytics + translucent depth + quiet metallic precision.

Must feel: premium, tactile, calm, athletic, technical, intelligent, native, precise, in both light and dark.

Must NOT feel: template-driven, web-like, crypto, gamer, neon, cyberpunk, cluttered, skeuomorphic, childish, visually noisy.

Futuristic means cleaner, faster, smarter and more contextual. It does not mean more decoration.

---

# 3. REFERENCE SYNTHESIS

## 3.1 Shared language across all ten references

- Dark canvas, mostly true black, with soft translucent cards.
- Large corner radii (20 to 32), pill-shaped chips and buttons, circular icon buttons.
- Hairline borders and a slightly brighter top rim ("rim light").
- Oversized numerals with a small unit and a quiet label.
- Data embedded in the card surface, not framed as "analytics widgets".
- Floating, detached navigation.
- Body / muscle figures as the signature visual for training data.
- Near-monochrome palette with one rare highlight.
- A single, dominant, high-contrast action pill (white on dark).

## 3.2 What we take from each reference

- **Dropset (4 screens):** large left-aligned title with two circular glass buttons (filter, add); asymmetric grid of cards; folder-tab cards for programs and routines; circular count badges; body weight card with "logged X ago"; "Volume lifted, last 7 days" wide card; contribution-style months grid; bottom "in progress" drawer with grabber, timer and resume arrow.
- **Lift AI:** Today hero with the day name in a dashed rounded outline, metadata pills (duration, exercises), white Start Workout pill; three-up stat cards with deltas; pill-shaped 30-day consistency grid (solid = done, outlined = planned, accent outline = today); volume card with smooth area chart; weekly reps bar chart with day letters; body weight card with goal progress; floating glass tab bar.
- **"Today's workout" screen (Are):** top bar with circular buttons and a central pill; muscle focus carousel with "Growing" status and dot scale; exercise capsules with set count and green progression badge ("up 2.5 kg"); white Start workout button.
- **Movo:** front and back muscle figures; "This week / Last week" segmented control with white selected state; legend pills; nav active state as a soft glow behind icon and label.
- **PaceFuel:** activity selector carousel; index number with delta; splits-per-km table; horizontal zone bars; floating dock with raised central action. We do NOT take the glowing 3D wireframe figure or the cyber feel.
- **Aura AI:** large soft greeting with ambient glow; pill message input with plus and quick-action chips; date capsules with a highlighted selected day; history list capsules with circular icon and overflow menu; floating dock with a raised central assistant action. We do NOT take heavy purple gradients or a chat-first home.
- **Turn Steps Into a Journey:** week strip of circles with checkmarks and a rest-day glyph; centered hero number; trio of metric cards; progress track with milestone nodes (reused as the program progress track); soft radial glow from the bottom edge.
- **Nike Run Club:** glass over desaturated photography (onboarding and summary only); white and glass button pair; 2x2 summary grid of glass cards; light summary screen (informs the future light scheme). We do NOT use photo backgrounds in core screens.

## 3.3 Explicit rejections

- Rank tiers with colored badges (Bronze, Gold, Wood). Too gamified.
- Full-screen gradient washes.
- Chat-first or voice-first home.
- Neon outlines, HUD brackets, techno fonts.
- Photography behind data screens.

---

# 4. CORE DESIGN PRINCIPLES

1. **Data is the visual content.** `55.0 kg`, `359.7k`, `326 sets`, a muscle heat map and an 8-week curve create the interest. Avoid illustration.
2. **Depth over decoration.** Layers: canvas, atmosphere, content, glass, data, floating controls, system sheets.
3. **Hierarchy over density.** One obvious entry point per screen, readable in about one second.
4. **Workout usability overrides aesthetics.** The user is tired, sweaty, one-handed. Larger targets, fewer effects, no animation that delays logging.
5. **Glass is a material, not a gimmick.** It communicates layering. It must never reduce legibility, contrast, performance or usability.
6. **Accent is rare and meaningful.** In a monochrome system, luminance and space carry the hierarchy; the accent marks what is active, selected or progressing.
7. **Adapt to the device, not the other way around.** The theme and accent respect the user's system choices.
8. **When uncertain, reduce the effect by 30%.**

---

# 5. THEME ARCHITECTURE: SCHEME x ACCENT

The theme is the product of two independent axes.

```text
THEME = Scheme (dark | light)  x  Accent (a seed color)
```

- **Scheme** decides base, surface and text colors. It follows the device (System), or the user forces Dark or Light.
- **Accent** decides the highlight color. It never changes layout, contrast rules or semantic colors.

Components consume a single `theme` object. They never import a static palette for accent or text.

## 5.1 Accent resolution order

```text
1. User choice in Settings   (Silver | Preset | Custom, or System on Android 12+)
2. System accent             (Android 12+ Material You, only when "System" is chosen)
3. Default                   (Silver)
```

Default user choice:

- **Android 12+:** System (Material You).
- **Android 11 and below, and iOS:** Silver.

Both platforms show an accent picker in Settings and in onboarding.

## 5.2 Platform behavior (honest constraints)

- **Android 12+ (API 31+):** Material You provides wallpaper-derived system colors. The "System" option is available and re-resolves when the wallpaper or system theme changes (Android recreates the activity on a dynamic color change; the app must restore state).
  - The JS tonal generator needs real color values, not opaque `PlatformColor` handles. Read hex values with a module that returns them (for example `@pchmn/expo-material3-theme`, or Expo UI's Material colors API; verify maintenance at adoption time).
  - In System mode, use the system `primary` directly as `accent.primary` (it is already tone-correct for the scheme) and derive the rest of the accent set from it, still passing through the contrast checks in 5.5.
  - Only the accent comes from Material You. Surfaces, text and base stay on our black and porcelain palettes, so the app keeps a consistent identity on every wallpaper.
- **Android 11 and below:** no dynamic color. Silver or the user's choice.
- **iOS:** the OS does not expose a per-user accent color to apps. There is no "System" accent; the default is Silver and the user can pick any preset or custom accent. The app follows the system Light/Dark appearance and, on iOS 26, the native Liquid Glass tinting that adapts to the content behind it.
- A user's chosen accent and scheme are persisted and applied synchronously at launch to avoid a color flash (use a synchronous key-value store such as the Expo SQLite KV store or MMKV).

## 5.3 Default accent: Silver

Silver is a cool neutral with slight blue-gray tint. It makes the interface feel metallic and precise without color.

```ts
export const silver = {
  50:  '#F8F9FB',
  100: '#F2F4F7',
  200: '#E3E6EB',
  300: '#CDD1D8',   // accent.primary on dark
  400: '#B3B8C1',
  500: '#9AA0AB',
  600: '#7C828D',
  700: '#5E646E',
  800: '#3F444C',
  900: '#24272C',
  950: '#15171A',
};
```

How "color" works when the accent is silver: meaning is carried by **luminance and fill**, not hue.

- Active = brighter, filled or glowing.
- Inactive = dimmer, outlined or quiet.
- Selected = brighter surface plus accent text/icon.
- Progress = accent stroke over a ghost track.

This is why the system also works when the user picks a colored accent: the same rules apply, with hue added.

### Silver sheen (metal gradient)

A very restrained chrome gradient, used only on thin strokes and rings, never on large fills or text.

```ts
metal = ['#F7F8FA', '#BFC4CC', '#EEF0F3', '#8E949E'];
```

Allowed: progress ring strokes, the active dock indicator rim, PR halo rim, the top rim light of hero cards.
Not allowed: button fills, card fills, body text, backgrounds.

## 5.4 Presets

Presets are seeds. The full tonal ramp is generated (see 5.5).

```text
System   (Android 12+ only)  wallpaper-derived Material You primary
Silver   (default)           #CDD1D8   (dark)   #4B5059  (light)
Ice                          #9CC3FF
Violet                       #9B86FF
Mint                         #7FE0B5
Amber                        #F2C879
Rose                         #F29BB1
Custom                       any color the user picks (validated, see 5.5)
```

Seeds are scheme-independent. The generator picks the right tone for dark or light (silver resolves to `#CDD1D8` on dark and the graphite `#4B5059` on light).

## 5.5 Tonal generation and contrast enforcement

Do not hand-pick shades per accent. Generate a tonal ramp from the seed in a perceptual space (HCT/OKLCH). A suitable approach is the Material Color Utilities library (pure JS), or an OKLCH library.

For a given seed and scheme, derive:

```ts
accent = {
  primary,      // dark: tone ~80   light: tone ~40   (main active color)
  bright,       // dark: tone ~90   light: tone ~30   (pressed/hover/peak)
  muted,        // dark: tone ~60   light: tone ~50   (secondary data series)
  soft,         // primary @ 16% alpha (selected fills)
  faint,        // primary @ 7%  alpha (ambient tint)
  glow,         // primary @ 10% alpha (halos, ambient light)
  border,       // primary @ 35% alpha (accent hairline)
  onAccent,     // text/icon color to place on a primary-filled surface
  metal,        // 4-stop sheen derived from the ramp (silver uses the fixed sheen above)
};
```

Rules enforced in code, not by hand:

- `accent.primary` on the page background must reach at least **4.5:1** for text and icons, **3:1** for non-text graphics. If a custom seed fails, shift tone until it passes.
- Clamp chroma of very saturated custom seeds so the accent cannot cause "color soup" on large areas. (Ambient glows use alpha 10% or less, so any hue stays calm.)
- Never use accent as a large background fill.

## 5.6 Accent usage budget

Accent is allowed for:

- active / selected states (tab, chip, segmented control, date capsule)
- current set row highlight
- primary data series in charts and progress rings
- muscle heat map intensity
- PR moments
- "today" markers
- links and secondary text actions
- ambient glow behind hero content and PR cards

Accent is NOT allowed for:

- page or card backgrounds
- primary CTA fill (CTA is the scheme's high-contrast neutral, see 6.5 and 13.2)
- semantic states (success, warning, danger)
- body text
- more than about 10% of any screen's pixels

## 5.7 Semantic colors are independent of accent

```ts
semantic = {
  success: '#66E3A3',   // progression, completed, PR delta
  warning: '#F3C969',   // recovery caution, deload
  danger:  '#FF6B6B',   // destructive, failure to sync
  info:    '#7EA7FF',   // informational
};
```

- A semantic color always comes with an icon or label (never color-only).
- If a user's accent is within about 30 degrees of hue of a semantic color, semantic meaning is still conveyed by icon and label; the accent must not be used in status contexts.

## 5.8 Theme object

```ts
type Scheme = 'dark' | 'light';
type AccentChoice =
  | { kind: 'system' }
  | { kind: 'silver' }
  | { kind: 'preset'; id: 'ice' | 'violet' | 'mint' | 'amber' | 'rose' }
  | { kind: 'custom'; seed: string };

function resolveAccentSeed(
  choice: AccentChoice,
  systemSeed: string | null,
): string; // returns a seed; falls back to silver

function createTheme(scheme: Scheme, accentSeed: string): Theme;

interface Theme {
  scheme: Scheme;
  color: {
    background: { primary: string; secondary: string; elevated: string };
    surface: Surface;      // translucent fills
    surfaceSolid: Surface; // opaque equivalents for fallback tier
    text: Text;
    border: Border;
    accent: Accent;
    semantic: Semantic;
    cta: { fill: string; onFill: string };
  };
  type: TypeScale;
  space: Spacing;
  radii: Radii;
  shadow: Shadows;
  motion: Motion;
}
```

Provide `ThemeProvider` and `useTheme()`. The provider listens to system appearance changes and to settings changes.

## 5.9 Scheme selection

- Appearance setting: **System** (default), **Dark**, **Light**.
- The scheme follows the OS and switches live. Both schemes are v1 and both must pass the design-system showcase.
- Silver resolves to graphite on light (tone ~40) so it keeps contrast. This is why accents are tonal ramps, not fixed hex values.
- The Nike Run Club summary screen is the reference for the light direction: pale base, frosted white glass, monochrome route line.
- The primary CTA inverts with the scheme: near-white pill on dark, near-black pill on light (Sections 6.5 and 6.6).

---

# 6. COLOR TOKENS

Section 6.1 to 6.5 define the dark scheme. Section 6.6 defines the light scheme. Both expose the identical token names, so components never branch on scheme.

## 6.1 Foundation (dark)

True pitch black base. Depth comes from translucent white overlays, not from gray page colors.

```ts
background = {
  primary:  '#000000',  // page canvas
  secondary:'#050506',  // grouped sections, behind sheets
  elevated: '#0A0A0C',  // sheet and modal backdrop base
};
```

On OLED devices, black pixels are off, which saves battery and makes glass edges look sharper. Keep the system navigation bar and status bar matched to `background.primary` (edge-to-edge on Android).

## 6.2 Surfaces (translucent, over black)

```ts
surface = {
  ghost:     'rgba(255,255,255,0.025)',
  subtle:    'rgba(255,255,255,0.040)',
  regular:   'rgba(255,255,255,0.065)',  // standard card
  elevated:  'rgba(255,255,255,0.090)',  // floating cards, dock, sheets
  prominent: 'rgba(255,255,255,0.120)',  // rare hero control
  pressed:   'rgba(255,255,255,0.150)',
};

// Opaque equivalents (blur disabled or unavailable). Computed over #000.
surfaceSolid = {
  ghost:     '#070708',
  subtle:    '#0B0B0C',
  regular:   '#101012',
  elevated:  '#171719',
  prominent: '#1F1F22',
  pressed:   '#262629',
};
```

Alphas are slightly higher than a typical dark-gray UI because the base is pure black.

## 6.3 Text

```ts
text = {
  primary:   '#F5F5F7',
  secondary: 'rgba(245,245,247,0.66)',
  tertiary:  'rgba(245,245,247,0.45)',   // meets 4.5:1 on #000
  disabled:  'rgba(245,245,247,0.28)',
  inverse:   '#080809',
};
```

Hierarchy is visible through luminance. Do not use full white for every label.

## 6.4 Borders

```ts
border = {
  faint:   'rgba(255,255,255,0.05)',
  default: 'rgba(255,255,255,0.09)',
  strong:  'rgba(255,255,255,0.14)',
  accent:  accent.border,   // from the resolved accent
};
```

Default width: 1 px (hairline: `StyleSheet.hairlineWidth` where crisper). Avoid 2 to 3 px outlines on standard cards.

## 6.5 Primary CTA color

```ts
cta = { fill: '#F5F5F7', onFill: '#080809' };
```

The primary button is always the highest-contrast pill of the scheme: near-white on dark, near-black on light (6.6). It is independent of the accent so it stays the strongest element on the screen under any accent.

## 6.6 Light scheme tokens ("Porcelain")

Light glass is frosted white over a soft cool-gray base, in the spirit of iOS Liquid Glass in light mode. Elevation is expressed by brightness and soft shadow rather than by dark overlays.

```ts
background = {
  primary:   '#F3F4F6',  // page canvas
  secondary: '#ECEEF1',  // grouped sections
  elevated:  '#FFFFFF',  // sheets, modals
};

surface = {                       // white-alpha over the base
  ghost:     'rgba(255,255,255,0.35)',
  subtle:    'rgba(255,255,255,0.50)',
  regular:   'rgba(255,255,255,0.68)',   // standard card
  elevated:  'rgba(255,255,255,0.80)',
  prominent: 'rgba(255,255,255,0.92)',
  pressed:   'rgba(235,237,241,0.90)',
};

surfaceSolid = {                  // opaque fallbacks over #F3F4F6
  ghost:     '#F7F8F9',
  subtle:    '#F9FAFB',
  regular:   '#FCFCFD',
  elevated:  '#FFFFFF',
  prominent: '#FFFFFF',
  pressed:   '#E7E9ED',
};

text = {
  primary:   '#0B0B0D',
  secondary: 'rgba(11,11,13,0.72)',
  tertiary:  'rgba(11,11,13,0.58)',    // meets 4.5:1 on #F3F4F6
  disabled:  'rgba(11,11,13,0.32)',
  inverse:   '#F5F5F7',
};

border = {
  faint:   'rgba(11,11,13,0.05)',
  default: 'rgba(11,11,13,0.08)',
  strong:  'rgba(11,11,13,0.14)',
  accent:  accent.border,
};

cta = { fill: '#0B0B0D', onFill: '#F5F5F7' };
```

Light-specific rules:

- Rim highlight is white on the top-left and a faint dark edge on the bottom-right (reverse of dark), so glass reads as a lit pane, not a gray box.
- Shadows are visible in light and are the main elevation cue (Section 10.3).
- Atmosphere is a barely perceptible cool-white to pale-gray vertical wash; no colored glow except `accent.glow` at 6% on hero moments.
- Untrained muscle fill is `#DADDE2`; heat steps use the (graphite) accent at 25 / 50 / 80%.
- Semantic colors use slightly deeper tones on light to keep 3:1 or better against the base (generated by the same contrast enforcement as the accent).

---

# 7. GLASS MATERIAL SYSTEM

## 7.1 Liquid Glass as the reference material

The glass language follows Apple's Liquid Glass. Its defining properties:

- live backdrop blur of whatever is behind
- lens-like refraction at the edges (a curved bevel that bends the background)
- a bright specular rim that responds to light angle
- vibrancy: the backdrop is slightly saturated and brightened
- adaptive tint: tends light or dark depending on the content behind
- soft shadow, and fluid morphing and press response (glass elements can merge and stretch)

Apple's guidance applies here: glass belongs to the **controls and navigation layer** that floats above content, not to the content itself. Content cards are quiet translucent surfaces so the glass layer keeps its meaning.

Two kinds of glass:

- **Surface glass (cheap):** translucent fill + gradient hairline + inner highlight + optional ambient glow. Used for almost all content cards. Identical on every platform and tier.
- **Backdrop glass (Liquid Glass):** real backdrop blur, with refraction where supported. Used only on the control layer.

## 7.2 Backdrop glass (Liquid Glass) is allowed ONLY on

- tab bar / dock
- mini workout bar
- bottom sheets
- rest timer floating card
- circular header buttons and toolbars
- top bar when content scrolls beneath it
- modal confirmations and menus

Everything else uses surface glass.

On iOS 26 the system materials are used wherever the platform draws them (native tabs, toolbars, system sheets, navigation buttons). Do not stack our own glass on top of system glass.

## 7.3 Glass variants

```text
Ghost     fill: surface.ghost      border: faint     backdrop: none
Regular   fill: surface.regular    border: default   backdrop: none (surface glass)
Elevated  fill: surface.elevated   border: strong    backdrop: Liquid Glass, standard
Prominent fill: surface.prominent  border: strong    backdrop: Liquid Glass, strong; rare
```

Every variant also carries:

- **Gradient hairline (rim):** 1 px border that fades from a bright edge at top-left to a faint edge at bottom-right. Dark: `rgba(255,255,255,0.18)` to `0.04`. Light: white to `rgba(11,11,13,0.06)`. This is the faux specular rim used wherever real refraction is not available (also seen in the Dropset folders).
- **Top highlight:** a 1 px inset line at the top edge, 6 to 10% of the rim color.
- **Shadow:** low opacity, broad radius (Section 10.3).
- **Optional ambient glow:** `accent.glow` radial behind (never over) content.
- **Tint:** an optional scheme-aware tint over the glass. Glass buttons for primary controls may take `accent.soft`; never a solid accent fill.

## 7.4 Implementation tiers (platform-aware)

Pick the highest tier the device supports. The choice is made once by a `useGlassTier()` hook and exposed through `GlassSurface`. Components never branch on platform themselves.

```text
Tier A  iOS 26+
        Native Liquid Glass via expo-glass-effect (GlassView, GlassContainer for elements that should
        merge/morph, isInteractive for pressables). Guard with isLiquidGlassAvailable() and
        isGlassEffectAPIAvailable(). Native tabs, toolbars and system sheets already draw this material.

Tier B  Android 13+ (API 33+)
        Liquid Glass emulation via our native Android glass module: live backdrop blur + lens refraction
        (AGSL runtime shader) + vibrancy + specular rim + soft shadow. Chromatic aberration on press only.

Tier C  iOS < 26, and Android 12 (API 31-32)     [OPTIONAL, post-v1 backlog]
        Backdrop blur (expo-blur; on Android blurMethod="dimezisBlurViewSdk31Plus" with a BlurTargetView)
        + vibrancy tint + faux specular rim (gradient hairline + top highlight). No refraction.

Tier D  Anything not covered above, or reduced transparency
        Opaque tinted surface (surfaceSolid) + faux rim. No blur.
```

v1 scope: ship Tiers A and B plus D as the universal fallback. The owner's devices (iPhone 14 on iOS 26, Android 15) exercise A and B. Tier C is only built if contributors on older OS versions ask for it.

Emulation parameters (starting values for Tier B; tune on device):

```text
blur radius          8 to 16 dp
lens refractionHeight 12 to 24 dp      (bevel height)
lens refractionAmount 24 to 40 dp      (pixel displacement)
vibrancy             1.2x saturation
surface tint         surface.elevated alpha
specular angle       45 degrees (top-left light)
chromatic aberration press state only
```

Implementation note on the native Android module (native Kotlin work is approved by the owner):

- Skia cannot blur or refract real React Native views behind it; Skia backdrop filters only see content drawn in the same canvas. Skia is therefore used for charts, ambient light and the muscle map, not for the glass material.
- The Android glass material needs a native view that captures the window content behind it. Candidates to evaluate in a time-boxed spike on a mid-range device: the community Android liquid-glass Expo modules, `@uginy/react-native-liquid-glass`, or our own small Expo module (Kotlin) built on the Compose Backdrop library by Kyant0. Whichever wins is wrapped behind `GlassSurface` so it can be swapped without touching screens.
- If the spike fails the performance bar (Section 21) on a mid-range Android device, Tier B is shipped as Tier C and revisited later.

Rules:

- The tier is forced to D when the user enables reduce transparency or when the app's own Glass setting is "Reduced".
- Surface glass (cards) is identical across tiers; only backdrop glass changes.
- Never nest backdrop glass. Always `overflow: 'hidden'` on rounded blurred surfaces.
- Keep blur moderate on Android; text over glass must still meet contrast (use a scheme-aware tint under text).
- Use one `GlassContainer`-style group for adjacent glass controls so they merge consistently on iOS 26, and mimic the grouping on Android with a shared backdrop layer.

## 7.5 Glass quality rule

The correct result:

```text
dark or light environment
+ barely visible atmospheric light
+ quiet translucent content surfaces
+ a clear Liquid Glass control layer floating above
+ gradient hairline rim
+ sharp, readable content
```

The incorrect result:

```text
colored gradient background
+ 50% opacity card
+ huge blur
+ bright white border
+ glowing text
```

---

# 8. ATMOSPHERE AND LIGHT

Backgrounds are the scheme base with at most one soft light source. Light is rendered with Skia (or a radial gradient), at very low opacity.

```text
DARK    TOP     white @ 4 to 6%         (cool, neutral "sky light")
        BOTTOM  accent.glow @ 6 to 10%  (reference: soft glow from the bottom edge)
LIGHT   TOP     white @ 60 to 80%       (soft sheen on the pale base)
        BOTTOM  accent.glow @ 4 to 6%
```

With the silver default both read as a cool white sheen. With a colored accent the bottom glow takes that hue at low alpha.

Contextual glows (behind, never over content): hero workout card, PR card, muscle figure halo, recovery score, coach greeting.

Rules:

- Glow belongs behind content.
- No large obvious blobs. No continuously animated glows.
- Static by default; at most one slow, interruptible entrance on hero moments.

---

# 9. TYPOGRAPHY

System typeface on both platforms (SF Pro on iOS, Roboto/system on Android). No display or "futuristic" font; the future-facing character comes from composition and scale contrast.

```ts
type = {
  heroMetric: { size: 56, lineHeight: 60, weight: '700', tracking: -1.8 },
  display:    { size: 38, lineHeight: 42, weight: '700', tracking: -1.1 },
  screenTitle:{ size: 32, lineHeight: 38, weight: '700', tracking: -0.8 },
  sectionTitle:{size: 22, lineHeight: 28, weight: '600', tracking: -0.35 },
  cardTitle:  { size: 17, lineHeight: 22, weight: '600' },
  body:       { size: 16, lineHeight: 22, weight: '400' },
  bodySmall:  { size: 14, lineHeight: 20, weight: '400' },
  label:      { size: 12, lineHeight: 16, weight: '600', tracking: 0.25 },
  micro:      { size: 11, lineHeight: 14, weight: '500' },
};
```

## 9.1 Numeric typography (signature element)

- Metrics use large size, strong contrast and `fontVariant: ['tabular-nums']` so digits do not jitter (timers, weights, reps).
- The unit is about 40% of the number's size and uses `text.secondary`.
- Deltas are small and use semantic color plus a direction icon.

```text
55.0 kg        17 workouts       326 sets       359.7k volume
```

## 9.2 Scaling

Respect OS text scaling. Cap hero metrics with `maxFontSizeMultiplier` (about 1.2) so layouts do not break; body text may scale further. Active workout controls must remain usable at large text sizes.

---

# 10. SPACING, RADII, SHADOWS, GRID

## 10.1 Spacing

```ts
space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40, huge: 48, section: 64 };
```

Default horizontal inset is 20. Hero areas may use 24. Spacing is a visual feature; do not compress screens.

## 10.2 Radii

```ts
radii = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 28, hero: 32, pill: 999 };
```

- small input 12 to 16
- standard card 24
- hero card 28 to 32
- bottom sheet top corners 28 to 32
- folder-tab card 28
- chips, buttons, dock indicator: pill

## 10.3 Shadows

Low opacity, broad radius, soft falloff. No harsh web drop shadows.

```ts
shadow = {
  subtle:   { opacity: 0.10, radius: 12, offsetY: 6 },
  medium:   { opacity: 0.14, radius: 24, offsetY: 10 },
  floating: { opacity: 0.20, radius: 36, offsetY: 16 },
};
```

Dark: shadows are barely visible on pure black, so elevation is communicated mainly by fill brightness and the rim highlight.
Light: shadows are the main elevation cue. Use the same three levels with a cool neutral shadow color at roughly 1.5x the dark opacity.

## 10.4 Layout

- Use flex layout and safe areas. Avoid absolute positioning for core content.
- Quick metric trio on standard phones; 2 columns or a horizontal scroll on narrow widths.
- Use asymmetric card sizing (wide hero + small squares), not ten identical stacked cards.

---

# 11. ICONOGRAPHY

One family: Lucide (outline, rounded stroke, about 1.75 px). Do not mix emoji, filled symbols and other packs in the same hierarchy.

- Sizes: 20 (inline), 24 (buttons, dock), 28 (hero).
- Active dock icon uses the accent; inactive uses `text.tertiary`.
- Platform-owned affordances (back chevron behavior, share sheet) follow the OS.

---

# 12. NAVIGATION

## 12.1 Tab bar (platform-split)

MVP tabs, identical on both platforms (no raised center action, for parity):

```text
HOME     WORKOUT     PROGRESS     PROFILE
```

Nutrition becomes a fifth tab (or lives inside Home) once it ships. Never exceed 5. The big "Start workout" action lives in the Today hero and the mini workout bar, not in a raised tab.

**iOS: native tabs** (Expo Router native tabs, `expo-router/native-tabs`, or `unstable-native-tabs` on older SDKs).

- On iOS 26 the system draws the Liquid Glass tab bar, including minimize-on-scroll. On iOS < 26 it is the standard blurred system tab bar.
- `tintColor` comes from `accent.primary`. System-drawn backgrounds are not customized on iOS 26.
- Icons use SF Symbols via the native tabs API; this is the one allowed exception to the single-icon-family rule because the system owns the tab bar.

**Android: custom floating glass dock** (`FloatingTabBar`).

- Floats above the bottom safe area with a horizontal inset (about 16 to 20), pill-ish radius (about 28).
- Backdrop glass per the active tier (Section 7.4), gradient rim, floating shadow.
- Active item: accent icon + soft accent pill glow behind (Movo pattern) + label, with a spring on the indicator.
- Inactive: `text.tertiary`, label hidden or quiet.
- Respect the Android back gesture and edge-to-edge insets.
- Content scrolls under the dock; screens reserve bottom padding equal to dock height + inset.

Both platforms: hidden or minimized during the active workout focus mode, with the mini workout bar taking its place (12.2).

Fallback: if native tabs prove unstable for a given SDK, use the custom `FloatingTabBar` on iOS too, built on Tier A glass.

## 12.2 Mini workout bar

Shown across the app while a workout is in progress. Source: Dropset "17:20 Legs focus, In progress" drawer.

```text
[ grabber ]
17:20        Legs focus · In progress                    [ ↑ resume ]
```

- **iOS 26+:** use the native bottom accessory above the tab bar (`NativeTabs.BottomAccessory`), which gets Liquid Glass and the correct collapsing behavior for free.
- **iOS < 26 and Android:** a custom `MiniWorkoutBar` with backdrop glass, docked just above the tab bar or dock.
- Tap or swipe up to return to the active workout.
- Shows elapsed time (tabular numerals) and, when resting, a compact rest countdown.

## 12.3 Top bar / headers

Two patterns:

1. **Large title (Dropset):** left-aligned screen title + up to two circular glass icon buttons on the right (filter, add).
2. **Compact context bar (Are / Aura):** circular button left, central pill (mode or selector), circular button right.

When content scrolls under a header, transition to a backdrop-glass bar. Otherwise keep it transparent. On iOS 26, prefer system toolbar and header buttons (they get Liquid Glass automatically) over custom circular buttons; on Android use our circular glass `IconButton`.

## 12.4 Routing

Expo Router with a native stack. The active workout and bottom sheets are presented modally (native form sheets on iOS, which get Liquid Glass backgrounds on 26+). Do not mix unstyled default navigation chrome with custom UI.

---

# 13. COMPONENT SPEC

## 13.1 Primitives

`Screen`, `Text`, `Stack`, `Row`, `Divider`, `GlassSurface`, `AmbientLight`.

`Screen` owns: safe area, background, optional atmosphere, keyboard handling, standard inset, status bar, scroll behavior. Screens never recreate these.

## 13.2 Buttons

- **PrimaryButton:** high-contrast pill (`cta.fill`, near-white on dark and near-black on light) with `cta.onFill` text/icon, height 52 to 56, strong type. Dominant actions only: Start Workout, Complete Set, Save Routine, Stop Workout. One per screen.
- **GlassButton:** translucent pill with hairline. Secondary actions, filters.
- **SecondaryButton:** outlined / subtle fill.
- **IconButton:** circular glass, 44 minimum, 48 preferred.
- **DangerButton:** semantic danger tint, always behind a confirmation for destructive actions.
- **TextButton:** accent text for links.

Pressed states: `surface.pressed` or slight scale (0.98) with a spring.

## 13.3 Chips and pills

- Default chip is quiet (ghost fill).
- Selected chip: brighter surface, `text.primary`, optional accent tint/outline.
- Metadata pills (duration, exercises) are small, with an icon and `text.secondary`.
- Do not turn every label into a pill.

## 13.4 Segmented control

Glass track. Selected segment: brighter fill, primary text, subtle accent. Used for time ranges (4W / 8W / 6M / 1Y) and This week / Last week.

## 13.5 Cards

- `GlassCard` (base), `MetricCard`, `HeroCard`, `InsightCard`, `WorkoutCard`, `FolderCard`, `ExerciseCard`, `ProgressCard`, `BodyMetricCard`, `RecoveryCard`, `NutritionMetricCard`.
- One strong visual idea per card. A card does not need every element.
- **FolderCard (Dropset):** card with a tab notch at the top-left, used for programs and routine groups; shows name and item count.
- **Dashed selection outline (Lift AI):** a dashed rounded rectangle around the day name on the Today hero, signalling "planned / current". Use sparingly (hero only).
- **Count badge:** a small circular badge with a number or progress ring (sessions this period).

## 13.6 Input

- Large numeric fields, steppers, wheels, bottom sheets. Not web forms.
- Weight and reps use big stepper targets; keyboard entry always available.
- Search field: subtle surface glass, with filter chips below.
- Pill message input with a plus and quick-action chips (Aura) for the Coach.

## 13.7 Bottom sheet

Backdrop glass (opaque fallback), 28 to 32 top radius, drag indicator, clear title, keyboard-aware, safe-area aware. Used for exercise picker, set options, filters, date range, metric edit, substitutions, routine actions.

## 13.8 Fitness components

- `SetRow`, `ActiveSetCard`, `RestTimer`, `PRCard`, `ConsistencyGrid`, `WeekStrip`, `MuscleMap`, `MuscleFocusCard`, `ProgressChart`, `ProgramTrack`, `ZoneBars`, `MacroCard`, `RecoveryCard`, `HistoryItem`, `DateCapsule`.

---

# 14. SCREEN SPECIFICATIONS

Visual density by screen: Home medium, Active workout medium-high information with low interaction complexity, Progress medium, Nutrition medium, Coach low-medium, Settings medium-low.

## 14.1 Onboarding

- Black canvas with a single soft light. Optional desaturated, high-contrast photo as the first-launch backdrop only (Nike Run Club pattern).
- One question per screen: goal, experience, training days, style, units, optional body metrics, optional health permission (explain value before the system prompt), create first routine.
- Primary CTA pill at the bottom; glass secondary for "Skip".
- Includes an Appearance step: Theme (System / Dark / Light) and Accent (Silver / presets / Custom, plus System on Android 12+) with a live preview. Same step on both platforms.

## 14.2 Home

Answers: what am I training today, what do I do now, how consistent am I, am I progressing, anything important?

Hierarchy:

```text
Greeting / date   +  circular buttons (right)
WEEK STRIP                     (days with check circles, rest-day glyph, today highlighted)
TODAY HERO                     (Lift AI + Are)
MUSCLE FOCUS CAROUSEL          (optional on Home)
QUICK METRICS                  (workouts, sets, volume + deltas)
30-DAY CONSISTENCY GRID
VOLUME (8-week trend)  |  WEEKLY REPS (bar)      (two-up)
BODY WEIGHT                    (with goal progress)
TRAINING INSIGHT               (only when data exists)
```

- **Today hero:** label "Today", day name (e.g. Push) inside the dashed outline, subtitle with muscles, metadata pills (about 62 min, 6 exercises), primary **Start Workout** pill with play icon. Optional right-side subtle anatomy or progress ring. Do not overcrowd.
- **Week strip (Turn Steps):** 7 circles. Completed = filled with check. Rest day = snowflake/moon glyph. Planned = outline. Today = accent ring.
- **Quick metrics:** three square cards with icon, number, label, optional delta. No paragraphs.
- **Consistency grid:** pill-shaped cells. Solid bright = completed, outlined = planned, accent outline = today, ghost = rest. Header "Last 30 days" + count/goal. Rest days are valid; never imply more is always better.
- **Body weight card:** big number, unit, "Logged 16h ago", goal text such as "15 kg to go".
- Do not put every statistic on Home.

## 14.3 Workout library

Title "Workouts" with filter and add circular buttons. Content:

- Top: asymmetric grid of cards: a wide "Today / Active program" card, **FolderCards** for programs and routine groups (with item counts), small routine cards with a circular count badge and weekday label.
- Sections: Today, Programs, Routines, Recent.
- A body weight and a "Volume lifted, last 7 days" wide card may appear in the library per the Dropset reference, but only if they do not push routines out of view.

## 14.4 Routine / program detail

- Routine card: name, exercise count, muscles, last trained, optional small muscle map.
- Exercise list as capsules (Are pattern): name left, set count right, optional progression badge (`semantic.success` with arrow, e.g. "up 2.5 kg").
- **Program track (Turn Steps):** horizontal progress track with the current week node, milestone markers (deload, test week), and a finish flag. Used for program progress.
- Date capsules (Aura) for the weekly schedule; selected day highlighted with accent.

## 14.5 Active workout (primary UX)

Visual effects are reduced here. Larger touch targets, simpler layouts.

```text
PUSH A                                   •••
42:18   Workout time

BENCH PRESS      Chest · Compound
LAST SESSION     60 × 8   60 × 8   60 × 7

SET   PREVIOUS    KG     REPS    ✓
1     60 × 8      60     8       ✓   (quiet)
2     60 × 8      60     8       ✓   (quiet)
3     60 × 7      [60]   [8]     ○   (current: elevated + accent)
```

- **Set table** (splits-style, PaceFuel): touch-friendly rows; completed rows become quieter; current row is elevated with an accent edge.
- **Active set mode:** a prominent current-set card with large `−` / `+` steppers (including quick +2.5 / −2.5), a keyboard option, and a primary **Complete Set** pill.
- **Complete sequence (180 to 300 ms, never blocks input):** tap, medium haptic, row settles, PR check, rest timer appears, next set becomes current.
- **Rest timer:** floating glass card with ring progress, `-15` / `SKIP` / `+15`, shows next target. Stays visible while navigating within the workout. Timer uses an absolute end time, not a ticking counter.
- **Finish:** top-right overflow leads to a confirmation sheet, or a deliberate bottom action. Never an accidental single tap.
- Previous performance is always visible.

## 14.6 Workout summary

- Title "Workout complete", workout name.
- **2x2 glass grid (Nike Run Club):** duration, sets, volume, PRs.
- PR rows with the PR treatment (14.8 / 15.3).
- Muscle distribution for the session (small muscle map).
- Subtle celebratory glow, no forced confetti. Near-white "Done" pill and glass "Share" / "View details".

## 14.7 Progress

```text
PROGRESS            [ 4W ] [ 8W ] [ 6M ] [ 1Y ]
STRENGTH            (estimated 1RM line, big current value, delta)
VOLUME              (area chart + total)
CONSISTENCY         (grid / weekly bars)
MUSCLE GROUPS       (This week / Last week + muscle map + horizontal bars)
BODY                (weight trend)
PERSONAL RECORDS    (list)
```

- Progressive disclosure: do not show six full graphs at once.
- Muscle section uses the Movo segmented control and front/back figures, plus **ZoneBars** (PaceFuel) for sets per muscle group.

## 14.8 Exercise detail

- Header: name, muscles, equipment.
- Big current estimated 1RM + delta, line chart.
- History as a table (splits-style): date, best set, volume.
- PR list. Substitutions entry. Notes.

## 14.9 Body

- Hero: current weight in `heroMetric`, 7-day average, trend chart (daily points + weekly average + trend line; avoid reacting to one day).
- Measurements list (chest, waist, arms, thighs ...), progress photos (private, local-first).

## 14.10 Nutrition (Phase 4)

- Hero: calories vs target, large.
- Macro grid: protein, carbs, fat, fiber as quiet cards with thin rings/bars. Use accent + neutral tones, not four saturated colors.
- AI estimates (later) always marked "Estimated" with a confidence indicator.

## 14.11 Recovery

Calmer than workout screens. Score in `heroMetric` with a quiet label, inputs listed below (sleep, HRV trend, resting HR, training load). If data is insufficient show "Recovery context: not enough data yet" and a connect-health action. Never imply a medical diagnosis; never show a score built from missing data.

## 14.12 Coach

- Not a ChatGPT clone. Landing is a contextual briefing: soft greeting with ambient glow (Aura), one or two insights based on real data, then pill input with plus and quick-action chips such as "Start planned workout", "Make it 45 minutes", "Review progress".
- Conversation exists one level deeper.
- Subtle intelligence motif: a small spark/waveform glyph and an elevated glass surface; no robot imagery, no gradient border on every AI element, no "AI" label on every sentence.

## 14.13 Profile and settings

- Profile summary as a system dashboard (name, goal, training days, body stats).
- Grouped glass sections, not one card per row:
  - Training: units, rest timer, training days, RPE / RIR
  - Health: Apple Health / Health Connect
  - Notifications
  - **Data & Sync:** storage mode (Local only / Cloud sync), server connection (URL fields, sign in), sync status row, Back up now / Restore, Export JSON / CSV. Details in 14.13.1.
  - Privacy: data controls, export
  - **Appearance:** Theme (System / Dark / Light), **Accent** (Silver / presets / Custom with live preview, plus System on Android 12+), Glass (Auto / Reduced), Haptics
  - About
- The Accent picker shows the resolved accent swatch. On Android 12+ it includes "System (Material You)" with the note "Matches your wallpaper colors". On iOS the picker has no System entry; Silver is the default.

### 14.13.1 Data & Sync

- Default is **Local only**: data lives on this device, works fully offline, and nothing leaves the phone. First-run and onboarding never ask for an account.
- **Cloud sync** is opt-in. Choosing it opens a short sheet: server URL(s), then sign in or create account. The same account on both phones gives the same data. Switching back to Local only keeps all data on the device and stops syncing; it never deletes cloud data without an explicit confirmation.
- Turning sync on uploads existing local data once; the sheet states this plainly.
- The API key for the AI coach is never synced.
- Sync status is a single quiet row with one of these states (text plus a small status dot, using semantic colors, never the accent):
  - `Local only` (neutral)
  - `Syncing…` (neutral, subtle pulse, respects reduced motion)
  - `Synced · 2 min ago` (success)
  - `Offline · saved locally, will sync later` (neutral, not an error)
  - `Sync paused · sign in again` (warning, with action)
  - `Can't reach server` (danger, with Try again and a link to connection settings)
- The mini workout bar and the active workout screen never show sync state and never block on it.
- Backup/restore (a single JSON file via the system share sheet) is available in both modes and is the recovery path after a free-Apple-ID re-sideload.

---

# 15. DATA VISUALIZATION

## 15.1 Chart rules

- Built with Skia + d3 scales/shapes. Do not ship chart-library default styling.
- Minimal axes, subtle or no grid, one dominant series in `accent.primary`, comparison series in `text.tertiary`.
- Faint area gradient fill from accent 28% to 0%.
- Labels only where useful. Selected point may glow softly.
- Do not smooth sparse data in a way that implies measurements between points.

## 15.2 Chart types

- Smooth area (volume), line (estimated 1RM, weight trend), vertical bars with day letters (weekly reps), progress ring (goals, counts), contribution/pill grid (consistency), horizontal zone bars, dot scale (0 to 18 sets), program track.

## 15.3 PR moment

```text
PERSONAL BEST
BENCH PRESS
65 kg × 8
+2 reps
```

- Elevated glass with accent halo and metal rim, tiny `semantic.success` delta, medium/success haptic, optional animated number. No flashing.

## 15.4 Colors in charts and the accent

Because the accent is dynamic, charts read `theme.color.accent.*`. In silver they are luminous white-gray strokes on black; in colored accents they pick up the hue. Both must pass the 3:1 non-text contrast rule.

---

# 16. MUSCLE MAP

Signature component. Front and back figures.

States:

```text
untrained        very dark neutral         (#1A1A1D)
light            accent @ 25%
moderate         accent @ 50%
high             accent @ 80%, with soft outer halo
```

- Each region also exposes its value (sets) in a tappable legend or list so meaning is never color-only.
- Modes: Today's workout, This week, Last week, Program distribution.
- Label as "logged sets / training distribution", never as exact muscle growth.
- Muscle cards in a carousel (Are): torso figure with one or two highlighted regions, a status text ("Growing" with an up arrow), and a **dot scale** (0 to 18) showing weekly sets.
- Figure style: dark line-art, inactive regions nearly invisible, halo beneath the figure.
- Art must be original or properly licensed. Do not copy proprietary anatomy art from the references.

---

# 17. MOTION AND HAPTICS

## 17.1 Motion

Motion communicates physicality. Built with Reanimated and Gesture Handler.

- Micro: 100 to 180 ms (press states, check, chip selection).
- Standard: 180 to 260 ms (card expansion, navigation state, chart selection).
- Expressive: 260 to 420 ms (PR reveal, sheet presentation, workout completion).
- Prefer spring physics for cards, draggable surfaces, dock indicator and selection.

Animations must be interruptible, fast, purposeful and consistent. Never animate every card on load, large glows continuously, charts unnecessarily, or workout controls in a way that delays logging.

Respect reduced motion: replace movement with fades or instant changes.

## 17.2 Haptics

```text
selection   filters, tabs, segmented control
light       set edit, normal action
medium      set completion
success     PR, workout completion
warning     destructive confirmation
```

Avoid haptic spam.

---

# 18. STATES

- **Loading:** skeletons matching real layout (same card dimensions), quiet luminance change, no aggressive shimmer. For instant local data, show no artificial loader.
- **Empty:** minimal text + one action, e.g. "NO WORKOUTS YET. Your training history starts with your first session." [ Create routine ]. No stock illustrations.
- **Error:** human language, no implementation terms. Example: "Couldn't sync. Your workout is saved on this device. We'll retry when you're online." [ Try again ]
- **Offline:** a small neutral indicator ("Offline · saved locally"). Offline is not a failure. Never block logging.
- **Disabled / pressed / selected** states are shown in the design-system showcase.

---

# 19. PLATFORM ADAPTATION

Shared across platforms: visual language, typography hierarchy, spacing, cards, charts, accent logic.

iOS:
- Native Liquid Glass (Tier A) on iOS 26+ for tabs, toolbars, sheets, bottom accessory and our own floating controls; blur + faux rim (Tier C) below.
- Native tabs and native form sheets.
- Live Activity / Dynamic Island for the rest timer; home screen widgets.
- Apple Health permissions with usage strings.
- Accent picker (Silver default, presets, custom). Light and dark follow the system.

Android:
- Edge-to-edge, system bars matched to the canvas and scheme.
- Accent picker with an extra "System (Material You)" entry on Android 12+.
- Liquid Glass emulation (Tier B) on Android 13+, blur + faux rim (Tier C) on Android 12, opaque (Tier D) below.
- Custom floating glass dock; ongoing notification (foreground service) for the rest timer; home screen widgets.
- Health Connect permissions, back-gesture behavior, native share sheet.

Android takes on the Liquid Glass look as a deliberate brand choice, not as an iOS imitation. Navigation, back behavior, haptics, permission flows and system sheets still follow Android conventions. Share the design language; respect platform behavior.

---

# 20. ACCESSIBILITY

Required:

- VoiceOver and TalkBack labels on all interactive elements and charts (summaries for charts and the muscle map).
- Contrast: text 4.5:1 minimum, graphics 3:1, enforced by the tonal generator for any accent (Section 5.5).
- No color-only status; always icon or text.
- 44 pt minimum touch target; active workout controls 48+.
- Scalable text with capped hero metrics.
- Reduced motion and reduced transparency support.
- If glass and accessibility conflict, accessibility wins.

---

# 21. PERFORMANCE BUDGET

- Maximum 3 backdrop-glass views visible at once (tab bar or dock, mini bar, plus one sheet or header).
- No backdrop glass inside scrolling list items. Use FlashList for long lists.
- One blur/capture target per screen on Android; refraction shaders run only on the tab bar, mini bar, sheets and circular header buttons.
- Frame budget on the owner's Android 15 phone (reference device): glass screens must hold 60 fps while scrolling; if not, Tier B downgrades to Tier C automatically (a runtime frame-drop guard) and a remote flag can disable it.
- Charts rendered in Skia; avoid re-creating paths each frame.
- Active workout interactions must feel instant. Do no heavy analytics synchronously during set logging. The active workout screen limits backdrop glass to the rest timer card and the mini bar.
- Test on a mid-range Android device early. If a feature drops frames, drop the effect, not the frame rate.

---

# 22. DESIGN SYSTEM CODE STRUCTURE

```text
apps/mobile/src/design-system/
├── tokens/
│   ├── palette.ts          (silver ramp, presets, semantic)
│   ├── schemes.ts          (dark + light base, surface, text, border, cta)
│   ├── surfaces.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radii.ts
│   ├── shadows.ts
│   └── motion.ts
├── theme/
│   ├── createTheme.ts
│   ├── accent/
│   │   ├── resolveAccent.ts
│   │   ├── tonalPalette.ts       (seed -> ramp, contrast enforcement)
│   │   └── useSystemAccent.ts    (Android 12+ Material You hex, null elsewhere)
│   ├── ThemeProvider.tsx         (scheme x accent, persisted synchronously)
│   └── useGlassTier.ts           (A | B | C | D, reduce-transparency and frame-drop guard)
├── glass/
│   ├── GlassSurface.tsx          (single entry point; picks the tier)
│   ├── GlassSurface.ios.tsx      (Tier A native, Tier C blur)
│   ├── GlassSurface.android.tsx  (Tier B emulation, C blur, D opaque)
│   └── Rim.tsx                   (gradient hairline + top highlight)
├── primitives/    Screen, Text, Stack, Row, Divider, AmbientLight
├── components/    GlassCard, HeroCard, MetricCard, FolderCard, GlassButton, PrimaryButton,
│                  IconButton, Pill, SegmentedControl, SectionHeader, FloatingTabBar (Android),
│                  MiniWorkoutBar, BottomSheet, EmptyState, Skeleton, ErrorState
├── fitness/       WorkoutCard, ExerciseCard, SetRow, ActiveSetCard, RestTimer, PRCard,
│                  ConsistencyGrid, WeekStrip, MuscleMap, MuscleFocusCard, ProgressChart,
│                  ProgramTrack, ZoneBars, MacroCard, RecoveryCard
└── index.ts
```

## 22.1 Token usage contract

Never in product screens:

```tsx
<View style={{ backgroundColor: '#161618', borderRadius: 27, padding: 19, borderColor: '#7C5CFF' }} />
```

Always:

```tsx
<GlassCard variant="regular" radius="xl" padding="lg" />
```

Accent is only ever read from the theme:

```tsx
const { color } = useTheme();
<Text style={{ color: color.accent.primary }} />   // inside a design-system component only
```

## 22.2 Component API principles

Components accept semantic props, not raw style values.

```tsx
<MetricCard label="Weekly volume" value="12.4k" unit="kg" trend={8.2} trendDirection="up" />
```

---

# 23. DESIGN SYSTEM SHOWCASE (GATE)

Before building product screens, implement a development route `/design-system` that demonstrates:

- Foundation: background, surfaces, text hierarchy, semantic colors, silver ramp, in both light and dark.
- Typography: hero, display, titles, body, label, metric with unit.
- Glass: ghost, regular, elevated, prominent; every tier (A to D) selectable by a debug override so each can be reviewed on one device, over scrolling content.
- Controls: primary, glass, secondary, icon buttons, chips, segmented control, inputs, steppers.
- Fitness: metric cards, hero workout card, folder card, exercise capsule, set row, active set card, PR card, rest timer, consistency grid, week strip, muscle map and focus card, charts, program track, zone bars.
- States: loading, empty, error, offline, disabled, pressed, selected.
- Navigation: tab bar (native on iOS, floating dock on Android), mini workout bar, bottom sheet.
- **Theme controls:** a live Scheme toggle (System, Dark, Light) and an Accent switcher (System on Android 12+, Silver, every preset, a custom color picker). Every component must stay legible and on-brand under every accent in both schemes.

Do not proceed to mass screen implementation until the showcase passes visual review.

## 23.1 Visual acceptance

The showcase passes when:

- dark feels rich, not flat; light feels crisp and airy, not washed out
- glass is visible but restrained, and on Android clearly reads as the same family as iOS Liquid Glass
- text is crisp and passes contrast over glass in both schemes
- accent feels special under Silver and under each preset, in both schemes
- the primary CTA stays dominant under every accent
- large metrics look premium
- spacing feels intentional
- the tab bar looks like it floats on both platforms
- glass screens hold 60 fps while scrolling on the Android 15 reference phone
- the interface looks excellent without animation
- nothing resembles a default React Native or generic Expo template

---

# 24. REVIEW CHECKLIST

For every screen:

**Hierarchy:** is the primary information obvious, is there one dominant action, are secondary details quieter?
**Composition:** enough negative space, intentionally varied card sizes, no dashboard soup?
**Glass:** backdrop glass only on the control layer, contrast sufficient, borders nearly invisible, degrades correctly through tiers A to D?
**Accent:** rare enough, read from the theme, correct under Silver and a colored preset, in light and dark?
**Typography:** metrics large, labels quieter than values?
**Interaction:** targets large, haptics and motion purposeful, workout path fast?
**Technical:** tokens used, components reused, adapts across screen sizes, accessible, tested on Android mid-range and iOS?

---

# 25. ANTI-PATTERNS

- **Hardcoded accent.** Any static accent hex in a component.
- **Accent soup.** Accent on every surface or most text.
- **Chrome overload.** The silver sheen used on fills, text or large areas.
- **Glass soup.** Blur on every card, or every label in its own glass pill.
- **Card soup.** Many equally sized cards stacked endlessly.
- **Dashboard soup.** Every statistic shown at once.
- **Cyberpunk cosplay.** Neon borders, techno fonts, HUD brackets.
- **Generic SaaS.** Desktop panels, tiny controls, web navigation.
- **Generic Expo.** Default navigation and unstyled native controls mixed with custom UI.
- **Fake native.** Pixel-copying iOS onto Android.
- **Fake intelligence.** AI insights or recovery scores without data.

---

# 26. IMPLEMENTATION ORDER

## Stage 1 — Foundation
Tokens for both schemes, theme (`createTheme`, accent resolver, tonal palette, `useGlassTier`), `Screen`, `Text`, `GlassSurface` (Tier A to D, with the Android glass spike outcome behind it), `GlassCard`, buttons, chips, segmented control, section header, icon button.

## Stage 2 — Showcase
`/design-system` with theme controls (scheme + accent + glass tier override). No product screens.

## Stage 3 — Fitness primitives
MetricCard, WorkoutCard, FolderCard, ExerciseCard, SetRow, ActiveSetCard, RestTimer, PRCard, ConsistencyGrid, WeekStrip, ProgressChart, ZoneBars, MuscleMap shell, ProgramTrack.

## Stage 4 — Navigation
Native tabs on iOS (with bottom accessory on iOS 26), floating glass dock on Android, mini workout bar, bottom sheet, app shell.

## Stage 5 — Product screens (in order)
Home, Workout library, Routine detail, Active workout, Workout summary, Progress, Exercise detail, Body, Profile and settings (including Appearance), then Nutrition, Recovery, Coach.

---

# 27. AI AGENT AND CONTRIBUTOR DIRECTIVE

Before creating or modifying UI:

1. Read this file completely.
2. Inspect `apps/mobile/src/design-system`.
3. Reuse tokens and primitives.
4. Read accent from the theme; never hardcode an accent.
5. No arbitrary colors, radii or spacing.
6. One icon family (Lucide).
7. No one-off glass implementations; use `GlassSurface`.
8. Do not bypass accessibility.
9. Do not make production screens depend on hardcoded mock data.
10. Preserve cross-platform behavior.
11. Keep workout interactions extremely fast.
12. Prefer restraint over visual noise.
13. If a required pattern does not exist, extend the design system first.

## 27.1 First task

> Read DESIGN.md completely. Do not build product screens yet. Implement the design-system foundation (tokens for light and dark, theme with accent resolution and tonal palette, GlassSurface with tier selection) and a `/design-system` showcase route that renders every token, typography style, glass variant, button, chip, metric card, workout card, set row, chart style, rest timer, state treatment and navigation primitive, with live Scheme, Accent and glass-tier switchers. Use reusable typed components and production-quality architecture. Do not hardcode screen-specific visual values. Do not add AI, backend, authentication, HealthKit, Health Connect or production business logic.

---

# 28. ORIGINALITY

The references are inspiration only. Do not copy logos, brand names, exact illustrations, proprietary anatomy art or pixel-for-pixel layouts. Extract material language, hierarchy, spacing, data treatment, composition and motion philosophy, and build an original Gymaxxing identity.

---

# 29. DESIGN MANTRA

```text
LIGHT AND DARK
SILVER
LIQUID GLASS
DATA
SPACE
DEPTH
RESTRAINT
```

> Gymaxxing should feel like a beautifully engineered training instrument that quietly matches the phone it lives on.

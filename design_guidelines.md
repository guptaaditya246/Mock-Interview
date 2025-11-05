# Design Guidelines: .NET Mock Interview Quiz App

## Design Approach
**Design System**: Material Design principles adapted for quiz/productivity application
**Reference Inspiration**: Duolingo's gamified learning interface + Linear's clean typography
**Core Philosophy**: Create an engaging yet professional testing environment that balances focus (during quiz) with celebration (results)

## Typography System

**Font Families**:
- Primary: Inter (via Google Fonts CDN) - UI elements, questions, navigation
- Secondary: JetBrains Mono - Code snippets within questions/answers

**Type Scale**:
- Hero/Page Titles: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Question Text: text-xl md:text-2xl font-medium
- Body/Options: text-base md:text-lg
- Timer/Metadata: text-sm font-medium uppercase tracking-wide
- Explanations: text-sm md:text-base leading-relaxed

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Tight spacing: p-3, gap-3 (option buttons, compact UI)
- Standard spacing: p-4, p-6, gap-4 (cards, sections)
- Generous spacing: p-8, p-12, py-16 (page containers, vertical rhythm)

**Container Strategy**:
- Home page: max-w-2xl mx-auto (focused, centered experience)
- Quiz page: max-w-4xl mx-auto (ample space for questions)
- Results page: max-w-5xl mx-auto (accommodate question review grid)

**Grid Systems**:
- Home page: Single column, centered
- Results review: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for question cards
- Mobile: Always single column with full-width components

## Component Library

### Home Page Components

**Hero Section** (70vh, not 100vh):
- Large centered card (max-w-2xl) with shadow-xl elevation
- Prominent title with gradient text treatment (implement via CSS)
- Topic dropdown: Full-width, rounded-lg, text-lg with chevron icon
- Question count slider/input: Large touch targets, visible value display
- CTA button: Extra large (px-12 py-4), full-width on mobile, prominent positioning

**Supporting Elements**:
- Topic quick-picks: Horizontal pill buttons for common selections
- Statistics banner: "Join 50,000+ developers preparing for interviews"
- Feature highlights: Grid of 3 items (Timed Questions, Real Scenarios, Instant Feedback) with icons from Heroicons

### Quiz Interface Components

**Question Card**:
- Full-width elevated card with rounded-xl borders
- Question text: Ample padding (p-8), clear hierarchy
- Code blocks: Distinct styling with JetBrains Mono, syntax highlighting via Prism.js
- Option buttons: Large radio-style cards (full-width, p-4) with clear hover states

**Navigation Panel**:
- Fixed bottom bar (mobile) or sidebar (desktop lg:)
- Previous/Next: Large touch targets (min-h-12)
- Skip button: Ghost style, secondary action

**Timer Component**:
- Prominent circular progress indicator (desktop) or top bar (mobile)
- Color transitions as time runs low (no specific colors mentioned, but indicate transitions)
- Countdown numbers: Large, tabular numerals for readability

**Progress Indicator**:
- Top of page: Linear progress bar (h-2)
- Question counter: "7 of 20" in prominent position
- Visual breadcrumb dots for quick navigation (desktop only)

### Results Page Components

**Score Hero**:
- Large centered score display (text-6xl md:text-8xl)
- Percentage with supporting "18/20 correct" subtitle
- Celebratory message based on score tier

**Question Review Grid**:
- Card layout: Each question in elevated card with rounded-lg
- Status indicator: Large checkmark/X icon (use Heroicons)
- Collapsible explanations: Smooth accordion animation
- Color coding: Visual distinction for correct/incorrect (implement via CSS classes)

**AdSense Zones**:
- Top banner: 728×90 placeholder, centered, py-6
- Rectangle: 300×250, right sidebar (desktop) or after score (mobile)
- Placeholder styling: Dashed borders, centered text "Ad Space"

**Action Buttons**:
- Restart Quiz: Primary CTA, prominent placement
- Try Different Topic: Secondary action
- Share Results: Tertiary ghost button with social icons

### Navigation & Global Elements

**Top Navigation**:
- Fixed header: Blur backdrop effect, shadow on scroll
- Logo/Title: Bold, clickable to home
- Dark mode toggle: Icon button (sun/moon from Heroicons), top-right
- Mobile: Hamburger menu if needed (simple slide-in drawer)

**Footer**:
- Minimal: Links to About, Privacy, Contact
- GitHub star button: "Star this project" with icon
- Copyright and attribution

## Interaction Patterns

**Animations** (Use sparingly):
- Page transitions: Subtle fade (200ms)
- Question advance: Slide animation (300ms)
- Confetti: Canvas-based celebration for 100% scores (use canvas-confetti library via CDN)
- Score reveal: Count-up animation (1 second duration)
- Card reveals: Stagger animation for results grid (50ms delay each)

**Micro-interactions**:
- Option selection: Immediate visual feedback, scale transform
- Button presses: Slight press effect (scale-95)
- Timer urgency: Pulse animation when <10 seconds
- Progress bar: Smooth width transitions

## Responsive Behavior

**Mobile (base - md)**:
- Stack all elements vertically
- Full-width buttons and cards
- Fixed bottom navigation for quiz
- Larger touch targets (min 44×44px)
- Timer: Top bar instead of circular
- AdSense: 300×250 only, stacked in content

**Tablet (md - lg)**:
- Two-column layouts where appropriate
- Side-by-side Previous/Next buttons
- Sidebar begins to appear for navigation

**Desktop (lg+)**:
- Max-width containers with generous margins
- Quiz sidebar for progress/navigation
- Circular timer component
- Multi-column results grid
- Top banner AdSense visible

## Dark Mode Strategy

**Implementation**:
- Toggle in top-right navigation
- Persist preference to localStorage
- Smooth transition (200ms) between modes
- Ensure sufficient contrast in both modes
- Icons: Swap sun/moon based on current mode

**Component Adaptation**:
- Cards: Elevated appearance in both modes via shadows
- Text: Maintain hierarchy through weight, not just contrast
- Borders: Subtle in both modes
- Inputs: Clear focus states in both modes

## Accessibility Standards

- All interactive elements keyboard navigable
- ARIA labels for timer, progress, score
- Focus indicators: Clear 2px outline offset
- Skip links for quiz navigation
- Screen reader announcements for score, timer warnings
- Color-blind safe: Don't rely solely on color for correct/incorrect (use icons)

## Images

**No Large Hero Image Required** - This is a utility-focused quiz app where immediate access to functionality is prioritized over visual storytelling.

**Icon Usage Only**:
- Feature icons on home page (Heroicons CDN - solid variant)
- Status icons in results (checkmark-circle, x-circle)
- Navigation icons (chevrons, menu, close)
- Dark mode toggle icons (sun, moon)

## Performance Considerations

- Lazy load confetti library (only on results page)
- Preload next question data during timer countdown
- Optimize AdSense script loading (async/defer)
- Minimize animation complexity during quiz for focus
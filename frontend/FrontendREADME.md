# 🎨 Frontend Folder Structure

### Tech Stack
- React 19
- Vite
- TypeScript
- TailwindCSS
- Framer Motion
- GSAP
- React Query (TanStack Query)
- React Hook Form + Zod
- Axios
- React Router
- Shadcn UI

```text
frontend/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── manifest.json
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero/
│   │   ├── icons/
│   │   └── placeholders/
│   ├── fonts/
│   └── lottie/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── providers.tsx
│   │   └── layouts/
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Dashboard/
│   │   ├── Detection/
│   │   ├── History/
│   │   ├── Analytics/
│   │   ├── Chatbot/
│   │   ├── Profile/
│   │   ├── Settings/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── NotFound/
│   ├── components/
│   │   ├── common/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── prediction/
│   │   ├── analytics/
│   │   ├── chatbot/
│   │   ├── forms/
│   │   ├── weather/
│   │   ├── animations/
│   │   ├── cards/
│   │   └── modals/
│   ├── hooks/
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── prediction.ts
│   │   ├── weather.ts
│   │   ├── chatbot.ts
│   │   └── analytics.ts
│   ├── store/
│   ├── contexts/
│   ├── utils/
│   ├── constants/
│   ├── config/
│   ├── types/
│   ├── assets/
│   │   ├── icons/
│   │   ├── illustrations/
│   │   ├── images/
│   │   ├── backgrounds/
│   │   └── videos/
│   ├── styles/
│   ├── theme/
│   ├── animations/
│   ├── lib/
│   ├── validation/
│   ├── data/
│   ├── tests/
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```


📄 Pages

Landing Page

Hero
Features
AI Overview
How it Works
CTA
Footer

Dashboard

Overview
Recent Predictions
Disease Statistics
Weather Card
AI Suggestions

Detection

Upload Image
Camera
Drag & Drop
Preview
Prediction Result

Analytics

Pie Charts
Bar Charts
Trend Graphs

History

Prediction Timeline
Search
Filter
Export

Chatbot

AI Conversation
Disease Questions
Fertilizer Suggestions

Profile

Settings

About

Contact

404

🧩 Components
Common
Button

Input

Badge

Loader

Spinner

Toast

Avatar

Tooltip

Dropdown

Modal

Skeleton

Prediction
ImageUploader

PredictionCard

ConfidenceBar

DiseaseBadge

HeatmapViewer

TreatmentCard

Dashboard
StatCard

RecentPrediction

DiseaseChart

WeatherWidget

ActivityFeed

Analytics
PieChart

BarChart

LineChart

SummaryCard

Chatbot
ChatBubble

TypingIndicator

SuggestionCard

PromptBox

🎨 UI Theme
Background
#050505

Pure black.

Secondary

#0E1117

Cards.

Accent

#00E676

Green

Healthy.

Danger

#FF5252

Disease.

Warning

#FFC107

Info

#00B0FF

Glass

rgba(255,255,255,0.06)
🖋 Typography

Heading

Space Grotesk

Body

Inter

Numbers

JetBrains Mono

Charts

Inter

Font Sizes

H1

64px

H2

48px

H3

36px

H4

28px

Body

18px

Caption

14px
🌈 Color Palette
Primary
#00E676

Secondary
#00B0FF

Background
#050505

Card
#111827

Border
#222

Text
#FFFFFF

Muted
#9CA3AF
📦 Resources
Icons
Lucide React (recommended)
Heroicons (optional)
Charts
Recharts
Animations

GSAP

Framer Motion

Lottie

Illustrations

Undraw

Storyset

Blush

(Customize them to match your branding.)

Images

Leaf

Disease Samples

Weather Icons

Background Gradients

📱 Responsive

Desktop

1920

1440

1280

Laptop

1024

Tablet

768

Mobile

480

375

320

✨ Animations

Landing

Fade In
Blur Reveal
Parallax

Cards

Scale
Hover Lift

Charts

Count Up
Draw Animation

Prediction

Upload Progress
Success Animation

Chat

Typing Effect

Navbar

Scroll Hide
Glass Blur

Buttons

Magnetic Hover
Ripple
🔥 UX Rules
Max content width: 1280px
8px spacing system
Consistent border radius (12–16px)
Skeleton loaders instead of blank screens
Toast notifications for all API actions
Optimistic UI where appropriate
Lazy-load heavy pages
Compress and optimize images
Keep animations smooth (avoid overusing them)
📖 Design Inspiration

Production-quality inspiration (observe patterns, don't copy):

Linear (clean SaaS dashboard)
Vercel (minimal dark UI)
Raycast (spacing & typography)
Stripe (landing page structure)
GitHub (documentation and information density)
Supabase (dashboard organization)
OpenAI (simple AI interaction flow)
# Atlas

A unified productivity platform by MeridianByte designed to connect everyday workflows into a single, cohesive system.

Atlas combines personal productivity domains such as tasks, notes, time, health, and finance into one integrated experience.

---

## Vision

Most productivity tools are fragmented across separate systems.

Atlas aims to create a single environment where:

- Personal workflows are connected
- Information flows naturally between domains
- Data becomes more meaningful through relationships
- Users can manage different aspects of life from one place

Atlas is not a collection of independent tools.

It is a unified system for understanding and navigating life through connected data and workflows.

---

## Application Structure

Atlas is delivered as the core MeridianByte application:

```
/apps/atlas
```

It provides the authenticated product experience and contains all major productivity domains.

---

## Domains

Atlas includes:

### 📝 Notes (Jot)

Capture and organize information while keeping it connected to tasks, events, and other workflows.

### ✅ Tasks & Time (Stride)

Manage actions, priorities, schedules, and productivity workflows.

### 📅 Calendar (Pave)

Connect time management with tasks, events, and personal planning.

### 💪 Fitness & Diet (Prime)

Track health-related information alongside broader lifestyle data.

### 💰 Finance (Tally)

Manage financial information and connect it with personal insights.

---

## Architecture

Atlas follows MeridianByte's modular product architecture.

### Thin Application Layer

The Atlas application focuses on:

- Routing
- User interface composition
- Product experience

Core business logic remains in shared packages.

---

### Shared Core

Reusable logic is provided through MeridianByte packages:

- Business rules
- Data access
- Validation
- Shared state
- API contracts

This keeps Atlas modular while avoiding duplicated systems.

---

### Unified Domain Model

Atlas uses a shared data model designed around connected personal information.

Domains include:

- Notes
- Tasks
- Events
- Health
- Finance

This enables:

- Cross-domain relationships
- Contextual insights
- Future automation
- System-wide intelligence

---

### Event-Driven Evolution

Future Atlas features will use event-driven communication for cross-domain actions.

Examples:

- Completing a task updates productivity insights
- Calendar changes affect scheduling suggestions
- Health activities influence personal analytics

This enables powerful interactions without tightly coupling domains.

---

## Routing

Atlas is served as a unified application:

```
atlas.meridianbyte.app (just for protocol. personal use.)
atlas.mbyte.app (additional. preferred for actual end users.)

```

---

## Design System

Atlas uses MeridianByte's shared design system:

- Components
- Tokens
- Themes
- Interaction patterns

This ensures a consistent experience throughout the product.

---

## Tech Stack

- Frontend: React / Next.js
- Backend: Node.js / API services
- Database: PostgreSQL
- ORM: Prisma
- State: Zustand / Redux where needed
- Styling: Tailwind / Mantine
- Tooling: pnpm, Turborepo

---

## Development

From the MeridianByte repository root:

Install dependencies:

```bash
pnpm install
```

Run Atlas:

```bash
pnpm --filter atlas dev
```

---

## Environment Setup

Atlas uses shared MeridianByte environment configuration.

Required variables include:

```
DATABASE_URL=
REDIS_URL=
NEXT_PUBLIC_*
```

---

## Roadmap

- [x] Shared authentication system
- [x] Cross-domain data linking
- [x] Mobile optimization
- [ ] Offline-first support (PWA)
- [ ] Analytics and insights layer
- [ ] Advanced automation and intelligence features

---

## Status

Early-stage. Atlas architecture and core productivity features are under active development.

---

## Part of MeridianByte

Atlas is a MeridianByte solution built on top of shared ecosystem infrastructure.

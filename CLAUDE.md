# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bone To Be** - AI-based body shape recognition and clothing recommendation service using skeletal analysis.

- **Stack**: Spring Boot backend, React/TypeScript frontend, FastAPI AI server
- **Architecture**: Event-driven with RabbitMQ, Docker Compose orchestration, Nginx reverse proxy
- **Database**: PostgreSQL (main), Redis (caching)
- **Repository**: Monorepo managed with pnpm workspace

## Development Commands

### Frontend (React + Vite + TypeScript)

Located in `frontend/` directory:

```bash
# Development server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Type checking (doesn't emit code)
pnpm type-check

# Linting
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues

# Formatting
pnpm format            # Format all src files with Prettier

# Preview production build
pnpm preview
```

### Backend (Spring Boot + Gradle)

Located in `backend/` directory:

```bash
# Build the project
./gradlew build

# Run tests
./gradlew test

# Run application (local development)
./gradlew bootRun

# Clean build artifacts
./gradlew clean
```

### Docker & Deployment

```bash
# Build and start all services
docker compose up -d

# Rebuild and restart specific service
docker compose up -d --build frontend
docker compose up -d --build backend

# View logs
docker compose logs -f frontend
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Architecture

### System Overview

```
┌─────────────┐
│   Nginx     │ ──── Reverse Proxy & Static Files
│  (Port 80)  │
└──────┬──────┘
       │
       ├─────► Frontend (React) ──── Port 3000 (container) / 80 (nginx)
       │
       └─────► Backend (Spring Boot) ──── Port 8988 (host) / 8080 (container)
                   │
                   ├─── PostgreSQL (Port 5432)
                   ├─── Redis (Port 6379)
                   └─── RabbitMQ ──── AI Server (FastAPI)
```

### Frontend Structure

```
src/
├── app/                      # Application core
│   ├── layouts/              # Layout wrappers (Root, Diagnosis, Error)
│   ├── providers/            # React Query & context providers
│   └── router/               # Route definitions (React Router v7)
├── pages/                    # Feature-based page components
│   ├── mainpage/
│   ├── diagnosis/            # Multi-step diagnosis flow
│   │   ├── BasicInfoPage.tsx
│   │   ├── PhotoCapturePage.tsx
│   │   └── components/       # Feature-specific components
│   └── photo-capture/
├── shared/                   # Shared utilities & components
│   ├── api/                  # Axios config & interceptors
│   ├── components/           # Reusable UI components
│   ├── constants/            # Application constants
│   ├── hooks/                # Custom React hooks
│   └── styles/               # Theme & global styles
└── mocks/                    # MSW handlers for API mocking
```

**Key patterns**:
- **Routing**: Nested routes with layouts, error boundaries via `errorElement`
- **State**: Local state with React hooks; Zustand installed but not yet used
- **API**: Axios + React Query v5 with singleton pattern
- **Styling**: Styled Components v6 with centralized theme system
- **Imports**: Use `@/*` alias for clean imports (e.g., `@/shared/components`)

### Backend Structure

- **Java 17** with **Spring Boot 3.5.9**
- **JPA + QueryDSL** for database queries
- **RabbitMQ** for async event processing with AI server
- **Redis** for caching and session management
- **Swagger/OpenAPI** at `/swagger-ui.html` for API documentation

### Technology Choices

**Frontend**:
- React 19.2.0 + React Router v7
- TypeScript 5.9 (strict mode enabled)
- Vite 7.2 for fast builds
- Styled Components for CSS-in-JS
- React Query for server state
- MSW for API mocking (toggle via `VITE_API_MOCKING` env var)

**Backend**:
- Spring Boot 3.5.9
- Spring Data JPA + QueryDSL 5.0
- RabbitMQ (AMQP) for event-driven architecture
- PostgreSQL 15 (production) + H2 (testing)
- Lombok for boilerplate reduction

## Code Conventions

### Commit Messages

Enforced via Commitlint with conventional commits:

```
<type>(<scope>): <subject>

type: feat, fix, docs, style, refactor, test, chore, perf, ci, revert, init
scope: frontend, backend, root, deps, config
subject: max 100 characters
```

Examples:
- `feat(frontend): add photo capture page with webcam integration`
- `fix(backend): resolve RabbitMQ connection timeout issue`
- `chore(deps): update React to 19.2.0`

### Frontend Code Style

**TypeScript**:
- Strict mode enabled (`noImplicitAny`, `strict`, etc.)
- No `any` types allowed (enforced by ESLint)
- Use `type` imports: `import type { Props } from './types'`
- Consistent type imports enforced

**Component patterns**:
- PascalCase for component files (`BasicInfoPage.tsx`)
- Kebab-case for directories (`photo-capture/`)
- Default exports for pages, named exports for utilities
- Co-locate styled components with component definitions
- Use `$` prefix for transient props in styled-components (e.g., `$active`, `$variant`)

**Import order** (enforced by ESLint):
1. Built-in modules
2. External dependencies
3. Internal modules
4. Parent/sibling imports
5. Index imports
6. Type imports

**Hooks**:
- Custom hooks in `src/shared/hooks/`
- Follow React hooks rules (proper cleanup, dependencies)
- Example: `useMediaQuery()`, `useWebcam()`

### Design System Integration

**For comprehensive Figma-to-React guidelines, see: [`frontend/FIGMA_DESIGN_SYSTEM.md`](frontend/FIGMA_DESIGN_SYSTEM.md)**

When converting Figma designs to React components:
- Use design tokens from `theme.ts` (no hardcoded colors, spacing, or typography)
- Prefix all styled-component-only props with `$` (transient props)
- Follow mobile-first responsive design patterns
- Include proper accessibility states (hover, focus, active, disabled)
- Use semantic HTML and ARIA attributes
- Follow the project's TypeScript and import conventions

The design system doc covers:
- Design token definitions (colors, typography, spacing)
- Component styling patterns and best practices
- Responsive design implementation
- Common UI patterns (buttons, inputs, cards)
- Animation and transition standards
- Accessibility guidelines
- Form handling patterns

### Backend Code Style

- **Lombok** annotations for getters/setters/constructors
- **QueryDSL** for type-safe queries
- **JPA entities** in `entity` packages
- **DTOs** for API request/response
- **Service layer** for business logic

## Environment Setup

### Frontend Environment Variables

Create `.env.development` in `frontend/`:

```env
VITE_API_MOCKING=true              # Enable/disable MSW mocking
VITE_BASE_URL=http://localhost:8988  # Backend API URL
```

### Backend Environment Variables

Managed via `application-{profile}.yml` or Docker environment:

```yaml
SPRING_PROFILES_ACTIVE: dev|prod
SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/bonetobe
SPRING_REDIS_HOST: localhost
```

## CI/CD

GitLab CI configured in `.gitlab-ci.yml`:

- **Triggers**: Push to `dev` branch with changes in `frontend/` or `backend/`
- **Pipeline**:
  1. Build Docker image
  2. Push to Docker Hub
  3. SSH to EC2 server
  4. Pull and restart container via `docker compose`
- **Deployment**: Automated to AWS EC2

## Testing

### Frontend

No test framework configured yet. When adding tests:
- Use Vitest (Vite-native)
- Place test files adjacent to components: `Component.test.tsx`

### Backend

```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests com.bonetobe.SomeTest
```

## Responsive Design

Mobile-first approach with breakpoints:
- **Mobile**: Default (< 768px)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

Media query pattern:
```typescript
const Component = styled.div`
  /* Mobile styles (default) */
  padding: 16px;

  @media (min-width: 768px) {
    /* Tablet */
    padding: 24px;
  }

  @media (min-width: 1024px) {
    /* Desktop */
    padding: 32px;
  }
`;
```

## Key Integration Points

### WebRTC Camera Integration

Located in `src/pages/photo-capture/` and `src/shared/hooks/useWebcam.ts`:
- Handles camera permissions and stream lifecycle
- Canvas-based image capture
- Error handling for denied permissions

### API Mocking (MSW)

- Handlers in `src/mocks/handlers/index.ts`
- Initialized in `src/main.tsx` when `VITE_API_MOCKING=true`
- Transparent to React Query and axios

### React Query Configuration

- Singleton `QueryClient` in `src/app/providers/QueryProvider.tsx`
- Default: `retry: 1`, `refetchOnWindowFocus: false`
- DevTools enabled in development

### Theme System

Centralized in `src/shared/styles/theme.ts`:
- Color palette (primary, secondary, grays, purples)
- Typography scales (heading, body)
- Spacing scale (xs → xxxl)
- Exported as `AppTheme` type for TypeScript autocomplete

## Current Development Status

Active branch: `FE/feat/136-analysis-ui`

Working on diagnosis UI components with new layouts and styling updates.

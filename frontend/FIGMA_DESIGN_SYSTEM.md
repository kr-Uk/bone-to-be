# Figma Design System Integration Rules for Bone To Be

## Overview
This document provides comprehensive rules for integrating Figma designs into the Bone To Be frontend codebase using Model Context Protocol (MCP). Follow these patterns when converting Figma designs to React components.

---

## 1. Design Token Definitions

### Location
**Primary file:** `frontend/src/shared/styles/theme.ts`

### Color System

```typescript
// Access colors via theme
${({ theme }) => theme.colors.primary}      // #000000 (Black - primary)
${({ theme }) => theme.colors.secondary}    // #FFFFFF (White - secondary)
${({ theme }) => theme.colors.accent}       // #333333 (Dark gray)
${({ theme }) => theme.colors.text}         // #000000 (Text color)
${({ theme }) => theme.colors.textLight}    // #666666 (Light text)
${({ theme }) => theme.colors.background}   // #FFFFFF (Background)
${({ theme }) => theme.colors.border}       // #E5E5E5 (Border color)
```

#### Purple Accent Palette
```typescript
theme.colors.purple[200]  // #E9D4FF (Light purple)
theme.colors.purple[600]  // #9810FA (Primary purple)
theme.colors.purple[900]  // #59168B (Dark purple)
```

#### Gray Scale (Neutral Colors)
```typescript
theme.colors.gray[50]   // #FAFAFA (Lightest)
theme.colors.gray[100]  // #F5F5F5
theme.colors.gray[200]  // #E5E5E5
theme.colors.gray[300]  // #D4D4D4
theme.colors.gray[400]  // #A1A1A1
theme.colors.gray[500]  // #737373
theme.colors.gray[600]  // #525252
theme.colors.gray[700]  // #404040
theme.colors.gray[800]  // #262626
theme.colors.gray[900]  // #171717 (Darkest)
```

### Typography System

```typescript
// Headings (700 weight, 1.2 line-height)
theme.typography.heading["4xl"]  // 3.75rem (60px)
theme.typography.heading["3xl"]  // 3rem (48px)
theme.typography.heading["2xl"]  // 2.5rem (40px)
theme.typography.heading.lg      // 1.75rem (28px)
theme.typography.heading.sm      // 1.2rem (19.2px)

// Body text (1.2 line-height)
theme.typography.body.lg.semibold   // 1rem, 600 weight
theme.typography.body.lg.medium     // 1rem, 500 weight
theme.typography.body.lg.regular    // 1rem, 400 weight

theme.typography.body.md.semibold   // 0.875rem (14px), 600 weight
theme.typography.body.md.medium     // 0.875rem (14px), 500 weight
theme.typography.body.md.regular    // 0.875rem (14px), 400 weight

theme.typography.body.sm.semibold   // 0.75rem (12px), 600 weight
theme.typography.body.sm.medium     // 0.75rem (12px), 500 weight
theme.typography.body.sm.regular    // 0.75rem (12px), 400 weight

// Apply typography
font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
line-height: ${({ theme }) => theme.typography.body.lg.semibold.lineHeight};
```

### Spacing Scale

```typescript
theme.spacing.xs     // 0.25rem (4px)
theme.spacing.sm     // 0.5rem (8px)
theme.spacing.m      // 0.75rem (12px)
theme.spacing.md     // 1rem (16px)
theme.spacing.lg     // 1.5rem (24px)
theme.spacing.xl     // 2rem (32px)
theme.spacing.xxl    // 3rem (48px)
theme.spacing.xxxl   // 4rem (64px)

// Usage
padding: ${({ theme }) => theme.spacing.md};
margin: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
gap: ${({ theme }) => theme.spacing.sm};
```

---

## 2. Typography Implementation

### Font Family
**Primary:** Pretendard Variable (Korean-optimized sans-serif)
**Loaded in:** `frontend/src/shared/styles/globalStyle.ts`

```typescript
import "pretendard/dist/web/variable/pretendardvariable.css";

// Applied globally
font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

### Typography Patterns

```typescript
// Heading example
const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.heading["2xl"].fontSize};
  font-weight: ${({ theme }) => theme.typography.heading["2xl"].fontWeight};
  line-height: ${({ theme }) => theme.typography.heading["2xl"].lineHeight};
  color: ${({ theme }) => theme.colors.text};
`;

// Body text example
const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  color: ${({ theme }) => theme.colors.textLight};
`;
```

---

## 3. Component Styling Patterns

### File Location
- **Shared components:** `frontend/src/shared/components/`
- **Feature components:** `frontend/src/pages/[feature]/components/`

### Component Structure

```typescript
import styled from "styled-components";

// Define interface for component props
interface ButtonProps {
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

// Use transient props ($ prefix) for styled-component-only props
const StyledButton = styled.button<{ $variant: string; $disabled: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.primary : "transparent"};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.secondary : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  transition: all 0.2s;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${({ theme, $disabled }) =>
      $disabled ? "transparent" : theme.colors.gray[800]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

// React component
export const Button = ({ variant = "primary", disabled = false, children }: ButtonProps) => (
  <StyledButton $variant={variant} $disabled={disabled} disabled={disabled}>
    {children}
  </StyledButton>
);
```

### Key Conventions

1. **Transient Props:** All styled-component-only props MUST use `$` prefix
2. **Theme Access:** Always access design tokens via `${({ theme }) => ...}`
3. **Transitions:** Use `transition: all 0.2s` for state changes
4. **Cursor:** Set appropriate cursor states (pointer, not-allowed, default)
5. **Accessibility:** Include proper hover, focus, active, disabled states

---

## 4. Responsive Design Implementation

### Breakpoint Strategy
**Mobile-first approach:**
- **Mobile:** < 768px (default styles)
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

### Media Query Pattern

```typescript
const Container = styled.div`
  /* Mobile styles (default) */
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    /* Tablet styles */
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: 1024px) {
    /* Desktop styles */
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;
```

### Using useMediaQuery Hook

**Location:** `frontend/src/shared/hooks/useMediaQuery.ts`

```typescript
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

const MyComponent = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const variant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return <Container $variant={variant}>{/* content */}</Container>;
};
```

### Responsive Component Props Pattern

```typescript
const Section = styled.section<{ $variant: 'mobile' | 'tablet' | 'desktop' }>`
  width: 100%;

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: 1024px) {
    width: 50%;
    padding: ${({ theme }) => theme.spacing.xxxl};
  }
`;
```

---

## 5. Common UI Patterns

### Button Component

```typescript
const Button = styled.button<{ $variant?: "primary" | "outline"; $fullWidth?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  transition: all 0.2s;

  ${({ theme, $variant }) => $variant === "primary" && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.secondary};
    border: none;

    &:hover {
      background-color: ${theme.colors.gray[800]};
    }
  `}

  ${({ theme, $variant }) => $variant === "outline" && `
    background-color: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};

    &:hover {
      border-color: ${theme.colors.gray[300]};
      background-color: ${theme.colors.gray[50]};
    }
  `}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;
```

### Input Field Component

```typescript
const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? "#ff0000" : theme.colors.border};
  border-radius: 0.75rem;
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? "#ff0000" : theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;
```

### Card/Container Component

```typescript
const Card = styled.div<{ $elevated?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${({ $elevated }) => $elevated && `
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  `}
`;
```

### Toggle/Selection Button

```typescript
const SelectionButton = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.purple[600] : "transparent"};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.secondary : theme.colors.gray[400]};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.gray[300]};
  }
`;
```

---

## 6. Animation Patterns

### Transitions
Standard transition for interactive elements:
```typescript
transition: all 0.2s;
transition: background-color 0.2s;
transition: border-color 0.2s, box-shadow 0.2s;
```

### Keyframe Animations

```typescript
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedContainer = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

// Flash effect example
const flash = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const FlashOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.secondary};
  animation: ${flash} 0.3s ease-out;
  pointer-events: none;
`;
```

---

## 7. Border Radius Standards

Common border radius values:
```typescript
border-radius: 0.5rem;    // 8px - Small elements
border-radius: 0.75rem;   // 12px - Medium elements (inputs, cards)
border-radius: 1rem;      // 16px - Large cards
border-radius: 9999px;    // Fully rounded (buttons, pills)
```

---

## 8. Asset Management

### Location
`frontend/src/assets/`

### Usage Pattern

```typescript
// Import asset
import LogoSvg from "@/assets/logo.svg";

// Use in styled component
const Logo = styled.img`
  height: 2.5rem;
  cursor: pointer;

  @media (max-width: 767px) {
    height: 2rem;
  }
`;

// Render
<Logo src={LogoSvg} alt="BONE:TOBE Logo" onClick={handleLogoClick} />
```

### Icon System
**Package:** `react-icons` v5.5.0

```typescript
import { FaCamera, FaUpload } from "react-icons/fa";

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
`;

<IconWrapper>
  <FaCamera />
</IconWrapper>
```

---

## 9. Layout Patterns

### Flexbox Container

```typescript
const FlexContainer = styled.div<{
  $direction?: "row" | "column";
  $align?: string;
  $justify?: string;
  $gap?: keyof typeof theme.spacing;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || "row"};
  align-items: ${({ $align }) => $align || "stretch"};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
  gap: ${({ theme, $gap }) => $gap ? theme.spacing[$gap] : 0};
`;
```

### Grid Container

```typescript
const GridContainer = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 1}, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    grid-template-columns: repeat(${({ $columns }) => ($columns || 1) * 2}, 1fr);
  }
`;
```

### Centered Layout

```typescript
const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
`;
```

---

## 10. State Management Patterns

### Interactive States

```typescript
const InteractiveElement = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  /* Base styles */
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;

  /* Hover state */
  &:hover {
    background-color: ${({ theme, $disabled }) =>
      $disabled ? "inherit" : theme.colors.gray[100]};
  }

  /* Active state */
  ${({ theme, $active }) => $active && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.secondary};
  `}

  /* Focus state (accessibility) */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

---

## 11. Accessibility Guidelines

### Focus States
```typescript
&:focus-visible {
  outline: 2px solid ${({ theme }) => theme.colors.primary};
  outline-offset: 2px;
}
```

### Semantic HTML
- Use `<button>` for clickable actions
- Use `<label>` with proper `htmlFor` attributes
- Use `<input>` with proper `type`, `name`, `id` attributes
- Use `<fieldset>` and `<legend>` for form groups

### ARIA Attributes
```typescript
<button aria-label="Close dialog" aria-pressed={isActive}>
  <Icon />
</button>

<input aria-invalid={hasError} aria-describedby="error-message" />
{hasError && <span id="error-message">{errorMessage}</span>}
```

---

## 12. Import Path Conventions

### Alias Configuration
```typescript
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
}
```

### Import Order (enforced by ESLint)

```typescript
// 1. Built-in modules
import { useState, useEffect } from "react";

// 2. External dependencies
import styled from "styled-components";
import { useNavigate } from "react-router";

// 3. Internal modules (using @ alias)
import { theme } from "@/shared/styles/theme";
import { Button } from "@/shared/components/Button";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

// 4. Relative imports
import { GenderSelection } from "./components/GenderSelection";

// 5. Type imports (last)
import type { AppTheme } from "@/shared/styles/theme";
```

---

## 13. Component Naming Conventions

### File Naming
- **Components:** PascalCase - `BasicInfoPage.tsx`, `GenderSelection.tsx`
- **Directories:** kebab-case - `photo-capture/`, `shared/`
- **Styled components:** PascalCase - `const StyledButton = styled.button`

### Export Patterns
```typescript
// Page components (default export)
export default function BasicInfoPage() { /* ... */ }

// Shared components (named export)
export const Button = ({ children, ...props }: ButtonProps) => { /* ... */ };

// Styled components (internal, no export)
const StyledButton = styled.button`/* ... */`;
```

---

## 14. TypeScript Patterns

### Component Props Interface

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Use with styled components
const StyledButton = styled.button<{
  $variant: ButtonProps["variant"];
  $size: ButtonProps["size"];
  $fullWidth: boolean;
}>`/* ... */`;
```

### Theme Typing

```typescript
// Automatic theme typing via styled.d.ts
import type { DefaultTheme } from "styled-components";

// Use in styled components
const Component = styled.div`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`;
```

---

## 15. Content Management for Responsive Variants

**Pattern from:** `frontend/src/shared/constants/diagnosis.tsx`

```typescript
export const BasicInfoExplainData = {
  desktop: {
    title: (
      <>
        분석 전,<br />
        기본 정보를<br />
        알려주세요
      </>
    ),
    description: (
      <>
        정확한 AI 골격분석을 위해<br />
        기본 정보를 입력해주세요.
      </>
    ),
  },
  tablet: {
    title: <>분석 전, 기본 정보를 알려주세요</>,
    description: <>정확한 AI 골격분석을 위해 기본 정보를 입력해주세요.</>,
  },
  mobile: {
    title: <>분석 전, 기본 정보를 알려주세요</>,
    description: <>정확한 AI 골격분석을 위해 기본 정보를 입력해주세요.</>,
  },
};

// Usage in component
const variant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
const content = BasicInfoExplainData[variant];

<Title>{content.title}</Title>
<Description>{content.description}</Description>
```

---

## 16. Form Handling Patterns

### Input Component with Validation

```typescript
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? "#ff0000" : theme.colors.border};
  border-radius: 0.75rem;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? "#ff0000" : theme.colors.primary};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: #ff0000;
`;

// Usage
<FormGroup>
  <Label htmlFor="height">키</Label>
  <Input
    id="height"
    type="number"
    placeholder="키를 입력하세요 (cm)"
    $hasError={!!errors.height}
  />
  {errors.height && <ErrorMessage>{errors.height}</ErrorMessage>}
</FormGroup>
```

---

## 17. Project Structure Best Practices

### Component Placement Rules

1. **Shared across app** → `src/shared/components/`
2. **Feature-specific** → `src/pages/[feature]/components/`
3. **Single-use in page** → Co-locate with page component

### Example Structure

```
src/
├── pages/
│   ├── diagnosis/
│   │   ├── BasicInfoPage.tsx           # Page component
│   │   ├── components/                 # Feature-specific components
│   │   │   ├── GenderSelection.tsx
│   │   │   ├── BodySpecsInput.tsx
│   │   │   └── FavoriteStyleSelector.tsx
│   │   └── schemas/                    # Validation schemas
│   │       └── basicInfo.schema.ts
│   └── photo-capture/
│       ├── PhotoCapturePage.tsx
│       └── components/
│           ├── CameraPreview.tsx
│           └── ImageUpload.tsx
├── shared/
│   ├── components/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── DiagnosisHeader.tsx
│   ├── hooks/                          # Custom React hooks
│   │   ├── useMediaQuery.ts
│   │   └── useWebcam.ts
│   ├── styles/                         # Design system
│   │   ├── theme.ts
│   │   └── globalStyle.ts
│   └── constants/                      # App-wide constants
│       └── diagnosis.tsx
```

---

## 18. Image Handling Patterns

### Background Images

```typescript
const Hero = styled.section<{ $imageUrl: string }>`
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 500px;

  @media (max-width: 767px) {
    min-height: 300px;
  }
`;
```

### Responsive Images

```typescript
const ResponsiveImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 1rem;

  @media (min-width: 768px) {
    max-width: 600px;
  }
`;
```

---

## 19. Z-Index Management

### Z-Index Scale
```typescript
const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Usage in styled components
const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.modal};
`;
```

---

## 20. Performance Optimization Patterns

### Lazy Loading Components

```typescript
import { lazy, Suspense } from "react";

const PhotoCapturePage = lazy(() => import("@/pages/photo-capture/PhotoCapturePage"));

// Usage with fallback
<Suspense fallback={<Loading />}>
  <PhotoCapturePage />
</Suspense>
```

### Memoization for Styled Components

```typescript
import { memo } from "react";

const ExpensiveComponent = memo(({ data }: Props) => (
  <StyledContainer>
    {/* Complex rendering logic */}
  </StyledContainer>
));
```

---

## Quick Reference Checklist

When converting Figma designs to React components:

- [ ] Use design tokens from `theme.ts` (no hardcoded values)
- [ ] Prefix all styled-component-only props with `$`
- [ ] Implement mobile-first responsive design
- [ ] Add proper hover, focus, active, disabled states
- [ ] Use semantic HTML elements
- [ ] Include ARIA attributes for accessibility
- [ ] Add proper TypeScript types for all props
- [ ] Follow import order conventions
- [ ] Use consistent spacing from `theme.spacing`
- [ ] Apply standard transitions (`all 0.2s`)
- [ ] Use appropriate border-radius values
- [ ] Test on mobile (< 768px), tablet (768-1023px), desktop (1024px+)
- [ ] Verify color contrast for accessibility
- [ ] Add proper alt text for images
- [ ] Include error states for forms

---

## Common Pitfalls to Avoid

1. ❌ **Don't** hardcode colors: `color: #000000`
   ✅ **Do** use theme: `color: ${({ theme }) => theme.colors.primary}`

2. ❌ **Don't** use props without `$`: `<Button active={true}>`
   ✅ **Do** use transient props: `<Button $active={true}>`

3. ❌ **Don't** use pixel values: `padding: 16px`
   ✅ **Do** use spacing tokens: `padding: ${({ theme }) => theme.spacing.md}`

4. ❌ **Don't** use desktop-first media queries: `@media (max-width: 768px)`
   ✅ **Do** use mobile-first: `@media (min-width: 768px)`

5. ❌ **Don't** forget accessibility: `<div onClick={...}>`
   ✅ **Do** use semantic HTML: `<button onClick={...}>`

---

## Resources

- **Theme file:** `frontend/src/shared/styles/theme.ts`
- **Global styles:** `frontend/src/shared/styles/globalStyle.ts`
- **Component examples:** `frontend/src/pages/diagnosis/components/`
- **Custom hooks:** `frontend/src/shared/hooks/`
- **Styled-components docs:** https://styled-components.com/
- **React 19 docs:** https://react.dev/

---

**Last Updated:** 2026-01-25
**Version:** 1.0
**Maintained by:** Bone To Be Frontend Team

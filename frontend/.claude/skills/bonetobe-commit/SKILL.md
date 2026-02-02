---
name: bonetobe-commit
description: Use this skill when working with git commits in the Bone To Be project, discussing commit messages, or when the user asks to commit changes. Provides project-specific commit conventions.
version: 1.0.0
model: haiku
allowed-tools:
  - Bash(git*)
  - Read
  - Grep
---

# Bone To Be Commit Convention Skill

## Purpose

This skill provides expert guidance for creating git commits that follow the Bone To Be project's conventions. Auto-activates when working with commits to ensure consistency and quality.

## Critical Rules

### 1. Commit Message Format

```
<type>(<scope>): <subject>
```

**Example:**

```
feat(frontend): 사진 촬영 페이지 추가
```

### 2. Language Requirement

**ALL commit messages MUST be written in Korean (한국어)**

- Use natural, fluent Korean phrasing
- Avoid awkward translations
- Be concise and clear

### 3. Character Limit

**Maximum 80 characters** for the entire commit message (stricter than commitlint's 100)

### 4. NO Co-Authored-By Footer

**NEVER include `Co-Authored-By: Claude Sonnet 4.5` or any similar footer**

This is a critical requirement - commits should be clean and concise.

## Type Enum (Required)

Must use one of these types:

- `feat` - New feature (새 기능)
- `fix` - Bug fix (버그 수정)
- `refactor` - Code refactoring without behavior change (리팩토링)
- `design` - Pure UI/CSS changes without functionality (디자인 변경)
- `style` - Code style changes (formatting, semicolons, etc.) (코드 스타일)
- `chore` - Build, dependencies, configs (기타 작업)
- `docs` - Documentation only (문서)
- `test` - Adding or updating tests (테스트)
- `perf` - Performance improvements (성능 개선)
- `ci` - CI/CD changes (CI/CD)
- `revert` - Revert previous commit (되돌리기)
- `init` - Initial commit (초기 설정)

### Type Selection Guidelines

**feat vs design:**

- `feat` - Adds new functionality: `feat(frontend): 로그인 버튼 클릭 시 모달 표시`
- `design` - Pure styling: `design(frontend): 버튼 색상 및 간격 조정`

**refactor vs fix:**

- `refactor` - No behavior change: `refactor(backend): 사용자 서비스 로직 분리`
- `fix` - Fixes broken behavior: `fix(backend): 로그인 시 null 오류 수정`

**style vs design:**

- `style` - Code formatting: `style(frontend): ESLint 규칙 적용`
- `design` - Visual styling: `design(frontend): 헤더 레이아웃 개선`

## Scope Enum (Required)

Must use one of these scopes:

- `frontend` - Changes in `frontend/` directory
- `backend` - Changes in `backend/` directory
- `root` - Project-wide changes affecting both or neither
- `deps` - Dependency updates (package.json, build.gradle, etc.)
- `config` - Configuration files (Docker, CI/CD, etc.)

### Scope Selection Guidelines

**Single directory changes:**

- Changes only in `frontend/` → `frontend`
- Changes only in `backend/` → `backend`

**Multiple directories:**

- Changes in both frontend and backend → Consider splitting into 2 commits OR use `root`
- Config files (docker-compose.yml, .gitlab-ci.yml) → `config`
- Documentation at root (README.md, CLAUDE.md) → `root`

**Dependencies:**

- `pnpm install` in frontend → `deps`
- Gradle dependency update → `deps`
- Both → `deps` (use root scope)

## Commit Granularity (Atomic Commits)

**One logical change per commit**

✅ **Good examples:**

- Single feature: `feat(frontend): 웹캠 통합한 사진 촬영 기능 추가`
- Single bug fix: `fix(backend): RabbitMQ 연결 타임아웃 수정`
- Single refactor: `refactor(frontend): 진단 페이지 컴포넌트 구조 개선`

❌ **Bad examples (too broad):**

- `feat(frontend): 촬영 페이지 추가 및 진단 페이지 수정` (2 features - split it)
- `fix(root): 여러 버그 수정` (vague - what bugs?)

**When to split commits:**

- Different features → Separate commits
- Different scopes → Separate commits (frontend vs backend)
- Unrelated changes → Separate commits

## Korean Commit Message Examples

### ✅ Excellent Examples (Under 80 chars, natural Korean)

```
feat(frontend): 웹캠 통합한 사진 촬영 페이지 추가
design(frontend): 진단 레이아웃 반응형 CSS 개선
fix(backend): RabbitMQ 연결 타임아웃 오류 해결
refactor(frontend): Zustand 스토어 구조 단순화
chore(deps): React 19.2.0 버전으로 업데이트
docs(root): 시스템 아키텍처 다이어그램 추가
test(backend): 사용자 서비스 단위 테스트 추가
perf(frontend): 이미지 레이지 로딩 최적화 적용
ci(config): GitLab CI 파이프라인 배포 단계 수정
style(frontend): ESLint 규칙에 맞게 코드 포맷팅
```

### ❌ Bad Examples (Avoid these)

```
# Too long (95 chars)
feat(frontend): 웹캠 통합 및 권한 오류 처리 기능이 포함된 사진 촬영 페이지를 추가하고 UI 개선

# English (not allowed)
feat(frontend): add photo capture page with webcam

# No scope
feat: 사진 촬영 페이지 추가

# Wrong scope
feat(backend): 프론트엔드 버튼 추가

# Too vague
fix(frontend): 수정

# Multiple changes
feat(root): 촬영 페이지 추가 및 백엔드 API 수정
```

## Workflow for Creating Commits

### Step 1: Analyze Changes

```bash
git status          # See what files changed
git diff HEAD       # See actual code changes
```

### Step 2: Determine Type and Scope

Ask yourself:

- **What changed?** → Determines type (feat/fix/design/etc.)
- **Where did it change?** → Determines scope (frontend/backend/etc.)
- **Is it a single logical change?** → Ensure atomic commit

### Step 3: Craft Message in Korean

- Start with action verb in Korean
- Be specific but concise
- Stay under 80 characters
- Natural Korean phrasing (not word-by-word translation)

### Step 4: Stage and Commit

```bash
# Stage specific files (avoid git add -A)
git add src/pages/diagnosis/BasicInfoPage.tsx
git add src/pages/diagnosis/components/BodySpecsInput.tsx

# Commit with message (NO Co-Authored-By!)
git commit -m "design(frontend): 진단 페이지 레이아웃 CSS 수정"
```

### Step 5: Verify

```bash
# Check last commit
git log -1

# Verify commitlint passes
npx commitlint --from HEAD~1
```

## Breaking Changes

For breaking changes, add **!** after scope:

```
feat(backend)!: API 응답 형식 JSON으로 변경
```

## Issue References

**Subject line:** Keep clean, no issue numbers
**Body:** Add issue references in body if needed

```
feat(frontend): 로그인 폼 유효성 검사 추가

Resolves #123
```

## Edge Case Handling

### Very Long Descriptions

If description exceeds 80 chars:

**Option 1:** Simplify

```
# Too long (95 chars)
feat(frontend): 사용자 프로필 페이지에 아바타 업로드 및 크롭 기능 추가

# Simplified (51 chars)
feat(frontend): 프로필 아바타 업로드 및 크롭 추가
```

**Option 2:** Use body for details

```
feat(frontend): 프로필 아바타 업로드 추가

- 이미지 크롭 기능 포함
- 최대 5MB 파일 크기 제한
- WebP 형식으로 자동 변환
```

### Multi-Scope Changes

**Preferred:** Split into multiple commits

```
# Commit 1
feat(frontend): 로그인 UI 컴포넌트 추가

# Commit 2
feat(backend): 로그인 API 엔드포인트 구현
```

**Alternative:** Use `root` scope for truly integrated changes

```
feat(root): JWT 기반 인증 시스템 구현
```

## Model Configuration

This skill uses **Haiku model** for:

- Fast execution
- Cost-effective commits
- Quick message generation

The lightweight Haiku model is perfect for commit message generation as it doesn't require deep reasoning.

## Success Checklist

Before committing, verify:

- [ ] Message is in Korean (한국어)
- [ ] Format is `<type>(<scope>): <subject>`
- [ ] Type is from allowed enum
- [ ] Scope is from allowed enum
- [ ] Message is under 80 characters
- [ ] Commit is atomic (single logical change)
- [ ] NO `Co-Authored-By` footer
- [ ] Natural Korean phrasing

## Common Mistakes to Avoid

1. **Using English:** Always use Korean
2. **Missing scope:** Every commit needs a scope
3. **Too long:** Keep under 80 chars, not 100
4. **Adding Co-Authored-By:** Never include this
5. **Multiple changes:** Split into atomic commits
6. **Vague messages:** Be specific: "수정" → "로그인 버튼 색상 수정"
7. **Wrong type:** design vs feat, refactor vs fix - choose carefully

## Integration with Commitlint

This project has commitlint configured with:

- Scope enforcement: frontend, backend, root, deps, config
- Type enforcement: feat, fix, docs, style, refactor, test, chore, perf, ci, revert, init
- Max length: 100 chars (we enforce stricter 80 chars)

Commitlint will validate commits automatically. Follow this skill's guidelines to pass validation.

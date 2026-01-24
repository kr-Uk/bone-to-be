---
allowed-tools:
  - Bash(git status*)
  - Bash(git diff*)
  - Bash(git add*)
  - Bash(git commit*)
  - Bash(git log*)
  - Read
  - Grep
description: Create a commit following Bone To Be conventions (Korean, 80 chars, no Co-Authored-By)
model: haiku
---

# Bone To Be Commit Command (/bc)

Execute a git commit following the Bone To Be project's strict conventions.

## Critical Requirements

1. **Korean only (한국어)** - All commit messages in Korean
2. **80 character limit** - Stricter than commitlint's 100
3. **Format:** `<type>(<scope>): <subject>`
4. **NO Co-Authored-By footer** - Never include this
5. **Atomic commits** - Single logical change per commit

## Execution Workflow

### Step 1: Gather Context (Parallel)

Run these commands in parallel to understand current state:

```bash
git status                    # See untracked/modified files
git diff HEAD                 # See all changes (staged + unstaged)
git log --oneline -5         # See recent commit style
```

### Step 2: Analyze Changes

Determine:
- **Type:** feat, fix, design, refactor, style, chore, docs, test, perf, ci, revert, init
- **Scope:** frontend, backend, root, deps, config
- **Granularity:** Is this a single logical change? If not, ask user to split

**Type selection logic:**
- New functionality → `feat`
- Bug fix → `fix`
- Pure UI/CSS → `design`
- Code structure without behavior change → `refactor`
- Code formatting → `style`
- Dependencies, configs, builds → `chore`
- Documentation → `docs`
- Tests → `test`
- Performance → `perf`
- CI/CD → `ci`

**Scope selection logic:**
- Changes only in `frontend/` → `frontend`
- Changes only in `backend/` → `backend`
- Both or root-level → `root`
- package.json, build.gradle → `deps`
- docker-compose.yml, .gitlab-ci.yml → `config`

### Step 3: Verify Granularity

**Single logical change?**
- ✅ One feature added
- ✅ One bug fixed
- ✅ One refactor completed
- ❌ Multiple unrelated changes (ask user to split)

If changes span multiple scopes or features, ask user:
- Split into multiple commits? (Recommended)
- Use `root` scope for integrated change?

### Step 4: Craft Korean Message (Under 80 chars)

**Pattern:** `<type>(<scope>): <Korean description>`

**Examples:**
```
feat(frontend): 웹캠 통합한 사진 촬영 페이지 추가
design(frontend): 진단 레이아웃 반응형 CSS 개선
fix(backend): RabbitMQ 연결 타임아웃 오류 해결
chore(deps): React 19.2.0 버전으로 업데이트
```

**Tips for staying under 80 chars:**
- Use concise Korean verbs: 추가, 수정, 개선, 해결, 적용, 구현
- Avoid unnecessary words: "기능을" → just the feature name
- Simplify: "반응형 디자인을 적용하여 개선" → "반응형 CSS 개선"

### Step 5: Stage and Commit

**Prefer specific files over `git add -A`:**

```bash
# Good: Stage specific files
git add src/pages/diagnosis/BasicInfoPage.tsx
git add src/pages/diagnosis/components/BodySpecsInput.tsx
git commit -m "design(frontend): 진단 페이지 레이아웃 CSS 수정"

# Avoid: Staging everything (risk of including unintended files)
git add -A
```

**CRITICAL: Never add Co-Authored-By footer!**

Commit message should be clean:
```bash
git commit -m "feat(frontend): 사진 촬영 페이지 추가"
```

NOT:
```bash
git commit -m "feat(frontend): 사진 촬영 페이지 추가

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Step 6: Verify Success

```bash
git log -1              # Check last commit
git log -1 --format=%B  # Check commit body (should be empty or just message)
```

Verify:
- Message is in Korean
- Under 80 characters
- Correct type and scope
- No Co-Authored-By in body

## Common Scenarios

### Scenario 1: Frontend UI Changes

```bash
# Context
git status    # Shows: modified: src/pages/diagnosis/BasicInfoPage.tsx
git diff HEAD # Shows: CSS styling changes

# Analysis
Type: design (pure CSS)
Scope: frontend (in frontend/ directory)
Message: "진단 페이지 레이아웃 CSS 수정" (33 chars)

# Execute
git add src/pages/diagnosis/BasicInfoPage.tsx
git commit -m "design(frontend): 진단 페이지 레이아웃 CSS 수정"
```

### Scenario 2: Backend Bug Fix

```bash
# Context
git status    # Shows: modified: backend/src/.../UserService.java
git diff HEAD # Shows: null check added

# Analysis
Type: fix
Scope: backend
Message: "사용자 서비스 null 체크 추가" (28 chars)

# Execute
git add backend/src/main/java/.../UserService.java
git commit -m "fix(backend): 사용자 서비스 null 체크 추가"
```

### Scenario 3: Dependency Update

```bash
# Context
git status    # Shows: modified: frontend/package.json
git diff HEAD # Shows: React 19.1.0 → 19.2.0

# Analysis
Type: chore
Scope: deps
Message: "React 19.2.0 버전으로 업데이트" (27 chars)

# Execute
git add frontend/package.json frontend/pnpm-lock.yaml
git commit -m "chore(deps): React 19.2.0 버전으로 업데이트"
```

### Scenario 4: Multi-Scope Changes

```bash
# Context
git status    # Shows: modified files in both frontend/ and backend/

# Analysis
Changes span multiple scopes

# Action: Ask user
"변경사항이 frontend와 backend 모두에 있습니다.
두 개의 커밋으로 나누시겠습니까? (권장)
아니면 root 스코프로 하나의 커밋을 만드시겠습니까?"

# If split:
git add frontend/...
git commit -m "feat(frontend): ..."

git add backend/...
git commit -m "feat(backend): ..."

# If combined:
git add frontend/... backend/...
git commit -m "feat(root): ..."
```

## Type Reference (Quick Guide)

| Type | Use When | Korean Example |
|------|----------|----------------|
| `feat` | New functionality | 로그인 기능 추가 |
| `fix` | Bug fix | null 오류 수정 |
| `design` | Pure UI/CSS | 버튼 색상 조정 |
| `refactor` | Code restructure | 컴포넌트 구조 개선 |
| `style` | Code formatting | ESLint 규칙 적용 |
| `chore` | Build/deps/config | Docker 설정 수정 |
| `docs` | Documentation | README 업데이트 |
| `test` | Tests | 단위 테스트 추가 |
| `perf` | Performance | 이미지 로딩 최적화 |
| `ci` | CI/CD | GitLab CI 수정 |

## Scope Reference

| Scope | Use When |
|-------|----------|
| `frontend` | Only frontend/ directory |
| `backend` | Only backend/ directory |
| `root` | Both dirs or root-level files |
| `deps` | Dependency updates |
| `config` | Docker, CI/CD, configs |

## Character Counting Tips

Korean characters count the same as English. Target: **under 80 total**.

Check length:
```bash
echo -n "feat(frontend): 웹캠 통합한 사진 촬영 페이지 추가" | wc -m
# Result: 42 (Good!)
```

If too long, simplify:
- "기능 추가" → "추가"
- "을 사용하여" → omit
- "반응형 디자인 개선" → "반응형 CSS 개선"

## Error Handling

If commit fails:
1. Check commitlint error message
2. Verify type/scope are in allowed enum
3. Check character limit
4. Ensure proper format: `type(scope): subject`

If changes are too broad:
1. Ask user to split into multiple commits
2. Guide on logical grouping
3. Suggest scope for each group

## Model: Haiku

This command uses **Haiku model** for:
- Fast execution (2-3 seconds)
- Cost-effective (pennies per commit)
- Sufficient for commit message generation

Haiku is perfect for this task - no deep reasoning needed, just pattern matching and Korean language generation.

## Success Criteria

Every commit must:
- ✅ Be in Korean (한국어)
- ✅ Follow `<type>(<scope>): <subject>` format
- ✅ Use allowed type from enum
- ✅ Use allowed scope from enum
- ✅ Be under 80 characters
- ✅ Represent atomic change
- ✅ Have NO Co-Authored-By footer
- ✅ Pass commitlint validation

## Usage

Simply run: `/bc`

The command will:
1. Analyze your staged/unstaged changes
2. Determine appropriate type and scope
3. Craft a concise Korean message
4. Execute the commit
5. Verify success

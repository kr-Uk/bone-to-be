# Claude Code Configuration for Bone To Be

This directory contains custom skills and commands for the Bone To Be project.

## Custom Git Commit Tools

### `/bc` Command - Quick Commit

Fast git commit creation following Bone To Be conventions.

**Usage:**
```bash
/bc
```

**What it does:**
1. Analyzes your staged/unstaged changes
2. Determines appropriate type (feat, fix, design, etc.) and scope (frontend, backend, etc.)
3. Crafts a concise Korean commit message (under 80 characters)
4. Executes the commit
5. Verifies success

**Requirements:**
- ✅ Korean commit messages only (한국어)
- ✅ Format: `<type>(<scope>): <subject>`
- ✅ Max 80 characters
- ✅ Atomic commits (single logical change)
- ✅ NO `Co-Authored-By` footer

### Bonetobe-Commit Skill - Auto-Guidance

Automatically activates when Claude detects git commit work to provide project-specific guidance.

**Location:** `.claude/skills/bonetobe-commit/SKILL.md`

**What it provides:**
- Type and scope selection guidelines
- Korean message phrasing examples
- Commit granularity best practices
- Character limit enforcement
- Error prevention (no Co-Authored-By)

## Commit Convention Reference

### Format

```
<type>(<scope>): <subject>
```

### Allowed Types

- `feat` - New feature (새 기능)
- `fix` - Bug fix (버그 수정)
- `design` - UI/CSS changes (디자인)
- `refactor` - Code refactoring (리팩토링)
- `style` - Code formatting (코드 스타일)
- `chore` - Build/deps/config (기타 작업)
- `docs` - Documentation (문서)
- `test` - Tests (테스트)
- `perf` - Performance (성능)
- `ci` - CI/CD
- `revert` - Revert commit (되돌리기)
- `init` - Initial setup (초기 설정)

### Allowed Scopes

- `frontend` - Changes in frontend/ directory
- `backend` - Changes in backend/ directory
- `root` - Project-wide changes
- `deps` - Dependency updates
- `config` - Configuration files

### Examples (All under 80 chars, in Korean)

```bash
feat(frontend): 웹캠 통합한 사진 촬영 페이지 추가
design(frontend): 진단 레이아웃 반응형 CSS 개선
fix(backend): RabbitMQ 연결 타임아웃 오류 해결
refactor(frontend): Zustand 스토어 구조 단순화
chore(deps): React 19.2.0 버전으로 업데이트
docs(root): 시스템 아키텍처 다이어그램 추가
ci(config): GitLab CI 파이프라인 배포 단계 수정
```

## Quick Start

1. **Make changes** to your code
2. **Run `/bc`** to create a commit
3. **Claude will:**
   - Analyze your changes
   - Determine type and scope
   - Create Korean commit message
   - Execute the commit

## Tips

### Keeping Messages Under 80 Characters

Use concise Korean verbs:
- 추가 (add)
- 수정 (modify)
- 개선 (improve)
- 해결 (resolve)
- 구현 (implement)
- 적용 (apply)

Simplify descriptions:
- ❌ "반응형 디자인을 적용하여 레이아웃 개선" (too wordy)
- ✅ "반응형 레이아웃 개선" (concise)

### Type vs Design

- `feat` = New functionality: `feat(frontend): 로그인 버튼 클릭 시 모달 표시`
- `design` = Pure styling: `design(frontend): 버튼 색상 및 간격 조정`

### Multi-Scope Changes

**Preferred:** Split into multiple commits
```bash
# Commit 1
feat(frontend): 로그인 UI 컴포넌트 추가

# Commit 2
feat(backend): 로그인 API 엔드포인트 구현
```

**Alternative:** Use `root` scope
```bash
feat(root): JWT 기반 인증 시스템 구현
```

## Validation

All commits are validated by commitlint (configured in root `commitlint.config.js`).

Check last commit:
```bash
git log -1
npx commitlint --from HEAD~1
```

## Model Configuration

Both the skill and command use **Haiku model** for:
- ⚡ Fast execution (2-3 seconds)
- 💰 Cost-effective (pennies per commit)
- 🎯 Optimized for pattern-based tasks

## Troubleshooting

### Commit fails validation

Check:
1. Is message in Korean?
2. Is format correct: `type(scope): subject`?
3. Is type in allowed enum?
4. Is scope in allowed enum?
5. Is message under 80 characters?

### Message too long

Simplify the Korean description:
- Remove unnecessary particles (을/를)
- Use shorter verbs
- Focus on the core change

### Multiple unrelated changes

Split into separate commits:
```bash
# Stage only related files
git add file1.tsx file2.tsx
git commit -m "feat(frontend): ..."

# Stage other files
git add file3.java
git commit -m "feat(backend): ..."
```

## Support

For questions or issues with these tools, check:
- Skill documentation: `.claude/skills/bonetobe-commit/SKILL.md`
- Command documentation: `.claude/commands/bc.md`
- Project conventions: Root `CLAUDE.md`

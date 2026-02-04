---
module: debug
title: "Testing & Debugging"
triggers: ["bug", "error", "fix", "debug", "test", "failing", "broken", "not working", "crash"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# Debug Module

> Systematic debugging, testing, and quality assurance

**Activates on:** bug, error, fix, debug, test, failing, broken, crash

**Collaborates with:** All modules for verification

---

## Debugging Protocol

### Step 1: Reproduce
```bash
# Get exact error message
npm run dev 2>&1 | head -50

# Check logs
tail -100 logs/error.log

# Reproduce with specific input
curl -X POST localhost:3000/api/test -d '{"input": "value"}'
```

### Step 2: Isolate
```typescript
// Add strategic logging
console.log('[DEBUG] Input:', JSON.stringify(input, null, 2))
console.log('[DEBUG] State before:', state)
// ... operation
console.log('[DEBUG] State after:', state)
console.log('[DEBUG] Output:', output)
```

### Step 3: Identify Root Cause
```
Common causes:
├── Type mismatch (null vs undefined vs empty)
├── Async timing (race condition, missing await)
├── State mutation (direct mutation instead of copy)
├── Missing dependency (useEffect deps, query keys)
├── Environment (env vars, paths, permissions)
└── External (API changes, network, database)
```

### Step 4: Fix & Verify
```bash
# Fix the issue
# Then verify:
npm run typecheck   # No TS errors
npm run test        # All tests pass
npm run dev         # Manual verification
```

---

## Common Error Patterns

### "Cannot read property X of undefined"
```typescript
// Problem
user.profile.name  // user or profile might be null

// Solution
user?.profile?.name ?? 'Unknown'

// Or with explicit check
if (!user?.profile) {
  return <ErrorState message="Profile not found" />
}
```

### "Hydration mismatch"
```typescript
// Problem: Server/client render different content

// Solution 1: useEffect for client-only
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null

// Solution 2: suppressHydrationWarning for dates/random
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>

// Solution 3: dynamic import with ssr: false
const ClientOnly = dynamic(() => import('./component'), { ssr: false })
```

### "Objects are not valid as React child"
```typescript
// Problem
<div>{user}</div>  // user is an object

// Solution
<div>{user.name}</div>
// or
<div>{JSON.stringify(user)}</div>
```

### "Too many re-renders"
```typescript
// Problem: setState in render
function Component() {
  const [x, setX] = useState(0)
  setX(1)  // Infinite loop!
}

// Solution: useEffect or event handler
useEffect(() => {
  setX(1)
}, [])
```

### "Missing await"
```typescript
// Problem
const data = fetchData()  // Returns Promise, not data
console.log(data)         // Promise { <pending> }

// Solution
const data = await fetchData()
console.log(data)         // Actual data
```

---

## Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ItemList } from './item-list'

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('ItemList', () => {
  it('shows loading state', () => {
    render(<ItemList />, { wrapper })
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('shows items when loaded', async () => {
    render(<ItemList />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.status(500)))
    )

    render(<ItemList />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })
  })

  it('handles empty state', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.json([])))
    )

    render(<ItemList />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText(/no items/i)).toBeInTheDocument()
    })
  })
})
```

### API Testing
```typescript
import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/items/route'

describe('POST /api/items', () => {
  it('creates item with valid data', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: { title: 'Test Item' },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.title).toBe('Test Item')
  })

  it('rejects invalid data', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: { title: '' },  // Empty title
    })

    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('requires authentication', async () => {
    // Mock no session
    jest.spyOn(auth, 'getSession').mockResolvedValue(null)

    const { req } = createMocks({
      method: 'POST',
      body: { title: 'Test' },
    })

    const response = await POST(req)

    expect(response.status).toBe(401)
  })
})
```

### Integration Testing
```typescript
import { test, expect } from '@playwright/test'

test.describe('Item Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('creates new item', async ({ page }) => {
    await page.goto('/items')
    await page.click('text=Create Item')

    await page.fill('[name="title"]', 'New Item')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=New Item')).toBeVisible()
  })

  test('deletes item', async ({ page }) => {
    await page.goto('/items')
    await page.click('[data-testid="item-menu"]')
    await page.click('text=Delete')
    await page.click('text=Confirm')

    await expect(page.locator('text=Item deleted')).toBeVisible()
  })
})
```

---

## Debug Commands

```bash
# TypeScript errors
npx tsc --noEmit

# Lint issues
npm run lint

# Test with coverage
npm test -- --coverage

# Test specific file
npm test -- ItemList.test.tsx

# Test with watch
npm test -- --watch

# E2E tests
npx playwright test

# E2E with UI
npx playwright test --ui
```

---

## Error Recovery Checklist

```
[ ] Error message captured
[ ] Reproducible steps documented
[ ] Root cause identified
[ ] Fix implemented
[ ] TypeScript passes
[ ] Tests pass
[ ] Manual verification done
[ ] Edge cases considered
[ ] Similar issues checked
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| `console.log` debugging left in | Remove before commit |
| `// @ts-ignore` | Fix the type issue |
| `any` type to silence error | Proper typing |
| Skipped test | Fix or document why |
| `catch (e) {}` empty | Handle or log error |

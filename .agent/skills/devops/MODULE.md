---
module: devops
title: "Infrastructure & Deployment"
triggers: ["deploy", "CI/CD", "Docker", "pipeline", "infrastructure", "DevOps", "Vercel", "AWS"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# DevOps Module

> CI/CD pipelines, deployment, infrastructure, and operations

**Activates on:** deploy, CI/CD, Docker, pipeline, infrastructure, DevOps

**Collaborates with:** All modules for deployment

---

## Deployment Platforms

### Vercel (Recommended for Next.js)
```bash
# Install CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod

# Environment variables
vercel env add DATABASE_URL production
```

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url"
  }
}
```

### Railway
```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add database
railway add --database postgres
```

### Fly.io
```bash
# Install CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy

# Scale
fly scale count 2
```

---

## CI/CD Pipelines

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Preview Deployments
```yaml
# .github/workflows/preview.yml
name: Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy Preview
        uses: amondnet/vercel-action@v25
        id: deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Preview deployed: ${{ steps.deploy.outputs.preview-url }}`
            })
```

---

## Docker

### Dockerfile for Next.js
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## Database Migrations

### Prisma
```bash
# Create migration
npx prisma migrate dev --name add_user_profile

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

```yaml
# CI migration job
migrate:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Run migrations
      run: npx prisma migrate deploy
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Drizzle
```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate

# Push schema (development)
npx drizzle-kit push
```

---

## Monitoring & Logging

### Health Check Endpoint
```typescript
// app/api/health/route.ts
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check database
    await db.$queryRaw`SELECT 1`

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
      },
    })
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 503 }
    )
  }
}
```

### Structured Logging
```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }

  if (process.env.NODE_ENV === 'production') {
    // JSON for log aggregators
    console.log(JSON.stringify(entry))
  } else {
    // Pretty print for development
    console[level](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, context ?? '')
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
}
```

### Error Tracking (Sentry)
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})

// Usage
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, action: 'riskyOperation' },
  })
  throw error
}
```

---

## Environment Management

```bash
# .env.example (commit this)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# .env.local (never commit)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=actual-secret
```

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env)
```

---

## Deployment Checklist

```
Pre-deployment:
[ ] All tests passing
[ ] TypeScript no errors
[ ] Environment variables set
[ ] Database migrations ready
[ ] Secrets rotated if needed

Deployment:
[ ] Backup database
[ ] Run migrations
[ ] Deploy application
[ ] Verify health check
[ ] Test critical flows

Post-deployment:
[ ] Monitor error rates
[ ] Check performance metrics
[ ] Verify integrations
[ ] Update documentation
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| Secrets in code | Use environment variables |
| No health check | Add /api/health endpoint |
| Manual deployments | Set up CI/CD |
| No rollback plan | Document rollback procedure |
| Missing staging | Create staging environment |

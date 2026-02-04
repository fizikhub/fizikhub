---
module: architect
title: "System Design & Planning"
triggers: ["plan", "design", "architecture", "PRD", "spec", "requirements", "system", "feature"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# Architect Module

> System design, feature planning, and technical specifications

**Activates on:** plan, design, architecture, PRD, spec, requirements, system

**Collaborates with:** All modules for implementation

---

## Planning Workflow

### 1. Requirements Gathering
```
Questions to answer:
- What problem does this solve?
- Who are the users?
- What are the success metrics?
- What are the constraints (time, tech, resources)?
- What are the non-functional requirements?
```

### 2. Technical Design
```
Components to define:
- Data model / schema
- API contracts
- UI/UX flow
- Integration points
- Security considerations
- Performance requirements
```

### 3. Implementation Plan
```
Deliverables:
- Task breakdown
- Dependencies identified
- Risk assessment
- Testing strategy
```

---

## Feature Specification Template

```markdown
# Feature: [Name]

## Overview
Brief description of what this feature does and why it matters.

## User Stories
- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

## Requirements

### Functional
- [ ] Requirement 1
- [ ] Requirement 2

### Non-Functional
- Performance: [target metrics]
- Security: [requirements]
- Accessibility: [standards]

## Technical Design

### Data Model
```prisma
model Feature {
  id        String   @id @default(cuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/features | List features |
| POST | /api/features | Create feature |
| GET | /api/features/:id | Get feature |
| PATCH | /api/features/:id | Update feature |
| DELETE | /api/features/:id | Delete feature |

### UI Components
- FeatureList: Displays paginated list
- FeatureCard: Individual feature display
- FeatureForm: Create/edit form
- FeatureDetail: Full feature view

## Implementation Tasks
1. [ ] Database schema migration
2. [ ] API endpoints
3. [ ] UI components
4. [ ] Integration tests
5. [ ] E2E tests

## Testing Strategy
- Unit tests for business logic
- Integration tests for API
- E2E tests for critical flows

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High | Mitigation approach |

## Success Metrics
- Metric 1: [target]
- Metric 2: [target]
```

---

## Architecture Decision Record (ADR)

```markdown
# ADR-001: [Decision Title]

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue that we're seeing that motivates this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

### Positive
- Benefit 1
- Benefit 2

### Negative
- Tradeoff 1
- Tradeoff 2

## Alternatives Considered

### Option A: [Name]
- Pros: ...
- Cons: ...

### Option B: [Name]
- Pros: ...
- Cons: ...

## References
- [Link to relevant docs]
```

---

## System Design Patterns

### Monolith vs Microservices
```
Start with monolith when:
- Small team (< 10 developers)
- Rapid iteration needed
- Domain not well understood
- MVP/early stage

Consider microservices when:
- Clear domain boundaries
- Independent scaling needs
- Multiple teams
- Different tech requirements
```

### Database Selection
```
PostgreSQL (default choice):
- Complex queries, relations
- ACID compliance
- JSON support

MongoDB:
- Flexible schema
- Document-heavy workloads
- Horizontal scaling

Redis:
- Caching
- Session storage
- Real-time features
- Rate limiting
```

### API Design
```
REST (default):
- Simple CRUD operations
- Cacheable responses
- Wide tooling support

GraphQL:
- Complex data requirements
- Multiple clients (web, mobile)
- Flexible queries

tRPC:
- Full-stack TypeScript
- Type-safe APIs
- Single codebase
```

---

## Scalability Considerations

### Caching Strategy
```typescript
// Application-level caching
const cache = new Map<string, { data: any; expiry: number }>()

async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 60000
): Promise<T> {
  const cached = cache.get(key)
  if (cached && cached.expiry > Date.now()) {
    return cached.data
  }

  const data = await fetcher()
  cache.set(key, { data, expiry: Date.now() + ttl })
  return data
}

// Redis caching
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

async function getWithCache<T>(key: string, fetcher: () => Promise<T>, ttl = 60) {
  const cached = await redis.get<T>(key)
  if (cached) return cached

  const data = await fetcher()
  await redis.setex(key, ttl, data)
  return data
}
```

### Database Optimization
```typescript
// Indexing strategy
model Post {
  id        String   @id
  title     String
  authorId  String
  createdAt DateTime @default(now())

  author    User     @relation(fields: [authorId], references: [id])

  @@index([authorId])           // Foreign key index
  @@index([createdAt(sort: Desc)]) // Sort index
  @@index([authorId, createdAt])   // Compound index
}

// Query optimization
const posts = await db.post.findMany({
  where: { authorId: userId },
  select: {                    // Only needed fields
    id: true,
    title: true,
    createdAt: true,
  },
  orderBy: { createdAt: 'desc' },
  take: 20,                    // Always limit
  skip: (page - 1) * 20,
})
```

---

## Production Readiness Checklist

```
Infrastructure:
[ ] Environment variables configured
[ ] Database backups automated
[ ] Monitoring/alerting set up
[ ] Logging centralized
[ ] CDN configured
[ ] SSL/TLS enabled

Application:
[ ] Error boundaries implemented
[ ] Rate limiting configured
[ ] Health check endpoint
[ ] Graceful shutdown handling
[ ] Database connection pooling

Security:
[ ] Auth/authz implemented
[ ] Input validation everywhere
[ ] Security headers configured
[ ] Secrets management
[ ] Dependency audit clean

Performance:
[ ] Core Web Vitals passing
[ ] Database queries optimized
[ ] Images optimized
[ ] Bundle size reasonable
[ ] Caching strategy implemented

Operations:
[ ] CI/CD pipeline configured
[ ] Staging environment exists
[ ] Rollback procedure documented
[ ] Incident response plan
[ ] On-call rotation set
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| No clear requirements | Gather before building |
| Premature optimization | Start simple, measure, optimize |
| No error handling plan | Design for failure |
| Missing security review | Include from start |
| No testing strategy | Define before coding |

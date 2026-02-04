---
module: api
title: "API & Backend Development"
triggers: ["API", "endpoint", "route", "database", "REST", "GraphQL", "webhook", "server", "Supabase", "Prisma"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# API Module

> Backend development, database operations, and server-side logic

**Activates on:** API, endpoint, route, database, REST, GraphQL, webhook, server action

**Collaborates with:** `ui` for frontend integration, `guard` for security

---

## Endpoint Architecture

Every API endpoint follows this structure:

```typescript
export async function POST(request: Request) {
  // STEP 1: Authentication
  const session = await auth()
  if (!session) {
    return Response.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // STEP 2: Input Validation
  const body = await request.json()
  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // STEP 3: Authorization (resource access)
  const resource = await db.resource.findUnique({
    where: { id: parsed.data.resourceId }
  })
  if (resource?.userId !== session.user.id) {
    return Response.json(
      { error: 'Not found' },
      { status: 404 } // Don't reveal existence
    )
  }

  // STEP 4: Execute with error handling
  try {
    const result = await performOperation(parsed.data)
    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error('Operation failed:', error)
    return Response.json(
      { error: 'Operation failed' },
      { status: 500 }
    )
  }
}
```

---

## Route Patterns

### RESTful Structure
```
app/api/users/route.ts           → GET/POST /api/users
app/api/users/[id]/route.ts      → GET/PATCH/DELETE /api/users/:id
app/api/users/[id]/posts/route.ts → GET /api/users/:id/posts
```

### Complete CRUD Example
```typescript
// app/api/items/route.ts

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
})

// LIST
export async function GET(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20'))

  const [items, total] = await Promise.all([
    db.item.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.item.count({ where: { userId: session.user.id } }),
  ])

  return Response.json({
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}

// CREATE
export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const item = await db.item.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    })
    return Response.json(item, { status: 201 })
  } catch (error) {
    console.error('Create failed:', error)
    return Response.json({ error: 'Creation failed' }, { status: 500 })
  }
}
```

```typescript
// app/api/items/[id]/route.ts

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const UpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
})

// GET SINGLE
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const item = await db.item.findUnique({ where: { id } })

  if (!item || item.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(item)
}

// UPDATE
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const item = await db.item.findUnique({ where: { id } })

  if (!item || item.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const updated = await db.item.update({
    where: { id },
    data: parsed.data,
  })

  return Response.json(updated)
}

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const item = await db.item.findUnique({ where: { id } })

  if (!item || item.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  await db.item.delete({ where: { id } })

  return new Response(null, { status: 204 })
}
```

---

## Server Actions

```typescript
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const Schema = z.object({
  title: z.string().min(1, 'Title required').max(200),
})

export async function createItem(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: 'Please sign in' }
  }

  const parsed = Schema.safeParse({
    title: formData.get('title'),
  })

  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() }
  }

  try {
    const item = await db.item.create({
      data: {
        title: parsed.data.title,
        userId: session.user.id,
      },
    })

    revalidatePath('/items')
    return { success: true, data: item }
  } catch (error) {
    console.error('Create error:', error)
    return { error: 'Failed to create item' }
  }
}
```

---

## Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  // 1. Verify webhook signature
  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook verification failed:', error)
    return new Response('Invalid signature', { status: 400 })
  }

  // 2. Idempotency: Check if already processed
  const existing = await db.webhookEvent.findUnique({
    where: { stripeEventId: event.id },
  })
  if (existing) {
    return new Response('Already processed', { status: 200 })
  }

  // 3. Process event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object)
        break
      // Add more handlers
    }

    // 4. Record processed event
    await db.webhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        processedAt: new Date(),
      },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook processing failed:', error)
    return new Response('Processing failed', { status: 500 })
  }
}
```

---

## Database Best Practices

```typescript
// ALWAYS: Include relations to prevent N+1
const posts = await db.post.findMany({
  include: {
    author: { select: { id: true, name: true, avatar: true } },
    _count: { select: { comments: true, likes: true } },
  },
})

// ALWAYS: Paginate list queries
const items = await db.item.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
})

// ALWAYS: Use transactions for multi-step operations
await db.$transaction(async (tx) => {
  await tx.account.update({ where: { id: fromId }, data: { balance: { decrement: amount } } })
  await tx.account.update({ where: { id: toId }, data: { balance: { increment: amount } } })
  await tx.transfer.create({ data: { fromId, toId, amount } })
})

// ALWAYS: Use correct column types
// IDs: BIGINT or UUID (not INT)
// Timestamps: TIMESTAMPTZ (not TIMESTAMP)
// Money: DECIMAL(10,2) (not FLOAT)
```

---

## Decision Guide

| Scenario | Approach |
|----------|----------|
| Form submission | Server Action |
| Data mutation from UI | Server Action |
| External API access needed | API Route |
| Webhook receiver | API Route |
| Third-party integration | API Route |
| Background job trigger | API Route |

---

## Security Checklist

```
[ ] Auth check at entry point
[ ] Zod validation on all inputs
[ ] Ownership verification on resources
[ ] Generic errors to client
[ ] Detailed errors to logs only
[ ] No secrets in response
[ ] Webhook signatures verified
[ ] Rate limiting considered
[ ] SQL injection prevented (parameterized)
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| No `await auth()` | Add authentication |
| `Schema.parse()` without try | Use `safeParse()` |
| No ownership check | Verify resource.userId |
| `return { error: e.message }` | Generic error to client |
| String interpolation in SQL | Use parameterized queries |
| No pagination on lists | Add skip/take |
| Missing webhook verification | Validate signature |

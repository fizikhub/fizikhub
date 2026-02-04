---
module: guard
title: "Security & Authentication"
triggers: ["auth", "login", "security", "permission", "OWASP", "encryption", "JWT", "session"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# Guard Module

> Security hardening, authentication flows, and authorization patterns

**Activates on:** auth, login, security, permission, OWASP, encryption, JWT

**Collaborates with:** `api` for endpoints, `ui` for auth UI

---

## Authentication Setup (NextAuth.js v5)

### Configuration
```typescript
// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user?.hashedPassword) return null

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.hashedPassword
        )

        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

### Route Handlers
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'

export const { GET, POST } = handlers
```

### Middleware
```typescript
// middleware.ts
import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login')
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Authorization Patterns

### Resource Ownership Check
```typescript
// ALWAYS verify ownership before access
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const resource = await db.resource.findUnique({
    where: { id },
  })

  // Return 404, not 403 (don't reveal existence)
  if (!resource || resource.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(resource)
}
```

### Role-Based Access Control (RBAC)
```typescript
// lib/permissions.ts
type Role = 'user' | 'admin' | 'moderator'
type Permission = 'read' | 'write' | 'delete' | 'manage'

const rolePermissions: Record<Role, Permission[]> = {
  user: ['read'],
  moderator: ['read', 'write', 'delete'],
  admin: ['read', 'write', 'delete', 'manage'],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function requirePermission(permission: Permission) {
  return async function (req: Request) {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || !hasPermission(user.role as Role, permission)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return null // Authorized
  }
}
```

---

## Input Validation

### Zod Schemas
```typescript
import { z } from 'zod'

// User input
export const userSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
})

// Sanitize HTML content
export const contentSchema = z.string().transform((val) => {
  // Strip potentially dangerous tags
  return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
})

// ID validation
export const idSchema = z.string().uuid()

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
```

### Safe Parsing
```typescript
export async function POST(request: Request) {
  const body = await request.json()

  const result = userSchema.safeParse(body)
  if (!result.success) {
    return Response.json(
      {
        error: 'Validation failed',
        details: result.error.flatten(),
      },
      { status: 400 }
    )
  }

  // result.data is typed and validated
  const user = await createUser(result.data)
  return Response.json(user, { status: 201 })
}
```

---

## Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## OWASP Top 10 Prevention

### 1. Injection
```typescript
// NEVER: String interpolation in queries
await db.$queryRaw`SELECT * FROM users WHERE id = ${id}` // Parameterized - SAFE

// NEVER: Template literals for SQL
const query = `SELECT * FROM users WHERE id = '${id}'` // UNSAFE
```

### 2. Broken Authentication
```typescript
// Use secure session configuration
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

// Secure password hashing
const hash = await bcrypt.hash(password, 12)

// Rate limiting on auth endpoints
```

### 3. Sensitive Data Exposure
```typescript
// Never expose sensitive fields
const user = await db.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    // hashedPassword: NEVER
    // creditCard: NEVER
  },
})

// Use environment variables
const apiKey = process.env.API_SECRET // Never hardcode
```

### 4. XSS Prevention
```typescript
// React escapes by default, but watch for:

// DANGEROUS: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} /> // Avoid!

// SAFE: Let React escape
<div>{userContent}</div>

// If HTML needed, sanitize first
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### 5. CSRF Protection
```typescript
// Next.js Server Actions have built-in CSRF protection
// For API routes, verify origin
export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin !== process.env.NEXT_PUBLIC_APP_URL) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 })
  }
  // ... rest of handler
}
```

---

## Security Checklist

```
[ ] Auth on all protected routes
[ ] Ownership check on resource access
[ ] Input validation with Zod
[ ] Passwords hashed (bcrypt, 12+ rounds)
[ ] Secrets in environment variables
[ ] HTTPS enforced
[ ] Security headers configured
[ ] Rate limiting on auth endpoints
[ ] SQL injection prevented
[ ] XSS prevented
[ ] CSRF tokens verified
[ ] Sensitive data not logged
[ ] Errors don't leak info
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| No `await auth()` check | Add authentication |
| `password` in response | Remove sensitive fields |
| Hardcoded secrets | Use env variables |
| `dangerouslySetInnerHTML` | Sanitize or avoid |
| SQL string concatenation | Use parameterized queries |
| `error.message` to client | Generic error message |
| No rate limiting on login | Add rate limiter |

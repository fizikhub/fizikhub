---
module: ui
title: "User Interface Development"
triggers: ["component", "page", "form", "button", "modal", "React", "Next.js", "Tailwind", "styling", "UI"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# UI Module

> Frontend development with React, Next.js, and modern styling

**Activates on:** component, page, form, button, modal, styling, React, Next.js, Tailwind

**Collaborates with:** `api` for data fetching, `debug` for testing

---

## Component Classification

```
No interactivity       → Server Component (default in Next.js)
Uses hooks/events      → Client Component ('use client')
Hybrid needs           → Server parent + Client child
```

---

## State Architecture

| Data Type | Solution |
|-----------|----------|
| Server/API data | TanStack Query |
| Global UI | Zustand |
| Local UI | useState |
| Form | React Hook Form |
| URL | nuqs |

---

## Mandatory Patterns

### Data Display Component
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorCard } from '@/components/ui/error-card'
import { EmptyState } from '@/components/ui/empty-state'

export function ItemList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  if (error) {
    return <ErrorCard message="Failed to load" onRetry={refetch} />
  }

  if (!data?.length) {
    return <EmptyState title="No items" action={<CreateButton />} />
  }

  return (
    <ul className="space-y-2">
      {data.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ul>
  )
}
```

### Form Component
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function CreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '' },
  })

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Created successfully')
      form.reset()
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to create')
    },
  })

  return (
    <form onSubmit={form.handleSubmit(data => mutation.mutate(data))}>
      <Input
        {...form.register('title')}
        placeholder="Title"
        error={form.formState.errors.title?.message}
      />
      <Textarea
        {...form.register('description')}
        placeholder="Description"
      />
      <Button
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Creating...' : 'Create'}
      </Button>
    </form>
  )
}
```

### Server Component (Data Fetching)
```typescript
// app/items/page.tsx
import { db } from '@/lib/db'
import { ItemList } from './item-list'

export default async function ItemsPage() {
  const items = await db.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Items</h1>
      <ItemList initialData={items} />
    </main>
  )
}
```

### Next.js 15 Async Params
```typescript
// Dynamic route with async params
export default async function ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams

  const item = await db.item.findUnique({ where: { id } })

  if (!item) notFound()

  return <ItemDetail item={item} activeTab={tab} />
}
```

---

## Component Libraries

| Context | Recommendation |
|---------|----------------|
| Standard UI | shadcn/ui |
| Visual effects | Aceternity UI, Magic UI |
| Enterprise/Admin | Preline UI |
| AI/Chat interfaces | Prompt Kit |

---

## Styling Guidelines

```typescript
// Use cn() for conditional classes
import { cn } from '@/lib/utils'

<div className={cn(
  'rounded-lg border p-4',
  isActive && 'border-primary bg-primary/5',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />
```

---

## Accessibility Checklist

```
[✓] Keyboard navigation works
[✓] Focus states visible
[✓] ARIA labels on icons/buttons
[✓] Color contrast sufficient
[✓] Screen reader tested
```

---

## Completion Checklist

```
[ ] Real data integration (no mocks)
[ ] Loading skeleton present
[ ] Error state with retry
[ ] Empty state with action
[ ] Form validation messages
[ ] Submit loading indicator
[ ] Success/error feedback
[ ] TypeScript: zero errors
[ ] Responsive design
[ ] Accessibility verified
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| `const items = [{id:1}]` | Fetch from API/DB |
| `onClick={() => {}}` | Implement handler |
| Missing loading state | Add Skeleton |
| Missing error state | Add ErrorCard |
| `any` type | Add proper types |
| No form validation | Add Zod schema |

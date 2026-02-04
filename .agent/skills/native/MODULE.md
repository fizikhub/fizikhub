---
module: native
title: "Mobile App Development"
triggers: ["mobile", "Expo", "React Native", "NativeWind", "iOS", "Android", "app"]
version: 1.0.0
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# Native Module

> Cross-platform mobile development with Expo and React Native

**Activates on:** mobile, Expo, React Native, NativeWind, iOS, Android, app

**Collaborates with:** `api` for backend, `ui` for shared patterns

---

## Project Setup

```bash
# Create new Expo project
npx create-expo-app@latest my-app
cd my-app

# Essential dependencies
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install nativewind tailwindcss
npx expo install @supabase/supabase-js
npx expo install expo-secure-store
npx expo install react-native-reanimated
```

---

## Navigation (Expo Router)

### File Structure
```
app/
├── _layout.tsx          # Root layout
├── index.tsx            # Home screen (/)
├── (tabs)/              # Tab navigator
│   ├── _layout.tsx
│   ├── index.tsx        # First tab
│   ├── explore.tsx      # Second tab
│   └── profile.tsx      # Third tab
├── (auth)/              # Auth group
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── items/
│   ├── index.tsx        # /items
│   └── [id].tsx         # /items/:id
└── +not-found.tsx       # 404 screen
```

### Root Layout
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/providers/auth'
import '../global.css'

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

### Tab Layout
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Home, Search, User } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
```

---

## NativeWind Styling

### Setup
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Usage
```typescript
import { View, Text, Pressable } from 'react-native'

export function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-blue-500 active:bg-blue-600 rounded-xl py-3 px-6"
    >
      <Text className="text-white font-semibold text-center">{title}</Text>
    </Pressable>
  )
}
```

---

## Data Fetching Pattern

```typescript
// hooks/use-items.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: { title: string }) => {
      const { data, error } = await supabase
        .from('items')
        .insert(item)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}
```

---

## Screen with All States

```typescript
// app/(tabs)/index.tsx
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { useItems } from '@/hooks/use-items'
import { ItemCard } from '@/components/item-card'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'

export default function HomeScreen() {
  const { data: items, isLoading, error, refetch, isRefetching } = useItems()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState message="Failed to load items" onRetry={refetch} />
  }

  if (!items?.length) {
    return <EmptyState title="No items yet" subtitle="Create your first item" />
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerClassName="p-4 gap-3"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </View>
  )
}
```

---

## Supabase Auth

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

```typescript
// providers/auth.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## Important Reminders

```bash
# Use npx expo install (NOT npm install) for native packages
npx expo install expo-camera    # Correct
npm install expo-camera         # Wrong - version mismatch

# Check Expo SDK compatibility
npx expo-doctor
```

---

## Completion Checklist

```
[ ] Real Supabase/API integration
[ ] Loading states (skeleton/spinner)
[ ] Error states with retry
[ ] Empty states with action
[ ] Pull-to-refresh on lists
[ ] Secure token storage
[ ] TypeScript: zero errors
[ ] iOS tested
[ ] Android tested
```

---

## Red Flags

| Pattern | Resolution |
|---------|------------|
| `npm install` for native | Use `npx expo install` |
| AsyncStorage for tokens | Use expo-secure-store |
| Missing loading state | Add skeleton/spinner |
| No error handling | Add try/catch + UI |
| Inline styles everywhere | Use NativeWind |

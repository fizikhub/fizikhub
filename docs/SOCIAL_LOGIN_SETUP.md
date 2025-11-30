# Social Login Setup Guide

## Google OAuth Setup

### 1. Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

### 2. Configure in Supabase
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add Client ID and Client Secret from Google Console
4. Save

### 3. Add to Your App
```tsx
import { createClient } from '@/lib/supabase'

async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

---

## GitHub OAuth Setup

### 1. Create GitHub OAuth App
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Homepage URL: `https://fizikhub.com`
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Get Client ID and Client Secret

### 2. Configure in Supabase
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable GitHub provider
3. Add Client ID and Client Secret
4. Save

### 3. Add to Your App
```tsx
async function signInWithGitHub() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

---

## Implementation Example

```tsx
// components/auth/social-login.tsx
"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

export function SocialLogin() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="outline" 
        onClick={handleGoogleLogin}
        className="w-full"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          {/* Google icon SVG */}
        </svg>
        Google ile Giriş
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleGitHubLogin}
        className="w-full"
      >
        <Github className="w-5 h-5 mr-2" />
        GitHub ile Giriş
      </Button>
    </div>
  );
}
```

## Callback Route

Create `app/auth/callback/route.ts`:
```tsx
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
```

## Notes
- Users authenticated via OAuth will automatically get a profile created
- Email verification is handled by the provider
- You can customize the login UI to match your design

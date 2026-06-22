import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Next.js resolves this marker through its server condition. Vitest runs in a
// browser-like environment, so mock only the marker while keeping the module
// protected in real application builds.
vi.mock('server-only', () => ({}));

// Supabase server actions commonly use 'next/headers'
vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

// Revalidate path is used everywhere
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

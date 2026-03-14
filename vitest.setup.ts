import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Supabase server actions commonly use 'next/headers'
vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

// Revalidate path is used everywhere
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

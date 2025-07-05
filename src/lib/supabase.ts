import { createClient } from '@supabase/supabase-js';

// 환경변수가 없으면 Mock 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development';

// Mock URL이면 Mock 클라이언트 사용
export const supabase = supabaseUrl.includes('mock') 
  ? createMockSupabaseClient() 
  : createClient(supabaseUrl, supabaseAnonKey);

// 개발 환경용 Mock Supabase 클라이언트
function createMockSupabaseClient() {
  const mockResponse = { data: [], error: null };
  
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        then: (callback: any) => callback({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      upsert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            then: (callback: any) => callback({ data: null, error: null })
          }),
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      })
    })
  } as any;
} 
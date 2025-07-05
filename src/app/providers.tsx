'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { NavigationProvider } from '@/lib/navigation';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </SessionProvider>
  );
} 
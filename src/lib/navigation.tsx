'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationItem {
  path: string;
  title: string;
  timestamp: number;
}

interface NavigationContextType {
  navigationStack: NavigationItem[];
  currentPath: string;
  canGoBack: boolean;
  goBack: () => void;
  pushToStack: (path: string, title: string) => void;
  clearStack: () => void;
  getPageTitle: (path: string) => string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const getDefaultTitle = (path: string): string => {
  const pathSegments = path.split('/').filter(Boolean);
  
  if (path === '/') return '홈';
  if (path === '/simulation') return '시뮬레이션';
  if (path === '/settings') return '설정';
  if (pathSegments[0] === 'simulation') {
    const simulationMap: { [key: string]: string } = {
      'mirror-lens': '거울과 렌즈',
      'moon-motion': '달의 움직임',
      'electric-circuit': '전기 회로',
      'magnetic-field': '자기장',
      'light-synthesis': '빛의 합성',
      'electroscope': '검전기',
      'electroscope-v2': '검전기 V2',
      'motor': '전동기',
      'commutator': '정류자',
      'sunspot': '태양 흑점',
      'moon-phase': '달의 위상'
    };
    return simulationMap[pathSegments[1]] || '시뮬레이션';
  }
  
  return pathSegments[pathSegments.length - 1] || '페이지';
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [navigationStack, setNavigationStack] = useState<NavigationItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Add current page to stack if it's not already there
    const currentTitle = getDefaultTitle(pathname);
    setNavigationStack(prev => {
      const lastItem = prev[prev.length - 1];
      if (lastItem?.path === pathname) {
        return prev;
      }
      
      // Remove any existing instances of this path to avoid duplicates
      const filtered = prev.filter(item => item.path !== pathname);
      return [...filtered, {
        path: pathname,
        title: currentTitle,
        timestamp: Date.now()
      }];
    });
  }, [pathname]);

  const pushToStack = (path: string, title: string) => {
    setNavigationStack(prev => {
      const filtered = prev.filter(item => item.path !== path);
      return [...filtered, {
        path,
        title,
        timestamp: Date.now()
      }];
    });
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const previousPage = navigationStack[navigationStack.length - 2];
      setNavigationStack(prev => prev.slice(0, -1));
      router.push(previousPage.path);
    } else {
      router.push('/');
    }
  };

  const clearStack = () => {
    setNavigationStack([]);
  };

  const getPageTitle = (path: string): string => {
    const item = navigationStack.find(item => item.path === path);
    return item?.title || getDefaultTitle(path);
  };

  return (
    <NavigationContext.Provider value={{
      navigationStack,
      currentPath: pathname,
      canGoBack: navigationStack.length > 1,
      goBack,
      pushToStack,
      clearStack,
      getPageTitle
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoginButton from './LoginButton';

export default function AuthWrapper() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트 사이드에서만 렌더링
  if (!isClient) {
    return (
      <button className="login-button" disabled>
        로딩 중...
      </button>
    );
  }

  return <LoginButton />;
} 
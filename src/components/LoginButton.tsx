'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 로딩 상태 표시
  if (!mounted) {
    return (
      <button className="login-button" disabled>
        로딩 중...
      </button>
    );
  }

  if (status === 'loading') {
    return (
      <button className="login-button" disabled>
        로딩 중...
      </button>
    );
  }

  if (session) {
    return (
      <div className="user-section" suppressHydrationWarning>
        <div className="user-info">
          <img 
            src={session.user?.image || '/default-avatar.png'} 
            alt="프로필" 
            className="user-avatar"
          />
          <span className="user-name">{session.user?.name}</span>
        </div>
        <button 
          className="logout-button"
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button 
      className="login-button"
      onClick={() => signIn('google')}
    >
      Google 로그인
    </button>
  );
} 
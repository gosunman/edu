import React, { useEffect, useState } from 'react';

const buttonStyle: React.CSSProperties = {
  position: 'fixed',
  right: '20px',
  bottom: '84px',
  zIndex: 1100,
  background: 'linear-gradient(90deg,#667eea,#764ba2)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '48px',
  height: '48px',
  boxShadow: '0 4px 16px rgba(102,126,234,0.15)',
  fontSize: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  opacity: 0.85,
};

export default function FloatingToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      style={buttonStyle}
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 20V8" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M8.5 13.5L14 8L19.5 13.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
} 
import React from 'react';
import styles from '../app/flashcard/flashcard.module.css';

interface FavoriteCardProps {
  title: string;
  description: string;
  subject: string;
  type: 'flashcard' | 'simulation' | string;
  onClick: () => void;
  actionLabel: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function FavoriteCard({ title, description, subject, type, onClick, actionLabel, isFavorite, onToggleFavorite }: FavoriteCardProps) {
  return (
    <div className={styles.favoriteCard}>
      <div className={styles.favoriteHeader}>
        <span className={styles.favoriteType}>{type === 'flashcard' ? '📚' : '🎮'}</span>
        <span className={styles.favoriteSubject}>{subject}</span>
        {onToggleFavorite && (
          <button
            className={styles.favoriteButton + (isFavorite ? ' ' + styles.favorited : '')}
            onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            style={{marginLeft:'auto',marginRight:0,background:'none',border:'none',cursor:'pointer',fontSize:'22px'}}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
      </div>
      <h3 className={styles.favoriteTitle}>{title}</h3>
      <p className={styles.favoriteDescription}>{description}</p>
      <button className={styles.favoriteActionButton} onClick={onClick}>
        {actionLabel}
      </button>
    </div>
  );
} 
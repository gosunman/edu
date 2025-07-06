import React from 'react';
import styles from '../app/flashcard/flashcard.module.css';

interface FavoriteCardProps {
  title: string;
  description: string;
  gradeLabel?: string;
  majorLabel?: string;
  subLabel?: string;
  customLabel?: string;
  type: 'flashcard' | 'simulation' | string;
  onClick: () => void;
  actionLabel: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function FavoriteCard({ title, description, gradeLabel, majorLabel, subLabel, customLabel, type, onClick, actionLabel, isFavorite, onToggleFavorite }: FavoriteCardProps) {
  return (
    <div className={styles.favoriteCard}>
      <div className={styles.favoriteHeader}>
        <span className={styles.favoriteType}>{type === 'flashcard' ? '📚' : '🎮'}</span>
        <div className={styles.favoriteLabels}>
          {customLabel ? (
            <span className={styles.favoriteSubject}>{customLabel}</span>
          ) : (
            <>
              {gradeLabel && <span className={styles.favoriteSubject}>{gradeLabel}</span>}
              {majorLabel && <span className={styles.favoriteSubject}>{majorLabel}</span>}
              {subLabel && <span className={styles.favoriteSubject}>{subLabel}</span>}
            </>
          )}
        </div>
        {onToggleFavorite && (
          <button
            className={styles.favoriteButton + (isFavorite ? ' ' + styles.favorited : '')}
            onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            style={{background:'none',border:'none',cursor:'pointer',fontSize:'22px'}}
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
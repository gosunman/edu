import React from 'react';
import styles from '../app/Home.module.css';

interface FavoriteCardProps {
  title: string;
  description: string;
  subject: string;
  type: 'flashcard' | 'simulation' | string;
  onClick: () => void;
  actionLabel: string;
}

export default function FavoriteCard({ title, description, subject, type, onClick, actionLabel }: FavoriteCardProps) {
  return (
    <div className={styles.favoriteCard}>
      <div className={styles.favoriteHeader}>
        <span className={styles.favoriteType}>{type === 'flashcard' ? '📚' : '🎮'}</span>
        <span className={styles.favoriteSubject}>{subject}</span>
      </div>
      <h3 className={styles.favoriteTitle}>{title}</h3>
      <p className={styles.favoriteDescription}>{description}</p>
      <button className={styles.favoriteActionButton} onClick={onClick}>
        {actionLabel}
      </button>
    </div>
  );
} 
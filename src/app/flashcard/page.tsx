'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { flashCards } from '@/data/flashCards';
import { units } from '@/data/units';
import { useFavorites, addToFavorites, removeFromFavorites } from '@/lib/favorites';
import { FlashCard } from '@/types';
import Link from 'next/link';
import styles from './flashcard.module.css';
import FavoriteCard from '@/components/FavoriteCard';
import { useRouter } from 'next/navigation';

interface CardGroup {
  id: string;
  type: 'subject' | 'subChapter' | 'custom';
  title: string;
  description: string;
  cards: FlashCard[];
}

export default function FlashCardPage() {
  const [groupedCards, setGroupedCards] = useState<CardGroup[]>([]);
  const { addFavorite, removeFavorite, checkFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [favoriteGroups, setFavoriteGroups] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

    // 즐겨찾기 그룹 불러오기
    if (typeof window !== 'undefined') {
      try {
        const fav = JSON.parse(localStorage.getItem('favoriteFlashcardGroups') || '[]');
        if (Array.isArray(fav)) setFavoriteGroups(fav);
      } catch {}
    }

    // flashCards + 로컬스토리지 customFlashCards 병합
    let mergedCards = [...flashCards];
    if (typeof window !== 'undefined') {
      try {
        const local = JSON.parse(localStorage.getItem('customFlashCards') || '[]');
        if (Array.isArray(local)) mergedCards = [...mergedCards, ...local];
      } catch {}
    }

    const groupData = (cards: FlashCard[]): CardGroup[] => {
      const groups: { [key: string]: CardGroup } = {};

      cards.forEach(card => {
        let groupId: string;
        let groupTitle: string;
        let groupDescription: string;
        let groupType: 'subject' | 'subChapter' | 'custom';

        if (card.subject === '한자') {
          groupId = 'subject-hanja';
          groupTitle = '한자';
          groupDescription = '급수별 한자 암기';
          groupType = 'subject';
        } else if (card.category === 'science') {
          const unitInfo = units.find(u => u.subChapter === card.subChapter);
          groupId = `subchapter-${card.subChapter}`;
          groupTitle = unitInfo 
            ? `${unitInfo.majorChapterTitle} - ${unitInfo.subChapterTitle}`
            : `${card.chapter} - ${card.subChapter}`;
          groupDescription = `총 ${cards.filter(c => c.subChapter === card.subChapter).length}개의 암기카드`;
          groupType = 'subChapter';
        } else if (card.groupId && card.groupId.startsWith('custom-')) {
          groupId = card.groupId;
          groupTitle = card.chapter || '커스텀 카드';
          groupDescription = `내가 만든 카드 (${cards.filter(c => c.groupId === groupId).length}개)`;
          groupType = 'custom';
        } else {
          groupId = `custom-${card.id}`;
          groupTitle = '커스텀 카드';
          groupDescription = '사용자 생성 카드';
          groupType = 'custom';
        }

        if (!groups[groupId]) {
          groups[groupId] = { 
            id: groupId,
            type: groupType,
            title: groupTitle,
            description: groupDescription,
            cards: []
          };
        }
        groups[groupId].cards.push(card);
      });
      return Object.values(groups);
    };

    setGroupedCards(groupData(mergedCards));
  }, []);

  // 즐겨찾기 토글
  const handleToggleFavorite = (groupId: string) => {
    let next: string[];
    const group = groupedCards.find(g => g.id === groupId);
    if (!group) return;
    if (favoriteGroups.includes(groupId)) {
      next = favoriteGroups.filter(id => id !== groupId);
      // user_favorites에서도 제거
      removeFromFavorites(groupId, 'flashcard');
    } else {
      next = [...favoriteGroups, groupId];
      // user_favorites에도 추가
      addToFavorites({
        id: groupId,
        type: 'flashcard',
        title: group.title,
        description: group.description,
        category: group.type,
        subject: group.type === 'subject' ? '한자' : group.type === 'subChapter' ? '과학' : '커스텀',
        chapter: undefined,
        subChapter: undefined
      });
    }
    setFavoriteGroups(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteFlashcardGroups', JSON.stringify(next));
    }
  };

  if (!mounted) return null;

  return (
    <MainLayout title="암기카드">
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h2>암기카드 묶음</h2>
          <p>학습하고 싶은 묶음을 선택하세요.</p>
          <Link href="/flashcard/custom/create" className={styles.createButton}>
            + 새 암기카드 만들기
          </Link>
        </div>

        <div className={styles.groupGrid}>
          {groupedCards.map((group) => (
            <FavoriteCard
              key={group.id}
              title={group.title}
              description={group.description}
              subject={group.type === 'subject' ? '한자' : group.type === 'subChapter' ? '과학' : '커스텀'}
              type={group.type === 'subject' ? 'flashcard' : group.type === 'subChapter' ? 'flashcard' : 'flashcard'}
              onClick={() => router.push(`/flashcard/study/${group.id}`)}
              actionLabel="학습하기"
              isFavorite={favoriteGroups.includes(group.id)}
              onToggleFavorite={() => handleToggleFavorite(group.id)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 
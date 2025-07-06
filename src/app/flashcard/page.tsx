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
import simStyles from '../simulation/simulation.module.css';

interface CardGroup {
  id: string;
  type: 'subject' | 'subChapter' | 'custom' | 'minorChapter';
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

  // 필터 상태
  const [selectedGrade, setSelectedGrade] = useState<string>('전체');
  const [selectedMajor, setSelectedMajor] = useState<string>('전체');

  // 학년/대단원/중단원 목록 추출
  const gradeList = Array.from(new Set(units.map(u => u.grade)));
  const majorList = selectedGrade === '전체'
    ? Array.from(new Set(units.map(u => u.majorChapterTitle)))
    : Array.from(new Set(units.filter(u => u.grade === selectedGrade).map(u => u.majorChapterTitle)));
  let subList: string[] = [];
  if (selectedGrade === '전체' && selectedMajor === '전체') {
    subList = Array.from(new Set(units.map(u => u.subChapterTitle)));
  } else if (selectedGrade !== '전체' && selectedMajor === '전체') {
    subList = Array.from(new Set(units.filter(u => u.grade === selectedGrade).map(u => u.subChapterTitle)));
  } else if (selectedGrade !== '전체' && selectedMajor !== '전체') {
    subList = Array.from(new Set(units.filter(u => u.grade === selectedGrade && u.majorChapterTitle === selectedMajor).map(u => u.subChapterTitle)));
  } else if (selectedGrade === '전체' && selectedMajor !== '전체') {
    subList = Array.from(new Set(units.filter(u => u.majorChapterTitle === selectedMajor).map(u => u.subChapterTitle)));
  }

  const [selectedSub, setSelectedSub] = useState<string>('전체');

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
      // 소단원별로만 그룹화 (대단원/중단원 그룹화는 완전히 제거)
      return units
        .filter(u => u.type === 'unit' && ['중1','중2','중3'].includes(u.grade))
        .map(unit => {
          const groupCards = cards.filter(card => card.unitId === unit.id).slice(0, 10);
          return {
            id: unit.id,
            type: 'minorChapter' as const,
            title: unit.minorChapterTitle,
            description: `${unit.grade} / ${unit.majorChapterTitle} / ${unit.subChapterTitle} - ${unit.description}`,
            cards: groupCards
          };
        })
        .filter(group => group.cards.length > 0);
    };

    setGroupedCards(groupData(mergedCards));
  }, []);

  // 필터링된 카드 그룹
  const filteredGroups = groupedCards.filter(group => {
    const unit = units.find(u => u.id === group.id);
    if (!unit) return false;
    if (selectedGrade !== '전체' && unit.grade !== selectedGrade) return false;
    if (selectedMajor !== '전체' && unit.majorChapterTitle !== selectedMajor) return false;
    if (selectedSub !== '전체' && unit.subChapterTitle !== selectedSub) return false;
    return true;
  });

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
        {/* 시뮬레이션과 동일한 필터 섹션 */}
        <div className={simStyles.filters}>
          <div className={simStyles.filterRow}>
            <div className={simStyles.toggleGroup}>
              <span className={simStyles.toggleLabel}>학년</span>
              <button
                className={`${simStyles.toggleButton} ${selectedGrade === '전체' ? simStyles.active : ''}`}
                onClick={() => { setSelectedGrade('전체'); setSelectedMajor('전체'); setSelectedSub('전체'); }}
              >전체</button>
              {gradeList.map(grade => (
                <button
                  key={grade}
                  className={`${simStyles.toggleButton} ${selectedGrade === grade ? simStyles.active : ''}`}
                  onClick={() => {
                    setSelectedGrade(grade);
                    setSelectedMajor('전체');
                    setSelectedSub('전체');
                  }}
                >{grade}</button>
              ))}
            </div>
            <div className={simStyles.toggleGroup}>
              <span className={simStyles.toggleLabel}>대단원</span>
              <button
                className={`${simStyles.toggleButton} ${selectedMajor === '전체' ? simStyles.active : ''}`}
                onClick={() => { setSelectedMajor('전체'); setSelectedSub('전체'); }}
              >전체</button>
              {majorList.map(major => (
                <button
                  key={major}
                  className={`${simStyles.toggleButton} ${selectedMajor === major ? simStyles.active : ''}`}
                  onClick={() => { setSelectedMajor(major); setSelectedSub('전체'); }}
                >{major}</button>
              ))}
            </div>
            <div className={simStyles.toggleGroup}>
              <span className={simStyles.toggleLabel}>중단원</span>
              <button
                className={`${simStyles.toggleButton} ${selectedSub === '전체' ? simStyles.active : ''}`}
                onClick={() => setSelectedSub('전체')}
              >전체</button>
              {subList.map(sub => (
                <button
                  key={sub}
                  className={`${simStyles.toggleButton} ${selectedSub === sub ? simStyles.active : ''}`}
                  onClick={() => setSelectedSub(sub)}
                >{sub}</button>
              ))}
            </div>
          </div>
        </div>
        {/* +새 암기카드 만들기 버튼 */}
        <Link href="/flashcard/custom/create" className={styles.createButton}>
          + 새 암기카드 만들기
        </Link>
        {/* 카드 그룹 목록 */}
        <div className={styles.groupGrid}>
          {filteredGroups.map((group) => (
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
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { units } from '@/data/units';
import { flashCards, searchFlashCards } from '@/data/flashCards';
import { simulations, searchSimulations } from '@/data/simulations';
import MainLayout from '@/components/MainLayout';
import { AuthService } from '@/lib/auth';
import styles from './Home.module.css';
import { Unit } from '@/types';

function HomeContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 즐겨찾기 클라이언트 마운트 후에만 사용
  useEffect(() => {
    let mounted = true;
    import('@/lib/favorites').then(mod => {
      if (mounted) {
        setFavorites(mod.getFavorites());
        setFavoritesReady(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  // 전체 교육자료 통합 검색
  const filteredFlashCards = searchQuery.trim() ? searchFlashCards(searchQuery) : [];
  const filteredSimulations = searchQuery.trim() ? searchSimulations(searchQuery) : [];

  return (
    <div className={styles.container}>
      <section className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>안녕하세요! 👋</h2>
        <p className={styles.welcomeText}>오늘도 과학의 신비로운 세계를 탐험해볼까요?</p>
      </section>

      {/* 검색 섹션 */}
      <section className={styles.searchSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="암기카드, 시뮬레이션 전체 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </section>

      {/* 검색 결과 또는 즐겨찾기 */}
      {searchQuery.trim() ? (
        <section className={styles.favoritesSection}>
          <h2 className={styles.sectionTitle}>검색 결과</h2>
          <div className={styles.favoritesGrid}>
            {/* 검색 결과 렌더링 */}
            {filteredFlashCards.map(card => (
              <div key={`flashcard-${card.id}`} className={styles.favoriteCard}>
                <div className={styles.favoriteHeader}>
                  <span className={styles.favoriteType}>📚</span>
                  <span className={styles.favoriteSubject}>{card.subject}</span>
                </div>
                <h3 className={styles.favoriteTitle}>{card.question}</h3>
                <p className={styles.favoriteDescription}>{card.answer}</p>
                <button
                  className={styles.favoriteActionButton}
                  onClick={() => router.push('/flashcard')}
                >
                  암기카드 보기
                </button>
              </div>
            ))}
            {filteredSimulations.map(sim => (
              <div key={`simulation-${sim.id}`} className={styles.favoriteCard}>
                <div className={styles.favoriteHeader}>
                  <span className={styles.favoriteType}>🎮</span>
                  <span className={styles.favoriteSubject}>{sim.subject}</span>
                </div>
                <h3 className={styles.favoriteTitle}>{sim.title}</h3>
                <p className={styles.favoriteDescription}>{sim.description}</p>
                <button
                  className={styles.favoriteActionButton}
                  onClick={() => router.push(sim.path)}
                >
                  시뮬레이션 실행
                </button>
              </div>
            ))}
          </div>
          {filteredFlashCards.length + filteredSimulations.length === 0 && (
            <p className={styles.noResults}>검색 결과가 없습니다.</p>
          )}
        </section>
      ) : favoritesReady && favorites.length > 0 ? (
        <section className={styles.favoritesSection}>
          <h2 className={styles.sectionTitle}>즐겨찾기</h2>
          <div className={styles.favoritesGrid}>
            {favorites.map((item) => (
              <div key={`${item.type}-${item.id}`} className={styles.favoriteCard}>
                <div className={styles.favoriteHeader}>
                  <span className={styles.favoriteType}>
                    {item.type === 'flashcard' ? '📚' : '🎮'}
                  </span>
                  <span className={styles.favoriteSubject}>{item.subject}</span>
                </div>
                <h3 className={styles.favoriteTitle}>{item.title}</h3>
                <p className={styles.favoriteDescription}>{item.description}</p>
                <button
                  className={styles.favoriteActionButton}
                  onClick={() => {
                    if (item.type === 'flashcard') {
                      router.push(`/flashcard/study/${item.id}`);
                    } else {
                      const sim = simulations.find(s => s.id === item.id);
                      if (sim) {
                        router.push(sim.path);
                      }
                    }
                  }}
                >
                  {item.type === 'flashcard' ? '학습하기' : '시뮬레이션 실행'}
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.emptyState}>
            <h2 className={styles.sectionTitle}>즐겨찾기</h2>
            <p>아직 즐겨찾기한 항목이 없어요.</p>
            <p>암기카드나 시뮬레이션에서 ⭐️를 눌러 추가해보세요!</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <HomeContent />
    </MainLayout>
  );
}

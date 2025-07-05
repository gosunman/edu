'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { flashCards } from '@/data/flashCards';
import { FlashCard } from '@/types';

export default function FlashCardStudyPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [studyCards, setStudyCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');

  useEffect(() => {
    if (!groupId) return;

    let filtered: FlashCard[] = [];
    if (groupId === 'subject-hanja') {
      filtered = flashCards.filter(card => card.subject === '한자');
      setGroupTitle('한자');
    } else if (groupId.startsWith('subchapter-')) {
      const subChapter = groupId.replace('subchapter-', '');
      filtered = flashCards.filter(card => card.subChapter === subChapter);
      // You might want to get a more descriptive title here from units data
      setGroupTitle(`과학 - ${subChapter} 소단원`);
    }

    // Shuffle and pick 10 cards
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    setStudyCards(shuffled.slice(0, 10));
  }, [groupId]);

  const handleNextCard = () => {
    setShowAnswer(false);
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of study session
      alert('학습을 완료했습니다!');
      router.push('/flashcard');
    }
  };

  if (studyCards.length === 0) {
    return (
      <MainLayout title="로딩 중...">
        <div className="loading">학습할 카드를 불러오는 중입니다...</div>
      </MainLayout>
    );
  }

  const currentCard = studyCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

  return (
    <MainLayout title={groupTitle}>
      <div className="studyContainer">
        <div className="progressContainer">
          <div className="progressBar" style={{ width: `${progress}%` }} />
        </div>

        <div 
          className={`card${showAnswer ? ' flipped' : ''}`}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <div className="cardInner">
            <div className="cardFront">
              <p>{currentCard.question}</p>
            </div>
            <div className="cardBack">
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </div>

        <button onClick={handleNextCard} className="nextButton">
          {currentCardIndex === studyCards.length - 1 ? '완료' : '다음'}
        </button>
      </div>
    </MainLayout>
  );
} 
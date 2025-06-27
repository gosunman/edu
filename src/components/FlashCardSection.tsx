'use client';

import { FlashCard } from '@/types';

interface FlashCardSectionProps {
  flashCards: FlashCard[];
  currentCardIndex: number;
  showAnswer: boolean;
  toggleAnswer: () => void;
  handleAnswer: (isCorrect: boolean) => void;
}

export default function FlashCardSection({
  flashCards,
  currentCardIndex,
  showAnswer,
  toggleAnswer,
  handleAnswer
}: FlashCardSectionProps) {
  return (
    <div className="flash-card-container">
      <div 
        className={`flash-card ${showAnswer ? 'flipped' : ''}`}
        onClick={toggleAnswer}
      >
        <div className="card-content">
          <div className="card-question">
            {showAnswer ? flashCards[currentCardIndex].answer : flashCards[currentCardIndex].question}
          </div>
          <div className="card-hint">
            {showAnswer ? '정답입니다!' : '카드를 터치하여 답을 확인하세요'}
          </div>
        </div>
      </div>
      <div className="card-controls">
        <button 
          className="control-button wrong"
          onClick={() => handleAnswer(false)}
        >
          틀렸어요
        </button>
        <button 
          className="control-button correct"
          onClick={() => handleAnswer(true)}
        >
          맞았어요
        </button>
      </div>
    </div>
  );
} 
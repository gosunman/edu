'use client';

import { useState, useEffect } from 'react';
import { flashCards } from '@/data/flashCards';
import { Unit, FlashCard } from '@/types';

interface FlashCardStudyProps {
  selectedUnit: Unit;
  onClose: () => void;
}

export default function FlashCardStudy({ selectedUnit, onClose }: FlashCardStudyProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCards, setStudyCards] = useState<FlashCard[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // 선택된 단원의 플래시카드 필터링
    const unitCards = flashCards.filter(card => card.unitId === selectedUnit.id);
    setStudyCards(unitCards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsCompleted(false);
  }, [selectedUnit.id]);

  const currentCard = studyCards[currentCardIndex];

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return '보통';
    }
  };

  if (studyCards.length === 0) {
    return (
      <div className="flashcard-overlay" onClick={onClose}>
        <div className="flashcard-modal" onClick={(e) => e.stopPropagation()}>
          <div className="flashcard-header">
            <h2 className="flashcard-title">암기카드 학습</h2>
            <button onClick={onClose} className="flashcard-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flashcard-content">
            <div className="no-cards-message">
              <p>이 단원에는 아직 암기카드가 없습니다.</p>
              <button onClick={onClose} className="close-button">닫기</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const totalCards = studyCards.length;
    const accuracy = Math.round((correctCount / totalCards) * 100);
    
    return (
      <div className="flashcard-overlay" onClick={onClose}>
        <div className="flashcard-modal" onClick={(e) => e.stopPropagation()}>
          <div className="flashcard-header">
            <h2 className="flashcard-title">학습 완료!</h2>
            <button onClick={onClose} className="flashcard-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flashcard-content">
            <div className="completion-stats">
              <div className="stat-item">
                <span className="stat-label">총 문제</span>
                <span className="stat-value">{totalCards}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">정답</span>
                <span className="stat-value correct">{correctCount}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">오답</span>
                <span className="stat-value incorrect">{incorrectCount}개</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">정답률</span>
                <span className="stat-value accuracy">{accuracy}%</span>
              </div>
            </div>
            <div className="completion-actions">
              <button onClick={handleRestart} className="restart-button">
                다시 학습하기
              </button>
              <button onClick={onClose} className="close-button">
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-overlay" onClick={onClose}>
      <div className="flashcard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flashcard-header">
          <div className="header-info">
            <h2 className="flashcard-title">{selectedUnit.title}</h2>
            <div className="progress-info">
              {currentCardIndex + 1} / {studyCards.length}
            </div>
          </div>
          <button onClick={onClose} className="flashcard-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flashcard-content">
          <div className="card-container">
            <div className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(currentCard.difficulty) }}>
              {getDifficultyText(currentCard.difficulty)}
            </div>
            
            <div className="card-question">
              <h3 className="question-text">{currentCard.question}</h3>
            </div>

            {showAnswer ? (
              <div className="card-answer">
                <h4 className="answer-label">정답</h4>
                <p className="answer-text">{currentCard.answer}</p>
                <div className="answer-buttons">
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="answer-button incorrect"
                  >
                    틀렸어요
                  </button>
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="answer-button correct"
                  >
                    맞았어요
                  </button>
                </div>
              </div>
            ) : (
              <div className="show-answer-section">
                <button onClick={handleShowAnswer} className="show-answer-button">
                  정답 보기
                </button>
              </div>
            )}
          </div>

          <div className="study-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${((currentCardIndex + 1) / studyCards.length) * 100}%`,
                  backgroundColor: selectedUnit.color 
                }}
              ></div>
            </div>
            <div className="progress-stats">
              <span className="stat">정답: {correctCount}</span>
              <span className="stat">오답: {incorrectCount}</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .flashcard-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .flashcard-modal {
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .flashcard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 24px 0 24px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 16px;
          }

          .header-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .flashcard-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
          }

          .progress-info {
            font-size: 14px;
            color: #6b7280;
          }

          .flashcard-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            color: #6b7280;
            transition: all 0.2s;
          }

          .flashcard-close:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .flashcard-close svg {
            width: 20px;
            height: 20px;
          }

          .flashcard-content {
            padding: 24px;
          }

          .card-container {
            background: #f8fafc;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 24px;
            position: relative;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .difficulty-badge {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 4px 12px;
            border-radius: 20px;
            color: white;
            font-size: 12px;
            font-weight: 500;
          }

          .card-question {
            text-align: center;
            margin-bottom: 32px;
          }

          .question-text {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
            line-height: 1.5;
          }

          .card-answer {
            text-align: center;
          }

          .answer-label {
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 8px 0;
            font-weight: 500;
          }

          .answer-text {
            font-size: 18px;
            font-weight: 600;
            color: #059669;
            margin: 0 0 24px 0;
            padding: 16px;
            background: white;
            border-radius: 12px;
            border: 2px solid #d1fae5;
          }

          .answer-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .answer-button {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 100px;
          }

          .answer-button.correct {
            background: #10b981;
            color: white;
          }

          .answer-button.correct:hover {
            background: #059669;
            transform: translateY(-1px);
          }

          .answer-button.incorrect {
            background: #ef4444;
            color: white;
          }

          .answer-button.incorrect:hover {
            background: #dc2626;
            transform: translateY(-1px);
          }

          .show-answer-section {
            text-align: center;
          }

          .show-answer-button {
            padding: 16px 32px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .show-answer-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .study-progress {
            margin-top: 24px;
          }

          .progress-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
          }

          .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
          }

          .progress-stats {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #6b7280;
          }

          .completion-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 32px;
          }

          .stat-item {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
          }

          .stat-label {
            display: block;
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
          }

          .stat-value {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
          }

          .stat-value.correct {
            color: #10b981;
          }

          .stat-value.incorrect {
            color: #ef4444;
          }

          .stat-value.accuracy {
            color: #667eea;
          }

          .completion-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .restart-button {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .restart-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .close-button {
            padding: 12px 24px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            background: white;
            color: #6b7280;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .close-button:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .no-cards-message {
            text-align: center;
            padding: 40px 20px;
          }

          .no-cards-message p {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 24px;
          }

          @media (max-width: 640px) {
            .flashcard-overlay {
              padding: 16px;
            }

            .flashcard-modal {
              border-radius: 16px;
            }

            .flashcard-header {
              padding: 20px 20px 0 20px;
            }

            .flashcard-content {
              padding: 20px;
            }

            .card-container {
              padding: 24px;
              min-height: 250px;
            }

            .question-text {
              font-size: 18px;
            }

            .answer-buttons {
              flex-direction: column;
            }

            .completion-stats {
              grid-template-columns: 1fr;
            }

            .completion-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
} 
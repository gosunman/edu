'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import styles from './create.module.css';

interface CardInput {
  question: string;
  answer: string;
  type?: 'subjective' | 'boolean';
}

export default function CreateCustomFlashCardPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState<CardInput[]>([
    { question: '', answer: '', type: 'subjective' },
    { question: '', answer: '', type: 'subjective' },
    { question: '', answer: '', type: 'subjective' },
  ]);

  const handleCardChange = (index: number, field: 'question' | 'answer' | 'type', value: string) => {
    const newCards = [...cards];
    if (field === 'type') {
      newCards[index].type = value as 'subjective' | 'boolean';
      // 2지선다로 바꿀 때 답변값 초기화
      if (value === 'boolean') newCards[index].answer = '';
    } else {
      newCards[index][field] = value;
    }
    setCards(newCards);
  };

  const handleBooleanAnswer = (index: number, value: '맞다' | '아니다') => {
    const newCards = [...cards];
    newCards[index].answer = value;
    setCards(newCards);
  };

  const addCardInput = () => {
    setCards([...cards, { question: '', answer: '', type: 'subjective' }]);
  };

  const removeCardInput = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleSave = () => {
    // TODO: 로컬 스토리지 또는 DB에 저장
    console.log('Saving custom cards:', { title, cards });
    alert('커스텀 암기카드가 저장되었습니다! (콘솔 확인)');
    router.push('/flashcard');
  };

  return (
    <MainLayout title="새 암기카드 만들기">
      <div className={styles.createContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.titleLabel}>암기카드 묶음 제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 영단어 100선"
            className={styles.input}
          />
        </div>

        {cards.map((card, index) => (
          <div key={index} className={styles.cardInputGroup}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>{index + 1}</span>
              <button onClick={() => removeCardInput(index)} className={styles.removeButton} aria-label="카드 삭제">×</button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>질문</label>
              <textarea
                value={card.question}
                onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                placeholder="질문을 입력하세요"
                className={styles.textarea}
                rows={2}
              />
            </div>
            <div className={styles.answerTypeToggle}>
              <button
                type="button"
                className={card.type === 'subjective' ? `${styles.answerTypeBtn} ${'selected'}` : styles.answerTypeBtn}
                onClick={() => handleCardChange(index, 'type', 'subjective')}
              >주관식</button>
              <button
                type="button"
                className={card.type === 'boolean' ? `${styles.answerTypeBtn} ${'selected'}` : styles.answerTypeBtn}
                onClick={() => handleCardChange(index, 'type', 'boolean')}
              >맞다/아니다</button>
            </div>
            {card.type === 'subjective' ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>답변</label>
                <textarea
                  value={card.answer}
                  onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                  placeholder="답변을 입력하세요"
                  className={styles.textarea}
                  rows={2}
                />
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label className={styles.label}>정답</label>
                <div className={styles.answerTypeToggle}>
                  <button
                    type="button"
                    className={card.answer === '맞다' ? `${styles.answerTypeBtn} selected` : styles.answerTypeBtn}
                    onClick={() => handleBooleanAnswer(index, '맞다')}
                  >맞다</button>
                  <button
                    type="button"
                    className={card.answer === '아니다' ? `${styles.answerTypeBtn} selected` : styles.answerTypeBtn}
                    onClick={() => handleBooleanAnswer(index, '아니다')}
                  >아니다</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button onClick={addCardInput} className={styles.addButton}>+ 카드 추가</button>
        
        <div className={styles.actions}>
          <button onClick={() => router.back()} className={styles.cancelButton}>취소</button>
          <button onClick={handleSave} className={styles.saveButton}>저장하기</button>
        </div>
      </div>
    </MainLayout>
  );
} 
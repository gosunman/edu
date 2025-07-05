'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { flashCards } from '@/data/flashCards';
import { FlashCard } from '@/types';
import styles from '../../flashcard.module.css';

export default function FlashCardStudyPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [studyCards, setStudyCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    // flashCards + 로컬스토리지 customFlashCards 병합
    let mergedCards = [...flashCards];
    if (typeof window !== 'undefined') {
      try {
        const local = JSON.parse(localStorage.getItem('customFlashCards') || '[]');
        if (Array.isArray(local)) mergedCards = [...mergedCards, ...local];
      } catch {}
    }
    let filtered: FlashCard[] = [];
    let title = '';
    if (groupId === 'subject-hanja') {
      filtered = mergedCards.filter(card => card.subject === '한자');
      title = '한자';
    } else if (groupId.startsWith('subchapter-')) {
      const subChapter = groupId.replace('subchapter-', '');
      filtered = mergedCards.filter(card => card.subChapter === subChapter);
      title = `과학 - ${subChapter} 소단원`;
    } else if (groupId.startsWith('custom-')) {
      filtered = mergedCards.filter(card => card.groupId === groupId);
      title = '커스텀 카드';
    }
    setGroupTitle(title);
    setStudyCards(filtered);
    setCurrentCardIndex(0);
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
    setIsCompleted(false);
  }, [groupId]);

  if (!studyCards || studyCards.length === 0) {
    return (
      <MainLayout title="학습할 카드 없음">
        <div className={styles.container} style={{textAlign:'center',padding:'60px 0',color:'#888'}}>
          <h2 style={{fontSize:'22px',marginBottom:'12px'}}>학습할 카드가 없습니다.</h2>
          <p>이 그룹에는 암기카드가 존재하지 않습니다.</p>
          <button className={styles.createButton} onClick={()=>router.push('/flashcard')}>돌아가기</button>
        </div>
      </MainLayout>
    );
  }

  const currentCard = studyCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

  // 카드 완료 처리
  const handleNext = () => {
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // 다시 학습
  const handleRestart = () => {
    setCurrentCardIndex(0);
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
    setIsCompleted(false);
  };

  // 2지선다형(맞다/아니다)인지 판별
  const isBooleanType = currentCard.type === 'boolean';

  // 답안 제출 핸들러
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isBooleanType) return; // 2지선다형은 별도 처리
    const correct = currentCard.answer.trim().replace(/\s+/g, '') === userInput.trim().replace(/\s+/g, '');
    setFeedback(correct ? 'correct' : 'wrong');
    setShowAnswer(true);
  };

  // 2지선다형 답안 제출
  const handleBooleanSubmit = (value: '맞다' | '아니다') => {
    const correct = currentCard.answer === value;
    setFeedback(correct ? 'correct' : 'wrong');
    setShowAnswer(true);
  };

  return (
    <MainLayout title={groupTitle || '암기카드 학습'}>
      <div className={styles.container} style={{maxWidth:480,margin:'0 auto',paddingTop:32}}>
        <div style={{marginBottom:24}}>
          <h2 style={{fontSize:'22px',fontWeight:700,marginBottom:4}}>{groupTitle || '암기카드 학습'}</h2>
          <div style={{color:'#888',fontSize:'15px'}}>총 {studyCards.length}개 | {currentCardIndex+1} / {studyCards.length}</div>
          <div style={{height:8,background:'#e5e7eb',borderRadius:4,marginTop:12,marginBottom:0}}>
            <div style={{width:`${progress}%`,height:'100%',background:'linear-gradient(90deg,#667eea,#764ba2)',borderRadius:4,transition:'width 0.3s'}}></div>
          </div>
        </div>

        {isCompleted ? (
          <div style={{textAlign:'center',padding:'60px 0'}}>
            <h3 style={{fontSize:'20px',fontWeight:700,marginBottom:12}}>🎉 학습 완료!</h3>
            <p style={{color:'#764ba2',fontWeight:600,marginBottom:24}}>총 {studyCards.length}개의 카드를 모두 학습했습니다.</p>
            <button className={styles.createButton} style={{marginRight:8}} onClick={handleRestart}>다시 학습하기</button>
            <button className={styles.createButton} style={{background:'#e5e7eb',color:'#333'}} onClick={()=>router.push('/flashcard')}>목록으로</button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:24}}>
            <div style={{width:'100%',maxWidth:380,margin:'0 auto',perspective:800}}>
              <div
                style={{
                  background:'#fff',
                  borderRadius:16,
                  boxShadow:'0 4px 16px rgba(102,126,234,0.10)',
                  minHeight:160,
                  padding:'32px 24px',
                  textAlign:'center',
                  fontSize:'18px',
                  fontWeight:600,
                  transition:'box-shadow 0.2s',
                  position:'relative',
                  userSelect:'none',
                }}
              >
                <div style={{color:'#667eea',fontWeight:700,fontSize:'16px',marginBottom:8}}>Q.</div>
                <div style={{marginBottom:18}}>{currentCard.question}</div>
                {/* 답변 입력/제출 UI */}
                {isBooleanType ? (
                  !showAnswer ? (
                    <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                      <button
                        className={styles.createButton}
                        style={{background:'#e5e7eb',color:'#333'}}
                        onClick={()=>handleBooleanSubmit('맞다')}
                      >맞다</button>
                      <button
                        className={styles.createButton}
                        style={{background:'#e5e7eb',color:'#333'}}
                        onClick={()=>handleBooleanSubmit('아니다')}
                      >아니다</button>
                    </div>
                  ) : (
                    <div style={{marginTop:12}}>
                      {feedback === 'correct' ? (
                        <div style={{color:'#22c55e',fontWeight:700,fontSize:'18px',marginBottom:8}}>정답입니다! 🎉</div>
                      ) : (
                        <>
                          <div style={{color:'#ef4444',fontWeight:700,fontSize:'18px',marginBottom:8}}>틀렸어요!</div>
                          <div style={{color:'#888',fontSize:'15px',marginBottom:4}}>정답: <b>{currentCard.answer}</b></div>
                        </>
                      )}
                      <button className={styles.createButton} style={{marginTop:8}} onClick={handleNext}>
                        {currentCardIndex === studyCards.length-1 ? '학습 완료' : '다음 카드'}
                      </button>
                    </div>
                  )
                ) : (
                  !showAnswer ? (
                    <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                      <input
                        type="text"
                        value={userInput}
                        onChange={e=>setUserInput(e.target.value)}
                        placeholder="정답을 입력하세요"
                        style={{fontSize:'17px',padding:'10px 16px',borderRadius:8,border:'1.5px solid #e5e7eb',width:'100%',maxWidth:220,background:'#f9fafb',color:'#222'}}
                        autoFocus
                      />
                      <button className={styles.createButton} type="submit">정답 제출</button>
                    </form>
                  ) : (
                    <div style={{marginTop:12}}>
                      {feedback === 'correct' ? (
                        <div style={{color:'#22c55e',fontWeight:700,fontSize:'18px',marginBottom:8}}>정답입니다! 🎉</div>
                      ) : (
                        <>
                          <div style={{color:'#ef4444',fontWeight:700,fontSize:'18px',marginBottom:8}}>틀렸어요!</div>
                          <div style={{color:'#888',fontSize:'15px',marginBottom:4}}>정답: <b>{currentCard.answer}</b></div>
                        </>
                      )}
                      <button className={styles.createButton} style={{marginTop:8}} onClick={handleNext}>
                        {currentCardIndex === studyCards.length-1 ? '학습 완료' : '다음 카드'}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 
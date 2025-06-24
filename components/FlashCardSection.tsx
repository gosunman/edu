import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { FlashCard } from '../types';

interface FlashCardSectionProps {
  flashCards: FlashCard[];
  currentCardIndex: number;
  showAnswer: boolean;
  toggleAnswer: () => void;
  handleAnswer: (isCorrect: boolean) => void;
  scaleAnimation: Animated.Value;
  cardAnimation: Animated.Value;
  panResponder: any;
}

export default function FlashCardSection({
  flashCards,
  currentCardIndex,
  showAnswer,
  toggleAnswer,
  handleAnswer,
  scaleAnimation,
  cardAnimation,
  panResponder
}: FlashCardSectionProps) {
  return (
    <View style={styles.flashCardContainer}>
      <Text style={styles.sectionTitle}>오늘의 암기 카드</Text>
      <Animated.View 
        style={[
          styles.flashCard,
          {
            transform: [
              { scale: scaleAnimation },
              { rotateY: cardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
              })}
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={toggleAnswer}
        >
          <Text style={styles.cardQuestion}>
            {showAnswer ? flashCards[currentCardIndex].answer : flashCards[currentCardIndex].question}
          </Text>
          <Text style={styles.cardHint}>
            {showAnswer ? '정답입니다!' : '카드를 터치하여 답을 확인하세요'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.cardControls}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#F44336' }]}
          onPress={() => handleAnswer(false)}
        >
          <Text style={styles.controlButtonText}>틀렸어요</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => handleAnswer(true)}
        >
          <Text style={styles.controlButtonText}>맞았어요</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flashCardContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  flashCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 200,
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  cardHint: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  cardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 
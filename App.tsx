import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, TouchableOpacity, Animated, PanResponder, Alert, SafeAreaView } from 'react-native';
import { units } from './data/units';
import { flashCards } from './data/flashCards';
import { Unit, FlashCard } from './types';
import UnitList from './components/UnitList';
import FlashCardSection from './components/FlashCardSection';

export default function App() {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  const cardAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Animated.spring(scaleAnimation, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: (evt, gestureState) => {
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      if (gestureState.dx > 100) {
        handleAnswer(true);
      } else if (gestureState.dx < -100) {
        handleAnswer(false);
      }
    },
  });

  const handleAnswer = (isCorrect: boolean) => {
    setTotalAttempts(prev => prev + 1);
    if (isCorrect) {
      setUserScore(prev => prev + 1);
      Alert.alert('정답! 🎉', '잘했어요!');
    } else {
      Alert.alert('틀렸어요 😅', '다시 한번 생각해보세요!');
    }
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(false);
      setCurrentCardIndex(prev => (prev + 1) % flashCards.length);
      cardAnimation.setValue(0);
    });
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    Animated.timing(cardAnimation, {
      toValue: showAnswer ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const getScorePercentage = () => {
    if (totalAttempts === 0) return 0;
    return Math.round((userScore / totalAttempts) * 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <StatusBar style="light" />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={{ backgroundColor: '#667eea', paddingVertical: 20, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: 32, marginRight: 15 }}>🔬</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>과학 학습실</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>중1,2,3학년 과학 교육</Text>
            </View>
          </View>
          <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, alignSelf: 'flex-end' }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Google 로그인</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={{ paddingVertical: 25, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 }}>안녕하세요! 👋</Text>
          <Text style={{ fontSize: 16, color: '#6C757D', textAlign: 'center', lineHeight: 22 }}>
            오늘도 과학의 신비로운 세계를 탐험해볼까요?
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#667eea', marginBottom: 4 }}>{getScorePercentage()}%</Text>
            <Text style={{ fontSize: 12, color: '#6C757D', fontWeight: '500' }}>정답률</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#667eea', marginBottom: 4 }}>{totalAttempts}</Text>
            <Text style={{ fontSize: 12, color: '#6C757D', fontWeight: '500' }}>학습 횟수</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#667eea', marginBottom: 4 }}>{units.length}</Text>
            <Text style={{ fontSize: 12, color: '#6C757D', fontWeight: '500' }}>학습 단원</Text>
          </View>
        </View>

        {/* Learning Modes */}
        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 15 }}>학습 모드</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity 
              style={{ flex: 1, padding: 20, borderRadius: 16, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#FF6B9D', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 }}
              onPress={() => setIsSimulationMode(false)}
            >
              <Text style={{ fontSize: 32, marginBottom: 12 }}>📚</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 6, textAlign: 'center' }}>암기 카드</Text>
              <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', opacity: 0.9 }}>단원별 핵심 개념 학습</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flex: 1, padding: 20, borderRadius: 16, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#4ECDC4', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 }}
              onPress={() => setIsSimulationMode(true)}
            >
              <Text style={{ fontSize: 32, marginBottom: 12 }}>🎮</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 6, textAlign: 'center' }}>3D 시뮬레이션</Text>
              <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', opacity: 0.9 }}>직관적인 실험 체험</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Units Grid */}
        <UnitList units={units} onSelectUnit={setSelectedUnit} />

        {/* Flash Card Section */}
        {!isSimulationMode && (
          <FlashCardSection
            flashCards={flashCards}
            currentCardIndex={currentCardIndex}
            showAnswer={showAnswer}
            toggleAnswer={toggleAnswer}
            handleAnswer={handleAnswer}
            scaleAnimation={scaleAnimation}
            cardAnimation={cardAnimation}
            panResponder={panResponder}
          />
        )}

        {/* 3D Simulation Placeholder */}
        {isSimulationMode && (
          <View style={{ marginBottom: 25, backgroundColor: 'white', borderRadius: 20, padding: 40, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 15 }}>3D 시뮬레이션</Text>
            <Text style={{ fontSize: 48, marginBottom: 20 }}>🎮</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10, textAlign: 'center' }}>3D 시뮬레이션 준비 중...</Text>
            <Text style={{ fontSize: 14, color: '#6C757D', textAlign: 'center', lineHeight: 20 }}>
              곧 원자 구조, 전기 회로, 화학 반응 등을 3D로 체험할 수 있어요!
            </Text>
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

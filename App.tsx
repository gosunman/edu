import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Animated,
  PanResponder,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Unit {
  id: string;
  title: string;
  grade: string;
  description: string;
  color: string;
  progress: number;
  totalCards: number;
  completedCards: number;
}

interface FlashCard {
  id: string;
  question: string;
  answer: string;
  unitId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const units: Unit[] = [
  {
    id: 'unit1',
    title: '물질의 구성',
    grade: '중1',
    description: '원자, 분자, 원소의 이해',
    color: '#FF6B9D',
    progress: 75,
    totalCards: 20,
    completedCards: 15
  },
  {
    id: 'unit2',
    title: '전기와 자기',
    grade: '중2',
    description: '전류, 전압, 자기장의 원리',
    color: '#4ECDC4',
    progress: 45,
    totalCards: 25,
    completedCards: 11
  },
  {
    id: 'unit3',
    title: '화학 반응',
    grade: '중3',
    description: '산화환원, 중화반응',
    color: '#45B7D1',
    progress: 20,
    totalCards: 30,
    completedCards: 6
  },
  {
    id: 'unit4',
    title: '생태계',
    grade: '중2',
    description: '생물과 환경의 상호작용',
    color: '#96CEB4',
    progress: 90,
    totalCards: 18,
    completedCards: 16
  }
];

const flashCards: FlashCard[] = [
  {
    id: '1',
    question: '원자의 중심에 있는 입자는?',
    answer: '핵',
    unitId: 'unit1',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: '전류의 단위는?',
    answer: '암페어(A)',
    unitId: 'unit2',
    difficulty: 'medium'
  },
  {
    id: '3',
    question: '산화환원 반응에서 전자를 잃는 반응은?',
    answer: '산화',
    unitId: 'unit3',
    difficulty: 'hard'
  }
];

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
        // 오른쪽으로 스와이프 - 정답
        handleAnswer(true);
      } else if (gestureState.dx < -100) {
        // 왼쪽으로 스와이프 - 오답
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
    
    // 카드 뒤집기 애니메이션
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScorePercentage = () => {
    if (totalAttempts === 0) return 0;
    return Math.round((userScore / totalAttempts) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🔬</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>과학 학습실</Text>
            <Text style={styles.headerSubtitle}>중1,2,3학년 과학 교육</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Google 로그인</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>안녕하세요! 👋</Text>
          <Text style={styles.welcomeText}>
            오늘도 과학의 신비로운 세계를 탐험해볼까요?
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getScorePercentage()}%</Text>
            <Text style={styles.statLabel}>정답률</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAttempts}</Text>
            <Text style={styles.statLabel}>학습 횟수</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{units.length}</Text>
            <Text style={styles.statLabel}>학습 단원</Text>
          </View>
        </View>

        {/* Learning Modes */}
        <View style={styles.modesContainer}>
          <Text style={styles.sectionTitle}>학습 모드</Text>
          <View style={styles.modesGrid}>
            <TouchableOpacity 
              style={[styles.modeCard, { backgroundColor: '#FF6B9D' }]}
              onPress={() => setIsSimulationMode(false)}
            >
              <Text style={styles.modeIcon}>📚</Text>
              <Text style={styles.modeTitle}>암기 카드</Text>
              <Text style={styles.modeDescription}>단원별 핵심 개념 학습</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeCard, { backgroundColor: '#4ECDC4' }]}
              onPress={() => setIsSimulationMode(true)}
            >
              <Text style={styles.modeIcon}>🎮</Text>
              <Text style={styles.modeTitle}>3D 시뮬레이션</Text>
              <Text style={styles.modeDescription}>직관적인 실험 체험</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Units Grid */}
        <View style={styles.unitsContainer}>
          <Text style={styles.sectionTitle}>학습 단원</Text>
          {units.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={styles.unitCard}
              onPress={() => setSelectedUnit(unit.id)}
            >
              <View style={styles.unitHeader}>
                <View style={styles.unitInfo}>
                  <Text style={styles.unitGrade}>{unit.grade}</Text>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitDescription}>{unit.description}</Text>
                </View>
                <View style={styles.unitProgress}>
                  <Text style={styles.progressText}>{unit.progress}%</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${unit.progress}%`,
                          backgroundColor: getProgressColor(unit.progress)
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              <View style={styles.unitStats}>
                <Text style={styles.unitStatsText}>
                  완료: {unit.completedCards}/{unit.totalCards} 카드
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Flash Card Section */}
        {!isSimulationMode && (
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
        )}

        {/* 3D Simulation Placeholder */}
        {isSimulationMode && (
          <View style={styles.simulationContainer}>
            <Text style={styles.sectionTitle}>3D 시뮬레이션</Text>
            <View style={styles.simulationPlaceholder}>
              <Text style={styles.simulationIcon}>🎮</Text>
              <Text style={styles.simulationText}>3D 시뮬레이션 준비 중...</Text>
              <Text style={styles.simulationDescription}>
                곧 원자 구조, 전기 회로, 화학 반응 등을 3D로 체험할 수 있어요!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  loginButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 25,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  modesContainer: {
    marginBottom: 25,
  },
  modesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textAlign: 'center',
  },
  modeDescription: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  unitsContainer: {
    marginBottom: 25,
  },
  unitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  unitInfo: {
    flex: 1,
  },
  unitGrade: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  unitDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  unitProgress: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  unitStats: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 15,
  },
  unitStatsText: {
    fontSize: 14,
    color: '#6C757D',
  },
  flashCardContainer: {
    marginBottom: 25,
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
  simulationContainer: {
    marginBottom: 25,
  },
  simulationPlaceholder: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  simulationIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  simulationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  simulationDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

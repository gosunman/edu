import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Unit } from '../types';

interface UnitListProps {
  units: Unit[];
  onSelectUnit: (unitId: string) => void;
}

export default function UnitList({ units, onSelectUnit }: UnitListProps) {
  return (
    <View style={styles.unitsContainer}>
      <Text style={styles.sectionTitle}>학습 단원</Text>
      {units.map((unit) => (
        <TouchableOpacity
          key={unit.id}
          style={styles.unitCard}
          onPress={() => onSelectUnit(unit.id)}
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
                      backgroundColor: unit.color
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
  );
}

const styles = StyleSheet.create({
  unitsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
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
}); 
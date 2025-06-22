import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function LetterScoreGuide() {
  const scoreGroups = [
    { score: 1, letters: ['A', 'E', 'I', 'L', 'N', 'O', 'R', 'S', 'T', 'U'] },
    { score: 2, letters: ['D', 'G'] },
    { score: 3, letters: ['B', 'C', 'M', 'P'] },
    { score: 4, letters: ['F', 'H', 'V', 'W', 'Y'] },
    { score: 5, letters: ['K'] },
    { score: 8, letters: ['J', 'X'] },
    { score: 10, letters: ['Q', 'Z'] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Letter Values</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.scoreGroups}>
          {scoreGroups.map((group) => (
            <View key={group.score} style={styles.scoreGroup}>
              <Text style={styles.scoreValue}>{group.score} pt</Text>
              <View style={styles.lettersContainer}>
                {group.letters.map((letter) => (
                  <View key={letter} style={styles.letterTile}>
                    <Text style={styles.letterText}>{letter}</Text>
                    <Text style={styles.letterScore}>{group.score}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreGroups: {
    flexDirection: 'row',
    gap: 15,
  },
  scoreGroup: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  letterTile: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  letterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  letterScore: {
    fontSize: 8,
    color: '#666',
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
}); 
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { Player } from '../types/game';

interface PlayerScoresProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function PlayerScores({ players, currentPlayerIndex }: PlayerScoresProps) {
  const safePlayers = players || [];
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Player Scores</Text>
      <View style={styles.playersContainer}>
        {safePlayers.map((player, index) => {
          const isCurrentPlayer = index === currentPlayerIndex;
          const isLeader = player.score > 0 && safePlayers.every(p => p.score <= player.score);
          
          return (
            <View
              key={player.id}
              style={[
                styles.playerCard,
                { backgroundColor: theme.background === '#fff' ? '#f9f9f9' : '#2a2a2a' },
                isCurrentPlayer && styles.currentPlayerCard,
              ]}
            >
              <View style={styles.playerHeader}>
                <View style={[styles.playerColor, { backgroundColor: player.color }]} />
                <Text style={[
                  styles.playerName, 
                  { color: isCurrentPlayer ? '#1b5e20' : theme.text }
                ]}>{player.name}</Text>
              </View>
              <Text style={styles.playerScore}>{player.score} pts</Text>
              {isLeader && (
                <View style={styles.leaderBadge}>
                  <FontAwesome5 name="crown" size={10} color="#FFD700" />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  playersContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  playerCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 4,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentPlayerCard: {
    borderColor: '#2E7D32',
    backgroundColor: '#e8f5e8',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  playerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  playerScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  leaderBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  leaderBadgeText: {
    fontSize: 16,
  },
}); 
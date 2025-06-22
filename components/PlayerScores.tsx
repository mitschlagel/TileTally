import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Player } from '../types/game';

interface PlayerScoresProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function PlayerScores({ players, currentPlayerIndex }: PlayerScoresProps) {
  const safePlayers = players || [];
  const sortedPlayers = [...safePlayers].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Scores</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.playersContainer}>
          {sortedPlayers.map((player, index) => {
            const isCurrentPlayer = safePlayers.findIndex(p => p.id === player.id) === currentPlayerIndex;
            const isLeader = index === 0;
            
            return (
              <View
                key={player.id}
                style={[
                  styles.playerCard,
                  isCurrentPlayer && styles.currentPlayerCard,
                  isLeader && styles.leaderCard,
                ]}
              >
                <View style={styles.playerHeader}>
                  <View style={[styles.playerColor, { backgroundColor: player.color }]} />
                  <Text style={styles.playerName}>{player.name}</Text>
                  {isCurrentPlayer && (
                    <View style={styles.currentIndicator}>
                      <Text style={styles.currentIndicatorText}>←</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.playerScore}>{player.score} pts</Text>
                {isLeader && player.score > 0 && (
                  <View style={styles.leaderBadge}>
                    <FontAwesome5 name="crown" size={10} color="#FFD700" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    gap: 10,
  },
  playerCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentPlayerCard: {
    borderColor: '#2E7D32',
    backgroundColor: '#e8f5e8',
  },
  leaderCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  currentIndicator: {
    marginLeft: 4,
  },
  currentIndicatorText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  leaderBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  leaderBadgeText: {
    fontSize: 16,
  },
}); 
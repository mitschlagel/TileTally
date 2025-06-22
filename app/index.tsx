import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NewGameSetup } from '../components/NewGameSetup';
import { useGameStorage } from '../hooks/useGameStorage';
import { Game, Player } from '../types/game';
import { generateGameId } from '../utils/scoring';

export default function HomeScreen() {
  const router = useRouter();
  const { games, loading, saveGame, deleteGame } = useGameStorage();
  const [showNewGameModal, setShowNewGameModal] = useState(false);

  const handleCreateGame = (gameName: string, players: Player[]) => {
    const newGame: Game = {
      id: generateGameId(),
      name: gameName,
      createdAt: new Date(),
      updatedAt: new Date(),
      players,
      currentPlayerIndex: 0,
      turns: [],
      totalScore: 0,
      isActive: true,
    };

    saveGame(newGame);
    setShowNewGameModal(false);
    router.push(`/game?id=${newGame.id}`);
  };

  const continueGame = (game: Game) => {
    router.push(`/game?id=${game.id}`);
  };

  const handleDeleteGame = (game: Game) => {
    Alert.alert(
      'Delete Game',
      `Are you sure you want to delete "${game.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteGame(game.id),
        },
      ]
    );
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={[styles.gameItem, item.isActive && styles.activeGameItem]}
      onPress={() => continueGame(item)}
      onLongPress={() => handleDeleteGame(item)}
    >
      <View style={styles.gameHeader}>
        <Text style={styles.gameName}>{item.name}</Text>
        <Text style={styles.gameScore}>{item.totalScore} pts</Text>
      </View>
      <View style={styles.gameDetails}>
        <Text style={styles.gameDate}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
        <Text style={styles.turnCount}>
          {item.players?.length || 0} players • {item.turns?.length || 0} turns
        </Text>
      </View>
      {item.isActive && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>Active</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading games...</Text>
      </View>
    );
  }

  const safeGames = games || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TileTally</Text>
        <Text style={styles.subtitle}>Track your word games</Text>
      </View>

      <TouchableOpacity 
        style={styles.newGameButton} 
        onPress={() => setShowNewGameModal(true)}
      >
        <Text style={styles.newGameButtonText}>New Game</Text>
      </TouchableOpacity>

      <View style={styles.gamesSection}>
        <Text style={styles.sectionTitle}>Recent Games</Text>
        {safeGames.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No games yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start your first game to begin scoring!
            </Text>
          </View>
        ) : (
          <FlatList
            data={safeGames}
            renderItem={renderGameItem}
            keyExtractor={(item) => item.id}
            style={styles.gamesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        visible={showNewGameModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewGameModal(false)}
      >
        <NewGameSetup
          onGameCreated={handleCreateGame}
          onCancel={() => setShowNewGameModal(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  newGameButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gamesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gamesList: {
    flex: 1,
  },
  gameItem: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 30,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activeGameItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  gameScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameDate: {
    fontSize: 14,
    color: '#666',
  },
  turnCount: {
    fontSize: 14,
    color: '#666',
  },
  activeBadge: {
    position: 'absolute',
    bottom: 4,
    right: 16,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
}); 
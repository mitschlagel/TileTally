import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Player } from '../types/game';
import { createPlayers } from '../utils/scoring';

interface NewGameSetupProps {
  onGameCreated: (gameName: string, players: Player[]) => void;
  onCancel: () => void;
}

export function NewGameSetup({ onGameCreated, onCancel }: NewGameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>(createPlayers(2));
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  const updatePlayerCount = (count: number) => {
    if (count >= 2 && count <= 8) {
      setPlayerCount(count);
      setPlayers(createPlayers(count));
    }
  };

  const updatePlayerName = (playerId: string, name: string) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, name: name.trim() || `Player ${players.findIndex(p => p.id === playerId) + 1}` }
          : player
      )
    );
  };

  const handleCreateGame = () => {
    if (!gameName.trim()) {
      Alert.alert('Error', 'Please enter a game name');
      return;
    }

    const validPlayers = players.filter(player => player.name.trim());
    if (validPlayers.length < 2) {
      Alert.alert('Error', 'You need at least 2 players');
      return;
    }

    onGameCreated(gameName.trim(), validPlayers);
  };

  const renderPlayerInput = (player: Player, index: number) => (
    <View key={player.id} style={styles.playerInputContainer}>
      <View style={[styles.playerColorIndicator, { backgroundColor: player.color }]} />
      <TextInput
        style={styles.playerNameInput}
        value={player.name}
        onChangeText={(name) => updatePlayerName(player.id, name)}
        placeholder={`Player ${index + 1}`}
        maxLength={20}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Game Setup</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Name</Text>
        <TextInput
          style={styles.gameNameInput}
          value={gameName}
          onChangeText={setGameName}
          placeholder="Enter game name"
          maxLength={30}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Players</Text>
        <View style={styles.playerCountContainer}>
          {[2, 3, 4, 5, 6, 7, 8].map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.playerCountButton,
                playerCount === count && styles.selectedPlayerCount,
              ]}
              onPress={() => updatePlayerCount(count)}
            >
              <Text
                style={[
                  styles.playerCountText,
                  playerCount === count && styles.selectedPlayerCountText,
                ]}
              >
                {count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Names</Text>
        <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
          {players.map((player, index) => renderPlayerInput(player, index))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
          <Text style={styles.createButtonText}>Create Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  gameNameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  playerCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  playerCountButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  selectedPlayerCount: {
    backgroundColor: '#2E7D32',
  },
  playerCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedPlayerCountText: {
    color: 'white',
  },
  playersList: {
    maxHeight: 200,
  },
  playerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  playerColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  playerNameInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
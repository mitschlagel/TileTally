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
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const updatePlayerCount = (count: number) => {
    if (count >= 2 && count <= 4) {
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
    <View key={player.id} style={[styles.playerInputContainer, { backgroundColor: theme.background === '#fff' ? '#f9f9f9' : '#2a2a2a' }]}>
      <View style={[styles.playerColorIndicator, { backgroundColor: player.color }]} />
      <TextInput
        style={[styles.playerNameInput, { color: theme.text }]}
        value={player.name}
        onChangeText={(name) => updatePlayerName(player.id, name)}
        placeholder={`Player ${index + 1}`}
        placeholderTextColor={theme.icon}
        maxLength={20}
      />
    </View>
  );

  return (
    <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.modalHeader, { backgroundColor: theme.background === '#fff' ? '#f8f8f8' : '#2a2a2a', borderBottomColor: theme.background === '#fff' ? '#e0e0e0' : '#404040' }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onCancel}
        >
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.modalTitle, { color: theme.text }]}>New Game</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.modalContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Game Name</Text>
          <TextInput
            style={[styles.gameNameInput, { 
              borderColor: theme.background === '#fff' ? '#ddd' : '#404040',
              backgroundColor: theme.background,
              color: theme.text
            }]}
            value={gameName}
            onChangeText={setGameName}
            placeholder="Enter game name"
            placeholderTextColor={theme.icon}
            maxLength={30}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Number of Players</Text>
          <View style={styles.playerCountContainer}>
            {[2, 3, 4].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.playerCountButton,
                  { backgroundColor: theme.background === '#fff' ? '#f0f0f0' : '#404040' },
                  playerCount === count && styles.selectedPlayerCount,
                ]}
                onPress={() => updatePlayerCount(count)}
              >
                <Text
                  style={[
                    styles.playerCountText,
                    { color: theme.text },
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Player Names</Text>
          <View style={styles.playersList}>
            {players.map((player, index) => renderPlayerInput(player, index))}
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
          <Text style={styles.createButtonText}>Create Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 60,
  },
  closeButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    minWidth: 60,
  },
  modalContent: {
    padding: 20,
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
  createButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
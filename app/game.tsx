import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { PlayerScores } from '../components/PlayerScores';
import { useGameStorage } from '../hooks/useGameStorage';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { CrossWord, Game, Turn } from '../types/game';
import { calculateTurnScore, generateTurnId, getNextPlayerIndex, updatePlayerScore } from '../utils/scoring';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { games, saveGame } = useGameStorage();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [game, setGame] = useState<Game | null>(null);
  const [word, setWord] = useState('');
  const [letterMultipliers, setLetterMultipliers] = useState<{ [key: number]: number | undefined }>({});
  const [wordMultipliers, setWordMultipliers] = useState<{ [key: number]: number | undefined }>({});
  const [crossWords, setCrossWords] = useState<CrossWord[]>([]);
  const [showAddTurn, setShowAddTurn] = useState(false);

  useEffect(() => {
    if (id && games && games.length > 0) {
      const foundGame = games.find(g => g.id === id);
      if (foundGame) {
        setGame(foundGame);
      }
    }
  }, [id, games]);

  const addTurn = () => {
    if (!word.trim()) {
      Alert.alert('Error', 'Please enter a word');
      return;
    }

    if (!game) return;

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    const newTurn: Turn = {
      id: generateTurnId(),
      playerId: currentPlayer.id,
      word: word.toUpperCase(),
      score: 0, // Will be calculated
      timestamp: new Date(),
      multipliers: {
        letterMultipliers: Object.fromEntries(
          Object.entries(letterMultipliers).filter(([_, value]) => value !== undefined)
        ) as { [position: number]: number },
        wordMultipliers: Object.fromEntries(
          Object.entries(wordMultipliers).filter(([_, value]) => value !== undefined)
        ) as { [position: number]: number },
      },
      crossWords,
    };

    // Calculate score
    newTurn.score = calculateTurnScore(newTurn);

    // Update game with new turn and player score
    const updatedGame = updatePlayerScore(game, currentPlayer.id, newTurn.score);
    const finalGame: Game = {
      ...updatedGame,
      turns: [...updatedGame.turns, newTurn],
      currentPlayerIndex: getNextPlayerIndex(updatedGame),
      updatedAt: new Date(),
    };

    saveGame(finalGame);
    setGame(finalGame);
    
    // Reset form and close modal
    setWord('');
    setLetterMultipliers({});
    setWordMultipliers({});
    setCrossWords([]);
    setShowAddTurn(false);
  };

  const addCrossWord = () => {
    Alert.prompt(
      'Add Cross Word',
      'Enter the cross word:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (crossWordText) => {
            if (crossWordText && crossWordText.trim()) {
              const newCrossWord: CrossWord = {
                word: crossWordText.toUpperCase(),
                score: 0, // Will be calculated
                position: crossWords.length,
              };
              newCrossWord.score = calculateTurnScore({
                id: '',
                playerId: '',
                word: newCrossWord.word,
                score: 0,
                timestamp: new Date(),
                multipliers: { letterMultipliers: {}, wordMultipliers: {} },
                crossWords: [],
              });
              setCrossWords([...crossWords, newCrossWord]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const removeCrossWord = (index: number) => {
    setCrossWords(crossWords.filter((_, i) => i !== index));
  };

  const toggleLetterMultiplier = (position: number, multiplier: number) => {
    setLetterMultipliers(prev => ({
      ...prev,
      [position]: prev[position] === multiplier ? undefined : multiplier,
    }));
  };

  const toggleWordMultiplier = (position: number, multiplier: number) => {
    setWordMultipliers(prev => ({
      ...prev,
      [position]: prev[position] === multiplier ? undefined : multiplier,
    }));
  };

  const renderLetterInput = () => {
    const currentPlayer = game?.players[game.currentPlayerIndex];
    
    return (
      <View style={styles.letterInputContainer}>
        <View style={[styles.currentPlayerInfo, { backgroundColor: theme.background === '#fff' ? '#f0f8f0' : '#1a2a1a' }]}>
          <View style={[styles.playerColor, { backgroundColor: currentPlayer?.color || '#ccc' }]} />
          <Text style={[styles.currentPlayerText, { color: theme.text }]}>
            {currentPlayer?.name || 'Unknown'}&apos;s turn
          </Text>
        </View>
        
        <Text style={[styles.inputLabel, { color: theme.text }]}>Word:</Text>
        <TextInput
          style={[styles.wordInput, { 
            borderColor: theme.background === '#fff' ? '#ddd' : '#404040',
            backgroundColor: theme.background,
            color: theme.text
          }]}
          value={word}
          onChangeText={setWord}
          placeholder="Enter word"
          placeholderTextColor={theme.icon}
          autoCapitalize="characters"
          maxLength={15}
        />
        
        {word.length > 0 && (
          <View style={styles.multipliersContainer}>
            <Text style={[styles.multipliersLabel, { color: theme.icon }]}>Letter Multipliers:</Text>
            <View style={styles.multipliersRow}>
              {word.split('').map((letter, index) => (
                <View key={index} style={styles.letterContainer}>
                  <Text style={[styles.letter, { color: theme.text }]}>{letter}</Text>
                  <View style={styles.multiplierButtons}>
                    <TouchableOpacity
                      style={[
                        styles.multiplierButton,
                        { backgroundColor: theme.background === '#fff' ? '#f0f0f0' : '#404040' },
                        letterMultipliers[index] === 2 && styles.activeMultiplier,
                      ]}
                      onPress={() => toggleLetterMultiplier(index, 2)}
                    >
                      <Text style={[styles.multiplierText, { color: theme.text }]}>2x</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.multiplierButton,
                        { backgroundColor: theme.background === '#fff' ? '#f0f0f0' : '#404040' },
                        letterMultipliers[index] === 3 && styles.activeMultiplier,
                      ]}
                      onPress={() => toggleLetterMultiplier(index, 3)}
                    >
                      <Text style={[styles.multiplierText, { color: theme.text }]}>3x</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            <Text style={[styles.multipliersLabel, { color: theme.icon }]}>Word Multipliers:</Text>
            <View style={styles.multipliersRow}>
              {word.split('').map((letter, index) => (
                <View key={index} style={styles.letterContainer}>
                  <Text style={[styles.letter, { color: theme.text }]}>{letter}</Text>
                  <View style={styles.multiplierButtons}>
                    <TouchableOpacity
                      style={[
                        styles.multiplierButton,
                        { backgroundColor: theme.background === '#fff' ? '#f0f0f0' : '#404040' },
                        wordMultipliers[index] === 2 && styles.activeMultiplier,
                      ]}
                      onPress={() => toggleWordMultiplier(index, 2)}
                    >
                      <Text style={[styles.multiplierText, { color: theme.text }]}>2x</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.multiplierButton,
                        { backgroundColor: theme.background === '#fff' ? '#f0f0f0' : '#404040' },
                        wordMultipliers[index] === 3 && styles.activeMultiplier,
                      ]}
                      onPress={() => toggleWordMultiplier(index, 3)}
                    >
                      <Text style={[styles.multiplierText, { color: theme.text }]}>3x</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (!game) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading game...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.gameName, { color: theme.text }]}>{game.name}</Text>
        <Text style={styles.totalScore}>Total: {game.totalScore} pts</Text>
      </View>

      <PlayerScores players={game.players} currentPlayerIndex={game.currentPlayerIndex} />

      <View style={[styles.wordsSection, { backgroundColor: theme.background }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>
        <View style={styles.wordsContainer}>
          {game.players.map((player) => (
            <View key={player.id} style={styles.playerColumn}>
              <View style={styles.playerColumnHeader}>
                <View style={[styles.playerColor, { backgroundColor: player.color }]} />
                <Text style={[styles.playerColumnName, { color: theme.text }]}>{player.name}</Text>
              </View>
              <View style={styles.wordsList}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {game.turns
                    .filter(turn => turn.playerId === player.id)
                    .map((turn, index) => (
                      <View key={turn.id} style={[styles.wordItem, { backgroundColor: theme.background === '#fff' ? '#f8f8f8' : '#2a2a2a' }]}>
                        <Text style={[styles.wordText, { color: theme.text }]} numberOfLines={1}>{turn.word}</Text>
                        <Text style={styles.wordScore}>{turn.score} pts</Text>
                      </View>
                    ))}
                  {game.turns.filter(turn => turn.playerId === player.id).length === 0 && (
                    <Text style={[styles.noWordsText, { color: theme.icon }]}>No words yet</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.addTurnButton}
        onPress={() => setShowAddTurn(true)}
      >
        <Text style={styles.addTurnButtonText}>Add Turn</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddTurn}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddTurn(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.background === '#fff' ? '#f8f8f8' : '#2a2a2a', borderBottomColor: theme.background === '#fff' ? '#e0e0e0' : '#404040' }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddTurn(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Turn</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {renderLetterInput()}
            
            <View style={styles.crossWordsSection}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Cross Words:</Text>
              {crossWords.map((cw, index) => (
                <View key={index} style={[styles.crossWordItem, { backgroundColor: theme.background === '#fff' ? '#f9f9f9' : '#2a2a2a' }]}>
                  <Text style={[styles.crossWordText, { color: theme.text }]}>{cw.word} ({cw.score} pts)</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCrossWord(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={[styles.addCrossWordButton, { backgroundColor: theme.background === '#fff' ? '#e0e0e0' : '#404040' }]} onPress={addCrossWord}>
                <Text style={[styles.addCrossWordButtonText, { color: theme.icon }]}>+ Add Cross Word</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={addTurn}>
              <Text style={styles.submitButtonText}>Add Turn</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  totalScore: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  addTurnButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addTurnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
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
  modalContent: {
    padding: 20,
  },
  letterInputContainer: {
    marginBottom: 20,
  },
  currentPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
  },
  playerColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  currentPlayerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  wordInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  multipliersContainer: {
    marginTop: 10,
  },
  multipliersLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  multipliersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  letterContainer: {
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  letter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  multiplierButtons: {
    flexDirection: 'row',
  },
  multiplierButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    minWidth: 30,
    alignItems: 'center',
  },
  activeMultiplier: {
    backgroundColor: '#2E7D32',
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  crossWordsSection: {
    marginBottom: 20,
  },
  crossWordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  crossWordText: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addCrossWordButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addCrossWordButtonText: {
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholder: {
    minWidth: 60,
  },
  wordsSection: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  wordsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  playerColumn: {
    flex: 1,
    marginHorizontal: 3,
  },
  playerColumnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  playerColumnName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  wordsList: {
    flex: 1,
    maxHeight: 150,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 3,
    marginBottom: 2,
  },
  wordText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  wordScore: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 4,
  },
  noWordsText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
}); 
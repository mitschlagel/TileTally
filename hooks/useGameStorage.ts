import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Game } from '../types/game';

const GAMES_STORAGE_KEY = 'scrabble_games';

export function useGameStorage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
      if (storedGames) {
        const parsedGames = JSON.parse(storedGames).map((game: any) => ({
          ...game,
          createdAt: new Date(game.createdAt),
          updatedAt: new Date(game.updatedAt),
          players: game.players || [],
          currentPlayerIndex: game.currentPlayerIndex || 0,
          turns: (game.turns || []).map((turn: any) => ({
            ...turn,
            timestamp: new Date(turn.timestamp),
            playerId: turn.playerId || '',
          }))
        }));
        setGames(parsedGames.sort((a: Game, b: Game) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      } else {
        setGames([]);
      }
    } catch (error) {
      console.error('Error loading games:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const saveGame = async (game: Game) => {
    try {
      const currentGames = games || [];
      const updatedGames = currentGames.filter(g => g.id !== game.id);
      const newGames = [game, ...updatedGames].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      await AsyncStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(newGames));
      setGames(newGames);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const currentGames = games || [];
      const updatedGames = currentGames.filter(game => game.id !== gameId);
      await AsyncStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(updatedGames));
      setGames(updatedGames);
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const getActiveGame = () => {
    const currentGames = games || [];
    return currentGames.find(game => game.isActive);
  };

  return {
    games: games || [],
    loading,
    saveGame,
    deleteGame,
    getActiveGame,
    loadGames
  };
} 
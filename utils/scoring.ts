import { Game, LETTER_SCORES, Player, Turn } from '../types/game';

export function calculateLetterScore(letter: string): number {
  return LETTER_SCORES[letter.toUpperCase()] || 0;
}

export function calculateWordScore(
  word: string,
  letterMultipliers: { [position: number]: number } = {},
  wordMultipliers: { [position: number]: number } = {}
): number {
  let totalScore = 0;
  let wordMultiplier = 1;

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    let letterScore = calculateLetterScore(letter);
    
    // Apply letter multipliers
    if (letterMultipliers[i]) {
      letterScore *= letterMultipliers[i];
    }
    
    totalScore += letterScore;
    
    // Apply word multipliers
    if (wordMultipliers[i]) {
      wordMultiplier *= wordMultipliers[i];
    }
  }

  return totalScore * wordMultiplier;
}

export function calculateCrossWordScore(crossWord: string): number {
  return calculateWordScore(crossWord);
}

export function calculateTurnScore(turn: Turn): number {
  let totalScore = calculateWordScore(turn.word, turn.multipliers.letterMultipliers, turn.multipliers.wordMultipliers);
  
  // Add cross word scores
  for (const crossWord of turn.crossWords) {
    totalScore += crossWord.score;
  }
  
  return totalScore;
}

export function generateTurnId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function generateGameId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function generatePlayerId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function createPlayers(playerCount: number): Player[] {
  const players: Player[] = [];
  const PLAYER_COLORS = [
    '#2E7D32', '#1976D2', '#D32F2F', '#FF8F00'
  ];

  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: generatePlayerId(),
      name: `Player ${i + 1}`,
      score: 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    });
  }

  return players;
}

export function getNextPlayerIndex(game: Game): number {
  return (game.currentPlayerIndex + 1) % game.players.length;
}

export function updatePlayerScore(game: Game, playerId: string, scoreToAdd: number): Game {
  const updatedPlayers = game.players.map(player => 
    player.id === playerId 
      ? { ...player, score: player.score + scoreToAdd }
      : player
  );

  return {
    ...game,
    players: updatedPlayers,
    totalScore: updatedPlayers.reduce((sum, player) => sum + player.score, 0),
  };
} 
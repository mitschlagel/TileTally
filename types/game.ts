export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface Turn {
  id: string;
  playerId: string;
  word: string;
  score: number;
  timestamp: Date;
  multipliers: {
    letterMultipliers: { [position: number]: number }; // 2x, 3x letter multipliers
    wordMultipliers: { [position: number]: number }; // 2x, 3x word multipliers
  };
  crossWords: CrossWord[];
}

export interface CrossWord {
  word: string;
  score: number;
  position: number; // position in the main word where this crosses
}

export interface Game {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  players: Player[];
  currentPlayerIndex: number; // Index of whose turn it is
  turns: Turn[];
  totalScore: number;
  isActive: boolean;
}

export interface LetterScore {
  letter: string;
  score: number;
}

export const LETTER_SCORES: { [key: string]: number } = {
  'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
  'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
  'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
};

export const PLAYER_COLORS = [
  '#2E7D32', // Green
  '#1976D2', // Blue
  '#D32F2F', // Red
  '#FF8F00', // Orange
  '#7B1FA2', // Purple
  '#C2185B', // Pink
  '#388E3C', // Dark Green
  '#1565C0', // Dark Blue
]; 
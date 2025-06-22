# TileTally 🎯

A React Native app built with Expo for tracking and scoring word games with multiple players. Keep track of your games, calculate scores with multipliers, and maintain a history of all your matches.

## Features

- **Multi-Player Support**: Track scores for 2-4 players in each game
- **Game Management**: Start new games and continue existing ones
- **Score Calculation**: Automatically calculate scores based on letter values
- **Multipliers**: Support for letter (2x, 3x) and word (2x, 3x) multipliers
- **Cross Words**: Add and score cross words formed by your play
- **Turn Management**: Automatic player rotation and turn tracking
- **Game History**: View all your games sorted by most recent
- **Persistent Storage**: Games are saved locally and persist between app sessions
- **Player Colors**: Each player gets a unique color for easy identification

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm start
   ```

3. Open the app on your device or simulator

## How to Use

### Starting a New Game
1. Tap "Start New Game" on the home screen
2. Enter a name for your game
3. Select the number of players (2-4)
4. Optionally customize player names
5. Tap "Create Game" to start

### Adding Turns
1. In the game screen, tap "Add Turn"
2. The current player's turn will be highlighted
3. Enter the word you played
4. Set any letter multipliers (2x or 3x) by tapping the multiplier buttons under each letter
5. Set any word multipliers (2x or 3x) by tapping the multiplier buttons under each letter
6. Add any cross words formed by your play
7. Tap "Add Turn" to save the turn and advance to the next player

### Player Management
- **Player Scores**: View all player scores at the top of the game screen
- **Current Player**: The current player is highlighted with a green border and arrow
- **Leader**: The player with the highest score gets a crown emoji
- **Turn Order**: Players take turns automatically in the order they were created

### Scoring System
- **Letter Values**: A=1, B=3, C=3, D=2, E=1, F=4, G=2, H=4, I=1, J=8, K=5, L=1, M=3, N=1, O=1, P=3, Q=10, R=1, S=1, T=1, U=1, V=4, W=4, X=8, Y=4, Z=10
- **Multipliers**: Letter multipliers multiply individual letter scores, word multipliers multiply the entire word score
- **Cross Words**: Additional words formed by your play are scored separately and added to your turn total

### Managing Games
- **View History**: All games are listed on the home screen, sorted by most recent
- **Continue Games**: Tap any game to continue playing
- **Delete Games**: Long press on a game to delete it
- **Game Info**: See player count and turn count for each game

## Technical Details

- Built with React Native and Expo
- Uses Expo Router for navigation
- AsyncStorage for local data persistence
- TypeScript for type safety
- File-based routing structure

## Development

The app uses a simple file structure:
- `app/` - Main screens and navigation
- `components/` - Reusable UI components (PlayerScores, LetterScoreGuide, NewGameSetup)
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `utils/` - Utility functions for scoring and data management

## Learn More

To learn more about developing with Expo:
- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

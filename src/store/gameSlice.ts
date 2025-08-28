import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AILevel, Card, CardRow, Faction, GamePhase, GameState, Player, WeatherType } from '../types';

const createInitialPlayer = (id: string, name: string, faction: Faction): Player => ({
  id,
  name,
  faction,
  deck: [],
  hand: [],
  discardPile: [],
  leaderCard: {} as Card, // Will be set during deck building
  livesRemaining: 2,
  totalPower: 0,
  hasPassedRound: false
});

const createInitialBoard = () => ({
  playerRows: {
    [CardRow.CLOSE_COMBAT]: [],
    [CardRow.RANGED]: [],
    [CardRow.SIEGE]: []
  },
  opponentRows: {
    [CardRow.CLOSE_COMBAT]: [],
    [CardRow.RANGED]: [],
    [CardRow.SIEGE]: []
  },
  weather: {
    [CardRow.CLOSE_COMBAT]: WeatherType.CLEAR,
    [CardRow.RANGED]: WeatherType.CLEAR,
    [CardRow.SIEGE]: WeatherType.CLEAR
  }
});

const initialState: GameState = {
  phase: GamePhase.MENU,
  currentRound: 1,
  player: createInitialPlayer('player', 'Player', Faction.NILFGAARD),
  opponent: createInitialPlayer('ai', 'AI Opponent', Faction.NILFGAARD),
  board: createInitialBoard(),
  currentPlayer: 'player',
  aiLevel: AILevel.MEDIUM,
  roundWins: {
    player: 0,
    opponent: 0
  },
  selectedCard: undefined,
  isGameOver: false,
  winner: undefined
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGamePhase: (state, action: PayloadAction<GamePhase>) => {
      state.phase = action.payload;
    },

    setAILevel: (state, action: PayloadAction<AILevel>) => {
      state.aiLevel = action.payload;
    },

    setPlayerDeck: (state, action: PayloadAction<Card[]>) => {
      state.player.deck = [...action.payload];
    },

    setOpponentDeck: (state, action: PayloadAction<Card[]>) => {
      state.opponent.deck = [...action.payload];
    },

    drawInitialHands: (state) => {
      // Draw 10 cards for each player at start
      state.player.hand = state.player.deck.splice(0, 10);
      state.opponent.hand = state.opponent.deck.splice(0, 10);
    },

    selectCard: (state, action: PayloadAction<Card | undefined>) => {
      state.selectedCard = action.payload;
    },

    playCard: (state, action: PayloadAction<{ card: Card; row?: CardRow; player: 'player' | 'opponent' }>) => {
      const { card, row, player } = action.payload;
      
      // Remove card from hand
      if (player === 'player') {
        state.player.hand = state.player.hand.filter(c => c.id !== card.id);
      } else {
        state.opponent.hand = state.opponent.hand.filter(c => c.id !== card.id);
      }

      // Add card to appropriate row if it's a unit card
      if (row && card.row) {
        if (player === 'player') {
          state.board.playerRows[row].push(card);
        } else {
          state.board.opponentRows[row].push(card);
        }
      }

      // Clear selected card
      state.selectedCard = undefined;
      
      // Switch turns
      state.currentPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
    },

    passRound: (state, action: PayloadAction<'player' | 'opponent'>) => {
      if (action.payload === 'player') {
        state.player.hasPassedRound = true;
      } else {
        state.opponent.hasPassedRound = true;
      }

      // If both players passed, end round
      if (state.player.hasPassedRound && state.opponent.hasPassedRound) {
        // Calculate round winner
        const playerPower = calculateTotalPower(state.board.playerRows, state.board.weather);
        const opponentPower = calculateTotalPower(state.board.opponentRows, state.board.weather);
        
        if (playerPower > opponentPower) {
          state.roundWins.player++;
        } else if (opponentPower > playerPower) {
          state.roundWins.opponent++;
        }
        // Tie means both get a round win in some Gwent variants, but we'll ignore ties for now

        // Check if game is over
        if (state.roundWins.player >= 2) {
          state.isGameOver = true;
          state.winner = 'player';
          state.phase = GamePhase.GAME_END;
        } else if (state.roundWins.opponent >= 2) {
          state.isGameOver = true;
          state.winner = 'opponent';
          state.phase = GamePhase.GAME_END;
        } else {
          // Start new round
          state.currentRound++;
          state.phase = GamePhase.ROUND_START;
          
          // Clear board
          state.board = createInitialBoard();
          
          // Reset pass status
          state.player.hasPassedRound = false;
          state.opponent.hasPassedRound = false;
          
          // Draw cards (2 cards at start of each new round except first)
          if (state.player.deck.length > 0) {
            state.player.hand.push(...state.player.deck.splice(0, 2));
          }
          if (state.opponent.deck.length > 0) {
            state.opponent.hand.push(...state.opponent.deck.splice(0, 2));
          }
        }
      } else {
        // Switch to other player if only one passed
        state.currentPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
      }
    },

    applyWeather: (state, action: PayloadAction<{ row: CardRow; weather: WeatherType }>) => {
      state.board.weather[action.payload.row] = action.payload.weather;
    },

    resetGame: (state) => {
      return {
        ...initialState,
        aiLevel: state.aiLevel // Keep AI level setting
      };
    },

    startNewGame: (state) => {
      state.phase = GamePhase.GAME_START;
      state.currentRound = 1;
      state.roundWins = { player: 0, opponent: 0 };
      state.isGameOver = false;
      state.winner = undefined;
      state.board = createInitialBoard();
      state.currentPlayer = 'player';
      
      // Reset player states
      state.player.hand = [];
      state.player.discardPile = [];
      state.player.hasPassedRound = false;
      state.player.livesRemaining = 2;
      
      state.opponent.hand = [];
      state.opponent.discardPile = [];
      state.opponent.hasPassedRound = false;
      state.opponent.livesRemaining = 2;
    }
  }
});

// Helper function to calculate total power for a player's rows
const calculateTotalPower = (rows: { [key in CardRow]: Card[] }, weather: { [key in CardRow]: WeatherType }): number => {
  let total = 0;
  
  Object.entries(rows).forEach(([row, cards]) => {
    const rowType = row as CardRow;
    const weatherEffect = weather[rowType];
    
    cards.forEach(card => {
      let cardPower = card.power;
      
      // Apply weather effects (non-hero cards are affected)
      if (!card.isHero && weatherEffect !== WeatherType.CLEAR) {
        cardPower = 1; // Weather reduces non-hero cards to 1 power
      }
      
      total += cardPower;
    });
  });
  
  return total;
};

export const {
  setGamePhase,
  setAILevel,
  setPlayerDeck,
  setOpponentDeck,
  drawInitialHands,
  selectCard,
  playCard,
  passRound,
  applyWeather,
  resetGame,
  startNewGame
} = gameSlice.actions;

export default gameSlice.reducer;

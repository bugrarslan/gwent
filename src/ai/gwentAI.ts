import { AILevel, Card, CardAbility, CardRow, GameState } from '../types';
import {
    calculateRowPower,
    getCardPriority,
    getPlayableCards
} from '../utils/cardUtils';

export interface AIDecision {
  action: 'play_card' | 'pass';
  card?: Card;
  targetRow?: CardRow;
  reasoning?: string;
}

export class GwentAI {
  private aiLevel: AILevel;

  constructor(aiLevel: AILevel) {
    this.aiLevel = aiLevel;
  }

  // Main decision function
  public makeDecision(gameState: GameState): AIDecision {
    const { opponent, board, currentRound } = gameState;
    
    switch (this.aiLevel) {
      case AILevel.EASY:
        return this.makeEasyDecision(opponent.hand, board, currentRound);
      case AILevel.MEDIUM:
        return this.makeMediumDecision(gameState);
      case AILevel.HARD:
        return this.makeHardDecision(gameState);
      default:
        return this.makeEasyDecision(opponent.hand, board, currentRound);
    }
  }

  // Easy AI: Random plays with basic logic
  private makeEasyDecision(hand: Card[], board: any, currentRound: number): AIDecision {
    const playableCards = getPlayableCards(hand);
    
    if (playableCards.length === 0) {
      return { action: 'pass', reasoning: 'No playable cards' };
    }

    // 30% chance to pass randomly
    if (Math.random() < 0.3) {
      return { action: 'pass', reasoning: 'Random pass' };
    }

    // Play random card
    const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
    const targetRow = randomCard.row || CardRow.CLOSE_COMBAT;

    return {
      action: 'play_card',
      card: randomCard,
      targetRow,
      reasoning: 'Random play'
    };
  }

  // Medium AI: Basic strategy with power calculation
  private makeMediumDecision(gameState: GameState): AIDecision {
    const { opponent, player, board, currentRound } = gameState;
    const playableCards = getPlayableCards(opponent.hand);
    
    if (playableCards.length === 0) {
      return { action: 'pass', reasoning: 'No playable cards' };
    }

    // Calculate current power difference
    const aiPower = this.calculateTotalPower(board.opponentRows, board.weather);
    const playerPower = this.calculateTotalPower(board.playerRows, board.weather);
    
    // If winning by significant margin, consider passing
    if (aiPower - playerPower > 15 && currentRound > 1) {
      if (Math.random() < 0.6) {
        return { action: 'pass', reasoning: 'Winning by large margin' };
      }
    }

    // Prioritize spy cards early in the game
    const spyCards = playableCards.filter(card => card.ability === CardAbility.SPY);
    if (spyCards.length > 0 && currentRound === 1) {
      const spyCard = spyCards[0];
      return {
        action: 'play_card',
        card: spyCard,
        targetRow: spyCard.row || CardRow.CLOSE_COMBAT,
        reasoning: 'Playing spy for card advantage'
      };
    }

    // Play strongest card if losing
    if (playerPower > aiPower) {
      const strongestCard = this.getStrongestPlayableCard(playableCards);
      return {
        action: 'play_card',
        card: strongestCard,
        targetRow: strongestCard.row || CardRow.CLOSE_COMBAT,
        reasoning: 'Playing strongest card while losing'
      };
    }

    // Play medium power card otherwise
    const sortedCards = playableCards.sort((a, b) => getCardPriority(b) - getCardPriority(a));
    const chosenCard = sortedCards[Math.floor(sortedCards.length / 3)]; // Play mid-tier card
    
    return {
      action: 'play_card',
      card: chosenCard,
      targetRow: chosenCard.row || CardRow.CLOSE_COMBAT,
      reasoning: 'Strategic medium power play'
    };
  }

  // Hard AI: Advanced strategy with bluffing and card counting
  private makeHardDecision(gameState: GameState): AIDecision {
    const { opponent, player, board, currentRound, roundWins } = gameState;
    const playableCards = getPlayableCards(opponent.hand);
    
    if (playableCards.length === 0) {
      return { action: 'pass', reasoning: 'No playable cards' };
    }

    // Calculate current power difference
    const aiPower = this.calculateTotalPower(board.opponentRows, board.weather);
    const playerPower = this.calculateTotalPower(board.playerRows, board.weather);
    const powerDiff = aiPower - playerPower;

    // Advanced bluffing strategy
    const isWinningOverall = roundWins.opponent > roundWins.player;
    const cardsRemaining = opponent.hand.length;
    
    // If already won a round and this is round 2, consider bluffing/saving cards
    if (roundWins.opponent >= 1 && currentRound === 2) {
      if (powerDiff > 10 || cardsRemaining > 5) {
        if (Math.random() < 0.7) {
          return { action: 'pass', reasoning: 'Bluffing to save cards for final round' };
        }
      }
    }

    // Prioritize spies in early rounds for card advantage
    const spyCards = playableCards.filter(card => card.ability === CardAbility.SPY);
    if (spyCards.length > 0 && currentRound <= 2 && cardsRemaining <= 8) {
      return {
        action: 'play_card',
        card: spyCards[0],
        targetRow: spyCards[0].row || CardRow.CLOSE_COMBAT,
        reasoning: 'Strategic spy play for card advantage'
      };
    }

    // Use medic cards strategically
    const medicCards = playableCards.filter(card => card.ability === CardAbility.MEDIC);
    if (medicCards.length > 0 && opponent.discardPile.length > 0) {
      const strongestInDiscard = this.getStrongestCard(opponent.discardPile);
      if (strongestInDiscard && strongestInDiscard.power >= 6) {
        return {
          action: 'play_card',
          card: medicCards[0],
          targetRow: medicCards[0].row || CardRow.SIEGE,
          reasoning: 'Using medic to resurrect strong card'
        };
      }
    }

    // Scorch strategy - use when opponent has strong cards
    const scorchCards = playableCards.filter(card => card.ability === CardAbility.SCORCH);
    if (scorchCards.length > 0) {
      const strongestPlayerCard = this.getStrongestCardOnBoard(board.playerRows);
      if (strongestPlayerCard && strongestPlayerCard.power >= 8 && !strongestPlayerCard.isHero) {
        return {
          action: 'play_card',
          card: scorchCards[0],
          targetRow: CardRow.SIEGE, // Scorch doesn't need specific row
          reasoning: 'Using scorch to destroy strong enemy card'
        };
      }
    }

    // End game strategy (Round 3)
    if (currentRound === 3) {
      if (powerDiff < -5) {
        // Need to play strongest cards
        const strongestCard = this.getStrongestPlayableCard(playableCards);
        return {
          action: 'play_card',
          card: strongestCard,
          targetRow: strongestCard.row || CardRow.CLOSE_COMBAT,
          reasoning: 'Final round - playing strongest card'
        };
      } else if (powerDiff > 3) {
        // Can afford to play weaker cards
        const weakestViableCard = this.getWeakestViableCard(playableCards);
        return {
          action: 'play_card',
          card: weakestViableCard,
          targetRow: weakestViableCard.row || CardRow.CLOSE_COMBAT,
          reasoning: 'Final round - minimal play to secure win'
        };
      }
    }

    // Default strategic play
    const optimalCard = this.chooseOptimalCard(playableCards, gameState);
    return {
      action: 'play_card',
      card: optimalCard,
      targetRow: optimalCard.row || CardRow.CLOSE_COMBAT,
      reasoning: 'Optimal strategic play'
    };
  }

  // Helper methods
  private calculateTotalPower(rows: { [key in CardRow]: Card[] }, weather: any): number {
    return Object.entries(rows).reduce((total, [row, cards]) => {
      const weatherAffected = weather[row as CardRow] !== 'clear';
      return total + calculateRowPower(cards, weatherAffected);
    }, 0);
  }

  private getStrongestPlayableCard(cards: Card[]): Card {
    return cards.reduce((strongest, card) => 
      card.power > strongest.power ? card : strongest
    );
  }

  private getStrongestCard(cards: Card[]): Card | null {
    if (cards.length === 0) return null;
    return cards.reduce((strongest, card) => 
      card.power > strongest.power ? card : strongest
    );
  }

  private getStrongestCardOnBoard(rows: { [key in CardRow]: Card[] }): Card | null {
    const allCards = Object.values(rows).flat();
    return this.getStrongestCard(allCards);
  }

  private getWeakestViableCard(cards: Card[]): Card {
    const nonSpyCards = cards.filter(card => card.ability !== CardAbility.SPY);
    if (nonSpyCards.length === 0) return cards[0];
    
    return nonSpyCards.reduce((weakest, card) => 
      card.power < weakest.power ? card : weakest
    );
  }

  private chooseOptimalCard(cards: Card[], gameState: GameState): Card {
    // Score each card based on current game state
    const scoredCards = cards.map(card => ({
      card,
      score: this.scoreCard(card, gameState)
    }));

    // Sort by score and return best card
    scoredCards.sort((a, b) => b.score - a.score);
    return scoredCards[0].card;
  }

  private scoreCard(card: Card, gameState: GameState): number {
    let score = card.power;

    // Bonus for abilities
    if (card.ability === CardAbility.SPY) score += 20;
    if (card.ability === CardAbility.MEDIC) score += 15;
    if (card.ability === CardAbility.SCORCH) score += 10;
    if (card.isHero) score += 25;

    // Adjust based on game state
    const { currentRound, roundWins } = gameState;
    
    if (currentRound === 1) {
      // Prioritize card advantage in first round
      if (card.ability === CardAbility.SPY) score += 10;
    } else if (currentRound === 3) {
      // Prioritize raw power in final round
      score += card.power * 0.5;
    }

    // If behind in rounds, prioritize high-power cards
    if (roundWins.player > roundWins.opponent) {
      score += card.power * 0.3;
    }

    return score;
  }

  // Update AI level
  public setAILevel(level: AILevel): void {
    this.aiLevel = level;
  }
}

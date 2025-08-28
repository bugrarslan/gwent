import { Card, CardAbility, CardRow, CardType } from '../types';

// Shuffle deck function
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Filter cards by type
export const filterCardsByType = (cards: Card[], type: CardType): Card[] => {
  return cards.filter(card => card.type === type);
};

// Filter cards by row
export const filterCardsByRow = (cards: Card[], row: CardRow): Card[] => {
  return cards.filter(card => card.row === row);
};

// Filter cards by ability
export const filterCardsByAbility = (cards: Card[], ability: CardAbility): Card[] => {
  return cards.filter(card => card.ability === ability);
};

// Get cards that can be played (units with valid rows)
export const getPlayableCards = (hand: Card[]): Card[] => {
  return hand.filter(card => 
    card.type === CardType.UNIT && card.row || 
    card.type === CardType.SPELL
  );
};

// Calculate power with weather effects
export const calculateCardPower = (card: Card, weatherAffected: boolean): number => {
  if (card.isHero || card.type !== CardType.UNIT) {
    return card.power; // Heroes and spells are not affected by weather
  }
  
  return weatherAffected ? 1 : card.power;
};

// Apply tight bond ability (cards with same name get doubled power)
export const applyTightBond = (cards: Card[]): Card[] => {
  const cardCounts: { [key: string]: number } = {};
  
  // Count cards with tight bond ability
  cards.forEach(card => {
    if (card.ability === CardAbility.TIGHT_BOND) {
      cardCounts[card.name] = (cardCounts[card.name] || 0) + 1;
    }
  });
  
  // Apply tight bond effect
  return cards.map(card => {
    if (card.ability === CardAbility.TIGHT_BOND && cardCounts[card.name] > 1) {
      return {
        ...card,
        power: card.power * cardCounts[card.name]
      };
    }
    return card;
  });
};

// Apply moral boost (adds +1 to all units in same row, except itself)
export const applyMoralBoost = (cards: Card[]): Card[] => {
  const hasBooster = cards.some(card => card.ability === CardAbility.MORAL_BOOST);
  
  if (!hasBooster) return cards;
  
  return cards.map(card => {
    if (card.ability !== CardAbility.MORAL_BOOST && card.type === CardType.UNIT) {
      return {
        ...card,
        power: card.power + 1
      };
    }
    return card;
  });
};

// Get strongest cards on board (for scorch effect)
export const getStrongestCards = (cards: Card[]): Card[] => {
  if (cards.length === 0) return [];
  
  const maxPower = Math.max(...cards.map(card => card.power));
  return cards.filter(card => card.power === maxPower && !card.isHero);
};

// Validate if a card can be played in a specific row
export const canPlayCardInRow = (card: Card, targetRow: CardRow): boolean => {
  if (card.type !== CardType.UNIT) return false;
  return card.row === targetRow;
};

// Calculate total power for a row
export const calculateRowPower = (cards: Card[], weatherAffected: boolean = false): number => {
  // First apply tight bond
  let processedCards = applyTightBond(cards);
  
  // Then apply moral boost
  processedCards = applyMoralBoost(processedCards);
  
  // Finally calculate total with weather effects
  return processedCards.reduce((total, card) => {
    return total + calculateCardPower(card, weatherAffected && !card.isHero);
  }, 0);
};

// Get random cards from deck (for AI)
export const getRandomCards = (deck: Card[], count: number): Card[] => {
  const shuffled = shuffleDeck(deck);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Check if deck is valid (minimum cards, etc.)
export const isDeckValid = (deck: Card[]): boolean => {
  const unitCards = filterCardsByType(deck, CardType.UNIT);
  const spellCards = filterCardsByType(deck, CardType.SPELL);
  
  // Basic validation: minimum 22 cards, at least 15 unit cards
  return deck.length >= 22 && unitCards.length >= 15;
};

// Get cards by rarity/importance for AI decision making
export const getCardPriority = (card: Card): number => {
  if (card.isHero) return 5; // Highest priority
  if (card.ability === CardAbility.SPY) return 4; // High priority
  if (card.ability === CardAbility.MEDIC) return 4;
  if (card.ability === CardAbility.SCORCH) return 3;
  if (card.power >= 8) return 3; // High power cards
  if (card.power >= 5) return 2; // Medium power cards
  return 1; // Low priority
};

// Sort cards by priority (useful for deck building and AI)
export const sortCardsByPriority = (cards: Card[]): Card[] => {
  return [...cards].sort((a, b) => getCardPriority(b) - getCardPriority(a));
};

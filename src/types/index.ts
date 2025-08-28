// Gwent Game Types

export enum CardType {
  UNIT = 'unit',
  SPELL = 'spell',
  LEADER = 'leader'
}

export enum CardRow {
  CLOSE_COMBAT = 'close_combat',
  RANGED = 'ranged',
  SIEGE = 'siege'
}

export enum Faction {
  NILFGAARD = 'nilfgaard',
  NORTHERN_REALMS = 'northern_realms',
  SCOIA_TAEL = 'scoia_tael',
  MONSTERS = 'monsters',
  SKELLIGE = 'skellige'
}

export enum CardAbility {
  SPY = 'spy',
  DECOY = 'decoy',
  MEDIC = 'medic',
  SCORCH = 'scorch',
  MUSTER = 'muster',
  MORAL_BOOST = 'moral_boost',
  TIGHT_BOND = 'tight_bond',
  BERSERKER = 'berserker',
  TRANSFORM = 'transform'
}

export enum WeatherType {
  CLEAR = 'clear',
  FROST = 'frost',
  FOG = 'fog',
  RAIN = 'rain'
}

export interface Card {
  id: string;
  name: string;
  faction: Faction;
  type: CardType;
  power: number;
  row?: CardRow;
  ability?: CardAbility;
  description: string;
  isHero: boolean;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  faction: Faction;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  leaderCard: Card;
  livesRemaining: number;
  totalPower: number;
  hasPassedRound: boolean;
}

export interface GameBoard {
  playerRows: {
    [CardRow.CLOSE_COMBAT]: Card[];
    [CardRow.RANGED]: Card[];
    [CardRow.SIEGE]: Card[];
  };
  opponentRows: {
    [CardRow.CLOSE_COMBAT]: Card[];
    [CardRow.RANGED]: Card[];
    [CardRow.SIEGE]: Card[];
  };
  weather: {
    [CardRow.CLOSE_COMBAT]: WeatherType;
    [CardRow.RANGED]: WeatherType;
    [CardRow.SIEGE]: WeatherType;
  };
}

export enum GamePhase {
  MENU = 'menu',
  DECK_BUILDING = 'deck_building',
  GAME_START = 'game_start',
  ROUND_START = 'round_start',
  PLAYER_TURN = 'player_turn',
  AI_TURN = 'ai_turn',
  ROUND_END = 'round_end',
  GAME_END = 'game_end'
}

export enum AILevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface GameState {
  phase: GamePhase;
  currentRound: number;
  player: Player;
  opponent: Player;
  board: GameBoard;
  currentPlayer: 'player' | 'opponent';
  aiLevel: AILevel;
  roundWins: {
    player: number;
    opponent: number;
  };
  selectedCard?: Card;
  isGameOver: boolean;
  winner?: 'player' | 'opponent';
}

export interface GameAction {
  type: string;
  payload?: any;
}

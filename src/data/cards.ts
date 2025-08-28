import { Card, CardAbility, CardRow, CardType, Faction } from '../types';

// Nilfgaard Leader Card
export const nilfgaardLeader: Card = {
  id: 'nilfgaard_leader',
  name: 'Emhyr var Emreis',
  faction: Faction.NILFGAARD,
  type: CardType.LEADER,
  power: 0,
  ability: CardAbility.SPY,
  description: 'Draw a card from your deck',
  isHero: true,
  imageUrl: 'assets/cards/nilfgaard/leader.png'
};

// Nilfgaard Unit Cards
export const nilfgaardCards: Card[] = [
  // Hero Cards
  {
    id: 'letho',
    name: 'Letho of Gulet',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 10,
    row: CardRow.CLOSE_COMBAT,
    description: 'Hero card, immune to weather effects',
    isHero: true,
    imageUrl: 'assets/cards/nilfgaard/letho.png'
  },
  {
    id: 'menno_coehoorn',
    name: 'Menno Coehoorn',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 10,
    row: CardRow.CLOSE_COMBAT,
    ability: CardAbility.MEDIC,
    description: 'Hero card with Medic ability',
    isHero: true,
    imageUrl: 'assets/cards/nilfgaard/menno.png'
  },
  {
    id: 'morvran_voorhis',
    name: 'Morvran Voorhis',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 10,
    row: CardRow.SIEGE,
    description: 'Hero siege unit',
    isHero: true,
    imageUrl: 'assets/cards/nilfgaard/morvran.png'
  },
  {
    id: 'tibor_eggebracht',
    name: 'Tibor Eggebracht',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 10,
    row: CardRow.RANGED,
    description: 'Hero ranged unit',
    isHero: true,
    imageUrl: 'assets/cards/nilfgaard/tibor.png'
  },

  // Close Combat Units
  {
    id: 'assire_var_anahid',
    name: 'Assire var Anahid',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 6,
    row: CardRow.CLOSE_COMBAT,
    description: 'Strong close combat unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/assire.png'
  },
  {
    id: 'cynthia',
    name: 'Cynthia',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 4,
    row: CardRow.CLOSE_COMBAT,
    description: 'Close combat unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/cynthia.png'
  },
  {
    id: 'fringilla_vigo',
    name: 'Fringilla Vigo',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 6,
    row: CardRow.CLOSE_COMBAT,
    description: 'Sorceress unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/fringilla.png'
  },
  {
    id: 'cahir',
    name: 'Cahir Mawr Dyffryn aep Ceallach',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 6,
    row: CardRow.CLOSE_COMBAT,
    description: 'Elite knight',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/cahir.png'
  },
  {
    id: 'puttkammer',
    name: 'Puttkammer',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 3,
    row: CardRow.CLOSE_COMBAT,
    description: 'Infantry unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/puttkammer.png'
  },

  // Ranged Units
  {
    id: 'renuald_aep_matsen',
    name: 'Renuald aep Matsen',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 5,
    row: CardRow.RANGED,
    description: 'Archer unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/renuald.png'
  },
  {
    id: 'rotten_mangonel',
    name: 'Rotten Mangonel',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 3,
    row: CardRow.RANGED,
    description: 'Artillery unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/mangonel.png'
  },
  {
    id: 'crossbow',
    name: 'Crossbow',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 6,
    row: CardRow.RANGED,
    description: 'Crossbow unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/crossbow.png'
  },

  // Siege Units
  {
    id: 'siege_tower',
    name: 'Siege Tower',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 6,
    row: CardRow.SIEGE,
    description: 'Siege equipment',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/siege_tower.png'
  },
  {
    id: 'fire_scorpion',
    name: 'Fire Scorpion',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 10,
    row: CardRow.SIEGE,
    description: 'Heavy siege weapon',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/fire_scorpion.png'
  },
  {
    id: 'heavy_zerrikanian_fire_scorpion',
    name: 'Heavy Zerrikanian Fire Scorpion',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 10,
    row: CardRow.SIEGE,
    description: 'Ultimate siege weapon',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/heavy_scorpion.png'
  },

  // Spy Cards
  {
    id: 'stefan_skellen',
    name: 'Stefan Skellen',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 1,
    row: CardRow.CLOSE_COMBAT,
    ability: CardAbility.SPY,
    description: 'Spy: Place on opponent\'s side, draw 2 cards',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/stefan.png'
  },
  {
    id: 'sweers',
    name: 'Sweers',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 2,
    row: CardRow.RANGED,
    ability: CardAbility.SPY,
    description: 'Spy: Place on opponent\'s side, draw 2 cards',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/sweers.png'
  },
  {
    id: 'shilard_fitz_oesterlen',
    name: 'Shilard Fitz-Oesterlen',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 7,
    row: CardRow.CLOSE_COMBAT,
    ability: CardAbility.SPY,
    description: 'Spy: Place on opponent\'s side, draw 2 cards',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/shilard.png'
  },

  // Medic Cards
  {
    id: 'vicovaro_medic',
    name: 'Vicovaro Medic',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 0,
    row: CardRow.SIEGE,
    ability: CardAbility.MEDIC,
    description: 'Medic: Resurrect a card from discard pile',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/medic.png'
  },

  // Special Cards
  {
    id: 'albrich',
    name: 'Albrich',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 2,
    row: CardRow.RANGED,
    description: 'Basic ranged unit',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/albrich.png'
  },
  {
    id: 'nausicaa_cavalry_rider',
    name: 'Nausicaa Cavalry Rider',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 2,
    row: CardRow.CLOSE_COMBAT,
    ability: CardAbility.TIGHT_BOND,
    description: 'Tight Bond: Double power for each copy played',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/nausicaa.png'
  },
  {
    id: 'impera_brigade_guard',
    name: 'Impera Brigade Guard',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 3,
    row: CardRow.CLOSE_COMBAT,
    ability: CardAbility.TIGHT_BOND,
    description: 'Tight Bond: Double power for each copy played',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/impera.png'
  },

  // Weather and Special Spells
  {
    id: 'torrential_rain',
    name: 'Torrential Rain',
    faction: Faction.NILFGAARD,
    type: CardType.SPELL,
    power: 0,
    description: 'Reduces all Siege units to 1 power',
    isHero: false,
    imageUrl: 'assets/cards/nilfgaard/rain.png'
  }
];

// Neutral Cards (can be used by any faction)
export const neutralCards: Card[] = [
  {
    id: 'geralt',
    name: 'Geralt of Rivia',
    faction: Faction.NILFGAARD, // Will be available to all factions
    type: CardType.UNIT,
    power: 15,
    row: CardRow.CLOSE_COMBAT,
    description: 'The White Wolf - Ultimate hero card',
    isHero: true,
    imageUrl: 'assets/cards/neutral/geralt.png'
  },
  {
    id: 'triss',
    name: 'Triss Merigold',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 7,
    row: CardRow.CLOSE_COMBAT,
    description: 'Powerful sorceress',
    isHero: true,
    imageUrl: 'assets/cards/neutral/triss.png'
  },
  {
    id: 'yennefer',
    name: 'Yennefer of Vengerberg',
    faction: Faction.NILFGAARD,
    type: CardType.UNIT,
    power: 7,
    row: CardRow.RANGED,
    ability: CardAbility.MEDIC,
    description: 'Hero sorceress with medic ability',
    isHero: true,
    imageUrl: 'assets/cards/neutral/yennefer.png'
  },
  {
    id: 'decoy',
    name: 'Decoy',
    faction: Faction.NILFGAARD,
    type: CardType.SPELL,
    power: 0,
    ability: CardAbility.DECOY,
    description: 'Return a card from the battlefield to your hand',
    isHero: false,
    imageUrl: 'assets/cards/neutral/decoy.png'
  },
  {
    id: 'scorch',
    name: 'Scorch',
    faction: Faction.NILFGAARD,
    type: CardType.SPELL,
    power: 0,
    ability: CardAbility.SCORCH,
    description: 'Destroy the strongest unit(s) on the battlefield',
    isHero: false,
    imageUrl: 'assets/cards/neutral/scorch.png'
  }
];

// Function to get full Nilfgaard deck
export const getNilfgaardDeck = (): Card[] => {
  return [...nilfgaardCards, ...neutralCards.slice(3, 5)]; // Include some neutral cards
};

// Function to get all available cards
export const getAllCards = (): Card[] => {
  return [...nilfgaardCards, ...neutralCards];
};

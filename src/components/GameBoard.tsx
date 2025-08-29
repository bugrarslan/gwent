import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CardRow, Card as CardType } from '../types';
import { Card } from './Card';

interface GameRowProps {
  cards: CardType[];
  title: string;
  weatherEffect?: string;
  onCardPress?: (card: CardType) => void;
  isPlayerRow?: boolean;
  totalPower?: number;
}

export const GameRow: React.FC<GameRowProps> = ({ 
  cards, 
  title, 
  weatherEffect, 
  onCardPress,
  isPlayerRow = false,
  totalPower = 0
}) => {
  return (
    <View style={[styles.rowContainer, isPlayerRow ? styles.playerRow : styles.opponentRow]}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowPower}>Power: {totalPower}</Text>
        {weatherEffect && weatherEffect !== 'clear' && (
          <Text style={styles.weatherEffect}>⛈️ {weatherEffect}</Text>
        )}
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <Card
              key={`${card.id}-${index}`}
              card={card}
              onPress={() => onCardPress?.(card)}
              showPowerOnly={true}
            />
          ))
        ) : (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No cards</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

interface GameBoardProps {
  playerRows: { [key in CardRow]: CardType[] };
  opponentRows: { [key in CardRow]: CardType[] };
  weather: { [key in CardRow]: string };
  onCardPress?: (card: CardType) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  playerRows,
  opponentRows,
  weather,
  onCardPress
}) => {
  const calculateRowPower = (cards: CardType[], weatherAffected: boolean): number => {
    return cards.reduce((total, card) => {
      let power = card.power;
      if (weatherAffected && !card.isHero) {
        power = 1; // Weather reduces non-hero cards to 1
      }
      return total + power;
    }, 0);
  };

  const getRowTitle = (row: CardRow): string => {
    switch (row) {
      case CardRow.CLOSE_COMBAT:
        return 'Close Combat ⚔️';
      case CardRow.RANGED:
        return 'Ranged 🏹';
      case CardRow.SIEGE:
        return 'Siege 🏰';
      default:
        return 'Unknown';
    }
  };

  return (
    <ScrollView style={styles.boardContainer} showsVerticalScrollIndicator={false}>
      {/* Opponent Rows */}
      <View style={styles.opponentSection}>
        <Text style={styles.sectionTitle}>AI Opponent</Text>
        {Object.entries(opponentRows).reverse().map(([row, cards]) => (
          <GameRow
            key={`opponent-${row}`}
            cards={cards}
            title={getRowTitle(row as CardRow)}
            weatherEffect={weather[row as CardRow]}
            onCardPress={onCardPress}
            isPlayerRow={false}
            totalPower={calculateRowPower(cards, weather[row as CardRow] !== 'clear')}
          />
        ))}
      </View>

      {/* Middle Section - Weather/Effects */}
      <View style={styles.middleSection}>
        <Text style={styles.roundInfo}>Battle Field</Text>
      </View>

      {/* Player Rows */}
      <View style={styles.playerSection}>
        <Text style={styles.sectionTitle}>Player</Text>
        {Object.entries(playerRows).map(([row, cards]) => (
          <GameRow
            key={`player-${row}`}
            cards={cards}
            title={getRowTitle(row as CardRow)}
            weatherEffect={weather[row as CardRow]}
            onCardPress={onCardPress}
            isPlayerRow={true}
            totalPower={calculateRowPower(cards, weather[row as CardRow] !== 'clear')}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  opponentSection: {
    backgroundColor: '#2a1a1a',
    padding: 10,
    paddingBottom: 5,
  },
  playerSection: {
    backgroundColor: '#1a2a1a',
    padding: 10,
    paddingTop: 5,
  },
  middleSection: {
    height: 50,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#d4af37',
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
    textAlign: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
  },
  roundInfo: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  rowContainer: {
    marginVertical: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    minHeight: 140, // Minimum yükseklik garantisi
  },
  playerRow: {
    borderColor: '#4a8a4a',
  },
  opponentRow: {
    borderColor: '#8a4a4a',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rowPower: {
    fontSize: 12,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  weatherEffect: {
    fontSize: 10,
    color: '#87ceeb',
  },
  cardsContainer: {
    maxHeight: 130,
  },
  emptyRow: {
    width: 80,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444444',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#666666',
    fontSize: 10,
  },
});

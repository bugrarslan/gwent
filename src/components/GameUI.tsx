import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card as CardType } from '../types';
import { Card } from './Card';

interface PlayerHandProps {
  cards: CardType[];
  selectedCard?: CardType;
  onCardSelect: (card: CardType) => void;
  onPassRound: () => void;
  canPass: boolean;
  currentPlayer: 'player' | 'opponent';
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  selectedCard,
  onCardSelect,
  onPassRound,
  canPass,
  currentPlayer
}) => {
  return (
    <View style={styles.handContainer}>
      <View style={styles.handHeader}>
        <Text style={styles.handTitle}>Your Hand ({cards.length} cards)</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.passButton,
              !canPass && styles.disabledButton,
              currentPlayer !== 'player' && styles.disabledButton
            ]}
            onPress={onPassRound}
            disabled={!canPass || currentPlayer !== 'player'}
          >
            <Text style={styles.passButtonText}>Pass Round</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
        {cards.map((card, index) => (
          <Card
            key={`${card.id}-${index}`}
            card={card}
            onPress={() => onCardSelect(card)}
            isSelected={selectedCard?.id === card.id}
            isDisabled={currentPlayer !== 'player'}
          />
        ))}
      </ScrollView>
      
      {selectedCard && (
        <View style={styles.selectedCardInfo}>
          <Text style={styles.selectedCardTitle}>Selected: {selectedCard.name}</Text>
          <Text style={styles.selectedCardDesc}>{selectedCard.description}</Text>
        </View>
      )}
    </View>
  );
};

interface GameHUDProps {
  currentRound: number;
  roundWins: { player: number; opponent: number };
  playerPower: number;
  opponentPower: number;
  currentPlayer: 'player' | 'opponent';
  isPlayerTurn: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentRound,
  roundWins,
  playerPower,
  opponentPower,
  currentPlayer,
  isPlayerTurn
}) => {
  return (
    <View style={styles.hudContainer}>
      <View style={styles.hudSection}>
        <Text style={styles.hudTitle}>Round {currentRound}</Text>
        <Text style={styles.hudSubtext}>
          Wins: {roundWins.player} - {roundWins.opponent}
        </Text>
      </View>
      
      <View style={styles.hudSection}>
        <Text style={styles.hudTitle}>Power</Text>
        <Text style={[
          styles.hudPower,
          playerPower > opponentPower ? styles.winning : 
          playerPower < opponentPower ? styles.losing : styles.tied
        ]}>
          {playerPower} vs {opponentPower}
        </Text>
      </View>
      
      <View style={styles.hudSection}>
        <Text style={styles.hudTitle}>Turn</Text>
        <Text style={[
          styles.hudTurn,
          isPlayerTurn ? styles.playerTurn : styles.opponentTurn
        ]}>
          {isPlayerTurn ? 'Your Turn' : 'AI Turn'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  handContainer: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
  },
  handHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  handTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  passButton: {
    backgroundColor: '#8b4513',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  disabledButton: {
    backgroundColor: '#444444',
    borderColor: '#666666',
    opacity: 0.6,
  },
  passButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardsScroll: {
    maxHeight: 140,
  },
  selectedCardInfo: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  selectedCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 4,
  },
  selectedCardDesc: {
    fontSize: 12,
    color: '#cccccc',
  },
  hudContainer: {
    flexDirection: 'row',
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  hudSection: {
    flex: 1,
    alignItems: 'center',
  },
  hudTitle: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 4,
  },
  hudSubtext: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  hudPower: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  winning: {
    color: '#4ade80',
  },
  losing: {
    color: '#ef4444',
  },
  tied: {
    color: '#fbbf24',
  },
  hudTurn: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerTurn: {
    color: '#4ade80',
  },
  opponentTurn: {
    color: '#ef4444',
  },
});

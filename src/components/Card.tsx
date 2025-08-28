import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onPress?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  showPowerOnly?: boolean;
  isInDeck?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  onPress, 
  isSelected = false, 
  isDisabled = false,
  showPowerOnly = false,
  isInDeck = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        isSelected && styles.selectedCard,
        isDisabled && styles.disabledCard,
        isInDeck && styles.inDeckCard
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {/* Card Image Placeholder */}
      <View style={styles.cardImage}>
        <Text style={styles.cardPower}>{card.power}</Text>
        {card.isHero && <Text style={styles.heroIndicator}>★</Text>}
      </View>
      
      {!showPowerOnly && (
        <>
          <Text style={styles.cardName} numberOfLines={1}>
            {card.name}
          </Text>
          
          {card.ability && (
            <Text style={styles.cardAbility} numberOfLines={1}>
              {card.ability.replace('_', ' ')}
            </Text>
          )}
          
          <Text style={styles.cardRow} numberOfLines={1}>
            {card.row?.replace('_', ' ') || 'Special'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 80,
    height: 120,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8b4513',
    margin: 2,
    padding: 4,
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#d4af37',
    backgroundColor: '#3a3a1a',
  },
  disabledCard: {
    opacity: 0.5,
  },
  heroCard: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a1a1a',
  },
  inDeckCard: {
    borderColor: '#ff6b35', // Açık turuncu - destede olan kartlar
  },
  cardImage: {
    width: '100%',
    height: 60,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardPower: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  heroIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    color: '#ff6b35',
    fontSize: 12,
  },
  cardName: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
  },
  cardAbility: {
    fontSize: 8,
    color: '#87ceeb',
    textAlign: 'center',
    marginTop: 2,
  },
  cardRow: {
    fontSize: 8,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 2,
  },
});

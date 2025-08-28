import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Card as CardType } from '../types';

interface CardDetailModalProps {
  visible: boolean;
  card: CardType | null;
  currentCount: number;
  maxCount: number;
  onClose: () => void;
  onAddToDeck: () => void;
  onRemoveFromDeck: () => void;
  canAdd: boolean;
  canRemove: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  visible,
  card,
  currentCount,
  maxCount,
  onClose,
  onAddToDeck,
  onRemoveFromDeck,
  canAdd,
  canRemove
}) => {
  if (!card) return null;

  const getRowIcon = (row?: string): string => {
    switch (row) {
      case 'close_combat': return '⚔️';
      case 'ranged': return '🏹';
      case 'siege': return '🏰';
      default: return '✨';
    }
  };

  const getAbilityDescription = (ability?: string): string => {
    switch (ability) {
      case 'spy': return 'Place on opponent\'s side and draw 2 cards';
      case 'medic': return 'Resurrect a card from your discard pile';
      case 'scorch': return 'Destroy the strongest unit(s) on the battlefield';
      case 'tight_bond': return 'Double power for each copy played';
      case 'moral_boost': return 'Adds +1 to all units in same row';
      case 'muster': return 'Find all cards with the same name';
      case 'decoy': return 'Return a card from battlefield to your hand';
      default: return ability ? ability.replace('_', ' ') : '';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Card Display */}
          <View style={styles.cardDisplay}>
            <View style={[
              styles.cardImage, 
              card.isHero && styles.heroCardImage
            ]}>
              <Text style={styles.cardPower}>{card.power}</Text>
              {card.isHero && <Text style={styles.heroStar}>★</Text>}
            </View>

            <Text style={styles.cardName}>{card.name}</Text>
            
            <View style={styles.cardStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Row:</Text>
                <Text style={styles.statValue}>
                  {getRowIcon(card.row)} {card.row?.replace('_', ' ') || 'Special'}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Type:</Text>
                <Text style={styles.statValue}>{card.type}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Faction:</Text>
                <Text style={styles.statValue}>{card.faction}</Text>
              </View>
              
              {card.isHero && (
                <View style={styles.statItem}>
                  <Text style={styles.heroLabel}>★ HERO CARD ★</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <ScrollView style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description:</Text>
              <Text style={styles.descriptionText}>{card.description}</Text>
              
              {card.ability && (
                <>
                  <Text style={styles.abilityTitle}>Ability: {card.ability.replace('_', ' ').toUpperCase()}</Text>
                  <Text style={styles.abilityText}>{getAbilityDescription(card.ability)}</Text>
                </>
              )}
            </ScrollView>

            {/* Deck Status */}
            <View style={styles.deckStatus}>
              <Text style={styles.deckStatusText}>
                In Deck: {currentCount} / {maxCount}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.removeButton,
                  !canRemove && styles.disabledButton
                ]}
                onPress={onRemoveFromDeck}
                disabled={!canRemove}
              >
                <Text style={styles.actionButtonText}>Remove from Deck</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.addButton,
                  !canAdd && styles.disabledButton
                ]}
                onPress={onAddToDeck}
                disabled={!canAdd}
              >
                <Text style={styles.actionButtonText}>Add to Deck</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: '#d4af37',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8b4513',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDisplay: {
    alignItems: 'center',
  },
  cardImage: {
    width: 120,
    height: 160,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8b4513',
    marginTop: 20,
    position: 'relative',
  },
  heroCardImage: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a1a1a',
  },
  cardPower: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  heroStar: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#ff6b35',
    fontSize: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  cardStats: {
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  statLabel: {
    fontSize: 14,
    color: '#cccccc',
  },
  statValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  heroLabel: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  descriptionContainer: {
    maxHeight: 120,
    width: '100%',
    marginVertical: 15,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 10,
  },
  abilityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#87ceeb',
    marginBottom: 5,
  },
  abilityText: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  deckStatus: {
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  deckStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  addButton: {
    backgroundColor: '#4a8a4a',
    borderColor: '#6ab46a',
  },
  removeButton: {
    backgroundColor: '#8a4a4a',
    borderColor: '#b46a6a',
  },
  disabledButton: {
    backgroundColor: '#444444',
    borderColor: '#666666',
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

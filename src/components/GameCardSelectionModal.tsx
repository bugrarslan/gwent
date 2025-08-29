import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, CardRow } from '../types';
import { Card as CardComponent } from './Card';

interface GameCardSelectionModalProps {
  visible: boolean;
  selectedCategory: CardRow | 'special' | null;
  availableCards: Card[];
  selectedCard: Card | null;
  onCardSelect: (card: Card) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const GameCardSelectionModal: React.FC<GameCardSelectionModalProps> = ({
  visible,
  selectedCategory,
  availableCards,
  selectedCard,
  onCardSelect,
  onConfirm,
  onCancel,
}) => {
  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'special':
        return 'Special Cards';
      case CardRow.CLOSE_COMBAT:
        return 'Close Combat Cards';
      case CardRow.RANGED:
        return 'Ranged Cards';
      case CardRow.SIEGE:
        return 'Siege Cards';
      default:
        return 'Select Cards';
    }
  };

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
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.gameCardModal}>
          {/* Header with Cancel and Confirm buttons */}
          <View style={styles.gameModalHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.gameModalTitle}>
              {getCategoryTitle()}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedCard && styles.confirmButtonDisabled
              ]}
              onPress={onConfirm}
              disabled={!selectedCard}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Card Detail Area */}
          <View style={styles.selectedCardArea}>
            {selectedCard ? (
              <View style={styles.cardDetailSection}>
                <View style={styles.cardDetailLeft}>
                  <View style={[
                    styles.selectedCardImage,
                    selectedCard.isHero && styles.selectedHeroCard
                  ]}>
                    <Text style={styles.selectedCardPower}>{selectedCard.power}</Text>
                    {selectedCard.isHero && <Text style={styles.selectedHeroStar}>★</Text>}
                  </View>
                </View>
                
                <View style={styles.cardDetailRight}>
                  <Text style={styles.selectedCardName}>{selectedCard.name}</Text>
                  
                  <View style={styles.cardStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Row:</Text>
                      <Text style={styles.statValue}>
                        {getRowIcon(selectedCard.row)} {selectedCard.row?.replace('_', ' ') || 'Special'}
                      </Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Type:</Text>
                      <Text style={styles.statValue}>{selectedCard.type}</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Power:</Text>
                      <Text style={styles.statValue}>{selectedCard.power}</Text>
                    </View>
                    
                    {selectedCard.isHero && (
                      <View style={styles.statItem}>
                        <Text style={styles.heroLabel}>★ HERO CARD ★</Text>
                      </View>
                    )}
                  </View>
                  
                  <ScrollView style={styles.cardDescriptionScroll}>
                    <Text style={styles.descriptionTitle}>Description:</Text>
                    <Text style={styles.cardDescription}>
                      {selectedCard.description}
                    </Text>
                    
                    {selectedCard.ability && (
                      <>
                        <Text style={styles.abilityTitle}>
                          Ability: {selectedCard.ability.replace('_', ' ').toUpperCase()}
                        </Text>
                        <Text style={styles.abilityText}>
                          {getAbilityDescription(selectedCard.ability)}
                        </Text>
                      </>
                    )}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <View style={styles.noSelectionArea}>
                <Text style={styles.noSelectionText}>Select a card to see details</Text>
              </View>
            )}
          </View>

          {/* Cards Selection Area (bottom small cards) */}
          <View style={styles.cardsSelectionArea}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.cardsHorizontalScroll}
            >
              {availableCards.map((card) => (
                <View
                  key={card.id}
                  style={[
                    styles.smallCardContainer,
                    selectedCard?.id === card.id && styles.smallCardSelected
                  ]}
                >
                  <CardComponent 
                    card={card}
                    showPowerOnly={false}
                    onPress={() => onCardSelect(card)}
                    isSelected={selectedCard?.id === card.id}
                  />
                </View>
              ))}
            </ScrollView>
            
            {availableCards.length === 0 && (
              <View style={styles.noCardsAvailable}>
                <Text style={styles.noCardsText}>No cards available in this category</Text>
              </View>
            )}
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
    padding: 20,
  },
  gameCardModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    width: '100%',
    maxWidth: 500,
    height: '90%',
    borderWidth: 2,
    borderColor: '#d4af37',
    overflow: 'hidden',
  },
  gameModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    backgroundColor: '#2a2a2a',
    minHeight: 60,
  },
  gameModalTitle: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#666',
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#28a745',
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#444',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedCardArea: {
    flex: 1,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    minHeight: 300,
  },
  cardDetailSection: {
    flexDirection: 'row',
    flex: 1,
    gap: 20,
    alignItems: 'flex-start',
  },
  cardDetailLeft: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectedCardImage: {
    width: 120,
    height: 180,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#8b4513',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedHeroCard: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a1a1a',
    shadowColor: '#ff6b35',
    shadowOpacity: 0.5,
  },
  selectedCardPower: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  selectedHeroStar: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#ff6b35',
    fontSize: 16,
  },
  cardDetailRight: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  selectedCardName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
  },
  cardStats: {
    marginBottom: 15,
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  statLabel: {
    fontSize: 13,
    color: '#ccc',
  },
  statValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  heroLabel: {
    fontSize: 13,
    color: '#ffa500',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  cardStatText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDescriptionScroll: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  cardDescription: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  abilityTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#87ceeb',
    marginTop: 8,
    marginBottom: 5,
    paddingHorizontal: 12,
  },
  abilityText: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 16,
    fontStyle: 'italic',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  noSelectionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  noSelectionText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  cardsSelectionArea: {
    height: 160,
    borderTopWidth: 1,
    borderTopColor: '#444',
    backgroundColor: '#2a2a2a',
  },
  cardsHorizontalScroll: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  smallCardContainer: {
    width: 90,
    height: 130,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  smallCardSelected: {
    borderColor: '#28a745',
    shadowColor: '#28a745',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  noCardsAvailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noCardsText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});

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
                    <Text style={styles.cardStatText}>Power: {selectedCard.power}</Text>
                    <Text style={styles.cardStatText}>Type: {selectedCard.type}</Text>
                    <Text style={styles.cardStatText}>
                      Row: {selectedCard.row?.replace('_', ' ') || 'Special'}
                    </Text>
                    {selectedCard.ability && (
                      <Text style={styles.cardStatText}>
                        Ability: {selectedCard.ability.replace('_', ' ')}
                      </Text>
                    )}
                  </View>
                  
                  <ScrollView style={styles.cardDescriptionScroll}>
                    <Text style={styles.cardDescription}>
                      {selectedCard.description}
                    </Text>
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
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.smallCardContainer,
                    selectedCard?.id === card.id && styles.smallCardSelected
                  ]}
                  onPress={() => onCardSelect(card)}
                >
                  <CardComponent 
                    card={card}
                    showPowerOnly={false}
                  />
                </TouchableOpacity>
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
  },
  gameCardModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    margin: 20,
    flex: 1,
    maxHeight: '90%',
  },
  gameModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  gameModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#666',
    borderRadius: 8,
    minWidth: 70,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  confirmButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#28a745',
    borderRadius: 8,
    minWidth: 70,
  },
  confirmButtonDisabled: {
    backgroundColor: '#444',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedCardArea: {
    flex: 1,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  cardDetailSection: {
    flexDirection: 'row',
    flex: 1,
    gap: 15,
  },
  cardDetailLeft: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCardImage: {
    width: 120,
    height: 180,
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedHeroCard: {
    borderColor: '#ffa500',
  },
  selectedCardPower: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedHeroStar: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: '#ffa500',
    fontSize: 16,
  },
  cardDetailRight: {
    flex: 3,
    justifyContent: 'flex-start',
  },
  selectedCardName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardStats: {
    marginBottom: 15,
  },
  cardStatText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  cardDescriptionScroll: {
    flex: 1,
  },
  cardDescription: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
  },
  noSelectionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSelectionText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
  cardsSelectionArea: {
    height: 140,
    borderTopWidth: 1,
    borderTopColor: '#444',
    backgroundColor: '#222',
  },
  cardsHorizontalScroll: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  smallCardContainer: {
    width: 80,
    height: 120,
    marginRight: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  smallCardSelected: {
    borderColor: '#28a745',
  },
  noCardsAvailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCardsText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
});

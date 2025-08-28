import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getAllCards } from '../data/cards';
import { setGamePhase, startNewGame } from '../store/gameSlice';
import { Card, GamePhase } from '../types';
import { useAppDispatch } from '../utils/hooks';
import { Card as CardComponent } from './Card';
import { CardDetailModal } from './CardDetailModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DeckBuildingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [availableCards] = useState<Card[]>(getAllCards());
  const [selectedDeck, setSelectedDeck] = useState<Card[]>([]);
  const [maxDeckSize] = useState<number>(25);
  const [minDeckSize] = useState<number>(22);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'unit' | 'spell'>('all');
  const [filterRow, setFilterRow] = useState<'all' | 'close_combat' | 'ranged' | 'siege'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'heroes' | 'special' | 'normal'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'power' | 'type'>('name');

  // Auto-select a valid deck for now (simplified deck building)
  useEffect(() => {
    if (selectedDeck.length === 0) {
      const autoDeck = availableCards.slice(0, 22); // Take first 22 cards
      setSelectedDeck(autoDeck);
    }
  }, [availableCards, selectedDeck.length]);

  const addCardToDeck = (card: Card) => {
    if (selectedDeck.length >= maxDeckSize) return;
    
    // Check if card is already in deck (limit duplicates)
    const cardCount = selectedDeck.filter(c => c.id === card.id).length;
    const maxCopies = card.isHero ? 1 : 3; // Heroes: 1 copy, others: 3 copies max
    
    if (cardCount >= maxCopies) return;
    
    setSelectedDeck([...selectedDeck, card]);
  };

  const removeCardFromDeck = (cardId: string) => {
    const cardIndex = selectedDeck.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      const newDeck = [...selectedDeck];
      newDeck.splice(cardIndex, 1);
      setSelectedDeck(newDeck);
    }
  };

  const startGame = () => {
    if (selectedDeck.length >= minDeckSize) {
      dispatch(startNewGame());
      dispatch(setGamePhase(GamePhase.GAME_START));
    }
  };

  const isCardInDeck = (cardId: string): number => {
    return selectedDeck.filter(c => c.id === cardId).length;
  };

  const getCardMaxCopies = (card: Card): number => {
    return card.isHero ? 1 : 3;
  };

  const canAddCard = (card: Card): boolean => {
    const currentCount = isCardInDeck(card.id);
    const maxCopies = getCardMaxCopies(card);
    return selectedDeck.length < maxDeckSize && currentCount < maxCopies;
  };

  const canRemoveCard = (card: Card): boolean => {
    return isCardInDeck(card.id) > 0;
  };

  const openCardModal = (card: Card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const closeCardModal = () => {
    setModalVisible(false);
    setSelectedCard(null);
  };

  const handleAddToDeck = () => {
    if (selectedCard) {
      addCardToDeck(selectedCard);
    }
  };

  const handleRemoveFromDeck = () => {
    if (selectedCard) {
      removeCardFromDeck(selectedCard.id);
    }
  };

  // Filter cards based on selected filters
  const getFilteredCards = () => {
    let filtered = availableCards.filter(card => {
      const typeMatch = filterType === 'all' || card.type === filterType;
      const rowMatch = filterRow === 'all' || card.row === filterRow;
      
      let categoryMatch = true;
      if (filterCategory === 'heroes') {
        categoryMatch = card.isHero;
      } else if (filterCategory === 'special') {
        categoryMatch = card.type === 'spell' || card.ability !== undefined;
      } else if (filterCategory === 'normal') {
        categoryMatch = !card.isHero && card.type === 'unit' && !card.ability;
      }
      
      return typeMatch && rowMatch && categoryMatch;
    });

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'power':
          return b.power - a.power;
        case 'type':
          if (a.type !== b.type) return a.type.localeCompare(b.type);
          return a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const filteredCards = getFilteredCards();
  
  // Calculate deck summary
  const getDeckSummary = () => {
    const heroes = selectedDeck.filter(card => card.isHero).length;
    const units = selectedDeck.filter(card => card.type === 'unit' && !card.isHero).length;
    const spells = selectedDeck.filter(card => card.type === 'spell').length;
    const totalPower = selectedDeck.reduce((sum, card) => sum + card.power, 0);
    
    return { heroes, units, spells, totalPower };
  };

  const deckSummary = getDeckSummary();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Build Your Deck</Text>
        <View style={styles.deckSummaryContainer}>
          <View style={styles.deckSummaryItem}>
            <Text style={styles.deckSummaryNumber}>{selectedDeck.length}</Text>
            <Text style={styles.deckSummaryLabel}>Cards</Text>
          </View>
          <View style={styles.deckSummaryItem}>
            <Text style={styles.deckSummaryNumber}>{deckSummary.heroes}</Text>
            <Text style={styles.deckSummaryLabel}>Heroes</Text>
          </View>
          <View style={styles.deckSummaryItem}>
            <Text style={styles.deckSummaryNumber}>{deckSummary.units}</Text>
            <Text style={styles.deckSummaryLabel}>Units</Text>
          </View>
          <View style={styles.deckSummaryItem}>
            <Text style={styles.deckSummaryNumber}>{deckSummary.spells}</Text>
            <Text style={styles.deckSummaryLabel}>Spells</Text>
          </View>
          <View style={styles.deckSummaryItem}>
            <Text style={styles.deckSummaryNumber}>{deckSummary.totalPower}</Text>
            <Text style={styles.deckSummaryLabel}>Total Power</Text>
          </View>
        </View>
        <Text style={styles.progressText}>
          {selectedDeck.length >= minDeckSize ? 
            `Ready to play! (${selectedDeck.length}/${maxDeckSize})` : 
            `Need ${minDeckSize - selectedDeck.length} more cards (${selectedDeck.length}/${maxDeckSize})`}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.mainPanel}>
          <Text style={styles.panelTitle}>Available Cards ({filteredCards.length})</Text>
          
          {/* Enhanced Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* Category Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Category:</Text>
                {['all', 'heroes', 'normal', 'special'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterButton,
                      filterCategory === category && styles.activeFilter
                    ]}
                    onPress={() => setFilterCategory(category as any)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterCategory === category && styles.activeFilterText
                    ]}>
                      {category === 'all' ? 'All' : 
                       category === 'heroes' ? '⭐ Heroes' :
                       category === 'normal' ? 'Normal' : 
                       '✨ Special'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Type Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Type:</Text>
                {['all', 'unit', 'spell'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      filterType === type && styles.activeFilter
                    ]}
                    onPress={() => setFilterType(type as any)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterType === type && styles.activeFilterText
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Row Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Row:</Text>
                {['all', 'close_combat', 'ranged', 'siege'].map(row => (
                  <TouchableOpacity
                    key={row}
                    style={[
                      styles.filterButton,
                      filterRow === row && styles.activeFilter
                    ]}
                    onPress={() => setFilterRow(row as any)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterRow === row && styles.activeFilterText
                    ]}>
                      {row === 'all' ? 'All' : 
                       row === 'close_combat' ? '⚔️ Combat' : 
                       row === 'ranged' ? '🏹 Ranged' :
                       '🏰 Siege'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sort Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort:</Text>
                {['name', 'power', 'type'].map(sort => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.filterButton,
                      sortBy === sort && styles.activeFilter
                    ]}
                    onPress={() => setSortBy(sort as any)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      sortBy === sort && styles.activeFilterText
                    ]}>
                      {sort === 'name' ? 'Name' : 
                       sort === 'power' ? 'Power' : 'Type'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Cards Grid */}
          <ScrollView style={styles.cardsScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.cardsGrid}>
              {filteredCards.map((card) => {
                const currentCount = isCardInDeck(card.id);
                const maxCopies = getCardMaxCopies(card);
                
                return (
                  <View key={card.id} style={styles.cardContainer}>
                    <CardComponent 
                      card={card} 
                      onPress={() => openCardModal(card)}
                      isInDeck={currentCount > 0}
                    />
                    <View style={styles.cardControls}>
                      <TouchableOpacity
                        style={[
                          styles.controlButton,
                          styles.removeButton,
                          currentCount === 0 && styles.disabledControl
                        ]}
                        onPress={() => removeCardFromDeck(card.id)}
                        disabled={currentCount === 0}
                      >
                        <Text style={styles.controlButtonText}>−</Text>
                      </TouchableOpacity>
                      
                      <View style={styles.cardCountContainer}>
                        <Text style={styles.cardCount}>
                          {currentCount}
                        </Text>
                        <Text style={styles.cardCountMax}>
                          /{maxCopies}
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        style={[
                          styles.controlButton,
                          styles.addButton,
                          !canAddCard(card) && styles.disabledControl
                        ]}
                        onPress={() => addCardToDeck(card)}
                        disabled={!canAddCard(card)}
                      >
                        <Text style={styles.controlButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            selectedDeck.length < minDeckSize && styles.disabledButton
          ]} 
          onPress={startGame}
          disabled={selectedDeck.length < minDeckSize}
        >
          <Text style={styles.buttonText}>
            {selectedDeck.length >= minDeckSize ? 
              'Start Game' : 
              `Need ${minDeckSize - selectedDeck.length} more cards`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => dispatch(setGamePhase(GamePhase.MENU))}
        >
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Card Detail Modal */}
      <CardDetailModal
        visible={modalVisible}
        card={selectedCard}
        currentCount={selectedCard ? isCardInDeck(selectedCard.id) : 0}
        maxCount={selectedCard ? getCardMaxCopies(selectedCard) : 0}
        onClose={closeCardModal}
        onAddToDeck={handleAddToDeck}
        onRemoveFromDeck={handleRemoveFromDeck}
        canAdd={selectedCard ? canAddCard(selectedCard) : false}
        canRemove={selectedCard ? canRemoveCard(selectedCard) : false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d4af37',
    textAlign: 'center',
    marginBottom: 8,
  },
  deckSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 8,
  },
  deckSummaryItem: {
    alignItems: 'center',
  },
  deckSummaryNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  deckSummaryLabel: {
    fontSize: 10,
    color: '#cccccc',
    marginTop: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#d4af37',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  mainPanel: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#444444',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  filtersContainer: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 11,
    color: '#cccccc',
    marginRight: 6,
    minWidth: 45,
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#555555',
  },
  activeFilter: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  filterButtonText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 15,
  },
  cardContainer: {
    width: '32%', // 3 cards per row
    alignItems: 'center',
    marginBottom: 12,
  },
  cardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  addButton: {
    backgroundColor: '#4a8a4a',
    borderColor: '#6ab46a',
  },
  removeButton: {
    backgroundColor: '#8a4a4a',
    borderColor: '#b46a6a',
  },
  disabledControl: {
    backgroundColor: '#444444',
    borderColor: '#666666',
    opacity: 0.3,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  cardCountContainer: {
    alignItems: 'center',
    minWidth: 32,
  },
  cardCount: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardCountMax: {
    color: '#cccccc',
    fontSize: 10,
  },
  bottomContainer: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#d4af37',
    backgroundColor: '#2a2a2a',
  },
  button: {
    backgroundColor: '#8b4513',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  disabledButton: {
    backgroundColor: '#444444',
    borderColor: '#666666',
    opacity: 0.6,
  },
  backButton: {
    backgroundColor: '#654321',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GwentAI } from '../ai/gwentAI';
import { Card as CardComponent } from '../components/Card';
import { GameBoard } from '../components/GameBoard';
import { GameCardSelectionModal } from '../components/GameCardSelectionModal';
import { GameHUD } from '../components/GameUI';
import { getNilfgaardDeck } from '../data/cards';
import {
    drawInitialHands,
    passRound,
    playCard,
    selectCard,
    setGamePhase,
    setOpponentDeck,
    setPlayerDeck
} from '../store/gameSlice';
import { Card, CardRow, CardType, GamePhase } from '../types';
import { calculateRowPower, shuffleDeck } from '../utils/cardUtils';
import { useAppDispatch, useAppSelector } from '../utils/hooks';

export const GameScreen = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  const { board, currentPlayer, phase, currentRound, player, opponent } = gameState;
  
  const [cardDetailModalVisible, setCardDetailModalVisible] = useState(false);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<Card | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<CardRow | 'special' | null>(null);
  const [gameCardModalVisible, setGameCardModalVisible] = useState<boolean>(false);
  const [selectedCardInModal, setSelectedCardInModal] = useState<Card | null>(null);
  
  const [ai, setAI] = useState<GwentAI | null>(null);
  const [isProcessingAITurn, setIsProcessingAITurn] = useState(false);

  // Initialize game when component mounts
  useEffect(() => {
    initializeGame();
  }, []);

  // Initialize AI when AI level changes
  useEffect(() => {
    setAI(new GwentAI(gameState.aiLevel));
  }, [gameState.aiLevel]);

  // Handle AI turns
  useEffect(() => {
    if (gameState.currentPlayer === 'opponent' && 
        gameState.phase === GamePhase.PLAYER_TURN && 
        ai && 
        !isProcessingAITurn) {
      handleAITurn();
    }
  }, [gameState.currentPlayer, ai, gameState.phase, isProcessingAITurn]);

  const initializeGame = () => {
    // Create decks for both players
    const playerDeck = shuffleDeck(getNilfgaardDeck());
    const opponentDeck = shuffleDeck(getNilfgaardDeck());
    
    dispatch(setPlayerDeck(playerDeck));
    dispatch(setOpponentDeck(opponentDeck));
    dispatch(drawInitialHands());
    dispatch(setGamePhase(GamePhase.PLAYER_TURN));
  };

  const handleAITurn = async () => {
    if (!ai || isProcessingAITurn) return;
    
    setIsProcessingAITurn(true);
    
    // Add delay to make AI thinking visible
    setTimeout(() => {
      const decision = ai.makeDecision(gameState);
      
      if (decision.action === 'play_card' && decision.card) {
        dispatch(playCard({
          card: decision.card,
          row: decision.targetRow,
          player: 'opponent'
        }));
      } else if (decision.action === 'pass') {
        dispatch(passRound('opponent'));
      }
      
      setIsProcessingAITurn(false);
    }, 1500); // 1.5 second delay for AI "thinking"
  };

  const handleCardSelect = (card: Card) => {
    if (gameState.currentPlayer !== 'player') return;
    dispatch(selectCard(card));
  };

  const handlePlayCard = (card: Card) => {
    if (gameState.currentPlayer !== 'player' || !card.row) return;
    
    dispatch(playCard({
      card,
      row: card.row,
      player: 'player'
    }));
    
    dispatch(selectCard(undefined));
  };

  const handlePassRound = () => {
    if (gameState.currentPlayer !== 'player') return;
    dispatch(passRound('player'));
  };

  // New handlers for modal system
  const handleCategoryButtonPress = (category: CardRow | 'special') => {
    setSelectedCategory(category);
    setGameCardModalVisible(true);
    setSelectedCardInModal(null);
  };

  const handleCardSelectInGameModal = (card: Card) => {
    setSelectedCardInModal(card);
  };

  const handleConfirmCardPlay = () => {
    if (selectedCardInModal && gameState.currentPlayer === 'player') {
      dispatch(playCard({
        card: selectedCardInModal,
        row: selectedCardInModal.row || CardRow.CLOSE_COMBAT,
        player: 'player'
      }));
      
      // Close modal and reset state
      setGameCardModalVisible(false);
      setSelectedCardInModal(null);
    }
  };

  const handleCancelCardSelection = () => {
    setGameCardModalVisible(false);
    setSelectedCardInModal(null);
  };

  // Old handlers (keep for backward compatibility)
  const handleCardPressInModal = (card: Card) => {
    setSelectedCardForDetail(card);
    setCardDetailModalVisible(true);
  };

  const handlePlayCardFromModal = (card: Card) => {
    if (gameState.currentPlayer !== 'player') return;
    
    dispatch(playCard({
      card,
      row: card.row || CardRow.CLOSE_COMBAT,
      player: 'player'
    }));
    
    // Close modals
    setCardDetailModalVisible(false);
    setGameCardModalVisible(false);
    setSelectedCardForDetail(null);
  };

  const getFilteredCards = () => {
    if (selectedCategory === 'special') {
      return gameState.player.hand.filter(card => 
        card.type === CardType.SPELL || !card.row
      );
    } else {
      return gameState.player.hand.filter(card => card.row === selectedCategory);
    }
  };

  const calculateTotalPower = (rows: { [key in CardRow]: Card[] }, weather: any): number => {
    return Object.entries(rows).reduce((total, [row, cards]) => {
      const weatherAffected = weather[row as CardRow] !== 'clear';
      return total + calculateRowPower(cards, weatherAffected);
    }, 0);
  };

  const playerTotalPower = calculateTotalPower(gameState.board.playerRows, gameState.board.weather);
  const opponentTotalPower = calculateTotalPower(gameState.board.opponentRows, gameState.board.weather);

  // Handle game over
  useEffect(() => {
    if (gameState.isGameOver) {
      const winner = gameState.winner === 'player' ? 'You' : 'AI';
      Alert.alert(
        'Game Over!',
        `${winner} won the match!`,
        [
          {
            text: 'New Game',
            onPress: () => {
              dispatch(setGamePhase(GamePhase.MENU));
            }
          }
        ]
      );
    }
  }, [gameState.isGameOver]);

  if (gameState.phase === GamePhase.MENU || gameState.phase === GamePhase.DECK_BUILDING) {
    return null; // Handle in main index
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* GameHUD stays the same */}
      <GameHUD
        currentRound={gameState.currentRound}
        roundWins={gameState.roundWins}
        playerPower={playerTotalPower}
        opponentPower={opponentTotalPower}
        currentPlayer={gameState.currentPlayer}
        isPlayerTurn={gameState.currentPlayer === 'player'}
      />
      
      {/* GameBoard - scrollable */}
      <GameBoard
        playerRows={gameState.board.playerRows}
        opponentRows={gameState.board.opponentRows}
        weather={gameState.board.weather}
        onCardPress={handlePlayCard}
      />
      
      {/* Bottom Action Buttons */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryButtonPress(CardRow.CLOSE_COMBAT)}
          disabled={gameState.currentPlayer !== 'player'}
        >
          <Text style={styles.categoryButtonIcon}>⚔️</Text>
          <Text style={styles.categoryButtonText}>Close Combat</Text>
          <Text style={styles.categoryButtonCount}>
            {gameState.player.hand.filter(c => c.row === CardRow.CLOSE_COMBAT).length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryButtonPress(CardRow.RANGED)}
          disabled={gameState.currentPlayer !== 'player'}
        >
          <Text style={styles.categoryButtonIcon}>🏹</Text>
          <Text style={styles.categoryButtonText}>Ranged</Text>
          <Text style={styles.categoryButtonCount}>
            {gameState.player.hand.filter(c => c.row === CardRow.RANGED).length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryButtonPress(CardRow.SIEGE)}
          disabled={gameState.currentPlayer !== 'player'}
        >
          <Text style={styles.categoryButtonIcon}>🏰</Text>
          <Text style={styles.categoryButtonText}>Siege</Text>
          <Text style={styles.categoryButtonCount}>
            {gameState.player.hand.filter(c => c.row === CardRow.SIEGE).length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryButtonPress('special')}
          disabled={gameState.currentPlayer !== 'player'}
        >
          <Text style={styles.categoryButtonIcon}>✨</Text>
          <Text style={styles.categoryButtonText}>Special</Text>
          <Text style={styles.categoryButtonCount}>
            {gameState.player.hand.filter(c => c.type === CardType.SPELL || !c.row).length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pass Round Button */}
      <View style={styles.passButtonContainer}>
        <TouchableOpacity
          style={[
            styles.passButton,
            gameState.currentPlayer !== 'player' && styles.passButtonDisabled
          ]}
          onPress={handlePassRound}
          disabled={gameState.currentPlayer !== 'player' || gameState.player.hasPassedRound}
        >
          <Text style={styles.passButtonText}>
            {gameState.player.hasPassedRound ? 'Passed' : 'Pass Round'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Game Card Selection Modal */}
      <GameCardSelectionModal
        visible={gameCardModalVisible}
        selectedCategory={selectedCategory}
        availableCards={getFilteredCards()}
        selectedCard={selectedCardInModal}
        onCardSelect={handleCardSelectInGameModal}
        onConfirm={handleConfirmCardPlay}
        onCancel={handleCancelCardSelection}
      />

      {/* Card Detail Modal */}
      <Modal
        visible={cardDetailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setCardDetailModalVisible(false);
          setSelectedCardForDetail(null);
        }}
      >
        {selectedCardForDetail && (
          <View style={styles.modalOverlay}>
            <View style={styles.cardDetailModal}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setCardDetailModalVisible(false);
                  setSelectedCardForDetail(null);
                }}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.cardDetailTitle}>{selectedCardForDetail.name}</Text>
              
              <View style={styles.cardDetailContent}>
                <CardComponent card={selectedCardForDetail} />
                
                <View style={styles.cardDetailInfo}>
                  <Text style={styles.cardDetailText}>
                    Power: {selectedCardForDetail.power}
                  </Text>
                  <Text style={styles.cardDetailText}>
                    Type: {selectedCardForDetail.type}
                  </Text>
                  <Text style={styles.cardDetailText}>
                    Row: {selectedCardForDetail.row?.replace('_', ' ') || 'Special'}
                  </Text>
                  {selectedCardForDetail.ability && (
                    <Text style={styles.cardDetailText}>
                      Ability: {selectedCardForDetail.ability.replace('_', ' ')}
                    </Text>
                  )}
                  <Text style={styles.cardDetailDescription}>
                    {selectedCardForDetail.description}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDetailActions}>
                <TouchableOpacity
                  style={[
                    styles.playCardButton,
                    gameState.currentPlayer !== 'player' && styles.playCardButtonDisabled
                  ]}
                  onPress={() => handlePlayCardFromModal(selectedCardForDetail)}
                  disabled={gameState.currentPlayer !== 'player'}
                >
                  <Text style={styles.playCardButtonText}>Play Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
      
      {/* AI Thinking Indicator */}
      {isProcessingAITurn && (
        <View style={styles.aiThinking}>
          <Text style={styles.aiThinkingText}>AI is thinking...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  bottomActionBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  categoryButtonIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryButtonCount: {
    color: '#d4af37',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  passButtonContainer: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  passButton: {
    backgroundColor: '#8b4513',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  passButtonDisabled: {
    backgroundColor: '#444',
    borderColor: '#666',
    opacity: 0.6,
  },
  passButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSelectionModal: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d4af37',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8b4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCardsContainer: {
    flex: 1,
  },
  modalCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  modalCardContainer: {
    marginBottom: 12,
  },
  noCardsText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
  cardDetailModal: {
    width: '85%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d4af37',
    padding: 20,
    maxHeight: '80%',
  },
  cardDetailTitle: {
    color: '#d4af37',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  cardDetailContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardDetailInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardDetailText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  cardDetailDescription: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  cardDetailActions: {
    alignItems: 'center',
  },
  playCardButton: {
    backgroundColor: '#4a8a4a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6ab46a',
  },
  playCardButtonDisabled: {
    backgroundColor: '#444',
    borderColor: '#666',
    opacity: 0.5,
  },
  playCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiThinking: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  aiThinkingText: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

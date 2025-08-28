import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GwentAI } from '../ai/gwentAI';
import { GameBoard } from '../components/GameBoard';
import { GameHUD, PlayerHand } from '../components/GameUI';
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
import { Card, CardRow, GamePhase } from '../types';
import { calculateRowPower, shuffleDeck } from '../utils/cardUtils';
import { useAppDispatch, useAppSelector } from '../utils/hooks';

export const GameScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
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
      <GameHUD
        currentRound={gameState.currentRound}
        roundWins={gameState.roundWins}
        playerPower={playerTotalPower}
        opponentPower={opponentTotalPower}
        currentPlayer={gameState.currentPlayer}
        isPlayerTurn={gameState.currentPlayer === 'player'}
      />
      
      <GameBoard
        playerRows={gameState.board.playerRows}
        opponentRows={gameState.board.opponentRows}
        weather={gameState.board.weather}
        onCardPress={handlePlayCard}
      />
      
      <PlayerHand
        cards={gameState.player.hand}
        selectedCard={gameState.selectedCard}
        onCardSelect={handleCardSelect}
        onPassRound={handlePassRound}
        canPass={!gameState.player.hasPassedRound}
        currentPlayer={gameState.currentPlayer}
      />
      
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

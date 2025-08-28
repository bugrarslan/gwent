import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DeckBuildingScreen } from "../src/components/DeckBuildingScreen";
import { GameScreen } from "../src/components/GameScreen";
import { setAILevel, setGamePhase, startNewGame } from "../src/store/gameSlice";
import { AILevel, GamePhase } from "../src/types";
import { useAppDispatch, useAppSelector } from "../src/utils/hooks";

export default function Index() {
  const dispatch = useAppDispatch();
  const { phase, aiLevel, roundWins, isGameOver, winner } = useAppSelector((state) => state.game);

  const handleNewGame = () => {
    dispatch(startNewGame());
    dispatch(setGamePhase(GamePhase.DECK_BUILDING));
  };

  const handleAILevelChange = () => {
    const levels = [AILevel.EASY, AILevel.MEDIUM, AILevel.HARD];
    const currentIndex = levels.indexOf(aiLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    dispatch(setAILevel(levels[nextIndex]));
  };

  const renderMainMenu = () => (
    <View style={styles.container}>
      <Text style={styles.title}>GWENT</Text>
      <Text style={styles.subtitle}>The Witcher Card Game</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewGame}>
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleAILevelChange}>
          <Text style={styles.buttonText}>AI Level: {aiLevel.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>Round Wins - Player: {roundWins.player} | AI: {roundWins.opponent}</Text>
        <Text style={styles.infoText}>Current Phase: {phase.toUpperCase()}</Text>
        {isGameOver && (
          <Text style={styles.winnerText}>
            Winner: {winner?.toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  );

  const renderDeckBuilding = () => (
    <DeckBuildingScreen />
  );

  const renderGameStart = () => (
    <GameScreen />
  );

  switch (phase) {
    case GamePhase.DECK_BUILDING:
      return renderDeckBuilding();
    case GamePhase.GAME_START:
    case GamePhase.PLAYER_TURN:
    case GamePhase.AI_TURN:
    case GamePhase.ROUND_START:
    case GamePhase.ROUND_END:
    case GamePhase.GAME_END:
      return renderGameStart();
    default:
      return renderMainMenu();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: '#8b4513',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  backButton: {
    backgroundColor: '#654321',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 5,
  },
  winnerText: {
    color: '#d4af37',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

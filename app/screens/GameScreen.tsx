import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameSettings } from "../navigation/AppNavigator";

import { GameProvider } from "../context/GameContext";
import RoundIntroScreen from "../screens/RoundIntroScreen";
import PlayerTurnScreen from "../screens/PlayerTurnScreen";
import WordCarouselScreen from "../screens/WordCarouselScreen";
import FinalResultsScreen from "../screens/FinalResultsScreen";

export type GameStackParamList = {
  RoundIntro: undefined;
  PlayerTurn: undefined;
  WordCarousel: undefined;
  FinalResults: undefined;
};

const Stack = createNativeStackNavigator<GameStackParamList>();

type GameScreenProps = {
  initialSettings: GameSettings;
};

export default function GameScreen({ initialSettings }: GameScreenProps) {

  return (
    <GameProvider settings={initialSettings}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoundIntro" component={RoundIntroScreen} />
        <Stack.Screen name="PlayerTurn" component={PlayerTurnScreen} />
        <Stack.Screen name="WordCarousel" component={WordCarouselScreen} />
        <Stack.Screen name="FinalResults" component={FinalResultsScreen} />
      </Stack.Navigator>
    </GameProvider>
  );
}

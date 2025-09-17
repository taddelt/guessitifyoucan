import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SettingsProvider } from "../context/SettingsContext";

import GameScreen from "../screens/GameScreen";
import HomeScreen from "../screens/HomeScreen";
import SetupScreen from "../screens/SetupScreen";
import IntroScreen from "../screens/IntroScreen";
import FixSetupScreen from "../screens/FixSetupScreen";

export type GameSettings = {
  teams: { name: string; players: string[]; color: string }[];
  equalizeTeamSizes: boolean,
  difficulty: number;
  categories: string[];
  joker: number;
  rounds: string[];
  termsAmount: number;
  timeLimit: number;
  wildcards: boolean;
};

export type RootStackParamList = {
  Intro: undefined;
  Home: undefined;
  Setup: undefined;
  Game: GameSettings;
  FixSetup: {mode: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Setup" component={SetupScreen} />
          <Stack.Screen name="FixSetup" component={FixSetupScreen} />
          <Stack.Screen name="Game" >
            {({ route }) => (
                <GameScreen initialSettings={route.params}/>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}

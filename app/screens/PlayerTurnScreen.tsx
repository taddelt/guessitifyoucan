import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import ScreenLayout from "@/components/ScreenLayout";
import styles from "../styles/PlayerTurnStyles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from '@react-navigation/native';
import { GameStackParamList } from "./GameScreen";
import { useGame } from "../context/GameContext";
import { FontAwesome5 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

type Props = NativeStackScreenProps<GameStackParamList, "PlayerTurn">;

export default function PlayerTurnScreen({ navigation }: Props) {
  const { getCurrentTeamAndPlayer } = useGame();
  const { team, playerName } = getCurrentTeamAndPlayer();

  const [wrapWord, setWrapWord] = useState(false);

  const icons = [
    "user-md",
    "user-tie",
    "user-graduate",
    "user-injured",
    "user-astronaut",
    "user-ninja",
    "user-secret",
  ] as const;

  const randomIcon = useMemo(() => {
    const index = Math.floor(Math.random() * icons.length);
    return icons[index];
  }, [playerName]);

  return (
    <ScreenLayout>
      <View style={[styles.container, { }]}>
        <View style={{position: "absolute", width: "100%", top: 75, left: 30}}>
          <TouchableOpacity
            style={[styles.exitButton,{ backgroundColor: team.color}]}
            onPress={() => {
              Alert.alert(
                "Spiel beenden",
                "Willst du das Spiel wirklich verlassen?",
                [
                  {
                    text: "Nein",
                    style: "cancel"
                  },
                  {
                    text: "Ja",
                    onPress: () => {
                      const parent = navigation.getParent();
                      parent?.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        })
                      );
                    }
                  }
                ]
              );
            }}
          >
            <FontAwesome5
              name={"times"}
              size={16}
              color={"white"}
              style={{}}
            />
          </TouchableOpacity>
        </View>
        <Text 
          style={[
            styles.subtitle,
            {
              fontSize: wrapWord ? 26 : 34,
              maxWidth: "70%",
              color: team.color,
            },
          ]}
          numberOfLines={wrapWord ? 2 : 1}
          adjustsFontSizeToFit={!wrapWord}
          minimumFontScale={40 / 100}
          onTextLayout={(e) => {
            if (!wrapWord && e.nativeEvent.lines.length > 1) {
              setWrapWord(true);
            }
          }}
        >
          {team.name}
        </Text>
        
        <View style={[styles.nameBox, {backgroundColor: team.color}]}>
          <View style={styles.textBox}>
            <Text
              style={[
                styles.title,
                {
                  fontSize: wrapWord ? 40 : 100,
                  maxWidth: "76%",
                  color: "white",
                  opacity: 1,
                },
              ]}
              numberOfLines={wrapWord ? 2 : 1}
              adjustsFontSizeToFit={!wrapWord}
              minimumFontScale={40 / 100}
              onTextLayout={(e) => {
                if (!wrapWord && e.nativeEvent.lines.length > 1) {
                  setWrapWord(true);
                }
              }}
            >
              {playerName}
            </Text>
          </View>
          <FontAwesome5
            name={randomIcon}
            size={280}
            color={"white"}
            style={{ position: "absolute", bottom: 30, opacity: 1 }}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.startButton, { opacity: 1 }]}
          onPress={() => navigation.navigate("WordCarousel")}
        >
          <Text style={[styles.startButtonText, { color: team.color }]}>
            Start
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

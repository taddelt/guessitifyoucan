import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGame } from "../context/GameContext";
import { GameStackParamList } from "./GameScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "../styles/FinalResultsStyles";

type Props = NativeStackScreenProps<GameStackParamList, "FinalResults">;

export default function FinalResultsScreen({ navigation }: Props) {
  const { settings, results, resetGame } = useGame();
  const [wrapWord, setWrapWord] = useState(false);

  const standings = useMemo(() => {
    // calculate teampoints
    const teamScores = settings.teams.map((team, idx) => {
      const correctCount = (results[idx] ?? []).filter(
        (r) => r.result === "correct"
      ).length;

      let finalScore: number;

      // equalizeTeamSizes
      if (settings.equalizeTeamSizes) {
        const teamSize = team.players.length;
        const maxSize = Math.max(...settings.teams.map((t) => t.players.length));

        const avgPerPlayer = correctCount / teamSize;
        finalScore = Math.round(avgPerPlayer * maxSize);
      } else {
        finalScore = Math.round(correctCount);
      }

      return {
        id: idx,
        name: team.name,
        color: team.color,
        players: team.players.length,
        rawScore: correctCount,
        score: finalScore,
      };
    });

    // sort
    const sorted = [...teamScores].sort((a, b) => b.score - a.score);

    // draw
    let lastScore: number | null = null;
    let lastRank = 0;

    return sorted.map((team, idx) => {
      if (lastScore === team.score) {
        return { ...team, rank: lastRank };
      } else {
        const rank = idx + 1;
        lastRank = rank;
        lastScore = team.score;
        return { ...team, rank };
      }
    });
  }, [settings, results]);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Spaß hat's gemacht!</Text>
      <Text style={styles.title}>ENDERGEBNIS</Text>

      {standings.map((team) => (
        <View
          key={team.id}
          style={[styles.stepRow, { backgroundColor: team.color, opacity: team.rank === 1 ? 1 : 0.5 }]}
        >
          <Text
            style={[
              styles.stepText,
              {
                fontSize: wrapWord ? 20 : 30,
                maxWidth: "58%",
                color: "white",
                alignSelf: "flex-start",
                left: 12,
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

          <Text 
            style={[
              styles.pointsText,
              {
                fontSize: wrapWord ? 20 : 38,
                maxWidth: "14%",
                color: "white",
                alignSelf: "flex-end",
                top: team.score > 100 ? 24 : 14,
                right: team.score < 10 ? 30 : 18,
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
            {team.score * 1}
          </Text>

          <FontAwesome5
            name={team.rank === 1 ? "trophy" : "award"}
            size={team.rank === 1 ? 46 : 56}
            color={team.rank === 1 ? "gold" : "white"}
            style={{ position: "absolute", alignSelf: "center", right: team.rank === 1 ? 80 : 84 }}
          />

          <Text
            style={{
              fontSize: 18,
              position: "absolute",
              top: team.rank === 1 ? 21 : 19,
              color: "white",
              fontFamily: "Avenir Next Condensed",
              fontWeight: "800",
              right: team.rank === 1 ? 101 : 99,
            }}
          >
            {team.rank}
          </Text>
        </View>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          key="again"
          style={[styles.button]}
          onPress={() => {
            resetGame();
            navigation.navigate("RoundIntro");
          }}
        >
          <FontAwesome5
            name={"step-backward"}
            size={24}
            color={"#999"}
            style={{marginRight: 10}}
          />
          <Text style={styles.buttonText}>Nochmal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key="skip"
          style={[styles.button]}
          onPress={() => {
            navigation.getParent()?.navigate("Home");
          }}
        >
          <Text style={styles.buttonText}>Weiter</Text>
          <FontAwesome5
            name={"step-forward"}
            size={24}
            color={"#999"}
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

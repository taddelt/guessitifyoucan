import React, {useState} from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from '../styles/RoundIntroStyles';
import { CommonActions } from '@react-navigation/native';
import ScreenLayout from '../../components/ScreenLayout';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGame } from "../context/GameContext";
import { rounds } from "../config/roundConfig";
import { roundColors, ROUND_DETAILS } from "../styles/SetupConstants";
import { GameStackParamList } from "./GameScreen";
import { FontAwesome5 } from '@expo/vector-icons';

type Props = NativeStackScreenProps<GameStackParamList, "RoundIntro">;

const BulletPoint = ({ text }: { text: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
    <View style={{
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#636e72',
      marginTop: 8,
      marginRight: 10
    }} />
    <Text style={[styles.boxText, {flex: 1, flexShrink: 1}]}>{text}</Text>
  </View>
);

const RulesBox = ({ title, iconName, items, color }: { title: string; iconName: string; items: string[]; color: string }) => (
  <View style={[styles.box, { borderColor: color, position: "relative" }]}>
    <View>
      <Text style={styles.boxTitle}>{title}</Text>
      <FontAwesome5 name={iconName} size={32} color={color} style={{ position: "absolute", alignSelf:"flex-end" }} />
    </View>
    {items.map((item, idx) => (
      <BulletPoint key={idx} text={item} />
    ))}
  </View>
);

export default function RoundIntroScreen({ navigation }: Props) {
  const { settings, currentRoundIndex } = useGame();
  const currentRoundId = settings.rounds[currentRoundIndex];
  const round = rounds.find(r => r.id === currentRoundId);

  const [wrapWord, setWrapWord] = useState(false);

  if (!round) {
    return (
      <View style={styles.container}>
        <Text>Unbekannte Runde</Text>
      </View>
    );
  }

  function renderFormattedText(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={i} style={{ fontWeight: "bold" }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={i}>{part}</Text>;
    });
  }

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ position: "absolute", width: "100%", top: 75, left: 30 }}>
          <TouchableOpacity
            style={styles.exitButton}
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
              color={"#555"}
              style={{}}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Runde {currentRoundIndex + 1} von {settings.rounds.length}
        </Text>
        <Text
          style={[
          styles.title,
          {
            fontSize: wrapWord ? 46 : 100,
            maxWidth: "74%",
          },
          ]}
          numberOfLines={wrapWord ? 2 : 1}
          adjustsFontSizeToFit={!wrapWord}
          minimumFontScale={46 / 100}
          onTextLayout={(e) => {
            if (!wrapWord && e.nativeEvent.lines.length > 1) {
              setWrapWord(true);
            }
          }}
        >
          {round.title}
        </Text>

        <View style={[styles.box, { borderColor: roundColors[round.color - 1]}]}>
          <View>
            <Text style={styles.boxTitle}>Regeln</Text>
            <FontAwesome5 name={"book"} size={30} color={roundColors[round.color - 1]} style={{ position: "absolute", alignSelf:"flex-end", marginRight: 4, marginTop: 2 }} />
          </View>
          <Text style={[styles.boxText, {textAlign: 'justify'}]}>{renderFormattedText(round.rules)}</Text>
        </View>

        <RulesBox
          title="Erlaubt"
          iconName="thumbs-up"
          items={round.allowed}
          color={roundColors[round.color - 1]}
        />

        <RulesBox
          title="Nicht erlaubt"
          iconName="ban"
          items={round.forbidden}
          color={roundColors[round.color - 1]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: roundColors[round.color - 1] }]}
          onPress={() => navigation.navigate("PlayerTurn")}
        >
          <Text style={styles.buttonText}>Weiter</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

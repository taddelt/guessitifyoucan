import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { CommonActions } from '@react-navigation/native';
import Svg, { Circle } from "react-native-svg";
import styles from "../styles/WordCarouselStyles";
import ScreenLayout from "@/components/ScreenLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGame } from "../context/GameContext";
import { GameStackParamList } from "./GameScreen";

type Props = NativeStackScreenProps<GameStackParamList, "WordCarousel">;

const { width } = Dimensions.get("window");
const iWidth = Math.round(width * 0.78);
const hMargin = (width - iWidth) / 2;
const iSize = iWidth + hMargin * 2;

const boxHeight = 320;
const vMargin = 8;
const carHeight = boxHeight + vMargin * 2;

const butSize = 138;
const ringWidth = 10;
const wSize = butSize + ringWidth * 2;
const radius = butSize / 2 + ringWidth / 2;
const circumfence = 2 * Math.PI * radius;

export default function WordCarouselScreen({ navigation }: Props) {
  const {
    settings,
    roundWords,
    currentRoundIndex,
    currentTeamOrder,
    currentTeamIndex,
    playerQueues,
    queuePositions,
    nextPlayerTurn,
    setWordResult,
    replaceWord,
  } = useGame();

  const teamId = currentTeamOrder[currentTeamIndex];
  const team = settings.teams[teamId];
  const playerIndex = playerQueues[teamId][queuePositions[teamId]];
  const player = team.players[playerIndex];
  const playerKey = `${team.name}-${player}`;
  const [jokerAmount, setJokerAmount] = useState(settings.joker);

  const [words, setWords] = useState<{ category: string; word: string; color: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [wrapPlayer, setWrapPlayer] = useState(false);
  const [wrapWord, setWrapWord] = useState(false);

  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const [wordResults, setWordResults] = useState<Record<number, "correct" | "wrong" | null>>({});

  const flatListRef = useRef<FlatList<{ category: string; word: string; color: string }> | null>(
    null
  );

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const playerWords = roundWords[playerKey] ?? [];
    setWords(playerWords);
    setWordResults(Object.fromEntries(playerWords.map((_, i) => [i, null])));
    setCurrentIndex(0);
  }, [playerKey]);

  useEffect(() => {
    const playerWords = roundWords[playerKey] ?? [];
    setWords(playerWords);
  }, [roundWords, playerKey]);


  useEffect(() => {
    if (isTimerFinished) {
      goTo(0);
    }
  }, [isTimerFinished]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / iSize);
    setCurrentIndex(index);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / iSize);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const getItemLayout = (_: unknown, index: number) => ({
    length: iSize,
    offset: iSize * index,
    index,
  });

  const goTo = (index: number) => {
    if (!flatListRef.current) return;
    const clamped = Math.max(0, Math.min(index, words.length - 1));
    flatListRef.current.scrollToIndex({ index: clamped, animated: true });
    setCurrentIndex(clamped);
  };

  const [elapsed, setElapsed] = useState(0);
  const [visualElapsed, setVisualElapsed] = useState(0);
  const holdMultiplier = 30;

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const visualRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);

  useEffect(() => {
    setIsTimerFinished(false);
    lastTimeRef.current = null;
    elapsedRef.current = 0;
    visualRef.current = 0;
    setElapsed(0);
    setVisualElapsed(0);

    function tick(now: number) {
      if (isTimerFinished || finished) return;
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      elapsedRef.current = Math.min(settings.timeLimit, elapsedRef.current + dt);

      if (isHoldingRef.current) {
        visualRef.current = Math.min(settings.timeLimit, visualRef.current + dt * holdMultiplier);
      } else {
        visualRef.current = elapsedRef.current;
      }

      setElapsed(elapsedRef.current);
      setVisualElapsed(visualRef.current);

      if (visualRef.current >= settings.timeLimit && !finished) {
        setFinished(true);
        setIsTimerFinished(true);
        setVisualElapsed(settings.timeLimit);
        setElapsed(settings.timeLimit);
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        return;
      }

      if (elapsedRef.current >= settings.timeLimit && !finished) {
        setFinished(true);
        setIsTimerFinished(true);
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [settings.timeLimit]);

  const progress = finished ? 1 : Math.max(0, Math.min(1, visualElapsed / Math.max(0.00001, settings.timeLimit)));
  const visibleLength = finished ? circumfence : Math.max(0.5, circumfence * progress);
  const dashArray = `${visibleLength} ${circumfence}`;

  const allSelected = Object.values(wordResults).every((v) => v !== null);

  const handleResult = (index: number, result: "correct" | "wrong") => {
    setWordResults((prev) => {
      const updated = { ...prev, [index]: result };

      if (!Object.values(updated).every((v) => v !== null)) {
        let nextIndex = -1;
        for (let i = index + 1; i < words.length; i++) {
          if (updated[i] === null) {
            nextIndex = i;
            break;
          }
        }
        if (nextIndex === -1) {
          for (let i = 0; i < words.length; i++) {
            if (updated[i] === null) {
              nextIndex = i;
              break;
            }
          }
        }
        if (nextIndex !== -1) {
          goTo(nextIndex);
        }
      }
      return updated;
    });
  };


  const handleContinue = () => {
    if (!isTimerFinished) return;
    if (!allSelected) {
      Alert.alert("Da fehlt noch was!", "Markiere bitte alle Begriffe, bevor es weitergeht!");
      return;
    }

    words.forEach((w, i) => {
      const result = wordResults[i];
      if (result) {
        setWordResult(teamId, w.word, result);
      }
    });

    const { roundEnded, gameEnded } = nextPlayerTurn();

    if (gameEnded) {
      navigation.navigate("FinalResults");
    } else if (roundEnded) {
      navigation.navigate("RoundIntro");
    } else {
      navigation.navigate("PlayerTurn");
    }
  };

  return (
    <ScreenLayout>
      <View style={[styles.container, { backgroundColor: team.color }]}>
        <View style={{position: "absolute", width: "100%", top: 75, left: 30}}>
          <Text style={styles.subtitle}>{team.name}</Text>
          <TouchableOpacity
            style={[styles.exitButton, { }]}
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
              color={team.color}
              style={{}}
            />
          </TouchableOpacity>
          
        </View>

        <View style={{height: 140, marginBottom: 0, backgroundColor: "", marginTop: 60, alignItems: "center", justifyContent: "center"}}>
        <Text
          style={[
            styles.title,
            { fontSize: wrapPlayer ? 60 : 100, backgroundColor: ""},
          ]}
          numberOfLines={wrapPlayer ? 2 : 1}
          adjustsFontSizeToFit={!wrapPlayer}
          minimumFontScale={60 / 90}
          onTextLayout={(e) => {
            if (!wrapPlayer && e.nativeEvent.lines.length > 1) {
              setWrapPlayer(true);
            }
          }}
        >
          {player}
        </Text>
        </View>

        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={words}
            keyExtractor={(item, index) => `${item.word}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToAlignment="start"
            snapToInterval={iSize}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={onMomentumEnd}
            onScroll={onScroll}
            scrollEventThrottle={16}
            style={{ height: carHeight }}
            renderItem={({ item, index }) => {
              const result = wordResults[index];
              const isInactive = isTimerFinished && result === null;
              const isCorrect = result === "correct";
              const isWrong = result === "wrong";

              return (
                <View
                  style={[
                    styles.box,
                    {
                      width: iWidth,
                      height: boxHeight,
                      marginHorizontal: hMargin,
                      justifyContent: "center",
                      opacity: isInactive ? 0.8 : 1,
                      alignItems: "center",
                    },
                  ]}
                >
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: isCorrect
                        ? "#2ECC71"
                        : isWrong
                        ? "#FF7675"
                        : "white",
                      borderRadius: 8,
                    }}
                  />
                  <Text style={[styles.boxTitle, { opacity: isInactive ? 0.9 : 1, color: isCorrect || isWrong ? "white" : team.color}]}>
                    {item.category.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.boxText,
                      {
                        fontSize: wrapWord ? 40 : 68,
                        lineHeight: wrapWord ? 44 : undefined,
                        maxWidth: "94%",
                        opacity: isInactive ? 0.9 : 1,
                        color: isCorrect || isWrong ? "white" : team.color
                      },
                    ]}
                    numberOfLines={wrapWord ? 2 : 1}
                    adjustsFontSizeToFit={!wrapWord}
                    minimumFontScale={40 / 68}
                    onTextLayout={(e) => {
                      if (!wrapWord && e.nativeEvent.lines.length > 1) {
                        setWrapWord(true);
                      }
                    }}
                  >
                    {item.word}
                  </Text>

                  <TouchableOpacity
                    style={styles.redMarkButton}
                    onPress={() => handleResult(index, "wrong")}
                  >
                    <FontAwesome5 name="times" size={54} color={isWrong ? "white" : "#FF7675"} />
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.boxTextBelow,
                      { opacity: isInactive ? 0.9 : 1, color: isCorrect || isWrong ? "white" : team.color },
                    ]}
                  >
                    {words.length > 0 ? `${index + 1}/${words.length}` : "0/0"}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.greenMarkButton}
                    onPress={() => handleResult(index, "correct")}
                  >
                    <FontAwesome5 name="check" size={48} color={isCorrect ? "white" : "#2ECC71"} />
                  </TouchableOpacity>
                  
                </View>
              );
            }}
          />

          {currentIndex > 0 && (
            <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={() => goTo(currentIndex - 1)}>
              <FontAwesome5 name="chevron-left" size={42} color="#fff" />
            </TouchableOpacity>
          )}
          {currentIndex < Math.max(0, words.length - 1) && (
            <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={() => goTo(currentIndex + 1)}>
              <FontAwesome5 name="chevron-right" size={42} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <View
            style={{
              width: wSize,
              height: wSize,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              opacity: !isTimerFinished ? 1 : allSelected ? 1 : 0.4,
            }}
          >
            <View style={StyleSheet.absoluteFillObject}>
              {!isTimerFinished && (
                <Svg
                  width={wSize}
                  height={wSize}
                  style={{ transform: [{ rotate: "-90deg" }] }}
                >
                  <Circle
                    cx={wSize / 2}
                    cy={wSize / 2}
                    r={radius}
                    stroke={"#fff"}
                    strokeWidth={ringWidth}
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    strokeDashoffset={0}
                    fill="none"
                  />
                </Svg>
              )}
            </View>

            {!isTimerFinished ? (
              <Pressable
                key="holdButton"
                style={[styles.startButton, { backgroundColor: "#fff", opacity: 0.8 }]}
                onPressIn={() => {
                  isHoldingRef.current = true;
                }}
                onPressOut={() => {
                  isHoldingRef.current = false;
                  visualRef.current = elapsedRef.current;
                  setVisualElapsed(visualRef.current);
                }}
                hitSlop={20}
              >
                <FontAwesome5
                  name="forward"
                  size={50}
                  color={team.color}
                  style={{ marginBottom: 3 }}
                />
              </Pressable>
            ) : (
              <TouchableOpacity
                key="continueButton"
                style={[styles.startButton, { backgroundColor: "#fff" }]}
                onPress={handleContinue}
                hitSlop={20}
              >
                <FontAwesome5
                  name="check"
                  size={50}
                  color={team.color}
                  style={{ marginBottom: 3 }}
                />
              </TouchableOpacity>
            )}
          </View>
          {currentRoundIndex === 0 && !isTimerFinished && jokerAmount > 0 && (
            <TouchableOpacity
              key="jokerButton"
              style={styles.jokerButton}
              onPress={ () => {
                const currentWord = words[currentIndex];
                replaceWord(teamId, player, currentWord.word);
                setJokerAmount(jokerAmount - 1);
              }}
            >
              <FontAwesome5
                name="sync-alt"
                size={54}
                color={"white"} />
                <Text style={styles.jokerText}>
                  {jokerAmount}
                </Text>
              
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}
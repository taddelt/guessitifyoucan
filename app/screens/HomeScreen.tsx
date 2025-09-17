import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/ScreenLayout';
import { RootStackParamList } from '../navigation/AppNavigator';
import styles from '../styles/HomeStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get("window");
const ITEM_WIDTH = Math.round(width * 0.78);
const H_MARGIN = 50;
const ITEM_SIZE = ITEM_WIDTH + H_MARGIN * 2;
const BOX_HEIGHT = 320;
const V_MARGIN = 8;
const CAROUSEL_HEIGHT = BOX_HEIGHT + V_MARGIN * 2;

export default function HomeScreen({ navigation }: Props) {
  const words = ["Guess", "it", "if", "you", "can!?"];
  const sizes = [70, 75, 65, 70, 68];
  const rotations = ["-3deg", "4deg", "-10deg", "3deg", "-7deg"];
  const offsets = [-40, 90, -150, -50, 100];
  const topOffsets = [50, 55, 120, 125, 140];

  const gameModes = [
    { id: "diy", title: "DIY", icon: "sliders-h", color: "#a29bfe" },
    { id: "classic", title: "CLASSIC", icon: "comments", color: "#b0a8ff" },
    { id: "party", title: "PARTY", icon: "glass-cheers", color: "#b9b3ff" },
  ];

  // infinite carousell
  const infiniteModes = [...gameModes, ...gameModes, ...gameModes];
  const middleBlock = gameModes.length;

  const [currentFlatIndex, setCurrentFlatIndex] = useState(middleBlock);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: middleBlock,
          animated: false,
        });
      }, 50);

      return () => clearTimeout(timer);
    }, [])
  );

  const handleModeSelect = (id: string) => {
    if (id === "diy") {
      navigation.navigate("Setup");
    }
    if (id === "party") {
      navigation.navigate("FixSetup", {mode: "party"});
    }
    if (id === "classic") {
      navigation.navigate("FixSetup", {mode: "classic"});
    }
  };

  const goTo = (direction: number) => {
    const newFlatIndex = currentFlatIndex + direction;
    flatListRef.current?.scrollToIndex({
      index: newFlatIndex,
      animated: true,
    });
    setCurrentFlatIndex(newFlatIndex);
  };

  const onMomentumEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    let newIndex = Math.round(offsetX / ITEM_SIZE);

    if (newIndex <= 0) {
      newIndex = middleBlock + (newIndex % gameModes.length);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    } else if (newIndex >= infiniteModes.length - 1) {
      newIndex = middleBlock + (newIndex % gameModes.length);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    }

    setCurrentFlatIndex(newIndex);
  };

  const realIndex = currentFlatIndex % gameModes.length;
  const currentGameMode = gameModes[realIndex];

  return (
    <ScreenLayout>
      <View style={styles.container}>
        {/* giiyc title */}
        <View
          style={{
            width: "100%",
            height: "31%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {words.map((word, index) => (
            <Text
              key={index}
              style={{
                position: "absolute",
                top: topOffsets[index],
                fontSize: sizes[index],
                fontWeight: "bold",
                fontFamily: "Avenir Next Condensed",
                color: "white",
                textAlign: "center",
                transform: [
                  { rotate: rotations[index] },
                  { translateX: offsets[index] },
                ],
                width: "100%",
              }}
            >
              {word}
            </Text>
          ))}
        </View>

        {/* carousell */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={infiniteModes}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToAlignment="start"
            snapToInterval={ITEM_SIZE}
            onMomentumScrollEnd={onMomentumEnd}
            style={{ height: CAROUSEL_HEIGHT }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.box,
                  {
                    backgroundColor: item.color,
                    width: ITEM_WIDTH,
                    marginHorizontal: H_MARGIN,
                  },
                ]}
                onPress={() => handleModeSelect(item.id)}
              >
                <TouchableOpacity style={styles.explanationBox}>
                  <FontAwesome5
                    name={"info"}
                    size={20}
                    color={item.color}
                  />
                </TouchableOpacity>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={[styles.boxTitle, { maxWidth: ITEM_WIDTH * 0.78 }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}
                  >
                    {item.title}
                  </Text>

                  <FontAwesome5 /** <Text
                    style={styles.boxExplanationText}
                  >
                    gestaltet eure eigenen Spielregeln
                  </Text> */
                    name={item.icon}
                    size={120}
                    color="#fff"
                    style={{ marginBottom: 10 }}
                  />
                  
                  {item.id === "party" &&
                    <View style={styles.eighteenPlusSign}>
                      <Text style={styles.eighteenPlusText}>
                        18+
                      </Text>
                    </View>
                  }
                </View>
              </TouchableOpacity>
            )}
          />

          {/* arrow left */}
          <TouchableOpacity
            style={[styles.arrow, styles.arrowLeft]}
            onPress={() => goTo(-1)}
          >
            <FontAwesome5 name="chevron-left" size={42} color="#fff" />
          </TouchableOpacity>

          {/* arrow right */}
          <TouchableOpacity
            style={[styles.arrow, styles.arrowRight]}
            onPress={() => goTo(1)}
          >
            <FontAwesome5 name="chevron-right" size={42} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Wählt euren Spielmodus.
        </Text>
      </View>
    </ScreenLayout>
  );
}
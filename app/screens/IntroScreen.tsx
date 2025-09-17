import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Intro">;

export default function IntroScreen({ navigation, route }: Props) {

  const words = ["Guess", "it", "if", "you", "can!?"];
  const animations = words.map(() => useRef(new Animated.Value(0)).current);

  const sizes = [130, 110, 120, 110, 135];
  const rotations = ["-5deg", "-12deg", "5deg", "-2deg", "3deg"];
  const offsets = [0, -50, 55, 0, 0];
  const topOffsets = [190, 320, 330, 440, 552];

  useEffect(() => {
    const sequence = words.map((_, i) =>
      Animated.spring(animations[i], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    );

    const timer = setTimeout(() => {
    const sequence = words.map((_, i) =>
      Animated.spring(animations[i], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(400, sequence).start(() => {
      setTimeout(() => {
        navigation.replace("Home");
      }, 750);
    });
  }, 500);

  return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {words.map((word, index) => (
        <Animated.Text
          key={index}
          style={{
            opacity: animations[index],
            position: "absolute",
            top: topOffsets[index],
            fontSize: sizes[index],
            fontWeight: "bold",
            fontFamily: "Avenir Next Condensed",
            color: "#6c5ce7",
            textAlign: "center",
            transform: [
              {
                scale: animations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              { rotate: rotations[index] },
              { translateX: offsets[index] },
            ],
          }}
        >
          {word}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

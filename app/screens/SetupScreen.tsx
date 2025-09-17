import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScreenLayout from '../../components/ScreenLayout';
import Slider from '@react-native-community/slider';
import { MAX_TEAMS, MAX_PLAYERS_PER_TEAM, MIN_PLAYERS_PER_TEAM, MAX_ROUNDS, teamColors, roundColors, categoryList, ROUND_ORDER, ROUND_DETAILS, RoundName } from '../styles/SetupConstants';
import styles from '../styles/SetupStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSettings } from "../context/SettingsContext";

type Team = {
  name: string;
  players: string[];
  color: string;
};

export default function SetupScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    teams,
    setTeams,
    selectedRounds,
    setSelectedRounds,
    difficulty,
    setDifficulty,
    termsAmount,
    setTermsAmount,
    timeLimit,
    setTimeLimit,
    jokerAmount,
    setJokerAmount,
    categories,
    setCategories,
    equalizeTeams,
    setEqualizeTeams,
    wildcardsSelected,
    setWildcardsSelected,
  } = useSettings();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  type Difficulty = 1 | 2 | 3;

  const calcMin = (terms: number, difficulty: Difficulty) =>
    difficulty === 3 ? terms * 10 : terms * 5;
  const calcMax = (terms: number, difficulty: Difficulty) =>
    difficulty === 3 ? terms * 40 : terms * 25;

  useEffect(() => {
    const min = calcMin(termsAmount, difficulty);
    const max = calcMax(termsAmount, difficulty);

    let clamped = timeLimit;
    if (clamped < min) clamped = min;
    if (clamped > max) clamped = max;

    if (clamped !== timeLimit) {
      setTimeLimit(clamped);
    }
  }, [termsAmount, difficulty]);

  const toggleSection = (section: string) => {
    setExpandedSection(prev =>
      (prev === section ? null : section)
    );
  };

  const hasAtLeastOnePlayer = teams.some(team =>
    team.players.some(name => name.trim() !== '')
  );

  function toggleRoundArray(prev: RoundName[], round: RoundName): RoundName[] {
    if (prev.includes(round)) {
      return prev.filter((r) => r !== round);
    } else {
      const updated = [...prev, round];
      return updated.sort(
        (a, b) => ROUND_ORDER.indexOf(a) - ROUND_ORDER.indexOf(b)
      );
    }
  }

  const toggleRound = (round: RoundName) => {
    setSelectedRounds((prev) => toggleRoundArray(prev, round));
  };

  const drawRandomRounds = () => {
    const usedColors = new Set<number>();
    const selected: RoundName[] = [];

    const shuffled = [...ROUND_ORDER].sort(() => 0.5 - Math.random());

    for (const round of shuffled) {
      const color = ROUND_DETAILS[round].color;
      if (!usedColors.has(color)) {
        usedColors.add(color);
        selected.push(round);
      }
      if (selected.length >= 4) break;
    }

    setSelectedRounds(selected);
  };

  const addTeam = () => {
    if (teams.length < MAX_TEAMS) {
      const newTeam = {
        name: `Team ${teams.length + 1}`,
        players: ['', ''],
        color: teamColors[teams.length],
      };
      setTeams([...teams, newTeam]);
    }
  };

  const removeTeam = (teamIndex: number) => {
    if (teams.length <= 2 || teamIndex !== teams.length - 1) {
      Alert.alert('Hinweis', 'Nur das zuletzt hinzugefügte Team kann gelöscht werden.');
      return;
    }
    const updatedTeams = [...teams];
    updatedTeams.splice(teamIndex, 1);
    setTeams(updatedTeams);
  };

  const resetTeams = () => {
    setTeams([
      { name: "Team 1", color: teamColors[0], players: ["", ""] },
      { name: "Team 2", color: teamColors[1], players: ["", ""] },
    ]);
  };

  const updatePlayerName = (teamIndex: number, playerIndex: number, name: string) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].players[playerIndex] = name;
    setTeams(updatedTeams);
  };

  const updateTeamName = (index: number, newName: string) => {
    const newTeams = [...teams];
    newTeams[index].name = newName;
    setTeams(newTeams);
  };

  const addPlayerField = (teamIndex: number) => {
    const updatedTeams = [...teams];
    if (updatedTeams[teamIndex].players.length < MAX_PLAYERS_PER_TEAM) {
      updatedTeams[teamIndex].players.push('');
      setTeams(updatedTeams);
    }
  };

  const removePlayerField = (teamIndex: number, playerIndex: number) => {
    if (playerIndex < 2) {
      Alert.alert('Hinweis', 'Die ersten zwei Spieler eines Teams dürfen nicht gelöscht werden.');
      return;
    }

    const updatedTeams = [...teams];
    updatedTeams[teamIndex].players.splice(playerIndex, 1);
    setTeams(updatedTeams);
  };

  const hasEnoughPlayers = teams.every(
    (team) => team.players.filter((p) => p.trim() !== '').length >= MIN_PLAYERS_PER_TEAM
  );

  const handleStartGame = () => {
    const allTeamsNamed = teams.every(team => team.name.trim() !== '');
    if (!allTeamsNamed) {
      Alert.alert("Da fehlt noch was!", "Bitte gib allen Teams einen Namen.");
      return;
    }

    const allTeamNames = teams
      .map(team => team.name.trim().toLowerCase())
      .filter(name => name.length > 0);

    const teamNameSet = new Set(allTeamNames);

    if (teamNameSet.size !== allTeamNames.length) {
      Alert.alert(
        'Da ist was schief gelaufen!',
        'Teamnamen dürfen leider nicht doppelt vergeben werden :('
      );
      return;
    }

    const hasEmptyNames = teams.some(team =>
      team.players
        .slice(0, MIN_PLAYERS_PER_TEAM)
        .some(player => player.trim().length === 0)
    );

    if (hasEmptyNames) {
      Alert.alert('Da fehlt noch was!', 'Bitte trage in jedes Team mindestens zwei Spieler ein.');
      return;
    }
    
    const allPlayerNames = teams
      .flatMap(team => team.players)
      .map(name => name.trim().toLowerCase())
      .filter(name => name.length > 0);

    const nameSet = new Set(allPlayerNames);

    if (nameSet.size !== allPlayerNames.length) {
      Alert.alert('Da ist was schief gelaufen!', 'Spielernamen dürfen leider nicht doppelt vergeben werden :(');
      return;
    }

    if (categories.length === 0) {
      Alert.alert('Da fehlt noch was!', 'Bitte wähle mindestens eine Kategorie.');
      return;
    }

    if (selectedRounds.length < 1) {
      Alert.alert('Da fehlt noch was!', 'Bitte wähle mindestens eine Runde.');
      return;
    }

    const cleanedTeams = teams.map(team => ({
      ...team,
      name: team.name.trim(),
      players: team.players.map(p => p.trim()),
    }));

    navigation.navigate('Game', {
      teams: cleanedTeams,
      equalizeTeamSizes: equalizeTeams,
      difficulty,
      categories,
      joker: jokerAmount,
      rounds: selectedRounds,
      termsAmount,
      timeLimit,
      wildcards: wildcardsSelected,
    });
  };

  const toggleCategory = (name: string) => {
    if (categories.includes(name)) {
      setCategories(categories.filter((cat) => cat !== name));
      setAllSelected(false);
    } else {
      setCategories([...categories, name]);
      if (categories.length + 1 === categoryList.length) {
        setAllSelected(true);
      }
    }
  };

  const teamSizes = teams.map((team) => team.players.filter((p) => p.trim() !== '').length);
  const isEqualSize = teamSizes.every((size) => size === teamSizes[0]);

  const toggleEqualize = () => {
    if (!isEqualSize) setEqualizeTeams((prev) => !prev);
  };

  const handleTermsChange = (newTermsAmount: number) => {
    const oldMin = calcMin(termsAmount, difficulty);
    const oldMax = calcMax(termsAmount, difficulty);

    let percent = (timeLimit - oldMin) / (oldMax - oldMin);
    if (isNaN(percent) || !isFinite(percent)) percent = 0.5;

    const newMin = calcMin(newTermsAmount, difficulty);
    const newMax = calcMax(newTermsAmount, difficulty);

    let newTimeLimit = newMin + percent * (newMax - newMin);

    newTimeLimit = Math.round(newTimeLimit / 5) * 5;

    setTimeLimit(newTimeLimit);
    setTermsAmount(newTermsAmount);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    const oldMin = calcMin(termsAmount, difficulty);
    const oldMax = calcMax(termsAmount, difficulty);

    let percent = (timeLimit - oldMin) / (oldMax - oldMin);
    if (isNaN(percent) || !isFinite(percent)) percent = 0.5;

    const newMin = calcMin(termsAmount, newDifficulty);
    const newMax = calcMax(termsAmount, newDifficulty);

    let newTimeLimit = newMin + percent * (newMax - newMin);
    newTimeLimit = Math.round(newTimeLimit / 5) * 5;

    setDifficulty(newDifficulty);
    setTimeLimit(newTimeLimit);
  };

  const shuffleTeams = () => {
    const allPlayers = teams
      .flatMap(team => team.players)
      .filter(name => name.trim() !== '');

    if (allPlayers.length === 0) {
      Alert.alert("Keine Spieler", "Bitte gib zuerst Spielernamen ein.");
      return;
    }

    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);

    const newTeams: Team[] = teams.map(() => ({
      name: '',
      players: [],
      color: '',
    }));

    shuffled.forEach((player, index) => {
      const teamIndex = index % teams.length;
      newTeams[teamIndex].players.push(player);
    });

    const updatedTeams: Team[] = newTeams.map((t, i) => {
      const players = [...t.players];
      while (players.length < MIN_PLAYERS_PER_TEAM) {
        players.push('');
      }

      return {
        name: teams[i].name,
        players,
        color: teams[i].color,
      };
    });

    setTeams(updatedTeams);
  };

  useEffect(() => {
    const min = difficulty === 3 ? termsAmount * 10 : termsAmount * 5;
    const max = difficulty === 3 ? termsAmount * 40 : termsAmount * 25;

    if (timeLimit < min) setTimeLimit(min);
    if (timeLimit > max) setTimeLimit(max);
  }, [difficulty, termsAmount]);

  useEffect(() => {
    if (difficulty < 1) setDifficulty(1);
    if (difficulty > 3) setDifficulty(3);
  }, [difficulty]);


  const words = ["Guess", "it", "if", "you", "can!?"];
  const sizes = [80, 70, 65, 72, 70];
  const rotations = ["-4deg", "4deg", "-10deg", "3deg", "-7deg"];
  const offsets = [-40, 110, -160, -50, 90];
  const topOffsets = [45, 50, 120, 132, 140];

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, {paddingTop: expandedSection === null ? 100 : 50}]}
        showsVerticalScrollIndicator={false}
      >

        <View style={{width: "100%"}}>
          <TouchableOpacity
            style={[styles.backButton, {  }]}
            onPress={() => {
              navigation.replace("Home");
            }}
          >
            <FontAwesome5
              name={"arrow-left"}
              size={20}
              color={"#6c5ce7"}
              style={{}}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.backButton, { right: 0 }]}
          >
            <FontAwesome5
              name={"info"}
              size={20}
              color={"#6c5ce7"}
              style={{}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          {words.map((word, i) => (
              <View
                key={i}
                style={[styles.wordWrapper, {
                  transform: [{ rotate: rotations[i] }, { translateX: offsets[i] }],
                  top: topOffsets[i],
                }]}
              >
                <Text style={[styles.title, {fontSize: sizes[i]}]}>{word}</Text>
          </View>
          ))}
        </View>

        <View style={styles.accordionContainer}>
          {/* teams section */}
          <TouchableOpacity onPress={() => toggleSection('teams')} style={[styles.accordionHeader, { backgroundColor: hasEnoughPlayers ? "white" : "#e7e8fb"}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.sectionTitle, {color: hasEnoughPlayers ? "#636e72" : "#6c5ce7"}]}>Teams</Text>
              <Icon
                name={expandedSection === 'teams' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#636e72"
              />
            </View>
          </TouchableOpacity>

         <View style={[ styles.accordionContent, { height: expandedSection === 'teams' ? undefined : 0, overflow: 'hidden', padding: expandedSection === 'teams' ? 10 : 0 }]}>
            <View style={styles.teamContainer}>
              {teams.map((team, index) => (
                <View key={index} style={[styles.teamBox, { backgroundColor: team.color}]}>

                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => setEditingTeamIndex(index)}
                    >
                      <Icon name="edit" size={20} color="#fff" />
                    </TouchableOpacity>

                    {editingTeamIndex === index ? (
                      <TextInput
                        value={team.name}
                        onChangeText={(text) => updateTeamName(index, text)}
                        style={styles.teamInput}
                        onBlur={() => {if (team.name.trim() === '') {
                          updateTeamName(index, `Team ${index + 1}`);
                        } setEditingTeamIndex(null)
                      }}
                        autoFocus
                        maxLength={16}
                      />
                    ) : (
                      <Text
                        style={styles.teamTitle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {team.name}
                      </Text>
                    )}

                    {teams.length > 2 && index === teams.length - 1 && editingTeamIndex !== index && (
                      <TouchableOpacity
                        onPress={() => removeTeam(index)}
                        style={{
                          position: 'absolute',
                          right: 13,
                          top: 6,
                          zIndex: 10
                        }}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25}}>×</Text>
                      </TouchableOpacity>
                    )}

                  {team.players.map((player, pIndex) => (
                    <View key={pIndex} style={{ position: 'relative'}}>
                    <TextInput
                      value={player}
                      onChangeText={(text) => updatePlayerName(index, pIndex, text)}
                      placeholder={player ? '' : 'Name'}
                      placeholderTextColor={'#A9A9A9'}
                      style={[
                        styles.playerInput,
                        { paddingRight: 30 }
                      ]}
                      maxLength={12}
                    />
                    {pIndex >= 2 && (
                      <TouchableOpacity
                        onPress={() => removePlayerField(index, pIndex)}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: [{ translateY: -16 }],
                        }}
                      >
                        <Text style={{ fontSize: 18, color: '#A9A9A9' }}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  ))}
                  {team.players.length < MAX_PLAYERS_PER_TEAM && (
                    <TouchableOpacity onPress={() => addPlayerField(index)}>
                      <Text style={styles.addPlayerText}>+ Spieler hinzufügen</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {teams.length < MAX_TEAMS && (
              <TouchableOpacity onPress={addTeam}>
                <Text style={styles.addTeamText}>+ Team hinzufügen</Text>
              </TouchableOpacity>
            )}

            {!isEqualSize && (
              <View style={styles.checkboxRow}>
                <Switch value={equalizeTeams} onValueChange={toggleEqualize} />
                <Text style={styles.checkboxLabel}>Teamgrößenunterschied ausgleichen</Text>
              </View>
            )}

            <TouchableOpacity onPress={shuffleTeams}
              style={[styles.roundRandomizer, {opacity: hasAtLeastOnePlayer ? 1 : 0.6, marginTop: 10}]}
              disabled={!hasAtLeastOnePlayer}
            >
              <Icon name="sync" size={16} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.roundRandomizerText}>Teams mischen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetTeams}
              style={[styles.teamResetButton, {opacity: !hasAtLeastOnePlayer && teams.length <= 2 ? 0.6 : 1,}]}
            >
              <FontAwesome5 name="trash" size={22} color="white" />
            </TouchableOpacity>

          </View>

          {/* terms section */}
          <TouchableOpacity onPress={() => toggleSection('terms')} style={[styles.accordionHeader, { backgroundColor: categories.length > 0 ? "white" : "#e7e8fb"}] }>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.sectionTitle, {color: categories.length > 0 ? "#636e72" : "#6c5ce7"}]}>Begriffe</Text>
              <Icon
                name={expandedSection === 'terms' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#636e72"
              />
            </View>
          </TouchableOpacity>

          <View style={[ styles.accordionContent, { height: expandedSection === 'terms' ? undefined : 0, overflow: 'hidden', padding: expandedSection === 'terms' ? 10 : 0 }]}>
              <View style={styles.difficultySliderContainer}>
                <Text style={styles.difficultyHeader}>Schwierigkeit</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={3}
                  step={1}
                  minimumTrackTintColor="#6c5ce7"
                  maximumTrackTintColor="#dfe6e9"
                  thumbTintColor="#6c5ce7"
                  value={difficulty}
                  onValueChange={(val) => handleDifficultyChange(val as Difficulty)}
                />
                <View style={styles.difficultyLabelsRow}>
                  <Text style={styles.difficultyLabelSmall}>Leicht</Text>
                  <Text style={styles.difficultyLabelSmall}>Normal</Text>
                  <Text style={styles.difficultyLabelSmall}>Schwer</Text>
                </View>
              </View>

              <View style={styles.difficultySliderContainer}>
                <Text style={styles.difficultyHeader}>Joker: {jokerAmount}</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={termsAmount}
                  step={1}
                  minimumTrackTintColor="#6c5ce7"
                  maximumTrackTintColor="#dfe6e9"
                  thumbTintColor="#6c5ce7"
                  value={jokerAmount}
                  onValueChange={(val) => setJokerAmount(val)}
                />
                <View style={styles.difficultyLabelsRow}>
                  <Text style={styles.difficultyLabelSmall}>0</Text>
                  <Text style={styles.difficultyLabelSmall}>{termsAmount}</Text>
                </View>
              </View>

              <Text style={styles.categoriesHeader}>Kategorien</Text>
              <View style={styles.categoriesWrapper}>
                {categoryList.map((category, index) => {
                  const selected = categories.includes(category.id);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.categoryBox,
                        {
                          backgroundColor: category.color,
                          opacity: selected ? 1 : 0.65,
                          borderWidth: selected ? 2 : 0,
                          borderColor: selected ? '#2d3436' : 'transparent',
                        },
                      ]}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                      <Icon
                        name={category.icon}
                        size={40}
                        color="white"
                        style={{ marginTop: 6 }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.checkboxRow}>
                <Switch
                  value={allSelected}
                  onValueChange={(val) => {
                    setAllSelected(val);
                    setCategories(val ? categoryList.map((c) => c.id) : []);
                  }}
                />
                <Text style={styles.checkboxLabel}>Alle Kategorien auswählen</Text>
              </View>

          </View>

          {/* rounds section */}
          <TouchableOpacity onPress={() => toggleSection('rounds')} style={[styles.accordionHeader, { backgroundColor: selectedRounds.length > 0 ? "white" : "#e7e8fb" }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.sectionTitle, {color: selectedRounds.length > 0 ? "#636e72" : "#6c5ce7"}]}>Runden</Text>
              <Icon
                name={expandedSection === 'rounds' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#636e72"
              />
            </View>
          </TouchableOpacity>
          
          <View style={[ styles.accordionContent, { height: expandedSection === 'rounds' ? undefined : 0, overflow: 'hidden', padding: expandedSection === 'rounds' ? 10 : 0 }]}>
            <Text style={styles.roundsLabel}>
              Empfohlen: 4 Runden, untersch. Farben
            </Text>

            <View style={[styles.roundsContainer, {paddingHorizontal: 10 }]}>
              {ROUND_ORDER.filter((round) => selectedRounds.includes(round)).map((round) => {
                const detail = ROUND_DETAILS[round];
                const isSelected = selectedRounds.includes(round);
                return (
                  <TouchableOpacity
                    key={round}
                    onPress={() => toggleRound(round)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: roundColors[detail.color - 1],
                      padding: 12,
                      borderRadius: 10,
                      marginVertical: 4,
                    }}
                  >
                    <Text style={styles.roundLabelSmall}>{round}</Text>
                    <Icon
                      name={detail.icon}
                      size={21}
                      color="#fff"
                      style={{ position: 'absolute', right: 22 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={[styles.roundsContainer, {paddingHorizontal: 10 }]}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedRounds.length >= MAX_ROUNDS) {
                    Alert.alert("Limit erreicht", `Es können maximal ${MAX_ROUNDS} Runden ausgewählt werden.`);
                  } else {
                    setDropdownVisible(!dropdownVisible);
                  }
                }}
                style={{
                  alignItems: 'center',
                  backgroundColor: "#6c5ce7",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 4,
                  opacity: selectedRounds.length >= MAX_ROUNDS ? 0.5 : 1,
                }}
              >
                <Text style={[styles.roundLabelSmall, { color: "white", paddingLeft: 0, paddingRight: 6, fontSize: 19 }]}>+ Runde hinzufügen</Text>
              </TouchableOpacity>
              
              {dropdownVisible && (
                <View
                  style={{
                    maxHeight: 260,
                    marginTop: 0,
                    borderRadius: 10,
                    borderWidth: 4,
                    borderColor: "white",
                    backgroundColor: "white",
                    overflow: "hidden",
                  }}
                >
                  <ScrollView>
                    {ROUND_ORDER.filter((round) => !selectedRounds.includes(round)).map((round) => {
                      const detail = ROUND_DETAILS[round];
                      return (
                        <TouchableOpacity
                          key={round}
                          onPress={() => {
                            if (selectedRounds.length >= MAX_ROUNDS) {
                              Alert.alert("Limit erreicht", `Es können maximal ${MAX_ROUNDS} Runden ausgewählt werden.`);
                              setDropdownVisible(false);
                              return;
                            }
                            toggleRound(round);
                            setDropdownVisible(false);
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: roundColors[detail.color - 1],
                            padding: 12,
                            borderRadius: 10,
                            marginVertical: 4,
                            marginHorizontal: 4,
                            opacity: 0.7,
                          }}
                        >
                          <Text style={styles.roundLabelSmall}>{round}</Text>
                          <Icon
                            name={detail.icon}
                            size={21}
                            color="#fff"
                            style={{ position: 'absolute', right: 22 }}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={drawRandomRounds} style={[styles.roundRandomizer, { marginTop: 8}]}>
              <Icon name="sync" size={16} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.roundRandomizerText}>Runden auslosen</Text>
            </TouchableOpacity>

          </View>
          
          {/* more section */}
          <TouchableOpacity onPress={() => toggleSection('more')} style={[ styles.accordionHeader, {borderBottomWidth: expandedSection === 'more' ? 2 : 0} ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Mehr</Text>
              <Icon
                name={expandedSection === 'more' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#636e72"
              />
            </View>
          </TouchableOpacity>

          <View style={[ styles.accordionContent, { height: expandedSection === 'more' ? undefined : 0, overflow: 'hidden', padding: expandedSection === 'more' ? 10 : 0 }]}>
            <View style={styles.difficultySliderContainer}>
              <Text style={styles.difficultyHeader}>Begriffe pro Spieler</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={5}
                step={1}
                minimumTrackTintColor="#6c5ce7"
                maximumTrackTintColor="#dfe6e9"
                thumbTintColor="#6c5ce7"
                value={termsAmount}
                onValueChange={(val) => handleTermsChange(val)}
              />
              <View style={styles.difficultyLabelsRow}>
                <Text style={styles.difficultyLabelSmall}>1</Text>
                <Text style={styles.difficultyLabelSmall}>2</Text>
                <Text style={styles.difficultyLabelSmall}>3</Text>
                <Text style={styles.difficultyLabelSmall}>4</Text>
                <Text style={styles.difficultyLabelSmall}>5</Text>
              </View>
            </View>
            <View style={styles.timeSliderContainer}>
              <Text style={styles.difficultyHeader}>Zeit pro Spieler</Text>
              <Slider
                key={`${difficulty}-${termsAmount}`}
                style={{ width: '100%', height: 40 }}
                minimumValue={difficulty === 3 ? termsAmount * 10: termsAmount * 5}
                maximumValue={difficulty === 3 ? termsAmount * 40 : termsAmount * 25}
                step={5}
                minimumTrackTintColor="#6c5ce7"
                maximumTrackTintColor="#dfe6e9"
                thumbTintColor="#6c5ce7"
                value={timeLimit}
                onValueChange={(val) => setTimeLimit(val)}
              />
              <Text style={styles.timeLimitLabel}>
                {timeLimit} Sekunden
              </Text>
            </View>
            <View style={[styles.checkboxRow, { marginTop: 10 }]}>
              <Switch
                value={wildcardsSelected}
                onValueChange={(val) => {
                  setWildcardsSelected(val);
                }}
              />
              <Text style={[styles.checkboxLabel,  {fontSize: 17, fontWeight: 'bold'}]}>Wild Cards</Text>
            </View>
          </View>

        </View>
        
        <Text style={styles.explanationText} >Wählt eure Regeln und startet das Spiel.</Text>

        
        
      </ScrollView>

      <TouchableOpacity
          style={styles.startButton}
          //disabled={!hasEnoughPlayers || categories.length === 0}
          onPress={handleStartGame}
      >
        <Text style={styles.startButtonText}>Spiel starten</Text>
      </TouchableOpacity>

    </ScreenLayout>
  );
}
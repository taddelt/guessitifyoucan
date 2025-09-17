import React, { useState, useEffect } from 'react';
import { MAX_PLAYERS_PER_TEAM, MAX_TEAMS, MIN_PLAYERS_PER_TEAM, teamColors } from '../styles/SetupConstants';
import { TextInput, TouchableOpacity, View, Text, Alert, Switch, ScrollView } from 'react-native';
import ScreenLayout from '@/components/ScreenLayout';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/FixSetupStyles';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from "../context/SettingsContext";

type Team = {
  name: string;
  players: string[];
  color: string;
};

type FixSetupScreenProps = NativeStackScreenProps<RootStackParamList, 'FixSetup'>;

export default function SetupScreen({ route }: FixSetupScreenProps) {

    const { mode } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const {
        teams,
        setTeams,
    } = useSettings();

    const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);

    const hasAtLeastOnePlayer = teams.some(team =>
        team.players.some(name => name.trim() !== '')
    );

    const teamSizes = teams.map((team) => team.players.filter((p) => p.trim() !== '').length);
    const isEqualSize = teamSizes.every((size) => size === teamSizes[0]);

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

        if(mode === "party") {
            navigation.navigate('Game', {
                teams,
                equalizeTeamSizes: true,
                difficulty: 2,
                categories: ["18+", "Party"],
                joker: 0,
                rounds: ["Lalaland", "Tanzalarm"],
                termsAmount: 3,
                timeLimit: 60,
                wildcards: true,
            });
        }

        if(mode === "classic") {
            navigation.navigate('Game', {
                teams,
                equalizeTeamSizes: true,
                difficulty: 2,
                categories: ["Allgemein"],
                joker: 1,
                rounds: ["Erklärbär", "Pantomime", "Knackwort", "Lautmaler"],
                termsAmount: 3,
                timeLimit: 45,
                wildcards: true,
            });
        }
    };

    const words = ["Guess", "it", "if", "you", "can!?"];
    const sizes = [80, 70, 65, 72, 70];
    const rotations = ["-4deg", "4deg", "-10deg", "3deg", "-7deg"];
    const offsets = [-40, 110, -160, -50, 90];
    const topOffsets = [45, 50, 120, 132, 140];

  return(
    <ScreenLayout>
        <ScrollView
                contentContainerStyle={[styles.scrollContainer, {paddingTop: teams.length <= 2 ? 80 : 50}]}
                showsVerticalScrollIndicator={false}
        >
            <View style={{width: "100%", justifyContent: "flex-start"}}>
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

            <View style={styles.settingsContainer}>
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

            <View style={{width: "92%"}}>
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
            </View>
            
            <Text style={styles.explanationText} >Tragt eure Teams ein und startet das Spiel.</Text>
        </ScrollView>

        <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}
        >
            <Text style={styles.startButtonText}>Spiel starten</Text>
        </TouchableOpacity>
    </ScreenLayout>
  )
}
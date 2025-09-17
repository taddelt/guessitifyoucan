import React, { createContext, useContext, useState } from "react";
import { ROUND_ORDER, ROUND_DETAILS, teamColors } from "../styles/SetupConstants";
import type { RoundName } from "../styles/SetupConstants";

type Team = {
  name: string;
  players: string[];
  color: string;
};

type Difficulty = 1 | 2 | 3;

type SettingsContextType = {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  selectedRounds: RoundName[];
  setSelectedRounds: React.Dispatch<React.SetStateAction<RoundName[]>>;
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  termsAmount: number;
  setTermsAmount: React.Dispatch<React.SetStateAction<number>>;
  timeLimit: number;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  jokerAmount: number;
  setJokerAmount: React.Dispatch<React.SetStateAction<number>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  equalizeTeams: boolean;
  setEqualizeTeams: React.Dispatch<React.SetStateAction<boolean>>;
  wildcardsSelected: boolean;
  setWildcardsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([
    { name: "Team 1", players: ["", ""], color: teamColors[0] },
    { name: "Team 2", players: ["", ""], color: teamColors[1] },
  ]);

  const [selectedRounds, setSelectedRounds] = useState<RoundName[]>(
    ROUND_ORDER.filter((r) => ROUND_DETAILS[r].preselected)
  );

  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [termsAmount, setTermsAmount] = useState(3);
  const [timeLimit, setTimeLimit] = useState(3 * 15);
  const [jokerAmount, setJokerAmount] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [equalizeTeams, setEqualizeTeams] = useState(false);
  const [wildcardsSelected, setWildcardsSelected] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};

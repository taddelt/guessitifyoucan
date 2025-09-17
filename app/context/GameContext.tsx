import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { wordPool as baseWordPool } from "../config/wordPool";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

type PlayerWord = {
  word: string;
  category: string;
  color: string;
};

type WordResult = {
  word: string;
  result: "correct" | "wrong" | null;
};

type Team = {
  name: string;
  players: string[];
  color: string;
};

type GameSettings = {
  teams: Team[];
  equalizeTeamSizes: boolean;
  difficulty: number;
  categories: string[];
  joker: number;
  rounds: string[];
  termsAmount: number;
  timeLimit: number;
  wildcards: boolean;
};

type GameContextType = {
  settings: GameSettings;
  roundWords: Record<string, PlayerWord[]>;
  currentRoundIndex: number;
  currentTeamIndex: number;
  currentTeamOrder: number[];
  playerQueues: number[][];
  queuePositions: number[];
  nextPlayerTurn: () => { roundEnded: boolean; gameEnded: boolean };
  resetGame: () => void;
  results: Record<number, WordResult[]>;
  setWordResult: (
    teamId: number,
    word: string,
    result: "correct" | "wrong"
  ) => void;
  clearResults: () => void;
  getCurrentTeamAndPlayer: () => {
    teamId: number;
    team: Team;
    playerIndex: number;
    playerName: string;
  };
  replaceWord: (teamId: number, player: string, oldWord: string) => void;
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

type GameProviderProps = {
  settings: GameSettings;
  children: ReactNode;
};

export function GameProvider({ settings, children }: GameProviderProps) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  function generateWordPool(settings: GameSettings): PlayerWord[] {
    const totalPlayers = settings.teams.reduce(
      (sum, t) => sum + t.players.length,
      0
    );
    const totalWords = totalPlayers * settings.termsAmount;

    const difficultyKey =
      settings.difficulty === 1
        ? "easy"
        : settings.difficulty === 2
        ? "medium"
        : "hard";

    const wordPools: Record<
      string,
      { easy: PlayerWord[]; medium: PlayerWord[]; hard: PlayerWord[] }
    > = {};
    for (const cat of settings.categories) {
      const category = baseWordPool[cat];
      if (!category) continue;
      wordPools[cat] = {
        easy: category.easy.map((w) => ({ word: w, category: cat, color: category.color })),
        medium: category.medium.map((w) => ({ word: w, category: cat, color: category.color })),
        hard: category.hard.map((w) => ({ word: w, category: cat, color: category.color })),
      };
    }

    function pickFromPool(pool: PlayerWord[], n: number, used: Set<string>) {
      const candidates = pool.filter((p) => !used.has(p.word));
      const shuffled = shuffle(candidates);
      return shuffled.slice(0, n);
    }

    const usedWords = new Set<string>();
    const finalWords: PlayerWord[] = [];

    let primaryPool: PlayerWord[] = [];
    for (const cat of settings.categories) {
      const pool = wordPools[cat];
      if (!pool) continue;
      primaryPool.push(...pool[difficultyKey]);
    }

    finalWords.push(...pickFromPool(primaryPool, totalWords, usedWords));
    finalWords.forEach((w) => usedWords.add(w.word));

    if (finalWords.length < totalWords) {
      let fallbackPool: PlayerWord[] = [];
      for (const cat of settings.categories) {
        const pool = wordPools[cat];
        if (!pool) continue;
        const keys: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"];
        for (const k of keys) {
          if (k !== difficultyKey) fallbackPool.push(...pool[k]);
        }
      }
      const remaining = totalWords - finalWords.length;
      finalWords.push(...pickFromPool(fallbackPool, remaining, usedWords));
      finalWords.forEach((w) => usedWords.add(w.word));
    }

    if (finalWords.length < totalWords) {
      const remaining = totalWords - finalWords.length;
      const repeated: PlayerWord[] = [];
      const sourcePool: PlayerWord[] = [];
      for (const cat of settings.categories) {
        const pool = wordPools[cat];
        if (!pool) continue;
        sourcePool.push(...pool.easy, ...pool.medium, ...pool.hard);
      }
      let idx = 0;
      while (repeated.length < remaining) {
        repeated.push(sourcePool[idx % sourcePool.length]);
        idx++;
      }
      finalWords.push(...repeated);
    }

    return shuffle(finalWords);
  }

  const [globalWordPool, setGlobalWordPool] = useState<PlayerWord[]>(() =>
    generateWordPool(settings)
  );

  const [roundWords, setRoundWords] = useState<Record<string, PlayerWord[]>>(
    {}
  );
  const [currentTeamOrder, setCurrentTeamOrder] = useState<number[]>([]);
  const [playerQueues, setPlayerQueues] = useState<number[][]>([]);
  const [queuePositions, setQueuePositions] = useState<number[]>([]);
  const [turnsPlayedInRound, setTurnsPlayedInRound] = useState(0);
  const [results, setResults] = useState<Record<number, WordResult[]>>({});

  const totalPlayers = settings.teams.reduce(
    (s, t) => s + t.players.length,
    0
  );

  function prepareRound(roundIndex: number) {
    const teamOrder = shuffle(settings.teams.map((_, i) => i));
    setCurrentTeamOrder(teamOrder);

    const queues = settings.teams.map((team) =>
      shuffle(team.players.map((_, idx) => idx))
    );
    setPlayerQueues(queues);
    setQueuePositions(settings.teams.map(() => 0));
    setTurnsPlayedInRound(0);

    const wordsCopy = shuffle([...globalWordPool]);
    const distribution: Record<string, PlayerWord[]> = {};

    const allAssignments: { teamId: number; playerIndex: number }[] = [];
    const remainingPerTeam = queues.map((q) => q.length);
    let teamCursor = 0;

    while (allAssignments.length < totalPlayers) {
      const teamId = teamOrder[teamCursor];
      if (remainingPerTeam[teamId] > 0) {
        const used = queues[teamId].length - remainingPerTeam[teamId];
        const pIdx = queues[teamId][used];
        allAssignments.push({ teamId, playerIndex: pIdx });
        remainingPerTeam[teamId] -= 1;
      }
      teamCursor = (teamCursor + 1) % teamOrder.length;
    }

    for (const { teamId, playerIndex } of allAssignments) {
      const team = settings.teams[teamId];
      const playerName = team.players[playerIndex];
      const key = `${team.name}-${playerName}`;
      distribution[key] = wordsCopy.splice(0, settings.termsAmount);
    }

    setRoundWords(distribution);
    setCurrentTeamIndex(0);
  }

  useEffect(() => {
    prepareRound(0);
  }, []);

  const setWordResult = (
    teamId: number,
    word: string,
    result: "correct" | "wrong"
  ) => {
    setResults((prev) => {
      const teamResults = prev[teamId] ?? [];
      const idx = teamResults.findIndex((r) => r.word === word);
      let updated;
      if (idx >= 0) {
        updated = [...teamResults];
        updated[idx] = { ...updated[idx], result };
      } else {
        updated = [...teamResults, { word, result }];
      }
      return { ...prev, [teamId]: updated };
    });
  };

  const replaceWord = (
    teamId: number,
    player: string,
    oldWord: string
  ) => {
    const team = settings.teams[teamId];
    const key = `${team.name}-${player}`;

    const oldEntry = roundWords[key]?.find(w => w.word === oldWord);
    if (!oldEntry) return;

    const difficultyKey =
      settings.difficulty === 1 ? "easy" :
      settings.difficulty === 2 ? "medium" : "hard";

    const categoryPool = baseWordPool[oldEntry.category][difficultyKey];
    const alreadyUsedWords = new Set(globalWordPool.map(w => w.word));

    const candidates = categoryPool.filter(w => !alreadyUsedWords.has(w));
    if (candidates.length === 0) {
      console.warn("Keine neuen Wörter mehr verfügbar in dieser Kategorie!");
      return;
    }

    const newWord = candidates[Math.floor(Math.random() * candidates.length)];
    const newEntry = {
      word: newWord,
      category: oldEntry.category,
      color: oldEntry.color,
    };

    setRoundWords(prev => {
      const playerWords = prev[key] ?? [];
      const updated = playerWords.map(w =>
        w.word === oldWord ? newEntry : w
      );
      return { ...prev, [key]: updated };
    });

    setGlobalWordPool(prev => {
      const updated = prev.map(w =>
        w.word === oldWord ? newEntry : w
      );
      return updated;
    });
  };

  const clearResults = () => setResults({});

  const nextPlayerTurn = (): { roundEnded: boolean; gameEnded: boolean } => {
    const teamId = currentTeamOrder[currentTeamIndex];
    setQueuePositions((prev) => {
      const copy = [...prev];
      copy[teamId] = copy[teamId] + 1;
      return copy;
    });

    const newTurns = turnsPlayedInRound + 1;
    setTurnsPlayedInRound(newTurns);

    const roundComplete = newTurns >= totalPlayers;
    if (roundComplete) {
      const isLastRound = currentRoundIndex >= settings.rounds.length - 1;
      if (isLastRound) {
        return { roundEnded: true, gameEnded: true };
      } else {
        const nextIndex = currentRoundIndex + 1;
        setCurrentRoundIndex(nextIndex);
        prepareRound(nextIndex);
        return { roundEnded: true, gameEnded: false };
      }
    }

    let cursor = currentTeamIndex;
    for (let step = 0; step < currentTeamOrder.length; step++) {
      cursor = (cursor + 1) % currentTeamOrder.length;
      const tId = currentTeamOrder[cursor];
      const hasLeft = queuePositions[tId] + (tId === teamId ? 1 : 0) < (playerQueues[tId]?.length ?? 0);
      if (hasLeft) {
        setCurrentTeamIndex(cursor);
        break;
      }
    }

    return { roundEnded: false, gameEnded: false };
  };

  const resetGame = () => {
    setCurrentRoundIndex(0);
    prepareRound(0);
    setCurrentTeamIndex(0);
    setResults({});
  };

  const getCurrentTeamAndPlayer = () => {
    const teamId = currentTeamOrder[currentTeamIndex];
    const team = settings.teams[teamId];
    const pIdx = playerQueues[teamId][queuePositions[teamId]];
    return { teamId, team, playerIndex: pIdx, playerName: team.players[pIdx] };
  };

  return (
    <GameContext.Provider
      value={{
        settings,
        roundWords,
        currentRoundIndex,
        currentTeamIndex,
        currentTeamOrder,
        playerQueues,
        queuePositions,
        nextPlayerTurn,
        resetGame,
        results,
        setWordResult,
        clearResults,
        getCurrentTeamAndPlayer,
        replaceWord,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

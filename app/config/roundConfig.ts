export type RoundConfig = {
  id: string;
  title: string;
  rules: string;
  allowed: string[];
  forbidden: string[];
  color: number;
};

export const rounds: RoundConfig[] = [
  {
    id: "Erklärbär",
    title: "Erklärbär",
    rules: "Begriffe beschreiben – reden erlaubt.",
    allowed: ["Synonyme nutzen", "Geräusche machen"],
    forbidden: ["Pantomime", "Teile des Wortes nennen"],
    color: 1,
  },
  {
    id: "Pantomime",
    title: "Pantomime",
    rules: "Begriffe stumm darstellen.",
    allowed: ["Gestik", "Mimik"],
    forbidden: ["Reden", "Auf Dinge deuten"],
    color: 2,
  },
  {
    id: "Strichcode",
    title: "Strichcode",
    rules: "Begriffe malen.",
    allowed: ["Farben nutzen", "Auf Zeichnung zeigen"],
    forbidden: ["Schrift", "Reden oder Pantomime"],
    color: 2,
  },
  {
    id: "Lalaland",
    title: "Lalaland",
    rules: "Alles wird gesungen.",
    allowed: ["Singen", "Rappen"],
    forbidden: ["Pantomime", "Wortteile nennen"],
    color: 2,
  },
  {
    id: "Fragwürdig",
    title: "Fragwürdig",
    rules: "Nur Ja/Nein-Fragen beantworten.",
    allowed: ["Ja", "Nein", "Jain"],
    forbidden: ["Andere Antworten", "Gesten"],
    color: 3,
  },
  {
    id: "Visagist",
    title: "Visagist",
    rules: "Nur Gesichtsausdrücke.",
    allowed: ["Mimik"],
    forbidden: ["Reden", "Hilfsmittel"],
    color: 3,
  },
  {
    id: "Reimstein",
    title: "Reimstein",
    rules: "Alles muss sich reimen.",
    allowed: ["Unreine Reime", "Gedichte"],
    forbidden: ["Pantomime", "Sprache wechseln"],
    color: 3,
  },
  {
    id: "Bauchredner",
    title: "Bauchredner",
    rules: "Sprechen ohne Lippen zu bewegen.",
    allowed: ["Synonyme nutzen", "Geräusche machen"],
    forbidden: ["Lippen bewegen", "Gesten"],
    color: 3,
  },
  {
    id: "Schätzchen",
    title: "Schätzchen",
    rules: "Antworten nur mit Zahlen.",
    allowed: ["Maßeinheiten", "Nachkommastellen"],
    forbidden: ["Ja/Nein", "Gesten"],
    color: 3,
  },
  {
    id: "Knackwort",
    title: "Knackwort",
    rules: "Begriffe mit nur 1 Wort beschreiben.",
    allowed: ["Namen nutzen"],
    forbidden: ["Mehr als 1 Wort", "Gesten"],
    color: 4,
  },
  {
    id: "Tanzalarm",
    title: "Tanzalarm",
    rules: "Alles wird getanzt.",
    allowed: ["Musik anmachen"],
    forbidden: ["Reden", "Pantomime"],
    color: 4,
  },
  {
    id: "Puppenkiste",
    title: "Puppenkiste",
    rules: "Begriffe mit einer Figur darstellen.",
    allowed: ["Mit Figur deuten"],
    forbidden: ["Reden", "Gesten ohne Figur"],
    color: 4,
  },
  {
    id: "Lautmaler",
    title: "Lautmaler",
    rules: "Nur Geräusche machen.",
    allowed: ["Laute", "Onomatopoesie"],
    forbidden: ["Reden", "Pantomime"],
    color: 5,
  },
  {
    id: "Sprachlos",
    title: "Sprachlos",
    rules: "Lippen bewegen ohne Ton.",
    allowed: ["Mundbewegungen"],
    forbidden: ["Laute", "Gesten"],
    color: 5,
  },
  {
    id: "Lippenstift",
    title: "Lippenstift",
    rules: "Malen mit Stift im Mund.",
    allowed: ["Farben nutzen"],
    forbidden: ["Hand benutzen", "Reden"],
    color: 5,
  },
  {
    id: "Lachyoga",
    title: "Lachyoga",
    rules: "Alles mit Lachen erklären.",
    allowed: ["Arten von Lachen"],
    forbidden: ["Reden", "Hilfsmittel"],
    color: 5,
  },
];

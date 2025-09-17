export const MAX_TEAMS = 4;
export const MAX_PLAYERS_PER_TEAM = 8;
export const MIN_PLAYERS_PER_TEAM = 2;
export const MAX_ROUNDS = 6;


export const teamColors = ['#68a4e6', '#3bb39b', '#4d7acc', '#389387'];
export const roundColors = ['#74b9ff', '#55efc4', '#ff7675', '#f9a66c', '#ffd866'];

export const categoryList = [
  { name: 'Allgemein', id: 'Allgemein', color: '#4B9FE3', icon: 'globe' },
  { name: 'Lustig', id: 'Lustig', color: '#FF8C6B', icon: 'laugh-beam' },
  { name: '18+', id: '18+', color: '#E85D9C', icon: 'user-secret' },
  { name: 'Jugend- wörter', id: 'Jugendwörter', color: '#F4B740', icon: 'fire' },
  { name: 'Liebes- leben', id: 'Liebesleben', color: '#FF6FAF', icon: 'heart' },
  { name: 'Lange Wörter', id: 'Lange Wörter', color: '#1DD1A1', icon: 'file-alt' },
  { name: 'Tiere', id: 'Tiere', color: '#A68CFF', icon: 'paw' },
  { name: 'Online', id: 'Online', color: '#2ED6D4', icon: 'wifi' },
  { name: 'Party', id: 'Party', color: '#FF5E78', icon: 'star' },
  { name: 'Typisch Deutsch', id: 'Typisch Deutsch', color: '#F79F79', icon: 'flag' },
  { name: 'Kindheits- kram', id: 'Kindheitskram', color: '#7FE7DC', icon: 'child' },
  { name: 'Boomer- wörter', id: 'Boomerwörter', color: '#FF9CAE', icon: 'user-clock' },
];

export const ROUND_ORDER = [
  'Erklärbär',
  'Pantomime',
  'Strichcode',
  'Lalaland',
  //'Zeichensprache',
  'Fragwürdig',
  'Visagist',
  'Reimstein',
  'Bauchredner',
  'Schätzchen',
  'Knackwort',
  'Tanzalarm',
  //'Emojination',
  'Puppenkiste',
  'Lautmaler',
  'Sprachlos',
  'Lippenstift',
  'Lachyoga',
] as const;

export type RoundName = typeof ROUND_ORDER[number];

export const ROUND_DETAILS: Record<RoundName, {
  category: string;
  color: number;
  icon: string;
  preselected?: boolean;
}> =  {
  'Erklärbär': { category: 'A', color: 1, icon: 'comment', preselected: true },
  'Pantomime': { category: 'B', color: 2, icon: 'theater-masks', preselected: true },
  'Strichcode': { category: 'B', color: 2, icon: 'paint-brush' },
  'Lalaland': {category: 'B', color: 2, icon: 'comment'},
  //'Zeichensprache': { category: 'C', color: 3, icon: 'paint-brush' },
  'Fragwürdig': { category: 'C', color: 3, icon: 'comment'},
  'Visagist': { category: 'C', color: 3, icon: 'theater-masks' },
  'Reimstein': { category: 'C', color: 3, icon: 'comment' },
  'Bauchredner': { category: 'C', color: 3, icon: 'comment' },
  'Schätzchen': { category: 'C', color: 3,  icon: 'comment' },
  'Knackwort': { category: 'D', color: 4, icon: 'comment', preselected: true },
  'Tanzalarm': { category: 'D', color: 4, icon: 'theater-masks' },
  //'Emojination': { category: 'D', color: 4, icon: 'paint-brush' },
  'Puppenkiste': { category: 'D', color: 4, icon: 'theater-masks' },
  'Lautmaler': { category: 'E', color: 5, icon: 'comment', preselected: true },
  'Sprachlos': { category: 'E', color: 5, icon: 'theater-masks' },
  'Lippenstift': { category: 'E', color: 5, icon: 'paint-brush' },
  'Lachyoga': { category: 'E', color: 5, icon: 'theater-masks' },
};
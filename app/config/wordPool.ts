export type WordCategory = {
  easy: string[];
  medium: string[];
  hard: string[];
  color: string;
};

export const wordPool: Record<string, WordCategory> = {
  Allgemein: {
    easy: ["Apfel", "Ampel", "Auto", "Badeanzug", "Ball"],
    medium: ["Abfahrtstafel", "AGB", "Akku", "Angebot", "App"],
    hard: ["Abgrenzung", "Aktenzeichen", "Altersarmut", "Altersvorsorge", "Analyse"],
    color: "#4B7BEC",
  },
  Lustig: {
    easy: ["Affentanz", "Badekappe", "Backpfeife", "Bauchtanz", "Bauchklatscher"],
    medium: ["Arschfax", "Achselfasching", "Bauchmassage", "Bildschirmbräune", "Bollerwagen"],
    hard: ["Bauchredner", "Bratwurstkette", "Brotschnipselkrieg", "Butterbrotjongleur", "Dosenbierbauch"],
    color: "#FF7675",
  },
  '18+': {
    easy: ["Anmachspruch", "BH", "Brüste", "Busen", "Busenfreundin"],
    medium: ["69", "Anal", "Analsex", "Aubergine", "Bastard"],
    hard: ["Analplug", "Bodycount", "Botox", "Candle-Light-Sex", "Dirty Secret"],
    color: "#F78FB3",
  },
  'Jugendwörter': {
    easy: ["Aura", "Bro", "Broke", "Cap", "Chillig"],
    medium: ["AufLock", "Alta", "Babo", "Bae", "Besti"],
    hard: ["Akkurat", "Atze", "Brakka", "Bratina", "Bodenlos"],
    color: "#FDCB6E",
  },
  'Liebesleben': {
    easy: ["Abtreibung", "Bett", "Blumen", "Blumenladen", "Braut"],
    medium: ["Adoption", "Altersunterschied", "Autokino", "Beziehungsangst", "Beziehung"],
    hard: ["AIDS", "Beziehungsmuster", "Darling", "Doppelleben", "Eltern-Kind-Beziehung"],
    color: "#74B9FF",
  },
  'Lange Wörter': {
    easy: ["Autoscooter", "Badehandtuch", "Bilderbuchseite", "Bilderrahmen", "Buntstifte"],
    medium: ["Adventsbeleuchtung", "Adventskalender", "Ampelschaltung", "Autoreifen", "Badezimmerspiegel"],
    hard: ["Bewegungsmelder", "Bewegungsmelderlampe", "Briefkastenschlüssel", "Briefkastenschlitz", "Dachfensterverriegelung"],
    color: "#00CEC9",
  },
  Tiere: {
    easy: ["Adler", "Affe", "Bär", "Boxer", "Dackel"],
    medium: ["Alpaka", "Ameise", "Amsel", "Blauwal", "Bulldogge"],
    hard: ["Anakonda", "Basilisk", "Bison", "Capybara", "Dornteufel"],
    color: "#A29BFE",
  },
  Online: {
    easy: ["Abo", "ASMR", "Autotune", "Beauty", "Bottle-Flip"],
    medium: ["AI-Filter", "AI-Voice", "Captions", "Clickbait", "Collab"],
    hard: ["Algorithmus", "Altaccount", "Autocut", "Bodyzoom", "Canceln"],
    color: "#55EFC4",
  },
  Party: {
    easy: ["Abendkleid", "Alkohol", "Bar", "Barhocker", "Bass"],
    medium: ["Afterparty", "Absturz", "Absturzvideo", "Alkoholgeruch", "Anmache"],
    hard: ["Absturzselfie", "Absturztaxi", "Alkoholproblem", "Bitchfight", "Clubszene"],
    color: "#FF6B81",
  },
  'Typisch Deutsch': {
    easy: ["Abitur", "Adventskalender", "Apfelernte", "Apfelschorle", "Autobahn"],
    medium: ["1. Weltkrieg", "2. Weltkrieg", "Alpen", "Ballermann", "Beamter"],
    hard: ["7:1", "Ausländerfeindlichkeit", "Baugenehmigung", "Bielefeld", "Brunhilde"],
    color: "#FAB1A0",
  },
  'Kindheitskram': {
    easy: ["Achterbahn", "Autoscooter", "Badewanne", "Baby", "Bleistift"],
    medium: ["ADHS", "Armbänder", "Aula", "Badebombe", "Bastelkleber"],
    hard: ["Akne", "Ausmalbilder", "Bauecke", "Blauer Brief", "Detektivclub"],
    color: "#81ecec",
  },
  'Boomerwörter': {
    easy: ["Alter Schwede", "Bratpfanne", "Bratze", "Butterdose", "Dauerwelle"],
    medium: ["Altglas", "Alter Falter", "Anorak", "Anrufbeantworter", "Bügelfalte"],
    hard: ["Alter Haudegen", "Alte Kiste", "Diashow", "Doppelkorn", "Effeff"],
    color: "#ffb6b9",
  },
};

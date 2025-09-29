import { generateChordPattern } from "./patternUtils";

const Kanakangi = "Kanakangi";
const Ratnangi = "Ratnangi";
const Ganamurti = "Ganamurti";
const Vanaspati = "Vanaspati";
const Manavati = "Manavati";
const Tanarupi = "Tanarupi";
const Senavati = "Senavati";
const Hanumatodi = "Hanumatodi";
const Dhenuka = "Dhenuka";
const Natakapriya = "Natakapriya";
const Kokilapriya = "Kokilapriya";
const Rupavati = "Rupavati";
const Gayakapriya = "Gayakapriya";
const Vakulabharanam = "Vakulabharanam";
const Mayamalavagowla = "Mayamalavagowla";
const Chakravakam = "Chakravakam";
const Suryakantam = "Suryakantam";
const Hatakambari = "Hatakambari";
const Jhankaradhwani = "Jhankaradhwani";
const Natabhairavi = "Natabhairavi";
const Kiravani = "Kiravani";
const Kharaharapriya = "Kharaharapriya";
const Gourimanohari = "Gourimanohari";
const Varunapriya = "Varunapriya";
const Mararanjani = "Mararanjani";
const Charukesi = "Charukesi";
const Sarasangi = "Sarasangi";
const Harikambhoji = "Harikambhoji";
const Sankarabharanam = "Sankarabharanam";
const Nagaswaravali = "Nagaswaravali";
const Yagapriya = "Yagapriya";
const Ragavardhini = "Ragavardhini";
const Gangeyabhushani = "Gangeyabhushani";
const Vagadhisvari = "Vagadhisvari";
const Shulini = "Shulini";
const Chalanata = "Chalanata";
const Salagam = "Salagam";
const Jalarnavam = "Jalarnavam";
const Jhalavarali = "Jhalavarali";
const Navaneetam = "Navaneetam";
const Pavani = "Pavani";
const Raghupriya = "Raghupriya";
const Gavambodhi = "Gavambodhi";
const Bhavapriya = "Bhavapriya";
const Subhapantuvarali = "Subhapantuvarali";
const Shadvidamargini = "Shadvidamargini";
const Suvarnangi = "Suvarnangi";
const Divyamani = "Divyamani";
const Dhavalambari = "Dhavalambari";
const Namanarayani = "Namanarayani";
const Kamavardhini = "Kamavardhini";
const Ramapriya = "Ramapriya";
const Gamanasrama = "Gamanasrama";
const Visweshvari = "Visweshvari";
const Shyamalangi = "Shyamalangi";
const Shanmukhapriya = "Shanmukhapriya";
const Simhendramadhyamam = "Simhendramadhyamam";
const Hemavati = "Hemavati";
const Dharmavati = "Dharmavati";
const Neetimati = "Neetimati";
const Kantamani = "Kantamani";
const Rishabhapriya = "Rishabhapriya";
const Latangi = "Latangi";
const Vachaspati = "Vachaspati";
const Kalyani = "Kalyani";
const Chitrambari = "Chitrambari";
const Sucharitra = "Sucharitra";
const Jyotisvarupini = "Jyotisvarupini";
const Dhatuvardhini = "Dhatuvardhini";
const Nasikabhushani = "Nasikabhushani";
const Kosalam = "Kosalam";
const Rasikapriya = "Rasikapriya";

export const SCALES_PATTERNS_ARRAY = [
    ["---  Western Major Modes ---"],
    ["Major", "1", "2", "3", "4", "5", "6", "7"],
    ["Minor / Aeolian", "1", "2", "b3", "4", "5", "b6", "b7"],
    ["Dorian", "1", "2", "b3", "4", "5", "6", "b7"],
    ["Phrygian", "1", "b2", "b3", "4", "5", "b6", "b7"],
    ["Lydian", "1", "2", "3", "#4", "5", "6", "7"],
    ["MixoLydian", "1", "2", "3", "4", "5", "6", "b7"],
    ["Locrian", "1", "b2", "b3", "4", "b5", "b6", "b7"],


    /* Chakra Indu: Kanakangi - Tanarupi */
    ["--- Chakra Indu: Kanakangi - Tanarupi  ---"],
    [Kanakangi,      "1", "b2", "b3", "4", "b5", "b6", "b7"],
    [Ratnangi,       "1", "b2", "b3", "4", "b5", "b6", "7"],
    [Ganamurti,      "1", "b2", "b3", "4", "b5", "6", "7"],
    [Vanaspati,      "1", "b2", "b3", "4", "5", "b6", "b7"],
    [Manavati,       "1", "b2", "b3", "4", "5", "b6", "7"],
    [Tanarupi,       "1", "b2", "b3", "4", "5", "6", "7"],


    /* Chakra Netra: Senavati - Rupavati */
    ["--- Chakra Netra: Senavati - Rupavati   ---"],
    [Senavati,       "1", "2", "b3", "4", "b5", "b6", "b7"],
    [Hanumatodi,     "1", "b2", "b3", "4", "5", "b6", "b7"],
    [Dhenuka,        "1", "2", "b3", "4", "b5", "b6", "7"],
    [Natakapriya,    "1", "2", "b3", "4", "b5", "6", "7"],
    [Kokilapriya,    "1", "2", "b3", "4", "5", "b6", "b7"],
    [Rupavati,       "1", "2", "b3", "4", "5", "b6", "7"],

    /* Chakra Agni: Gayakapriya - Hatakambari */
    ["--- Chakra Agni: Gayakapriya - Hatakambari  ---"],
    [Gayakapriya,    "1", "2", "b3", "4", "5", "6", "7"],
    [Vakulabharanam, "1", "b2", "3", "4", "b5", "b6", "b7"],
    [Mayamalavagowla,"1", "b2", "3", "4", "b5", "b6", "7"],
    [Chakravakam,    "1", "b2", "3", "4", "b5", "6", "7"],
    [Suryakantam,    "1", "b2", "3", "4", "5", "b6", "b7"],
    [Hatakambari,    "1", "b2", "3", "4", "5", "b6", "7"],

    /* Chakra Veda: Jhankaradhwani - Varunapriya */
    ["--- Chakra Veda: Jhankaradhwani - Varunapriya  ---"],
    [Jhankaradhwani, "1", "b2", "3", "4", "5", "6", "7"],
    [Natabhairavi,   "1", "2", "b3", "4", "5", "b6", "b7"],
    [Kiravani,       "1", "2", "b3", "4", "5", "b6", "7"],
    [Kharaharapriya, "1", "2", "b3", "4", "5", "6", "b7"],
    [Gourimanohari,  "1", "2", "b3", "4", "5", "6", "7"],
    [Varunapriya,    "1", "2", "3", "4", "b5", "b6", "b7"],

    /* Chakra Bana: Mararanjani - Nagaswaravali */
    ["--- Chakra Bana: Mararanjani - Nagaswaravali  ---"],
    [Mararanjani,    "1", "2", "3", "4", "b5", "b6", "7"],
    [Charukesi,      "1", "2", "3", "4", "b5", "6", "7"],
    [Sarasangi,      "1", "2", "3", "4", "5", "b6", "b7"],
    [Harikambhoji,   "1", "2", "3", "4", "5", "6", "b7"],
    [Sankarabharanam,"1", "2", "3", "4", "5", "6", "7"],
    [Nagaswaravali,  "1", "2", "3", "4", "5", "6", "7"],

    /* Chakra Rutu: Yagapriya - Chalanata */
    ["--- Chakra Rutu: Yagapriya - Chalanata  ---"],
    [Yagapriya,      "1", "b2", "b3", "4", "b5", "b6", "b7"],
    [Ragavardhini,   "1", "b2", "b3", "4", "b5", "b6", "7"],
    [Gangeyabhushani,"1", "b2", "b3", "4", "b5", "6", "7"],
    [Vagadhisvari,   "1", "b2", "b3", "4", "5", "b6", "b7"],
    [Shulini,        "1", "b2", "b3", "4", "5", "b6", "7"],
    [Chalanata,      "1", "b2", "b3", "4", "5", "6", "7"],

    /* Chakra Rishi: Salagam - Raghupriya */
    ["--- Chakra Rishi: Salagam - Raghupriya  ---"],
    [Salagam,        "1", "2", "b3", "4", "b5", "b6", "b7"],
    [Jalarnavam,     "1", "2", "b3", "4", "b5", "b6", "7"],
    [Jhalavarali,    "1", "2", "b3", "4", "b5", "6", "7"],
    [Navaneetam,     "1", "2", "b3", "4", "5", "b6", "b7"],
    [Pavani,         "1", "2", "b3", "4", "5", "b6", "7"],
    [Raghupriya,     "1", "2", "b3", "4", "5", "6", "7"],

    /* Chakra Vasu: Gavambodhi - Divyamani */
    ["--- Chakra Vasu: Gavambodhi - Divyamani  ---"],
    [Gavambodhi,     "1", "b2", "3", "4", "b5", "b6", "b7"],
    [Bhavapriya,     "1", "b2", "3", "4", "b5", "b6", "7"],
    [Subhapantuvarali,"1", "b2", "3", "4", "b5", "6", "7"],
    [Shadvidamargini,"1", "b2", "3", "4", "5", "b6", "b7"],
    [Suvarnangi,     "1", "b2", "3", "4", "5", "b6", "7"],
    [Divyamani,      "1", "b2", "3", "4", "5", "6", "7"],

    /* Chakra Brahma: Dhavalambari - Visweshvari */
    ["--- Chakra Brahma: Dhavalambari - Visweshvari  ---"],
    [Dhavalambari,   "1", "2", "b3", "4", "b5", "b6", "b7"],
    [Namanarayani,   "1", "2", "b3", "4", "b5", "b6", "7"],
    [Kamavardhini,   "1", "2", "b3", "4", "b5", "6", "7"],
    [Ramapriya,      "1", "2", "b3", "4", "5", "b6", "b7"],
    [Gamanasrama,    "1", "2", "b3", "4", "5", "b6", "7"],
    [Visweshvari,    "1", "2", "b3", "4", "5", "6", "7"],

    /* Chakra Disi: Shyamalangi - Neetimati */
    ["--- Chakra Disi: Shyamalangi - Neetimati  ---"],
    [Shyamalangi,    "1", "b2", "3", "4", "b5", "b6", "b7"],
    [Shanmukhapriya, "1", "b2", "3", "4", "b5", "b6", "7"],
    [Simhendramadhyamam,"1", "b2", "3", "4", "b5", "6", "7"],
    [Hemavati,       "1", "b2", "3", "4", "5", "b6", "b7"],
    [Dharmavati,     "1", "b2", "3", "4", "5", "b6", "7"],
    [Neetimati,      "1", "b2", "3", "4", "5", "6", "7"],

    /* Chakra Rudra: Kantamani - Chitrambari */
    ["--- Chakra Rudra: Kantamani - Chitrambari  ---"],
    [Kantamani,      "1", "2", "b3", "4", "b5", "b6", "b7"],
    [Rishabhapriya,  "1", "2", "b3", "4", "b5", "b6", "7"],
    [Latangi,        "1", "2", "b3", "4", "b5", "6", "7"],
    [Vachaspati,     "1", "2", "b3", "4", "5", "b6", "b7"],
    [Kalyani,        "1", "2", "b3", "4", "5", "b6", "7"],
    [Chitrambari,    "1", "2", "b3", "4", "5", "6", "7"],

    /* Chakra Aditya: Sucharitra - Rasikapriya */
    ["--- Chakra Aditya: Sucharitra - Rasikapriya  ---"],
    [Sucharitra,     "1", "b2", "3", "4", "b5", "b6", "b7"],
    [Jyotisvarupini, "1", "b2", "3", "4", "b5", "b6", "7"],
    [Dhatuvardhini,  "1", "b2", "3", "4", "b5", "6", "7"],
    [Nasikabhushani, "1", "b2", "3", "4", "5", "b6", "b7"],
    [Kosalam,        "1", "b2", "3", "4", "5", "b6", "7"],
    [Rasikapriya,    "1", "b2", "3", "4", "5", "6", "7"]

];

const CHORDS_PATTERNS = SCALES_PATTERNS_ARRAY.map(generateChordPattern);

export { CHORDS_PATTERNS };



export const RAGAS_PATTERNS_ARRAY = [
];
export const RAGAS_PATTERNS = {
    /* Chakra Indu: Kanakangi - Tanarupi */
    Kanakangi:      ["1",  "None", "S R₁ G₁ M₁ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₁ G₁ R₁ S"],
    Ratnangi:       ["2",  "None", "S R₁ G₁ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₁ R₁ S"],
    Ganamurti:      ["3",  "None", "S R₁ G₁ M₁ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₁ G₁ R₁ S"],
    Vanaspati:      ["4",  "None", "S R₁ G₁ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₁ R₁ S"],
    Manavati:       ["5",  "None", "S R₁ G₁ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₁ R₁ S"],
    Tanarupi:       ["6",  "None", "S R₁ G₁ M₁ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₁ G₁ R₁ S"],

    /* Chakra Netra: Senavati - Rupavati */
    Senavati:       ["7",  "None", "S R₁ G₂ M₁ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₁ G₂ R₁ S"],
    Hanumatodi:     ["8",  "Phrygian", "S R₁ G₂ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₂ R₁ S"],
    Dhenuka:        ["9",  "None", "S R₁ G₂ M₁ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₁ G₂ R₁ S"],
    Natakapriya:    ["10", "None", "S R₁ G₂ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₂ R₁ S"],
    Kokilapriya:    ["11", "None", "S R₁ G₂ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₂ R₁ S"],
    Rupavati:       ["12", "None", "S R₁ G₂ M₁ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₁ G₂ R₁ S"],

    /* Chakra Agni: Gayakapriya - Hatakambari */
    Gayakapriya:    ["13", "None", "S R₁ G₃ M₁ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₁ G₃ R₁ S"],
    Vakulabharanam: ["14", "None", "S R₁ G₃ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₃ R₁ S"],
    Mayamalavagowla:["15", "Double Harmonic Major", "S R₁ G₃ M₁ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₁ G₃ R₁ S"],
    Chakravakam:    ["16", "None", "S R₁ G₃ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₃ R₁ S"],
    Suryakantam:    ["17", "None", "S R₁ G₃ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₃ R₁ S"],
    Hatakambari:    ["18", "None", "S R₁ G₃ M₁ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₁ G₃ R₁ S"],

    /* Chakra Veda: Jhankaradhwani - Varunapriya */
    Jhankaradhwani: ["19", "None", "S R₂ G₂ M₁ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₁ G₂ R₂ S"],
    Natabhairavi:   ["20", "Aeolian (Natural Minor)", "S R₂ G₂ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₂ R₂ S"],
    Kiravani:       ["21", "Harmonic Minor", "S R₂ G₂ M₁ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₁ G₂ R₂ S"],
    Kharaharapriya: ["22", "Dorian", "S R₂ G₂ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₂ R₂ S"],
    Gourimanohari:  ["23", "None", "S R₂ G₂ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₂ R₂ S"],
    Varunapriya:    ["24", "None", "S R₂ G₂ M₁ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₁ G₂ R₂ S"],

    /* Chakra Bana: Mararanjani - Nagaswaravali */
    Mararanjani:    ["25", "None", "S R₂ G₃ M₁ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₁ G₃ R₂ S"],
    Charukesi:      ["26", "None", "S R₂ G₃ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₃ R₂ S"],
    Sarasangi:      ["27", "None", "S R₂ G₃ M₁ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₁ G₃ R₂ S"],
    Harikambhoji:   ["28", "Mixolydian", "S R₂ G₃ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₃ R₂ S"],
    Sankarabharanam:["29", "Major", "S R₂ G₃ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₃ R₂ S"],
    Nagaswaravali:  ["30", "None", "S R₂ G₃ M₁ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₁ G₃ R₂ S"],

    /* Chakra Rutu: Yagapriya - Chalanata */
    Yagapriya:      ["31", "None", "S R₃ G₃ M₁ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₁ G₃ R₃ S"],
    Ragavardhini:   ["32", "None", "S R₃ G₃ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₃ R₃ S"],
    Gangeyabhushani:["33", "None", "S R₃ G₃ M₁ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₁ G₃ R₃ S"],
    Vagadhisvari:   ["34", "None", "S R₃ G₃ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₃ R₃ S"],
    Shulini:        ["35", "None", "S R₃ G₃ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₃ R₃ S"],
    Chalanata:      ["36", "None", "S R₃ G₃ M₁ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₁ G₃ R₃ S"],

    /* Chakra Rishi: Salagam - Raghupriya */
    Salagam:        ["37", "None", "S R₁ G₁ M₂ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₂ G₁ R₁ S"],
    Jalarnavam:     ["38", "None", "S R₁ G₁ M₂ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₂ G₁ R₁ S"],
    Jhalavarali:    ["39", "None", "S R₁ G₁ M₂ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₂ G₁ R₁ S"],
    Navaneetam:     ["40", "None", "S R₁ G₁ M₂ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₂ G₁ R₁ S"],
    Pavani:         ["41", "None", "S R₁ G₁ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₁ R₁ S"],
    Raghupriya:     ["42", "None", "S R₁ G₁ M₂ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₂ G₁ R₁ S"],

    /* Chakra Vasu: Gavambodhi - Divyamani */
    Gavambodhi:     ["43", "None", "S R₁ G₂ M₂ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₂ G₂ R₁ S"],
    Bhavapriya:     ["44", "None", "S R₁ G₂ M₂ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₂ G₂ R₁ S"],
    Subhapantuvarali:["45", "None", "S R₁ G₂ M₂ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₂ G₂ R₁ S"],
    Shadvidamargini:["46", "None", "S R₁ G₂ M₂ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₂ G₂ R₁ S"],
    Suvarnangi:     ["47", "None", "S R₁ G₂ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₂ R₁ S"],
    Divyamani:      ["48", "None", "S R₁ G₂ M₂ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₂ G₂ R₁ S"],

    /* Chakra Brahma: Dhavalambari - Visweshvari */
    Dhavalambari:   ["49", "None", "S R₁ G₃ M₂ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₂ G₃ R₁ S"],
    Namanarayani:   ["50", "None", "S R₁ G₃ M₂ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₂ G₃ R₁ S"],
    Kamavardhini:   ["51", "None", "S R₁ G₃ M₂ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₂ G₃ R₁ S"],
    Ramapriya:      ["52", "None", "S R₁ G₃ M₂ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₂ G₃ R₁ S"],
    Gamanasrama:    ["53", "None", "S R₁ G₃ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₃ R₁ S"],
    Visweshvari:    ["54", "None", "S R₁ G₃ M₂ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₂ G₃ R₁ S"],

    /* Chakra Disi: Shyamalangi - Neetimati */
    Shyamalangi:    ["55", "None", "S R₂ G₂ M₂ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₂ G₂ R₂ S"],
    Shanmukhapriya: ["56", "None", "S R₂ G₂ M₂ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₂ G₂ R₂ S"],
    Simhendramadhyamam:["57", "None", "S R₂ G₂ M₂ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₂ G₂ R₂ S"],
    Hemavati:       ["58", "None", "S R₂ G₂ M₂ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₂ G₂ R₂ S"],
    Dharmavati:     ["59", "None", "S R₂ G₂ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₂ R₂ S"],
    Neetimati:      ["60", "None", "S R₂ G₂ M₂ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₂ G₂ R₂ S"],

    /* Chakra Rudra: Kantamani - Chitrambari */
    Kantamani:      ["61", "None", "S R₂ G₃ M₂ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₂ G₃ R₂ S"],
    Rishabhapriya:  ["62", "None", "S R₂ G₃ M₂ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₂ G₃ R₂ S"],
    Latangi:        ["63", "None", "S R₂ G₃ M₂ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₂ G₃ R₂ S"],
    Vachaspati:     ["64", "None", "S R₂ G₃ M₂ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₂ G₃ R₂ S"],
    Kalyani:        ["65", "Lydian", "S R₂ G₃ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₃ R₂ S"],
    Chitrambari:    ["66", "None", "S R₂ G₃ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₃ R₂ S"],

    /* Chakra Aditya: Sucharitra - Rasikapriya */
    Sucharitra:     ["67", "None", "S R₃ G₃ M₂ P D₁ N₁ Ṡ", "Ṡ N₁ D₁ P M₂ G₃ R₃ S"],
    Jyotisvarupini: ["68", "None", "S R₃ G₃ M₂ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₂ G₃ R₃ S"],
    Dhatuvardhini:  ["69", "None", "S R₃ G₃ M₂ P D₁ N₃ Ṡ", "Ṡ N₃ D₁ P M₂ G₃ R₃ S"],
    Nasikabhushani: ["70", "None", "S R₃ G₃ M₂ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₂ G₃ R₃ S"],
    Kosalam:        ["71", "None", "S R₃ G₃ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₃ R₃ S"],
    Rasikapriya:    ["72", "None", "S R₃ G₃ M₂ P D₃ N₃ Ṡ", "Ṡ N₃ D₃ P M₂ G₃ R₃ S"],
};


//
//
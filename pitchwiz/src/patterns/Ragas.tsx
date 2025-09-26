
const Sankarabharanam = "Sankarabharanam"
const Natabhairavi = "Natabhairavi"
const Kharaharapriya = "Kharaharapriya"
const Hanumatodi = "Hanumatodi"
const Kalyani = "Kalyani"
const Harikambhoji = "Harikambhoji"

export const RAGAS_PATTERNS_ARRAY = [
    [Sankarabharanam,  "1", "2", "3", "4", "5", "6", "7"],
    [Natabhairavi,     "1", "2", "b3", "4", "5", "b6", "b7"],
    [Kharaharapriya,   "1", "2", "b3", "4", "5", "6", "b7"],
    [Hanumatodi,       "1", "b2", "b3", "4", "5", "b6", "b7"],
    [Kalyani,          "1", "2", "3", "b5", "5", "6", "7"],
    [Harikambhoji,     "1", "2", "3", "4", "5", "6", "b7"],
];

// <Raga name>: ["Mela kartha number", "<western equivalent>", "<arohana pattern>", "<avarohana pattern>"]

export const RAGAS_PATTERNS = {
    Sankarabharanam: ["29", "Major", "S R₂ G₃ M₁ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₁ G₃ R₂ S"],
    Natabhairavi:    ["20", "Aeolian (Natural Minor)", "S R₂ G₂ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₂ R₂ S"],
    Kharaharapriya:  ["22", "Dorian", "S R₂ G₂ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₂ R₂ S"],
    Hanumatodi:      ["8",  "Phrygian", "S R₁ G₂ M₁ P D₁ N₂ Ṡ", "Ṡ N₂ D₁ P M₁ G₂ R₁ S"],
    Kalyani:         ["65", "Lydian", "S R₂ G₃ M₂ P D₂ N₃ Ṡ", "Ṡ N₃ D₂ P M₂ G₃ R₂ S"],
    Harikambhoji:    ["28", "Mixolydian", "S R₂ G₃ M₁ P D₂ N₂ Ṡ", "Ṡ N₂ D₂ P M₁ G₃ R₂ S"],
}





//
//
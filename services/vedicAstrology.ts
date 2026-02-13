// --- DATA STRUCTURES ---

interface Nakshatra {
  id: number;
  name: string;
  ruler: string;
  rashi: string;
  gana: string;
  yoni: string;
  nadi: string;
}

const NAKSHATRAS: Nakshatra[] = [
  { id: 0, name: "Ashwini", ruler: "Ketu", rashi: "Aries", gana: "Deva", yoni: "Ashwa", nadi: "Adi" },
  { id: 1, name: "Bharani", ruler: "Venus", rashi: "Aries", gana: "Manushya", yoni: "Gaja", nadi: "Madhya" },
  { id: 2, name: "Krittika", ruler: "Sun", rashi: "Aries", gana: "Rakshasa", yoni: "Mesha", nadi: "Antya" }, // Span Aries/Taurus
  { id: 3, name: "Rohini", ruler: "Moon", rashi: "Taurus", gana: "Manushya", yoni: "Sarpa", nadi: "Antya" },
  { id: 4, name: "Mrigashira", ruler: "Mars", rashi: "Taurus", gana: "Deva", yoni: "Sarpa", nadi: "Madhya" },
  { id: 5, name: "Ardra", ruler: "Rahu", rashi: "Gemini", gana: "Manushya", yoni: "Shwan", nadi: "Adi" },
  { id: 6, name: "Punarvasu", ruler: "Jupiter", rashi: "Gemini", gana: "Deva", yoni: "Marjar", nadi: "Adi" },
  { id: 7, name: "Pushya", ruler: "Saturn", rashi: "Cancer", gana: "Deva", yoni: "Mesha", nadi: "Madhya" },
  { id: 8, name: "Ashlesha", ruler: "Mercury", rashi: "Cancer", gana: "Rakshasa", yoni: "Marjar", nadi: "Antya" },
  { id: 9, name: "Magha", ruler: "Ketu", rashi: "Leo", gana: "Rakshasa", yoni: "Mushak", nadi: "Antya" },
  { id: 10, name: "Purva Phalguni", ruler: "Venus", rashi: "Leo", gana: "Manushya", yoni: "Mushak", nadi: "Madhya" },
  { id: 11, name: "Uttara Phalguni", ruler: "Sun", rashi: "Leo", gana: "Manushya", yoni: "Gau", nadi: "Adi" },
  { id: 12, name: "Hasta", ruler: "Moon", rashi: "Virgo", gana: "Deva", yoni: "Mahish", nadi: "Adi" },
  { id: 13, name: "Chitra", ruler: "Mars", rashi: "Virgo", gana: "Rakshasa", yoni: "Vyaghra", nadi: "Madhya" },
  { id: 14, name: "Swati", ruler: "Rahu", rashi: "Libra", gana: "Deva", yoni: "Mahish", nadi: "Antya" },
  { id: 15, name: "Vishakha", ruler: "Jupiter", rashi: "Libra", gana: "Rakshasa", yoni: "Vyaghra", nadi: "Antya" },
  { id: 16, name: "Anuradha", ruler: "Saturn", rashi: "Scorpio", gana: "Deva", yoni: "Mrig", nadi: "Madhya" },
  { id: 17, name: "Jyeshtha", ruler: "Mercury", rashi: "Scorpio", gana: "Rakshasa", yoni: "Mrig", nadi: "Adi" },
  { id: 18, name: "Mula", ruler: "Ketu", rashi: "Sagittarius", gana: "Rakshasa", yoni: "Shwan", nadi: "Adi" },
  { id: 19, name: "Purva Ashadha", ruler: "Venus", rashi: "Sagittarius", gana: "Manushya", yoni: "Vanar", nadi: "Madhya" },
  { id: 20, name: "Uttara Ashadha", ruler: "Sun", rashi: "Sagittarius", gana: "Manushya", yoni: "Nakul", nadi: "Antya" },
  { id: 21, name: "Shravana", ruler: "Moon", rashi: "Capricorn", gana: "Deva", yoni: "Vanar", nadi: "Antya" },
  { id: 22, name: "Dhanishta", ruler: "Mars", rashi: "Capricorn", gana: "Rakshasa", yoni: "Simha", nadi: "Madhya" },
  { id: 23, name: "Shatabhisha", ruler: "Rahu", rashi: "Aquarius", gana: "Rakshasa", yoni: "Ashwa", nadi: "Adi" },
  { id: 24, name: "Purva Bhadrapada", ruler: "Jupiter", rashi: "Aquarius", gana: "Manushya", yoni: "Simha", nadi: "Adi" },
  { id: 25, name: "Uttara Bhadrapada", ruler: "Saturn", rashi: "Pisces", gana: "Manushya", yoni: "Gau", nadi: "Madhya" },
  { id: 26, name: "Revati", ruler: "Mercury", rashi: "Pisces", gana: "Deva", yoni: "Gaja", nadi: "Antya" }
];

const RASHI_LORDS: Record<string, string> = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

const PLANET_FRIENDSHIP: Record<string, { friends: string[], enemies: string[], neutral: string[] }> = {
    "Sun": { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"], neutral: ["Mercury"] },
    "Moon": { friends: ["Sun", "Mercury"], enemies: [], neutral: ["Mars", "Jupiter", "Venus", "Saturn"] },
    "Mars": { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"], neutral: ["Venus", "Saturn"] },
    "Mercury": { friends: ["Sun", "Venus"], enemies: ["Moon"], neutral: ["Mars", "Jupiter", "Saturn"] },
    "Jupiter": { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"], neutral: ["Saturn"] },
    "Venus": { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"], neutral: ["Mars", "Jupiter"] },
    "Saturn": { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"], neutral: ["Jupiter"] },
    "Rahu": { friends: ["Venus", "Saturn"], enemies: ["Sun", "Moon"], neutral: ["Mercury", "Jupiter"] },
    "Ketu": { friends: ["Mars", "Venus"], enemies: ["Sun", "Moon"], neutral: ["Mercury", "Jupiter"] }
};

// --- CALCULATORS ---

/**
 * Approximate Moon Calculation (Sidereal)
 * NOTE: This is an algorithmic approximation. Ideally requires Ephemeris.
 * We use a known epoch (Jan 1 2000) and daily motion.
 */
const getApproxMoonPosition = (dateStr: string, timeStr: string) => {
    const dateTime = new Date(`${dateStr}T${timeStr}:00Z`);
    const J2000 = new Date('2000-01-01T12:00:00Z');
    const daysSinceJ2000 = (dateTime.getTime() - J2000.getTime()) / (1000 * 60 * 60 * 24);
    
    // Moon mean daily motion ~13.176358 degrees
    // Moon mean longitude at J2000 ~280.46
    let moonLong = 280.46 + (13.176358 * daysSinceJ2000);
    
    // Normalize to 0-360
    moonLong = moonLong % 360;
    if (moonLong < 0) moonLong += 360;

    // Ayanamsa correction (Lahiri approx ~24 deg for modern times)
    const ayanamsa = 24.0; 
    let siderealLong = moonLong - ayanamsa;
    if (siderealLong < 0) siderealLong += 360;

    // Determine Nakshatra (13.33 deg per nakshatra)
    const nakshatraIndex = Math.floor(siderealLong / 13.333333);
    const nakshatra = NAKSHATRAS[nakshatraIndex % 27];

    // Determine Rashi (30 deg per rashi)
    const rashiNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const rashiIndex = Math.floor(siderealLong / 30);
    const rashi = rashiNames[rashiIndex % 12];

    return { ...nakshatra, rashi, rashiIndex };
};

const getGanaPoints = (b: string, g: string): number => {
    if (b === g) return 6;
    if ((b === 'Deva' && g === 'Manushya') || (g === 'Deva' && b === 'Manushya')) return 6;
    if ((b === 'Rakshasa' && g === 'Deva') || (g === 'Rakshasa' && b === 'Deva')) return 1;
    if ((b === 'Rakshasa' && g === 'Manushya') || (g === 'Rakshasa' && b === 'Manushya')) return 0;
    return 3;
};

const getNadiPoints = (b: string, g: string): number => {
    if (b === g) return 0; // Nadi Dosha
    return 8;
};

const getBhakootPoints = (b: string, g: string): number => {
    const rashiOrder = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const bIdx = rashiOrder.indexOf(b);
    const gIdx = rashiOrder.indexOf(g);
    
    let dist = (gIdx - bIdx) + 1;
    if (dist <= 0) dist += 12;

    if (dist === 2 || dist === 12 || dist === 5 || dist === 9 || dist === 6 || dist === 8) return 0;
    return 7;
};

const getGrahaMaitriPoints = (bSign: string, gSign: string): number => {
    const bLord = RASHI_LORDS[bSign];
    const gLord = RASHI_LORDS[gSign];

    if (bLord === gLord) return 5;
    
    const getFriendshipScore = (planet: string, target: string) => {
        if (!PLANET_FRIENDSHIP[planet]) return 0;
        if (PLANET_FRIENDSHIP[planet].friends.includes(target)) return 1;
        if (PLANET_FRIENDSHIP[planet].neutral.includes(target)) return 0.5;
        return 0;
    };

    const score1 = getFriendshipScore(bLord, gLord);
    const score2 = getFriendshipScore(gLord, bLord);
    const total = score1 + score2;

    if (total === 2) return 5;
    if (total === 1.5) return 4;
    if (total === 1) return 3;
    if (total === 0.5) return 1;
    return 0;
};

// Simplified placeholders
const getVarnaPoints = () => 1;
const getVashyaPoints = () => 2;
const getTaraPoints = () => 1.5;
const getYoniPoints = () => 2;

export interface MatchMakingResult {
    score: number;
    compatibility: 'Excellent' | 'Good' | 'Average' | 'Poor';
    analysis: string;
    recommendations: string;
}

export const performLocalMatchMaking = (boy: {dob: string, time: string, name: string}, girl: {dob: string, time: string, name: string}): MatchMakingResult => {
    const boyAstro = getApproxMoonPosition(boy.dob, boy.time);
    const girlAstro = getApproxMoonPosition(girl.dob, girl.time);

    const scores = {
        varna: getVarnaPoints(),
        vashya: getVashyaPoints(),
        tara: getTaraPoints(),
        yoni: getYoniPoints(),
        grahaMaitri: getGrahaMaitriPoints(boyAstro.rashi, girlAstro.rashi),
        gana: getGanaPoints(boyAstro.gana, girlAstro.gana),
        bhakoot: getBhakootPoints(boyAstro.rashi, girlAstro.rashi),
        nadi: getNadiPoints(boyAstro.nadi, girlAstro.nadi)
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    let compatibility: 'Excellent' | 'Good' | 'Average' | 'Poor' = 'Poor';
    if (totalScore >= 28) compatibility = 'Excellent';
    else if (totalScore >= 18) compatibility = 'Good';
    else if (totalScore >= 10) compatibility = 'Average';

    let analysis = `**Astrological Details:**\n- **${boy.name}**: ${boyAstro.rashi} Rashi, ${boyAstro.name} Nakshatra\n- **${girl.name}**: ${girlAstro.rashi} Rashi, ${girlAstro.name} Nakshatra\n\n**Guna Milan (Points):**\n- **Nadi (Health):** ${scores.nadi} / 8\n- **Bhakoot (Harmony):** ${scores.bhakoot} / 7\n- **Gana (Temperament):** ${scores.gana} / 6\n- **Graha Maitri (Mental):** ${scores.grahaMaitri} / 5\n`;

    let recs = "";
    if (scores.nadi === 0) recs += "- **Nadi Dosha:** Major conflict detected. Health issues possible. Consult a Panditji for 'Mahamrityunjaya' pooja.\n";
    if (scores.bhakoot === 0) recs += "- **Bhakoot Dosha:** Family harmony may require effort.\n";
    if (scores.gana === 0) recs += "- **Gana Dosha:** Temperament mismatch (Rakshasa-Manushya). Practice patience in communication.\n";
    
    if (totalScore > 25) recs += "- A divine union. Proceed with confidence.\n";
    else if (recs === "") recs = "- Standard Vedic remedies recommended for a balanced life.\n";

    return {
        score: Math.floor(totalScore),
        compatibility,
        analysis,
        recommendations: recs
    };
};

export const getBirthChartDetails = (person: {dob: string, time: string, name: string}) => {
    const astro = getApproxMoonPosition(person.dob, person.time);
    const lord = RASHI_LORDS[astro.rashi];

    return `**Birth Chart Analysis for ${person.name}**\n\n` +
           `1. **Core Identity (Moon Sign/Rashi):** ${astro.rashi}\n` +
           `   - Your emotional core is ruled by **${lord}**.\n` +
           `2. **Nakshatra (Constellation):** ${astro.name}\n` +
           `   - **Ruler:** ${astro.ruler}\n` +
           `   - **Symbol:** ${astro.yoni} (Nature/Animal Symbol)\n` +
           `3. **Nature (Gana):** ${astro.gana}\n` +
           `   - Determines your temperament and reaction to the world.\n` +
           `4. **Energy Flow (Nadi):** ${astro.nadi}\n` +
           `   - Indicates your physiological and spiritual constitution.\n\n` +
           `*Note: This chart is calculated using standard sidereal approximations.*`;
};
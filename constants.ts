import { ZodiacSign, BlogPost } from './types';
import { PanchangData } from './types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', icon: 'fa-ram', element: 'Fire', dateRange: 'Mar 21 - Apr 19' },
  { id: 'taurus', name: 'Taurus', icon: 'fa-bull', element: 'Earth', dateRange: 'Apr 20 - May 20' },
  { id: 'gemini', name: 'Gemini', icon: 'fa-twins', element: 'Air', dateRange: 'May 21 - Jun 20' },
  { id: 'cancer', name: 'Cancer', icon: 'fa-crab', element: 'Water', dateRange: 'Jun 21 - Jul 22' },
  { id: 'leo', name: 'Leo', icon: 'fa-lion', element: 'Fire', dateRange: 'Jul 23 - Aug 22' },
  { id: 'virgo', name: 'Virgo', icon: 'fa-wheat', element: 'Earth', dateRange: 'Aug 23 - Sep 22' },
  { id: 'libra', name: 'Libra', icon: 'fa-scale-balanced', element: 'Air', dateRange: 'Sep 23 - Oct 22' },
  { id: 'scorpio', name: 'Scorpio', icon: 'fa-scorpion', element: 'Water', dateRange: 'Oct 23 - Nov 21' },
  { id: 'sagittarius', name: 'Sagittarius', icon: 'fa-bow-arrow', element: 'Fire', dateRange: 'Nov 22 - Dec 21' },
  { id: 'capricorn', name: 'Capricorn', icon: 'fa-goat', element: 'Earth', dateRange: 'Dec 22 - Jan 19' },
  { id: 'aquarius', name: 'Aquarius', icon: 'fa-jug-detergent', element: 'Air', dateRange: 'Jan 20 - Feb 18' },
  { id: 'pisces', name: 'Pisces', icon: 'fa-fish', element: 'Water', dateRange: 'Feb 19 - Mar 20' },
];

const ADJECTIVES = ['transformative', 'energetic', 'peaceful', 'challenging', 'prosperous', 'spiritual', 'dynamic', 'auspicious', 'reflective'];
const FOCUS_AREAS = ['career', 'relationships', 'health', 'finance', 'spirituality', 'creativity', 'family', 'travel', 'learning'];
const PLANETS = ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Sun', 'Moon', 'Rahu', 'Ketu'];

// --- BLOG MOCK DATA ---
export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Great Shift: Saturn enters Pisces',
    excerpt: 'Saturn, the taskmaster, moves into the spiritual waters of Pisces. Here is what it means for your emotional discipline and karmic cycles over the next two years.',
    content: `When Saturn enters Pisces, the strict boundaries of the material world meet the boundless ocean of the spiritual. This transit is not about achieving external goals, but about mastering your inner world.
    
    **What to expect:**
    1. **Dissolution of Ego:** Old structures that no longer serve your soul will wash away.
    2. **Spiritual Discipline:** It is the perfect time to commit to meditation or yoga.
    3. **Compassionate Leadership:** Authority figures will be called to lead with empathy.
    
    **For Fire Signs (Aries, Leo, Sagittarius):** You may feel a need to slow down and reflect.
    **For Earth Signs (Taurus, Virgo, Capricorn):** Your intuition will sharpen, aiding practical decisions.
    **For Air Signs (Gemini, Libra, Aquarius):** Creativity will flow, but demands structure.
    **For Water Signs (Cancer, Scorpio, Pisces):** A period of immense maturity and karmic leveling up.`,
    author: 'Acharya Dev',
    date: '2025-05-15',
    category: 'Transits',
    readTime: '5 min',
    likes: 1240
  },
  {
    id: '2',
    title: 'Understanding the Power of Ekadashi',
    excerpt: 'Why is fasting on Ekadashi considered scientifically and spiritually beneficial? Unlock the secrets of lunar cycles and digestion.',
    content: `Ekadashi, the 11th day of the lunar cycle, is not just a ritual but a scientific approach to body detoxification. The gravitational pull of the moon affects the water in our bodies, just as it affects the tides.
    
    **The Science:**
    On Ekadashi, the atmospheric pressure is lower, making it the best time to fast and cleanse the digestive system. Fasting gives your vital organs a rest and resets your metabolism.
    
    **Spiritual Significance:**
    It is believed that the mind is most steady on this day, making it ideal for meditation and prayer. By controlling the tongue (taste), we learn to control the mind.`,
    author: 'Dr. S. Radhakrishnan',
    date: '2025-05-18',
    category: 'Rituals',
    readTime: '3 min',
    likes: 856
  },
  {
    id: '3',
    title: 'Mercury Retrograde: Survival Guide',
    excerpt: 'Don’t panic! Mercury Retrograde is actually a blessing in disguise for reviewing, revisiting, and reimagining your plans.',
    content: `Three times a year, the planet of communication appears to move backward in the sky. While often blamed for tech glitches and misunderstandings, Mercury Retrograde is actually a "Cosmic Review Period".
    
    **Do's:**
    - Reconnect with old friends.
    - Revise old projects.
    - Reflect on your communication style.
    
    **Don'ts:**
    - Sign major contracts without triple-checking.
    - Buy expensive electronics.
    - Start brand new ventures without flexibility.`,
    author: 'Astro Neha',
    date: '2025-05-20',
    category: 'Guides',
    readTime: '4 min',
    likes: 2100
  },
  {
    id: '4',
    title: 'Vastu Tips for Home Office',
    excerpt: 'Enhance your productivity and financial flow by aligning your workspace with ancient Vastu Shastra principles.',
    content: `In the era of remote work, your home office energy is crucial. 
    
    **Key Tips:**
    1. **Direction:** Ideally, face North or East while working to invite prosperity and enlightenment.
    2. **Desk Shape:** Avoid irregular shapes; a rectangular desk provides stability.
    3. **Colors:** Use light greens or blues to promote focus and calmness. Avoid dark grey or black which can absorb energy.
    4. **Lighting:** Ensure ample natural light. If not possible, use warm LED lights, not harsh fluorescent ones.`,
    author: 'Vastu Expert Raj',
    date: '2025-05-22',
    category: 'Vastu',
    readTime: '3 min',
    likes: 645
  }
];

// --- ASTRONOMICAL CALCULATION ENGINE (Delhi Coordinates: 28.61° N, 77.20° E) ---
const toRadians = (deg: number) => deg * Math.PI / 180;
const toDegrees = (rad: number) => rad * 180 / Math.PI;

const formatTimeFromMinutes = (minutesFromMidnight: number) => {
    let h = Math.floor(minutesFromMidnight / 60);
    const m = Math.floor(minutesFromMidnight % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const getSunTimes = (date: Date) => {
    // 1. Day of Year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // 2. Equation of Time (EoT) & Declination (Approximate)
    const B = (360 / 365) * (dayOfYear - 81);
    const eot = 9.87 * Math.sin(toRadians(2 * B)) - 7.53 * Math.cos(toRadians(B)) - 1.5 * Math.sin(toRadians(B));
    
    // 3. Solar Noon (UTC) -> Local Time
    // Delhi Longitude: 77.2, Standard Meridian: 82.5 (IST)
    // Correction = (Standard - Local) * 4 minutes
    const longitudeCorrection = (82.5 - 77.2) * 4; 
    const localNoonMinutes = 720 + longitudeCorrection - eot; // 12:00 PM +/- corrections

    // 4. Sunrise/Sunset Hour Angle
    // cos(w) = -tan(lat) * tan(decl)
    // Declination approx: 23.45 * sin(360/365 * (d - 81))
    const declination = 23.45 * Math.sin(toRadians((360 / 365) * (dayOfYear - 81)));
    const lat = 28.61;
    
    // Hour Angle (w)
    const cosW = -Math.tan(toRadians(lat)) * Math.tan(toRadians(declination));
    // Clamp cosW to -1 to 1 to avoid NaNs
    const w = toDegrees(Math.acos(Math.max(-1, Math.min(1, cosW)))); // Degrees
    const durationHalfMinutes = w * 4;

    const sunriseMinutes = localNoonMinutes - durationHalfMinutes;
    const sunsetMinutes = localNoonMinutes + durationHalfMinutes;

    return {
        sunrise: sunriseMinutes,
        sunset: sunsetMinutes,
        noon: localNoonMinutes,
        dayDuration: sunsetMinutes - sunriseMinutes
    };
};

export const getPanchang = (date: Date): PanchangData => {
  const sun = getSunTimes(date);
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon...

  // Rahu Kaal Segments (1-8 from Sunrise)
  // Mon(2), Tue(7), Wed(5), Thu(6), Fri(4), Sat(3), Sun(8)
  const rahuSegments = [8, 2, 7, 5, 6, 4, 3]; // Index 0 is Sunday
  const segmentIndex = rahuSegments[dayIndex] - 1; // 0-based index
  
  const segmentDuration = sun.dayDuration / 8;
  const rahuStartMins = sun.sunrise + (segmentIndex * segmentDuration);
  const rahuEndMins = rahuStartMins + segmentDuration;

  // Abhijit (Mid-day, 8th Muhurat of 15)
  // Approx 48 mins centered on Solar Noon
  const abhijitStartMins = sun.noon - 24;
  const abhijitEndMins = sun.noon + 24;

  // Panchang Info Rotation (Simulation for variety based on date)
  const day = date.getDate();
  const month = date.getMonth();
  const tithis = ['Shukla Paksha Dashami', 'Krishna Paksha Ekadashi', 'Shukla Paksha Tritiya', 'Amavasya', 'Purnima', 'Shukla Paksha Saptami'];
  const nakshatras = ['Rohini', 'Ashwini', 'Bharani', 'Krittika', 'Mrigashirsha', 'Ardra', 'Punarvasu'];
  const yogas = ['Siddha', 'Shubha', 'Indra', 'Brahma', 'Vaidhrti', 'Vishkumbha'];
  
  const index = (day + month) % tithis.length;
  const nIndex = (day + month) % nakshatras.length;
  const yIndex = (day + month) % yogas.length;

  return {
    tithi: tithis[index],
    nakshatra: nakshatras[nIndex],
    yoga: yogas[yIndex],
    sunrise: formatTimeFromMinutes(sun.sunrise), 
    sunset: formatTimeFromMinutes(sun.sunset),
    rahuKaal: `${formatTimeFromMinutes(rahuStartMins)} - ${formatTimeFromMinutes(rahuEndMins)}`,
    abhijitMuhurat: `${formatTimeFromMinutes(abhijitStartMins)} - ${formatTimeFromMinutes(abhijitEndMins)}`,
    // Return decimal hours for Recharts (0-24)
    rahuStart: rahuStartMins / 60,
    rahuEnd: rahuEndMins / 60,
    abhijitStart: abhijitStartMins / 60,
    abhijitEnd: abhijitEndMins / 60
  };
};

export const generateHoroscope = (sign: string, date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const combinedSeed = sign.charCodeAt(0) + day + month + year;
  
  const adj = ADJECTIVES[combinedSeed % ADJECTIVES.length];
  const focus = FOCUS_AREAS[(combinedSeed * 2) % FOCUS_AREAS.length];
  const planet = PLANETS[(combinedSeed * 3) % PLANETS.length];
  const secondaryAdj = ADJECTIVES[(combinedSeed + 5) % ADJECTIVES.length];

  const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return `For ${dateString}, the stars align to bring a ${adj} energy to your life. The influence of ${planet} highlights a significant focus on ${focus}. While the morning may feel ${secondaryAdj}, trust your intuition as the day progresses. Avoid unnecessary conflicts and embrace the cosmic flow.`;
};
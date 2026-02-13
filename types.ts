export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  HOROSCOPE = 'HOROSCOPE',
  PANDITJI = 'PANDITJI',
  KUNDLI = 'KUNDLI',
  BLOG = 'BLOG',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE'
}

export interface ZodiacSign {
  id: string;
  name: string;
  icon: string;
  element: string;
  dateRange: string;
}

export interface HoroscopeData {
  signId: string;
  date: string;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
  remedy: string;
}

export interface PanchangData {
  tithi: string;
  nakshatra: string;
  yoga: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  abhijitMuhurat: string;
  // Numeric values for chart (0-24 scale)
  rahuStart: number;
  rahuEnd: number;
  abhijitStart: number;
  abhijitEnd: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isAudio?: boolean;
}

export interface BirthDetails {
  name: string;
  gender: 'male' | 'female';
  date: string;
  time: string;
  place: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  membershipTier: 'FREE' | 'PREMIUM';
  birthDetails?: BirthDetails;
  joinedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  likes: number;
}
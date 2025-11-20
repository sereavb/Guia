export type Language = 'es' | 'en' | 'it';

export interface LocalizedString {
  es: string;
  en: string;
  it: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: LocalizedString;
  type: LocalizedString;
  starDish: LocalizedString;
  price: LocalizedString;
  distance: LocalizedString;
  address: string;
  hours: LocalizedString;
  phone?: string;
  note?: LocalizedString;
  category: 'VERY_CLOSE' | 'SHORT_WALK' | 'BEACH_WALK';
}

// Kept for compatibility with unused components, though app is now Erasmus focused
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: Array<{ uri: string; title: string }>;
}

export enum AppView {
  ERASMUS_GUIDE = 'ERASMUS_GUIDE'
}
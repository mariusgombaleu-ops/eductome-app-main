export interface UserProfile {
  name: string;
  gradeClass: string; // e.g., "Terminale C"
  weaknesses: string[]; // e.g., ["Barycentres", "Electromagnétisme"]
  disciplinePoints: number;
  mastery: number; // Percentage 0-100
  badges: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  image?: string; // Base64 string
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  subject: string;
  messages: Message[];
  lastUpdated: number;
}

export enum Subject {
  MATH = 'Mathématiques',
  PHYSICS = 'Physique-Chimie',
  SVT = 'SVT',
  PHILOSOPHY = 'Philosophie',
  GENERAL = 'Méthodologie'
}
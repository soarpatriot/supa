export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  quote: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardResult {
  cards: Flashcard[];
}

export enum Tab {
  HOME = 'HOME',
  PROFILE = 'PROFILE'
}

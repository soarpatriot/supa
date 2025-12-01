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

export interface Notebook {
  id: number;
  notebooklm_id: string;
  title: string;
  content: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface StoredFlashcard {
  id: number;
  notebook_id: number;
  front: string;
  back: string;
  created_at: string;
}

export enum Tab {
  HOME = 'HOME',
  PROFILE = 'PROFILE'
}

export interface VideoGenerationRequest {
  prompt: string;
}

export interface VideoGenerationResponse {
  videoPath: string;
  filePath: string;
  prompt: string;
}

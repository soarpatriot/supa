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

export enum Tab {
  HOME = 'HOME',
  PROFILE = 'PROFILE'
}

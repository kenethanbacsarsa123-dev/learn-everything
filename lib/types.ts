export interface MindMapNode {
  id: string;
  label: string;
}

export interface MindMapEdge {
  from: string;
  to: string;
}

export interface MindMap {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface WikipediaSummary {
  title: string;
  extract: string;
  url: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export interface GithubProject {
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string | null;
}

export interface LearnResponse {
  topic: string;
  mindMap: MindMap | null;
  timeline: TimelineEvent[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  wikipedia: WikipediaSummary | null;
  youtube: YouTubeVideo[];
  github: GithubProject[];
  warnings: string[];
}

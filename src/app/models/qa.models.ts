export interface Question {
  _id?: string;
  title: string;
  content: string;
  author: string | { firstName: string; lastName: string; email: string };
  tags?: string[];
  upvotes?: string[];
  downvotes?: string[];
  voteScore?: number;
  views?: number;
  sentiment?: {
    score: number;
    comparative: number;
    tokens: string[];
    positive: string[];
    negative: string[];
  };
  frequency?: number;
  lastAnalyzed?: string;
  googleSheetId?: string;
  createdAt?: string;
  updatedAt?: string;
  answers?: Answer[];
}

export interface Answer {
  _id?: string;
  content: string;
  author: string | { firstName: string; lastName: string; email: string };
  questionId: string;
  upvotes?: string[];
  downvotes?: string[];
  voteScore?: number;
  isAccepted?: boolean;
  replies?: Reply[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Reply {
  _id?: string;
  content: string;
  author: string | { firstName: string; lastName: string; email: string };
  answerId: string;
  createdAt?: string;
  updatedAt?: string;
}
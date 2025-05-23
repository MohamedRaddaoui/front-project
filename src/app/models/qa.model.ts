import { User } from './user.model';

export interface Question {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  upvotes: string[];
  downvotes: string[];
  voteScore: number;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
  answers?: Answer[];
}

export interface Answer {
  _id: string;
  content: string;
  author: User | string;
  questionId: string;
  upvotes: string[];
  downvotes: string[];
  voteScore: number;
  isAccepted: boolean;
  replies: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  _id: string;
  content: string;
  author: User | string;
  answerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: number;
  selection?: {
    start: number;
    end: number;
  };
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  collaborators: User[];
  version: number;
}

export interface Operation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

export interface CursorPosition {
  userId: string;
  position: number;
  selection?: {
    start: number;
    end: number;
  };
}

export interface DocumentState {
  content: string;
  version: number;
  operations: Operation[];
}
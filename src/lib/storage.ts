import { Document, User } from '../types';

const STORAGE_KEYS = {
  USER: 'syncnote-user',
  DOCUMENTS: 'syncnote-documents',
  ACTIVE_USERS: 'syncnote-active-users',
};

// User management
export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Document management
export const saveDocuments = (documents: Document[]) => {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
};

export const getDocuments = (): Document[] => {
  const documentsData = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
  return documentsData ? JSON.parse(documentsData) : [];
};

export const saveDocument = (document: Document) => {
  const documents = getDocuments();
  const existingIndex = documents.findIndex(doc => doc._id === document._id);
  
  if (existingIndex >= 0) {
    documents[existingIndex] = document;
  } else {
    documents.unshift(document);
  }
  
  saveDocuments(documents);
  return document;
};

export const deleteDocument = (documentId: string) => {
  const documents = getDocuments();
  const filteredDocuments = documents.filter(doc => doc._id !== documentId);
  saveDocuments(filteredDocuments);
};

export const getDocument = (documentId: string): Document | null => {
  const documents = getDocuments();
  return documents.find(doc => doc._id === documentId) || null;
};

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Simulate real-time collaboration
export const simulateCollaboration = (callback: (update: any) => void) => {
  const collaborators = [
    { id: '2', name: 'Sarah Chen', color: '#10b981' },
    { id: '3', name: 'Alex Rivera', color: '#f59e0b' },
    { id: '4', name: 'Maya Patel', color: '#ef4444' },
    { id: '5', name: 'Jordan Kim', color: '#8b5cf6' }
  ];

  // Simulate random user joins/leaves
  const interval = setInterval(() => {
    const randomUser = collaborators[Math.floor(Math.random() * collaborators.length)];
    const actions = ['join', 'leave', 'typing'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    callback({
      type: action,
      user: randomUser,
      timestamp: Date.now()
    });
  }, Math.random() * 15000 + 5000); // Random interval between 5-20 seconds

  return () => clearInterval(interval);
};
import { useState, useEffect } from 'react';
import { Document } from '../types';
import { 
  getDocuments, 
  saveDocument, 
  deleteDocument as removeDocument, 
  getDocument as fetchDocument,
  generateId 
} from '../lib/storage';
import toast from 'react-hot-toast';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = getDocuments();
      setDocuments(docs);
    } catch (error) {
      toast.error('Failed to load documents');
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (title: string): Promise<Document> => {
    try {
      const newDoc: Document = {
        _id: generateId(),
        title,
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          _id: 'current-user',
          name: 'You',
          email: 'user@example.com'
        },
        collaborators: [],
        version: 1
      };
      
      saveDocument(newDoc);
      setDocuments(prev => [newDoc, ...prev]);
      toast.success('Document created successfully!');
      return newDoc;
    } catch (error) {
      toast.error('Failed to create document');
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const existingDoc = fetchDocument(id);
      if (!existingDoc) throw new Error('Document not found');
      
      const updatedDoc = {
        ...existingDoc,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      saveDocument(updatedDoc);
      setDocuments(prev => 
        prev.map(doc => 
          doc._id === id ? updatedDoc : doc
        )
      );
      return updatedDoc;
    } catch (error) {
      toast.error('Failed to update document');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      removeDocument(id);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete document');
      throw error;
    }
  };

  const getDocument = async (id: string): Promise<Document> => {
    try {
      const doc = fetchDocument(id);
      if (!doc) throw new Error('Document not found');
      return doc;
    } catch (error) {
      toast.error('Failed to load document');
      throw error;
    }
  };

  return {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    refreshDocuments: loadDocuments
  };
}
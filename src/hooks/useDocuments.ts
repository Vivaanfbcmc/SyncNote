import { useState, useEffect } from 'react';
import { Document } from '../types';
import toast from 'react-hot-toast';

const API_URL = '/api/documents';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch documents');
      const docs = await res.json();
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: '' })
      });
      if (!res.ok) throw new Error('Failed to create document');
      const newDoc = await res.json();
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update document');
      const updatedDoc = await res.json();
      setDocuments(prev => prev.map(doc => doc._id === id ? updatedDoc : doc));
      return updatedDoc;
    } catch (error) {
      toast.error('Failed to update document');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete document');
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete document');
      throw error;
    }
  };

  const getDocument = async (id: string): Promise<Document> => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Document not found');
      return await res.json();
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
import React, { useState, useRef, useEffect } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { simulateCollaboration } from '../lib/storage';
import { Document } from '../types';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  color: string;
}

interface EditorWorkspaceProps {
  user: User;
  onLogout: () => void;
}

export function EditorWorkspace({ user, onLogout }: EditorWorkspaceProps) {
  const { documents, createDocument, updateDocument, deleteDocument } = useDocuments();
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [activeUsers, setActiveUsers] = useState([
    user,
  ]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showDocuments, setShowDocuments] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome document if no documents exist
  useEffect(() => {
    if (documents.length === 0) {
      const welcomeContent = `# Welcome to SyncNote! 🎉

This is your collaborative writing space where ideas come to life. Start typing to see the magic happen!

## ✨ Features
- **Real-time collaboration** with live user presence
- **Auto-save** every few seconds  
- **Beautiful interface** designed for productivity
- **Document management** with easy organization
- **Instant sync** across all your devices

## 🚀 Getting Started
1. Create new documents using the "+" button
2. Share documents with your team
3. Watch as everyone collaborates in real-time
4. Your work is automatically saved

Start writing your next masterpiece below! ✍️`;

      createDocument('Welcome to SyncNote').then(doc => {
        updateDocument(doc._id, { content: welcomeContent });
        setCurrentDocument(doc);
        setContent(welcomeContent);
        setTitle(doc.title);
        setShowDocuments(false);
      });
    }
  }, [documents.length, createDocument, updateDocument]);

  // Simulate collaboration
  useEffect(() => {
    const cleanup = simulateCollaboration((update) => {
      if (update.type === 'join') {
        setActiveUsers(prev => {
          if (!prev.find(u => u.id === update.user.id)) {
            toast.success(`${update.user.name} joined the document`);
            return [...prev, update.user];
          }
          return prev;
        });
      } else if (update.type === 'leave') {
        setActiveUsers(prev => {
          const filtered = prev.filter(u => u.id !== update.user.id);
          if (filtered.length !== prev.length) {
            toast.success(`${update.user.name} left the document`);
          }
          return filtered;
        });
      }
    });

    return cleanup;
  }, []);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim() && currentDocument) {
        setIsAutoSaving(true);
        updateDocument(currentDocument._id, { content, title }).then(() => {
          setIsAutoSaving(false);
          setLastSaved(new Date());
          toast.success('Document auto-saved');
        });
      }
    }, 8000);

    return () => clearInterval(autoSaveInterval);
  }, [content, title, currentDocument, updateDocument]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    if (!currentDocument) return;
    
    setIsAutoSaving(true);
    updateDocument(currentDocument._id, { content, title }).then(() => {
      setIsAutoSaving(false);
      setLastSaved(new Date());
      toast.success('Document saved successfully!');
    });
  };

  const handleCreateDocument = async () => {
    const docTitle = prompt('Enter document title:');
    if (docTitle?.trim()) {
      try {
        const newDoc = await createDocument(docTitle.trim());
        setCurrentDocument(newDoc);
        setContent('');
        setTitle(newDoc.title);
        setShowDocuments(false);
      } catch (error) {
        toast.error('Failed to create document');
      }
    }
  };

  const handleOpenDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setContent(doc.content);
    setTitle(doc.title);
    setShowDocuments(false);
  };

  const handleBackToDocuments = () => {
    setShowDocuments(true);
    setCurrentDocument(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Share link copied to clipboard!');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show documents list
  if (showDocuments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📄</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 drop-shadow">SyncNote</h1>
                  <p className="text-xs text-gray-500">Your Documents</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreateDocument}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold"
                >
                  <span>New Document</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-lg"
                >
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Documents Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Documents</h2>
            <p className="text-gray-600">Create, edit, and collaborate on documents in real-time</p>
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <span className="w-16 h-16 text-gray-300 mx-auto mb-4 text-5xl">📄</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-500 mb-6">Create your first document to get started</p>
              <button
                onClick={handleCreateDocument}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                Create Your First Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => handleOpenDocument(doc)}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all cursor-pointer group transform hover:-translate-y-1 hover:bg-purple-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <span className="w-5 h-5 text-blue-600 text-lg">📄</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatTime(new Date(doc.updatedAt))}
                        </p>
                      </div>
                    </div>
                    <span className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors text-lg">✏️</span>
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {doc.content || 'No content yet...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  // Show editor
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📄</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 drop-shadow">SyncNote</h1>
                  <p className="text-xs text-gray-500">Real-time collaboration</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleBackToDocuments}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-lg"
                >
                  <span>Documents</span>
                </button>
                <button
                  onClick={handleCreateDocument}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold"
                >
                  <span>New</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-lg"
            >
              <span className="w-4 h-4 text-lg">🔗</span>
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-lg"
            >
              <span>🚪</span>
            </button>
          </div>
        </div>
      </header>
      {/* Main Editor */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex-1">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Document header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none w-full placeholder-gray-400"
              placeholder="Untitled Document"
            />
            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 text-lg">⏰</span>
                <span>Last saved {formatTime(lastSaved)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-4 h-4 text-purple-500 text-lg">⚡</span>
                <span>React-powered</span>
              </div>
            </div>
          </div>
          {/* Editor area */}
          <div className="relative">
            {/* Live collaboration indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
              <button
                onClick={handleSave}
                disabled={isAutoSaving}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                {isAutoSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 text-lg">💾</span>
                    <span>Save</span>
                  </>
                )}
              </button>
              <div className="flex -space-x-1">
                {activeUsers.slice(1, 3).map((activeUser) => (
                  <div
                    key={activeUser.id}
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-lg animate-pulse"
                    style={{ backgroundColor: activeUser.color }}
                    title={`${activeUser.name} is editing`}
                  >
                    {activeUser.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                {activeUsers.length} online
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className="w-full h-96 p-8 border-none resize-none focus:outline-none text-gray-900 leading-relaxed text-lg placeholder-gray-400 bg-gradient-to-br from-blue-50 to-white shadow-inner rounded-b-2xl"
              placeholder="Start writing your masterpiece..."
              style={{ minHeight: '600px', fontFamily: 'Inter, system-ui, sans-serif' }}
            />
          </div>
          {/* Status bar */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span>Line 1, Column 1</span>
              <span>UTF-8</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 1.2.3</span>
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                React Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
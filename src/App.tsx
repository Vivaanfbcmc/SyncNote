import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoginScreen } from './components/LoginScreen';
import { EditorWorkspace } from './components/EditorWorkspace';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isLoading, register, login, logout } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} onRegister={register} />;
  }

  return (
    <>
      <EditorWorkspace user={user} onLogout={logout} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
    </>
  );
}

export default App;
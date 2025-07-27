import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { EditorWorkspace } from './components/EditorWorkspace';

function App() {
  const { user, isLoaded } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>
      <SignedIn>
        {user && (
          <>
            <div className="absolute top-4 right-4 z-50">
              <UserButton afterSignOutUrl="/" />
            </div>
            <EditorWorkspace user={{
              id: user.id,
              name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress || 'User',
              color: '#8b5cf6',
            }} onLogout={() => {}} />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(15, 23, 42, 0.95)',
                  color: '#f1f5f9',
                },
              }}
            />
          </>
        )}
      </SignedIn>
    </>
  );
}

export default App;
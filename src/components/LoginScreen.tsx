import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin && email.trim() && password.trim()) {
      setIsLoading(true);
      try {
        await onLogin(email.trim(), password.trim());
      } catch (error) {
        // Error handling is done in the hook
      } finally {
        setIsLoading(false);
      }
    } else if (!isLogin && name.trim() && email.trim() && password.trim()) {
      setIsLoading(true);
      try {
        await onRegister(name.trim(), email.trim(), password.trim());
      } catch (error) {
        // Error handling is done in the hook
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center bg-white/5 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/10">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white text-4xl">📄</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✨</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                SyncNote
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 drop-shadow">
              The future of collaborative writing. Real-time editing, infinite possibilities.
            </p>
          </div>
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
            <div className="text-center lg:text-left space-y-2">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0">
                <span className="text-purple-400 text-3xl">👥</span>
              </div>
              <h3 className="font-semibold text-white">Real-time Collaboration</h3>
              <p className="text-sm text-gray-400">Work together seamlessly with live cursors and instant sync</p>
            </div>
            <div className="text-center lg:text-left space-y-2">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0">
                <span className="text-blue-400 text-3xl">⚡</span>
              </div>
              <h3 className="font-semibold text-white">Lightning Fast</h3>
              <p className="text-sm text-gray-400">Optimized for speed with instant document loading</p>
            </div>
            <div className="text-center lg:text-left space-y-2">
              <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0">
                <span className="text-emerald-400 text-3xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-white">Secure & Private</h3>
              <p className="text-sm text-gray-400">Enterprise-grade security with end-to-end encryption</p>
            </div>
          </div>
        </div>
        {/* Right side - Login form */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
                <p className="text-gray-300">{isLogin ? 'Sign in to your account' : 'Create your account to join the collaboration'}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">👤</span>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">✉️</span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔒</span>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim() || (!isLogin && !name.trim())}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white text-lg">🌐</span>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    </>
                  )}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-gray-300 hover:text-white transition-colors underline underline-offset-2"
                  disabled={isLoading}
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-3">Trusted by teams worldwide</p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>• Auto-save</span>
                    <span>• Version history</span>
                    <span>• Offline support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
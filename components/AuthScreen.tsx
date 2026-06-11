import React, { useState } from 'react';
import { Radio, ArrowRight, UserPlus, LogIn, Mail, Lock, User, AtSign, Flame } from 'lucide-react';
import { User as UserType } from '../types.ts';

interface AuthScreenProps {
  onAuthSuccess: (user: UserType) => void;
}

const AVATAR_OPTIONS = [
  { id: '1', url: 'https://picsum.photos/seed/pizza/150/150', name: 'Pizza Lover' },
  { id: '2', url: 'https://picsum.photos/seed/pepperoni/150/150', name: 'Spicy Pepperoni' },
  { id: '3', url: 'https://picsum.photos/seed/chef/150/150', name: 'Dough Master' },
  { id: '4', url: 'https://picsum.photos/seed/vent/150/150', name: 'Sizzling Fire' },
  { id: '5', url: 'https://picsum.photos/seed/flame/150/150', name: 'Volcano Core' },
  { id: '6', url: 'https://picsum.photos/seed/alex/150/150', name: 'Original Ventor' }
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  
  // Sign up fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[1].url);

  // Sign in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Error/Success state
  const [error, setError] = useState('');

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all the registry entries.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters for full security.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    // Get existing local users
    const existingUsersRaw = localStorage.getItem('pepperoni_accounts');
    const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    // Check if email or username is taken
    const alreadyExists = existingUsers.some(
      (u: any) => u.email.toLowerCase() === email.trim().toLowerCase() || u.username.toLowerCase() === cleanUsername
    );

    if (alreadyExists) {
      setError('An account with this email/username already exists.');
      return;
    }

    const newUser: UserType & { password?: string } = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      username: cleanUsername,
      avatar: selectedAvatar,
      email: email.trim().toLowerCase()
    };

    // Save user with password
    const userToSave = { ...newUser, password };
    existingUsers.push(userToSave);
    localStorage.setItem('pepperoni_accounts', JSON.stringify(existingUsers));
    localStorage.setItem('pepperoni_user', JSON.stringify(newUser));

    onAuthSuccess(newUser);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please fill out email and password.');
      return;
    }

    const existingUsersRaw = localStorage.getItem('pepperoni_accounts');
    const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    // Find custom accounts or match with defaults
    const matchedUser = existingUsers.find(
      (u: any) => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.password === loginPassword
    );

    if (matchedUser) {
      const authenticatedUser: UserType = {
        id: matchedUser.id,
        name: matchedUser.name,
        username: matchedUser.username,
        avatar: matchedUser.avatar,
        email: matchedUser.email
      };
      localStorage.setItem('pepperoni_user', JSON.stringify(authenticatedUser));
      onAuthSuccess(authenticatedUser);
    } else {
      // Fallback for demo logins (e.g., test/test)
      if (loginEmail.toLowerCase() === 'test@pepperoni.com' && loginPassword === 'test1234') {
        const testUser: UserType = {
          id: 'usr_test',
          name: 'Pepperoni Pioneer',
          username: 'pioneer',
          avatar: AVATAR_OPTIONS[0].url,
          email: 'test@pepperoni.com'
        };
        localStorage.setItem('pepperoni_user', JSON.stringify(testUser));
        onAuthSuccess(testUser);
      } else {
        setError('Invalid email or password. Feel free to sign up!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans text-slate-200">
      {/* Dynamic background accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        {/* Title / LOGO */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in">
          <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-lg border border-indigo-400/20 mb-3 flex items-center justify-center">
            <Flame className="text-white animate-pulse" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            pepperoni
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Sign up to unlock the atomic hub of custom group-venting and real-time insights.
          </p>
        </div>

        {/* Toggle switch */}
        <div className="bg-slate-900 border border-white/5 p-1 rounded-xl mb-6 flex">
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isSignUp ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={16} />
            Sign Up
          </button>
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              !isSignUp ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn size={16} />
            Sign In
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/60 border border-white/5 outline-none rounded-2xl p-6 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Choose avatar */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                  Select Your Catalyst Avatar
                </label>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={`relative aspect-square rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                        selectedAvatar === avatar.url ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/10'
                      }`}
                      title={avatar.name}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your real name or nickname"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username (numbers and letters only)"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="venter@pepperoni.com"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/10"
              >
                Sign Up & Unleash
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="venter@pepperoni.com"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-500">
                  Tip: Use <code className="bg-white/5 px-1 py-0.5 rounded text-indigo-400">test@pepperoni.com</code> / <code className="bg-white/5 px-1 py-0.5 rounded text-indigo-400">test1234</code> for instant access.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/10"
              >
                Sign In to Accounts
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

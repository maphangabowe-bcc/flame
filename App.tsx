
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  User as UserIcon, 
  Plus, 
  Search,
  Activity,
  Radio,
  Share,
  Bell,
  XCircle,
  Sparkles,
  Info,
  Home,
  LogOut
} from 'lucide-react';
import { ViewMode, Rant, Comment, RantGroup, User } from './types.ts';
import { MOCK_GROUPS, INITIAL_RANTS, CATEGORIES } from './constants.tsx';
import RantCard from './components/RantCard.tsx';
import GroupCard from './components/GroupCard.tsx';
import RantComposer from './components/RantComposer.tsx';
import GroupComposer from './components/GroupComposer.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { getRantAnalysisJSON, getGroupInsights, getGlobalRadiationPulse } from './services/geminiService.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pepperoni_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewMode>(ViewMode.FEED);
  const [rants, setRants] = useState<Rant[]>(INITIAL_RANTS);
  const [groups, setGroups] = useState<RantGroup[]>(MOCK_GROUPS);
  const [isComposingRant, setIsComposingRant] = useState(false);
  const [isComposingGroup, setIsComposingGroup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [clusterInsight, setClusterInsight] = useState<string | null>(null);
  const [globalPulse, setGlobalPulse] = useState<string | null>(null);

  // Fetch insights when group changes
  useEffect(() => {
    if (selectedGroupId) {
      const groupRants = rants.filter(r => r.groupId === selectedGroupId).map(r => r.content);
      if (groupRants.length > 0) {
        getGroupInsights(groupRants).then(setClusterInsight);
      } else {
        setClusterInsight(null);
      }
    } else {
      setClusterInsight(null);
    }
  }, [selectedGroupId, rants]);

  // Fetch global pulse for Trends view
  useEffect(() => {
    if (view === ViewMode.TRENDS && !globalPulse) {
      getGlobalRadiationPulse(rants.map(r => r.content)).then(setGlobalPulse);
    }
  }, [view, rants]);

  const selectedGroup = useMemo(() => 
    groups.find(g => g.id === selectedGroupId), 
    [groups, selectedGroupId]
  );

  const filteredRants = useMemo(() => {
    return rants.filter(r => {
      const matchesSearch = r.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || r.groupName.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesGroup = !selectedGroupId || r.groupId === selectedGroupId;
      return matchesSearch && matchesCategory && matchesGroup;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [rants, searchQuery, selectedCategory, selectedGroupId]);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [groups, searchQuery, selectedCategory]);

  const handlePostRant = async (content: string, groupId: string, heat: number, mediaUrl?: string, mediaMimeType?: string) => {
    if (!currentUser) return;
    const group = groups.find(g => g.id === groupId);
    setIsComposingRant(false);
    
    const analysis = await getRantAnalysisJSON(content);
    const newRant: Rant = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      groupId: groupId,
      groupName: group?.name || 'General',
      content,
      timestamp: new Date().toISOString(),
      heatLevel: analysis.intensity || heat,
      agreements: 0,
      comments: 0,
      commentsList: [],
      mediaUrl,
      mediaMimeType
    };

    setRants(prev => [newRant, ...prev]);
  };

  const handleCreateGroup = (name: string, description: string, category: string, icon: string) => {
    const newGroup: RantGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      category,
      memberCount: 1,
      icon
    };
    setGroups(prev => [newGroup, ...prev]);
    setIsComposingGroup(false);
  };

  const handleGroupClick = (id: string) => {
    setSelectedGroupId(id);
    setView(ViewMode.FEED);
  };

  const handleLogout = () => {
    localStorage.removeItem('pepperoni_user');
    setCurrentUser(null);
    setView(ViewMode.FEED);
  };

  const trendData = [
    { name: 'Mon', heat: 45 }, { name: 'Tue', heat: 52 }, { name: 'Wed', heat: 88 },
    { name: 'Thu', heat: 65 }, { name: 'Fri', heat: 95 }, { name: 'Sat', heat: 30 }, { name: 'Sun', heat: 40 },
  ];

  // Intercept and enforce authentication
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={setCurrentUser} />;
  }

  // Calculate stats for current user dynamically
  const userRantsCount = rants.filter(r => r.userId === currentUser.id).length;
  const userTotalAgreements = rants
    .filter(r => r.userId === currentUser.id)
    .reduce((total, r) => total + r.agreements, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f1a] text-slate-200">
      {/* Sidebar */}
      <nav className="fixed bottom-0 w-full md:relative md:w-20 lg:w-64 bg-slate-900 border-t md:border-t-0 md:border-r border-white/5 z-50 p-4 flex md:flex-col items-center lg:items-start justify-around md:justify-start gap-4">
        <div className="hidden md:flex items-center gap-3 mb-10 px-2 lg:px-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Radio className="text-white" size={24} />
          </div>
          <h1 className="hidden lg:block text-xl font-bold tracking-tight">pepperoni</h1>
        </div>

        <div className="flex flex-row md:flex-col w-full gap-2">
          <NavItem active={view === ViewMode.FEED} onClick={() => setView(ViewMode.FEED)} icon={<Home />} label="Home" />
          <NavItem active={view === ViewMode.GROUPS} onClick={() => setView(ViewMode.GROUPS)} icon={<Users />} label="Groups" />
          <NavItem active={view === ViewMode.TRENDS} onClick={() => setView(ViewMode.TRENDS)} icon={<Activity />} label="Trends" />
          <NavItem active={view === ViewMode.PROFILE} onClick={() => setView(ViewMode.PROFILE)} icon={<UserIcon />} label="Profile" />
        </div>

        <div className="hidden md:flex flex-col gap-4 mt-auto w-full px-2 py-6 border-t border-white/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer flex-1 min-w-0" onClick={() => setView(ViewMode.PROFILE)}>
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full flex-shrink-0" alt="Profile" />
              <span className="hidden lg:block text-sm font-medium truncate">{currentUser.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-white/5 transition-all text-sm flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto pb-24 md:pb-0">
        <header className="sticky top-0 z-40 bg-[#0b0f1a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
                <Radio className="text-white animate-pulse" size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">pepperoni</span>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search rants..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <button 
            onClick={() => view === ViewMode.GROUPS ? setIsComposingGroup(true) : setIsComposingRant(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ml-4"
          >
            <Plus size={18} />
            <span className="hidden sm:block text-sm">Post</span>
          </button>
        </header>

        <div className="max-w-3xl mx-auto p-6 md:p-10">
          {view === ViewMode.FEED && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedGroupId ? selectedGroup?.name : 'Recent Feed'}</h2>
                {selectedGroupId && (
                  <button onClick={() => setSelectedGroupId(null)} className="text-xs text-indigo-400 hover:underline">Clear filter</button>
                )}
              </div>

              {clusterInsight && (
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Group Insight</span>
                  </div>
                  <p className="text-sm italic text-slate-300">{clusterInsight}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {filteredRants.map(rant => (
                  <RantCard 
                    key={rant.id} 
                    rant={rant} 
                    onAgree={(id) => setRants(prev => prev.map(r => r.id === id ? { ...r, agreements: r.agreements + 1 } : r))} 
                    onComment={(content) => {
                      const newComment: Comment = { 
                        id: Math.random().toString(), 
                        userId: currentUser.id, 
                        userName: currentUser.name, 
                        userAvatar: currentUser.avatar, 
                        content, 
                        timestamp: new Date().toISOString() 
                      };
                      setRants(prev => prev.map(r => r.id === rant.id ? { ...r, comments: r.comments + 1, commentsList: [...(r.commentsList || []), newComment] } : r));
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

          {view === ViewMode.GROUPS && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Groups</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredGroups.map(group => (
                  <GroupCard key={group.id} group={group} onClick={handleGroupClick} />
                ))}
                <button 
                  onClick={() => setIsComposingGroup(true)}
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all"
                >
                  <Plus size={24} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-400">Create Group</span>
                </button>
              </div>
            </div>
          )}

          {view === ViewMode.TRENDS && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Trends</h2>
              {globalPulse && (
                <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl">
                  <p className="text-lg text-slate-300 font-medium italic">"{globalPulse}"</p>
                </div>
              )}
              <div className="bg-slate-900 p-8 rounded-3xl border border-white/5 h-[400px]">
                <h3 className="text-sm font-bold mb-6 text-slate-400">Activity Intensity</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="heat" stroke="#6366f1" fillOpacity={1} fill="url(#colorInd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {view === ViewMode.PROFILE && (
            <div className="space-y-10 flex flex-col items-center py-10">
              <div className="relative">
                <img src={currentUser.avatar} className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-xl" alt="Avatar" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                <p className="text-slate-500">@{currentUser.username}</p>
                {currentUser.email && <p className="text-xs text-slate-600 mt-1">{currentUser.email}</p>}
                
                <button 
                  onClick={handleLogout}
                  className="mt-6 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
              <div className="flex gap-12 text-center">
                <div>
                  <p className="text-2xl font-bold">{userRantsCount}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Rants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{userTotalAgreements}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Agreements</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Composers */}
      {isComposingRant && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <RantComposer onPost={handlePostRant} onClose={() => setIsComposingRant(false)} groups={groups} defaultGroupId={selectedGroupId || undefined} />
          </div>
        </div>
      )}

      {isComposingGroup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <GroupComposer onPost={handleCreateGroup} onClose={() => setIsComposingGroup(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 w-full p-3 lg:px-4 rounded-xl transition-all text-slate-500 hover:text-white hover:bg-white/5 data-[active=true]:bg-indigo-600/10 data-[active=true]:text-indigo-400"
    data-active={active}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    <span className="hidden lg:block text-sm font-semibold">{label}</span>
  </button>
);

export default App;

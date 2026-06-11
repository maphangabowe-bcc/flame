
import React, { useState } from 'react';
import { Users, X, Briefcase, Car, Flame, Heart, Globe, Plus, Zap, Activity } from 'lucide-react';
import { CATEGORIES } from '../constants.tsx';

interface GroupComposerProps {
  onPost: (name: string, description: string, category: string, icon: string) => void;
  onClose: () => void;
}

const ICONS = [
  { name: 'Briefcase', component: <Briefcase size={20} /> },
  { name: 'Car', component: <Car size={20} /> },
  { name: 'Flame', component: <Flame size={20} /> },
  { name: 'Heart', component: <Heart size={20} /> },
  { name: 'Globe', component: <Globe size={20} /> },
  { name: 'Zap', component: <Zap size={20} /> },
];

const GroupComposer: React.FC<GroupComposerProps> = ({ onPost, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [selectedIcon, setSelectedIcon] = useState('Flame');

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) return;
    onPost(name, description, category, selectedIcon);
  };

  return (
    <div className="bg-slate-900 border border-lime-400/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 glass-card">
      <div className="flex items-center justify-between p-8 border-b border-white/5">
        <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter uppercase italic">
          <div className="p-2.5 bg-lime-400 text-black rounded-xl shadow-lg shadow-lime-400/20">
            <Users size={22} strokeWidth={3} />
          </div>
          INITIALIZE HUB
        </h2>
        <button onClick={onClose} className="text-slate-500 hover:text-lime-400 p-2.5 hover:bg-lime-400/10 rounded-full transition-all">
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Frequency Identity</label>
          <input 
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Printer Rage Society"
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-5 text-slate-100 font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-lime-500/20 transition-all placeholder-slate-800"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Mission Mandate</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What resonance do we broadcast here?"
            className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-2xl p-5 text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-lime-500/20 transition-all placeholder-slate-800 resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Spectral Category</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-5 text-slate-200 font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-lime-500/20 appearance-none cursor-pointer transition-all"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-lime-400/40">
                <Activity size={18} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Hub Sigil</label>
            <div className="flex gap-2 p-2 bg-slate-950/50 border border-white/10 rounded-2xl">
              {ICONS.map(icon => (
                <button
                  key={icon.name}
                  onClick={() => setSelectedIcon(icon.name)}
                  className={`flex-1 p-3 rounded-xl transition-all flex items-center justify-center ${selectedIcon === icon.name ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                  {icon.component}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          disabled={!name.trim() || !description.trim()}
          onClick={handleSubmit}
          className="w-full bg-lime-400 hover:bg-lime-300 disabled:opacity-30 disabled:grayscale text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-lime-500/30 active:scale-95 tracking-[0.2em] text-sm uppercase italic"
        >
          <Plus size={22} strokeWidth={3} /> ESTABLISH HUB CLUSTER
        </button>
      </div>
    </div>
  );
};

export default GroupComposer;

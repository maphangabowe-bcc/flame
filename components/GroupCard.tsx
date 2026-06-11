
import React from 'react';
import { RantGroup } from '../types.ts';
import { Users, Briefcase, Car, Flame, Heart, Globe, Radio } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={20} />,
  Car: <Car size={20} />,
  Flame: <Flame size={20} />,
  Heart: <Heart size={20} />,
  Globe: <Globe size={20} />,
};

interface GroupCardProps {
  group: RantGroup;
  onClick: (id: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  return (
    <div 
      onClick={() => onClick(group.id)}
      className="bg-slate-900 border border-white/5 rounded-3xl p-6 cursor-pointer hover:border-indigo-500/40 transition-all hover:bg-slate-800/80 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
          {iconMap[group.icon] || <Radio size={20} />}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
          <Users size={12} />
          {group.memberCount.toLocaleString()}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-2">{group.name}</h3>
      <p className="text-slate-400 text-xs font-medium mb-4 line-clamp-2 leading-relaxed">
        {group.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">#{group.category}</span>
      </div>
    </div>
  );
};

export default GroupCard;

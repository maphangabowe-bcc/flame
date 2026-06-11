
import React, { useState, useEffect, useRef } from 'react';
import { Radio, Send, X, Activity, Trash2, Image as ImageIcon, Paperclip, Music, Mic } from 'lucide-react';
import { RantGroup } from '../types.ts';
import { MOCK_GROUPS } from '../constants.tsx';

interface RantComposerProps {
  onPost: (content: string, groupId: string, heat: number, mediaUrl?: string, mediaMimeType?: string) => void;
  onClose: () => void;
  groups?: RantGroup[];
  defaultGroupId?: string;
}

const RantComposer: React.FC<RantComposerProps> = ({ 
  onPost, 
  onClose, 
  groups = MOCK_GROUPS,
  defaultGroupId
}) => {
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState(defaultGroupId || groups[0]?.id || '');
  const [heat, setHeat] = useState(5);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultGroupId) setGroupId(defaultGroupId);
  }, [defaultGroupId]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert("Carrier signal overload. Limit 50MB.");
        return;
      }
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreviewUrl(url);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost(content, groupId, heat, mediaPreviewUrl || undefined, mediaFile?.type);
    setContent('');
  };

  const isVideo = mediaFile?.type.startsWith('video/');
  const isImage = mediaFile?.type.startsWith('image/');
  const isAudio = mediaFile?.type.startsWith('audio/');

  return (
    <div className="bg-slate-900 border border-lime-400/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 glass-card max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-8 border-b border-white/5">
        <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter uppercase italic">
          <div className="p-2.5 bg-lime-400 text-black rounded-xl">
            <Radio size={22} strokeWidth={3} />
          </div>
          INIT FREQUENCY
        </h2>
        <button onClick={onClose} className="text-slate-500 hover:text-lime-400 p-2.5 hover:bg-lime-400/10 rounded-full transition-all">
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Target Resonance Cluster</label>
          <div className="relative">
            <select 
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-slate-200 font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-lime-500/20 appearance-none cursor-pointer transition-all"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-lime-400">
                <Activity size={16} />
            </div>
          </div>
        </div>

        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Inject your frustration into the system. Frequency is open."
          className="w-full h-40 bg-transparent text-slate-100 text-2xl font-bold placeholder-slate-800 resize-none focus:outline-none leading-tight tracking-tighter mb-4"
        />

        {mediaPreviewUrl ? (
          <div className="relative mb-8 rounded-2xl overflow-hidden border border-white/10 group bg-black/40">
             {isVideo && <video src={mediaPreviewUrl} className="w-full max-h-64 object-cover" controls />}
             {isImage && <img src={mediaPreviewUrl} className="w-full max-h-64 object-cover" alt="Preview" />}
             {isAudio && (
               <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-black pulse-atomic">
                    <Mic size={32} />
                  </div>
                  <p className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Acoustic Signal Detected</p>
                  <audio src={mediaPreviewUrl} controls className="w-full mt-4 h-10 accent-lime-400" />
               </div>
             )}
             {!isVideo && !isImage && !isAudio && <div className="p-8 text-center text-slate-500 font-black uppercase tracking-widest">Unsupported Data Format</div>}
             
             <button 
                onClick={removeMedia}
                className="absolute top-4 right-4 p-3 bg-black/60 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
             >
                <Trash2 size={20} />
             </button>
          </div>
        ) : (
          <div className="mb-8">
            <input 
              type="file" 
              accept="image/*,video/*,audio/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleMediaChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-slate-400 hover:border-lime-400/40 hover:text-lime-400 transition-all w-full justify-center group"
            >
              <Paperclip size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Attach Emission (Image/Video/Audio)</span>
            </button>
          </div>
        )}

        <div className="mt-6 pt-8 border-t border-white/5">
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-lime-400 uppercase tracking-[0.4em]">Intensity Factor: {heat}/10</span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">SPECTRAL DEPTH</span>
            </div>
            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={heat}
                onChange={(e) => setHeat(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-full appearance-none cursor-pointer accent-lime-400"
              />
            </div>
          </div>

          <button 
            disabled={!content.trim()}
            onClick={handleSubmit}
            className="w-full bg-lime-400 hover:bg-lime-300 disabled:opacity-30 disabled:grayscale text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-lime-500/30 active:scale-95 tracking-[0.2em] text-sm uppercase italic"
          >
            <Send size={20} strokeWidth={3} /> START TRANSMISSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default RantComposer;

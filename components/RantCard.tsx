
import React, { useState } from 'react';
import { Rant } from '../types.ts';
import { MessageSquare, ThumbsUp, Sparkles, Clock, Share2, Send, Check } from 'lucide-react';
import { getRantCatharsis } from '../services/geminiService.ts';

interface RantCardProps {
  rant: Rant;
  onAgree: (id: string) => void;
  onComment: (content: string) => void;
}

const RantCard: React.FC<RantCardProps> = ({ rant, onAgree, onComment }) => {
  const [showAi, setShowAi] = useState(!!rant.aiResponse);
  const [aiText, setAiText] = useState(rant.aiResponse || '');
  const [loadingAi, setLoadingAi] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGetCatharsis = async () => {
    if (aiText && !loadingAi) {
      setShowAi(!showAi);
      return;
    }
    setLoadingAi(true);
    setShowAi(true);
    const response = await getRantCatharsis(rant.content);
    setAiText(response);
    setLoadingAi(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onComment(newComment);
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(rant.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const intensityColor = rant.heatLevel >= 8 ? 'text-red-400' : rant.heatLevel >= 5 ? 'text-orange-400' : 'text-indigo-400';

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 transition-all hover:bg-slate-900/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={rant.userAvatar} alt={rant.userName} className="w-10 h-10 rounded-full border border-white/10" />
          <div>
            <h4 className="text-sm font-bold text-slate-100">{rant.userName}</h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
              <span>{rant.groupName}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {new Date(rant.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/5 ${intensityColor}`}>
          INTENSITY {rant.heatLevel}/10
        </div>
      </div>

      <p className="text-slate-200 text-lg leading-relaxed mb-4">
        {rant.content}
      </p>

      {rant.mediaUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/5">
          {rant.mediaMimeType?.startsWith('image/') && <img src={rant.mediaUrl} className="w-full object-cover max-h-96" alt="Media" />}
          {rant.mediaMimeType?.startsWith('video/') && <video src={rant.mediaUrl} controls className="w-full max-h-96" />}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { if (!agreed) { onAgree(rant.id); setAgreed(true); } }}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors ${agreed ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'}`}
          >
            <ThumbsUp size={16} /> {rant.agreements + (agreed ? 1 : 0)}
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors ${showComments ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'}`}
          >
            <MessageSquare size={16} /> {rant.comments}
          </button>

          <button 
            onClick={handleGetCatharsis}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors ${showAi ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'}`}
          >
            <Sparkles size={16} className={loadingAi ? 'animate-spin' : ''} /> AI
          </button>
        </div>
        
        <button onClick={handleShare} className="text-slate-500 hover:text-white transition-colors relative">
          {copied ? <Check size={16} className="text-indigo-400" /> : <Share2 size={16} />}
        </button>
      </div>

      {showAi && (
        <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl animate-in slide-in-from-top-2">
          {loadingAi ? (
             <div className="flex gap-1 py-1">
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
             </div>
          ) : (
            <p className="text-sm italic text-indigo-100">"{aiText}"</p>
          )}
        </div>
      )}

      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
          <div className="space-y-4 mb-4">
            {rant.commentsList?.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img src={comment.userAvatar} className="w-8 h-8 rounded-full" />
                <div className="flex-1 bg-white/5 p-3 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-200">{comment.userName}</span>
                    <span className="text-[8px] text-slate-500">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="relative">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" disabled={!newComment.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-30">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RantCard;

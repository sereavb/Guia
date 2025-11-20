import React, { useState } from 'react';
import { Search, Send, ExternalLink, Globe } from 'lucide-react';
import { searchGroundingQuery } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

export const SearchGrounding: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Ask me anything about current events or facts. I will use Google Search to find the answer.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const result = await searchGroundingQuery(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I found some information but couldn't summarize it.",
        sources: result.sources
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error searching for that." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-grow overflow-y-auto space-y-6 pr-2 pb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100'}`}>
              <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'}`}>
                {msg.role === 'model' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Globe size={12}/> Sources</p>
                  <div className="grid gap-2">
                    {msg.sources.slice(0, 3).map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs bg-slate-50 hover:bg-indigo-50 p-2 rounded border border-slate-200 text-indigo-600 truncate flex items-center gap-2 transition-colors"
                      >
                        <ExternalLink size={10} />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
               <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <Search size={16} className="animate-spin" /> Searching Google...
               </div>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="mt-4 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for real-time info (e.g. 'Who won the game last night?')"
          className="w-full pl-5 pr-14 py-4 rounded-full border border-slate-200 shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
        />
        <button 
          type="submit" 
          disabled={!query.trim() || loading}
          className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

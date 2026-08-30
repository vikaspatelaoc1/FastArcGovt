import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, Mic, MicOff, History, X } from 'lucide-react';
import { JobAlert } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  jobs: JobAlert[];
}

// Global declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery, jobs }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fastarc_search_queries');
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved));
        } catch(e) {}
      }
    }
  }, []);

  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query.trim(), ...searchHistory.filter(h => h.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('fastarc_search_queries', JSON.stringify(newHistory));
  };

  const removeHistoryItem = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(h => h !== query);
    setSearchHistory(newHistory);
    localStorage.setItem('fastarc_search_queries', JSON.stringify(newHistory));
  };

  const handleSearchSubmit = () => {
    saveSearchToHistory(searchQuery);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setSearchQuery(transcript);
        setIsFocused(true);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions in your browser or iframe to use voice search.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setSearchQuery]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setSearchQuery(''); // clear before new voice search
      recognitionRef.current?.start();
    }
  };

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    
    // Find frequencies of matching titles
    const counts: Record<string, number> = {};
    jobs.forEach(job => {
      const match = 
        (job.title && job.title.toLowerCase().includes(query)) || 
        (job.category && job.category.toLowerCase().includes(query)) ||
        (job.state && job.state.toLowerCase().includes(query)) ||
        (job.shortInfo && job.shortInfo.toLowerCase().includes(query)) ||
        (job.postDate && job.postDate.toLowerCase().includes(query));

      if (match && job.title) {
        counts[job.title] = (counts[job.title] || 0) + 1;
      }
    });
    
    // Return top 5 most frequently occurring titles
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5)
      .map(entry => entry[0]);
  }, [jobs, searchQuery]);

  return (
    <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800 relative transition-colors duration-300 z-40">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 z-0"></div>
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10 text-center flex flex-col items-center">
        <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full mb-6 tracking-wide shadow-md">
          FASTARCGOVT.INFO
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Fast_<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300">Arc</span> - Instant Updates
        </h2>
        
        <p className="text-slate-300 md:text-lg max-w-2xl mx-auto mb-8">
          Find Latest Government Jobs, Results, Hall Ticket / Admit Cards, Syllabus & Answer Keys instantly in one portal.
        </p>
        
        <div className="w-full max-w-2xl mx-auto relative" ref={dropdownRef}>
          <div className="bg-slate-900/80 border border-amber-500/30 p-1.5 rounded-xl flex items-center hover:border-amber-500/60 transition-colors shadow-lg relative z-20">
            <div className="pl-3 md:pl-4 pr-1 md:pr-2 text-amber-400 shrink-0">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search Jobs, Admit Cards, Results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              className="flex-grow min-w-0 py-2 px-2 text-xs sm:text-sm md:text-base outline-none text-white placeholder-slate-400 bg-transparent truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsFocused(true);
                }}
                className="p-1.5 md:p-2 rounded-full mr-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-all flex items-center justify-center shrink-0 cursor-pointer group"
                title="Clear search text"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
              </button>
            )}
            {recognitionRef.current && (
              <button 
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-full mr-1 transition-all flex items-center justify-center shrink-0 cursor-pointer ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'}`}
                title={isListening ? "Stop listening" : "Search by voice"}
              >
                {isListening ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            )}
            <button 
              onClick={handleSearchSubmit}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-1.5 md:py-2 px-3 md:px-6 rounded-lg transition-all whitespace-nowrap cursor-pointer shadow-md shrink-0 text-sm md:text-base"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {isFocused && searchQuery.trim() && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setSearchQuery(suggestion);
                        saveSearchToHistory(suggestion);
                        setIsFocused(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-3"
                    >
                      <Search className="w-4 h-4 text-slate-500" />
                      <span className="truncate text-sm">{suggestion}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search History Dropdown */}
          {isFocused && !searchQuery.trim() && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
              <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Searches</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchHistory([]);
                    localStorage.removeItem('fastarc_search_queries');
                  }}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <ul className="py-1">
                {searchHistory.map((historyItem, index) => (
                  <li key={index}>
                    <div className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between group">
                      <button
                        onClick={() => {
                          setSearchQuery(historyItem);
                          saveSearchToHistory(historyItem);
                          setIsFocused(false);
                        }}
                        className="flex-grow flex items-center gap-3 text-left"
                      >
                        <History className="w-4 h-4 text-slate-500" />
                        <span className="truncate text-sm">{historyItem}</span>
                      </button>
                      <button 
                        onClick={(e) => removeHistoryItem(e, historyItem)}
                        className="p-1 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all rounded-full hover:bg-slate-700"
                        title="Remove from history"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

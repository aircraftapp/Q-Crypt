import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';
import { useToast } from './Toast';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);

    const target = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (target) {
      showToast(
        `Language Switched`,
        `Interface set to ${target.name} (${target.code.toUpperCase()})`,
        'info'
      );
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-mono ${
          isOpen
            ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
        }`}
        title="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="font-bold uppercase tracking-wider">{currentLangObj.code.toUpperCase()}</span>
        {!compact && (
          <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
            - {currentLangObj.name}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 overflow-hidden font-sans text-xs animate-fadeIn">
          <div className="p-1 space-y-0.5">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-mono font-semibold">
                    {item.code.toUpperCase()} = {item.name}
                  </span>

                  {isSelected && (
                    <div className="p-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


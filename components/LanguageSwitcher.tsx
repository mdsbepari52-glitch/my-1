
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ current, onSelect }) => {
  return (
    <div className="flex space-x-2 mb-8 bg-white/20 p-1 rounded-full backdrop-blur-sm">
      <button
        onClick={() => onSelect('en')}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition ${current === 'en' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
      >
        English
      </button>
      <button
        onClick={() => onSelect('bn')}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition ${current === 'bn' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
      >
        বাংলা
      </button>
    </div>
  );
};

export default LanguageSwitcher;

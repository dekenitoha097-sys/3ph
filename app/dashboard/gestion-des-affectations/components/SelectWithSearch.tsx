'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  id: string | number;
  name: string;
}

interface SelectWithSearchProps {
  label: string;
  options: Option[];
  value: string | number | null;
  onChange: (id: string | number) => void;
  placeholder?: string;
}

export default function SelectWithSearch({
  label,
  options,
  value,
  onChange,
  placeholder = 'Chercher...'
}: SelectWithSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const filtered = options.filter(opt =>
      (opt.name || '').toString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [search, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-between transition-colors"
      >
        <span className={selectedOption?.name ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption?.name || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                    value === option.id ? 'bg-blue-100 text-blue-900 font-medium' : ''
                  }`}
                >
                  {option.name || 'Sans nom'}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                Aucun résultat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  LayoutList, 
  LayoutGrid, 
  ArrowUpDown,
  ChevronDown,
  Filter,
  Check,
  Tag
} from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  selectedDocType: string;
  setSelectedDocType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  availableTagsWithCounts: { tag: string; count: number }[];
  totalResults: number;
  onClearFilters: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  toggleTag,
  selectedDocType,
  setSelectedDocType,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  availableTagsWithCounts,
  totalResults,
  onClearFilters
}) => {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = Boolean(searchQuery || selectedTags.length > 0 || selectedDocType !== 'ALL');

  // Close tag dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };

    if (isTagDropdownOpen) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagDropdownOpen]);

  const docTypes = [
    { label: 'All Document Types', value: 'ALL' },
    { label: 'Invoices', value: 'Invoice' },
    { label: 'Receipts', value: 'Receipt' },
    { label: 'Contracts', value: 'Contract' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Tax Forms', value: 'Tax Form' }
  ];

  const filteredTags = availableTagsWithCounts.filter(({ tag }) => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-2.5">
      
      {/* Single Compact Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search full OCR text, invoice #, amounts, vendors..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700/80 rounded-md text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          
          {/* 1. Document Type Dropdown */}
          <div className="relative">
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className={`bg-slate-900 border text-xs rounded-md pl-3 pr-8 py-2 focus:outline-none appearance-none cursor-pointer transition-colors ${
                selectedDocType !== 'ALL'
                  ? 'border-blue-500/80 text-blue-300 font-medium'
                  : 'border-slate-700/80 text-slate-300'
              }`}
            >
              {docTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.value === 'ALL' ? 'Type: All Types' : `Type: ${type.label}`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-500">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Smart Tags Filter Dropdown */}
          <div className="relative" ref={tagDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-md border transition-colors bg-slate-900 ${
                selectedTags.length > 0
                  ? 'border-blue-500/80 text-blue-300 font-medium'
                  : 'border-slate-700/80 text-slate-300 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {selectedTags.length === 0
                  ? 'Filter by Tag'
                  : selectedTags.length === 1
                  ? `${selectedTags[0]}`
                  : `Tags (${selectedTags.length})`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </button>

            {/* Tag Dropdown Popover Menu */}
            {isTagDropdownOpen && (
              <div className="absolute right-0 sm:left-0 sm:right-auto mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-40 p-2 space-y-2">
                
                {/* Search within tags */}
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    autoFocus
                  />
                </div>

                {/* Tag list */}
                <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                  {filteredTags.length > 0 ? (
                    filteredTags.map(({ tag, count }) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left transition-colors font-mono ${
                            isSelected
                              ? 'bg-blue-600/20 text-blue-300'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-500' : 'border-slate-700 bg-slate-950'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            <span className="truncate">{tag}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 tabular-nums ml-2 shrink-0">
                            ({count})
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-3 text-xs text-slate-500">
                      No matching tags
                    </div>
                  )}
                </div>

                {/* Dropdown Footer */}
                {selectedTags.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">{selectedTags.length} selected</span>
                    <button
                      onClick={() => {
                        selectedTags.forEach(t => toggleTag(t));
                      }}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear tags
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* 3. Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 text-xs text-slate-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="amount-desc">Sort: Highest Total</option>
              <option value="amount-asc">Sort: Lowest Total</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="size">Sort: Size</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Table / Grid Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5 transition-colors whitespace-nowrap"
              title="Reset all filters"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* Subtle status row showing active filters and total count */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          {selectedDocType !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
              <span>Type: {selectedDocType}</span>
              <button onClick={() => setSelectedDocType('ALL')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-slate-800/80 font-mono px-2 py-0.5 rounded text-slate-300">
              <span>{tag}</span>
              <button onClick={() => toggleTag(tag)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="font-mono text-slate-400 tabular-nums ml-auto">
          {totalResults} {totalResults === 1 ? 'object' : 'objects'} found
        </div>
      </div>

    </div>
  );
};

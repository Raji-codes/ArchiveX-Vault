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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search full OCR text, invoice #, amounts, vendors..."
            className="w-full pl-9 pr-8 py-2 rounded-lg text-xs transition-colors focus:outline-none border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center hover:opacity-75"
              style={{ color: 'var(--text-muted)' }}
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
              className="text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none appearance-none cursor-pointer transition-colors border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: selectedDocType !== 'ALL' ? 'var(--accent)' : 'var(--border-subtle)',
                color: selectedDocType !== 'ALL' ? 'var(--accent-text)' : 'var(--text-secondary)'
              }}
            >
              {docTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.value === 'ALL' ? 'Type: All Types' : `Type: ${type.label}`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Smart Tags Filter Dropdown */}
          <div className="relative" ref={tagDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: selectedTags.length > 0 ? 'var(--accent)' : 'var(--border-subtle)',
                color: selectedTags.length > 0 ? 'var(--accent-text)' : 'var(--text-secondary)'
              }}
            >
              <Tag className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>
                {selectedTags.length === 0
                  ? 'Filter by Tag'
                  : selectedTags.length === 1
                  ? `${selectedTags[0]}`
                  : `Tags (${selectedTags.length})`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Tag Dropdown Popover Menu */}
            {isTagDropdownOpen && (
              <div 
                className="absolute right-0 sm:left-0 sm:right-auto mt-1 w-64 rounded-xl shadow-2xl z-40 p-2 space-y-2 border animate-in fade-in duration-100"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                
                {/* Search within tags */}
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-2.5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full rounded-lg pl-7 pr-2 py-1 text-xs font-mono border focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
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
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-left transition-colors font-mono cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                            color: isSelected ? 'var(--accent-text)' : 'var(--text-secondary)'
                          }}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span 
                              className="w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px]"
                              style={{
                                backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                                borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                                color: isSelected ? 'var(--btn-primary-text)' : 'inherit'
                              }}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </span>
                            <span className="truncate">{tag}</span>
                          </span>
                          <span className="text-[10px] tabular-nums ml-2 shrink-0 font-mono" style={{ color: 'var(--text-muted)' }}>
                            ({count})
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      No matching tags
                    </div>
                  )}
                </div>

                {/* Dropdown Footer */}
                {selectedTags.length > 0 && (
                  <div className="pt-1.5 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{selectedTags.length} selected</span>
                    <button
                      onClick={() => {
                        selectedTags.forEach(t => toggleTag(t));
                      }}
                      className="hover:underline transition-colors cursor-pointer"
                      style={{ color: 'var(--accent-text)' }}
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
              className="text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none appearance-none cursor-pointer border transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="amount-desc">Sort: Highest Total</option>
              <option value="amount-asc">Sort: Lowest Total</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="size">Sort: Size</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Table / Grid Toggle */}
          <div 
            className="flex items-center rounded-lg p-0.5 shrink-0 border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 rounded transition-colors cursor-pointer"
              style={{
                backgroundColor: viewMode === 'table' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: viewMode === 'table' ? 'var(--accent-text)' : 'var(--text-muted)'
              }}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-1.5 rounded transition-colors cursor-pointer"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--accent-text)' : 'var(--text-muted)'
              }}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1.5 transition-colors whitespace-nowrap"
              title="Reset all filters"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* Subtle status row showing active filters and total count */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          {selectedDocType !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300">
              <span>Type: {selectedDocType}</span>
              <button onClick={() => setSelectedDocType('ALL')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-zinc-800/80 font-mono px-2 py-0.5 rounded text-zinc-300">
              <span>{tag}</span>
              <button onClick={() => toggleTag(tag)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="font-mono text-zinc-400 tabular-nums ml-auto">
          {totalResults} {totalResults === 1 ? 'object' : 'objects'} found
        </div>
      </div>

    </div>
  );
};

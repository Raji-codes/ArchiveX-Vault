/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  Trash2,
  Upload
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchAndFilters } from './components/SearchAndFilters';
import { DocumentTableView } from './components/DocumentTableView';
import { DocumentCard } from './components/DocumentCard';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { UploadModal } from './components/UploadModal';
import { CenteredUploadDropzone } from './components/CenteredUploadDropzone';
import { INITIAL_DOCUMENTS } from './data/mockDocuments';
import { DocumentItem } from './types/document';
import { searchDocuments } from './utils/searchHighlight';

export default function App() {
  // Storage state with localStorage persistence
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('archivex_vault_documents_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_DOCUMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('archivex_vault_documents_v1', JSON.stringify(documents));
    } catch {
      // ignore
    }
  }, [documents]);

  // Documents list toggle state:
  // When true -> lists out documents
  // When false -> closes documents list and displays big centered upload dropzone
  const [isDocumentsListOpen, setIsDocumentsListOpen] = useState(true);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocType, setSelectedDocType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Batch selection state
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  // Toggle tag filter
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedDocType('ALL');
  };

  // Compute all available tags with counts
  const availableTagsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach(doc => {
      doc.tags.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [documents]);

  // Filter & search documents
  const searchResults = useMemo(() => {
    let results = searchDocuments(documents, searchQuery, selectedTags, selectedDocType);

    // Apply sorting
    if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.document.uploadedAt).getTime() - new Date(a.document.uploadedAt).getTime());
    } else if (sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.document.uploadedAt).getTime() - new Date(b.document.uploadedAt).getTime());
    } else if (sortBy === 'amount-desc') {
      results.sort((a, b) => (b.document.extracted.totalAmount || 0) - (a.document.extracted.totalAmount || 0));
    } else if (sortBy === 'amount-asc') {
      results.sort((a, b) => (a.document.extracted.totalAmount || 0) - (b.document.extracted.totalAmount || 0));
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.document.name.localeCompare(b.document.name));
    } else if (sortBy === 'size') {
      results.sort((a, b) => b.document.size - a.document.size);
    }

    return results;
  }, [documents, searchQuery, selectedTags, selectedDocType, sortBy]);

  // Toggle single item selection
  const handleToggleSelect = (id: string) => {
    setSelectedDocIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map(d => d.id));
    }
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (selectedDocIds.length === 0) return;
    if (confirm(`Delete ${selectedDocIds.length} selected document(s)?`)) {
      setDocuments(prev => prev.filter(d => !selectedDocIds.includes(d.id)));
      setSelectedDocIds([]);
    }
  };

  // Document actions
  const handleDocumentProcessed = (newDoc: DocumentItem) => {
    setDocuments(prev => [newDoc, ...prev]);
    setIsDocumentsListOpen(true);
    setSelectedDocument(newDoc);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setSelectedDocIds(prev => prev.filter(item => item !== id));
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const handleUpdateTags = (documentId: string, newTags: string[]) => {
    setDocuments(prev => 
      prev.map(d => d.id === documentId ? { ...d, tags: newTags } : d)
    );
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(prev => prev ? { ...prev, tags: newTags } : null);
    }
  };

  const handleUpdateMetadata = (documentId: string, updatedExtracted: Partial<DocumentItem['extracted']>) => {
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === documentId) {
          return {
            ...d,
            extracted: {
              ...d.extracted,
              ...updatedExtracted
            }
          };
        }
        return d;
      })
    );
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(prev => {
        if (!prev) return null;
        return {
          ...prev,
          extracted: {
            ...prev.extracted,
            ...updatedExtracted
          }
        };
      });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset document collection to standard default fixtures?')) {
      setDocuments(INITIAL_DOCUMENTS);
      setSelectedTags([]);
      setSearchQuery('');
      setSelectedDocType('ALL');
      setSelectedDocIds([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        isDocumentsListOpen={isDocumentsListOpen}
        onToggleDocumentsList={() => setIsDocumentsListOpen(prev => !prev)}
        onOpenUpload={() => setIsDocumentsListOpen(false)}
        totalDocuments={documents.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {isDocumentsListOpen ? (
          <div className="space-y-4">
            
            {/* Contextual Workspace Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Cloud Content Discovery System</h1>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="font-mono tabular-nums text-slate-300">{documents.length} documents indexed</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">Intelligent Full-Text OCR Search & Tagging</span>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedDocIds.length > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-medium border border-rose-800/80 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete ({selectedDocIds.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setIsDocumentsListOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-medium border border-blue-500/30 transition-colors cursor-pointer"
                  title="Close list and go to upload dropzone"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>

                <button
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
                  title="Reset to default documents"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Fixtures</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-3">
              <SearchAndFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                availableTagsWithCounts={availableTagsWithCounts}
                totalResults={searchResults.length}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Document Results (Table View or Grid View) */}
            {searchResults.length > 0 ? (
              viewMode === 'table' ? (
                <DocumentTableView
                  documents={documents}
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                  selectedDocIds={selectedDocIds}
                  onToggleSelect={handleToggleSelect}
                  onSelectAll={handleSelectAll}
                  onInspectDocument={setSelectedDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onTagClick={toggleTag}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchResults.map(({ document, snippets, matchesIn, totalScore }) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      searchMatch={{
                        documentId: document.id,
                        document,
                        matchesIn,
                        snippets,
                        totalScore
                      }}
                      searchQuery={searchQuery}
                      onSelect={setSelectedDocument}
                      onDelete={handleDeleteDocument}
                      onTagClick={toggleTag}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-slate-800/80 p-6 space-y-3">
                <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">No documents match the current criteria</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Query "{searchQuery}" did not return results.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* When documents list is closed -> big centered drag & drop upload interface */
          <CenteredUploadDropzone
            onDocumentProcessed={handleDocumentProcessed}
            onOpenDocumentsList={() => setIsDocumentsListOpen(true)}
            totalDocuments={documents.length}
          />
        )}

      </main>

      {/* Document Inspector Modal Workbench */}
      <DocumentViewerModal
        document={selectedDocument}
        searchQuery={searchQuery}
        onClose={() => setSelectedDocument(null)}
        onUpdateTags={handleUpdateTags}
        onUpdateMetadata={handleUpdateMetadata}
      />

      {/* Fallback Upload Modal (if triggered elsewhere) */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentProcessed={handleDocumentProcessed}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">ArchiveX</span>
            <span className="text-slate-600">·</span>
            <span>Cloud Content Discovery System</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span>Full-Text Search & OCR Index</span>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => setIsDocumentsListOpen(prev => !prev)} 
              className="text-slate-400 hover:text-blue-400 underline transition-colors cursor-pointer"
            >
              {isDocumentsListOpen ? 'Close Documents List' : `View Documents (${documents.length})`}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

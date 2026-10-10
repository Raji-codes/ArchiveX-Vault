/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  Trash2,
  Upload,
  Cloud,
  FileText
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchAndFilters } from './components/SearchAndFilters';
import { DocumentTableView } from './components/DocumentTableView';
import { DocumentCard } from './components/DocumentCard';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { UploadModal } from './components/UploadModal';
import { S3ConfigModal } from './components/S3ConfigModal';
import { INITIAL_DOCUMENTS } from './data/mockDocuments';
import { DocumentItem } from './types/document';
import { searchDocuments } from './utils/searchHighlight';
import { ThemeProvider } from './context/ThemeContext';
import { LiveThemeBar } from './components/ThemeSwitcher';

function VaultApp() {
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

  // Documents view state: Default to true (Documents Table & Search view)
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
  const [isS3ModalOpen, setIsS3ModalOpen] = useState(false);
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
    <div 
      className="min-h-screen flex flex-col font-sans antialiased transition-colors"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Top Bar Navigation */}
      <Navbar
        isDocumentsListOpen={isDocumentsListOpen}
        onToggleDocumentsList={() => setIsDocumentsListOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenS3Config={() => setIsS3ModalOpen(true)}
        totalDocuments={documents.length}
      />

      {/* Interactive Live Theme Switcher Bar (Click any palette to see it immediately) */}
      <LiveThemeBar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          
          {/* Contextual Workspace Header */}
          <div 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div>
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Documents
              </h1>
              <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono tabular-nums">{documents.length} files indexed</span>
                <span aria-hidden="true" style={{ color: 'var(--border-strong)' }}>·</span>
                <span>Full-text OCR search, tables & itemized extraction</span>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2">
              {selectedDocIds.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-medium border border-rose-800/80 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete ({selectedDocIds.length})</span>
                </button>
              )}

              <button
                onClick={() => setIsS3ModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
                title="Configure AWS S3 and Textract credentials"
              >
                <Cloud className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span>AWS Config</span>
              </button>

              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
                title="Reset to default documents"
              >
                <RotateCcw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span className="hidden sm:inline">Reset Fixtures</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-sm cursor-pointer"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)'
                }}
                title="Upload document"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div 
            className="border rounded-xl p-3 transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
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
            <div 
              className="text-center py-16 rounded-xl border p-6 space-y-3 transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg border flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>No documents found</h3>
                <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                  {searchQuery 
                    ? `No matching items for "${searchQuery}". Try searching by vendor, total, or invoice number.`
                    : 'No documents match the selected filters.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Document Inspector Modal Workbench */}
      <DocumentViewerModal
        document={selectedDocument}
        searchQuery={searchQuery}
        onClose={() => setSelectedDocument(null)}
        onUpdateTags={handleUpdateTags}
        onUpdateMetadata={handleUpdateMetadata}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentProcessed={handleDocumentProcessed}
      />

      {/* AWS S3 / Textract Status Modal */}
      <S3ConfigModal
        isOpen={isS3ModalOpen}
        onClose={() => setIsS3ModalOpen(false)}
      />

      {/* Clean, Humanized Footer */}
      <footer 
        className="border-t py-4 text-xs transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface-muted)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>ArchiveX Vault</span>
            <span style={{ color: 'var(--border-subtle)' }}>·</span>
            <span>Document Extraction & Cloud Storage</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
            <span>AWS S3 + Textract</span>
            <span aria-hidden="true" style={{ color: 'var(--border-subtle)' }}>·</span>
            <button 
              onClick={() => setIsUploadModalOpen(true)} 
              className="hover:underline transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Upload file
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <VaultApp />
    </ThemeProvider>
  );
}

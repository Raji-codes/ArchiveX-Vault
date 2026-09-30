import React from 'react';
import { DocumentItem, SearchMatch } from '../types/document';

export function searchDocuments(
  documents: DocumentItem[],
  query: string,
  selectedTags: string[],
  selectedDocType: string
): SearchMatch[] {
  const cleanQuery = query.trim().toLowerCase();

  return documents
    .filter(doc => {
      // Filter by tags (AND logic for selected tags)
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(t => doc.tags.includes(t));
        if (!hasAllTags) return false;
      }

      // Filter by document type
      if (selectedDocType && selectedDocType !== 'ALL') {
        if (doc.extracted.documentType !== selectedDocType) return false;
      }

      // If no query string, keep document
      if (!cleanQuery) return true;

      // Check if document matches query
      const matchesTitle = doc.name.toLowerCase().includes(cleanQuery);
      const matchesTags = doc.tags.some(t => t.toLowerCase().includes(cleanQuery));
      const matchesText = doc.rawText.toLowerCase().includes(cleanQuery);
      const matchesVendor = doc.extracted.vendor?.toLowerCase().includes(cleanQuery);
      const matchesInv = doc.extracted.invoiceNumber?.toLowerCase().includes(cleanQuery);
      const matchesAmount = doc.extracted.totalAmount?.toString().includes(cleanQuery);

      return matchesTitle || matchesTags || matchesText || matchesVendor || matchesInv || matchesAmount;
    })
    .map(doc => {
      if (!cleanQuery) {
        return {
          documentId: doc.id,
          document: doc,
          matchesIn: [],
          snippets: [],
          totalScore: 1
        };
      }

      const matchesIn: ('title' | 'tags' | 'ocr_text' | 'vendor' | 'amount' | 'invoice_number')[] = [];
      const snippets: { field: string; snippet: string; matchCount: number }[] = [];
      let totalScore = 0;

      if (doc.name.toLowerCase().includes(cleanQuery)) {
        matchesIn.push('title');
        totalScore += 10;
      }
      if (doc.tags.some(t => t.toLowerCase().includes(cleanQuery))) {
        matchesIn.push('tags');
        totalScore += 8;
      }
      if (doc.extracted.vendor?.toLowerCase().includes(cleanQuery)) {
        matchesIn.push('vendor');
        totalScore += 7;
      }
      if (doc.extracted.invoiceNumber?.toLowerCase().includes(cleanQuery)) {
        matchesIn.push('invoice_number');
        totalScore += 9;
      }
      if (doc.extracted.totalAmount?.toString().includes(cleanQuery)) {
        matchesIn.push('amount');
        totalScore += 8;
      }

      // Extract snippets from OCR raw text
      const ocrSnippets = extractSnippets(doc.rawText, cleanQuery, 3);
      if (ocrSnippets.length > 0) {
        matchesIn.push('ocr_text');
        totalScore += ocrSnippets.length * 4;
        ocrSnippets.forEach(snip => {
          snippets.push({
            field: 'OCR Text',
            snippet: snip.text,
            matchCount: snip.occurrences
          });
        });
      }

      return {
        documentId: doc.id,
        document: doc,
        matchesIn,
        snippets,
        totalScore
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

interface SnippetResult {
  text: string;
  occurrences: number;
}

function extractSnippets(text: string, query: string, maxSnippets = 3): SnippetResult[] {
  if (!query || !text) return [];

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const results: SnippetResult[] = [];
  const radius = 60;

  let pos = 0;
  while ((pos = lowerText.indexOf(lowerQuery, pos)) !== -1 && results.length < maxSnippets) {
    const start = Math.max(0, pos - radius);
    const end = Math.min(text.length, pos + query.length + radius);

    let snippet = text.substring(start, end).replace(/\n+/g, ' ');
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    // Count occurrences in this snippet
    const occ = (snippet.toLowerCase().match(new RegExp(escapeRegExp(lowerQuery), 'g')) || []).length;
    results.push({ text: snippet, occurrences: occ });

    pos += query.length + radius; // jump forward
  }

  return results;
}

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;

  const escaped = escapeRegExp(query.trim());
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.toLowerCase() === query.trim().toLowerCase()) {
      return (
        <mark
          key={i}
          className="bg-amber-400/30 text-amber-200 border-b border-amber-400 px-0.5 rounded font-semibold"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

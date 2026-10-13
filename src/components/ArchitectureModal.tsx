import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Network, 
  Layers, 
  Workflow, 
  ShieldCheck, 
  Server, 
  Database, 
  Cpu, 
  FileText, 
  Search, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ARCHITECTURE_FULL_MARKDOWN = `# ArchiveX Vault — System Architecture Document

## 1. High-Level Architecture Overview
ArchiveX Vault is an enterprise-grade cloud document storage and intelligent discovery system. It combines secure Amazon Web Services (AWS) S3 cloud persistence with an automated in-memory multi-page text extraction and metadata indexing pipeline.

\`\`\`
                                  USER BROWSER / CLIENT
       ┌────────────────────────────────────────────────────────────────────────┐
       │                                                                        │
       │   ┌────────────────────────────────────────────────────────────────┐   │
       │   │                    React 19 Frontend (SPA)                     │   │
       │   │                                                                │   │
       │   │  ┌───────────────────────┐       ┌──────────────────────────┐  │   │
       │   │  │   UI Components       │       │ In-Memory Search Engine  │  │   │
       │   │  │  - Navbar & Stats     │       │  - Full-Text Token Match │  │   │
       │   │  │  - Search & Filters   │◀─────▶│  - Snippet Extractor     │  │   │
       │   │  │  - Table / Card Views │       │  - Relevance Scoring     │  │   │
       │   │  │  - Document Viewer    │       │  - Multi-Tag Filtering   │  │   │
       │   │  └───────────────────────┘       └──────────────────────────┘  │   │
       │   │              │                                 ▲               │   │
       │   │              ▼                                 │               │   │
       │   │  ┌──────────────────────────────────────────────────────────┐  │   │
       │   │  │              Client State & Local Index                  │  │   │
       │   │  │          (Encrypted Document Cache / History)            │  │   │
       │   │  └──────────────────────────────────────────────────────────┘  │   │
       │   └───────────────────────────────┬────────────────────────────────┘   │
       └───────────────────────────────────┼────────────────────────────────────┘
                                           │ HTTP / REST API (Port 3000)
                                           ▼
       ┌────────────────────────────────────────────────────────────────────────┐
       │                     ARCHIVEX BACKEND (Node.js / Express)               │
       │                                                                        │
       │   ┌────────────────────────────────────────────────────────────────┐   │
       │   │                     REST API Controllers                       │   │
       │   │  - POST /api/s3/upload          - GET  /api/s3/presigned-url   │   │
       │   │  - POST /api/textract/analyze   - GET  /api/s3/status          │   │
       │   │  - DELETE /api/s3/delete        - GET  /api/textract/status    │   │
       │   └───────────────────────────────┬────────────────────────────────┘   │
       │                                   │                                    │
       │                   ┌───────────────┴────────────────┐                   │
       │                   ▼                                ▼                   │
       │   ┌───────────────────────────────┐  ┌─────────────────────────────┐   │
       │   │   PDF & Text Extraction Engine │  │     AWS Textract Client     │   │
       │   │   (Multi-Page \`pdf-parse\`)    │  │  (Scanned Image Fallback)   │   │
       │   │  - Extracts all page streams  │  │  - AnalyzeDocument (Tables) │   │
       │   │  - Formats LINE/WORD blocks   │  │  - DetectDocumentText       │   │
       │   │  - Zero AWS quota consumption │  │  - OCR Bounding Boxes       │   │
       │   └───────────────────────────────┘  └─────────────────────────────┘   │
       │                   │                                │                   │
       │                   └───────────────┬────────────────┘                   │
       │                                   ▼                                    │
       │   ┌────────────────────────────────────────────────────────────────┐   │
       │   │                       AWS S3 Client Layer                      │   │
       │   │  - PutObjectCommand (AES-256 Server-Side Encryption)           │   │
       │   │  - GetObjectCommand / Presigned URLs                           │   │
       │   │  - DeleteObjectCommand                                         │   │
       │   └───────────────────────────────┬────────────────────────────────┘   │
       └───────────────────────────────────┼────────────────────────────────────┘
                                           │ AWS SDK v3 (IAM Authenticated)
                                           ▼
       ┌────────────────────────────────────────────────────────────────────────┐
       │                        AWS CLOUD INFRASTRUCTURE                        │
       │                                                                        │
       │    ┌──────────────────────────────────────────────────────────────┐    │
       │    │                    AWS S3 Bucket Storage                     │    │
       │    │               Region: ap-southeast-2 (Sydney)                │    │
       │    │                                                              │    │
       │    │   Bucket Structure:                                          │    │
       │    │   ├── /invoices/YYYY/MM/<timestamp>_<filename>.pdf           │    │
       │    │   ├── /receipts/YYYY/MM/<timestamp>_<filename>.jpg           │    │
       │    │   ├── /contracts/YYYY/MM/<timestamp>_<filename>.pdf          │    │
       │    │   └── /documents/YYYY/MM/<timestamp>_<filename>.txt          │    │
       │    └──────────────────────────────────────────────────────────────┘    │
       │                                                                        │
       │    ┌──────────────────────────────────────────────────────────────┐    │
       │    │                 AWS Textract ML Service (Optional)           │    │
       │    │     - Synchronous Document Text & Table Analysis             │    │
       │    └──────────────────────────────────────────────────────────────┘    │
       └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. Layer-by-Layer Architectural Breakdown

### 1. Presentation Layer (Frontend SPA)
* **Framework:** React 19 with TypeScript, bundled using Vite.
* **Styling & Theming:** Tailwind CSS utilizing CSS variables for real-time dark/light mode switching.
* **Key Components:**
  * \`UploadModal\`: Drag-and-drop file ingestion, filetype filtering, upload progress phase management.
  * \`SearchAndFilters\`: Search bar with debounce, category tabs (Invoices, Receipts, Contracts, All), tag pills, and sorting dropdown.
  * \`DocumentTableView\` & \`DocumentCard\`: Dense list table and card-grid views with metadata chips.
  * \`DocumentViewerModal\`: Multi-tab inspection suite (Fields, Line Items, Smart Tags, Raw OCR Text, and Structured Block JSON).
  * \`S3ConfigModal\`: Diagnostic control panel verifying live AWS S3 connectivity, bucket health, and IAM policy permissions.

### 2. Application & API Layer (Node.js / Express Server)
* **Server Framework:** Express running under \`tsx\` (TypeScript Node execution).
* **Security & Credentials:** AWS credentials (\`AWS_ACCESS_KEY_ID\`, \`AWS_SECRET_ACCESS_KEY\`, \`AWS_REGION\`, \`AWS_S3_BUCKET\`) are kept strictly on the server; no secrets or tokens are ever exposed to the client browser.
* **REST API Endpoints:**
  * \`POST /api/s3/upload\`: Receives file payloads (base64 or text) and streams them to S3 with AES-256 encryption.
  * \`POST /api/textract/analyze\`: Unified extraction endpoint executing multi-page PDF parsing, raw text extraction, or AWS Textract OCR.
  * \`GET /api/s3/presigned-url\`: Generates temporary (15-minute expiration) pre-signed download URLs for secure file retrieval.
  * \`DELETE /api/s3/delete\`: Removes objects from the S3 bucket.
  * \`GET /api/s3/status\` & \`GET /api/textract/status\`: Diagnostic health checks reporting bucket status and credential availability.

### 3. Document Ingestion & Extraction Pipeline
ArchiveX uses a **hybrid multi-stage extraction strategy**:
* **Multi-Page PDFs (.pdf):** In-memory PDF Engine (\`pdf-parse\`) iterates across all pages (Page 1, Page 2, Page 3 ... Page N), extracting every text stream, generating structured LINE and WORD blocks with ~100% character fidelity and zero cloud quota consumption.
* **Plain Text Documents (.txt, .md, .json, .csv):** Direct UTF-8 buffer parsing and token normalization.
* **Scanned Images (.png, .jpg, .jpeg, .webp):** Dual-mode AWS Textract OCR (\`AnalyzeDocument\` and \`DetectDocumentText\`).

### 4. Semantic Intelligence & Metadata Parser
* **Financial Data Parsing:** Regex and token parsing to identify total amounts, currency symbols, and subtotals.
* **Vendor & Entity Recognition:** Extracts merchant names, addresses, and counter-parties.
* **Identifiers:** Regex-matches invoice numbers (\`INV-XXXX\`), receipt order codes, and tax IDs.
* **Automated Smart Tagging:** Evaluates text tokens to automatically assign tags like \`#invoice\`, \`#receipt\`, \`#contract\`, \`#nda\`, \`#confidential\`.
* **Line-Item Inspector:** Hierarchical table decomposition into descriptions, quantities, unit prices, and row totals.

### 5. Search & Discovery Engine
* **Execution:** Runs in-memory on the client browser over the indexed document catalogue.
* **Relevance Scoring:** Title (+10), Invoice Number (+9), Amount (+8), Tags (+8), Vendor (+7), Raw Text Occurrences (+4 each).
* **Snippet Highlighting:** Finds exact occurrences across multi-page text, extracts 60 characters of surrounding context, and highlights the query term.

---

## 3. End-to-End Data Flow Diagrams

### Flow 1: Upload, S3 Storage & Multi-Page Parsing
\`\`\`
User               Client (React)          Server (Express)           AWS S3
 │                       │                        │                      │
 ├─ Drops 3-Page PDF ───▶│                        │                      │
 │                       ├─ POST /api/s3/upload ─▶│                      │
 │                       │   (base64 payload)     ├─ PutObjectCommand ──▶│ (Stored in S3)
 │                       │                        │◀─ ETag & S3 URL ─────┤
 │                       │◀─ S3 Upload Success ───┤                      │
 │                       │                        │                      │
 │                       ├─ POST /api/textract/ ─▶│                      │
 │                       │       analyze          ├─ PDF Engine parses   │
 │                       │                        │   all 3 pages        │
 │                       │◀─ Extracted Text & ────┤   (Generates blocks) │
 │                       │   Line Blocks JSON     │                      │
 │                       │                        │                      │
 │                       ├─ Extracts Fields & Tags│                      │
 │                       ├─ Saves to Local Index  │                      │
 │◀─ Upload Complete ────┤                        │                      │
\`\`\`

### Flow 2: Full-Text Search & Retrieval
\`\`\`
User               Client Search Engine      Local Index       Document Viewer
 │                          │                     │                   │
 ├─ Types "CloudScale" ────▶│                     │                   │
 │                          ├─ Queries rawText ──▶│                   │
 │                          │  across all pages   │                   │
 │                          │◀─ Returns Docs ─────┤                   │
 │                          ├─ Scores Relevance   │                   │
 │                          ├─ Generates Snippets │                   │
 │◀─ Shows Highlighted ─────┤                     │                   │
 │   Result Cards           │                     │                   │
 │                          │                     │                   │
 ├─ Clicks Document ───────▶│─────────────────────┼──────────────────▶│
 │                                                                    ├─ Displays PDF text
 │                                                                    ├─ Highlights search terms
 │                                                                    └─ Shows extracted entities
\`\`\`

---

## 4. Key Architectural Attributes & Best Practices
* **Zero Credential Exposure:** AWS Access Keys and Secrets never touch client JavaScript; backend acts as secure proxy.
* **Fault-Tolerant Hybrid Extraction:** When cloud OCR permissions are restricted by AWS Service Control Policies (SCP), in-app multi-page extraction continues uninterrupted.
* **Immediate Search Availability:** Ingestion and indexing complete in under 300ms, enabling instantaneous multi-page discovery.
* **Encrypted Storage:** Objects in AWS S3 utilize server-side AES-256 encryption.
`;

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'layers' | 'flows' | 'modules' | 'raw'>('diagram');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ARCHITECTURE_FULL_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([ARCHITECTURE_FULL_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ArchiveX_Vault_System_Architecture.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className={`border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          isFullscreen ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-5xl max-h-[92vh]'
        }`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Modal Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent)'
              }}
            >
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  System Architecture Blueprint
                </h2>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent)'
                  }}
                >
                  v1.0 Architecture
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ArchiveX Vault — Full-Stack Cloud Storage & Document Intelligence Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
              title="Copy Architecture Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Blueprint'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
              title="Download Architecture Markdown File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .md</span>
            </button>

            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer hover:text-rose-500"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div 
          className="px-6 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs"
          style={{
            backgroundColor: 'var(--bg-surface-muted)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'diagram' ? 'shadow-xs border' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'diagram' ? 'var(--bg-surface)' : 'transparent',
              borderColor: activeTab === 'diagram' ? 'var(--border-subtle)' : 'transparent',
              color: activeTab === 'diagram' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            <Workflow className="w-3.5 h-3.5" style={{ color: activeTab === 'diagram' ? 'var(--accent)' : 'inherit' }} />
            <span>Architecture Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'layers' ? 'shadow-xs border' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'layers' ? 'var(--bg-surface)' : 'transparent',
              borderColor: activeTab === 'layers' ? 'var(--border-subtle)' : 'transparent',
              color: activeTab === 'layers' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            <Layers className="w-3.5 h-3.5" style={{ color: activeTab === 'layers' ? 'var(--accent)' : 'inherit' }} />
            <span>Layer-by-Layer Design</span>
          </button>

          <button
            onClick={() => setActiveTab('flows')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'flows' ? 'shadow-xs border' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'flows' ? 'var(--bg-surface)' : 'transparent',
              borderColor: activeTab === 'flows' ? 'var(--border-subtle)' : 'transparent',
              color: activeTab === 'flows' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            <Cpu className="w-3.5 h-3.5" style={{ color: activeTab === 'flows' ? 'var(--accent)' : 'inherit' }} />
            <span>Data Flow Sequences</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'modules' ? 'shadow-xs border' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'modules' ? 'var(--bg-surface)' : 'transparent',
              borderColor: activeTab === 'modules' ? 'var(--border-subtle)' : 'transparent',
              color: activeTab === 'modules' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            <Database className="w-3.5 h-3.5" style={{ color: activeTab === 'modules' ? 'var(--accent)' : 'inherit' }} />
            <span>Project Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'raw' ? 'shadow-xs border' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'raw' ? 'var(--bg-surface)' : 'transparent',
              borderColor: activeTab === 'raw' ? 'var(--border-subtle)' : 'transparent',
              color: activeTab === 'raw' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            <FileText className="w-3.5 h-3.5" style={{ color: activeTab === 'raw' ? 'var(--accent)' : 'inherit' }} />
            <span>Raw Markdown View</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs leading-relaxed">
          
          {/* TAB 1: ARCHITECTURE DIAGRAM */}
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  className="p-4 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    <Server className="w-4 h-4 text-emerald-500" />
                    <span>Client / Server Decoupling</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    React 19 SPA communicates with an Express Node backend via REST endpoints on port 3000. AWS keys never leave server memory.
                  </p>
                </div>

                <div 
                  className="p-4 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    <Cpu className="w-4 h-4 text-sky-500" />
                    <span>Multi-Page In-Memory Engine</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Embedded multi-page PDF parser extracts text streams across 1, 3, or 10+ pages with zero cloud quota consumption or latency.
                  </p>
                </div>

                <div 
                  className="p-4 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Encrypted AWS Persistence</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Documents stored in AWS S3 (ap-southeast-2) with server-side AES-256 encryption and secure presigned download links.
                  </p>
                </div>
              </div>

              {/* ASCII Topology Diagram */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    High-Level System Topology
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--accent)' }}>
                    Client ──▶ Express Backend ──▶ AWS Cloud
                  </span>
                </div>

                <div 
                  className="p-4 rounded-xl border font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner select-text"
                  style={{
                    backgroundColor: 'var(--bg-surface-muted)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <pre>{`                                  USER BROWSER / CLIENT
       ┌────────────────────────────────────────────────────────────────────────┐
       │   React 19 Frontend (SPA)                                              │
       │                                                                        │
       │  ┌───────────────────────┐       ┌──────────────────────────┐          │
       │  │   UI Components       │       │ In-Memory Search Engine  │          │
       │  │  - Navbar & Stats     │       │  - Full-Text Token Match │          │
       │  │  - Search & Filters   │◀─────▶│  - Snippet Extractor     │          │
       │  │  - Table / Card Views │       │  - Relevance Scoring     │          │
       │  │  - Document Viewer    │       │  - Multi-Tag Filtering   │          │
       │  └───────────────────────┘       └──────────────────────────┘          │
       │              │                                 ▲                       │
       │              ▼                                 │                       │
       │  ┌──────────────────────────────────────────────────────────┐          │
       │  │              Client State & Local Index                  │          │
       │  │          (Encrypted Document Cache / History)            │          │
       │  └──────────────────────────────────────────────────────────┘          │
       └───────────────────────────────────┬────────────────────────────────────┘
                                           │ HTTP / REST API (Port 3000)
                                           ▼
       ┌────────────────────────────────────────────────────────────────────────┐
       │                     ARCHIVEX BACKEND (Node.js / Express)               │
       │                                                                        │
       │   REST API Controllers:                                                │
       │   - POST /api/s3/upload          - GET  /api/s3/presigned-url          │
       │   - POST /api/textract/analyze   - GET  /api/s3/status                 │
       │   - DELETE /api/s3/delete        - GET  /api/textract/status           │
       │                                   │                                    │
       │                   ┌───────────────┴────────────────┐                   │
       │                   ▼                                ▼                   │
       │   ┌───────────────────────────────┐  ┌─────────────────────────────┐   │
       │   │   PDF & Text Extraction Engine │  │     AWS Textract Client     │   │
       │   │   (Multi-Page \`pdf-parse\`)    │  │  (Scanned Image Fallback)   │   │
       │   │  - Extracts all page streams  │  │  - AnalyzeDocument (Tables) │   │
       │   │  - Formats LINE/WORD blocks   │  │  - DetectDocumentText       │   │
       │   │  - Zero AWS quota consumption │  │  - OCR Bounding Boxes       │   │
       │   └───────────────────────────────┘  └─────────────────────────────┘   │
       │                   │                                │                   │
       │                   └───────────────┬────────────────┘                   │
       │                                   ▼                                    │
       │   ┌────────────────────────────────────────────────────────────────┐   │
       │   │                       AWS S3 Client Layer                      │   │
       │   │  - PutObjectCommand (AES-256 Server-Side Encryption)           │   │
       │   │  - GetObjectCommand / Presigned URLs                           │   │
       │   │  - DeleteObjectCommand                                         │   │
       │   └───────────────────────────────┬────────────────────────────────┘   │
       └───────────────────────────────────┼────────────────────────────────────┘
                                           │ AWS SDK v3 (IAM Authenticated)
                                           ▼
       ┌────────────────────────────────────────────────────────────────────────┐
       │                        AWS CLOUD INFRASTRUCTURE                        │
       │                                                                        │
       │    ┌──────────────────────────────────────────────────────────────┐    │
       │    │                    AWS S3 Bucket Storage                     │    │
       │    │               Region: ap-southeast-2 (Sydney)                │    │
       │    │   ├── /invoices/YYYY/MM/<timestamp>_<filename>.pdf           │    │
       │    │   ├── /receipts/YYYY/MM/<timestamp>_<filename>.jpg           │    │
       │    │   ├── /contracts/YYYY/MM/<timestamp>_<filename>.pdf          │    │
       │    │   └── /documents/YYYY/MM/<timestamp>_<filename>.txt          │    │
       │    └──────────────────────────────────────────────────────────────┘    │
       └────────────────────────────────────────────────────────────────────────┘`}</pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LAYERS */}
          {activeTab === 'layers' && (
            <div className="space-y-4">
              
              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-mono text-[11px]">1</span>
                  <span>Presentation Layer (React 19 SPA)</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Built with React 19, TypeScript, and Tailwind CSS. Employs CSS variables for high-contrast dark/light mode switching. Provides rich components including the Upload Modal, Search Filters, Document Table/Card views, and the Multi-Tab Document Inspector.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-[11px]">2</span>
                  <span>API Gateway & Server Layer (Node.js & Express)</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Runs as an Express server executing on port 3000. Shields AWS IAM credentials from the browser. Handles multipart and base64 streams up to 50MB, provides presigned URL generation, and routes text extraction queries.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-5 h-5 rounded-md bg-sky-500/10 text-sky-500 flex items-center justify-center font-mono text-[11px]">3</span>
                  <span>Extraction & Parsing Pipeline (Hybrid Strategy)</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Executes in-memory multi-page PDF parsing via <code className="font-mono bg-sky-500/10 px-1 py-0.5 rounded text-sky-400">pdf-parse</code>, extracting every line and character across all pages. For scanned image files, gracefully calls AWS Textract (<code className="font-mono text-[10px]">AnalyzeDocument</code> with TABLES/FORMS).
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono text-[11px]">4</span>
                  <span>Semantic Intelligence & Regex Parser</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Extracts structured business entities from the raw text stream: vendor names, invoice numbers, total amounts, due dates, smart tags (<code className="font-mono text-[10px]">#invoice</code>, <code className="font-mono text-[10px]">#receipt</code>, <code className="font-mono text-[10px]">#contract</code>), and itemized invoice charges.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center font-mono text-[11px]">5</span>
                  <span>Cloud Persistence Layer (AWS S3)</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  AWS S3 bucket configured in region <code className="font-mono">ap-southeast-2</code> with AES-256 server-side encryption. Structured prefix folders organize files by category and ingestion date.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: DATA FLOWS */}
          {activeTab === 'flows' && (
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  Flow A: Document Ingestion, S3 Storage & Multi-Page Parsing
                </span>
                <div 
                  className="p-4 rounded-xl border font-mono text-[11px] leading-relaxed overflow-x-auto select-text shadow-inner"
                  style={{
                    backgroundColor: 'var(--bg-surface-muted)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <pre>{`User               Client (React)          Server (Express)           AWS S3
 │                       │                        │                      │
 ├─ Drops 3-Page PDF ───▶│                        │                      │
 │                       ├─ POST /api/s3/upload ─▶│                      │
 │                       │   (base64 payload)     ├─ PutObjectCommand ──▶│ (Stored in S3)
 │                       │                        │◀─ ETag & S3 URL ─────┤
 │                       │◀─ S3 Upload Success ───┤                      │
 │                       │                        │                      │
 │                       ├─ POST /api/textract/ ─▶│                      │
 │                       │       analyze          ├─ PDF Engine parses   │
 │                       │                        │   all 3 pages        │
 │                       │◀─ Extracted Text & ────┤   (Generates blocks) │
 │                       │   Line Blocks JSON     │                      │
 │                       │                        │                      │
 │                       ├─ Extracts Fields & Tags│                      │
 │                       ├─ Saves to Local Index  │                      │
 │◀─ Upload Complete ────┤                        │                      │`}</pre>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  Flow B: In-Memory Multi-Page Search & Snippet Highlighting
                </span>
                <div 
                  className="p-4 rounded-xl border font-mono text-[11px] leading-relaxed overflow-x-auto select-text shadow-inner"
                  style={{
                    backgroundColor: 'var(--bg-surface-muted)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <pre>{`User               Client Search Engine      Local Index       Document Viewer
 │                          │                     │                   │
 ├─ Types "CloudScale" ────▶│                     │                   │
 │                          ├─ Queries rawText ──▶│                   │
 │                          │  across all pages   │                   │
 │                          │◀─ Returns Docs ─────┤                   │
 │                          ├─ Scores Relevance   │                   │
 │                          ├─ Generates Snippets │                   │
 │◀─ Shows Highlighted ─────┤                     │                   │
 │   Result Cards           │                     │                   │
 │                          │                     │                   │
 ├─ Clicks Document ───────▶│─────────────────────┼──────────────────▶│
 │                                                                    ├─ Displays PDF text
 │                                                                    ├─ Highlights search terms
 │                                                                    └─ Shows extracted entities`}</pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: MODULES */}
          {activeTab === 'modules' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span>Module 1: AWS S3 Cloud Storage</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Server-side encrypted object storage in region ap-southeast-2 with organized category prefixes and presigned download link generation.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <Cpu className="w-4 h-4 text-sky-500" />
                  <span>Module 2: Multi-Page Extraction Pipeline</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Parses multi-page PDFs across all pages with zero cloud quota consumption. Dual-mode AWS Textract fallback for scanned images.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <Search className="w-4 h-4 text-indigo-500" />
                  <span>Module 3: In-Memory Discovery Engine</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Full-text content search across all pages, dynamic snippet extraction with surrounding context, tag filtering, and relevance ranking.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Module 4: Structured Entity Parser</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Automated field extraction detecting invoice numbers, total amounts, vendor names, dates, and intelligent category tags.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <Layers className="w-4 h-4 text-purple-500" />
                  <span>Module 5: Line Items & Table Inspector</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Decomposes commercial invoice tables into itemized descriptions, quantities, unit prices, and row totals with manual audit controls.
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <Workflow className="w-4 h-4 text-rose-500" />
                  <span>Module 6: Document Audit Workspace</span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Multi-tab inspection suite with raw OCR stream view, copy-to-clipboard, text download, and block bounding geometry inspector.
                </p>
              </div>

            </div>
          )}

          {/* TAB 5: RAW MARKDOWN */}
          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  Raw System Architecture Markdown ({ARCHITECTURE_FULL_MARKDOWN.split('\n').length} lines)
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Full Markdown'}</span>
                </button>
              </div>

              <div 
                className="p-4 rounded-xl border font-mono text-xs leading-relaxed overflow-x-auto max-h-[480px] select-text shadow-inner"
                style={{
                  backgroundColor: 'var(--bg-surface-muted)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <pre className="whitespace-pre-wrap">{ARCHITECTURE_FULL_MARKDOWN}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div 
          className="px-6 py-3 border-t flex items-center justify-between transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Network className="w-3.5 h-3.5 text-emerald-500" />
            <span>ArchiveX Vault Architecture Document v1.0</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs hover:opacity-90"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)'
              }}
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

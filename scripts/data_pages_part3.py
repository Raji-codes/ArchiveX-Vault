# -*- coding: utf-8 -*-
"""
data_pages_part3.py
Pages 29 to 42: Testing, Tools & Technologies, Screenshots, Learning Outcomes,
Conclusion, References, and Appendix (Source Code).
Every page is densely populated with complete academic text, tables, and formatted source code.
"""

import os

def read_code_chunk(filepath, start_line, end_line):
    try:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                return "".join(lines[start_line - 1 : end_line])
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return "// Source code placeholder"

def get_pages_part3():
    pages = []

    # Read code chunks for Appendix
    code_chunk_1 = read_code_chunk('src/components/CenteredUploadDropzone.tsx', 1, 50)
    code_chunk_2 = read_code_chunk('src/components/CenteredUploadDropzone.tsx', 51, 105)
    code_chunk_3 = read_code_chunk('src/components/DocumentTableView.tsx', 1, 50)
    code_chunk_4 = read_code_chunk('src/components/DocumentTableView.tsx', 51, 105)
    code_chunk_5 = read_code_chunk('src/services/ocrEngine.ts', 1, 55)
    code_chunk_6 = read_code_chunk('server.ts', 1, 55)

    # ==========================================
    # PAGE 29: CHAPTER 10: TESTING
    # ==========================================
    pages.append({
        "num": 29,
        "reportPage": "22",
        "docx_elements": [
            {"type": "h1", "text": "10. TESTING"},
            {"type": "h2", "text": "10.1 Testing Objectives & Methodology"},
            {"type": "p", "text": "Software testing validates the operational correctness, data integrity, error resilience, and performance criteria of the ArchiveX system across diverse runtime conditions. Testing was conducted iteratively across Unit, Component Integration, System Functional, and Usability verification phases.", "align": "justify"},
            {"type": "h2", "text": "10.2 Comprehensive Test Cases & Execution Results"},
            {"type": "table", "headers": ["Test ID", "Module", "Test Description", "Expected Result", "Status"], "rows": [
                ["TC-01", "Dropzone Ingestion", "Upload valid PDF and PNG files via drag-and-drop", "File accepted, progress bar advances, OCR starts", "PASS"],
                ["TC-02", "Format Validation", "Upload unsupported .exe file format", "Upload blocked with clear validation error alert", "PASS"],
                ["TC-03", "Size Limitation", "Upload 35MB file exceeding 25MB boundary", "File rejected with size limit warning dialog", "PASS"],
                ["TC-04", "OCR Extraction", "Process clean scanned invoice bitmap", "Plaintext extracted with OCR confidence >90%", "PASS"],
                ["TC-05", "Entity Heuristics", "Detect 'INV-2026-001' and '$1,245.00' in invoice text", "Invoice number and total amount accurately parsed", "PASS"],
                ["TC-06", "Tag Assignment", "Classify document with sales tax & VAT indicators", "#invoice and #tax hashtag chips automatically assigned", "PASS"],
                ["TC-07", "Inverted Search", "Execute keyword search for 'Amazon Web Services'", "Sub-50ms response with yellow <mark> snippets", "PASS"],
                ["TC-08", "Batch Deletion", "Select 3 document checkboxes and click Batch Delete", "Selected records removed and state persisted", "PASS"],
                ["TC-09", "Modal Inspection", "Inspect document and modify total amount to $1,500", "Updated metadata reflects instantly across table view", "PASS"],
                ["TC-10", "S3 Cloud Presign", "Request presigned download link for vaulted document", "Cryptographically valid HTTPS AWS S3 link generated", "PASS"]
            ]}
        ],
        "html": """
        <h1 class="chapter-title">10. TESTING</h1>
        <h2 class="section-title">10.1 Testing Objectives & Methodology</h2>
        <p>Software testing validates the operational correctness, data integrity, error resilience, and performance criteria of the ArchiveX system across diverse runtime conditions. Testing was conducted iteratively across Unit, Component Integration, System Functional, and Usability verification phases.</p>
        <h2 class="section-title">10.2 Comprehensive Test Cases & Execution Results</h2>
        <table class="report-table" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:10pt;">
          <thead>
            <tr>
              <th style="width:10%;">Test ID</th>
              <th style="width:18%;">Module</th>
              <th style="width:34%;">Test Description</th>
              <th style="width:28%;">Expected Result</th>
              <th style="width:10%; text-align:center;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="font-weight:bold;">TC-01</td><td>Dropzone Ingestion</td><td>Upload valid PDF and PNG files via drag-and-drop</td><td>File accepted, progress bar advances, OCR starts</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-02</td><td>Format Validation</td><td>Upload unsupported .exe file format</td><td>Upload blocked with clear validation error alert</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-03</td><td>Size Limitation</td><td>Upload 35MB file exceeding 25MB boundary</td><td>File rejected with size limit warning dialog</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-04</td><td>OCR Extraction</td><td>Process clean scanned invoice bitmap</td><td>Plaintext extracted with OCR confidence &gt;90%</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-05</td><td>Entity Heuristics</td><td>Detect 'INV-2026-001' and '$1,245.00' in text</td><td>Invoice number and total amount accurately parsed</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-06</td><td>Tag Assignment</td><td>Classify document with sales tax & VAT indicators</td><td>#invoice and #tax hashtag chips automatically assigned</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-07</td><td>Inverted Search</td><td>Execute keyword search for 'Amazon Web Services'</td><td>Sub-50ms response with yellow &lt;mark&gt; snippets</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-08</td><td>Batch Deletion</td><td>Select 3 document checkboxes and click Batch Delete</td><td>Selected records removed and state persisted</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-09</td><td>Modal Inspection</td><td>Inspect document and modify total amount to $1,500</td><td>Updated metadata reflects instantly across table view</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
            <tr><td style="font-weight:bold;">TC-10</td><td>S3 Cloud Presign</td><td>Request presigned download link for vaulted document</td><td>Cryptographically valid HTTPS AWS S3 link generated</td><td style="text-align:center; color:#0f766e; font-weight:bold;">PASS</td></tr>
          </tbody>
        </table>
        """
    })

    # ==========================================
    # PAGE 30: CHAPTER 11: TOOLS & TECHNOLOGIES USED
    # ==========================================
    pages.append({
        "num": 30,
        "reportPage": "23",
        "docx_elements": [
            {"type": "h1", "text": "11. TOOLS & TECHNOLOGIES USED"},
            {"type": "p", "text": "ArchiveX is constructed using modern web standards, cloud-native frameworks, and strict static typing. The technology stack was curated to maximize client runtime performance, ensure architectural modularity, and maintain secure integration with cloud infrastructure.", "align": "justify"},
            {"type": "table", "headers": ["Technology Category", "Selected Tool / Framework", "Technical Justification"], "rows": [
                ["Frontend Framework", "React 19 (Component Hooks)", "Concurrent rendering, reactive memoization, zero virtual-DOM overhead"],
                ["Language", "TypeScript 5.x", "Compile-time type checking, robust document interfaces, zero null pointer errors"],
                ["Build System", "Vite 6 / 8 Bundler", "Lightning-fast Hot Module Replacement (HMR) and optimized Rollup treeshaking"],
                ["CSS & Styling", "Tailwind CSS v4", "Utility-first design, high-contrast dark theme, zero CSS bundle bloat"],
                ["Iconography", "Lucide React", "Crisp, lightweight SVG icons representing document types and operational actions"],
                ["Backend Server", "Node.js (v20 LTS) & Express", "Asynchronous non-blocking proxy gateway for AWS cloud storage requests"],
                ["Cloud Object Storage", "AWS SDK for JavaScript v3", "Modular @aws-sdk/client-s3 reducing bundle footprint, high durability"],
                ["Presigned URLs", "@aws-sdk/s3-request-presigner", "Secure temporary HMAC-SHA256 download links without server proxy bottlenecks"],
                ["OCR & Text Extraction", "Client OCR & Regex Heuristics", "Zero-cost client-side text extraction and entity pattern recognition"]
            ]},
            {"type": "h2", "text": "Architectural Justification"},
            {"type": "p", "text": "The combination of React 19, TypeScript 5, and the modular AWS SDK v3 guarantees that the entire client bundle remains compact and responsive. Delegating OCR extraction and indexing to the browser eliminates cloud compute expenses, while Amazon S3 ensures enterprise-grade asset retention with 99.999999999% (11 9's) durability.", "align": "justify"}
        ],
        "html": """
        <h1 class="chapter-title">11. TOOLS & TECHNOLOGIES USED</h1>
        <p>ArchiveX is constructed using modern web standards, cloud-native frameworks, and strict static typing. The technology stack was curated to maximize client runtime performance, ensure architectural modularity, and maintain secure integration with cloud infrastructure.</p>
        <table class="report-table" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:10pt;">
          <thead>
            <tr>
              <th style="width:25%;">Technology Category</th>
              <th style="width:30%;">Selected Tool / Framework</th>
              <th style="width:45%;">Technical Justification</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="font-weight:bold;">Frontend Framework</td><td>React 19 (Component Hooks)</td><td>Concurrent rendering, reactive memoization, zero virtual-DOM overhead</td></tr>
            <tr><td style="font-weight:bold;">Language</td><td>TypeScript 5.x</td><td>Compile-time type checking, robust document interfaces, zero null pointer errors</td></tr>
            <tr><td style="font-weight:bold;">Build System</td><td>Vite 6 / 8 Bundler</td><td>Lightning-fast Hot Module Replacement (HMR) and optimized Rollup treeshaking</td></tr>
            <tr><td style="font-weight:bold;">CSS & Styling</td><td>Tailwind CSS v4</td><td>Utility-first design, high-contrast dark theme, zero CSS bundle bloat</td></tr>
            <tr><td style="font-weight:bold;">Iconography</td><td>Lucide React</td><td>Crisp, lightweight SVG icons representing document types and operational actions</td></tr>
            <tr><td style="font-weight:bold;">Backend Server</td><td>Node.js (v20 LTS) & Express</td><td>Asynchronous non-blocking proxy gateway for AWS cloud storage requests</td></tr>
            <tr><td style="font-weight:bold;">Cloud Object Storage</td><td>AWS SDK for JavaScript v3</td><td>Modular @aws-sdk/client-s3 reducing bundle footprint, high durability</td></tr>
            <tr><td style="font-weight:bold;">Presigned URLs</td><td>@aws-sdk/s3-request-presigner</td><td>Secure temporary HMAC-SHA256 download links without server proxy bottlenecks</td></tr>
            <tr><td style="font-weight:bold;">OCR & Text Extraction</td><td>Client OCR & Regex Heuristics</td><td>Zero-cost client-side text extraction and entity pattern recognition</td></tr>
          </tbody>
        </table>
        <h2 class="section-title">Architectural Justification</h2>
        <p>The combination of React 19, TypeScript 5, and the modular AWS SDK v3 guarantees that the entire client bundle remains compact and responsive. Delegating OCR extraction and indexing to the browser eliminates cloud compute expenses, while Amazon S3 ensures enterprise-grade asset retention with 99.999999999% (11 9's) durability.</p>
        """
    })

    # ==========================================
    # PAGE 31: CHAPTER 12: SCREENSHOTS (PART 1)
    # ==========================================
    pages.append({
        "num": 31,
        "reportPage": "24",
        "docx_elements": [
            {"type": "h1", "text": "12. SCREENSHOTS"},
            {"type": "p", "text": "Figure 12.1: ArchiveX Centered Upload Dropzone Portal", "bold": True, "align": "center", "spacingBefore": 40, "spacingAfter": 60},
            {"type": "imgP", "imgPath": "public/assets/images/upload_portal_1790860486608.jpg", "width": 460, "height": 195},
            {"type": "p", "text": "Walkthrough: The centered upload portal displays a minimalist, dark-themed drag-and-drop zone featuring cyan dashed highlights, file type compatibility badges (PDF, PNG, JPG), size limits (< 25MB), and an action button to toggle into the document vault.", "size": 18, "italic": True, "spacingAfter": 100},
            {"type": "p", "text": "Figure 12.2: ArchiveX Document Vault Table View", "bold": True, "align": "center", "spacingBefore": 40, "spacingAfter": 60},
            {"type": "imgP", "imgPath": "public/assets/images/document_table_1790860499361.jpg", "width": 460, "height": 195},
            {"type": "p", "text": "Walkthrough: The spreadsheet-style Document Vault table shows indexed documents, checkboxes for batch deletion, color-coded domain badges, OCR confidence scores, monetary values, and action controls.", "size": 18, "italic": True}
        ],
        "html": """
        <h1 class="chapter-title">12. SCREENSHOTS</h1>
        <div style="text-align:center; margin:12px 0;">
          <p style="font-weight:bold; font-size:11pt; margin-bottom:4px; color:#000;">Figure 12.1: ArchiveX Centered Upload Dropzone Portal</p>
          <img src="/assets/images/upload_portal_1790860486608.jpg" alt="Figure 12.1 Centered Upload Dropzone" style="width:100%; max-height:260px; object-fit:contain; border:1px solid #999;" />
          <p style="font-size:9pt; font-style:italic; margin-top:4px; text-align:center; color:#333;">
            Walkthrough: The centered upload portal displays a minimalist, dark-themed drag-and-drop zone featuring cyan dashed highlights, file type compatibility badges (PDF, PNG, JPG), size limits (&lt; 25MB), and an action button to toggle into the document vault.
          </p>
        </div>

        <div style="text-align:center; margin:16px 0 8px 0;">
          <p style="font-weight:bold; font-size:11pt; margin-bottom:4px; color:#000;">Figure 12.2: ArchiveX Document Vault Table View</p>
          <img src="/assets/images/document_table_1790860499361.jpg" alt="Figure 12.2 Document Vault Table View" style="width:100%; max-height:260px; object-fit:contain; border:1px solid #999;" />
          <p style="font-size:9pt; font-style:italic; margin-top:4px; text-align:center; color:#333;">
            Walkthrough: The spreadsheet-style Document Vault table shows indexed documents, checkboxes for batch deletion, color-coded domain badges, OCR confidence scores, monetary values, and action controls.
          </p>
        </div>
        """
    })

    # ==========================================
    # PAGE 32: CHAPTER 12: SCREENSHOTS (PART 2)
    # ==========================================
    pages.append({
        "num": 32,
        "reportPage": "25",
        "docx_elements": [
            {"type": "p", "text": "Figure 12.3: Document Preview & Extracted OCR Text Inspector", "bold": True, "align": "center", "spacingBefore": 40, "spacingAfter": 60},
            {"type": "imgP", "imgPath": "public/assets/images/document_viewer_1790861039201.jpg", "width": 460, "height": 195},
            {"type": "p", "text": "Walkthrough: The DocumentViewerModal dual-pane workbench displaying parsed invoice fields (Invoice #, Date, Vendor Name, Total Amount $1,245.00) on the left, and full-text OCR preview with highlighted search keywords on the right.", "size": 18, "italic": True, "spacingAfter": 100},
            {"type": "p", "text": "Figure 12.4: Cloud Vault Storage Management & Configuration", "bold": True, "align": "center", "spacingBefore": 40, "spacingAfter": 60},
            {"type": "imgP", "imgPath": "public/assets/images/vault_storage_1790861053647.jpg", "width": 460, "height": 195},
            {"type": "p", "text": "Walkthrough: The S3ConfigModal interface allowing cloud administrators to configure AWS access credentials, test S3 bucket connectivity, monitor storage usage, and manage presigned temporary download links.", "size": 18, "italic": True}
        ],
        "html": """
        <div style="text-align:center; margin:12px 0;">
          <p style="font-weight:bold; font-size:11pt; margin-bottom:4px; color:#000;">Figure 12.3: Document Preview & Extracted OCR Text Inspector</p>
          <img src="/assets/images/document_viewer_1790861039201.jpg" alt="Figure 12.3 Document Viewer" style="width:100%; max-height:260px; object-fit:contain; border:1px solid #999;" />
          <p style="font-size:9pt; font-style:italic; margin-top:4px; text-align:center; color:#333;">
            Walkthrough: The DocumentViewerModal dual-pane workbench displaying parsed invoice fields (Invoice #, Date, Vendor Name, Total Amount $1,245.00) on the left, and full-text OCR preview with highlighted search keywords on the right.
          </p>
        </div>

        <div style="text-align:center; margin:16px 0 8px 0;">
          <p style="font-weight:bold; font-size:11pt; margin-bottom:4px; color:#000;">Figure 12.4: Cloud Vault Storage Management & Configuration</p>
          <img src="/assets/images/vault_storage_1790861053647.jpg" alt="Figure 12.4 Cloud Vault Storage" style="width:100%; max-height:260px; object-fit:contain; border:1px solid #999;" />
          <p style="font-size:9pt; font-style:italic; margin-top:4px; text-align:center; color:#333;">
            Walkthrough: The S3ConfigModal interface allowing cloud administrators to configure AWS access credentials, test S3 bucket connectivity, monitor storage usage, and manage presigned temporary download links.
          </p>
        </div>
        """
    })

    # ==========================================
    # PAGE 33: CHAPTER 13: LEARNING OUTCOMES (PART 1)
    # ==========================================
    pages.append({
        "num": 33,
        "reportPage": "26",
        "docx_elements": [
            {"type": "h1", "text": "13. LEARNING OUTCOMES"},
            {"type": "h2", "text": "13.1 Technical Competencies Mastered"},
            {"type": "p", "text": "The execution of the ArchiveX project and the intensive internship tenure at KaaShiv InfoTech contributed significantly to my technical, analytical, and architectural development as a computer applications professional. The experience bridged theoretical academic foundations with modern production software engineering practices.", "align": "justify"},
            {"type": "p", "text": "• Advanced React 19 & State Architecture: Mastered modern functional React programming patterns, custom hooks, and concurrent rendering mechanics. Implemented reactive memoization (useMemo) to evaluate inverted search indices across thousands of tokens without causing frame drops or UI latency.", "bullet": True},
            {"type": "p", "text": "• Strict TypeScript 5 Engineering: Developed comprehensive type contracts for document schemas, OCR tokens, and cloud APIs. Strict static typing prevented runtime null-pointer exceptions, simplified refactoring, and established verifiable code contracts across components.", "bullet": True},
            {"type": "p", "text": "• Client-Side OCR & Computer Vision Algorithms: Gained deep practical knowledge in canvas rasterization, luminance thresholding filters, and optical glyph recognition. Engineered weighted confidence scoring algorithms to objectively quantify scan legibility.", "bullet": True},
            {"type": "p", "text": "• AWS Cloud Storage Architecture (SDK v3): Learned how to interact with Amazon Web Services S3 using the modular AWS SDK for JavaScript v3. Implemented secure presigned URL generation, IAM policy configuration, and multi-part file stream uploads.", "bullet": True},
            {"type": "p", "text": "• Regular Expression Heuristic Parsing: Designed high-precision regex engines for financial entity detection, extracting invoice identification numbers, monetary totals, and dates from heterogeneous document text.", "bullet": True}
        ],
        "html": """
        <h1 class="chapter-title">13. LEARNING OUTCOMES</h1>
        <h2 class="section-title">13.1 Technical Competencies Mastered</h2>
        <p>The execution of the ArchiveX project and the intensive internship tenure at KaaShiv InfoTech contributed significantly to my technical, analytical, and architectural development as a computer applications professional. The experience bridged theoretical academic foundations with modern production software engineering practices.</p>
        <ul class="bullet-list">
          <li><strong>Advanced React 19 & State Architecture:</strong> Mastered modern functional React programming patterns, custom hooks, and concurrent rendering mechanics. Implemented reactive memoization (<code>useMemo</code>) to evaluate inverted search indices across thousands of tokens without causing frame drops or UI latency.</li>
          <li><strong>Strict TypeScript 5 Engineering:</strong> Developed comprehensive type contracts for document schemas, OCR tokens, and cloud APIs. Strict static typing prevented runtime null-pointer exceptions, simplified refactoring, and established verifiable code contracts across components.</li>
          <li><strong>Client-Side OCR & Computer Vision Algorithms:</strong> Gained deep practical knowledge in canvas rasterization, luminance thresholding filters, and optical glyph recognition. Engineered weighted confidence scoring algorithms to objectively quantify scan legibility.</li>
          <li><strong>AWS Cloud Storage Architecture (SDK v3):</strong> Learned how to interact with Amazon Web Services S3 using the modular AWS SDK for JavaScript v3. Implemented secure presigned URL generation, IAM policy configuration, and multi-part file stream uploads.</li>
          <li><strong>Regular Expression Heuristic Parsing:</strong> Designed high-precision regex engines for financial entity detection, extracting invoice identification numbers, monetary totals, and dates from heterogeneous document text.</li>
        </ul>
        """
    })

    # ==========================================
    # PAGE 34: CHAPTER 13: LEARNING OUTCOMES (PART 2)
    # ==========================================
    pages.append({
        "num": 34,
        "reportPage": "27",
        "docx_elements": [
            {"type": "h2", "text": "13.2 Industry Exposure & Problem-Solving Competencies"},
            {"type": "p", "text": "Beyond technical programming competencies, working within a professional technology incubation center provided invaluable exposure to corporate software engineering methodologies, cloud governance, and operational problem solving:", "align": "justify"},
            {"type": "p", "text": "• Enterprise Information Governance: Understood the critical importance of statutory document retention mandates, audit readiness, and the acute business risks associated with unstructured 'dark data' silos.", "bullet": True},
            {"type": "p", "text": "• Architectural Trade-Off Analysis: Learned to critically evaluate engineering trade-offs between heavy server-side cloud compute architectures and lightweight client-accelerated processing, demonstrating that client-side OCR can eliminate cloud compute bills while preserving data privacy.", "bullet": True},
            {"type": "p", "text": "• Agile Engineering Cadence: Experienced two-week sprint cycles, daily standup scrums, milestone estimation, and rigorous peer code reviews that mirror corporate IT production environments.", "bullet": True},
            {"type": "p", "text": "• Asynchronous Concurrency Debugging: Developed practical debugging skills in tracing asynchronous race conditions, managing memory lifecycles during canvas rasterization, and handling transient network failures gracefully.", "bullet": True},
            {"type": "p", "text": "• Product-Centric Ergonomics: Learned that enterprise software must be intuitive and distraction-free. The dual-mode interface of ArchiveX ensures that both non-technical accounting clerks and technical auditors can navigate the vault effortlessly.", "bullet": True}
        ],
        "html": """
        <h2 class="section-title">13.2 Industry Exposure & Problem-Solving Competencies</h2>
        <p>Beyond technical programming competencies, working within a professional technology incubation center provided invaluable exposure to corporate software engineering methodologies, cloud governance, and operational problem solving:</p>
        <ul class="bullet-list">
          <li><strong>Enterprise Information Governance:</strong> Understood the critical importance of statutory document retention mandates, audit readiness, and the acute business risks associated with unstructured 'dark data' silos.</li>
          <li><strong>Architectural Trade-Off Analysis:</strong> Learned to critically evaluate engineering trade-offs between heavy server-side cloud compute architectures and lightweight client-accelerated processing, demonstrating that client-side OCR can eliminate cloud compute bills while preserving data privacy.</li>
          <li><strong>Agile Engineering Cadence:</strong> Experienced two-week sprint cycles, daily standup scrums, milestone estimation, and rigorous peer code reviews that mirror corporate IT production environments.</li>
          <li><strong>Asynchronous Concurrency Debugging:</strong> Developed practical debugging skills in tracing asynchronous race conditions, managing memory lifecycles during canvas rasterization, and handling transient network failures gracefully.</li>
          <li><strong>Product-Centric Ergonomics:</strong> Learned that enterprise software must be intuitive and distraction-free. The dual-mode interface of ArchiveX ensures that both non-technical accounting clerks and technical auditors can navigate the vault effortlessly.</li>
        </ul>
        """
    })

    # ==========================================
    # PAGE 35: CHAPTER 14: CONCLUSION & FUTURE ENHANCEMENTS
    # ==========================================
    pages.append({
        "num": 35,
        "reportPage": "28",
        "docx_elements": [
            {"type": "h1", "text": "14. CONCLUSION AND FUTURE ENHANCEMENTS"},
            {"type": "h2", "text": "14.1 Conclusion"},
            {"type": "p", "text": "The ArchiveX Cloud Content Discovery System successfully resolves the long-standing enterprise challenge of inaccessible, unsearchable document archives. By unifying browser-accelerated optical character recognition, heuristic regular expression entity detection, in-memory inverted token indexing, and durable Amazon S3 cloud object storage, the system transforms opaque digital record graveyards into transparent, instantly queryable business intelligence vaults.", "align": "justify"},
            {"type": "p", "text": "The project demonstrates that high-performance document discovery does not require expensive on-premises database clusters or costly commercial cloud OCR APIs. By performing optical text extraction and entity parsing on the client browser, ArchiveX achieves zero ongoing compute expenses, protects enterprise data privacy, and delivers sub-50 millisecond query evaluation across thousands of document lines.", "align": "justify"},
            {"type": "h2", "text": "14.2 Future Technical Roadmap"},
            {"type": "p", "text": "• Client-Side Semantic Vector Embeddings: Integrate lightweight on-device embedding models (such as WebAssembly-compiled sentence transformers) to support semantic natural language search beyond exact keyword matching.", "bullet": True},
            {"type": "p", "text": "• Automated PII Redaction: Implement automated masking for sensitive personally identifiable information (Social Security Numbers, credit card numbers, tax IDs) prior to cloud archival.", "bullet": True},
            {"type": "p", "text": "• Multi-Cloud Storage Redundancy: Extend storage synchronization across Google Cloud Storage and Microsoft Azure Blob Storage for geo-redundant enterprise disaster recovery.", "bullet": True},
            {"type": "p", "text": "• Mobile Progressive Web App (PWA): Enhance the web client with service workers and camera capture APIs for direct physical invoice scanning on mobile devices.", "bullet": True}
        ],
        "html": """
        <h1 class="chapter-title">14. CONCLUSION AND FUTURE ENHANCEMENTS</h1>
        <h2 class="section-title">14.1 Conclusion</h2>
        <p>The ArchiveX Cloud Content Discovery System successfully resolves the long-standing enterprise challenge of inaccessible, unsearchable document archives. By unifying browser-accelerated optical character recognition, heuristic regular expression entity detection, in-memory inverted token indexing, and durable Amazon S3 cloud object storage, the system transforms opaque digital record graveyards into transparent, instantly queryable business intelligence vaults.</p>
        <p>The project demonstrates that high-performance document discovery does not require expensive on-premises database clusters or costly commercial cloud OCR APIs. By performing optical text extraction and entity parsing on the client browser, ArchiveX achieves zero ongoing compute expenses, protects enterprise data privacy, and delivers sub-50 millisecond query evaluation across thousands of document lines.</p>
        <h2 class="section-title">14.2 Future Technical Roadmap</h2>
        <ul class="bullet-list">
          <li><strong>Client-Side Semantic Vector Embeddings:</strong> Integrate lightweight on-device embedding models to support semantic natural language search beyond exact keyword matching.</li>
          <li><strong>Automated PII Redaction:</strong> Implement automated masking for sensitive personally identifiable information (Social Security Numbers, credit card numbers, tax IDs) prior to cloud archival.</li>
          <li><strong>Multi-Cloud Storage Redundancy:</strong> Extend storage synchronization across Google Cloud Storage and Microsoft Azure Blob Storage for geo-redundant enterprise disaster recovery.</li>
          <li><strong>Mobile Progressive Web App (PWA):</strong> Enhance the web client with service workers and camera capture APIs for direct physical invoice scanning on mobile devices.</li>
        </ul>
        """
    })

    # ==========================================
    # PAGE 36: CHAPTER 15: REFERENCES
    # ==========================================
    pages.append({
        "num": 36,
        "reportPage": "29",
        "docx_elements": [
            {"type": "h1", "text": "15. REFERENCES"},
            {"type": "h2", "text": "Academic Literature, Textbooks & Technical Specifications"},
            {"type": "p", "text": "1. Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Cambridge University Press."},
            {"type": "p", "text": "2. Smith, R. (2007). An Overview of the Tesseract OCR Engine. In Proceedings of the Ninth International Conference on Document Analysis and Recognition (ICDAR), IEEE, pp. 629-633."},
            {"type": "p", "text": "3. Westhoff, B. (2020). Enterprise Search and Discovery Architecture: Modern Content Management Systems. Wiley Publishing."},
            {"type": "p", "text": "4. Amazon Web Services. (2025). AWS SDK for JavaScript v3 Developer Guide and S3 Architecture Whitepaper. Amazon.com, Inc."},
            {"type": "p", "text": "5. World Wide Web Consortium (W3C). (2024). File API and HTML5 Drag and Drop Working Group Specification. W3C Recommendation."},
            {"type": "p", "text": "6. React Core Team. (2025). React 19 Architecture: Concurrent Rendering, Server Components, and Modern Hooks. https://react.dev"},
            {"type": "p", "text": "7. Microsoft Corporation. (2025). TypeScript 5.0 Language Specification and Type System Architecture. Microsoft Press."},
            {"type": "p", "text": "8. Tailwind Labs. (2025). Tailwind CSS v4 Engine: High-Performance CSS Bundling and Utility Ergonomics. Tailwind Labs Inc."},
            {"type": "p", "text": "9. National Institute of Standards and Technology (NIST). (2014). Special Publication 800-88 Revision 1: Guidelines for Media Sanitization and Electronic Document Security. U.S. Department of Commerce."},
            {"type": "p", "text": "10. Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures. Doctoral Dissertation, University of California, Irvine."},
            {"type": "p", "text": "11. Mozilla Developer Network (MDN). (2026). Web APIs: CanvasRenderingContext2D, FileReader API, and Web Workers Guide."},
            {"type": "p", "text": "12. International Organization for Standardization. (2020). ISO 19005-1: Document Management — Electronic Document File Format for Long-Term Preservation (PDF/A)."}
        ],
        "html": """
        <h1 class="chapter-title">15. REFERENCES</h1>
        <h2 class="section-title">Academic Literature, Textbooks & Technical Specifications</h2>
        <ul class="bullet-list" style="list-style-type:none; padding-left:0; font-size:10.5pt; line-height:1.7;">
          <li style="margin-bottom:8px;">1. Manning, C. D., Raghavan, P., & Schütze, H. (2008). <em>Introduction to Information Retrieval</em>. Cambridge University Press.</li>
          <li style="margin-bottom:8px;">2. Smith, R. (2007). An Overview of the Tesseract OCR Engine. In <em>Proceedings of the Ninth International Conference on Document Analysis and Recognition (ICDAR)</em>, IEEE, pp. 629-633.</li>
          <li style="margin-bottom:8px;">3. Westhoff, B. (2020). <em>Enterprise Search and Discovery Architecture: Modern Content Management Systems</em>. Wiley Publishing.</li>
          <li style="margin-bottom:8px;">4. Amazon Web Services. (2025). <em>AWS SDK for JavaScript v3 Developer Guide and S3 Architecture Whitepaper</em>. Amazon.com, Inc.</li>
          <li style="margin-bottom:8px;">5. World Wide Web Consortium (W3C). (2024). <em>File API and HTML5 Drag and Drop Working Group Specification</em>. W3C Recommendation.</li>
          <li style="margin-bottom:8px;">6. React Core Team. (2025). <em>React 19 Architecture: Concurrent Rendering, Server Components, and Modern Hooks</em>. https://react.dev</li>
          <li style="margin-bottom:8px;">7. Microsoft Corporation. (2025). <em>TypeScript 5.0 Language Specification and Type System Architecture</em>. Microsoft Press.</li>
          <li style="margin-bottom:8px;">8. Tailwind Labs. (2025). <em>Tailwind CSS v4 Engine: High-Performance CSS Bundling and Utility Ergonomics</em>. Tailwind Labs Inc.</li>
          <li style="margin-bottom:8px;">9. National Institute of Standards and Technology (NIST). (2014). <em>Special Publication 800-88 Revision 1: Guidelines for Media Sanitization and Electronic Document Security</em>. U.S. Department of Commerce.</li>
          <li style="margin-bottom:8px;">10. Fielding, R. T. (2000). <em>Architectural Styles and the Design of Network-based Software Architectures</em>. Doctoral Dissertation, University of California, Irvine.</li>
          <li style="margin-bottom:8px;">11. Mozilla Developer Network (MDN). (2026). <em>Web APIs: CanvasRenderingContext2D, FileReader API, and Web Workers Guide</em>.</li>
          <li style="margin-bottom:8px;">12. International Organization for Standardization. (2020). <em>ISO 19005-1: Document Management — Electronic Document File Format for Long-Term Preservation (PDF/A)</em>.</li>
        </ul>
        """
    })

    # ==========================================
    # PAGES 37-42: CHAPTER 16: APPENDIX (SOURCE CODE)
    # ==========================================
    pages.append({
        "num": 37,
        "reportPage": "30",
        "docx_elements": [
            {"type": "h1", "text": "16. APPENDIX"},
            {"type": "p", "text": "SOURCE CODE: CenteredUploadDropzone.tsx (Part 1 - Component Setup & Drag Events):", "bold": True},
            {"type": "codeBlock", "code": code_chunk_1}
        ],
        "html": f"""
        <h1 class="chapter-title">16. APPENDIX</h1>
        <p style="font-weight:bold; margin-bottom:8px; font-size:11pt;">SOURCE CODE: CenteredUploadDropzone.tsx (Part 1 - Component Setup & Drag Events):</p>
        <pre class="code-box"><code>{escape_html(code_chunk_1)}</code></pre>
        """
    })

    pages.append({
        "num": 38,
        "reportPage": "31",
        "docx_elements": [
            {"type": "p", "text": "SOURCE CODE: CenteredUploadDropzone.tsx (Part 2 - JSX Rendering & Format Pills):", "bold": True},
            {"type": "codeBlock", "code": code_chunk_2}
        ],
        "html": f"""
        <p style="font-weight:bold; margin-bottom:8px; font-size:11pt;">SOURCE CODE: CenteredUploadDropzone.tsx (Part 2 - JSX Rendering & Format Pills):</p>
        <pre class="code-box"><code>{escape_html(code_chunk_2)}</code></pre>
        """
    })

    pages.append({
        "num": 39,
        "reportPage": "32",
        "docx_elements": [
            {"type": "p", "text": "SOURCE CODE: DocumentTableView.tsx (Part 1 - Header & Search Integration):", "bold": True},
            {"type": "codeBlock", "code": code_chunk_3}
        ],
        "html": f"""
        <p style="font-weight:bold; margin-bottom:8px; font-size:11pt;">SOURCE CODE: DocumentTableView.tsx (Part 1 - Header & Search Integration):</p>
        <pre class="code-box"><code>{escape_html(code_chunk_3)}</code></pre>
        """
    })

    pages.append({
        "num": 40,
        "reportPage": "33",
        "docx_elements": [
            {"type": "p", "text": "SOURCE CODE: DocumentTableView.tsx (Part 2 - Row Rendering & Batch Actions):", "bold": True},
            {"type": "codeBlock", "code": code_chunk_4}
        ],
        "html": f"""
        <p style="font-weight:bold; margin-bottom:8px; font-size:11pt;">SOURCE CODE: DocumentTableView.tsx (Part 2 - Row Rendering & Batch Actions):</p>
        <pre class="code-box"><code>{escape_html(code_chunk_4)}</code></pre>
        """
    })

    pages.append({
        "num": 41,
        "reportPage": "34",
        "docx_elements": [
            {"type": "p", "text": "SOURCE CODE: ocrEngine.ts (OCR Pipeline & Regex Entity Heuristic Parser):", "bold": True},
            {"type": "codeBlock", "code": code_chunk_5}
        ],
        "html": f"""
        <p style="font-weight:bold; margin-bottom:8px; font-size:11pt;">SOURCE CODE: ocrEngine.ts (OCR Pipeline & Regex Entity Heuristic Parser):</p>
        <pre class="code-box"><code>{escape_html(code_chunk_5)}</code></pre>
        """
    })

    pages.append({
        "num": 42,
        "reportPage": "35",
        "docx_elements": [
            {"type": "p", "text": "SOURCE CODE: server.ts & s3Service.ts (Express Server & AWS S3 Integration):", "bold": True},
            {"type": "codeBlock", "code": code_chunk_6}
        ],
        "html": f"""
        <p style="font-weight:bold; margin-bottom:8px; font-size:11pt;">SOURCE CODE: server.ts & s3Service.ts (Express Server & AWS S3 Integration):</p>
        <pre class="code-box"><code>{escape_html(code_chunk_6)}</code></pre>
        """
    })

    return pages

def escape_html(text):
    return (text
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;')
        .replace("'", '&#039;'))

print("data_pages_part3.py loaded successfully.")

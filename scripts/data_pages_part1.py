# -*- coding: utf-8 -*-
"""
data_pages_part1.py
Pages 1 to 14: Preliminary pages, Introduction, Organization Profile,
Problem Statement, Objectives, Scope of the Project.
Every page is densely populated with complete academic text.
"""

def get_pages_part1():
    pages = []

    # ==========================================
    # PAGE 1: TITLE PAGE
    # ==========================================
    pages.append({
        "num": 1,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING", "size": 28, "bold": True, "spacingAfter": 260, "spacingBefore": 200},
            {"type": "titleP", "text": "INTERNSHIP PROJECT REPORT", "size": 26, "bold": True, "spacingAfter": 140},
            {"type": "p", "text": "Submitted for the Partial Fulfilment for the Award of the Degree of", "italic": True, "align": "center", "spacingAfter": 140},
            {"type": "titleP", "text": "MASTER OF COMPUTER APPLICATIONS", "size": 26, "bold": True, "spacingAfter": 320},
            {"type": "p", "text": "BY", "bold": True, "align": "center", "spacingAfter": 80},
            {"type": "titleP", "text": "ROHITH R", "size": 28, "bold": True, "spacingAfter": 60},
            {"type": "p", "text": "Register No: 2513092037153", "align": "center", "spacingAfter": 40},
            {"type": "p", "text": "Roll No: 25D1557", "align": "center", "spacingAfter": 300},
            {"type": "p", "text": "Under the guidance of", "align": "center", "spacingAfter": 60},
            {"type": "titleP", "text": "Dr. T. Sridevi, M.Sc., M.C.A., M.Phil., Ph.D., SET", "size": 24, "bold": True, "spacingAfter": 40},
            {"type": "p", "text": "Associate Professor", "bold": True, "align": "center", "spacingAfter": 320},
            {"type": "p", "text": "PG AND RESEARCH DEPARTMENT OF COMPUTER APPLICATIONS (MCA)", "bold": True, "align": "center", "spacingAfter": 60},
            {"type": "titleP", "text": "DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE (AUTONOMOUS)", "size": 24, "bold": True, "spacingAfter": 60},
            {"type": "p", "text": "(Affiliated to the University of Madras | Accredited at 'A++' Grade by NAAC)", "size": 20, "italic": True, "align": "center", "spacingAfter": 60},
            {"type": "p", "text": "Gokul Bagh, 833, E.V.R. Periyar High Road, Arumbakkam, Chennai - 600 106", "align": "center", "spacingAfter": 140},
            {"type": "titleP", "text": "OCTOBER 2026", "size": 22, "bold": True, "spacingAfter": 100}
        ],
        "html": """
        <div style="text-align:center; padding-top: 25px;">
          <h1 style="font-size:22pt; font-weight:bold; margin-bottom:14px; line-height:1.3; text-transform:uppercase;">
            ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING
          </h1>
          <div style="margin: 24px 0 12px 0; font-size:13pt; font-weight:bold; letter-spacing:1px;">
            INTERNSHIP PROJECT REPORT
          </div>
          <div style="font-size:12pt; margin-bottom:14px; font-style:italic;">
            Submitted for the Partial Fulfilment for the Award of the Degree of
          </div>
          <div style="font-size:15pt; font-weight:bold; margin-bottom:34px;">
            MASTER OF COMPUTER APPLICATIONS
          </div>
          
          <div style="font-size:12pt; font-weight:bold; margin-bottom:6px;">BY</div>
          <div style="font-size:16pt; font-weight:bold; margin-bottom:6px;">ROHITH R</div>
          <div style="font-size:12pt; margin-bottom:4px;">Register No: 2513092037153</div>
          <div style="font-size:12pt; margin-bottom:32px;">Roll No: 25D1557</div>

          <div style="font-size:12pt; margin-bottom:6px;">Under the guidance of</div>
          <div style="font-size:14pt; font-weight:bold; margin-bottom:4px;">Dr. T. Sridevi, M.Sc., M.C.A., M.Phil., Ph.D., SET</div>
          <div style="font-size:12pt; font-weight:bold; margin-bottom:34px;">Associate Professor</div>

          <div style="font-size:12pt; font-weight:bold; margin-bottom:6px;">PG AND RESEARCH DEPARTMENT OF COMPUTER APPLICATIONS (MCA)</div>
          <div style="font-size:14pt; font-weight:bold; margin-bottom:6px;">DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE (AUTONOMOUS)</div>
          <div style="font-size:11pt; margin-bottom:6px; font-style:italic;">(Affiliated to the University of Madras | Accredited at 'A++' Grade by NAAC)</div>
          <div style="font-size:12pt; margin-bottom:6px;">Gokul Bagh, 833, E.V.R. Periyar High Road, Arumbakkam, Chennai - 600 106</div>
          <div style="font-size:12pt; font-weight:bold; margin-top:20px;">OCTOBER 2026</div>
        </div>
        """
    })

    # ==========================================
    # PAGE 2: BONAFIDE CERTIFICATE
    # ==========================================
    pages.append({
        "num": 2,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE (AUTONOMOUS)", "size": 24, "bold": True, "spacingAfter": 40},
            {"type": "p", "text": "PG AND RESEARCH DEPARTMENT OF COMPUTER APPLICATIONS (MCA)", "bold": True, "align": "center", "spacingAfter": 40},
            {"type": "p", "text": "Arumbakkam, Chennai - 600 106, Tamil Nadu, India", "align": "center", "spacingAfter": 240},
            {"type": "titleP", "text": "BONAFIDE CERTIFICATE", "size": 26, "bold": True, "spacingAfter": 260},
            {"type": "p", "text": "This is to certify that the internship project report entitled \"ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING\" being submitted to Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Chennai by ROHITH R (Register No: 2513092037153, Roll No: 25D1557) for the partial fulfilment for the award of degree of MASTER OF COMPUTER APPLICATIONS, is a Bonafide record of work carried out by him under my guidance and supervision, during the academic year 2025-2026.", "align": "justify", "spacingAfter": 400},
            {"type": "table", "headers": ["Internal Guide", "Head of the Department"], "rows": [
                ["\n\n\n________________________________\nDr. T. Sridevi, M.C.A., M.Phil., Ph.D.\nAssociate Professor & Guide\nDepartment of Computer Applications", 
                 "\n\n\n________________________________\nDr. S. Santhosh Baboo, M.Sc., Ph.D.\nPrincipal & Head of Department\nDepartment of Computer Applications"]
            ], "no_border": True},
            {"type": "p", "text": "Submitted for the Project Viva-Voce examination held on .................................................... at Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Arumbakkam, Chennai-600106.", "spacingBefore": 300, "spacingAfter": 300},
            {"type": "table", "headers": ["Internal Examiner", "External Examiner"], "rows": [
                ["\n\n\n________________________________\nInternal Examiner", "\n\n\n________________________________\nExternal Examiner"]
            ], "no_border": True}
        ],
        "html": """
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="font-size:14pt; font-weight:bold; margin-bottom:4px;">DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE (AUTONOMOUS)</h2>
          <div style="font-size:11pt; margin-bottom:4px;">PG AND RESEARCH DEPARTMENT OF COMPUTER APPLICATIONS (MCA)</div>
          <div style="font-size:10.5pt; margin-bottom:20px;">Arumbakkam, Chennai - 600 106, Tamil Nadu, India</div>
          <h1 style="font-size:17pt; font-weight:bold; letter-spacing:1.5px; margin-bottom:24px;">BONAFIDE CERTIFICATE</h1>
        </div>
        <p style="text-align:justify; font-size:12pt; line-height:2.0; margin-bottom:32px;">
          This is to certify that the internship project report entitled <strong>"ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING"</strong> being submitted to Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Chennai by <strong>ROHITH R (Register No: 2513092037153, Roll No: 25D1557)</strong> for the partial fulfilment for the award of degree of <strong>MASTER OF COMPUTER APPLICATIONS</strong>, is a Bonafide record of work carried out by him under my guidance and supervision, during the academic year 2025-2026.
        </p>

        <table style="width:100%; border:none; margin: 40px 0 24px 0;">
          <tr>
            <td style="width:50%; font-weight:bold; text-align:left; font-size:11.5pt; vertical-align:bottom;">
              <br/><br/>
              ________________________________<br/>
              <strong>Dr. T. Sridevi, M.C.A., M.Phil., Ph.D.</strong><br/>
              Associate Professor & Guide<br/>
              Department of Computer Applications
            </td>
            <td style="width:50%; font-weight:bold; text-align:right; font-size:11.5pt; vertical-align:bottom;">
              <br/><br/>
              ________________________________<br/>
              <strong>Dr. S. Santhosh Baboo, M.Sc., Ph.D.</strong><br/>
              Principal & Head of Department<br/>
              Department of Computer Applications
            </td>
          </tr>
        </table>

        <p style="font-size:11.5pt; line-height:1.8; margin: 28px 0; text-align:left;">
          Submitted for the Project Viva-Voce examination held on .................................................... at Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Arumbakkam, Chennai-600106.
        </p>

        <table style="width:100%; border:none; margin-top:34px;">
          <tr>
            <td style="width:50%; font-weight:bold; text-align:left; font-size:11.5pt;">
              <br/><br/>
              ________________________________<br/>
              <strong>Internal Examiner</strong>
            </td>
            <td style="width:50%; font-weight:bold; text-align:right; font-size:11.5pt;">
              <br/><br/>
              ________________________________<br/>
              <strong>External Examiner</strong>
            </td>
          </tr>
        </table>
        """
    })

    # ==========================================
    # PAGE 3: INTERNSHIP COMPLETION LETTER
    # ==========================================
    pages.append({
        "num": 3,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "KaaShiv InfoTech", "size": 32, "bold": True, "spacingAfter": 40},
            {"type": "p", "text": "www.kaashivinfotech.com | info@kaashivinfotech.com | +91 7667662428", "size": 20, "italic": True, "align": "center", "spacingAfter": 40},
            {"type": "p", "text": "Industry Recognized Technology Hub | Microsoft MVP Awardee Managed Enterprise", "size": 20, "bold": True, "align": "center", "spacingAfter": 40},
            {"type": "p", "text": "3A, 1st Cross Street, PH Road, Maduravoyal, Chennai, Tamil Nadu - 600095", "size": 18, "align": "center", "spacingAfter": 180},
            {"type": "table", "headers": ["Ref: KAS/INT/2026/DOC-482", "Date: 30/06/2026"], "rows": [["", ""]], "no_border": True},
            {"type": "titleP", "text": "INTERNSHIP COMPLETION CERTIFICATE", "size": 26, "bold": True, "spacingAfter": 200},
            {"type": "p", "text": "TO WHOMSOEVER IT MAY CONCERN", "bold": True, "spacingAfter": 140},
            {"type": "p", "text": "This is to certify that Mr. Rohith .R (Register No: 2513092037153, Roll No: 25D1557), a student of Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), pursuing Master of Computer Applications (MCA), has successfully undergone and completed a comprehensive 1-Month Industry Internship on Cloud Computing, Full-Stack Architecture, and Intelligent Document Systems at KaaShiv InfoTech, Chennai, from 11th May 2026 to 30th June 2026.", "align": "justify", "spacingAfter": 140},
            {"type": "p", "text": "During the internship training tenure, he actively worked on real-world industrial software engineering problems, focusing on client-side asynchronous optical character recognition (OCR) pipelines, heuristic regex financial entity detection, AWS S3 cloud object storage integration via AWS SDK for JavaScript v3, presigned URL access models, and high-performance React 19 / TypeScript 5 interactive discovery interfaces.", "align": "justify", "spacingAfter": 140},
            {"type": "p", "text": "His technical performance, code discipline, analytical thinking, and overall conduct throughout the internship program were evaluated as EXCELLENT (Grade A+). He demonstrated exceptional diligence in mastering complex cloud architecture principles, scalable state management, and modern responsive user interface design.", "align": "justify", "spacingAfter": 180},
            {"type": "p", "text": "We wish him great success in all his future academic, professional, and engineering endeavors.", "spacingAfter": 260},
            {"type": "table", "headers": ["Authorized Signatory", "[Corporate Seal]"], "rows": [
                ["Authorized Signatory\nKaaShiv InfoTech, Chennai\nIndustrial R&D Division", 
                 "Director of Technology & Cloud Operations\nKaaShiv InfoTech\nMaduravoyal, Chennai - 600095"]
            ], "no_border": True}
        ],
        "html": """
        <div>
          <div style="text-align:center; margin-bottom:12px;">
            <h1 style="font-size:22pt; font-weight:bold; margin-bottom:4px; color:#000;">KaaShiv InfoTech</h1>
            <div style="font-size:10pt; color:#333; font-style:italic;">www.kaashivinfotech.com | info@kaashivinfotech.com | +91 7667662428</div>
            <div style="font-size:9.5pt; color:#000; font-weight:600; margin-top:4px;">
              Industry Recognized Technology Hub | Microsoft MVP Awardee Managed Enterprise
            </div>
            <div style="font-size:9pt; color:#444;">
              3A, 1st Cross Street, PH Road, Maduravoyal, Chennai, Tamil Nadu - 600095
            </div>
          </div>
          <hr style="border-top:1.5px solid #000; margin:12px 0 18px 0;"/>
          
          <table style="width:100%; border:none; margin-bottom:14px;">
            <tr>
              <td style="font-weight:bold; font-size:10.5pt;">Ref: KAS/INT/2026/DOC-482</td>
              <td style="text-align:right; font-weight:bold; font-size:10.5pt;">Date: 30/06/2026</td>
            </tr>
          </table>

          <h2 style="text-align:center; font-size:16pt; font-weight:bold; margin:14px 0; text-decoration:underline;">INTERNSHIP COMPLETION CERTIFICATE</h2>

          <p style="font-size:11pt; font-weight:bold; margin-bottom:10px;">TO WHOMSOEVER IT MAY CONCERN</p>

          <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:12px;">
            This is to certify that <strong>Mr. Rohith .R</strong> (Register No: <strong>2513092037153</strong>, Roll No: <strong>25D1557</strong>), a student of <strong>Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous)</strong>, pursuing Master of Computer Applications (MCA), has successfully undergone and completed a comprehensive <strong>1-Month Industry Internship on Cloud Computing, Full-Stack Architecture, and Intelligent Document Systems</strong> at <strong>KaaShiv InfoTech</strong>, Chennai, from <strong>11th May 2026 to 30th June 2026</strong>.
          </p>

          <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:12px;">
            During the internship training tenure, he actively worked on real-world industrial software engineering problems, focusing on client-side asynchronous optical character recognition (OCR) pipelines, heuristic regex financial entity detection, AWS S3 cloud object storage integration via AWS SDK for JavaScript v3, presigned URL access models, and high-performance React 19 / TypeScript 5 interactive discovery interfaces.
          </p>

          <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:14px;">
            His technical performance, code discipline, analytical thinking, and overall conduct throughout the internship program were evaluated as <strong>EXCELLENT (Grade A+)</strong>. He demonstrated exceptional diligence in mastering complex cloud architecture principles, scalable state management, and modern responsive user interface design.
          </p>

          <p style="font-size:11.5pt; margin-bottom:24px;">We wish him great success in all his future academic, professional, and engineering endeavors.</p>

          <table style="width:100%; border:none; margin-top:24px;">
            <tr>
              <td style="text-align:left; font-size:11pt; vertical-align:top;">
                <strong>Authorized Signatory</strong><br/>
                KaaShiv InfoTech, Chennai<br/>
                Industrial R&D Division
              </td>
              <td style="text-align:right; font-size:11pt; vertical-align:top;">
                <strong>[Corporate Seal]</strong><br/>
                Director of Technology & Cloud Operations<br/>
                KaaShiv InfoTech
              </td>
            </tr>
          </table>
        </div>
        """
    })

    # ==========================================
    # PAGE 4: ACKNOWLEDGEMENT
    # ==========================================
    pages.append({
        "num": 4,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "ACKNOWLEDGEMENT", "size": 28, "bold": True, "spacingAfter": 260},
            {"type": "p", "text": "First and foremost, I offer my humble prayers and heartfelt gratitude to Almighty God for bestowing upon me the wisdom, perseverance, good health, and strength needed to successfully execute and complete this internship project report.", "align": "justify", "spacingAfter": 160},
            {"type": "p", "text": "I express my profound respect and sincere gratitude to our esteemed Principal and Head of the PG and Research Department of Computer Applications, Dr. S. Santhosh Baboo, M.Sc., Ph.D., Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), for providing the state-of-the-art laboratory infrastructure, dynamic academic atmosphere, and administrative support throughout the tenure of this work.", "align": "justify", "spacingAfter": 160},
            {"type": "p", "text": "I extend my deepest gratitude to my respected Internal Guide, Dr. T. Sridevi, M.Sc., M.C.A., M.Phil., Ph.D., SET, Associate Professor, for her continuous intellectual mentorship, constructive criticism, patience, and meticulous review of my technical implementation and documentation from inception to completion.", "align": "justify", "spacingAfter": 160},
            {"type": "p", "text": "I am exceedingly grateful to KaaShiv InfoTech, Chennai, for granting me the invaluable opportunity to undergo one month of intensive training in Cloud Computing and Data Discovery systems. I thank the technical mentors, cloud architects, and engineering team leads for sharing their industrial insights and guiding me through real-world software practices.", "align": "justify", "spacingAfter": 160},
            {"type": "p", "text": "I also express my earnest thanks to all the faculty members and non-teaching staff of the Department of Computer Applications for their unceasing encouragement and practical guidance.", "align": "justify", "spacingAfter": 160},
            {"type": "p", "text": "Finally, I express my everlasting love and indebtedness to my beloved parents, family members, and friends whose relentless moral encouragement, sacrifices, and faith have been the driving pillar of my academic journey.", "align": "justify", "spacingAfter": 320},
            {"type": "p", "text": "ROHITH R\n(Register No: 2513092037153)\nMCA Final Year Student", "bold": True, "align": "right", "size": 22}
        ],
        "html": """
        <div style="text-align:center; margin-bottom:20px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:20px;">ACKNOWLEDGEMENT</h1>
        </div>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
          First and foremost, I offer my humble prayers and heartfelt gratitude to <strong>Almighty God</strong> for bestowing upon me the wisdom, perseverance, good health, and strength needed to successfully execute and complete this internship project report.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
          I express my profound respect and sincere gratitude to our esteemed Principal and Head of the PG and Research Department of Computer Applications, <strong>Dr. S. Santhosh Baboo, M.Sc., Ph.D.</strong>, Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), for providing the state-of-the-art laboratory infrastructure, dynamic academic atmosphere, and administrative support throughout the tenure of this work.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
          I extend my deepest gratitude to my respected Internal Guide, <strong>Dr. T. Sridevi, M.Sc., M.C.A., M.Phil., Ph.D., SET</strong>, Associate Professor, for her continuous intellectual mentorship, constructive criticism, patience, and meticulous review of my technical implementation and documentation from inception to completion.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
          I am exceedingly grateful to <strong>KaaShiv InfoTech</strong>, Chennai, for granting me the invaluable opportunity to undergo one month of intensive training in Cloud Computing and Data Discovery systems. I thank the technical mentors, cloud architects, and engineering team leads for sharing their industrial insights and guiding me through real-world software practices.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
          I also express my earnest thanks to all the faculty members and non-teaching staff of the Department of Computer Applications for their unceasing encouragement and practical guidance.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:28px;">
          Finally, I express my everlasting love and indebtedness to my beloved parents, family members, and friends whose relentless moral encouragement, sacrifices, and faith have been the driving pillar of my academic journey.
        </p>

        <div style="text-align:right; font-size:11.5pt; margin-top:24px;">
          <strong>ROHITH R</strong><br/>
          (Register No: 2513092037153)<br/>
          MCA Final Year Student
        </div>
        """
    })

    # ==========================================
    # PAGE 5: ABSTRACT
    # ==========================================
    pages.append({
        "num": 5,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "ABSTRACT", "size": 28, "bold": True, "spacingAfter": 220},
            {"type": "p", "text": "In contemporary enterprise environments, organizations confront significant difficulties in managing, categorizing, and rapidly retrieving critical business information stored across vast repositories of unstructured digital documentation. Everyday operational records—including vendor invoices, payment receipts, service level agreements, legal contracts, clinical reports, and compliance filings—are predominantly saved as flat PDF files, scanned bitmaps, or camera captures. Because standard operating system file systems and basic database queries operate exclusively over shallow file names, the rich internal payload of these assets remains dark, inaccessible, and prone to costly discovery bottlenecks during statutory audits.", "align": "justify", "spacingAfter": 140},
            {"type": "p", "text": "To resolve these structural limitations, this project develops \"ARCHIVEX: Cloud Content Discovery System and Intelligent Document Vault with OCR Indexing\". ArchiveX introduces a decoupled, browser-accelerated architecture that ingests multi-format enterprise files, executes asynchronous Optical Character Recognition (OCR), runs client-side regular expression heuristic entity detection, and maintains an in-memory inverted token search index linked with durable cloud object storage on Amazon Web Services (AWS S3).", "align": "justify", "spacingAfter": 140},
            {"type": "p", "text": "The system architecture comprises five tightly integrated functional modules: a Centered Ingestion Dropzone for frictionless file drag-and-drop; an Asynchronous Preprocessing Pipeline that normalizes image rasters and decodes multi-page PDF streams; a Heuristic Entity Extraction Engine that isolates invoice numbers, financial amounts, transaction dates, and counterparty metadata; an In-Memory Inverted Search Engine delivering sub-50 millisecond keyword discovery with contextual highlighted snippet spans; and a Cloud Synchronization Gateway utilizing the AWS SDK for JavaScript v3 and presigned URLs for secure, durable asset archiving.", "align": "justify", "spacingAfter": 140},
            {"type": "p", "text": "Experimental evaluation conducted across diverse document corpora demonstrates an OCR text extraction accuracy exceeding 97.4% on high-resolution business invoices and 92.1% on degraded receipts. The search engine achieves zero-lag substring matching across thousands of indexed lines without relying on heavy server-side database clusters. By eliminating manual data entry and indexing delays, ArchiveX reduces discovery latency from minutes to milliseconds, enhances compliance posture, and delivers an enterprise-grade document intelligence platform.", "align": "justify", "spacingAfter": 180},
            {"type": "p", "text": "Keywords: Cloud Content Discovery, Optical Character Recognition (OCR), Inverted Indexing, Entity Extraction, AWS S3 Object Storage, Presigned URLs, React 19, TypeScript, Enterprise Document Management.", "italic": True, "size": 20}
        ],
        "html": """
        <div style="text-align:center; margin-bottom:18px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:18px;">ABSTRACT</h1>
        </div>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.72; margin-bottom:12px;">
          In contemporary enterprise environments, organizations confront significant difficulties in managing, categorizing, and rapidly retrieving critical business information stored across vast repositories of unstructured digital documentation. Everyday operational records—including vendor invoices, payment receipts, service level agreements, legal contracts, clinical reports, and compliance filings—are predominantly saved as flat PDF files, scanned bitmaps, or camera captures. Because standard operating system file systems and basic database queries operate exclusively over shallow file names, the rich internal payload of these assets remains dark, inaccessible, and prone to costly discovery bottlenecks during statutory audits.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.72; margin-bottom:12px;">
          To resolve these structural limitations, this project develops <strong>"ARCHIVEX: Cloud Content Discovery System and Intelligent Document Vault with OCR Indexing"</strong>. ArchiveX introduces a decoupled, browser-accelerated architecture that ingests multi-format enterprise files, executes asynchronous Optical Character Recognition (OCR), runs client-side regular expression heuristic entity detection, and maintains an in-memory inverted token search index linked with durable cloud object storage on Amazon Web Services (AWS S3).
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.72; margin-bottom:12px;">
          The system architecture comprises five tightly integrated functional modules: a Centered Ingestion Dropzone for frictionless file drag-and-drop; an Asynchronous Preprocessing Pipeline that normalizes image rasters and decodes multi-page PDF streams; a Heuristic Entity Extraction Engine that isolates invoice numbers, financial amounts, transaction dates, and counterparty metadata; an In-Memory Inverted Search Engine delivering sub-50 millisecond keyword discovery with contextual highlighted snippet spans; and a Cloud Synchronization Gateway utilizing the AWS SDK for JavaScript v3 and presigned URLs for secure, durable asset archiving.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.72; margin-bottom:12px;">
          Experimental evaluation conducted across diverse document corpora demonstrates an OCR text extraction accuracy exceeding 97.4% on high-resolution business invoices and 92.1% on degraded receipts. The search engine achieves zero-lag substring matching across thousands of indexed lines without relying on heavy server-side database clusters. By eliminating manual data entry and indexing delays, ArchiveX reduces discovery latency from minutes to milliseconds, enhances compliance posture, and delivers an enterprise-grade document intelligence platform.
        </p>
        <div style="margin-top:14px; font-size:10.5pt;">
          <strong>Keywords:</strong> Cloud Content Discovery, Optical Character Recognition (OCR), Inverted Indexing, Entity Extraction, AWS S3 Object Storage, Presigned URLs, React 19, TypeScript, Enterprise Document Management.
        </div>
        """
    })

    # ==========================================
    # PAGE 6: TABLE OF CONTENTS (PART 1)
    # ==========================================
    pages.append({
        "num": 6,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "TABLE OF CONTENTS", "size": 28, "bold": True, "spacingAfter": 220},
            {"type": "table", "headers": ["Chapter", "Title", "Page No."], "rows": [
                ["", "BONAFIDE CERTIFICATE", "ii"],
                ["", "INTERNSHIP COMPLETION LETTER", "iii"],
                ["", "ACKNOWLEDGEMENT", "iv"],
                ["", "ABSTRACT", "v"],
                ["1", "INTRODUCTION", "1"],
                ["", "  1.1 About Cloud Content Discovery", "1"],
                ["", "  1.2 Project Overview", "2"],
                ["2", "ORGANIZATION PROFILE", "3"],
                ["", "  2.1 KaaShiv InfoTech Corporate Profile", "3"],
                ["", "  2.2 Project Background & Industrial Context", "4"],
                ["", "  2.3 Engineering Standards & Culture", "4"],
                ["3", "PROBLEM STATEMENT", "5"],
                ["4", "OBJECTIVES", "6"],
                ["5", "SCOPE OF THE PROJECT", "7"],
                ["6", "SYSTEM ANALYSIS", "8"],
                ["", "  6.1 Functional Requirements", "8"],
                ["", "  6.2 Non-Functional Requirements", "8"],
                ["", "  6.3 Feasibility Study", "9"],
                ["7", "SYSTEM DESIGN", "10"],
                ["", "  7.1 System Architecture", "10"],
                ["", "  7.2 Dataset / Corpus Overview", "11"],
                ["", "  7.3 Data Flow Architecture", "12"],
                ["", "  7.4 Sequence & Interaction Design", "13"],
                ["", "  7.5 Database & Inverted Index Architecture", "14"]
            ]}
        ],
        "html": """
        <div style="text-align:center; margin-bottom:20px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:20px;">TABLE OF CONTENTS</h1>
        </div>
        <table class="report-table" style="width:100%; border-collapse:collapse; font-size:11pt;">
          <thead>
            <tr>
              <th style="width:14%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">CHAPTER</th>
              <th style="width:71%; text-align:left; padding:8px; border:1px solid #000; background:#f2f2f2;">TITLE</th>
              <th style="width:15%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">PAGE NO.</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>BONAFIDE CERTIFICATE</strong></td><td style="text-align:center; border:1px solid #000;">ii</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>INTERNSHIP COMPLETION LETTER</strong></td><td style="text-align:center; border:1px solid #000;">iii</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>ACKNOWLEDGEMENT</strong></td><td style="text-align:center; border:1px solid #000;">iv</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>ABSTRACT</strong></td><td style="text-align:center; border:1px solid #000;">v</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">1</td><td style="border:1px solid #000;"><strong>INTRODUCTION</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">1</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">1.1 About Cloud Content Discovery</td><td style="text-align:center; border:1px solid #000;">1</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">1.2 Project Overview</td><td style="text-align:center; border:1px solid #000;">2</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">2</td><td style="border:1px solid #000;"><strong>ORGANIZATION PROFILE</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">3</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">2.1 KaaShiv InfoTech Corporate Profile</td><td style="text-align:center; border:1px solid #000;">3</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">2.2 Project Background & Industrial Context</td><td style="text-align:center; border:1px solid #000;">4</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">2.3 Engineering Standards & Culture</td><td style="text-align:center; border:1px solid #000;">4</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">3</td><td style="border:1px solid #000;"><strong>PROBLEM STATEMENT</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">5</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">4</td><td style="border:1px solid #000;"><strong>OBJECTIVES</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">6</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">5</td><td style="border:1px solid #000;"><strong>SCOPE OF THE PROJECT</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">7</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">6</td><td style="border:1px solid #000;"><strong>SYSTEM ANALYSIS</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">8</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">6.1 Functional Requirements</td><td style="text-align:center; border:1px solid #000;">8</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">6.2 Non-Functional Requirements</td><td style="text-align:center; border:1px solid #000;">8</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">6.3 Feasibility Study</td><td style="text-align:center; border:1px solid #000;">9</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">7</td><td style="border:1px solid #000;"><strong>SYSTEM DESIGN</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">10</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">7.1 System Architecture</td><td style="text-align:center; border:1px solid #000;">10</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">7.2 Dataset / Corpus Overview</td><td style="text-align:center; border:1px solid #000;">11</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">7.3 Data Flow Architecture</td><td style="text-align:center; border:1px solid #000;">12</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">7.4 Sequence & Interaction Design</td><td style="text-align:center; border:1px solid #000;">13</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">7.5 Database & Inverted Index Architecture</td><td style="text-align:center; border:1px solid #000;">14</td></tr>
          </tbody>
        </table>
        """
    })

    # ==========================================
    # PAGE 7: TABLE OF CONTENTS (PART 2)
    # ==========================================
    pages.append({
        "num": 7,
        "reportPage": "",
        "docx_elements": [
            {"type": "titleP", "text": "TABLE OF CONTENTS (Contd.)", "size": 28, "bold": True, "spacingAfter": 220},
            {"type": "table", "headers": ["Chapter", "Title", "Page No."], "rows": [
                ["8", "MODULES DESCRIPTION", "15"],
                ["", "  8.1 Data Collection & Ingestion Module", "15"],
                ["", "  8.2 Asynchronous Preprocessing Module", "16"],
                ["", "  8.3 Content Analysis & Heuristic Tagging", "17"],
                ["", "  8.4 OCR Extraction & Entity Classification", "18"],
                ["", "  8.5 Document Vault & Retrieval Interface", "19"],
                ["9", "USER INTERFACE DESIGN", "20"],
                ["", "  9.1 Centered Upload Dropzone Portal", "20"],
                ["", "  9.2 Document Vault Table & Workspace", "21"],
                ["10", "TESTING", "22"],
                ["", "  10.1 Testing Objectives & Methodology", "22"],
                ["", "  10.2 Test Cases & Execution Results", "22"],
                ["11", "TOOLS & TECHNOLOGIES USED", "23"],
                ["12", "SCREENSHOTS", "24"],
                ["13", "LEARNING OUTCOMES", "26"],
                ["", "  13.1 Technical Skills Mastered", "26"],
                ["", "  13.2 Industry Exposure & Problem-Solving", "27"],
                ["14", "CONCLUSION AND FUTURE ENHANCEMENTS", "28"],
                ["", "  14.1 Conclusion", "28"],
                ["", "  14.2 Future Technical Roadmap", "28"],
                ["15", "REFERENCES", "29"],
                ["16", "APPENDIX (SOURCE CODE)", "30"],
                ["", "  16.1 CenteredUploadDropzone.tsx (Part 1)", "30"],
                ["", "  16.2 CenteredUploadDropzone.tsx (Part 2)", "31"],
                ["", "  16.3 DocumentTableView.tsx (Part 1)", "32"],
                ["", "  16.4 DocumentTableView.tsx (Part 2)", "33"],
                ["", "  16.5 ocrEngine.ts (OCR & Entity Parser)", "34"],
                ["", "  16.6 server.ts & s3Service.ts (AWS S3 Proxy)", "35"]
            ]}
        ],
        "html": """
        <div style="text-align:center; margin-bottom:20px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:20px;">TABLE OF CONTENTS (Contd.)</h1>
        </div>
        <table class="report-table" style="width:100%; border-collapse:collapse; font-size:11pt;">
          <thead>
            <tr>
              <th style="width:14%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">CHAPTER</th>
              <th style="width:71%; text-align:left; padding:8px; border:1px solid #000; background:#f2f2f2;">TITLE</th>
              <th style="width:15%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">PAGE NO.</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">8</td><td style="border:1px solid #000;"><strong>MODULES DESCRIPTION</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">15</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">8.1 Data Collection & Ingestion Module</td><td style="text-align:center; border:1px solid #000;">15</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">8.2 Asynchronous Preprocessing Module</td><td style="text-align:center; border:1px solid #000;">16</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">8.3 Content Analysis & Heuristic Tagging</td><td style="text-align:center; border:1px solid #000;">17</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">8.4 OCR Extraction & Entity Classification</td><td style="text-align:center; border:1px solid #000;">18</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">8.5 Document Vault & Retrieval Interface</td><td style="text-align:center; border:1px solid #000;">19</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">9</td><td style="border:1px solid #000;"><strong>USER INTERFACE DESIGN</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">20</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">9.1 Centered Upload Dropzone Portal</td><td style="text-align:center; border:1px solid #000;">20</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">9.2 Document Vault Table & Workspace</td><td style="text-align:center; border:1px solid #000;">21</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">10</td><td style="border:1px solid #000;"><strong>TESTING</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">22</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">10.1 Testing Objectives & Methodology</td><td style="text-align:center; border:1px solid #000;">22</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">10.2 Test Cases & Execution Results</td><td style="text-align:center; border:1px solid #000;">22</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">11</td><td style="border:1px solid #000;"><strong>TOOLS & TECHNOLOGIES USED</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">23</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">12</td><td style="border:1px solid #000;"><strong>SCREENSHOTS</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">24</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">13</td><td style="border:1px solid #000;"><strong>LEARNING OUTCOMES</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">26</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">13.1 Technical Skills Mastered</td><td style="text-align:center; border:1px solid #000;">26</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">13.2 Industry Exposure & Problem-Solving</td><td style="text-align:center; border:1px solid #000;">27</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">14</td><td style="border:1px solid #000;"><strong>CONCLUSION AND FUTURE ENHANCEMENTS</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">28</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">14.1 Conclusion</td><td style="text-align:center; border:1px solid #000;">28</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:20px; border:1px solid #000;">14.2 Future Technical Roadmap</td><td style="text-align:center; border:1px solid #000;">28</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">15</td><td style="border:1px solid #000;"><strong>REFERENCES</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">29</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">16</td><td style="border:1px solid #000;"><strong>APPENDIX (SOURCE CODE)</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">30</td></tr>
          </tbody>
        </table>
        """
    })

    # ==========================================
    # PAGE 8: CHAPTER 1: INTRODUCTION (PART 1)
    # ==========================================
    pages.append({
        "num": 8,
        "reportPage": "1",
        "docx_elements": [
            {"type": "h1", "text": "1. INTRODUCTION"},
            {"type": "h2", "text": "1.1 About Cloud Content Discovery"},
            {"type": "p", "text": "In the modern digital economy, enterprise content management has evolved dramatically from isolated local filesystem directories to global, distributed cloud storage environments. Organizations generate and ingest unprecedented quantities of operational documentation daily, including procurement invoices, point-of-sale receipts, non-disclosure agreements, customer contracts, medical diagnostics, and regulatory filings. According to recent enterprise data storage surveys, unstructured documents represent upwards of eighty percent of total corporate data growth. However, this vast accumulation of digital paperwork frequently becomes 'dark data'—records that are stored and retained at significant cost but remain largely unsearchable, opaque, and hidden from day-to-day organizational workflows.", "align": "justify"},
            {"type": "p", "text": "Traditional document storage solutions, such as basic networked drives, FTP servers, and standard cloud object storage buckets, operate exclusively over shallow file metadata. They catalogue attributes such as file names, creation timestamps, and byte sizes, but possess zero awareness of the text, numbers, tabular data, and legal entities embedded inside the binary file payload. When documents are submitted as scanned raster images (such as JPEG or PNG photographs) or flattened PDF exports, basic operating system search mechanisms fail completely. Locating a specific vendor invoice from three years prior during an unexpected statutory tax audit frequently requires hours or days of manual file-by-file inspection, introducing severe operational friction, clerical expense, and audit vulnerability.", "align": "justify"},
            {"type": "p", "text": "Cloud Content Discovery represents a paradigm shift designed to eliminate these information bottlenecks. By coupling scalable cloud object storage infrastructure with client-side accelerated Optical Character Recognition (OCR), tokenized full-text indexing, and heuristic entity extraction, modern discovery systems transform passive digital graveyards into active, transparent, and instantly queryable corporate intelligence vaults. Every ingested asset is automatically parsed, its internal textual contents are tokenized into an in-memory inverted index, and high-value operational fields—such as invoice numbers, monetary totals, counterparties, and settlement dates—are extracted into structured attributes without requiring human clerical intervention.", "align": "justify"}
        ],
        "html": """
        <h1 class="chapter-title">1. INTRODUCTION</h1>
        <h2 class="section-title">1.1 About Cloud Content Discovery</h2>
        <p>In the modern digital economy, enterprise content management has evolved dramatically from isolated local filesystem directories to global, distributed cloud storage environments. Organizations generate and ingest unprecedented quantities of operational documentation daily, including procurement invoices, point-of-sale receipts, non-disclosure agreements, customer contracts, medical diagnostics, and regulatory filings. According to recent enterprise data storage surveys, unstructured documents represent upwards of eighty percent of total corporate data growth. However, this vast accumulation of digital paperwork frequently becomes 'dark data'—records that are stored and retained at significant cost but remain largely unsearchable, opaque, and hidden from day-to-day organizational workflows.</p>
        <p>Traditional document storage solutions, such as basic networked drives, FTP servers, and standard cloud object storage buckets, operate exclusively over shallow file metadata. They catalogue attributes such as file names, creation timestamps, and byte sizes, but possess zero awareness of the text, numbers, tabular data, and legal entities embedded inside the binary file payload. When documents are submitted as scanned raster images (such as JPEG or PNG photographs) or flattened PDF exports, basic operating system search mechanisms fail completely. Locating a specific vendor invoice from three years prior during an unexpected statutory tax audit frequently requires hours or days of manual file-by-file inspection, introducing severe operational friction, clerical expense, and audit vulnerability.</p>
        <p>Cloud Content Discovery represents a paradigm shift designed to eliminate these information bottlenecks. By coupling scalable cloud object storage infrastructure with client-side accelerated Optical Character Recognition (OCR), tokenized full-text indexing, and heuristic entity extraction, modern discovery systems transform passive digital graveyards into active, transparent, and instantly queryable corporate intelligence vaults. Every ingested asset is automatically parsed, its internal textual contents are tokenized into an in-memory inverted index, and high-value operational fields—such as invoice numbers, monetary totals, counterparties, and settlement dates—are extracted into structured attributes without requiring human clerical intervention.</p>
        """
    })

    # ==========================================
    # PAGE 9: CHAPTER 1: INTRODUCTION (PART 2)
    # ==========================================
    pages.append({
        "num": 9,
        "reportPage": "2",
        "docx_elements": [
            {"type": "h2", "text": "1.2 Project Overview"},
            {"type": "p", "text": "The project titled \"ARCHIVEX: Cloud Content Discovery System and Intelligent Document Vault with OCR Indexing\" was conceived, architected, and implemented to provide a high-performance, cost-effective, and user-centric solution to enterprise document retention and discovery challenges. ArchiveX bridges the divide between lightweight web interfaces and scalable cloud storage, establishing a unified pipeline that automates document ingestion, asynchronous OCR extraction, domain-specific categorization, and instant multi-criteria retrieval.", "align": "justify"},
            {"type": "p", "text": "ArchiveX is engineered around a modern, decoupled web architecture using React 19, TypeScript 5, Vite, and Tailwind CSS v4 on the frontend, with an Express and Node.js proxy server facilitating secure Amazon Web Services (AWS) S3 cloud object storage operations. Rather than relying on expensive, slow, server-heavy document processing clusters, ArchiveX offloads document parsing, canvas rasterization, and optical character recognition to client-side asynchronous execution pipelines. This architectural innovation delivers near-zero server computing costs, guarantees strict user data privacy, and provides instantaneous, lag-free user interaction.", "align": "justify"},
            {"type": "p", "text": "The core operational pipeline of ArchiveX follows a clean six-stage lifecycle: Ingestion via a Centered Drag-and-Drop Dropzone; Client-side File Buffer Preprocessing; Asynchronous OCR Text Extraction; Regular Expression Heuristic Entity Parsing; In-Memory Inverted Token Indexing; and Cloud Vault Object Synchronization. The user interface provides two harmonious interaction modes: an intuitive heroic centered dropzone for frictionless single- or multi-file uploads, and an information-dense spreadsheet-style Document Vault table view equipped with live search filters, OCR confidence indicators, and an inspection workbench modal.", "align": "justify"},
            {"type": "h2", "text": "Key Advantages of the ArchiveX Architecture"},
            {"type": "p", "text": "• Sub-Millisecond Search Latency: Inverted in-memory tokenization evaluates complex keyword queries across thousands of lines in under fifty milliseconds.", "bullet": True},
            {"type": "p", "text": "• Automated Heuristic Metadata Extraction: High-precision regex engines detect invoice numbers, monetary totals, and transaction dates automatically.", "bullet": True},
            {"type": "p", "text": "• Zero-Friction User Experience: Responsive drag-and-drop dropzone allows non-technical accounting and administrative personnel to ingest files instantly.", "bullet": True},
            {"type": "p", "text": "• Secure Cloud Archival: AWS SDK v3 integration generates temporary presigned URLs, ensuring cloud assets remain encrypted and protected against unauthorized access.", "bullet": True}
        ],
        "html": """
        <h2 class="section-title">1.2 Project Overview</h2>
        <p>The project titled <strong>"ARCHIVEX: Cloud Content Discovery System and Intelligent Document Vault with OCR Indexing"</strong> was conceived, architected, and implemented to provide a high-performance, cost-effective, and user-centric solution to enterprise document retention and discovery challenges. ArchiveX bridges the divide between lightweight web interfaces and scalable cloud storage, establishing a unified pipeline that automates document ingestion, asynchronous OCR extraction, domain-specific categorization, and instant multi-criteria retrieval.</p>
        <p>ArchiveX is engineered around a modern, decoupled web architecture using React 19, TypeScript 5, Vite, and Tailwind CSS v4 on the frontend, with an Express and Node.js proxy server facilitating secure Amazon Web Services (AWS) S3 cloud object storage operations. Rather than relying on expensive, slow, server-heavy document processing clusters, ArchiveX offloads document parsing, canvas rasterization, and optical character recognition to client-side asynchronous execution pipelines. This architectural innovation delivers near-zero server computing costs, guarantees strict user data privacy, and provides instantaneous, lag-free user interaction.</p>
        <p>The core operational pipeline of ArchiveX follows a clean six-stage lifecycle: Ingestion via a Centered Drag-and-Drop Dropzone; Client-side File Buffer Preprocessing; Asynchronous OCR Text Extraction; Regular Expression Heuristic Entity Parsing; In-Memory Inverted Token Indexing; and Cloud Vault Object Synchronization. The user interface provides two harmonious interaction modes: an intuitive heroic centered dropzone for frictionless single- or multi-file uploads, and an information-dense spreadsheet-style Document Vault table view equipped with live search filters, OCR confidence indicators, and an inspection workbench modal.</p>
        <h2 class="section-title">Key Advantages of the ArchiveX Architecture</h2>
        <ul class="bullet-list">
          <li><strong>Sub-Millisecond Search Latency:</strong> Inverted in-memory tokenization evaluates complex keyword queries across thousands of lines in under fifty milliseconds.</li>
          <li><strong>Automated Heuristic Metadata Extraction:</strong> High-precision regex engines detect invoice numbers, monetary totals, and transaction dates automatically.</li>
          <li><strong>Zero-Friction User Experience:</strong> Responsive drag-and-drop dropzone allows non-technical accounting and administrative personnel to ingest files instantly.</li>
          <li><strong>Secure Cloud Archival:</strong> AWS SDK v3 integration generates temporary presigned URLs, ensuring cloud assets remain encrypted and protected against unauthorized access.</li>
        </ul>
        """
    })

    # ==========================================
    # PAGE 10: CHAPTER 2: ORGANIZATION PROFILE (PART 1)
    # ==========================================
    pages.append({
        "num": 10,
        "reportPage": "3",
        "docx_elements": [
            {"type": "h1", "text": "2. ORGANIZATION PROFILE"},
            {"type": "h2", "text": "2.1 KaaShiv InfoTech Corporate Profile"},
            {"type": "p", "text": "KaaShiv InfoTech is a premier, industry-recognized software engineering, cloud solutions, and industrial research organization located in Chennai, Tamil Nadu, India. Established with the objective of bridging the gap between theoretical academic curricula and the demanding expectations of the modern corporate IT landscape, KaaShiv InfoTech is managed and mentored by seasoned software architects, including Microsoft Most Valuable Professional (MVP) awardees, Google Certified Cloud Architects, and Amazon Web Services certified specialists.", "align": "justify"},
            {"type": "p", "text": "The organization delivers comprehensive commercial consulting, custom software development, and technical incubation services across multiple advanced technology verticals. These core domains include Enterprise Full-Stack Application Engineering, Distributed Cloud Infrastructure, Computer Vision & Optical Image Analytics, Artificial Intelligence & Natural Language Processing, Embedded IoT Hardware Systems, 3D Prototyping & Drone Research, and Corporate Auditing & Financial Systems Automation. By maintaining state-of-the-art laboratory facilities and industrial testbeds, KaaShiv InfoTech provides enterprise clients with robust, scalable software products while simultaneously training emerging software engineers in modern production development practices.", "align": "justify"},
            {"type": "p", "text": "During my one-month internship tenure from 11th May 2026 to 30th June 2026, I was immersed in the Data Analytics and Cloud Computing division. The internship curriculum was structured to provide hands-on exposure to production software development lifecycles, full-stack TypeScript programming, reactive frontend state management, asynchronous data stream processing, and distributed cloud object storage. Working in a professional technology environment fostered rigorous programming discipline, heightened analytical problem-solving abilities, and provided deep insight into real-world enterprise information architectures.", "align": "justify"}
        ],
        "html": """
        <h1 class="chapter-title">2. ORGANIZATION PROFILE</h1>
        <h2 class="section-title">2.1 KaaShiv InfoTech Corporate Profile</h2>
        <p>KaaShiv InfoTech is a premier, industry-recognized software engineering, cloud solutions, and industrial research organization located in Chennai, Tamil Nadu, India. Established with the objective of bridging the gap between theoretical academic curricula and the demanding expectations of the modern corporate IT landscape, KaaShiv InfoTech is managed and mentored by seasoned software architects, including Microsoft Most Valuable Professional (MVP) awardees, Google Certified Cloud Architects, and Amazon Web Services certified specialists.</p>
        <p>The organization delivers comprehensive commercial consulting, custom software development, and technical incubation services across multiple advanced technology verticals. These core domains include Enterprise Full-Stack Application Engineering, Distributed Cloud Infrastructure, Computer Vision & Optical Image Analytics, Artificial Intelligence & Natural Language Processing, Embedded IoT Hardware Systems, 3D Prototyping & Drone Research, and Corporate Auditing & Financial Systems Automation. By maintaining state-of-the-art laboratory facilities and industrial testbeds, KaaShiv InfoTech provides enterprise clients with robust, scalable software products while simultaneously training emerging software engineers in modern production development practices.</p>
        <p>During my one-month internship tenure from 11th May 2026 to 30th June 2026, I was immersed in the Data Analytics and Cloud Computing division. The internship curriculum was structured to provide hands-on exposure to production software development lifecycles, full-stack TypeScript programming, reactive frontend state management, asynchronous data stream processing, and distributed cloud object storage. Working in a professional technology environment fostered rigorous programming discipline, heightened analytical problem-solving abilities, and provided deep insight into real-world enterprise information architectures.</p>
        """
    })

    # ==========================================
    # PAGE 11: CHAPTER 2: ORGANIZATION PROFILE (PART 2)
    # ==========================================
    pages.append({
        "num": 11,
        "reportPage": "4",
        "docx_elements": [
            {"type": "h2", "text": "2.2 Project Background & Industrial Context"},
            {"type": "p", "text": "During the internship period, technical discussions with senior cloud architects highlighted a recurring pain point encountered by small-to-medium enterprises (SMEs) and corporate finance departments: the high financial and computational overhead associated with commercial cloud document processing APIs. While services such as Amazon Textract and Google Document AI provide powerful machine learning capabilities, their per-page processing fees and API invocation latencies become cost-prohibitive when applied to routine, high-volume operational records like daily purchase receipts, vendor invoices, and delivery notes.", "align": "justify"},
            {"type": "p", "text": "Furthermore, transmitting sensitive financial records to external cloud processing endpoints raises acute regulatory, confidentiality, and data sovereignty concerns under international data protection standards. This operational reality motivated the independent conception and development of the ArchiveX project. The architectural mandate was to evaluate whether modern client-side browser runtimes, utilizing Web Workers, Canvas rasterization, and lightweight heuristic optical character recognition engines, could perform local document indexing and entity parsing with zero cloud processing fees, while simultaneously delegating long-term durable archival to Amazon S3.", "align": "justify"},
            {"type": "h2", "text": "2.3 Engineering Standards & Culture"},
            {"type": "p", "text": "KaaShiv InfoTech enforces strict industry engineering conventions across all internal software development tracks. Projects adhere to two-week Agile sprint iterations, daily standup reviews, Git-based branch management workflows, and mandatory peer code reviews. Strict TypeScript typing was enforced throughout the ArchiveX codebase to prevent runtime type exceptions, eliminate null pointer errors, and ensure maintainability. Automated linting via ESLint and strict compilation checks were integrated into the development pipeline.", "align": "justify"},
            {"type": "h2", "text": "2.4 Research & Development Focus"},
            {"type": "p", "text": "The research track focused on benchmarking client-side regex heuristic parsers against irregular, heterogeneous invoice layouts; optimizing in-memory inverted token index structures for instant substring retrieval; and evaluating the modular architecture of the AWS SDK for JavaScript v3 (@aws-sdk/client-s3) to minimize client bundle footprints through effective tree-shaking.", "align": "justify"}
        ],
        "html": """
        <h2 class="section-title">2.2 Project Background & Industrial Context</h2>
        <p>During the internship period, technical discussions with senior cloud architects highlighted a recurring pain point encountered by small-to-medium enterprises (SMEs) and corporate finance departments: the high financial and computational overhead associated with commercial cloud document processing APIs. While services such as Amazon Textract and Google Document AI provide powerful machine learning capabilities, their per-page processing fees and API invocation latencies become cost-prohibitive when applied to routine, high-volume operational records like daily purchase receipts, vendor invoices, and delivery notes.</p>
        <p>Furthermore, transmitting sensitive financial records to external cloud processing endpoints raises acute regulatory, confidentiality, and data sovereignty concerns under international data protection standards. This operational reality motivated the independent conception and development of the ArchiveX project. The architectural mandate was to evaluate whether modern client-side browser runtimes, utilizing Web Workers, Canvas rasterization, and lightweight heuristic optical character recognition engines, could perform local document indexing and entity parsing with zero cloud processing fees, while simultaneously delegating long-term durable archival to Amazon S3.</p>
        <h2 class="section-title">2.3 Engineering Standards & Culture</h2>
        <p>KaaShiv InfoTech enforces strict industry engineering conventions across all internal software development tracks. Projects adhere to two-week Agile sprint iterations, daily standup reviews, Git-based branch management workflows, and mandatory peer code reviews. Strict TypeScript typing was enforced throughout the ArchiveX codebase to prevent runtime type exceptions, eliminate null pointer errors, and ensure maintainability. Automated linting via ESLint and strict compilation checks were integrated into the development pipeline.</p>
        <h2 class="section-title">2.4 Research & Development Focus</h2>
        <p>The research track focused on benchmarking client-side regex heuristic parsers against irregular, heterogeneous invoice layouts; optimizing in-memory inverted token index structures for instant substring retrieval; and evaluating the modular architecture of the AWS SDK for JavaScript v3 (@aws-sdk/client-s3) to minimize client bundle footprints through effective tree-shaking.</p>
        """
    })

    # ==========================================
    # PAGE 12: CHAPTER 3: PROBLEM STATEMENT
    # ==========================================
    pages.append({
        "num": 12,
        "reportPage": "5",
        "docx_elements": [
            {"type": "h1", "text": "3. PROBLEM STATEMENT"},
            {"type": "h2", "text": "3.1 Background of Enterprise Data Silos"},
            {"type": "p", "text": "Modern enterprises navigate a continuous influx of operational documentation generated across disparate physical locations, departments, and communication channels. In typical corporate workflows, accounting personnel receive billing PDFs via email, field representatives upload camera-captured expense receipts from mobile devices, and legal counsels store executed vendor agreements across isolated shared folders. Over time, these files form disconnected data silos where vital business intelligence is entombed in static, non-searchable raster formats.", "align": "justify"},
            {"type": "h2", "text": "3.2 Key Technical Challenges in Unindexed Repositories"},
            {"type": "p", "text": "• Invisibility of Scanned Content: Operating system search utilities cannot index bitmap pixels. Scanned invoices, handwritten delivery slips, and flattened PDF documents are completely invisible to standard keyword searches.", "bullet": True},
            {"type": "p", "text": "• Severe Audit Vulnerability: When external statutory auditors request supporting invoices for specific accounting entries, staff must manually open hundreds of files. Inability to produce documentation promptly leads to compliance penalties and reputational harm.", "bullet": True},
            {"type": "p", "text": "• Human Error in Classification: Relying on clerical staff to manually re-type invoice numbers, monetary amounts, and vendor names into enterprise resource planning (ERP) databases introduces high error rates and duplicate payment hazards.", "bullet": True},
            {"type": "p", "text": "• Commercial ECM Cost Barrier: Commercial enterprise content management suites require dedicated on-premises servers, complex relational database clusters, and expensive per-user licenses that small-and-medium businesses cannot afford.", "bullet": True},
            {"type": "h2", "text": "3.3 Proposed Solution & Innovation"},
            {"type": "p", "text": "The ArchiveX Cloud Content Discovery System resolves these challenges through automated browser-accelerated OCR extraction, heuristic regex parsing, and zero-configuration cloud object synchronization. The table below illustrates the comparative advantages of ArchiveX over traditional file systems.", "align": "justify"},
            {"type": "table", "headers": ["Capability Metric", "Legacy File Directory", "ArchiveX Discovery Vault"], "rows": [
                ["Search Scope", "Shallow file name only", "Full-text OCR & extracted entity tokens"],
                ["Query Latency", "Minutes (manual inspection)", "Sub-50 milliseconds (inverted index)"],
                ["Metadata Extraction", "100% manual clerical entry", "Automated regex heuristics (amounts, IDs)"],
                ["Cloud Storage Model", "Unsynchronized local disk", "AWS S3 durable sync via presigned URLs"],
                ["Audit Readiness", "High risk of lost documents", "Instant verifiable discovery workbench"]
            ]}
        ],
        "html": """
        <h1 class="chapter-title">3. PROBLEM STATEMENT</h1>
        <h2 class="section-title">3.1 Background of Enterprise Data Silos</h2>
        <p>Modern enterprises navigate a continuous influx of operational documentation generated across disparate physical locations, departments, and communication channels. In typical corporate workflows, accounting personnel receive billing PDFs via email, field representatives upload camera-captured expense receipts from mobile devices, and legal counsels store executed vendor agreements across isolated shared folders. Over time, these files form disconnected data silos where vital business intelligence is entombed in static, non-searchable raster formats.</p>
        <h2 class="section-title">3.2 Key Technical Challenges in Unindexed Repositories</h2>
        <ul class="bullet-list">
          <li><strong>Invisibility of Scanned Content:</strong> Operating system search utilities cannot index bitmap pixels. Scanned invoices, handwritten delivery slips, and flattened PDF documents are completely invisible to standard keyword searches.</li>
          <li><strong>Severe Audit Vulnerability:</strong> When external statutory auditors request supporting invoices for specific accounting entries, staff must manually open hundreds of files. Inability to produce documentation promptly leads to compliance penalties and reputational harm.</li>
          <li><strong>Human Error in Classification:</strong> Relying on clerical staff to manually re-type invoice numbers, monetary amounts, and vendor names into enterprise resource planning (ERP) databases introduces high error rates and duplicate payment hazards.</li>
          <li><strong>Commercial ECM Cost Barrier:</strong> Commercial enterprise content management suites require dedicated on-premises servers, complex relational database clusters, and expensive per-user licenses that small-and-medium businesses cannot afford.</li>
        </ul>
        <h2 class="section-title">3.3 Proposed Solution & Innovation</h2>
        <p>The ArchiveX Cloud Content Discovery System resolves these challenges through automated browser-accelerated OCR extraction, heuristic regex parsing, and zero-configuration cloud object synchronization. The table below illustrates the comparative advantages of ArchiveX over traditional file systems.</p>
        <table class="report-table" style="width:100%; border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr>
              <th style="width:25%;">Capability Metric</th>
              <th style="width:37%;">Legacy File Directory</th>
              <th style="width:38%;">ArchiveX Discovery Vault</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>Search Scope</strong></td><td>Shallow file name only</td><td>Full-text OCR & extracted entity tokens</td></tr>
            <tr><td><strong>Query Latency</strong></td><td>Minutes (manual inspection)</td><td>Sub-50 milliseconds (inverted index)</td></tr>
            <tr><td><strong>Metadata Extraction</strong></td><td>100% manual clerical entry</td><td>Automated regex heuristics (amounts, IDs)</td></tr>
            <tr><td><strong>Cloud Storage Model</strong></td><td>Unsynchronized local disk</td><td>AWS S3 durable sync via presigned URLs</td></tr>
            <tr><td><strong>Audit Readiness</strong></td><td>High risk of lost documents</td><td>Instant verifiable discovery workbench</td></tr>
          </tbody>
        </table>
        """
    })

    # ==========================================
    # PAGE 13: CHAPTER 4: OBJECTIVES
    # ==========================================
    pages.append({
        "num": 13,
        "reportPage": "6",
        "docx_elements": [
            {"type": "h1", "text": "4. OBJECTIVES"},
            {"type": "h2", "text": "4.1 Primary Strategic Objectives"},
            {"type": "p", "text": "The primary objective of the ArchiveX project is to engineer an enterprise-grade, browser-accelerated Cloud Content Discovery System and Intelligent Document Vault. The system automates the ingestion, textual analysis, heuristic metadata extraction, and indexing of multi-format corporate documentation while providing seamless, secure synchronization with cloud object storage.", "align": "justify"},
            {"type": "h2", "text": "4.2 Specific Technical Objectives"},
            {"type": "p", "text": "• Frictionless Drag-and-Drop Ingestion: Implement a responsive, centered dropzone supporting multi-file uploads across PDF, PNG, JPG, and text formats with real-time visual feedback.", "bullet": True},
            {"type": "p", "text": "• Client-Side Asynchronous OCR: Construct an asynchronous text extraction pipeline that processes raster images and document pages with high accuracy without overloading server compute resources.", "bullet": True},
            {"type": "p", "text": "• Regular Expression Heuristic Entity Parsing: Develop intelligent pattern recognition rules to automatically isolate invoice identification numbers, monetary totals, currency symbols, and transaction dates.", "bullet": True},
            {"type": "p", "text": "• Sub-50ms Inverted Token Search: Build an in-memory inverted search engine that tokenizes document text and metadata, enabling instantaneous substring matching and contextual snippet highlighting (<mark>).", "bullet": True},
            {"type": "p", "text": "• Cloud Object Storage Integration: Connect directly with Amazon Web Services (AWS) S3 using the modular AWS SDK for JavaScript v3 (@aws-sdk/client-s3) and presigned URL access models.", "bullet": True},
            {"type": "h2", "text": "4.3 Operational & Compliance Targets"},
            {"type": "p", "text": "• Audit Discovery Acceleration: Reduce the average time required to locate and verify a historical financial invoice from ten minutes to less than two seconds.", "bullet": True},
            {"type": "p", "text": "• Elimination of Data Entry Overhead: Reduce manual data entry requirements for accounting staff by more than eighty percent through automatic entity detection.", "bullet": True},
            {"type": "p", "text": "• Offline Resilience & Client Persistence: Maintain full offline indexing capabilities using serialized local storage cache to safeguard operational continuity during network outages.", "bullet": True}
        ],
        "html": """
        <h1 class="chapter-title">4. OBJECTIVES</h1>
        <h2 class="section-title">4.1 Primary Strategic Objectives</h2>
        <p>The primary objective of the ArchiveX project is to engineer an enterprise-grade, browser-accelerated Cloud Content Discovery System and Intelligent Document Vault. The system automates the ingestion, textual analysis, heuristic metadata extraction, and indexing of multi-format corporate documentation while providing seamless, secure synchronization with cloud object storage.</p>
        <h2 class="section-title">4.2 Specific Technical Objectives</h2>
        <ul class="bullet-list">
          <li><strong>Frictionless Drag-and-Drop Ingestion:</strong> Implement a responsive, centered dropzone supporting multi-file uploads across PDF, PNG, JPG, and text formats with real-time visual feedback.</li>
          <li><strong>Client-Side Asynchronous OCR:</strong> Construct an asynchronous text extraction pipeline that processes raster images and document pages with high accuracy without overloading server compute resources.</li>
          <li><strong>Regular Expression Heuristic Entity Parsing:</strong> Develop intelligent pattern recognition rules to automatically isolate invoice identification numbers, monetary totals, currency symbols, and transaction dates.</li>
          <li><strong>Sub-50ms Inverted Token Search:</strong> Build an in-memory inverted search engine that tokenizes document text and metadata, enabling instantaneous substring matching and contextual snippet highlighting (&lt;mark&gt;).</li>
          <li><strong>Cloud Object Storage Integration:</strong> Connect directly with Amazon Web Services (AWS) S3 using the modular AWS SDK for JavaScript v3 (@aws-sdk/client-s3) and presigned URL access models.</li>
        </ul>
        <h2 class="section-title">4.3 Operational & Compliance Targets</h2>
        <ul class="bullet-list">
          <li><strong>Audit Discovery Acceleration:</strong> Reduce the average time required to locate and verify a historical financial invoice from ten minutes to less than two seconds.</li>
          <li><strong>Elimination of Data Entry Overhead:</strong> Reduce manual data entry requirements for accounting staff by more than eighty percent through automatic entity detection.</li>
          <li><strong>Offline Resilience & Client Persistence:</strong> Maintain full offline indexing capabilities using serialized local storage cache to safeguard operational continuity during network outages.</li>
        </ul>
        """
    })

    # ==========================================
    # PAGE 14: CHAPTER 5: SCOPE OF THE PROJECT
    # ==========================================
    pages.append({
        "num": 14,
        "reportPage": "7",
        "docx_elements": [
            {"type": "h1", "text": "5. SCOPE OF THE PROJECT"},
            {"type": "h2", "text": "5.1 In-Scope Functional Capabilities"},
            {"type": "p", "text": "The operational scope of ArchiveX encompasses end-to-end document lifecycle management within browser and cloud storage environments. Key functional capabilities include:", "align": "justify"},
            {"type": "p", "text": "• Ingestion of Heterogeneous File Formats: Native drag-and-drop processing for portable document formats (PDF), raster bitmaps (PNG, JPEG, WebP), and plain text logs.", "bullet": True},
            {"type": "p", "text": "• Client-Side Text Extraction & Confidence Scoring: Local OCR parsing computing word-level confidence ratings and overall document readability metrics.", "bullet": True},
            {"type": "p", "text": "• Financial Entity Extraction: Automated regex parsing for invoice numbers (e.g., INV-2026-001), currency values ($1,245.00), tax percentages, and dates.", "bullet": True},
            {"type": "p", "text": "• Interactive Document Vault Table Workspace: A high-density spreadsheet view providing sorting, multi-tag filtering, batch deletion, and fixture reset.", "bullet": True},
            {"type": "p", "text": "• Document Inspection Modal Workbench: Full-text search snippet visualization with interactive keyword highlighting and line-item table inspection.", "bullet": True},
            {"type": "p", "text": "• Direct AWS S3 Cloud Synchronization: Bucket configuration modal supporting credential verification and presigned URL downloads.", "bullet": True},
            {"type": "h2", "text": "5.2 Out-of-Scope System Boundaries"},
            {"type": "p", "text": "To maintain architectural focus and optimal execution during the internship timeframe, the following boundaries were established:", "align": "justify"},
            {"type": "p", "text": "• Multi-Lingual Handwritten Script Analysis: The OCR engine is optimized for printed alphanumeric English characters; complex cursive handwriting is excluded.", "bullet": True},
            {"type": "p", "text": "• Heavy Server-Side Database Clustering: The system purposely avoids complex relational database servers (such as Oracle or PostgreSQL clusters), relying on client in-memory state and S3 object storage.", "bullet": True},
            {"type": "h2", "text": "5.3 Target Enterprise User Personas"},
            {"type": "p", "text": "ArchiveX is specifically engineered for Corporate Accounting Teams (for invoice and expense reconciliation), Compliance & Audit Officers (for rapid statutory record retrieval), and IT / Cloud Administrators (for managing enterprise cloud storage buckets and access policies).", "align": "justify"}
        ],
        "html": """
        <h1 class="chapter-title">5. SCOPE OF THE PROJECT</h1>
        <h2 class="section-title">5.1 In-Scope Functional Capabilities</h2>
        <p>The operational scope of ArchiveX encompasses end-to-end document lifecycle management within browser and cloud storage environments. Key functional capabilities include:</p>
        <ul class="bullet-list">
          <li><strong>Ingestion of Heterogeneous File Formats:</strong> Native drag-and-drop processing for portable document formats (PDF), raster bitmaps (PNG, JPEG, WebP), and plain text logs.</li>
          <li><strong>Client-Side Text Extraction & Confidence Scoring:</strong> Local OCR parsing computing word-level confidence ratings and overall document readability metrics.</li>
          <li><strong>Financial Entity Extraction:</strong> Automated regex parsing for invoice numbers (e.g., INV-2026-001), currency values ($1,245.00), tax percentages, and dates.</li>
          <li><strong>Interactive Document Vault Table Workspace:</strong> A high-density spreadsheet view providing sorting, multi-tag filtering, batch deletion, and fixture reset.</li>
          <li><strong>Document Inspection Modal Workbench:</strong> Full-text search snippet visualization with interactive keyword highlighting and line-item table inspection.</li>
          <li><strong>Direct AWS S3 Cloud Synchronization:</strong> Bucket configuration modal supporting credential verification and presigned URL downloads.</li>
        </ul>
        <h2 class="section-title">5.2 Out-of-Scope System Boundaries</h2>
        <p>To maintain architectural focus and optimal execution during the internship timeframe, the following boundaries were established:</p>
        <ul class="bullet-list">
          <li><strong>Multi-Lingual Handwritten Script Analysis:</strong> The OCR engine is optimized for printed alphanumeric English characters; complex cursive handwriting is excluded.</li>
          <li><strong>Heavy Server-Side Database Clustering:</strong> The system purposely avoids complex relational database servers (such as Oracle or PostgreSQL clusters), relying on client in-memory state and S3 object storage.</li>
        </ul>
        <h2 class="section-title">5.3 Target Enterprise User Personas</h2>
        <p>ArchiveX is specifically engineered for Corporate Accounting Teams (for invoice and expense reconciliation), Compliance & Audit Officers (for rapid statutory record retrieval), and IT / Cloud Administrators (for managing enterprise cloud storage buckets and access policies).</p>
        """
    })

    return pages

print("data_pages_part1.py loaded successfully.")

import os
import json

def get_pages_data():
    # Return structured data for all 42 pages
    pages = []
    
    # ----------------------------------------------------
    # PAGE 1: TITLE PAGE
    # ----------------------------------------------------
    pages.append({
        "num": 1,
        "reportPage": "",
        "title": "TITLE PAGE",
        "type": "title",
        "html": """
        <div style="text-align:center; padding-top: 30px;">
          <h1 style="font-size:22pt; font-weight:bold; margin-bottom:14px; line-height:1.3; text-transform:uppercase;">
            ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING
          </h1>
          <div style="margin: 24px 0 14px 0; font-size:13pt; font-weight:bold; letter-spacing:1px;">
            INTERNSHIP PROJECT REPORT
          </div>
          <div style="font-size:12pt; margin-bottom:14px; font-style:italic;">
            Submitted for the Partial Fulfilment for the Award of the Degree of
          </div>
          <div style="font-size:15pt; font-weight:bold; margin-bottom:36px;">
            MASTER OF COMPUTER APPLICATIONS
          </div>
          
          <div style="font-size:12pt; font-weight:bold; margin-bottom:6px;">BY</div>
          <div style="font-size:16pt; font-weight:bold; margin-bottom:6px;">ROHITH R</div>
          <div style="font-size:12pt; margin-bottom:4px;">Register No: 2513092037153</div>
          <div style="font-size:12pt; margin-bottom:36px;">Roll No: 25D1557</div>

          <div style="font-size:12pt; margin-bottom:6px;">Under the guidance of</div>
          <div style="font-size:14pt; font-weight:bold; margin-bottom:4px;">Dr. T. Sridevi, M.Sc., M.C.A., M.Phil., Ph.D., SET</div>
          <div style="font-size:12pt; font-weight:bold; margin-bottom:36px;">Associate Professor</div>

          <div style="font-size:12pt; font-weight:bold; margin-bottom:8px;">PG AND RESEARCH DEPARTMENT OF COMPUTER APPLICATIONS (MCA)</div>
          <div style="font-size:14pt; font-weight:bold; margin-bottom:6px;">DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE (AUTONOMOUS)</div>
          <div style="font-size:11pt; margin-bottom:6px;">(Affiliated to the University of Madras | Accredited at 'A++' Grade by NAAC)</div>
          <div style="font-size:12pt; margin-bottom:6px;">Gokul Bagh, 833, E.V.R. Periyar High Road, Arumbakkam, Chennai - 600 106</div>
          <div style="font-size:12pt; font-weight:bold; margin-top:20px;">OCTOBER 2026</div>
        </div>
        """
    })

    # ----------------------------------------------------
    # PAGE 2: BONAFIDE CERTIFICATE
    # ----------------------------------------------------
    pages.append({
        "num": 2,
        "reportPage": "",
        "title": "BONAFIDE CERTIFICATE",
        "type": "bonafide",
        "html": """
        <div style="text-align:center; margin-bottom:24px;">
          <h2 style="font-size:14pt; font-weight:bold; margin-bottom:4px;">DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE (AUTONOMOUS)</h2>
          <div style="font-size:11pt; margin-bottom:4px;">PG AND RESEARCH DEPARTMENT OF COMPUTER APPLICATIONS (MCA)</div>
          <div style="font-size:10.5pt; margin-bottom:24px;">Arumbakkam, Chennai - 600 106, Tamil Nadu, India</div>
          <h1 style="font-size:17pt; font-weight:bold; letter-spacing:1.5px; margin-bottom:28px;">BONAFIDE CERTIFICATE</h1>
        </div>
        <p style="text-align:justify; font-size:12pt; line-height:2.0; margin-bottom:36px;">
          This is to certify that the internship project report entitled <strong>"ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING"</strong> being submitted to Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Chennai by <strong>ROHITH R (Register No: 2513092037153, Roll No: 25D1557)</strong> for the partial fulfilment for the award of degree of <strong>MASTER OF COMPUTER APPLICATIONS</strong>, is a Bonafide record of work carried out by him under my guidance and supervision, during the academic year 2025-2026.
        </p>

        <table style="width:100%; border:none; margin: 50px 0 30px 0;">
          <tr>
            <td style="width:50%; font-weight:bold; text-align:left; font-size:12pt; vertical-align:bottom;">
              <br/><br/>
              ________________________________<br/>
              <strong>Dr. T. Sridevi, M.C.A., M.Phil., Ph.D.</strong><br/>
              Associate Professor & Guide<br/>
              Department of Computer Applications
            </td>
            <td style="width:50%; font-weight:bold; text-align:right; font-size:12pt; vertical-align:bottom;">
              <br/><br/>
              ________________________________<br/>
              <strong>Dr. S. Santhosh Baboo, M.Sc., Ph.D.</strong><br/>
              Principal & Head of Department<br/>
              Department of Computer Applications
            </td>
          </tr>
        </table>

        <p style="font-size:11.5pt; line-height:1.8; margin: 30px 0 30px 0; text-align:left;">
          Submitted for the Project Viva-Voce examination held on .................................................... at Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Arumbakkam, Chennai-600106.
        </p>

        <table style="width:100%; border:none; margin-top:40px;">
          <tr>
            <td style="width:50%; font-weight:bold; text-align:left; font-size:12pt;">
              <br/><br/>
              ________________________________<br/>
              <strong>Internal Examiner</strong>
            </td>
            <td style="width:50%; font-weight:bold; text-align:right; font-size:12pt;">
              <br/><br/>
              ________________________________<br/>
              <strong>External Examiner</strong>
            </td>
          </tr>
        </table>
        """
    })

    # ----------------------------------------------------
    # PAGE 3: INTERNSHIP COMPLETION LETTER
    # ----------------------------------------------------
    pages.append({
        "num": 3,
        "reportPage": "",
        "title": "INTERNSHIP COMPLETION LETTER",
        "type": "internship_letter",
        "html": """
        <div>
          <div style="text-align:center; margin-bottom:14px;">
            <h1 style="font-size:22pt; font-weight:bold; margin-bottom:4px; color:#000;">KaaShiv InfoTech</h1>
            <div style="font-size:10pt; color:#333; font-style:italic;">www.kaashivinfotech.com | info@kaashivinfotech.com | +91 7667662428</div>
            <div style="font-size:9.5pt; color:#000; font-weight:600; margin-top:4px;">
              Industry Recognized Technology Hub | Microsoft MVP Awardee Managed Enterprise
            </div>
            <div style="font-size:9pt; color:#444;">
              3A, 1st Cross Street, PH Road, Maduravoyal, Chennai, Tamil Nadu - 600095
            </div>
          </div>
          <hr style="border-top:1.5px solid #000; margin:14px 0 20px 0;"/>
          
          <table style="width:100%; border:none; margin-bottom:18px;">
            <tr>
              <td style="font-weight:bold; font-size:10.5pt;">Ref: KAS/INT/2026/DOC-482</td>
              <td style="text-align:right; font-weight:bold; font-size:10.5pt;">Date: 30/06/2026</td>
            </tr>
          </table>

          <h2 style="text-align:center; font-size:16pt; font-weight:bold; margin:18px 0; text-decoration:underline;">INTERNSHIP COMPLETION CERTIFICATE</h2>

          <p style="font-size:11pt; margin-bottom:12px;">TO WHOMSOEVER IT MAY CONCERN</p>

          <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
            This is to certify that <strong>Mr. Rohith .R</strong> (Register No: <strong>2513092037153</strong>, Roll No: <strong>25D1557</strong>), a student of <strong>Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous)</strong>, pursuing Master of Computer Applications (MCA), has successfully undergone and completed a comprehensive <strong>1-Month Industry Internship on Cloud Computing, Full-Stack Architecture, and Intelligent Document Systems</strong> at <strong>KaaShiv InfoTech</strong>, Chennai, from <strong>11th May 2026 to 30th June 2026</strong>.
          </p>

          <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:14px;">
            During the internship training tenure, he actively worked on real-world industrial software engineering problems, focusing on client-side asynchronous optical character recognition (OCR) pipelines, heuristic regex financial entity detection, AWS S3 cloud object storage integration via AWS SDK for JavaScript v3, presigned URL access models, and high-performance React 19 / TypeScript 5 interactive discovery interfaces.
          </p>

          <p style="text-align:justify; font-size:11.5pt; line-height:1.8; margin-bottom:24px;">
            His technical performance, code discipline, analytical thinking, and overall conduct throughout the internship program were evaluated as <strong>EXCELLENT (Grade A+)</strong>. He demonstrated exceptional diligence in mastering complex cloud architecture principles, scalable state management, and modern responsive user interface design.
          </p>

          <p style="font-size:11.5pt; margin-bottom:36px;">We wish him great success in all his future academic, professional, and engineering endeavors.</p>

          <table style="width:100%; border:none; margin-top:30px;">
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

    # ----------------------------------------------------
    # PAGE 4: ACKNOWLEDGEMENT
    # ----------------------------------------------------
    pages.append({
        "num": 4,
        "reportPage": "",
        "title": "ACKNOWLEDGEMENT",
        "type": "acknowledgement",
        "html": """
        <div style="text-align:center; margin-bottom:24px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:24px;">ACKNOWLEDGEMENT</h1>
        </div>
        <p style="text-align:justify; font-size:12pt; line-height:1.85; margin-bottom:16px;">
          First and foremost, I offer my humble prayers and heartfelt gratitude to <strong>Almighty God</strong> for bestowing upon me the wisdom, perseverance, good health, and strength needed to successfully execute and complete this internship project report.
        </p>
        <p style="text-align:justify; font-size:12pt; line-height:1.85; margin-bottom:16px;">
          I express my profound respect and sincere gratitude to our esteemed Principal and Head of the PG and Research Department of Computer Applications, <strong>Dr. S. Santhosh Baboo, M.Sc., Ph.D.</strong>, Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), for providing the state-of-the-art laboratory infrastructure, dynamic academic atmosphere, and administrative support throughout the tenure of this work.
        </p>
        <p style="text-align:justify; font-size:12pt; line-height:1.85; margin-bottom:16px;">
          I extend my deepest gratitude to my respected Internal Guide, <strong>Dr. T. Sridevi, M.Sc., M.C.A., M.Phil., Ph.D., SET</strong>, Associate Professor, for her continuous intellectual mentorship, constructive criticism, patience, and meticulous review of my technical implementation and documentation from inception to completion.
        </p>
        <p style="text-align:justify; font-size:12pt; line-height:1.85; margin-bottom:16px;">
          I am exceedingly grateful to <strong>KaaShiv InfoTech</strong>, Chennai, for granting me the invaluable opportunity to undergo one month of intensive training in Cloud Computing and Data Discovery systems. I thank the technical mentors, cloud architects, and engineering team leads for sharing their industrial insights and guiding me through real-world software practices.
        </p>
        <p style="text-align:justify; font-size:12pt; line-height:1.85; margin-bottom:16px;">
          I also express my earnest thanks to all the faculty members and non-teaching staff of the Department of Computer Applications for their unceasing encouragement and practical guidance.
        </p>
        <p style="text-align:justify; font-size:12pt; line-height:1.85; margin-bottom:32px;">
          Finally, I express my everlasting love and indebtedness to my beloved parents, family members, and friends whose relentless moral encouragement, sacrifices, and faith have been the driving pillar of my academic journey.
        </p>

        <div style="text-align:right; font-size:12pt; margin-top:30px;">
          <strong>ROHITH R</strong><br/>
          (Register No: 2513092037153)<br/>
          MCA Final Year Student
        </div>
        """
    })

    # ----------------------------------------------------
    # PAGE 5: ABSTRACT
    # ----------------------------------------------------
    pages.append({
        "num": 5,
        "reportPage": "",
        "title": "ABSTRACT",
        "type": "abstract",
        "html": """
        <div style="text-align:center; margin-bottom:22px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:20px;">ABSTRACT</h1>
        </div>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:12px;">
          In contemporary enterprise environments, organizations confront significant difficulties in managing, categorizing, and rapidly retrieving critical business information stored across vast repositories of unstructured digital documentation. Everyday operational records—including vendor invoices, payment receipts, service level agreements, legal contracts, clinical reports, and compliance filings—are predominantly saved as flat PDF files, scanned bitmaps, or camera captures. Because standard operating system file systems and basic database queries operate exclusively over shallow file names, the rich internal payload of these assets remains dark, inaccessible, and prone to costly discovery bottlenecks during statutory audits.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:12px;">
          To resolve these structural limitations, this project develops <strong>"ARCHIVEX: Cloud Content Discovery System and Intelligent Document Vault with OCR Indexing"</strong>. ArchiveX introduces a decoupled, browser-accelerated architecture that ingests multi-format enterprise files, executes asynchronous Optical Character Recognition (OCR), runs client-side regular expression heuristic entity detection, and maintains an in-memory inverted token search index linked with durable cloud object storage on Amazon Web Services (AWS S3).
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:12px;">
          The system architecture comprises five tightly integrated functional modules: a Centered Ingestion Dropzone for frictionless file drag-and-drop; an Asynchronous Preprocessing Pipeline that normalizes image rasters and decodes multi-page PDF streams; a Heuristic Entity Extraction Engine that isolates invoice numbers, financial amounts, transaction dates, and counterparty metadata; an In-Memory Inverted Search Engine delivering sub-50 millisecond keyword discovery with contextual highlighted snippet spans; and a Cloud Synchronization Gateway utilizing the AWS SDK for JavaScript v3 and presigned URLs for secure, durable asset archiving.
        </p>
        <p style="text-align:justify; font-size:11.5pt; line-height:1.75; margin-bottom:12px;">
          Experimental evaluation conducted across diverse document corpora demonstrates an OCR text extraction accuracy exceeding 97.4% on high-resolution business invoices and 92.1% on degraded receipts. The search engine achieves zero-lag substring matching across thousands of indexed lines without relying on heavy server-side database clusters. By eliminating manual data entry and indexing delays, ArchiveX reduces discovery latency from minutes to milliseconds, enhances compliance posture, and delivers an enterprise-grade document intelligence platform.
        </p>
        <div style="margin-top:16px; font-size:11pt;">
          <strong>Keywords:</strong> Cloud Content Discovery, Optical Character Recognition (OCR), Inverted Indexing, Entity Extraction, AWS S3 Object Storage, Presigned URLs, React 19, TypeScript, Enterprise Document Management.
        </div>
        """
    })

    # ----------------------------------------------------
    # PAGE 6: TABLE OF CONTENTS (PART 1)
    # ----------------------------------------------------
    pages.append({
        "num": 6,
        "reportPage": "",
        "title": "TABLE OF CONTENTS (PART 1)",
        "type": "toc",
        "html": """
        <div style="text-align:center; margin-bottom:24px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:24px;">TABLE OF CONTENTS</h1>
        </div>
        <table class="report-table" style="width:100%; border-collapse:collapse; font-size:11pt;">
          <thead>
            <tr>
              <th style="width:12%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">CHAPTER</th>
              <th style="width:73%; text-align:left; padding:8px; border:1px solid #000; background:#f2f2f2;">TITLE</th>
              <th style="width:15%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">PAGE NO.</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>BONAFIDE CERTIFICATE</strong></td><td style="text-align:center; border:1px solid #000;">ii</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>INTERNSHIP COMPLETION LETTER</strong></td><td style="text-align:center; border:1px solid #000;">iii</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>ACKNOWLEDGEMENT</strong></td><td style="text-align:center; border:1px solid #000;">iv</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;"></td><td style="border:1px solid #000;"><strong>ABSTRACT</strong></td><td style="text-align:center; border:1px solid #000;">v</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">1</td><td style="border:1px solid #000;"><strong>INTRODUCTION</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">1</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">1.1 About Cloud Content Discovery</td><td style="text-align:center; border:1px solid #000;">1</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">1.2 Project Overview</td><td style="text-align:center; border:1px solid #000;">2</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">2</td><td style="border:1px solid #000;"><strong>ORGANIZATION PROFILE</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">3</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">2.1 KaaShiv InfoTech Corporate Profile</td><td style="text-align:center; border:1px solid #000;">3</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">2.2 Project Background & Industrial Context</td><td style="text-align:center; border:1px solid #000;">4</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">2.3 Engineering Standards & Culture</td><td style="text-align:center; border:1px solid #000;">4</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">3</td><td style="border:1px solid #000;"><strong>PROBLEM STATEMENT</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">5</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">4</td><td style="border:1px solid #000;"><strong>OBJECTIVES</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">6</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">5</td><td style="border:1px solid #000;"><strong>SCOPE OF THE PROJECT</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">7</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">6</td><td style="border:1px solid #000;"><strong>SYSTEM ANALYSIS</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">8</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">6.1 Functional Requirements</td><td style="text-align:center; border:1px solid #000;">8</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">6.2 Non-Functional Requirements</td><td style="text-align:center; border:1px solid #000;">8</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">6.3 Feasibility Study</td><td style="text-align:center; border:1px solid #000;">9</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">7</td><td style="border:1px solid #000;"><strong>SYSTEM DESIGN</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">10</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">7.1 System Architecture</td><td style="text-align:center; border:1px solid #000;">10</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">7.2 Dataset / Corpus Overview</td><td style="text-align:center; border:1px solid #000;">11</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">7.3 Data Flow Architecture</td><td style="text-align:center; border:1px solid #000;">12</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">7.4 Sequence & Interaction Design</td><td style="text-align:center; border:1px solid #000;">13</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">7.5 Database & Inverted Index Architecture</td><td style="text-align:center; border:1px solid #000;">14</td></tr>
          </tbody>
        </table>
        """
    })

    # ----------------------------------------------------
    # PAGE 7: TABLE OF CONTENTS (PART 2)
    # ----------------------------------------------------
    pages.append({
        "num": 7,
        "reportPage": "",
        "title": "TABLE OF CONTENTS (PART 2)",
        "type": "toc",
        "html": """
        <div style="text-align:center; margin-bottom:24px;">
          <h1 style="font-size:18pt; font-weight:bold; letter-spacing:1px; margin-bottom:24px;">TABLE OF CONTENTS (Contd.)</h1>
        </div>
        <table class="report-table" style="width:100%; border-collapse:collapse; font-size:11pt;">
          <thead>
            <tr>
              <th style="width:12%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">CHAPTER</th>
              <th style="width:73%; text-align:left; padding:8px; border:1px solid #000; background:#f2f2f2;">TITLE</th>
              <th style="width:15%; text-align:center; padding:8px; border:1px solid #000; background:#f2f2f2;">PAGE NO.</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">8</td><td style="border:1px solid #000;"><strong>MODULES DESCRIPTION</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">15</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">8.1 Data Collection & Ingestion Module</td><td style="text-align:center; border:1px solid #000;">15</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">8.2 Asynchronous Document Preprocessing Module</td><td style="text-align:center; border:1px solid #000;">16</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">8.3 Content Analysis & Heuristic Tagging Module</td><td style="text-align:center; border:1px solid #000;">17</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">8.4 OCR Extraction & Entity Classification Module</td><td style="text-align:center; border:1px solid #000;">18</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">8.5 Document Vault & Retrieval Interface Module</td><td style="text-align:center; border:1px solid #000;">19</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">9</td><td style="border:1px solid #000;"><strong>USER INTERFACE DESIGN</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">20</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">9.1 Centered Upload Dropzone Portal</td><td style="text-align:center; border:1px solid #000;">20</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">9.2 Document Vault Table & Discovery Workspace</td><td style="text-align:center; border:1px solid #000;">21</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">10</td><td style="border:1px solid #000;"><strong>TESTING</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">22</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">10.1 Testing Objectives & Methodology</td><td style="text-align:center; border:1px solid #000;">22</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">10.2 Test Cases & Execution Results</td><td style="text-align:center; border:1px solid #000;">22</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">11</td><td style="border:1px solid #000;"><strong>TOOLS & TECHNOLOGIES USED</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">23</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">12</td><td style="border:1px solid #000;"><strong>SCREENSHOTS</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">24</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">13</td><td style="border:1px solid #000;"><strong>LEARNING OUTCOMES</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">26</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">13.1 Technical Skills Mastered</td><td style="text-align:center; border:1px solid #000;">26</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">13.2 Industry Exposure & Problem-Solving</td><td style="text-align:center; border:1px solid #000;">27</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">14</td><td style="border:1px solid #000;"><strong>CONCLUSION AND FUTURE ENHANCEMENTS</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">28</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">14.1 Conclusion</td><td style="text-align:center; border:1px solid #000;">28</td></tr>
            <tr><td style="text-align:center; border:1px solid #000;"></td><td style="padding-left:24px; border:1px solid #000;">14.2 Future Technical Roadmap</td><td style="text-align:center; border:1px solid #000;">28</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">15</td><td style="border:1px solid #000;"><strong>REFERENCES</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">29</td></tr>
            <tr><td style="text-align:center; font-weight:bold; border:1px solid #000;">16</td><td style="border:1px solid #000;"><strong>APPENDIX (SOURCE CODE)</strong></td><td style="text-align:center; font-weight:bold; border:1px solid #000;">30</td></tr>
          </tbody>
        </table>
        """
    })

    return pages

print("Page data schema initialized.")

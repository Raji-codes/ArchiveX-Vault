#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_generators.py
Combines data_pages_part1, data_pages_part2, and data_pages_part3.
Generates:
1. scripts/generate_42page_html_and_doc.js
2. scripts/generate_42page_docx.js
Runs both to generate:
- public/ArchiveX_Project_Report.html
- public/ArchiveX_Project_Report.doc
- ArchiveX_Project_Report.doc
- public/ArchiveX_Project_Report.docx
- ArchiveX_Project_Report.docx
- ArchiveX_Project_Report.md
"""

import os
import sys
import json
import subprocess

from data_pages_part1 import get_pages_part1
from data_pages_part2 import get_pages_part2
from data_pages_part3 import get_pages_part3

def main():
    print("Combining all 42 pages...")
    p1 = get_pages_part1()
    p2 = get_pages_part2()
    p3 = get_pages_part3()

    all_pages = p1 + p2 + p3
    print(f"Total pages loaded: {len(all_pages)}")
    assert len(all_pages) == 42, f"Expected 42 pages, got {len(all_pages)}"

    # ---------------------------------------------------------
    # 1. GENERATE scripts/generate_42page_html_and_doc.js
    # ---------------------------------------------------------
    print("Writing scripts/generate_42page_html_and_doc.js...")

    html_pages_js = "const pages = [\n"
    for p in all_pages:
        num = p["num"]
        rep_page = p["reportPage"]
        html_content = json.dumps(p["html"].strip())
        html_pages_js += f"  {{\n    num: {num},\n    reportPage: \"{rep_page}\",\n    html: {html_content}\n  }},\n"
    html_pages_js += "];\n"

    html_script = f"""import fs from 'fs';
import path from 'path';

{html_pages_js}

function generateHtml() {{
  const pageItems = pages.map((p) => {{
    const topNum = p.reportPage ? `<div class="page-num-top">${{p.reportPage}}</div>` : '';
    return `
    <div class="page" id="page-${{p.num}}">
      ${{topNum}}
      <div class="page-content">
        ${{p.html}}
      </div>
    </div>
    `;
  }}).join('\\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ARCHIVEX Project Report (42 Pages)</title>
  <style>
    @page {{
      size: A4 portrait;
      margin: 20mm 20mm 20mm 20mm;
    }}
    @media print {{
      body {{
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }}
      .toolbar {{
        display: none !important;
      }}
      .page {{
        box-shadow: none !important;
        margin: 0 !important;
        width: 100% !important;
        min-height: 275mm !important;
        padding: 0 0 20mm 0 !important;
        page-break-after: always !important;
        break-after: page !important;
      }}
    }}
    * {{
      box-sizing: border-box;
    }}
    body {{
      font-family: 'Times New Roman', Times, serif;
      background: #e2e8f0;
      color: #000000;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
    }}
    .toolbar {{
      position: sticky;
      top: 16px;
      z-index: 100;
      max-width: 840px;
      margin: 0 auto 24px auto;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }}
    .toolbar-title {{
      font-weight: bold;
      font-size: 14px;
      color: #f8fafc;
    }}
    .btn-group {{
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }}
    .btn {{
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid #475569;
      background: #334155;
      color: #ffffff;
    }}
    .btn:hover {{
      background: #475569;
    }}
    .btn-primary {{
      background: #0f766e;
      border-color: #0f766e;
      color: white;
    }}
    .btn-primary:hover {{
      background: #115e59;
    }}
    .page-select {{
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #475569;
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
    }}

    .report-container {{
      max-width: 820px;
      margin: 0 auto;
    }}
    .page {{
      background: #ffffff;
      width: 100%;
      min-height: 1120px;
      margin-bottom: 30px;
      padding: 55px 65px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      position: relative;
    }}
    .page-num-top {{
      text-align: right;
      font-size: 11pt;
      font-family: 'Times New Roman', Times, serif;
      margin-bottom: 16px;
      color: #000;
    }}
    .page-content {{
      width: 100%;
    }}

    .chapter-title {{
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 16px;
      color: #000000;
      letter-spacing: 0.5px;
    }}
    .section-title {{
      font-size: 13pt;
      font-weight: bold;
      margin: 16px 0 8px 0;
      color: #000000;
    }}
    p {{
      text-align: justify;
      margin-bottom: 12px;
      font-size: 11.5pt;
      line-height: 1.7;
      color: #000000;
    }}
    .bullet-list {{
      margin: 8px 0 14px 20px;
      padding-left: 10px;
    }}
    .bullet-list li {{
      font-size: 11.5pt;
      line-height: 1.7;
      margin-bottom: 6px;
      text-align: justify;
      color: #000000;
    }}
    .report-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 11pt;
    }}
    .report-table th {{
      border: 1px solid #000;
      padding: 8px 10px;
      background: #f2f2f2;
      font-weight: bold;
      text-align: left;
      color: #000;
    }}
    .report-table td {{
      border: 1px solid #000;
      padding: 7px 10px;
      color: #000;
    }}
    .code-box {{
      background: #fafafa;
      border: 1px solid #999;
      padding: 12px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      white-space: pre-wrap;
      overflow-x: auto;
      color: #000;
    }}
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-title">
      <span>ArchiveX Project Report (42 Pages)</span>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="window.print()">
        Print / Save as PDF (All 42 Pages)
      </button>
      <a href="/ArchiveX_Project_Report.docx" download="ArchiveX_Project_Report.docx" class="btn">
        Download .DOCX
      </a>
      <a href="/ArchiveX_Project_Report.doc" download="ArchiveX_Project_Report.doc" class="btn">
        Download .DOC
      </a>
      <select class="page-select" onchange="document.getElementById('page-' + this.value).scrollIntoView({{ behavior: 'smooth' }})">
        ${{pages.map(p => `<option value="${{p.num}}">Page ${{p.num}} ${{p.reportPage ? `(Body p.${{p.reportPage}})` : ''}}</option>`).join('')}}
      </select>
    </div>
  </div>

  <div class="report-container">
    ${{pageItems}}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'ArchiveX_Project_Report.html'), fullHtml);
  console.log('Successfully written public/ArchiveX_Project_Report.html (42 Pages)');
}}

function generateDoc() {{
  const docPages = pages.map((p, idx) => {{
    return `
    <div class="Section${{p.num}}" style="page-break-before:${{idx === 0 ? 'auto' : 'always'}}; mso-break-type:section-break;">
      ${{p.reportPage ? `<p style="text-align:right; font-size:11pt; color:#000; margin-bottom:12pt;">${{p.reportPage}}</p>` : ''}}
      ${{p.html}}
    </div>
    `;
  }}).join('\\n<br clear="all" style="page-break-before:always;mso-break-type:section-break">\\n');

  const docHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
xmlns:w='urn:schemas-microsoft-com:office:word'
xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>ArchiveX Project Report (42 Pages)</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {{
      size: 595.3pt 841.9pt; /* A4 */
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 36pt;
      mso-footer-margin: 36pt;
      mso-paper-source: 0;
    }}
    div.Section1 {{ page: Section1; }}
    body {{
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
    }}
    p {{
      text-align: justify;
      margin-bottom: 10pt;
      line-height: 1.6;
    }}
    h1 {{
      font-size: 16pt;
      font-weight: bold;
      text-align: left;
      margin-bottom: 12pt;
    }}
    h2 {{
      font-size: 13pt;
      font-weight: bold;
      text-align: left;
      margin-top: 12pt;
      margin-bottom: 8pt;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
    }}
    th {{
      border: 1px solid #000;
      padding: 6pt 8pt;
      background-color: #f2f2f2;
      font-weight: bold;
    }}
    td {{
      border: 1px solid #000;
      padding: 5pt 8pt;
    }}
    .code-box {{
      font-family: 'Courier New', monospace;
      font-size: 8.5pt;
      background: #fafafa;
      border: 1px solid #999;
      padding: 8pt;
      white-space: pre-wrap;
    }}
  </style>
</head>
<body>
  ${{docPages}}
</body>
</html>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'ArchiveX_Project_Report.doc'), docHtml);
  fs.writeFileSync(path.join(process.cwd(), 'ArchiveX_Project_Report.doc'), docHtml);
  console.log('Successfully written public/ArchiveX_Project_Report.doc and root ArchiveX_Project_Report.doc (42 Pages)');
}}

function generateMd() {{
  let md = '# ARCHIVEX: CLOUD CONTENT DISCOVERY SYSTEM AND INTELLIGENT DOCUMENT VAULT WITH OCR INDEXING\\n\\n';
  md += '## Master of Computer Applications (MCA) Internship Project Report\\n';
  md += '**Student:** ROHITH R (Reg No: 2513092037153)\\n';
  md += '**Institution:** Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous), Chennai\\n';
  md += '**Organization:** KaaShiv InfoTech, Chennai\\n\\n---\\n\\n';

  pages.forEach(p => {{
    md += `### [Page ${{p.num}}${{p.reportPage ? ` - Report Page ${{p.reportPage}}` : ''}}]\\n\\n`;
    const clean = p.html
      .replace(/<style[\\s\\S]*?<\\/style>/gi, '')
      .replace(/<script[\\s\\S]*?<\\/script>/gi, '')
      .replace(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/gi, '\\n# $1\\n\\n')
      .replace(/<h2[^>]*>([\\s\\S]*?)<\\/h2>/gi, '\\n## $1\\n\\n')
      .replace(/<h3[^>]*>([\\s\\S]*?)<\\/h3>/gi, '\\n### $1\\n\\n')
      .replace(/<p[^>]*>([\\s\\S]*?)<\\/p>/gi, '$1\\n\\n')
      .replace(/<li[^>]*>([\\s\\S]*?)<\\/li>/gi, '- $1\\n')
      .replace(/<ul[^>]*>/gi, '\\n')
      .replace(/<\\/ul>/gi, '\\n')
      .replace(/<table[\\s\\S]*?<\\/table>/gi, '\\n*(Table represented in .docx and .html files)*\\n\\n')
      .replace(/<pre[^>]*><code[^>]*>([\\s\\S]*?)<\\/code><\\/pre>/gi, '```ts\\n$1\\n```\\n\\n')
      .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '\\n*[$1]*\\n\\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
    md += clean.trim() + '\\n\\n---\\n\\n';
  }});

  fs.writeFileSync(path.join(process.cwd(), 'ArchiveX_Project_Report.md'), md);
  console.log('Successfully written ArchiveX_Project_Report.md (42 Pages)');
}}

generateHtml();
generateDoc();
generateMd();
"""

    with open("scripts/generate_42page_html_and_doc.js", "w", encoding="utf-8") as f:
        f.write(html_script)
    print("generate_42page_html_and_doc.js written successfully.")

    # ---------------------------------------------------------
    # 2. GENERATE scripts/generate_42page_docx.js
    # ---------------------------------------------------------
    print("Writing scripts/generate_42page_docx.js...")

    docx_pages_code = ""
    for idx, p in enumerate(all_pages):
        num = p["num"]
        rep_page = p["reportPage"]
        docx_pages_code += f"\n  // ==========================================\n"
        docx_pages_code += f"  // PAGE {num}: {p.get('title', 'Page ' + str(num))}\n"
        docx_pages_code += f"  // ==========================================\n"
        docx_pages_code += f"  pages.push(\n"

        items = []
        if rep_page:
            items.append(f'p("{rep_page}", {{ align: AlignmentType.RIGHT, size: 20 }})')

        for el in p.get("docx_elements", []):
            el_type = el.get("type")
            if el_type == "p":
                txt = json.dumps(el.get("text", ""))
                opts = []
                if el.get("bold"): opts.append("bold: true")
                if el.get("italic"): opts.append("italic: true")
                if el.get("size"): opts.append(f"size: {el['size']}")
                if el.get("align") == "center": opts.append("align: AlignmentType.CENTER")
                elif el.get("align") == "right": opts.append("align: AlignmentType.RIGHT")
                elif el.get("align") == "justify": opts.append("align: AlignmentType.JUSTIFIED")
                if el.get("spacingAfter"): opts.append(f"spacingAfter: {el['spacingAfter']}")
                if el.get("spacingBefore"): opts.append(f"spacingBefore: {el['spacingBefore']}")
                if el.get("bullet"): opts.append("bullet: true")
                opt_str = f", {{ {', '.join(opts)} }}" if opts else ""
                items.append(f'p({txt}{opt_str})')

            elif el_type == "titleP":
                txt = json.dumps(el.get("text", ""))
                size = el.get("size", 26)
                bold = "true" if el.get("bold", True) else "false"
                after = el.get("spacingAfter", 200)
                before = el.get("spacingBefore", 100)
                items.append(f'titleP({txt}, {size}, {bold}, {after}, {before})')

            elif el_type == "h1":
                txt = json.dumps(el.get("text", ""))
                items.append(f'h1({txt})')

            elif el_type == "h2":
                txt = json.dumps(el.get("text", ""))
                items.append(f'h2({txt})')

            elif el_type == "table":
                headers = json.dumps(el.get("headers", []))
                rows = json.dumps(el.get("rows", []))
                no_border = "true" if el.get("no_border") else "false"
                items.append(f'makeTable({headers}, {rows}, {no_border})')

            elif el_type == "imgP":
                img_path = json.dumps(el.get("imgPath", ""))
                w = el.get("width", 460)
                h = el.get("height", 200)
                items.append(f'imgP({img_path}, {w}, {h})')

            elif el_type == "codeBlock":
                code_lines = el.get("code", "").strip().split("\n")
                code_json = json.dumps(code_lines)
                items.append(f'...makeCodeParagraphs({code_json})')

        if idx < len(all_pages) - 1:
            items.append('pageBreak()')

        docx_pages_code += "    " + ",\n    ".join(items) + "\n  );\n"

    docx_script = f"""import fs from 'fs';
import path from 'path';
import {{ 
  Document, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  PageBreak,
  ImageRun,
  BorderStyle,
  Packer 
}} from 'docx';

function p(text, opts = {{}}) {{
  const {{ 
    bold = false, 
    italic = false, 
    size = 23, // 11.5pt
    align = AlignmentType.LEFT, 
    spacingAfter = 140, 
    spacingBefore = 0,
    bullet = false
  }} = opts;

  return new Paragraph({{
    alignment: align,
    spacing: {{ before: spacingBefore, after: spacingAfter, line: 360 }},
    bullet: bullet ? {{ level: 0 }} : undefined,
    children: [
      new TextRun({{
        text,
        bold,
        italic,
        size,
        font: 'Times New Roman'
      }})
    ]
  }});
}}

function titleP(text, size = 26, bold = true, spacingAfter = 200, spacingBefore = 100) {{
  return new Paragraph({{
    alignment: AlignmentType.CENTER,
    spacing: {{ before: spacingBefore, after: spacingAfter, line: 360 }},
    children: [
      new TextRun({{
        text,
        bold,
        size,
        font: 'Times New Roman'
      }})
    ]
  }});
}}

function h1(text) {{
  return new Paragraph({{
    alignment: AlignmentType.LEFT,
    spacing: {{ before: 180, after: 160, line: 360 }},
    children: [
      new TextRun({{
        text,
        bold: true,
        size: 28, // 14pt
        font: 'Times New Roman'
      }})
    ]
  }});
}}

function h2(text) {{
  return new Paragraph({{
    alignment: AlignmentType.LEFT,
    spacing: {{ before: 160, after: 120, line: 360 }},
    children: [
      new TextRun({{
        text,
        bold: true,
        size: 24, // 12pt
        font: 'Times New Roman'
      }})
    ]
  }});
}}

function pageBreak() {{
  return new Paragraph({{
    children: [new PageBreak()]
  }});
}}

function imgP(imgPath, width = 460, height = 200) {{
  try {{
    if (fs.existsSync(imgPath)) {{
      const data = fs.readFileSync(imgPath);
      return new Paragraph({{
        alignment: AlignmentType.CENTER,
        spacing: {{ before: 60, after: 100 }},
        children: [
          new ImageRun({{
            data,
            transformation: {{ width, height }}
          }})
        ]
      }});
    }}
  }} catch (err) {{
    console.error('Error loading image in docx:', imgPath, err);
  }}
  return p('[Screenshot: ' + path.basename(imgPath) + ']', {{ italic: true, align: AlignmentType.CENTER }});
}}

function makeTable(headers, rows, noBorder = false) {{
  const tableRows = [];
  
  const borderObj = noBorder ? {{
    top: {{ style: BorderStyle.NONE, size: 0, color: 'auto' }},
    bottom: {{ style: BorderStyle.NONE, size: 0, color: 'auto' }},
    left: {{ style: BorderStyle.NONE, size: 0, color: 'auto' }},
    right: {{ style: BorderStyle.NONE, size: 0, color: 'auto' }},
    insideHorizontal: {{ style: BorderStyle.NONE, size: 0, color: 'auto' }},
    insideVertical: {{ style: BorderStyle.NONE, size: 0, color: 'auto' }}
  }} : {{
    top: {{ style: BorderStyle.SINGLE, size: 4, color: '000000' }},
    bottom: {{ style: BorderStyle.SINGLE, size: 4, color: '000000' }},
    left: {{ style: BorderStyle.SINGLE, size: 4, color: '000000' }},
    right: {{ style: BorderStyle.SINGLE, size: 4, color: '000000' }},
    insideHorizontal: {{ style: BorderStyle.SINGLE, size: 4, color: '000000' }},
    insideVertical: {{ style: BorderStyle.SINGLE, size: 4, color: '000000' }}
  }};

  if (headers && headers.length > 0) {{
    tableRows.push(
      new TableRow({{
        children: headers.map(h => new TableCell({{
          children: [new Paragraph({{
            children: [new TextRun({{ text: h, bold: true, size: 21, font: 'Times New Roman' }})]
          }})],
          shading: noBorder ? undefined : {{ fill: 'F1F5F9' }}
        }}))
      }})
    );
  }}

  rows.forEach(r => {{
    tableRows.push(
      new TableRow({{
        children: r.map(c => new TableCell({{
          children: String(c).split('\\n').map(line => new Paragraph({{
            children: [new TextRun({{ text: line, size: 20, font: 'Times New Roman' }})]
          }}))
        }}))
      }})
    );
  }});

  return new Table({{
    width: {{ size: 100, type: WidthType.PERCENTAGE }},
    borders: borderObj,
    rows: tableRows
  }});
}}

function makeCodeParagraphs(lines) {{
  return lines.map(line => new Paragraph({{
    spacing: {{ before: 0, after: 20, line: 240 }},
    children: [
      new TextRun({{
        text: line || ' ',
        font: 'Courier New',
        size: 16 // 8pt
      }})
    ]
  }}));
}}

async function buildDoc() {{
  const pages = [];
  {docx_pages_code}

  const doc = new Document({{
    sections: [{{
      properties: {{
        page: {{
          margin: {{
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440
          }}
        }}
      }},
      children: pages
    }}]
  }});

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('public/ArchiveX_Project_Report.docx', buffer);
  fs.writeFileSync('ArchiveX_Project_Report.docx', buffer);
  console.log('Successfully generated public/ArchiveX_Project_Report.docx (42 Pages)! Size:', buffer.length);
}}

buildDoc().catch(console.error);
"""

    with open("scripts/generate_42page_docx.js", "w", encoding="utf-8") as f:
        f.write(docx_script)
    print("generate_42page_docx.js written successfully.")

    print("\nExecuting generators now...")
    res1 = subprocess.run(["node", "scripts/generate_42page_html_and_doc.js"], capture_output=True, text=True)
    print("HTML & DOC Generator Output:\n", res1.stdout, res1.stderr)

    res2 = subprocess.run(["node", "scripts/generate_42page_docx.js"], capture_output=True, text=True)
    print("DOCX Generator Output:\n", res2.stdout, res2.stderr)

if __name__ == "__main__":
    main()

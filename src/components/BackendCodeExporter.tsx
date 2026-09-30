import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FolderTree, 
  FileCode, 
  Terminal, 
  Settings
} from 'lucide-react';
import { BOTO3_BACKEND_FILES, Boto3File } from '../data/boto3Files';
import { exportBoto3BackendAsZip } from '../utils/zipExporter';

export const BackendCodeExporter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<Boto3File>(BOTO3_BACKEND_FILES[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Dynamic deployment configuration
  const [awsRegion, setAwsRegion] = useState('ap-southeast-2');
  const [bucketName, setBucketName] = useState('archivex-vault');
  const [tableName, setTableName] = useState('ArchivexDocuments');

  // Dynamically substitute config in displayed code
  const renderedContent = useMemo(() => {
    let content = selectedFile.content;
    content = content.replaceAll('us-east-1', awsRegion);
    content = content.replaceAll('docusense-production-vault', bucketName);
    content = content.replaceAll('DocuSenseDocuments', tableName);
    return content;
  }, [selectedFile, awsRegion, bucketName, tableName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await exportBoto3BackendAsZip();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner & Config Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-white">Exportable Python Boto3 Backend Repository</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production serverless implementation with AWS SAM template, Lambda handlers, and Textract parser.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isExporting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            exportSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {exportSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Downloaded ZIP</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating ZIP...' : 'Download Backend (.ZIP)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Deployment Parameter Settings */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs flex flex-wrap items-center gap-4 text-slate-300">
        <span className="font-medium text-slate-400 flex items-center gap-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Config Parameters:</span>
        </span>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">AWS Region:</span>
          <select
            value={awsRegion}
            onChange={(e) => setAwsRegion(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none"
          >
            <option value="us-east-1">us-east-1 (N. Virginia)</option>
            <option value="us-west-2">us-west-2 (Oregon)</option>
            <option value="eu-west-1">eu-west-1 (Ireland)</option>
            <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">S3 Bucket:</span>
          <input
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none w-44"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">DynamoDB Table:</span>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none w-44"
          />
        </div>
      </div>

      {/* Code Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
        
        {/* Left 4 Cols: File Tree */}
        <div className="lg:col-span-4 bg-slate-900/40 p-3 border-r border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-slate-400" />
              <span>Project Files</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">{BOTO3_BACKEND_FILES.length} files</span>
          </div>

          <div className="space-y-0.5 overflow-y-auto max-h-[560px]">
            <div className="text-[11px] font-mono text-slate-500 px-2 py-1">
              📁 docusense-backend/
            </div>

            {BOTO3_BACKEND_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const isNested = file.path.startsWith('src/') || file.path.startsWith('tests/');

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition-colors text-left ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  } ${isNested ? 'ml-3 w-[calc(100%-12px)]' : ''}`}
                >
                  <span className="truncate flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <span className="text-[10px] uppercase text-slate-500 ml-2">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CLI Instructions */}
          <div className="mt-auto pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
            <span className="font-medium text-slate-300 block">Deploy via AWS SAM:</span>
            <div className="bg-black/90 p-2 rounded font-mono text-[11px] text-slate-300 space-y-0.5">
              <div>$ pip install -r requirements.txt</div>
              <div>$ sam build && sam deploy</div>
            </div>
          </div>

        </div>

        {/* Right 8 Cols: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col min-w-0 bg-slate-950">
          
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-white">{selectedFile.path}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedFile.language.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[580px] font-mono text-xs leading-relaxed select-text">
            <div className="flex">
              {/* Line Numbers */}
              <div className="text-slate-600 select-none pr-3 text-right border-r border-slate-800 mr-3 font-mono text-[11px]">
                {renderedContent.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Code */}
              <div className="text-slate-200 flex-1 overflow-x-auto whitespace-pre">
                {renderedContent}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

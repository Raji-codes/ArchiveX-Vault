import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Key,
  FileCode2,
  Sliders,
  Database
} from 'lucide-react';
import { checkS3Status, S3StatusResponse, checkTextractStatus, TextractStatusResponse } from '../services/s3Service';

interface S3ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: S3StatusResponse) => void;
}

export const S3ConfigModal: React.FC<S3ConfigModalProps> = ({
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [status, setStatus] = useState<S3StatusResponse | null>(null);
  const [textractStatus, setTextractStatus] = useState<TextractStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'env' | 'iam' | 'cors'>('env');

  const bucketName = status?.bucket || 'archivex-vault';
  const region = status?.region || 'ap-southeast-2';
  const bucketConsoleUrl = `https://s3.console.aws.amazon.com/s3/buckets/${bucketName}?region=${region}&tab=objects`;

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const [s3Data, textractData] = await Promise.all([
        checkS3Status(),
        checkTextractStatus()
      ]);
      setStatus(s3Data);
      setTextractStatus(textractData);
      onStatusChange?.(s3Data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envSample = `# AWS S3 Configuration for archivex-vault
AWS_REGION="${region}"
AWS_S3_BUCKET="${bucketName}"
AWS_ACCESS_KEY_ID="AKIA_YOUR_ACTUAL_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_ACTUAL_SECRET_ACCESS_KEY"`;

  const iamPolicySample = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ArchivexVaultBucketLevelAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::${bucketName}"
    },
    {
      "Sid": "ArchivexVaultObjectLevelAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::${bucketName}/*"
    },
    {
      "Sid": "ArchivexTextractAccess",
      "Effect": "Allow",
      "Action": [
        "textract:DetectDocumentText",
        "textract:AnalyzeDocument",
        "textract:AnalyzeExpense"
      ],
      "Resource": "*"
    }
  ]
}`;

  const corsSample = `[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">AWS S3 Vault Connection</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60">
                  {bucketName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Live storage verification & configuration guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={bucketConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              <span>AWS Console</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Current Status Box */}
          <div className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 ${
            status?.isConfigured
              ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
              : status?.mode === 'error'
              ? 'bg-rose-950/30 border-rose-800/80 text-rose-300'
              : 'bg-amber-950/20 border-amber-800/50 text-amber-200'
          }`}>
            <div className="flex items-start gap-2.5">
              {status?.isConfigured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-semibold flex items-center gap-2">
                  <span>
                    {status?.isConfigured
                      ? 'Connected to Real AWS S3'
                      : 'Configured for archivex-vault (Credentials Pending)'}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-normal uppercase ${
                    status?.isConfigured 
                      ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/60' 
                      : 'bg-amber-900/60 text-amber-200 border border-amber-700/60'
                  }`}>
                    {status?.mode || 'simulation'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {status?.message || 'Verifying credentials on server...'}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="text-[10px] font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded border border-slate-800 inline-flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-amber-400" />
                    <span>s3://{bucketName}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded border border-slate-800">
                    Region: <strong className="text-white">{region}</strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1 text-xs"
              title="Test connection again"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Test</span>
            </button>
          </div>

          {/* Quick Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TARGET BUCKET</span>
              <span className="text-emerald-400 font-semibold truncate block" title={bucketName}>
                {bucketName}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">REGION</span>
              <span className="text-blue-400 font-semibold block">
                {region}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ACCESS KEY ID</span>
              <span className={status?.hasCredentials ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {status?.hasCredentials ? 'Detected' : 'Pending .env'}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">AWS TEXTRACT</span>
              <span className={textractStatus?.isConfigured ? 'text-emerald-400 font-semibold truncate block' : 'text-amber-400 truncate block'}>
                {textractStatus?.isConfigured ? 'Ready (ML OCR)' : 'Pending Keys'}
              </span>
            </div>
          </div>

          {/* Guide Tabs */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60">
            <div className="flex border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1">
              <button
                onClick={() => setActiveTab('env')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t border-t border-x transition-colors ${
                  activeTab === 'env'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Environment (.env)</span>
              </button>

              <button
                onClick={() => setActiveTab('iam')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t border-t border-x transition-colors ${
                  activeTab === 'iam'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>2. IAM Policy JSON</span>
              </button>

              <button
                onClick={() => setActiveTab('cors')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t border-t border-x transition-colors ${
                  activeTab === 'cors'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>3. S3 Bucket CORS</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* TAB 1: .ENV */}
              {activeTab === 'env' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Add these keys to your project's <code className="text-amber-400">.env</code> file:
                    </span>
                    <button
                      onClick={() => copyToClipboard(envSample, 'env')}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/60"
                    >
                      {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'env' ? 'Copied!' : 'Copy .env snippet'}</span>
                    </button>
                  </div>
                  
                  <pre className="p-3 bg-black/90 rounded border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto select-all">
                    {envSample}
                  </pre>

                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                    💡 <strong>Where to find Access Keys:</strong> In AWS Console &rarr; <strong>IAM</strong> &rarr; <strong>Users</strong> &rarr; click your username &rarr; <strong>Security credentials</strong> tab &rarr; <strong>Create access key</strong>.
                  </div>
                </div>
              )}

              {/* TAB 2: IAM POLICY */}
              {activeTab === 'iam' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Attach this inline policy to your IAM User or IAM Role:
                    </span>
                    <button
                      onClick={() => copyToClipboard(iamPolicySample, 'iam')}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/60"
                    >
                      {copiedKey === 'iam' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'iam' ? 'Copied!' : 'Copy Policy JSON'}</span>
                    </button>
                  </div>

                  <pre className="p-3 bg-black/90 rounded border border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto select-all max-h-48">
                    {iamPolicySample}
                  </pre>

                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    This restricts access specifically to your bucket <code className="text-white">arn:aws:s3:::{bucketName}</code> and objects inside it.
                  </div>
                </div>
              )}

              {/* TAB 3: CORS */}
              {activeTab === 'cors' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Configure CORS in AWS S3 Console &rarr; <code className="text-amber-400">{bucketName}</code> &rarr; <strong>Permissions</strong>:
                    </span>
                    <button
                      onClick={() => copyToClipboard(corsSample, 'cors')}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/60"
                    >
                      {copiedKey === 'cors' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cors' ? 'Copied!' : 'Copy CORS JSON'}</span>
                    </button>
                  </div>

                  <pre className="p-3 bg-black/90 rounded border border-slate-800 font-mono text-[11px] text-purple-300 overflow-x-auto select-all">
                    {corsSample}
                  </pre>

                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Enables direct viewing and PDF document rendering in the viewer modal canvas.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>How your documents are stored in AWS S3:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When you upload via the app, requests stream through the secure backend proxy <code className="text-slate-300">/api/s3/upload</code>. The Node.js server signs the request using your AWS SDK credentials and saves objects to <code className="text-amber-300">s3://{bucketName}/documents/&lt;timestamp&gt;_&lt;name&gt;</code> with AES-256 server-side encryption. Credentials are never exposed to client browsers.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target: <strong className="text-slate-200">s3://{bucketName} ({region})</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Header */}
        <div 
          className="px-5 py-3.5 border-b flex items-center justify-between transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent)'
              }}
            >
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AWS Storage & Textract</h2>
                <span 
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {bucketName}
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Connection verification & credentials guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={bucketConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-colors shadow-xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              <span>AWS Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Current Status Box */}
          <div 
            className="p-3.5 rounded-xl border flex items-start justify-between gap-3"
            style={{
              backgroundColor: 'var(--bg-surface-muted)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="flex items-start gap-2.5">
              {status?.isConfigured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>
                    {status?.isConfigured
                      ? 'Connected to Real AWS S3'
                      : 'Configured for archivex-vault (Simulation Mode)'}
                  </span>
                  <span 
                    className="text-[10px] px-1.5 py-0.2 rounded font-mono font-normal uppercase border"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {status?.mode || 'simulation'}
                  </span>
                </div>
                <div className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {status?.message || 'Verifying credentials on server...'}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div 
                    className="text-[10px] font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Database className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                    <span>s3://{bucketName}</span>
                  </div>
                  <div 
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Region: <strong style={{ color: 'var(--text-primary)' }}>{region}</strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1 text-xs border cursor-pointer shadow-xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
              title="Test connection again"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline font-medium">Test</span>
            </button>
          </div>

          {/* Quick Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>BUCKET</span>
              <span className="font-bold truncate block" style={{ color: 'var(--text-primary)' }} title={bucketName}>
                {bucketName}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>REGION</span>
              <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>
                {region}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>ACCESS KEY ID</span>
              <span className="font-bold" style={{ color: status?.hasCredentials ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {status?.hasCredentials ? 'Detected' : 'Pending .env'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>AWS TEXTRACT</span>
              <span className="font-bold truncate block" style={{ color: textractStatus?.isConfigured ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {textractStatus?.isConfigured ? 'Ready (Live)' : 'Pending Keys'}
              </span>
            </div>
          </div>

          {/* Guide Tabs */}
          <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
            <div 
              className="flex border-b px-2 pt-2 gap-1"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <button
                onClick={() => setActiveTab('env')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-t border-x transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTab === 'env' ? 'var(--bg-surface)' : 'transparent',
                  borderColor: activeTab === 'env' ? 'var(--border-subtle)' : 'transparent',
                  color: activeTab === 'env' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                <Key className="w-3.5 h-3.5" />
                <span>1. Environment (.env)</span>
              </button>

              <button
                onClick={() => setActiveTab('iam')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-t border-x transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTab === 'iam' ? 'var(--bg-surface)' : 'transparent',
                  borderColor: activeTab === 'iam' ? 'var(--border-subtle)' : 'transparent',
                  color: activeTab === 'iam' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>2. IAM Policy</span>
              </button>

              <button
                onClick={() => setActiveTab('cors')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-t border-x transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTab === 'cors' ? 'var(--bg-surface)' : 'transparent',
                  borderColor: activeTab === 'cors' ? 'var(--border-subtle)' : 'transparent',
                  color: activeTab === 'cors' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>3. S3 CORS</span>
              </button>
            </div>

            <div className="p-4 space-y-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {/* TAB 1: .ENV */}
              {activeTab === 'env' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Add these keys to your project's <code className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>.env</code> file:
                    </span>
                    <button
                      onClick={() => copyToClipboard(envSample, 'env')}
                      className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer shadow-xs transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'env' ? 'Copied' : 'Copy .env snippet'}</span>
                    </button>
                  </div>
                  
                  <pre 
                    className="p-3 rounded-lg border font-mono text-[11px] overflow-x-auto select-all"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {envSample}
                  </pre>
                </div>
              )}

              {/* TAB 2: IAM POLICY */}
              {activeTab === 'iam' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Attach this inline policy to your IAM User:
                    </span>
                    <button
                      onClick={() => copyToClipboard(iamPolicySample, 'iam')}
                      className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer shadow-xs transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {copiedKey === 'iam' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'iam' ? 'Copied' : 'Copy Policy JSON'}</span>
                    </button>
                  </div>

                  <pre 
                    className="p-3 rounded-lg border font-mono text-[11px] overflow-x-auto select-all max-h-48"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {iamPolicySample}
                  </pre>
                </div>
              )}

              {/* TAB 3: CORS */}
              {activeTab === 'cors' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Configure CORS in AWS S3 Console &rarr; <code className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{bucketName}</code> &rarr; Permissions:
                    </span>
                    <button
                      onClick={() => copyToClipboard(corsSample, 'cors')}
                      className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer shadow-xs transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {copiedKey === 'cors' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cors' ? 'Copied' : 'Copy CORS JSON'}</span>
                    </button>
                  </div>

                  <pre 
                    className="p-3 rounded-lg border font-mono text-[11px] overflow-x-auto select-all"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {corsSample}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Architecture Explanation */}
          <div 
            className="p-3 rounded-xl border text-xs space-y-1"
            style={{
              backgroundColor: 'var(--bg-surface-muted)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="font-bold flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-primary)' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>Storage Security:</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Uploads stream through the backend proxy route (<code className="font-mono" style={{ color: 'var(--text-primary)' }}>/api/s3/upload</code>). The Node.js server signs requests with AWS SDK credentials using server-side encryption. Credentials are never exposed client-side.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div 
          className="px-5 py-3.5 border-t flex items-center justify-between text-xs"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Target: <strong style={{ color: 'var(--text-primary)' }}>s3://{bucketName} ({region})</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg font-semibold transition-colors text-xs cursor-pointer shadow-sm"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)'
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

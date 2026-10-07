/**
 * S3 Service - Interacts with the server-side AWS S3 proxy routes (/api/s3/*)
 */

export interface S3StatusResponse {
  isConfigured: boolean;
  hasCredentials: boolean;
  bucket: string | null;
  region: string;
  mode: 'live' | 'simulation' | 'error';
  message: string;
  requiredEnvVars?: string[];
  errorCode?: string | number;
}

export interface S3UploadResult {
  success: boolean;
  bucket: string;
  key: string;
  s3Uri: string;
  s3Url: string;
  etag: string | null;
  region: string;
  sizeBytes: number;
  serverSideEncryption: string;
}

/**
 * Check if the server has real AWS S3 credentials and bucket configured
 */
export async function checkS3Status(): Promise<S3StatusResponse> {
  try {
    const res = await fetch('/api/s3/status');
    if (!res.ok) {
      throw new Error(`Status check returned ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      isConfigured: false,
      hasCredentials: false,
      bucket: 'archivex-vault',
      region: 'ap-southeast-2',
      mode: 'simulation',
      message: err.message || 'Running in local sandbox mode'
    };
  }
}

/**
 * Upload a file directly to the real AWS S3 bucket via the server proxy
 */
export async function uploadToRealS3(file: File, folder = 'documents'): Promise<S3UploadResult> {
  // Convert file to base64
  const base64Data = await fileToBase64(file);

  const res = await fetch('/api/s3/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      contentBase64: base64Data,
      folder
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload to real AWS S3');
  }

  return data;
}

/**
 * Get a presigned download URL for an S3 object
 */
export async function getS3PresignedDownloadUrl(key: string): Promise<string> {
  const res = await fetch(`/api/s3/presigned-url?key=${encodeURIComponent(key)}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate S3 download link');
  }
  return data.url;
}

/**
 * Delete an object from real AWS S3
 */
export async function deleteFromRealS3(key: string): Promise<boolean> {
  try {
    const res = await fetch('/api/s3/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key })
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export interface TextractStatusResponse {
  isConfigured: boolean;
  hasCredentials: boolean;
  region: string;
  mode: 'live' | 'simulation';
  message: string;
}

export interface TextractAnalyzeResponse {
  success: boolean;
  mode: 'live_aws_textract';
  durationMs: number;
  pageCount: number;
  avgConfidence: number;
  rawText: string;
  lineCount: number;
  blocks: any[];
  error?: string;
}

/**
 * Check if the server has real AWS Textract credentials configured
 */
export async function checkTextractStatus(): Promise<TextractStatusResponse> {
  try {
    const res = await fetch('/api/textract/status');
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      isConfigured: false,
      hasCredentials: false,
      region: 'ap-southeast-2',
      mode: 'simulation',
      message: err.message || 'Offline simulation'
    };
  }
}

/**
 * Analyze a document file using real AWS Textract
 */
export async function analyzeDocumentWithTextract(
  file: File,
  s3Bucket?: string,
  s3Key?: string
): Promise<TextractAnalyzeResponse | null> {
  try {
    const base64Data = await fileToBase64(file);
    const res = await fetch('/api/textract/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentBase64: base64Data,
        s3Bucket,
        s3Key,
        filename: file.name
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Real AWS Textract call failed, using fallback:', err);
    return null;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix (e.g. "data:application/pdf;base64,")
      const commaIdx = result.indexOf(',');
      if (commaIdx !== -1) {
        resolve(result.substring(commaIdx + 1));
      } else {
        resolve(result);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

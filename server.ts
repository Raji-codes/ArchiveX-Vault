import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command, 
  HeadBucketCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser limits for document uploads (support up to 50MB base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * Helper to construct an AWS S3 Client from environment variables
 */
function getS3Config() {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-southeast-2';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;
  const bucketName = process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME || 'archivex-vault';

  const hasCredentials = Boolean(accessKeyId && secretAccessKey);
  const isConfigured = Boolean(hasCredentials && bucketName);

  return {
    region,
    accessKeyId,
    secretAccessKey,
    sessionToken,
    bucketName,
    hasCredentials,
    isConfigured
  };
}

function createS3Client() {
  const config = getS3Config();
  if (!config.hasCredentials) {
    return null;
  }

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
      sessionToken: config.sessionToken
    }
  });
}

// -----------------------------------------------------------------------------
// S3 API Routes (/api/s3/*)
// -----------------------------------------------------------------------------

/**
 * GET /api/s3/status
 * Returns current AWS S3 connection status and bucket verification
 */
app.get('/api/s3/status', async (_req, res) => {
  const config = getS3Config();

  if (!config.hasCredentials) {
    return res.json({
      isConfigured: false,
      hasCredentials: false,
      bucket: config.bucketName || null,
      region: config.region,
      mode: 'simulation',
      message: `Targeting bucket '${config.bucketName}' in ${config.region}. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env to connect.`,
      requiredEnvVars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET', 'AWS_REGION']
    });
  }

  if (!config.bucketName) {
    return res.json({
      isConfigured: false,
      hasCredentials: true,
      bucket: null,
      region: config.region,
      mode: 'simulation',
      message: 'AWS credentials present, but AWS_S3_BUCKET is not set in environment.',
      requiredEnvVars: ['AWS_S3_BUCKET']
    });
  }

  // Attempt to ping bucket with HeadBucket
  try {
    const s3 = createS3Client();
    if (!s3) throw new Error('Could not instantiate S3 client');

    await s3.send(new HeadBucketCommand({ Bucket: config.bucketName }));

    return res.json({
      isConfigured: true,
      hasCredentials: true,
      bucket: config.bucketName,
      region: config.region,
      mode: 'live',
      message: `Successfully connected to real AWS S3 bucket: ${config.bucketName} (${config.region})`
    });
  } catch (err: any) {
    const errorCode = err?.$metadata?.httpStatusCode || err?.name || 'Error';
    return res.json({
      isConfigured: false,
      hasCredentials: true,
      bucket: config.bucketName,
      region: config.region,
      mode: 'error',
      message: `Failed to access bucket '${config.bucketName}': ${err.message || 'Check IAM permissions or bucket region'}`,
      errorCode
    });
  }
});

/**
 * POST /api/s3/upload
 * Uploads a document directly to the configured AWS S3 bucket
 */
app.post('/api/s3/upload', async (req, res) => {
  const config = getS3Config();

  if (!config.isConfigured) {
    return res.status(400).json({
      success: false,
      error: 'AWS S3 is not configured in server environment. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET.'
    });
  }

  const { filename, contentType, contentBase64, contentText, folder = 'documents' } = req.body;

  if (!filename) {
    return res.status(400).json({ success: false, error: 'filename is required' });
  }

  if (!contentBase64 && !contentText) {
    return res.status(400).json({ success: false, error: 'contentBase64 or contentText is required' });
  }

  try {
    const s3 = createS3Client();
    if (!s3) throw new Error('S3 client initialization failed');

    const buffer = contentBase64 
      ? Buffer.from(contentBase64, 'base64')
      : Buffer.from(contentText, 'utf-8');

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const objectKey = `${folder}/${timestamp}_${safeFilename}`;

    const putCommand = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
      ServerSideEncryption: 'AES256',
      Metadata: {
        'original-filename': encodeURIComponent(filename),
        'uploaded-by': 'docusense-cloud-vault',
        'upload-timestamp': timestamp.toString()
      }
    });

    const response = await s3.send(putCommand);

    const s3Uri = `s3://${config.bucketName}/${objectKey}`;
    const s3Url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${objectKey}`;

    return res.json({
      success: true,
      bucket: config.bucketName,
      key: objectKey,
      s3Uri,
      s3Url,
      etag: response.ETag?.replace(/"/g, '') || null,
      region: config.region,
      sizeBytes: buffer.length,
      serverSideEncryption: response.ServerSideEncryption || 'AES256'
    });
  } catch (err: any) {
    console.error('S3 upload error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to upload document to S3 bucket'
    });
  }
});

/**
 * GET /api/s3/presigned-url
 * Generates a presigned S3 GetObject download/view URL
 */
app.get('/api/s3/presigned-url', async (req, res) => {
  const config = getS3Config();
  const key = req.query.key as string;

  if (!config.isConfigured || !key) {
    return res.status(400).json({ success: false, error: 'S3 not configured or key missing' });
  }

  try {
    const s3 = createS3Client();
    if (!s3) throw new Error('S3 client initialization failed');

    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return res.json({ success: true, url, expiresInSeconds: 3600 });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/s3/delete
 * Deletes an object from the S3 bucket
 */
app.delete('/api/s3/delete', async (req, res) => {
  const config = getS3Config();
  const { key } = req.body;

  if (!config.isConfigured || !key) {
    return res.status(400).json({ success: false, error: 'S3 not configured or key missing' });
  }

  try {
    const s3 = createS3Client();
    if (!s3) throw new Error('S3 client initialization failed');

    await s3.send(new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key
    }));

    return res.json({ success: true, message: `Deleted object ${key} from ${config.bucketName}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/s3/list
 * Lists recent objects from the S3 bucket
 */
app.get('/api/s3/list', async (req, res) => {
  const config = getS3Config();
  const prefix = req.query.prefix !== undefined ? (req.query.prefix as string) : '';

  if (!config.isConfigured) {
    return res.json({ success: false, objects: [], message: 'S3 not configured' });
  }

  try {
    const s3 = createS3Client();
    if (!s3) throw new Error('S3 client initialization failed');

    const result = await s3.send(new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: prefix || undefined,
      MaxKeys: 50
    }));

    const objects = (result.Contents || []).map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      etag: obj.ETag?.replace(/"/g, '')
    }));

    return res.json({ success: true, count: objects.length, objects });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Vite Middleware / Static Serving
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DocuSense full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

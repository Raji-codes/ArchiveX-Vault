/**
 * ArchiveX Vault — AWS Lambda Document OCR & Processing Handler
 * 
 * Event-Driven Architecture:
 * - Triggered automatically by SQS queue messages or S3 ObjectCreated notifications.
 * - Extracts text, tables, and key metadata using AWS Textract.
 * - Dispatches processed metadata for fast in-memory and database indexing.
 */

import { TextractClient, DetectDocumentTextCommand, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'ap-southeast-2';
const textract = new TextractClient({ region });
const s3 = new S3Client({ region });

export const handler = async (event, context) => {
  console.log(`[ArchiveX-Lambda] Processing event with ${event.Records?.length || 1} records. RequestId: ${context?.awsRequestId}`);

  const results = [];

  // Support both SQS batch messages and direct S3 notifications
  const records = event.Records || [event];

  for (const record of records) {
    try {
      let bucket = '';
      let key = '';
      let documentId = '';

      // Check if message came from SQS
      if (record.eventSource === 'aws:sqs' || record.EventSource === 'aws:sqs') {
        const body = JSON.parse(record.body || '{}');
        
        // SQS could wrap an S3 event notification or a direct ArchiveX application message
        if (body.Records && body.Records[0]?.s3) {
          bucket = body.Records[0].s3.bucket.name;
          key = decodeURIComponent(body.Records[0].s3.object.key.replace(/\+/g, ' '));
        } else {
          bucket = body.s3Bucket || process.env.DOCUMENT_BUCKET;
          key = body.s3Key || body.key;
          documentId = body.documentId || '';
        }
      } 
      // Direct S3 Event Trigger
      else if (record.s3) {
        bucket = record.s3.bucket.name;
        key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      } 
      // Direct invocation
      else {
        bucket = record.s3Bucket || process.env.DOCUMENT_BUCKET;
        key = record.s3Key || record.key;
        documentId = record.documentId;
      }

      if (!bucket || !key) {
        console.warn('[ArchiveX-Lambda] Skipping record missing bucket or key:', record);
        continue;
      }

      console.log(`[ArchiveX-Lambda] Invoking AWS Textract on s3://${bucket}/${key}`);

      // Call AWS Textract with Fallback for Tables and Forms
      let textractResponse;
      try {
        textractResponse = await textract.send(new AnalyzeDocumentCommand({
          Document: {
            S3Object: {
              Bucket: bucket,
              Name: key
            }
          },
          FeatureTypes: ['TABLES', 'FORMS']
        }));
      } catch (analyzeErr) {
        console.info('[ArchiveX-Lambda] AnalyzeDocument not applicable, using DetectDocumentText:', analyzeErr.message);
        textractResponse = await textract.send(new DetectDocumentTextCommand({
          Document: {
            S3Object: {
              Bucket: bucket,
              Name: key
            }
          }
        }));
      }

      const blocks = textractResponse.Blocks || [];
      const lines = blocks
        .filter(b => b.BlockType === 'LINE' && b.Text)
        .map(b => b.Text);
      
      const wordBlocks = blocks.filter(b => b.BlockType === 'WORD' && typeof b.Confidence === 'number');
      const avgConfidence = wordBlocks.length > 0
        ? Number((wordBlocks.reduce((acc, b) => acc + b.Confidence, 0) / wordBlocks.length).toFixed(1))
        : 100;

      const summary = {
        status: 'SUCCESS',
        documentId: documentId || key,
        s3Uri: `s3://${bucket}/${key}`,
        lineCount: lines.length,
        avgConfidence,
        previewText: lines.slice(0, 5).join(' '),
        extractedAt: new Date().toISOString()
      };

      console.log(`[ArchiveX-Lambda] Successfully processed s3://${bucket}/${key}: ${lines.length} lines extracted (${avgConfidence}% confidence).`);
      results.push(summary);

    } catch (recordErr) {
      console.error('[ArchiveX-Lambda] Error processing record:', recordErr);
      // In SQS, throwing will route failed items to the Dead Letter Queue (DLQ) after retry limit
      throw recordErr;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'ArchiveX Lambda OCR processing completed',
      processedCount: results.length,
      results
    })
  };
};

# DocuSense Python Boto3 Backend

DocuSense is a production-grade serverless document ingestion and OCR pipeline built with **AWS Boto3**, **AWS Textract**, **Amazon DynamoDB**, **Amazon OpenSearch**, and **Amazon S3**.

## Architecture Flow

1. **Client Browser / App**: Generates a presigned S3 URL and uploads the document directly to Amazon S3.
2. **Amazon EventBridge**: Captures the \`s3:ObjectCreated\` event and routes it to the Lambda worker.
3. **AWS Lambda Ingest Worker**:
   - Calls **AWS Textract** (\`analyze_document\`) with \`TABLES\`, \`FORMS\`, and \`LAYOUT\`.
   - Runs **Smart Tagging Engine** to classify into tags like \`#invoice\`, \`#total\`, \`#receipt\`, \`#contract\`.
   - Writes document metadata to **Amazon DynamoDB** (single-digit millisecond latency).
   - Indexes raw OCR tokens and metadata into **Amazon OpenSearch** for sub-second highlighted snippet search.

## Quickstart & Local Testing

\`\`\`bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run unit tests
pytest tests/

# 3. Test Lambda locally with sample event
sam local invoke DocuSenseIngestWorker -e tests/sample_s3_event.json
\`\`\`

## Deploying to AWS

\`\`\`bash
# Make deploy script executable
chmod +x deploy.sh

# Run automated deployment
./deploy.sh
\`\`\`

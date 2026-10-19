# -----------------------------------------------------------------------------
# Amazon SQS (Simple Queue Service) & AWS Lambda Event-Driven Pipeline
# -----------------------------------------------------------------------------

# 1. Dead Letter Queue (DLQ) for failed document jobs
resource "aws_sqs_queue" "ocr_dlq" {
  name                      = "${var.bucket_name}-ocr-dlq"
  message_retention_seconds = 1209600 # 14 days

  tags = {
    Name    = "ArchiveX Document OCR Dead Letter Queue"
    Purpose = "Stores failed OCR tasks for debugging and redrive"
  }
}

# 2. Primary SQS Document Queue
resource "aws_sqs_queue" "ocr_queue" {
  name                       = "${var.bucket_name}-ocr-queue"
  visibility_timeout_seconds = 90  # Exceeds Lambda timeout (60s) to prevent double processing
  message_retention_seconds  = 345600 # 4 days
  receive_wait_time_seconds  = 20    # Enable Long Polling (Reduces empty queries to $0)

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.ocr_dlq.arn
    maxReceiveCount     = 3
  })

  tags = {
    Name    = "ArchiveX Document Ingestion Queue"
    Purpose = "Decouples client uploads from OCR extraction"
  }
}

# 3. Allow S3 Bucket to Publish Notifications to SQS
resource "aws_sqs_queue_policy" "ocr_queue_policy" {
  queue_url = aws_sqs_queue.ocr_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowS3ToPublish"
        Effect    = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.ocr_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_s3_bucket.vault.arn
          }
        }
      }
    ]
  })
}

# 4. S3 Event Notification -> SQS
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.vault.id

  queue {
    queue_arn     = aws_sqs_queue.ocr_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "documents/"
  }

  depends_on = [aws_sqs_queue_policy.ocr_queue_policy]
}

# -----------------------------------------------------------------------------
# AWS Lambda Serverless OCR Processor
# -----------------------------------------------------------------------------

# IAM Execution Role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "archivex-lambda-test-ocr-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Lambda: CloudWatch Logs, S3 Read, Textract OCR, SQS Polling
resource "aws_iam_policy" "lambda_policy" {
  name        = "archivex-lambda-test-ocr-policy"
  description = "Allows test Lambda to read documents from S3, run Textract OCR, and poll SQS queue"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # CloudWatch Logs
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      # S3 Read
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion"
        ]
        Resource = "${aws_s3_bucket.vault.arn}/*"
      },
      # AWS Textract OCR
      {
        Effect = "Allow"
        Action = [
          "textract:DetectDocumentText",
          "textract:AnalyzeDocument"
        ]
        Resource = "*"
      },
      # SQS Worker Permissions
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.ocr_queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Package Lambda source code into Zip file
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../lambda/ocr-processor/index.mjs"
  output_path = "${path.module}/ocr_processor_lambda.zip"
}

# Deploy AWS Lambda Function
resource "aws_lambda_function" "ocr_processor" {
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  function_name    = "archivex-test-ocr-processor"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  timeout          = 60
  memory_size      = 512

  environment {
    variables = {
      DOCUMENT_BUCKET = aws_s3_bucket.vault.id
      NODE_OPTIONS    = "--enable-source-maps"
    }
  }

  tags = {
    Name    = "ArchiveX Test OCR Processor Function"
    Managed = "Terraform"
  }
}

# Event Source Mapping: Triggers Lambda from SQS Queue
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.ocr_queue.arn
  function_name    = aws_lambda_function.ocr_processor.arn
  batch_size       = 5
  enabled          = true
}

# Attach SQS & Lambda invoke permissions to the App IAM user
resource "aws_iam_user_policy" "app_sqs_lambda_policy" {
  name = "archivex-app-test-sqs-lambda-policy"
  user = aws_iam_user.app_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",
          "sqs:GetQueueUrl",
          "sqs:GetQueueAttributes",
          "sqs:ListQueues"
        ]
        Resource = [
          aws_sqs_queue.ocr_queue.arn,
          aws_sqs_queue.ocr_dlq.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "lambda:GetFunction"
        ]
        Resource = aws_lambda_function.ocr_processor.arn
      }
    ]
  })
}

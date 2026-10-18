output "aws_region" {
  description = "Deployed AWS region"
  value       = var.aws_region
}

output "s3_bucket_name" {
  description = "The created Amazon S3 bucket name"
  value       = aws_s3_bucket.vault.id
}

output "s3_bucket_arn" {
  description = "The ARN of the Amazon S3 bucket"
  value       = aws_s3_bucket.vault.arn
}

output "iam_user_name" {
  description = "The IAM service user name"
  value       = aws_iam_user.app_user.name
}

output "iam_access_key_id" {
  description = "AWS Access Key ID for application environment (.env)"
  value       = aws_iam_access_key.app_user_key.id
}

output "iam_secret_access_key" {
  description = "AWS Secret Access Key for application environment (.env)"
  value       = aws_iam_access_key.app_user_key.secret
  sensitive   = true
}

output "sqs_queue_url" {
  description = "URL of the primary SQS document ingestion queue"
  value       = aws_sqs_queue.ocr_queue.id
}

output "sqs_queue_arn" {
  description = "ARN of the primary SQS document ingestion queue"
  value       = aws_sqs_queue.ocr_queue.arn
}

output "sqs_dlq_url" {
  description = "URL of the SQS Dead Letter Queue (DLQ)"
  value       = aws_sqs_queue.ocr_dlq.id
}

output "lambda_function_arn" {
  description = "ARN of the serverless OCR processor Lambda function"
  value       = aws_lambda_function.ocr_processor.arn
}

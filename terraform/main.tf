terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "ArchiveX-Vault"
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  }
}

# -----------------------------------------------------------------------------
# Amazon S3 Bucket: ArchiveX Document Store
# -----------------------------------------------------------------------------
resource "aws_s3_bucket" "vault" {
  bucket        = var.bucket_name
  force_destroy = false

  tags = {
    Name = "ArchiveX Document Vault Storage"
  }
}

# Enforce Bucket Owner Ownership (Disables legacy S3 ACLs)
resource "aws_s3_bucket_ownership_controls" "vault" {
  bucket = aws_s3_bucket.vault.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Block all Public Access (Security Best Practice)
resource "aws_s3_bucket_public_access_block" "vault" {
  bucket = aws_s3_bucket.vault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Server-Side Encryption at Rest (SSE-S3 AES-256)
resource "aws_s3_bucket_server_side_encryption_configuration" "vault" {
  bucket = aws_s3_bucket.vault.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Cross-Origin Resource Sharing (CORS) for Direct / Presigned Uploads
resource "aws_s3_bucket_cors_configuration" "vault" {
  bucket = aws_s3_bucket.vault.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = var.allowed_cors_origins
    expose_headers  = ["ETag", "x-amz-server-side-encryption"]
    max_age_seconds = 3000
  }
}

# S3 Lifecycle Rules: Cost Optimization Tiering
resource "aws_s3_bucket_lifecycle_configuration" "vault" {
  bucket = aws_s3_bucket.vault.id

  rule {
    id     = "archive-infrequent-access"
    status = "Enabled"

    # Move older files to cheaper S3 Standard-IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Move to Glacier Flexible Retrieval after 90 days for deep cost savings
    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # Clean up incomplete multipart uploads after 7 days
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# -----------------------------------------------------------------------------
# AWS IAM: Least-Privilege Identity & Access Management
# -----------------------------------------------------------------------------
resource "aws_iam_user" "app_user" {
  name = "archivex-app-user"
  path = "/system/"

  tags = {
    Description = "Service user for ArchiveX Vault Node.js Backend API"
  }
}

resource "aws_iam_access_key" "app_user_key" {
  user = aws_iam_user.app_user.name
}

# Least-Privilege Policy: Restricts S3 and Textract actions
resource "aws_iam_policy" "vault_least_privilege" {
  name        = "ArchiveXVaultAccessPolicy"
  description = "Least privilege policy granting S3 bucket access and Textract OCR permissions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3BucketLevelAccess"
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:GetBucketCors"
        ]
        Resource = aws_s3_bucket.vault.arn
      },
      {
        Sid    = "S3ObjectLevelAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:AbortMultipartUpload"
        ]
        Resource = "${aws_s3_bucket.vault.arn}/*"
      },
      {
        Sid    = "TextractDocumentAnalysis"
        Effect = "Allow"
        Action = [
          "textract:DetectDocumentText",
          "textract:AnalyzeDocument"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "vault_attach" {
  user       = aws_iam_user.app_user.name
  policy_arn = aws_iam_policy.vault_least_privilege.arn
}

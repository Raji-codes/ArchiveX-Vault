variable "aws_region" {
  description = "The AWS Region where infrastructure will be deployed."
  type        = string
  default     = "ap-southeast-2"
}

variable "bucket_name" {
  description = "Unique name for the Amazon S3 document bucket."
  type        = string
  default     = "archivex-vault-test-storage"
}

variable "environment" {
  description = "Environment tag (e.g., development, staging, production, test)."
  type        = string
  default     = "test"
}

variable "allowed_cors_origins" {
  description = "List of permitted frontend origin URLs allowed to make requests."
  type        = list(string)
  default     = ["http://localhost:3000", "https://*.run.app"]
}

#!/usr/bin/env bash
set -euo pipefail

echo "======================================================="
echo "   DocuSense Serverless AWS Pipeline Deployment        "
echo "======================================================="

# Verify AWS CLI and SAM CLI
command -v aws >/dev/null 2>&1 || { echo "AWS CLI is required but not installed."; exit 1; }
command -v sam >/dev/null 2>&1 || { echo "AWS SAM CLI is required but not installed."; exit 1; }

echo "[1/4] Validating AWS credentials..."
aws sts get-caller-identity

echo "[2/4] Building SAM artifacts..."
sam build --use-container

echo "[3/4] Deploying CloudFormation stack..."
sam deploy \\
  --stack-name docusense-ocr-stack \\
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \\
  --resolve-s3 \\
  --no-confirm-changeset

echo "[4/4] Deployment complete! Stack outputs:"
aws cloudformation describe-stacks \\
  --stack-name docusense-ocr-stack \\
  --query "Stacks[0].Outputs" \\
  --output table

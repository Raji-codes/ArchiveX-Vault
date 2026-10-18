# 🏛️ ArchiveX Vault — Document Intelligence & Cloud Storage System

[![AWS S3](https://img.shields.io/badge/AWS_S3-Object_Storage-FF9900?logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![AWS Textract](https://img.shields.io/badge/AWS_Textract-Intelligent_OCR-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/textract/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC_v1.3+-844FBA?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![AWS SDK v3](https://img.shields.io/badge/AWS_SDK-v3_Modular-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/sdk-for-javascript/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-REST_API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**ArchiveX Vault** is an enterprise-grade cloud-native document intelligence and storage platform. Built with **Node.js, Express, React, and AWS Cloud Services**, it automates secure file lifecycle management on **Amazon S3** and performs real-time optical document parsing using **AWS Textract**.

---

## 📌 What ArchiveX Does

1. **Intelligent Document Ingestion:**
   Upload invoices, receipts, contracts, PDFs, and high-resolution images with real-time MIME-type validation and client-side sanitization.
2. **Automated AI/ML Text Extraction:**
   Integrates directly with **AWS Textract** (`DetectDocumentTextCommand` & `AnalyzeDocumentCommand`) to extract raw text, key-value pairs, tables, and document metadata on upload.
3. **Secure Cloud Archiving:**
   Stores all binary objects in **Amazon S3** with **AES-256 Server-Side Encryption (SSE-S3)**, strict bucket-owner enforcement, and zero public access.
4. **Time-Bounded Presigned URLs:**
   Uses `@aws-sdk/s3-request-presigner` to issue temporary cryptographic download links (expiring after 15 minutes), offloading heavy media streaming from the application server.
5. **Instant In-Memory Keyword Search:**
   Indexes document content in real-time for millisecond-level full-text retrieval across thousands of pages.

---

## 📐 Cloud System Architecture

### Visual Diagram
![ArchiveX Vault AWS Cloud Architecture](public/architecture-diagram.jpg)

### Architecture Data Flow (Mermaid)

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser)"]
        UI["React 19 Frontend UI<br/>(Tailwind CSS + Lucide Icons)"]
    end

    subgraph Server ["Backend Gateway (Node.js & Express)"]
        API["REST API Controller<br/>(/api/files, /api/textract)"]
        SDK["AWS SDK v3 Client Pool<br/>(S3Client & TextractClient)"]
        Presigner["AWS S3 Request Presigner<br/>(Temporary Secure URLs)"]
        HealthCheck["Proactive Bucket Verification<br/>(HeadBucketCommand)"]
    end

    subgraph AWS ["Amazon Web Services (AWS Cloud)"]
        direction TB
        S3[("Amazon S3 Bucket<br/>(Encrypted Cloud Storage)")]
        Textract["AWS Textract AI/ML<br/>(DetectDocumentText & AnalyzeDocument)"]
        IAM["AWS IAM Policies<br/>(Least Privilege Access)"]
    end

    UI -->|"1. Multipart Document Ingestion"| API
    API -->|"2. Authenticate & Route"| SDK
    SDK -->|"3. Validate Credentials & State"| IAM
    SDK -->|"4. Stream PutObjectCommand"| S3
    SDK -->|"5. Trigger Optical OCR Analysis"| Textract
    Textract -->|"6. Structured OCR JSON Response"| API
    Presigner -->|"7. Generate Time-Bounded Signed URL"| UI
    UI -.->|"8. Direct Client Secure Download"| S3
```

---

## 🏗️ Infrastructure as Code (Terraform)

All AWS cloud infrastructure for this project is codified using **Terraform** in the `/terraform` directory:

* `terraform/main.tf` — Provisions Amazon S3 bucket, server-side encryption, CORS, lifecycle tiering, IAM user, and least-privilege policies.
* `terraform/variables.tf` — Configurable regions, bucket names, and CORS origins.
* `terraform/outputs.tf` — Exports bucket names and API credentials for `.env`.
* `terraform/terraform.tfvars.example` — Template for custom deployments.

---

## 🚀 How to Deploy ArchiveX

### Option A: Local / Development Deployment

#### 1. Clone & Install
```bash
git clone https://github.com/Raji-codes/ArchiveX-Vault.git
cd ArchiveX-Vault
npm install
```

#### 2. Provision AWS Cloud Resources with Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```
*Terraform will output your `s3_bucket_name`, `iam_access_key_id`, and `iam_secret_access_key`.*

#### 3. Configure `.env`
In the project root, create a `.env` file using the Terraform outputs:
```env
PORT=3000
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_iam_access_key_id
AWS_SECRET_ACCESS_KEY=your_iam_secret_access_key
AWS_S3_BUCKET=your_s3_bucket_name
```

#### 4. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Production Cloud Hosting on AWS (AWS App Runner)

Deploy ArchiveX using **AWS App Runner** (fully managed container service with automatic HTTPS and zero virtual machine maintenance):

1. **Connect Repository:** Link your GitHub repository (`ArchiveX-Vault`) in the AWS App Runner console.
2. **Build Configuration:**
   * **Runtime:** Node.js 18+
   * **Build command:** `npm install && npm run build`
   * **Start command:** `npm start`
   * **Port:** `3000`
3. **Environment Variables:**
   * Configure `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET` securely in the App Runner console configuration.

---

## 💰 AWS Cost & Free Tier Breakdown

ArchiveX Vault was specifically engineered to run **completely within the AWS Free Tier ($0/month)** during prototyping and evaluation:

| AWS Service | Free Tier Allowance | ArchiveX Vault Usage | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Amazon S3** | **5 GB** Standard Storage<br/>20,000 GET / 2,000 PUT requests/mo | Stores documents & archives | **$0.00 / month** |
| **AWS Textract** | **1,000 pages / month** for 3 months | Document text & table extraction | **$0.00 / month** |
| **Data Transfer** | **100 GB** free egress per month | Presigned URL downloads & API calls | **$0.00 / month** |

### 📉 Cost Optimization Engineering Decisions
1. **S3 Lifecycle Tiering:** Files automatically transition to **S3 Standard-IA (Infrequent Access)** after 30 days and **S3 Glacier** after 90 days, cutting storage costs by up to **80%**.
2. **Presigned URL Offloading:** Streaming multi-megabyte files directly between the browser and S3 avoids doubling network egress and reduces server CPU/RAM consumption.
3. **Incomplete Multipart Abort:** Terraform rules automatically purge abandoned chunked uploads after 7 days, preventing orphan storage charges.

---

## 🔒 Security Best Practices Implemented
* **Zero Secret Exposure:** Credentials are never bundled in client code; requests are mediated by server-side AWS SDK v3.
* **IAM Least Privilege:** Dedicated IAM policy only grants `s3:GetObject`, `s3:PutObject`, and `textract:DetectDocumentText`.
* **S3 Block Public Access:** All four AWS public access blocks are strictly enabled on the bucket.
* **SSE-S3 AES-256 Encryption:** Objects are encrypted at rest with AWS-managed keys.

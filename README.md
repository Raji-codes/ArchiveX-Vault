# 🏛️ ArchiveX Vault — Cloud-Native Document Intelligence & Storage Platform

[![AWS S3](https://img.shields.io/badge/AWS_S3-Object_Storage-FF9900?logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![AWS Textract](https://img.shields.io/badge/AWS_Textract-Intelligent_OCR-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/textract/)
[![AWS SDK v3](https://img.shields.io/badge/AWS_SDK-v3_Modular-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/sdk-for-javascript/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-REST_API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An enterprise-grade document intelligence platform built with **Node.js, Express, React, and AWS Cloud Services**. The system automates secure cloud storage on **Amazon S3** and performs real-time optical document parsing using **AWS Textract**.

---

## 📐 System Cloud Architecture

GitHub renders this diagram automatically:

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        UI["React 19 Frontend<br/>(Tailwind CSS + Lucide Icons)"]
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

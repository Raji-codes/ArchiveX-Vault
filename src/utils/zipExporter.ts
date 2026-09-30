import JSZip from 'jszip';
import { BOTO3_BACKEND_FILES } from '../data/boto3Files';

export async function exportBoto3BackendAsZip(): Promise<void> {
  const zip = new JSZip();

  // Root folder inside the zip
  const rootFolder = zip.folder('docusense-boto3-backend');

  if (!rootFolder) {
    throw new Error('Failed to initialize zip directory');
  }

  for (const file of BOTO3_BACKEND_FILES) {
    rootFolder.file(file.path, file.content);
  }

  // Also include a sample s3 event in tests folder
  const sampleEvent = {
    Records: [
      {
        eventVersion: "2.1",
        eventSource: "aws:s3",
        awsRegion: "ap-southeast-2",
        eventTime: "2026-09-22T14:32:01.000Z",
        eventName: "ObjectCreated:Put",
        s3: {
          s3SchemaVersion: "1.0",
          bucket: {
            name: "archivex-vault",
            arn: "arn:aws:s3:::archivex-vault"
          },
          object: {
            key: "invoices/2026/09/AWS_Invoice_INV-2026-9812.pdf",
            size: 245760,
            eTag: "8f1b2c4a9e3d7021c3b7a5e8f01248ab"
          }
        }
      }
    ]
  };

  rootFolder.file('tests/sample_s3_event.json', JSON.stringify(sampleEvent, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'docusense-python-boto3-backend.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

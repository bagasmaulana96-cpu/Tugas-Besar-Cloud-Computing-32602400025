import { S3Client } from "@aws-sdk/client-s3";

// ForcePathStyle required for LocalStack URL format
export const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  endpoint: process.env.AWS_ENDPOINT_URL ?? "http://localhost:4566",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
  },
  forcePathStyle: true,
});

export const S3_BUCKET = process.env.S3_BUCKET_NAME ?? "levelup-profiles";

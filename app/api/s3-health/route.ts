import { NextResponse } from "next/server";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET } from "@/lib/s3";

export async function GET() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    return NextResponse.json(
      { status: "connected", bucket: S3_BUCKET },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "ECONNREFUSED";
    return NextResponse.json(
      { status: "disconnected", error: message },
      { status: 200 },
    );
  }
}

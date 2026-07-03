import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file)
    return NextResponse.json(
      { error: "File tidak ditemukan." },
      { status: 400 },
    );

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung." },
      { status: 400 },
    );
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File terlalu besar. Maks 5MB." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split("/")[1];
  const key = `avatars/${user.id}.${ext}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );
  } catch {
    return NextResponse.json({ error: "Gagal upload ke S3" }, { status: 500 });
  }

  const endpoint = process.env.AWS_ENDPOINT_URL ?? "http://localhost:4566";
  const url = `${endpoint}/${S3_BUCKET}/${key}`;

  await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);

  return NextResponse.json({ url }, { status: 200 });
}

"use client";
import AvatarUpload from "./avatar-upload";

interface AvatarUploadWrapperProps {
  avatarUrl: string | null;
  name: string | null;
}

export default function AvatarUploadWrapper({
  avatarUrl,
  name,
}: AvatarUploadWrapperProps) {
  return (
    <AvatarUpload
      avatarUrl={avatarUrl}
      name={name}
      onUploadSuccess={() => {}}
    />
  );
}

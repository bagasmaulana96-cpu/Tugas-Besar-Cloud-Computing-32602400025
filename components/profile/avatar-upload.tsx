"use client";

import React, { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string | null;
  name: string | null;
  onUploadSuccess: (url: string) => void;
}

export default function AvatarUpload({
  avatarUrl,
  name,
  onUploadSuccess,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipe file tidak didukung.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File terlalu besar. Maks 5MB.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal upload.");
      } else {
        onUploadSuccess(data.url);
      }
    } catch {
      setError("Gagal upload. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const initial = name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-32 h-32 rounded-full relative group cursor-pointer overflow-hidden border-2 border-purple-mid"
        onClick={() => fileInputRef.current?.click()}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name ?? "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-dim flex items-center justify-center">
            <span className="text-purple-light text-4xl font-bold">
              {initial}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Camera size={24} className="text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 size={24} className="text-white animate-spin" />
          </div>
        )}
        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-blue-main border-2 border-bg-card" />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-red-main text-xs text-center max-w-[150px]">
          {error}
        </p>
      )}
    </div>
  );
}

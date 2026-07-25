"use client";

import { FileText } from "lucide-react";

interface CSVUploadAreaProps {
  title: string;
  hint: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CSVUploadArea({ title, hint, onFileChange }: CSVUploadAreaProps) {
  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition group">
        <FileText
          className="mb-3 text-gray-500 group-hover:scale-110 transition"
          size={36}
        />

        <p className="font-medium text-base">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{hint}</p>

        <input
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
"use client";

import { ChangeEvent, useState } from "react";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  return (
    <main className="flex h-full  flex-col overflow-y-auto bg-zinc-900 p-8 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-bold">Upload files</h1>

        <p className="mt-2 text-zinc-400">
          Upload documents that your RAG chat can answer questions about.
        </p>

        <label className="mt-8 group flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 p-8 text-center transition hover:border-blue-500 hover:bg-zinc-900">
          <span className="text-5xl group-hover:animate-bounce">📄</span>

          <span className="mt-4 text-lg font-medium">
            Click to choose a file
          </span>

          <span className="mt-2 text-sm text-zinc-500">
            TXT first. PDF and image support comes next.
          </span>

          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFile && (
          <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-medium">{selectedFile.name}</p>

            <p className="mt-1 text-sm text-zinc-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>

            <button
              type="button"
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
            >
              Add to RAG
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
type UploadedDocument = {
  id: string;
  file_name: string;
  mime_type: string;
  created_at: string;
  chunks_count: number;
};
export default function UploadPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch("/api/documents");

      if (!response.ok) {
        throw new Error("Could not load documents");
      }

      const data = await response.json();

      setDocuments(data.documents);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, []);
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  const handleAddToRag = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setResultMessage("");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      setResultMessage(
        `${data.fileName} is ready. ${data.chunksCreated} chunks were added to RAG.`,
      );

      setSelectedFile(null);
    } catch (error) {
      setResultMessage(
        error instanceof Error ? error.message : "Upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden bg-amber-900 text-white">
      <div className="mx-auto w-full overflow-y-scroll p-12 max-w-3xl">
        <h1 className="text-3xl font-bold">Upload files</h1>
        <p className="mt-2 text-zinc-400">
          Upload documents that your RAG chat can answer questions about.
        </p>
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Your uploaded files</h2>

          {isLoadingDocuments && (
            <p className="mt-4 text-sm text-zinc-400">Loading files...</p>
          )}

          {!isLoadingDocuments && documents.length === 0 && (
            <p className="mt-4 text-sm text-zinc-400">
              You have not uploaded any files yet.
            </p>
          )}

          <div className="mt-4 space-y-3">
            {documents.map((document) => (
              <article
                key={document.id}
                className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-950 p-4"
              >
                <div>
                  <p className="font-medium text-white">{document.file_name}</p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {document.chunks_count} chunks ·{" "}
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  Ready
                </span>
              </article>
            ))}
          </div>
        </section>
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
        <button
          type="button"
          onClick={handleAddToRag}
          disabled={isUploading}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium disabled:opacity-50"
        >
          {isUploading ? "Adding to RAG..." : "Add to RAG"}
        </button>
        {resultMessage && (
          <p className="mt-4 text-sm text-zinc-300">{resultMessage}</p>
        )}
        {selectedFile && (
          <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-medium">{selectedFile.name}</p>

            <p className="mt-1 text-sm text-zinc-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

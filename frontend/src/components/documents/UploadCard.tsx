import { Button, Input } from "@/components/ui";
import { UploadProgress } from "@/components/documents/UploadProgress";
import { cn } from "@/utils";
import { validateUploadFile } from "@/utils/document.utils";
import type { UploadProgressState } from "@/types/document";
import { useCallback, useRef, useState, type DragEvent } from "react";

interface UploadCardProps {
  title: string;
  onTitleChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploadState: UploadProgressState;
  disabled?: boolean;
  titleError?: string;
}

export const UploadCard = ({
  title,
  onTitleChange,
  onUpload,
  uploadState,
  disabled = false,
  titleError,
}: UploadCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const error = validateUploadFile(file);
      if (error) {
        setFileError(error);
        return;
      }

      setFileError(null);
      setSelectedFile(file);
    },
    [],
  );

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedFile) {
      setFileError("Please select a file to upload");
      return;
    }

    await onUpload(selectedFile);
  };

  const isBusy = disabled || uploadState.stage === "uploading" || uploadState.stage === "processing";

  return (
    <div className="space-y-6">
      <Input
        label="Document title"
        placeholder="Enter a descriptive title"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        error={titleError}
        disabled={isBusy}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50",
          isBusy ? "pointer-events-none opacity-60" : "cursor-pointer hover:border-blue-400",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
          📄
        </div>
        <p className="mt-4 text-sm font-medium text-slate-900">
          Drag & drop your file here, or click to browse
        </p>
        <p className="mt-1 text-xs text-slate-500">PDF or TXT · Max 5 MB</p>

        {selectedFile ? (
          <p className="mt-4 text-sm text-blue-700">
            Selected: <span className="font-medium">{selectedFile.name}</span>
          </p>
        ) : null}

        {fileError ? <p className="mt-3 text-sm text-red-600">{fileError}</p> : null}
      </div>

      <UploadProgress
        stage={uploadState.stage}
        progress={uploadState.progress}
        message={uploadState.message}
      />

      <Button
        className="w-full sm:w-auto"
        onClick={() => void handleSubmit()}
        isLoading={isBusy}
        disabled={!title.trim() || !selectedFile}
      >
        Upload document
      </Button>
    </div>
  );
};

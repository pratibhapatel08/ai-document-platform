import { UploadCard } from "@/components/documents";
import { Card } from "@/components/ui";
import { useDocumentUpload } from "@/hooks";
import { useState } from "react";

export const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | undefined>();
  const { uploadState, uploadDocument, resetUpload } = useDocumentUpload();

  const handleUpload = async (file: File): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }

    setTitleError(undefined);
    const success = await uploadDocument(trimmedTitle, file);

    if (success) {
      setTitle("");
      setTimeout(() => resetUpload(), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Document</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload PDF or TXT files up to 5 MB for AI summarization and indexing.
        </p>
      </div>

      <Card>
        <UploadCard
          title={title}
          onTitleChange={setTitle}
          onUpload={handleUpload}
          uploadState={uploadState}
          titleError={titleError}
          disabled={uploadState.stage === "uploading" || uploadState.stage === "processing"}
        />
      </Card>
    </div>
  );
};

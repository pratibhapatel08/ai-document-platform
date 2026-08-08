import { useToast } from "@/context";
import { documentService } from "@/services/document.service";
import type { UploadProgressState } from "@/types/document";
import { useCallback, useState } from "react";

const initialState: UploadProgressState = {
  stage: "idle",
  progress: 0,
  message: "",
};

export const useDocumentUpload = () => {
  const { showSuccess, showError } = useToast();
  const [uploadState, setUploadState] = useState<UploadProgressState>(initialState);

  const resetUpload = useCallback(() => {
    setUploadState(initialState);
  }, []);

  const uploadDocument = useCallback(
    async (title: string, file: File): Promise<boolean> => {
      try {
        setUploadState({
          stage: "uploading",
          progress: 0,
          message: "Uploading file...",
        });

        const document = await documentService.upload(title, file, (progress) => {
          setUploadState({
            stage: "uploading",
            progress,
            message: "Uploading file...",
          });
        });

        setUploadState({
          stage: "processing",
          progress: 100,
          message: "Processing document with AI...",
        });

        if (document.processingStatus === "completed") {
          setUploadState({
            stage: "completed",
            progress: 100,
            message: "Document uploaded and processed successfully",
          });
          showSuccess("Document uploaded successfully");
          return true;
        }

        setUploadState({
          stage: "failed",
          progress: 100,
          message: document.processingError ?? "Processing failed",
        });
        showError(document.processingError ?? "Document processing failed");
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setUploadState({
          stage: "failed",
          progress: 0,
          message,
        });
        showError(message);
        return false;
      }
    },
    [showSuccess, showError],
  );

  return { uploadState, uploadDocument, resetUpload };
};

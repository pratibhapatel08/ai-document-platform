export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["application/pdf", "text/plain"] as const;
export const ACCEPTED_EXTENSIONS = [".pdf", ".txt"] as const;
export const DOCUMENTS_PAGE_SIZE = 10;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateUploadFile = (file: File): string | null => {
  if (!ACCEPTED_FILE_TYPES.includes(file.type as (typeof ACCEPTED_FILE_TYPES)[number])) {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(extension as (typeof ACCEPTED_EXTENSIONS)[number])) {
      return "Only PDF and TXT files are allowed";
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size must not exceed 5 MB";
  }

  return null;
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "processing":
      return "bg-amber-100 text-amber-800 ring-amber-200";
    case "completed":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    case "failed":
      return "bg-red-100 text-red-800 ring-red-200";
    default:
      return "bg-slate-100 text-slate-800 ring-slate-200";
  }
};

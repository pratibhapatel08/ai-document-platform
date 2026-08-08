import { DocumentListView } from "./DocumentListView";

export const MyDocumentsPage = () => {
  return (
    <DocumentListView
      title="My Documents"
      description="Browse, search, and manage your uploaded documents."
      emptyTitle="No documents yet"
      emptyDescription="Upload your first document to get AI-powered summaries and insights."
    />
  );
};

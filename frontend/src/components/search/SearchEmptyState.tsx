import { DocumentsEmptyState } from "@/components/documents";

interface SearchEmptyStateProps {
  query: string;
}

export const SearchEmptyState = ({ query }: SearchEmptyStateProps) => {
  return (
    <DocumentsEmptyState
      icon="🔍"
      title="No matching documents found"
      description={`We couldn't find any documents semantically similar to "${query}". Try different keywords or upload more documents.`}
    />
  );
};

import type { ReactNode } from "react";

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const highlightText = (text: string, query: string): ReactNode => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const words = trimmedQuery.split(/\s+/).filter(Boolean);
  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    pattern.test(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-yellow-200 px-0.5 text-slate-900">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

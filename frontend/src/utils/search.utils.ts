export const truncateText = (text: string, maxLength = 180): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
};

export const getSummaryPreview = (summary: string): string => {
  const withoutHeadings = summary.replace(/^##\s.*$/gm, "").trim();
  return truncateText(withoutHeadings, 200);
};

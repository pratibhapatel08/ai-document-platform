export const SUMMARY_SECTIONS = [
  "Executive Summary",
  "Key Points",
  "Important Technologies",
  "Conclusion",
] as const;

export type SummarySection = (typeof SUMMARY_SECTIONS)[number];

export const FINAL_SUMMARY_SYSTEM_PROMPT = `You are an expert document analyst. Your task is to produce clear, accurate, and well-structured summaries.

Always format the summary using exactly these markdown headings in this order:
## Executive Summary
## Key Points
## Important Technologies
## Conclusion

Guidelines:
- Be concise but comprehensive.
- Use bullet points under "Key Points" where appropriate.
- Under "Important Technologies", list technologies, tools, frameworks, or technical concepts mentioned. If none are found, state "No specific technologies were identified in this document."
- Base your summary strictly on the provided text. Do not invent information.
- Write in professional, plain language.`;

export const CHUNK_SUMMARY_SYSTEM_PROMPT = `You are an expert document analyst. Summarize the provided document section accurately and concisely.

Focus on:
- Main ideas and arguments
- Key facts, figures, and decisions
- Technologies, tools, or technical concepts mentioned

Do not use markdown section headings. Write a dense paragraph summary suitable for merging with other section summaries later.`;

export const COMBINED_SUMMARY_SYSTEM_PROMPT = FINAL_SUMMARY_SYSTEM_PROMPT;

export const buildDirectSummaryUserPrompt = (text: string, title?: string): string => {
  const titleLine = title ? `Document title: "${title}"\n\n` : "";

  return `${titleLine}Summarize the following document text:

---
${text}
---`;
};

export const buildChunkSummaryUserPrompt = (
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  title?: string,
): string => {
  const titleLine = title ? `Document title: "${title}"\n` : "";

  return `${titleLine}Summarize section ${chunkIndex + 1} of ${totalChunks} from the document:

---
${chunk}
---`;
};

export const buildCombinedSummaryUserPrompt = (
  chunkSummaries: string[],
  title?: string,
): string => {
  const titleLine = title ? `Document title: "${title}"\n\n` : "";
  const combined = chunkSummaries
    .map((summary, index) => `### Section ${index + 1}\n${summary}`)
    .join("\n\n");

  return `${titleLine}The document was processed in ${chunkSummaries.length} sections. Combine the section summaries below into one cohesive final summary using the required markdown headings.

---
${combined}
---`;
};

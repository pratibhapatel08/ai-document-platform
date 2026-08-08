export interface TextChunkOptions {
  maxChunkSize: number;
}

const splitIntoParagraphs = (text: string): string[] => {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
};

const splitOversizedParagraph = (paragraph: string, maxChunkSize: number): string[] => {
  const chunks: string[] = [];
  let start = 0;

  while (start < paragraph.length) {
    chunks.push(paragraph.slice(start, start + maxChunkSize));
    start += maxChunkSize;
  }

  return chunks;
};

export const splitTextIntoChunks = (text: string, options: TextChunkOptions): string[] => {
  const normalizedText = text.trim();

  if (normalizedText.length === 0) {
    return [];
  }

  if (normalizedText.length <= options.maxChunkSize) {
    return [normalizedText];
  }

  const paragraphs = splitIntoParagraphs(normalizedText);
  const chunks: string[] = [];
  let currentChunk = "";

  const pushCurrentChunk = (): void => {
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > options.maxChunkSize) {
      pushCurrentChunk();
      chunks.push(...splitOversizedParagraph(paragraph, options.maxChunkSize));
      continue;
    }

    const nextChunk = currentChunk.length === 0 ? paragraph : `${currentChunk}\n\n${paragraph}`;

    if (nextChunk.length <= options.maxChunkSize) {
      currentChunk = nextChunk;
      continue;
    }

    pushCurrentChunk();
    currentChunk = paragraph;
  }

  pushCurrentChunk();

  return chunks.length > 0 ? chunks : [normalizedText];
};

export const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / 4);
};

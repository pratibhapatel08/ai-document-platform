import { env } from "../config/env";
import {
  buildChunkSummaryUserPrompt,
  buildCombinedSummaryUserPrompt,
  buildDirectSummaryUserPrompt,
  CHUNK_SUMMARY_SYSTEM_PROMPT,
  COMBINED_SUMMARY_SYSTEM_PROMPT,
  FINAL_SUMMARY_SYSTEM_PROMPT,
} from "../constants/summary.prompts";
import { AppError } from "../utils/AppError";
import { splitTextIntoChunks } from "../utils/textChunker";
import { openaiService } from "./ai.service";
import type { OpenAIChatClient } from "../types/openai.types";

export interface GenerateSummaryParams {
  extractedText: string;
  title?: string;
}

export interface SummaryGenerationResult {
  summary: string;
}

const summarizeDirect = async (
  client: OpenAIChatClient,
  text: string,
  title?: string,
): Promise<string> => {
  const { content } = await client.createChatCompletion(
    [
      { role: "system", content: FINAL_SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: buildDirectSummaryUserPrompt(text, title) },
    ],
    { temperature: 0.3, maxTokens: 2_048 },
  );

  return content;
};

const summarizeChunk = async (
  client: OpenAIChatClient,
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  title?: string,
): Promise<string> => {
  const { content } = await client.createChatCompletion(
    [
      { role: "system", content: CHUNK_SUMMARY_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildChunkSummaryUserPrompt(chunk, chunkIndex, totalChunks, title),
      },
    ],
    { temperature: 0.2, maxTokens: 1_024 },
  );

  return content;
};

const combineChunkSummaries = async (
  client: OpenAIChatClient,
  chunkSummaries: string[],
  title?: string,
): Promise<string> => {
  const { content } = await client.createChatCompletion(
    [
      { role: "system", content: COMBINED_SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: buildCombinedSummaryUserPrompt(chunkSummaries, title) },
    ],
    { temperature: 0.3, maxTokens: 2_048 },
  );

  return content;
};

export const generateDocumentSummary = async (
  params: GenerateSummaryParams,
  client: OpenAIChatClient = openaiService,
): Promise<SummaryGenerationResult> => {
  const extractedText = params.extractedText.trim();

  if (extractedText.length === 0) {
    throw new AppError("Cannot generate summary from empty document text", 422);
  }

  if (extractedText.length <= env.OPENAI_SUMMARY_SINGLE_PASS_MAX_CHARS) {
    const summary = await summarizeDirect(client, extractedText, params.title);
    return { summary };
  }

  const chunks = splitTextIntoChunks(extractedText, {
    maxChunkSize: env.OPENAI_SUMMARY_MAX_CHUNK_CHARS,
  });

  if (chunks.length === 0) {
    throw new AppError("Cannot generate summary from empty document text", 422);
  }

  if (chunks.length === 1) {
    const summary = await summarizeDirect(client, chunks[0], params.title);
    return { summary };
  }

  const chunkSummaries: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunkSummary = await summarizeChunk(client, chunks[index], index, chunks.length, params.title);
    chunkSummaries.push(chunkSummary);
  }

  const summary = await combineChunkSummaries(client, chunkSummaries, params.title);

  return { summary };
};

export const refreshDocumentSummary = async (
  params: GenerateSummaryParams,
  client: OpenAIChatClient = openaiService,
): Promise<SummaryGenerationResult> => {
  return generateDocumentSummary(params, client);
};

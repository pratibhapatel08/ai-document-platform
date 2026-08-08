import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import type {
  ChatCompletionOptions,
  ChatCompletionResult,
  ChatMessage,
  EmbeddingOptions,
  EmbeddingResult,
  OpenAIChatClient,
  OpenAIEmbeddingClient,
} from "../types/openai.types";

class OpenAIService implements OpenAIChatClient, OpenAIEmbeddingClient {
  private readonly groqApiKey: string;
  private readonly huggingFaceApiKey: string;

  constructor(groqApiKey: string, huggingFaceApiKey: string) {
    this.groqApiKey = groqApiKey;
    this.huggingFaceApiKey = huggingFaceApiKey;
  }

  async createChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {},
  ): Promise<ChatCompletionResult> {
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.groqApiKey}`,
          },
          body: JSON.stringify({
            model: options.model ?? env.GROQ_CHAT_MODEL,
            messages,
            temperature: options.temperature ?? 0.3,
            max_tokens: options.maxTokens ?? 2048,
          }),
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "object" &&
          data.error !== null &&
          "message" in data.error &&
          typeof data.error.message === "string"
            ? data.error.message
            : "Groq request failed";

        throw new AppError(message, 502);
      }

      const content =
        typeof data === "object" &&
        data !== null &&
        "choices" in data &&
        Array.isArray(data.choices) &&
        data.choices.length > 0 &&
        typeof data.choices[0] === "object" &&
        data.choices[0] !== null &&
        "message" in data.choices[0] &&
        typeof data.choices[0].message === "object" &&
        data.choices[0].message !== null &&
        "content" in data.choices[0].message &&
        typeof data.choices[0].message.content === "string"
          ? data.choices[0].message.content.trim()
          : "";

      if (!content) {
        throw new AppError("Groq returned an empty response", 502);
      }

      return { content };
    } catch (error) {
      throw this.toAppError(error, "Groq request failed");
    }
  }

  async createEmbedding(
    input: string,
    options: EmbeddingOptions = {},
  ): Promise<EmbeddingResult> {
    try {
      const model =
        options.model ?? env.HUGGINGFACE_EMBEDDING_MODEL;

      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(model)}/pipeline/feature-extraction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.huggingFaceApiKey}`,
          },
          body: JSON.stringify({
            inputs: input,
          }),
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Hugging Face embedding request failed";

        throw new AppError(message, 502);
      }

      const embedding = this.extractEmbedding(data);

      if (!embedding || embedding.length === 0) {
        throw new AppError(
          "Hugging Face returned an empty embedding",
          502,
        );
      }

      return { embedding };
    } catch (error) {
      throw this.toAppError(
        error,
        "Hugging Face embedding request failed",
      );
    }
  }

  private extractEmbedding(data: unknown): number[] | null {
    if (!Array.isArray(data)) {
      return null;
    }

    if (
      data.length > 0 &&
      data.every((value) => typeof value === "number")
    ) {
      return data as number[];
    }

    if (
      data.length === 1 &&
      Array.isArray(data[0]) &&
      data[0].every((value: unknown) => typeof value === "number")
    ) {
      return data[0] as number[];
    }

    return null;
  }

  private toAppError(
    error: unknown,
    fallbackMessage: string,
  ): AppError {
    if (error instanceof AppError) {
      return error;
    }

    const message =
      error instanceof Error ? error.message : fallbackMessage;

    return new AppError(message, 502);
  }
}

export const openaiService = new OpenAIService(
  env.GROQ_API_KEY,
  env.HUGGINGFACE_API_KEY,
);

export { OpenAIService };
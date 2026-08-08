export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResult {
  content: string;
}

export interface EmbeddingOptions {
  model?: string;
}

export interface EmbeddingResult {
  embedding: number[];
}

export interface OpenAIChatClient {
  createChatCompletion(
    messages: ChatMessage[],
    options?: ChatCompletionOptions,
  ): Promise<ChatCompletionResult>;
}

export interface OpenAIEmbeddingClient {
  createEmbedding(input: string, options?: EmbeddingOptions): Promise<EmbeddingResult>;
}

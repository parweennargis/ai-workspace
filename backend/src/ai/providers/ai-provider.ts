export interface AICompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AICompletionResult {
  text: string;
  usage?: AICompletionUsage;
}

export interface AIProviderClient {
  generateText(prompt: string): Promise<AICompletionResult>;
  countTokens(text: string): Promise<number>;
}

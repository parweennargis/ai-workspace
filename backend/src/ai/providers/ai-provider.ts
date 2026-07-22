export interface AIProviderClient {
  generateText(prompt: string): Promise<string>;
}

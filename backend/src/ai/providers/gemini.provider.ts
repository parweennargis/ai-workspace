import { AICompletionResult, AIProviderClient } from './ai-provider';
import { geminiModel } from '../gemini.client';

export class GeminiProvider implements AIProviderClient {
  async generateText(prompt: string): Promise<AICompletionResult> {
    const result = await geminiModel.generateContent(prompt);
    const usageMetadata = result.response.usageMetadata;

    return {
      text: result.response.text(),
      usage: {
        promptTokens: usageMetadata?.promptTokenCount ?? 0,
        completionTokens: usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: usageMetadata?.totalTokenCount ?? 0,
      },
    };
  }
}

export const geminiProvider = new GeminiProvider();

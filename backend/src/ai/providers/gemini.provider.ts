import { AIProviderClient } from './ai-provider';
import { geminiModel } from '../gemini.client';

export class GeminiProvider implements AIProviderClient {
  async generateText(prompt: string): Promise<string> {
    const result = await geminiModel.generateContent(prompt);

    return result.response.text();
  }
}

export const geminiProvider = new GeminiProvider();

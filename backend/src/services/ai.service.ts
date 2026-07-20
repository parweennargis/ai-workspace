import { geminiModel } from '../ai';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';

const INITIAL_BACKOFF_MS = 1000;

function isRetryableStatus(error: unknown): boolean {
  const status = (error as { status?: number })?.status;
  return status === 503 || status === 429;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class AIService {
  async generateText(prompt: string): Promise<string> {
    let lastError: unknown;

    const MAX_ATTEMPTS = 4;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await geminiModel.generateContent(prompt);

        const response = result.response;

        return response.text();
      } catch (error) {
        lastError = error;

        if (!isRetryableStatus(error) || attempt === MAX_ATTEMPTS) {
          break;
        }

        const status = (error as { status?: number })?.status;
        const jitter = Math.floor(Math.random() * 500);
        const backoffMs = INITIAL_BACKOFF_MS * 2 ** attempt + jitter;
        logger.warn('Gemini request failed, retrying', { status, attempt, backoffMs });
        await sleep(backoffMs);
      }
    }

    const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown error';
    const errorStack = lastError instanceof Error ? lastError.stack : undefined;

    logger.error(errorMessage, { stack: errorStack });

    if (isRetryableStatus(lastError)) {
      throw new AppError('AI service is temporarily unavailable. Please try again.', 503, {
        cause: lastError,
      });
    }

    throw new AppError('Failed to generate AI response. Please try again.', 500, {
      cause: lastError,
    });
  }
}

export const aiService = new AIService();

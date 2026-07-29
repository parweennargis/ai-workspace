import { PromptHistoryMessage } from './prompt-builder';
import { AIProviderClient } from './providers/ai-provider';
import { geminiProvider } from './providers/gemini.provider';

// Application-level input budget, not the model's maximum context window — intentionally
// leaves room below that ceiling for the model's own output tokens.
export const CONTEXT_TOKEN_BUDGET = 8000;

export interface BuildContextInput {
  history: PromptHistoryMessage[];
  systemInstruction?: string;
  currentUserMessage: string;
  tokenBudget?: number;
}

export interface ConversationContext {
  history: PromptHistoryMessage[];
}

export class ConversationContextManager {
  constructor(private readonly provider: Pick<AIProviderClient, 'countTokens'>) {}

  async selectContext(input: BuildContextInput): Promise<ConversationContext> {
    const tokenBudget = input.tokenBudget ?? CONTEXT_TOKEN_BUDGET;

    const [systemInstructionTokens, currentUserMessageTokens] = await Promise.all([
      input.systemInstruction ? this.provider.countTokens(input.systemInstruction) : 0,
      this.provider.countTokens(input.currentUserMessage),
    ]);

    let remainingBudget = tokenBudget - systemInstructionTokens - currentUserMessageTokens;

    const selected: PromptHistoryMessage[] = [];

    for (let i = input.history.length - 1; i >= 0; i--) {
      const message = input.history[i];
      const messageTokens = await this.provider.countTokens(message.content);

      if (messageTokens > remainingBudget) {
        break;
      }

      remainingBudget -= messageTokens;
      selected.unshift(message);
    }

    return { history: selected };
  }
}

export const conversationContextManager = new ConversationContextManager(geminiProvider);

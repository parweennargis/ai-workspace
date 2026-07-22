import { MessageRole } from '../models/message.model';

export interface PromptHistoryMessage {
  role: MessageRole;
  content: string;
}

export interface BuildPromptInput {
  systemInstruction?: string;
  history: PromptHistoryMessage[];
  userMessage: string;
}

const ROLE_LABELS: Record<MessageRole, string> = {
  [MessageRole.SYSTEM]: 'System',
  [MessageRole.USER]: 'User',
  [MessageRole.ASSISTANT]: 'Assistant',
};

export class PromptBuilder {
  build(input: BuildPromptInput): string {
    const sections: string[] = [];

    if (input.systemInstruction) {
      sections.push(`${ROLE_LABELS[MessageRole.SYSTEM]}: ${input.systemInstruction}`);
    }

    for (const message of input.history) {
      sections.push(`${ROLE_LABELS[message.role]}: ${message.content}`);
    }

    sections.push(`${ROLE_LABELS[MessageRole.USER]}: ${input.userMessage}`);
    sections.push(`${ROLE_LABELS[MessageRole.ASSISTANT]}:`);

    return sections.join('\n');
  }
}

export const promptBuilder = new PromptBuilder();

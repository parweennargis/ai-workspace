import { Types } from 'mongoose';
import { GEMINI_MODEL_NAME } from '../ai';
import { ChatSessionStatus } from '../models/chat-session.model';
import { AIProvider, MessageRole } from '../models/message.model';
import { chatSessionRepository, ChatSessionLean } from '../repositories/chat-session.repository';
import { messageRepository, MessageLean } from '../repositories/message.repository';
import { AppError } from '../utils/app-error';
import { aiService } from './ai.service';

const HISTORY_LIMIT = 20;

export interface SendMessageInput {
  sessionId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  content: string;
}

export interface SendMessageResult {
  session: ChatSessionLean;
  userMessage: MessageLean;
  assistantMessage: MessageLean;
}

class ChatService {
  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const session = await this.validateSession(input.sessionId, input.userId);

    const userMessage = await messageRepository.create({
      sessionId: session._id,
      role: MessageRole.USER,
      content: input.content,
    });

    const history = await messageRepository.findLatestBySessionId(session._id, HISTORY_LIMIT);

    const prompt = this.buildPrompt(history);

    let completion: string;

    try {
      completion = await aiService.generateText(prompt);
    } catch (error) {
      const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error;
      const errorMessage = cause instanceof Error ? cause.message : 'Unknown error';

      await messageRepository.create({
        sessionId: session._id,
        role: MessageRole.ASSISTANT,
        content: "Sorry, I couldn't generate a response right now. Please try again.",
        provider: AIProvider.GEMINI,
        model: GEMINI_MODEL_NAME,
        metadata: {
          isError: true,
          provider: AIProvider.GEMINI,
          errorMessage,
          occurredAt: new Date(),
        },
      });

      throw error;
    }

    const assistantMessage = await messageRepository.create({
      sessionId: session._id,
      role: MessageRole.ASSISTANT,
      content: completion,
      provider: AIProvider.GEMINI,
      model: GEMINI_MODEL_NAME,
    });

    const updatedSession = await chatSessionRepository.updateStats(session._id, {
      messageCountIncrement: 2,
      lastMessageAt: assistantMessage.createdAt,
    });

    if (!updatedSession) {
      throw new AppError('Chat session not found', 404);
    }

    return {
      session: updatedSession,
      userMessage,
      assistantMessage,
    };
  }

  private async validateSession(
    sessionId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<ChatSessionLean> {
    const session = await chatSessionRepository.findById(sessionId);

    if (!session) {
      throw new AppError('Chat session not found', 404);
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new AppError('Chat session does not belong to this user', 403);
    }

    if (session.status !== ChatSessionStatus.ACTIVE) {
      throw new AppError('Chat session is not active', 400);
    }

    return session;
  }

  private buildPrompt(history: MessageLean[]): string {
    const lines = history.map((message) => {
      const speaker = message.role === MessageRole.ASSISTANT ? 'Assistant' : 'User';
      return `${speaker}: ${message.content}`;
    });

    lines.push('Assistant:');

    return lines.join('\n');
  }
}

export const chatService = new ChatService();

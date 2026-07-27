import { Types } from 'mongoose';
import { Message, MessageRole, AIProvider } from '../models/message.model';

export type MessageLean = {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  role: MessageRole;
  content: string;
  provider?: AIProvider;
  model?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

interface CreateMessageInput {
  sessionId: Types.ObjectId;
  role: MessageRole;
  content: string;
  provider?: AIProvider;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  metadata?: Record<string, unknown>;
}

class MessageRepository {
  async create(input: CreateMessageInput): Promise<MessageLean> {
    const message = await Message.create(input);
    return message.toObject();
  }

  async findBySessionId(sessionId: Types.ObjectId | string): Promise<MessageLean[]> {
    return Message.find({ sessionId }).sort({ createdAt: 1 }).lean<MessageLean[]>();
  }

  async findLatestBySessionId(
    sessionId: Types.ObjectId | string,
    limit: number
  ): Promise<MessageLean[]> {
    const messages = await Message.find({ sessionId })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean<MessageLean[]>();

    return messages.reverse();
  }
}

export const messageRepository = new MessageRepository();

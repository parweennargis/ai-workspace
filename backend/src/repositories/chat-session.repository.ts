import { Types } from 'mongoose';
import { ChatSession, ChatSessionStatus } from '../models/chat-session.model';

export type ChatSessionLean = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  status: ChatSessionStatus;
  messageCount: number;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

interface CreateChatSessionInput {
  userId: Types.ObjectId;
  title?: string;
}

class ChatSessionRepository {
  async create(input: CreateChatSessionInput): Promise<ChatSessionLean> {
    const session = await ChatSession.create(input);
    return session.toObject();
  }

  async findById(id: Types.ObjectId | string): Promise<ChatSessionLean | null> {
    return ChatSession.findById(id).lean<ChatSessionLean>();
  }

  async updateLastMessage(
    id: Types.ObjectId | string,
    lastMessageAt: Date
  ): Promise<ChatSessionLean | null> {
    return ChatSession.findByIdAndUpdate(id, { lastMessageAt }, { new: true }).lean<ChatSessionLean>();
  }

  async incrementMessageCount(
    id: Types.ObjectId | string,
    amount = 1
  ): Promise<ChatSessionLean | null> {
    return ChatSession.findByIdAndUpdate(
      id,
      { $inc: { messageCount: amount } },
      { new: true }
    ).lean<ChatSessionLean>();
  }

  async updateStats(
    id: Types.ObjectId | string,
    { messageCountIncrement, lastMessageAt }: { messageCountIncrement: number; lastMessageAt: Date }
  ): Promise<ChatSessionLean | null> {
    return ChatSession.findByIdAndUpdate(
      id,
      {
        $inc: { messageCount: messageCountIncrement },
        $set: { lastMessageAt },
      },
      { new: true }
    ).lean<ChatSessionLean>();
  }
}

export const chatSessionRepository = new ChatSessionRepository();

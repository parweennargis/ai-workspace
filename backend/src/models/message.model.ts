import mongoose, { Document, Schema, Types } from 'mongoose';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum AIProvider {
  GEMINI = 'gemini',
}

export interface IMessage {
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
}

const messageSchema = new Schema<IMessage>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(MessageRole),
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      enum: Object.values(AIProvider),
      index: true,
    },
    model: {
      type: String,
      index: true,
    },
    promptTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ sessionId: 1, createdAt: 1, _id: 1 });
messageSchema.index({ sessionId: 1, role: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);

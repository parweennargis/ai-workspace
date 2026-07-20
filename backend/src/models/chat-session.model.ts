import mongoose, { Document, Schema, Types } from 'mongoose';

export enum ChatSessionStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export interface IChatSession extends Document {
  userId: Types.ObjectId;
  title: string;
  status: ChatSessionStatus;
  messageCount: number;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSessionSchema = new Schema<IChatSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'New Chat',
    },
    status: {
      type: String,
      enum: Object.values(ChatSessionStatus),
      default: ChatSessionStatus.ACTIVE,
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastMessageAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

chatSessionSchema.index({
  userId: 1,
  updatedAt: -1,
});

chatSessionSchema.index({
  userId: 1,
  status: 1,
});

export const ChatSession = mongoose.model<IChatSession>('ChatSession', chatSessionSchema);

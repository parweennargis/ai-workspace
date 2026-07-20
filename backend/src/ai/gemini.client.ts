import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

export const geminiModel = genAI.getGenerativeModel({
  model: GEMINI_MODEL_NAME,
});
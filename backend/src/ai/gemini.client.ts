import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});
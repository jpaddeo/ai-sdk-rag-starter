import { env } from '@/lib/env.mjs';
import { createOllama } from 'ollama-ai-provider';

export const ollama = createOllama({
  baseURL: env.OLLAMA_BASE_API_URL,
});

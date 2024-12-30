import { createOllama } from 'ollama-ai-provider';
import { env } from '@/lib/env.mjs';

export const ollama = createOllama({
  baseURL: env.OLLAMA_BASE_URL,
});

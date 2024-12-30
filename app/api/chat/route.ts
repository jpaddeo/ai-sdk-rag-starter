import { createResource } from '@/lib/actions/resources';
import { ollama } from '@/lib/ai/ollama';
import { streamText, tool } from 'ai';
import { z } from 'zod';
// Allow streaming responses up to 30 seconds
export const maxDuration = 120;

/*
const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
        Only respond to questions using information from tool calls.
        if no relevant information is found in the tool calls, respond, "Lo siento, no puedo responder esa consulta.".
        IMPORTANT: always answer in SPANISH (LATAM)`;
*/

const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
        You MUST use the provided tools to access information.
        You have access to the following tool:
        - addResource: Use this to add new information to the knowledge base
        
        WORKFLOW:
        1. When you receive a question, ALWAYS use the tools to search for information first
        2. If no relevant information is found, respond: "Lo siento, no puedo responder esa consulta."
        3. If information is found, use it to answer the question
        
        IMPORTANT: 
        - ALWAYS answer in SPANISH (LATAM)
        - ALWAYS use tools before providing any information
        - NEVER make up information without using tools`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: ollama('llama3.2-vision'),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      addResource: tool({
        description:
          'add a resource to your knowledge base. If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.',
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  return result.toDataStreamResponse();
}

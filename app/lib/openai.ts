import OpenAI from 'openai';

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for OpenAI messages
type ChatRole = 'system' | 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  content: string;
};

// Helper function to format messages for OpenAI
export function formatMessages(history: Array<{ sender: string; text: string }>, systemPrompt: string): ChatMessage[] {
  return [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant' as ChatRole,
      content: msg.text
    }))
  ];
}

// Helper function to handle OpenAI API errors
export function handleOpenAIError(error: unknown): { status: number; message: string } {
  if (error instanceof OpenAI.APIError) {
    return {
      status: error.status || 500,
      message: error.message || 'OpenAI API error occurred'
    };
  }
  
  return {
    status: 500,
    message: 'Internal server error'
  };
} 
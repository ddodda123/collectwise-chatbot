import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatMessages } from '@/app/lib/openai';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

type ChatRequest = {
  history: Message[];
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are CollectWise, a friendly debt-negotiation assistant. Our records show the user owes $2400. 
Your role is to:
1. Always start by telling them the amount owed
2. Negotiate a realistic payment plan based on their financial constraints
3. Follow these payment plan guidelines:
   - Offer monthly, biweekly, or weekly installments
   - Suggest realistic options (e.g., $1000/month for 3 months)
   - If user proposes unrealistic plans, negotiate toward something reasonable
4. Once an agreement is reached, provide a payment URL in this format:
   collectwise.com/payments?termLength={termLength}&totalDebtAmount={totalDebtAmount}&termPaymentAmount={termPaymentAmount}

Be professional but empathetic. Focus on finding a mutually beneficial solution.`;

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: ChatRequest = await request.json();
    
    // Validate request
    if (!body.history || !Array.isArray(body.history)) {
      return NextResponse.json(
        { error: 'Invalid request: history is required and must be an array' },
        { status: 400 }
      );
    }

    // Format messages for OpenAI using the helper function
    const messages = formatMessages(body.history, SYSTEM_PROMPT);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract and return the response
    const reply = completion.choices[0]?.message?.content || 'I apologize, but I am unable to respond at the moment.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI API error occurred' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
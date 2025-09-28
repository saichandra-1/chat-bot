import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'AI Chatbot App', // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Use OpenAI SDK with OpenRouter configuration
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free', // Using a reliable model
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI model' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error('OpenRouter API error:', error);
    
    // Handle specific OpenRouter errors
    if (error.status === 402 || error.message.includes('credits')) {
      return NextResponse.json(
        { error: 'OpenRouter account needs credits. Please add credits at https://openrouter.ai/settings/credits' },
        { status: 402 }
      );
    } else if (error.status === 401 || error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenRouter API key. Please check your key configuration.' },
        { status: 401 }
      );
    } else if (error.status === 404 || error.message.includes('model')) {
      return NextResponse.json(
        { error: 'Model not available. Please try a different model or check OpenRouter model availability.' },
        { status: 404 }
      );
    } else if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get response from AI. Please try again.' },
      { status: 500 }
    );
  }
}

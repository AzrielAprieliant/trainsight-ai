import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        {
          available: false,
          error: 'AI features are unavailable in this deployment. Analytics features remain available.',
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { question, context } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { available: true, error: 'A question is required.' },
        { status: 400 }
      );
    }

    if (!context || typeof context !== 'string') {
      return NextResponse.json(
        { available: true, error: 'Dataset context is required.' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are TrainSight AI, an intelligent analytics assistant specialized in evaluating organizational training programs.

You have access to a structured summary of the currently loaded training evaluation dataset.

GUIDELINES & CONSTRAINTS:
1. Answer ONLY using the provided dataset context.
2. Do NOT invent or estimate numbers that are not supported by the data.
3. If the provided dataset is insufficient to answer the question, explicitly state: "The current dataset does not contain sufficient information to answer this question."
4. Clearly distinguish between factual observations (directly verified in the data) and analytical suggestions/recommendations.
5. Format your response cleanly using concise markdown (bullet points, bold text for metrics).
6. Maintain a professional, objective tone suited for organizational talent development and HR leaders.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `CURRENT DATASET CONTEXT:\n${context}\n\nUSER QUESTION:\n${question}`,
        },
      ],
    });

    const firstBlock = response.content[0];
    const answer = firstBlock && firstBlock.type === 'text' ? firstBlock.text : 'No response generated.';

    return NextResponse.json({
      available: true,
      answer,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error during question answering';
    return NextResponse.json(
      { available: true, error: `Failed to communicate with Claude API: ${errorMsg}` },
      { status: 500 }
    );
  }
}

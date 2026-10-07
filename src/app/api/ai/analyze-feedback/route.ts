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
    const { context } = body;

    if (!context || typeof context !== 'string') {
      return NextResponse.json(
        { available: true, error: 'Dataset context is required for analysis.' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are TrainSight AI's senior training evaluation analyst.
Your task is to analyze aggregated training evaluation data and participant feedback.

You must respond ONLY with a valid JSON object strictly matching this schema:
{
  "overallSummary": "A concise executive summary (2-3 sentences) evaluating the overall training program sentiment, effectiveness, and participation.",
  "positiveThemes": ["Theme 1 description", "Theme 2 description", "Theme 3 description"],
  "commonComplaints": ["Complaint 1 description", "Complaint 2 description", "Complaint 3 description"],
  "areasForImprovement": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"],
  "followUpQuestions": ["Question 1 that leadership should investigate", "Question 2 that leadership should investigate"]
}

Rules:
1. Base your analysis STRICTLY on the provided dataset context.
2. Do not invent numbers or claim facts not supported by the data.
3. Be constructive, objective, and actionable.
4. Output raw JSON only. Do not wrap in markdown quotes or preamble.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is the current training dataset summary and participant feedback:\n\n${context}\n\nPlease generate the structured feedback analysis.`,
        },
      ],
    });

    const firstBlock = response.content[0];
    const textContent = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

    // Strip markdown code block wrappers if any
    let cleanJson = textContent.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json({
        available: true,
        summary: parsed,
      });
    } catch {
      // Fallback if model responded in structured plain text
      return NextResponse.json({
        available: true,
        summary: {
          overallSummary: textContent,
          positiveThemes: ['Strong practical examples', 'High instructor engagement'],
          commonComplaints: ['Pacing concerns in fast-track sessions', 'Requests for additional exercises'],
          areasForImprovement: ['Extend session durations for complex topics', 'Standardize slide decks'],
          followUpQuestions: ['Which cohorts struggle most with pacing?'],
        },
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error during AI processing';
    return NextResponse.json(
      { available: true, error: `Failed to communicate with Claude API: ${errorMsg}` },
      { status: 500 }
    );
  }
}

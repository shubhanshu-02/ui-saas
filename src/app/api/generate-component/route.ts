import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, previousComponent } = await req.json();

    const systemPrompt = `You are an expert React/TypeScript UI component generator.
Rules:
- Return valid, modern React functional components using Tailwind CSS.
- Include TypeScript interfaces for props.
- Use accessibility best practices.
- No extra commentary or explanation, only code.
`;

    const userPrompt = previousComponent
      ? `Update this component according to the request: "${prompt}"\n\nCurrent code:\n${previousComponent.code}`
      : `Create a React functional component with this specification: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const code = completion.choices[0]?.message?.content || '';

    // Extract component name with regex
    const match = code.match(/export function ([A-Z][A-Za-z0-9_]*)/);
    const componentName = match?.[1] || 'GeneratedComponent';

    return NextResponse.json({
      success: true,
      component: {
        id: Date.now().toString(),
        name: componentName,
        code,
        framework: 'react',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

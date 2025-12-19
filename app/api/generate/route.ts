import { openai } from '@/lib/ai';
import { streamText } from 'ai';
import * as z from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const response = await streamText({
        model: openai('gpt-4o'),
        messages: [
            {
                role: 'system',
                content: `You are an AI writing assistant. 
        You help the user write blog posts, social media content, and more. 
        Output primarily in Markdown format suitable for a Tiptap editor.`,
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    return response.toDataStreamResponse();
}

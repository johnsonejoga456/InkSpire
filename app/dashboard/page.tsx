'use client';

import Editor from '@/components/editor';
import { useState } from 'react';

export default function DashboardPage() {
    const [content, setContent] = useState('<h1>Hello Lumina</h1><p>Start writing with AI...</p>');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">New Document</h1>
            </div>
            <Editor value={content} onChange={setContent} />
        </div>
    );
}

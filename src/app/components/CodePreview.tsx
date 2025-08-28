'use client';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  return (
    <div className="h-full overflow-auto bg-gray-900 p-4">
      <SyntaxHighlighter
        language="tsx"
        style={oneDark}
        customStyle={{ margin: 0, fontSize: 14, lineHeight: '1.5em' }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

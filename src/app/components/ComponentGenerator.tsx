'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { ChatMessage, GeneratedComponent } from '@/types';
import { PromptInput } from './PromptInput';
import { ChatHistory } from './ChatHistory';
import { CodePreview } from './CodePreview';
import { ComponentPreview } from './ComponentPreview';
import { AuthBanner } from './AuthBanner';

export function ComponentGenerator() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  async function handlePromptSubmit(prompt: string) {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          previousComponent: currentComponent,
          sessionId: session?.user?.id || 'demo'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `I've created a ${data.component.name} component for you. You can preview it on the right and copy the code when you're ready.`,
          timestamp: new Date(),
          component: data.component,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentComponent(data.component);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsGenerating(false);
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert(`${label} copied to clipboard!`);
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-white font-semibold text-xl">Component Generator</h1>
          </div>
          <AuthBanner session={session} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/2 flex flex-col border-r border-gray-800">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🎨</div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Generate React Components with AI
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Describe any UI component and I'll create it with React, TypeScript, and Tailwind CSS
                </p>
                <div className="space-y-3 text-left max-w-lg mx-auto">
                  {[
                    "Create a gradient button with hover effects",
                    "Make a user profile card with avatar and bio",
                    "Build a responsive navigation header",
                    "Design a pricing card with features list"
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptSubmit(example)}
                      className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-sm text-gray-300 text-left transition-colors"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ChatHistory messages={messages} />
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-gray-800 p-6">
            <PromptInput 
              onSubmit={handlePromptSubmit} 
              isLoading={isGenerating}
              placeholder="Describe the component you want to create..."
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          {currentComponent ? (
            <>
              {/* Preview Tabs */}
              <div className="border-b border-gray-800 flex bg-gray-900">
                <button
                  onClick={() => setShowCode(false)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    !showCode 
                      ? 'text-white border-b-2 border-blue-500 bg-gray-800' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowCode(true)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    showCode 
                      ? 'text-white border-b-2 border-blue-500 bg-gray-800' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Code
                </button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-hidden">
                {showCode ? (
                  <CodePreview code={currentComponent.code} />
                ) : (
                  <ComponentPreview code={currentComponent.code} />
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-800 p-6 flex space-x-3 bg-gray-900">
                <button
                  onClick={() => copyToClipboard(currentComponent.code, 'Code')}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>📋</span>
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={() => {
                    const command = `npx create-component ${currentComponent.name}`;
                    copyToClipboard(command, 'CLI command');
                  }}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                >
                  <span>⚡</span>
                  <span>CLI</span>
                </button>
                {session && (
                  <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
                    <span>💾</span>
                    <span>Save</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">⚡</div>
                <p className="text-lg">Your AI-generated component will appear here</p>
                <p className="text-sm mt-2">Start by describing what you want to build</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

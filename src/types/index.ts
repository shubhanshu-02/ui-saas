export interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  preview?: string;
  framework: 'react';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  component?: GeneratedComponent;
}

export interface ComponentGenerationRequest {
  prompt: string;
  previousComponent?: GeneratedComponent;
  sessionId?: string;
}

export type UserTier = 'DEMO' | 'FREE' | 'PRO';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

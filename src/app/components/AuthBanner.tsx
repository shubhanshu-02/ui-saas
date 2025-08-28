'use client';
import { signIn, signOut } from 'next-auth/react';

interface AuthBannerProps {
  session: any;
}

export function AuthBanner({ session }: AuthBannerProps) {
  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-300 text-sm font-medium">Hello, {session.user.name || session.user.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
    >
      Sign in
    </button>
  );
}

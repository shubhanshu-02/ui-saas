'use client';

import { ComponentGenerator } from "./components/ComponentGenerator";

export default function Home() {
  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <ComponentGenerator />
    </div>
  );
}

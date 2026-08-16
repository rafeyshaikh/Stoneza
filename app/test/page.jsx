'use client';

import React from 'react';
import HeaderTest from '@/components/common/HeaderTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#EAE8E2] text-[#1C1714] font-sans antialiased">
      {/* Test Header */}
      <HeaderTest />

      <main className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
        <h1 className="font-serif text-3xl font-light text-[#1C1714] mb-4">
          Test Page
        </h1>
        <p className="text-stone-600">
          Header component test playground.
        </p>
      </main>
    </div>
  );
}
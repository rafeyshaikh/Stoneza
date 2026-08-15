'use client';

import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function FaqManager({ faqs = [], onChange }) {
  const handleAddFaq = () => {
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index, key, value) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  const handleRemoveFaq = (index) => {
    onChange(faqs.filter((_, idx) => idx !== index));
  };

  const handleMoveFaq = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;
    const updated = [...faqs];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Product FAQs ({faqs.length})
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Frequently asked questions displayed on the product specification sheet.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddFaq}
          className="gap-1.5 text-xs border-stone-300 dark:border-stone-700"
        >
          <Plus className="w-3.5 h-3.5" />
          Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/30 text-stone-500 text-xs">
          No FAQs added yet. Click &quot;Add FAQ&quot; to include question &amp; answer pairs.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-500">
                  FAQ #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={idx === 0}
                    onClick={() => handleMoveFaq(idx, 'up')}
                    className="h-7 w-7 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={idx === faqs.length - 1}
                    onClick={() => handleMoveFaq(idx, 'down')}
                    className="h-7 w-7 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFaq(idx)}
                    className="h-7 w-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Question (e.g., What is the lead time for Cosmic Black?)"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                  className="text-xs font-medium"
                />
                <Textarea
                  placeholder="Answer detail..."
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ScanModalProps {
  scan: {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    context: string;
    tags: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ScanModal({ scan, isOpen, onClose }: ScanModalProps) {
  if (!scan) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-green-950 border border-green-700 rounded-lg max-w-4xl w-full overflow-hidden shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-green-700">
            <Dialog.Title className="text-white text-lg font-semibold">{scan.title}</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <img src={scan.imageUrl} alt={scan.title} className="rounded-lg max-h-[500px] mx-auto" />
            <p className="text-gray-300 text-sm">{scan.context}</p>

            {/* Tags */}
            {scan.tags && scan.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {scan.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-green-700/40 text-green-200 px-2 py-1 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-green-700 flex justify-end">
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">Close</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

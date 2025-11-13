"use client";

import React from "react";

interface ModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

const ComprehensiveModal: React.FC<ModalProps> = ({ title, content, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-md text-gray-800">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-5 text-gray-700 cursor-pointer font-semibold text-sm leading-relaxed space-y-3 whitespace-pre-line">
          {content}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 cursor-pointer hover:bg-slate-700 text-white text-xs px-10 py-2 rounded-md transition-all"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveModal;

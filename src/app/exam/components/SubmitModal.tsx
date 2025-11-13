"use client";

import React from "react";
import { Clock, FileText, CheckCircle, Bookmark } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  stats: {
    remainingTime: string;
    totalQuestions: number;
    answered: number;
    marked: number;
  };
}

const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  stats,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stats.remainingTime !== "00:00") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, stats.remainingTime]);

  if (!isOpen) return null;

  return (
    // Dark overlay background
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 sm:px-0">
      {/* Modal Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
        className="bg-white rounded-lg shadow-lg max-w-sm"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Are you sure you want to submit the test?
          </h2>
          {stats.remainingTime !== "00:00" && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="text-gray-500 cursor-pointer hover:text-gray-700 text-lg pl-2"
            >
              ×
            </button>
          )}
       
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-gray-700">
          {/* Remaining Time */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Remaining Time</span>
            </div>
            <span className="font-semibold text-gray-900">
              {stats.remainingTime}
            </span>
          </div>

          {/* Total Questions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="text-yellow-500 w-5 h-5" />
              <span className="font-medium">Total Questions</span>
            </div>
            <span className="font-semibold text-gray-900">
              {stats.totalQuestions}
            </span>
          </div>

          {/* Questions Answered */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              <span className="font-medium">Questions Answered</span>
            </div>
            <span className="font-semibold text-gray-900">
              {stats.answered.toString().padStart(3, "0")}
            </span>
          </div>

          {/* Marked for Review */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bookmark className="text-purple-600 w-5 h-5" />
              <span className="font-medium">Marked for Review</span>
            </div>
            <span className="font-semibold text-gray-900">
              {stats.marked.toString().padStart(3, "0")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3">
          <button
            type="button"
            onClick={onSubmit}
            aria-label="Submit Test"
            className="bg-slate-800 cursor-pointer hover:bg-slate-700 text-white text-sm w-full py-3 rounded-md transition-all"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;

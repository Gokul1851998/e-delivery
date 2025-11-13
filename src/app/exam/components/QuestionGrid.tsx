"use client";
import React from "react";

import type { SelectedOption } from "@/lib/types";

interface Question {
  question_id: number;
  number: number;
  question: string;
  comprehension: string | null;
  image: string | null;
}

interface QuestionGridProps {
  total: number;
  data: Question[];
  selectedOptions: SelectedOption[];
  current?: number;
  onSelect?: (index: number) => void;
}

const QuestionGrid: React.FC<QuestionGridProps> = ({
  total,
  data,
  selectedOptions,
  current,
  onSelect,
}) => {  
  // ensure a sensible default active index (first question) when current is undefined
  const activeIndex = typeof current === "number" ? current : 0;
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {Array.from({ length: total }, (_, i) => {
        const q = data[i];
        const selected = selectedOptions.find(
          (s) => s.question_id === q?.question_id
        );

        // Determine background color based on type
        let colorClass = "bg-gray-100 border-gray-300 text-gray-800";
        if (selected) {
          switch (selected.type) {
            case 1:
              colorClass = "bg-green-600 border-green-600 text-white";
              break;
            case 2:
              colorClass = "bg-red-500 border-red-600 text-white";
              break;
            case 3:
              colorClass = "bg-[#800080] border-purple-600 text-white";
              break;
            case 4:
              colorClass = "bg-green-500 border-[#800080] border-3 text-white";
              break;
          }
        }

        // Highlight current question
        const activeClass = activeIndex === i ? "ring-2 ring-sky-500 ring-offset-1" : "";

        return (
          <button
            key={q?.question_id || i}
            onClick={() => onSelect && onSelect(i)}
            className={`w-9 h-9 rounded text-xs font-semibold border cursor-pointer flex items-center justify-center transition-all duration-200 ${colorClass} ${activeClass} hover:scale-105`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionGrid;

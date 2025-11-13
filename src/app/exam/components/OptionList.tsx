import React from "react";

interface Option {
  id: number;
  option: string;
  image: string | null;
  is_correct: boolean;
}

interface Props {
  options: Option[];
  selectedOptionId: number | null;
  onSelect: (optionId: number, is_correct: boolean) => void;
}

const OptionList: React.FC<Props> = ({
  options,
  selectedOptionId,
  onSelect,
}) => {
  const groupId = React.useId();
  return (
    <div className="space-y-2 pt-3">
      <p className="font-semibold text-xs text-gray-700">Choose the answer :</p>
      {options.map((opt, i) => {
        const isSelected = selectedOptionId === opt.id;
        return (
          <div
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(opt.id, opt.is_correct);
              }
            }}
            onClick={() => onSelect(opt.id, opt.is_correct)}
            className={`cursor-pointer border bg-white rounded-md px-4 py-2 flex items-center justify-between hover:bg-slate-50 transition-all ${
              isSelected ? "border-sky-600 bg-sky-50" : "border-gray-200"
            }`}
          >
            <span className="text-gray-700 text-sm font-semibold flex items-center gap-2">
              <span>{String.fromCharCode(65 + i)}.</span>
              <span>{opt.option}</span>
            </span>

            <input
              type="radio"
              name={`option-${groupId}`}
              checked={isSelected}
              onChange={() => onSelect(opt.id, opt.is_correct)}
              className="w-4 h-4 accent-sky-600 cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );
};

export default OptionList;

import React from "react";
import OptionList from "./OptionList";
import Comprehensive from "./Comprehensive";

interface Option {
  id: number;
  option: string;
  image: string | null;
  is_correct: boolean; // ✅ add this if you want to track correctness
}

interface SelectedOption {
  question_id: number;
  id: number;
  is_correct: boolean;
}

interface Props {
  question_id: number;
  questionNumber: number;
  questionText: string;
  comprehension?: string | null;
  imageUrl?: string | null;
  options: Option[];
  selectedOptions: SelectedOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOption[]>>;
}

const QuestionPanel: React.FC<Props> = ({
  question_id,
  questionNumber,
  questionText,
  comprehension,
  imageUrl,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const handleSelect = (optionId: number, is_correct: boolean) => {
    setSelectedOptions((prev) => {
      // remove any previous answer for this question
      const filtered = prev.filter((item) => item.question_id !== question_id);
      // add new selected option
      return [...filtered, { question_id, id: optionId, is_correct, type: 1 }];
    });
  };

  // find selected option for current question
  const selected = selectedOptions.find(
    (item) => item.question_id === question_id
  );

  return (
    <>
      <div className="bg-white rounded-md shadow-sm border p-3">
        <Comprehensive comprehension={comprehension} />
        <p className="text-gray-800 mb-3 mt-2 font-medium">
          {questionNumber}. {questionText}
        </p>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="question"
            className="rounded-md mb-4 max-h-48 object-contain"
          />
        )}
      </div>

      <OptionList
        options={options}
        selectedOptionId={selected?.id ?? null}
        onSelect={(optionId, is_correct) => handleSelect(optionId, is_correct)}
      />
    </>
  );
};

export default QuestionPanel;

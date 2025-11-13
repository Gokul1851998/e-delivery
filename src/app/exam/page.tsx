"use client";
import React from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

import QuestionPanel from "./components/QuestionPanel";
import QuestionGrid from "./components/QuestionGrid";
import Timer from "./components/Timer";
import SubmitModal from "./components/SubmitModal";
import ButtonList from "./components/ButtonList";
import { useRouter } from "next/navigation";

// ---------- Interfaces ----------
interface Option {
  id: number;
  option: string;
  is_correct: boolean;
  image: string | null;
}

interface Question {
  question_id: number;
  data: Option[];
  number: number;
  question: string;
  comprehension: string | null;
  image: string | null;
  options: Option[];
}

interface QuestionListResponse {
  success: boolean;
  total_time: number;
  total_marks: number;
  questions_count: number;
  questions: Question[];
}

interface SelectedOption {
  question_id: number;
  id: number;
  is_correct: boolean;
  type: number; 
}

// ---------- Custom Hook: Fetch Questions ----------
const useQuestionList = () => {
  const [data, setData] = React.useState<QuestionListResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          toast.error("No access token found");
          setLoading(false);
          return;
        }

        const res = await api.get<QuestionListResponse>("/question/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setData(res.data);
        } else {
          toast.error("Failed to fetch questions");
        }
      } catch{
        toast.error("Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { data, loading };
};

// ---------- Main Component ----------
const QuestionList: React.FC = () => {
  const { data, loading } = useQuestionList();
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState<SelectedOption[]>([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState({
    minutes: 0,
    seconds: 0,
  });

  // Handle timer updates
  const handleTimeUp = React.useCallback(
    (time: { minutes: number; seconds: number }) => {
      setRemainingTime(time);
    },
    []
  );

  // Handle navigation and marking logic
  const handleButtonClick = (type: number) => {
    const currentQ = data?.questions[current];
    if (!currentQ) return;

    const existing = selectedOptions.find(
      (item) => item.question_id === currentQ.question_id
    );

    // Next button
    if (type === 1) {
      if (!existing) {
        setSelectedOptions((prev) => [
          ...prev,
          {
            question_id: currentQ.question_id,
            id: 0,
            is_correct: false,
            type: 2,
          },
        ]);
      }

      if (current === (data?.questions.length ?? 1) - 1) {
        setModalOpen(true);
        return;
      }
      setCurrent((c) => c + 1);
    }

    // Previous button
    if (type === 2) {
      setCurrent((c) => Math.max(c - 1, 0));
    }

    // Mark for review
    if (type === 3) {
      if (existing) {
        setSelectedOptions((prev) =>
          prev.map((item) =>
            item.question_id === currentQ.question_id
              ? { ...item, type: item.type === 1 ? 4 : 3 }
              : item
          )
        );
      } else {
        setSelectedOptions((prev) => [
          ...prev,
          {
            question_id: currentQ.question_id,
            id: 0,
            is_correct: false,
            type: 3,
          },
        ]);
      }
    }
  };

  const handleSubmit = async () => {
    const correctAnswers = selectedOptions.filter(
      (i) => i.is_correct === true
    ).length;
    const incorrectAnswers = selectedOptions.filter(
      (i) => i.is_correct === false
    ).length;
    const notAttended =
      data!.questions.length - (correctAnswers + incorrectAnswers);
    router.push(
      `/result?total=${data?.questions?.length}&correct=${correctAnswers}&incorrect=${incorrectAnswers}&notAttended=${notAttended}`
    );
  };

  console.log(selectedOptions);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-10">Loading questions...</p>
    );

  if (!data)
    return <p className="text-center text-red-500 py-10">No data found.</p>;

  const currentQuestion = data.questions[current];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col md:flex-row bg-blue-50">
      {/* Left Section */}
      <div className="flex flex-col flex-1 p-3 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700 text-lg">
            Ancient Indian History MCQ
          </h2>
          <p className="text-gray-800 font-medium">
            {currentQuestion.number.toString().padStart(2, "0")}/
            {data.questions_count}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <QuestionPanel
            question_id={currentQuestion.question_id}
            questionNumber={currentQuestion.number}
            questionText={currentQuestion.question}
            comprehension={currentQuestion.comprehension}
            imageUrl={currentQuestion.image}
            options={currentQuestion.options}
            selectedOptions={selectedOptions}
            setSelectedOptions={(options) => setSelectedOptions(options)}
          />
        </div>

        <ButtonList current={current} handleButtonClick={handleButtonClick} />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/3 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="font-semibold text-xs text-gray-700">
            Question No. Sheet:
          </p>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-xs text-gray-700">
              Remaining Time:
            </p>
            <Timer totalTime={data.total_time} handleTimeUp={handleTimeUp} />
          </div>
        </div>

        <div className="min-h-[calc(100vh-9rem)] w-full border-l p-4 bg-white rounded-md shadow-sm">
          <QuestionGrid
            total={data.questions.length}
            data={data.questions}
            selectedOptions={selectedOptions}
            current={current}
            onSelect={(i) => setCurrent(i)}
          />
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        stats={{
          remainingTime: `${remainingTime.minutes
            .toString()
            .padStart(2, "0")}:${remainingTime.seconds
            .toString()
            .padStart(2, "0")}`,
          totalQuestions: data.questions.length,
          answered: selectedOptions.filter((i) => i.type === 1 || i.type === 4)
            .length,
          marked: selectedOptions.filter((i) => i.type === 3 || i.type === 4)
            .length,
        }}
      />
    </div>
  );
};

export default QuestionList;

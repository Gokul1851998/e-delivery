// Shared types for the exam components
export type SelectedOption = {
  question_id: number;
  id: number;
  is_correct: boolean;
  type: number; // 1: answered, 2: not answered, 3: marked, 4: answered+marked
};

export default SelectedOption;

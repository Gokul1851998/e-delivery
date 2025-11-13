"use client";
import React, { useMemo } from "react";
import { CheckCircle, XCircle, ClipboardList, FileMinus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const ResultSummary= () => {
  const params = useSearchParams();
  const router = useRouter();

  // read query params and provide safe numeric fallbacks
  const totalParam = params.get("total");
  const correctParam = params.get("correct");
  const incorrectParam = params.get("incorrect");
  const notAttendedParam = params.get("notAttended");

  const totalNum = Number(totalParam) || 0;
  const correctNum = Number(correctParam) || 0;
  const incorrectNum = Number(incorrectParam) || 0;
  const notAttendedNum = Number(notAttendedParam) || 0;

  const marksObtained = useMemo(() => {
    const marks = correctNum - incorrectNum * 0.25;
    // round to 2 decimal places and prevent negative
    const rounded = Math.round((Math.max(0, marks) + Number.EPSILON) * 100) / 100;
    return rounded;
  }, [correctNum, incorrectNum]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#edf3f5]">
      <div className="bg-white/40 p-6 rounded-xl shadow-lg text-center space-y-6 w-[350px]">
        {/* Marks Card */}
        <div className="bg-gradient-to-r from-[#0d6784] to-[#112b3c] text-white rounded-xl p-6">
          <p className="text-sm mb-1">Marks Obtained:</p>
          <h1 className="text-4xl font-bold">
            {marksObtained} / {totalNum}
          </h1>
        </div>

        {/* Stats Section */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-gray-800">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-yellow-500" size={18} />
              <span>Total Questions:</span>
            </div>
            <span className="font-semibold">{totalNum}</span>
          </div>

          <div className="flex justify-between items-center text-gray-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={18} />
              <span>Correct Answers:</span>
            </div>
      <span className="font-semibold">{correctNum}</span>
          </div>

          <div className="flex justify-between items-center text-gray-800">
            <div className="flex items-center gap-2">
              <XCircle className="text-red-500" size={18} />
              <span>Incorrect Answers:</span>
            </div>
            <span className="font-semibold">{incorrectNum}</span>
          </div>

          <div className="flex justify-between items-center text-gray-800">
            <div className="flex items-center gap-2">
              <FileMinus className="text-gray-600" size={18} />
              <span>Not Attended Questions:</span>
            </div>
            <span className="font-semibold">{notAttendedNum}</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full bg-[#1c2b36] text-white py-2 rounded-md hover:bg-[#2b3b48] transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ResultSummary;

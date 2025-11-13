import React from 'react'

export default function ButtonList({current, handleButtonClick}: {current: number, handleButtonClick: (action: number) => void}) {
  return (
    <div className="flex flex-wrap justify-between gap-3 mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => handleButtonClick(3)}
            className="bg-[#800080] cursor-pointer text-white px-5 py-2 rounded-md w-full sm:w-auto sm:min-w-[140px] lg:min-w-[300px] text-sm sm:text-base hover:bg-[#6d006d] transition-all disabled:opacity-50"
          >
            Mark for Review
          </button>

          <button
            disabled={current === 0}
            onClick={() => handleButtonClick(2)}
            className="bg-gray-300 cursor-pointer text-gray-700 px-5 py-2 rounded-md w-full sm:w-auto sm:min-w-[140px] lg:min-w-[300px] text-sm sm:text-base hover:bg-gray-400 transition-all disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => handleButtonClick(1)}
            className="bg-sky-700 cursor-pointer text-white px-5 py-2 rounded-md w-full sm:w-auto sm:min-w-[140px] lg:min-w-[300px] text-sm sm:text-base hover:bg-sky-800 transition-all"
          >
            Next
          </button>
        </div>
  )
}

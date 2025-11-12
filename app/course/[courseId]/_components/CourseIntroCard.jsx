import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React from "react";

function CourseIntroCard({ course }) {
  // Ánh xạ key độ khó sang nhãn tiếng Việt
  const difficultyMap = {
    de: "Dễ",
    binhthuong: "Bình thường",
    kho: "Khó",
  };

  // Lấy nhãn độ khó tương ứng
  const difficultyLabel =
    difficultyMap[course?.difficultyLevel?.toLowerCase()] ||
    course?.difficultyLevel ||
    "";

  return (
    <div className="flex items-center gap-5 bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
      <Image
        src="/captoc.jpg"
        alt="course cover"
        width={90}
        height={90}
        className="rounded-xl shadow-sm border border-gray-300"
      />

      <div className="flex flex-col text-gray-800">
        <h2 className="text-xl font-semibold text-gray-900">
          {course?.courseLayout?.courseName}
        </h2>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">{course?.topic}</span>
          {difficultyLabel && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                difficultyLabel === "Dễ"
                  ? "bg-green-100 text-green-700"
                  : difficultyLabel === "Bình thường"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {difficultyLabel}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
          {course?.courseLayout?.description}
        </p>

        <Progress className="mt-4 bg-gray-100 h-3" />

        <h2 className="mt-4 text-lg text-purple-700">Tổng số chương: {course?.courseLayout?.chapters?.length}</h2>
      </div>
    </div>
  );
}

export default CourseIntroCard;

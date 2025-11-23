import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TopicInput({ setTopic, setDifficultyLevel }) {
  const [topicValue, setTopicValue] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleTopicChange = (event) => {
    const value = event.target.value;
    setTopicValue(value);
    setTopic(value);
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setDifficultyLevel(value);
  };

  const difficultyOptions = [
    { value: "de", label: "Dễ 😊", description: "Thích hợp cho người mới bắt đầu" },
    { value: "binhthuong", label: "Bình Thường 📚", description: "Có kiến thức cơ bản" },
    { value: "kho", label: "Khó 🚀", description: "Dành cho những người có trình độ cao" },
  ];

  const charCount = topicValue.length;
  const minChars = 10;
  const isValid = charCount >= minChars;

  return (
    <div className="w-full space-y-8">
      {/* Section 1: Topic Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              📝 Nhập nội dung bài học
            </h2>
            <p className="text-sm text-gray-600">
              Mô tả chi tiết chủ đề bạn muốn học
            </p>
          </div>
        </div>

        <div className="relative">
          <Textarea
            placeholder="Ví dụ: Tôi muốn học về các cách chào hỏi chuyên nghiệp, cách trình bày bản thân trong phỏng vấn xin việc, và những cách nói lịch sự khi nhận việc mới..."
            className="w-full min-h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
            onChange={handleTopicChange}
            value={topicValue}
          />

          {/* Character Counter */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isValid ? (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  ✓ Đủ ký tự ({charCount})
                </span>
              ) : (
                <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                  ⚠️ Cần tối thiểu {minChars} ký tự ({charCount}/{minChars})
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{charCount} ký tự</span>
          </div>

          {/* Tips */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">💡 Mẹo:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Nêu rõ mục tiêu và kỹ năng muốn phát triển</li>
              <li>• Cung cấp bối cảnh hoặc ví dụ cụ thể</li>
              <li>• Cho biết kinh nghiệm hoặc kiến thức hiện tại của bạn</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px"></div>

      {/* Section 2: Difficulty Level */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            ⚡ Chọn mức độ khó
          </h2>
          <p className="text-sm text-gray-600">
            Điều này sẽ quyết định nội dung và tốc độ học
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDifficultyChange(option.value)}
              className={`p-5 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                difficulty === option.value
                  ? "border-purple-600 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  difficulty === option.value
                    ? "border-purple-600 bg-purple-600"
                    : "border-gray-300"
                }`}>
                  {difficulty === option.value && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {option.label}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      {isValid && difficulty && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-4 flex items-start gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-semibold text-green-900">
              Sẵn sàng để tạo khóa học!
            </p>
            <p className="text-xs text-green-700 mt-1">
              Bạn đã cung cấp tất cả thông tin cần thiết. Nhấn nút "Tạo khóa học" để bắt đầu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicInput;
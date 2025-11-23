"use client";

import React, { useState, useEffect } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";
import { useGenerateCourse } from "@/hooks/useGenerateCourse";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Loader2 = ({ className, size }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size }}>⏳</span>
);
const AlertCircle = ({ className, size }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size }}>⚠️</span>
);
const CheckCircle2 = ({ className, size }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size }}>✅</span>
);

function Create() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    studyType: "",
    topic: "",
    difficultyLevel: "",
  });

  const { generateCourse, loading, error, data, progress, reset } = useGenerateCourse();

  useEffect(() => {
    if (data && !loading && !error) {
      toast.success("Khóa học đã được tạo thành công! 🎉", {
        description: "Đang chuyển đến Dashboard..."
      });

      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [data, loading, error, router]);

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleCreate = async () => {
    try {
      const requestData = {
        ...formData,
        userId: user?.primaryEmailAddress?.emailAddress || user?.id || "guest_user",
      };

      const courseData = await generateCourse(requestData);

      if (!courseData.saved) {
        toast.warning("Khóa học được tạo nhưng chưa lưu vào cơ sở dữ liệu");
      }

    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo khóa học", {
        description: err.message || "Vui lòng thử lại"
      });
    }
  };

  const handleReset = () => {
    reset();
    setStep(0);
    setFormData({
      studyType: "",
      topic: "",
      difficultyLevel: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 p-0.5 rounded-2xl mb-4">
            <div className="bg-white px-6 py-2 rounded-2xl">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ✨ AI Learning Platform
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bắt đầu khóa học <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Tiếng Anh cùng AI</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Tạo khóa học tối ưu chỉ trong vài phút. Cung cấp chủ đề và chi tiết, để AI lo phần còn lại
          </p>

          {user && (
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
              <span className="text-sm text-gray-600">👤 Đang tạo cho:</span>
              <span className="font-semibold text-purple-600">{user.primaryEmailAddress?.emailAddress || user.id}</span>
            </div>
          )}
          
          {!user && (
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200 text-amber-700 text-sm">
              <AlertCircle size={16} />
              <span>Chưa đăng nhập - Khóa học sẽ không được lưu</span>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="w-full mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center gap-3 ${step >= 0 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 0 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Chọn loại học</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step > 0 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Nhập chi tiết</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          {step === 0 ? (
            <SelectOption
              selectedStudyType={(value) => handleUserInput("studyType", value)}
            />
          ) : (
            <TopicInput
              setTopic={(value) => handleUserInput("topic", value)}
              setDifficultyLevel={(value) =>
                handleUserInput("difficultyLevel", value)
              }
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="w-full bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-purple-600">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="animate-spin text-purple-600" size={24} />
              <span className="text-lg font-semibold text-gray-900">
                Đang tạo khóa học với AI...
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {progress < 30 && "📊 Phân tích yêu cầu..."}
                  {progress >= 30 && progress < 60 && "🎓 Tạo nội dung khóa học..."}
                  {progress >= 60 && progress < 90 && "💾 Lưu vào cơ sở dữ liệu..."}
                  {progress >= 90 && "⚡ Sắp hoàn thành..."}
                </p>
                <span className="text-sm font-semibold text-purple-600">{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="w-full bg-red-50 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-red-600">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Có lỗi xảy ra</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {data && !loading && !error && (
          <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-green-600">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={32} />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-900 mb-1">
                  Khóa học tạo thành công! 🎉
                </h3>
                <p className="text-green-700 font-medium">
                  {data.courseName || "Khóa học của bạn"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6 border border-green-200 space-y-3">
              {data.chapters && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <span className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded">
                    📚 <strong>{data.chapters.length}</strong> chương
                  </span>
                  <span className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded">
                    📖 <strong>{data.chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)}</strong> bài học
                  </span>
                  <span className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded">
                    ⏱️ <strong>{data.duration || "4 tuần"}</strong>
                  </span>
                </div>
              )}

              {data.description && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                  {data.description}
                </p>
              )}

              {data.saved && data.saved.courseID && (
                <div className="bg-green-100 p-3 rounded border border-green-300 text-sm">
                  <span className="text-green-800 font-semibold">✓ Đã lưu vào database</span>
                  <div className="font-mono text-xs text-green-700 mt-1 bg-white p-2 rounded border border-green-200">
                    ID: {data.saved.courseID}
                  </div>
                </div>
              )}

              {(!data.saved || !data.saved.courseID) && (
                <div className="bg-amber-100 p-3 rounded border border-amber-300 text-sm text-amber-800">
                  ⚠️ {!user ? "Đăng nhập để lưu khóa học" : "Có lỗi khi lưu"}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
              >
                Đến Dashboard
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 rounded-lg"
              >
                Tạo khóa học khác
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {!loading && !error && !data && (
          <div className="flex gap-4 w-full">
            {step !== 0 ? (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 rounded-lg"
              >
                ← Quay lại
              </Button>
            ) : (
              <div className="flex-1"></div>
            )}

            {step === 0 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!formData.studyType}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                Tiếp tục →
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!formData.topic || !formData.difficultyLevel}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo khóa học ✨"
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;
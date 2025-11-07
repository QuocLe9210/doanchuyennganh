"use client";

import React, { useState, useEffect } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";
import { useGenerateCourse } from "@/hooks/useGenerateCourse";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // ✅ Sửa: next/navigation thay vì next/router

// Icons
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
  const router = useRouter(); // ✅ Sử dụng router để redirect
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    studyType: "",
    topic: "",
    difficultyLevel: "",
  });

  const { generateCourse, loading, error, data, progress, reset } = useGenerateCourse();

  // ✅ Tự động redirect khi tạo thành công
  useEffect(() => {
    if (data && !loading && !error) {
      // Đợi 2 giây để user xem thông báo thành công
      const timer = setTimeout(() => {
        console.log("✅ Redirecting to dashboard...");
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
    console.log(fieldName, ":", fieldValue);
  };

  const handleCreate = async () => {
    console.log("📝 Final Form Data:", formData);

    try {
      const requestData = {
        ...formData,
        userId: user?.primaryEmailAddress?.emailAddress || user?.id || "guest_user",
      };

      console.log("🚀 Sending to API:", requestData);

      const courseData = await generateCourse(requestData);
      console.log("✅ Generated Course:", courseData);

      if (courseData.saved) {
        console.log("💾 Course saved with ID:", courseData.saved.courseID);
      } else {
        console.warn("⚠️ Course generated but not saved to database");
      }

    } catch (err) {
      console.error("❌ Error generating course:", err);
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
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
      <h2 className="font-bold text-4xl text-purple-600">
        Bắt đầu khóa học Tiếng Anh cùng AI
      </h2>
      <p className="text-gray-600 text-lg mt-3 text-center">
        Tạo khóa học của bạn một cách nhanh chóng và dễ dàng với sự hỗ trợ của
        AI. Chỉ cần cung cấp chủ đề và một số chi tiết cơ bản, và để AI lo phần
        còn lại.
      </p>

      {user && (
        <p className="text-sm text-gray-500 mt-2">
          👤 Đang tạo khóa học cho: <strong>{user.primaryEmailAddress?.emailAddress || user.id}</strong>
        </p>
      )}
      {!user && (
        <p className="text-sm text-amber-600 mt-2">
          ⚠️ Chưa đăng nhập - Khóa học sẽ không được lưu vào database
        </p>
      )}

      <div className="mt-10 w-full">
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

      {/* Loading state với progress bar */}
      {loading && (
        <div className="mt-6 w-full max-w-2xl">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="animate-spin text-purple-600" size={24} />
              <span className="text-purple-700 font-medium">
                Đang tạo khóa học với AI...
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">
              {progress < 30 && "Đang phân tích yêu cầu..."}
              {progress >= 30 && progress < 60 && "Đang tạo nội dung khóa học..."}
              {progress >= 60 && progress < 90 && "Đang lưu vào cơ sở dữ liệu..."}
              {progress >= 90 && "Sắp hoàn thành..."}
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="mt-6 w-full max-w-2xl">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Có lỗi xảy ra</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="mt-3 border-red-300 text-red-700 hover:bg-red-50"
              >
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success message với countdown */}
      {data && !loading && !error && (
        <div className="mt-6 w-full max-w-2xl">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-1">
                Khóa học đã được tạo thành công! 🎉
              </h3>
              <p className="text-green-700 text-sm font-medium mb-2">
                {data.courseName || "Khóa học của bạn"}
              </p>

              {/* ✅ Redirect notification */}
              <div className="bg-blue-50 p-2 rounded mb-2 text-sm border border-blue-200">
                <span className="text-blue-700">🔄 Đang chuyển đến Dashboard...</span>
              </div>

              {data.saved && data.saved.courseID && (
                <div className="bg-white p-2 rounded mb-2 text-sm border border-green-200">
                  <span className="text-green-600 font-semibold">💾 Đã lưu vào database</span>
                  <div className="text-gray-600 text-xs mt-1">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      ID: {data.saved.courseID}
                    </span>
                  </div>
                </div>
              )}

              {(!data.saved || !data.saved.courseID) && (
                <div className="bg-amber-50 p-2 rounded mb-2 text-sm border border-amber-200">
                  <span className="text-amber-700">⚠️ Khóa học chưa được lưu vào database</span>
                  <p className="text-xs text-amber-600 mt-1">
                    {!user ? "Vui lòng đăng nhập để lưu khóa học" : "Có lỗi khi lưu"}
                  </p>
                </div>
              )}
              
              {data.chapters && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 bg-white p-2 rounded">
                  <span>📚 {data.chapters.length} chương</span>
                  <span>📝 {data.chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)} bài học</span>
                  <span>⏱️ {data.duration || "4 tuần"}</span>
                </div>
              )}

              {data.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {data.description}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Đến Dashboard ngay
                </Button>
                <Button
                  size="sm"
                  onClick={handleReset}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Tạo khóa học khác
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between w-full mt-12">
        {step !== 0 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={loading}
          >
            Quay lại
          </Button>
        ) : (
          <div></div>
        )}

        {step === 0 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!formData.studyType || loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Tiếp tục
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={!formData.topic || !formData.difficultyLevel || loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo khóa học"
            )}
          </Button>
        )}
      </div>

      {/* Debug panel */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="mt-8 w-full max-w-2xl">
          <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              🛠 Debug Info (Development Only)
            </summary>
            <div className="mt-2 space-y-2">
              <div className="bg-white p-3 rounded border">
                <p className="text-xs font-semibold text-gray-600 mb-1">User Info:</p>
                <pre className="text-xs text-gray-700 overflow-auto">
                  {JSON.stringify({
                    isSignedIn: !!user,
                    userId: user?.id,
                    email: user?.primaryEmailAddress?.emailAddress,
                    username: user?.username,
                  }, null, 2)}
                </pre>
              </div>

              <div className="bg-white p-3 rounded border">
                <p className="text-xs font-semibold text-gray-600 mb-1">Form Data:</p>
                <pre className="text-xs text-gray-700 overflow-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>

              <div className="bg-white p-3 rounded border">
                <p className="text-xs font-semibold text-gray-600 mb-1">State:</p>
                <pre className="text-xs text-gray-700">
                  {JSON.stringify({ 
                    step, 
                    loading, 
                    hasError: !!error, 
                    hasData: !!data,
                    progress,
                    saved: data?.saved || null
                  }, null, 2)}
                </pre>
              </div>

              {data && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Generated Data:</p>
                  <pre className="text-xs text-gray-700 overflow-auto max-h-64">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>
      )} */}
    </div>
  );
}

export default Create;
// ============================================
// FILE: hooks/useGenerateCourse.js
// ============================================
// Tạo thư mục hooks/ ở root project nếu chưa có
// Sau đó tạo file này: hooks/useGenerateCourse.js

import { useState } from "react";

export function useGenerateCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);

  const generateCourse = async (formData) => {
    setLoading(true);
    setError(null);
    setData(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể tạo khóa học");
      }

      const result = await response.json();
      setData(result.data);

      console.log("✅ Course generated:", result);

      return result.data;
    } catch (err) {
      console.error("❌ Generate course error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
    setProgress(0);
  };

  return {
    generateCourse,
    loading,
    error,
    data,
    progress,
    reset,
  };
}

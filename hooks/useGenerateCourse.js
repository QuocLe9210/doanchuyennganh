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
  const [savedCourse, setSavedCourse] = useState(null);

  const generateCourse = async (formData) => {
    setLoading(true);
    setError(null);
    setData(null);
    setSavedCourse(null);
    setProgress(0);

    try {
      // Validate input
      if (!formData.studyType || !formData.topic || !formData.difficultyLevel) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

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

      console.log("🚀 Generating course:", formData);

      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Không thể tạo khóa học");
      }

      if (!result.success) {
        throw new Error(result.error || "API trả về lỗi");
      }

      setData(result.data);
      setSavedCourse(result.saved);

      console.log("✅ Course generated successfully:", {
        courseName: result.data?.courseName,
        chapters: result.data?.chapters?.length,
        saved: result.saved,
        stats: result.stats,
      });

      return {
        data: result.data,
        saved: result.saved,
        stats: result.stats,
      };
    } catch (err) {
      console.error("❌ Generate course error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress after 1s
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
    setSavedCourse(null);
    setProgress(0);
  };

  return {
    generateCourse,
    loading,
    error,
    data,
    savedCourse,
    progress,
    reset,
  };
}

// ============================================
// EXAMPLE USAGE
// ============================================
/*
import { useGenerateCourse } from "@/hooks/useGenerateCourse";
import { useUser } from "@clerk/nextjs";

function CreateCourseForm() {
  const { user } = useUser();
  const { generateCourse, loading, error, data, savedCourse, progress } = useGenerateCourse();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await generateCourse({
        studyType: "Study Material",
        topic: "Present Simple Tense",
        difficultyLevel: "Beginner",
        userId: user?.primaryEmailAddress?.emailAddress || "guest",
      });

      console.log("Course created:", result);
      
      // Navigate to course page or show success
      if (result.saved?.courseID) {
        router.push(`/course/${result.saved.courseID}`);
      }
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && (
        <div>
          <p>Generating course... {progress}%</p>
          <progress value={progress} max="100" />
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {data && (
        <div>
          <h2>✅ Course Created: {data.courseName}</h2>
          <p>{data.description}</p>
          {savedCourse?.courseID && (
            <p>Course ID: {savedCourse.courseID}</p>
          )}
        </div>
      )}
      
      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Course"}
      </button>
    </form>
  );
}
*/

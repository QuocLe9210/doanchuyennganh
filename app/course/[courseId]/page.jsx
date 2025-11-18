"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  const GetCourse = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching course data for id:', courseId);
      
      // Gọi API study-type để lấy cả course và materials
      const result = await axios.post(`/api/study-type`, {
        courseId: courseId,
        studyType: "ALL"
      });
      
      console.log("📚 Full response:", result.data);
      
      // Lấy course từ response (sau khi sửa API)
      if (result.data.course) {
        console.log("✅ Course data found:", result.data.course);
        setCourse(result.data.course);
      } else {
        console.warn("⚠️ No course data in response");
      }
      
    } catch (error) {
      console.error("❌ Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">❌ Không tìm thấy khóa học</p>
          <p className="text-gray-500">CourseId: {courseId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Course Intro */}
        <CourseIntroCard course={course} />
        
        {/* Study Materials options */}
        <StudyMaterialSection courseId={courseId} /> 
        
        {/* Chapter List */}
        <ChapterList course={course} />
      </div>
    </div>
  );
}

export default Course;
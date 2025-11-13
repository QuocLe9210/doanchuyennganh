"use client";

import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

function Course() {
  const { courseId } = useParams();
  const router = useRouter();
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
      // Gọi API study-type để lấy cả course và materials
      const result = await axios.post(`/api/study-type`, {
        courseId: courseId,
        studyType: "ALL"
      });
      console.log("📚 Course data:", result.data);
      setCourse(result.data.course); // Lấy course từ response
    } catch (error) {
      console.error("❌ Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="">
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
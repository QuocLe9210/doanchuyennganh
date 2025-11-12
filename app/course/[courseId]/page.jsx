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
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      console.log("📚 Course data:", result.data);
      setCourse(result.data.result);
    } catch (error) {
      console.error("❌ Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      < div className="mx-10 md:mx-36 lg:px-60 mt-10"  >
        {/* {Course Into} */}
        <CourseIntroCard course={course} />
        {/* Study Meterials options */}
        <StudyMaterialSection /> 
        {/* Chapter List */}
        <ChapterList course ={course} />
      </div>
    </div>
  );
}

export default Course;

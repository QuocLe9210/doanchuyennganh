"use client";

import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Target,
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";

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

      {/* {Course Into} */}

      {/* Study Meterials options */}

      {/* Chapter List */}
    </div>
  );
}

export default Course;

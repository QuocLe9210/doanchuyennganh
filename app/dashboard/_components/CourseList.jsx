"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CourseCountContext } from "../../_context/CourseCountContext";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { totalCourses, setTotalCourses } = useContext(CourseCountContext);

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  const GetCourseList = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      console.log("📧 Email đang gửi:", email);

      if (!email) {
        toast.error("Không tìm thấy email người dùng");
        return;
      }

      const result = await axios.post("/api/courses", {
        createdBy: email,
      });

      console.log("📊 Kết quả:", result.data);
      const courses = result.data.result || [];
      setCourseList(courses);
      setTotalCourses(courses.length);

      if (courses.length > 0) {
        toast.success(`Đã tải ${courses.length} khóa học`, {
          description: "Danh sách khóa học đã được cập nhật"
        });
      } else {
        toast.info("Chưa có khóa học nào", {
          description: "Hãy tạo khóa học đầu tiên của bạn!"
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách khóa học:", error);
      
      toast.error("Không thể tải danh sách khóa học", {
        description: error.response?.data?.message || error.message || "Vui lòng thử lại"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">Danh sách khóa học của tôi</h2>
        
        <Button 
          variant="outline" 
          onClick={GetCourseList}
          disabled={loading}
          className="border-purple-700 text-purple-700 hover:bg-purple-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {loading && courseList.length === 0 && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </>
        )}

        {!loading && courseList.map((course, index) => (
          <CourseCardItem key={course.id || index} course={course} />
        ))}

        {!loading && courseList.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              Bạn chưa tạo khóa học nào
            </p>
            <p className="text-gray-400 text-sm">
              Nhấn vào "Tạo khóa học mới" để bắt đầu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
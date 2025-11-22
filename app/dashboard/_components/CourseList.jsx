"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { CourseCountContext } from "../../_context/CourseCountContext";
import { useSearchParams, useRouter } from "next/navigation";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { totalCourses, setTotalCourses } = useContext(CourseCountContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  // Filter courses when search query changes
  useEffect(() => {
    if (searchQuery && courseList.length > 0) {
      const filtered = courseList.filter((course) => {
        const courseName = course?.courseLayout?.courseName?.toLowerCase() || '';
        const description = course?.courseLayout?.description?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return courseName.includes(query) || description.includes(query);
      });
      
      setFilteredCourses(filtered);
      
      if (filtered.length === 0) {
        toast.error(`Không tìm thấy khóa học với từ khóa "${searchQuery}"`);
      } else {
        toast.success(`Tìm thấy ${filtered.length} khóa học`);
      }
    } else {
      setFilteredCourses(courseList);
    }
  }, [searchQuery, courseList]);

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

      if (!searchQuery) {
        if (courses.length > 0) {
          toast.success(`Đã tải ${courses.length} khóa học`, {
            description: "Danh sách khóa học đã được cập nhật"
          });
        } else {
          toast.info("Chưa có khóa học nào", {
            description: "Hãy tạo khóa học đầu tiên của bạn!"
          });
        }
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

  const handleClearSearch = () => {
    router.push('/dashboard');
  };

  const displayCourses = filteredCourses;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-2xl">
            {searchQuery ? 'Kết quả tìm kiếm' : 'Danh sách khóa học của tôi'}
          </h2>
          {searchQuery && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-500">
                Tìm kiếm: <span className="font-semibold text-purple-600">"{searchQuery}"</span>
                {displayCourses.length > 0 && ` - ${displayCourses.length} khóa học`}
              </p>
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline"
              >
                <X className="w-3 h-3" />
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>
        
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
        {/* Loading skeleton */}
        {loading && courseList.length === 0 && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl p-5 animate-pulse bg-white">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </>
        )}

        {/* Show courses */}
        {!loading && displayCourses.map((course, index) => (
          <CourseCardItem key={course.id || index} course={course} />
        ))}

        {/* Empty state - No courses at all */}
        {!loading && courseList.length === 0 && !searchQuery && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              Bạn chưa tạo khóa học nào
            </p>
            <p className="text-gray-400 text-sm">
              Nhấn vào "Tạo bài học mới" để bắt đầu
            </p>
          </div>
        )}

        {/* No search results */}
        {!loading && displayCourses.length === 0 && searchQuery && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              Không tìm thấy khóa học nào
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Không có khóa học nào khớp với từ khóa <span className="font-semibold text-purple-600">"{searchQuery}"</span>
            </p>
            <Button 
              variant="outline"
              onClick={handleClearSearch}
              className="border-purple-700 text-purple-700 hover:bg-purple-50"
            >
              <X className="w-4 h-4 mr-2" />
              Xóa tìm kiếm và xem tất cả
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
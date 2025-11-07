"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseCardItem from "./CourseCardItem";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  const GetCourseList = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      console.log("📧 Email đang gửi:", email);

      const result = await axios.post("/api/courses", {
        createdBy: email, // ✅ Đảm bảo đúng trường gửi lên
      });

      console.log("📊 Kết quả:", result.data);
      setCourseList(result.data.result || []);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách khóa học:", error);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl">Danh sách khóa học của tôi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {courseList?.map((course, index) => (
          <CourseCardItem key={index} course={course} />
        ))}

        {courseList.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full mt-4">
            Bạn chưa tạo khóa học nào.
          </p>
        )}
      </div>
    </div>
  );
}

export default CourseList;

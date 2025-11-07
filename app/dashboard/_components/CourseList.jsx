"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    user && GetCourseList();
  }, [user]);

  const GetCourseList = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    console.log("📧 Email đang gửi:", email);

    const result = await axios.post(
      "/api/courses",
      { createdBy: email }  // ✅ Đảm bảo là createdBy
    );

    console.log("📊 Kết quả:", result.data);
    setCourseList(result.data.result);
  };

  return (
    <div>
      <h2>Danh sách khóa học của tôi</h2>
      <div>
          {courseList.map((course) => (
            <div key={course.id}>
              <h3>{course.topic}</h3>
              <p>Loại: {course.courseType}</p>
              <p>Độ khó: {course.difficultyLevel}</p>
              <p>Trạng thái: {course.status}</p>
            </div>
          ))}
       </div>
     
    </div>
  );
}

export default CourseList;
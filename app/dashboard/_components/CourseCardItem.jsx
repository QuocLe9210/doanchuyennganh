import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function CourseCardItem({ course }) {
  // Dùng id (serial primary key) cho URL ngắn gọn
  const courseLink = course?.id ? `/course/${course.id}` : '#';
  
  return (
    <div className="border rounded-xl shadow-md p-5 bg-white hover:shadow-lg transition-all duration-300">
      {/* Ảnh khóa học */}
      <div className="flex justify-between items-center">
        <Image
          src="/captoc.jpg"
          alt="Course Thumbnail"
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      </div>

      {/* Tên khóa học */}
      <h2 className="mt-3 font-semibold text-lg text-gray-800">
        {course?.courseLayout?.courseName || "Tên khóa học"}
      </h2>

      {/* Mô tả */}
      <p className="text-sm text-gray-500 line-clamp-2 mt-2">
        {course?.courseLayout?.description || "Mô tả ngắn về khóa học..."}
      </p>

      {/* Tiến độ */}
      <div className="mt-4">
        <Progress value={0} />
      </div>

      {/* Nút xem chi tiết */}
      <div className="mt-5 flex justify-end">
        <Link href={courseLink}>
          <Button
            variant="onClick"
            className="bg-purple-700 text-white hover:bg-purple-700 transition-colors"
            disabled={!course?.id}
          >
            Xem chi tiết
          </Button>
        </Link> 
      </div>
    </div>
  );
}

export default CourseCardItem;
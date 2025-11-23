// app/dashboard/lessons/page.jsx
'use client'

import React, { useContext, useState } from "react";
import { BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { CourseCountContext } from "../../_context/CourseCountContext";

function LessonsPage() {
  const { courses } = useContext(CourseCountContext);
  const [selectedCourse, setSelectedCourse] = useState(courses?.[0] || null);
  const [completedLessons, setCompletedLessons] = useState({});

  const handleLessonComplete = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Không có bài học nào</h2>
        <p className="text-gray-600 mb-8">Hãy tạo khóa học mới để bắt đầu học tập</p>
        <Link href="/create">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg">
            ➕ Tạo khóa học
          </button>
        </Link>
      </div>
    );
  }

  const currentCourse = selectedCourse || courses[0];
  const totalLessons = currentCourse?.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0;
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Bài học</h1>
        <p className="text-gray-600">Theo dõi tiến độ học tập của bạn</p>
      </div>

      {/* Course Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCourse(course)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              selectedCourse === course
                ? "border-purple-600 bg-white shadow-lg"
                : "border-gray-200 bg-white hover:border-purple-400"
            }`}
          >
            <h3 className="font-bold text-gray-900 mb-1">{course.courseName || "Khóa học"}</h3>
            <p className="text-sm text-gray-600">
              📖 {course.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0} bài
            </p>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tiến độ: {currentCourse.courseName}</h2>
          <span className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Hoàn thành: <strong>{completedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Còn lại: <strong>{totalLessons - completedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-gray-700">Tổng: <strong>{totalLessons}</strong></span>
          </div>
        </div>
      </div>

      {/* Chapters & Lessons */}
      <div className="space-y-4">
        {currentCourse.chapters?.map((chapter, chIdx) => {
          const chapterLessons = chapter.lessons || [];
          const chapterCompleted = chapterLessons.filter(l => completedLessons[`${chIdx}-${l.id}`]).length;
          
          return (
            <div key={chIdx} className="bg-white rounded-xl shadow overflow-hidden">
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      🎓 Chương {chIdx + 1}: {chapter.name || `Chapter ${chIdx + 1}`}
                    </h3>
                    {chapter.description && <p className="text-sm text-gray-600">{chapter.description}</p>}
                  </div>
                  <div className="text-right whitespace-nowrap ml-4">
                    <div className="text-xl font-bold text-purple-600">{chapterCompleted}/{chapterLessons.length}</div>
                    <div className="text-xs text-gray-600">Bài học</div>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y">
                {chapterLessons.map((lesson, lessonIdx) => {
                  const lessonKey = `${chIdx}-${lesson.id}`;
                  const isCompleted = completedLessons[lessonKey];
                  
                  return (
                    <div key={lessonIdx} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLessonComplete(lessonKey)}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-green-600 border-green-600"
                              : "border-gray-300 hover:border-green-600"
                          }`}
                        >
                          {isCompleted && <span className="text-white text-xs">✓</span>}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm truncate ${isCompleted ? "text-gray-500 line-through" : "text-gray-900"}`}>
                            Bài {lessonIdx + 1}: {lesson.name || lesson.title || "Bài học"}
                          </h4>
                          {lesson.description && (
                            <p className="text-xs text-gray-600 mt-0.5 truncate">{lesson.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          {lesson.duration && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </div>
                          )}
                          <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-all">
                            ▶️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LessonsPage; 
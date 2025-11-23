'use client'
import React, { useState, useEffect } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import { CourseCountContext } from '../_context/CourseCountContext'

function DashboardLayout({ children }) {
  const [totalCourses, setTotalCourses] = useState(0);
  const [courses, setCourses] = useState([]);

  // Lấy dữ liệu khóa học từ localStorage hoặc API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Nếu có API: 
        // const res = await fetch('/api/courses');
        // const data = await res.json();
        
        // Hoặc từ localStorage:
        const savedCourses = localStorage.getItem('courses');
        if (savedCourses) {
          const parsedCourses = JSON.parse(savedCourses);
          setCourses(parsedCourses);
          setTotalCourses(parsedCourses.length);
        }
      } catch (error) {
        console.error('Lỗi tải khóa học:', error);
      }
    };

    fetchCourses();
  }, []);
  
  return (
    <CourseCountContext.Provider value={{ totalCourses, setTotalCourses, courses, setCourses }}>
      <div className='min-h-screen bg-gray-50'>
        {/* Sidebar - Fixed bên trái */}
        <div className='md:w-64 hidden md:block fixed h-screen bg-white border-r border-gray-200'>
          <SideBar />
        </div>
        
        {/* Main Content */}
        <div className='md:ml-64'>
          {/* Header */}
          <DashboardHeader />
          
          {/* Content */}
          <div className='p-5 md:p-8'> 
            {children}
          </div>
        </div>
      </div>
    </CourseCountContext.Provider>
  )
}

export default DashboardLayout
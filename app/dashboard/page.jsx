'use client'
import React, { useContext } from 'react'
import WelcomBanner from './_components/WelcomBanner'
import CourseList from './_components/CourseList'
import Link from 'next/link'
import { CourseCountContext } from '../_context/CourseCountContext'

function DashboardPage() {
  const { totalCourses, courses } = useContext(CourseCountContext);

  return (
    <div className='space-y-6'>
      {/* Welcome Banner */}
      <WelcomBanner />

      {/* Course List - Main Content */}
      <CourseList />
    </div>
  )
}

export default DashboardPage
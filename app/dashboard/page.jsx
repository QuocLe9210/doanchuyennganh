import React from 'react'
import WelcomBanner from './_components/WelcomBanner'
import CourseList from './_components/CourseList'

function DashboardPage() {
  return (
    <div>

        < WelcomBanner/>

        <CourseList />
    </div>
  )
}

export default DashboardPage
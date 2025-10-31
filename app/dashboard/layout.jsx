import React from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'

function DashboardLayout({ children }) {
  return (
    <div>
      {/* Sidebar - Fixed bên trái */}
      <div className='md:w-64 hidden md:block fixed'> {/* ✅ Sửa md: block thành md:block */}
        <SideBar />
      </div>
      
  
      <div className='md:ml-64'> {/* ✅ Di chuyển md:ml-64 ra ngoài để bao cả header và children */}
        {/* Header */}
        <DashboardHeader />
        
      
        <div className='p-5'> 
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
'use client'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { Search, Bell, Menu } from 'lucide-react'

function DashboardHeader() {
  return (
    <div className='bg-white border-b px-6 py-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        {/* Left Side - Menu & Search */}
        <div className='flex items-center gap-4 flex-1'>
          {/* Mobile Menu Button */}
          <button className='md:hidden p-2 hover:bg-gray-100 rounded-lg'>
            <Menu className='w-5 h-5 text-gray-600' />
          </button>

          {/* Search Bar */}
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Tìm kiếm bài học, từ vựng...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* Right Side - Notifications & User */}
        <div className='flex items-center gap-4'>
          {/* Notifications */}
          <button className='relative p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <Bell className='w-5 h-5 text-gray-600' />
            {/* Notification Badge */}
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>

          {/* User Profile */}
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
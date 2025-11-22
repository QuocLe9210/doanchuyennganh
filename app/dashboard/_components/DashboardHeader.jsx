'use client'
import React, { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Search, Bell, Menu, X, CheckCheck, Trash2, BookOpen, Sparkles, Trophy, Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const router = useRouter()

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    // Simulated notifications - trong thực tế sẽ load từ API/Database
    const notificationData = [
      { 
        id: 1, 
        type: 'course',
        icon: BookOpen,
        title: 'Khóa học mới được tạo', 
        message: 'Bạn đã tạo thành công khóa học "Mastering English B1"', 
        time: new Date(Date.now() - 5 * 60000), // 5 phút trước
        unread: true,
        link: '/dashboard'
      },
      { 
        id: 2, 
        type: 'achievement',
        icon: Trophy,
        title: 'Thành tích mới!', 
        message: 'Chúc mừng! Bạn đã hoàn thành 5 bài học tuần này', 
        time: new Date(Date.now() - 2 * 60 * 60000), // 2 giờ trước
        unread: true,
        link: '/dashboard/profile'
      },
      { 
        id: 3, 
        type: 'upgrade',
        icon: Sparkles,
        title: 'Nâng cấp tài khoản', 
        message: 'Nâng cấp lên Premium để mở khóa thêm nhiều tính năng', 
        time: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 ngày trước
        unread: false,
        link: '/dashboard/upgrade'
      },
      { 
        id: 4, 
        type: 'gift',
        icon: Gift,
        title: 'Khuyến mãi đặc biệt', 
        message: 'Giảm 30% gói Premium - Chỉ còn 3 ngày!', 
        time: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 ngày trước
        unread: false,
        link: '/dashboard/upgrade'
      },
    ]
    setNotifications(notificationData)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`)
      setShowMobileSearch(false)
      toast.success(`Đang tìm kiếm: "${searchQuery}"`)
    } else {
      toast.error('Vui lòng nhập từ khóa tìm kiếm')
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })))
    toast.success('Đã đánh dấu tất cả là đã đọc')
  }

  const deleteNotification = (id, e) => {
    e.stopPropagation()
    setNotifications(notifications.filter(notif => notif.id !== id))
    toast.success('Đã xóa thông báo')
  }

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id)
    if (notif.link) {
      router.push(notif.link)
      setShowNotifications(false)
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationColor = (type) => {
    switch(type) {
      case 'course': return 'text-blue-600 bg-blue-50'
      case 'achievement': return 'text-yellow-600 bg-yellow-50'
      case 'upgrade': return 'text-purple-600 bg-purple-50'
      case 'gift': return 'text-pink-600 bg-pink-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className='bg-white border-b px-4 md:px-6 py-3 md:py-4 shadow-sm sticky top-0 z-50'>
      <div className='flex items-center justify-between gap-4'>
        {/* Left Side - Menu & Search */}
        <div className='flex items-center gap-2 md:gap-4 flex-1'>
          {/* Mobile Menu Button */}
          <button 
            className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => {/* Toggle mobile sidebar */}}
          >
            <Menu className='w-5 h-5 text-gray-600' />
          </button>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className='hidden md:flex relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Tìm kiếm bài học, từ vựng...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </form>

          {/* Mobile Search Button */}
          <button
            className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className='w-5 h-5 text-gray-600' />
          </button>
        </div>

        {/* Right Side - Notifications & User */}
        <div className='flex items-center gap-2 md:gap-4'>
          {/* Notifications */}
          <div className='relative'>
            <button 
              className='relative p-2 hover:bg-gray-100 rounded-lg transition-colors'
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className='w-5 h-5 text-gray-600' />
              {/* Notification Badge */}
              {unreadCount > 0 && (
                <span className='absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1 animate-pulse'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className='absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50'>
                {/* Header */}
                <div className='p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-bold text-gray-800 text-lg'>Thông báo</h3>
                    {unreadCount > 0 && (
                      <span className='text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-semibold'>
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className='text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1'
                    >
                      <CheckCheck className='w-3 h-3' />
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className='max-h-[500px] overflow-y-auto'>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      const IconComponent = notif.icon
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0 relative group ${
                            notif.unread ? 'bg-purple-50/50' : ''
                          }`}
                        >
                          <div className='flex items-start gap-3'>
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notif.type)}`}>
                              <IconComponent className='w-5 h-5' />
                            </div>

                            {/* Content */}
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-start justify-between gap-2'>
                                <h4 className='font-semibold text-sm text-gray-800 mb-1'>
                                  {notif.title}
                                </h4>
                                {notif.unread && (
                                  <div className='w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1'></div>
                                )}
                              </div>
                              <p className='text-xs text-gray-600 line-clamp-2 mb-2'>
                                {notif.message}
                              </p>
                              <div className='flex items-center justify-between'>
                                <span className='text-xs text-gray-400'>
                                  {formatTimeAgo(notif.time)}
                                </span>
                                <button
                                  onClick={(e) => deleteNotification(notif.id, e)}
                                  className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-500'
                                  title='Xóa'
                                >
                                  <Trash2 className='w-3 h-3' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className='p-12 text-center text-gray-500'>
                      <Bell className='w-16 h-16 mx-auto mb-3 text-gray-300' />
                      <p className='text-sm font-medium mb-1'>Không có thông báo</p>
                      <p className='text-xs text-gray-400'>Bạn đã xem hết tất cả thông báo</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className='p-3 bg-gray-50 border-t'>
                    <button 
                      onClick={() => {
                        router.push('/dashboard/notifications')
                        setShowNotifications(false)
                      }}
                      className='w-full text-center text-sm text-purple-600 hover:text-purple-700 font-semibold py-2 hover:bg-purple-50 rounded-lg transition-colors'
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <UserButton 
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 md:w-10 md:h-10'
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {showMobileSearch && (
        <form onSubmit={handleSearch} className='md:hidden mt-3 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Tìm kiếm bài học, từ vựng...'
            autoFocus
            className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </form>
      )}

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className='fixed inset-0 z-40' 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  )
}

export default DashboardHeader
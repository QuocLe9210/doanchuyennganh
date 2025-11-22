'use client'
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Sparkles, User, HelpCircle, LogOut, Coins } from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { CourseCountContext } from "../../_context/CourseCountContext";

function SideBar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { totalCourses } = useContext(CourseCountContext);

  const MenuList = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Bài học", icon: BookOpen, path: "/dashboard/lessons" },
    { name: "Nâng cấp", icon: Sparkles, path: "/dashboard/upgrade" },
    { name: "Hồ sơ", icon: User, path: "/dashboard/profile" },
    { name: "Trợ giúp", icon: HelpCircle, path: "/dashboard/help" },
  ];

  // Thông tin credits - Có thể tùy chỉnh dựa trên plan của user
  const maxCourses = 5; // Free plan: 5 khóa học
  const percentageUsed = (totalCourses / maxCourses) * 100;
  const coursesLeft = Math.max(0, maxCourses - totalCourses);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-white to-purple-50/30 shadow-xl border-r border-purple-100 flex flex-col">
      {/* Logo Section */}
      <div className="flex gap-3 items-center p-5 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-400/20 blur-md rounded-full"></div>
          <Image src="/logo.svg" alt="logo" width={40} height={40} className="relative" />
        </div>
        <h2 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Học Tiếng Anh với AI
        </h2>
      </div>

      {/* Create New Button */}
      <div className="p-5">
        <Link href="/create">
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <span className="text-xl">+</span>
            </div>
            <span>Tạo bài học mới</span>
          </button>
        </Link>
      </div>

      {/* Menu List */}
      <div className="px-5 flex-1 overflow-y-auto">
        <nav className="space-y-1.5">
          {MenuList.map((menu, index) => {
            const IconComponent = menu.icon;
            const isActive = pathname === menu.path;
            
            return (
              <Link
                key={index}
                href={menu.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-semibold shadow-sm"
                    : "hover:bg-purple-50 text-gray-700 hover:text-purple-600"
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                </div>
                <span className="text-sm">{menu.name}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Credits Section */}
      <div className="px-5 py-4 border-t border-purple-100 bg-white/50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 shadow-md">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Khóa học còn lại</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {coursesLeft}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-purple-200/50 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Credits Used Text */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-purple-700 font-medium">
              {totalCourses} / {maxCourses} Khóa học đã tạo
            </span>
          </div>
          
          {/* Warning if running low */}
          {coursesLeft <= 1 && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 font-medium">
                ⚠️  Hết khóa học! Nâng cấp ngay.
              </p>
            </div>
          )}
          
          {/* Upgrade Link */}
          <Link href="/dashboard/upgrade">
            <button className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              <Sparkles className="w-3.5 h-3.5" />
              Nâng cấp ngay
            </button>
          </Link>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="px-5 py-4 border-t border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-700">Tài khoản</p>
              <p className="text-xs text-gray-500">Xem hồ sơ</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 group"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
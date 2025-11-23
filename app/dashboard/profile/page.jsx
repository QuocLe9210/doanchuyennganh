// app/dashboard/profile/page.jsx
'use client'

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Lock, Bell, Eye, Save, Edit2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "+84 (0) 123 456 789",
    location: "Việt Nam",
    bio: "Người đam mê học tiếng Anh",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    courseReminders: true,
    newCourses: false,
    promotions: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add API call here to save changes
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Hồ sơ của bạn</h1>
        <p className="text-gray-600 text-sm">Quản lý thông tin cá nhân và cài đặt</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Thông tin cá nhân
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all text-sm"
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tên</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                isEditing
                  ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Họ</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                isEditing
                  ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                isEditing
                  ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Địa chỉ
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                isEditing
                  ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Giới thiệu</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="2"
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all resize-none ${
                isEditing
                  ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          Thông báo
        </h2>

        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={value}
                onChange={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  {key === 'emailUpdates' && 'Nhận email cập nhật'}
                  {key === 'courseReminders' && 'Nhắc nhở khóa học'}
                  {key === 'newCourses' && 'Thông báo khóa học mới'}
                  {key === 'promotions' && 'Nhận khuyến mãi'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {key === 'emailUpdates' && 'Nhận thông báo về các cập nhật mới'}
                  {key === 'courseReminders' && 'Nhắc nhở hoàn thành bài học'}
                  {key === 'newCourses' && 'Được thông báo về các khóa học mới'}
                  {key === 'promotions' && 'Nhận thông báo về các ưu đãi'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          Bảo mật
        </h2>

        <div className="space-y-2">
          <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-left text-sm">
            <p className="font-semibold text-gray-900">Đổi mật khẩu</p>
            <p className="text-xs text-gray-600 mt-0.5">Cập nhật mật khẩu của bạn định kỳ</p>
          </button>

          <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-left text-sm">
            <p className="font-semibold text-gray-900">Xác thực hai yếu tố</p>
            <p className="text-xs text-gray-600 mt-0.5">Bảo vệ tài khoản bằng 2FA</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
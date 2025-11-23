'use client'
import React, { useState } from "react";
import Image from "next/image";

function SelectOption({ selectedStudyType }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const Options = [
    { name: "Thi chứng chỉ", icon: "/thi2.jpg", color: "from-blue-500 to-blue-600" },
    { name: "Giao tiếp hàng ngày", icon: "/thi.jpg", color: "from-green-500 to-green-600" },
    { name: "Tiếng Anh Công Sở", icon: "/phongvan.jpg", color: "from-purple-500 to-purple-600" },
    { name: "Phỏng vấn xin việc", icon: "/xinviec.jpg", color: "from-orange-500 to-orange-600" },
    { name: "Khác", icon: "/khac.jpg", color: "from-pink-500 to-pink-600" },
  ];

  return (
    <div className="w-full">
      <h2 className="text-center mb-12 text-2xl md:text-3xl font-bold text-gray-900">
        Chọn mục tiêu học tập của bạn
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {Options.map((option, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedOption(option.name);
              selectedStudyType(option.name);
            }}
            className={`group relative p-6 flex flex-col items-center justify-center rounded-2xl 
            transition-all duration-300 cursor-pointer overflow-hidden h-64 md:h-72
            ${selectedOption === option.name 
              ? "ring-2 ring-purple-500 ring-offset-2 shadow-xl scale-105" 
              : "hover:shadow-xl hover:scale-105 border-2 border-gray-100"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={option.icon}
                alt={option.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon/Badge */}
              <div className={`bg-gradient-to-br ${option.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">
                  {option.name === "Thi chứng chỉ" && "🎖️"}
                  {option.name === "Giao tiếp hàng ngày" && "💬"}
                  {option.name === "Tiếng Anh Công Sở" && "💼"}
                  {option.name === "Phỏng vấn xin việc" && "🎤"}
                  {option.name === "Khác" && "✨"}
                </span>
              </div>

              {/* Text */}
              <h3 className="font-bold text-lg md:text-xl text-white text-center leading-tight drop-shadow-lg">
                {option.name}
              </h3>

              {/* Selection Indicator */}
              {selectedOption === option.name && (
                <div className="mt-4 bg-green-500 px-4 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-1">
                  ✓ Đã chọn
                </div>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-5"></div>
          </div>
        ))}
      </div>

      {/* Selected Indicator */}
      {selectedOption && (
        <div className="mt-10 p-4 bg-purple-50 border-l-4 border-purple-600 rounded-lg">
          <p className="text-sm text-gray-600">
            ✓ Mục tiêu đã chọn: <span className="font-bold text-purple-600">{selectedOption}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default SelectOption;
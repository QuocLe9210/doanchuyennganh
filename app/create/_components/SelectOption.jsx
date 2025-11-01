import React, { useState } from "react";
import Image from "next/image";

function SelectOption() {
  const [selectedOption, setSelectedOption] = useState(null);

  const Options = [
    { name: "Thi chứng chỉ", icon: "/thi2.jpg" },
    { name: "Giao tiếp hàng ngày", icon: "/thi.jpg" },
    { name: "Tiếng Anh Công Sở", icon: "/phongvan.jpg" },
    { name: "Phỏng vấn xin việc ", icon: "/xinviec.jpg" },
    { name: "Khác  ", icon: "/khac.jpg" },
   
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-center mb-8 text-2xl font-bold text-gray-800">
        Hãy lựa chọn của bạn để khóa học bắt đầu
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option.name)}
            className={`group p-6 flex flex-col items-center justify-center border-2 
            rounded-2xl hover:shadow-xl hover:-translate-y-1 
            transition-all duration-300 cursor-pointer bg-white
            ${selectedOption === option.name 
              ? "border-purple-600 shadow-lg bg-purple-50" 
              : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-xl">
              <Image
                src={option.icon}
                alt={option.name}
                width={100}
                height={100}
                className="rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-base text-gray-800 text-center">
              {option.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectOption;
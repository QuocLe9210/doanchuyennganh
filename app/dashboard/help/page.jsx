// app/dashboard/help/page.jsx
'use client'

import React, { useState } from "react";
import { HelpCircle, MessageSquare, Mail, Phone, ChevronDown, Search } from "lucide-react";

function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "Làm cách nào để bắt đầu học tập?",
      answer: "Để bắt đầu, hãy tạo một khóa học mới từ trang 'Tạo', chọn loại khóa học, nhập nội dung, và chọn mức độ khó. AI sẽ tự động tạo khóa học cho bạn."
    },
    {
      question: "Tôi có thể tạo bao nhiêu khóa học?",
      answer: "Với gói Miễn phí, bạn có thể tạo tối đa 5 khóa học. Với gói Pro là 50 khóa, và gói Premium là không giới hạn."
    },
    {
      question: "Làm cách nào để xóa một khóa học?",
      answer: "Vào trang 'Bài học', chọn khóa học bạn muốn xóa, sau đó nhấn nút 'Xóa'. Bạn sẽ phải xác nhận trước khi xóa."
    },
    {
      question: "Tôi có thể chỉnh sửa khóa học sau khi tạo không?",
      answer: "Có, bạn có thể chỉnh sửa tên, mô tả, và nội dung chương bất kỳ lúc nào. Chỉ cần vào khóa học và nhấn nút 'Chỉnh sửa'."
    },
    {
      question: "Những phương thức thanh toán nào được hỗ trợ?",
      answer: "Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, thẻ ghi nợ, và ví điện tử. Tất cả giao dịch đều được mã hóa SSL."
    },
    {
      question: "Có thể hủy gói nâng cấp bất cứ lúc nào không?",
      answer: "Có, bạn có thể hủy gói của mình bất cứ lúc nào. Bạn sẽ mất quyền truy cập vào các tính năng cao cấp từ ngày hủy."
    },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      description: "Gửi email cho chúng tôi",
      value: "support@learnenglish.com",
      action: "Gửi email",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Live Chat",
      description: "Chat với nhân viên hỗ trợ",
      value: "9AM - 9PM (GMT+7)",
      action: "Bắt đầu chat",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Điện thoại",
      description: "Gọi cho chúng tôi",
      value: "+84 (0) 98 765 4321",
      action: "Gọi ngay",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-purple-600" />
          Trợ giúp & Hỗ trợ
        </h1>
        <p className="text-gray-600 text-sm">Tìm câu trả lời cho các câu hỏi của bạn</p>
      </div>

      {/* Search Bar */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all text-sm"
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredFAQs.length > 0 ? (
          <div className="divide-y">
            {filteredFAQs.map((faq, idx) => (
              <div key={idx} className="transition-all">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? -1 : idx)}
                  className="w-full px-5 py-4 hover:bg-purple-50 transition-colors flex items-center justify-between text-left"
                >
                  <h3 className="font-bold text-gray-900 text-sm">{faq.question}</h3>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-600 transition-transform flex-shrink-0 ml-3 ${
                      expandedFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFAQ === idx && (
                  <div className="px-5 py-4 bg-purple-50 border-t-2 border-purple-100">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-gray-600 font-medium text-sm">Không tìm thấy kết quả</p>
          </div>
        )}
      </div>

      {/* Contact Methods */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📞 Liên hệ với chúng tôi</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-3 text-purple-600">
                {method.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{method.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{method.description}</p>
              <p className="text-xs font-semibold text-gray-900 mb-3">{method.value}</p>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-1.5 rounded text-xs font-medium transition-all">
                {method.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 border-2 border-purple-200 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Vẫn cần giúp đỡ?</h3>
        <p className="text-gray-700 text-sm mb-4">
          Nhóm hỗ trợ của chúng tôi sẵn sàng giúp bạn 24/7
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all text-sm">
          Liên hệ hỗ trợ ngay
        </button>
      </div>
    </div>
  );
}

export default HelpPage;
// app/dashboard/upgrade/page.jsx
'use client'

import React, { useState } from "react";
import { Check, X, Zap, Crown, Gift } from "lucide-react";

function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Miễn phí",
      price: "0",
      period: "",
      description: "Bắt đầu học ngay",
      features: [
        { text: "5 khóa học", included: true },
        { text: "Nội dung cơ bản", included: true },
        { text: "Hỗ trợ cộng đồng", included: true },
        { text: "Chứng chỉ", included: false },
        { text: "Ưu tiên hỗ trợ", included: false },
        { text: "Truy cập VIP", included: false },
      ],
      badge: "Gói hiện tại",
      badgeColor: "bg-gray-100 text-gray-800",
      buttonText: "Gói hiện tại",
      buttonStyle: "bg-gray-200 text-gray-800 cursor-default opacity-60",
      icon: "📚",
      id: "free"
    },
    {
      name: "Pro",
      price: billingCycle === 'monthly' ? "99" : "890",
      period: billingCycle === 'monthly' ? "/tháng" : "/năm",
      description: "Cho những người học nghiêm túc",
      features: [
        { text: "50 khóa học", included: true },
        { text: "Tất cả nội dung", included: true },
        { text: "Hỗ trợ ưu tiên", included: true },
        { text: "Chứng chỉ chính thức", included: true },
        { text: "Luyện tập không giới hạn", included: true },
        { text: "Truy cập VIP", included: false },
      ],
      badge: "Phổ biến",
      badgeColor: "bg-purple-100 text-purple-800",
      buttonText: "Nâng cấp lên Pro",
      buttonStyle: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
      icon: "⚡",
      popular: true,
      id: "pro"
    },
    {
      name: "Premium",
      price: billingCycle === 'monthly' ? "199" : "1790",
      period: billingCycle === 'monthly' ? "/tháng" : "/năm",
      description: "Trải nghiệm tối ưu",
      features: [
        { text: "Khóa học không giới hạn", included: true },
        { text: "Tất cả nội dung + VIP", included: true },
        { text: "Hỗ trợ 24/7", included: true },
        { text: "Chứng chỉ chính thức", included: true },
        { text: "Ưu tiên hỗ trợ cao nhất", included: true },
        { text: "Truy cập VIP hàng tháng", included: true },
      ],
      badge: "Tối ưu",
      badgeColor: "bg-yellow-100 text-yellow-800",
      buttonText: "Nâng cấp lên Premium",
      buttonStyle: "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white",
      icon: "👑",
      id: "premium"
    },
  ];

  const handleUpgrade = async (plan) => {
    if (plan.id === 'free') return;
    
    setLoading(true);
    try {
      // Gọi API để tạo checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.id,
          billingCycle: billingCycle,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect trực tiếp đến Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Có thể hủy bất cứ lúc nào không?",
      a: "Có, bạn có thể hủy gói của mình bất cứ lúc nào mà không có phí hủy. Bạn sẽ mất quyền truy cập từ ngày hủy."
    },
    {
      q: "Chứng chỉ có giá trị không?",
      a: "Có, chứng chỉ được công nhận và bạn có thể thêm vào hồ sơ LinkedIn hoặc CV."
    },
    {
      q: "Khóa học có được cập nhật không?",
      a: "Có, các khóa học được cập nhật hàng tuần với nội dung mới và cải tiến dựa trên phản hồi người dùng."
    },
    {
      q: "Hỗ trợ kỹ thuật như thế nào?",
      a: "Pro có hỗ trợ email trong 24 giờ, Premium có 24/7 support qua chat trực tiếp và email."
    },
  ];

  const comparison = [
    { feature: "Số khóa học tối đa", free: "5", pro: "50", premium: "Không giới hạn" },
    { feature: "Chứng chỉ", free: "❌", pro: "✅", premium: "✅" },
    { feature: "Hỗ trợ ưu tiên", free: "❌", pro: "✅ (Email)", premium: "✅ (24/7 Chat)" },
    { feature: "Nội dung VIP", free: "❌", pro: "❌", premium: "✅" },
    { feature: "Cập nhật hàng tháng", free: "❌", pro: "✅", premium: "✅ + Sớm 1 tuần" },
    { feature: "Luyện tập không giới hạn", free: "❌", pro: "✅", premium: "✅" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Gift className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          💎 Nâng cấp gói của bạn
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Chọn gói phù hợp và mở khóa tất cả tính năng cao cấp để học tiếng Anh hiệu quả hơn
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border-2 border-purple-200">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hàng tháng
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all relative text-sm ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hàng năm
            {billingCycle === 'yearly' && (
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-bounce">
                Tiết kiệm 25% 🔥
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl transition-all duration-300 overflow-hidden ${
              plan.popular
                ? 'md:scale-105 bg-white shadow-2xl ring-2 ring-purple-500'
                : 'bg-white shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold ${plan.badgeColor} shadow-lg`}>
                {plan.badge}
              </div>
            )}

            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 ${
              plan.popular ? 'bg-purple-600' : 'bg-gray-300'
            }`}></div>

            <div className="relative p-8">
              {/* Plan Header */}
              <div className="mb-6">
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 text-base">{plan.period}</span>}
                  {plan.price === "0" && <span className="text-gray-600 text-sm">Miễn phí mãi mãi</span>}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={loading || plan.id === 'free'}
                className={`w-full py-3 px-4 rounded-lg font-bold mb-8 transition-all text-sm ${plan.buttonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Đang xử lý...' : plan.buttonText}
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 mb-6"></div>

              {/* Features */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Bao gồm</p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      feature.included
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}>
                      {feature.included ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <span className={`text-sm ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">📊 So sánh chi tiết</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-900 text-sm">Tính năng</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900 text-sm">Miễn phí</th>
                <th className="px-6 py-4 text-center font-bold text-purple-600 text-sm">Pro</th>
                <th className="px-6 py-4 text-center font-bold text-yellow-600 text-sm">Premium</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">{row.feature}</td>
                  <td className="px-6 py-4 text-center text-gray-600 text-sm">{row.free}</td>
                  <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium text-purple-600">{row.pro}</td>
                  <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium text-yellow-600">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          ❓ Câu hỏi thường gặp
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-start gap-2">
                <span className="text-lg">❓</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nâng cao kỹ năng</h3>
          <p className="text-sm text-gray-700">Truy cập đầy đủ nội dung chất lượng cao được tạo bởi AI</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Chứng chỉ chính thức</h3>
          <p className="text-sm text-gray-700">Nhận chứng chỉ được công nhận khi hoàn thành khóa học</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
          <p className="text-sm text-gray-700">Được giúp đỡ bởi đội hỗ trợ chuyên nghiệp bất kỳ lúc nào</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Sẵn sàng để nâng cấp?</h2>
        <p className="text-purple-100 mb-6 text-lg">
          Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay
        </p>
        <button 
          onClick={() => handleUpgrade(plans[1])}
          disabled={loading}
          className="bg-white hover:bg-purple-50 text-purple-600 font-bold py-3 px-8 rounded-lg transition-all text-lg disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Chọn gói Pro ngay →'}
        </button>
      </div>
    </div>
  );
}

export default UpgradePage;
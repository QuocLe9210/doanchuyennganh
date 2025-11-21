"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function ViewQA() {
  const { courseId } = useParams();
  const router = useRouter();
  const [qa, setQA] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [knownQuestions, setKnownQuestions] = useState([]);

  useEffect(() => {
    GetQA();
  }, []);

  const GetQA = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "qa"
      });
      setQA(result?.data);
    } catch (error) {
      console.error("Error fetching Q&A:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < qa?.questions?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKnown = () => {
    if (!knownQuestions.includes(currentIndex)) {
      setKnownQuestions([...knownQuestions, currentIndex]);
    }
    handleNext();
  };

  const handleUnknown = () => {
    const newKnown = knownQuestions.filter(i => i !== currentIndex);
    setKnownQuestions(newKnown);
    handleNext();
  };

  const resetProgress = () => {
    setKnownQuestions([]);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4'></div>
          <p className='text-purple-600 font-medium text-lg'>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = qa?.questions?.[currentIndex];
  const progress = qa?.questions?.length
    ? Math.round(((currentIndex + 1) / qa.questions.length) * 100)
    : 0;
  const knownProgress = qa?.questions?.length
    ? Math.round((knownQuestions.length / qa.questions.length) * 100)
    : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-4 border border-purple-100'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-3'>
              <span>💬</span> Q&A Practice
            </h1>
            <p className='text-gray-600 mt-2 text-sm'>Luyện tập câu hỏi và câu trả lời</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-purple-100'>
            <p className='text-sm text-gray-600 mb-1'>Tiến độ</p>
            <p className='text-2xl font-bold text-purple-600'>{currentIndex + 1} / {qa?.questions?.length || 0}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100'>
            <p className='text-sm text-gray-600 mb-1'>Đã biết</p>
            <p className='text-2xl font-bold text-green-600'>{knownQuestions.length} câu</p>
          </div>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-blue-100'>
            <p className='text-sm text-gray-600 mb-1'>Hoàn thành</p>
            <p className='text-2xl font-bold text-blue-600'>{knownProgress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 border border-purple-100'>
          <div className='flex items-center gap-4 mb-2'>
            <span className='text-sm font-medium text-gray-600'>Tiến độ học</span>
            <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500'
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className='text-sm font-bold text-purple-600'>{progress}%</span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium text-gray-600'>Đã nắm vững</span>
            <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500'
                style={{ width: `${knownProgress}%` }}
              />
            </div>
            <span className='text-sm font-bold text-green-600'>{knownProgress}%</span>
          </div>
        </div>

        {/* Q&A Card */}
        {currentQuestion && (
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border-2 border-purple-200'>
            {/* Chapter Badge */}
            {currentQuestion.chapterId && (
              <div className='bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4'>
                <p className='text-white font-semibold'>
                  📚 {currentQuestion.chapterId}
                </p>
              </div>
            )}

            <div className='p-8 sm:p-12'>
              {/* Question */}
              <div className='mb-8'>
                <div className='inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4'>
                  🇬🇧 Question (English)
                </div>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Show Answer Button */}
              {!showAnswer && (
                <Button
                  onClick={handleShowAnswer}
                  className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300'
                  size="lg"
                >
                  👁️ Xem câu trả lời
                </Button>
              )}

              {/* Answer (shown after clicking) */}
              {showAnswer && (
                <div className='animate-fade-in'>
                  <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-6'>
                    <div className='inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4'>
                      🇻🇳 Answer (Vietnamese)
                    </div>
                    <p className='text-xl font-semibold text-gray-800 mb-4'>
                      {currentQuestion.answer}
                    </p>

                    {/* Explanation */}
                    {currentQuestion.explanation && (
                      <div className='mt-4 pt-4 border-t-2 border-green-200'>
                        <p className='text-sm font-semibold text-green-900 mb-2'>💡 Giải thích:</p>
                        <p className='text-gray-700'>{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <Button
                      onClick={handleUnknown}
                      className='flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300'
                      size="lg"
                    >
                      <span className='mr-2'>🤔</span> Chưa biết
                    </Button>
                    <Button
                      onClick={handleKnown}
                      className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300'
                      size="lg"
                    >
                      <span className='mr-2'>✅</span> Đã biết
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className='flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 font-semibold py-6'
            size="lg"
          >
            <span className='mr-2'>←</span> Câu trước
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === qa?.questions?.length - 1}
            variant="outline"
            className='flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 font-semibold py-6'
            size="lg"
          >
            Câu tiếp <span className='ml-2'>→</span>
          </Button>
        </div>

        {/* Completion Message */}
        {currentIndex === qa?.questions?.length - 1 && knownQuestions.length === qa?.questions?.length && (
          <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 text-center mb-8 animate-bounce'>
            <div className='text-6xl mb-4'>🎉</div>
            <h2 className='text-3xl font-bold mb-2'>Xuất sắc!</h2>
            <p className='text-lg mb-4'>Bạn đã nắm vững tất cả các câu hỏi!</p>
            <Button
              onClick={resetProgress}
              className='bg-white text-green-600 hover:bg-gray-100 font-semibold'
              size="lg"
            >
              🔄 Học lại từ đầu
            </Button>
          </div>
        )}

        {/* Footer Actions */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className='flex-1 border-2 border-gray-300 hover:bg-gray-50'
            size="lg"
          >
            <span className='mr-2'>←</span> Quay về
          </Button>
          <Button
            onClick={resetProgress}
            variant="outline"
            className='flex-1 border-2 border-purple-300 text-purple-700 hover:bg-purple-50'
            size="lg"
          >
            <span className='mr-2'>🔄</span> Bắt đầu lại
          </Button>
        </div>

        {/* Quick Stats */}
        <div className='mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-purple-100'>
          <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <span>📊</span> Thống kê
          </h3>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-3xl font-bold text-purple-600'>{qa?.questions?.length || 0}</p>
              <p className='text-sm text-gray-600'>Tổng câu</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-green-600'>{knownQuestions.length}</p>
              <p className='text-sm text-gray-600'>Đã biết</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-orange-600'>
                {(qa?.questions?.length || 0) - knownQuestions.length}
              </p>
              <p className='text-sm text-gray-600'>Chưa biết</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-blue-600'>{knownProgress}%</p>
              <p className='text-sm text-gray-600'>Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ViewQA;
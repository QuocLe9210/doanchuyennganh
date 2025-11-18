"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function ViewFlashcards() {
  const { courseId } = useParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [knownCards, setKnownCards] = useState([]);

  useEffect(() => {
    GetFlashcards();
  }, []);

  const GetFlashcards = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "flashcard"
      });
      setFlashcards(result?.data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards?.flashcards?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKnown = () => {
    if (!knownCards.includes(currentIndex)) {
      setKnownCards([...knownCards, currentIndex]);
    }
    handleNext();
  };

  const handleUnknown = () => {
    handleNext();
  };

  const resetProgress = () => {
    setKnownCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4'></div>
          <p className='text-purple-600 font-medium text-lg'>Đang tải flashcards...</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards?.flashcards?.[currentIndex];
  const progress = flashcards?.flashcards?.length 
    ? Math.round(((currentIndex + 1) / flashcards.flashcards.length) * 100) 
    : 0;
  const knownProgress = flashcards?.flashcards?.length
    ? Math.round((knownCards.length / flashcards.flashcards.length) * 100)
    : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-4 border border-purple-100'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-3'>
              <span>🎴</span> Flashcards
            </h1>
            <p className='text-gray-600 mt-2 text-sm'>Lật thẻ để kiểm tra kiến thức</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-purple-100'>
            <p className='text-sm text-gray-600 mb-1'>Tiến độ</p>
            <p className='text-2xl font-bold text-purple-600'>{currentIndex + 1} / {flashcards?.flashcards?.length || 0}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100'>
            <p className='text-sm text-gray-600 mb-1'>Đã biết</p>
            <p className='text-2xl font-bold text-green-600'>{knownCards.length} thẻ</p>
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

        {/* Flashcard */}
        {currentCard && (
          <div className='perspective-1000 mb-8'>
            <div 
              className={`relative w-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={handleFlip}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side - Question */}
              <div 
                className='bg-white rounded-3xl shadow-2xl p-12 min-h-[400px] flex flex-col items-center justify-center border-4 border-purple-200 backface-hidden'
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className='text-center'>
                  <div className='inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6'>
                    Câu hỏi {currentIndex + 1}
                  </div>
                  <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                    {currentCard.front}
                  </h2>
                  <p className='text-gray-500 text-sm mt-8 flex items-center justify-center gap-2'>
                    <span>👆</span> Nhấn để xem câu trả lời
                  </p>
                </div>
              </div>

              {/* Back Side - Answer */}
              <div 
                className='absolute top-0 left-0 w-full bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-3xl shadow-2xl p-12 min-h-[400px] flex flex-col items-center justify-center border-4 border-purple-400 backface-hidden'
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className='text-center text-white'>
                  <div className='inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6'>
                    Câu trả lời
                  </div>
                  <h2 className='text-3xl font-bold mb-4'>
                    {currentCard.back}
                  </h2>
                  <p className='text-white/80 text-sm mt-8 flex items-center justify-center gap-2'>
                    <span>👆</span> Nhấn để xem lại câu hỏi
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isFlipped && (
          <div className='flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in'>
            <Button
              onClick={handleUnknown}
              className='flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300'
              size="lg"
            >
              <span className='mr-2'>❌</span> Chưa biết
            </Button>
            <Button
              onClick={handleKnown}
              className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300'
              size="lg"
            >
              <span className='mr-2'>✅</span> Đã biết
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className='flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 font-semibold py-6 transition-all duration-300'
            size="lg"
          >
            <span className='mr-2'>←</span> Thẻ trước
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcards?.flashcards?.length - 1}
            variant="outline"
            className='flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 font-semibold py-6 transition-all duration-300'
            size="lg"
          >
            Thẻ tiếp <span className='ml-2'>→</span>
          </Button>
        </div>

        {/* Completion Message */}
        {currentIndex === flashcards?.flashcards?.length - 1 && knownCards.length === flashcards?.flashcards?.length && (
          <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 text-center mb-8 animate-bounce'>
            <div className='text-6xl mb-4'>🎉</div>
            <h2 className='text-3xl font-bold mb-2'>Xuất sắc!</h2>
            <p className='text-lg mb-4'>Bạn đã nắm vững tất cả các flashcard!</p>
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
              <p className='text-3xl font-bold text-purple-600'>{flashcards?.flashcards?.length || 0}</p>
              <p className='text-sm text-gray-600'>Tổng thẻ</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-green-600'>{knownCards.length}</p>
              <p className='text-sm text-gray-600'>Đã biết</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-orange-600'>
                {(flashcards?.flashcards?.length || 0) - knownCards.length}
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
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
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

export default ViewFlashcards;
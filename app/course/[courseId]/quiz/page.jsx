"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function ViewQuiz() {
  const { courseId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    GetQuiz();
  }, []);

  const GetQuiz = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "quiz"
      });
      setQuiz(result?.data);
      setAnswers(new Array(result?.data?.questions?.length).fill(null));
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQuestion = quiz.questions[currentIndex];
    const newAnswers = [...answers];
    newAnswers[currentIndex] = option;
    setAnswers(newAnswers);

    // So sánh với correctAnswer - có thể là "C" hoặc toàn bộ text
    const isCorrect = 
      option === currentQuestion.correctAnswer || // So sánh trực tiếp
      option.startsWith(currentQuestion.correctAnswer + '.') || // "C. ..."
      option.startsWith(currentQuestion.correctAnswer + ' '); // "C ..."

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz?.questions?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(answers[currentIndex + 1]);
      setIsAnswered(answers[currentIndex + 1] !== null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[currentIndex - 1]);
      setIsAnswered(answers[currentIndex - 1] !== null);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setAnswers(new Array(quiz?.questions?.length).fill(null));
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4'></div>
          <p className='text-purple-600 font-medium text-lg'>Đang tải quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz?.questions?.[currentIndex];
  const progress = quiz?.questions?.length 
    ? Math.round(((currentIndex + 1) / quiz.questions.length) * 100) 
    : 0;
  const totalAnswered = answers.filter(a => a !== null).length;
  const isQuizComplete = totalAnswered === quiz?.questions?.length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-4 border border-purple-100'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-3'>
              <span>📝</span> Quiz Test
            </h1>
            <p className='text-gray-600 mt-2 text-sm'>Kiểm tra kiến thức của bạn</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-purple-100'>
            <p className='text-sm text-gray-600 mb-1'>Câu hỏi</p>
            <p className='text-2xl font-bold text-purple-600'>{currentIndex + 1} / {quiz?.questions?.length || 0}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100'>
            <p className='text-sm text-gray-600 mb-1'>Điểm số</p>
            <p className='text-2xl font-bold text-green-600'>{score}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-blue-100'>
            <p className='text-sm text-gray-600 mb-1'>Đã trả lời</p>
            <p className='text-2xl font-bold text-blue-600'>{totalAnswered}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-orange-100'>
            <p className='text-sm text-gray-600 mb-1'>Tiến độ</p>
            <p className='text-2xl font-bold text-orange-600'>{progress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 border border-purple-100'>
          <div className='flex items-center gap-4 mb-2'>
            <span className='text-sm font-medium text-gray-600'>Tiến độ làm bài</span>
            <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
              <div 
                className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500'
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className='text-sm font-bold text-purple-600'>{progress}%</span>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className='bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-8 border-2 border-purple-200'>
            {/* Chapter Badge */}
            {currentQuestion.chapterId && (
              <div className='inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6'>
                📚 {currentQuestion.chapterId}
              </div>
            )}

            {/* Question */}
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8'>
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className='space-y-4'>
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                
                // Kiểm tra đáp án đúng - có thể là "C" hoặc "C. ..."
                const isCorrect = 
                  option === currentQuestion.correctAnswer ||
                  option.startsWith(currentQuestion.correctAnswer + '.') ||
                  option.startsWith(currentQuestion.correctAnswer + ' ');
                
                const showResult = isAnswered;

                let buttonClass = 'w-full text-left p-5 rounded-xl border-2 transition-all duration-300 font-medium';
                
                if (!showResult) {
                  buttonClass += ' border-gray-300 hover:border-purple-400 hover:bg-purple-50';
                } else {
                  if (isCorrect) {
                    buttonClass += ' border-green-500 bg-green-50 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' border-red-500 bg-red-50 text-red-800';
                  } else {
                    buttonClass += ' border-gray-300 bg-gray-50';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <div className='flex items-center gap-4'>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showResult && isCorrect 
                          ? 'bg-green-500 text-white' 
                          : showResult && isSelected && !isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-purple-200 text-purple-700'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className='flex-1'>{option}</span>
                      {showResult && isCorrect && <span className='text-2xl'>✓</span>}
                      {showResult && isSelected && !isCorrect && <span className='text-2xl'>✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && currentQuestion.explanation && (
              <div className='mt-6 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg'>
                <p className='font-semibold text-blue-900 mb-2'>💡 Giải thích:</p>
                <p className='text-blue-800'>{currentQuestion.explanation}</p>
              </div>
            )}
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
            disabled={currentIndex === quiz?.questions?.length - 1}
            variant="outline"
            className='flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 font-semibold py-6'
            size="lg"
          >
            Câu tiếp <span className='ml-2'>→</span>
          </Button>
        </div>

        {/* Completion Message */}
        {isQuizComplete && (
          <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 text-center mb-8'>
            <div className='text-6xl mb-4'>🎉</div>
            <h2 className='text-3xl font-bold mb-2'>Hoàn thành!</h2>
            <p className='text-lg mb-2'>
              Điểm số của bạn: <span className='text-4xl font-bold'>{score}/{quiz?.questions?.length}</span>
            </p>
            <p className='text-lg mb-4'>
              Tỷ lệ đúng: {Math.round((score / quiz?.questions?.length) * 100)}%
            </p>
            <Button
              onClick={resetQuiz}
              className='bg-white text-green-600 hover:bg-gray-100 font-semibold'
              size="lg"
            >
              🔄 Làm lại quiz
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
            onClick={resetQuiz}
            variant="outline"
            className='flex-1 border-2 border-purple-300 text-purple-700 hover:bg-purple-50'
            size="lg"
          >
            <span className='mr-2'>🔄</span> Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewQuiz;
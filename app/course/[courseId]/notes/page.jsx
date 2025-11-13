"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

function ViewNotes() {
  const { courseId } = useParams();
  const router = useRouter();
  const [notes, setNotes] = useState();
  const [stepCount, setStepCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepChange = (newStep) => {
    setStepCount(newStep);
    // Đảm bảo cuộn lên đầu trang sau khi state đã update
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes"
      });
      setNotes(result?.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4'></div>
          <p className='text-purple-600 font-medium text-lg'>Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Back Button */}
        <div className='mb-6'>
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className='bg-white hover:bg-purple-50 border-2 border-purple-200 text-purple-700 font-medium transition-all duration-300 hover:shadow-lg hover:border-purple-400 group'
          >
            <span className='mr-2 group-hover:-translate-x-1 transition-transform duration-300'>←</span>
            Quay về danh sách khóa học
          </Button>
        </div>

        {/* Elegant Header Card */}
        <div className='mb-8 text-center'>
          <div className='inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-4 border border-purple-100'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent'>
              Ghi Chú Học Tập
            </h1>
            <p className='text-gray-600 mt-2 text-sm'>Nắm vững kiến thức từng chương</p>
          </div>
        </div>

        {/* Enhanced Progress Card */}
        <div className='bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-purple-100/50 hover:shadow-2xl transition-all duration-300'>
          
          {/* Progress Info */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg'>
                {stepCount + 1}
              </div>
              <div>
                <p className='text-sm text-gray-500 font-medium'>Tiến độ học tập</p>
                <p className='text-lg font-bold text-gray-800'>
                  Chương {stepCount + 1} / {notes?.notes?.length || 0}
                </p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-500'>Hoàn thành</p>
              <p className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                {notes?.notes?.length ? Math.round(((stepCount + 1) / notes.notes.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className='relative mb-6'>
            <div className='flex gap-2'>
              {notes?.notes?.map((item, index) => (
                <div 
                  key={index} 
                  className='relative flex-1 group'
                  onClick={() => handleStepChange(index)}
                >
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 cursor-pointer
                      ${index < stepCount ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-md' : 
                        index === stepCount ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-lg scale-105' : 
                        'bg-gray-200 hover:bg-gray-300'}`}
                  />
                  <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                    <div className='bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl'>
                      Chương {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className='flex gap-3 items-center justify-between'>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleStepChange(stepCount - 1)}
              disabled={stepCount === 0}
              className='flex-1 sm:flex-none hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed border-purple-200 text-purple-700 font-medium transition-all duration-200 hover:border-purple-400 hover:shadow-md'
            >
              <span className='mr-2'>←</span> Quay lại
            </Button>
            
            <div className='hidden sm:block text-center px-4'>
              <div className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full'>
                <div className='w-2 h-2 rounded-full bg-purple-500 animate-pulse'></div>
                <span className='text-sm font-semibold text-purple-700'>
                  {notes?.notes?.[stepCount]?.chapterId || 'Đang tải...'}
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleStepChange(stepCount + 1)}
              disabled={stepCount === notes?.notes?.length - 1}
              className='flex-1 sm:flex-none hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed border-purple-200 text-purple-700 font-medium transition-all duration-200 hover:border-purple-400 hover:shadow-md'
            >
              Tiếp theo <span className='ml-2'>→</span>
            </Button>
          </div>
        </div>

        {/* Beautiful Content Card */}
        <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100/50 overflow-hidden transform transition-all duration-300 hover:shadow-purple-200/50'>
          {notes?.notes?.[stepCount] && (
            <div>
              {/* Gradient Header */}
              <div className='relative bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 p-10 sm:p-12 text-white overflow-hidden'>
                <div className='absolute inset-0 bg-black/10'></div>
                <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl transform -translate-x-48 translate-y-48'></div>
                
                <div className='relative z-10'>
                  <div className='inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4'>
                    📚 Chương {stepCount + 1}
                  </div>
                  <h1 className='text-4xl sm:text-5xl font-bold leading-tight drop-shadow-lg'>
                    {notes.notes[stepCount].chapterId}
                  </h1>
                </div>
              </div>

              {/* Rich Content */}
              <div className='p-8 sm:p-12 lg:p-16 bg-gradient-to-b from-white to-purple-50/30'>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({node, ...props}) => (
                      <h1 className='text-4xl font-bold text-gray-900 mt-12 mb-6 pb-4 border-b-4 border-gradient-to-r from-purple-500 to-pink-500' {...props} />
                    ),
                    h2: ({node, ...props}) => (
                      <h2 className='text-3xl font-bold text-gray-800 mt-10 mb-5 pb-3 border-b-2 border-purple-300 flex items-center gap-3' {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className='text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-8 mb-4' {...props} />
                    ),
                    h4: ({node, ...props}) => (
                      <h4 className='text-xl font-semibold text-gray-700 mt-6 mb-3 flex items-center gap-2' {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className='text-gray-700 leading-loose text-lg mb-5' {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className='space-y-3 my-6 ml-6' {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className='space-y-3 my-6 ml-6' {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className='text-gray-700 leading-loose text-lg relative pl-2 before:content-[""] before:absolute before:left-[-20px] before:top-[12px] before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-r before:from-purple-500 before:to-pink-500' {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className='font-bold text-gray-900 bg-gradient-to-r from-yellow-200 to-yellow-300 px-1.5 py-0.5 rounded shadow-sm' {...props} />
                    ),
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code className='bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md font-mono text-sm font-semibold border border-purple-200' {...props} />
                      ) : (
                        <code className='block bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-6 rounded-2xl font-mono text-sm overflow-x-auto my-6 border border-gray-200 shadow-inner' {...props} />
                      ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className='border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 py-4 px-6 italic my-6 rounded-r-xl shadow-sm' {...props} />
                    ),
                    hr: ({node, ...props}) => (
                      <hr className='border-0 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent my-10' {...props} />
                    ),
                    a: ({node, ...props}) => (
                      <a className='text-purple-600 hover:text-pink-600 underline decoration-2 underline-offset-2 transition-colors duration-200 font-medium' {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className='overflow-x-auto my-8 rounded-xl shadow-lg border border-gray-200'>
                        <table className='min-w-full border-collapse' {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => (
                      <th className='border-b-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-4 text-left font-bold text-purple-900' {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className='border-b border-gray-200 px-6 py-4 text-gray-700' {...props} />
                    ),
                  }}
                >
                  {notes.notes[stepCount].note}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation with Animation */}
        <div className='flex flex-col sm:flex-row justify-between mt-10 gap-4'>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              if (stepCount > 0) {
                handleStepChange(stepCount - 1);
              }
            }}
            disabled={stepCount === 0}
            className='flex-1 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-200 text-purple-700 font-semibold text-base transition-all duration-300 hover:shadow-lg hover:border-purple-400 group h-14'
          >
            <span className='mr-3 group-hover:-translate-x-1 transition-transform duration-300'>←</span> 
            Chương trước
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              if (stepCount < notes?.notes?.length - 1) {
                handleStepChange(stepCount + 1);
              }
            }}
            disabled={stepCount === notes?.notes?.length - 1}
            className='flex-1 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-200 text-purple-700 font-semibold text-base transition-all duration-300 hover:shadow-lg hover:border-purple-400 group h-14'
          >
            Chương tiếp theo 
            <span className='ml-3 group-hover:translate-x-1 transition-transform duration-300'>→</span>
          </Button>
        </div>

        {/* Completion Badge */}
        {stepCount === notes?.notes?.length - 1 && (
          <div className='mt-8 text-center animate-bounce'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg'>
              <span className='text-2xl'>🎉</span>
              <span className='font-bold'>Bạn đã học xong chương cuối!</span>
            </div>
          </div>
        )}

        {/* Back to Course List Button */}
        <div className='mt-12 text-center pb-8'>
          <Button 
            onClick={() => router.back()}
            size="lg"
            className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group px-8'
          >
            <span className='mr-2 group-hover:-translate-x-1 transition-transform duration-300'>←</span>
            Quay về danh sách khóa học
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewNotes;
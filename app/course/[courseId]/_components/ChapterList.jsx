import React from 'react'

function ChapterList({course}) {

    const CHAPTERS = course?.courseLayout?.chapters;
  return (
    <div className='mt-5'> 
        <h2 className='font-medium text-xl'>Chapters</h2>
        <div className='mt-4 space-y-3'>
            {CHAPTERS?.map((chapter, index) => (
                <div key={index} className='border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                        Chương {chapter?.chapterNumber}
                    </h2>
                    <div className='mt-2'>
                        <h2 className='text-gray-600 font-medium'>{chapter?.chapterName}</h2>
                        <p className='text-gray-500 text-sm'>{chapter?.objective}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ChapterList
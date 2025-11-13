import React, { useState, useEffect } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link';

function StudyMaterialSection({ courseId }) {
  const [studyTypeContent, setStudyTypeContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const MaterialList = [
    {
      name: "Notes/Chapter",
      desc: "Tài liệu học tập",
      icon: "/notes.png",
      path: "/notes",
      type: "notes"
    },
    {
      name: "Flashcards",
      desc: "Bộ thẻ học",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcards"
    },
    {
      name: "Quiz",
      desc: "Bài kiểm tra nhanh",
      icon: "/quiz.png",
      path: "/quiz",
      type: "quiz"
    },
    {
      name: "Questions/Answers",
      desc: "Hỏi đáp",
      icon: "/qa.png",
      path: "/qa",
      type: "qa"
    }
  ];

  useEffect(() => {
    if (courseId) {
      GetStudyMaterial();
    }
  }, [courseId]);

  const GetStudyMaterial = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: "ALL",
      });
      console.log('📚 Study materials:', result?.data);
      setStudyTypeContent(result.data);
    } catch (error) {
      console.error('❌ Error fetching study materials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-5'>
      <h2 className='font-medium text-xl'>
        Tài liệu học tập
      </h2>

      {loading ? (
        <div className='text-center py-10 text-gray-500'>Đang tải...</div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-5'>
          {MaterialList.map((item, index) => (
            <Link key={index} href={`/course/${courseId}${item.path}`} className='block'>
              <MaterialCardItem 
                item={item}
                studyTypeContent={studyTypeContent}
                refreshData={GetStudyMaterial}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyMaterialSection;

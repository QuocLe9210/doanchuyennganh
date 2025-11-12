import { icons } from 'lucide-react'
import React from 'react'
import MaterialCardItem from './MaterialCardItem'

function StudyMaterialSection() {
    const MaterialList = [
        { name: "Notes/Chapter",
          desc: "Tài liệu học tập",
          icon: "/notes.png",
          path: "/notes",
        },
        { name: "Flashcards",
          desc: "Bộ thẻ học",
          icon: "/flashcard.png",
          path: "/flashcards",
        },
        { name: "Quiz",
          desc: "Bài kiểm tra nhanh",
          icon: "/quiz.png",
          path: "/quiz",

        },
        { name: "Questions/Answers",
          desc: "Hỏi đáp",
          icon: "/qa.png",
          path: "/qa",
        }
       
    ] 
  return (
    <div className='mt-5'>
      <h2 className='font-medium text-xl'>
        Tài liệu học tập
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-5  '>
        {MaterialList.map((item, index) => (
          <MaterialCardItem key={index} item={item}/>
        ))}
      </div>
    </div>
    
  )
}

export default StudyMaterialSection
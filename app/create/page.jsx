"use client";

import React, { useState } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";

function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    studyType: "",
    topic: "",
    difficultyLevel: ""
  });

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
    console.log(fieldName, ":", fieldValue);
  };

  const handleCreate = () => {
    console.log("Final Form Data:", formData);
    // TODO: Call API to create course
  };

  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
      <h2 className="font-bold text-4xl text-purple-600">
        Bắt đầu khóa học Tiếng Anh cùng AI
      </h2>
      <p className="text-gray-600 text-lg mt-3 text-center">
        Tạo khóa học của bạn một cách nhanh chóng và dễ dàng với sự hỗ trợ của
        AI. Chỉ cần cung cấp chủ đề và một số chi tiết cơ bản, và để AI lo phần
        còn lại.
      </p>

      <div className="mt-10 w-full">
        {step === 0 ? (
          <SelectOption
            selectedStudyType={(value) => handleUserInput("studyType", value)}
          />
        ) : (
          <TopicInput
            setTopic={(value) => handleUserInput("topic", value)}
            setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
          />
        )}
      </div>

      <div className="flex justify-between w-full mt-32">
        {step !== 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Quay lại
          </Button>
        ) : (
          <div></div>
        )}
        
        {step === 0 ? (
          <Button 
            onClick={() => setStep(step + 1)}
            disabled={!formData.studyType}
          >
            Tiếp tục
          </Button>
        ) : (
          <Button 
            onClick={handleCreate}
            disabled={!formData.topic || !formData.difficultyLevel}
          >
            Tạo khóa học
          </Button>
        )}
      </div>
    </div>
  );
}

export default Create;
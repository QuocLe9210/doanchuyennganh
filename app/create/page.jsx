"use client";

import React from "react";
import SelectOption from "./_components/SelectOption";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function Create() {
  const [step, setStep] = useState(0);
  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
      <h2 className="font-bold text-4xl text-purple-600">
        Bắt đầu khóa học Tiếng Anh cùng AI{" "}
      </h2>
      <p className=" text-gray-600 text-lg">
        Tạo khóa học của bạn một cách nhanh chóng và dễ dàng với sự hỗ trợ của
        AI. Chỉ cần cung cấp chủ đề và một số chi tiết cơ bản, và để AI lo phần
        còn lại.
      </p>
      <div className="mt-10">{step == 0 ? <SelectOption /> : null}</div>

        <div className="flex justify-between w-full mt-32">
            {step != 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
                Quay lại
            </Button>
            ) : (
            " - "
            )}
            {step == 0 ? (
            <Button onClick={() => setStep(step + 1)}>Tiếp tục</Button>
            ) : (
            <Button>Tiếp tục</Button>
            )}
        </div>
    </div>
  );
}

export default Create;

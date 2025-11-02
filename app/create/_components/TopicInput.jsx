import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TopicInput({ setTopic, setDifficultyLevel }) {
  return (
    <div className="mt-10 w-full flex flex-col">
      <h2>Nhập lựa chọn mong muốn để có thể khởi tạo khóa học</h2>
      <Textarea 
        placeholder="Nhập nội dung ở đây" 
        className="mt-2 w-full" 
        onChange={(event) => setTopic(event.target.value)} 
      />
      <h2 className="mt-5 mb-3">Nhập mức độ cho khóa học</h2>

      <Select onValueChange={(value) => setDifficultyLevel(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Mức độ của khóa học" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="de">Dễ</SelectItem>
          <SelectItem value="binhthuong">Bình Thường</SelectItem>
          <SelectItem value="kho">Khó</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopicInput;
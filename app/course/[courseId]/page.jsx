"use client"

import { useParams } from 'next/navigation';
import React from 'react';

function Course() {
    const { courseId } = useParams();
    
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Chi tiết khóa học</h1>
            <p className="mt-4">Course ID: {courseId}</p>
        </div>
    );
}

export default Course;
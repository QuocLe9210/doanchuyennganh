"use client"
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
    const {user} = useUser();
    
    return (
        <div className='relative overflow-hidden p-8 bg-gradient-to-br bg-purple-600 to-white-500-600 w-full text-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300'>
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
            
            {/* Floating orbs - modern abstract background */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-purple-300/10 blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            
            {/* Content */}
            <div className="relative flex items-start gap-6">
                {/* Image - clean modern style */}
                <div className="shrink-0 group">
                    <div className="relative rounded-2xl bg-white/15 backdrop-blur-md p-3 border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20">
                        <Image 
                            src={"/Ảnh.png"} 
                            alt='Ảnh' 
                            width={100} 
                            height={100}
                            className="rounded-xl"
                        />
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-2 border-white shadow-md"></div>
                    </div>
                </div>
                
                {/* Text content - natural hierarchy */}
                <div className="flex-1 space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Xin chào, {user?.fullName || 'Bạn'}
                        </h2>
                        <span className="text-2xl animate-bounce" style={{animationDuration: '2s'}}>👋</span>
                    </div>
                    <p className="text-white/90 text-base leading-relaxed">
                        Xin chào bạn đã trở lại khóa học với chúng tôi
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WelcomeBanner
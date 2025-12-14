import React from 'react';
import { StoryChapter } from '../types';

export const StoryReader: React.FC<StoryReaderProps> = ({ chapters }) => {
  return (
    <div className="flex flex-col gap-8">
      {chapters.map((chapter, index) => (
        <article 
          key={chapter.id} 
          className="relative bg-zinc-950/50 border border-zinc-800/50 p-6 rounded"
        >
          {/* System Logs */}
          <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
            <span className="text-[10px] font-mono text-red-900">
               LOG_ID: {chapter.id.split('-')[0]}
            </span>
            <span className="text-[10px] font-mono text-zinc-600">
               TIMESTAMP: {chapter.timestamp}
            </span>
          </div>

          {/* Raw Content */}
          <div className="font-sans text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {chapter.content}
          </div>

          {/* End Log Marker */}
          <div className="mt-6 flex items-center gap-2 opacity-20">
             <div className="h-1 w-1 bg-red-500 rounded-full"></div>
             <div className="h-px bg-red-900 flex-1"></div>
          </div>
        </article>
      ))}
    </div>
  );
};

import { StoryReaderProps } from '../types'; 

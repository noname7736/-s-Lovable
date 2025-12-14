import React from 'react';
import { ControlPanelProps } from '../types';
import { Cpu, Network, Lock, Server } from 'lucide-react';

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isGenerating
}) => {
  return (
    <div className="bg-zinc-950 border-t border-zinc-900 p-3 w-full backdrop-blur-md bg-opacity-90">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
      
        <div className="flex items-center gap-6 md:gap-12">
          {/* Core Status */}
          <div className="flex flex-col gap-1">
             <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.2em]">NEURAL_ENGINE</span>
             <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
                <Cpu className={`w-3.5 h-3.5 ${isGenerating ? 'text-red-500 animate-spin-slow' : 'text-zinc-700'}`} />
                <span className={isGenerating ? 'text-zinc-200' : ''}>
                  {isGenerating ? 'PROCESSING_DATA' : 'IDLE_MODE'}
                </span>
             </div>
          </div>

          <div className="w-px h-6 bg-zinc-900"></div>

          {/* Network Status */}
          <div className="flex flex-col gap-1">
             <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.2em]">UPLINK</span>
             <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
                <Network className={`w-3.5 h-3.5 ${isGenerating ? 'text-blue-500 animate-pulse' : 'text-zinc-700'}`} />
                <span>BROADCAST_ACTIVE</span>
             </div>
          </div>
          
           <div className="w-px h-6 bg-zinc-900 hidden md:block"></div>

           {/* Security Status */}
           <div className="flex flex-col gap-1 hidden md:flex">
             <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.2em]">SECURITY</span>
             <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
                <Lock className="w-3.5 h-3.5 text-green-700" />
                <span>ENCRYPTED_CHANNEL</span>
             </div>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-3 bg-red-950/20 px-3 py-1.5 rounded border border-red-900/30">
           <div className="relative">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 rounded-full animate-ping opacity-50"></div>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-[9px] text-red-500 font-bold tracking-widest leading-none">LIVE</span>
             <span className="text-[7px] text-red-900 leading-none mt-0.5">FEED</span>
           </div>
        </div>

      </div>
    </div>
  );
};
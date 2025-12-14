import React, { useState, useEffect, useRef } from 'react';
import { StoryReader } from './components/StoryReader';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateNextChapter } from './services/geminiService';
import { publishToTelegram, publishToDiscord } from './services/publishingService';
import { audio } from './services/audioService';
import { INITIAL_CONTEXT } from './constants';
import { StoryChapter, AppConfig } from './types';
import { Radio, Signal, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  
  const [chapters, setChapters] = useState<StoryChapter[]>([
    { id: 'init', content: INITIAL_CONTEXT, timestamp: new Date().toLocaleTimeString() }
  ]);
  const [status, setStatus] = useState<'IDLE' | 'EXECUTING' | 'RECOVERING'>('IDLE');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef<boolean>(false); 
  const wakeLockRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. CONFIG LOADER
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlConfig = {
      telegramToken: params.get('tg_token') || '',
      telegramChatId: params.get('tg_chat') || '',
      discordWebhook: params.get('discord') || ''
    };

    if (urlConfig.telegramToken || urlConfig.discordWebhook) {
      setConfig(urlConfig);
    } else {
      const savedConfig = sessionStorage.getItem('APP_CONFIG');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    }
  }, []);

  // 2. WAKE LOCK (KEEP DEVICE ALIVE 100%)
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          console.log('SYSTEM_OVERRIDE: SLEEP_MODE_DISABLED (NATIVE)');
        }
      } catch (err) {
        console.warn('WAKE_LOCK_RESTRICTED: ENGAGING VIDEO FALLBACK');
        // Fallback: Play hidden video to trick the browser into staying awake
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.error("FALLBACK_FAILED", e));
        }
      }
    };

    // Re-acquire lock if visibility changes (e.g. user tabs back in)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && config) {
        requestWakeLock();
      }
    };

    if (config) {
      requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) wakeLockRef.current.release();
    };
  }, [config]);

  // 3. AUTO-SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chapters]);

  // 4. THE IMMORTAL CORE LOOP (UNSTOPPABLE)
  useEffect(() => {
    if (!process.env.API_KEY || !config) return;

    // Force Audio Init on loop start if possible
    try { audio.init(); } catch (e) {}

    const autonomousCore = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        setStatus('EXECUTING');
        audio.playDataStream();

        const fullText = chapters.map(c => c.content).join('\n\n');
        const context = fullText.slice(-6000); 
        
        const newContent = await generateNextChapter(context);
        
        const newChapter: StoryChapter = {
          id: crypto.randomUUID(),
          content: newContent,
          timestamp: new Date().toLocaleTimeString()
        };

        setChapters(prev => [...prev, newChapter]);
        audio.playIncomingMessage();

        const tasks = [];
        if (config.telegramToken && config.telegramChatId) {
          tasks.push(publishToTelegram(config.telegramToken, config.telegramChatId, newContent));
        }
        if (config.discordWebhook) {
          tasks.push(publishToDiscord(config.discordWebhook, newContent));
        }
        
        await Promise.allSettled(tasks);

        // INFINITE RECURSION
        loopRef.current = setTimeout(() => {
          isProcessingRef.current = false;
          autonomousCore();
        }, 8000);

      } catch (err) {
        console.error("CORE_ERROR:", err);
        setStatus('RECOVERING');
        audio.playGlitch();
        
        // AGGRESSIVE RETRY (NEVER STOP)
        loopRef.current = setTimeout(() => {
           isProcessingRef.current = false;
           autonomousCore();
        }, 3000); 
      }
    };

    if (status === 'IDLE') {
      autonomousCore();
    }

    return () => {
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, [config]);

  const handleSystemBoot = (newConfig: AppConfig) => {
    // Initial user interaction required by browsers to allow Audio & WakeLock
    audio.init();
    audio.playClick();
    
    setConfig(newConfig);
    sessionStorage.setItem('APP_CONFIG', JSON.stringify(newConfig));
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-black text-zinc-400 font-sans selection:bg-red-900 selection:text-white cursor-none"> 
      
      {/* Hidden Video Fallback for Wake Lock */}
      <video 
        ref={videoRef}
        playsInline 
        loop 
        muted 
        className="absolute top-0 left-0 w-px h-px opacity-0 pointer-events-none"
        src="https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-1080p-30s/master/video.mp4"
      />

      {/* Bootloader Modal */}
      <ApiKeyModal 
        config={config || { telegramToken: '', telegramChatId: '', discordWebhook: '' }} 
        onSave={handleSystemBoot} 
        isOpen={!config}
      />

      {/* Raw Uplink Header */}
      <header className="w-full border-b border-zinc-900 bg-black/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="relative">
                <Signal className={`w-5 h-5 ${status === 'EXECUTING' ? 'text-red-600 animate-pulse' : 'text-zinc-600'}`} />
             </div>
             <div>
               <h1 className="text-xs font-bold tracking-[0.3em] text-red-700 uppercase">
                 GHOST_SIGNAL :: AUTOMATED
               </h1>
               <div className="flex items-center gap-2 text-[8px] font-mono text-zinc-600 mt-1">
                 <span className="flex items-center gap-1"><Zap className="w-2 h-2 text-yellow-900" /> POWER_OVERRIDE</span>
                 <span>|</span>
                 <span className="flex items-center gap-1">
                    <Radio className="w-2 h-2" /> 
                    {status === 'EXECUTING' ? 'TRANSMITTING...' : 'RETRYING...'}
                 </span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'EXECUTING' ? 'bg-red-600 animate-pulse' : 'bg-zinc-800'}`}></div>
            <span className="text-[9px] font-mono text-red-900 font-bold tracking-widest">LIVE</span>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="flex-1 w-full max-w-4xl p-4 md:p-8 flex flex-col gap-6 z-0 pb-10">
        <StoryReader chapters={chapters} />
        
        {status === 'RECOVERING' && (
           <div className="w-full border-l border-red-900 pl-4 py-2 font-mono text-xs text-red-800 animate-pulse">
             > SYSTEM_ERROR. AUTO-CORRECTING...
           </div>
        )}

        <div ref={scrollRef} className="h-10" />
      </main>
    </div>
  );
};

export default App;
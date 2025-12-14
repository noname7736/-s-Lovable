import React, { useState, useEffect, useRef } from 'react';
import { StoryReader } from './components/StoryReader';
import { ControlPanel } from './components/ControlPanel';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateNextChapter } from './services/geminiService';
import { publishToTelegram, publishToDiscord } from './services/publishingService';
import { INITIAL_CONTEXT } from './constants';
import { StoryChapter, AppConfig } from './types';
import { Skull, Radio, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  
  const [chapters, setChapters] = useState<StoryChapter[]>([
    { id: 'init', content: INITIAL_CONTEXT, timestamp: new Date().toLocaleTimeString() }
  ]);
  const [status, setStatus] = useState<'IDLE' | 'EXECUTING' | 'RECOVERING'>('IDLE');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef<boolean>(false); // Mutex lock for loop safety

  // 1. CONFIG LOADER (SECURE)
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

  // 2. AUTO-SCROLL ENGINE
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chapters]);

  // 3. THE IMMORTAL CORE LOOP (100% Autonomous)
  useEffect(() => {
    // Only start if we have config AND key
    if (!process.env.API_KEY || !config) return;

    const autonomousCore = async () => {
      // PREVENT OVERLAP
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        setStatus('EXECUTING');

        // A. CONTEXT COMPRESSION (Optimize for Token Limits)
        const fullText = chapters.map(c => c.content).join('\n\n');
        // Keep last 5000 chars for deep context but fast processing
        const context = fullText.slice(-5000); 
        
        // B. GENERATION
        const newContent = await generateNextChapter(context);
        
        const newChapter: StoryChapter = {
          id: crypto.randomUUID(),
          content: newContent,
          timestamp: new Date().toLocaleTimeString()
        };

        setChapters(prev => [...prev, newChapter]);

        // C. BROADCAST (Parallel Execution)
        const tasks = [];
        if (config.telegramToken && config.telegramChatId) {
          tasks.push(publishToTelegram(config.telegramToken, config.telegramChatId, newContent));
        }
        if (config.discordWebhook) {
          tasks.push(publishToDiscord(config.discordWebhook, newContent));
        }
        
        // Wait for broadcast to ensure order, but don't fail loop if broadcast fails
        await Promise.allSettled(tasks);

        // D. RECYCLE (Fast pace: 8 seconds)
        loopRef.current = setTimeout(() => {
          isProcessingRef.current = false;
          autonomousCore();
        }, 8000);

      } catch (err) {
        console.error("CORE_DUMP:", err);
        setStatus('RECOVERING');
        
        // E. SELF-HEALING (Retry quickly on failure)
        loopRef.current = setTimeout(() => {
           isProcessingRef.current = false;
           autonomousCore();
        }, 5000); 
      }
    };

    // Ignition
    if (status === 'IDLE') {
      autonomousCore();
    }

    // Kill switch (Cleanup)
    return () => {
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleConfigSave = (newConfig: AppConfig) => {
    setConfig(newConfig);
    sessionStorage.setItem('APP_CONFIG', JSON.stringify(newConfig));
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-black text-zinc-400 font-sans selection:bg-red-900 selection:text-white">
      
      {/* 100% Secure Modal */}
      <ApiKeyModal 
        config={config || { telegramToken: '', telegramChatId: '', discordWebhook: '' }} 
        onSave={handleConfigSave} 
        isOpen={!config}
      />

      {/* Autonomous HUD */}
      <header className="w-full border-b border-zinc-900 bg-black/95 backdrop-blur sticky top-0 z-10 shadow-2xl shadow-black">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Skull className={`w-8 h-8 ${status === 'RECOVERING' ? 'text-red-600 animate-pulse' : 'text-zinc-100'}`} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
             </div>
             <div>
               <h1 className="text-base font-bold tracking-[0.3em] text-zinc-100 uppercase flex items-center gap-2">
                 GHOST_WRITER <span className="text-[10px] bg-red-900/50 px-1 border border-red-800 text-red-200 rounded">V2.0_AUTO</span>
               </h1>
               <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 mt-1">
                 <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-700" /> CORE_ACTIVE</span>
                 <span className="flex items-center gap-1"><Radio className="w-3 h-3 text-blue-700" /> UPLINK_STABLE</span>
               </div>
             </div>
          </div>
          
          {/* Pulse Indicator */}
          <div className="hidden md:flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
            <div className={`w-2 h-2 rounded-full ${status === 'EXECUTING' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
              {status === 'EXECUTING' ? 'GENERATING_NARRATIVE' : 'SYSTEM_RECOVERING'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="flex-1 w-full max-w-4xl p-4 md:p-8 flex flex-col gap-6 z-0 pb-32">
        <StoryReader chapters={chapters} />
        
        {status === 'RECOVERING' && (
           <div className="w-full border-l-2 border-red-600 bg-red-950/10 p-4 font-mono text-xs text-red-400 animate-pulse">
             >> CONNECTION_RESET. ATTEMPTING RECONNECT...
           </div>
        )}

        <div ref={scrollRef} className="h-10" />
      </main>

      {/* Footer System Monitor */}
      <footer className="w-full fixed bottom-0 z-20 bg-black/90 backdrop-blur border-t border-zinc-900">
        <ControlPanel 
          isGenerating={status === 'EXECUTING'} 
          hasApiKey={true}
        />
      </footer>
    </div>
  );
};

export default App;
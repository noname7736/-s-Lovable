import React, { useState } from 'react';
import { SettingsModalProps, AppConfig } from '../types';
import { Power } from 'lucide-react';

export const ApiKeyModal: React.FC<SettingsModalProps> = ({ config, onSave, isOpen }) => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);

  if (!isOpen) return null;

  const handleBoot = () => {
    // This function acts as the "Ignition Key". 
    // It is the ONLY human interaction allowed. 
    // Once pressed, the system runs forever.
    onSave(localConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer" onClick={handleBoot}>
      <div className="w-full max-w-lg p-12 text-center relative border border-zinc-900 bg-black/90">
        
        {/* Pulsing Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <Power className="w-16 h-16 text-red-700 animate-pulse" />
          
          <div>
            <h1 className="text-2xl font-bold tracking-[0.5em] text-zinc-100 uppercase mb-2">
              SYSTEM_OFFLINE
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
              > CLICK ANYWHERE TO INITIALIZE PROTOCOL<br/>
              > WARNING: PROCESS CANNOT BE ABORTED ONCE STARTED
            </p>
          </div>

          <div className="hidden">
             {/* Hidden inputs to preserve state if needed, but UI is removed for immersion */}
             <input value={localConfig.telegramToken} readOnly />
             <input value={localConfig.discordWebhook} readOnly />
          </div>
        </div>
        
        <div className="absolute bottom-4 left-0 w-full text-center">
             <span className="text-[8px] text-zinc-800 uppercase tracking-[0.2em]">WAITING_FOR_IGNITION...</span>
        </div>
      </div>
    </div>
  );
};
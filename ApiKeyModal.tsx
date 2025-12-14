import React, { useState } from 'react';
import { SettingsModalProps, AppConfig } from '../types';
import { Terminal, Send, Disc, ShieldAlert } from 'lucide-react';

export const ApiKeyModal: React.FC<SettingsModalProps> = ({ config, onSave, isOpen }) => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-2xl p-8 font-mono">
        
        <div className="mb-12 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Terminal className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-widest uppercase">TERMINAL_ACCESS_REQ</h2>
          </div>
          <p className="text-zinc-500 text-xs">
            > SYSTEM_LOCKED. PLEASE AUTHENTICATE BROADCAST CHANNELS.<br/>
            > ENTER CREDENTIALS TO INITIATE AUTONOMOUS PROTOCOL.<br/>
            > PRESS [ENTER] TO EXECUTE.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Telegram Section */}
            <div className="group">
               <label className="text-[10px] text-zinc-600 uppercase mb-1 block group-focus-within:text-red-500 transition-colors">
                  > TARGET_1: TELEGRAM_TOKEN
               </label>
               <input
                  type="text"
                  value={localConfig.telegramToken}
                  onChange={(e) => setLocalConfig({...localConfig, telegramToken: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-800 py-2 text-zinc-300 focus:border-red-600 focus:outline-none transition-colors font-mono text-sm placeholder-zinc-900"
                  placeholder="..."
                  autoComplete="off"
                />
            </div>

            <div className="group">
               <label className="text-[10px] text-zinc-600 uppercase mb-1 block group-focus-within:text-red-500 transition-colors">
                  > TARGET_2: CHAT_ID
               </label>
               <input
                  type="text"
                  value={localConfig.telegramChatId}
                  onChange={(e) => setLocalConfig({...localConfig, telegramChatId: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-800 py-2 text-zinc-300 focus:border-red-600 focus:outline-none transition-colors font-mono text-sm placeholder-zinc-900"
                  placeholder="@..."
                  autoComplete="off"
                />
            </div>

            {/* Discord Section */}
            <div className="group">
               <label className="text-[10px] text-zinc-600 uppercase mb-1 block group-focus-within:text-red-500 transition-colors">
                  > TARGET_3: DISCORD_WEBHOOK
               </label>
               <input
                type="text"
                value={localConfig.discordWebhook}
                onChange={(e) => setLocalConfig({...localConfig, discordWebhook: e.target.value})}
                className="w-full bg-transparent border-b border-zinc-800 py-2 text-zinc-300 focus:border-red-600 focus:outline-none transition-colors font-mono text-sm placeholder-zinc-900"
                placeholder="https://..."
                autoComplete="off"
              />
            </div>

          <div className="mt-8 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-2 text-[10px] text-zinc-500">
               <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
               WAITING FOR INPUT...
             </div>
             <button type="submit" className="hidden">SUBMIT</button> {/* Hidden submit trigger for Enter key */}
             <div className="text-[10px] text-zinc-600">
                [PRESS ENTER TO INJECT]
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

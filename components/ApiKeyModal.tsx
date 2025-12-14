import React, { useState } from 'react';
import { SettingsModalProps, AppConfig } from '../types';
import { Terminal, Lock, Eye, EyeOff } from 'lucide-react';

export const ApiKeyModal: React.FC<SettingsModalProps> = ({ config, onSave, isOpen }) => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [showSecrets, setShowSecrets] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localConfig.telegramToken || localConfig.discordWebhook) {
      onSave(localConfig);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-10 shadow-[0_0_50px_rgba(220,38,38,0.1)] font-mono relative overflow-hidden">
        
        {/* Security Decorator - Red Laser Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-50"></div>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 text-red-600 mb-3 border border-red-900/30 px-3 py-1 rounded bg-red-950/10">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">SECURE_CHANNEL_SETUP</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-wider mb-2">INITIALIZE PROTOCOL</h2>
          <p className="text-zinc-600 text-xs">
            > AUTHENTICATION REQUIRED FOR BROADCAST UPLINK.<br/>
            > DATA IS ENCRYPTED AT REST (LOCAL SESSION).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Telegram Inputs */}
            <div className="space-y-6 border-l-2 border-zinc-900 pl-6 relative">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-800"></div>
               
               <div className="group relative">
                  <label className="text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                     TARGET_1 :: TELEGRAM_BOT_TOKEN
                  </label>
                  <input
                      type={showSecrets ? "text" : "password"}
                      value={localConfig.telegramToken}
                      onChange={(e) => setLocalConfig({...localConfig, telegramToken: e.target.value})}
                      className="w-full bg-black border border-zinc-800 py-3 px-4 text-zinc-300 focus:border-red-700 focus:ring-1 focus:ring-red-900 focus:outline-none transition-all text-sm placeholder-zinc-800 rounded-sm"
                      placeholder="123456:ABC-DEF..."
                      autoComplete="off"
                    />
               </div>

               <div className="group relative">
                  <label className="text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                     TARGET_2 :: CHAT_ID
                  </label>
                  <input
                      type="text"
                      value={localConfig.telegramChatId}
                      onChange={(e) => setLocalConfig({...localConfig, telegramChatId: e.target.value})}
                      className="w-full bg-black border border-zinc-800 py-3 px-4 text-zinc-300 focus:border-red-700 focus:ring-1 focus:ring-red-900 focus:outline-none transition-all text-sm placeholder-zinc-800 rounded-sm"
                      placeholder="@GhostChannel"
                      autoComplete="off"
                    />
               </div>
            </div>

            {/* Discord Input */}
            <div className="space-y-6 border-l-2 border-zinc-900 pl-6 relative">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-800"></div>
               <div className="group relative">
                  <label className="text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                     TARGET_3 :: DISCORD_WEBHOOK
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={localConfig.discordWebhook}
                    onChange={(e) => setLocalConfig({...localConfig, discordWebhook: e.target.value})}
                    className="w-full bg-black border border-zinc-800 py-3 px-4 text-zinc-300 focus:border-red-700 focus:ring-1 focus:ring-red-900 focus:outline-none transition-all text-sm placeholder-zinc-800 rounded-sm"
                    placeholder="https://discord.com/api/webhooks/..."
                    autoComplete="off"
                  />
               </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2 border-t border-zinc-900 pt-4">
              <button 
                type="button" 
                onClick={() => setShowSecrets(!showSecrets)}
                className="flex items-center gap-2 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest"
              >
                {showSecrets ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showSecrets ? "OBSCURE_KEYS" : "REVEAL_KEYS"}
              </button>

              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 bg-green-900 rounded-full animate-pulse"></div>
                 <span className="text-[10px] text-zinc-600">SYSTEM_READY</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-red-950/30 text-zinc-400 hover:text-red-500 border border-zinc-800 hover:border-red-900 py-4 uppercase tracking-[0.25em] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Terminal className="w-4 h-4" />
              EXECUTE_INIT_SEQUENCE
            </button>
        </form>
      </div>
    </div>
  );
};
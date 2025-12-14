export interface StoryChapter {
  id: string;
  content: string;
  timestamp: string;
}

export interface AppConfig {
  telegramToken: string;
  telegramChatId: string;
  discordWebhook: string;
}

export interface SettingsModalProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  isOpen: boolean;
}

export interface ControlPanelProps {
  isGenerating: boolean;
  hasApiKey: boolean;
}

export interface StoryReaderProps {
  chapters: StoryChapter[];
}
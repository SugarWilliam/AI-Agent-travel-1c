// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Home, Camera, Sparkles, User, Settings } from 'lucide-react';

import { useGlobalSettings } from '@/components/GlobalSettings';
export default function TabBar({
  activeTab,
  onNavigate
}) {
  // 尝试使用全局设置，如果没有 Provider 则使用本地状态
  let globalSettings;
  try {
    globalSettings = useGlobalSettings();
  } catch (error) {
    globalSettings = null;
  }
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });
  useEffect(() => {
    if (!globalSettings) {
      const handleStorageChange = () => {
        const savedDarkMode = localStorage.getItem('app-darkMode');
        setLocalDarkMode(savedDarkMode === 'true');
      };
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('theme-change', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('theme-change', handleStorageChange);
      };
    }
  }, [globalSettings]);
  const darkMode = globalSettings?.darkMode || localDarkMode;
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home
  }, {
    id: 'photo-guide',
    label: '拍照指导',
    icon: Camera
  }, {
    id: 'ai',
    label: 'AI助手',
    icon: Sparkles
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }];
  return <div className={`fixed bottom-0 left-0 right-0 px-4 py-2 z-50 ${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'}`}>
      <div className="max-w-lg mx-auto flex justify-around items-center">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onNavigate({
          pageId: tab.id,
          params: {}
        })} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${isActive ? 'text-[#FF6B6B] bg-[#FFF0F0]' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>;
      })}
      </div>
    </div>;
}
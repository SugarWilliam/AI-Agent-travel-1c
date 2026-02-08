// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Map, Sparkles, User, Settings } from 'lucide-react';

export default function TabBar({
  activeTab,
  onNavigate
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home
  }, {
    id: 'detail',
    label: '计划',
    icon: Map
  }, {
    id: 'ai',
    label: 'AI助手',
    icon: Sparkles
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }, {
    id: 'settings',
    label: '设置',
    icon: Settings
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onNavigate({
          pageId: tab.id,
          params: {}
        })} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${isActive ? 'text-[#FF6B6B] bg-[#FFF0F0]' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>;
      })}
      </div>
    </div>;
}
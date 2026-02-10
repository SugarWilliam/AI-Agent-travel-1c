// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Bell, Lock, Database, HelpCircle, Info, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function Settings(props) {
  const {
    toast
  } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  // 深色模式支持
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });
  useEffect(() => {
    const handleStorageChange = () => {
      const savedDarkMode = localStorage.getItem('app-darkMode');
      setDarkMode(savedDarkMode === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-change', handleStorageChange);
    };
  }, []);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? '通知已关闭' : '通知已开启',
      variant: 'default'
    });
  };
  const handleToggleAutoSync = () => {
    setAutoSync(!autoSync);
    toast({
      title: autoSync ? '自动同步已关闭' : '自动同步已开启',
      variant: 'default'
    });
  };
  const handleClearCache = () => {
    toast({
      title: '缓存已清除',
      description: '应用将重新加载数据',
      variant: 'default'
    });
  };
  const handleExportData = () => {
    toast({
      title: '数据导出中',
      description: '正在准备导出文件...',
      variant: 'default'
    });
  };
  const settingsGroups = [{
    title: '通知与同步',
    items: [{
      id: 'notifications',
      label: '推送通知',
      icon: Bell,
      type: 'switch',
      value: notifications,
      onChange: handleToggleNotifications
    }, {
      id: 'autoSync',
      label: '自动同步',
      icon: Database,
      type: 'switch',
      value: autoSync,
      onChange: handleToggleAutoSync
    }]
  }, {
    title: '隐私与安全',
    items: [{
      id: 'privacy',
      label: '隐私设置',
      icon: Lock,
      type: 'link',
      onClick: () => toast({
        title: '隐私设置',
        description: '功能开发中',
        variant: 'default'
      })
    }, {
      id: 'clearCache',
      label: '清除缓存',
      icon: Database,
      type: 'button',
      onClick: handleClearCache
    }]
  }, {
    title: '关于',
    items: [{
      id: 'help',
      label: '帮助与反馈',
      icon: HelpCircle,
      type: 'link',
      onClick: () => toast({
        title: '帮助中心',
        description: '功能开发中',
        variant: 'default'
      })
    }, {
      id: 'about',
      label: '关于我们',
      icon: Info,
      type: 'link',
      onClick: () => toast({
        title: '版本 1.0.0',
        description: 'AI旅行助手',
        variant: 'default'
      })
    }]
  }];
  return <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#FFF9F0]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </button>
          <h1 className="text-xl font-bold text-white" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            设置
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-6">
        {settingsGroups.map((group, groupIdx) => <div key={groupIdx}>
            <h3 className={`text-sm font-semibold mb-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              {group.title}
            </h3>
            <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {group.items.map((item, itemIdx) => <div key={item.id} className={`flex items-center justify-between p-4 ${itemIdx !== group.items.length - 1 ? darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    {item.icon && <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-[#FFF9F0]'}`}>
                        <item.icon className="w-5 h-5 text-[#FF6B6B]" />
                      </div>}
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-[#2D3436]'}`} style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {item.label}
                    </span>
                  </div>
                  
                  {item.type === 'switch' && <Switch checked={item.value} onCheckedChange={item.onChange} className="data-[state=checked]:bg-[#4ECDC4]" />}
                  
                  {item.type === 'select' && <Select value={item.value} onValueChange={item.onChange}>
                      <SelectTrigger className={`w-32 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>}
                  
                  {item.type === 'link' && <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />}
                  
                  {item.type === 'button' && <Button size="sm" variant="outline" onClick={item.onClick} className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white">
                      执行
                    </Button>}
                </div>)}
            </div>
          </div>)}

        {/* Data Management */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            数据管理
          </h3>
          <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <Button onClick={handleExportData} className="w-full bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl h-12 font-semibold">
              导出所有数据
            </Button>
            <p className="text-xs text-gray-500 text-center" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              导出包含所有旅行计划和攻略的完整数据
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-400" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            AI旅行助手 v1.0.0
          </p>
          <p className="text-xs text-gray-300 mt-1" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            Made with ❤️ for travelers
          </p>
        </div>
      </div>

      {/* TabBar */}
      <TabBar activeTab="settings" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
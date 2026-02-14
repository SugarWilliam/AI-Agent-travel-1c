// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Bell, Lock, Database, HelpCircle, Info, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

import { useGlobalSettings } from '@/components/GlobalSettings';
import TabBar from '@/components/TabBar';

// 国际化字典
const i18n = {
  zh: {
    title: '设置',
    notifications: '通知与同步',
    pushNotifications: '推送通知',
    autoSync: '自动同步',
    privacySecurity: '隐私与安全',
    privacySettings: '隐私设置',
    clearCache: '清除缓存',
    about: '关于',
    helpFeedback: '帮助与反馈',
    aboutUs: '关于我们',
    helpCenter: '帮助中心',
    version: '版本 1.0.0',
    appDesc: 'AI旅行助手',
    dataManagement: '数据管理',
    exportAllData: '导出所有数据',
    exportDesc: '导出包含所有旅行计划和攻略的完整数据',
    appVersion: 'AI旅行助手 v1.0.0',
    madeWithLove: 'Made with ❤️ for travelers',
    notificationsOn: '通知已开启',
    notificationsOff: '通知已关闭',
    autoSyncOn: '自动同步已开启',
    autoSyncOff: '自动同步已关闭',
    cacheCleared: '缓存已清除',
    cacheDesc: '应用将重新加载数据',
    dataExporting: '数据导出中',
    dataExportDesc: '正在准备导出文件...',
    featureInDev: '功能开发中',
    execute: '执行'
  },
  en: {
    title: 'Settings',
    notifications: 'Notifications & Sync',
    pushNotifications: 'Push Notifications',
    autoSync: 'Auto Sync',
    privacySecurity: 'Privacy & Security',
    privacySettings: 'Privacy Settings',
    clearCache: 'Clear Cache',
    about: 'About',
    helpFeedback: 'Help & Feedback',
    aboutUs: 'About Us',
    helpCenter: 'Help Center',
    version: 'Version 1.0.0',
    appDesc: 'AI Travel Assistant',
    dataManagement: 'Data Management',
    exportAllData: 'Export All Data',
    exportDesc: 'Export complete data including all travel plans and guides',
    appVersion: 'AI Travel Assistant v1.0.0',
    madeWithLove: 'Made with ❤️ for travelers',
    notificationsOn: 'Notifications enabled',
    notificationsOff: 'Notifications disabled',
    autoSyncOn: 'Auto sync enabled',
    autoSyncOff: 'Auto sync disabled',
    cacheCleared: 'Cache cleared',
    cacheDesc: 'App will reload data',
    dataExporting: 'Exporting data',
    dataExportDesc: 'Preparing export file...',
    featureInDev: 'Feature in development',
    execute: 'Execute'
  }
};
export default function Settings(props) {
  const {
    toast
  } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  // 尝试使用全局设置，如果没有 Provider 则使用本地状态
  let globalSettings;
  try {
    globalSettings = useGlobalSettings();
  } catch (error) {
    globalSettings = null;
  }

  // 本地状态管理（当没有 Provider 时使用）
  const [localLanguage, setLocalLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'zh';
  });
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });

  // 同步 localStorage 的变化到本地状态
  useEffect(() => {
    if (!globalSettings) {
      const handleStorageChange = () => {
        const savedLanguage = localStorage.getItem('app-language');
        const savedDarkMode = localStorage.getItem('app-darkMode');
        if (savedLanguage) setLocalLanguage(savedLanguage);
        if (savedDarkMode) setLocalDarkMode(savedDarkMode === 'true');
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [globalSettings]);

  // 监听自定义事件
  useEffect(() => {
    if (!globalSettings) {
      const handleLanguageChange = () => {
        const savedLanguage = localStorage.getItem('app-language');
        if (savedLanguage) setLocalLanguage(savedLanguage);
      };
      const handleThemeChange = () => {
        const savedDarkMode = localStorage.getItem('app-darkMode');
        if (savedDarkMode) setLocalDarkMode(savedDarkMode === 'true');
      };
      window.addEventListener('language-change', handleLanguageChange);
      window.addEventListener('theme-change', handleThemeChange);
      return () => {
        window.removeEventListener('language-change', handleLanguageChange);
        window.removeEventListener('theme-change', handleThemeChange);
      };
    }
  }, [globalSettings]);

  // 使用全局设置或本地状态
  const language = globalSettings?.language || localLanguage;
  const darkMode = globalSettings?.darkMode || localDarkMode;
  const t = i18n[language] || i18n.zh;
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? t.notificationsOff : t.notificationsOn,
      variant: 'default'
    });
  };
  const handleToggleAutoSync = () => {
    setAutoSync(!autoSync);
    toast({
      title: autoSync ? t.autoSyncOff : t.autoSyncOn,
      variant: 'default'
    });
  };
  const handleClearCache = () => {
    toast({
      title: t.cacheCleared,
      description: t.cacheDesc,
      variant: 'default'
    });
  };
  const handleExportData = () => {
    toast({
      title: t.dataExporting,
      description: t.dataExportDesc,
      variant: 'default'
    });
  };
  const settingsGroups = [{
    title: t.notifications,
    items: [{
      id: 'notifications',
      label: t.pushNotifications,
      icon: Bell,
      type: 'switch',
      value: notifications,
      onChange: handleToggleNotifications
    }, {
      id: 'autoSync',
      label: t.autoSync,
      icon: Database,
      type: 'switch',
      value: autoSync,
      onChange: handleToggleAutoSync
    }]
  }, {
    title: t.privacySecurity,
    items: [{
      id: 'privacy',
      label: t.privacySettings,
      icon: Lock,
      type: 'link',
      onClick: () => toast({
        title: t.privacySettings,
        description: t.featureInDev,
        variant: 'default'
      })
    }, {
      id: 'clearCache',
      label: t.clearCache,
      icon: Database,
      type: 'button',
      onClick: handleClearCache
    }]
  }, {
    title: t.about,
    items: [{
      id: 'help',
      label: t.helpFeedback,
      icon: HelpCircle,
      type: 'link',
      onClick: () => toast({
        title: t.helpCenter,
        description: t.featureInDev,
        variant: 'default'
      })
    }, {
      id: 'about',
      label: t.aboutUs,
      icon: Info,
      type: 'link',
      onClick: () => toast({
        title: t.version,
        description: t.appDesc,
        variant: 'default'
      })
    }]
  }];
  return <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#FFF9F0]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-full sm:max-w-lg mx-auto flex items-center gap-3">
          <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </button>
          <h1 className="text-xl font-bold text-white" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            {t.title}
          </h1>
        </div>
      </div>

      <div className="max-w-full sm:max-w-lg mx-auto px-4 mt-6 space-y-6">
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
                      {t.execute}
                    </Button>}
                </div>)}
            </div>
          </div>)}

        {/* Data Management */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            {t.dataManagement}
          </h3>
          <div className={`rounded-2xl shadow-lg p-4 space-y-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Button onClick={handleExportData} className="w-full bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl h-12 font-semibold">
              {t.exportAllData}
            </Button>
            <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              {t.exportDesc}
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-400" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
          {t.appVersion}
          </p>
          <p className="text-xs text-gray-300 mt-1" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
          {t.madeWithLove}
          </p>
        </div>
      </div>

      {/* TabBar */}
      <TabBar activeTab="settings" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
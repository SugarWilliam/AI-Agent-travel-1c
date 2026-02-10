// @ts-ignore;
import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建全局设置上下文
const GlobalSettingsContext = createContext(null);

// 全局设置 Provider
export function GlobalSettingsProvider({
  children
}) {
  // 从 localStorage 读取初始设置
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'zh';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });

  // 当设置改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);
  useEffect(() => {
    localStorage.setItem('app-darkMode', darkMode.toString());
    // 添加或移除 darkMode 类到 body
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  return <GlobalSettingsContext.Provider value={{
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    toggleLanguage,
    toggleDarkMode
  }}>
      {children}
    </GlobalSettingsContext.Provider>;
}

// 自定义 Hook，用于访问全局设置
export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
}

// 语言和主题切换按钮组件
export function LanguageThemeToggle() {
  const {
    language,
    darkMode,
    toggleLanguage,
    toggleDarkMode
  } = useGlobalSettings();
  return <div className="flex items-center gap-2">
      <button onClick={toggleLanguage} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-105 transition-transform" title={language === 'zh' ? 'Switch to English' : '切换到中文'}>
        <span className="text-[#2D3436] font-bold text-sm">
          {language === 'zh' ? '中' : 'EN'}
        </span>
      </button>
      <button onClick={toggleDarkMode} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-105 transition-transform" title={darkMode ? 'Light Mode' : 'Dark Mode'}>
        {darkMode ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2D3436]">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2D3436]">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>}
      </button>
    </div>;
}
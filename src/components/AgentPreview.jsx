// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Bot, Sparkles, Route, BookOpen, Camera, Cloud, Shirt, Languages, Image as ImageIcon, Link2, ChevronRight, Power, MoreHorizontal } from 'lucide-react';

// 图标映射
const iconMap = {
  Bot,
  Sparkles,
  Route,
  BookOpen,
  Camera,
  Cloud,
  Shirt,
  Languages,
  ImageIcon,
  Link2
};
export function AgentPreview({
  name = '未命名 Agent',
  description = '暂无描述',
  icon = 'Bot',
  color = 'from-blue-500 to-purple-500',
  model = 'gpt-4',
  ragEnabled = false,
  ragSources = [],
  rules = [],
  skills = [],
  mcpServers = [],
  knowledgeBases = [],
  status = 'active',
  darkMode = false
}) {
  const IconComponent = iconMap[icon] || Bot;
  return <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'}`}>
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {name || '未命名 Agent'}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {model}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            <Power className="w-3 h-3" />
            {status === 'active' ? '已启用' : '已禁用'}
          </div>
          <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 描述 */}
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {description || '暂无描述'}
      </p>

      {/* 技能标签 */}
      {skills.length > 0 && <div className="mb-4">
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            技能
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${color} text-white`}>
                {skill}
              </span>)}
            {skills.length > 3 && <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                +{skills.length - 3}
              </span>}
          </div>
        </div>}

      {/* 规则标签 */}
      {rules.length > 0 && <div className="mb-4">
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            规则
          </div>
          <div className="flex flex-wrap gap-2">
            {rules.slice(0, 2).map((rule, index) => <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-pink-900/30 text-pink-300 border border-pink-700/30' : 'bg-pink-50 text-pink-600 border border-pink-200'}`}>
                {rule}
              </span>)}
            {rules.length > 2 && <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                +{rules.length - 2}
              </span>}
          </div>
        </div>}

      {/* RAG 状态 */}
      {ragEnabled && <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-900/20 border border-emerald-700/30' : 'bg-emerald-50 border border-emerald-200'}`}>
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
            RAG 已启用
          </div>
          <div className={`text-xs ${darkMode ? 'text-emerald-200/70' : 'text-emerald-600/80'}`}>
            {ragSources.length > 0 ? ragSources.join('、') : '未配置数据源'}
          </div>
        </div>}

      {/* MCP 服务 */}
      {mcpServers.length > 0 && <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            MCP 服务
          </div>
          <div className={`text-xs ${darkMode ? 'text-blue-200/70' : 'text-blue-600/80'}`}>
            {mcpServers.join('、')}
          </div>
        </div>}

      {/* 知识库 */}
      {knowledgeBases.length > 0 && <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-purple-900/20 border border-purple-700/30' : 'bg-purple-50 border border-purple-200'}`}>
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            知识库
          </div>
          <div className={`text-xs ${darkMode ? 'text-purple-200/70' : 'text-purple-600/80'}`}>
            {knowledgeBases.join('、')}
          </div>
        </div>}

      {/* 底部操作栏 */}
      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            预览模式
          </div>
          <button className={`flex items-center gap-1 text-xs font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            查看详情
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>;
}
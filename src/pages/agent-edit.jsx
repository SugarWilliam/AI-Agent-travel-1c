// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Brain, Database, FileText, Zap, Code, Type, Save, Plus, Trash2, Check, Bot, Sparkles, Route, BookOpen, Camera, Cloud, Shirt, Languages, Image as ImageIcon, Link2, ChevronRight, MoreVertical, Power } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Checkbox } from '@/components/ui';

import TabBar from '@/components/TabBar';
import { useGlobalSettings } from '@/components/GlobalSettings';

// 语言配置
const translations = {
  zh: {
    title: 'AI Agent 编辑',
    createAgent: '新建 Agent',
    editAgent: '编辑 Agent',
    save: '保存配置',
    cancel: '取消',
    agentName: 'Agent 名称',
    agentDescription: 'Agent 描述',
    agentType: 'Agent 类型',
    model: '模型',
    skills: '技能',
    rules: '规则',
    rag: 'RAG',
    mcp: 'MCP',
    enabled: '已启用',
    disabled: '已禁用',
    builtIn: '内置',
    custom: '自定义',
    usageCount: '使用次数',
    createdAt: '创建于',
    ragEnabled: 'RAG 已启用',
    ragDisabled: 'RAG 未启用',
    dataSource: '数据源',
    addRule: '添加规则',
    saveSuccess: '保存成功',
    saveFailed: '保存失败',
    validation: {
      nameRequired: 'Agent 名称不能为空',
      descriptionRequired: 'Agent 描述不能为空',
      modelRequired: '请选择一个模型'
    }
  },
  en: {
    title: 'AI Agent Editor',
    createAgent: 'Create Agent',
    editAgent: 'Edit Agent',
    save: 'Save Configuration',
    cancel: 'Cancel',
    agentName: 'Agent Name',
    agentDescription: 'Agent Description',
    agentType: 'Agent Type',
    model: 'Model',
    skills: 'Skills',
    rules: 'Rules',
    rag: 'RAG',
    mcp: 'MCP',
    enabled: 'Enabled',
    disabled: 'Disabled',
    builtIn: 'Built-in',
    custom: 'Custom',
    usageCount: 'Usage Count',
    createdAt: 'Created At',
    ragEnabled: 'RAG Enabled',
    ragDisabled: 'RAG Disabled',
    dataSource: 'Data Source',
    addRule: 'Add Rule',
    saveSuccess: 'Saved successfully',
    saveFailed: 'Save failed',
    validation: {
      nameRequired: 'Agent name is required',
      descriptionRequired: 'Agent description is required',
      modelRequired: 'Please select a model'
    }
  }
};

// 默认模板配置
const defaultAgentTemplate = {
  name: '规划助手',
  description: '专业的行程规划助手，根据用户需求生成详细的旅行行程安排',
  icon: 'Route',
  color: 'from-orange-500 to-pink-500',
  model: 'gpt-4',
  skills: [{
    name: '行程规划',
    enabled: true
  }, {
    name: '路线优化',
    enabled: true
  }, {
    name: '时间安排',
    enabled: true
  }],
  rules: [{
    name: '安全优先',
    enabled: true
  }, {
    name: '时间合理',
    enabled: true
  }],
  ragEnabled: true,
  ragSources: [{
    name: '旅行攻略数据库',
    enabled: true
  }, {
    name: '景点数据库',
    enabled: true
  }],
  mcpServers: [],
  usageCount: 156,
  createdAt: '2024/1/15'
};

// 可用模型列表
// 默认模型列表（降级方案）
const defaultModels = [{
  id: 'gpt-4',
  name: 'GPT-4',
  description: '最强大的模型'
}, {
  id: 'gpt-4-turbo',
  name: 'GPT-4 Turbo',
  description: '更快的响应速度'
}, {
  id: 'gpt-3.5-turbo',
  name: 'GPT-3.5 Turbo',
  description: '经济实惠'
}, {
  id: 'claude-3',
  name: 'Claude 3',
  description: '优秀的推理能力'
}];

// 可用技能列表
const availableSkillsList = ['行程规划', '路线优化', '时间安排', '景点推荐', '美食推荐', '天气预报', '交通查询', '费用估算', '文化解说', '拍照建议'];

// 可用规则列表
const availableRulesList = ['安全优先', '时间合理', '费用控制', '路线优化', '个性化推荐', '实时更新', '紧急处理', '多语言支持'];

// 可用 RAG 数据源
const availableRagSources = ['旅行攻略数据库', '景点数据库', '美食数据库', '交通数据库', '天气数据库', '文化数据库', '酒店数据库'];

// 可用 MCP 服务
const availableMcpServers = ['地图服务', '天气服务', '翻译服务', '支付服务', '通知服务', '存储服务', '搜索服务'];

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
export default function AgentEdit(props) {
  const {
    toast
  } = useToast();

  // 尝试使用全局设置，如果没有 Provider 则使用本地状态
  let globalSettings;
  try {
    globalSettings = useGlobalSettings();
  } catch (error) {
    globalSettings = null;
  }
  const [localLanguage, setLocalLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'zh';
  });
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });
  const language = globalSettings?.language || localLanguage;
  const darkMode = globalSettings?.darkMode || localDarkMode;
  const t = translations[language];

  // Agent 编辑/新建模式
  const [isEditMode, setIsEditMode] = useState(false);
  const [agentId, setAgentId] = useState(null);

  // 动态模型列表
  const [availableModels, setAvailableModels] = useState(defaultModels);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Agent 配置
  const [agentName, setAgentName] = useState(defaultAgentTemplate.name);
  const [agentDescription, setAgentDescription] = useState(defaultAgentTemplate.description);
  const [agentIcon, setAgentIcon] = useState(defaultAgentTemplate.icon);
  const [agentColor, setAgentColor] = useState(defaultAgentTemplate.color);
  const [agentType, setAgentType] = useState('built-in');
  const [selectedModel, setSelectedModel] = useState(defaultAgentTemplate.model);
  const [skills, setSkills] = useState(defaultAgentTemplate.skills);
  const [rules, setRules] = useState(defaultAgentTemplate.rules);
  const [ragEnabled, setRagEnabled] = useState(defaultAgentTemplate.ragEnabled);
  const [ragSources, setRagSources] = useState(defaultAgentTemplate.ragSources);
  const [mcpServers, setMcpServers] = useState(defaultAgentTemplate.mcpServers);
  const [usageCount, setUsageCount] = useState(defaultAgentTemplate.usageCount);
  const [createdAt, setCreatedAt] = useState(defaultAgentTemplate.createdAt);

  // 表单验证
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);

  // 当前图标组件
  const CurrentIcon = iconMap[agentIcon] || Bot;

  // 初始化：检查是否是编辑模式
  useEffect(() => {
    const params = props.$w?.page?.dataset?.params || {};
    if (params.id) {
      setIsEditMode(true);
      setAgentId(params.id);
      loadAgentData(params.id);
    } else {
      // 新建模式，使用默认模板
      setIsEditMode(false);
      loadDefaultTemplate();
    }
  }, []);

  // 加载 Agent 数据
  const loadAgentData = async id => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('Agent').doc(id).get();
      if (result.data && result.data.length > 0) {
        const agent = result.data[0];
        setAgentName(agent.name || '');
        setAgentDescription(agent.description || '');
        setAgentIcon(agent.icon || 'Bot');
        setAgentColor(agent.color || 'from-blue-500 to-purple-500');
        setAgentType(agent.type || 'custom');
        setSelectedModel(agent.model || 'gpt-4');
        setSkills(agent.skills || []);
        setRules(agent.rules || []);
        setRagEnabled(agent.ragEnabled || false);
        setRagSources(agent.ragSources || []);
        setMcpServers(agent.mcpServers || []);
        setUsageCount(agent.usageCount || 0);
        setCreatedAt(agent.createdAt || new Date().toLocaleDateString());
      }
    } catch (error) {
      console.error('加载 Agent 数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载 Agent 数据',
        variant: 'destructive'
      });
    }
  };

  // 加载默认模板
  const loadDefaultTemplate = () => {
    setAgentName(defaultAgentTemplate.name);
    setAgentDescription(defaultAgentTemplate.description);
    setAgentIcon(defaultAgentTemplate.icon);
    setAgentColor(defaultAgentTemplate.color);
    setAgentType('custom');
    setSelectedModel(defaultAgentTemplate.model);
    setSkills([...defaultAgentTemplate.skills]);
    setRules([...defaultAgentTemplate.rules]);
    setRagEnabled(defaultAgentTemplate.ragEnabled);
    setRagSources([...defaultAgentTemplate.ragSources]);
    setMcpServers([]);
    setUsageCount(0);
    setCreatedAt(new Date().toLocaleDateString());
  };

  // 加载模型列表
  const loadModels = async () => {
    try {
      setModelsLoading(true);

      // 从 llm_models 数据模型加载真实的大模型配置
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('llm_models').where({
        status: 'active'
      }).get();
      if (result.data && result.data.length > 0) {
        // 转换为 availableModels 格式
        const models = result.data.map(model => ({
          id: model.modelId,
          name: model.modelName,
          description: model.description || `${model.provider} 的模型`
        }));
        setAvailableModels(models);
        console.log('成功加载模型列表:', models.length, '个模型');
      } else {
        console.warn('未找到活跃的模型配置，使用默认模型');
        setAvailableModels(defaultModels);
      }
    } catch (error) {
      console.error('加载模型失败:', error);
      // 如果数据库加载失败，使用默认的模型列表作为降级方案
      setAvailableModels(defaultModels);
    } finally {
      setModelsLoading(false);
    }
  };

  // 组件加载时加载模型列表
  useEffect(() => {
    loadModels();
  }, []);

  // 验证表单
  const validateForm = () => {
    const errors = {};
    if (!agentName.trim()) {
      errors.name = t.validation.nameRequired;
    }
    if (!agentDescription.trim()) {
      errors.description = t.validation.descriptionRequired;
    }
    if (!selectedModel) {
      errors.model = t.validation.modelRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 保存配置
  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: '表单验证失败',
        description: t.validation.formInvalid,
        variant: 'destructive'
      });
      return;
    }
    try {
      // 第一步：调用云函数初始化 Agent 集合
      console.log('正在初始化 Agent 集合...');
      try {
        const initResult = await props.$w.cloud.callFunction({
          name: 'initAgentCollection',
          data: {}
        });
        console.log('Agent 集合初始化结果:', initResult);
      } catch (initError) {
        console.warn('初始化 Agent 集合失败，继续尝试保存:', initError.message);
        // 不中断流程，继续尝试保存
      }

      // 第二步：准备保存数据
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const agentData = {
        name: agentName,
        description: agentDescription,
        icon: agentIcon,
        color: agentColor,
        type: agentType,
        model: selectedModel,
        skills: skills,
        rules: rules,
        ragEnabled: ragEnabled,
        ragSources: ragSources,
        mcpServers: mcpServers,
        usageCount: usageCount,
        createdAt: createdAt,
        updatedAt: new Date().toISOString(),
        status: 'active'
      };
      console.log('准备保存 Agent 数据:', agentData);

      // 第三步：保存或更新 Agent
      if (isEditMode && agentId) {
        console.log('更新现有 Agent:', agentId);
        await db.collection('Agent').doc(agentId).update(agentData);
      } else {
        console.log('创建新 Agent');
        const result = await db.collection('Agent').add(agentData);
        console.log('Agent 创建成功，ID:', result.id);
        setAgentId(result.id);
      }
      toast({
        title: t.saveSuccess,
        description: isEditMode ? 'Agent 配置已更新' : 'Agent 已创建'
      });

      // 返回列表页
      props.$w.utils.navigateTo({
        pageId: 'agent-list',
        params: {}
      });
    } catch (error) {
      console.error('保存失败:', error);
      console.error('错误详情:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      let errorMessage = error.message || '未知错误';

      // 根据错误类型提供更友好的提示
      if (error.message && error.message.includes('not exist')) {
        errorMessage = '数据库集合不存在，正在尝试自动创建...';
      } else if (error.message && error.message.includes('不存在')) {
        errorMessage = '数据库集合不存在，正在尝试自动创建...';
      } else if (error.code === 'DATABASE_COLLECTION_NOT_EXIST') {
        errorMessage = '数据库集合不存在，正在尝试自动创建...';
      } else if (error.message && error.message.includes('network')) {
        errorMessage = '网络连接异常，请检查网络设置后重试';
      } else if (error.message && error.message.includes('timeout')) {
        errorMessage = '请求超时，请稍后重试';
      } else if (error.code === 'PERMISSION_DENIED') {
        errorMessage = '权限不足，请联系管理员';
      }
      toast({
        title: t.saveFailed,
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // 取消编辑
  const handleCancel = () => {
    props.$w.utils.navigateTo({
      pageId: 'agent-list',
      params: {}
    });
  };

  // 切换技能
  const toggleSkill = skillName => {
    setSkills(prev => {
      const exists = prev.find(s => s.name === skillName);
      if (exists) {
        return prev.filter(s => s.name !== skillName);
      } else {
        return [...prev, {
          name: skillName,
          enabled: true
        }];
      }
    });
  };

  // 切换规则
  const toggleRule = ruleName => {
    setRules(prev => {
      const exists = prev.find(r => r.name === ruleName);
      if (exists) {
        return prev.filter(r => r.name !== ruleName);
      } else {
        return [...prev, {
          name: ruleName,
          enabled: true
        }];
      }
    });
  };

  // 切换 RAG 数据源
  const toggleRagSource = sourceName => {
    setRagSources(prev => {
      const exists = prev.find(s => s.name === sourceName);
      if (exists) {
        return prev.filter(s => s.name !== sourceName);
      } else {
        return [...prev, {
          name: sourceName,
          enabled: true
        }];
      }
    });
  };

  // 切换 MCP 服务
  const toggleMcpServer = serverName => {
    setMcpServers(prev => {
      const exists = prev.find(s => s.name === serverName);
      if (exists) {
        return prev.filter(s => s.name !== serverName);
      } else {
        return [...prev, {
          name: serverName,
          enabled: true
        }];
      }
    });
  };
  return <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航栏 */}
      <div className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={handleCancel} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isEditMode ? t.editAgent : t.createAgent}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isEditMode ? '编辑 Agent 配置' : '创建新的 AI Agent'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleCancel} variant="outline" className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}>
                {t.cancel}
              </Button>
              <Button onClick={handleSave} className={`bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white`}>
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent 卡片 */}
        <div className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* 顶部信息区 */}
          <div className={`bg-gradient-to-r ${agentColor} p-6 text-white`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CurrentIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{agentName}</h2>
                  <p className="text-white/80 text-sm mt-1">{agentDescription}</p>
                </div>
              </div>
              <button className={`p-2 rounded-lg hover:bg-white/20 transition-colors`}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 配置区 */}
          <div className={`p-6 space-y-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* 模型选择 */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.model}
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  {availableModels.map(model => <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>{t.usageCount}: {usageCount}</span>
                <span className="mx-2">•</span>
                <span>{t.createdAt}: {createdAt}</span>
              </div>
            </div>

            {/* 技能选择 */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.skills}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkillsList.map(skill => {
                const isSelected = skills.some(s => s.name === skill);
                return <button key={skill} onClick={() => toggleSkill(skill)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {skill}
                    </button>;
              })}
              </div>
            </div>

            {/* 规则选择 */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.rules}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRulesList.map(rule => {
                const isSelected = rules.some(r => r.name === rule);
                return <button key={rule} onClick={() => toggleRule(rule)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {rule}
                    </button>;
              })}
              </div>
            </div>

            {/* RAG 配置 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.rag}
                </label>
                <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
              </div>
              {ragEnabled && <div>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.dataSource}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableRagSources.map(source => {
                  const isSelected = ragSources.some(s => s.name === source);
                  return <button key={source} onClick={() => toggleRagSource(source)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {source}
                        </button>;
                })}
                  </div>
                </div>}
            </div>

            {/* MCP 配置 */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.mcp}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableMcpServers.map(server => {
                const isSelected = mcpServers.some(s => s.name === server);
                return <button key={server} onClick={() => toggleMcpServer(server)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {server}
                    </button>;
              })}
              </div>
            </div>
          </div>

          {/* 底部状态区 */}
          <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 p-4 ${darkMode ? 'bg-gray-700' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {t.enabled}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${agentType === 'built-in' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {agentType === 'built-in' ? t.builtIn : t.custom}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
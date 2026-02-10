// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Brain, Database, FileText, Zap, Code, Type, Save, Plus, Trash2, Check, Bot, Sparkles, Route, BookOpen, Camera, Cloud, Shirt, Languages, Image as ImageIcon, Link2, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components/ui';

import TabBar from '@/components/TabBar';
import { ModelManager } from '@/components/ModelManager';
import { SkillManager } from '@/components/SkillManager';
import { useGlobalSettings } from '@/components/GlobalSettings';
import { AgentPreview } from '@/components/AgentPreview';

// 语言配置
const translations = {
  zh: {
    title: 'AI Agent 编辑',
    createAgent: '新建 Agent',
    editAgent: '编辑 Agent',
    models: '模型管理',
    modelsDesc: '配置和管理AI模型设置',
    skills: '技能管理',
    skillsDesc: '配置AI助手的技能和能力',
    rules: '规则配置',
    rulesDesc: '设置AI助手的行为规则',
    rag: '知识库',
    ragDesc: '管理AI助手的知识库资源',
    mcp: 'MCP',
    mcpDesc: '管理外部服务集成',
    save: '保存配置',
    cancel: '取消',
    agentName: 'Agent 名称',
    agentDescription: 'Agent 描述',
    agentType: 'Agent 类型',
    selectModel: '选择模型',
    selectSkills: '选择技能',
    selectRules: '选择规则',
    selectKnowledge: '选择知识库',
    selectMcp: '选择 MCP 服务',
    basicInfo: '基本信息',
    configInfo: '配置信息',
    back: '返回',
    saveSuccess: '保存成功',
    saveFailed: '保存失败',
    loading: '加载中...',
    typeCustom: '自定义',
    typeBuiltIn: '内置',
    typeSystem: '系统',
    enabled: '已启用',
    disabled: '已禁用',
    addRule: '添加规则',
    addKnowledge: '添加知识库',
    addMcp: '添加 MCP 服务',
    ragEnabled: '启用 RAG',
    ragEnabledDesc: '启用检索增强生成，让 AI 能够访问外部知识库',
    validation: {
      nameRequired: 'Agent 名称不能为空',
      nameTooLong: 'Agent 名称不能超过 50 个字符',
      descriptionRequired: 'Agent 描述不能为空',
      descriptionTooLong: 'Agent 描述不能超过 200 个字符',
      modelRequired: '请选择一个模型',
      atLeastOneSkill: '至少需要选择一个技能',
      atLeastOneRule: '至少需要配置一个规则',
      formValid: '表单验证通过',
      formInvalid: '请检查表单中的错误'
    },
    preview: '实时预览',
    showPreview: '显示预览',
    hidePreview: '隐藏预览'
  },
  en: {
    title: 'AI Agent Editor',
    createAgent: 'Create Agent',
    editAgent: 'Edit Agent',
    models: 'Model Management',
    modelsDesc: 'Configure and manage AI model settings',
    skills: 'Skill Management',
    skillsDesc: 'Configure AI assistant skills and capabilities',
    rules: 'Rules Configuration',
    rulesDesc: 'Set AI assistant behavior rules',
    rag: 'Knowledge Base',
    ragDesc: 'Manage AI assistant knowledge resources',
    mcp: 'MCP',
    mcpDesc: 'Manage external service integrations',
    save: 'Save Configuration',
    cancel: 'Cancel',
    agentName: 'Agent Name',
    agentDescription: 'Agent Description',
    agentType: 'Agent Type',
    selectModel: 'Select Model',
    selectSkills: 'Select Skills',
    selectRules: 'Select Rules',
    selectKnowledge: 'Select Knowledge Base',
    selectMcp: 'Select MCP Services',
    basicInfo: 'Basic Information',
    configInfo: 'Configuration Information',
    back: 'Back',
    saveSuccess: 'Saved successfully',
    saveFailed: 'Save failed',
    loading: 'Loading...',
    typeCustom: 'Custom',
    typeBuiltIn: 'Built-in',
    typeSystem: 'System',
    enabled: 'Enabled',
    disabled: 'Disabled',
    addRule: 'Add Rule',
    addKnowledge: 'Add Knowledge Base',
    addMcp: 'Add MCP Service',
    ragEnabled: 'Enable RAG',
    ragEnabledDesc: 'Enable retrieval-augmented generation to allow AI to access external knowledge bases',
    validation: {
      nameRequired: 'Agent name is required',
      nameTooLong: 'Agent name cannot exceed 50 characters',
      descriptionRequired: 'Agent description is required',
      descriptionTooLong: 'Agent description cannot exceed 200 characters',
      modelRequired: 'Please select a model',
      atLeastOneSkill: 'At least one skill must be selected',
      atLeastOneRule: 'At least one rule must be configured',
      formValid: 'Form validation passed',
      formInvalid: 'Please check the errors in the form'
    },
    preview: 'Live Preview',
    showPreview: 'Show Preview',
    hidePreview: 'Hide Preview'
  }
};

// 标签配置
const tabConfig = [{
  id: 'basic',
  label: 'basicInfo',
  icon: Type
}, {
  id: 'models',
  label: 'models',
  icon: Brain
}, {
  id: 'skills',
  label: 'skills',
  icon: Zap
}, {
  id: 'rules',
  label: 'rules',
  icon: FileText
}, {
  id: 'rag',
  label: 'rag',
  icon: Database
}, {
  id: 'mcp',
  label: 'mcp',
  icon: Code
}];
export default function AgentEdit(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [loading, setLoading] = useState(true);

  // Agent 编辑/新建模式
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentId, setAgentId] = useState(null);

  // Agent 基本信息表单
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentType, setAgentType] = useState('custom');
  const [agentIcon, setAgentIcon] = useState('Bot');
  const [agentColor, setAgentColor] = useState('from-blue-500 to-purple-500');

  // 从数据源加载的配置数据
  const [availableModels, setAvailableModels] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableRules, setAvailableRules] = useState([]);
  const [availableKnowledgeBases, setAvailableKnowledgeBases] = useState([]);
  const [availableMcpServers, setAvailableMcpServers] = useState([]);

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

  // 原有的状态管理
  const [rules, setRules] = useState([{
    name: '安全优先',
    enabled: true
  }, {
    name: '时间合理',
    enabled: true
  }]);
  const [ragEnabled, setRagEnabled] = useState(false);
  const [ragSources, setRagSources] = useState([{
    name: '旅行攻略数据库',
    enabled: true
  }, {
    name: '景点数据库',
    enabled: true
  }]);
  const [agentKnowledgeBases, setAgentKnowledgeBases] = useState([]);
  const [mcpServers, setMcpServers] = useState([]);
  const [newRule, setNewRule] = useState('');
  const [newKnowledgeBase, setNewKnowledgeBase] = useState('');
  const [newMcpServer, setNewMcpServer] = useState('');

  // 表单验证状态
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // 预览状态
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState({});

  // 图标选项
  const iconOptions = [{
    name: 'Bot',
    icon: Bot
  }, {
    name: 'Sparkles',
    icon: Sparkles
  }, {
    name: 'Route',
    icon: Route
  }, {
    name: 'BookOpen',
    icon: BookOpen
  }, {
    name: 'Camera',
    icon: Camera
  }, {
    name: 'Cloud',
    icon: Cloud
  }, {
    name: 'Shirt',
    icon: Shirt
  }, {
    name: 'Languages',
    icon: Languages
  }, {
    name: 'ImageIcon',
    icon: ImageIcon
  }, {
    name: 'Link2',
    icon: Link2
  }];

  // 颜色选项
  const colorOptions = [{
    name: 'blue-purple',
    value: 'from-blue-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-500'
  }, {
    name: 'orange-pink',
    value: 'from-orange-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-orange-500 to-pink-500'
  }, {
    name: 'green-teal',
    value: 'from-green-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-green-500 to-teal-500'
  }, {
    name: 'red-yellow',
    value: 'from-red-500 to-yellow-500',
    gradient: 'bg-gradient-to-br from-red-500 to-yellow-500'
  }, {
    name: 'indigo-cyan',
    value: 'from-indigo-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-indigo-500 to-cyan-500'
  }, {
    name: 'rose-amber',
    value: 'from-rose-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-rose-500 to-amber-500'
  }];

  // 辅助函数：渲染标签按钮
  const renderTabButton = item => {
    const IconComponent = item.icon;
    const label = typeof item.label === 'string' && t[item.label] ? t[item.label] : item.label;
    return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white shadow-md' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        <IconComponent className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </button>;
  };
  useEffect(() => {
    // 检查是否是编辑模式
    const mode = props.$w.page.dataset.params.mode;
    const agentIdParam = props.$w.page.dataset.params.agentId;
    if (mode === 'create') {
      // 新建 Agent 模式
      setIsEditMode(false);
      setActiveTab('basic');
      setLoading(false);
    } else if (mode === 'edit' && agentIdParam) {
      // 编辑 Agent 模式
      setIsEditMode(true);
      setAgentId(agentIdParam);
      setActiveTab('basic');
      loadAgentConfig(agentIdParam);
    } else {
      // 默认为新建模式
      setIsEditMode(false);
      setActiveTab('basic');
      setLoading(false);
    }

    // 加载可用的配置数据
    loadAvailableConfigurations();
  }, []);

  // 监听表单字段变化，实时更新预览数据
  useEffect(() => {
    updatePreviewData();
  }, [agentName, agentDescription, agentIcon, agentColor, selectedModel, ragEnabled, ragSources, rules, mcpServers, agentKnowledgeBases, darkMode]);

  // 监听表单字段变化，实时验证表单
  useEffect(() => {
    validateForm();
  }, [agentName, agentDescription, selectedModel, rules]);

  // 加载 Agent 配置
  const loadAgentConfig = async id => {
    try {
      setLoading(true);
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      let agent;
      try {
        const result = await db.collection('Agent').doc(id).get();
        agent = result.data[0];
      } catch (dbError) {
        const result = await db.collection('AIConfig').doc(id).get();
        agent = result.data[0];
      }
      if (agent) {
        setEditingAgent(agent);
        setAgentName(agent.name || '');
        setAgentDescription(agent.description || '');
        setAgentType(agent.agentType || 'custom');
        setAgentIcon(agent.icon || 'Bot');
        setAgentColor(agent.color || 'from-blue-500 to-purple-500');
        setSelectedModel(agent.model || 'gpt-4');
        setRagEnabled(agent.ragEnabled || false);
        // 转换 ragSources 为带 enabled 属性的对象数组
        const ragSourcesWithEnabled = (agent.ragSources || []).map(source => ({
          name: typeof source === 'string' ? source : source.name,
          enabled: true
        }));
        setRagSources(ragSourcesWithEnabled);
        // 转换 rules 为带 enabled 属性的对象数组
        const rulesWithEnabled = (agent.rules || []).map(rule => ({
          name: typeof rule === 'string' ? rule : rule.name,
          enabled: true
        }));
        setRules(rulesWithEnabled);
        // 转换 mcpServers 为带 enabled 属性的对象数组
        const mcpServersWithEnabled = (agent.mcpServers || []).map(server => ({
          name: typeof server === 'string' ? server : server.name,
          enabled: true
        }));
        setMcpServers(mcpServersWithEnabled);
        // 转换 agentKnowledgeBases 为带 enabled 属性的对象数组
        const knowledgeBasesWithEnabled = (agent.agentKnowledgeBases || []).map(kb => ({
          name: typeof kb === 'string' ? kb : kb.name,
          enabled: true
        }));
        setAgentKnowledgeBases(knowledgeBasesWithEnabled);
      }
    } catch (error) {
      console.error('加载Agent配置失败:', error);
      toast({
        title: t.loading,
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 加载可用的配置数据
  const loadAvailableConfigurations = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getAvailableConfigurations',
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result.result.success && result.result.data) {
        setAvailableModels(result.result.data.models || []);
        setAvailableSkills(result.result.data.skills || []);
        setAvailableRules(result.result.data.rules || []);
        setAvailableKnowledgeBases(result.result.data.knowledgeBases || []);
        setAvailableMcpServers(result.result.data.mcpServers || []);
      }
    } catch (error) {
      console.error('加载可用配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 表单验证函数
  const validateForm = () => {
    const errors = {};

    // 验证 Agent 名称
    if (!agentName || agentName.trim() === '') {
      errors.name = t.validation.nameRequired;
    } else if (agentName.length > 50) {
      errors.name = t.validation.nameTooLong;
    }

    // 验证 Agent 描述
    if (!agentDescription || agentDescription.trim() === '') {
      errors.description = t.validation.descriptionRequired;
    } else if (agentDescription.length > 200) {
      errors.description = t.validation.descriptionTooLong;
    }

    // 验证模型选择
    if (!selectedModel) {
      errors.model = t.validation.modelRequired;
    }

    // 验证技能选择
    const enabledSkills = rules.filter(rule => rule.enabled).map(rule => rule.name);
    if (enabledSkills.length === 0) {
      errors.skills = t.validation.atLeastOneSkill;
    }

    // 验证规则配置
    const enabledRules = rules.filter(rule => rule.enabled).map(rule => rule.name);
    if (enabledRules.length === 0) {
      errors.rules = t.validation.atLeastOneRule;
    }
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // 更新预览数据
  const updatePreviewData = () => {
    setPreviewData({
      name: agentName,
      description: agentDescription,
      icon: agentIcon,
      color: agentColor,
      model: selectedModel,
      ragEnabled: ragEnabled,
      ragSources: ragSources.filter(source => source.enabled).map(source => source.name),
      rules: rules.filter(rule => rule.enabled).map(rule => rule.name),
      skills: skills.filter(skill => skill.enabled).map(skill => skill.name),
      mcpServers: mcpServers.filter(server => server.enabled).map(server => server.name),
      knowledgeBases: agentKnowledgeBases.filter(kb => kb.enabled).map(kb => kb.name),
      status: 'active',
      darkMode: darkMode
    });
  };

  // 保存 Agent 配置
  const handleSave = async () => {
    // 先进行表单验证
    if (!validateForm()) {
      toast({
        title: t.validation.formInvalid,
        description: Object.values(formErrors).join(', '),
        variant: 'destructive'
      });
      return;
    }
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const agentData = {
        name: agentName,
        description: agentDescription,
        agentType: agentType,
        icon: agentIcon,
        color: agentColor,
        model: selectedModel,
        ragEnabled: ragEnabled,
        ragSources: ragSources.filter(source => source.enabled).map(source => source.name),
        rules: rules.filter(rule => rule.enabled).map(rule => rule.name),
        mcpServers: mcpServers.filter(server => server.enabled).map(server => server.name),
        agentKnowledgeBases: agentKnowledgeBases.filter(kb => kb.enabled).map(kb => kb.name),
        updatedAt: new Date().toISOString(),
        updatedBy: props.$w.auth.currentUser?.userId || 'anonymous'
      };
      if (isEditMode && agentId) {
        // 更新现有 Agent
        await db.collection('Agent').doc(agentId).update({
          ...agentData,
          _id: agentId
        });
      } else {
        // 创建新 Agent
        agentData.createdAt = new Date().toISOString();
        agentData.createdBy = props.$w.auth.currentUser?.userId || 'anonymous';
        agentData.status = 'active';
        agentData.usageCount = 0;
        const result = await db.collection('Agent').add(agentData);
        setAgentId(result.id);
      }
      toast({
        title: t.saveSuccess,
        description: isEditMode ? 'Agent 配置已更新' : 'Agent 已创建'
      });
      // 返回列表页
      props.$w.utils.navigateTo({
        pageId: 'agent-list'
      });
    } catch (error) {
      console.error('保存Agent配置失败:', error);
      toast({
        title: t.saveFailed,
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // 取消编辑
  const handleCancel = () => {
    props.$w.utils.navigateTo({
      pageId: 'agent-list'
    });
  };

  // 添加规则
  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, {
        name: newRule.trim(),
        enabled: true
      }]);
      setNewRule('');
    }
  };

  // 删除规则
  const handleDeleteRule = index => {
    setRules(rules.filter((_, i) => i !== index));
  };

  // 切换规则启用状态
  const handleToggleRule = index => {
    const newRules = [...rules];
    newRules[index].enabled = !newRules[index].enabled;
    setRules(newRules);
  };

  // 添加知识库
  const handleAddKnowledgeBase = () => {
    if (newKnowledgeBase.trim()) {
      setAgentKnowledgeBases([...agentKnowledgeBases, {
        name: newKnowledgeBase.trim(),
        enabled: true
      }]);
      setNewKnowledgeBase('');
    }
  };

  // 删除知识库
  const handleDeleteKnowledgeBase = index => {
    setAgentKnowledgeBases(agentKnowledgeBases.filter((_, i) => i !== index));
  };

  // 切换知识库启用状态
  const handleToggleKnowledgeBase = index => {
    const newKnowledgeBases = [...agentKnowledgeBases];
    newKnowledgeBases[index].enabled = !newKnowledgeBases[index].enabled;
    setAgentKnowledgeBases(newKnowledgeBases);
  };

  // 添加 MCP 服务
  const handleAddMcpServer = () => {
    if (newMcpServer.trim()) {
      setMcpServers([...mcpServers, {
        name: newMcpServer.trim(),
        enabled: true
      }]);
      setNewMcpServer('');
    }
  };

  // 删除 MCP 服务
  const handleDeleteMcpServer = index => {
    setMcpServers(mcpServers.filter((_, i) => i !== index));
  };

  // 切换 MCP 服务启用状态
  const handleToggleMcpServer = index => {
    const newMcpServers = [...mcpServers];
    newMcpServers[index].enabled = !newMcpServers[index].enabled;
    setMcpServers(newMcpServers);
  };

  // 切换 RAG 源启用状态
  const handleToggleRagSource = index => {
    const newRagSources = [...ragSources];
    newRagSources[index].enabled = !newRagSources[index].enabled;
    setRagSources(newRagSources);
  };

  // 获取当前图标组件
  const getCurrentIcon = () => {
    const iconOption = iconOptions.find(opt => opt.name === agentIcon);
    return iconOption ? iconOption.icon : Bot;
  };
  const CurrentIcon = getCurrentIcon();
  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-white' : 'border-gray-900'} mx-auto mb-4`}></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t.loading}</p>
        </div>
      </div>
  }
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
              <Button onClick={handleSave} disabled={!isFormValid} className={`bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <nav className={`sticky top-24 space-y-2 ${darkMode ? 'bg-gray-800 rounded-xl p-4' : 'bg-white rounded-xl p-4 shadow-sm'}`}>
              {tabConfig.map(renderTabButton)}
            </nav>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            {/* 预览切换按钮 */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.preview}
              </h3>
              <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                {showPreview ? t.hidePreview : t.showPreview}
              </button>
            </div>

            {/* 预览面板 */}
            {showPreview && (
              <div className="mb-6">
                <AgentPreview {...previewData} />
              </div>
            )}
            {/* 基本信息标签页 */}
            {activeTab === 'basic' && <div className={`space-y-6 ${darkMode ? 'bg-gray-800 rounded-xl p-6' : 'bg-white rounded-xl p-6 shadow-sm'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agentColor} flex items-center justify-center shadow-lg`}>
                    <CurrentIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {isEditMode ? t.editAgent : t.createAgent}
                    </h2>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isEditMode ? '编辑 Agent 基本信息' : '填写 Agent 基本信息'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Agent 名称 */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.agentName}
                    </label>
                    <Input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder={t.agentName} className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''} ${formErrors.name ? 'border-red-500' : ''}`} />
                    {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                  </div>

                  {/* Agent 描述 */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.agentDescription}
                    </label>
                    <Textarea value={agentDescription} onChange={e => setAgentDescription(e.target.value)} placeholder={t.agentDescription} rows={4} className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''} ${formErrors.description ? 'border-red-500' : ''}`} />
                    {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                  </div>

                  {/* Agent 类型 */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.agentType}
                    </label>
                    <Select value={agentType} onValueChange={setAgentType}>
                      <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="custom">{t.typeCustom}</SelectItem>
                        <SelectItem value="built-in">{t.typeBuiltIn}</SelectItem>
                        <SelectItem value="system">{t.typeSystem}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 图标选择 */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      图标
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {iconOptions.map(option => {
                        const IconComponent = option.icon;
                        return (
                          <button 
                            key={option.name} 
                            onClick={() => setAgentIcon(option.name)} 
                            className={`p-3 rounded-lg transition-all ${
                              agentIcon === option.name 
                                ? 'ring-2 ring-[#FF6B6B] ring-offset-2' 
                                : ''
                            } ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <IconComponent className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 颜色选择 */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      颜色
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {colorOptions.map(option => <button key={option.name} onClick={() => setAgentColor(option.value)} className={`h-10 rounded-lg transition-all ${agentColor === option.value ? 'ring-2 ring-[#FF6B6B] ring-offset-2' : ''} ${option.gradient}`} />)}
                    </div>
                  </div>
                </div>
              </div>

            {/* 模型管理标签页 */}
            {activeTab === 'models' && <div className={`space-y-6 ${darkMode ? 'bg-gray-800 rounded-xl p-6' : 'bg-white rounded-xl p-6 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Brain className={`w-6 h-6 ${darkMode ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.models}
                  </h2>
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.modelsDesc}
                </p>
                <ModelManager selectedModel={selectedModel} setSelectedModel={setSelectedModel} availableModels={availableModels} darkMode={darkMode} />
                {formErrors.model && <p className="mt-2 text-sm text-red-500">{formErrors.model}</p>}
              </div>

            {/* 技能管理标签页 */}
            {activeTab === 'skills' && <div className={`space-y-6 ${darkMode ? 'bg-gray-800 rounded-xl p-6' : 'bg-white rounded-xl p-6 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className={`w-6 h-6 ${darkMode ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.skills}
                  </h2>
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.skillsDesc}
                </p>
                <SkillManager availableSkills={availableSkills} darkMode={darkMode} />
              </div>

            {/* 规则配置标签页 */}
            {activeTab === 'rules' && <div className={`space-y-6 ${darkMode ? 'bg-gray-800 rounded-xl p-6' : 'bg-white rounded-xl p-6 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className={`w-6 h-6 ${darkMode ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.rules}
                  </h2>
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.rulesDesc}
                </p>

                {/* 添加新规则 */}
                <div className={`flex gap-2 ${darkMode ? 'bg-gray-700 rounded-lg p-4' : 'bg-gray-50 rounded-lg p-4'}`}>
                  <Input value={newRule} onChange={e => setNewRule(e.target.value)} placeholder={t.addRule} className={darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : ''} />
                  <Button onClick={handleAddRule} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* 规则列表 */}
                <div className="space-y-3">
                  {rules.map((rule, index) => <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(index)} />
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{rule.name}</span>
                      </div>
                      <Button onClick={() => handleDeleteRule(index)} variant="ghost" size="icon" className={darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>)}
                </div>
                {formErrors.rules && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.rules}</p>
                )}
              </div>}
                      <Button onClick={() => handleDeleteRule(index)} variant="ghost" size="icon" className={darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>)}
                </div>
              </div>}

            {/* 知识库标签页 */}
            {activeTab === 'rag' && <div className={`space-y-6 ${darkMode ? 'bg-gray-800 rounded-xl p-6' : 'bg-white rounded-xl p-6 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Database className={`w-6 h-6 ${darkMode ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.rag}
                  </h2>
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.ragDesc}
                </p>

                {/* RAG 开关 */}
                <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t.ragEnabled}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.ragEnabledDesc}
                    </p>
                  </div>
                  <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
                </div>

                {/* RAG 源列表 */}
                {ragEnabled && <div className="space-y-3">
                    {ragSources.map((source, index) => <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <Switch checked={source.enabled} onCheckedChange={() => handleToggleRagSource(index)} />
                          <span className={darkMode ? 'text-white' : 'text-gray-900'}>{source.name}</span>
                        </div>
                        <Check className={`w-5 h-5 ${source.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>)}
                  </div>}

                {/* 添加知识库 */}
                <div className={`flex gap-2 ${darkMode ? 'bg-gray-700 rounded-lg p-4' : 'bg-gray-50 rounded-lg p-4'}`}>
                  <Input value={newKnowledgeBase} onChange={e => setNewKnowledgeBase(e.target.value)} placeholder={t.addKnowledge} className={darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : ''} />
                  <Button onClick={handleAddKnowledgeBase} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* 知识库列表 */}
                <div className="space-y-3">
                  {agentKnowledgeBases.map((kb, index) => <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <Switch checked={kb.enabled} onCheckedChange={() => handleToggleKnowledgeBase(index)} />
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{kb.name}</span>
                      </div>
                      <Button onClick={() => handleDeleteKnowledgeBase(index)} variant="ghost" size="icon" className={darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>)}
                </div>
              </div>}

            {/* MCP 标签页 */}
            {activeTab === 'mcp' && <div className={`space-y-6 ${darkMode ? 'bg-gray-800 rounded-xl p-6' : 'bg-white rounded-xl p-6 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Code className={`w-6 h-6 ${darkMode ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.mcp}
                  </h2>
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.mcpDesc}
                </p>

                {/* 添加 MCP 服务 */}
                <div className={`flex gap-2 ${darkMode ? 'bg-gray-700 rounded-lg p-4' : 'bg-gray-50 rounded-lg p-4'}`}>
                  <Input value={newMcpServer} onChange={e => setNewMcpServer(e.target.value)} placeholder={t.addMcp} className={darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : ''} />
                  <Button onClick={handleAddMcpServer} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* MCP 服务列表 */}
                <div className="space-y-3">
                  {mcpServers.map((server, index) => <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <Switch checked={server.enabled} onCheckedChange={() => handleToggleMcpServer(index)} />
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{server.name}</span>
                      </div>
                      <Button onClick={() => handleDeleteMcpServer(index)} variant="ghost" size="icon" className={darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 TabBar */}
      <TabBar />
    </div>
  );
}
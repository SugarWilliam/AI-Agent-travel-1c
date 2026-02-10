// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Settings, Brain, Database, FileText, Image as ImageIcon, Link2, ChevronRight, Plus, Trash2, Check, Zap, Code, Languages, Sun, Moon } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components/ui';

import TabBar from '@/components/TabBar';
import { ModelManager } from '@/components/ModelManager';
import { SkillManager } from '@/components/SkillManager';
import { useGlobalSettings } from '@/components/GlobalSettings';

// 语言配置
const translations = {
  zh: {
    title: 'AI配置',
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
    cancel: '取消'
  },
  en: {
    title: 'AI Configuration',
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
    cancel: 'Cancel'
  }
};
export default function AIConfig(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [aiConfig, setAiConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Agent 编辑模式
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentId, setAgentId] = useState(null);

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
    id: 1,
    name: '安全优先',
    enabled: true,
    description: '优先推荐安全的旅行方案'
  }, {
    id: 2,
    name: '预算控制',
    enabled: true,
    description: '在预算范围内推荐方案'
  }, {
    id: 3,
    name: '环保出行',
    enabled: false,
    description: '优先推荐环保的交通方式'
  }]);
  const [ragEnabled, setRagEnabled] = useState(true);
  const [ragSources, setRagSources] = useState([{
    id: 1,
    name: '旅游攻略库',
    enabled: true,
    type: 'database',
    agentTypes: ['travel', 'planning'],
    description: '包含全球热门旅游目的地的详细攻略'
  }, {
    id: 2,
    name: '用户历史记录',
    enabled: true,
    type: 'database',
    agentTypes: ['travel', 'planning', 'companion'],
    description: '用户的旅行历史和偏好记录'
  }, {
    id: 3,
    name: '实时天气数据',
    enabled: false,
    type: 'api',
    agentTypes: ['travel', 'planning'],
    description: '全球各地的实时天气信息'
  }, {
    id: 4,
    name: '酒店信息库',
    enabled: true,
    type: 'database',
    agentTypes: ['travel', 'planning'],
    description: '全球酒店信息、价格、评价等'
  }, {
    id: 5,
    name: '景点信息库',
    enabled: true,
    type: 'database',
    agentTypes: ['travel', 'planning', 'companion'],
    description: '景点介绍、门票、开放时间等'
  }, {
    id: 6,
    name: '交通信息库',
    enabled: true,
    type: 'database',
    agentTypes: ['travel', 'planning'],
    description: '航班、火车、公交等交通信息'
  }, {
    id: 7,
    name: '美食推荐库',
    enabled: false,
    type: 'database',
    agentTypes: ['travel', 'companion'],
    description: '当地餐厅、美食推荐和评价'
  }, {
    id: 8,
    name: '购物指南库',
    enabled: false,
    type: 'database',
    agentTypes: ['travel', 'companion'],
    description: '购物场所、特产、折扣信息'
  }, {
    id: 9,
    name: '紧急服务库',
    enabled: true,
    type: 'database',
    agentTypes: ['travel', 'companion'],
    description: '医院、警察、大使馆等紧急信息'
  }, {
    id: 10,
    name: '当地文化库',
    enabled: false,
    type: 'database',
    agentTypes: ['travel', 'companion'],
    description: '当地文化、习俗、礼仪等'
  }, {
    id: 11,
    name: '货币汇率库',
    enabled: false,
    type: 'api',
    agentTypes: ['travel', 'planning'],
    description: '实时货币汇率信息'
  }, {
    id: 12,
    name: '签证信息库',
    enabled: false,
    type: 'database',
    agentTypes: ['travel', 'planning'],
    description: '各国签证要求、流程等'
  }, {
    id: 13,
    name: '保险信息库',
    enabled: false,
    type: 'database',
    agentTypes: ['travel', 'planning'],
    description: '旅游保险产品、理赔流程等'
  }]);

  // Agent 知识库关联配置
  const [agentKnowledgeBases, setAgentKnowledgeBases] = useState([{
    id: 1,
    agentType: 'travel',
    agentName: '旅行规划助手',
    knowledgeBases: ['旅游攻略库', '用户历史记录', '酒店信息库', '景点信息库', '交通信息库', '紧急服务库'],
    ragEnabled: true,
    priority: 1
  }, {
    id: 2,
    agentType: 'planning',
    agentName: '行程规划助手',
    knowledgeBases: ['旅游攻略库', '实时天气数据', '酒店信息库', '景点信息库', '交通信息库', '货币汇率库', '签证信息库', '保险信息库'],
    ragEnabled: true,
    priority: 2
  }, {
    id: 3,
    agentType: 'companion',
    agentName: '旅行伴侣',
    knowledgeBases: ['用户历史记录', '景点信息库', '美食推荐库', '购物指南库', '紧急服务库', '当地文化库'],
    ragEnabled: false,
    priority: 3
  }]);
  const [mcpServers, setMcpServers] = useState([{
    id: 1,
    name: '高德地图',
    url: 'https://mcp.amap.com',
    enabled: true,
    description: '提供地图导航、路线规划、POI搜索等服务'
  }, {
    id: 2,
    name: '携程',
    url: 'https://mcp.ctrip.com',
    enabled: true,
    description: '提供酒店预订、机票查询、景点门票等服务'
  }, {
    id: 3,
    name: '飞猪',
    url: 'https://mcp.fliggy.com',
    enabled: true,
    description: '提供旅行产品、度假套餐、机票酒店等服务'
  }, {
    id: 4,
    name: '马蜂窝',
    url: 'https://mcp.mafengwo.cn',
    enabled: true,
    description: '提供旅游攻略、游记分享、景点推荐等服务'
  }, {
    id: 5,
    name: '天气服务',
    url: 'https://api.weather.com',
    enabled: true,
    description: '提供实时天气、天气预报、气象预警等服务'
  }, {
    id: 6,
    name: '汇率转换',
    url: 'https://api.exchange.com',
    enabled: true,
    description: '提供实时汇率、货币换算、汇率查询等服务'
  }]);
  const [outputFormats, setOutputFormats] = useState({
    document: true,
    miniprogram: true,
    image: true
  });
  useEffect(() => {
    // 检查是否是编辑模式
    const mode = props.$w.page.dataset.params.mode;
    const agentIdParam = props.$w.page.dataset.params.agentId;
    if (mode === 'edit' && agentIdParam) {
      setIsEditMode(true);
      setAgentId(agentIdParam);
      loadAgentConfig(agentIdParam);
    } else {
      loadAIConfig();
    }

    // 加载可用的配置数据
    loadAvailableConfigurations();
  }, []);
  const loadAIConfig = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getAIConfig',
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result.result.success && result.result.data) {
        setAiConfig(result.result.data);
        if (result.result.data.modelId) {
          setSelectedModel(result.result.data.modelId);
        }
        if (result.result.data.ragEnabled !== undefined) {
          setRagEnabled(result.result.data.ragEnabled);
        }
        if (result.result.data.ragSources) {
          setRagSources(result.result.data.ragSources);
        }
        if (result.result.data.agentKnowledgeBases) {
          setAgentKnowledgeBases(result.result.data.agentKnowledgeBases);
        }
      }
    } catch (error) {
      console.error('加载AI配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

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
        setSelectedModel(agent.model || 'gpt-4');
        setRagEnabled(agent.ragEnabled || false);
        setRagSources(agent.ragSources || []);
        setRules(agent.rules || []);
        setMcpServers(agent.mcpServers || []);
      }
    } catch (error) {
      console.error('加载Agent配置失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载Agent配置',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 加载可用的配置数据
  const loadAvailableConfigurations = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();

      // 加载可用模型
      try {
        const modelsResult = await db.collection('llm_models').where({
          status: 'active'
        }).get();
        setAvailableModels(modelsResult.data || []);
      } catch (e) {
        console.log('加载模型失败，使用默认列表');
      }

      // 加载可用规则
      try {
        const rulesResult = await db.collection('Rule').where({
          isEnabled: true
        }).get();
        setAvailableRules(rulesResult.data || []);
      } catch (e) {
        console.log('加载规则失败，使用默认列表');
      }

      // 加载可用知识库
      try {
        const kbResult = await db.collection('KnowledgeBase').where({
          isEnabled: true
        }).get();
        setAvailableKnowledgeBases(kbResult.data || []);
      } catch (e) {
        console.log('加载知识库失败，使用默认列表');
      }
    } catch (error) {
      console.error('加载配置数据失败:', error);
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleSave = async () => {
    try {
      if (isEditMode && editingAgent) {
        // 保存 Agent 配置
        const agentData = {
          ...editingAgent,
          model: selectedModel,
          ragEnabled: ragEnabled,
          ragSources: ragSources.filter(s => s.enabled).map(s => s.name),
          rules: rules.filter(r => r.enabled).map(r => r.name),
          mcpServers: mcpServers.filter(s => s.enabled).map(s => ({
            name: s.name,
            url: s.url
          })),
          updatedAt: new Date().toISOString()
        };
        const tcb = await props.$w.cloud.getCloudInstance();
        const db = tcb.database();
        try {
          await db.collection('Agent').doc(agentId).update(agentData);
        } catch (dbError) {
          await db.collection('AIConfig').doc(agentId).update(agentData);
        }
        toast({
          title: 'Agent已更新',
          description: `${editingAgent.name} 配置已保存`,
          variant: 'default'
        });

        // 返回列表页
        setTimeout(() => {
          props.$w.utils.navigateBack();
        }, 1000);
      } else {
        // 保存全局配置
        const configData = {
          userId: props.$w.auth.currentUser?.userId || 'anonymous',
          modelId: selectedModel,
          modelName: aiConfig?.modelName || 'GPT-4',
          provider: aiConfig?.provider || 'OpenAI',
          isDefault: true,
          temperature: 0.7,
          maxTokens: 4096,
          systemPrompt: '你是一个智能旅行助手',
          capabilities: {
            documentParsing: true,
            imageRecognition: true,
            multimodal: true,
            webScraping: true
          },
          ragEnabled: ragEnabled,
          ragSources: ragSources,
          agentKnowledgeBases: agentKnowledgeBases
        };
        const result = await props.$w.cloud.callFunction({
          name: 'ai-assistant',
          data: {
            action: 'saveAIConfig',
            data: configData
          }
        });
        if (result.result.success) {
          toast({
            title: '配置已保存',
            description: 'AI配置已更新',
            variant: 'default'
          });
        } else {
          toast({
            title: '保存失败',
            description: result.result.error || '请重试',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      toast({
        title: '保存失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };
  const toggleRule = id => {
    setRules(rules.map(rule => rule.id === id ? {
      ...rule,
      enabled: !rule.enabled
    } : rule));
  };
  const toggleRagSource = id => {
    setRagSources(ragSources.map(source => source.id === id ? {
      ...source,
      enabled: !source.enabled
    } : source));
  };
  const toggleAgentRag = id => {
    setAgentKnowledgeBases(agentKnowledgeBases.map(agent => agent.id === id ? {
      ...agent,
      ragEnabled: !agent.ragEnabled
    } : agent));
  };
  const updateAgentKnowledgeBases = (id, knowledgeBases) => {
    setAgentKnowledgeBases(agentKnowledgeBases.map(agent => agent.id === id ? {
      ...agent,
      knowledgeBases
    } : agent));
  };
  const toggleMcpServer = id => {
    setMcpServers(mcpServers.map(server => server.id === id ? {
      ...server,
      enabled: !server.enabled
    } : server));
  };
  const addMcpServer = () => {
    const newServer = {
      id: Date.now(),
      name: '新服务',
      url: '',
      enabled: true
    };
    setMcpServers([...mcpServers, newServer]);
  };
  const removeMcpServer = id => {
    setMcpServers(mcpServers.filter(server => server.id !== id));
  };
  const updateMcpServer = (id, field, value) => {
    setMcpServers(mcpServers.map(server => server.id === id ? {
      ...server,
      [field]: value
    } : server));
  };
  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-[#FFF9F0]'}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
    </div>;
  }
  return <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-[#FFF9F0]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {isEditMode ? `${editingAgent?.name || '编辑 Agent'}` : t.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Left Sidebar Navigation */}
        <div className={`w-64 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4">
            <nav className="space-y-2">
              {[{
              id: 'models',
              label: t.models,
              icon: Brain
            }, {
              id: 'skills',
              label: t.skills,
              icon: Zap
            }, {
              id: 'rules',
              label: t.rules,
              icon: FileText
            }, {
              id: 'rag',
              label: t.rag,
              icon: Database
            }, {
              id: 'mcp',
              label: t.mcp,
              icon: Code
            }].map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white shadow-md' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>)}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6">
          <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Model Management */}
            {activeTab === 'models' && <div className="space-y-6">
                <div className={`border-b pb-4 ${darkMode ? 'border-gray-700' : ''}`}>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`} style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    {t.models}
                  </h2>
                  <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.modelsDesc}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        选择AI模型
                      </label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className={`w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                          <SelectValue placeholder="选择AI模型" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.length > 0 ? availableModels.map(model => <SelectItem key={model._id} value={model.modelId}>
                              {model.modelName} {model.isRecommended && '⭐'}
                            </SelectItem>) : <>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                              <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                              <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                              <SelectItem value="glm-4">GLM-4</SelectItem>
                              <SelectItem value="moonshot-v1">Kimi (Moonshot)</SelectItem>
                              <SelectItem value="custom">自定义模型</SelectItem>
                            </>}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedModel === 'custom' && <div className={`space-y-3 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {language === 'zh' ? '自定义模型ID' : 'Custom Model ID'}
                          </label>
                          <Input placeholder={language === 'zh' ? '输入自定义模型ID，如: gpt-4-custom' : 'Enter custom model ID, e.g., gpt-4-custom'} value={aiConfig?.modelId || ''} onChange={e => setAiConfig(prev => ({
                      ...prev,
                      modelId: e.target.value
                    }))} className={darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''} />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            API Key
                          </label>
                          <Input type="password" placeholder={language === 'zh' ? '输入API密钥' : 'Enter API Key'} value={aiConfig?.apiKey || ''} onChange={e => setAiConfig(prev => ({
                      ...prev,
                      apiKey: e.target.value
                    }))} className={darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''} />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            API Endpoint ({language === 'zh' ? '可选' : 'Optional'})
                          </label>
                          <Input placeholder={language === 'zh' ? '输入API端点，如: https://api.openai.com/v1' : 'Enter API endpoint, e.g., https://api.openai.com/v1'} value={aiConfig?.apiEndpoint || ''} onChange={e => setAiConfig(prev => ({
                      ...prev,
                      apiEndpoint: e.target.value
                    }))} className={darkMode ? 'bg-gray-800 border-gray-600 text-white' : ''} />
                        </div>
                      </div>}
                  </div>
                  
                  <div className="space-y-4">
                    <ModelManager $w={props.$w} />
                  </div>
                </div>
              </div>}

            {/* Skills Management */}
            {activeTab === 'skills' && <div className="space-y-6">
                <div className={`border-b pb-4 ${darkMode ? 'border-gray-700' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`} style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                        {t.skills}
                      </h2>
                      <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.skillsDesc}</p>
                    </div>
                    <Button onClick={() => {
                  toast({
                    title: '新增技能',
                    description: '请在下方技能管理区域添加新技能'
                  });
                }} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      新增技能
                    </Button>
                  </div>
                </div>
                <SkillManager $w={props.$w} />
              </div>}

            {/* Rules Configuration */}
            {activeTab === 'rules' && <div className="space-y-6">
                <div className={`border-b pb-4 ${darkMode ? 'border-gray-700' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`} style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                        {t.rules}
                      </h2>
                      <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.rulesDesc}</p>
                    </div>
                    <Button onClick={() => {
                  const newRule = {
                    id: Date.now(),
                    name: '新规则',
                    enabled: true,
                    description: '请输入规则描述'
                  };
                  setRules([...rules, newRule]);
                  toast({
                    title: '规则已添加',
                    description: '新规则已成功添加到规则列表'
                  });
                }} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      新增规则
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {isEditMode ?
              // 编辑模式：显示可用规则供选择
              availableRules.length > 0 ? availableRules.map(rule => <div key={rule._id} className={`p-4 rounded-lg hover:shadow-md transition-shadow border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rule.name}</h4>
                            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rule.description}</p>
                          </div>
                          <Switch checked={rules.some(r => r.name === rule.name)} onCheckedChange={() => {
                    if (rules.some(r => r.name === rule.name)) {
                      setRules(rules.filter(r => r.name !== rule.name));
                    } else {
                      setRules([...rules, {
                        name: rule.name,
                        enabled: true,
                        description: rule.description
                      }]);
                    }
                  }} />
                        </div>
                      </div>) : <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>暂无可用规则</p>
                      </div> :
              // 全局配置模式：显示默认规则
              rules.map(rule => <div key={rule.id} className={`p-4 rounded-lg hover:shadow-md transition-shadow border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rule.name}</h4>
                            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rule.description}</p>
                          </div>
                          <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                        </div>
                      </div>)}
                </div>
              </div>}

            {/* Knowledge Base */}
            {activeTab === 'rag' && <div className="space-y-6">
                <div className={`border-b pb-4 ${darkMode ? 'border-gray-700' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`} style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                        {t.rag}
                      </h2>
                      <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.ragDesc}</p>
                    </div>
                    <Button onClick={() => {
                  const newSource = {
                    id: Date.now(),
                    name: '新知识库',
                    enabled: true,
                    type: 'database'
                  };
                  setRagSources([...ragSources, newSource]);
                  toast({
                    title: '知识库已添加',
                    description: '新知识库已成功添加到知识库列表'
                  });
                }} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      新增知识库
                    </Button>
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`}>知识库增强</h3>
                    <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
                  </div>
                  
                  {ragEnabled && <div className="space-y-3">
                      {isEditMode ?
                // 编辑模式：显示可用知识库供选择
                availableKnowledgeBases.length > 0 ? availableKnowledgeBases.map(kb => <div key={kb._id} className={`flex items-start justify-between p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{kb.name}</h4>
                                <span className={`px-2 py-0.5 rounded text-xs ${kb.type === 'database' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                  {kb.type === 'database' ? '数据库' : 'API'}
                                </span>
                              </div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kb.description}</p>
                            </div>
                            <Switch checked={ragSources.some(s => s.name === kb.name)} onCheckedChange={() => {
                    if (ragSources.some(s => s.name === kb.name)) {
                      setRagSources(ragSources.filter(s => s.name !== kb.name));
                    } else {
                      setRagSources([...ragSources, {
                        name: kb.name,
                        enabled: true,
                        type: kb.type,
                        description: kb.description
                      }]);
                    }
                  }} />
                          </div>) : <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>暂无可用知识库</p>
                          </div> :
                // 全局配置模式：显示默认知识库
                ragSources.map(source => <div key={source.id} className={`flex items-start justify-between p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{source.name}</h4>
                                <span className={`px-2 py-0.5 rounded text-xs ${source.type === 'database' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                  {source.type === 'database' ? '数据库' : 'API'}
                                </span>
                              </div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{source.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch checked={source.enabled} onCheckedChange={() => toggleRagSource(source.id)} />
                              <Button variant="ghost" size="sm" onClick={() => {
                      setRagSources(ragSources.filter(s => s.id !== source.id));
                      toast({
                        title: '知识库已删除',
                        description: `${source.name} 已从知识库列表中移除`
                      });
                    }} className={`text-red-600 hover:text-red-700 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>)}
                    </div>}
                </div>
                
                {/* Agent 知识库关联配置 */}
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`}>Agent 知识库关联</h3>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>配置每个 Agent 使用的知识库</span>
                  </div>
                  
                  <div className="space-y-3">
                    {agentKnowledgeBases.map(agent => <div key={agent.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.agentName}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>类型: {agent.agentType}</p>
                          </div>
                          <Switch checked={agent.ragEnabled} onCheckedChange={() => toggleAgentRag(agent.id)} />
                        </div>
                        
                        {agent.ragEnabled && <div className="space-y-2">
                            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>关联的知识库</label>
                            <div className="flex flex-wrap gap-2">
                              {ragSources.filter(source => source.enabled).map(source => <button key={source.id} onClick={() => {
                        const currentKBs = agent.knowledgeBases || [];
                        const newKBs = currentKBs.includes(source.name) ? currentKBs.filter(kb => kb !== source.name) : [...currentKBs, source.name];
                        updateAgentKnowledgeBases(agent.id, newKBs);
                      }} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${agent.knowledgeBases?.includes(source.name) ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                  {source.name}
                                </button>)}
                            </div>
                          </div>}
                      </div>)}
                  </div>
                </div>
              </div>}

            {/* MCP Configuration */}
            {activeTab === 'mcp' && <div className="space-y-6">
                <div className={`border-b pb-4 ${darkMode ? 'border-gray-700' : ''}`}>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`} style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    {t.mcp}
                  </h2>
                  <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.mcpDesc}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D3436]'}`}>{language === 'zh' ? '外部服务集成' : 'External Service Integration'}</h3>
                  <Button onClick={addMcpServer} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'zh' ? '添加服务' : 'Add Service'}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {isEditMode ?
              // 编辑模式：显示可用 MCP 服务器供选择
              mcpServers.map((server, index) => <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{server.name}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{server.url}</p>
                          </div>
                          <Switch checked={server.enabled} onCheckedChange={() => toggleMcpServer(index)} />
                        </div>
                      </div>) :
              // 全局配置模式：显示可编辑的 MCP 服务器
              mcpServers.map(server => <div key={server.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <Input value={server.name} onChange={e => updateMcpServer(server.id, 'name', e.target.value)} placeholder="服务名称" className={`flex-1 mr-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} />
                          <Switch checked={server.enabled} onCheckedChange={() => toggleMcpServer(server.id)} />
                        </div>
                        <Input value={server.url} onChange={e => updateMcpServer(server.id, 'url', e.target.value)} placeholder="服务URL" className={`mb-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} />
                        {server.description && <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {server.description}
                          </p>}
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm" onClick={() => removeMcpServer(server.id)} className={`text-red-600 hover:text-red-700 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            {language === 'zh' ? '删除' : 'Delete'}
                          </Button>
                        </div>
                      </div>)}
                </div>
              </div>}
          </div>
        </div>
      </div>

      <TabBar />
    </div>;
}
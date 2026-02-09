// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Settings, Brain, Database, FileText, Image as ImageIcon, Link2, ChevronRight, Plus, Trash2, Check, Zap, Code } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components/ui';

import TabBar from '@/components/TabBar';
import { ModelManager } from '@/components/ModelManager';
import { SkillManager } from '@/components/SkillManager';
export default function AIConfig(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [aiConfig, setAiConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [modelSearchTerm, setModelSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [filteredModels, setFilteredModels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    category: 'custom',
    capabilities: [],
    isActive: true
  });
  const [ruleSearchTerm, setRuleSearchTerm] = useState('');
  const [ruleFilter, setRuleFilter] = useState('all');
  const [filteredRules, setFilteredRules] = useState([]);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: 'behavior',
    isActive: true
  });

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
    type: 'database'
  }, {
    id: 2,
    name: '用户历史记录',
    enabled: true,
    type: 'database'
  }, {
    id: 3,
    name: '实时天气数据',
    enabled: false,
    type: 'api'
  }]);
  const [mcpServers, setMcpServers] = useState([{
    id: 1,
    name: '天气服务',
    url: 'https://api.weather.com',
    enabled: true
  }, {
    id: 2,
    name: '汇率转换',
    url: 'https://api.exchange.com',
    enabled: true
  }]);
  const [outputFormats, setOutputFormats] = useState({
    document: true,
    miniprogram: true,
    image: true
  });
  useEffect(() => {
    loadAIConfig();
    loadModels();
  }, []);

  // 模型筛选逻辑
  useEffect(() => {
    let filtered = models;

    // 搜索筛选
    if (modelSearchTerm) {
      filtered = filtered.filter(model => model.modelName.toLowerCase().includes(modelSearchTerm.toLowerCase()) || model.description.toLowerCase().includes(modelSearchTerm.toLowerCase()) || model.provider.toLowerCase().includes(modelSearchTerm.toLowerCase()));
    }

    // 类型筛选
    if (modelFilter !== 'all') {
      switch (modelFilter) {
        case 'recommended':
          filtered = filtered.filter(model => model.isRecommended);
          break;
        case 'multimodal':
          filtered = filtered.filter(model => model.capabilities?.multimodal);
          break;
        case 'cost-effective':
          filtered = filtered.filter(model => model.costLevel === 'low');
          break;
      }
    }
    setFilteredModels(filtered);
  }, [models, modelSearchTerm, modelFilter]);
  const loadModels = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getModels',
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result.result.success && result.result.data) {
        // 添加DeepSeek、GLM、Kimi等模型
        const enhancedModels = [...result.result.data, {
          _id: 'deepseek-chat',
          modelId: 'deepseek-chat',
          modelName: 'DeepSeek Chat',
          provider: '深度求索',
          description: '中文对话能力强，代码生成优秀',
          costLevel: 'low',
          maxTokens: 4096,
          isRecommended: true,
          capabilities: {
            documentParsing: true,
            imageRecognition: false,
            multimodal: false,
            webScraping: true
          },
          status: 'active'
        }, {
          _id: 'glm-4',
          modelId: 'glm-4',
          modelName: 'GLM-4',
          provider: '智谱AI',
          description: '中文理解能力强，支持长文本',
          costLevel: 'medium',
          maxTokens: 8192,
          isRecommended: false,
          capabilities: {
            documentParsing: true,
            imageRecognition: true,
            multimodal: true,
            webScraping: true
          },
          status: 'active'
        }, {
          _id: 'kimi-chat',
          modelId: 'kimi-chat',
          modelName: 'Kimi Chat',
          provider: '月之暗面',
          description: '超长上下文，文件处理能力强',
          costLevel: 'medium',
          maxTokens: 200000,
          isRecommended: true,
          capabilities: {
            documentParsing: true,
            imageRecognition: true,
            multimodal: true,
            webScraping: true
          },
          status: 'active'
        }];
        setModels(enhancedModels);
        setFilteredModels(enhancedModels);
      }
    } catch (error) {
      console.error('加载模型失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载AI模型列表',
        variant: 'destructive'
      });
    }
  };
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
      }
    } catch (error) {
      console.error('加载AI配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 技能筛选逻辑
  useEffect(() => {
    let filtered = skills;

    // 搜索筛选
    if (skillSearchTerm) {
      filtered = filtered.filter(skill => skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) || skill.description.toLowerCase().includes(skillSearchTerm.toLowerCase()) || skill.category.toLowerCase().includes(skillSearchTerm.toLowerCase()));
    }

    // 分类筛选
    if (skillFilter !== 'all') {
      filtered = filtered.filter(skill => skill.category === skillFilter);
    }
    setFilteredSkills(filtered);
  }, [skills, skillSearchTerm, skillFilter]);

  // 规则筛选逻辑
  useEffect(() => {
    let filtered = rules;

    // 搜索筛选
    if (ruleSearchTerm) {
      filtered = filtered.filter(rule => rule.name.toLowerCase().includes(ruleSearchTerm.toLowerCase()) || rule.description.toLowerCase().includes(ruleSearchTerm.toLowerCase()));
    }

    // 状态筛选
    if (ruleFilter !== 'all') {
      switch (ruleFilter) {
        case 'enabled':
          filtered = filtered.filter(rule => rule.enabled);
          break;
        case 'disabled':
          filtered = filtered.filter(rule => !rule.enabled);
          break;
      }
    }
    setFilteredRules(filtered);
  }, [rules, ruleSearchTerm, ruleFilter]);

  // 初始化默认技能
  useEffect(() => {
    const defaultSkills = [{
      id: 'travel-planning',
      name: '旅行规划',
      description: '智能规划旅行路线，推荐景点和行程安排',
      category: 'travel',
      capabilities: ['路线规划', '景点推荐', '时间优化'],
      isActive: true
    }, {
      id: 'weather-query',
      name: '天气查询',
      description: '实时查询天气信息，提供出行建议',
      category: 'weather',
      capabilities: ['实时天气', '预报查询', '出行建议'],
      isActive: true
    }, {
      id: 'translation',
      name: '翻译助手',
      description: '多语言翻译，支持语音和文字翻译',
      category: 'language',
      capabilities: ['多语言', '语音翻译', '文字翻译'],
      isActive: true
    }, {
      id: 'image-analysis',
      name: '图像分析',
      description: '分析图片内容，识别场景和物体',
      category: 'vision',
      capabilities: ['场景识别', '物体检测', '内容分析'],
      isActive: false
    }, {
      id: 'document-processing',
      name: '文档处理',
      description: '处理各类文档，提取关键信息',
      category: 'document',
      capabilities: ['文档解析', '信息提取', '格式转换'],
      isActive: true
    }, {
      id: 'search-query',
      name: '搜索查询',
      description: '智能搜索，整合多源信息',
      category: 'search',
      capabilities: ['多源搜索', '信息整合', '结果优化'],
      isActive: true
    }, {
      id: 'calculation',
      name: '计算分析',
      description: '复杂计算和数据分析',
      category: 'analysis',
      capabilities: ['数学计算', '数据分析', '图表生成'],
      isActive: true
    }, {
      id: 'creative-writing',
      name: '创意写作',
      description: '创意内容生成，文案创作',
      category: 'creative',
      capabilities: ['文案创作', '内容生成', '风格模仿'],
      isActive: false
    }];
    setSkills(defaultSkills);
  }, []);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleSave = async () => {
    try {
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
        }
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
    return <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
    </div>;
  }
  return <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              AI配置
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <nav className="space-y-2">
              {[{
              id: 'models',
              label: '模型管理',
              icon: Brain
            }, {
              id: 'skills',
              label: '技能管理',
              icon: Zap
            }, {
              id: 'rules',
              label: '规则配置',
              icon: FileText
            }, {
              id: 'rag',
              label: '知识库',
              icon: Database
            }, {
              id: 'mcp',
              label: 'MCP',
              icon: Code
            }].map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>)}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Model Management */}
            {activeTab === 'models' && <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    模型管理
                  </h2>
                  <p className="text-gray-600 mt-1">配置和管理AI模型设置</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">选择AI模型</h3>
                      <div className="flex gap-2">
                        <Input placeholder="搜索模型..." className="w-48" value={modelSearchTerm} onChange={e => setModelSearchTerm(e.target.value)} />
                        <Select value={modelFilter} onValueChange={setModelFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="筛选" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部</SelectItem>
                            <SelectItem value="recommended">推荐</SelectItem>
                            <SelectItem value="multimodal">多模态</SelectItem>
                            <SelectItem value="cost-effective">经济</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* 模型列表 - 纵向展开 */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredModels.map(model => <div key={model.modelId} className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedModel === model.modelId ? 'border-[#FF6B6B] bg-gradient-to-r from-[#FF6B6B]/10 to-[#4ECDC4]/10' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedModel(model.modelId)}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{model.modelName}</h4>
                                {model.isRecommended && <span className="px-2 py-1 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white text-xs rounded-full">
                                    推荐
                                  </span>}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                  {model.provider}
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                  {model.maxTokens?.toLocaleString()} tokens
                                </span>
                                <span className={`px-2 py-1 rounded ${model.costLevel === 'low' ? 'bg-green-100 text-green-800' : model.costLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                  {model.costLevel === 'low' ? '经济' : model.costLevel === 'medium' ? '中等' : '高成本'}
                                </span>
                                {model.capabilities?.multimodal && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                    多模态
                                  </span>}
                              </div>
                            </div>
                            <div className="ml-4">
                              {selectedModel === model.modelId ? <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                            </div>
                          </div>
                        </div>)}
                    </div>
                    
                    {selectedModel === 'custom' && <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            自定义模型ID
                          </label>
                          <Input placeholder="输入自定义模型ID，如: gpt-4-custom" value={aiConfig?.modelId || ''} onChange={e => setAiConfig(prev => ({
                      ...prev,
                      modelId: e.target.value
                    }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Key
                          </label>
                          <Input type="password" placeholder="输入API密钥" value={aiConfig?.apiKey || ''} onChange={e => setAiConfig(prev => ({
                      ...prev,
                      apiKey: e.target.value
                    }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Endpoint (可选)
                          </label>
                          <Input placeholder="输入API端点，如: https://api.openai.com/v1" value={aiConfig?.apiEndpoint || ''} onChange={e => setAiConfig(prev => ({
                      ...prev,
                      apiEndpoint: e.target.value
                    }))} />
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
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    技能管理
                  </h2>
                  <p className="text-gray-600 mt-1">配置AI助手的技能和能力</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">AI技能列表</h3>
                    <div className="flex gap-2">
                      <Input placeholder="搜索技能..." className="w-48" value={skillSearchTerm} onChange={e => setSkillSearchTerm(e.target.value)} />
                      <Select value={skillFilter} onValueChange={setSkillFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="分类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部分类</SelectItem>
                          <SelectItem value="travel">旅行规划</SelectItem>
                          <SelectItem value="weather">天气查询</SelectItem>
                          <SelectItem value="language">语言翻译</SelectItem>
                          <SelectItem value="vision">图像分析</SelectItem>
                          <SelectItem value="document">文档处理</SelectItem>
                          <SelectItem value="search">搜索查询</SelectItem>
                          <SelectItem value="analysis">计算分析</SelectItem>
                          <SelectItem value="creative">创意写作</SelectItem>
                          <SelectItem value="custom">自定义</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setShowAddSkillModal(true)} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        新增技能
                      </Button>
                    </div>
                  </div>
                  
                  {/* 技能列表 - 纵向展开 */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredSkills.map(skill => <div key={skill.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded ${skill.category === 'travel' ? 'bg-blue-100 text-blue-800' : skill.category === 'weather' ? 'bg-green-100 text-green-800' : skill.category === 'language' ? 'bg-purple-100 text-purple-800' : skill.category === 'vision' ? 'bg-orange-100 text-orange-800' : skill.category === 'document' ? 'bg-gray-100 text-gray-800' : skill.category === 'search' ? 'bg-cyan-100 text-cyan-800' : skill.category === 'analysis' ? 'bg-yellow-100 text-yellow-800' : skill.category === 'creative' ? 'bg-pink-100 text-pink-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                {skill.category === 'travel' ? '旅行规划' : skill.category === 'weather' ? '天气查询' : skill.category === 'language' ? '语言翻译' : skill.category === 'vision' ? '图像分析' : skill.category === 'document' ? '文档处理' : skill.category === 'search' ? '搜索查询' : skill.category === 'analysis' ? '计算分析' : skill.category === 'creative' ? '创意写作' : '自定义'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {skill.capabilities.map((capability, index) => <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {capability}
                                </span>)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <Switch checked={skill.isActive} onCheckedChange={() => {
                        setSkills(prev => prev.map(s => s.id === skill.id ? {
                          ...s,
                          isActive: !s.isActive
                        } : s));
                      }} />
                          </div>
                        </div>
                      </div>)}
                  </div>
                  
                  {filteredSkills.length === 0 && <div className="text-center py-8">
                      <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">暂无符合条件的技能</p>
                      <p className="text-sm text-gray-400 mt-1">尝试调整搜索条件或添加新技能</p>
                    </div>}
                </div>
              </div>}

            {/* Rules Configuration */}
            {activeTab === 'rules' && <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    规则配置
                  </h2>
                  <p className="text-gray-600 mt-1">设置AI助手的行为规则</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">行为规则</h3>
                    <div className="flex gap-2">
                      <Input placeholder="搜索规则..." className="w-48" value={ruleSearchTerm} onChange={e => setRuleSearchTerm(e.target.value)} />
                      <Select value={ruleFilter} onValueChange={setRuleFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部状态</SelectItem>
                          <SelectItem value="enabled">已启用</SelectItem>
                          <SelectItem value="disabled">已禁用</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setShowAddRuleModal(true)} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        新增规则
                      </Button>
                    </div>
                  </div>
                  
                  {/* 规则列表 - 纵向展开 */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredRules.map(rule => <div key={rule.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded ${rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {rule.enabled ? '已启用' : '已禁用'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{rule.description}</p>
                          </div>
                          <div className="ml-4">
                            <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                          </div>
                        </div>
                      </div>)}
                  </div>
                  
                  {filteredRules.length === 0 && <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">暂无符合条件的规则</p>
                      <p className="text-sm text-gray-400 mt-1">尝试调整搜索条件或添加新规则</p>
                    </div>}
                </div>
              </div>}

            {/* Knowledge Base */}
            {activeTab === 'rag' && <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    知识库
                  </h2>
                  <p className="text-gray-600 mt-1">管理AI助手的知识库资源</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#2D3436]">知识库增强</h3>
                    <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
                  </div>
                  
                  {ragEnabled && <div className="space-y-3">
                      {ragSources.map(source => <div key={source.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{source.name}</h4>
                            <p className="text-sm text-gray-600">类型: {source.type === 'database' ? '数据库' : 'API'}</p>
                          </div>
                          <Switch checked={source.enabled} onCheckedChange={() => toggleRagSource(source.id)} />
                        </div>)}
                    </div>}
                </div>
              </div>}

            {/* MCP Configuration */}
            {activeTab === 'mcp' && <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    MCP
                  </h2>
                  <p className="text-gray-600 mt-1">管理外部服务集成</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2D3436]">外部服务集成</h3>
                  <Button onClick={addMcpServer} className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    添加服务
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {mcpServers.map(server => <div key={server.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Input value={server.name} onChange={e => updateMcpServer(server.id, 'name', e.target.value)} placeholder="服务名称" className="flex-1 mr-3" />
                        <Switch checked={server.enabled} onCheckedChange={() => toggleMcpServer(server.id)} />
                      </div>
                      <Input value={server.url} onChange={e => updateMcpServer(server.id, 'url', e.target.value)} placeholder="服务URL" className="mb-3" />
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => removeMcpServer(server.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-1" />
                          删除
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
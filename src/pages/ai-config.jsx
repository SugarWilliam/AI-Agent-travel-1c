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
      }
    } catch (error) {
      console.error('加载AI配置失败:', error);
    } finally {
      setLoading(false);
    }
  };
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        选择AI模型
                      </label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择AI模型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                          <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                          <SelectItem value="custom">自定义模型</SelectItem>
                        </SelectContent>
                      </Select>
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
                <SkillManager $w={props.$w} />
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
                
                <div className="grid gap-4">
                  {rules.map(rule => <div key={rule.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-lg">{rule.name}</h4>
                          <p className="text-gray-600 mt-1">{rule.description}</p>
                        </div>
                        <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                      </div>
                    </div>)}
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
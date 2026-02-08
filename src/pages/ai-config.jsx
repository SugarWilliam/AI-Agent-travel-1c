// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Settings, Brain, Database, FileText, Image as ImageIcon, Link2, ChevronRight, Plus, Trash2, Check, Zap, Code } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components/ui';

import TabBar from '@/components/TabBar';
import { ModelManager, SkillManager } from '@/components/ModelManager';
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
        <div className="max-w-2xl mx-auto flex items-center gap-3">
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

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md">
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
          label: '外部服务',
          icon: Code
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#FF6B6B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {activeTab === 'models' && <ModelManager $w={props.$w} />}
        
        {activeTab === 'skills' && <SkillManager $w={props.$w} />}

        {activeTab === 'rules' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                行为规则
              </h3>
              <div className="space-y-3">
                {rules.map(rule => <div key={rule.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{rule.name}</h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>)}
              </div>
            </div>
          </div>}

        {activeTab === 'rag' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  知识库增强
                </h3>
                <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
              </div>
              
              {ragEnabled && <div className="space-y-3">
                  {ragSources.map(source => <div key={source.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{source.name}</h4>
                        <p className="text-sm text-gray-600">类型: {source.type === 'database' ? '数据库' : 'API'}</p>
                      </div>
                      <Switch checked={source.enabled} onCheckedChange={() => toggleRagSource(source.id)} />
                    </div>)}
                </div>}
            </div>
          </div>}

        {activeTab === 'mcp' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  外部服务集成
                </h3>
                <Button onClick={addMcpServer} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  添加服务
                </Button>
              </div>
              
              <div className="space-y-3">
                {mcpServers.map(server => <div key={server.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Input value={server.name} onChange={e => updateMcpServer(server.id, 'name', e.target.value)} placeholder="服务名称" className="flex-1 mr-2" />
                      <Switch checked={server.enabled} onCheckedChange={() => toggleMcpServer(server.id)} />
                    </div>
                    <Input value={server.url} onChange={e => updateMcpServer(server.id, 'url', e.target.value)} placeholder="服务URL" className="mb-2" />
                    <Button variant="ghost" size="sm" onClick={() => removeMcpServer(server.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>)}
              </div>
            </div>
          </div>}
      </div>

      {/* Save Button */}
      <div className="p-4 bg-white border-t">
        <div className="max-w-2xl mx-auto">
          <Button onClick={handleSave} className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
            <Check className="w-4 h-4 mr-2" />
            保存配置
          </Button>
        </div>
      </div>

      <TabBar />
    </div>;
}
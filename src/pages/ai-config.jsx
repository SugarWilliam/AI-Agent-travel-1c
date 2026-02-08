// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Settings, Brain, Database, FileText, Image as ImageIcon, Link2, ChevronRight, Plus, Trash2, Check } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function AIConfig(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [skills, setSkills] = useState([{
    id: 1,
    name: '旅行规划',
    enabled: true,
    description: '智能规划旅行路线和行程'
  }, {
    id: 2,
    name: '景点推荐',
    enabled: true,
    description: '根据偏好推荐景点和活动'
  }, {
    id: 3,
    name: '预算计算',
    enabled: true,
    description: '计算旅行预算和费用'
  }, {
    id: 4,
    name: '签证咨询',
    enabled: false,
    description: '提供签证相关信息'
  }]);
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
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleSave = () => {
    toast({
      title: '配置已保存',
      description: 'AI配置已更新',
      variant: 'default'
    });
  };
  const toggleSkill = id => {
    setSkills(skills.map(skill => skill.id === id ? {
      ...skill,
      enabled: !skill.enabled
    } : skill));
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
          label: '模型选择',
          icon: Brain
        }, {
          id: 'skills',
          label: 'Skills',
          icon: FileText
        }, {
          id: 'rules',
          label: '规则',
          icon: FileText
        }, {
          id: 'rag',
          label: 'RAG',
          icon: Database
        }, {
          id: 'mcp',
          label: 'MCP',
          icon: Link2
        }, {
          id: 'output',
          label: '输出',
          icon: ImageIcon
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#FF6B6B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {activeTab === 'models' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                选择AI模型
              </h3>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (推荐)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="claude-2">Claude 2</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="qwen-max">通义千问 Max</SelectItem>
                  <SelectItem value="ernie-bot">文心一言</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                不同模型有不同的能力和成本，请根据需求选择
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                多模态支持
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#4ECDC4]" />
                    <span className="text-sm text-gray-700">图片识别</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#FF6B6B]" />
                    <span className="text-sm text-gray-700">文档解析</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-[#FFE66D]" />
                    <span className="text-sm text-gray-700">网页抓取</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>}

        {activeTab === 'skills' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                AI Skills
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Skills是AI助手的专业能力模块，启用后AI将具备相应能力
              </p>
              <div className="space-y-3">
                {skills.map(skill => <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-[#2D3436]">{skill.name}</h4>
                        {skill.enabled && <Check className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{skill.description}</p>
                    </div>
                    <Switch checked={skill.enabled} onCheckedChange={() => toggleSkill(skill.id)} />
                  </div>)}
              </div>
            </div>
          </div>}

        {activeTab === 'rules' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                AI规则
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                规则控制AI的行为和决策逻辑
              </p>
              <div className="space-y-3">
                {rules.map(rule => <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-[#2D3436]">{rule.name}</h4>
                        {rule.enabled && <Check className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
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
                  RAG检索增强
                </h3>
                <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                RAG让AI能够从外部知识库检索信息，提供更准确的回答
              </p>
              <div className="space-y-3">
                {ragSources.map(source => <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Database className={`w-4 h-4 ${source.type === 'database' ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                        <h4 className="font-semibold text-sm text-[#2D3436]">{source.name}</h4>
                        {source.enabled && <Check className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        类型: {source.type === 'database' ? '数据库' : 'API'}
                      </p>
                    </div>
                    <Switch checked={source.enabled} onCheckedChange={() => toggleRagSource(source.id)} />
                  </div>)}
              </div>
            </div>
          </div>}

        {activeTab === 'mcp' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  MCP服务器
                </h3>
                <Button onClick={addMcpServer} className="bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-lg" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                MCP (Model Context Protocol) 让AI能够调用外部API和服务
              </p>
              <div className="space-y-3">
                {mcpServers.map(server => <div key={server.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-[#FF6B6B]" />
                        <Input value={server.name} onChange={e => updateMcpServer(server.id, 'name', e.target.value)} className="text-sm h-8 w-40" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={server.enabled} onCheckedChange={() => toggleMcpServer(server.id)} />
                        <Button onClick={() => removeMcpServer(server.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Input value={server.url} onChange={e => updateMcpServer(server.id, 'url', e.target.value)} placeholder="服务URL" className="text-sm h-8" />
                  </div>)}
              </div>
            </div>
          </div>}

        {activeTab === 'output' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                输出格式
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                选择AI支持的输出格式
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4ECDC4]" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#2D3436]">移动端文档</h4>
                      <p className="text-xs text-gray-500">PDF、Word等格式</p>
                    </div>
                  </div>
                  <Switch checked={outputFormats.document} onCheckedChange={checked => setOutputFormats({
                ...outputFormats,
                document: checked
              })} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-[#FF6B6B]" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#2D3436]">小程序链接</h4>
                      <p className="text-xs text-gray-500">生成可分享的小程序链接</p>
                    </div>
                  </div>
                  <Switch checked={outputFormats.miniprogram} onCheckedChange={checked => setOutputFormats({
                ...outputFormats,
                miniprogram: checked
              })} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#FFE66D]" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#2D3436]">图片生成</h4>
                      <p className="text-xs text-gray-500">生成旅行攻略图片</p>
                    </div>
                  </div>
                  <Switch checked={outputFormats.image} onCheckedChange={checked => setOutputFormats({
                ...outputFormats,
                image: checked
              })} />
                </div>
              </div>
            </div>
          </div>}
      </div>

      {/* Save Button */}
      <div className="bg-white border-t p-4 max-w-2xl mx-auto w-full">
        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white rounded-xl py-3 font-semibold">
          保存配置
        </Button>
      </div>

      {/* TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
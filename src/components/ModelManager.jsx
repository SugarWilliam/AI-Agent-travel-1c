// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Edit, Trash2, Check, X, Settings, Brain, Database, FileText, Code, Zap, Key, Globe, Lock, Unlock } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from '@/components/ui';

export function ModelManager({
  $w
}) {
  const {
    toast
  } = useToast();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [showApiKey, setShowApiKey] = useState({});
  const [formData, setFormData] = useState({
    modelName: '',
    modelId: '',
    provider: 'OpenAI',
    description: '',
    maxTokens: 4096,
    temperature: 0.7,
    costLevel: 'medium',
    capabilities: {
      documentParsing: true,
      imageRecognition: false,
      multimodal: false,
      webScraping: true
    },
    isRecommended: false,
    status: 'active',
    apiKey: '',
    apiEndpoint: ''
  });
  const providers = ['OpenAI', 'Anthropic', 'Google', '阿里云', '百度', '腾讯', '字节跳动', '月之暗面', '智谱AI', '自定义'];
  const costLevels = ['low', 'medium', 'high'];
  useEffect(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getModels',
          userId: $w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result.result.success) {
        setModels(result.result.data);
      } else {
        toast({
          title: '加载失败',
          description: result.result.error || '无法加载模型列表',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('加载模型失败:', error);
      toast({
        title: '加载失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.modelName || !formData.modelId) {
      toast({
        title: '请填写完整信息',
        description: '模型名称和ID不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      const action = editingModel ? 'updateModel' : 'addModel';
      const data = {
        ...formData,
        userId: $w.auth.currentUser?.userId || 'anonymous',
        owner: $w.auth.currentUser?.userId || 'anonymous'
      };
      if (editingModel) {
        data._id = editingModel._id;
      }
      const result = await $w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action,
          data
        }
      });
      if (result.result.success) {
        toast({
          title: editingModel ? '更新成功' : '添加成功',
          description: `模型 ${formData.modelName} 已${editingModel ? '更新' : '添加'}`,
          variant: 'default'
        });
        setShowAddModal(false);
        setEditingModel(null);
        resetForm();
        loadModels();
      } else {
        toast({
          title: '操作失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('保存模型失败:', error);
      toast({
        title: '操作失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };
  const handleEdit = model => {
    setEditingModel(model);
    setFormData({
      modelName: model.modelName || '',
      modelId: model.modelId || '',
      provider: model.provider || 'OpenAI',
      description: model.description || '',
      maxTokens: model.maxTokens || 4096,
      temperature: model.temperature || 0.7,
      costLevel: model.costLevel || 'medium',
      capabilities: model.capabilities || {
        documentParsing: true,
        imageRecognition: false,
        multimodal: false,
        webScraping: true
      },
      isRecommended: model.isRecommended || false,
      status: model.status || 'active',
      apiKey: model.apiKey || '',
      apiEndpoint: model.apiEndpoint || ''
    });
    setShowAddModal(true);
  };
  const handleDelete = async modelId => {
    try {
      const result = await $w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'deleteModel',
          modelId
        }
      });
      if (result.result.success) {
        toast({
          title: '删除成功',
          description: '模型已删除',
          variant: 'default'
        });
        loadModels();
      } else {
        toast({
          title: '删除失败',
          description: result.result.error || '请重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('删除模型失败:', error);
      toast({
        title: '删除失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    }
  };
  const resetForm = () => {
    setFormData({
      modelName: '',
      modelId: '',
      provider: 'OpenAI',
      description: '',
      maxTokens: 4096,
      temperature: 0.7,
      costLevel: 'medium',
      capabilities: {
        documentParsing: true,
        imageRecognition: false,
        multimodal: false,
        webScraping: true
      },
      isRecommended: false,
      status: 'active',
      apiKey: '',
      apiEndpoint: ''
    });
  };
  const toggleApiKeyVisibility = modelId => {
    setShowApiKey(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };
  const getProviderColor = provider => {
    const colors = {
      'OpenAI': 'bg-green-100 text-green-700',
      'Anthropic': 'bg-orange-100 text-orange-700',
      'Google': 'bg-blue-100 text-blue-700',
      '阿里云': 'bg-purple-100 text-purple-700',
      '百度': 'bg-red-100 text-red-700',
      '腾讯': 'bg-cyan-100 text-cyan-700',
      '字节跳动': 'bg-pink-100 text-pink-700',
      '月之暗面': 'bg-indigo-100 text-indigo-700',
      '智谱AI': 'bg-teal-100 text-teal-700',
      '自定义': 'bg-gray-100 text-gray-700'
    };
    return colors[provider] || 'bg-gray-100 text-gray-700';
  };
  const getCostLevelColor = level => {
    const colors = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };
  if (loading) {
    return <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
      </div>;
  }
  return <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#FF6B6B]" />
          <h3 className="font-bold text-[#2D3436]" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            模型管理
          </h3>
        </div>
        <Button onClick={() => {
        resetForm();
        setEditingModel(null);
        setShowAddModal(true);
      }} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
          <Plus className="w-4 h-4 mr-2" />
          添加模型
        </Button>
      </div>

      {/* Model List */}
      <div className="space-y-3">
        {models.map(model => <div key={model._id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    {model.modelName}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(model.provider)}`}>
                    {model.provider}
                  </span>
                  {model.isRecommended && <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      推荐
                    </span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded ${getCostLevelColor(model.costLevel)}`}>
                    {model.costLevel === 'low' ? '低成本' : model.costLevel === 'medium' ? '中成本' : '高成本'}
                  </span>
                  <span>最大Tokens: {model.maxTokens}</span>
                  <span>温度: {model.temperature}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(model)} className="text-[#FF6B6B] hover:text-[#FF5252]">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(model._id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* API Key Display */}
            {model.apiKey && <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">API Key:</span>
                  <span className="text-xs font-mono text-gray-700 flex-1">
                    {showApiKey[model._id] ? model.apiKey : '••••••••••••••••'}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => toggleApiKeyVisibility(model._id)} className="p-1">
                    {showApiKey[model._id] ? <Unlock className="w-4 h-4 text-gray-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
                  </Button>
                </div>
              </div>}

            {/* API Endpoint Display */}
            {model.apiEndpoint && <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">API Endpoint:</span>
                  <span className="text-xs font-mono text-gray-700 flex-1 truncate">
                    {model.apiEndpoint}
                  </span>
                </div>
              </div>}

            {/* Capabilities */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {model.capabilities?.documentParsing && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    文档解析
                  </span>}
                {model.capabilities?.imageRecognition && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    图像识别
                  </span>}
                {model.capabilities?.multimodal && <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                    多模态
                  </span>}
                {model.capabilities?.webScraping && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    网页抓取
                  </span>}
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${model.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                  {model.status === 'active' ? '● 已启用' : '○ 已禁用'}
                </span>
              </div>
            </div>
          </div>)}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  {editingModel ? '编辑模型' : '添加模型'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
              setShowAddModal(false);
              setEditingModel(null);
              resetForm();
            }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Model Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模型名称 *</label>
                  <Input value={formData.modelName} onChange={e => setFormData({
                ...formData,
                modelName: e.target.value
              })} placeholder="例如: GPT-4" required />
                </div>

                {/* Model ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模型ID *</label>
                  <Input value={formData.modelId} onChange={e => setFormData({
                ...formData,
                modelId: e.target.value
              })} placeholder="例如: gpt-4" required />
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">提供商</label>
                  <Select value={formData.provider} onValueChange={value => setFormData({
                ...formData,
                provider: value
              })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <div className="relative">
                    <Input type={showApiKey['form'] ? 'text' : 'password'} value={formData.apiKey} onChange={e => setFormData({
                  ...formData,
                  apiKey: e.target.value
                })} placeholder="输入API密钥" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowApiKey(prev => ({
                  ...prev,
                  form: !prev.form
                }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                      {showApiKey['form'] ? <Unlock className="w-4 h-4 text-gray-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
                    </Button>
                  </div>
                </div>

                {/* API Endpoint */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                  <Input value={formData.apiEndpoint} onChange={e => setFormData({
                ...formData,
                apiEndpoint: e.target.value
              })} placeholder="https://api.example.com/v1" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <Textarea value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} placeholder="模型描述" rows={2} />
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最大Tokens</label>
                  <Input type="number" value={formData.maxTokens} onChange={e => setFormData({
                ...formData,
                maxTokens: parseInt(e.target.value) || 4096
              })} placeholder="4096" />
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">温度参数 (0-2)</label>
                  <Input type="number" step="0.1" min="0" max="2" value={formData.temperature} onChange={e => setFormData({
                ...formData,
                temperature: parseFloat(e.target.value) || 0.7
              })} placeholder="0.7" />
                </div>

                {/* Cost Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">成本等级</label>
                  <Select value={formData.costLevel} onValueChange={value => setFormData({
                ...formData,
                costLevel: value
              })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {costLevels.map(level => <SelectItem key={level} value={level}>
                          {level === 'low' ? '低成本' : level === 'medium' ? '中成本' : '高成本'}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Capabilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">能力配置</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">文档解析</span>
                      <Switch checked={formData.capabilities.documentParsing} onCheckedChange={checked => setFormData({
                    ...formData,
                    capabilities: {
                      ...formData.capabilities,
                      documentParsing: checked
                    }
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">图像识别</span>
                      <Switch checked={formData.capabilities.imageRecognition} onCheckedChange={checked => setFormData({
                    ...formData,
                    capabilities: {
                      ...formData.capabilities,
                      imageRecognition: checked
                    }
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">多模态</span>
                      <Switch checked={formData.capabilities.multimodal} onCheckedChange={checked => setFormData({
                    ...formData,
                    capabilities: {
                      ...formData.capabilities,
                      multimodal: checked
                    }
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">网页抓取</span>
                      <Switch checked={formData.capabilities.webScraping} onCheckedChange={checked => setFormData({
                    ...formData,
                    capabilities: {
                      ...formData.capabilities,
                      webScraping: checked
                    }
                  })} />
                    </div>
                  </div>
                </div>

                {/* Is Recommended */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">推荐模型</span>
                  <Switch checked={formData.isRecommended} onCheckedChange={checked => setFormData({
                ...formData,
                isRecommended: checked
              })} />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <Select value={formData.status} onValueChange={value => setFormData({
                ...formData,
                status: value
              })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">已启用</SelectItem>
                      <SelectItem value="inactive">已禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                setShowAddModal(false);
                setEditingModel(null);
                resetForm();
              }} className="flex-1">
                    取消
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
                    {editingModel ? '更新' : '添加'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </div>;
}
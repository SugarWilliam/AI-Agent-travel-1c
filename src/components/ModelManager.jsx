// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Edit, Trash2, Check, X, Settings, Brain, Database, FileText, Code, Zap, Key, Globe, Lock, Unlock, ImageIcon } from 'lucide-react';
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
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterCost, setFilterCost] = useState('all');
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
  const providers = ['OpenAI', 'Anthropic', 'Google', '阿里云', '百度', '腾讯', '字节跳动', '月之暗面', '智谱AI', '深度求索', '自定义'];
  const costLevels = ['low', 'medium', 'high'];
  useEffect(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    try {
      setLoading(true);

      // 从 llm_models 数据模型加载真实的大模型配置
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('llm_models').where({
        status: 'active'
      }).get();
      if (result.data && result.data.length > 0) {
        // 为每个模型添加 apiKey 字段（如果不存在）
        const modelsWithApiKey = result.data.map(model => ({
          ...model,
          apiKey: model.apiKey || ''
        }));
        setModels(modelsWithApiKey);
        console.log('成功加载模型列表:', modelsWithApiKey.length, '个模型');
      } else {
        console.warn('未找到活跃的模型配置');
        setModels([]);
      }
    } catch (error) {
      console.error('加载模型失败:', error);

      // 如果数据库加载失败，使用默认的模型列表作为降级方案
      const defaultModels = [{
        _id: 'model_001',
        modelId: 'gpt-4',
        modelName: 'GPT-4',
        provider: 'OpenAI',
        description: '推荐',
        maxTokens: 8192,
        temperature: 0.7,
        costLevel: 'high',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_002',
        modelId: 'gpt-4-turbo',
        modelName: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: '更快的响应速度',
        maxTokens: 128000,
        temperature: 0.7,
        costLevel: 'high',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_003',
        modelId: 'gpt-3.5-turbo',
        modelName: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: '经济实惠',
        maxTokens: 4096,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_004',
        modelId: 'claude-3',
        modelName: 'Claude 3',
        provider: 'Anthropic',
        description: '强大的推理能力',
        maxTokens: 200000,
        temperature: 0.7,
        costLevel: 'high',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        apiKey: ''
      }, {
        _id: 'model_005',
        modelId: 'claude-2',
        modelName: 'Claude 2',
        provider: 'Anthropic',
        description: '稳定可靠',
        maxTokens: 100000,
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
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        apiKey: ''
      }, {
        _id: 'model_006',
        modelId: 'gemini-pro',
        modelName: 'Gemini Pro',
        provider: 'Google',
        description: '多模态能力强',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        apiKey: ''
      }, {
        _id: 'model_007',
        modelId: 'qwen-max',
        modelName: '通义千问 Max',
        provider: '阿里云',
        description: '中文优化',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_008',
        modelId: 'ernie-bot',
        modelName: '文心一言',
        provider: '百度',
        description: '中文理解能力强',
        maxTokens: 2000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_009',
        modelId: 'doubao-pro',
        modelName: '豆包 Pro',
        provider: '字节跳动',
        description: '中文对话能力强，性价比高',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_010',
        modelId: 'doubao-lite',
        modelName: '豆包 Lite',
        provider: '字节跳动',
        description: '轻量级模型，响应速度快',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_011',
        modelId: 'moonshot-v1-128k',
        modelName: 'Kimi 128K',
        provider: '月之暗面',
        description: '长文本处理能力强，支持128K上下文',
        maxTokens: 128000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_012',
        modelId: 'moonshot-v1-8k',
        modelName: 'Kimi 8K',
        provider: '月之暗面',
        description: '快速响应，适合日常对话',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_013',
        modelId: 'qwen-plus',
        modelName: '通义千问 Plus',
        provider: '阿里云',
        description: '平衡性能与成本',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_014',
        modelId: 'qwen-turbo',
        modelName: '通义千问 Turbo',
        provider: '阿里云',
        description: '极速响应，成本最低',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_015',
        modelId: 'glm-4',
        modelName: 'GLM-4',
        provider: '智谱AI',
        description: '中文理解能力强，多模态支持',
        maxTokens: 128000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_016',
        modelId: 'glm-3-turbo',
        modelName: 'GLM-3 Turbo',
        provider: '智谱AI',
        description: '快速响应，成本较低',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://open.bigmodel.cn/api/paas/v3/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_017',
        modelId: 'deepseek-chat',
        modelName: 'DeepSeek Chat',
        provider: '深度求索',
        description: '代码能力强，性价比高',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://api.deepseek.com/chat/completions',
        apiKey: ''
      }, {
        _id: 'model_018',
        modelId: 'deepseek-coder',
        modelName: 'DeepSeek Coder',
        provider: '深度求索',
        description: '代码生成和优化专家',
        maxTokens: 16000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.deepseek.com/chat/completions',
        apiKey: ''
      }];
      setModels(defaultModels);
      toast({
        title: '使用默认模型配置',
        description: '无法从数据库加载，已加载默认模型',
        variant: 'default'
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
      // 直接保存到数据库
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const data = {
        modelId: formData.modelId,
        modelName: formData.modelName,
        provider: formData.provider,
        description: formData.description,
        maxTokens: formData.maxTokens,
        temperature: formData.temperature,
        costLevel: formData.costLevel,
        capabilities: formData.capabilities,
        isRecommended: formData.isRecommended,
        status: formData.status,
        apiEndpoint: formData.apiEndpoint,
        apiKey: formData.apiKey,
        updatedAt: new Date().toISOString()
      };
      if (editingModel) {
        // 更新现有模型
        await db.collection('llm_models').doc(editingModel._id).update(data);
        toast({
          title: '更新成功',
          description: `模型 ${formData.modelName} 已更新`,
          variant: 'default'
        });
      } else {
        // 添加新模型
        data.createdAt = new Date().toISOString();
        await db.collection('llm_models').add(data);
        toast({
          title: '添加成功',
          description: `模型 ${formData.modelName} 已添加`,
          variant: 'default'
        });
      }
      setShowAddModal(false);
      setEditingModel(null);
      resetForm();
      loadModels();
    } catch (error) {
      console.error('保存模型失败:', error);
      toast({
        title: '操作失败',
        description: error.message || '网络错误，请重试',
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
      // 直接从数据库删除
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('llm_models').doc(modelId).remove();
      toast({
        title: '删除成功',
        description: '模型已删除',
        variant: 'default'
      });
      loadModels();
    } catch (error) {
      console.error('删除模型失败:', error);
      toast({
        title: '删除失败',
        description: error.message || '网络错误，请重试',
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
      '深度求索': 'bg-amber-100 text-amber-700',
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
  const filteredModels = models.filter(model => {
    if (filterProvider !== 'all' && model.provider !== filterProvider) return false;
    if (filterCost !== 'all' && model.costLevel !== filterCost) return false;
    return true;
  });
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

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={filterProvider} onValueChange={setFilterProvider}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="全部提供商" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部提供商</SelectItem>
            {providers.map(provider => <SelectItem key={provider} value={provider}>{provider}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCost} onValueChange={setFilterCost}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="全部成本" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部成本</SelectItem>
            <SelectItem value="low">低成本</SelectItem>
            <SelectItem value="medium">中成本</SelectItem>
            <SelectItem value="high">高成本</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model List */}
      <div className="space-y-3">
        {filteredModels.map(model => <div key={model._id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
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
                <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div className={`px-2 py-1 rounded ${getCostLevelColor(model.costLevel)}`}>
                    成本: {model.costLevel === 'low' ? '低' : model.costLevel === 'medium' ? '中' : '高'}
                  </div>
                  <div className="px-2 py-1 bg-gray-100 rounded">
                    最大Tokens: {model.maxTokens.toLocaleString()}
                  </div>
                  <div className="px-2 py-1 bg-gray-100 rounded">
                    温度: {model.temperature}
                  </div>
                  <div className={`px-2 py-1 rounded ${model.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {model.status === 'active' ? '已启用' : '已禁用'}
                  </div>
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
              <div className="text-xs text-gray-500 mb-2 font-medium">能力特性</div>
              <div className="grid grid-cols-2 gap-2">
                {model.capabilities?.documentParsing && <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded">
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-700">文档解析</span>
                  </div>}
                {model.capabilities?.imageRecognition && <div className="flex items-center gap-2 px-2 py-1 bg-purple-50 rounded">
                    <ImageIcon className="w-3 h-3 text-purple-600" />
                    <span className="text-xs text-purple-700">图像识别</span>
                  </div>}
                {model.capabilities?.multimodal && <div className="flex items-center gap-2 px-2 py-1 bg-pink-50 rounded">
                    <Zap className="w-3 h-3 text-pink-600" />
                    <span className="text-xs text-pink-700">多模态</span>
                  </div>}
                {model.capabilities?.webScraping && <div className="flex items-center gap-2 px-2 py-1 bg-green-50 rounded">
                    <Globe className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">网页抓取</span>
                  </div>}
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
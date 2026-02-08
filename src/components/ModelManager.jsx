// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Edit, Trash2, Check, X, Settings, Brain, Database, FileText, Code, Zap } from 'lucide-react';
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
    status: 'active'
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
      console.error('操作失败:', error);
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
      modelName: model.modelName,
      modelId: model.modelId,
      provider: model.provider,
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
      status: model.status || 'active'
    });
    setShowAddModal(true);
  };
  const handleDelete = async model => {
    if (!confirm(`确定要删除模型 ${model.modelName} 吗？`)) {
      return;
    }
    try {
      const result = await $w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'deleteModel',
          data: {
            _id: model._id,
            userId: $w.auth.currentUser?.userId || 'anonymous'
          }
        }
      });
      if (result.result.success) {
        toast({
          title: '删除成功',
          description: `模型 ${model.modelName} 已删除`,
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
      console.error('删除失败:', error);
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
      status: 'active'
    });
  };
  const getCostLevelColor = level => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  const getProviderColor = provider => {
    const colors = {
      'OpenAI': 'bg-blue-100 text-blue-700',
      'Anthropic': 'bg-orange-100 text-orange-700',
      'Google': 'bg-green-100 text-green-700',
      '阿里云': 'bg-red-100 text-red-700',
      '百度': 'bg-purple-100 text-purple-700',
      '腾讯': 'bg-indigo-100 text-indigo-700',
      '字节跳动': 'bg-pink-100 text-pink-700',
      '月之暗面': 'bg-teal-100 text-teal-700',
      '智谱AI': 'bg-cyan-100 text-cyan-700',
      '自定义': 'bg-gray-100 text-gray-700'
    };
    return colors[provider] || 'bg-gray-100 text-gray-700';
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
    </div>;
  }
  return <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#2D3436] flex items-center gap-2" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            <Brain className="w-5 h-5" />
            模型管理
          </h3>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
            <Plus className="w-4 h-4 mr-2" />
            添加模型
          </Button>
        </div>

        <div className="grid gap-3">
          {models.map(model => <div key={model._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{model.modelName}</h4>
                    {model.isRecommended && <span className="bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full">推荐</span>}
                    {model.status === 'active' ? <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">活跃</span> : <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">禁用</span>}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getProviderColor(model.provider)}`}>
                      {model.provider}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCostLevelColor(model.costLevel)}`}>
                      {model.costLevel === 'low' ? '低成本' : model.costLevel === 'medium' ? '中成本' : '高成本'}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      最大 {model.maxTokens} tokens
                    </span>
                  </div>

                  {model.description && <p className="text-sm text-gray-600 mb-2">{model.description}</p>}

                  <div className="flex gap-2 text-xs text-gray-500">
                    {model.capabilities?.documentParsing && <span>📄 文档解析</span>}
                    {model.capabilities?.imageRecognition && <span>🖼️ 图像识别</span>}
                    {model.capabilities?.multimodal && <span>🔍 多模态</span>}
                    {model.capabilities?.webScraping && <span>🌐 网页抓取</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(model)} className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(model)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>)}
          
          {models.length === 0 && <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无自定义模型</p>
              <p className="text-sm">点击上方按钮添加您的第一个AI模型</p>
            </div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {editingModel ? '编辑模型' : '添加模型'}
              </h3>
              <button onClick={() => {
            setShowAddModal(false);
            setEditingModel(null);
            resetForm();
          }} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
                  <Input value={formData.modelName} onChange={e => setFormData({
                ...formData,
                modelName: e.target.value
              })} placeholder="例如：GPT-4" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模型ID</label>
                  <Input value={formData.modelId} onChange={e => setFormData({
                ...formData,
                modelId: e.target.value
              })} placeholder="例如：gpt-4" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">提供商</label>
                  <Select value={formData.provider} onValueChange={value => setFormData({
                ...formData,
                provider: value
              })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择提供商" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => <SelectItem key={provider} value={provider}>{provider}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">成本等级</label>
                  <Select value={formData.costLevel} onValueChange={value => setFormData({
                ...formData,
                costLevel: value
              })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择成本等级" />
                    </SelectTrigger>
                    <SelectContent>
                      {costLevels.map(level => <SelectItem key={level} value={level}>
                          {level === 'low' ? '低成本' : level === 'medium' ? '中成本' : '高成本'}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最大Tokens</label>
                  <Input type="number" value={formData.maxTokens} onChange={e => setFormData({
                ...formData,
                maxTokens: parseInt(e.target.value) || 4096
              })} min="1" max="1000000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">温度参数</label>
                  <Input type="number" step="0.1" min="0" max="2" value={formData.temperature} onChange={e => setFormData({
                ...formData,
                temperature: parseFloat(e.target.value) || 0.7
              })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <Textarea value={formData.description} onChange={e => setFormData({
              ...formData,
              description: e.target.value
            })} placeholder="模型的功能描述..." rows={2} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">能力配置</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.capabilities.documentParsing} onCheckedChange={checked => setFormData({
                  ...formData,
                  capabilities: {
                    ...formData.capabilities,
                    documentParsing: checked
                  }
                })} />
                    <span className="text-sm">文档解析</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.capabilities.imageRecognition} onCheckedChange={checked => setFormData({
                  ...formData,
                  capabilities: {
                    ...formData.capabilities,
                    imageRecognition: checked
                  }
                })} />
                    <span className="text-sm">图像识别</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.capabilities.multimodal} onCheckedChange={checked => setFormData({
                  ...formData,
                  capabilities: {
                    ...formData.capabilities,
                    multimodal: checked
                  }
                })} />
                    <span className="text-sm">多模态</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.capabilities.webScraping} onCheckedChange={checked => setFormData({
                  ...formData,
                  capabilities: {
                    ...formData.capabilities,
                    webScraping: checked
                  }
                })} />
                    <span className="text-sm">网页抓取</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.isRecommended} onCheckedChange={checked => setFormData({
                ...formData,
                isRecommended: checked
              })} />
                  <span className="text-sm font-medium">推荐模型</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.status === 'active'} onCheckedChange={checked => setFormData({
                ...formData,
                status: checked ? 'active' : 'inactive'
              })} />
                  <span className="text-sm font-medium">启用状态</span>
                </div>
              </div>

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
        </div>}
    </div>;
}
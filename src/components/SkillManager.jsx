// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Edit, Trash2, Check, X, Zap, Code, FileText, Image as ImageIcon, Search, Settings } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from '@/components/ui';

export function SkillManager({
  $w
}) {
  const {
    toast
  } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'travel',
    enabled: true,
    parameters: {},
    examples: [],
    tags: [],
    icon: 'Zap',
    priority: 1,
    timeout: 30
  });
  const categories = [{
    value: 'travel',
    label: '旅行规划',
    icon: 'Zap'
  }, {
    value: 'weather',
    label: '天气查询',
    icon: 'Cloud'
  }, {
    value: 'translation',
    label: '翻译助手',
    icon: 'Languages'
  }, {
    value: 'image',
    label: '图像处理',
    icon: 'ImageIcon'
  }, {
    value: 'document',
    label: '文档处理',
    icon: 'FileText'
  }, {
    value: 'search',
    label: '搜索查询',
    icon: 'Search'
  }, {
    value: 'calculation',
    label: '计算分析',
    icon: 'Calculator'
  }, {
    value: 'creative',
    label: '创意生成',
    icon: 'Sparkles'
  }, {
    value: 'custom',
    label: '自定义',
    icon: 'Code'
  }];
  const icons = ['Zap', 'Code', 'FileText', 'ImageIcon', 'Search', 'Settings', 'Brain', 'Database'];
  useEffect(() => {
    loadSkills();
  }, []);
  const loadSkills = async () => {
    try {
      setLoading(true);
      console.log('开始加载技能列表...');
      const result = await $w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getSkills',
          userId: $w.auth.currentUser?.userId || 'anonymous'
        }
      });
      console.log('云函数返回结果:', result);
      if (result.result && result.result.success) {
        console.log('技能列表加载成功，数量:', result.result.data.length);
        setSkills(result.result.data);
      } else {
        const errorMsg = result.result?.error || '无法加载技能列表';
        console.error('技能列表加载失败:', errorMsg);
        toast({
          title: '加载失败',
          description: errorMsg,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('加载技能失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '网络错误，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast({
        title: '请填写完整信息',
        description: '技能名称和描述不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      const action = editingSkill ? 'updateSkill' : 'addSkill';
      const data = {
        ...formData,
        userId: $w.auth.currentUser?.userId || 'anonymous',
        owner: $w.auth.currentUser?.userId || 'anonymous'
      };
      if (editingSkill) {
        data._id = editingSkill._id;
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
          title: editingSkill ? '更新成功' : '添加成功',
          description: `技能 ${formData.name} 已${editingSkill ? '更新' : '添加'}`,
          variant: 'default'
        });
        setShowAddModal(false);
        setEditingSkill(null);
        resetForm();
        loadSkills();
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
  const handleEdit = skill => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
      category: skill.category || 'custom',
      enabled: skill.enabled !== false,
      parameters: skill.parameters || {},
      examples: skill.examples || [],
      tags: skill.tags || [],
      icon: skill.icon || 'Zap',
      priority: skill.priority || 1,
      timeout: skill.timeout || 30
    });
    setShowAddModal(true);
  };
  const handleDelete = async skill => {
    if (!confirm(`确定要删除技能 ${skill.name} 吗？`)) {
      return;
    }
    try {
      const result = await $w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'deleteSkill',
          data: {
            _id: skill._id,
            userId: $w.auth.currentUser?.userId || 'anonymous'
          }
        }
      });
      if (result.result.success) {
        toast({
          title: '删除成功',
          description: `技能 ${skill.name} 已删除`,
          variant: 'default'
        });
        loadSkills();
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
      name: '',
      description: '',
      category: 'travel',
      enabled: true,
      parameters: {},
      examples: [],
      tags: [],
      icon: 'Zap',
      priority: 1,
      timeout: 30
    });
  };
  const getCategoryIcon = category => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || 'Zap';
  };
  const getCategoryColor = category => {
    const colors = {
      travel: 'bg-blue-100 text-blue-700',
      weather: 'bg-gray-100 text-gray-700',
      translation: 'bg-green-100 text-green-700',
      image: 'bg-purple-100 text-purple-700',
      document: 'bg-yellow-100 text-yellow-700',
      search: 'bg-indigo-100 text-indigo-700',
      calculation: 'bg-orange-100 text-orange-700',
      creative: 'bg-pink-100 text-pink-700',
      custom: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };
  const filteredSkills = skills.filter(skill => {
    if (!skill || !skill.name || !skill.description) {
      console.warn('跳过无效的技能数据:', skill);
      return false;
    }
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
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
            <Zap className="w-5 h-5" />
            技能管理
          </h3>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
            <Plus className="w-4 h-4 mr-2" />
            添加技能
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="搜索技能..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="分类筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.map(category => <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          {filteredSkills.map(skill => <div key={skill._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(skill.category)}`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                    {skill.enabled ? <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">启用</span> : <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">禁用</span>}
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(skill.category)}`}>
                      {categories.find(c => c.value === skill.category)?.label || '自定义'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

                  {skill.tags && skill.tags.length > 0 && <div className="flex flex-wrap gap-1 mb-3">
                      {skill.tags.map((tag, index) => <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {tag}
                        </span>)}
                    </div>}

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                    <div className="px-2 py-1 bg-gray-50 rounded">
                      优先级: {skill.priority}
                    </div>
                    <div className="px-2 py-1 bg-gray-50 rounded">
                      超时: {skill.timeout}s
                    </div>
                    {skill.examples && skill.examples.length > 0 && <div className="px-2 py-1 bg-gray-50 rounded">
                        示例: {skill.examples.length}个
                      </div>}
                  </div>

                  {skill.parameters && Object.keys(skill.parameters).length > 0 && <div className="text-xs text-gray-500">
                      <span className="font-medium">参数: </span>
                      {Object.keys(skill.parameters).join(', ')}
                    </div>}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)} className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(skill)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>)}
          
          {filteredSkills.length === 0 && <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{searchTerm || filterCategory !== 'all' ? '没有找到匹配的技能' : '暂无自定义技能'}</p>
              <p className="text-sm">
                {searchTerm || filterCategory !== 'all' ? '尝试调整搜索条件' : '点击上方按钮添加您的第一个AI技能'}
              </p>
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
                {editingSkill ? '编辑技能' : '添加技能'}
              </h3>
              <button onClick={() => {
            setShowAddModal(false);
            setEditingSkill(null);
            resetForm();
          }} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">技能名称</label>
                  <Input value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} placeholder="例如：智能翻译" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <Select value={formData.category} onValueChange={value => setFormData({
                ...formData,
                category: value
              })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <Textarea value={formData.description} onChange={e => setFormData({
              ...formData,
              description: e.target.value
            })} placeholder="技能的功能描述..." rows={3} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
                  <Select value={formData.icon} onValueChange={value => setFormData({
                ...formData,
                icon: value
              })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择图标" />
                    </SelectTrigger>
                    <SelectContent>
                      {icons.map(icon => <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                  <Input type="number" value={formData.priority} onChange={e => setFormData({
                ...formData,
                priority: parseInt(e.target.value) || 1
              })} min="1" max="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">超时时间(秒)</label>
                  <Input type="number" value={formData.timeout} onChange={e => setFormData({
                ...formData,
                timeout: parseInt(e.target.value) || 30
              })} min="5" max="300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签 (用逗号分隔)</label>
                <Input value={formData.tags.join(', ')} onChange={e => setFormData({
              ...formData,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })} placeholder="例如：翻译, 语言, 多语言" />
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={formData.enabled} onCheckedChange={checked => setFormData({
              ...formData,
              enabled: checked
            })} />
                <span className="text-sm font-medium">启用状态</span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
              setShowAddModal(false);
              setEditingSkill(null);
              resetForm();
            }} className="flex-1">
                  取消
                </Button>
                <Button type="submit" className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
                  {editingSkill ? '更新' : '添加'}
                </Button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}
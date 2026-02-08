// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus, Edit, Copy, Trash2, Power, PowerOff, Search, Filter, MoreVertical, Bot, Sparkles, Zap, Shield, Database, Globe, Route, Cloud, Camera, Shirt, BookOpen, RefreshCw } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

export default function AgentList(props) {
  const {
    toast
  } = useToast();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);

  // 加载Agent列表
  useEffect(() => {
    loadAgents();
  }, []);

  // 筛选Agent
  useEffect(() => {
    let filtered = agents;

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(agent => agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(agent => agent.status === statusFilter);
    }
    setFilteredAgents(filtered);
  }, [agents, searchQuery, statusFilter]);
  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('AIConfig').get();
      if (result.data && result.data.length > 0) {
        setAgents(result.data);
      } else {
        // 如果没有数据，使用默认的AI Agent列表
        setAgents([{
          _id: '1',
          name: '行程规划 Agent',
          description: '专业的行程规划助手，根据用户需求生成详细的旅行行程安排',
          model: 'GPT-4',
          skills: ['行程规划', '路线优化', '时间安排'],
          rules: ['安全优先', '时间合理', '交通便利'],
          ragEnabled: true,
          ragSources: ['旅行攻略数据库', '景点数据库'],
          mcpServers: [],
          outputFormats: ['文本', 'JSON'],
          status: 'active',
          usageCount: 156,
          icon: Route,
          color: 'from-orange-500 to-pink-500',
          createdAt: '2024-01-15T10:00:00.000Z'
        }, {
          _id: '2',
          name: '天气查询 Agent',
          description: '实时获取目的地天气信息，提供穿衣和活动建议',
          model: 'GPT-3.5',
          skills: ['天气查询', '天气预报', '穿衣建议'],
          rules: ['数据准确', '实时更新'],
          ragEnabled: true,
          ragSources: ['天气数据库'],
          mcpServers: [],
          outputFormats: ['文本', 'JSON'],
          status: 'active',
          usageCount: 234,
          icon: Cloud,
          color: 'from-blue-500 to-cyan-500',
          createdAt: '2024-01-20T14:30:00.000Z'
        }, {
          _id: '3',
          name: '攻略生成 Agent',
          description: '生成详细的旅行攻略，包含景点介绍、美食推荐、实用信息等',
          model: 'GPT-4',
          skills: ['攻略生成', '景点介绍', '美食推荐'],
          rules: ['内容丰富', '信息准确'],
          ragEnabled: true,
          ragSources: ['攻略数据库', '美食数据库'],
          mcpServers: [],
          outputFormats: ['文本', 'Markdown', 'PDF'],
          status: 'active',
          usageCount: 189,
          icon: BookOpen,
          color: 'from-yellow-500 to-orange-500',
          createdAt: '2024-02-01T09:15:00.000Z'
        }, {
          _id: '4',
          name: '拍照指导 Agent',
          description: '提供专业的拍照建议和技巧，帮助用户拍出更好的旅行照片',
          model: 'GPT-3.5',
          skills: ['拍照技巧', '构图建议', '光线运用'],
          rules: ['实用性强', '易于理解'],
          ragEnabled: true,
          ragSources: ['摄影数据库'],
          mcpServers: [],
          outputFormats: ['文本', '图片'],
          status: 'active',
          usageCount: 98,
          icon: Camera,
          color: 'from-purple-500 to-pink-500',
          createdAt: '2024-02-10T11:20:00.000Z'
        }, {
          _id: '5',
          name: '穿搭建议 Agent',
          description: '根据天气和目的地提供合适的穿搭建议',
          model: 'GPT-3.5',
          skills: ['穿搭建议', '搭配技巧', '季节适应'],
          rules: ['舒适实用', '时尚美观'],
          ragEnabled: true,
          ragSources: ['穿搭数据库'],
          mcpServers: [],
          outputFormats: ['文本', '图片'],
          status: 'active',
          usageCount: 145,
          icon: Shirt,
          color: 'from-teal-500 to-green-500',
          createdAt: '2024-02-15T16:45:00.000Z'
        }, {
          _id: '6',
          name: '天气刷新 Agent',
          description: '实时刷新天气信息，确保数据的时效性',
          model: 'GPT-3.5',
          skills: ['天气刷新', '实时更新', '数据同步'],
          rules: ['实时性', '准确性'],
          ragEnabled: true,
          ragSources: ['天气API'],
          mcpServers: [],
          outputFormats: ['JSON'],
          status: 'active',
          usageCount: 312,
          icon: RefreshCw,
          color: 'from-cyan-500 to-blue-500',
          createdAt: '2024-02-20T08:30:00.000Z'
        }]);
      }
    } catch (error) {
      console.error('加载Agent列表失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载Agent列表，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateAgent = () => {
    props.$w.utils.navigateTo({
      pageId: 'ai-config',
      params: {
        mode: 'create'
      }
    });
  };
  const handleEditAgent = agentId => {
    props.$w.utils.navigateTo({
      pageId: 'ai-config',
      params: {
        mode: 'edit',
        agentId
      }
    });
    setShowMenu(null);
  };
  const handleCopyAgent = async agent => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const newAgent = {
        ...agent,
        _id: undefined,
        name: `${agent.name} (副本)`,
        status: 'inactive',
        usageCount: 0,
        createdAt: new Date().toISOString()
      };
      await db.collection('AIConfig').add(newAgent);
      toast({
        title: '复制成功',
        description: `已成功复制Agent: ${agent.name}`
      });
      loadAgents();
    } catch (error) {
      console.error('复制Agent失败:', error);
      toast({
        title: '复制失败',
        description: '无法复制Agent，请稍后重试',
        variant: 'destructive'
      });
    }
    setShowMenu(null);
  };
  const handleToggleStatus = async agent => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const newStatus = agent.status === 'active' ? 'inactive' : 'active';
      await db.collection('AIConfig').doc(agent._id).update({
        status: newStatus
      });
      toast({
        title: '状态更新成功',
        description: `Agent已${newStatus === 'active' ? '启用' : '禁用'}`
      });
      loadAgents();
    } catch (error) {
      console.error('更新状态失败:', error);
      toast({
        title: '更新失败',
        description: '无法更新Agent状态，请稍后重试',
        variant: 'destructive'
      });
    }
    setShowMenu(null);
  };
  const handleDeleteAgent = async agentId => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('AIConfig').doc(agentId).remove();
      toast({
        title: '删除成功',
        description: 'Agent已成功删除'
      });
      loadAgents();
    } catch (error) {
      console.error('删除Agent失败:', error);
      toast({
        title: '删除失败',
        description: '无法删除Agent，请稍后重试',
        variant: 'destructive'
      });
    }
    setShowMenu(null);
  };
  const getModelColor = model => {
    if (model.includes('GPT-4')) return 'bg-purple-100 text-purple-700';
    if (model.includes('GPT-3.5')) return 'bg-blue-100 text-blue-700';
    if (model.includes('Claude')) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => props.$w.utils.navigateBack()} className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  AI Agent 列表
                </h1>
                <p className="text-sm text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                  管理您的AI助手配置
                </p>
              </div>
            </div>
            <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-4 h-4" />
              创建Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="搜索Agent名称或描述..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" style={{
              fontFamily: 'Quicksand, sans-serif'
            }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'all' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                全部
              </button>
              <button onClick={() => setStatusFilter('active')} className={`px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'active' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                已启用
              </button>
              <button onClick={() => setStatusFilter('inactive')} className={`px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'inactive' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                已禁用
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {isLoading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div> : filteredAgents.length === 0 ? <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              暂无Agent
            </h3>
            <p className="text-gray-500 mb-6" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              {searchQuery || statusFilter !== 'all' ? '没有找到匹配的Agent' : '还没有创建任何Agent'}
            </p>
            {!searchQuery && statusFilter === 'all' && <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-2 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                创建第一个Agent
              </Button>}
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => <div key={agent._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${agent.color || 'from-orange-500 to-pink-500'} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        {agent.icon ? <agent.icon className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white" style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                          {agent.name}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getModelColor(agent.model)}`}>
                          {agent.model}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={() => setShowMenu(showMenu === agent._id ? null : agent._id)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-white" />
                      </button>
                      {showMenu === agent._id && <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                          <button onClick={() => handleEditAgent(agent._id)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                            <Edit className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">编辑</span>
                          </button>
                          <button onClick={() => handleCopyAgent(agent)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                            <Copy className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">复制</span>
                          </button>
                          <button onClick={() => handleToggleStatus(agent)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                            {agent.status === 'active' ? <PowerOff className="w-4 h-4 text-gray-600" /> : <Power className="w-4 h-4 text-gray-600" />}
                            <span className="text-gray-700">
                              {agent.status === 'active' ? '禁用' : '启用'}
                            </span>
                          </button>
                          <button onClick={() => handleDeleteAgent(agent._id)} className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-2 transition-colors" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                            <span className="text-red-600">删除</span>
                          </button>
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {agent.description}
                  </p>

                  {/* Skills */}
                  {agent.skills && agent.skills.length > 0 && <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          Skills
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agent.skills.slice(0, 3).map((skill, index) => <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                            {skill}
                          </span>)}
                        {agent.skills.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                            +{agent.skills.length - 3}
                          </span>}
                      </div>
                    </div>}

                  {/* Rules */}
                  {agent.rules && agent.rules.length > 0 && <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-medium text-gray-700" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          Rules
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agent.rules.slice(0, 2).map((rule, index) => <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                            {rule}
                          </span>)}
                        {agent.rules.length > 2 && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                            +{agent.rules.length - 2}
                          </span>}
                      </div>
                    </div>}

                  {/* RAG Status */}
                  {agent.ragEnabled && <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-teal-500" />
                        <span className="text-sm font-medium text-gray-700" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          RAG 已启用
                        </span>
                      </div>
                    </div>}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {agent.usageCount || 0} 次使用
                      </span>
                    </div>
                    <span className="text-xs text-gray-400" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {formatDate(agent.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`px-6 py-3 ${agent.status === 'active' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    {agent.status === 'active' ? <Power className="w-4 h-4 text-green-600" /> : <PowerOff className="w-4 h-4 text-gray-400" />}
                    <span className={`text-sm font-medium ${agent.status === 'active' ? 'text-green-700' : 'text-gray-500'}`} style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {agent.status === 'active' ? '已启用' : '已禁用'}
                    </span>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}
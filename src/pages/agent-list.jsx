// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Plus, Power, PowerOff, Bot, Route, BookOpen, Camera, Sparkles, Cloud, Shirt, RefreshCw, MoreVertical, Copy, Edit, Trash2, RotateCcw, AlertCircle } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

import { useGlobalSettings } from '@/components/GlobalSettings';
import TabBar from '@/components/TabBar';
export default function AgentList(props) {
  const {
    toast
  } = useToast();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // 尝试使用全局设置，如果没有 Provider 则使用本地状态
  let globalSettings;
  try {
    globalSettings = useGlobalSettings();
  } catch (error) {
    globalSettings = null;
  }
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });
  useEffect(() => {
    if (!globalSettings) {
      const handleStorageChange = () => {
        const savedDarkMode = localStorage.getItem('app-darkMode');
        setLocalDarkMode(savedDarkMode === 'true');
      };
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('theme-change', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('theme-change', handleStorageChange);
      };
    }
  }, [globalSettings]);
  const darkMode = globalSettings?.darkMode || localDarkMode;

  // 内置的4个AI Agent
  const defaultAgents = [{
    _id: '1',
    name: '规划助手',
    description: '专业的行程规划助手，根据用户需求生成详细的旅行行程安排',
    agentType: 'built-in',
    model: 'GPT-4',
    skills: ['行程规划', '路线优化', '时间安排'],
    rules: ['安全优先', '时间合理', '交通便利'],
    ragEnabled: true,
    ragSources: ['旅行攻略数据库', '景点数据库'],
    mcpServers: [],
    outputFormats: ['文本', 'JSON'],
    status: 'active',
    usageCount: 156,
    icon: 'Route',
    color: 'from-orange-500 to-pink-500',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
    isBuiltIn: true,
    capabilities: [],
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 4096,
    priority: 0,
    config: {}
  }, {
    _id: '2',
    name: '解说助手',
    description: '提供专业的景点解说和文化背景介绍，让旅行更有深度',
    agentType: 'built-in',
    model: 'GPT-4',
    skills: ['景点解说', '文化介绍', '历史背景'],
    rules: ['内容准确', '生动有趣', '文化尊重'],
    ragEnabled: true,
    ragSources: ['文化数据库', '历史数据库'],
    mcpServers: [],
    outputFormats: ['文本', '语音'],
    status: 'active',
    usageCount: 234,
    icon: 'BookOpen',
    color: 'from-yellow-500 to-orange-500',
    createdAt: '2024-01-20T14:30:00.000Z',
    updatedAt: new Date().toISOString(),
    isBuiltIn: true,
    capabilities: [],
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 4096,
    priority: 0,
    config: {}
  }, {
    _id: '3',
    name: '拍照助手',
    description: '提供专业的拍照建议和技巧，帮助用户拍出更好的旅行照片',
    agentType: 'built-in',
    model: 'GPT-3.5',
    skills: ['拍照技巧', '构图建议', '光线运用'],
    rules: ['实用性强', '易于理解'],
    ragEnabled: true,
    ragSources: ['摄影数据库'],
    mcpServers: [],
    outputFormats: ['文本', '图片'],
    status: 'active',
    usageCount: 98,
    icon: 'Camera',
    color: 'from-purple-500 to-pink-500',
    createdAt: '2024-02-10T11:20:00.000Z',
    updatedAt: new Date().toISOString(),
    isBuiltIn: true,
    capabilities: [],
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 4096,
    priority: 0,
    config: {}
  }, {
    _id: '4',
    name: '推荐助手',
    description: '根据用户偏好和实时数据，推荐最适合的旅行目的地和活动',
    agentType: 'built-in',
    model: 'GPT-4',
    skills: ['目的地推荐', '活动推荐', '个性化匹配'],
    rules: ['个性化', '实时更新', '精准匹配'],
    ragEnabled: true,
    ragSources: ['推荐数据库', '用户偏好数据库'],
    mcpServers: [],
    outputFormats: ['文本', 'JSON'],
    status: 'active',
    usageCount: 189,
    icon: 'Sparkles',
    color: 'from-teal-500 to-green-500',
    createdAt: '2024-02-01T09:15:00.000Z',
    updatedAt: new Date().toISOString(),
    isBuiltIn: true,
    capabilities: [],
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 4096,
    priority: 0,
    config: {}
  }];

  // 加载Agent列表
  useEffect(() => {
    loadAgents();
  }, [retryCount]);

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
      setError(null);
      console.log(`开始加载Agent列表，重试次数: ${retryCount}`);

      // 首先确保显示4个内置Agent
      console.log('内置Agent列表:', defaultAgents.map(a => a.name));
      let allAgents = [...defaultAgents]; // 始终包含4个内置Agent
      let dbLoadSuccess = false;
      let dbAgentCount = 0;

      // 尝试从数据库加载用户Agent
      try {
        const tcb = await props.$w.cloud.getCloudInstance();
        const db = tcb.database();
        let result;
        try {
          console.log('尝试从Agent集合加载数据...');
          result = await db.collection('Agent').get();
          console.log('Agent集合加载成功，数据量:', result.data?.length || 0);
        } catch (dbError) {
          console.log('Agent集合加载失败:', dbError.message);
          // 检查是否是集合不存在的错误
          if (dbError.message.includes('not exist') || dbError.message.includes('不存在')) {
            console.log('Agent集合不存在，跳过数据库加载');
            dbLoadSuccess = false;
          } else {
            console.log('尝试从AIConfig集合加载数据...');
            try {
              result = await db.collection('AIConfig').get();
              console.log('AIConfig集合加载成功，数据量:', result.data?.length || 0);
            } catch (aiConfigError) {
              console.log('AIConfig集合加载失败:', aiConfigError.message);
              if (aiConfigError.message.includes('not exist') || aiConfigError.message.includes('不存在')) {
                console.log('AIConfig集合不存在，跳过数据库加载');
                dbLoadSuccess = false;
              } else {
                throw new Error('数据库连接失败');
              }
            }
          }
        }
        if (result.data && result.data.length > 0) {
          console.log('成功加载数据库数据，开始处理...');
          const dbAgents = result.data.map(agent => ({
            ...agent,
            icon: getIconComponent(agent.icon || 'Bot'),
            isBuiltIn: agent.isBuiltIn || false,
            status: agent.status || 'enabled'
          }));
          dbAgentCount = dbAgents.length;
          console.log(`数据库Agent数量: ${dbAgentCount}`);

          // 合并数据库Agent，避免与内置Agent重复
          dbAgents.forEach(dbAgent => {
            const exists = allAgents.find(agent => agent.name === dbAgent.name || agent.id === dbAgent.id);
            if (!exists) {
              allAgents.push(dbAgent);
              console.log(`添加用户Agent: ${dbAgent.name}`);
            } else {
              console.log(`跳过重复Agent: ${dbAgent.name}`);
            }
          });
          dbLoadSuccess = true;
          console.log(`合并后总Agent数量: ${allAgents.length}`);
        } else {
          console.log('数据库中没有Agent数据');
        }
      } catch (cloudError) {
        console.error('云开发连接失败:', cloudError.message);
        // 网络错误时，仍然确保显示4个内置Agent
        console.log('网络错误，仅显示内置Agent');
      }

      // 确保最终列表包含所有4个内置Agent
      const finalAgents = [...defaultAgents];

      // 如果数据库加载成功，添加用户Agent
      if (dbLoadSuccess && allAgents.length > defaultAgents.length) {
        const userAgents = allAgents.filter(agent => !agent.isBuiltIn);
        finalAgents.push(...userAgents);
      }
      console.log(`最终Agent列表: ${finalAgents.length} 个`);
      finalAgents.forEach((agent, index) => {
        console.log(`${index + 1}. ${agent.name} (${agent.isBuiltIn ? '内置' : '用户'}) - 状态: ${agent.status}`);
      });
      setAgents(finalAgents);

      // 显示加载结果
      if (dbLoadSuccess) {
        if (dbAgentCount > 0) {
          toast({
            title: '加载成功',
            description: `已加载 ${dbAgentCount} 个用户Agent和 ${defaultAgents.length} 个内置Agent`
          });
        } else {
          toast({
            title: '提示',
            description: `正在使用 ${defaultAgents.length} 个内置Agent配置`
          });
        }
      } else {
        toast({
          title: '网络提示',
          description: `网络连接异常，正在使用离线Agent配置 (${defaultAgents.length} 个内置Agent)`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('加载Agent列表失败:', error);
      setError('网络错误，请重试');

      // 任何错误情况下，都确保显示4个内置Agent
      console.log('发生错误，强制显示内置Agent');
      setAgents(defaultAgents);
      toast({
        title: '网络错误',
        description: '无法连接到服务器，显示默认Agent列表',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadAgents();
  };
  const getIconComponent = iconName => {
    const iconMap = {
      'Route': Route,
      'BookOpen': BookOpen,
      'Camera': Camera,
      'Sparkles': Sparkles,
      'Cloud': Cloud,
      'Shirt': Shirt,
      'RefreshCw': RefreshCw,
      'Bot': Bot
    };
    return iconMap[iconName] || Bot;
  };
  const handleCreateAgent = () => {
    props.$w.utils.navigateTo({
      pageId: 'agent-edit',
      params: {
        mode: 'create'
      }
    });
  };
  const handleEditAgent = agentId => {
    props.$w.utils.navigateTo({
      pageId: 'agent-edit',
      params: {
        mode: 'edit',
        agentId: agentId
      }
    });
  };
  const handleCopyAgent = async agent => {
    try {
      const newAgent = {
        ...agent,
        name: `${agent.name} (副本)`,
        _id: Date.now().toString(),
        isBuiltIn: false,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        outputFormats: agent.outputFormats || [],
        capabilities: agent.capabilities || [],
        systemPrompt: agent.systemPrompt || '',
        temperature: agent.temperature || 0.7,
        maxTokens: agent.maxTokens || 4096,
        priority: agent.priority || 0,
        config: agent.config || {}
      };
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      try {
        await db.collection('Agent').add(newAgent);
      } catch (dbError) {
        await db.collection('AIConfig').add(newAgent);
      }

      // 重新加载列表
      await loadAgents();
      toast({
        title: '复制成功',
        description: 'Agent已复制成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('复制Agent失败:', error);
      toast({
        title: '复制失败',
        description: '复制Agent时出现错误',
        variant: 'destructive'
      });
    }
  };
  const handleToggleStatus = async agent => {
    try {
      const newStatus = agent.status === 'active' ? 'inactive' : 'active';

      // 内置Agent不能修改状态
      if (agent.isBuiltIn) {
        toast({
          title: '操作受限',
          description: '内置Agent不能修改状态',
          variant: 'destructive'
        });
        return;
      }
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      try {
        await db.collection('Agent').doc(agent._id).update({
          status: newStatus
        });
      } catch (dbError) {
        await db.collection('AIConfig').doc(agent._id).update({
          status: newStatus
        });
      }

      // 更新本地状态
      setAgents(prev => prev.map(a => a._id === agent._id ? {
        ...a,
        status: newStatus
      } : a));
      toast({
        title: '状态更新成功',
        description: `Agent已${newStatus === 'active' ? '启用' : '禁用'}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('更新状态失败:', error);
      toast({
        title: '更新失败',
        description: '更新Agent状态时出现错误',
        variant: 'destructive'
      });
    }
  };
  const handleDeleteAgent = async agent => {
    try {
      // 内置Agent不能删除
      if (agent.isBuiltIn) {
        toast({
          title: '操作受限',
          description: '内置Agent不能删除',
          variant: 'destructive'
        });
        return;
      }
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      try {
        await db.collection('Agent').doc(agent._id).remove();
      } catch (dbError) {
        await db.collection('AIConfig').doc(agent._id).remove();
      }

      // 重新加载列表
      await loadAgents();
      toast({
        title: '删除成功',
        description: 'Agent已删除成功',
        variant: 'default'
      });
    } catch (error) {
      console.error('删除Agent失败:', error);
      toast({
        title: '删除失败',
        description: '删除Agent时出现错误',
        variant: 'destructive'
      });
    }
  };
  return <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50'}`}>
      {/* Header */}
      <div className={`backdrop-blur-sm border-b ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-full sm:max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => props.$w.utils.navigateBack()} className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  <Bot className="w-8 h-8 text-orange-500" />
                  AI Agent 列表
                </h1>
                <p className="text-gray-600 mt-1 text-sm" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  管理您的AI助手配置
                </p>
              </div>
            </div>
            <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5" />
              创建Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="max-w-full sm:max-w-7xl mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold text-sm">网络连接异常</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-500 text-xs mt-1">正在使用离线Agent配置 (4个内置Agent可用)</p>
                </div>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 flex items-center gap-2 px-4 py-2">
                <RotateCcw className="w-4 h-4" />
                重新连接
              </Button>
            </div>
          </div>
        </div>}

      {/* Search and Filter */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 py-6">
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="搜索Agent名称或描述..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'all' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                全部
              </button>
              <button onClick={() => setStatusFilter('active')} className={`px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'active' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                已启用
              </button>
              <button onClick={() => setStatusFilter('inactive')} className={`px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'inactive' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                已禁用
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 pb-8">
        {isLoading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div> : filteredAgents.length === 0 ? <div className={`rounded-2xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredAgents.map(agent => <div key={agent._id} className={`rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${agent.color || 'from-orange-500 to-pink-500'} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700/20' : 'bg-white/20'}`}>
                        {agent.icon ? typeof agent.icon === 'string' ? React.createElement(getIconComponent(agent.icon), {
                    className: "w-6 h-6 text-white"
                  }) : React.createElement(agent.icon, {
                    className: "w-6 h-6 text-white"
                  }) : <Bot className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg" style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                          {agent.name}
                        </h3>
                        <p className="text-white/80 text-sm" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={() => setShowMenu(showMenu === agent._id ? null : agent._id)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700/20' : 'hover:bg-white/20'}`}>
                        <MoreVertical className="w-5 h-5 text-white" />
                      </button>
                      {showMenu === agent._id && <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-20 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                          <button onClick={() => {
                    handleEditAgent(agent._id);
                    setShowMenu(null);
                  }} className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <Edit className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>编辑</span>
                          </button>
                          <button onClick={() => {
                    handleCopyAgent(agent);
                    setShowMenu(null);
                  }} className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>复制</span>
                          </button>
                          <button onClick={() => {
                    handleToggleStatus(agent);
                    setShowMenu(null);
                  }} className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            {agent.status === 'active' ? <PowerOff className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} /> : <Power className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {agent.status === 'active' ? '禁用' : '启用'}
                            </span>
                          </button>
                          {!agent.isBuiltIn && <button onClick={() => {
                    handleDeleteAgent(agent);
                    setShowMenu(null);
                  }} className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors text-red-600 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}>
                              <Trash2 className="w-4 h-4" />
                              <span>删除</span>
                            </button>}
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Model Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {agent.model}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      <span>使用次数: {agent.usageCount || 0}</span>
                      {agent.createdAt && <>
                        <span>•</span>
                        <span>创建于: {new Date(agent.createdAt).toLocaleDateString('zh-CN')}</span>
                      </>}
                    </div>
                  </div>

                  {/* Skills */}
                  {agent.skills && agent.skills.length > 0 && <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                        技能
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.skills.slice(0, 3).map((skill, index) => <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                            {skill}
                          </span>)}
                        {agent.skills.length > 3 && <span className={`px-2 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`} style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                            +{agent.skills.length - 3}
                          </span>}
                      </div>
                    </div>}

                  {/* Rules */}
                  {agent.rules && agent.rules.length > 0 && <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                        规则
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.rules.slice(0, 2).map((rule, index) => <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                            {rule}
                          </span>)}
                        {agent.rules.length > 2 && <span className={`px-2 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`} style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                            +{agent.rules.length - 2}
                          </span>}
                      </div>
                    </div>}

                  {/* RAG Status */}
                  {agent.ragEnabled && <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          RAG已启用
                        </span>
                      </div>
                      {agent.ragSources && agent.ragSources.length > 0 && <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                          数据源: {agent.ragSources.join(', ')}
                        </div>}
                    </div>}
                </div>

                {/* Card Footer */}
                <div className={`px-6 py-3 ${agent.status === 'active' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {agent.status === 'active' ? <Power className="w-4 h-4 text-green-600" /> : <PowerOff className="w-4 h-4 text-gray-400" />}
                      <span className={`text-sm font-medium ${agent.status === 'active' ? 'text-green-700' : 'text-gray-500'}`} style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {agent.status === 'active' ? '已启用' : '已禁用'}
                      </span>
                    </div>
                    {agent.isBuiltIn && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                        内置
                      </span>}
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
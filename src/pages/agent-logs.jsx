// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Search, Filter, Download, FileText, Clock, CheckCircle, XCircle, AlertCircle, Bot, User, Image as ImageIcon, ChevronDown, ChevronUp, Calendar, TrendingUp, DollarSign, Zap, FileIcon } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

export default function AgentLogs(props) {
  const {
    toast
  } = useToast();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    totalCost: 0,
    totalTokens: 0
  });

  // 加载日志数据
  useEffect(() => {
    loadLogs();
  }, []);

  // 筛选日志
  useEffect(() => {
    let filtered = logs;

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(log => log.agentName?.toLowerCase().includes(searchQuery.toLowerCase()) || log.actionType?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Agent筛选
    if (agentFilter !== 'all') {
      filtered = filtered.filter(log => log.agentId === agentFilter);
    }
    setFilteredLogs(filtered);
  }, [logs, searchQuery, statusFilter, agentFilter]);
  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();

      // 从Message表获取日志数据
      const result = await db.collection('Message').orderBy('createdAt', 'desc').limit(50).get();
      if (result.data && result.data.length > 0) {
        const formattedLogs = result.data.map(msg => ({
          _id: msg._id,
          agentId: msg.agentId || 'default',
          agentName: msg.agentName || '默认Agent',
          conversationId: msg.conversationId,
          actionType: msg.actionType || '对话',
          input: msg.content || '',
          output: msg.response || '',
          status: msg.status || 'success',
          errorMessage: msg.errorMessage || null,
          modelUsed: msg.modelUsed || 'GPT-4',
          skillsUsed: msg.skillsUsed || [],
          ragSources: msg.ragSources || [],
          mcpCalls: msg.mcpCalls || [],
          duration: msg.duration || 0,
          tokensUsed: msg.tokensUsed || 0,
          cost: msg.cost || 0,
          createdAt: msg.createdAt || new Date().toISOString(),
          updatedAt: msg.updatedAt || new Date().toISOString()
        }));
        setLogs(formattedLogs);
        calculateStats(formattedLogs);
      } else {
        // 如果没有数据，使用模拟数据
        const mockLogs = [{
          _id: '1',
          agentId: '1',
          agentName: '旅行规划助手',
          conversationId: 'conv-001',
          actionType: '对话',
          input: '帮我规划一个东京5日游的行程',
          output: '好的，我来为您规划东京5日游行程...',
          status: 'success',
          errorMessage: null,
          modelUsed: 'GPT-4',
          skillsUsed: ['旅行规划', '景点推荐'],
          ragSources: ['东京攻略数据库'],
          mcpCalls: [],
          duration: 2.5,
          tokensUsed: 1250,
          cost: 0.05,
          createdAt: '2024-02-08T10:30:00.000Z',
          updatedAt: '2024-02-08T10:30:02.500Z'
        }, {
          _id: '2',
          agentId: '1',
          agentName: '旅行规划助手',
          conversationId: 'conv-002',
          actionType: '生成文档',
          input: '生成大理旅行的PDF攻略',
          output: '已生成大理旅行攻略PDF文档...',
          status: 'success',
          errorMessage: null,
          modelUsed: 'GPT-4',
          skillsUsed: ['文档生成'],
          ragSources: ['大理攻略数据库'],
          mcpCalls: [],
          duration: 3.2,
          tokensUsed: 1800,
          cost: 0.07,
          createdAt: '2024-02-08T09:15:00.000Z',
          updatedAt: '2024-02-08T09:15:03.200Z'
        }, {
          _id: '3',
          agentId: '2',
          agentName: '美食推荐助手',
          conversationId: 'conv-003',
          actionType: '对话',
          input: '推荐一些东京的美食',
          output: '东京有很多美食推荐...',
          status: 'failed',
          errorMessage: 'API调用超时',
          modelUsed: 'GPT-3.5',
          skillsUsed: ['美食推荐'],
          ragSources: ['美食数据库'],
          mcpCalls: [],
          duration: 5.0,
          tokensUsed: 0,
          cost: 0,
          createdAt: '2024-02-08T08:45:00.000Z',
          updatedAt: '2024-02-08T08:45:05.000Z'
        }, {
          _id: '4',
          agentId: '3',
          agentName: '文化解说助手',
          conversationId: 'conv-004',
          actionType: '分析',
          input: '分析这张图片中的文化元素',
          output: '图片中包含了丰富的文化元素...',
          status: 'success',
          errorMessage: null,
          modelUsed: 'Claude-3',
          skillsUsed: ['图片分析', '文化解说'],
          ragSources: ['文化数据库'],
          mcpCalls: [],
          duration: 4.1,
          tokensUsed: 2100,
          cost: 0.08,
          createdAt: '2024-02-08T07:20:00.000Z',
          updatedAt: '2024-02-08T07:20:04.100Z'
        }];
        setLogs(mockLogs);
        calculateStats(mockLogs);
      }
    } catch (error) {
      console.error('加载日志失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载日志数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const calculateStats = logData => {
    const total = logData.length;
    const success = logData.filter(log => log.status === 'success').length;
    const failed = logData.filter(log => log.status === 'failed').length;
    const totalCost = logData.reduce((sum, log) => sum + (log.cost || 0), 0);
    const totalTokens = logData.reduce((sum, log) => sum + (log.tokensUsed || 0), 0);
    setStats({
      total,
      success,
      failed,
      totalCost,
      totalTokens
    });
  };
  const handleExportLogs = () => {
    const csvContent = [['时间', 'Agent', '操作类型', '状态', '模型', '时长(秒)', 'Tokens', '成本(美元)'], ...filteredLogs.map(log => [new Date(log.createdAt).toLocaleString('zh-CN'), log.agentName, log.actionType, log.status === 'success' ? '成功' : '失败', log.modelUsed, log.duration, log.tokensUsed, log.cost])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agent-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast({
      title: '导出成功',
      description: '日志已成功导出为CSV文件'
    });
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };
  const getActionTypeColor = actionType => {
    switch (actionType) {
      case '对话':
        return 'bg-blue-100 text-blue-700';
      case '生成文档':
        return 'bg-purple-100 text-purple-700';
      case '分析':
        return 'bg-orange-100 text-orange-700';
      case '配置':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-full sm:max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => props.$w.utils.navigateBack()} className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  Agent 运行日志
                </h1>
                <p className="text-sm text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                  查看Agent的运行历史和状态
                </p>
              </div>
            </div>
            <Button onClick={handleExportLogs} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              <Download className="w-4 h-4" />
              导出日志
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FileIcon className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {stats.total}
              </span>
            </div>
            <p className="text-sm text-gray-600" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              总运行次数
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {stats.total > 0 ? Math.round(stats.success / stats.total * 100) : 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              成功率
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                ${stats.totalCost.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              总成本
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {stats.totalTokens.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              总Token使用量
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="搜索Agent名称或操作类型..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" style={{
              fontFamily: 'Quicksand, sans-serif'
            }} />
            </div>
            <div className="flex gap-2">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
              </select>
              <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                <option value="all">全部Agent</option>
                <option value="1">旅行规划助手</option>
                <option value="2">美食推荐助手</option>
                <option value="3">文化解说助手</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Log List */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 pb-8">
        {isLoading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div> : filteredLogs.length === 0 ? <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              暂无日志
            </h3>
            <p className="text-gray-500" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              {searchQuery || statusFilter !== 'all' || agentFilter !== 'all' ? '没有找到匹配的日志' : '还没有运行日志'}
            </p>
          </div> : <div className="space-y-4">
            {filteredLogs.map(log => <div key={log._id} onClick={() => {
          setSelectedLog(log);
          setShowDetail(true);
        }} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <h3 className="text-lg font-bold text-gray-800" style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                          {log.agentName}
                        </h3>
                        <p className="text-sm text-gray-500" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionTypeColor(log.actionType)}`} style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {log.actionType}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 line-clamp-2" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {log.input}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{log.modelUsed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{log.duration}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{log.tokensUsed} tokens</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>${log.cost.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedLog && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  日志详情
                </h2>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>Agent</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{selectedLog.agentName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>操作类型</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{selectedLog.actionType}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>状态</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedLog.status)}
                      <span className="font-medium text-gray-800" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                        {selectedLog.status === 'success' ? '成功' : '失败'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>时间</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      {new Date(selectedLog.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>时长</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{selectedLog.duration}s</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>模型</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{selectedLog.modelUsed}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>Tokens</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{selectedLog.tokensUsed}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>成本</p>
                    <p className="font-medium text-gray-800" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>${selectedLog.cost.toFixed(3)}</p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  输入
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    {selectedLog.input}
                  </p>
                </div>
              </div>

              {/* Output */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  输出
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    {selectedLog.output}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {selectedLog.skillsUsed && selectedLog.skillsUsed.length > 0 && <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                    使用的Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLog.skillsUsed.map((skill, index) => <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                        {skill}
                      </span>)}
                  </div>
                </div>}

              {/* RAG Sources */}
              {selectedLog.ragSources && selectedLog.ragSources.length > 0 && <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                    RAG数据源
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLog.ragSources.map((source, index) => <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                        {source}
                      </span>)}
                  </div>
                </div>}

              {/* Error Message */}
              {selectedLog.errorMessage && <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                    错误信息
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {selectedLog.errorMessage}
                    </p>
                  </div>
                </div>}
            </div>
          </div>
        </div>}
    </div>;
}
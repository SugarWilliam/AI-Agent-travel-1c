// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Search, MapPin, Calendar, DollarSign, Sparkles, Download, Trash2, Settings, ArrowLeft, Edit, Share2, Filter } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function MyPlans(props) {
  const {
    toast
  } = useToast();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const {
    $w
  } = props;
  const {
    navigateTo
  } = $w.utils;

  // 从数据库加载计划数据
  useEffect(() => {
    loadPlans();
  }, []);

  // 加载计划数据
  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('Trip').where({
        _openid: tcb.auth.currentUser ? tcb.auth.currentUser.userId : ''
      }).get();
      if (result.data.length > 0) {
        const formattedPlans = result.data.map(item => ({
          id: item._id,
          title: item.title || '未命名计划',
          destination: item.destination || '未知目的地',
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          budget: item.budget || 0,
          status: item.status || 'planning',
          coverImage: item.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
          aiSuggestions: item.aiSuggestions || [],
          createdAt: item.createdAt || new Date().toISOString()
        }));
        setPlans(formattedPlans);
        setFilteredPlans(formattedPlans);
      } else {
        // 如果没有数据，使用模拟数据
        const mockPlans = [{
          id: '1',
          title: '日本东京七日游',
          destination: '东京, 日本',
          startDate: '2026-03-15',
          endDate: '2026-03-22',
          budget: 15000,
          status: 'planning',
          coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          aiSuggestions: ['推荐浅草寺', '建议体验和服', '必去秋叶原'],
          createdAt: new Date().toISOString()
        }, {
          id: '2',
          title: '云南大理慢生活',
          destination: '大理, 中国',
          startDate: '2026-04-01',
          endDate: '2026-04-05',
          budget: 3000,
          status: 'confirmed',
          coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
          aiSuggestions: ['洱海骑行', '古城漫步', '品尝白族美食'],
          createdAt: new Date().toISOString()
        }, {
          id: '3',
          title: '巴黎浪漫之旅',
          destination: '巴黎, 法国',
          startDate: '2026-05-20',
          endDate: '2026-05-27',
          budget: 25000,
          status: 'completed',
          coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          aiSuggestions: ['埃菲尔铁塔日落', '卢浮宫艺术之旅', '塞纳河游船'],
          createdAt: new Date().toISOString()
        }];
        setPlans(mockPlans);
        setFilteredPlans(mockPlans);
      }
    } catch (error) {
      console.error('加载计划失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载您的旅行计划',
        variant: 'destructive'
      });
      // 使用模拟数据作为后备
      const mockPlans = [{
        id: '1',
        title: '日本东京七日游',
        destination: '东京, 日本',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        budget: 15000,
        status: 'planning',
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        aiSuggestions: ['推荐浅草寺', '建议体验和服', '必去秋叶原'],
        createdAt: new Date().toISOString()
      }, {
        id: '2',
        title: '云南大理慢生活',
        destination: '大理, 中国',
        startDate: '2026-04-01',
        endDate: '2026-04-05',
        budget: 3000,
        status: 'confirmed',
        coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
        aiSuggestions: ['洱海骑行', '古城漫步', '品尝白族美食'],
        createdAt: new Date().toISOString()
      }, {
        id: '3',
        title: '巴黎浪漫之旅',
        destination: '巴黎, 法国',
        startDate: '2026-05-20',
        endDate: '2026-05-27',
        budget: 25000,
        status: 'completed',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        aiSuggestions: ['埃菲尔铁塔日落', '卢浮宫艺术之旅', '塞纳河游船'],
        createdAt: new Date().toISOString()
      }];
      setPlans(mockPlans);
      setFilteredPlans(mockPlans);
    } finally {
      setIsLoading(false);
    }
  };

  // 筛选和搜索
  useEffect(() => {
    let filtered = plans;

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(plan => plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || plan.destination.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredPlans(filtered);
  }, [searchQuery, statusFilter, plans]);

  // 创建新计划
  const handleCreatePlan = () => {
    navigateTo({
      pageId: 'create',
      params: {}
    });
  };

  // 查看计划详情
  const handleViewPlan = planId => {
    navigateTo({
      pageId: 'detail',
      params: {
        id: planId
      }
    });
  };

  // 编辑计划
  const handleEditPlan = planId => {
    navigateTo({
      pageId: 'create',
      params: {
        id: planId
      }
    });
  };

  // 删除计划
  const handleDeletePlan = async planId => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('Trip').doc(planId).remove();
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      toast({
        title: '删除成功',
        description: '计划已删除'
      });
    } catch (error) {
      console.error('删除计划失败:', error);
      toast({
        title: '删除失败',
        description: '无法删除该计划',
        variant: 'destructive'
      });
    }
  };

  // 导出计划
  const handleExportPlan = plan => {
    toast({
      title: '导出中',
      description: '正在生成PDF文档...'
    });
    setTimeout(() => {
      toast({
        title: '导出成功',
        description: 'PDF文档已生成'
      });
    }, 2000);
  };

  // 获取状态标签样式
  const getStatusBadge = status => {
    const styles = {
      planning: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      planning: '规划中',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    };
    return {
      style: styles[status] || 'bg-gray-100 text-gray-800',
      label: labels[status] || '未知'
    };
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFF0F5] to-[#F0F5FF] pb-20" style={{
    fontFamily: 'Quicksand, sans-serif'
  }}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigateTo({
              pageId: 'home',
              params: {}
            })} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                我的计划
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreatePlan} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl px-4 py-2 flex items-center gap-2" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                <Plus className="w-5 h-5" />
                <span>新建计划</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="搜索计划或目的地..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 rounded-xl border-gray-200 focus:border-[#FF6B6B] focus:ring-[#FF6B6B]" style={{
            fontFamily: 'Quicksand, sans-serif'
          }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#FF6B6B] focus:ring-[#FF6B6B] cursor-pointer" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            <option value="all">全部状态</option>
            <option value="planning">规划中</option>
            <option value="confirmed">已确认</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Plans List */}
      <div className="max-w-4xl mx-auto px-4">
        {isLoading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
          </div> : filteredPlans.length === 0 ? <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              暂无计划
            </h3>
            <p className="text-gray-500 mb-4" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              开始创建您的第一个旅行计划吧！
            </p>
            <Button onClick={handleCreatePlan} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl px-6 py-3" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              <Plus className="w-5 h-5 mr-2" />
              创建计划
            </Button>
          </div> : <div className="grid gap-4">
            {filteredPlans.map(plan => {
          const statusBadge = getStatusBadge(plan.status);
          return <div key={plan.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer" onClick={() => handleViewPlan(plan.id)}>
                  <div className="relative h-48">
                    <img src={plan.coverImage} alt={plan.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style}`} style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                      {plan.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      <MapPin className="w-4 h-4" />
                      <span>{plan.destination}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{plan.startDate} - {plan.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>¥{plan.budget.toLocaleString()}</span>
                      </div>
                    </div>
                    {plan.aiSuggestions && plan.aiSuggestions.length > 0 && <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F5FF] rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
                          <span className="text-sm font-medium text-gray-700" style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                            AI 建议
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {plan.aiSuggestions.slice(0, 3).map((suggestion, index) => <span key={index} className="px-2 py-1 bg-white rounded-lg text-xs text-gray-600" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                              {suggestion}
                            </span>)}
                        </div>
                      </div>}
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <Button onClick={() => handleEditPlan(plan.id)} variant="outline" size="sm" className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button onClick={() => handleExportPlan(plan)} variant="outline" size="sm" className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        <Download className="w-4 h-4 mr-1" />
                        导出
                      </Button>
                      <Button onClick={() => handleDeletePlan(plan.id)} variant="outline" size="sm" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>;
        })}
          </div>}
      </div>

      {/* TabBar */}
      <TabBar activeTab="home" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Plus, Search, MapPin, Calendar, DollarSign, Sparkles, Download, Trash2, Settings } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input } from '@/components/ui';

import { useGlobalSettings } from '@/components/GlobalSettings';
import TabBar from '@/components/TabBar';
import { LanguageThemeToggle } from '@/components/GlobalSettings';

// 国际化字典
const i18n = {
  zh: {
    title: '我的旅行计划 ✈️',
    subtitle: '让AI帮你规划完美旅程',
    searchPlaceholder: '搜索目的地或计划名称...',
    createPlan: '创建新计划',
    aiAssistant: 'AI助手',
    myPlans: '我的计划',
    noPlans: '还没有旅行计划，快去创建一个吧！',
    aiRecommendations: 'AI推荐',
    export: '导出',
    delete: '删除',
    deleteSuccess: '删除成功',
    deleteDesc: '旅游计划已删除',
    exportSuccess: '导出成功',
    exportDesc: '已导出为PDF',
    status: {
      planning: '规划中',
      confirmed: '已确认',
      completed: '已完成',
      unknown: '未知'
    }
  },
  en: {
    title: 'My Travel Plans ✈️',
    subtitle: 'Let AI help you plan the perfect journey',
    searchPlaceholder: 'Search destination or plan name...',
    createPlan: 'Create New Plan',
    aiAssistant: 'AI Assistant',
    myPlans: 'My Plans',
    noPlans: 'No travel plans yet, create one now!',
    aiRecommendations: 'AI Recommendations',
    export: 'Export',
    delete: 'Delete',
    deleteSuccess: 'Deleted Successfully',
    deleteDesc: 'Travel plan has been deleted',
    exportSuccess: 'Exported Successfully',
    exportDesc: 'Exported as PDF',
    status: {
      planning: 'Planning',
      confirmed: 'Confirmed',
      completed: 'Completed',
      unknown: 'Unknown'
    }
  }
};
export default function Home(props) {
  const {
    toast
  } = useToast();

  // 使用全局设置获取语言状态
  const {
    language
  } = useGlobalSettings();
  const t = i18n[language] || i18n.zh;
  const [plans, setPlans] = useState([{
    id: '1',
    title: '日本东京七日游',
    destination: '东京, 日本',
    startDate: '2026-03-15',
    endDate: '2026-03-22',
    budget: 15000,
    status: 'planning',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    aiSuggestions: ['推荐浅草寺', '建议体验和服', '必去秋叶原']
  }, {
    id: '2',
    title: '云南大理慢生活',
    destination: '大理, 中国',
    startDate: '2026-04-01',
    endDate: '2026-04-05',
    budget: 3000,
    status: 'confirmed',
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
    aiSuggestions: ['洱海骑行', '古城漫步', '品尝白族美食']
  }, {
    id: '3',
    title: '巴黎浪漫之旅',
    destination: '巴黎, 法国',
    startDate: '2026-05-20',
    endDate: '2026-05-27',
    budget: 25000,
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    aiSuggestions: ['埃菲尔铁塔日落', '卢浮宫艺术之旅', '塞纳河游船']
  }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlans, setFilteredPlans] = useState(plans);
  useEffect(() => {
    const filtered = plans.filter(plan => plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || plan.destination.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredPlans(filtered);
  }, [searchQuery, plans]);
  const handleCreatePlan = () => {
    props.$w.utils.navigateTo({
      pageId: 'create',
      params: {}
    });
  };
  const handleViewPlan = planId => {
    props.$w.utils.navigateTo({
      pageId: 'detail',
      params: {
        id: planId
      }
    });
  };
  const handleDeletePlan = (planId, e) => {
    e.stopPropagation();
    const updatedPlans = plans.filter(p => p.id !== planId);
    setPlans(updatedPlans);
    toast({
      title: t.deleteSuccess,
      description: t.deleteDesc,
      variant: 'default'
    });
  };
  const handleExportPlan = (planId, e) => {
    e.stopPropagation();
    const plan = plans.find(p => p.id === planId);
    toast({
      title: t.exportSuccess,
      description: `${plan.title} ${t.exportDesc}`,
      variant: 'default'
    });
  };
  const getStatusColor = status => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusText = status => {
    return t.status[status] || t.status.unknown;
  };
  return <div className="min-h-screen bg-[#FFF9F0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-6 pt-12">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              {t.title}
            </h1>
            <p className="text-white/90" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              {t.subtitle}
            </p>
          </div>
          <LanguageThemeToggle />
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <Input placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border-0 focus-visible:ring-0 text-base" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        <div className="flex gap-3">
          <Button onClick={handleCreatePlan} className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-2xl h-14 text-base font-semibold shadow-lg shadow-[#FF6B6B]/30">
            <Plus className="w-5 h-5 mr-2" />
            {t.createPlan}
          </Button>
          <Button onClick={() => props.$w.utils.navigateTo({
          pageId: 'ai',
          params: {}
        })} className="flex-1 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-2xl h-14 text-base font-semibold shadow-lg shadow-[#4ECDC4]/30">
            <Sparkles className="w-5 h-5 mr-2" />
            {t.aiAssistant}
          </Button>
        </div>
      </div>

      {/* Plans List */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <h2 className="text-xl font-bold text-[#2D3436] mb-4" style={{
        fontFamily: 'Nunito, sans-serif'
      }}>
          {t.myPlans} ({filteredPlans.length})
        </h2>
        
        {filteredPlans.length === 0 ? <div className="text-center py-12">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-500" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              {t.noPlans}
            </p>
          </div> : <div className="space-y-4">
            {filteredPlans.map(plan => <div key={plan.id} onClick={() => handleViewPlan(plan.id)} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-40">
                  <img src={plan.coverImage} alt={plan.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(plan.status)}`}>
                      {getStatusText(plan.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white text-lg font-bold" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                      {plan.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-3" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                    <span className="text-sm">{plan.destination}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-3" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#4ECDC4]" />
                      <span className="text-sm">{plan.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-[#FFE66D]" />
                      <span className="text-sm">¥{plan.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {plan.aiSuggestions && plan.aiSuggestions.length > 0 && <div className="bg-[#FFE66D]/20 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
                        <span className="text-sm font-semibold text-[#2D3436]">{t.aiRecommendations}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.aiSuggestions.slice(0, 3).map((suggestion, idx) => <span key={idx} className="px-2 py-1 bg-white rounded-md text-xs text-gray-700">
                            {suggestion}
                          </span>)}
                      </div>
                    </div>}
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white" onClick={e => handleExportPlan(plan.id, e)}>
                      <Download className="w-4 h-4 mr-1" />
                      {t.export}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-red-400 text-red-400 hover:bg-red-400 hover:text-white" onClick={e => handleDeletePlan(plan.id, e)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t.delete}
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* TabBar */}
      <TabBar activeTab="home" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
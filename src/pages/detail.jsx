// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Edit, Download, Share2, Sparkles, Plus, Trash2, CheckCircle, Camera, Navigation } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Textarea } from '@/components/ui';

import TabBar from '@/components/TabBar';
import PhotoGuideCard from '@/components/PhotoGuideCard';
export default function Detail(props) {
  const {
    toast
  } = useToast();
  const planId = props.$w.page.dataset.params.id;
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideContent, setNewGuideContent] = useState('');
  const [showAddGuide, setShowAddGuide] = useState(false);
  const [showAddItinerary, setShowAddItinerary] = useState(false);
  const [newItineraryTitle, setNewItineraryTitle] = useState('');
  const [newItineraryActivities, setNewItineraryActivities] = useState('');
  const [notes, setNotes] = useState([{
    id: '1',
    content: '记得提前办理签证',
    date: '2026-02-01'
  }, {
    id: '2',
    content: '预订浅草寺附近的酒店',
    date: '2026-02-03'
  }]);
  const [photoGuides, setPhotoGuides] = useState([]);
  const [itinerary, setItinerary] = useState([{
    id: '1',
    day: 1,
    title: '抵达东京',
    activities: [{
      name: '成田机场接机',
      destination: '成田国际机场',
      address: '千叶县成田市古込1-1'
    }, {
      name: '酒店入住',
      destination: '新宿王子酒店',
      address: '东京都新宿区歌舞伎町1-19-1'
    }, {
      name: '新宿初探',
      destination: '新宿站',
      address: '东京都新宿区西新宿1-1-4'
    }],
    completed: true
  }, {
    id: '2',
    day: 2,
    title: '浅草寺与晴空塔',
    activities: [{
      name: '浅草寺参拜',
      destination: '浅草寺',
      address: '东京都台东区浅草2-3-1'
    }, {
      name: '晴空塔观景',
      destination: '东京晴空塔',
      address: '东京都墨田区押上1-1-2'
    }, {
      name: '仲见世商店街',
      destination: '仲见世商店街',
      address: '东京都台东区浅草2-3-1'
    }],
    completed: false
  }, {
    id: '3',
    day: 3,
    title: '秋叶原动漫之旅',
    activities: [{
      name: '秋叶原电器街',
      destination: '秋叶原电器街',
      address: '东京都千代田区外神田1-15-6'
    }, {
      name: '女仆咖啡厅',
      destination: '秋叶原女仆咖啡厅',
      address: '东京都千代田区外神田3-15-6'
    }, {
      name: '动漫周边购物',
      destination: '秋叶原Radio会馆',
      address: '东京都千代田区外神田1-15-6'
    }],
    completed: false
  }]);
  useEffect(() => {
    // 模拟从数据库获取数据
    const mockPlan = {
      id: planId,
      title: '日本东京七日游',
      destination: '东京, 日本',
      startDate: '2026-03-15',
      endDate: '2026-03-22',
      budget: 15000,
      actualBudget: 12500,
      travelers: 2,
      status: 'planning',
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      description: '探索东京的传统与现代，体验日本文化的独特魅力。从古老的寺庙到繁华的购物区，从精致的料理到动漫文化，全方位感受东京的魅力。',
      aiSuggestions: ['推荐浅草寺 - 东京最古老的寺庙', '建议体验和服 - 在浅草或明治神宫', '必去秋叶原 - 动漫文化圣地', '推荐筑地市场 - 新鲜海鲜早餐', '建议购买JR Pass - 方便城际交通'],
      guides: [{
        id: '1',
        title: '东京交通攻略',
        content: '购买Suica卡，使用Google Maps导航，避开早晚高峰。'
      }, {
        id: '2',
        title: '美食推荐',
        content: '一兰拉面、筑地寿司、银座和牛。'
      }]
    };
    setPlan(mockPlan);

    // 模拟拍照指导数据
    const mockPhotoGuides = [{
      id: '1',
      title: '抖音热门运镜技巧',
      category: 'video',
      description: '学习抖音最火的运镜技巧，让你的旅行Vlog瞬间提升质感',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
      author: '旅行摄影师小王',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      likes: 1234,
      views: 5678,
      duration: '5:30',
      tags: ['运镜', 'Vlog', '技巧'],
      isHot: true,
      isNew: false,
      difficulty: '入门',
      relatedItinerary: '1',
      steps: [{
        title: '推拉镜头',
        description: '缓慢推进或拉远，突出主体',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
        tips: '保持稳定，速度均匀'
      }, {
        title: '环绕镜头',
        description: '围绕主体360度拍摄',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
        tips: '保持距离一致，避免抖动'
      }]
    }, {
      id: '2',
      title: '浅草寺拍照穿搭指南',
      category: 'outfit',
      description: '在浅草寺拍照的穿搭建议，让你和古建筑完美融合',
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
      author: '时尚博主小李',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      likes: 890,
      views: 3456,
      duration: '3:45',
      tags: ['穿搭', '浅草寺', '和风'],
      isHot: false,
      isNew: true,
      difficulty: '入门',
      relatedItinerary: '2',
      steps: [{
        title: '选择和风元素',
        description: '和服、浴衣或简约的日式服装',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
        tips: '避免过于鲜艳的颜色'
      }, {
        title: '配饰搭配',
        description: '简约的配饰，如发簪、折扇',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
        tips: '配饰不宜过多'
      }]
    }, {
      id: '3',
      title: '晴空塔拍照姿势大全',
      category: 'pose',
      description: '在晴空塔拍照的经典姿势，让你的照片更有纪念意义',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
      author: '摄影师小张',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      likes: 2345,
      views: 8901,
      duration: '4:20',
      tags: ['姿势', '晴空塔', '地标'],
      isHot: true,
      isNew: false,
      difficulty: '入门',
      relatedItinerary: '2',
      steps: [{
        title: '仰望姿势',
        description: '站在塔下仰望，突出塔的宏伟',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
        tips: '选择低角度拍摄'
      }, {
        title: '背影姿势',
        description: '背对镜头，眺望远方',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
        tips: '保持自然姿态'
      }]
    }, {
      id: '4',
      title: '秋叶原动漫拍照指南',
      category: 'pose',
      description: '在秋叶原拍照的姿势和穿搭建议，展现二次元风格',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      author: '动漫达人小陈',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      likes: 1567,
      views: 6789,
      duration: '5:10',
      tags: ['姿势', '秋叶原', '动漫'],
      isHot: false,
      isNew: true,
      difficulty: '入门',
      relatedItinerary: '3',
      steps: [{
        title: '动漫角色模仿',
        description: '模仿经典动漫角色的姿势',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        tips: '选择熟悉的角色'
      }, {
        title: '手办合影',
        description: '与手办或周边产品合影',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        tips: '注意光线和角度'
      }]
    }];
    setPhotoGuides(mockPhotoGuides);
  }, [planId]);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleEdit = () => {
    props.$w.utils.navigateTo({
      pageId: 'create',
      params: {
        id: planId
      }
    });
  };
  const handleExport = () => {
    toast({
      title: '导出成功',
      description: '计划已导出为PDF文档',
      variant: 'default'
    });
  };
  const handleShare = () => {
    toast({
      title: '分享链接已复制',
      description: '可以分享给好友一起规划',
      variant: 'default'
    });
  };
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      content: newNote,
      date: new Date().toISOString().split('T')[0]
    };
    setNotes([...notes, note]);
    setNewNote('');
    toast({
      title: '添加成功',
      description: '笔记已保存',
      variant: 'default'
    });
  };
  const handleDeleteNote = noteId => {
    setNotes(notes.filter(n => n.id !== noteId));
    toast({
      title: '删除成功',
      description: '笔记已删除',
      variant: 'default'
    });
  };
  const handleToggleActivity = (dayId, activityIndex) => {
    const updatedItinerary = itinerary.map(day => {
      if (day.id === dayId) {
        const newActivities = [...day.activities];
        const newCompleted = activityIndex === -1 ? !day.completed : day.completed;
        return {
          ...day,
          completed: newCompleted
        };
      }
      return day;
    });
    setItinerary(updatedItinerary);
  };
  const handleAddGuide = () => {
    if (!newGuideTitle.trim() || !newGuideContent.trim()) {
      toast({
        title: '请填写完整',
        description: '请输入攻略标题和内容',
        variant: 'destructive'
      });
      return;
    }
    const newGuide = {
      id: Date.now().toString(),
      title: newGuideTitle,
      content: newGuideContent
    };
    setPlan({
      ...plan,
      guides: [...plan.guides, newGuide]
    });
    setNewGuideTitle('');
    setNewGuideContent('');
    setShowAddGuide(false);
    toast({
      title: '添加成功',
      description: '攻略已保存',
      variant: 'default'
    });
  };
  const handleDeleteGuide = guideId => {
    setPlan({
      ...plan,
      guides: plan.guides.filter(g => g.id !== guideId)
    });
    toast({
      title: '删除成功',
      description: '攻略已删除',
      variant: 'default'
    });
  };
  const handleAddItinerary = () => {
    if (!newItineraryTitle.trim() || !newItineraryActivities.trim()) {
      toast({
        title: '请填写完整',
        description: '请输入行程标题和活动内容',
        variant: 'destructive'
      });
      return;
    }
    const activities = newItineraryActivities.split('\n').filter(a => a.trim());
    const newDay = {
      id: Date.now().toString(),
      day: itinerary.length + 1,
      title: newItineraryTitle,
      activities: activities,
      completed: false
    };
    setItinerary([...itinerary, newDay]);
    setNewItineraryTitle('');
    setNewItineraryActivities('');
    setShowAddItinerary(false);
    toast({
      title: '添加成功',
      description: '行程已添加',
      variant: 'default'
    });
  };
  const handleDeleteItinerary = dayId => {
    setItinerary(itinerary.filter(d => d.id !== dayId));
    toast({
      title: '删除成功',
      description: '行程已删除',
      variant: 'default'
    });
  };
  const handlePhotoGuideClick = guideId => {
    props.$w.utils.navigateTo({
      pageId: 'photo-guide-detail',
      params: {
        guideId: guideId
      }
    });
  };
  const getRelatedPhotoGuides = itineraryId => {
    return photoGuides.filter(guide => guide.relatedItinerary === itineraryId);
  };
  const handleNavigateToPhotoGuide = () => {
    props.$w.utils.navigateTo({
      pageId: 'photo-guide',
      params: {}
    });
  };
  const handleNavigateToDestination = (destination, address) => {
    // 打开地图导航
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
    toast({
      title: '正在打开导航',
      description: `前往 ${destination}`
    });
  };
  if (!plan) {
    return <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-[#FFF9F0] pb-24">
      {/* Header Image */}
      <div className="relative h-64">
        <img src={plan.coverImage} alt={plan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Back Button */}
        <button onClick={handleBack} className="absolute top-12 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-12 right-4 flex gap-2">
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg" onClick={handleShare}>
            <Share2 className="w-5 h-5 text-[#2D3436]" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg" onClick={handleExport}>
            <Download className="w-5 h-5 text-[#2D3436]" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg" onClick={handleEdit}>
            <Edit className="w-5 h-5 text-[#2D3436]" />
          </Button>
        </div>
        
        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-2" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            {plan.title}
          </h1>
          <div className="flex items-center gap-2 text-white/90" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{plan.destination}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 -mt-4 relative">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#FF6B6B]/10 rounded-xl p-3 text-center">
              <Calendar className="w-5 h-5 text-[#FF6B6B] mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">出发日期</p>
              <p className="text-sm font-semibold text-[#2D3436]">{plan.startDate}</p>
            </div>
            <div className="bg-[#4ECDC4]/10 rounded-xl p-3 text-center">
              <DollarSign className="w-5 h-5 text-[#4ECDC4] mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">预算</p>
              <p className="text-sm font-semibold text-[#2D3436]">¥{plan.budget.toLocaleString()}</p>
            </div>
            <div className="bg-[#FFE66D]/20 rounded-xl p-3 text-center">
              <Users className="w-5 h-5 text-[#FFE66D] mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">人数</p>
              <p className="text-sm font-semibold text-[#2D3436]">{plan.travelers}人</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h3 className="font-bold text-[#2D3436] mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              行程简介
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              {plan.description}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mt-4 overflow-hidden">
          <div className="flex border-b">
            {[{
            id: 'overview',
            label: '概览'
          }, {
            id: 'itinerary',
            label: '行程'
          }, {
            id: 'guides',
            label: '攻略'
          }, {
            id: 'notes',
            label: '笔记'
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-[#FF6B6B] text-white' : 'text-gray-600 hover:bg-gray-50'}`} style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                {tab.label}
              </button>)}
          </div>

          <div className="p-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
                    <h3 className="font-bold text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                      AI智能推荐
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {plan.aiSuggestions.map((suggestion, idx) => <div key={idx} className="bg-gradient-to-r from-[#FFE66D]/20 to-[#4ECDC4]/20 rounded-xl p-3 flex items-start gap-2">
                        <span className="text-[#FF6B6B]">✨</span>
                        <p className="text-sm text-gray-700" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                          {suggestion}
                        </p>
                      </div>)}
                  </div>
                </div>
                
                {/* Photo Guides Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-5 h-5 text-[#4ECDC4]" />
                    <h3 className="font-bold text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                      拍照打卡指导
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {photoGuides.slice(0, 4).map(guide => <PhotoGuideCard key={guide.id} guide={guide} onClick={() => handlePhotoGuideClick(guide.id)} />)}
                  </div>
                  <Button onClick={() => props.$w.utils.navigateTo({
                pageId: 'photo-guide',
                params: {}
              })} variant="outline" className="w-full mt-3 rounded-xl border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10">
                    查看更多拍照指导
                  </Button>
                </div>
              </div>}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && <div className="space-y-4">
                {showAddItinerary && <div className="mb-4 bg-[#FFF9F0] rounded-xl p-4">
                    <input type="text" placeholder="行程标题（如：第4天 - 返程）" value={newItineraryTitle} onChange={e => setNewItineraryTitle(e.target.value)} className="w-full mb-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]" style={{
                fontFamily: 'Quicksand, sans-serif'
              }} />
                    <Textarea placeholder="活动内容（每行一个活动）" value={newItineraryActivities} onChange={e => setNewItineraryActivities(e.target.value)} className="min-h-[80px] resize-none mb-2" />
                    <div className="flex gap-2">
                      <Button onClick={handleAddItinerary} className="flex-1 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                      <Button onClick={() => setShowAddItinerary(false)} variant="outline" className="flex-1 rounded-xl">
                        取消
                      </Button>
                    </div>
                  </div>}
                {itinerary.map(day => <div key={day.id} className={`border-l-4 pl-4 relative ${day.completed ? 'border-green-500' : 'border-red-500'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-bold ${day.completed ? 'text-green-600' : 'text-red-500'}`} style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                        第{day.day}天 - {day.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleActivity(day.id, -1)} className={`p-1 rounded-full ${day.completed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteItinerary(day.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <ul className="space-y-1 mb-3">
                      {day.activities.map((activity, idx) => <li key={idx} className="text-sm text-gray-600 flex items-center justify-between" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          <div className="flex items-center gap-2 flex-1">
                            <span className={`w-2 h-2 rounded-full ${day.completed ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={day.completed ? 'line-through text-gray-400' : ''}>{activity.name}</span>
                          </div>
                          <button onClick={() => handleNavigateToDestination(activity.destination, activity.address)} className="text-[#4ECDC4] hover:text-[#3DBDB5] transition-colors flex-shrink-0" title={`导航到 ${activity.destination}`}>
                            <Navigation className="w-4 h-4" />
                          </button>
                        </li>)}
                    </ul>
                    
                    {/* Related Photo Guides */}
                    {getRelatedPhotoGuides(day.id).length > 0 && <div className="mt-3">
                        <div onClick={handleNavigateToPhotoGuide} className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
                          <Camera className="w-4 h-4 text-[#4ECDC4]" />
                          <span className="text-xs font-semibold text-[#2D3436]" style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                            拍照指导
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">查看更多 →</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {getRelatedPhotoGuides(day.id).map(guide => <div key={guide.id} onClick={e => {
                    e.stopPropagation();
                    handlePhotoGuideClick(guide.id);
                  }} className="flex-shrink-0 w-32 bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                              <img src={guide.image} alt={guide.title} className="w-full h-20 object-cover" />
                              <div className="p-2">
                                <p className="text-xs font-semibold text-[#2D3436] line-clamp-1" style={{
                        fontFamily: 'Nunito, sans-serif'
                      }}>
                                  {guide.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {guide.category === 'video' ? '录像' : guide.category === 'outfit' ? '穿着' : '姿势'}
                                </p>
                              </div>
                            </div>)}
                        </div>
                      </div>}
                  </div>)}
                <Button onClick={() => setShowAddItinerary(true)} className="w-full bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  添加行程
                </Button>
              </div>}

            {/* Guides Tab */}
            {activeTab === 'guides' && <div>
                {showAddGuide && <div className="mb-4 bg-[#FFF9F0] rounded-xl p-4">
                    <input type="text" placeholder="攻略标题" value={newGuideTitle} onChange={e => setNewGuideTitle(e.target.value)} className="w-full mb-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" style={{
                fontFamily: 'Quicksand, sans-serif'
              }} />
                    <Textarea placeholder="攻略内容..." value={newGuideContent} onChange={e => setNewGuideContent(e.target.value)} className="min-h-[80px] resize-none mb-2" />
                    <div className="flex gap-2">
                      <Button onClick={handleAddGuide} className="flex-1 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                      <Button onClick={() => setShowAddGuide(false)} variant="outline" className="flex-1 rounded-xl">
                        取消
                      </Button>
                    </div>
                  </div>}
                <div className="space-y-3">
                  {plan.guides.map(guide => <div key={guide.id} className="bg-[#FFF9F0] rounded-xl p-4 relative">
                      <button onClick={() => handleDeleteGuide(guide.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h4 className="font-bold text-[#2D3436] mb-2" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                        {guide.title}
                      </h4>
                      <p className="text-sm text-gray-600" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {guide.content}
                      </p>
                    </div>)}
                </div>
                <Button onClick={() => setShowAddGuide(true)} className="w-full mt-4 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  添加攻略
                </Button>
              </div>}

            {/* Notes Tab */}
            {activeTab === 'notes' && <div>
                <div className="mb-4">
                  <Textarea placeholder="添加笔记..." value={newNote} onChange={e => setNewNote(e.target.value)} className="min-h-[80px] resize-none" />\n                  <Button onClick={handleAddNote} className="w-full mt-2 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    添加笔记
                  </Button>
                </div>
                <div className="space-y-3">
                  {notes.map(note => <div key={note.id} className="bg-gray-50 rounded-xl p-4 relative">
                      <button onClick={() => handleDeleteNote(note.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-gray-700 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {note.content}
                      </p>
                      <p className="text-xs text-gray-400">{note.date}</p>
                    </div>)}
                </div>
              </div>}
          </div>
        </div>
      </div>

      {/* TabBar */}
      <TabBar activeTab="home" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
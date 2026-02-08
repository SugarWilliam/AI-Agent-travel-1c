// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Heart, Share2, Play, Shirt, Camera, Sparkles, Filter, ChevronRight, Star, TrendingUp, Clock, Eye, RefreshCw, Brain, Bookmark, SlidersHorizontal, Zap } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

export default function PhotoGuide(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    preferredCategories: [],
    viewedGuides: [],
    favoriteTags: []
  });
  const [filterOptions, setFilterOptions] = useState({
    difficulty: 'all',
    duration: 'all',
    sortBy: 'hot'
  });
  const [aiSuggestions, setAISuggestions] = useState([]);

  // 模拟数据 - 拍照指导内容
  const guides = [{
    id: '1',
    title: '抖音热门运镜技巧',
    category: 'video',
    description: '掌握这5种运镜技巧，让你的旅行视频瞬间提升质感',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=500&fit=crop',
    author: '旅行达人小王',
    likes: 1234,
    views: 5678,
    duration: '3:45',
    tags: ['运镜', '抖音', '热门'],
    isHot: true,
    isNew: false,
    difficulty: '入门'
  }, {
    id: '2',
    title: '小红书爆款穿搭指南',
    category: 'outfit',
    description: '旅行穿搭不踩雷，这3套搭配让你成为街拍焦点',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    author: '时尚博主Lisa',
    likes: 2345,
    views: 8901,
    duration: '2:30',
    tags: ['穿搭', '小红书', '爆款'],
    isHot: true,
    isNew: true,
    difficulty: '入门'
  }, {
    id: '3',
    title: '必学拍照姿势大全',
    category: 'pose',
    description: '告别剪刀手，这10个拍照姿势让你美出新高度',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    author: '摄影师阿杰',
    likes: 3456,
    views: 12345,
    duration: '4:20',
    tags: ['姿势', '拍照', '技巧'],
    isHot: false,
    isNew: true,
    difficulty: '入门'
  }, {
    id: '4',
    title: '旅行Vlog剪辑教程',
    category: 'video',
    description: '从零开始教你剪辑旅行Vlog，轻松出大片',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=500&fit=crop',
    author: 'Vlog大神',
    likes: 1567,
    views: 6789,
    duration: '5:10',
    tags: ['剪辑', 'Vlog', '教程'],
    isHot: false,
    isNew: false,
    difficulty: '进阶'
  }, {
    id: '5',
    title: '海边拍照穿搭秘籍',
    category: 'outfit',
    description: '海边拍照怎么穿？这5套搭配让你美到窒息',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop',
    author: '海边小仙女',
    likes: 2890,
    views: 9876,
    duration: '3:15',
    tags: ['海边', '穿搭', '拍照'],
    isHot: true,
    isNew: false,
    difficulty: '入门'
  }, {
    id: '6',
    title: '情侣拍照姿势大全',
    category: 'pose',
    description: '情侣旅行拍照必备，这8个姿势甜到爆',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop',
    author: '情侣摄影师',
    likes: 4321,
    views: 15678,
    duration: '4:45',
    tags: ['情侣', '拍照', '姿势'],
    isHot: true,
    isNew: true,
    difficulty: '入门'
  }, {
    id: '7',
    title: '夜景拍摄技巧',
    category: 'video',
    description: '夜景怎么拍才好看？掌握这些技巧轻松出大片',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=500&fit=crop',
    author: '夜景大师',
    likes: 1876,
    views: 7654,
    duration: '3:30',
    tags: ['夜景', '拍摄', '技巧'],
    isHot: false,
    isNew: false,
    difficulty: '进阶'
  }, {
    id: '8',
    title: '山景穿搭指南',
    category: 'outfit',
    description: '爬山拍照怎么穿？实用又好看的山景穿搭',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=500&fit=crop',
    author: '户外达人',
    likes: 2134,
    views: 8765,
    duration: '2:45',
    tags: ['山景', '穿搭', '户外'],
    isHot: false,
    isNew: false,
    difficulty: '入门'
  }];
  const categories = [{
    id: 'all',
    name: '全部',
    icon: Sparkles
  }, {
    id: 'video',
    name: '录像指导',
    icon: Play
  }, {
    id: 'outfit',
    name: '穿着指导',
    icon: Shirt
  }, {
    id: 'pose',
    name: '姿势指导',
    icon: Camera
  }];
  useEffect(() => {
    // 从 localStorage 加载用户偏好
    const savedPreferences = localStorage.getItem('photoGuidePreferences');
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }

    // 从 localStorage 加载收藏
    const savedFavorites = localStorage.getItem('photoGuideFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // 生成 AI 建议
    generateAISuggestions();
    setLoading(false);
  }, []);

  // 保存用户偏好到 localStorage
  useEffect(() => {
    localStorage.setItem('photoGuidePreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // 保存收藏到 localStorage
  useEffect(() => {
    localStorage.setItem('photoGuideFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // 生成 AI 建议
  const generateAISuggestions = () => {
    const suggestions = [];

    // 根据用户偏好生成建议
    if (userPreferences.preferredCategories.length > 0) {
      const preferredGuides = guides.filter(g => userPreferences.preferredCategories.includes(g.category)).slice(0, 3);
      suggestions.push(...preferredGuides.map(g => ({
        ...g,
        reason: '根据您的浏览偏好推荐'
      })));
    } else {
      // 默认推荐热门内容
      suggestions.push(...guides.filter(g => g.isHot).slice(0, 3).map(g => ({
        ...g,
        reason: '热门推荐'
      })));
    }
    setAISuggestions(suggestions);
  };

  // 刷新功能
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 重新生成 AI 建议
      generateAISuggestions();
      toast({
        title: '刷新成功',
        description: '内容已更新'
      });
    } catch (error) {
      toast({
        title: '刷新失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 记录浏览历史
  const recordViewHistory = guideId => {
    const newViewedGuides = [...new Set([guideId, ...userPreferences.viewedGuides])].slice(0, 20);
    setUserPreferences(prev => ({
      ...prev,
      viewedGuides: newViewedGuides
    }));

    // 更新偏好分类
    const guide = guides.find(g => g.id === guideId);
    if (guide) {
      const newCategories = [...new Set([guide.category, ...userPreferences.preferredCategories])].slice(0, 3);
      setUserPreferences(prev => ({
        ...prev,
        preferredCategories: newCategories
      }));
    }
  };
  const filteredGuides = guides.filter(guide => {
    const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || guide.description.toLowerCase().includes(searchQuery.toLowerCase()) || guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = filterOptions.difficulty === 'all' || guide.difficulty === filterOptions.difficulty;
    const matchesDuration = filterOptions.duration === 'all' || filterOptions.duration === 'short' && parseInt(guide.duration) <= 3 || filterOptions.duration === 'medium' && parseInt(guide.duration) > 3 && parseInt(guide.duration) <= 5 || filterOptions.duration === 'long' && parseInt(guide.duration) > 5;
    return matchesCategory && matchesSearch && matchesDifficulty && matchesDuration;
  }).sort((a, b) => {
    if (filterOptions.sortBy === 'hot') {
      return b.likes - a.likes;
    } else if (filterOptions.sortBy === 'new') {
      return b.isNew ? 1 : -1;
    } else if (filterOptions.sortBy === 'views') {
      return b.views - a.views;
    }
    return 0;
  });
  const handleToggleFavorite = guideId => {
    if (favorites.includes(guideId)) {
      setFavorites(favorites.filter(id => id !== guideId));
      toast({
        title: '已取消收藏',
        description: '已从收藏中移除'
      });
    } else {
      setFavorites([...favorites, guideId]);
      toast({
        title: '收藏成功',
        description: '已添加到收藏'
      });
    }
  };

  // 查看收藏列表
  const handleViewFavorites = () => {
    const favoriteGuides = guides.filter(g => favorites.includes(g.id));
    if (favoriteGuides.length === 0) {
      toast({
        title: '暂无收藏',
        description: '您还没有收藏任何内容'
      });
      return;
    }
    // 可以跳转到收藏列表页面
    toast({
      title: '收藏列表',
      description: `共 ${favoriteGuides.length} 条收藏内容`
    });
  };
  const handleShare = guide => {
    toast({
      title: '分享成功',
      description: `已分享：${guide.title}`
    });
  };
  const handleGuideClick = guide => {
    // 记录浏览历史
    recordViewHistory(guide.id);
    $w.utils.navigateTo({
      pageId: 'photo-guide-detail',
      params: {
        guideId: guide.id
      }
    });
  };

  // 应用筛选
  const applyFilter = newFilterOptions => {
    setFilterOptions(newFilterOptions);
    setShowFilterModal(false);
    toast({
      title: '筛选已应用',
      description: '内容已按您的条件筛选'
    });
  };

  // 重置筛选
  const resetFilter = () => {
    setFilterOptions({
      difficulty: 'all',
      duration: 'all',
      sortBy: 'hot'
    });
    setShowFilterModal(false);
    toast({
      title: '筛选已重置',
      description: '显示全部内容'
    });
  };
  const formatNumber = num => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FFE4E1] to-[#E0F7FA] pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => $w.utils.navigateTo({
            pageId: 'home',
            params: {}
          })} className="text-gray-600 hover:text-[#FF6B6B] transition-colors">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <h1 className="text-xl font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              拍照打卡指导
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} className={`text-gray-600 hover:text-[#FF6B6B] transition-colors ${refreshing ? 'animate-spin' : ''}`}>
                <RefreshCw className="w-6 h-6" />
              </button>
              <button onClick={() => setShowFilterModal(true)} className="text-gray-600 hover:text-[#FF6B6B] transition-colors">
                <SlidersHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="搜索指导内容..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all" style={{
            fontFamily: 'Quicksand, sans-serif'
          }} />
          </div>
        </div>

        {/* 分类标签 */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => {
            const Icon = category.icon;
            return <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category.id ? 'bg-[#FF6B6B] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>;
          })}
          </div>
        </div>
      </div>

      {/* AI 智能建议 */}
      {showAISuggestions && aiSuggestions.length > 0 && <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#4ECDC4]" />
              <h2 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                AI 智能推荐
              </h2>
            </div>
            <button onClick={() => setShowAISuggestions(false)} className="text-xs text-gray-500 hover:text-[#FF6B6B] transition-colors">
              收起
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {aiSuggestions.map(guide => <div key={guide.id} onClick={() => handleGuideClick(guide)} className="flex-shrink-0 w-40 cursor-pointer group">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                  <img src={guide.image} alt={guide.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    AI推荐
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {guide.title}
                    </p>
                    <p className="text-white/80 text-xs mt-1 truncate">
                      {guide.reason}
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>}

      {/* 热门推荐 */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#FF6B6B]" />
          <h2 className="text-lg font-bold text-[#2D3436]" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            热门推荐
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {guides.filter(g => g.isHot).slice(0, 3).map(guide => <div key={guide.id} onClick={() => handleGuideClick(guide)} className="flex-shrink-0 w-40 cursor-pointer group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                <img src={guide.image} alt={guide.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2 bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full font-medium">
                  热门
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    {guide.title}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {/* 指导列表 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4ECDC4]" />
            <h2 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              {activeCategory === 'all' ? '全部指导' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            {(filterOptions.difficulty !== 'all' || filterOptions.duration !== 'all') && <span className="text-xs bg-[#FF6B6B] text-white px-2 py-0.5 rounded-full">
                已筛选
              </span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleViewFavorites} className="text-xs text-gray-500 hover:text-[#FF6B6B] transition-colors flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              我的收藏 ({favorites.length})
            </button>
            <span className="text-sm text-gray-500" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
              {filteredGuides.length} 条内容
            </span>
          </div>
        </div>

        {loading ? <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div> : filteredGuides.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Camera className="w-16 h-16 mb-4 text-gray-300" />
            <p>暂无相关内容</p>
          </div> : <div className="grid grid-cols-2 gap-3">
            {filteredGuides.map(guide => <div key={guide.id} onClick={() => handleGuideClick(guide)} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative">
                  <img src={guide.image} alt={guide.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {guide.isNew && <div className="bg-[#4ECDC4] text-white text-xs px-2 py-1 rounded-full font-medium">
                        新
                      </div>}
                    {guide.isHot && <div className="bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full font-medium">
                        热
                      </div>}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {guide.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-[#2D3436] text-sm mb-1 line-clamp-2" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                    {guide.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {formatNumber(guide.views)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Heart className="w-3 h-3" />
                        {formatNumber(guide.likes)}
                      </div>
                    </div>
                    <button onClick={e => {
                e.stopPropagation();
                handleToggleFavorite(guide.id);
              }} className={`p-1.5 rounded-full transition-all ${favorites.includes(guide.id) ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      <Heart className={`w-4 h-4 ${favorites.includes(guide.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* 筛选弹窗 */}
      {showFilterModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                筛选条件
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
            </div>
            
            {/* 难度筛选 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-3" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                难度等级
              </h4>
              <div className="flex gap-2">
                {['all', '入门', '进阶', '高级'].map(level => <button key={level} onClick={() => setFilterOptions(prev => ({
              ...prev,
              difficulty: level
            }))} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterOptions.difficulty === level ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {level === 'all' ? '全部' : level}
                  </button>)}
              </div>
            </div>
            
            {/* 时长筛选 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-3" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                视频时长
              </h4>
              <div className="flex gap-2">
                {[{
              id: 'all',
              label: '全部'
            }, {
              id: 'short',
              label: '3分钟内'
            }, {
              id: 'medium',
              label: '3-5分钟'
            }, {
              id: 'long',
              label: '5分钟以上'
            }].map(option => <button key={option.id} onClick={() => setFilterOptions(prev => ({
              ...prev,
              duration: option.id
            }))} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterOptions.duration === option.id ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {option.label}
                  </button>)}
              </div>
            </div>
            
            {/* 排序方式 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-3" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                排序方式
              </h4>
              <div className="flex gap-2">
                {[{
              id: 'hot',
              label: '最热'
            }, {
              id: 'new',
              label: '最新'
            }, {
              id: 'views',
              label: '最多浏览'
            }].map(option => <button key={option.id} onClick={() => setFilterOptions(prev => ({
              ...prev,
              sortBy: option.id
            }))} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterOptions.sortBy === option.id ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {option.label}
                  </button>)}
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button onClick={resetFilter} variant="outline" className="flex-1 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50">
                重置
              </Button>
              <Button onClick={() => applyFilter(filterOptions)} className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl">
                应用筛选
              </Button>
            </div>
          </div>
        </div>}

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2">
        <div className="flex items-center justify-around">
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'home',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#FF6B6B] transition-colors">
            <Camera className="w-6 h-6" />
            <span className="text-xs" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>首页</span>
          </button>
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'my-plans',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#FF6B6B] transition-colors">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>我的计划</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#FF6B6B]">
            <Camera className="w-6 h-6" />
            <span className="text-xs" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>拍照指导</span>
          </button>
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'profile',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#FF6B6B] transition-colors">
            <Heart className="w-6 h-6" />
            <span className="text-xs" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>我的</span>
          </button>
        </div>
      </div>
    </div>;
}
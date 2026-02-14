// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Heart, Share2, Play, Shirt, Camera, Sparkles, Filter, ChevronRight, Star, TrendingUp, Clock, Eye, RefreshCw, Palette, Wand2, Bookmark, Zap } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

import TabBar from '@/components/TabBar';
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
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: [],
    duration: [],
    tags: []
  });
  const [personalizedGuides, setPersonalizedGuides] = useState([]);
  const [showPersonalized, setShowPersonalized] = useState(false);

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
    difficulty: '入门',
    durationMinutes: 4
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
    difficulty: '入门',
    durationMinutes: 3
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
    difficulty: '入门',
    durationMinutes: 5
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
    difficulty: '进阶',
    durationMinutes: 6
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
    difficulty: '入门',
    durationMinutes: 4
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
    difficulty: '入门',
    durationMinutes: 5
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
    difficulty: '进阶',
    durationMinutes: 4
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
    difficulty: '入门',
    durationMinutes: 3
  }, {
    id: '9',
    title: '古建筑拍照姿势',
    category: 'pose',
    description: '在古建筑前拍照的姿势技巧，展现历史韵味',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=500&fit=crop',
    author: '古风摄影师',
    likes: 1678,
    views: 6789,
    duration: '3:20',
    tags: ['古建筑', '姿势', '历史'],
    isHot: false,
    isNew: true,
    difficulty: '入门',
    durationMinutes: 4
  }, {
    id: '10',
    title: '美食拍摄技巧',
    category: 'video',
    description: '美食怎么拍才诱人？学习专业美食拍摄技巧',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=500&fit=crop',
    author: '美食摄影师',
    likes: 2345,
    views: 8901,
    duration: '4:00',
    tags: ['美食', '拍摄', '技巧'],
    isHot: true,
    isNew: false,
    difficulty: '进阶',
    durationMinutes: 5
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
  const filterOptions = {
    difficulty: ['入门', '进阶', '高级'],
    duration: ['3分钟内', '3-5分钟', '5分钟以上'],
    tags: ['热门', '最新', '运镜', '穿搭', '姿势', '夜景', '美食', '情侣']
  };
  const outfitSuggestions = [{
    id: '1',
    title: '清新夏日风',
    description: '白色连衣裙 + 草帽 + 凉鞋',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
    tags: ['夏日', '清新', '连衣裙'],
    color: '#FFE4E1'
  }, {
    id: '2',
    title: '复古文艺风',
    description: '格子衬衫 + 牛仔裤 + 帆布鞋',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    tags: ['复古', '文艺', '休闲'],
    color: '#E0F7FA'
  }, {
    id: '3',
    title: '优雅气质风',
    description: '长裙 + 高跟鞋 + 手提包',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    tags: ['优雅', '气质', '长裙'],
    color: '#FFF9F0'
  }, {
    id: '4',
    title: '活力运动风',
    description: '运动套装 + 运动鞋 + 帽子',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    tags: ['运动', '活力', '休闲'],
    color: '#FFE66D'
  }];
  useEffect(() => {
    setLoading(false);
    generatePersonalizedGuides();
  }, []);
  const generatePersonalizedGuides = () => {
    // 模拟AI个性化推荐
    const personalized = guides.filter(g => g.isHot || g.isNew).sort((a, b) => b.likes - a.likes).slice(0, 3);
    setPersonalizedGuides(personalized);
  };
  const filteredGuides = guides.filter(guide => {
    const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || guide.description.toLowerCase().includes(searchQuery.toLowerCase()) || guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // 筛选条件
    const matchesDifficulty = selectedFilters.difficulty.length === 0 || selectedFilters.difficulty.includes(guide.difficulty);
    const matchesDuration = selectedFilters.duration.length === 0 || checkDurationFilter(guide.durationMinutes, selectedFilters.duration);
    const matchesTags = selectedFilters.tags.length === 0 || guide.tags.some(tag => selectedFilters.tags.includes(tag));
    return matchesCategory && matchesSearch && matchesDifficulty && matchesDuration && matchesTags;
  });
  const checkDurationFilter = (minutes, filters) => {
    if (filters.includes('3分钟内') && minutes <= 3) return true;
    if (filters.includes('3-5分钟') && minutes > 3 && minutes <= 5) return true;
    if (filters.includes('5分钟以上') && minutes > 5) return true;
    return false;
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新数据
    await new Promise(resolve => setTimeout(resolve, 1000));
    generatePersonalizedGuides();
    setRefreshing(false);
    toast({
      title: '刷新成功',
      description: '内容已更新'
    });
  };
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
  const handleShare = guide => {
    toast({
      title: '分享成功',
      description: `已分享：${guide.title}`
    });
  };
  const handleGuideClick = guide => {
    $w.utils.navigateTo({
      pageId: 'photo-guide-detail',
      params: {
        guideId: guide.id
      }
    });
  };
  const handleFilterToggle = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value) ? prev[filterType].filter(item => item !== value) : [...prev[filterType], value]
    }));
  };
  const handleClearFilters = () => {
    setSelectedFilters({
      difficulty: [],
      duration: [],
      tags: []
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
              <button onClick={() => setShowFilterModal(true)} className="text-gray-600 hover:text-[#FF6B6B] transition-colors relative">
                <Filter className="w-6 h-6" />
                {(selectedFilters.difficulty.length > 0 || selectedFilters.duration.length > 0 || selectedFilters.tags.length > 0) && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B6B] text-white text-xs rounded-full flex items-center justify-center">
                    {selectedFilters.difficulty.length + selectedFilters.duration.length + selectedFilters.tags.length}
                  </span>}
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

      {/* AI个性化推荐 */}
      {showPersonalized && personalizedGuides.length > 0 && <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#FF6B6B]" />
              <h2 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                AI为你推荐
              </h2>
            </div>
            <button onClick={() => setShowPersonalized(false)} className="text-sm text-gray-500 hover:text-[#FF6B6B]">
              收起
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {personalizedGuides.map(guide => <div key={guide.id} onClick={() => handleGuideClick(guide)} className="flex-shrink-0 w-40 cursor-pointer group">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                  <img src={guide.image} alt={guide.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    AI推荐
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
        </div>}

      {/* 穿搭建议按钮 */}
      <div className="px-4 mt-4">
        <button onClick={() => setShowOutfitModal(true)} className="w-full bg-gradient-to-r from-[#FFE66D] to-[#FF6B6B] text-white rounded-2xl p-4 flex items-center justify-between shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                穿搭建议
              </h3>
              <p className="text-sm opacity-90" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                获取个性化穿搭推荐
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

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
          </div>
          <span className="text-sm text-gray-500" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            {filteredGuides.length} 条内容
          </span>
        </div>

        {loading ? <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div> : filteredGuides.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Camera className="w-16 h-16 mb-4 text-gray-300" />
            <p>暂无相关内容</p>
            {(selectedFilters.difficulty.length > 0 || selectedFilters.duration.length > 0 || selectedFilters.tags.length > 0) && <button onClick={handleClearFilters} className="mt-4 px-4 py-2 bg-[#FF6B6B] text-white rounded-full text-sm">
                清除筛选
              </button>}
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
          <div className="bg-white w-full max-w-full sm:max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                筛选条件
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-[#FF6B6B]">
                <ChevronRight className="w-6 h-6 rotate-90" />
              </button>
            </div>
            
            {/* 难度筛选 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-3" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                难度
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.difficulty.map(difficulty => <button key={difficulty} onClick={() => handleFilterToggle('difficulty', difficulty)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.difficulty.includes(difficulty) ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {difficulty}
                  </button>)}
              </div>
            </div>
            
            {/* 时长筛选 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-3" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                时长
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.duration.map(duration => <button key={duration} onClick={() => handleFilterToggle('duration', duration)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.duration.includes(duration) ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {duration}
                  </button>)}
              </div>
            </div>
            
            {/* 标签筛选 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-3" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                标签
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.tags.map(tag => <button key={tag} onClick={() => handleFilterToggle('tags', tag)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilters.tags.includes(tag) ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                    {tag}
                  </button>)}
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button onClick={handleClearFilters} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                清除筛选
              </button>
              <button onClick={() => setShowFilterModal(false)} className="flex-1 py-3 bg-[#FF6B6B] text-white rounded-xl font-semibold hover:bg-[#FF5252] transition-all" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                确定
              </button>
            </div>
          </div>
        </div>}

      {/* 穿搭建议弹窗 */}
      {showOutfitModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-full sm:max-w-lg rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                穿搭建议
              </h3>
              <button onClick={() => setShowOutfitModal(false)} className="text-gray-500 hover:text-[#FF6B6B]">
                <ChevronRight className="w-6 h-6 rotate-90" />
              </button>
            </div>
            
            <div className="space-y-4">
              {outfitSuggestions.map(outfit => <div key={outfit.id} className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all" style={{
            backgroundColor: outfit.color
          }}>
                  <img src={outfit.image} alt={outfit.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-[#2D3436] mb-2" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                      {outfit.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      {outfit.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {outfit.tags.map(tag => <span key={tag} className="px-3 py-1 bg-white/60 text-gray-700 rounded-full text-xs font-medium" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          {tag}
                        </span>)}
                    </div>
                  </div>
                </div>)}
            </div>
            
            <button onClick={() => setShowOutfitModal(false)} className="w-full mt-6 py-3 bg-[#FF6B6B] text-white rounded-xl font-semibold hover:bg-[#FF5252] transition-all" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              关闭
            </button>
          </div>
        </div>}

      {/* TabBar */}
      <TabBar activeTab="photo-guide" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
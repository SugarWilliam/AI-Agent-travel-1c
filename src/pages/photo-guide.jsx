// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Heart, Share2, Play, Shirt, Camera, Sparkles, Filter, ChevronRight, Star, TrendingUp, Clock, Eye } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

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
    isNew: false
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
    isNew: true
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
    isNew: true
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
    isNew: false
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
    isNew: false
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
    isNew: true
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
    isNew: false
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
    isNew: false
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
    setLoading(false);
  }, []);
  const filteredGuides = guides.filter(guide => {
    const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || guide.description.toLowerCase().includes(searchQuery.toLowerCase()) || guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
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
            <button className="text-gray-600 hover:text-[#FF6B6B] transition-colors">
              <Filter className="w-6 h-6" />
            </button>
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
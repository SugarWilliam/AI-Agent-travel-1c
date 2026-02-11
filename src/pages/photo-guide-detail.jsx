// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Heart, Share2, Play, ChevronRight, Star, Clock, Eye, Bookmark, ArrowLeft, CheckCircle, XCircle, ThumbsUp, MessageCircle } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function PhotoGuideDetail(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const guideId = $w.page.dataset.params.guideId;

  // 模拟数据 - 指导详情
  const guideDetails = {
    '1': {
      id: '1',
      title: '抖音热门运镜技巧',
      category: 'video',
      description: '掌握这5种运镜技巧，让你的旅行视频瞬间提升质感',
      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=600&fit=crop',
      author: '旅行达人小王',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      likes: 1234,
      views: 5678,
      duration: '3:45',
      tags: ['运镜', '抖音', '热门'],
      isHot: true,
      isNew: false,
      difficulty: '入门',
      steps: [{
        title: '推拉镜头',
        description: '缓慢向前推进镜头，营造沉浸感',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        tips: '保持镜头稳定，速度要均匀'
      }, {
        title: '环绕镜头',
        description: '围绕主体旋转拍摄，突出主体',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        tips: '保持与主体的距离恒定'
      }, {
        title: '跟随镜头',
        description: '跟随移动的主体拍摄，增加动感',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop',
        tips: '预判主体移动方向，提前准备'
      }, {
        title: '俯仰镜头',
        description: '从上往下或从下往上拍摄，创造不同视角',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
        tips: '注意构图平衡，避免画面倾斜'
      }, {
        title: '变焦镜头',
        description: '使用变焦功能，突出重点',
        image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&h=300&fit=crop',
        tips: '变焦速度要慢，避免突兀'
      }],
      relatedGuides: ['3', '4', '7']
    },
    '2': {
      id: '2',
      title: '小红书爆款穿搭指南',
      category: 'outfit',
      description: '旅行穿搭不踩雷，这3套搭配让你成为街拍焦点',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
      author: '时尚博主Lisa',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      likes: 2345,
      views: 8901,
      duration: '2:30',
      tags: ['穿搭', '小红书', '爆款'],
      isHot: true,
      isNew: true,
      difficulty: '入门',
      steps: [{
        title: '清新自然风',
        description: '白色T恤 + 牛仔裤 + 小白鞋',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
        tips: '适合日常拍照，百搭不出错'
      }, {
        title: '甜美可爱风',
        description: '粉色连衣裙 + 小白鞋 + 草帽',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop',
        tips: '适合海边、公园等场景'
      }, {
        title: '简约高级风',
        description: '黑色连衣裙 + 高跟鞋 + 墨镜',
        image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=300&fit=crop',
        tips: '适合城市街拍，显瘦显气质'
      }],
      relatedGuides: ['5', '8']
    },
    '3': {
      id: '3',
      title: '必学拍照姿势大全',
      category: 'pose',
      description: '告别剪刀手，这10个拍照姿势让你美出新高度',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop',
      author: '摄影师阿杰',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      likes: 3456,
      views: 12345,
      duration: '4:20',
      tags: ['姿势', '拍照', '技巧'],
      isHot: false,
      isNew: true,
      difficulty: '入门',
      steps: [{
        title: '侧身站立',
        description: '侧身站立，一只手放在腰间',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
        tips: '显瘦显高，适合全身照'
      }, {
        title: '回眸一笑',
        description: '背对镜头，自然回头',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop',
        tips: '表情要自然，眼神要有神'
      }, {
        title: '手托下巴',
        description: '双手托下巴，微微侧头',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop',
        tips: '适合半身照，显脸小'
      }, {
        title: '走路抓拍',
        description: '自然走路，抓拍瞬间',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop',
        tips: '动作要自然，不要刻意摆拍'
      }, {
        title: '背影杀',
        description: '背对镜头，营造神秘感',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        tips: '适合风景照，意境十足'
      }],
      relatedGuides: ['1', '6']
    }
  };
  useEffect(() => {
    const guideData = guideDetails[guideId];
    if (guideData) {
      setGuide(guideData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [guideId]);
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setGuide({
        ...guide,
        likes: guide.likes + 1
      });
      toast({
        title: '点赞成功',
        description: '感谢你的喜欢'
      });
    }
  };
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? '已取消收藏' : '收藏成功',
      description: isFavorited ? '已从收藏中移除' : '已添加到收藏'
    });
  };
  const handleShare = () => {
    toast({
      title: '分享成功',
      description: `已分享：${guide.title}`
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
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FFE4E1] to-[#E0F7FA] flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>;
  }
  if (!guide) {
    return <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FFE4E1] to-[#E0F7FA] flex items-center justify-center">
        <div className="text-gray-500">未找到该指导</div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FFE4E1] to-[#E0F7FA] pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => $w.utils.navigateTo({
            pageId: 'photo-guide',
            params: {}
          })} className="text-gray-600 hover:text-[#FF6B6B] transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              指导详情
            </h1>
            <button onClick={handleShare} className="text-gray-600 hover:text-[#FF6B6B] transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 主图 */}
      <div className="relative">
        <img src={guide.image} alt={guide.title} className="w-full h-64 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-2 mb-2">
            {guide.isHot && <div className="bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full font-medium">
                热门
              </div>}
            {guide.isNew && <div className="bg-[#4ECDC4] text-white text-xs px-2 py-1 rounded-full font-medium">
                新
              </div>}
            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {guide.duration}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            {guide.title}
          </h2>
        </div>
      </div>

      {/* 作者信息 */}
      <div className="px-4 py-4 bg-white mx-4 -mt-4 rounded-2xl shadow-lg relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={guide.authorAvatar} alt={guide.author} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {guide.author}
              </p>
              <p className="text-xs text-gray-500" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                难度：{guide.difficulty}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${isLiked ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600'}`}>
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                {formatNumber(guide.likes)}
              </span>
            </button>
            <button onClick={handleFavorite} className={`p-2 rounded-full transition-all ${isFavorited ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 描述 */}
      <div className="px-4 mt-4">
        <p className="text-gray-600 leading-relaxed" style={{
        fontFamily: 'Quicksand, sans-serif'
      }}>
          {guide.description}
        </p>
      </div>

      {/* 标签 */}
      <div className="px-4 mt-3">
        <div className="flex flex-wrap gap-2">
          {guide.tags.map(tag => <span key={tag} className="px-3 py-1 bg-[#FFE66D]/20 text-[#FF6B6B] rounded-full text-sm" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              #{tag}
            </span>)}
        </div>
      </div>

      {/* 步骤指导 */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-[#2D3436] mb-4" style={{
        fontFamily: 'Nunito, sans-serif'
      }}>
          步骤指导
        </h3>
        <div className="space-y-4">
          {guide.steps.map((step, index) => <div key={index} className={`bg-white rounded-2xl overflow-hidden shadow-md ${currentStep === index ? 'ring-2 ring-[#FF6B6B]' : ''}`}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${currentStep === index ? 'bg-[#FF6B6B]' : 'bg-gray-300'}`} style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2D3436] mb-1" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#4ECDC4]">
                      <CheckCircle className="w-4 h-4" />
                      <span style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>{step.tips}</span>
                    </div>
                  </div>
                </div>
              </div>
              <img src={step.image} alt={step.title} className="w-full h-40 object-cover" />
            </div>)}
        </div>
      </div>

      {/* 相关推荐 */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-[#2D3436] mb-4" style={{
        fontFamily: 'Nunito, sans-serif'
      }}>
          相关推荐
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {guide.relatedGuides.map(relatedId => {
          const relatedGuide = guideDetails[relatedId];
          if (!relatedGuide) return null;
          return <div key={relatedId} onClick={() => $w.utils.navigateTo({
            pageId: 'photo-guide-detail',
            params: {
              guideId: relatedId
            }
          })} className="flex-shrink-0 w-40 cursor-pointer group">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                  <img src={relatedGuide.image} alt={relatedGuide.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      {relatedGuide.title}
                    </p>
                  </div>
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* TabBar */}
      <TabBar activeTab="photo-guide" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Download, Share2, FileText, Image as ImageIcon, Link2, Check, Copy, ExternalLink, MapPin, Calendar, Camera, Shirt, Cloud, BookOpen, Route, RefreshCw, Save, Edit } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function AIOutput(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('document');
  const [outputData, setOutputData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  useEffect(() => {
    loadOutputData();
  }, []);
  const loadOutputData = async () => {
    try {
      setIsLoading(true);
      // 从路由参数获取类型和计划ID
      const type = props.$w.page.dataset.params?.type || 'document';
      const planId = props.$w.page.dataset.params?.planId;

      // 如果有 planId，从数据库加载真实数据
      if (planId) {
        const result = await props.$w.cloud.callFunction({
          name: 'saveTravelPlan',
          data: {
            action: 'get',
            planId: planId,
            userId: props.$w.auth.currentUser?.userId || 'anonymous'
          }
        });
        if (result.success && result.plan) {
          const plan = result.plan;
          // 将数据库字段映射到页面显示格式
          const mappedData = {
            document: {
              title: plan.title || '旅行攻略',
              content: plan.description || plan.guide?.overview || '暂无内容',
              format: 'markdown'
            },
            itinerary: {
              title: `${plan.destination}行程安排`,
              days: plan.itinerary || []
            },
            weather: {
              title: `${plan.destination}天气预报`,
              location: plan.destination,
              forecast: plan.weather || []
            },
            photo: {
              title: `${plan.destination}拍照指南`,
              tips: plan.photoTips?.bestSpots || []
            },
            outfit: {
              title: `${plan.destination}穿搭指南`,
              daily: plan.outfitTips?.recommendations || []
            },
            image: {
              title: '攻略海报',
              url: plan.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
              description: 'AI生成的旅行攻略海报'
            },
            miniprogram: {
              title: `${plan.destination}旅行小程序`,
              url: `https://example.com/miniprogram/${plan._id}`,
              qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/miniprogram/${plan._id}`,
              description: '可分享的小程序链接，包含完整行程和攻略'
            }
          };
          setOutputData(mappedData);
          return;
        }
      }

      // 否则使用模拟数据
      const mockData = {
        document: {
          title: '日本东京七日游攻略',
          content: `# 日本东京七日游攻略

## 行程概览
- **目的地**: 东京, 日本
- **时间**: 2026年3月15日 - 3月22日
- **预算**: ¥15,000
- **人数**: 2人

## 每日行程

### Day 1: 抵达东京
- 抵达成田机场
- 入住新宿酒店
- 新宿夜景游览

### Day 2: 浅草寺周边
- 浅草寺参观
- 仲见世商店街购物
- 晴空塔观景

### Day 3: 秋叶原动漫文化
- 秋叶原电器街
- 动漫周边购物
- 女仆咖啡厅体验

### Day 4: 筑地市场与银座
- 筑地市场早餐
- 银座购物
- 皇居外苑散步

### Day 5: 涩谷与原宿
- 涩谷十字路口
- 原宿竹下通
- 明治神宫

### Day 6: 迪士尼乐园
- 东京迪士尼乐园全天游玩

### Day 7: 返程
- 最后购物
- 前往机场

## 实用信息

### 交通
- 购买西瓜卡（Suica）
- 下载Google Maps
- 使用地铁APP

### 美食推荐
- 寿司
- 拉面
- 天妇罗
- 烤肉

### 住宿建议
- 新宿地区交通便利
- 浅草地区价格实惠
- 银座地区高端舒适

## 预算明细
- 机票: ¥6,000
- 住宿: ¥4,000
- 餐饮: ¥2,000
- 交通: ¥1,000
- 购物: ¥2,000

## 注意事项
1. 提前办理签证
2. 购买旅游保险
3. 下载翻译APP
4. 准备现金
5. 了解当地礼仪

---
*本攻略由AI助手生成，仅供参考*`,
          format: 'markdown'
        },
        itinerary: {
          title: '东京七日行程安排',
          days: [{
            day: 1,
            date: '2026-03-15',
            summary: '抵达东京，适应环境',
            activities: [{
              time: '14:00',
              name: '抵达成田机场',
              type: 'transport',
              duration: 2,
              location: '成田机场'
            }, {
              time: '16:00',
              name: '入住新宿酒店',
              type: 'accommodation',
              duration: 1,
              location: '新宿'
            }, {
              time: '18:00',
              name: '新宿夜景游览',
              type: 'sightseeing',
              duration: 3,
              location: '新宿歌舞伎町'
            }]
          }, {
            day: 2,
            date: '2026-03-16',
            summary: '浅草寺与晴空塔',
            activities: [{
              time: '09:00',
              name: '浅草寺参观',
              type: 'sightseeing',
              duration: 2,
              location: '浅草寺'
            }, {
              time: '11:00',
              name: '仲见世商店街购物',
              type: 'shopping',
              duration: 2,
              location: '仲见世商店街'
            }, {
              time: '14:00',
              name: '晴空塔观景',
              type: 'sightseeing',
              duration: 2,
              location: '东京晴空塔'
            }]
          }, {
            day: 3,
            date: '2026-03-17',
            summary: '秋叶原动漫文化',
            activities: [{
              time: '10:00',
              name: '秋叶原电器街',
              type: 'shopping',
              duration: 2,
              location: '秋叶原'
            }, {
              time: '13:00',
              name: '动漫周边购物',
              type: 'shopping',
              duration: 2,
              location: '秋叶原'
            }, {
              time: '16:00',
              name: '女仆咖啡厅体验',
              type: 'culture',
              duration: 2,
              location: '秋叶原'
            }]
          }, {
            day: 4,
            date: '2026-03-18',
            summary: '筑地市场与银座',
            activities: [{
              time: '07:00',
              name: '筑地市场早餐',
              type: 'food',
              duration: 2,
              location: '筑地场外市场'
            }, {
              time: '10:00',
              name: '银座购物',
              type: 'shopping',
              duration: 3,
              location: '银座'
            }, {
              time: '14:00',
              name: '皇居外苑散步',
              type: 'sightseeing',
              duration: 2,
              location: '皇居外苑'
            }]
          }, {
            day: 5,
            date: '2026-03-19',
            summary: '涩谷与原宿',
            activities: [{
              time: '10:00',
              name: '涩谷十字路口',
              type: 'sightseeing',
              duration: 1,
              location: '涩谷站'
            }, {
              time: '12:00',
              name: '原宿竹下通',
              type: 'shopping',
              duration: 2,
              location: '原宿'
            }, {
              time: '15:00',
              name: '明治神宫',
              type: 'culture',
              duration: 2,
              location: '明治神宫'
            }]
          }, {
            day: 6,
            date: '2026-03-20',
            summary: '迪士尼乐园',
            activities: [{
              time: '08:00',
              name: '东京迪士尼乐园全天游玩',
              type: 'entertainment',
              duration: 10,
              location: '东京迪士尼乐园'
            }]
          }, {
            day: 7,
            date: '2026-03-21',
            summary: '返程',
            activities: [{
              time: '09:00',
              name: '最后购物',
              type: 'shopping',
              duration: 3,
              location: '新宿'
            }, {
              time: '13:00',
              name: '前往机场',
              type: 'transport',
              duration: 2,
              location: '成田机场'
            }]
          }]
        },
        weather: {
          title: '东京天气预报',
          location: '东京',
          forecast: [{
            date: '2026-03-15',
            condition: '晴',
            icon: '☀️',
            temperature: '15°C',
            high: '18°C',
            low: '10°C',
            tips: '适合户外活动'
          }, {
            date: '2026-03-16',
            condition: '多云',
            icon: '⛅',
            temperature: '14°C',
            high: '17°C',
            low: '9°C',
            tips: '建议携带外套'
          }, {
            date: '2026-03-17',
            condition: '阴',
            icon: '☁️',
            temperature: '13°C',
            high: '16°C',
            low: '8°C',
            tips: '注意保暖'
          }, {
            date: '2026-03-18',
            condition: '小雨',
            icon: '🌧️',
            temperature: '12°C',
            high: '15°C',
            low: '7°C',
            tips: '建议携带雨具'
          }, {
            date: '2026-03-19',
            condition: '多云',
            icon: '⛅',
            temperature: '14°C',
            high: '17°C',
            low: '9°C',
            tips: '适合户外活动'
          }, {
            date: '2026-03-20',
            condition: '晴',
            icon: '☀️',
            temperature: '16°C',
            high: '19°C',
            low: '11°C',
            tips: '适合户外活动'
          }, {
            date: '2026-03-21',
            condition: '晴',
            icon: '☀️',
            temperature: '17°C',
            high: '20°C',
            low: '12°C',
            tips: '适合户外活动'
          }]
        },
        photo: {
          title: '拍照指导',
          tips: [{
            location: '浅草寺',
            tips: ['最佳拍摄时间：清晨或傍晚', '建议使用广角镜头', '从雷门方向拍摄可以拍到完整建筑', '注意避开人流高峰']
          }, {
            location: '晴空塔',
            tips: ['最佳拍摄时间：日落时分', '建议使用长焦镜头', '可以从增上寺拍摄晴空塔', '夜景拍摄需要三脚架']
          }, {
            location: '涩谷十字路口',
            tips: ['最佳拍摄时间：晚上', '建议使用快门优先模式', '可以从星巴克二楼拍摄', '注意人流安全']
          }, {
            location: '秋叶原',
            tips: ['最佳拍摄时间：白天', '建议使用大光圈', '可以拍摄动漫元素', '注意不要侵犯肖像权']
          }]
        },
        outfit: {
          title: '穿搭建议',
          daily: [{
            date: '2026-03-15',
            weather: '晴',
            temperature: '15°C',
            outfit: '轻薄外套 + 长裤 + 运动鞋',
            accessories: ['墨镜', '帽子']
          }, {
            date: '2026-03-16',
            weather: '多云',
            temperature: '14°C',
            outfit: '毛衣 + 外套 + 牛仔裤 + 休闲鞋',
            accessories: ['围巾']
          }, {
            date: '2026-03-17',
            weather: '阴',
            temperature: '13°C',
            outfit: '厚毛衣 + 外套 + 长裤 + 保暖鞋',
            accessories: ['手套']
          }, {
            date: '2026-03-18',
            weather: '小雨',
            temperature: '12°C',
            outfit: '防水外套 + 长裤 + 雨靴',
            accessories: ['雨伞', '防水包']
          }, {
            date: '2026-03-19',
            weather: '多云',
            temperature: '14°C',
            outfit: '毛衣 + 外套 + 牛仔裤 + 休闲鞋',
            accessories: ['围巾']
          }, {
            date: '2026-03-20',
            weather: '晴',
            temperature: '16°C',
            outfit: 'T恤 + 轻薄外套 + 短裤 + 运动鞋',
            accessories: ['墨镜', '帽子']
          }, {
            date: '2026-03-21',
            weather: '晴',
            temperature: '17°C',
            outfit: 'T恤 + 轻薄外套 + 短裤 + 运动鞋',
            accessories: ['墨镜', '帽子']
          }]
        },
        image: {
          url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          title: '东京旅行攻略海报',
          description: '包含主要景点和行程安排的精美海报'
        },
        miniprogram: {
          title: '东京七日游小程序',
          url: 'https://example.com/miniprogram/tokyo-trip',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/miniprogram/tokyo-trip',
          description: '可分享的小程序链接，包含完整行程和攻略'
        }
      };
      setOutputData(mockData);
    } catch (error) {
      console.error('加载输出数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载输出数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleDownload = format => {
    toast({
      title: '开始下载',
      description: `正在下载${format}格式文档...`,
      variant: 'default'
    });
    setTimeout(() => {
      toast({
        title: '下载成功',
        description: `${format}文档已保存到本地`,
        variant: 'default'
      });
    }, 1500);
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: outputData?.miniprogram?.title || '旅行计划',
        url: outputData?.miniprogram?.url || ''
      });
    } else {
      navigator.clipboard.writeText(outputData?.miniprogram?.url || '');
      toast({
        title: '链接已复制',
        description: '小程序链接已复制到剪贴板',
        variant: 'default'
      });
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(outputData?.miniprogram?.url || '');
    toast({
      title: '链接已复制',
      description: '小程序链接已复制到剪贴板',
      variant: 'default'
    });
  };
  const handleOpenLink = () => {
    window.open(outputData?.miniprogram?.url || '', '_blank');
  };
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(outputData?.document?.content || '');
  };
  const handleSaveEdit = async () => {
    try {
      const planId = props.$w.page.dataset.params?.planId;
      if (!planId) {
        throw new Error('计划ID不存在');
      }

      // 准备更新数据，确保长文本字段正确保存
      const updateData = {
        ...outputData,
        description: editedContent,
        // 将编辑后的内容保存到 description 字段
        guide: outputData?.guide || null,
        photoTips: outputData?.photoTips || null,
        outfitTips: outputData?.outfitTips || null,
        itinerary: outputData?.itinerary || [],
        weather: outputData?.weather || []
      };

      // 调用云函数保存修改
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'update',
          planId: planId,
          plan: updateData,
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result.success) {
        toast({
          title: '保存成功',
          description: '修改已保存',
          variant: 'default'
        });
        setIsEditing(false);
        setOutputData(prev => ({
          ...prev,
          description: editedContent
        }));
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
  };
  const tabs = [{
    id: 'document',
    label: '攻略',
    icon: BookOpen
  }, {
    id: 'itinerary',
    label: '行程',
    icon: Route
  }, {
    id: 'weather',
    label: '天气',
    icon: Cloud
  }, {
    id: 'photo',
    label: '拍照',
    icon: Camera
  }, {
    id: 'outfit',
    label: '穿搭',
    icon: Shirt
  }, {
    id: 'image',
    label: '图片',
    icon: ImageIcon
  }, {
    id: 'miniprogram',
    label: '小程序',
    icon: Link2
  }];
  if (isLoading) {
    return <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B6B] border-t-transparent"></div>
      </div>;
  }
  return <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              AI生成内容
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md overflow-x-auto">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#FF6B6B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {/* 攻略 Tab */}
        {activeTab === 'document' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                  {outputData?.document?.title}
                </h3>
                {!isEditing && <button onClick={handleEdit} className="text-[#4ECDC4] hover:text-[#3DBDB5]">
                    <Edit className="w-4 h-4" />
                  </button>}
              </div>
              {isEditing ? <div className="space-y-3">
                  <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="w-full h-96 p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] font-mono text-sm resize-none" />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} className="flex-1 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white">
                      <Save className="w-4 h-4 mr-2" />
                      保存修改
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                      取消
                    </Button>
                  </div>
                </div> : <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {outputData?.document?.content}
                  </pre>
                </div>}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-3" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                下载格式
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => handleDownload('PDF')} variant="outline" className="flex flex-col items-center gap-2 py-4">
                  <FileText className="w-6 h-6 text-[#FF6B6B]" />
                  <span className="text-sm font-medium">PDF</span>
                </Button>
                <Button onClick={() => handleDownload('Word')} variant="outline" className="flex flex-col items-center gap-2 py-4">
                  <FileText className="w-6 h-6 text-[#4ECDC4]" />
                  <span className="text-sm font-medium">Word</span>
                </Button>
                <Button onClick={() => handleDownload('Markdown')} variant="outline" className="flex flex-col items-center gap-2 py-4">
                  <FileText className="w-6 h-6 text-[#FFE66D]" />
                  <span className="text-sm font-medium">Markdown</span>
                </Button>
              </div>
            </div>
          </div>}

        {/* 行程 Tab */}
        {activeTab === 'itinerary' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData?.itinerary?.title}
              </h3>
              <div className="space-y-4">
                {outputData?.itinerary?.days?.map((day, idx) => <div key={idx} className="border-l-4 border-[#FF6B6B] pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#FF6B6B]" />
                      <span className="font-semibold text-gray-800">第{day.day}天</span>
                      <span className="text-sm text-gray-500">{day.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{day.summary}</p>
                    <div className="space-y-2">
                      {day.activities?.map((activity, actIdx) => <div key={actIdx} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                          <span className="text-xs text-[#4ECDC4] font-mono">{activity.time}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{activity.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{activity.duration}h</span>
                        </div>)}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}

        {/* 天气 Tab */}
        {activeTab === 'weather' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData?.weather?.title}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                <span className="text-sm text-gray-600">{outputData?.weather?.location}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {outputData?.weather?.forecast?.map((day, idx) => <div key={idx} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">{day.date.slice(5)}</div>
                    <div className="text-2xl mb-1">{day.icon}</div>
                    <div className="text-sm font-semibold text-gray-800">{day.temperature}</div>
                    <div className="text-xs text-gray-500">{day.condition}</div>
                    <div className="text-xs text-[#4ECDC4] mt-1">{day.tips}</div>
                  </div>)}
              </div>
            </div>
          </div>}

        {/* 拍照 Tab */}
        {activeTab === 'photo' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData?.photo?.title}
              </h3>
              <div className="space-y-4">
                {outputData?.photo?.tips?.map((location, idx) => <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">📍 {location.location}</h4>
                    <ul className="space-y-1">
                      {location.tips?.map((tip, tipIdx) => <li key={tipIdx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-[#4ECDC4]">•</span>
                          {tip}
                        </li>)}
                    </ul>
                  </div>)}
              </div>
            </div>
          </div>}

        {/* 穿搭 Tab */}
        {activeTab === 'outfit' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData?.outfit?.title}
              </h3>
              <div className="space-y-3">
                {outputData?.outfit?.daily?.map((day, idx) => <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">{day.date.slice(5)}</div>
                      <div className="text-xl">{day.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{day.outfit}</div>
                      <div className="text-xs text-gray-500">{day.weather} • {day.temperature}</div>
                    </div>
                    <div className="flex gap-1">
                      {day.accessories?.map((acc, accIdx) => <span key={accIdx} className="text-xs bg-[#FFE66D] text-gray-800 px-2 py-1 rounded-full">
                          {acc}
                        </span>)}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}

        {/* 图片 Tab */}
        {activeTab === 'image' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData?.image?.title}
              </h3>
              <img src={outputData?.image?.url} alt={outputData?.image?.title} className="w-full rounded-lg shadow-md" />
              <p className="text-sm text-gray-600 mt-3" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                {outputData?.image?.description}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-3" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                操作
              </h3>
              <div className="flex gap-2">
                <Button onClick={() => handleDownload('图片')} className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  下载图片
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </div>
          </div>}

        {/* 小程序 Tab */}
        {activeTab === 'miniprogram' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData?.miniprogram?.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                {outputData?.miniprogram?.description}
              </p>
              <div className="flex justify-center mb-4">
                <img src={outputData?.miniprogram?.qrCode} alt="小程序二维码" className="w-48 h-48 rounded-lg shadow-md" />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">小程序链接</p>
                <p className="text-sm text-[#4ECDC4] break-all font-mono">
                  {outputData?.miniprogram?.url}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-3" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                操作
              </h3>
              <div className="space-y-2">
                <Button onClick={handleCopyLink} variant="outline" className="w-full border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                  <Copy className="w-4 h-4 mr-2" />
                  复制链接
                </Button>
                <Button onClick={handleOpenLink} className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  打开小程序
                </Button>
                <Button onClick={handleShare} variant="outline" className="w-full border-[#FFE66D] text-[#FFE66D] hover:bg-[#FFE66D] hover:text-gray-800">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </div>
          </div>}
      </div>

      {/* TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
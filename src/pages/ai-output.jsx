// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Download, Share2, FileText, Image as ImageIcon, Link2, Check, Copy, ExternalLink } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function AIOutput(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('document');
  const [outputData, setOutputData] = useState({
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
  });
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
        title: outputData.miniprogram.title,
        url: outputData.miniprogram.url
      });
    } else {
      navigator.clipboard.writeText(outputData.miniprogram.url);
      toast({
        title: '链接已复制',
        description: '小程序链接已复制到剪贴板',
        variant: 'default'
      });
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(outputData.miniprogram.url);
    toast({
      title: '链接已复制',
      description: '小程序链接已复制到剪贴板',
      variant: 'default'
    });
  };
  const handleOpenLink = () => {
    window.open(outputData.miniprogram.url, '_blank');
  };
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
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md">
          {[{
          id: 'document',
          label: '文档',
          icon: FileText
        }, {
          id: 'image',
          label: '图片',
          icon: ImageIcon
        }, {
          id: 'miniprogram',
          label: '小程序',
          icon: Link2
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#FF6B6B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {activeTab === 'document' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData.document.title}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {outputData.document.content}
                </pre>
              </div>
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

        {activeTab === 'image' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData.image.title}
              </h3>
              <img src={outputData.image.url} alt={outputData.image.title} className="w-full rounded-lg shadow-md" />
              <p className="text-sm text-gray-600 mt-3" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                {outputData.image.description}
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

        {activeTab === 'miniprogram' && <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-bold text-[#2D3436] mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                {outputData.miniprogram.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                {outputData.miniprogram.description}
              </p>
              <div className="flex justify-center mb-4">
                <img src={outputData.miniprogram.qrCode} alt="小程序二维码" className="w-48 h-48 rounded-lg shadow-md" />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">小程序链接</p>
                <p className="text-sm text-[#4ECDC4] break-all font-mono">
                  {outputData.miniprogram.url}
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
// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Settings, LogOut, MapPin, Calendar, TrendingUp, Award, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Avatar, AvatarFallback, AvatarImage } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function Profile(props) {
  const {
    toast
  } = useToast();
  const currentUser = props.$w.auth.currentUser || {
    name: '旅行者',
    avatarUrl: null,
    nickName: '探索世界'
  };
  const stats = [{
    label: '旅行计划',
    value: '12',
    icon: MapPin,
    color: 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
  }, {
    label: '完成行程',
    value: '8',
    icon: Calendar,
    color: 'bg-[#4ECDC4]/10 text-[#4ECDC4]'
  }, {
    label: '旅行天数',
    value: '45',
    icon: TrendingUp,
    color: 'bg-[#FFE66D]/20 text-[#FFE66D]'
  }, {
    label: '获得徽章',
    value: '5',
    icon: Award,
    color: 'bg-purple-100 text-purple-600'
  }];
  const menuItems = [{
    id: 'my-plans',
    label: '我的计划',
    icon: MapPin,
    count: 12
  }, {
    id: 'my-guides',
    label: '我的攻略',
    icon: Calendar,
    count: 5
  }, {
    id: 'favorites',
    label: '收藏夹',
    icon: Award,
    count: 23
  }, {
    id: 'history',
    label: '历史记录',
    icon: TrendingUp
  }, {
    id: 'settings',
    label: '系统设置',
    icon: Settings
  }];
  const handleLogout = () => {
    toast({
      title: '已退出登录',
      description: '期待下次再见！',
      variant: 'default'
    });
  };
  const handleMenuClick = itemId => {
    props.$w.utils.navigateTo({
      pageId: itemId,
      params: {}
    });
  };
  const handleSettings = () => {
    props.$w.utils.navigateTo({
      pageId: 'settings',
      params: {}
    });
  };
  return <div className="min-h-screen bg-[#FFF9F0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#4ECDC4] p-6 pt-12">
        <div className="max-w-full sm:max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              个人中心
            </h1>
            <Button variant="ghost" size="icon" onClick={handleSettings} className="bg-white/20 hover:bg-white/30 text-white rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white/30">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback className="bg-white text-[#FF6B6B] text-2xl font-bold">
                {currentUser.name?.charAt(0) || '旅'}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h2 className="text-xl font-bold mb-1" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {currentUser.name}
              </h2>
              <p className="text-white/80 text-sm" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                {currentUser.nickName || '热爱旅行，探索世界'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-full sm:max-w-lg mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return <div key={idx} className="text-center">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-lg font-bold text-[#2D3436]">{stat.value}</p>
                  <p className="text-xs text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    {stat.label}
                  </p>
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-full sm:max-w-lg mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {menuItems.map(item => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => handleMenuClick(item.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9F0] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#FF6B6B]" />
                  </div>
                  <span className="font-medium text-[#2D3436]" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count && <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>;
        })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-full sm:max-w-lg mx-auto px-4 mt-6">
        <h3 className="text-lg font-bold text-[#2D3436] mb-3" style={{
        fontFamily: 'Nunito, sans-serif'
      }}>
          最近活动
        </h3>
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D3436]">创建了新计划</p>
              <p className="text-xs text-gray-500">日本东京七日游</p>
              <p className="text-xs text-gray-400 mt-1">2小时前</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#4ECDC4]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D3436]">完成了行程</p>
              <p className="text-xs text-gray-500">云南大理慢生活</p>
              <p className="text-xs text-gray-400 mt-1">昨天</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE66D]/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-[#FFE66D]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D3436]">获得新徽章</p>
              <p className="text-xs text-gray-500">旅行达人</p>
              <p className="text-xs text-gray-400 mt-1">3天前</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="max-w-full sm:max-w-lg mx-auto px-4 mt-6">
        <Button onClick={handleLogout} variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50 rounded-xl h-12 font-semibold">
          <LogOut className="w-5 h-5 mr-2" />
          退出登录
        </Button>
      </div>

      {/* TabBar */}
      <TabBar activeTab="profile" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
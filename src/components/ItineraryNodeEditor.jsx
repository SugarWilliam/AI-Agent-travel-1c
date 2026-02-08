// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Clock, MapPin, Navigation, Check, X, Edit2, Trash2, Plus, Search, XCircle } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function ItineraryNodeEditor({
  node,
  dayId,
  dayCompleted,
  onTimeChange,
  onNameChange,
  onDestinationChange,
  onDelete,
  onNavigate,
  showTime = true
}) {
  const {
    toast
  } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [editTime, setEditTime] = useState(node.time || '09:00');
  const [editDestination, setEditDestination] = useState(node.destination || '');
  const [editAddress, setEditAddress] = useState(node.address || '');
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [nodeStatus, setNodeStatus] = useState('pending'); // pending, overdue, completed
  const [userLocation, setUserLocation] = useState(null);

  // 检查节点状态
  useEffect(() => {
    checkNodeStatus();
    // 自动获取用户位置
    getUserLocation();
    // 每分钟检查一次状态
    const interval = setInterval(checkNodeStatus, 60000);
    return () => clearInterval(interval);
  }, [node.time, dayCompleted]);

  // 检查节点状态（时间和位置）
  const checkNodeStatus = () => {
    if (dayCompleted) {
      setNodeStatus('completed');
      return;
    }

    // 检查时间是否过期
    const now = new Date();
    const [hours, minutes] = (node.time || '09:00').split(':').map(Number);
    const nodeTime = new Date();
    nodeTime.setHours(hours, minutes, 0, 0);

    // 判断三种状态
    if (now.getTime() <= nodeTime.getTime()) {
      // 还没开始：当前时间还没到节点时间
      setNodeStatus('pending');
    } else if (userLocation && node.destination && node.address) {
      // 已经过了时间，检查位置
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude,
      // 这里需要将地址转换为坐标，简化处理
      35.714765,
      // 浅草寺示例坐标
      139.796655);
      if (distance <= 200) {
        // 已完成：到了时间并且定位在目的地 200米范围内
        setNodeStatus('completed');
      } else {
        // 过期：已经过了时间并且定位也不在目的地 200米范围内
        setNodeStatus('overdue');
      }
    } else {
      // 已经过了时间但没有位置信息，标记为过期
      setNodeStatus('overdue');
    }
  };

  // 检查用户是否到达目的地
  const checkLocationArrival = () => {
    if (!userLocation || !node.destination || !node.address) return;

    // 计算用户位置与目的地的距离
    const distance = calculateDistance(userLocation.latitude, userLocation.longitude,
    // 这里需要将地址转换为坐标，简化处理
    35.714765,
    // 浅草寺示例坐标
    139.796655);

    // 如果距离小于200米，认为已到达
    if (distance <= 200) {
      setNodeStatus('completed');
      toast({
        title: '到达目的地',
        description: `已到达 ${node.destination}`
      });
    }
  };

  // 计算两点之间的距离（单位：米）
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // 地球半径（米）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 获取用户位置
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        // 获取位置后重新检查状态
        checkNodeStatus();
      }, error => {
        console.error('获取位置失败:', error);
        // 位置获取失败不影响状态检查，只是无法判断是否到达
        checkNodeStatus();
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      console.warn('浏览器不支持地理定位');
      // 不支持定位也不影响状态检查
      checkNodeStatus();
    }
  };
  const handleSave = () => {
    if (!editName.trim()) {
      toast({
        title: '保存失败',
        description: '节点名称不能为空',
        variant: 'destructive'
      });
      return;
    }
    onNameChange(node.id, editName);
    if (showTime) {
      onTimeChange(node.id, editTime);
    }
    onDestinationChange(node.id, {
      destination: editDestination,
      address: editAddress
    });
    setIsEditing(false);
    toast({
      title: '保存成功',
      description: '节点信息已更新'
    });
  };
  const handleCancel = () => {
    setEditName(node.name);
    setEditTime(node.time || '09:00');
    setEditDestination(node.destination || '');
    setEditAddress(node.address || '');
    setIsEditing(false);
  };
  const handleNavigate = () => {
    if (node.destination && node.address) {
      onNavigate(node.destination, node.address);
    } else {
      toast({
        title: '无法导航',
        description: '请先设置目的地信息',
        variant: 'destructive'
      });
    }
  };

  // 打开地图选择器
  const handleOpenMapSelector = () => {
    setShowMapSelector(true);
    setMapSearchQuery('');
    setMapSearchResults([]);
  };

  // 搜索地图位置
  const handleMapSearch = async () => {
    if (!mapSearchQuery.trim()) {
      toast({
        title: '搜索失败',
        description: '请输入搜索关键词',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 使用 Google Places API 进行搜索
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(mapSearchQuery)}&key=YOUR_API_KEY`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setMapSearchResults(data.results.slice(0, 5));
      } else {
        toast({
          title: '搜索结果',
          description: '未找到相关地点',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('地图搜索失败:', error);
      toast({
        title: '搜索失败',
        description: '无法连接地图服务',
        variant: 'destructive'
      });
    }
  };

  // 选择地图位置
  const handleSelectMapLocation = location => {
    setEditDestination(location.name);
    setEditAddress(location.formatted_address);
    setShowMapSelector(false);
    toast({
      title: '选择成功',
      description: `已选择: ${location.name}`
    });
  };
  return <div className="flex items-center justify-between py-2 group">
      {isEditing ? <div className="flex-1 space-y-2">
          <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" placeholder="节点名称" />
          {showTime && <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" />}
          
          {/* 目的地名称 - 带地图选择按钮 */}
          <div className="relative">
            <input type="text" value={editDestination} onChange={e => setEditDestination(e.target.value)} className="w-full px-2 py-1 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" placeholder="目的地名称" />
            <button onClick={handleOpenMapSelector} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-[#4ECDC4] hover:text-[#3DBDB5] transition-colors" title="从地图选择">
              <MapPin className="w-4 h-4" />
            </button>
          </div>
          
          {/* 详细地址 - 带地图选择按钮 */}
          <div className="relative">
            <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full px-2 py-1 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" placeholder="详细地址" />
            <button onClick={handleOpenMapSelector} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-[#4ECDC4] hover:text-[#3DBDB5] transition-colors" title="从地图选择">
              <MapPin className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 text-xs bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3DBDB5] transition-colors">
              <Check className="w-3 h-3" />
              保存
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
              <X className="w-3 h-3" />
              取消
            </button>
          </div>
          
          {/* 地图选择器弹窗 */}
          {showMapSelector && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-4 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                    选择目的地
                  </h3>
                  <button onClick={() => setShowMapSelector(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* 搜索框 */}
                <div className="relative mb-4">
                  <input type="text" value={mapSearchQuery} onChange={e => setMapSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleMapSearch()} className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#4ECDC4]" placeholder="搜索地点..." />
                  <button onClick={handleMapSearch} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#4ECDC4] hover:text-[#3DBDB5] transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                
                {/* 搜索结果 */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {mapSearchResults.length > 0 ? mapSearchResults.map((result, index) => <button key={index} onClick={() => handleSelectMapLocation(result)} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                            {result.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {result.formatted_address}
                          </p>
                        </div>
                      </div>
                    </button>) : <div className="text-center py-8 text-gray-400">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">输入关键词搜索地点</p>
                    </div>}
                </div>
              </div>
            </div>}
        </div> : <div className="flex items-center gap-2 flex-1">
          {/* 完成状态图标 - 根据状态显示不同样式 */}
          {nodeStatus === 'completed' || dayCompleted ? <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div> : nodeStatus === 'overdue' ? <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <XCircle className="w-3 h-3 text-white" />
            </div> : <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full" />}

          {/* 时间显示 */}
          {showTime && <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${nodeStatus === 'completed' ? 'text-green-500' : nodeStatus === 'overdue' ? 'text-red-500' : 'text-gray-500'}`}>
              <Clock className="w-3 h-3" />
              <span>{node.time || '09:00'}</span>
            </div>}

          {/* 节点名称 */}
          <span className={`text-sm flex-1 ${nodeStatus === 'completed' ? 'text-green-500' : nodeStatus === 'overdue' ? 'text-red-500' : 'text-gray-700'}`} style={{
        fontFamily: 'Quicksand, sans-serif'
      }}>
            {node.name}
          </span>

          {/* 目的地信息 */}
          {node.destination && <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${nodeStatus === 'completed' ? 'text-green-500' : nodeStatus === 'overdue' ? 'text-red-500' : 'text-gray-500'}`}>
              <MapPin className="w-3 h-3" />
              <span className="max-w-20 truncate">{node.destination}</span>
            </div>}
        </div>}

      {/* 操作按钮 */}
      {!isEditing && <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-[#FF6B6B] transition-colors" title="编辑">
            <Edit2 className="w-4 h-4" />
          </button>
          {node.destination && node.address && <button onClick={handleNavigate} className="p-1 text-[#4ECDC4] hover:text-[#3DBDB5] transition-colors" title="导航">
              <Navigation className="w-4 h-4" />
            </button>}
          {/* 定位按钮 - 检查是否到达目的地 */}
          {node.destination && node.address && <button onClick={getUserLocation} className="p-1 text-blue-400 hover:text-blue-600 transition-colors" title="检查位置">
              <MapPin className="w-4 h-4" />
            </button>}
          <button onClick={() => onDelete(node.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="删除">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>}
    </div>;
}
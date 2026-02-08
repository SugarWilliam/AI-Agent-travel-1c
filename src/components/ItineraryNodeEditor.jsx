// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Clock, MapPin, Navigation, Check, X, Edit2, Trash2, Plus } from 'lucide-react';
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
  return <div className="flex items-center justify-between py-2 group">
      {isEditing ? <div className="flex-1 space-y-2">
          <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" placeholder="节点名称" />
          {showTime && <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" />}
          <input type="text" value={editDestination} onChange={e => setEditDestination(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" placeholder="目的地名称" />
          <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B6B]" placeholder="详细地址" />
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
        </div> : <div className="flex items-center gap-2 flex-1">
          {/* 完成状态图标 */}
          {dayCompleted ? <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div> : <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full" />}

          {/* 时间显示 */}
          {showTime && <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{node.time || '09:00'}</span>
            </div>}

          {/* 节点名称 */}
          <span className={`text-sm flex-1 ${dayCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`} style={{
        fontFamily: 'Quicksand, sans-serif'
      }}>
            {node.name}
          </span>

          {/* 目的地信息 */}
          {node.destination && <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
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
          <button onClick={() => onDelete(node.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="删除">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>}
    </div>;
}
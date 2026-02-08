// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Share2, Eye, EyeOff, Save, Check, X, MapPin, Calendar, DollarSign, FileText, Sparkles, Loader2 } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Switch } from '@/components/ui';

export default function CompanionSettings(props) {
  const {
    toast
  } = useToast();
  const [companionId, setCompanionId] = useState('');
  const [companion, setCompanion] = useState(null);
  const [permissions, setPermissions] = useState({
    canViewOverview: true,
    canViewItinerary: true,
    canViewGuides: true,
    canViewNotes: false,
    canEditItinerary: false,
    canEditGuides: false,
    canEditNotes: false,
    canViewBudget: true,
    canEditBudget: false,
    canViewAI: true,
    canReceiveNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const {
      params
    } = props.$w.page.dataset;
    if (params && params.companionId) {
      setCompanionId(params.companionId);
      loadCompanionData(params.companionId);
    }
  }, []);
  const loadCompanionData = async id => {
    try {
      setLoading(true);

      // 从数据库加载同伴数据
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'companion_relations',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: id
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result) {
        setCompanion({
          id: result._id,
          name: result.companionName,
          avatar: result.companionAvatar,
          email: result.companionEmail,
          phone: result.companionPhone,
          joinDate: result.joinDate,
          sharedPlans: [],
          status: result.status
        });

        // 加载权限设置
        if (result.permissions) {
          setPermissions(result.permissions);
        }
      }
    } catch (error) {
      console.error('加载同伴数据失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法加载同伴数据',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handlePermissionChange = key => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSave = async () => {
    try {
      setSaving(true);

      // 更新权限设置到数据库
      await props.$w.cloud.callDataSource({
        dataSourceName: 'companion_relations',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            permissions: permissions
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: companionId
                }
              }]
            }
          }
        }
      });
      toast({
        title: '设置已保存',
        description: `已更新 ${companion?.name} 的分享权限`
      });
      props.$w.utils.navigateBack();
    } catch (error) {
      console.error('保存设置失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '无法保存设置',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    props.$w.utils.navigateBack();
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto text-[#FF6B6B] animate-spin mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>;
  }
  if (!companion) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">未找到同伴信息</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-orange-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              分享权限设置
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Companion Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <img src={companion.avatar} alt={companion.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-200" />
            <div>
              <h2 className="text-xl font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                {companion.name}
              </h2>
              <p className="text-sm text-gray-600">{companion.email}</p>
              <p className="text-xs text-gray-500 mt-1">加入时间: {companion.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Permission Groups */}
        <div className="space-y-4">
          {/* View Permissions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                查看权限
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">查看行程概览</p>
                    <p className="text-xs text-gray-500">查看行程基本信息和目的地</p>
                  </div>
                </div>
                <Switch checked={permissions.canViewOverview} onCheckedChange={() => handlePermissionChange('canViewOverview')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">查看详细行程</p>
                    <p className="text-xs text-gray-500">查看每日行程安排</p>
                  </div>
                </div>
                <Switch checked={permissions.canViewItinerary} onCheckedChange={() => handlePermissionChange('canViewItinerary')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">查看攻略</p>
                    <p className="text-xs text-gray-500">查看旅行攻略和建议</p>
                  </div>
                </div>
                <Switch checked={permissions.canViewGuides} onCheckedChange={() => handlePermissionChange('canViewGuides')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">查看笔记</p>
                    <p className="text-xs text-gray-500">查看旅行笔记和记录</p>
                  </div>
                </div>
                <Switch checked={permissions.canViewNotes} onCheckedChange={() => handlePermissionChange('canViewNotes')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">查看预算</p>
                    <p className="text-xs text-gray-500">查看行程预算和花费</p>
                  </div>
                </div>
                <Switch checked={permissions.canViewBudget} onCheckedChange={() => handlePermissionChange('canViewBudget')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">查看AI建议</p>
                    <p className="text-xs text-gray-500">查看AI生成的建议</p>
                  </div>
                </div>
                <Switch checked={permissions.canViewAI} onCheckedChange={() => handlePermissionChange('canViewAI')} />
              </div>
            </div>
          </div>

          {/* Edit Permissions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                编辑权限
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">编辑行程</p>
                    <p className="text-xs text-gray-500">可以修改行程安排</p>
                  </div>
                </div>
                <Switch checked={permissions.canEditItinerary} onCheckedChange={() => handlePermissionChange('canEditItinerary')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">编辑攻略</p>
                    <p className="text-xs text-gray-500">可以添加和修改攻略</p>
                  </div>
                </div>
                <Switch checked={permissions.canEditGuides} onCheckedChange={() => handlePermissionChange('canEditGuides')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">编辑笔记</p>
                    <p className="text-xs text-gray-500">可以添加和修改笔记</p>
                  </div>
                </div>
                <Switch checked={permissions.canEditNotes} onCheckedChange={() => handlePermissionChange('canEditNotes')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">编辑预算</p>
                    <p className="text-xs text-gray-500">可以修改预算和花费</p>
                  </div>
                </div>
                <Switch checked={permissions.canEditBudget} onCheckedChange={() => handlePermissionChange('canEditBudget')} />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-bold text-gray-800" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                通知设置
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-xs">🔔</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">接收通知</p>
                    <p className="text-xs text-gray-500">接收行程更新和变更通知</p>
                  </div>
                </div>
                <Switch checked={permissions.canReceiveNotifications} onCheckedChange={() => handlePermissionChange('canReceiveNotifications')} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleCancel} className="flex-1 rounded-xl" disabled={saving}>
            <X className="w-4 h-4 mr-2" />
            取消
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </div>;
}
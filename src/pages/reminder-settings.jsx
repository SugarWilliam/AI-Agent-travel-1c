// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Bell, Volume2, Package, Clock, Car, AlertTriangle, Cloud, Save, X, MessageCircle, Smartphone, Loader2 } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Switch } from '@/components/ui';

export default function ReminderSettings(props) {
  const {
    toast
  } = useToast();

  // 提醒类型设置
  const [reminderTypes, setReminderTypes] = useState({
    sound: true,
    // 声音提醒
    leftBehind: true,
    // 物品遗留
    queue: true,
    // 排队提醒
    traffic: true,
    // 交通提醒
    attention: true,
    // 注意事项
    weather: true // 天气提醒
  });

  // 通知方式设置
  const [notificationMethods, setNotificationMethods] = useState({
    push: true,
    // 推送通知
    wechat: true // 微信通知
  });

  // 全局开关
  const [allEnabled, setAllEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  // 加载提醒设置
  const loadReminderSettings = async () => {
    try {
      setLoading(true);

      // 获取当前用户ID
      const userId = props.$w.auth.currentUser?.userId || 'user_001';
      setCurrentUserId(userId);

      // 查询用户的提醒偏好
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'user_reminder_preferences',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: userId
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
        setAllEnabled(result.allEnabled);
        setReminderTypes(result.reminderTypes || {
          sound: true,
          leftBehind: true,
          queue: true,
          traffic: true,
          attention: true,
          weather: true
        });
        setNotificationMethods(result.notificationMethods || {
          push: true,
          wechat: true
        });
      }
    } catch (error) {
      console.error('加载提醒设置失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法加载提醒设置',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadReminderSettings();
  }, []);
  const handleReminderTypeChange = type => {
    setReminderTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  const handleNotificationMethodChange = method => {
    setNotificationMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };
  const handleToggleAll = () => {
    const newState = !allEnabled;
    setAllEnabled(newState);

    // 关闭所有提醒类型
    setReminderTypes({
      sound: newState,
      leftBehind: newState,
      queue: newState,
      traffic: newState,
      attention: newState,
      weather: newState
    });

    // 关闭所有通知方式
    setNotificationMethods({
      push: newState,
      wechat: newState
    });
  };
  const handleSave = async () => {
    try {
      setSaving(true);

      // 使用 upsert 创建或更新提醒设置
      await props.$w.cloud.callDataSource({
        dataSourceName: 'user_reminder_preferences',
        methodName: 'wedaUpsertV2',
        params: {
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: currentUserId
                }
              }]
            }
          },
          update: {
            allEnabled: allEnabled,
            reminderTypes: reminderTypes,
            notificationMethods: notificationMethods
          },
          create: {
            userId: currentUserId,
            allEnabled: allEnabled,
            reminderTypes: reminderTypes,
            notificationMethods: notificationMethods
          }
        }
      });
      toast({
        title: '设置已保存',
        description: '提醒设置已更新'
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
  const reminderTypeConfig = [{
    key: 'sound',
    icon: Volume2,
    title: '声音提醒',
    description: '重要事项的声音提醒',
    color: 'bg-blue-100 text-blue-600'
  }, {
    key: 'leftBehind',
    icon: Package,
    title: '物品遗留',
    description: '提醒检查随身物品',
    color: 'bg-orange-100 text-orange-600'
  }, {
    key: 'queue',
    icon: Clock,
    title: '排队提醒',
    description: '景点排队时间提醒',
    color: 'bg-purple-100 text-purple-600'
  }, {
    key: 'traffic',
    icon: Car,
    title: '交通提醒',
    description: '交通状况和路线提醒',
    color: 'bg-green-100 text-green-600'
  }, {
    key: 'attention',
    icon: AlertTriangle,
    title: '注意事项',
    description: '重要注意事项提醒',
    color: 'bg-red-100 text-red-600'
  }, {
    key: 'weather',
    icon: Cloud,
    title: '天气提醒',
    description: '目的地天气变化提醒',
    color: 'bg-cyan-100 text-cyan-600'
  }];
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto text-[#FF6B6B] animate-spin mb-4" />
          <p className="text-gray-500">加载中...</p>
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
              提醒设置
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Global Toggle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  全部提醒
                </h3>
                <p className="text-sm text-gray-500">开启或关闭所有提醒</p>
              </div>
            </div>
            <Switch checked={allEnabled} onCheckedChange={handleToggleAll} />
          </div>
        </div>

        {/* Reminder Types */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="font-bold text-gray-800" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              提醒类型
            </h3>
          </div>
          <div className="space-y-4">
            {reminderTypeConfig.map(config => {
            const Icon = config.icon;
            return <div key={config.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{config.title}</p>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  <Switch checked={reminderTypes[config.key]} onCheckedChange={() => handleReminderTypeChange(config.key)} />
                </div>;
          })}
          </div>
        </div>

        {/* Notification Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="font-bold text-gray-800" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              通知方式
            </h3>
          </div>
          <div className="space-y-4">
            {/* Push Notification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">推送通知</p>
                  <p className="text-xs text-gray-500">通过App推送接收提醒</p>
                </div>
              </div>
              <Switch checked={notificationMethods.push} onCheckedChange={() => handleNotificationMethodChange('push')} />
            </div>

            {/* WeChat Notification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">微信通知</p>
                  <p className="text-xs text-gray-500">通过微信接收提醒</p>
                </div>
              </div>
              <Switch checked={notificationMethods.wechat} onCheckedChange={() => handleNotificationMethodChange('wechat')} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 mb-6">
          <h4 className="font-bold text-gray-800 mb-3" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            当前设置
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">已开启提醒类型:</span>
              <span className="font-medium text-gray-800">
                {Object.values(reminderTypes).filter(v => v).length} / 6
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">已开启通知方式:</span>
              <span className="font-medium text-gray-800">
                {Object.values(notificationMethods).filter(v => v).length} / 2
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
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
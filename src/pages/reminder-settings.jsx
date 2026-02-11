// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Bell, Volume2, Package, Clock, Navigation, AlertTriangle, Sun, Check, X, ToggleLeft, ToggleRight, Settings } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function ReminderSettings(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const {
    navigateTo
  } = $w.utils;
  const [reminders, setReminders] = useState({});
  const [reminderItems, setReminderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const reminderTypes = ['sound', 'itemLeft', 'queue', 'traffic', 'notes', 'weather'];
  const reminderConfig = {
    sound: {
      icon: Volume2,
      title: '声音提醒',
      description: '重要事项的声音提示',
      color: '#FF6B6B',
      bgColor: 'bg-[#FF6B6B]/20'
    },
    itemLeft: {
      icon: Package,
      title: '物品遗留',
      description: '提醒不要遗忘物品',
      color: '#4ECDC4',
      bgColor: 'bg-[#4ECDC4]/20'
    },
    queue: {
      icon: Clock,
      title: '排队提醒',
      description: '景点排队时间提醒',
      color: '#FFE66D',
      bgColor: 'bg-[#FFE66D]/20'
    },
    traffic: {
      icon: Navigation,
      title: '交通提醒',
      description: '交通状况和路线提醒',
      color: '#FFA500',
      bgColor: 'bg-[#FFE66D]/20'
    },
    notes: {
      icon: AlertTriangle,
      title: '注意事项',
      description: '重要注意事项提醒',
      color: '#FF6B6B',
      bgColor: 'bg-[#FF6B6B]/20'
    },
    weather: {
      icon: Sun,
      title: '天气提醒',
      description: '天气变化和穿衣建议',
      color: '#4ECDC4',
      bgColor: 'bg-[#4ECDC4]/20'
    }
  };

  // 加载提醒设置
  useEffect(() => {
    loadReminders();
  }, []);
  const loadReminders = async () => {
    try {
      setLoading(true);
      const userId = $w.auth.currentUser?.userId || 'user_001';
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'reminder_settings',
        methodName: 'wedaGetRecordsV2',
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
      if (result && result.records) {
        const remindersMap = {};
        const items = [];
        result.records.forEach(record => {
          remindersMap[record.reminderType] = record.isEnabled;
          items.push({
            id: record.reminderType,
            icon: reminderConfig[record.reminderType]?.icon || Bell,
            title: record.reminderTitle,
            description: record.reminderDescription,
            color: record.color,
            bgColor: record.bgColor
          });
        });
        setReminders(remindersMap);
        setReminderItems(items);
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
  const handleToggleReminder = async id => {
    try {
      const userId = $w.auth.currentUser?.userId || 'user_001';
      const newEnabled = !reminders[id];
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'reminder_settings',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            isEnabled: newEnabled
          },
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: userId
                }
              }, {
                reminderType: {
                  $eq: id
                }
              }]
            }
          }
        }
      });
      if (result && result.count > 0) {
        setReminders({
          ...reminders,
          [id]: newEnabled
        });
        toast({
          title: newEnabled ? '已开启' : '已关闭',
          description: `${reminderConfig[id]?.title || id}提醒已${newEnabled ? '开启' : '关闭'}`
        });
      }
    } catch (error) {
      console.error('更新提醒设置失败:', error);
      toast({
        title: '更新失败',
        description: error.message || '无法更新提醒设置',
        variant: 'destructive'
      });
    }
  };
  const handleEnableAll = async () => {
    try {
      const userId = $w.auth.currentUser?.userId || 'user_001';
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'reminder_settings',
        methodName: 'wedaBatchUpdateV2',
        params: {
          data: {
            isEnabled: true
          },
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: userId
                }
              }]
            }
          }
        }
      });
      if (result && result.count > 0) {
        const newReminders = {};
        reminderTypes.forEach(type => {
          newReminders[type] = true;
        });
        setReminders(newReminders);
        toast({
          title: '全部开启',
          description: '所有提醒已开启'
        });
      }
    } catch (error) {
      console.error('批量更新失败:', error);
      toast({
        title: '更新失败',
        description: error.message || '无法批量更新提醒设置',
        variant: 'destructive'
      });
    }
  };
  const handleDisableAll = async () => {
    try {
      const userId = $w.auth.currentUser?.userId || 'user_001';
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'reminder_settings',
        methodName: 'wedaBatchUpdateV2',
        params: {
          data: {
            isEnabled: false
          },
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: userId
                }
              }]
            }
          }
        }
      });
      if (result && result.count > 0) {
        const newReminders = {};
        reminderTypes.forEach(type => {
          newReminders[type] = false;
        });
        setReminders(newReminders);
        toast({
          title: '全部关闭',
          description: '所有提醒已关闭'
        });
      }
    } catch (error) {
      console.error('批量更新失败:', error);
      toast({
        title: '更新失败',
        description: error.message || '无法批量更新提醒设置',
        variant: 'destructive'
      });
    }
  };
  const handleSaveSettings = () => {
    toast({
      title: '设置已保存',
      description: '提醒设置已更新'
    });
  };
  const enabledCount = Object.values(reminders).filter(v => v).length;
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] to-[#FFE4E1] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white p-4 pt-12">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateTo({
            pageId: 'home',
            params: {}
          })} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              提醒设置
            </h1>
            <div className="w-10" />
          </div>
          <p className="text-white/90 text-sm" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            管理各类提醒，让旅行更安心
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#FF6B6B]/20 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-[#FF6B6B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  {enabledCount}/6
                </p>
                <p className="text-sm text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                  已开启提醒
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEnableAll} className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white rounded-xl px-3">
                <Check className="w-4 h-4 mr-1" />
                全部开启
              </Button>
              <Button variant="outline" size="sm" onClick={handleDisableAll} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-3">
                <X className="w-4 h-4 mr-1" />
                全部关闭
              </Button>
            </div>
          </div>
        </div>

        {/* Reminder List */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              提醒类型
            </h2>
          </div>
          <div className="space-y-3">
            {reminderItems.map(item => {
            const Icon = item.icon;
            const isEnabled = reminders[item.id];
            return <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl transition-all ${isEnabled ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`${item.bgColor} p-3 rounded-xl`}>
                      <Icon className="w-5 h-5" style={{
                    color: item.color
                  }} />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D3436]" style={{
                    fontFamily: 'Nunito, sans-serif'
                  }}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500" style={{
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleToggleReminder(item.id)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    {isEnabled ? <ToggleRight className="w-8 h-8 text-[#4ECDC4]" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
                  </button>
                </div>;
          })}
          </div>
        </div>

        {/* Reminder Details */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              提醒说明
            </h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            <div className="p-3 bg-[#FF6B6B]/10 rounded-xl">
              <p className="font-medium text-[#FF6B6B] mb-1">声音提醒</p>
              <p>在重要时间点播放提示音，确保不会错过关键信息</p>
            </div>
            <div className="p-3 bg-[#4ECDC4]/10 rounded-xl">
              <p className="font-medium text-[#4ECDC4] mb-1">物品遗留</p>
              <p>离开酒店、餐厅等场所时，提醒检查是否遗漏物品</p>
            </div>
            <div className="p-3 bg-[#FFE66D]/20 rounded-xl">
              <p className="font-medium text-[#FFA500] mb-1">排队提醒</p>
              <p>实时监控景点排队时间，提前规划最佳游览时间</p>
            </div>
            <div className="p-3 bg-[#FFA500]/10 rounded-xl">
              <p className="font-medium text-[#FFA500] mb-1">交通提醒</p>
              <p>提供实时交通状况，推荐最优路线和出行方式</p>
            </div>
            <div className="p-3 bg-[#FF6B6B]/10 rounded-xl">
              <p className="font-medium text-[#FF6B6B] mb-1">注意事项</p>
              <p>提醒重要注意事项，如签证、证件、安全等</p>
            </div>
            <div className="p-3 bg-[#4ECDC4]/10 rounded-xl">
              <p className="font-medium text-[#4ECDC4] mb-1">天气提醒</p>
              <p>实时天气变化提醒，提供穿衣和出行建议</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSaveSettings} className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl py-3 text-lg font-bold" style={{
        fontFamily: 'Nunito, sans-serif'
      }}>
          保存设置
        </Button>
      </div>

      <TabBar activeTab="profile" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
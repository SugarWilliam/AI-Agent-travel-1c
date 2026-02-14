// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus, User, Mail, Phone, Trash2, Edit, Search, MoreVertical, UserPlus, Users } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input } from '@/components/ui';

import { useGlobalSettings } from '@/components/GlobalSettings';
import TabBar from '@/components/TabBar';
export default function Companions(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const {
    navigateTo
  } = $w.utils;

  // 尝试使用全局设置，如果没有 Provider 则使用本地状态
  let globalSettings;
  try {
    globalSettings = useGlobalSettings();
  } catch (error) {
    globalSettings = null;
  }
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-darkMode');
    return saved === 'true';
  });
  useEffect(() => {
    if (!globalSettings) {
      const handleStorageChange = () => {
        const savedDarkMode = localStorage.getItem('app-darkMode');
        setLocalDarkMode(savedDarkMode === 'true');
      };
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('theme-change', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('theme-change', handleStorageChange);
      };
    }
  }, [globalSettings]);
  const darkMode = globalSettings?.darkMode || localDarkMode;
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCompanion, setNewCompanion] = useState({
    name: '',
    email: '',
    phone: '',
    note: ''
  });
  const filteredCompanions = companions.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // 加载同伴列表
  useEffect(() => {
    loadCompanions();
  }, []);
  const loadCompanions = async () => {
    try {
      setLoading(true);
      const userId = $w.auth.currentUser?.userId || 'user_001';
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'companions',
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
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      if (result && result.records) {
        const mappedCompanions = result.records.map(record => ({
          id: record._id,
          name: record.companionName,
          avatar: record.companionAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          email: record.companionEmail || '未填写',
          phone: record.companionPhone || '未填写',
          note: record.note || '',
          joinedDate: record.joinedDate || new Date().toISOString().split('T')[0],
          status: record.status || 'active'
        }));
        setCompanions(mappedCompanions);
      }
    } catch (error) {
      console.error('加载同伴列表失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法加载同伴列表',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddCompanion = async () => {
    if (!newCompanion.name.trim()) {
      toast({
        title: '请输入同伴姓名',
        description: '姓名不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      const userId = $w.auth.currentUser?.userId || 'user_001';
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'companions',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            userId: userId,
            companionId: `companion_${Date.now()}`,
            companionName: newCompanion.name,
            companionAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?w=200&h=200&fit=crop`,
            companionEmail: newCompanion.email || '',
            companionPhone: newCompanion.phone || '',
            note: newCompanion.note || '',
            status: 'active',
            sharePermissions: {
              itinerary: true,
              guide: true,
              notes: true
            },
            joinedDate: new Date().toISOString().split('T')[0]
          }
        }
      });
      if (result && result.id) {
        toast({
          title: '添加成功',
          description: `已添加同伴：${newCompanion.name}`
        });
        setNewCompanion({
          name: '',
          email: '',
          phone: '',
          note: ''
        });
        setShowAddModal(false);
        loadCompanions(); // 重新加载列表
      }
    } catch (error) {
      console.error('添加同伴失败:', error);
      toast({
        title: '添加失败',
        description: error.message || '无法添加同伴',
        variant: 'destructive'
      });
    }
  };
  const handleDeleteCompanion = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'companions',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: selectedCompanion.id
                }
              }]
            }
          }
        }
      });
      if (result && result.count > 0) {
        toast({
          title: '删除成功',
          description: `已删除同伴：${selectedCompanion.name}`
        });
        setShowDeleteConfirm(false);
        setSelectedCompanion(null);
        loadCompanions(); // 重新加载列表
      }
    } catch (error) {
      console.error('删除同伴失败:', error);
      toast({
        title: '删除失败',
        description: error.message || '无法删除同伴',
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] to-[#FFE4E1] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white p-4 pt-12">
        <div className="max-w-full sm:max-w-lg mx-auto">
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
              同伴管理
            </h1>
            <div className="w-10" />
          </div>
          <p className="text-white/90 text-sm" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            管理你的旅行伙伴，一起规划精彩旅程
          </p>
        </div>
      </div>

      <div className="max-w-full sm:max-w-lg mx-auto p-4">
        {/* Stats */}
        <div className={`rounded-2xl p-4 shadow-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#4ECDC4]/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  {companions.length}
                </p>
                <p className="text-sm text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                  同伴总数
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl px-4 py-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              添加同伴
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="搜索同伴姓名或邮箱..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 rounded-xl border-2 border-gray-200 focus:border-[#FF6B6B]" style={{
          fontFamily: 'Quicksand, sans-serif'
        }} />
        </div>

        {/* Companion List */}
        <div className="space-y-3">
          {filteredCompanions.length === 0 ? <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                暂无同伴，点击上方按钮添加
              </p>
            </div> : filteredCompanions.map(companion => <div key={companion.id} className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-start gap-3">
                  <img src={companion.avatar} alt={companion.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#FF6B6B]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                        {companion.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {companion.status === 'active' && <span className="bg-[#4ECDC4]/20 text-[#4ECDC4] text-xs px-2 py-1 rounded-full">
                            已加入
                          </span>}
                        {companion.status === 'pending' && <span className="bg-[#FFE66D]/20 text-[#FFA500] text-xs px-2 py-1 rounded-full">
                            待确认
                          </span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{companion.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>{companion.phone}</span>
                    </div>
                    {companion.note && <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                        {companion.note}
                      </p>}
                    <p className="mt-2 text-xs text-gray-400" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      加入时间：{companion.joinedDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" className="flex-1 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white rounded-xl" onClick={() => {
              setSelectedCompanion(companion);
              setShowDeleteConfirm(true);
            }}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除
                  </Button>
                </div>
              </div>)}
        </div>
      </div>

      {/* Add Companion Modal */}
      {showAddModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-6 w-full max-w-full sm:max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              添加同伴
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                  姓名 *
                </label>
                <Input placeholder="请输入姓名" value={newCompanion.name} onChange={e => setNewCompanion({
              ...newCompanion,
              name: e.target.value
            })} className="rounded-xl border-2 border-gray-200 focus:border-[#FF6B6B]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                  邮箱
                </label>
                <Input type="email" placeholder="请输入邮箱" value={newCompanion.email} onChange={e => setNewCompanion({
              ...newCompanion,
              email: e.target.value
            })} className="rounded-xl border-2 border-gray-200 focus:border-[#FF6B6B]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                  电话
                </label>
                <Input type="tel" placeholder="请输入电话" value={newCompanion.phone} onChange={e => setNewCompanion({
              ...newCompanion,
              phone: e.target.value
            })} className="rounded-xl border-2 border-gray-200 focus:border-[#FF6B6B]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{
              fontFamily: 'Quicksand, sans-serif'
            }}>
                  备注
                </label>
                <textarea placeholder="请输入备注信息" value={newCompanion.note} onChange={e => setNewCompanion({
              ...newCompanion,
              note: e.target.value
            })} className="w-full rounded-xl border-2 border-gray-200 focus:border-[#FF6B6B] p-3 min-h-[80px] resize-none" style={{
              fontFamily: 'Quicksand, sans-serif'
            }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => {
            setShowAddModal(false);
            setNewCompanion({
              name: '',
              email: '',
              phone: '',
              note: ''
            });
          }} className="flex-1 rounded-xl border-2 border-gray-200">
                取消
              </Button>
              <Button onClick={handleAddCompanion} className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl">
                保存
              </Button>
            </div>
          </div>
        </div>}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && selectedCompanion && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-full sm:max-w-sm">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                确认删除
              </h2>
              <p className="text-gray-600 mb-6" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                确定要删除同伴「{selectedCompanion.name}」吗？此操作不可恢复。
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => {
              setShowDeleteConfirm(false);
              setSelectedCompanion(null);
            }} className="flex-1 rounded-xl border-2 border-gray-200">
                  取消
                </Button>
                <Button onClick={handleDeleteCompanion} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                  删除
                </Button>
              </div>
            </div>
          </div>
        </div>}

      <TabBar activeTab="profile" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
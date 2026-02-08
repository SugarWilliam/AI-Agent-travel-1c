// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, UserPlus, UserMinus, Settings, Share2, User, Mail, Phone, Calendar, MapPin, X, Plus, QrCode, Loader2 } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function Companions(props) {
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addMethod, setAddMethod] = useState('search'); // 'search' or 'invite'
  const [searchInput, setSearchInput] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myInviteCode, setMyInviteCode] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  // 加载同伴列表
  const loadCompanions = async () => {
    try {
      setLoading(true);

      // 获取当前用户ID
      const userId = props.$w.auth.currentUser?.userId || 'user_001';
      setCurrentUserId(userId);

      // 查询同伴关系数据
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'companion_relations',
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
        // 映射数据到页面需要的格式
        const mappedCompanions = result.records.map(record => ({
          id: record._id,
          name: record.companionName,
          avatar: record.companionAvatar,
          email: record.companionEmail,
          phone: record.companionPhone,
          joinDate: record.joinDate,
          sharedPlans: [],
          // 可以从其他关联表获取
          status: record.status,
          permissions: record.permissions,
          inviteCode: record.inviteCode
        }));
        setCompanions(mappedCompanions);

        // 设置我的邀请码（使用当前用户ID生成）
        setMyInviteCode(`TRAVEL${userId.split('_')[1] || '2026'}`);
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
  useEffect(() => {
    loadCompanions();
  }, []);
  const filteredCompanions = companions.filter(companion => companion.name.toLowerCase().includes(searchQuery.toLowerCase()) || companion.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleSearchUser = async () => {
    if (!searchInput.trim()) {
      toast({
        title: '请输入搜索内容',
        description: '请输入用户名、邮箱或手机号进行搜索',
        variant: 'destructive'
      });
      return;
    }

    // 检查是否已存在
    const existingUser = companions.find(c => c.name === searchInput || c.email === searchInput);
    if (existingUser) {
      toast({
        title: '用户已存在',
        description: '该用户已在您的同伴列表中',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 模拟搜索用户（实际应该调用用户搜索API）
      const searchResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'companion_relations',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $or: [{
                companionName: {
                  $eq: searchInput
                }
              }, {
                companionEmail: {
                  $eq: searchInput
                }
              }, {
                companionPhone: {
                  $eq: searchInput
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (searchResult && searchResult.records && searchResult.records.length > 0) {
        toast({
          title: '搜索成功',
          description: `找到用户: ${searchInput}，请发送邀请`
        });
      } else {
        toast({
          title: '未找到用户',
          description: '未找到匹配的用户，请检查输入信息',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('搜索用户失败:', error);
      toast({
        title: '搜索失败',
        description: error.message || '无法搜索用户',
        variant: 'destructive'
      });
    }
  };
  const handleInviteByCode = async () => {
    if (!inviteCode.trim()) {
      toast({
        title: '请输入邀请码',
        description: '请输入有效的邀请码',
        variant: 'destructive'
      });
      return;
    }
    if (inviteCode === myInviteCode) {
      toast({
        title: '不能使用自己的邀请码',
        description: '请使用其他用户的邀请码',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 查找使用该邀请码的用户
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'companion_relations',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                inviteCode: {
                  $eq: inviteCode
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result && result.records && result.records.length > 0) {
        const targetUser = result.records[0];

        // 检查是否已经关联
        const existingRelation = companions.find(c => c.id === targetUser._id);
        if (existingRelation) {
          toast({
            title: '已存在关联',
            description: '该用户已在您的同伴列表中',
            variant: 'destructive'
          });
          return;
        }

        // 创建同伴关系
        await props.$w.cloud.callDataSource({
          dataSourceName: 'companion_relations',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              userId: currentUserId,
              companionId: targetUser.userId,
              companionName: targetUser.companionName,
              companionAvatar: targetUser.companionAvatar,
              companionEmail: targetUser.companionEmail,
              companionPhone: targetUser.companionPhone,
              status: 'pending',
              joinDate: new Date().toISOString().split('T')[0],
              inviteCode: inviteCode,
              permissions: {
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
              }
            }
          }
        });
        setInviteCode('');
        setShowAddDialog(false);
        toast({
          title: '邀请已发送',
          description: '等待对方确认后即可建立关联'
        });

        // 重新加载列表
        loadCompanions();
      } else {
        toast({
          title: '邀请码无效',
          description: '未找到使用该邀请码的用户',
          variant: 'destructive'
        });
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
  const handleRemoveCompanion = async companionId => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'companion_relations',
        methodName: 'wedaDeleteV2',
        params: {
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
        title: '已解除关联',
        description: '已成功解除与该同伴的关联'
      });

      // 重新加载列表
      loadCompanions();
    } catch (error) {
      console.error('解除关联失败:', error);
      toast({
        title: '操作失败',
        description: error.message || '无法解除关联',
        variant: 'destructive'
      });
    }
  };
  const handleShareSettings = companionId => {
    props.$w.utils.navigateTo({
      pageId: 'companion-settings',
      params: {
        companionId
      }
    });
  };
  const copyInviteCode = () => {
    navigator.clipboard.writeText(myInviteCode);
    toast({
      title: '邀请码已复制',
      description: `邀请码 ${myInviteCode} 已复制到剪贴板`
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-orange-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              我的同伴
            </h1>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full px-4 py-2">
                  <UserPlus className="w-4 h-4 mr-2" />
                  添加同伴
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>添加同伴</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* 添加方式选择 */}
                  <div className="flex gap-2">
                    <Button variant={addMethod === 'search' ? 'default' : 'outline'} onClick={() => setAddMethod('search')} className={`flex-1 ${addMethod === 'search' ? 'bg-[#FF6B6B] hover:bg-[#FF5252]' : ''}`}>
                      <Search className="w-4 h-4 mr-2" />
                      搜索用户
                    </Button>
                    <Button variant={addMethod === 'invite' ? 'default' : 'outline'} onClick={() => setAddMethod('invite')} className={`flex-1 ${addMethod === 'invite' ? 'bg-[#FF6B6B] hover:bg-[#FF5252]' : ''}`}>
                      <QrCode className="w-4 h-4 mr-2" />
                      邀请码
                    </Button>
                  </div>

                  {/* 搜索用户 */}
                  {addMethod === 'search' && <div className="space-y-3">
                      <Input placeholder="输入用户名、邮箱或手机号" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="rounded-xl" />
                      <Button onClick={handleSearchUser} className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl">
                        <Search className="w-4 h-4 mr-2" />
                        搜索
                      </Button>
                    </div>}

                  {/* 邀请码 */}
                  {addMethod === 'invite' && <div className="space-y-3">
                      <div className="bg-orange-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-2">我的邀请码：</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-white px-3 py-2 rounded-lg text-lg font-mono font-bold text-[#FF6B6B]">
                            {myInviteCode}
                          </code>
                          <Button size="sm" variant="outline" onClick={copyInviteCode} className="rounded-lg">
                            复制
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>或输入其他用户的邀请码：</p>
                      </div>
                      <Input placeholder="输入邀请码" value={inviteCode} onChange={e => setInviteCode(e.target.value)} className="rounded-xl" />
                      <Button onClick={handleInviteByCode} className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl">
                        <UserPlus className="w-4 h-4 mr-2" />
                        添加同伴
                      </Button>
                    </div>}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="搜索同伴..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 rounded-xl bg-gray-50 border-gray-200" />
          </div>
        </div>
      </div>

      {/* Companions List */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? <div className="text-center py-12">
            <Loader2 className="w-16 h-16 mx-auto text-[#FF6B6B] animate-spin mb-4" />
            <p className="text-gray-500" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              加载中...
            </p>
          </div> : filteredCompanions.length === 0 ? <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
              暂无同伴，点击右上角添加
            </p>
          </div> : <div className="space-y-4">
            {filteredCompanions.map(companion => <div key={companion.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img src={companion.avatar} alt={companion.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-200" />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                        {companion.name}
                      </h3>
                      {companion.status === 'pending' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          待确认
                        </span>}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{companion.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{companion.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>加入时间: {companion.joinDate}</span>
                      </div>
                    </div>

                    {/* Shared Plans */}
                    {companion.sharedPlans.length > 0 && <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Share2 className="w-4 h-4 text-[#FF6B6B]" />
                          <span className="text-sm font-medium text-gray-700">共享计划:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {companion.sharedPlans.map((plan, index) => <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                              {plan}
                            </span>)}
                        </div>
                      </div>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleShareSettings(companion.id)} className="rounded-lg">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemoveCompanion(companion.id)} className="rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50">
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* TabBar */}
      <TabBar />
    </div>;
}
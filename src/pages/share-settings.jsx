// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Share2, Users, Globe, Lock, Link as LinkIcon, Copy, Check, Clock, Calendar, FileText, Sparkles, History, Trash2 } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function ShareSettings(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const {
    navigateTo
  } = $w.utils;
  const [shareSettings, setShareSettings] = useState({
    shareItinerary: true,
    shareGuides: true,
    shareNotes: false,
    shareType: 'companions',
    // companions, public, private
    selectedCompanions: []
  });
  const [shareLink, setShareLink] = useState('https://travel.app/share/abc123');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(false);
  const shareHistory = [{
    id: '1',
    type: 'companions',
    content: ['itinerary', 'guides'],
    sharedWith: ['张小明', '李小红'],
    sharedAt: '2026-02-08 14:30',
    link: 'https://travel.app/share/abc123'
  }, {
    id: '2',
    type: 'public',
    content: ['itinerary'],
    sharedWith: '公开',
    sharedAt: '2026-02-07 10:15',
    link: 'https://travel.app/share/def456'
  }];

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
              }, {
                status: {
                  $eq: 'active'
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
        const mappedCompanions = result.records.map(record => ({
          id: record._id,
          name: record.companionName,
          avatar: record.companionAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
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
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast({
      title: '链接已复制',
      description: '分享链接已复制到剪贴板'
    });
  };
  const handleSaveSettings = () => {
    toast({
      title: '设置已保存',
      description: '分享设置已更新'
    });
  };
  const handleDeleteHistory = id => {
    toast({
      title: '记录已删除',
      description: '分享历史记录已删除'
    });
  };
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
              分享设置
            </h1>
            <div className="w-10" />
          </div>
          <p className="text-white/90 text-sm" style={{
          fontFamily: 'Quicksand, sans-serif'
        }}>
            配置分享内容和对象，与同伴共享精彩旅程
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Share Content */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              分享内容
            </h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#4ECDC4]/20 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#4ECDC4]" />
                </div>
                <div>
                  <p className="font-medium text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                    行程安排
                  </p>
                  <p className="text-xs text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                    分享每日行程和活动
                  </p>
                </div>
              </div>
              <input type="checkbox" checked={shareSettings.shareItinerary} onChange={e => setShareSettings({
              ...shareSettings,
              shareItinerary: e.target.checked
            })} className="w-5 h-5 rounded accent-[#FF6B6B]" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#FFE66D]/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-[#FFA500]" />
                </div>
                <div>
                  <p className="font-medium text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                    旅行攻略
                  </p>
                  <p className="text-xs text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                    分享攻略和注意事项
                  </p>
                </div>
              </div>
              <input type="checkbox" checked={shareSettings.shareGuides} onChange={e => setShareSettings({
              ...shareSettings,
              shareGuides: e.target.checked
            })} className="w-5 h-5 rounded accent-[#FF6B6B]" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF6B6B]/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-[#FF6B6B]" />
                </div>
                <div>
                  <p className="font-medium text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                    旅行笔记
                  </p>
                  <p className="text-xs text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                    分享个人笔记和心得
                  </p>
                </div>
              </div>
              <input type="checkbox" checked={shareSettings.shareNotes} onChange={e => setShareSettings({
              ...shareSettings,
              shareNotes: e.target.checked
            })} className="w-5 h-5 rounded accent-[#FF6B6B]" />
            </label>
          </div>
        </div>

        {/* Share Target */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              分享对象
            </h2>
          </div>
          <div className="space-y-2">
            <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${shareSettings.shareType === 'companions' ? 'bg-[#4ECDC4]/20 border-2 border-[#4ECDC4]' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${shareSettings.shareType === 'companions' ? 'bg-[#4ECDC4]' : 'bg-gray-200'}`}>
                  <Users className={`w-5 h-5 ${shareSettings.shareType === 'companions' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                    指定同伴
                  </p>
                  <p className="text-xs text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                    仅分享给选定的同伴
                  </p>
                </div>
              </div>
              <input type="radio" name="shareType" checked={shareSettings.shareType === 'companions'} onChange={() => setShareSettings({
              ...shareSettings,
              shareType: 'companions'
            })} className="w-5 h-5 accent-[#FF6B6B]" />
            </label>
            <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${shareSettings.shareType === 'public' ? 'bg-[#FFE66D]/20 border-2 border-[#FFE66D]' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${shareSettings.shareType === 'public' ? 'bg-[#FFE66D]' : 'bg-gray-200'}`}>
                  <Globe className={`w-5 h-5 ${shareSettings.shareType === 'public' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                    公开分享
                  </p>
                  <p className="text-xs text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                    所有人都可以查看
                  </p>
                </div>
              </div>
              <input type="radio" name="shareType" checked={shareSettings.shareType === 'public'} onChange={() => setShareSettings({
              ...shareSettings,
              shareType: 'public'
            })} className="w-5 h-5 accent-[#FF6B6B]" />
            </label>
            <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${shareSettings.shareType === 'private' ? 'bg-[#FF6B6B]/20 border-2 border-[#FF6B6B]' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${shareSettings.shareType === 'private' ? 'bg-[#FF6B6B]' : 'bg-gray-200'}`}>
                  <Lock className={`w-5 h-5 ${shareSettings.shareType === 'private' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                    私密分享
                  </p>
                  <p className="text-xs text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                    仅自己可见
                  </p>
                </div>
              </div>
              <input type="radio" name="shareType" checked={shareSettings.shareType === 'private'} onChange={() => setShareSettings({
              ...shareSettings,
              shareType: 'private'
            })} className="w-5 h-5 accent-[#FF6B6B]" />
            </label>
          </div>

          {/* Companion Selection */}
          {shareSettings.shareType === 'companions' && <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium mb-3 text-[#2D3436]" style={{
            fontFamily: 'Quicksand, sans-serif'
          }}>
                选择分享的同伴
              </p>
              <div className="space-y-2">
                {companions.map(companion => <label key={companion.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${shareSettings.selectedCompanions.includes(companion.id) ? 'bg-[#4ECDC4]/20 border-2 border-[#4ECDC4]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <img src={companion.avatar} alt={companion.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="flex-1 font-medium text-[#2D3436]" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                      {companion.name}
                    </span>
                    <input type="checkbox" checked={shareSettings.selectedCompanions.includes(companion.id)} onChange={e => {
                if (e.target.checked) {
                  setShareSettings({
                    ...shareSettings,
                    selectedCompanions: [...shareSettings.selectedCompanions, companion.id]
                  });
                } else {
                  setShareSettings({
                    ...shareSettings,
                    selectedCompanions: shareSettings.selectedCompanions.filter(id => id !== companion.id)
                  });
                }
              }} className="w-5 h-5 rounded accent-[#FF6B6B]" />
                  </label>)}
              </div>
            </div>}
        </div>

        {/* Share Link */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              分享链接
            </h2>
          </div>
          <div className="flex gap-2">
            <input type="text" value={shareLink} readOnly className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 font-mono" style={{
            fontFamily: 'Quicksand, sans-serif'
          }} />
            <Button onClick={handleCopyLink} className={`px-4 rounded-xl ${linkCopied ? 'bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white' : 'bg-[#FF6B6B] hover:bg-[#FF5252] text-white'}`}>
              {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Share History */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#FF6B6B]" />
              <h2 className="font-bold text-[#2D3436]" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                分享历史
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)} className="text-[#FF6B6B]">
              {showHistory ? '收起' : '展开'}
            </Button>
          </div>
          {showHistory && <div className="space-y-3">
              {shareHistory.map(item => <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                        {item.sharedAt}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteHistory(item.id)} className="text-red-500 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'companions' ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : item.type === 'public' ? 'bg-[#FFE66D]/20 text-[#FFA500]' : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'}`}>
                      {item.type === 'companions' ? '同伴' : item.type === 'public' ? '公开' : '私密'}
                    </span>
                    <span className="text-sm text-gray-600" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      分享给：{item.sharedWith}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                      内容：
                    </span>
                    {item.content.includes('itinerary') && <span className="text-xs bg-[#4ECDC4]/20 text-[#4ECDC4] px-2 py-1 rounded-full">
                        行程
                      </span>}
                    {item.content.includes('guides') && <span className="text-xs bg-[#FFE66D]/20 text-[#FFA500] px-2 py-1 rounded-full">
                        攻略
                      </span>}
                    {item.content.includes('notes') && <span className="text-xs bg-[#FF6B6B]/20 text-[#FF6B6B] px-2 py-1 rounded-full">
                        笔记
                      </span>}
                  </div>
                </div>)}
            </div>}
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
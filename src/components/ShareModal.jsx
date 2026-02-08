// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { X, Share2, Link, Copy, Check, MessageCircle, Image as ImageIcon, FileText, QrCode } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export default function ShareModal({
  isOpen,
  onClose,
  plan,
  onCopyLink,
  onShareToWechat,
  $w
}) {
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = plan?.title || '我的旅行计划';
  const shareDescription = `${plan?.destination || ''} ${plan?.days || ''}日游 - 预算${plan?.budget || 0}元`;
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        onCopyLink();
      });
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      onCopyLink();
    }
  };
  const handleShareToWechat = async () => {
    try {
      setLoading(true);

      // 调用微信分享云函数
      const result = await $w.cloud.callFunction({
        name: 'wechat-share',
        data: {
          action: 'generateMiniProgramCode',
          planId: plan?.id || '',
          planData: plan
        }
      });
      if (result && result.success) {
        setQrCodeUrl(result.codeUrl);
        setShowQrCode(true);
      } else {
        throw new Error('生成小程序码失败');
      }
    } catch (error) {
      console.error('微信分享失败:', error);
      alert('生成小程序码失败，请使用复制链接功能');
    } finally {
      setLoading(false);
    }
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl
        });
        onClose();
      } catch (err) {
        console.log('分享失败:', err);
      }
    } else {
      // 浏览器不支持原生分享，显示提示
      alert('您的浏览器不支持原生分享功能，请使用复制链接功能');
    }
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#2D3436]">分享计划</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 计划信息 */}
        <div className="bg-gradient-to-br from-[#FFE66D] to-[#FF6B6B] rounded-xl p-4 mb-6">
          <h4 className="text-lg font-bold text-white mb-1">{shareTitle}</h4>
          <p className="text-white/90 text-sm">{shareDescription}</p>
        </div>

        {/* 二维码显示 */}
        {showQrCode && <div className="mb-6 p-6 bg-gray-50 rounded-xl text-center">
            <div className="flex justify-center mb-4">
              <QrCode className="w-32 h-32 text-[#07C160]" />
            </div>
            <p className="text-sm text-gray-600 mb-3">使用微信扫描二维码</p>
            <Button onClick={() => setShowQrCode(false)} variant="outline" className="w-full">
              返回分享选项
            </Button>
          </div>}

        {/* 分享选项 */}
        {!showQrCode && <div className="space-y-3">
            {/* 微信分享 */}
            <Button onClick={handleShareToWechat} disabled={loading} className="w-full h-14 bg-[#07C160] hover:bg-[#06AD56] text-white rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{loading ? '生成中...' : '分享到微信'}</span>
            </Button>

            {/* 复制链接 */}
            <Button onClick={handleCopyLink} className="w-full h-14 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
              <Link className="w-6 h-6" />
              <span className="font-medium">复制链接</span>
            </Button>

            {/* 系统分享 */}
            {navigator.share && <Button onClick={handleNativeShare} className="w-full h-14 bg-[#2D3436] hover:bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
                <Share2 className="w-6 h-6" />
                <span className="font-medium">系统分享</span>
              </Button>}
          </div>}

        {/* 提示信息 */}
        {!showQrCode && <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FFE66D] rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4 text-[#2D3436]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">
                  分享后，好友可以查看您的完整旅行计划，包括行程安排、攻略、拍照指导等。
                </p>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}
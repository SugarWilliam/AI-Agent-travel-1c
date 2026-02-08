// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Sparkles, MapPin, Calendar, Users, DollarSign, Send, Loader2, CheckCircle, AlertCircle, BookOpen, Route, Cloud, Camera, Shirt, RefreshCw } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function PlanGenerator(props) {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    days: 3,
    budget: 5000,
    travelers: 1,
    preferences: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleGenerate = async () => {
    if (!formData.destination) {
      toast({
        title: '请填写目的地',
        description: '目的地是必填项',
        variant: 'destructive'
      });
      return;
    }
    setIsGenerating(true);
    setGenerationProgress([]);
    setGeneratedPlan(null);
    try {
      // 调用云函数生成完整计划
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'generatePlan',
          input: {
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            days: formData.days,
            budget: formData.budget,
            travelers: formData.travelers,
            preferences: formData.preferences
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result.success) {
        setGeneratedPlan(result.plan);
        toast({
          title: '计划生成成功',
          description: '已为您生成完整的旅行计划',
          variant: 'default'
        });
      } else {
        throw new Error(result.error || '生成失败');
      }
    } catch (error) {
      console.error('生成计划失败:', error);
      toast({
        title: '生成失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'create',
          plan: {
            ...generatedPlan,
            title: `${formData.destination}${formData.days}日游`,
            status: 'draft'
          }
        }
      });
      if (result.success) {
        toast({
          title: '保存成功',
          description: '计划已保存到我的计划',
          variant: 'default'
        });
        props.$w.utils.navigateTo({
          pageId: 'my-plans',
          params: {}
        });
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (error) {
      console.error('保存计划失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleViewDetail = () => {
    props.$w.utils.navigateTo({
      pageId: 'ai-output',
      params: {
        type: 'document',
        planId: generatedPlan?.planId
      }
    });
  };
  return <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              AI计划生成器
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {/* 表单 */}
        {!generatedPlan && <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                基本信息
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    目的地 *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input type="text" placeholder="例如：东京、巴黎、大理" value={formData.destination} onChange={e => handleInputChange('destination', e.target.value)} className="pl-10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      开始日期
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input type="date" value={formData.startDate} onChange={e => handleInputChange('startDate', e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      结束日期
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input type="date" value={formData.endDate} onChange={e => handleInputChange('endDate', e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    旅行天数: {formData.days}天
                  </label>
                  <input type="range" min="1" max="14" value={formData.days} onChange={e => handleInputChange('days', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B6B]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      预算 (元)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input type="number" placeholder="5000" value={formData.budget} onChange={e => handleInputChange('budget', parseInt(e.target.value))} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      人数
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input type="number" min="1" max="10" value={formData.travelers} onChange={e => handleInputChange('travelers', parseInt(e.target.value))} className="pl-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    旅行偏好 (可选)
                  </label>
                  <textarea placeholder="例如：喜欢历史文化、美食探索、自然风光..." value={formData.preferences} onChange={e => handleInputChange('preferences', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] resize-none" rows={3} />
                </div>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating || !formData.destination} isLoading={isGenerating} className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5252] hover:to-[#3DBDB5] text-white rounded-xl py-4 text-lg font-semibold">
              {isGenerating ? <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  正在生成计划...
                </> : <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  生成完整计划
                </>}
            </Button>
          </div>}

        {/* 生成进度 */}
        {isGenerating && <div className="bg-white rounded-xl p-6 shadow-md space-y-3">
            <h3 className="text-lg font-bold text-[#2D3436]" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              AI正在为您生成计划...
            </h3>
            <div className="space-y-2">
              {[{
            icon: Route,
            text: '正在规划详细行程...',
            status: 'pending'
          }, {
            icon: Cloud,
            text: '正在获取天气信息...',
            status: 'pending'
          }, {
            icon: BookOpen,
            text: '正在生成旅行攻略...',
            status: 'pending'
          }, {
            icon: Camera,
            text: '正在生成拍照指导...',
            status: 'pending'
          }, {
            icon: Shirt,
            text: '正在生成穿搭建议...',
            status: 'pending'
          }].map((step, idx) => <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <step.icon className={`w-5 h-5 ${step.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-700">{step.text}</span>
                  {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  {step.status === 'pending' && <Loader2 className="w-5 h-5 text-gray-400 ml-auto animate-spin" />}
                </div>)}
            </div>
          </div>}

        {/* 生成结果 */}
        {generatedPlan && <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    计划生成成功！
                  </h3>
                  <p className="text-sm text-gray-600">AI已为您生成完整的旅行计划</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">目的地</div>
                  <div className="font-semibold text-gray-800">{generatedPlan.destination}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">天数</div>
                  <div className="font-semibold text-gray-800">{generatedPlan.days}天</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">预算</div>
                  <div className="font-semibold text-gray-800">¥{generatedPlan.budget}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">人数</div>
                  <div className="font-semibold text-gray-800">{generatedPlan.travelers}人</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Route className="w-4 h-4 text-[#FF6B6B]" />
                  <span>详细行程安排</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Cloud className="w-4 h-4 text-[#4ECDC4]" />
                  <span>天气预报信息</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <BookOpen className="w-4 h-4 text-[#FFE66D]" />
                  <span>完整旅行攻略</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Camera className="w-4 h-4 text-[#FF6B6B]" />
                  <span>拍照指导建议</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Shirt className="w-4 h-4 text-[#4ECDC4]" />
                  <span>穿搭建议</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleViewDetail} className="flex-1 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5252] hover:to-[#3DBDB5] text-white rounded-xl py-3">
                <BookOpen className="w-4 h-4 mr-2" />
                查看详情
              </Button>
              <Button onClick={handleSavePlan} className="flex-1 bg-white border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white rounded-xl py-3">
                <CheckCircle className="w-4 h-4 mr-2" />
                保存计划
              </Button>
            </div>

            <Button onClick={() => {
          setGeneratedPlan(null);
          setFormData({
            destination: '',
            startDate: '',
            endDate: '',
            days: 3,
            budget: 5000,
            travelers: 1,
            preferences: ''
          });
        }} variant="outline" className="w-full">
              重新生成
            </Button>
          </div>}
      </div>

      {/* TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
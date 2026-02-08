// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Save, Sparkles, Upload, X, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { useForm } from 'react-hook-form';
import TabBar from '@/components/TabBar';
export default function Create(props) {
  const {
    toast
  } = useToast();
  const planId = props.$w.page.dataset.params.id;
  const [isEditing, setIsEditing] = useState(!!planId);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const form = useForm({
    defaultValues: {
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: '',
      travelers: '2',
      description: '',
      status: 'planning'
    }
  });
  useEffect(() => {
    if (isEditing && planId) {
      // 模拟从数据库加载数据
      form.reset({
        title: '日本东京七日游',
        destination: '东京, 日本',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        budget: '15000',
        travelers: '2',
        description: '探索东京的传统与现代，体验日本文化的独特魅力。',
        status: 'planning'
      });
      setCoverImage('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800');
    }
  }, [isEditing, planId, form]);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        toast({
          title: '上传成功',
          description: '封面图片已更新',
          variant: 'default'
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAISuggest = async () => {
    const destination = form.getValues('destination');
    if (!destination) {
      toast({
        title: '请先输入目的地',
        description: 'AI需要知道你想去哪里才能给出建议',
        variant: 'destructive'
      });
      return;
    }
    setShowAISuggestions(true);
    setAISuggestions([]);

    // 模拟AI生成建议
    setTimeout(() => {
      const suggestions = ['推荐在3-4月或9-11月出行，气候宜人', '建议提前1-2个月预订机票和酒店', '推荐体验当地特色美食和文化活动', '建议购买旅游保险，保障行程安全', '可以下载当地交通APP，方便出行'];
      setAISuggestions(suggestions);
    }, 1500);
  };
  const handleApplySuggestion = suggestion => {
    const currentDescription = form.getValues('description') || '';
    form.setValue('description', currentDescription + '\n' + suggestion);
    toast({
      title: '已应用建议',
      description: 'AI建议已添加到行程简介',
      variant: 'default'
    });
  };
  const onSubmit = async data => {
    try {
      // 调用云数据库保存数据
      const result = await props.$w.cloud.callFunction({
        name: 'database',
        data: {
          action: 'add',
          collection: 'Trip',
          doc: {
            ...data,
            coverImage,
            userId: props.$w.auth.currentUser?.userId || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'planning'
          }
        }
      });
      if (result && result.success) {
        toast({
          title: isEditing ? '更新成功' : '创建成功',
          description: isEditing ? '计划已更新' : '新计划已创建',
          variant: 'default'
        });
        setTimeout(() => {
          props.$w.utils.navigateTo({
            pageId: 'home',
            params: {}
          });
        }, 1000);
      } else {
        throw new Error(result?.error || '保存失败');
      }
    } catch (error) {
      toast({
        title: '保存失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-[#FFF9F0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
            </button>
            <h1 className="text-xl font-bold text-white" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
              {isEditing ? '编辑计划' : '创建新计划'}
            </h1>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} className="bg-white text-[#FF6B6B] hover:bg-gray-100 rounded-full px-4 font-semibold">
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {/* Cover Image */}
        <div className="relative h-48 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
            <div className="text-center text-white">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">点击上传封面</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-[#2D3436] font-semibold">计划名称</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：日本东京七日游" {...field} className="rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="destination" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-[#2D3436] font-semibold">目的地</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="例如：东京, 日本" {...field} className="rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B] pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startDate" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-[#2D3436] font-semibold">出发日期</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input type="date" {...field} className="rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B] pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="endDate" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-[#2D3436] font-semibold">返回日期</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input type="date" {...field} className="rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B] pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="budget" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-[#2D3436] font-semibold">预算（元）</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input type="number" placeholder="15000" {...field} className="rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B] pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="travelers" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-[#2D3436] font-semibold">出行人数</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <SelectTrigger className="rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B] pl-10">
                            <SelectValue placeholder="选择人数" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1人</SelectItem>
                        <SelectItem value="2">2人</SelectItem>
                        <SelectItem value="3">3人</SelectItem>
                        <SelectItem value="4">4人</SelectItem>
                        <SelectItem value="5+">5人以上</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <FormField control={form.control} name="description" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-[#2D3436] font-semibold">行程简介</FormLabel>
                  <FormControl>
                    <Textarea placeholder="描述你的旅行计划..." className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-[#FF6B6B] resize-none" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    简要描述你的旅行目标和期望
                  </FormDescription>
                  <FormMessage />
                </FormItem>} />

            {/* AI Assistant Button */}
            <Button type="button" onClick={handleAISuggest} className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:opacity-90 text-white rounded-xl h-12 font-semibold shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              AI智能建议
            </Button>

            {/* AI Suggestions Panel */}
            {showAISuggestions && <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-[#FFE66D]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
                    <h3 className="font-bold text-[#2D3436]" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                      AI建议
                    </h3>
                  </div>
                  <button onClick={() => setShowAISuggestions(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {aiSuggestions.length === 0 ? <div className="text-center py-4">
                    <div className="flex gap-1 justify-center mb-2">
                      <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{
                  animationDelay: '0.1s'
                }} />
                      <div className="w-2 h-2 bg-[#FFE66D] rounded-full animate-bounce" style={{
                  animationDelay: '0.2s'
                }} />
                    </div>
                    <p className="text-sm text-gray-500">AI正在思考中...</p>
                  </div> : <div className="space-y-2">
                    {aiSuggestions.map((suggestion, idx) => <div key={idx} className="bg-[#FFF9F0] rounded-xl p-3 flex items-start gap-2">
                        <span className="text-[#FF6B6B] mt-0.5">✨</span>
                        <p className="text-sm text-gray-700 flex-1" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                          {suggestion}
                        </p>
                        <Button size="sm" variant="ghost" className="text-[#4ECDC4] hover:bg-[#4ECDC4]/10 px-2" onClick={() => handleApplySuggestion(suggestion)}>
                          应用
                        </Button>
                      </div>)}
                  </div>}
              </div>}
          </form>
        </Form>
      </div>

      {/* TabBar */}
      <TabBar activeTab="home" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
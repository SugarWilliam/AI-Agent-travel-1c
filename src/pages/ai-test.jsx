// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Play, CheckCircle, XCircle, Loader2, RefreshCw, Sparkles, MapPin, Calendar, Camera, Shirt, Cloud, BookOpen, Route } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function AITest(props) {
  const {
    toast
  } = useToast();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [generatedPlanId, setGeneratedPlanId] = useState(null);
  const testCases = [{
    id: 1,
    name: '生成完整计划',
    description: '测试AI助手生成完整旅行计划的能力',
    icon: Sparkles,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'generatePlan',
          input: {
            destination: '巴黎',
            days: 5,
            budget: 20000,
            travelers: 2,
            startDate: '2026-04-01',
            preferences: '文化体验、美食、购物'
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 2,
    name: '行程规划 Agent',
    description: '测试行程规划AI Agent',
    icon: Route,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'callAgent',
          agentType: 'itinerary',
          input: {
            destination: '巴黎',
            days: 5,
            preferences: '文化体验、美食、购物'
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 3,
    name: '天气查询 Agent',
    description: '测试天气查询AI Agent',
    icon: Cloud,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'callAgent',
          agentType: 'weather',
          input: {
            destination: '巴黎',
            startDate: '2026-04-01',
            days: 5
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 4,
    name: '攻略生成 Agent',
    description: '测试攻略生成AI Agent',
    icon: BookOpen,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'generateGuide',
          input: {
            destination: '巴黎',
            days: 5
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 5,
    name: '拍照指导 Agent',
    description: '测试拍照指导AI Agent',
    icon: Camera,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'photoGuide',
          input: {
            destination: '巴黎'
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 6,
    name: '穿搭建议 Agent',
    description: '测试穿搭建议AI Agent',
    icon: Shirt,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'outfitGuide',
          input: {
            destination: '巴黎',
            startDate: '2026-04-01'
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 7,
    name: '保存计划功能',
    description: '测试保存计划到数据库',
    icon: MapPin,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'create',
          plan: {
            title: '巴黎五日游',
            destination: '巴黎',
            startDate: '2026-04-01',
            endDate: '2026-04-05',
            days: 5,
            budget: 20000,
            travelers: 2,
            description: '探索巴黎的浪漫与艺术，体验法式生活的优雅。',
            coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
            status: 'draft',
            itinerary: [{
              day: 1,
              date: '2026-04-01',
              summary: '抵达巴黎',
              activities: [{
                id: 'day1-act1',
                name: '抵达戴高乐机场',
                type: 'transport',
                time: '14:00',
                duration: 2,
                location: '戴高乐机场',
                description: '乘坐机场快线前往市区',
                status: 'pending',
                tips: '建议提前购买地铁票'
              }]
            }],
            weather: [{
              date: '2026-04-01',
              condition: '晴',
              icon: '☀️',
              temperature: '15°C',
              high: '20°C',
              low: '10°C',
              tips: '适合户外活动'
            }],
            guide: {
              title: '巴黎五日游攻略',
              overview: '巴黎是法国的首都，也是世界著名的艺术之都。这里有埃菲尔铁塔、卢浮宫、凯旋门等标志性建筑，还有塞纳河、香榭丽舍大街等浪漫景点。',
              highlights: ['必游景点：埃菲尔铁塔、卢浮宫、凯旋门', '美食体验：法式甜点、红酒、奶酪', '文化沉浸：参观博物馆、观看演出', '购物推荐：香榭丽舍大街、老佛爷百货'],
              tips: ['最佳旅游时间：4-6月和9-11月', '交通建议：购买地铁通票', '住宿推荐：市中心或塞纳河畔', '预算规划：人均每天100-150欧元'],
              emergency: {
                police: '17',
                hospital: '15',
                embassy: '查询当地中国大使馆联系方式'
              }
            },
            photoTips: {
              title: '巴黎拍照指南',
              bestSpots: [{
                location: '埃菲尔铁塔',
                time: '日出或日落时分',
                tips: '使用广角镜头，捕捉铁塔全景',
                settings: '光圈 f/8, ISO 100, 快门 1/125s'
              }],
              techniques: ['利用黄金时段拍摄，光线柔和', '使用三分法构图，突出主体', '尝试不同角度，寻找独特视角'],
              equipment: ['广角镜头：拍摄建筑和风景', '长焦镜头：捕捉细节', '三脚架：稳定拍摄']
            },
            outfitTips: {
              title: '巴黎春季穿搭指南',
              season: '春季',
              recommendations: [{
                type: '上装',
                items: ['长袖衬衫', '薄外套', '针织衫']
              }, {
                type: '下装',
                items: ['长裤', '牛仔裤', '休闲裤']
              }],
              tips: ['春季气温适宜，建议轻便穿搭', '选择优雅的款式，符合巴黎时尚氛围']
            }
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 8,
    name: '获取计划功能',
    description: '测试从数据库获取计划',
    icon: Calendar,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'get',
          planId: generatedPlanId || 'trip_001',
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 9,
    name: '更新计划功能',
    description: '测试更新计划到数据库',
    icon: RefreshCw,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'update',
          planId: generatedPlanId || 'trip_001',
          plan: {
            description: '更新后的描述：探索巴黎的浪漫与艺术，体验法式生活的优雅。这是一次难忘的旅程，充满了艺术、美食和文化的体验。',
            status: 'in_progress'
          },
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }, {
    id: 10,
    name: '列出计划功能',
    description: '测试列出所有计划',
    icon: MapPin,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'list',
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      return result;
    }
  }];
  const runSingleTest = async testCase => {
    setCurrentTest(testCase.id);
    try {
      const result = await testCase.action();
      const success = result.success !== false;

      // 如果是保存计划，保存 planId
      if (testCase.id === 7 && result.planId) {
        setGeneratedPlanId(result.planId);
      }
      setTestResults(prev => [...prev, {
        id: testCase.id,
        name: testCase.name,
        success,
        result,
        timestamp: new Date().toISOString()
      }]);
      if (success) {
        toast({
          title: '测试通过',
          description: `${testCase.name} 测试成功`,
          variant: 'default'
        });
      } else {
        throw new Error(result.error || '测试失败');
      }
    } catch (error) {
      console.error('测试失败:', error);
      setTestResults(prev => [...prev, {
        id: testCase.id,
        name: testCase.name,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
      toast({
        title: '测试失败',
        description: `${testCase.name}: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setCurrentTest(null);
    }
  };
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    for (const testCase of testCases) {
      await runSingleTest(testCase);
      // 等待 500ms 再执行下一个测试
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsRunning(false);
    toast({
      title: '所有测试完成',
      description: `共执行 ${testCases.length} 个测试`,
      variant: 'default'
    });
  };
  const resetTests = () => {
    setTestResults([]);
    setGeneratedPlanId(null);
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const passedCount = testResults.filter(r => r.success).length;
  const failedCount = testResults.filter(r => !r.success).length;
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
              AI功能测试
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {/* 测试统计 */}
        {testResults.length > 0 && <div className="bg-white rounded-xl p-4 shadow-md mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                测试结果
              </h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{passedCount} 通过</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">{failedCount} 失败</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#4ECDC4] to-[#FF6B6B] h-2 rounded-full transition-all" style={{
            width: `${testResults.length > 0 ? passedCount / testResults.length * 100 : 0}%`
          }}></div>
            </div>
          </div>}

        {/* 测试用例列表 */}
        <div className="space-y-3">
          {testCases.map(testCase => {
          const testResult = testResults.find(r => r.id === testCase.id);
          const isRunning = currentTest === testCase.id;
          return <div key={testCase.id} className={`bg-white rounded-xl p-4 shadow-md transition-all ${isRunning ? 'ring-2 ring-[#4ECDC4]' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${testResult?.success ? 'bg-green-100' : testResult?.success === false ? 'bg-red-100' : 'bg-gray-100'}`}>
                    {isRunning ? <Loader2 className="w-5 h-5 text-[#4ECDC4] animate-spin" /> : testResult?.success ? <CheckCircle className="w-5 h-5 text-green-500" /> : testResult?.success === false ? <XCircle className="w-5 h-5 text-red-500" /> : <testCase.icon className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2D3436] mb-1" style={{
                  fontFamily: 'Nunito, sans-serif'
                }}>
                      {testCase.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      {testCase.description}
                    </p>
                    {testResult && <div className={`text-xs p-2 rounded ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {testResult.success ? '✓ 测试通过' : `✗ 测试失败: ${testResult.error}`}
                      </div>}
                  </div>
                  <Button onClick={() => runSingleTest(testCase)} disabled={isRunning || testResult?.success} variant="outline" className="shrink-0">
                    {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>;
        })}
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 space-y-3">
          <Button onClick={runAllTests} disabled={isRunning} className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5252] hover:to-[#3DBDB5] text-white">
            {isRunning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />运行中...</> : <><Play className="w-4 h-4 mr-2" />运行所有测试</>}
          </Button>
          <Button onClick={resetTests} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            重置测试
          </Button>
        </div>
      </div>

      {/* TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}
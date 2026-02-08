// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Play, CheckCircle, XCircle, Loader2, RefreshCw, BookOpen, Route, Cloud, Camera, Shirt, Sparkles } from 'lucide-react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';

export default function AITest(props) {
  const {
    toast
  } = useToast();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
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
            destination: '东京',
            days: 3,
            budget: 10000,
            travelers: 2,
            startDate: '2026-03-15',
            preferences: '喜欢历史文化'
          },
          userId: 'test-user'
        }
      });
      return result.success && result.plan;
    }
  }, {
    id: 2,
    name: '行程规划 Agent',
    description: '测试行程规划Agent生成详细行程的能力',
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
            preferences: '浪漫之旅'
          }
        }
      });
      return result.success;
    }
  }, {
    id: 3,
    name: '天气查询 Agent',
    description: '测试天气查询Agent获取天气信息的能力',
    icon: Cloud,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'callAgent',
          agentType: 'weather',
          input: {
            destination: '大理',
            startDate: '2026-04-01',
            days: 3
          }
        }
      });
      return result.success;
    }
  }, {
    id: 4,
    name: '攻略生成 Agent',
    description: '测试攻略生成Agent创建旅行攻略的能力',
    icon: BookOpen,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'callAgent',
          agentType: 'guide',
          input: {
            destination: '京都',
            days: 4
          }
        }
      });
      return result.success;
    }
  }, {
    id: 5,
    name: '拍照指导 Agent',
    description: '测试拍照指导Agent提供拍照建议的能力',
    icon: Camera,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'callAgent',
          agentType: 'photo',
          input: {
            destination: '纽约'
          }
        }
      });
      return result.success;
    }
  }, {
    id: 6,
    name: '穿搭建议 Agent',
    description: '测试穿搭建议Agent提供穿搭指导的能力',
    icon: Shirt,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'callAgent',
          agentType: 'outfit',
          input: {
            destination: '伦敦',
            startDate: '2026-05-01'
          }
        }
      });
      return result.success;
    }
  }, {
    id: 7,
    name: '天气刷新功能',
    description: '测试刷新天气信息的功能',
    icon: RefreshCw,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getWeather',
          date: '2026-03-15',
          location: '东京'
        }
      });
      return result.success;
    }
  }, {
    id: 8,
    name: '保存计划功能',
    description: '测试保存旅行计划到数据库的功能',
    icon: CheckCircle,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'saveTravelPlan',
        data: {
          action: 'create',
          plan: {
            title: '测试计划',
            destination: '测试目的地',
            startDate: '2026-03-15',
            endDate: '2026-03-17',
            budget: 5000,
            travelers: 1,
            status: 'draft'
          }
        }
      });
      return result.success;
    }
  }, {
    id: 9,
    name: '对话保存功能',
    description: '测试保存对话记录的功能',
    icon: BookOpen,
    action: async () => {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'saveConversation',
          userId: 'test-user',
          conversation: {
            messages: [{
              role: 'user',
              content: '测试消息'
            }, {
              role: 'assistant',
              content: '测试回复'
            }]
          }
        }
      });
      return result.success;
    }
  }, {
    id: 10,
    name: '对话获取功能',
    description: '测试获取对话记录的功能',
    icon: BookOpen,
    action: async () => {
      // 先保存一个对话
      const saveResult = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'saveConversation',
          userId: 'test-user',
          conversation: {
            messages: [{
              role: 'user',
              content: '测试获取'
            }, {
              role: 'assistant',
              content: '测试回复'
            }]
          }
        }
      });
      if (!saveResult.success) return false;

      // 再获取对话
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getConversation',
          userId: 'test-user',
          conversationId: saveResult.conversationId
        }
      });
      return result.success;
    }
  }];
  const runSingleTest = async testCase => {
    setCurrentTest(testCase.id);
    try {
      const result = await testCase.action();
      setTestResults(prev => [...prev, {
        ...testCase,
        status: result ? 'success' : 'failed',
        timestamp: new Date().toISOString()
      }]);
      toast({
        title: result ? '测试通过' : '测试失败',
        description: `${testCase.name} ${result ? '执行成功' : '执行失败'}`,
        variant: result ? 'default' : 'destructive'
      });
    } catch (error) {
      console.error('测试执行失败:', error);
      setTestResults(prev => [...prev, {
        ...testCase,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
      toast({
        title: '测试出错',
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
      // 等待1秒再执行下一个测试
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsRunning(false);
    const successCount = testResults.filter(r => r.status === 'success').length;
    const totalCount = testResults.length;
    toast({
      title: '测试完成',
      description: `成功: ${successCount}/${totalCount}`,
      variant: successCount === totalCount ? 'default' : 'destructive'
    });
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-orange-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'error':
        return 'bg-orange-50 border-orange-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                  AI助手功能测试
                </h1>
                <p className="text-sm text-gray-500" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                  测试所有AI Agent的功能
                </p>
              </div>
            </div>
            <Button onClick={runAllTests} disabled={isRunning} isLoading={isRunning} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              {isRunning ? <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  运行中...
                </> : <>
                  <Play className="w-4 h-4" />
                  运行全部测试
                </>}
            </Button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {testResults.length > 0 && <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
              测试结果
            </h2>
            <div className="space-y-3">
              {testResults.map((result, idx) => <div key={idx} className={`p-4 rounded-xl border-2 ${getStatusColor(result.status)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <result.icon className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-800">{result.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                      {result.error && <p className="text-xs text-red-600 bg-red-100 rounded p-2">{result.error}</p>}
                      <p className="text-xs text-gray-400">
                        {new Date(result.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">
                      成功: {testResults.filter(r => r.status === 'success').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">
                      失败: {testResults.filter(r => r.status === 'failed' || r.status === 'error').length}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-800">
                  通过率: {Math.round(testResults.filter(r => r.status === 'success').length / testResults.length * 100)}%
                </div>
              </div>
            </div>
          </div>}

        {/* Test Cases */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800" style={{
          fontFamily: 'Nunito, sans-serif'
        }}>
            测试用例
          </h2>
          {testCases.map((testCase, idx) => <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <testCase.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2" style={{
                fontFamily: 'Nunito, sans-serif'
              }}>
                    {testCase.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{
                fontFamily: 'Quicksand, sans-serif'
              }}>
                    {testCase.description}
                  </p>
                  <Button onClick={() => runSingleTest(testCase)} disabled={isRunning || currentTest === testCase.id} isLoading={currentTest === testCase.id} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                    {currentTest === testCase.id ? <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        运行中...
                      </> : <>
                        <Play className="w-4 h-4" />
                        运行测试
                      </>}
                  </Button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}
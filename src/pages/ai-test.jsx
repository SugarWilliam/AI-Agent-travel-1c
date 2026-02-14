// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Send, Bot, User, Loader2, CheckCircle, XCircle, RefreshCw, Settings } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Textarea, Input } from '@/components/ui';

export default function AITestPage(props) {
  const {
    toast
  } = useToast();
  const [selectedModel, setSelectedModel] = useState('glm-pyc');
  const [testMessage, setTestMessage] = useState('你好，请介绍一下你自己');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [modelConfig, setModelConfig] = useState(null);

  // 加载模型配置
  const loadModelConfig = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'getModels',
          userId: props.$w.auth.currentUser?.userId || 'anonymous'
        }
      });
      if (result && result.result && result.result.success) {
        const models = result.result.data || [];
        const glmModel = models.find(m => m.modelId === 'glm-pyc');
        if (glmModel) {
          setModelConfig(glmModel);
          console.log('GLM 模型配置:', glmModel);
        }
      }
    } catch (error) {
      console.error('加载模型配置失败:', error);
    }
  };

  // 测试模型连接
  const testModelConnection = async () => {
    if (!testMessage.trim()) {
      toast({
        title: '请输入测试消息',
        description: '测试消息不能为空',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    const startTime = Date.now();
    try {
      console.log('开始测试模型:', selectedModel);
      console.log('测试消息:', testMessage);

      // 调用云函数测试模型
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'testModel',
          modelId: selectedModel,
          apiKey: modelConfig?.apiKey,
          apiEndpoint: modelConfig?.apiEndpoint,
          testMessage: testMessage
        }
      });
      console.log('测试结果:', result);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      if (result && result.result && result.result.success) {
        const testResult = {
          id: Date.now(),
          model: selectedModel,
          modelName: modelConfig?.modelName || 'GLM4.6',
          provider: modelConfig?.provider || '智谱AI',
          message: testMessage,
          response: result.result.data?.response || '测试成功',
          responseTime: responseTime,
          timestamp: new Date().toISOString(),
          success: true
        };
        setTestResults(prev => [testResult, ...prev]);
        toast({
          title: '测试成功',
          description: `模型响应时间: ${responseTime}ms`,
          variant: 'default'
        });
      } else {
        throw new Error(result?.result?.error || result?.error || '测试失败');
      }
    } catch (error) {
      console.error('模型测试失败:', error);
      const testResult = {
        id: Date.now(),
        model: selectedModel,
        modelName: modelConfig?.modelName || 'GLM4.6',
        provider: modelConfig?.provider || '智谱AI',
        message: testMessage,
        response: null,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message || '未知错误'
      };
      setTestResults(prev => [testResult, ...prev]);
      toast({
        title: '测试失败',
        description: error.message || '未知错误',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 测试 AI 对话
  const testAIConversation = async () => {
    if (!testMessage.trim()) {
      toast({
        title: '请输入测试消息',
        description: '测试消息不能为空',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    const startTime = Date.now();
    try {
      console.log('开始测试 AI 对话:', selectedModel);

      // 调用云函数生成 AI 响应
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'generate',
          userId: props.$w.auth.currentUser?.userId || 'anonymous',
          message: testMessage,
          conversationId: `test_${Date.now()}`,
          modelId: selectedModel
        }
      });
      console.log('AI 对话结果:', result);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      if (result && result.result && result.result.success) {
        const testResult = {
          id: Date.now(),
          model: selectedModel,
          modelName: modelConfig?.modelName || 'GLM4.6',
          provider: modelConfig?.provider || '智谱AI',
          message: testMessage,
          response: result.result.data?.response || '响应成功',
          responseTime: responseTime,
          timestamp: new Date().toISOString(),
          success: true,
          type: 'conversation'
        };
        setTestResults(prev => [testResult, ...prev]);
        toast({
          title: '对话测试成功',
          description: `模型响应时间: ${responseTime}ms`,
          variant: 'default'
        });
      } else {
        throw new Error(result?.result?.error || result?.error || '对话测试失败');
      }
    } catch (error) {
      console.error('AI 对话测试失败:', error);
      const testResult = {
        id: Date.now(),
        model: selectedModel,
        modelName: modelConfig?.modelName || 'GLM4.6',
        provider: modelConfig?.provider || '智谱AI',
        message: testMessage,
        response: null,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message || '未知错误',
        type: 'conversation'
      };
      setTestResults(prev => [testResult, ...prev]);
      toast({
        title: '对话测试失败',
        description: error.message || '未知错误',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 清空测试结果
  const clearResults = () => {
    setTestResults([]);
  };

  // 页面加载时加载模型配置
  React.useEffect(() => {
    loadModelConfig();
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI 助手测试验证
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            测试验证 GLM 模型是否真实可用，确保 API 调用正常且能返回有效响应
          </p>
        </div>
        
        {/* 模型配置信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              模型配置
            </h2>
            <Button onClick={loadModelConfig} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新配置
            </Button>
          </div>
          
          {modelConfig ? <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">模型名称:</span>
                <span className="font-medium text-gray-900 dark:text-white">{modelConfig.modelName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">模型 ID:</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">{modelConfig.modelId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">提供商:</span>
                <span className="font-medium text-gray-900 dark:text-white">{modelConfig.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">API 端点:</span>
                <span className="font-mono text-xs text-gray-900 dark:text-white break-all">{modelConfig.apiEndpoint}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">API Key:</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {modelConfig.apiKey ? `${modelConfig.apiKey.substring(0, 10)}...` : '未设置'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">状态:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${modelConfig.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {modelConfig.status === 'active' ? '活跃' : '未激活'}
                </span>
              </div>
            </div> : <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              加载模型配置中...
            </div>}
        </div>
        
        {/* 测试输入区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            测试输入
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                测试消息
              </label>
              <Textarea value={testMessage} onChange={e => setTestMessage(e.target.value)} placeholder="输入测试消息..." className="min-h-[100px]" />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={testModelConnection} disabled={isLoading || !modelConfig} className="flex-1">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                测试模型连接
              </Button>
              
              <Button onClick={testAIConversation} disabled={isLoading || !modelConfig} variant="outline" className="flex-1">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                测试 AI 对话
              </Button>
            </div>
          </div>
        </div>
        
        {/* 测试结果 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              测试结果
            </h2>
            {testResults.length > 0 && <Button onClick={clearResults} variant="ghost" size="sm">
                清空结果
              </Button>}
          </div>
          
          {testResults.length === 0 ? <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>暂无测试结果</p>
              <p className="text-sm mt-2">点击上方按钮开始测试</p>
            </div> : <div className="space-y-4">
              {testResults.map(result => <div key={result.id} className={`border rounded-lg p-4 ${result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {result.success ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {result.success ? '测试成功' : '测试失败'}
                      </span>
                      {result.type === 'conversation' && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                          对话测试
                        </span>}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {result.responseTime}ms
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-gray-600 dark:text-gray-400">用户:</span>
                        <p className="text-gray-900 dark:text-white mt-1">{result.message}</p>
                      </div>
                    </div>
                    
                    {result.response && <div className="flex items-start gap-2">
                        <Bot className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-gray-600 dark:text-gray-400">AI ({result.modelName}):</span>
                          <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">{result.response}</p>
                        </div>
                      </div>}
                    
                    {result.error && <div className="text-red-600 dark:text-red-400">
                        错误: {result.error}
                      </div>}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
                      {new Date(result.timestamp).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
}
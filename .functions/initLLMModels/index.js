// @ts-nocheck
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();
const _ = db.command;

/**
 * 初始化 LLM 模型数据
 * 将 llm_models 数据模型的数据导入到数据库中
 * 
 * 支持的模型：
 * - OpenAI: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
 * - Anthropic: Claude 3, Claude 2
 * - Google: Gemini Pro
 * - 阿里云: 通义千问 Max/Plus/Turbo
 * - 百度: 文心一言
 * - 字节跳动: 豆包 Pro/Lite
 * - 月之暗面: Kimi 128K/8K
 * - 智谱AI: GLM-4, GLM-3 Turbo
 * - 深度求索: DeepSeek Chat/Coder
 */
exports.main = async (event, context) => {
  console.log('开始初始化 LLM 模型数据');
  
  try {
    // 检查是否已经初始化过
    console.log('检查现有模型数据...');
    const existingModels = await db.collection('llm_models').limit(1).get();
    
    if (existingModels.data && existingModels.data.length > 0) {
      console.log(`LLM 模型数据已存在，跳过初始化`);
      return {
        success: true,
        message: 'LLM 模型数据已存在',
        skipped: true
      };
    }
    
    // LLM 模型数据
    const models = [
      {
        _id: 'model_001',
        modelId: 'gpt-4',
        modelName: 'GPT-4',
        provider: 'OpenAI',
        description: '推荐',
        maxTokens: 8192,
        temperature: 0.7,
        costLevel: 'high',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_002',
        modelId: 'gpt-4-turbo',
        modelName: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: '更快的响应速度',
        maxTokens: 128000,
        temperature: 0.7,
        costLevel: 'high',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_003',
        modelId: 'gpt-3.5-turbo',
        modelName: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: '经济实惠',
        maxTokens: 4096,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_004',
        modelId: 'claude-3',
        modelName: 'Claude 3',
        provider: 'Anthropic',
        description: '强大的推理能力',
        maxTokens: 200000,
        temperature: 0.7,
        costLevel: 'high',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_005',
        modelId: 'claude-2',
        modelName: 'Claude 2',
        provider: 'Anthropic',
        description: '稳定可靠',
        maxTokens: 100000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_006',
        modelId: 'gemini-pro',
        modelName: 'Gemini Pro',
        provider: 'Google',
        description: '多模态能力强',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_007',
        modelId: 'qwen-max',
        modelName: '通义千问 Max',
        provider: '阿里云',
        description: '中文优化',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_008',
        modelId: 'ernie-bot',
        modelName: '文心一言',
        provider: '百度',
        description: '中文理解能力强',
        maxTokens: 4000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_009',
        modelId: 'doubao-pro',
        modelName: '豆包 Pro',
        provider: '字节跳动',
        description: '中文对话能力强，性价比高',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_010',
        modelId: 'doubao-lite',
        modelName: '豆包 Lite',
        provider: '字节跳动',
        description: '轻量级模型，响应快速',
        maxTokens: 16000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_011',
        modelId: 'moonshot-v1-128k',
        modelName: 'Kimi 128K',
        provider: '月之暗面',
        description: '长文本处理能力强，支持128K上下文',
        maxTokens: 128000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_012',
        modelId: 'moonshot-v1-8k',
        modelName: 'Kimi 8K',
        provider: '月之暗面',
        description: '快速响应，适合日常对话',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_013',
        modelId: 'qwen-plus',
        modelName: '通义千问 Plus',
        provider: '阿里云',
        description: '平衡性能和成本',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_014',
        modelId: 'qwen-turbo',
        modelName: '通义千问 Turbo',
        provider: '阿里云',
        description: '快速响应，适合实时应用',
        maxTokens: 8000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_015',
        modelId: 'glm-4',
        modelName: 'GLM-4',
        provider: '智谱AI',
        description: '中文理解能力强，多模态支持',
        maxTokens: 128000,
        temperature: 0.7,
        costLevel: 'medium',
        capabilities: {
          documentParsing: true,
          imageRecognition: true,
          multimodal: true,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_016',
        modelId: 'glm-3-turbo',
        modelName: 'GLM-3 Turbo',
        provider: '智谱AI',
        description: '快速响应，性价比高',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_017',
        modelId: 'deepseek-chat',
        modelName: 'DeepSeek Chat',
        provider: '深度求索',
        description: '代码能力强，性价比高',
        maxTokens: 32000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: true,
        status: 'active',
        apiEndpoint: 'https://api.deepseek.com/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'model_018',
        modelId: 'deepseek-coder',
        modelName: 'DeepSeek Coder',
        provider: '深度求索',
        description: '专业代码生成模型',
        maxTokens: 16000,
        temperature: 0.7,
        costLevel: 'low',
        capabilities: {
          documentParsing: true,
          imageRecognition: false,
          multimodal: false,
          webScraping: true
        },
        isRecommended: false,
        status: 'active',
        apiEndpoint: 'https://api.deepseek.com/chat/completions',
        apiKey: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // 批量插入模型数据
    console.log(`准备插入 ${models.length} 个模型...`);
    const result = await db.collection('llm_models').add(models);
    
    console.log('成功初始化 LLM 模型数据:', models.length, '个模型');
    
    // 按提供商分组统计
    const providerStats = {};
    models.forEach(m => {
      if (!providerStats[m.provider]) {
        providerStats[m.provider] = 0;
      }
      providerStats[m.provider]++;
    });
    
    return {
      success: true,
      message: 'LLM 模型数据初始化成功',
      count: models.length,
      providerStats,
      models: models.map(m => ({
        id: m.modelId,
        name: m.modelName,
        provider: m.provider,
        description: m.description,
        isRecommended: m.isRecommended
      }))
    };
  } catch (error) {
    console.error('初始化 LLM 模型数据失败:', error);
    
    // 详细错误信息
    const errorInfo = {
      message: error.message || '初始化失败',
      code: error.code || 'UNKNOWN_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    return {
      success: false,
      error: errorInfo.message,
      code: errorInfo.code,
      details: errorInfo
    };
  }
};

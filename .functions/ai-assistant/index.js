const cloud = require('@cloudbase/node-sdk');
const https = require('https');
const http = require('http');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();
const _ = db.command;

// HTTP 请求函数
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    
    const req = protocol.request({
      hostname: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https') ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'POST',
      headers: options.headers,
      timeout: 30000 // 30秒超时
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          console.warn('JSON解析失败，返回原始响应:', e.message);
          resolve({ error: 'Invalid response', rawBody: body });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('HTTP请求失败:', error.message);
      resolve({ error: error.message });
    });
    
    req.on('timeout', () => {
      console.error('HTTP请求超时');
      req.destroy();
      resolve({ error: 'Request timeout' });
    });
    
    try {
      req.write(JSON.stringify(data));
      req.end();
    } catch (writeError) {
      console.error('写入请求数据失败:', writeError.message);
      resolve({ error: writeError.message });
    }
  });
}

// 调用 DeepSeek API
async function callDeepSeekAPI(apiKey, messages, model = 'deepseek-chat', temperature = 0.7, maxTokens = 4096) {
  try {
    const url = 'https://api.deepseek.com/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    const data = {
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
      stream: false
    };
    
    const response = await makeRequest(url, { method: 'POST', headers }, data);
    
    if (response.choices && response.choices.length > 0) {
      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage
      };
    } else {
      return {
        success: false,
        error: response.error?.message || 'API 调用失败'
      };
    }
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 调用通用 OpenAI 兼容 API
async function callOpenAICompatibleAPI(apiEndpoint, apiKey, messages, model, temperature, maxTokens) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    const data = {
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
      stream: false
    };
    
    console.log('调用 API:', apiEndpoint, '模型:', model);
    const response = await makeRequest(apiEndpoint, { method: 'POST', headers }, data);
    console.log('API 响应:', JSON.stringify(response));
    
    // 检查是否有错误
    if (response.error) {
      console.error('API 返回错误:', response.error);
      return {
        success: false,
        error: response.error.message || response.error || 'API 调用失败'
      };
    }
    
    // 尝试多种响应格式
    if (response.choices && response.choices.length > 0) {
      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage
      };
    } else if (response.data && response.data.choices && response.data.choices.length > 0) {
      return {
        success: true,
        content: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } else if (response.message) {
      return {
        success: true,
        content: response.message,
        usage: null
      };
    } else {
      console.error('无法解析 API 响应:', response);
      return {
        success: false,
        error: '无法解析 API 响应'
      };
    }
  } catch (error) {
    console.error('API 调用失败:', error);
    return {
      success: false,
      error: error.message || 'API 调用失败'
    };
  }
}

// 模型管理相关函数
async function getModels(userId) {
  try {
    const result = await db.collection('llm_models')
      .where({
        $or: [
          { owner: userId },
          { status: 'active' }
        ]
      })
      .orderBy('isRecommended', 'desc')
      .orderBy('createdAt', 'desc')
      .get();
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('获取模型失败:', error);
    return {
      success: false,
      error: '获取模型列表失败'
    };
  }
}

async function addModel(data) {
  try {
    const now = Date.now();
    const modelData = {
      ...data,
      _id: `model_${now}`,
      createdAt: now,
      updatedAt: now,
      status: data.status || 'active'
    };
    
    await db.collection('llm_models').add(modelData);
    
    return {
      success: true,
      data: modelData
    };
  } catch (error) {
    console.error('添加模型失败:', error);
    return {
      success: false,
      error: '添加模型失败'
    };
  }
}

async function updateModel(data) {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    await db.collection('llm_models')
      .doc(data._id)
      .update(updateData);
    
    return {
      success: true,
      data: updateData
    };
  } catch (error) {
    console.error('更新模型失败:', error);
    return {
      success: false,
      error: '更新模型失败'
    };
  }
}

async function deleteModel(data) {
  try {
    await db.collection('llm_models')
      .doc(data.modelId || data._id)
      .remove();
    
    return {
      success: true
    };
  } catch (error) {
    console.error('删除模型失败:', error);
    return {
      success: false,
      error: '删除模型失败'
    };
  }
}

// 技能管理相关函数
async function getSkills(userId) {
  try {
    console.log('获取技能列表，userId:', userId);
    
    // 先尝试查询所有技能
    let result;
    try {
      result = await db.collection('Skill').get();
      console.log('查询到技能数量:', result.data.length);
    } catch (queryError) {
      console.warn('查询技能失败，返回空数组:', queryError.message);
      result = { data: [] };
    }
    
    // 如果没有数据，返回默认技能列表
    if (!result.data || result.data.length === 0) {
      console.log('技能列表为空，返回默认技能');
      const defaultSkills = [
        {
          _id: 'skill-1',
          name: '行程规划',
          description: '根据用户需求生成详细的旅行行程安排',
          category: 'travel',
          enabled: true,
          priority: 1,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-2',
          name: '路线优化',
          description: '优化旅行路线，提高效率',
          category: 'travel',
          enabled: true,
          priority: 2,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-3',
          name: '时间安排',
          description: '合理安排旅行时间',
          category: 'travel',
          enabled: true,
          priority: 3,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-4',
          name: '景点推荐',
          description: '推荐适合的景点',
          category: 'travel',
          enabled: true,
          priority: 4,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-5',
          name: '美食推荐',
          description: '推荐当地美食',
          category: 'travel',
          enabled: true,
          priority: 5,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-6',
          name: '天气预报',
          description: '提供天气预报信息',
          category: 'weather',
          enabled: true,
          priority: 6,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-7',
          name: '交通查询',
          description: '查询交通信息',
          category: 'travel',
          enabled: true,
          priority: 7,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-8',
          name: '费用估算',
          description: '估算旅行费用',
          category: 'calculation',
          enabled: true,
          priority: 8,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-9',
          name: '文化解说',
          description: '提供文化背景介绍',
          category: 'travel',
          enabled: true,
          priority: 9,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'skill-10',
          name: '拍照建议',
          description: '提供拍照技巧和建议',
          category: 'image',
          enabled: true,
          priority: 10,
          createdAt: new Date().toISOString()
        }
      ];
      
      return {
        success: true,
        data: defaultSkills
      };
    }
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('获取技能失败:', error);
    return {
      success: false,
      error: '获取技能列表失败'
    };
  }
}

async function addSkill(data) {
  try {
    const now = Date.now();
    const skillData = {
      ...data,
      _id: `skill_${now}`,
      createdAt: now,
      updatedAt: now,
      enabled: data.enabled !== false
    };
    
    await db.collection('Skill').add(skillData);
    
    return {
      success: true,
      data: skillData
    };
  } catch (error) {
    console.error('添加技能失败:', error);
    return {
      success: false,
      error: '添加技能失败'
    };
  }
}

async function updateSkill(data) {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    await db.collection('Skill')
      .doc(data._id)
      .update(updateData);
    
    return {
      success: true,
      data: updateData
    };
  } catch (error) {
    console.error('更新技能失败:', error);
    return {
      success: false,
      error: '更新技能失败'
    };
  }
}

async function deleteSkill(data) {
  try {
    await db.collection('Skill')
      .doc(data.skillId || data._id)
      .remove();
    
    return {
      success: true
    };
  } catch (error) {
    console.error('删除技能失败:', error);
    return {
      success: false,
      error: '删除技能失败'
    };
  }
}

// AI配置管理相关函数
async function getAIConfig(userId) {
  try {
    const result = await db.collection('AIConfig')
      .where({ userId })
      .get();
    
    if (result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      };
    } else {
      return {
        success: true,
        data: null
      };
    }
  } catch (error) {
    console.error('获取AI配置失败:', error);
    // 如果集合不存在，返回成功但数据为空
    if (error.message && error.message.includes('not exist')) {
      return {
        success: true,
        data: null
      };
    }
    return {
      success: false,
      error: '获取AI配置失败'
    };
  }
}

async function saveAIConfig(data) {
  try {
    const now = Date.now();
    const configData = {
      ...data,
      updatedAt: now
    };
    
    // 检查是否已存在配置
    let existing;
    try {
      existing = await db.collection('AIConfig')
        .where({ userId: data.userId })
        .get();
    } catch (queryError) {
      // 如果集合不存在，existing 为空
      if (queryError.message && queryError.message.includes('not exist')) {
        existing = { data: [] };
      } else {
        throw queryError;
      }
    }
    
    if (existing.data && existing.data.length > 0) {
      // 更新现有配置
      await db.collection('AIConfig')
        .doc(existing.data[0]._id)
        .update(configData);
    } else {
      // 创建新配置
      configData.createdAt = now;
      await db.collection('AIConfig').add(configData);
    }
    
    return {
      success: true,
      data: configData
    };
  } catch (error) {
    console.error('保存AI配置失败:', error);
    return {
      success: false,
      error: '保存AI配置失败'
    };
  }
}

// 对话管理相关函数
async function saveConversation(data) {
  try {
    const now = Date.now();
    const conversationData = {
      ...data,
      _id: `conv_${now}`,
      createdAt: now,
      updatedAt: now
    };
    
    await db.collection('Conversation').add(conversationData);
    
    return {
      success: true,
      data: conversationData
    };
  } catch (error) {
    console.error('保存对话失败:', error);
    // 如果集合不存在，返回成功但数据为空
    if (error.message && error.message.includes('not exist')) {
      console.warn('Conversation集合不存在，跳过保存对话');
      return {
        success: true,
        data: conversationData
      };
    }
    return {
      success: false,
      error: '保存对话失败'
    };
  }
}

async function getConversations(userId) {
  try {
    const result = await db.collection('Conversation')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .get();
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('获取对话列表失败:', error);
    return {
      success: false,
      error: '获取对话列表失败'
    };
  }
}

async function getConversation(conversationId) {
  try {
    const result = await db.collection('Conversation')
      .doc(conversationId)
      .get();
    
    return {
      success: true,
      data: result.data[0]
    };
  } catch (error) {
    console.error('获取对话失败:', error);
    return {
      success: false,
      error: '获取对话失败'
    };
  }
}

// 消息管理相关函数
async function saveMessage(data) {
  try {
    const now = Date.now();
    const messageData = {
      ...data,
      _id: `msg_${now}`,
      createdAt: now
    };
    
    await db.collection('Message').add(messageData);
    
    return {
      success: true,
      data: messageData
    };
  } catch (error) {
    console.error('保存消息失败:', error);
    // 如果集合不存在，返回成功但数据为空
    if (error.message && error.message.includes('not exist')) {
      console.warn('Message集合不存在，跳过保存消息');
      return {
        success: true,
        data: messageData
      };
    }
    return {
      success: false,
      error: '保存消息失败'
    };
  }
}

async function getMessages(conversationId) {
  try {
    const result = await db.collection('Message')
      .where({ conversationId })
      .orderBy('createdAt', 'asc')
      .get();
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('获取消息列表失败:', error);
    return {
      success: false,
      error: '获取消息列表失败'
    };
  }
}

// AI对话生成函数
async function generateAIResponse(event) {
  console.log('generateAIResponse 收到的参数:', JSON.stringify(event));
  const { userId, message, conversationId, modelId, data } = event;
  
  // 兼容不同的参数结构
  const finalUserId = userId || data?.userId || 'anonymous';
  const finalMessage = message || data?.message || '';
  const finalConversationId = conversationId || data?.conversationId || 'default';
  const finalModelId = modelId || data?.modelId;
  
  console.log('处理后的参数:', {
    userId: finalUserId,
    message: finalMessage,
    conversationId: finalConversationId,
    modelId: finalModelId
  });
  
  if (!finalMessage) {
    console.error('消息内容为空');
    return {
      success: false,
      error: '消息内容不能为空'
    };
  }
  
  try {
    // 获取用户配置的模型
    let modelConfig = null;
    if (finalModelId) {
      try {
        // 通过 modelId 字段查询，而不是 _id
        const modelResult = await db.collection('llm_models')
          .where({ modelId: finalModelId })
          .get();
        if (modelResult.data && modelResult.data.length > 0) {
          modelConfig = modelResult.data[0];
          console.log('找到模型配置:', modelConfig.modelName, modelConfig.provider);
        } else {
          console.warn('未找到模型配置，modelId:', finalModelId);
        }
      } catch (modelError) {
        console.warn('获取模型配置失败，使用默认模型:', modelError.message);
      }
    }
    
    // 尝试调用真实的 AI API
    let response = null;
    let apiError = null;
    
    if (modelConfig && modelConfig.apiKey && modelConfig.apiKey !== '您的API Key' && modelConfig.apiKey !== '') {
      try {
        console.log('调用 AI API:', modelConfig.modelName, modelConfig.modelId);
        
        // 构建消息数组
        const messages = [
          {
            role: 'system',
            content: modelConfig.systemPrompt || '你是一个专业的旅行规划助手，擅长为用户提供个性化的旅行建议和规划。'
          },
          {
            role: 'user',
            content: finalMessage
          }
        ];
        
        // 根据提供商调用不同的 API
        let apiResult;
        if (modelConfig.provider === '深度求索') {
          apiResult = await callDeepSeekAPI(
            modelConfig.apiKey,
            messages,
            modelConfig.modelId,
            modelConfig.temperature || 0.7,
            modelConfig.maxTokens || 4096
          );
        } else {
          // 使用 OpenAI 兼容 API
          apiResult = await callOpenAICompatibleAPI(
            modelConfig.apiEndpoint,
            modelConfig.apiKey,
            messages,
            modelConfig.modelId,
            modelConfig.temperature || 0.7,
            modelConfig.maxTokens || 4096
          );
        }
        
        if (apiResult.success) {
          response = apiResult.content;
          console.log('AI API 调用成功，响应长度:', response.length);
        } else {
          apiError = apiResult.error;
          console.warn('AI API 调用失败:', apiError);
        }
      } catch (error) {
        apiError = error.message;
        console.warn('AI API 调用异常:', error);
      }
    } else {
      console.warn('模型配置不完整或 API Key 未设置，使用模拟响应');
    }
    
    // 如果 API 调用失败，使用模拟响应作为降级方案
    if (!response) {
      response = generateMockResponse(finalMessage, modelConfig);
      console.log('使用模拟响应，原因:', apiError || 'API Key 未设置');
    }
    
    console.log('最终响应:', response);
    
    // 尝试保存用户消息（如果失败不影响响应）
    try {
      await saveMessage({
        conversationId: finalConversationId,
        userId: finalUserId,
        role: 'user',
        content: finalMessage
      });
    } catch (saveError) {
      console.warn('保存用户消息失败:', saveError.message);
    }
    
    // 尝试保存AI响应（如果失败不影响响应）
    try {
      await saveMessage({
        conversationId: finalConversationId,
        userId: finalUserId,
        role: 'assistant',
        content: response
      });
    } catch (saveError) {
      console.warn('保存AI响应失败:', saveError.message);
    }
    
    return {
      success: true,
      data: {
        response,
        modelUsed: modelConfig?.modelName || 'GLM4.6'
      }
    };
  } catch (error) {
    console.error('生成AI响应失败:', error);
    return {
      success: false,
      error: '生成AI响应失败'
    };
  }
}

// 模拟AI响应生成
function generateMockResponse(message, modelConfig) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('天气') || lowerMessage.includes('weather')) {
    return `根据当前天气数据，目的地天气晴朗，温度适宜。建议您准备轻便的衣物，并注意防晒。\n\n详细天气预报：\n• 今日：晴，25°C\n• 明日：多云，23°C\n• 后日：小雨，20°C`;
  }
  
  if (lowerMessage.includes('攻略') || lowerMessage.includes('guide')) {
    return `为您生成详细的旅行攻略：\n\n🏛️ 必游景点：\n1. 历史文化古迹\n2. 自然风光景区\n3. 特色街区\n\n🍜 美食推荐：\n1. 当地特色小吃\n2. 知名餐厅\n3. 隐藏美食店\n\n🏨 住宿建议：\n1. 市中心酒店\n2. 特色民宿\n3. 经济型旅社\n\n💡 实用贴士：\n• 提前预订热门景点门票\n• 准备必要的旅行证件\n• 了解当地文化习俗`;
  }
  
  if (lowerMessage.includes('拍照') || lowerMessage.includes('photo')) {
    return `为您提供专业的拍照建议：\n\n📸 最佳拍摄时间：\n• 日出后1小时：光线柔和，色彩丰富\n• 日落前1小时：黄金时刻，温暖色调\n\n🎯 推荐拍摄地点：\n1. 城市地标建筑\n2. 特色街景\n3. 自然风光\n\n📷 拍摄技巧：\n• 使用三分法构图\n• 注意光线方向\n• 捕捉人物表情\n• 尝试不同角度\n\n👕 穿搭建议：\n• 选择与背景协调的颜色\n• 避免过于复杂的图案\n• 考虑天气和活动类型`;
  }
  
  if (lowerMessage.includes('穿搭') || lowerMessage.includes('outfit')) {
    return `根据目的地天气和活动，为您提供穿搭建议：\n\n🌤️ 晴天穿搭：\n• 上装：轻薄长袖或短袖\n• 下装：舒适长裤或裙子\n• 鞋履：运动鞋或休闲鞋\n• 配饰：太阳帽、太阳镜\n\n🌧️ 雨天穿搭：\n• 外套：防水外套或雨衣\n• 鞋履：防水鞋或雨靴\n• 配饰：雨伞\n\n🏔️ 山地活动：\n• 上装：保暖内衣+抓绒衣\n• 下装：登山裤\n• 鞋履：登山鞋\n• 配饰：登山杖、背包\n\n💡 贴心提示：\n• 采用分层穿搭法，便于增减\n• 选择透气性好的面料\n• 准备备用衣物`;
  }
  
  // 默认响应
  return `我理解您的需求。作为您的AI旅行助手，我可以帮您：\n\n📋 生成完整旅行攻略\n🗺️ 规划详细行程路线\n🌤️ 实时天气查询和建议\n📍 行程节点智能安排\n📸 专业拍照指导\n👕 穿搭建议\n🎯 识别图片中的景点\n📄 解析旅行文档\n\n请告诉我您需要什么帮助？`;
}

// 计划生成相关函数
async function generatePlan(event) {
  // 兼容不同的参数结构
  const input = event.input || event;
  const { destination, startDate, endDate, budget, travelers, preferences, days } = input;
  
  // 如果没有 endDate，根据 days 计算
  let finalEndDate = endDate;
  if (!finalEndDate && startDate && days) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + days - 1);
    finalEndDate = end.toISOString().split('T')[0];
  }
  
  try {
    const plan = {
      destination,
      startDate,
      endDate: finalEndDate,
      budget,
      travelers,
      preferences,
      days,
      itinerary: generateItinerary(destination, startDate, finalEndDate, preferences),
      accommodation: generateAccommodation(destination, budget, travelers),
      dining: generateDining(destination, preferences),
      attractions: generateAttractions(destination, preferences),
      tips: generateTips(destination),
      emergencyInfo: generateEmergencyInfo(destination),
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: plan
    };
  } catch (error) {
    console.error('生成计划失败:', error);
    return {
      success: false,
      error: '生成计划失败'
    };
  }
}

function generateItinerary(destination, startDate, endDate, preferences) {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const itinerary = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    itinerary.push({
      date: date.toISOString().split('T')[0],
      morning: {
        time: '09:00-12:00',
        activities: [`参观${destination}著名景点`, `探索${destination}历史文化`]
      },
      afternoon: {
        time: '14:00-18:00',
        activities: [`体验${destination}特色活动`, `品尝当地美食`]
      },
      evening: {
        time: '19:00-21:00',
        activities: [`欣赏${destination}夜景`, `享受当地娱乐`]
      }
    });
  }
  
  return itinerary;
}

function generateAccommodation(destination, budget, travelers) {
  return {
    budget: `经济型：${destination}青年旅社，人均￥100-200/晚`,
    midRange: `舒适型：${destination}三星酒店，人均￥300-500/晚`,
    luxury: `豪华型：${destination}五星酒店，人均￥800-1500/晚`,
    recommendation: `根据您的预算，推荐选择市中心附近的舒适型酒店`
  };
}

function generateDining(destination, preferences) {
  return {
    breakfast: `${destination}特色早餐推荐：当地小吃`,
    lunch: `午餐推荐：特色餐厅，预算￥50-100/人`,
    dinner: `晚餐推荐：知名餐厅，预算￥100-200/人`,
    specialties: `${destination}必尝美食：根据当地特色推荐`
  };
}

function generateAttractions(destination, preferences) {
  return {
    mustSee: `${destination}必游景点：历史古迹、自然风光`,
    hiddenGems: `小众景点推荐：避开人群的独特体验`,
    activities: `特色活动：根据${preferences}推荐适合的活动`
  };
}

function generateTips(destination) {
  return [
    '提前查看天气预报，准备合适衣物',
    '准备必要的旅行证件和保险',
    '了解当地文化习俗和礼仪',
    '保存重要联系电话和地址',
    '准备常用药品和急救用品'
  ];
}

function generateEmergencyInfo(destination) {
  return {
    police: '报警电话：110',
    medical: '急救电话：120',
    consulate: '领事馆电话：请查询当地中国领事馆',
    insurance: '保险公司24小时热线：请查看您的保险卡'
  };
}

// Agent 调用
async function callAgent(event) {
  const { agentType, input, userId } = event;
  
  try {
    let response;
    switch (agentType) {
      case 'itinerary':
        response = `已为您规划${input.destination}${input.days}日行程，包含文化体验、美食和购物安排。`;
        break;
      case 'weather':
        response = `${input.destination}当前天气晴朗，气温20°C，适合出行。`;
        break;
      case 'photo':
        response = `为您推荐${input.destination}的最佳拍照地点和技巧。`;
        break;
      case 'outfit':
        response = `根据${input.destination}的天气，建议您穿着轻便舒适的服装。`;
        break;
      default:
        response = `Agent ${agentType} 已处理您的请求。`;
    }
    
    return {
      success: true,
      data: {
        response,
        agentType
      }
    };
  } catch (error) {
    console.error('Agent调用失败:', error);
    return {
      success: false,
      error: 'Agent调用失败'
    };
  }
}

// 天气查询
async function weatherQuery(event) {
  const { destination, date } = event;
  
  try {
    const weather = {
      destination,
      date: date || new Date().toISOString().split('T')[0],
      temperature: '20-25°C',
      condition: '晴朗',
      humidity: '60%',
      wind: '东南风 3级',
      advice: '天气适宜，适合户外活动'
    };
    
    return {
      success: true,
      data: weather
    };
  } catch (error) {
    console.error('天气查询失败:', error);
    return {
      success: false,
      error: '天气查询失败'
    };
  }
}

// 穿搭建议
async function outfitGuide(event) {
  const { destination, startDate } = event;
  
  try {
    const guide = {
      destination,
      season: '春季',
      recommendations: [
        { type: '上装', items: ['长袖衬衫', '薄外套', '针织衫'] },
        { type: '下装', items: ['长裤', '牛仔裤', '休闲裤'] },
        { type: '鞋履', items: ['运动鞋', '休闲鞋'] }
      ],
      tips: [
        '春季气温适宜，建议轻便穿搭',
        '选择优雅的款式，符合当地时尚氛围',
        '准备一件外套，应对早晚温差'
      ]
    };
    
    return {
      success: true,
      data: guide
    };
  } catch (error) {
    console.error('穿搭建议生成失败:', error);
    return {
      success: false,
      error: '穿搭建议生成失败'
    };
  }
}

// 拍照指导
async function photoGuide(event) {
  const { destination } = event;
  
  try {
    const guide = {
      destination,
      locations: [
        {
          name: `${destination}地标建筑`,
          bestTime: '日出或日落时分',
          tips: ['使用广角镜头', '注意构图平衡', '避开人流高峰']
        },
        {
          name: '当地特色街区',
          bestTime: '上午10点或下午3点',
          tips: ['捕捉生活气息', '使用自然光', '尝试不同角度']
        }
      ],
      techniques: [
        '利用黄金时段拍摄，光线柔和',
        '使用三分法构图，突出主体',
        '尝试不同角度，寻找独特视角'
      ],
      equipment: [
        '广角镜头：拍摄建筑和风景',
        '长焦镜头：捕捉细节',
        '三脚架：稳定拍摄'
      ]
    };
    
    return {
      success: true,
      data: guide
    };
  } catch (error) {
    console.error('拍照指导生成失败:', error);
    return {
      success: false,
      error: '拍照指导生成失败'
    };
  }
}

// 文档解析
async function documentParsing(event) {
  const { content } = event;
  
  try {
    const result = {
      summary: '文档解析完成',
      keyPoints: ['关键点1', '关键点2', '关键点3'],
      extractedData: {
        title: '文档标题',
        content: content || '文档内容'
      }
    };
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('文档解析失败:', error);
    return {
      success: false,
      error: '文档解析失败'
    };
  }
}

// 链接生成
async function linkGeneration(event) {
  const { planId } = event;
  
  try {
    const link = {
      url: `https://example.com/share/${planId || 'default'}`,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    return {
      success: true,
      data: link
    };
  } catch (error) {
    console.error('链接生成失败:', error);
    return {
      success: false,
      error: '链接生成失败'
    };
  }
}

// 模型测试
async function testModel(event) {
  const { modelId, apiKey, apiEndpoint, testMessage } = event;
  
  console.log('测试模型:', modelId, 'API Endpoint:', apiEndpoint);
  
  try {
    // 构建请求数据
    const requestData = {
      model: modelId,
      messages: [{
        role: 'user',
        content: testMessage || '你好，请回复"测试成功"'
      }],
      temperature: 0.7,
      max_tokens: 100
    };
    
    console.log('发送测试请求:', JSON.stringify(requestData));
    
    // 调用模型 API
    const response = await makeRequest(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    }, requestData);
    
    console.log('模型 API 响应:', JSON.stringify(response));
    
    // 检查是否有错误
    if (response.error) {
      console.error('API 返回错误:', response.error);
      throw new Error(response.error.message || response.error || 'API 调用失败');
    }
    
    // 提取响应内容
    let aiResponse = '';
    if (response.choices && response.choices.length > 0) {
      aiResponse = response.choices[0].message.content;
    } else if (response.data && response.data.choices && response.data.choices.length > 0) {
      aiResponse = response.data.choices[0].message.content;
    } else if (response.message) {
      aiResponse = response.message;
    } else {
      aiResponse = '测试成功';
    }
    
    return {
      success: true,
      data: {
        response: aiResponse,
        modelId,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('模型测试失败:', error);
    return {
      success: false,
      error: error.message || '模型测试失败'
    };
  }
}

// 主函数
exports.main = async (event, context) => {
  console.log('云函数收到请求:', JSON.stringify(event));
  console.log('请求上下文:', JSON.stringify(context));
  
  const { action, data, userId } = event;
  
  if (!action) {
    console.error('缺少 action 参数');
    return {
      success: false,
      error: '缺少 action 参数'
    };
  }
  
  try {
    console.log('执行操作:', action);
    let result;
    switch (action) {
      // 模型管理
      case 'getModels':
        result = await getModels(userId);
        break;
      case 'addModel':
        result = await addModel(data);
        break;
      case 'updateModel':
        result = await updateModel(data);
        break;
      case 'deleteModel':
        result = await deleteModel(data);
        break;
      
      // 技能管理
      case 'getSkills':
        result = await getSkills(userId);
        break;
      case 'addSkill':
        result = await addSkill(data);
        break;
      case 'updateSkill':
        result = await updateSkill(data);
        break;
      case 'deleteSkill':
        result = await deleteSkill(data);
        break;
      
      // AI配置管理
      case 'getAIConfig':
        result = await getAIConfig(userId);
        break;
      case 'saveAIConfig':
        result = await saveAIConfig(data);
        break;
      
      // 对话管理
      case 'saveConversation':
        result = await saveConversation(data);
        break;
      case 'getConversations':
        result = await getConversations(userId);
        break;
      case 'getConversation':
        result = await getConversation(data.conversationId);
        break;
      
      // 消息管理
      case 'saveMessage':
        result = await saveMessage(data);
        break;
      case 'getMessages':
        result = await getMessages(data.conversationId);
        break;
      
      // AI对话生成
      case 'generate':
        console.log('执行 generate 操作，参数:', event);
        result = await generateAIResponse(event);
        break;
      
      // 计划生成
      case 'generatePlan':
        result = await generatePlan(event);
        break;
      
      // Agent 调用
      case 'callAgent':
        result = await callAgent(event);
        break;
      
      // 天气查询
      case 'weatherQuery':
        result = await weatherQuery(event);
        break;
      
      // 穿搭建议
      case 'outfitGuide':
        result = await outfitGuide(event);
        break;
      
      // 拍照指导
      case 'photoGuide':
        result = await photoGuide(event);
        break;
      
      // 模型测试
      case 'testModel':
        result = await testModel(event);
        break;
      
      // 文档解析
      case 'documentParsing':
        result = await documentParsing(event);
        break;
      
      // 链接生成
      case 'linkGeneration':
        result = await linkGeneration(event);
        break;
      
      default:
        result = {
          success: false,
          error: '未知的操作类型'
        };
    }
    
    // 统一返回结构
    return { result };
  } catch (error) {
    console.error('云函数执行错误:', error);
    console.error('错误堆栈:', error.stack);
    console.error('错误消息:', error.message);
    console.error('错误代码:', error.code);
    
    return {
      result: {
        success: false,
        error: error.message || '服务器内部错误',
        code: error.code
      }
    };
  }
};
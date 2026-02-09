const cloud = require('@cloudbase/node-sdk');

// 模型管理相关函数
async function getModels(userId) {
  const db = cloud.database();
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
  const db = cloud.database();
  try {
    const now = Date.now();
    const modelData = {
      ...data,
      _id: `model_${now}`,
      createdAt: now,
      updatedAt: now,
      status: data.status || 'active'
    };
    
    await db.collection('llm_models').add({
      data: modelData
    });
    
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
  const db = cloud.database();
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    await db.collection('llm_models')
      .doc(data._id)
      .update({
        data: updateData
      });
    
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
  const db = cloud.database();
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
  const db = cloud.database();
  try {
    const result = await db.collection('Skill')
      .where({
        $or: [
          { owner: userId },
          { enabled: true }
        ]
      })
      .orderBy('priority', 'desc')
      .orderBy('createdAt', 'desc')
      .get();
    
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
  const db = cloud.database();
  try {
    const now = Date.now();
    const skillData = {
      ...data,
      _id: `skill_${now}`,
      createdAt: now,
      updatedAt: now,
      enabled: data.enabled !== false
    };
    
    await db.collection('Skill').add({
      data: skillData
    });
    
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
  const db = cloud.database();
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    await db.collection('Skill')
      .doc(data._id)
      .update({
        data: updateData
      });
    
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
  const db = cloud.database();
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
  const db = cloud.database();
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
    return {
      success: false,
      error: '获取AI配置失败'
    };
  }
}

async function saveAIConfig(data) {
  const db = cloud.database();
  try {
    const now = Date.now();
    const configData = {
      ...data,
      updatedAt: now
    };
    
    // 检查是否已存在配置
    const existing = await db.collection('AIConfig')
      .where({ userId: data.userId })
      .get();
    
    if (existing.data && existing.data.length > 0) {
      // 更新现有配置
      await db.collection('AIConfig')
        .doc(existing.data[0]._id)
        .update({ data: configData });
    } else {
      // 创建新配置
      configData.createdAt = now;
      await db.collection('AIConfig').add({ data: configData });
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
  const db = cloud.database();
  try {
    const now = Date.now();
    const conversationData = {
      ...data,
      _id: `conv_${now}`,
      createdAt: now,
      updatedAt: now
    };
    
    await db.collection('Conversation').add({
      data: conversationData
    });
    
    return {
      success: true,
      data: conversationData
    };
  } catch (error) {
    console.error('保存对话失败:', error);
    return {
      success: false,
      error: '保存对话失败'
    };
  }
}

async function getConversations(userId) {
  const db = cloud.database();
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
  const db = cloud.database();
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
  const db = cloud.database();
  try {
    const now = Date.now();
    const messageData = {
      ...data,
      _id: `msg_${now}`,
      createdAt: now
    };
    
    await db.collection('Message').add({
      data: messageData
    });
    
    return {
      success: true,
      data: messageData
    };
  } catch (error) {
    console.error('保存消息失败:', error);
    return {
      success: false,
      error: '保存消息失败'
    };
  }
}

async function getMessages(conversationId) {
  const db = cloud.database();
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
  const { userId, message, conversationId, modelId } = event;
  
  try {
    // 获取用户配置的模型
    let modelConfig = null;
    if (modelId) {
      const db = cloud.database();
      const modelResult = await db.collection('llm_models')
        .doc(modelId)
        .get();
      if (modelResult.data && modelResult.data.length > 0) {
        modelConfig = modelResult.data[0];
      }
    }
    
    // 模拟AI响应生成
    const response = generateMockResponse(message, modelConfig);
    
    // 保存用户消息
    await saveMessage({
      conversationId,
      userId,
      role: 'user',
      content: message
    });
    
    // 保存AI响应
    await saveMessage({
      conversationId,
      userId,
      role: 'assistant',
      content: response
    });
    
    return {
      success: true,
      data: {
        response,
        modelUsed: modelConfig?.modelName || 'GPT-4'
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
  const { destination, startDate, endDate, budget, travelers, preferences } = event;
  
  try {
    const plan = {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      preferences,
      itinerary: generateItinerary(destination, startDate, endDate, preferences),
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

// 主函数
exports.main = async (event, context) => {
  const { action, data, userId } = event;
  
  try {
    switch (action) {
      // 模型管理
      case 'getModels':
        return await getModels(userId);
      case 'addModel':
        return await addModel(data);
      case 'updateModel':
        return await updateModel(data);
      case 'deleteModel':
        return await deleteModel(data);
      
      // 技能管理
      case 'getSkills':
        return await getSkills(userId);
      case 'addSkill':
        return await addSkill(data);
      case 'updateSkill':
        return await updateSkill(data);
      case 'deleteSkill':
        return await deleteSkill(data);
      
      // AI配置管理
      case 'getAIConfig':
        return await getAIConfig(userId);
      case 'saveAIConfig':
        return await saveAIConfig(data);
      
      // 对话管理
      case 'saveConversation':
        return await saveConversation(data);
      case 'getConversations':
        return await getConversations(userId);
      case 'getConversation':
        return await getConversation(data.conversationId);
      
      // 消息管理
      case 'saveMessage':
        return await saveMessage(data);
      case 'getMessages':
        return await getMessages(data.conversationId);
      
      // AI对话生成
      case 'generate':
        return await generateAIResponse(event);
      
      // 计划生成
      case 'generatePlan':
        return await generatePlan(event);
      
      default:
        return {
          success: false,
          error: '未知的操作类型'
        };
    }
  } catch (error) {
    console.error('云函数执行错误:', error);
    return {
      success: false,
      error: '服务器内部错误'
    };
  }
};
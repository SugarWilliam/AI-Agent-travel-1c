// @ts-nocheck
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, agentType, input, userId, currentPlan } = event;

  try {
    switch (action) {
      case 'callAgent':
        return await callAgent(agentType, input, userId, currentPlan);
      case 'generatePlan':
        return await generatePlan(input, userId);
      case 'generateGuide':
        return await generateGuide(input, userId);
      case 'photoGuide':
        return await photoGuide(input, userId);
      case 'outfitGuide':
        return await outfitGuide(input, userId);
      case 'saveConversation':
        return await saveConversation(event);
      case 'getConversation':
        return await getConversation(event);
      case 'getWeather':
        return await getWeather(input);
      case 'suggestTimeAdjustment':
        return await suggestTimeAdjustment(input);
      case 'refreshNodeStatus':
        return await refreshNodeStatus(input);
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
      error: error.message || '云函数执行失败'
    };
  }
};

async function callAgent(agentType, input, userId, currentPlan) {
  let response = '';
  let data = null;

  switch (agentType) {
    case 'itinerary':
      response = await callItineraryAgent(input, currentPlan);
      break;
    case 'weather':
      data = await callWeatherAgent(input);
      response = `已为您查询${input.query}的天气信息。`;
      break;
    case 'guide':
      response = await callGuideAgent(input);
      break;
    case 'photo':
      response = await callPhotoAgent(input);
      break;
    case 'outfit':
      response = await callOutfitAgent(input);
      break;
    case 'generatePlan':
      data = await generatePlan(input, userId);
      response = '已为您生成完整的旅行计划！';
      break;
    case 'generateGuide':
      response = await generateGuide(input, userId);
      break;
    default:
      response = '我理解您的需求，让我为您提供帮助。';
  }

  return {
    success: true,
    response,
    data
  };
}

async function callItineraryAgent(input, currentPlan) {
  const { query } = input;
  
  // 模拟行程规划响应
  return `根据您的需求，我为您规划了以下行程：\n\n📅 **行程安排**\n\n**上午**\n• 09:00 - 10:30：参观著名景点\n• 10:30 - 12:00：游览历史文化区\n\n**下午**\n• 14:00 - 16:00：体验当地特色活动\n• 16:00 - 18:00：自由活动时间\n\n**晚上**\n• 19:00 - 20:30：品尝当地美食\n• 20:30 - 22:00：夜景观赏\n\n💡 **温馨提示**\n• 建议提前预订门票\n• 注意防晒和补水\n• 保持手机畅通`;
}

async function callWeatherAgent(input) {
  const { query } = input;
  
  // 模拟天气数据
  return {
    location: query || '目的地',
    forecast: [
      { date: '2026-02-10', temperature: '25°C', condition: '晴', icon: '☀️' },
      { date: '2026-02-11', temperature: '24°C', condition: '多云', icon: '⛅' },
      { date: '2026-02-12', temperature: '23°C', condition: '小雨', icon: '🌧️' }
    ]
  };
}

async function callGuideAgent(input) {
  const { query } = input;
  
  // 模拟攻略生成
  return `为您生成的旅行攻略：\n\n🌟 **${query || '目的地'}旅行攻略**\n\n## 景点推荐\n\n1. **著名景点A**\n   - 评分：4.8/5\n   - 建议游玩时间：2-3小时\n   - 门票：免费\n\n2. **著名景点B**\n   - 评分：4.7/5\n   - 建议游玩时间：1-2小时\n   - 门票：50元\n\n## 美食推荐\n\n1. **特色美食A**\n   - 推荐餐厅：XX餐厅\n   - 人均消费：100元\n\n2. **特色美食B**\n   - 推荐餐厅：YY餐厅\n   - 人均消费：80元\n\n## 交通指南\n\n- 机场到市区：地铁/出租车\n- 市内交通：公交/地铁/共享单车\n\n## 注意事项\n\n- 提前预订门票\n- 注意天气变化\n- 保持环保意识`;
}

async function callPhotoAgent(input) {
  const { query } = input;
  
  // 模拟拍照指导
  return `为您提供的拍照指导：\n\n📸 **拍照技巧**\n\n## 最佳拍摄地点\n\n1. **景点A**\n   - 最佳时间：日出/日落\n   - 推荐角度：正面全景\n   - 设备建议：广角镜头\n\n2. **景点B**\n   - 最佳时间：上午9-11点\n   - 推荐角度：侧面特写\n   - 设备建议：长焦镜头\n\n## 拍摄技巧\n\n- 使用三分法构图\n- 注意光线方向\n- 保持画面简洁\n- 多角度尝试\n\n## 设备建议\n\n- 相机：单反/微单\n- 镜头：广角+长焦\n- 配件：三脚架、滤镜`;
}

async function callOutfitAgent(input) {
  const { query } = input;
  
  // 模拟穿搭建议
  return `为您提供的穿搭建议：\n\n👕 **穿搭指南**\n\n## 每日穿搭\n\n### 第1天\n- **上装**：T恤 + 薄外套\n- **下装**：牛仔裤\n- **鞋子**：运动鞋\n- **配饰**：帽子、墨镜\n\n### 第2天\n- **上装**：衬衫\n- **下装**：休闲裤\n- **鞋子**：休闲鞋\n- **配饰**：围巾\n\n### 第3天\n- **上装**：薄毛衣\n- **下装**：短裤\n- **鞋子**：凉鞋\n- **配饰**：太阳镜\n\n## 穿搭建议\n\n- 根据天气调整\n- 舒适为主\n- 颜色搭配\n- 备用衣物`;
}

async function generatePlan(input, userId) {
  const { destination, startDate, endDate, days, budget, travelers, preferences } = input;

  const plan = {
    title: `${destination}${days}日游`,
    destination,
    startDate,
    endDate,
    days,
    budget,
    travelers,
    preferences,
    description: `这是一份为您精心设计的${destination}${days}日游计划。`,
    itinerary: [
      {
        day: 1,
        date: startDate,
        title: '抵达与探索',
        activities: [
          { time: '09:00', title: '抵达机场', location: '机场', type: 'transport' },
          { time: '10:00', title: '入住酒店', location: '酒店', type: 'accommodation' },
          { time: '14:00', title: '游览市中心', location: '市中心', type: 'sightseeing' },
          { time: '18:00', title: '晚餐', location: '餐厅', type: 'dining' }
        ]
      },
      {
        day: 2,
        date: getNextDay(startDate, 1),
        title: '深度游览',
        activities: [
          { time: '08:00', title: '早餐', location: '酒店', type: 'dining' },
          { time: '09:00', title: '参观著名景点', location: '景点', type: 'sightseeing' },
          { time: '12:00', title: '午餐', location: '景点附近', type: 'dining' },
          { time: '14:00', title: '体验当地文化', location: '文化中心', type: 'culture' },
          { time: '18:00', title: '自由活动', location: '市区', type: 'free' }
        ]
      },
      {
        day: 3,
        date: getNextDay(startDate, 2),
        title: '返程',
        activities: [
          { time: '09:00', title: '早餐', location: '酒店', type: 'dining' },
          { time: '10:00', title: '购买纪念品', location: '商店', type: 'shopping' },
          { time: '14:00', title: '前往机场', location: '机场', type: 'transport' }
        ]
      }
    ],
    weather: [
      { date: startDate, temperature: '25°C', condition: '晴', icon: '☀️' },
      { date: getNextDay(startDate, 1), temperature: '24°C', condition: '多云', icon: '⛅' },
      { date: getNextDay(startDate, 2), temperature: '23°C', condition: '小雨', icon: '🌧️' }
    ],
    guide: {
      overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。`,
      highlights: ['著名景点', '特色美食', '文化体验'],
      tips: ['注意防晒', '保持环保', '尊重当地文化']
    },
    photoTips: {
      bestSpots: ['景点A', '景点B', '景点C'],
      tips: ['最佳拍摄时间：早晨和傍晚', '使用广角镜头拍摄风景', '注意构图和光线']
    },
    outfitTips: {
      recommendations: [
        { day: 1, outfit: '休闲装', items: ['T恤', '牛仔裤', '运动鞋'] },
        { day: 2, outfit: '舒适装', items: ['衬衫', '长裤', '休闲鞋'] },
        { day: 3, outfit: '轻便装', items: ['T恤', '短裤', '凉鞋'] }
      ]
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return {
    success: true,
    plan
  };
}

async function generateGuide(input, userId) {
  const { destination, days } = input;
  
  const guide = {
    overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。`,
    highlights: ['著名景点', '特色美食', '文化体验'],
    tips: ['注意防晒', '保持环保', '尊重当地文化'],
    content: `为您生成的${destination}${days}日游攻略：\n\n## 景点推荐\n\n1. **著名景点A**\n   - 评分：4.8/5\n   - 建议游玩时间：2-3小时\n   - 门票：免费\n\n2. **著名景点B**\n   - 评分：4.7/5\n   - 建议游玩时间：1-2小时\n   - 门票：50元\n\n## 美食推荐\n\n1. **特色美食A**\n   - 推荐餐厅：XX餐厅\n   - 人均消费：100元\n\n2. **特色美食B**\n   - 推荐餐厅：YY餐厅\n   - 人均消费：80元\n\n## 交通指南\n\n- 机场到市区：地铁/出租车\n- 市内交通：公交/地铁/共享单车\n\n## 注意事项\n\n- 提前预订门票\n- 注意天气变化\n- 保持环保意识`
  };

  return {
    success: true,
    guide
  };
}

async function photoGuide(input, userId) {
  const { destination } = input;
  
  const photoTips = {
    bestSpots: ['景点A', '景点B', '景点C'],
    tips: ['最佳拍摄时间：早晨和傍晚', '使用广角镜头拍摄风景', '注意构图和光线'],
    content: `为您提供的${destination}拍照指导：\n\n## 最佳拍摄地点\n\n1. **景点A**\n   - 最佳时间：日出/日落\n   - 推荐角度：正面全景\n   - 设备建议：广角镜头\n\n2. **景点B**\n   - 最佳时间：上午9-11点\n   - 推荐角度：侧面特写\n   - 设备建议：长焦镜头\n\n## 拍摄技巧\n\n- 使用三分法构图\n- 注意光线方向\n- 保持画面简洁\n- 多角度尝试\n\n## 设备建议\n\n- 相机：单反/微单\n- 镜头：广角+长焦\n- 配件：三脚架、滤镜`
  };

  return {
    success: true,
    photoTips
  };
}

async function outfitGuide(input, userId) {
  const { destination, days } = input;
  
  const outfitTips = {
    recommendations: [
      { day: 1, outfit: '休闲装', items: ['T恤', '牛仔裤', '运动鞋'] },
      { day: 2, outfit: '舒适装', items: ['衬衫', '长裤', '休闲鞋'] },
      { day: 3, outfit: '轻便装', items: ['T恤', '短裤', '凉鞋'] }
    ],
    content: `为您提供的${destination}${days}日游穿搭建议：\n\n## 每日穿搭\n\n### 第1天\n- **上装**：T恤 + 薄外套\n- **下装**：牛仔裤\n- **鞋子**：运动鞋\n- **配饰**：帽子、墨镜\n\n### 第2天\n- **上装**：衬衫\n- **下装**：休闲裤\n- **鞋子**：休闲鞋\n- **配饰**：围巾\n\n### 第3天\n- **上装**：薄毛衣\n- **下装**：短裤\n- **鞋子**：凉鞋\n- **配饰**：太阳镜\n\n## 穿搭建议\n\n- 根据天气调整\n- 舒适为主\n- 颜色搭配\n- 备用衣物`
  };

  return {
    success: true,
    outfitTips
  };
}

async function saveConversation(event) {
  const { userId, messages } = event;
  
  const now = new Date().toISOString();
  const conversation = {
    userId,
    messages,
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('Conversation').add(conversation);

  return {
    success: true,
    conversationId: result.id
  };
}

async function getConversation(event) {
  const { userId, conversationId } = event;
  
  let query = db.collection('Conversation').where({ userId });
  
  if (conversationId) {
    query = query.where({ _id: conversationId });
  }
  
  const result = await query.orderBy('createdAt', 'desc').limit(1).get();

  if (result.data.length === 0) {
    return {
      success: false,
      error: '对话不存在'
    };
  }

  return {
    success: true,
    conversation: result.data[0]
  };
}

async function getWeather(input) {
  const { location } = input;
  
  // 模拟天气数据
  return {
    success: true,
    weather: {
      location: location || '目的地',
      forecast: [
        { date: '2026-02-10', temperature: '25°C', condition: '晴', icon: '☀️' },
        { date: '2026-02-11', temperature: '24°C', condition: '多云', icon: '⛅' },
        { date: '2026-02-12', temperature: '23°C', condition: '小雨', icon: '🌧️' }
      ]
    }
  };
}

async function suggestTimeAdjustment(input) {
  const { currentItinerary, weatherCondition } = input;
  
  const suggestions = [
    {
      nodeId: 'node1',
      originalTime: '09:00',
      suggestedTime: '10:00',
      reason: '根据天气预报，上午9点可能有雨，建议推迟1小时',
      impact: 'low'
    },
    {
      nodeId: 'node2',
      originalTime: '14:00',
      suggestedTime: '15:00',
      reason: '下午2点阳光强烈，建议避开高温时段',
      impact: 'medium'
    }
  ];

  return {
    success: true,
    suggestions
  };
}

async function refreshNodeStatus(input) {
  const { planId, nodeId } = input;
  
  // 模拟节点状态刷新
  const nodeStatus = {
    nodeId,
    status: 'active',
    weather: {
      temperature: '25°C',
      condition: '晴',
      icon: '☀️'
    },
    crowdLevel: 'medium',
    recommendedTime: '09:00-11:00',
    tips: ['建议提前预订', '注意防晒', '保持手机畅通']
  };

  return {
    success: true,
    nodeStatus
  };
}

function getNextDay(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

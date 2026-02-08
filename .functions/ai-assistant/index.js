// @ts-ignore
const cloud = require('@cloudbase/node-sdk');

// @ts-ignore
const tcb = cloud.init({
  env: cloud.getCurrentEnv()
});

const db = tcb.database();

exports.main = async (event, context) => {
  const { action, userId, input, planId, planData, agentType } = event;
  
  console.log('AI Assistant 调用:', { action, userId, agentType });
  
  try {
    switch (action) {
      case 'generatePlan':
        return await generateTravelPlan(input, userId);
      
      case 'getWeather':
        return await getWeatherFromAI(event.date, event.location);
      
      case 'suggestTimeAdjustment':
        return await generateTimeAdjustmentSuggestion(event.activities);
      
      case 'refreshNodeStatus':
        return await refreshAllNodeStatus(event.itinerary, event.plan);
      
      case 'callAgent':
        return await callSpecificAgent(agentType, input, planData);
      
      case 'generateGuide':
        return await generateGuide(input, planData);
      
      case 'photoGuide':
        return await generatePhotoGuide(input, planData);
      
      case 'outfitGuide':
        return await generateOutfitGuide(input, planData);
      
      case 'saveConversation':
        return await saveConversation(userId, event.conversation);
      
      case 'getConversation':
        return await getConversation(userId, event.conversationId);
      
      default:
        return {
          success: false,
          error: '未知的操作类型: ' + action
        };
    }
  } catch (error) {
    console.error('AI Assistant 错误:', error);
    return {
      success: false,
      error: error.message || '处理请求时发生错误'
    };
  }
};

// 生成完整旅行计划
async function generateTravelPlan(input, userId) {
  console.log('生成旅行计划:', input);
  
  try {
    // 解析用户输入
    const { destination, days, budget, travelers, startDate, preferences } = input;
    
    if (!destination) {
      throw new Error('请提供目的地');
    }
    
    // 调用各个 AI Agent 生成计划
    const [itinerary, weather, guide, photoTips, outfitTips] = await Promise.all([
      callItineraryAgent(destination, days, preferences),
      callWeatherAgent(destination, startDate, days),
      callGuideAgent(destination, days),
      callPhotoAgent(destination),
      callOutfitAgent(destination, startDate)
    ]);
    
    // 组装完整计划
    const plan = {
      destination,
      days: days || 3,
      budget: budget || 5000,
      travelers: travelers || 1,
      startDate: startDate || new Date().toISOString().split('T')[0],
      itinerary,
      weather,
      guide,
      photoTips,
      outfitTips,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存到数据库
    const result = await db.collection('Trip').add({
      ...plan,
      userId,
      _openid: userId
    });
    
    return {
      success: true,
      planId: result.id,
      plan
    };
  } catch (error) {
    console.error('生成旅行计划失败:', error);
    throw error;
  }
}

// 调用行程规划 Agent
async function callItineraryAgent(destination, days, preferences) {
  console.log('调用行程规划 Agent:', destination, days);
  
  // 模拟 AI 生成的行程
  const itinerary = [];
  const activities = [
    { name: '参观著名景点', type: 'sightseeing', duration: 3 },
    { name: '品尝当地美食', type: 'food', duration: 2 },
    { name: '文化体验活动', type: 'culture', duration: 2 },
    { name: '购物休闲', type: 'shopping', duration: 2 },
    { name: '自然风光游览', type: 'nature', duration: 3 }
  ];
  
  for (let day = 1; day <= (days || 3); day++) {
    const dayActivities = activities.slice(0, 3 + Math.floor(Math.random() * 2)).map((act, idx) => ({
      id: `day${day}-act${idx}`,
      name: act.name,
      type: act.type,
      time: `${8 + idx * 3}:00`,
      duration: act.duration,
      location: `${destination}市中心`,
      description: `在${destination}体验${act.name}`,
      status: 'pending',
      tips: '建议提前预约'
    }));
    
    itinerary.push({
      day,
      date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activities: dayActivities,
      summary: `第${day}天：探索${destination}的精彩`
    });
  }
  
  return itinerary;
}

// 调用天气 Agent
async function callWeatherAgent(destination, startDate, days) {
  console.log('调用天气 Agent:', destination, startDate);
  
  const weather = [];
  const conditions = ['晴', '多云', '阴', '小雨', '大雨'];
  const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
  
  for (let i = 0; i < (days || 3); i++) {
    const date = new Date(startDate || Date.now());
    date.setDate(date.getDate() + i);
    
    const idx = Math.floor(Math.random() * conditions.length);
    const temp = Math.floor(Math.random() * 20) + 10;
    
    weather.push({
      date: date.toISOString().split('T')[0],
      condition: conditions[idx],
      icon: icons[idx],
      temperature: `${temp}°C`,
      high: `${temp + 5}°C`,
      low: `${temp - 5}°C`,
      tips: idx < 2 ? '适合户外活动' : '建议携带雨具'
    });
  }
  
  return weather;
}

// 调用攻略 Agent
async function callGuideAgent(destination, days) {
  console.log('调用攻略 Agent:', destination);
  
  return {
    title: `${destination}${days || 3}日游攻略`,
    overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然风光。`,
    highlights: [
      '必游景点：探索当地标志性建筑和自然景观',
      '美食体验：品尝地道特色菜肴',
      '文化沉浸：了解当地历史和传统',
      '购物推荐：购买特色纪念品'
    ],
    tips: [
      '最佳旅游时间：春秋季节',
      '交通建议：使用公共交通或租车',
      '住宿推荐：市中心或景区附近',
      '预算规划：人均每天500-1000元'
    ],
    emergency: {
      police: '110',
      hospital: '120',
      embassy: '查询当地中国大使馆联系方式'
    }
  };
}

// 调用拍照指导 Agent
async function callPhotoAgent(destination) {
  console.log('调用拍照指导 Agent:', destination);
  
  return {
    title: `${destination}拍照指南`,
    bestSpots: [
      {
        location: '市中心广场',
        time: '日出或日落时分',
        tips: '使用广角镜头，捕捉建筑全景',
        settings: '光圈 f/8, ISO 100, 快门 1/125s'
      },
      {
        location: '著名景点',
        time: '上午9-11点',
        tips: '避开人流高峰，选择独特角度',
        settings: '光圈 f/5.6, ISO 200, 快门 1/250s'
      }
    ],
    techniques: [
      '利用黄金时段拍摄，光线柔和',
      '使用三分法构图，突出主体',
      '尝试不同角度，寻找独特视角',
      '注意背景简洁，避免杂乱'
    ],
    equipment: [
      '广角镜头：拍摄风景和建筑',
      '长焦镜头：捕捉细节和远景',
      '三脚架：稳定拍摄，避免抖动',
      '偏振镜：减少反光，增强色彩'
    ]
  };
}

// 调用穿搭指导 Agent
async function callOutfitAgent(destination, startDate) {
  console.log('调用穿搭指导 Agent:', destination, startDate);
  
  const date = new Date(startDate || Date.now());
  const month = date.getMonth() + 1;
  
  let season = '春秋';
  if (month >= 6 && month <= 8) season = '夏季';
  else if (month >= 11 || month <= 2) season = '冬季';
  
  return {
    title: `${destination}${season}穿搭指南`,
    season,
    recommendations: [
      {
        type: '上装',
        items: season === '夏季' 
          ? ['透气T恤', '薄款衬衫', '防晒衣'] 
          : season === '冬季'
          ? ['保暖内衣', '毛衣', '羽绒服']
          : ['长袖衬衫', '薄外套', '针织衫']
      },
      {
        type: '下装',
        items: season === '夏季'
          ? ['短裤', '薄长裤', '裙子']
          : season === '冬季'
          ? ['保暖裤', '厚牛仔裤']
          : ['长裤', '休闲裤']
      },
      {
        type: '鞋履',
        items: ['舒适运动鞋', '凉鞋', '拖鞋']
      },
      {
        type: '配饰',
        items: ['太阳镜', '帽子', '防晒霜', '雨伞']
      }
    ],
    tips: [
      '选择透气舒适的材质',
      '准备多层穿搭，应对温差',
      '穿舒适的鞋子，便于行走',
      '携带防晒用品，保护皮肤'
    ]
  };
}

// 调用特定 Agent
async function callSpecificAgent(agentType, input, planData) {
  console.log('调用特定 Agent:', agentType);
  
  switch (agentType) {
    case 'itinerary':
      return await callItineraryAgent(input.destination, input.days, input.preferences);
    case 'weather':
      return await callWeatherAgent(input.destination, input.startDate, input.days);
    case 'guide':
      return await callGuideAgent(input.destination, input.days);
    case 'photo':
      return await callPhotoAgent(input.destination);
    case 'outfit':
      return await callOutfitAgent(input.destination, input.startDate);
    default:
      throw new Error('未知的 Agent 类型: ' + agentType);
  }
}

// 生成攻略
async function generateGuide(input, planData) {
  console.log('生成攻略:', input);
  
  const { destination, days } = planData || input;
  
  return {
    success: true,
    guide: await callGuideAgent(destination, days)
  };
}

// 生成拍照指导
async function generatePhotoGuide(input, planData) {
  console.log('生成拍照指导:', input);
  
  const { destination } = planData || input;
  
  return {
    success: true,
    photoGuide: await callPhotoAgent(destination)
  };
}

// 生成穿搭指导
async function generateOutfitGuide(input, planData) {
  console.log('生成穿搭指导:', input);
  
  const { destination, startDate } = planData || input;
  
  return {
    success: true,
    outfitGuide: await callOutfitAgent(destination, startDate)
  };
}

// 保存对话
async function saveConversation(userId, conversation) {
  console.log('保存对话:', conversation);
  
  try {
    const result = await db.collection('Conversation').add({
      userId,
      _openid: userId,
      ...conversation,
      createdAt: new Date().toISOString()
    });
    
    return {
      success: true,
      conversationId: result.id
    };
  } catch (error) {
    console.error('保存对话失败:', error);
    throw error;
  }
}

// 获取对话
async function getConversation(userId, conversationId) {
  console.log('获取对话:', conversationId);
  
  try {
    const result = await db.collection('Conversation')
      .where({
        userId,
        _openid: userId,
        _id: conversationId
      })
      .get();
    
    if (result.data.length === 0) {
      throw new Error('对话不存在');
    }
    
    return {
      success: true,
      conversation: result.data[0]
    };
  } catch (error) {
    console.error('获取对话失败:', error);
    throw error;
  }
}

// 模拟AI获取天气信息
async function getWeatherFromAI(date, location) {
  console.log('获取天气:', date, location);
  
  const weatherConditions = [
    { condition: '晴', icon: '☀️' },
    { condition: '多云', icon: '⛅' },
    { condition: '阴', icon: '☁️' },
    { condition: '小雨', icon: '🌧️' },
    { condition: '大雨', icon: '⛈️' },
    { condition: '雪', icon: '❄️' },
    { condition: '雾', icon: '🌫️' }
  ];
  
  const dateHash = date ? date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : Date.now();
  const weatherIndex = dateHash % weatherConditions.length;
  const temperature = Math.floor(Math.random() * 15) + 5;
  
  return {
    success: true,
    weather: {
      condition: weatherConditions[weatherIndex].condition,
      icon: weatherConditions[weatherIndex].icon,
      temperature: `${temperature}°C`,
      high: `${temperature + 5}°C`,
      low: `${temperature - 5}°C`,
      lastUpdated: new Date().toISOString()
    }
  };
}

// 生成时间调整建议
async function generateTimeAdjustmentSuggestion(activities) {
  console.log('生成时间调整建议:', activities);
  
  if (!activities || activities.length < 2) {
    return {
      success: true,
      suggestion: '当前行程安排合理，无需调整。'
    };
  }
  
  const suggestions = [
    '建议将第一个活动提前30分钟，避免人流高峰',
    '建议在两个活动之间增加15分钟休息时间',
    '建议将户外活动安排在上午，避开下午的高温',
    '建议预留更多时间用于交通和意外情况',
    '当前时间安排合理，可以按计划进行'
  ];
  
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  
  return {
    success: true,
    suggestion: suggestions[randomIndex]
  };
}

// 刷新所有节点状态
async function refreshAllNodeStatus(itinerary, plan) {
  console.log('刷新节点状态');
  
  const now = new Date();
  
  if (!itinerary) {
    return {
      success: true,
      updatedItinerary: []
    };
  }
  
  const updatedItinerary = itinerary.map(day => {
    const updatedActivities = (day.activities || []).map(activity => {
      const [hours, minutes] = (activity.time || '09:00').split(':').map(Number);
      const activityTime = new Date();
      activityTime.setHours(hours, minutes, 0, 0);
      
      let status = 'pending';
      
      if (now.getTime() <= activityTime.getTime()) {
        status = 'pending';
      } else {
        status = 'overdue';
      }
      
      return {
        ...activity,
        status: status,
        lastUpdated: now.toISOString()
      };
    });
    
    return {
      ...day,
      activities: updatedActivities
    };
  });
  
  return {
    success: true,
    updatedItinerary
  };
}

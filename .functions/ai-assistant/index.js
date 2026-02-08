// AI助手云函数
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();

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
  try {
    let result;
    
    switch (agentType) {
      case 'planner':
        result = await generatePlan(input, userId);
        break;
      case 'guide':
        result = await generateGuide(input, userId);
        break;
      case 'photo':
        result = await photoGuide(input, userId);
        break;
      case 'outfit':
        result = await outfitGuide(input, userId);
        break;
      default:
        return {
          success: false,
          error: '未知的AI代理类型'
        };
    }
    
    // 保存对话记录
    await saveConversation({
      userId,
      agentType,
      input,
      output: result
    });
    
    return result;
  } catch (error) {
    console.error('调用AI代理失败:', error);
    return {
      success: false,
      error: '调用AI代理失败: ' + error.message
    };
  }
}

async function generatePlan(input, userId) {
  try {
    const { destination, startDate, endDate, days, budget, travelers, preferences } = input;
    
    // 模拟AI生成的行程
    const itinerary = {
      title: `${destination} ${days}日游`,
      destination,
      startDate,
      endDate,
      days: [],
      budget: budget || '中等',
      travelers: travelers || 1,
      preferences: preferences || [],
      createdAt: new Date().toISOString()
    };
    
    // 生成每日行程
    for (let i = 1; i <= days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i - 1);
      
      itinerary.days.push({
        day: i,
        date: currentDate.toISOString().split('T')[0],
        theme: getDayTheme(i, destination),
        activities: generateActivities(destination, i, preferences),
        meals: generateMeals(preferences),
        accommodation: i === 1 ? generateAccommodation(destination, budget) : null,
        transportation: generateTransportation(i, days)
      });
    }
    
    return {
      success: true,
      data: itinerary
    };
  } catch (error) {
    console.error('生成行程失败:', error);
    return {
      success: false,
      error: '生成行程失败: ' + error.message
    };
  }
}

async function generateGuide(input, userId) {
  try {
    const { destination, preferences } = input;
    
    // 模拟AI生成的攻略
    const guide = {
      destination,
      overview: `${destination}是一座充满魅力的城市，拥有丰富的历史文化和自然景观。`,
      bestTimeToVisit: getBestTimeToVisit(destination),
      mustSeeAttractions: generateAttractions(destination),
      localCuisine: generateLocalCuisine(destination),
      transportation: generateTransportationGuide(destination),
      tips: generateTravelTips(destination, preferences),
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: guide
    };
  } catch (error) {
    console.error('生成攻略失败:', error);
    return {
      success: false,
      error: '生成攻略失败: ' + error.message
    };
  }
}

async function photoGuide(input, userId) {
  try {
    const { destination, preferences } = input;
    
    // 模拟AI生成的拍照指南
    const photoGuide = {
      destination,
      bestPhotoSpots: generatePhotoSpots(destination),
      photographyTips: generatePhotoTips(preferences),
      bestTimes: generateBestPhotoTimes(destination),
      equipment: generateEquipmentSuggestions(preferences),
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: photoGuide
    };
  } catch (error) {
    console.error('生成拍照指南失败:', error);
    return {
      success: false,
      error: '生成拍照指南失败: ' + error.message
    };
  }
}

async function outfitGuide(input, userId) {
  try {
    const { destination, date, preferences } = input;
    
    // 模拟AI生成的穿搭建议
    const outfitGuide = {
      destination,
      date,
      weather: generateWeatherInfo(destination, date),
      outfitSuggestions: generateOutfitSuggestions(destination, date, preferences),
      packingList: generatePackingList(destination, date, preferences),
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: outfitGuide
    };
  } catch (error) {
    console.error('生成穿搭指南失败:', error);
    return {
      success: false,
      error: '生成穿搭指南失败: ' + error.message
    };
  }
}

async function saveConversation(event) {
  try {
    const { userId, agentType, input, output } = event;
    
    const result = await db.collection('Conversation').add({
      userId: userId || 'anonymous',
      agentType,
      input,
      output,
      createdAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: { conversationId: result.id }
    };
  } catch (error) {
    console.error('保存对话失败:', error);
    return {
      success: false,
      error: '保存对话失败: ' + error.message
    };
  }
}

async function getConversation(event) {
  try {
    const { userId, limit = 10 } = event;
    
    const result = await db.collection('Conversation')
      .where({
        userId: userId || 'anonymous'
      })
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    return {
      success: true,
      data: result.data || []
    };
  } catch (error) {
    console.error('获取对话失败:', error);
    return {
      success: false,
      error: '获取对话失败: ' + error.message
    };
  }
}

async function getWeather(input) {
  try {
    const { destination, date } = input;
    
    // 模拟天气数据
    const weather = {
      destination,
      date,
      temperature: Math.floor(Math.random() * 20) + 10,
      condition: ['晴天', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 10) + 5,
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: weather
    };
  } catch (error) {
    console.error('获取天气失败:', error);
    return {
      success: false,
      error: '获取天气失败: ' + error.message
    };
  }
}

async function suggestTimeAdjustment(input) {
  try {
    const { currentPlan, weatherData } = input;
    
    // 模拟时间调整建议
    const suggestions = {
      currentPlan,
      weatherData,
      adjustments: [
        '建议将户外活动安排在上午10点前',
        '下午2-4点阳光较强，建议室内活动',
        '傍晚时分适合拍照和散步'
      ],
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: suggestions
    };
  } catch (error) {
    console.error('生成时间调整建议失败:', error);
    return {
      success: false,
      error: '生成时间调整建议失败: ' + error.message
    };
  }
}

async function refreshNodeStatus(input) {
  try {
    const { nodeId, status } = input;
    
    // 模拟节点状态刷新
    const result = await db.collection('Itinerary').doc(nodeId).update({
      status: status || 'completed',
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: { nodeId, status }
    };
  } catch (error) {
    console.error('刷新节点状态失败:', error);
    return {
      success: false,
      error: '刷新节点状态失败: ' + error.message
    };
  }
}

// 辅助函数
function getDayTheme(day, destination) {
  const themes = ['城市探索', '文化体验', '自然风光', '美食之旅', '购物休闲'];
  return themes[day % themes.length];
}

function generateActivities(destination, day, preferences) {
  const activities = [];
  const activityTypes = ['景点参观', '文化体验', '美食品尝', '购物', '休闲活动'];
  
  for (let i = 0; i < 3; i++) {
    activities.push({
      time: `${9 + i * 3}:00`,
      name: `${destination} ${activityTypes[i]}`,
      description: `在${destination}体验${activityTypes[i]}`,
      duration: '2-3小时',
      cost: Math.floor(Math.random() * 200) + 50
    });
  }
  
  return activities;
}

function generateMeals(preferences) {
  return [
    { meal: '早餐', suggestion: '当地特色早餐', cost: 20 },
    { meal: '午餐', suggestion: '推荐餐厅', cost: 80 },
    { meal: '晚餐', suggestion: '特色晚餐', cost: 100 }
  ];
}

function generateAccommodation(destination, budget) {
  const accommodations = {
    '经济': '青年旅社或经济型酒店',
    '中等': '舒适型酒店或民宿',
    '豪华': '五星级酒店或精品酒店'
  };
  
  return accommodations[budget] || accommodations['中等'];
}

function generateTransportation(day, totalDays) {
  if (day === 1) return '机场/车站接送';
  if (day === totalDays) return '返程交通';
  return '市内交通';
}

function getBestTimeToVisit(destination) {
  return '春季和秋季是最佳旅游时间，气候宜人，适合户外活动。';
}

function generateAttractions(destination) {
  return [
    { name: `${destination}著名景点`, description: '必游景点' },
    { name: `${destination}历史古迹`, description: '文化体验' },
    { name: `${destination}自然风光`, description: '自然美景' }
  ];
}

function generateLocalCuisine(destination) {
  return [
    { name: `${destination}特色菜`, description: '当地必尝美食' },
    { name: `${destination}小吃`, description: '街头美食' },
    { name: `${destination}甜品`, description: '特色甜品' }
  ];
}

function generateTransportationGuide(destination) {
  return {
    local: '市内交通便利，可选择地铁、公交或出租车',
    intercity: '城际交通发达，高铁和长途汽车都很方便',
    tips: '建议使用公共交通，环保且经济'
  };
}

function generateTravelTips(destination, preferences) {
  return [
    '提前预订住宿和门票',
    '关注当地天气预报',
    '准备常用药品',
    '保管好个人财物'
  ];
}

function generatePhotoSpots(destination) {
  return [
    { name: `${destination}观景台`, bestTime: '日出或日落时分' },
    { name: `${destination}老街`, bestTime: '下午光线柔和时' },
    { name: `${destination}公园`, bestTime: '上午或傍晚' }
  ];
}

function generatePhotoTips(preferences) {
  return [
    '使用三分法构图',
    '注意光线方向',
    '寻找独特视角',
    '捕捉当地人文特色'
  ];
}

function generateBestPhotoTimes(destination) {
  return {
    goldenHour: '日出后和日落前一小时',
    blueHour: '日出前和日落后',
    midday: '避免正午强光，选择阴影处'
  };
}

function generateEquipmentSuggestions(preferences) {
  return {
    camera: '建议携带单反或微单相机',
    lens: '广角镜头适合风景，长焦镜头适合特写',
    accessories: '三脚架、滤镜、备用电池'
  };
}

function generateWeatherInfo(destination, date) {
  return {
    temperature: Math.floor(Math.random() * 20) + 10,
    condition: ['晴天', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 40) + 40
  };
}

function generateOutfitSuggestions(destination, date, preferences) {
  return [
    { item: '上衣', suggestion: '根据天气选择合适的上衣' },
    { item: '下装', suggestion: '舒适的裤子或裙子' },
    { item: '鞋子', suggestion: '舒适的步行鞋' },
    { item: '配饰', suggestion: '帽子、太阳镜等' }
  ];
}

function generatePackingList(destination, date, preferences) {
  return [
    '身份证/护照',
    '手机和充电器',
    '常用药品',
    '防晒用品',
    '雨具'
  ];
}
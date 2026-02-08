// @ts-ignore
const cloud = require('@cloudbase/node-sdk');

// @ts-ignore
const tcb = cloud.init({
  env: cloud.getCurrentEnv()
});

exports.main = async (event, context) => {
  const { action, date, location, itinerary, plan, userInput, conversationId } = event;
  
  if (action === 'getWeather') {
    try {
      // 模拟AI获取天气信息
      // 在实际应用中，这里可以调用真实的天气API或AI服务
      const weatherData = await getWeatherFromAI(date, location);
      
      return {
        success: true,
        weather: weatherData
      };
    } catch (error) {
      console.error('获取天气失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'suggestTimeAdjustment') {
    try {
      const { dayId, activities } = event;
      const suggestion = await generateTimeAdjustmentSuggestion(activities);
      
      return {
        success: true,
        suggestion: suggestion
      };
    } catch (error) {
      console.error('生成时间调整建议失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'refreshNodeStatus') {
    try {
      const updatedItinerary = await refreshAllNodeStatus(itinerary, plan);
      
      return {
        success: true,
        updatedItinerary: updatedItinerary
      };
    } catch (error) {
      console.error('刷新节点状态失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'generateCompletePlan') {
    try {
      const result = await generateCompleteTravelPlan(userInput, conversationId);
      
      return {
        success: true,
        plan: result
      };
    } catch (error) {
      console.error('生成完整计划失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'generateGuide') {
    try {
      const { destination, days } = event;
      const guide = await generateTravelGuide(destination, days);
      
      return {
        success: true,
        guide: guide
      };
    } catch (error) {
      console.error('生成攻略失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'generatePhotoGuide') {
    try {
      const { destination, spots } = event;
      const photoGuide = await generatePhotoGuide(destination, spots);
      
      return {
        success: true,
        photoGuide: photoGuide
      };
    } catch (error) {
      console.error('生成拍照指导失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'generateOutfitGuide') {
    try {
      const { destination, weather, days } = event;
      const outfitGuide = await generateOutfitGuide(destination, weather, days);
      
      return {
        success: true,
        outfitGuide: outfitGuide
      };
    } catch (error) {
      console.error('生成穿搭指导失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  return {
    success: false,
    error: '未知的操作类型'
  };
};

// 模拟AI获取天气信息
async function getWeatherFromAI(date, location) {
  // 模拟天气数据
  const weatherConditions = [
    { condition: '晴', icon: '☀️' },
    { condition: '多云', icon: '⛅' },
    { condition: '阴', icon: '☁️' },
    { condition: '小雨', icon: '🌧️' },
    { condition: '大雨', icon: '⛈️' },
    { condition: '雪', icon: '❄️' },
    { condition: '雾', icon: '🌫️' }
  ];
  
  // 根据日期生成伪随机天气
  const dateHash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const weatherIndex = dateHash % weatherConditions.length;
  const temperature = Math.floor(Math.random() * 15) + 5; // 5-20度
  
  return {
    condition: weatherConditions[weatherIndex].condition,
    icon: weatherConditions[weatherIndex].icon,
    temperature: `${temperature}°C`,
    lastUpdated: new Date().toISOString()
  };
}

// 生成时间调整建议
async function generateTimeAdjustmentSuggestion(activities) {
  // 简单的建议生成逻辑
  if (activities.length < 2) {
    return '当前行程安排合理，无需调整。';
  }
  
  const suggestions = [
    '建议将第一个活动提前30分钟，避免人流高峰',
    '建议在两个活动之间增加15分钟休息时间',
    '建议将户外活动安排在上午，避开下午的高温',
    '建议预留更多时间用于交通和意外情况',
    '当前时间安排合理，可以按计划进行'
  ];
  
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
}

// 刷新所有节点状态
async function refreshAllNodeStatus(itinerary, plan) {
  const now = new Date();
  
  // 为每一天的每个活动更新状态
  return itinerary.map(day => {
    const updatedActivities = day.activities.map(activity => {
      const [hours, minutes] = (activity.time || '09:00').split(':').map(Number);
      const activityTime = new Date();
      activityTime.setHours(hours, minutes, 0, 0);
      
      // 判断状态
      let status = 'pending';
      
      if (now.getTime() <= activityTime.getTime()) {
        // 还没开始：当前时间还没到活动时间
        status = 'pending';
      } else {
        // 已经过了时间，标记为过期（AI无法获取用户位置，所以默认为过期）
        // 在实际应用中，可以结合用户位置信息来判断是否已完成
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
}

// 模拟节点状态数据（用于测试）
function getMockNodeStatus() {
  const now = new Date();
  const mockStatuses = ['pending', 'overdue', 'completed'];
  
  return {
    status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
    lastUpdated: now.toISOString()
  };
}

// AI Agent 1: 生成完整旅行计划
async function generateCompleteTravelPlan(userInput, conversationId) {
  // 解析用户输入，提取目的地、天数、预算等信息
  const destination = extractDestination(userInput);
  const days = extractDays(userInput);
  const budget = extractBudget(userInput);
  
  // 调用各个AI Agent生成计划
  const itinerary = await generateItineraryAgent(destination, days);
  const guide = await generateTravelGuideAgent(destination, days);
  const weather = await getWeatherForDays(destination, days);
  const photoGuide = await generatePhotoGuideAgent(destination, itinerary);
  const outfitGuide = await generateOutfitGuideAgent(destination, weather);
  
  // 组装完整的旅行计划
  const completePlan = {
    destination: destination,
    days: days,
    budget: budget,
    itinerary: itinerary,
    guide: guide,
    weather: weather,
    photoGuide: photoGuide,
    outfitGuide: outfitGuide,
    createdAt: new Date().toISOString()
  };
  
  return completePlan;
}

// AI Agent 2: 生成行程规划
async function generateItineraryAgent(destination, days) {
  const itinerary = [];
  
  for (let i = 1; i <= days; i++) {
    const dayItinerary = {
      day: i,
      title: `第${i}天 - ${getDayTitle(destination, i)}`,
      date: getFutureDate(i),
      activities: await generateActivitiesForDay(destination, i),
      completed: false
    };
    itinerary.push(dayItinerary);
  }
  
  return itinerary;
}

// AI Agent 3: 生成旅行攻略
async function generateTravelGuideAgent(destination, days) {
  const guide = {
    destination: destination,
    overview: `关于${destination}的旅行攻略`,
    highlights: await generateHighlights(destination),
    transportation: await generateTransportationInfo(destination),
    accommodation: await generateAccommodationInfo(destination),
    food: await generateFoodRecommendations(destination),
    tips: await generateTravelTips(destination),
    budget: await generateBudgetEstimate(destination, days)
  };
  
  return guide;
}

// AI Agent 4: 生成拍照指导
async function generatePhotoGuideAgent(destination, itinerary) {
  const photoGuide = {
    destination: destination,
    tips: await generatePhotoTips(destination),
    spots: await generatePhotoSpots(itinerary),
    equipment: await generatePhotoEquipment(destination),
    bestTimes: await generateBestPhotoTimes(destination)
  };
  
  return photoGuide;
}

// AI Agent 5: 生成穿搭指导
async function generateOutfitGuideAgent(destination, weather) {
  const outfitGuide = {
    destination: destination,
    weather: weather,
    dailyOutfits: await generateDailyOutfits(destination, weather),
    essentials: await generateEssentialItems(destination),
    tips: await generateOutfitTips(destination)
  };
  
  return outfitGuide;
}

// 辅助函数：提取目的地
function extractDestination(userInput) {
  const destinations = ['东京', '巴黎', '大理', '京都', '首尔', '曼谷', '新加坡'];
  for (const dest of destinations) {
    if (userInput.includes(dest)) {
      return dest;
    }
  }
  return '东京'; // 默认目的地
}

// 辅助函数：提取天数
function extractDays(userInput) {
  const match = userInput.match(/(\d+)天/);
  return match ? parseInt(match[1]) : 5; // 默认5天
}

// 辅助函数：提取预算
function extractBudget(userInput) {
  const match = userInput.match(/(\d+)元/);
  return match ? parseInt(match[1]) : 10000; // 默认1万元
}

// 辅助函数：获取每日标题
function getDayTitle(destination, day) {
  const titles = {
    '东京': ['抵达东京', '浅草寺与晴空塔', '秋叶原动漫之旅', '富士山一日游', '购物与返程'],
    '巴黎': ['抵达巴黎', '埃菲尔铁塔与卢浮宫', '凡尔赛宫', '塞纳河游船', '购物与返程'],
    '大理': ['抵达大理', '洱海骑行', '苍山徒步', '古镇探索', '返程'],
    '京都': ['抵达京都', '清水寺与祇园', '岚山竹林', '金阁寺', '返程']
  };
  
  const cityTitles = titles[destination] || ['探索之旅', '文化体验', '自然风光', '美食之旅', '返程'];
  return cityTitles[day - 1] || '自由活动';
}

// 辅助函数：生成每日活动
async function generateActivitiesForDay(destination, day) {
  const activities = {
    '东京': [
      [{ time: '10:00', name: '成田机场接机', destination: '成田国际机场' },
       { time: '12:00', name: '酒店入住', destination: '新宿王子酒店' },
       { time: '14:00', name: '新宿初探', destination: '新宿站' }],
      [{ time: '09:00', name: '浅草寺参拜', destination: '浅草寺' },
       { time: '11:00', name: '晴空塔观景', destination: '东京晴空塔' },
       { time: '14:00', name: '仲见世商店街', destination: '仲见世商店街' }],
      [{ time: '10:00', name: '秋叶原电器街', destination: '秋叶原' },
       { time: '12:00', name: '女仆咖啡厅', destination: '秋叶原女仆咖啡厅' },
       { time: '15:00', name: '动漫周边购物', destination: '秋叶原电器街' }],
      [{ time: '08:00', name: '富士山一日游', destination: '富士山' },
       { time: '12:00', name: '河口湖午餐', destination: '河口湖' },
       { time: '16:00', name: '返回东京', destination: '新宿站' }],
      [{ time: '10:00', name: '银座购物', destination: '银座' },
       { time: '14:00', name: '机场返程', destination: '成田国际机场' }]
    ],
    '巴黎': [
      [{ time: '14:00', name: '抵达巴黎', destination: '戴高乐机场' },
       { time: '16:00', name: '酒店入住', destination: '巴黎酒店' },
       { time: '18:00', name: '塞纳河漫步', destination: '塞纳河畔' }],
      [{ time: '09:00', name: '埃菲尔铁塔', destination: '埃菲尔铁塔' },
       { time: '14:00', name: '卢浮宫', destination: '卢浮宫' },
       { time: '18:00', name: '香榭丽舍大街', destination: '香榭丽舍大街' }],
      [{ time: '09:00', name: '凡尔赛宫', destination: '凡尔赛宫' },
       { time: '14:00', name: '凡尔赛花园', destination: '凡尔赛花园' }],
      [{ time: '10:00', name: '塞纳河游船', destination: '塞纳河' },
       { time: '14:00', name: '蒙马特高地', destination: '蒙马特高地' }],
      [{ time: '10:00', name: '老佛爷购物', destination: '老佛爷百货' },
       { time: '14:00', name: '机场返程', destination: '戴高乐机场' }]
    ],
    '大理': [
      [{ time: '14:00', name: '抵达大理', destination: '大理机场' },
       { time: '16:00', name: '古城入住', destination: '大理古城' },
       { time: '18:00', name: '古城漫步', destination: '大理古城' }],
      [{ time: '08:00', name: '洱海骑行', destination: '洱海' },
       { time: '12:00', name: '喜洲古镇', destination: '喜洲古镇' },
       { time: '16:00', name: '双廊古镇', destination: '双廊古镇' }],
      [{ time: '08:00', name: '苍山徒步', destination: '苍山' },
       { time: '14:00', name: '三塔寺', destination: '崇圣寺三塔' }],
      [{ time: '10:00', name: '沙溪古镇', destination: '沙溪古镇' },
       { time: '14:00', name: '白族文化体验', destination: '白族村寨' }],
      [{ time: '10:00', name: '古城购物', destination: '大理古城' },
       { time: '14:00', name: '机场返程', destination: '大理机场' }]
    ]
  };
  
  const cityActivities = activities[destination] || activities['东京'];
  return cityActivities[day - 1] || [{ time: '10:00', name: '自由活动', destination: '市中心' }];
}

// 辅助函数：获取未来日期
function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// 辅助函数：生成景点亮点
async function generateHighlights(destination) {
  const highlights = {
    '东京': ['浅草寺', '东京晴空塔', '秋叶原', '富士山', '银座'],
    '巴黎': ['埃菲尔铁塔', '卢浮宫', '凡尔赛宫', '塞纳河', '蒙马特'],
    '大理': ['洱海', '苍山', '大理古城', '崇圣寺三塔', '双廊古镇']
  };
  
  return highlights[destination] || ['著名景点1', '著名景点2', '著名景点3'];
}

// 辅助函数：生成交通信息
async function generateTransportationInfo(destination) {
  return {
    airport: `${destination}国际机场`,
    localTransport: '地铁、公交、出租车',
    tips: '建议购买交通卡，方便出行'
  };
}

// 辅助函数：生成住宿信息
async function generateAccommodationInfo(destination) {
  return {
    recommendedAreas: ['市中心', '交通便利区域'],
    budgetOptions: '经济型酒店、民宿、青年旅社',
    tips: '建议提前预订，选择靠近地铁站的住宿'
  };
}

// 辅助函数：生成美食推荐
async function generateFoodRecommendations(destination) {
  const foods = {
    '东京': ['寿司', '拉面', '天妇罗', '和牛', '抹茶甜点'],
    '巴黎': ['法式可颂', '马卡龙', '法式洋葱汤', '鹅肝', '红酒'],
    '大理': ['破酥粑粑', '乳扇', '饵丝', '白族三道茶', '洱海鱼']
  };
  
  return foods[destination] || ['当地特色美食1', '当地特色美食2', '当地特色美食3'];
}

// 辅助函数：生成旅行贴士
async function generateTravelTips(destination) {
  return [
    '提前了解当地文化和习俗',
    '准备必要的证件和现金',
    '下载离线地图和翻译软件',
    '注意安全，保管好贵重物品',
    '尊重当地环境和居民'
  ];
}

// 辅助函数：生成预算估算
async function generateBudgetEstimate(destination, days) {
  const dailyBudget = {
    '东京': 2000,
    '巴黎': 3000,
    '大理': 500
  };
  
  const budget = dailyBudget[destination] || 1500;
  return {
    total: budget * days,
    daily: budget,
    breakdown: {
      accommodation: budget * 0.4,
      food: budget * 0.3,
      transport: budget * 0.2,
      activities: budget * 0.1
    }
  };
}

// 辅助函数：生成拍照贴士
async function generatePhotoTips(destination) {
  return [
    '黄金时段（日出日落）光线最佳',
    '使用三脚架保证画面稳定',
    '注意构图，运用三分法则',
    '多拍几张，选择最佳角度',
    '尊重当地规定，禁止使用闪光灯的地方不要使用'
  ];
}

// 辅助函数：生成拍照地点
async function generatePhotoSpots(itinerary) {
  const spots = [];
  itinerary.forEach(day => {
    day.activities.forEach(activity => {
      spots.push({
        name: activity.destination,
        bestTime: '上午或傍晚',
        tips: '建议使用广角镜头'
      });
    });
  });
  return spots;
}

// 辅助函数：生成拍照设备
async function generatePhotoEquipment(destination) {
  return [
    '相机（单反或微单）',
    '广角镜头（适合风景）',
    '长焦镜头（适合人像）',
    '三脚架',
    '备用电池和存储卡'
  ];
}

// 辅助函数：生成最佳拍照时间
async function generateBestPhotoTimes(destination) {
  return {
    sunrise: '6:00-7:00',
    sunset: '17:00-18:00',
    goldenHour: '日出后1小时和日落前1小时'
  };
}

// 辅助函数：生成每日穿搭
async function generateDailyOutfits(destination, weather) {
  const outfits = [];
  for (let i = 1; i <= 5; i++) {
    outfits.push({
      day: i,
      morning: '舒适休闲装',
      afternoon: '轻便运动装',
      evening: '保暖外套'
    });
  }
  return outfits;
}

// 辅助函数：生成必备物品
async function generateEssentialItems(destination) {
  return [
    '身份证/护照',
    '手机和充电器',
    '舒适的鞋子',
    '防晒用品',
    '常用药品',
    '雨具'
  ];
}

// 辅助函数：生成穿搭贴士
async function generateOutfitTips(destination) {
  return [
    '根据天气变化调整穿搭',
    '选择舒适的鞋子，方便行走',
    '准备防晒用品，保护皮肤',
    '带一件薄外套，应对温差',
    '尊重当地文化，选择得体的服装'
  ];
}

// 辅助函数：获取多日天气
async function getWeatherForDays(destination, days) {
  const weather = [];
  for (let i = 1; i <= days; i++) {
    const date = getFutureDate(i);
    const dayWeather = await getWeatherFromAI(date, destination);
    weather.push({
      date: date,
      ...dayWeather
    });
  }
  return weather;
}

// 生成旅行攻略（供页面调用）
async function generateTravelGuide(destination, days) {
  return await generateTravelGuideAgent(destination, days);
}

// 生成拍照指导（供页面调用）
async function generatePhotoGuide(destination, spots) {
  return await generatePhotoGuideAgent(destination, spots);
}

// 生成穿搭指导（供页面调用）
async function generateOutfitGuide(destination, weather, days) {
  return await generateOutfitGuideAgent(destination, weather);
}
// AI旅行计划生成云函数
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();

exports.main = async (event, context) => {
  const { action, input, userId } = event;

  try {
    switch (action) {
      case 'generate':
        return await generatePlan(input, userId);
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

async function generatePlan(input, userId) {
  try {
    const { destination, startDate, endDate, days, budget, travelers, preferences } = input;
    
    // 生成完整的旅行计划
    const plan = {
      title: `${destination} ${days}日游`,
      destination,
      startDate,
      endDate,
      days: days,
      budget: budget || '中等',
      travelers: travelers || 1,
      preferences: preferences || [],
      itinerary: generateItinerary(destination, startDate, days, preferences),
      weather: generateWeatherForecast(destination, startDate, days),
      guide: generateTravelGuide(destination, preferences),
      photoSpots: generatePhotoSpots(destination),
      outfitSuggestions: generateOutfitSuggestions(destination, startDate, preferences),
      createdAt: new Date().toISOString(),
      userId: userId || 'anonymous'
    };
    
    return {
      success: true,
      data: plan
    };
  } catch (error) {
    console.error('生成计划失败:', error);
    return {
      success: false,
      error: '生成计划失败: ' + error.message
    };
  }
}

function generateItinerary(destination, startDate, days, preferences) {
  const itinerary = {
    title: `${destination}行程安排`,
    days: []
  };
  
  for (let i = 1; i <= days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i - 1);
    
    const dayPlan = {
      day: i,
      date: currentDate.toISOString().split('T')[0],
      theme: getDayTheme(i, destination),
      activities: generateDailyActivities(destination, i, preferences),
      meals: generateDailyMeals(preferences),
      accommodation: i === 1 ? generateAccommodationInfo(destination) : null,
      transportation: generateTransportationInfo(i, days),
      tips: generateDailyTips(destination, i)
    };
    
    itinerary.days.push(dayPlan);
  }
  
  return itinerary;
}

function generateWeatherForecast(destination, startDate, days) {
  const forecast = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: ['晴天', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 8) + 3,
      uvIndex: Math.floor(Math.random() * 8) + 1
    });
  }
  
  return {
    destination,
    forecast,
    bestTimeToVisit: '春季和秋季气候宜人，是最佳旅游时间',
    packingTips: generatePackingTips(forecast)
  };
}

function generateTravelGuide(destination, preferences) {
  return {
    destination,
    overview: `${destination}是一座充满魅力的城市，拥有丰富的历史文化和自然景观。`,
    bestTimeToVisit: getBestTimeToVisit(destination),
    mustSeeAttractions: generateMustSeeAttractions(destination),
    localCuisine: generateLocalCuisineRecommendations(destination),
    transportation: generateTransportationGuide(destination),
    culturalTips: generateCulturalTips(destination),
    safetyTips: generateSafetyTips(destination),
    budgetTips: generateBudgetTips(preferences),
    createdAt: new Date().toISOString()
  };
}

function generatePhotoSpots(destination) {
  return {
    destination,
    bestSpots: [
      {
        name: `${destination}观景台`,
        description: '俯瞰全城的最佳位置',
        bestTime: '日出或日落时分',
        photoTips: '使用广角镜头，注意构图平衡'
      },
      {
        name: `${destination}历史街区`,
        description: '充满历史韵味的街道',
        bestTime: '下午光线柔和时',
        photoTips: '捕捉人文气息，注意光影对比'
      },
      {
        name: `${destination}自然公园`,
        description: '自然风光优美',
        bestTime: '上午或傍晚',
        photoTips: '利用自然光线，突出层次感'
      }
    ],
    generalTips: [
      '黄金时段（日出后和日落前）是最佳拍摄时间',
      '注意构图的三分法则',
      '寻找独特的拍摄角度',
      '捕捉当地的人文特色'
    ]
  };
}

function generateOutfitSuggestions(destination, startDate, preferences) {
  const weather = generateWeatherForecast(destination, startDate, 1).forecast[0];
  
  return {
    destination,
    weather,
    dailyOutfits: [
      {
        day: 1,
        outfit: generateDailyOutfit(weather, preferences),
        accessories: generateAccessories(weather, preferences),
        tips: '根据天气情况选择合适的服装'
      }
    ],
    packingList: generateCompletePackingList(destination, preferences),
    shoppingTips: generateShoppingTips(destination)
  };
}

// 辅助函数
function getDayTheme(day, destination) {
  const themes = ['城市探索', '文化体验', '自然风光', '美食之旅', '购物休闲', '历史古迹'];
  return themes[day % themes.length];
}

function generateDailyActivities(destination, day, preferences) {
  const activities = [];
  const timeSlots = ['09:00', '11:00', '14:00', '16:00', '19:00'];
  
  timeSlots.forEach((time, index) => {
    activities.push({
      time,
      name: `${destination} ${getActivityType(index)}`,
      description: `体验${destination}的${getActivityType(index)}`,
      duration: index === 2 ? '2小时' : '1.5小时',
      cost: Math.floor(Math.random() * 150) + 50,
      tips: getActivityTips(index)
    });
  });
  
  return activities;
}

function generateDailyMeals(preferences) {
  return [
    {
      meal: '早餐',
      time: '08:00',
      suggestion: '当地特色早餐',
      restaurant: '推荐当地人气早餐店',
      cost: 25,
      cuisine: '本地特色'
    },
    {
      meal: '午餐',
      time: '12:30',
      suggestion: '推荐餐厅',
      restaurant: '当地知名餐厅',
      cost: 80,
      cuisine: '地方菜系'
    },
    {
      meal: '晚餐',
      time: '18:30',
      suggestion: '特色晚餐',
      restaurant: '特色餐厅',
      cost: 120,
      cuisine: '精致料理'
    }
  ];
}

function generateAccommodationInfo(destination) {
  return {
    name: `${destination}推荐酒店`,
    type: '舒适型酒店',
    rating: 4.5,
    price: 300,
    amenities: ['免费WiFi', '早餐', '健身房', '停车场'],
    location: '市中心，交通便利',
    tips: '建议提前预订，选择评价好的酒店'
  };
}

function generateTransportationInfo(day, totalDays) {
  if (day === 1) {
    return {
      type: '机场/车站接送',
      details: '建议预订接送服务或使用网约车',
      cost: 100,
      tips: '提前确认接送时间和地点'
    };
  }
  
  return {
    type: '市内交通',
    details: '地铁、公交、出租车或网约车',
    cost: 50,
    tips: '购买交通卡更经济实惠'
  };
}

function generateDailyTips(destination, day) {
  return [
    '提前查看景点开放时间',
    '准备充足的现金和移动支付',
    '注意个人财物安全',
    '保持手机电量充足',
    '尊重当地文化和习俗'
  ];
}

function getActivityType(index) {
  const types = ['景点参观', '文化体验', '美食品尝', '购物探索', '休闲时光'];
  return types[index] || '自由活动';
}

function getActivityTips(index) {
  const tips = [
    '建议提前预订门票',
    '穿舒适的鞋子',
    '注意防晒和补水',
    '留出充足的休息时间',
    '享受当地夜生活'
  ];
  return tips[index] || '注意安全';
}

function generatePackingTips(forecast) {
  const conditions = forecast.map(f => f.condition);
  const hasRain = conditions.includes('小雨');
  const avgTemp = forecast.reduce((sum, f) => sum + f.temperature, 0) / forecast.length;
  
  const tips = [];
  
  if (hasRain) {
    tips.push('准备雨具（雨伞或雨衣）');
  }
  
  if (avgTemp < 15) {
    tips.push('准备保暖衣物');
  } else if (avgTemp > 25) {
    tips.push('准备防晒用品和轻薄衣物');
  } else {
    tips.push('准备适合温暖天气的衣物');
  }
  
  tips.push('准备常用药品', '携带充电宝', '准备舒适的步行鞋');
  
  return tips;
}

function getBestTimeToVisit(destination) {
  return {
    season: '春季（3-5月）和秋季（9-11月）',
    reason: '气候宜人，适合户外活动，游客相对较少',
    temperature: '15-25°C',
    tips: '避开节假日高峰期，享受更好的旅游体验'
  };
}

function generateMustSeeAttractions(destination) {
  return [
    {
      name: `${destination}必游景点`,
      type: '历史文化',
      description: '了解当地历史文化的最佳去处',
      duration: '2-3小时',
      ticketPrice: 80,
      tips: '建议提前网上购票，避开高峰时段'
    },
    {
      name: `${destination}自然风光`,
      type: '自然景观',
      description: '欣赏自然美景，放松身心',
      duration: '半天',
      ticketPrice: 50,
      tips: '选择天气好的时候前往，拍照效果更佳'
    },
    {
      name: `${destination}特色街区`,
      type: '文化体验',
      description: '感受当地生活气息和文化特色',
      duration: '2小时',
      ticketPrice: 0,
      tips: '适合慢慢逛，体验当地文化'
    }
  ];
}

function generateLocalCuisineRecommendations(destination) {
  return [
    {
      name: `${destination}特色菜`,
      description: '当地最具代表性的传统菜肴',
      recommendedRestaurants: ['老字号餐厅', '当地人推荐的小店'],
      avgPrice: 100,
      bestTime: '午餐或晚餐时间'
    },
    {
      name: `${destination}小吃`,
      description: '街头巷尾的美味小吃',
      recommendedRestaurants: ['夜市', '小吃街', '当地人常去的小店'],
      avgPrice: 30,
      bestTime: '下午茶时间或夜宵'
    },
    {
      name: `${destination}特色饮品`,
      description: '当地特色饮品和茶文化',
      recommendedRestaurants: ['传统茶馆', '特色饮品店'],
      avgPrice: 25,
      bestTime: '任何时间'
    }
  ];
}

function generateTransportationGuide(destination) {
  return {
    local: {
      subway: '地铁是最便捷的交通方式，覆盖主要景点',
      bus: '公交线路完善，经济实惠',
      taxi: '出租车方便，但费用较高',
      walking: '市中心区域适合步行游览'
    },
    intercity: {
      train: '高铁和火车连接周边城市',
      bus: '长途汽车站有发往各地的班车',
      flight: '机场有直飞主要城市的航班'
    },
    tips: [
      '建议办理当地交通卡，享受优惠',
      '避开早晚高峰时段出行',
      '使用导航软件规划最佳路线',
      '注意交通安全，遵守交通规则'
    ]
  };
}

function generateCulturalTips(destination) {
  return [
    '尊重当地的风俗习惯和宗教信仰',
    '进入宗教场所要注意着装和行为规范',
    '与当地人交流时要礼貌友好',
    '拍照前询问是否可以拍摄',
    '遵守当地的法律法规'
  ];
}

function generateSafetyTips(destination) {
  return [
    '保管好个人财物，特别是证件和现金',
    '避免在人多拥挤的地方显露贵重物品',
    '选择正规的住宿和交通服务',
    '保持与家人的联系，告知行程安排',
    '购买旅游保险，以备不时之需'
  ];
}

function generateBudgetTips(preferences) {
  return {
    accommodation: '提前预订可以享受更好的价格',
    meals: '尝试当地小吃既经济又能体验特色',
    transportation: '使用公共交通可以节省费用',
    attractions: '关注景点优惠信息和套票',
    shopping: '理性消费，避免冲动购物'
  };
}

function generateCompletePackingList(destination, preferences) {
  return {
    essentials: [
      '身份证/护照',
      '手机和充电器',
      '现金和银行卡',
      '常用药品',
      '洗漱用品'
    ],
    clothing: [
      '适合当地天气的衣物',
      '舒适的步行鞋',
      '防晒用品',
      '雨具（根据天气）'
    ],
    electronics: [
      '相机（可选）',
      '充电宝',
      '转换插头（如需要）'
    ],
    documents: [
      '行程单',
      '酒店预订确认',
      '景点门票预订'
    ]
  };
}

function generateShoppingTips(destination) {
  return {
    bestPlaces: ['当地特色市场', '手工艺品店', '购物中心'],
    whatToBuy: ['当地特产', '手工艺品', '纪念品'],
    tips: [
      '比较价格，避免被宰客',
      '了解退换货政策',
      '注意商品质量和真伪',
      '理性消费，量力而行'
    ]
  };
}

function generateDailyOutfit(weather, preferences) {
  return {
    top: weather.temperature > 20 ? '轻薄上衣' : '保暖外套',
    bottom: '舒适裤子',
    shoes: '舒适步行鞋',
    accessories: weather.condition === '小雨' ? '雨衣' : '帽子'
  };
}

function generateAccessories(weather, preferences) {
  const accessories = ['手表', '太阳镜'];
  
  if (weather.temperature > 25) {
    accessories.push('防晒霜', '遮阳帽');
  }
  
  if (weather.condition === '小雨') {
    accessories.push('雨伞');
  }
  
  return accessories;
}
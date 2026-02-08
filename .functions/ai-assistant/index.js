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
  try {
    const agents = {
      itinerary: {
        name: '行程规划 Agent',
        model: 'GPT-4',
        skills: ['行程规划', '时间安排', '景点推荐'],
        rules: ['考虑用户偏好', '合理安排时间', '避免行程过紧'],
        ragConfig: {
          enabled: true,
          knowledgeBase: 'travel_guide'
        }
      },
      weather: {
        name: '天气查询 Agent',
        model: 'GPT-3.5',
        skills: ['天气查询', '天气预报', '出行建议'],
        rules: ['提供准确天气信息', '给出出行建议'],
        ragConfig: {
          enabled: true,
          knowledgeBase: 'weather_data'
        }
      },
      guide: {
        name: '攻略生成 Agent',
        model: 'GPT-4',
        skills: ['攻略生成', '景点介绍', '美食推荐'],
        rules: ['内容详实', '结构清晰', '实用性强'],
        ragConfig: {
          enabled: true,
          knowledgeBase: 'travel_guide'
        }
      },
      photo: {
        name: '拍照指导 Agent',
        model: 'GPT-3.5',
        skills: ['拍照指导', '景点拍照', '构图建议'],
        rules: ['提供实用建议', '考虑光线和角度'],
        ragConfig: {
          enabled: true,
          knowledgeBase: 'photography_guide'
        }
      },
      outfit: {
        name: '穿搭建议 Agent',
        model: 'GPT-3.5',
        skills: ['穿搭建议', '天气适配', '风格推荐'],
        rules: ['考虑天气因素', '推荐合适风格'],
        ragConfig: {
          enabled: true,
          knowledgeBase: 'fashion_guide'
        }
      }
    };

    const agent = agents[agentType];
    if (!agent) {
      return {
        success: false,
        error: '未知的 Agent 类型'
      };
    }

    const response = await simulateAgentResponse(agent, input, currentPlan);
    
    return {
      success: true,
      agentType,
      agentName: agent.name,
      response
    };
  } catch (error) {
    console.error('调用 Agent 失败:', error);
    return {
      success: false,
      error: error.message || '调用 Agent 失败'
    };
  }
}

async function simulateAgentResponse(agent, input, currentPlan) {
  const responses = {
    itinerary: {
      title: `${input.destination}行程安排`,
      days: [
        {
          day: 1,
          date: input.startDate,
          activities: [
            {
              time: '09:00',
              activity: '抵达机场',
              location: '机场',
              duration: '1小时',
              notes: '办理入境手续'
            },
            {
              time: '10:30',
              activity: '前往酒店',
              location: '市中心酒店',
              duration: '1小时',
              notes: '办理入住手续'
            },
            {
              time: '14:00',
              activity: '游览市中心',
              location: '市中心广场',
              duration: '3小时',
              notes: '参观主要景点'
            }
          ]
        },
        {
          day: 2,
          date: '2026-02-10',
          activities: [
            {
              time: '08:00',
              activity: '早餐',
              location: '酒店餐厅',
              duration: '1小时',
              notes: '享用当地特色早餐'
            },
            {
              time: '09:30',
              activity: '参观博物馆',
              location: '国家博物馆',
              duration: '3小时',
              notes: '了解当地历史文化'
            }
          ]
        }
      ]
    },
    weather: {
      title: `${input.destination}天气预报`,
      location: input.destination,
      forecast: [
        {
          date: input.startDate,
          temperature: '18°C - 25°C',
          condition: '晴',
          humidity: '60%',
          wind: '东北风 3级',
          advice: '适合户外活动'
        },
        {
          date: '2026-02-10',
          temperature: '19°C - 26°C',
          condition: '多云',
          humidity: '65%',
          wind: '东南风 2级',
          advice: '注意防晒'
        }
      ]
    },
    guide: {
      overview: `${input.destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。建议安排3-5天的行程，充分体验当地的风土人情。`,
      highlights: [
        '市中心广场：感受城市的脉搏',
        '国家博物馆：了解历史文化',
        '美食街：品尝当地特色美食'
      ],
      tips: [
        '建议提前预订热门景点门票',
        '注意当地天气变化，携带合适衣物',
        '学习几句当地语言，方便交流'
      ]
    },
    photo: {
      bestSpots: [
        {
          location: '市中心广场',
          bestTime: '早晨 7-9 点',
          tips: '利用早晨柔和的光线，拍摄广场全景',
          equipment: '广角镜头'
        },
        {
          location: '国家博物馆',
          bestTime: '下午 2-4 点',
          tips: '利用侧光拍摄建筑细节',
          equipment: '标准镜头'
        }
      ]
    },
    outfit: {
      recommendations: [
        {
          day: 1,
          weather: '晴',
          temperature: '18°C - 25°C',
          suggestions: '轻薄长袖 + 长裤，舒适运动鞋',
          accessories: '太阳帽、墨镜'
        },
        {
          day: 2,
          weather: '多云',
          temperature: '19°C - 26°C',
          suggestions: '短袖 + 薄外套，休闲鞋',
          accessories: '轻便雨伞'
        }
      ]
    }
  };

  return responses[agentType] || {};
}

async function generatePlan(input, userId) {
  try {
    const itinerary = await callAgent('itinerary', input, userId);
    const weather = await callAgent('weather', input, userId);
    const guide = await callAgent('guide', input, userId);
    const photo = await callAgent('photo', input, userId);
    const outfit = await callAgent('outfit', input, userId);

    return {
      success: true,
      plan: {
        title: `${input.destination}旅行计划`,
        destination: input.destination,
        startDate: input.startDate,
        endDate: input.endDate,
        days: input.days,
        budget: input.budget,
        travelers: input.travelers,
        preferences: input.preferences,
        itinerary: itinerary.response,
        weather: weather.response,
        guide: guide.response,
        photoTips: photo.response,
        outfitTips: outfit.response
      }
    };
  } catch (error) {
    console.error('生成计划失败:', error);
    return {
      success: false,
      error: error.message || '生成计划失败'
    };
  }
}

async function generateGuide(input, userId) {
  return await callAgent('guide', input, userId);
}

async function photoGuide(input, userId) {
  return await callAgent('photo', input, userId);
}

async function outfitGuide(input, userId) {
  return await callAgent('outfit', input, userId);
}

async function saveConversation(event) {
  try {
    const { userId, messages, title } = event;
    
    const result = await db.collection('Conversation').add({
      userId: userId || 'anonymous',
      title: title || '新对话',
      messages: messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      conversationId: result.id,
      message: '对话保存成功'
    };
  } catch (error) {
    console.error('保存对话失败:', error);
    return {
      success: false,
      error: error.message || '保存对话失败'
    };
  }
}

async function getConversation(event) {
  try {
    const { conversationId } = event;
    
    const result = await db.collection('Conversation').doc(conversationId).get();
    
    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: '对话不存在'
      };
    }
    
    return {
      success: true,
      conversation: result.data[0]
    };
  } catch (error) {
    console.error('获取对话失败:', error);
    return {
      success: false,
      error: error.message || '获取对话失败'
    };
  }
}

async function getWeather(input) {
  return await callAgent('weather', input, null, null);
}

async function suggestTimeAdjustment(input) {
  try {
    const { currentPlan, weatherData } = input;
    
    const suggestions = {
      success: true,
      suggestions: [
        {
          nodeId: 'node-1',
          originalTime: '09:00',
          suggestedTime: '10:00',
          reason: '根据天气预报，上午9点可能有阵雨，建议推迟1小时',
          confidence: 0.85
        },
        {
          nodeId: 'node-3',
          originalTime: '14:00',
          suggestedTime: '15:30',
          reason: '下午2点光线较强，不适合拍照，建议推迟到下午3点半',
          confidence: 0.92
        }
      ]
    };
    
    return suggestions;
  } catch (error) {
    console.error('生成时间调整建议失败:', error);
    return {
      success: false,
      error: error.message || '生成时间调整建议失败'
    };
  }
}

async function refreshNodeStatus(input) {
  try {
    const { planId, nodeId } = input;
    
    const result = await db.collection('Trip').doc(planId).get();
    
    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: '计划不存在'
      };
    }
    
    const plan = result.data[0];
    const itinerary = plan.itinerary || {};
    const days = itinerary.days || [];
    
    let targetNode = null;
    for (const day of days) {
      const activities = day.activities || [];
      const node = activities.find(a => a.id === nodeId);
      if (node) {
        targetNode = node;
        break;
      }
    }
    
    if (!targetNode) {
      return {
        success: false,
        error: '节点不存在'
      };
    }
    
    const weatherData = {
      date: targetNode.date,
      temperature: '18°C - 25°C',
      condition: '晴',
      humidity: '60%',
      wind: '东北风 3级',
      advice: '适合户外活动'
    };
    
    return {
      success: true,
      nodeId,
      node: targetNode,
      weather: weatherData,
      suggestions: [
        {
          nodeId: nodeId,
          originalTime: targetNode.time,
          suggestedTime: targetNode.time,
          reason: '当前时间安排合理，无需调整',
          confidence: 0.95
        }
      ]
    };
  } catch (error) {
    console.error('刷新节点状态失败:', error);
    return {
      success: false,
      error: error.message || '刷新节点状态失败'
    };
  }
}
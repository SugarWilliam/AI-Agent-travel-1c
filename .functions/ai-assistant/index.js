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
      .doc(data._id)
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
      .doc(data._id)
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

// AI配置管理
async function getAIConfig(userId) {
  const db = cloud.database();
  try {
    const result = await db.collection('AIConfig')
      .where({
        userId: userId
      })
      .limit(1)
      .get();
    
    if (result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      };
    } else {
      // 返回默认配置
      return {
        success: true,
        data: {
          modelId: 'gpt-4',
          modelName: 'GPT-4',
          provider: 'OpenAI',
          temperature: 0.7,
          maxTokens: 4096,
          systemPrompt: '你是一个智能旅行助手'
        }
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
    
    // 先检查是否已存在配置
    const existing = await db.collection('AIConfig')
      .where({ userId: data.userId })
      .limit(1)
      .get();
    
    if (existing.data.length > 0) {
      // 更新现有配置
      await db.collection('AIConfig')
        .doc(existing.data[0]._id)
        .update({
          data: configData
        });
    } else {
      // 创建新配置
      configData.createdAt = now;
      await db.collection('AIConfig').add({
        data: configData
      });
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

// 原有的AI助手功能
async function generatePlan(data) {
  const { destination, startDate, endDate, days, budget, travelers, preferences } = data.input;
  const userId = data.userId;
  
  try {
    // 获取用户配置
    const configResult = await getAIConfig(userId);
    const config = configResult.success ? configResult.data : {
      modelId: 'gpt-4',
      temperature: 0.7,
      maxTokens: 4096
    };

    // 构建提示词
    const prompt = `作为智能旅行规划助手，请为以下旅行需求生成详细计划：

目的地：${destination}
出发日期：${startDate}
返回日期：${endDate}
旅行天数：${days}天
预算范围：${budget}
出行人数：${travelers}人
特殊偏好：${preferences}

请生成包含以下内容的完整旅行计划：
1. 每日详细行程安排（含时间、地点、活动）
2. 交通方式和路线建议
3. 住宿推荐（含价格区间）
4. 餐饮推荐（含特色美食）
5. 景点门票信息
6. 注意事项和实用贴士
7. 应急联系信息

请确保内容实用、详细且符合预算要求。`;

    // 模拟AI响应（实际项目中需要接入真实的AI API）
    const planContent = {
      itinerary: generateItinerary(days, destination, preferences),
      transportation: generateTransportation(destination, budget),
      accommodation: generateAccommodation(destination, budget, travelers),
      dining: generateDining(destination, preferences),
      attractions: generateAttractions(destination, preferences),
      tips: generateTips(destination),
      emergency: generateEmergencyInfo(destination)
    };

    // 保存到数据库
    const db = cloud.database();
    const planId = `plan_${Date.now()}`;
    
    await db.collection('Trip').add({
      data: {
        _id: planId,
        userId: userId,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days,
        budget,
        travelers,
        preferences,
        planContent,
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    });

    return {
      success: true,
      data: {
        planId,
        planContent
      }
    };
  } catch (error) {
    console.error('生成计划失败:', error);
    return {
      success: false,
      error: '生成旅行计划失败，请重试'
    };
  }
}

// 辅助函数
function generateItinerary(days, destination, preferences) {
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      day: i,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      morning: `第${i}天上午：参观${destination}主要景点`,
      afternoon: `第${i}天下午：体验当地文化活动`,
      evening: `第${i}天晚上：品尝当地美食`,
      accommodation: `推荐住宿：${destination}市中心酒店`,
      transportation: `交通方式：地铁/公交/步行`
    });
  }
  return itinerary;
}

function generateTransportation(destination, budget) {
  return {
    arrival: `到达${destination}：建议选择直飞航班`,
    local: `市内交通：推荐购买交通卡，包含地铁、公交`,
    tips: '提前下载当地交通APP，了解实时交通信息'
  };
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
      
      // 原有的功能
      case 'generate':
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
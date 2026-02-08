// @ts-ignore
const cloud = require('@cloudbase/node-sdk');

// @ts-ignore
const tcb = cloud.init({
  env: cloud.getCurrentEnv()
});

const db = tcb.database();

exports.main = async (event, context) => {
  const { action, planId, plan, userId } = event;
  
  console.log('SaveTravelPlan 调用:', { action, planId, userId });
  
  try {
    switch (action) {
      case 'create':
        return await createPlan(plan, userId);
      
      case 'update':
        return await updatePlan(planId, plan, userId);
      
      case 'delete':
        return await deletePlan(planId, userId);
      
      case 'get':
        return await getPlan(planId, userId);
      
      case 'list':
        return await listPlans(userId, event.status);
      
      default:
        return {
          success: false,
          error: '未知的操作类型: ' + action
        };
    }
  } catch (error) {
    console.error('SaveTravelPlan 错误:', error);
    return {
      success: false,
      error: error.message || '处理请求时发生错误'
    };
  }
};

// 创建计划
async function createPlan(plan, userId) {
  console.log('创建计划:', plan);
  
  try {
    // 验证必填字段
    if (!plan.title) {
      throw new Error('计划标题不能为空');
    }
    if (!plan.destination) {
      throw new Error('目的地不能为空');
    }
    
    // 准备数据
    const planData = {
      title: plan.title,
      destination: plan.destination,
      startDate: plan.startDate || new Date().toISOString(),
      endDate: plan.endDate || new Date().toISOString(),
      budget: Number(plan.budget) || 0,
      travelers: Number(plan.travelers) || 1,
      description: plan.description || '',
      coverImage: plan.coverImage || '',
      status: plan.status || 'draft',
      itinerary: plan.itinerary || [],
      weather: plan.weather || [],
      guide: plan.guide || null,
      photoTips: plan.photoTips || null,
      outfitTips: plan.outfitTips || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      _openid: userId
    };
    
    // 保存到数据库
    const result = await db.collection('Trip').add(planData);
    
    console.log('计划创建成功:', result.id);
    
    return {
      success: true,
      planId: result.id,
      plan: {
        ...planData,
        _id: result.id
      }
    };
  } catch (error) {
    console.error('创建计划失败:', error);
    throw error;
  }
}

// 更新计划
async function updatePlan(planId, plan, userId) {
  console.log('更新计划:', planId, plan);
  
  try {
    if (!planId) {
      throw new Error('计划ID不能为空');
    }
    
    // 准备更新数据
    const updateData = {
      ...plan,
      updatedAt: new Date().toISOString()
    };
    
    // 移除不应该更新的字段
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.userId;
    delete updateData._openid;
    
    // 更新数据库
    const result = await db.collection('Trip')
      .where({
        _id: planId,
        userId,
        _openid: userId
      })
      .update(updateData);
    
    if (result.updated === 0) {
      throw new Error('计划不存在或无权修改');
    }
    
    console.log('计划更新成功:', planId);
    
    return {
      success: true,
      planId,
      plan: {
        ...plan,
        _id: planId
      }
    };
  } catch (error) {
    console.error('更新计划失败:', error);
    throw error;
  }
}

// 删除计划
async function deletePlan(planId, userId) {
  console.log('删除计划:', planId);
  
  try {
    if (!planId) {
      throw new Error('计划ID不能为空');
    }
    
    const result = await db.collection('Trip')
      .where({
        _id: planId,
        userId,
        _openid: userId
      })
      .remove();
    
    if (result.deleted === 0) {
      throw new Error('计划不存在或无权删除');
    }
    
    console.log('计划删除成功:', planId);
    
    return {
      success: true,
      planId
    };
  } catch (error) {
    console.error('删除计划失败:', error);
    throw error;
  }
}

// 获取计划
async function getPlan(planId, userId) {
  console.log('获取计划:', planId);
  
  try {
    if (!planId) {
      throw new Error('计划ID不能为空');
    }
    
    const result = await db.collection('Trip')
      .where({
        _id: planId,
        userId,
        _openid: userId
      })
      .get();
    
    if (result.data.length === 0) {
      throw new Error('计划不存在');
    }
    
    return {
      success: true,
      plan: result.data[0]
    };
  } catch (error) {
    console.error('获取计划失败:', error);
    throw error;
  }
}

// 列出计划
async function listPlans(userId, status) {
  console.log('列出计划:', userId, status);
  
  try {
    const whereCondition = {
      userId,
      _openid: userId
    };
    
    if (status) {
      whereCondition.status = status;
    }
    
    const result = await db.collection('Trip')
      .where(whereCondition)
      .orderBy('createdAt', 'desc')
      .get();
    
    return {
      success: true,
      plans: result.data,
      total: result.data.length
    };
  } catch (error) {
    console.error('列出计划失败:', error);
    throw error;
  }
}

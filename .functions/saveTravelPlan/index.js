// @ts-nocheck
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, plan, planId, userId } = event;

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
        return await listPlans(userId);
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

async function createPlan(plan, userId) {
  try {
    const result = await db.collection('Trip').add({
      ...plan,
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      planId: result.id,
      message: '计划创建成功'
    };
  } catch (error) {
    console.error('创建计划失败:', error);
    return {
      success: false,
      error: error.message || '创建计划失败'
    };
  }
}

async function updatePlan(planId, plan, userId) {
  try {
    const result = await db.collection('Trip').doc(planId).update({
      ...plan,
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: '计划更新成功'
    };
  } catch (error) {
    console.error('更新计划失败:', error);
    return {
      success: false,
      error: error.message || '更新计划失败'
    };
  }
}

async function deletePlan(planId, userId) {
  try {
    await db.collection('Trip').doc(planId).remove();
    
    return {
      success: true,
      message: '计划删除成功'
    };
  } catch (error) {
    console.error('删除计划失败:', error);
    return {
      success: false,
      error: error.message || '删除计划失败'
    };
  }
}

async function getPlan(planId, userId) {
  try {
    const result = await db.collection('Trip').doc(planId).get();
    
    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: '计划不存在'
      };
    }
    
    return {
      success: true,
      plan: result.data[0]
    };
  } catch (error) {
    console.error('获取计划失败:', error);
    return {
      success: false,
      error: error.message || '获取计划失败'
    };
  }
}

async function listPlans(userId) {
  try {
    const result = await db.collection('Trip')
      .where({
        userId: userId || 'anonymous'
      })
      .orderBy('createdAt', 'desc')
      .get();
    
    return {
      success: true,
      plans: result.data || []
    };
  } catch (error) {
    console.error('获取计划列表失败:', error);
    return {
      success: false,
      error: error.message || '获取计划列表失败'
    };
  }
}
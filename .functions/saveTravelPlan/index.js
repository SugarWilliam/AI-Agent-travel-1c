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
  const now = new Date().toISOString();
  const newPlan = {
    ...plan,
    userId,
    status: plan.status || 'draft',
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('Trip').add(newPlan);

  return {
    success: true,
    planId: result.id,
    plan: { ...newPlan, _id: result.id }
  };
}

async function updatePlan(planId, plan, userId) {
  const now = new Date().toISOString();
  const updateData = {
    ...plan,
    updatedAt: now
  };

  const result = await db.collection('Trip')
    .where({
      _id: planId,
      userId
    })
    .update(updateData);

  if (result.updated === 0) {
    return {
      success: false,
      error: '计划不存在或无权修改'
    };
  }

  return {
    success: true,
    plan: { ...updateData, _id: planId }
  };
}

async function deletePlan(planId, userId) {
  const result = await db.collection('Trip')
    .where({
      _id: planId,
      userId
    })
    .remove();

  if (result.removed === 0) {
    return {
      success: false,
      error: '计划不存在或无权删除'
    };
  }

  return {
    success: true
  };
}

async function getPlan(planId, userId) {
  const result = await db.collection('Trip')
    .where({
      _id: planId,
      userId
    })
    .get();

  if (result.data.length === 0) {
    return {
      success: false,
      error: '计划不存在'
    };
  }

  return {
    success: true,
    plan: result.data[0]
  };
}

async function listPlans(userId) {
  const result = await db.collection('Trip')
    .where({ userId })
    .orderBy('createdAt', 'desc')
    .get();

  return {
    success: true,
    plans: result.data
  };
}

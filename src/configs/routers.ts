import HOME from '../pages/home.jsx';
import DETAIL from '../pages/detail.jsx';
import AI from '../pages/ai.jsx';
import CREATE from '../pages/create.jsx';
import PROFILE from '../pages/profile.jsx';
import SETTINGS from '../pages/settings.jsx';
import AI_CONFIG from '../pages/ai-config.jsx';
import AI_OUTPUT from '../pages/ai-output.jsx';
import AGENT_LIST from '../pages/agent-list.jsx';
import AGENT_LOGS from '../pages/agent-logs.jsx';
import MY_PLANS from '../pages/my-plans.jsx';
import COMPANIONS from '../pages/companions.jsx';
import SHARE_SETTINGS from '../pages/share-settings.jsx';
import REMINDER_SETTINGS from '../pages/reminder-settings.jsx';
import PHOTO_GUIDE from '../pages/photo-guide.jsx';
import PHOTO_GUIDE-DETAIL from '../pages/photo-guide-detail.jsx';
export const routers = [{
  id: "home",
  component: HOME
}, {
  id: "detail",
  component: DETAIL
}, {
  id: "ai",
  component: AI
}, {
  id: "create",
  component: CREATE
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "settings",
  component: SETTINGS
}, {
  id: "ai-config",
  component: AI_CONFIG
}, {
  id: "ai-output",
  component: AI_OUTPUT
}, {
  id: "agent-list",
  component: AGENT_LIST
}, {
  id: "agent-logs",
  component: AGENT_LOGS
}, {
  id: "my-plans",
  component: MY_PLANS
}, {
  id: "companions",
  component: COMPANIONS
}, {
  id: "share-settings",
  component: SHARE_SETTINGS
}, {
  id: "reminder-settings",
  component: REMINDER_SETTINGS
}, {
  id: "photo-guide",
  component: PHOTO_GUIDE
}, {
  id: "photo-guide-detail",
  component: PHOTO_GUIDE-DETAIL
}]
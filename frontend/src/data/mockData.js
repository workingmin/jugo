import { WORK_TYPES, WORK_STATUS } from '../constants';

// Mock works data - 模拟作品数据
export const mockWorks = [
  {
    id: '1',
    title: '都市修仙传',
    type: WORK_TYPES.NOVEL,
    status: WORK_STATUS.DRAFT,
    genre: '都市',
    style: ['热血', '爽文'],
    words: 125000,
    chapters: 45,
    cover: null,
    createdAt: '2026-02-10 10:30:00',
    updatedAt: '2小时前',
    description: '一个普通程序员意外获得修仙系统，在都市中开启修仙之路...',
  },
  {
    id: '2',
    title: '霸道总裁的小娇妻',
    type: WORK_TYPES.NOVEL,
    status: WORK_STATUS.COMPLETED,
    genre: '言情',
    style: ['甜宠', '轻松'],
    words: 89000,
    chapters: 32,
    cover: null,
    createdAt: '2026-02-08 14:20:00',
    updatedAt: '1天前',
    description: '灰姑娘与霸道总裁的甜蜜爱情故事...',
  },
  {
    id: '3',
    title: '末日求生',
    type: WORK_TYPES.SCREENPLAY,
    status: WORK_STATUS.DRAFT,
    genre: '短剧',
    style: ['悬疑', '黑暗'],
    words: 15000,
    scenes: 12,
    duration: '45分钟',
    createdAt: '2026-02-12 09:15:00',
    updatedAt: '3小时前',
    description: '末日来临，一群幸存者在废墟中寻找生存希望...',
  },
  {
    id: '4',
    title: '星际穿越之旅',
    type: WORK_TYPES.NOVEL,
    status: WORK_STATUS.DRAFT,
    genre: '科幻',
    style: ['热血', '励志'],
    words: 56000,
    chapters: 20,
    cover: null,
    createdAt: '2026-02-05 16:45:00',
    updatedAt: '5天前',
    description: '人类首次星际探险，发现未知文明...',
  },
  {
    id: '5',
    title: '咖啡馆的故事',
    type: WORK_TYPES.SCREENPLAY,
    status: WORK_STATUS.COMPLETED,
    genre: '微电影',
    style: ['治愈', '轻松'],
    words: 8000,
    scenes: 8,
    duration: '20分钟',
    createdAt: '2026-01-28 11:30:00',
    updatedAt: '1周前',
    description: '一家温馨咖啡馆里发生的温暖小故事...',
  },
];

// Mock chapters data - 模拟章节数据
export const mockChapters = [
  {
    id: 'ch1',
    workId: '1',
    title: '第一章 意外觉醒',
    content: '清晨的阳光透过窗帘洒进房间，李明睁开眼睛，发现眼前出现了一个半透明的界面...',
    words: 3200,
    order: 1,
    createdAt: '2026-02-10 10:30:00',
    updatedAt: '2026-02-10 11:45:00',
  },
  {
    id: 'ch2',
    workId: '1',
    title: '第二章 系统任务',
    content: '【新手任务：完成第一次修炼】李明看着系统界面上的任务提示，心中既兴奋又紧张...',
    words: 2800,
    order: 2,
    createdAt: '2026-02-10 12:00:00',
    updatedAt: '2026-02-10 13:20:00',
  },
  {
    id: 'ch3',
    workId: '1',
    title: '第三章 初试身手',
    content: '经过一夜的修炼，李明感觉体内充满了力量。他决定测试一下自己的新能力...',
    words: 3100,
    order: 3,
    createdAt: '2026-02-11 09:15:00',
    updatedAt: '2026-02-11 10:30:00',
  },
];

// Mock scenes data for screenplay - 模拟剧本场景数据
export const mockScenes = [
  {
    id: 'sc1',
    workId: '3',
    title: '场景1：废墟-白天-外景',
    content: `场景1：废墟-白天-外景

[镜头：全景，废墟城市，烟尘弥漫]

角色：张强（男主，35岁，前军人）
动作：张强小心翼翼地在废墟中搜寻物资

角色：李娜（女主，28岁，医生）
台词：（紧张地）我们必须在天黑前找到食物和水。

张强：（坚定地）放心，我会保护你们的。`,
    order: 1,
    duration: '3分钟',
    createdAt: '2026-02-12 09:15:00',
    updatedAt: '2026-02-12 10:00:00',
  },
  {
    id: 'sc2',
    workId: '3',
    title: '场景2：地下避难所-夜晚-内景',
    content: `场景2：地下避难所-夜晚-内景

[镜头：中景，昏暗的地下室，几个人围坐在火堆旁]

角色：王明（配角，40岁，工程师）
台词：（焦虑地）我们的食物只够维持三天了。

李娜：（安慰地）我们会找到办法的。

动作：张强站起身，走到窗边，望向外面的废墟`,
    order: 2,
    duration: '4分钟',
    createdAt: '2026-02-12 10:30:00',
    updatedAt: '2026-02-12 11:15:00',
  },
];

// Mock characters data - 模拟角色数据
export const mockCharacters = [
  {
    id: 'char1',
    workId: '1',
    name: '李明',
    role: '主角',
    age: 28,
    personality: '聪明、勇敢、善良',
    background: '普通程序员，意外获得修仙系统',
    relationships: '单身，有一个好友张伟',
    appearances: 45,
  },
  {
    id: 'char2',
    workId: '1',
    name: '张伟',
    role: '配角',
    age: 29,
    personality: '幽默、忠诚、胆小',
    background: '李明的大学同学兼室友',
    relationships: '李明的好友',
    appearances: 23,
  },
];

// Mock user data - 模拟用户数据
export const mockUser = {
  id: 'user1',
  username: '创作者小明',
  email: 'xiaoming@example.com',
  avatar: null,
  memberLevel: 'monthly',
  memberExpireAt: '2026-03-14',
  stats: {
    totalWorks: 5,
    totalWords: 293000,
    novelCount: 3,
    screenplayCount: 2,
    weeklyWords: 12500,
    creationDays: 45,
  },
  settings: {
    defaultMode: 'novel',
    fontSize: 16,
    autoSaveInterval: 30,
    theme: 'light',
  },
  createdAt: '2026-01-01 10:00:00',
};

// Mock materials data - 模拟素材数据
export const mockMaterials = [
  {
    id: 'mat1',
    type: 'character',
    title: '霸道总裁人设',
    content: '外表冷酷，内心温柔，对女主一见钟情，占有欲强...',
    tags: ['言情', '霸总'],
    favorite: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'mat2',
    type: 'scene',
    title: '咖啡馆邂逅场景',
    content: '阳光透过落地窗洒进咖啡馆，空气中弥漫着咖啡的香气...',
    tags: ['都市', '浪漫'],
    favorite: false,
    createdAt: '2026-02-03',
  },
  {
    id: 'mat3',
    type: 'dialogue',
    title: '表白台词',
    content: '我知道这很突然，但我不想再等了。从第一次见到你，我就知道你是我要找的人。',
    tags: ['言情', '表白'],
    favorite: true,
    createdAt: '2026-02-05',
  },
];

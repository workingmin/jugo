/**
 * 场景时间
 */
export type SceneTime = 'day' | 'night' | 'dawn' | 'dusk' | 'continuous'

/**
 * 场景类型
 */
export type SceneType = 'interior' | 'exterior' // 内景/外景

/**
 * 场景状态
 */
export type SceneStatus = 'draft' | 'writing' | 'completed'

/**
 * 场景接口
 */
export interface Scene {
  sceneId: string
  workId: string
  sceneNumber: number // 场景编号
  location: string // 场景地点
  time: SceneTime // 时间
  type: SceneType // 内景/外景
  content: string // 场景内容
  duration: number // 预计时长（分钟）
  order: number // 排序
  status: SceneStatus
  createdAt: string
  updatedAt: string
}

/**
 * 场景创建请求
 */
export interface CreateSceneRequest {
  workId: string
  location: string
  time: SceneTime
  type: SceneType
  order?: number
}

/**
 * 场景更新请求
 */
export interface UpdateSceneRequest {
  location?: string
  time?: SceneTime
  type?: SceneType
  content?: string
  duration?: number
  status?: SceneStatus
  order?: number
}

/**
 * 角色接口
 */
export interface Character {
  characterId: string
  workId: string
  name: string // 角色名
  description: string // 角色描述
  traits: string[] // 角色特征标签
  relationships: CharacterRelationship[] // 角色关系
  appearanceCount: number // 出场次数
  createdAt: string
  updatedAt: string
}

/**
 * 角色关系
 */
export interface CharacterRelationship {
  targetCharacterId: string
  targetCharacterName: string
  relationship: string // 关系描述，如"父子"、"朋友"、"敌人"
}

/**
 * 角色创建请求
 */
export interface CreateCharacterRequest {
  workId: string
  name: string
  description?: string
  traits?: string[]
}

/**
 * 角色更新请求
 */
export interface UpdateCharacterRequest {
  name?: string
  description?: string
  traits?: string[]
  relationships?: CharacterRelationship[]
}

/**
 * 剧本格式类型
 */
export type ScreenplayElementType =
  | 'scene_heading' // 场景标题
  | 'action' // 动作描述
  | 'character' // 角色名
  | 'dialogue' // 台词
  | 'parenthetical' // 括号注释
  | 'transition' // 转场

/**
 * 剧本元素
 */
export interface ScreenplayElement {
  type: ScreenplayElementType
  content: string
}

/**
 * 剧本编辑器状态
 */
export interface ScreenplayEditorState {
  currentWorkId: string | null
  currentSceneId: string | null
  scenes: Scene[]
  currentScene: Scene | null
  characters: Character[]
  isLoading: boolean
  isSaving: boolean
  lastSavedAt: string | null
  hasUnsavedChanges: boolean
}

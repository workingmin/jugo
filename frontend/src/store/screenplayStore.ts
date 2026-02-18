import { create } from 'zustand'
import type {
  Scene,
  Character,
  ScreenplayEditorState,
  CreateSceneRequest,
  UpdateSceneRequest,
  CreateCharacterRequest,
  UpdateCharacterRequest
} from '@/types/screenplay'
import * as scenesApi from '@/api/scenes'
import * as charactersApi from '@/api/characters'
import { message } from 'antd'

interface ScreenplayStore extends ScreenplayEditorState {
  // 场景操作
  loadScenes: (workId: string) => Promise<void>
  loadScene: (workId: string, sceneId: string) => Promise<void>
  createScene: (data: CreateSceneRequest) => Promise<Scene | null>
  updateScene: (workId: string, sceneId: string, data: UpdateSceneRequest) => Promise<void>
  deleteScene: (workId: string, sceneId: string) => Promise<void>
  reorderScenes: (workId: string, orders: Array<{ sceneId: string; order: number }>) => Promise<void>
  // 内容编辑
  updateContent: (content: string) => void
  saveContent: () => Promise<void>
  autoSave: () => Promise<void>
  // 角色操作
  loadCharacters: (workId: string) => Promise<void>
  createCharacter: (data: CreateCharacterRequest) => Promise<Character | null>
  updateCharacter: (workId: string, characterId: string, data: UpdateCharacterRequest) => Promise<void>
  deleteCharacter: (workId: string, characterId: string) => Promise<void>
  // 状态管理
  setCurrentWork: (workId: string) => void
  setCurrentScene: (sceneId: string | null) => void
  setHasUnsavedChanges: (hasChanges: boolean) => void
  // 重置
  reset: () => void
}

export const useScreenplayStore = create<ScreenplayStore>((set, get) => ({
  // 初始状态
  currentWorkId: null,
  currentSceneId: null,
  scenes: [],
  currentScene: null,
  characters: [],
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,
  hasUnsavedChanges: false,

  // 加载作品的所有场景
  loadScenes: async (workId: string) => {
    set({ isLoading: true })
    try {
      const scenes = await scenesApi.getScenes(workId)
      set({ scenes, currentWorkId: workId, isLoading: false })
    } catch (error) {
      message.error('加载场景列表失败')
      set({ isLoading: false })
    }
  },

  // 加载单个场景
  loadScene: async (workId: string, sceneId: string) => {
    set({ isLoading: true })
    try {
      const scene = await scenesApi.getScene(workId, sceneId)
      set({
        currentScene: scene,
        currentSceneId: sceneId,
        currentWorkId: workId,
        isLoading: false,
        hasUnsavedChanges: false
      })
    } catch (error) {
      message.error('加载场景失败')
      set({ isLoading: false })
    }
  },

  // 创建新场景
  createScene: async (data: CreateSceneRequest) => {
    try {
      const scene = await scenesApi.createScene(data)
      const { scenes } = get()
      set({ scenes: [...scenes, scene] })
      message.success('场景创建成功')
      return scene
    } catch (error) {
      message.error('场景创建失败')
      return null
    }
  },

  // 更新场景
  updateScene: async (workId: string, sceneId: string, data: UpdateSceneRequest) => {
    try {
      const updatedScene = await scenesApi.updateScene(workId, sceneId, data)
      const { scenes, currentScene } = get()

      const newScenes = scenes.map(sc =>
        sc.sceneId === sceneId ? updatedScene : sc
      )

      const newCurrentScene = currentScene?.sceneId === sceneId
        ? updatedScene
        : currentScene

      set({ scenes: newScenes, currentScene: newCurrentScene })
      message.success('场景更新成功')
    } catch (error) {
      message.error('场景更新失败')
    }
  },

  // 删除场景
  deleteScene: async (workId: string, sceneId: string) => {
    try {
      await scenesApi.deleteScene(workId, sceneId)
      const { scenes, currentSceneId } = get()

      const newScenes = scenes.filter(sc => sc.sceneId !== sceneId)

      const newState: any = { scenes: newScenes }
      if (currentSceneId === sceneId) {
        newState.currentScene = null
        newState.currentSceneId = null
      }

      set(newState)
      message.success('场景删除成功')
    } catch (error) {
      message.error('场景删除失败')
    }
  },

  // 重新排序场景
  reorderScenes: async (workId: string, orders: Array<{ sceneId: string; order: number }>) => {
    try {
      await scenesApi.reorderScenes(workId, orders)
      await get().loadScenes(workId)
      message.success('场景顺序更新成功')
    } catch (error) {
      message.error('场景顺序更新失败')
    }
  },

  // 更新内容（本地）
  updateContent: (content: string) => {
    const { currentScene } = get()
    if (currentScene) {
      set({
        currentScene: { ...currentScene, content },
        hasUnsavedChanges: true
      })
    }
  },

  // 保存内容
  saveContent: async () => {
    const { currentWorkId, currentSceneId, currentScene, hasUnsavedChanges } = get()

    if (!currentWorkId || !currentSceneId || !currentScene || !hasUnsavedChanges) {
      return
    }

    set({ isSaving: true })
    try {
      await scenesApi.updateScene(currentWorkId, currentSceneId, {
        content: currentScene.content
      })
      set({
        isSaving: false,
        hasUnsavedChanges: false,
        lastSavedAt: new Date().toISOString()
      })
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
      set({ isSaving: false })
    }
  },

  // 自动保存
  autoSave: async () => {
    const { currentWorkId, currentSceneId, currentScene, hasUnsavedChanges } = get()

    if (!currentWorkId || !currentSceneId || !currentScene || !hasUnsavedChanges) {
      return
    }

    try {
      await scenesApi.autoSaveScene(currentWorkId, currentSceneId, currentScene.content)
      set({
        hasUnsavedChanges: false,
        lastSavedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('自动保存失败:', error)
    }
  },

  // 加载角色列表
  loadCharacters: async (workId: string) => {
    try {
      const characters = await charactersApi.getCharacters(workId)
      set({ characters })
    } catch (error) {
      message.error('加载角色列表失败')
    }
  },

  // 创建新角色
  createCharacter: async (data: CreateCharacterRequest) => {
    try {
      const character = await charactersApi.createCharacter(data)
      const { characters } = get()
      set({ characters: [...characters, character] })
      message.success('角色创建成功')
      return character
    } catch (error) {
      message.error('角色创建失败')
      return null
    }
  },

  // 更新角色
  updateCharacter: async (workId: string, characterId: string, data: UpdateCharacterRequest) => {
    try {
      const updatedCharacter = await charactersApi.updateCharacter(workId, characterId, data)
      const { characters } = get()

      const newCharacters = characters.map(ch =>
        ch.characterId === characterId ? updatedCharacter : ch
      )

      set({ characters: newCharacters })
      message.success('角色更新成功')
    } catch (error) {
      message.error('角色更新失败')
    }
  },

  // 删除角色
  deleteCharacter: async (workId: string, characterId: string) => {
    try {
      await charactersApi.deleteCharacter(workId, characterId)
      const { characters } = get()

      const newCharacters = characters.filter(ch => ch.characterId !== characterId)

      set({ characters: newCharacters })
      message.success('角色删除成功')
    } catch (error) {
      message.error('角色删除失败')
    }
  },

  // 设置当前作品
  setCurrentWork: (workId: string) => {
    set({ currentWorkId: workId })
  },

  // 设置当前场景
  setCurrentScene: (sceneId: string | null) => {
    set({ currentSceneId: sceneId })
  },

  // 设置未保存状态
  setHasUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges })
  },

  // 重置状态
  reset: () => {
    set({
      currentWorkId: null,
      currentSceneId: null,
      scenes: [],
      currentScene: null,
      characters: [],
      isLoading: false,
      isSaving: false,
      lastSavedAt: null,
      hasUnsavedChanges: false
    })
  }
}))

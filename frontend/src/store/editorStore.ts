import { create } from 'zustand'
import type { Chapter, EditorState, EditorConfig, CreateChapterRequest, UpdateChapterRequest } from '@/types/editor'
import * as chaptersApi from '@/api/chapters'
import { message } from 'antd'

interface EditorStore extends EditorState {
  config: EditorConfig
  // 章节操作
  loadChapters: (workId: string) => Promise<void>
  loadChapter: (workId: string, chapterId: string) => Promise<void>
  createChapter: (data: CreateChapterRequest) => Promise<Chapter | null>
  updateChapter: (workId: string, chapterId: string, data: UpdateChapterRequest) => Promise<void>
  deleteChapter: (workId: string, chapterId: string) => Promise<void>
  reorderChapters: (workId: string, orders: Array<{ chapterId: string; order: number }>) => Promise<void>
  // 内容编辑
  updateContent: (content: string) => void
  saveContent: () => Promise<void>
  autoSave: () => Promise<void>
  // 状态管理
  setCurrentWork: (workId: string) => void
  setCurrentChapter: (chapterId: string | null) => void
  setHasUnsavedChanges: (hasChanges: boolean) => void
  // 配置管理
  updateConfig: (config: Partial<EditorConfig>) => void
  // 重置
  reset: () => void
}

const defaultConfig: EditorConfig = {
  autoSaveInterval: 30000, // 30秒
  fontSize: 16,
  lineHeight: 1.8,
  theme: 'light',
  showWordCount: true,
  showPreview: true
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // 初始状态
  currentWorkId: null,
  currentChapterId: null,
  chapters: [],
  currentChapter: null,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,
  hasUnsavedChanges: false,
  config: defaultConfig,

  // 加载作品的所有章节
  loadChapters: async (workId: string) => {
    set({ isLoading: true })
    try {
      const chapters = await chaptersApi.getChapters(workId)
      set({ chapters, currentWorkId: workId, isLoading: false })
    } catch (error) {
      message.error('加载章节列表失败')
      set({ isLoading: false })
    }
  },

  // 加载单个章节
  loadChapter: async (workId: string, chapterId: string) => {
    set({ isLoading: true })
    try {
      const chapter = await chaptersApi.getChapter(workId, chapterId)
      set({
        currentChapter: chapter,
        currentChapterId: chapterId,
        currentWorkId: workId,
        isLoading: false,
        hasUnsavedChanges: false
      })
    } catch (error) {
      message.error('加载章节失败')
      set({ isLoading: false })
    }
  },

  // 创建新章节
  createChapter: async (data: CreateChapterRequest) => {
    try {
      const chapter = await chaptersApi.createChapter(data)
      const { chapters } = get()
      set({ chapters: [...chapters, chapter] })
      message.success('章节创建成功')
      return chapter
    } catch (error) {
      message.error('章节创建失败')
      return null
    }
  },

  // 更新章节
  updateChapter: async (workId: string, chapterId: string, data: UpdateChapterRequest) => {
    try {
      const updatedChapter = await chaptersApi.updateChapter(workId, chapterId, data)
      const { chapters, currentChapter } = get()

      // 更新章节列表
      const newChapters = chapters.map(ch =>
        ch.chapterId === chapterId ? updatedChapter : ch
      )

      // 更新当前章节
      const newCurrentChapter = currentChapter?.chapterId === chapterId
        ? updatedChapter
        : currentChapter

      set({ chapters: newChapters, currentChapter: newCurrentChapter })
      message.success('章节更新成功')
    } catch (error) {
      message.error('章节更新失败')
    }
  },

  // 删除章节
  deleteChapter: async (workId: string, chapterId: string) => {
    try {
      await chaptersApi.deleteChapter(workId, chapterId)
      const { chapters, currentChapterId } = get()

      // 从列表中移除
      const newChapters = chapters.filter(ch => ch.chapterId !== chapterId)

      // 如果删除的是当前章节，清空当前章节
      const newState: any = { chapters: newChapters }
      if (currentChapterId === chapterId) {
        newState.currentChapter = null
        newState.currentChapterId = null
      }

      set(newState)
      message.success('章节删除成功')
    } catch (error) {
      message.error('章节删除失败')
    }
  },

  // 重新排序章节
  reorderChapters: async (workId: string, orders: Array<{ chapterId: string; order: number }>) => {
    try {
      await chaptersApi.reorderChapters(workId, orders)
      // 重新加载章节列表
      await get().loadChapters(workId)
      message.success('章节顺序更新成功')
    } catch (error) {
      message.error('章节顺序更新失败')
    }
  },

  // 更新内容（本地）
  updateContent: (content: string) => {
    const { currentChapter } = get()
    if (currentChapter) {
      set({
        currentChapter: { ...currentChapter, content },
        hasUnsavedChanges: true
      })
    }
  },

  // 保存内容
  saveContent: async () => {
    const { currentWorkId, currentChapterId, currentChapter, hasUnsavedChanges } = get()

    if (!currentWorkId || !currentChapterId || !currentChapter || !hasUnsavedChanges) {
      return
    }

    set({ isSaving: true })
    try {
      await chaptersApi.updateChapter(currentWorkId, currentChapterId, {
        content: currentChapter.content
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
    const { currentWorkId, currentChapterId, currentChapter, hasUnsavedChanges } = get()

    if (!currentWorkId || !currentChapterId || !currentChapter || !hasUnsavedChanges) {
      return
    }

    try {
      await chaptersApi.autoSaveChapter(currentWorkId, currentChapterId, currentChapter.content)
      set({
        hasUnsavedChanges: false,
        lastSavedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('自动保存失败:', error)
    }
  },

  // 设置当前作品
  setCurrentWork: (workId: string) => {
    set({ currentWorkId: workId })
  },

  // 设置当前章节
  setCurrentChapter: (chapterId: string | null) => {
    set({ currentChapterId: chapterId })
  },

  // 设置未保存状态
  setHasUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges })
  },

  // 更新配置
  updateConfig: (config: Partial<EditorConfig>) => {
    set(state => ({
      config: { ...state.config, ...config }
    }))
  },

  // 重置状态
  reset: () => {
    set({
      currentWorkId: null,
      currentChapterId: null,
      chapters: [],
      currentChapter: null,
      isLoading: false,
      isSaving: false,
      lastSavedAt: null,
      hasUnsavedChanges: false,
      config: defaultConfig
    })
  }
}))

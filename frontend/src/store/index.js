import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Main application store - 主应用状态管理
export const useAppStore = create(
  persist(
    (set, get) => ({
      // User info - 用户信息
      user: {
        id: null,
        username: '访客用户',
        avatar: null,
        memberLevel: 'free',
      },

      // Current work being edited - 当前编辑的作品
      currentWork: null,

      // Works list - 作品列表
      works: [],

      // UI state - 界面状态
      sidebarCollapsed: false,
      theme: 'light',

      // Actions - 操作方法
      setUser: (user) => set({ user }),

      setCurrentWork: (work) => set({ currentWork: work }),

      setWorks: (works) => set({ works }),

      addWork: (work) => set((state) => ({
        works: [work, ...state.works]
      })),

      updateWork: (id, updates) => set((state) => ({
        works: state.works.map(work =>
          work.id === id ? { ...work, ...updates } : work
        )
      })),

      deleteWork: (id) => set((state) => ({
        works: state.works.filter(work => work.id !== id)
      })),

      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'jugo-app-storage',
      partialize: (state) => ({
        user: state.user,
        works: state.works,
        theme: state.theme,
      }),
    }
  )
);

// Editor store - 编辑器状态管理
export const useEditorStore = create((set, get) => ({
  // Editor content - 编辑器内容
  content: '',

  // Editor mode - 编辑模式 (novel/screenplay)
  mode: 'novel',

  // Chapters/Scenes - 章节/场景
  chapters: [],

  // Current chapter/scene - 当前章节/场景
  currentChapterId: null,

  // Auto-save status - 自动保存状态
  autoSaveStatus: 'saved', // 'saved' | 'saving' | 'error'

  // AI generation status - AI生成状态
  aiGenerating: false,
  aiProgress: 0,

  // Actions - 操作方法
  setContent: (content) => set({ content }),

  setMode: (mode) => set({ mode }),

  setChapters: (chapters) => set({ chapters }),

  addChapter: (chapter) => set((state) => ({
    chapters: [...state.chapters, chapter]
  })),

  updateChapter: (id, updates) => set((state) => ({
    chapters: state.chapters.map(ch =>
      ch.id === id ? { ...ch, ...updates } : ch
    )
  })),

  deleteChapter: (id) => set((state) => ({
    chapters: state.chapters.filter(ch => ch.id !== id)
  })),

  setCurrentChapter: (id) => set({ currentChapterId: id }),

  setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),

  setAiGenerating: (generating) => set({ aiGenerating: generating }),

  setAiProgress: (progress) => set({ aiProgress: progress }),
}));

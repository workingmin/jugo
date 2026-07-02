import { getDefaultProjectByType, getDefaultProjectView } from './data/projects.js'

const els = {
  html: document.documentElement,
  themeToggle: document.querySelector('#themeToggle'),
  themeIcon: document.querySelector('.theme-icon'),
  themeLabel: document.querySelector('.theme-label'),
  createModal: document.querySelector('#createModal'),
  toast: document.querySelector('#toast')
}

function setTheme(theme) {
  els.html.dataset.theme = theme
  localStorage.setItem('jugo-theme', theme)
  const isDark = theme === 'dark'
  els.themeIcon.textContent = isDark ? '☾' : '☼'
  els.themeLabel.textContent = isDark ? '夜间' : '日间'
}

function getCurrentTheme() {
  return els.html.dataset.theme === 'dark' ? 'dark' : 'light'
}

function showToast(message) {
  els.toast.textContent = message
  els.toast.classList.add('is-visible')
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove('is-visible')
  }, 2400)
}

function openProject(project) {
  const view = getDefaultProjectView(project)
  window.location.href = `./project.html?id=${encodeURIComponent(project.id)}&view=${encodeURIComponent(view)}`
}

function openCreateModal() {
  els.createModal.classList.remove('is-hidden')
}

function closeCreateModal() {
  els.createModal.classList.add('is-hidden')
}

function bindEvents() {
  els.themeToggle.addEventListener('click', () => {
    setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark')
  })

  document.addEventListener('click', (event) => {
    const openCreate = event.target.closest('[data-open-create]')
    const closeModal = event.target.closest('[data-close-modal]')
    const toastButton = event.target.closest('[data-toast]')
    const templateButton = event.target.closest('[data-template]')

    if (openCreate) openCreateModal()
    if (closeModal || event.target === els.createModal) closeCreateModal()
    if (toastButton) showToast(toastButton.dataset.toast)
    if (templateButton) {
      const project = getDefaultProjectByType(templateButton.dataset.template)
      openProject(project)
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCreateModal()
  })
}

function init() {
  setTheme(getCurrentTheme())
  bindEvents()
}

init()

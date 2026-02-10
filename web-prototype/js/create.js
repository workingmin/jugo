// 创作页JavaScript

let currentMode = 'novel';
let currentChapter = 1;
let chapters = [{ id: 1, title: '第1章', content: '' }];
let autoSaveInterval;

// 返回上一页
function goBack() {
  if (confirm('确定要离开吗？未保存的内容将丢失。')) {
    window.location.href = 'index.html';
  }
}

// 保存作品
function saveWork() {
  const title = document.getElementById('workTitle').value || '未命名作品';
  const content = document.getElementById('editor').value;

  // 更新当前章节内容
  const chapter = chapters.find(c => c.id === currentChapter);
  if (chapter) {
    chapter.content = content;
  }

  Utils.showMessage('保存成功！', 'success');
  updateAutoSaveStatus();
}

// 自动保存
function startAutoSave() {
  autoSaveInterval = setInterval(() => {
    const content = document.getElementById('editor').value;
    const chapter = chapters.find(c => c.id === currentChapter);
    if (chapter) {
      chapter.content = content;
    }
    updateAutoSaveStatus();
  }, 30000); // 每30秒自动保存
}

function updateAutoSaveStatus() {
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  document.getElementById('autoSaveStatus').textContent = `已自动保存，上次保存时间：${timeStr}`;
}

// 切换模式
function switchMode(mode) {
  currentMode = mode;

  // 更新按钮状态
  document.getElementById('novelMode').classList.toggle('active', mode === 'novel');
  document.getElementById('scriptMode').classList.toggle('active', mode === 'script');

  // 更新编辑器样式
  const editor = document.getElementById('editor');
  if (mode === 'script') {
    editor.classList.add('script-mode');
    editor.placeholder = '场景：室内 - 咖啡厅 - 白天\n\n角色名\n台词内容...';
  } else {
    editor.classList.remove('script-mode');
    editor.placeholder = '开始您的创作...';
  }

  Utils.showMessage(`已切换到${mode === 'novel' ? '小说' : '剧本'}模式`, 'success');
}

// AI功能
function aiOutline() {
  Utils.showMessage('正在生成大纲...', 'warning');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 15;
    Utils.showProgress('AI生成大纲中', progress);
    if (progress >= 100) {
      clearInterval(interval);
      const outline = `第一章：开端\n- 主角登场，介绍背景\n- 引出主要矛盾\n\n第二章：发展\n- 矛盾升级\n- 引入关键角色\n\n第三章：高潮\n- 矛盾爆发\n- 主角做出选择\n\n第四章：结局\n- 矛盾解决\n- 故事收尾`;
      document.getElementById('editor').value = outline;
      updateWordCount();
      Utils.showMessage('大纲生成完成！', 'success');
    }
  }, 300);
}

function aiContinue() {
  const editor = document.getElementById('editor');
  const currentContent = editor.value;

  if (!currentContent.trim()) {
    Utils.showMessage('请先输入一些内容', 'warning');
    return;
  }

  Utils.showMessage('AI续写中...', 'warning');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    Utils.showProgress('AI续写中', progress);
    if (progress >= 100) {
      clearInterval(interval);
      const continuation = '\n\n夜幕降临，城市的灯光逐渐亮起。主角站在窗前，思绪万千。这一切的开始，似乎都源于那个雨夜的偶然相遇...';
      editor.value = currentContent + continuation;
      updateWordCount();
      Utils.showMessage('续写完成！', 'success');
    }
  }, 250);
}

function aiPolish() {
  const editor = document.getElementById('editor');
  const content = editor.value;

  if (!content.trim()) {
    Utils.showMessage('请先输入内容', 'warning');
    return;
  }

  Utils.showMessage('AI润色中...', 'warning');
  setTimeout(() => {
    Utils.showMessage('润色完成！已优化语句通顺度和表达力', 'success');
  }, 2000);
}

function aiConvert() {
  const targetMode = currentMode === 'novel' ? 'script' : 'novel';
  if (confirm(`确定要将内容转换为${targetMode === 'novel' ? '小说' : '剧本'}格式吗？`)) {
    Utils.showMessage('AI转换中...', 'warning');
    setTimeout(() => {
      switchMode(targetMode);
      Utils.showMessage('转换完成！', 'success');
    }, 2000);
  }
}

// 导出功能
function showExportMenu() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="background: white; padding: 32px; border-radius: 8px; min-width: 400px;">
      <h3 style="margin-bottom: 24px; color: #1F2937;">选择导出格式</h3>
      <button class="btn btn-primary btn-full" onclick="exportAs('pdf')">导出为 PDF</button>
      <button class="btn btn-primary btn-full" onclick="exportAs('word')">导出为 Word</button>
      <button class="btn btn-primary btn-full" onclick="exportAs('txt')">导出为 TXT</button>
      ${currentMode === 'script' ? '<button class="btn btn-primary btn-full" onclick="exportAs(\'fountain\')">导出为 Fountain</button>' : ''}
      <button class="btn btn-full" style="background: #E5E7EB; margin-top: 16px;" onclick="closeModal()">取消</button>
    </div>
  `;

  document.body.appendChild(modal);
  window.currentModal = modal;
}

function exportAs(format) {
  closeModal();
  Utils.showMessage(`正在导出为 ${format.toUpperCase()} 格式...`, 'warning');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    Utils.showProgress('导出中', progress);
    if (progress >= 100) {
      clearInterval(interval);
      Utils.showMessage('导出成功！', 'success');
    }
  }, 200);
}

function closeModal() {
  if (window.currentModal && window.currentModal.parentNode) {
    document.body.removeChild(window.currentModal);
  }
}

// 设置功能
function showSettings() {
  Utils.showMessage('设置功能开发中...', 'warning');
}

// 侧边栏折叠
function toggleSidebar(side) {
  const sidebar = document.getElementById(side === 'left' ? 'leftSidebar' : 'rightSidebar');
  sidebar.classList.toggle('collapsed');
}

// 章节管理
function addChapter() {
  const newChapterId = chapters.length + 1;
  chapters.push({
    id: newChapterId,
    title: `第${newChapterId}章`,
    content: ''
  });

  const chapterList = document.getElementById('chapterList');
  const chapterItem = document.createElement('div');
  chapterItem.className = 'chapter-item';
  chapterItem.textContent = `第${newChapterId}章`;
  chapterItem.onclick = () => switchChapter(newChapterId);
  chapterList.appendChild(chapterItem);

  Utils.showMessage(`已添加第${newChapterId}章`, 'success');
}

function switchChapter(chapterId) {
  // 保存当前章节内容
  const currentContent = document.getElementById('editor').value;
  const currentChapterObj = chapters.find(c => c.id === currentChapter);
  if (currentChapterObj) {
    currentChapterObj.content = currentContent;
  }

  // 切换到新章节
  currentChapter = chapterId;
  const newChapter = chapters.find(c => c.id === chapterId);
  if (newChapter) {
    document.getElementById('editor').value = newChapter.content;
  }

  // 更新UI
  document.querySelectorAll('.chapter-item').forEach((item, index) => {
    item.classList.toggle('active', index + 1 === chapterId);
  });

  updateWordCount();
  updateChapterProgress();
}

// 辅助功能
function showSnowflake() {
  Utils.showMessage('雪花写作法引导功能开发中...', 'warning');
}

function showCharacters() {
  Utils.showMessage('角色库功能开发中...', 'warning');
}

function showPlots() {
  Utils.showMessage('伏笔管理功能开发中...', 'warning');
}

// 夜间模式
function toggleNightMode() {
  document.body.classList.toggle('night-mode');
  const isNight = document.body.classList.contains('night-mode');
  Utils.showMessage(`已切换到${isNight ? '夜间' : '日间'}模式`, 'success');
}

// 更新字数统计
function updateWordCount() {
  const content = document.getElementById('editor').value;
  const wordCount = content.length;
  document.getElementById('wordCount').textContent = `${wordCount}字`;
}

function updateChapterProgress() {
  const content = document.getElementById('editor').value;
  const wordCount = content.length;
  document.getElementById('chapterProgress').textContent =
    `第${currentChapter}章，当前字数：${wordCount}字`;
}

// 实时预览
function updatePreview() {
  const content = document.getElementById('editor').value;
  const previewArea = document.getElementById('previewArea');

  if (content.trim()) {
    previewArea.innerHTML = `<div style="line-height: 1.8; color: #1F2937;">${content.replace(/\n/g, '<br>')}</div>`;
  } else {
    previewArea.innerHTML = '<p class="preview-placeholder">预览区域，编辑内容将实时显示在这里...</p>';
  }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type') || 'novel';
  const workId = urlParams.get('id');

  // 设置初始模式
  switchMode(type);

  // 如果是编辑现有作品，加载作品数据
  if (workId) {
    const work = AppData.works.find(w => w.id === parseInt(workId));
    if (work) {
      document.getElementById('workTitle').value = work.title;
    }
  }

  // 监听编辑器输入
  const editor = document.getElementById('editor');
  editor.addEventListener('input', () => {
    updateWordCount();
    updateChapterProgress();
    updatePreview();
  });

  // 启动自动保存
  startAutoSave();

  // 初始化字数统计
  updateWordCount();
  updateChapterProgress();
});

// 首页JavaScript

// 开始创作
function startCreation(type) {
  Utils.saveToLocal('creationType', type);
  Utils.showMessage(`正在进入${type === 'novel' ? '小说' : '剧本'}创作模式...`);
  setTimeout(() => {
    window.location.href = `create.html?type=${type}`;
  }, 500);
}

// 显示新手引导
function showGuide() {
  const guideSteps = [
    {
      title: '第一步：选择创作类型',
      content: '点击"小说创作"或"剧本创作"按钮，选择您要创作的内容类型。'
    },
    {
      title: '第二步：输入创作构想',
      content: '在编辑区输入您的创作构想，可以是大纲、角色设定或故事梗概。'
    },
    {
      title: '第三步：使用AI辅助',
      content: '点击AI功能按钮（续写、润色、大纲生成），让AI帮助您完善内容。'
    },
    {
      title: '第四步：导出作品',
      content: '创作完成后，点击导出按钮，选择格式（PDF/Word/TXT）导出您的作品。'
    }
  ];

  let currentStep = 0;

  function showStep(step) {
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
      <div style="background: white; padding: 32px; border-radius: 8px; max-width: 500px; width: 90%;">
        <h3 style="color: #1F2937; margin-bottom: 16px;">${guideSteps[step].title}</h3>
        <p style="color: #9CA3AF; margin-bottom: 24px; line-height: 1.6;">${guideSteps[step].content}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #9CA3AF; font-size: 12px;">步骤 ${step + 1}/${guideSteps.length}</span>
          <div style="display: flex; gap: 12px;">
            ${step > 0 ? '<button class="btn" onclick="prevStep()">上一步</button>' : ''}
            ${step < guideSteps.length - 1
              ? '<button class="btn btn-primary" onclick="nextStep()">下一步</button>'
              : '<button class="btn btn-success" onclick="finishGuide()">完成</button>'}
            <button class="btn" style="background: #E5E7EB;" onclick="closeGuide()">跳过</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    window.currentGuideModal = modal;
  }

  window.nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      document.body.removeChild(window.currentGuideModal);
      currentStep++;
      showStep(currentStep);
    }
  };

  window.prevStep = () => {
    if (currentStep > 0) {
      document.body.removeChild(window.currentGuideModal);
      currentStep--;
      showStep(currentStep);
    }
  };

  window.closeGuide = () => {
    document.body.removeChild(window.currentGuideModal);
    Utils.showMessage('已跳过新手引导', 'warning');
  };

  window.finishGuide = () => {
    document.body.removeChild(window.currentGuideModal);
    Utils.showMessage('新手引导完成！', 'success');
  };

  showStep(0);
}

// 跳过引导
function skipGuide() {
  Utils.showMessage('您可以随时在帮助中心查看引导教程', 'warning');
}

// 加载最近作品
function loadRecentWorks() {
  const container = document.getElementById('recentWorks');
  const recentWorks = AppData.works.slice(0, 3);

  if (recentWorks.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: #9CA3AF;">
        <p style="margin-bottom: 16px;">暂无作品</p>
        <button class="btn btn-primary" onclick="location.href='create.html'">开始创作</button>
      </div>
    `;
    return;
  }

  container.innerHTML = recentWorks.map(work => `
    <div class="work-card" onclick="editWork(${work.id})">
      <div class="work-cover">${work.type === 'novel' ? '📖' : '🎬'}</div>
      <h3 class="work-title">${work.title}</h3>
      <div class="work-meta">
        <span class="tag">${work.type === 'novel' ? '小说' : '剧本'}</span>
        <span class="tag">${work.genre}</span>
        <span class="tag">${work.status === 'draft' ? '草稿' : '已完成'}</span>
      </div>
      <div class="work-info">字数：${Utils.formatNumber(work.words)}</div>
      <div class="work-info">更新时间：${work.updatedAt}</div>
      <div class="work-actions">
        <button class="btn btn-primary" onclick="event.stopPropagation(); editWork(${work.id})">编辑</button>
        <button class="btn btn-success" onclick="event.stopPropagation(); exportWork(${work.id})">导出</button>
      </div>
    </div>
  `).join('');
}

// 编辑作品
function editWork(id) {
  const work = AppData.works.find(w => w.id === id);
  if (work) {
    Utils.saveToLocal('currentWork', work);
    window.location.href = `create.html?id=${id}&type=${work.type}`;
  }
}

// 导出作品
function exportWork(id) {
  const work = AppData.works.find(w => w.id === id);
  if (work) {
    Utils.showMessage(`正在导出《${work.title}》...`);
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
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  loadRecentWorks();
});

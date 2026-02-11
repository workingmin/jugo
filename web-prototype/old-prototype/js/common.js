// AI小说剧本创作平台 - 通用JavaScript

// 模拟数据存储
const AppData = {
  currentUser: {
    name: '创作者',
    avatar: '创',
    memberLevel: '免费用户',
    totalWords: 125000,
    totalWorks: 8,
    totalTime: 45
  },
  works: [
    {
      id: 1,
      title: '都市情感小说',
      type: 'novel',
      genre: '都市情感',
      words: 35000,
      status: 'draft',
      createdAt: '2026-02-08',
      updatedAt: '2026-02-10'
    },
    {
      id: 2,
      title: '悬疑短剧剧本',
      type: 'script',
      genre: '悬疑推理',
      words: 12000,
      status: 'completed',
      createdAt: '2026-02-05',
      updatedAt: '2026-02-09'
    },
    {
      id: 3,
      title: '古装爱情剧本',
      type: 'script',
      genre: '古装爱情',
      words: 28000,
      status: 'draft',
      createdAt: '2026-02-01',
      updatedAt: '2026-02-08'
    }
  ],
  materials: [
    {
      id: 1,
      title: '霸道总裁角色模板',
      type: 'character',
      genre: '都市',
      content: '姓名：陆景琛\n性格：外冷内热、霸道专情\n背景：商业帝国继承人...'
    },
    {
      id: 2,
      title: '咖啡厅场景描述',
      type: 'scene',
      genre: '都市',
      content: '午后的阳光透过落地窗洒进咖啡厅...'
    }
  ]
};

// 通用工具函数
const Utils = {
  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  // 格式化数字
  formatNumber(num) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  },

  // 显示提示消息
  showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      background-color: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#EF4444'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, 2000);
  },

  // 显示加载进度
  showProgress(message, progress) {
    let progressEl = document.getElementById('global-progress');
    if (!progressEl) {
      progressEl = document.createElement('div');
      progressEl.id = 'global-progress';
      progressEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        min-width: 300px;
      `;
      document.body.appendChild(progressEl);
    }

    progressEl.innerHTML = `
      <div style="margin-bottom: 12px; color: #1F2937;">${message}</div>
      <div class="progress">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      <div style="margin-top: 8px; text-align: center; color: #9CA3AF; font-size: 12px;">${progress}%</div>
    `;

    if (progress >= 100) {
      setTimeout(() => {
        if (progressEl && progressEl.parentNode) {
          document.body.removeChild(progressEl);
        }
      }, 500);
    }
  },

  // 隐藏进度
  hideProgress() {
    const progressEl = document.getElementById('global-progress');
    if (progressEl && progressEl.parentNode) {
      document.body.removeChild(progressEl);
    }
  },

  // 保存到本地存储
  saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // 从本地存储读取
  loadFromLocal(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
    }
  `;
  document.head.appendChild(style);

  // 设置当前导航项为激活状态
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage.replace('.html', ''))) {
      item.classList.add('active');
    }
  });
});

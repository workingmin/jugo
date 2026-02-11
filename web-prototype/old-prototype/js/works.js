// 作品管理页JavaScript

let currentFilter = 'all';
let allWorks = [...AppData.works];

// 加载作品列表
function loadWorks() {
  const worksGrid = document.getElementById('worksGrid');
  const emptyState = document.getElementById('emptyState');

  let filteredWorks = allWorks;

  // 应用筛选
  if (currentFilter !== 'all') {
    if (currentFilter === 'novel' || currentFilter === 'script') {
      filteredWorks = allWorks.filter(w => w.type === currentFilter);
    } else if (currentFilter === 'draft' || currentFilter === 'completed') {
      filteredWorks = allWorks.filter(w => w.status === currentFilter);
    }
  }

  // 应用搜索
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm) {
    filteredWorks = filteredWorks.filter(w =>
      w.title.toLowerCase().includes(searchTerm) ||
      w.genre.toLowerCase().includes(searchTerm)
    );
  }

  if (filteredWorks.length === 0) {
    worksGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  worksGrid.style.display = 'grid';
  emptyState.style.display = 'none';

  worksGrid.innerHTML = filteredWorks.map(work => `
    <div class="work-card" onclick="editWork(${work.id})">
      <div class="work-cover">${work.type === 'novel' ? '📖' : '🎬'}</div>
      <div class="work-content">
        <h3 class="work-title">${work.title}</h3>
        <div class="work-meta">
          <span class="tag">${work.type === 'novel' ? '小说' : '剧本'}</span>
          <span class="tag">${work.genre}</span>
          <span class="tag">${work.status === 'draft' ? '草稿' : '已完成'}</span>
        </div>
        <div class="work-info">字数：${Utils.formatNumber(work.words)}</div>
        <div class="work-info">创建时间：${work.createdAt}</div>
        <div class="work-info">更新时间：${work.updatedAt}</div>
        <div class="work-actions">
          <button class="btn btn-primary" onclick="event.stopPropagation(); editWork(${work.id})">编辑</button>
          <button class="btn btn-success" onclick="event.stopPropagation(); exportWork(${work.id})">导出</button>
          <button class="btn btn-danger" onclick="event.stopPropagation(); deleteWork(${work.id})">删除</button>
        </div>
      </div>
    </div>
  `).join('');
}

// 筛选作品
function filterWorks(filter) {
  currentFilter = filter;

  // 更新按钮状态
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.classList.remove('active');
  });
  event.target.classList.add('active');

  loadWorks();
}

// 编辑作品
function editWork(id) {
  const work = allWorks.find(w => w.id === id);
  if (work) {
    Utils.saveToLocal('currentWork', work);
    window.location.href = `create.html?id=${id}&type=${work.type}`;
  }
}

// 导出作品
function exportWork(id) {
  const work = allWorks.find(w => w.id === id);
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

// 删除作品
function deleteWork(id) {
  const work = allWorks.find(w => w.id === id);
  if (work && confirm(`确定要删除《${work.title}》吗？此操作不可恢复。`)) {
    allWorks = allWorks.filter(w => w.id !== id);
    AppData.works = allWorks;
    Utils.showMessage('删除成功', 'success');
    loadWorks();
  }
}

// 搜索作品
document.addEventListener('DOMContentLoaded', () => {
  loadWorks();

  // 监听搜索输入
  document.getElementById('searchInput').addEventListener('input', () => {
    loadWorks();
  });
});

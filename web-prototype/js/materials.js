// 素材库页JavaScript

let currentFilter = 'all';
let allMaterials = [...AppData.materials];

const materialIcons = {
  character: '👤',
  scene: '🏞️',
  dialogue: '💬',
  plot: '📖'
};

function loadMaterials() {
  const materialsGrid = document.getElementById('materialsGrid');
  const emptyState = document.getElementById('emptyState');

  let filteredMaterials = allMaterials;

  if (currentFilter !== 'all') {
    filteredMaterials = allMaterials.filter(m => m.type === currentFilter);
  }

  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm) {
    filteredMaterials = filteredMaterials.filter(m =>
      m.title.toLowerCase().includes(searchTerm) ||
      m.genre.toLowerCase().includes(searchTerm)
    );
  }

  if (filteredMaterials.length === 0) {
    materialsGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  materialsGrid.style.display = 'grid';
  emptyState.style.display = 'none';

  materialsGrid.innerHTML = filteredMaterials.map(material => `
    <div class="material-card" onclick="viewMaterial(${material.id})">
      <div class="material-icon">${materialIcons[material.type] || '📄'}</div>
      <h3 class="material-title">${material.title}</h3>
      <div class="work-meta">
        <span class="tag">${getTypeName(material.type)}</span>
        <span class="tag">${material.genre}</span>
      </div>
      <div class="material-preview">${material.content}</div>
      <div class="material-actions">
        <button class="btn btn-primary" onclick="event.stopPropagation(); copyMaterial(${material.id})">复制</button>
        <button class="btn btn-warning" onclick="event.stopPropagation(); editMaterial(${material.id})">编辑</button>
      </div>
    </div>
  `).join('');
}

function getTypeName(type) {
  const names = {
    character: '角色',
    scene: '场景',
    dialogue: '台词',
    plot: '梗料'
  };
  return names[type] || type;
}

function filterMaterials(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.classList.remove('active');
  });
  event.target.classList.add('active');
  loadMaterials();
}

function viewMaterial(id) {
  const material = allMaterials.find(m => m.id === id);
  if (material) {
    alert(`${material.title}\n\n${material.content}`);
  }
}

function copyMaterial(id) {
  const material = allMaterials.find(m => m.id === id);
  if (material) {
    Utils.showMessage(`已复制《${material.title}》到剪贴板`, 'success');
  }
}

function editMaterial(id) {
  Utils.showMessage('编辑功能开发中...', 'warning');
}

function createMaterial() {
  Utils.showMessage('创建素材功能开发中...', 'warning');
}

document.addEventListener('DOMContentLoaded', () => {
  loadMaterials();
  document.getElementById('searchInput').addEventListener('input', loadMaterials);
});

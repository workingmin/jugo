// 个人中心页JavaScript

function logout() {
  if (confirm('确定要退出登录吗？')) {
    Utils.showMessage('已退出登录', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// 页面加载时显示用户数据
document.addEventListener('DOMContentLoaded', () => {
  const user = AppData.currentUser;

  // 更新统计数据
  document.querySelector('.stat-value').textContent = Utils.formatNumber(user.totalWords);
  document.querySelectorAll('.stat-value')[1].textContent = user.totalWorks;
  document.querySelectorAll('.stat-value')[2].textContent = user.totalTime + '小时';
});

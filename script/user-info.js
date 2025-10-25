function renderUserArea() {
    const userArea = document.getElementById('user-area');
    if (!userArea) return;
  
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
    if (isLoggedIn) {
      const fullname = localStorage.getItem('userFullname') || 'Người dùng';
      userArea.innerHTML = `
        <div class="user-name" id="user-name">Xin chào, ${fullname}</div>
      `;
      document.getElementById('user-name').addEventListener('click', openProfile);
    } else {
      userArea.innerHTML = `
        <a href="dangnhap.html"><i class="fas fa-user"></i> Đăng nhập</a>
        <a href="dangky.html"><i class="fas fa-user-plus"></i> Đăng ký</a>
      `;
    }
  }
  
  function openProfile() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
  
    document.getElementById('p-fullname').textContent = localStorage.getItem('userFullname') || '';
    document.getElementById('p-email').textContent = localStorage.getItem('userEmail') || '';
    document.getElementById('p-phone').textContent = localStorage.getItem('userPhone') || '';
    document.getElementById('p-address').textContent = localStorage.getItem('userAddress') || '';
  
    modal.style.display = 'flex';
  }
  
  function closeProfile() {
    document.getElementById('profile-modal').style.display = 'none';
  }
  
  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userFullname');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userAddress');
    window.location.href = 'index.html';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    renderUserArea();
    const closeBtn = document.getElementById('close-profile');
    if (closeBtn) closeBtn.addEventListener('click', closeProfile);
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', logout);
    const modal = document.getElementById('profile-modal');
    if (modal) modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProfile();
    });
  });
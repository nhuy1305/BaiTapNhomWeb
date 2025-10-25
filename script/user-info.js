// ==================== HIỂN THỊ KHU VỰC NGƯỜI DÙNG ====================
function renderUserArea() {
    const userArea = document.getElementById('user-area');
    if (!userArea) return;
  
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
    if (isLoggedIn) {
      const fullname = localStorage.getItem('userFullname') || 'Người dùng';
      userArea.innerHTML = `
        <div class="user-name" id="user-name">Xin chào, ${fullname}</div>
      `;
  
      // Khi nhấn vào tên => mở modal thông tin
      const userName = document.getElementById('user-name');
      if (userName) userName.addEventListener('click', openProfile);
    } else {
      // Nếu chưa đăng nhập => hiện liên kết đăng nhập, đăng ký
      userArea.innerHTML = `
        <a href="dangnhap.html"><i class="fas fa-user"></i> Đăng nhập</a>
        <a href="dangky.html"><i class="fas fa-user-plus"></i> Đăng ký</a>
      `;
    }
  }
  
  // ==================== MỞ MODAL THÔNG TIN NGƯỜI DÙNG ====================
  function openProfile() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
  
    // Gán dữ liệu người dùng
    document.getElementById('p-fullname').textContent = localStorage.getItem('userFullname') || '';
    document.getElementById('p-email').textContent = localStorage.getItem('userEmail') || '';
    document.getElementById('p-phone').textContent = localStorage.getItem('userPhone') || '';
    document.getElementById('p-address').textContent = localStorage.getItem('userAddress') || '';
  
    // Hiện modal
    modal.classList.add('active');
  }
  
  // ==================== ĐÓNG MODAL ====================
  function closeProfile() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.remove('active');
  }
  
  // ==================== ĐĂNG XUẤT ====================
  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userFullname');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userAddress');
    window.location.href = 'index.html';
  }
  
  // ==================== SỰ KIỆN KHI TRANG LOAD ====================
  document.addEventListener('DOMContentLoaded', () => {
    renderUserArea();
  
    const closeBtn = document.getElementById('close-profile');
    if (closeBtn) closeBtn.addEventListener('click', closeProfile);
  
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', logout);
  
    const modal = document.getElementById('profile-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProfile();
      });
    }
  });
  
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Đăng nhập thành công!");
  window.location.href = "index.html";
});

localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('userPhone', document.getElementById('email').value); // Tùy chỉnh field
window.location.href = 'index.html'; // Hoặc quay lại trang trước

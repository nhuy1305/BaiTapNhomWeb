// ====== Đăng nhập người dùng ======
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    
    // Lấy thông tin từ Local Storage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const storedUser = users.find(u => u.email === email && u.password === password);

    if (!storedUser) {
        alert("Chưa có tài khoản nào được đăng ký!");
        return;
    }
    
    // === SỬA ĐOẠN NÀY TRONG dangnhap.js ===
if (email === storedUser.email && password === storedUser.password) {
    // Tạo userId duy nhất
    const userId = storedUser.email; // Dùng email làm ID

    // Lưu currentUser đầy đủ
    localStorage.setItem('currentUser', JSON.stringify({
        id: userId,
        fullname: `${storedUser.firstName} ${storedUser.lastName}`,
        email: storedUser.email,
        phone: storedUser.phone,
        address: storedUser.address
    }));

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userFullname', `${storedUser.firstName} ${storedUser.lastName}`);
    localStorage.setItem('userEmail', storedUser.email);
    localStorage.setItem('userPhone', storedUser.phone);
    localStorage.setItem('userAddress', storedUser.address);

    alert("Đăng nhập thành công!");
    const returnUrl = sessionStorage.getItem('returnUrl');
    if (returnUrl) {
        sessionStorage.removeItem('returnUrl');
        window.location.href = returnUrl;
    } else {
        window.location.href = "index.html";
    }
    } else {
        alert("Email hoặc mật khẩu không đúng, vui lòng thử lại!");
    }
});

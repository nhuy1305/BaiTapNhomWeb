document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Lấy thông tin từ Local Storage
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (!storedUser) {
        alert("Chưa có tài khoản nào được đăng ký!");
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {
        alert("Đăng nhập thành công!");
        window.location.href = "index.html"; // chuyển về trang chủ
    } else {
        alert("Email hoặc mật khẩu không đúng, vui lòng thử lại!");
    }
});

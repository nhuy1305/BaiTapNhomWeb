document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const address = document.getElementById("address").value.trim();

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    const user = {
        firstName,
        lastName,
        email,
        phone,
        password,
        address
    };

    // Lưu vào Local Storage
    localStorage.setItem("userData", JSON.stringify(user));
    alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
    window.location.href = "dangnhap.html";
});

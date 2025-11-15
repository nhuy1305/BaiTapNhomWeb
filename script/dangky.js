function capitalizeWords(str) {
    return str.split(" ").map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
  }
 
  // ======================
  // HÀM VIẾT HOA ĐỊA CHỈ
  // ======================
  function capitalizeAddress(address) {
    return address.split(",").map(part => {
      return part.trim().split(" ").map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(" ");
    }).join(", ");
  }
 
  // ======================
  // SỰ KIỆN ĐĂNG KÝ
  // ======================
  document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
 
    let firstName = document.getElementById("first-name").value.trim();
    let lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    let address = document.getElementById("address").value.trim();
 
    // ====== KIỂM TRA MẬT KHẨU ======
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
 
    // ====== KIỂM TRA SỐ ĐIỆN THOẠI ======
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Số điện thoại phải có 10 số và bắt đầu bằng 0!");
      return;
    }
 
    // ====== KIỂM TRA ĐỊA CHỈ ======
    if (address) {
      const parts = address.split(",").map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length < 4) {
        alert("Địa chỉ phải gồm: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố!");
        return;
      }
      address = capitalizeAddress(address);
    }
    firstName = capitalizeWords(firstName);
    lastName = capitalizeWords(lastName);
 
    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      password,
      address
    };
    let users = JSON.parse(localStorage.getItem("users")) || [];
 
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      alert("Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập!");
      return;
    }
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
 
    console.log("=== ĐĂNG KÝ THÀNH CÔNG ===");
    console.log("User data:", newUser);
 
    alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
    window.location.href = "dangnhap.html";
  });

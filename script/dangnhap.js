<<<<<<< HEAD
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
        // LƯU TRẠNG THÁI ĐĂNG NHẬP
        localStorage.setItem('isLoggedIn', 'true');
        
        // GHÉP HỌ VÀ TÊN THÀNH FULLNAME
        const fullname = `${storedUser.firstName} ${storedUser.lastName}`;
        
        // LƯU THÔNG TIN NGƯỜI DÙNG ĐỂ TỰ ĐỘNG ĐIỀN
        localStorage.setItem('userFullname', fullname);
        localStorage.setItem('userPhone', storedUser.phone);
        localStorage.setItem('userEmail', storedUser.email);
        localStorage.setItem('userAddress', storedUser.address);
        
        console.log('=== ĐĂNG NHẬP THÀNH CÔNG ===');
        console.log('Fullname:', fullname);
        console.log('Phone:', storedUser.phone);
        console.log('Address:', storedUser.address);
        
        alert("Đăng nhập thành công!");
        
        // Kiểm tra xem có đang từ trang thanhtoan không
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            window.location.href = returnUrl;
        } else {
            window.location.href = "index.html"; // chuyển về trang chủ
        }
    } else {
        alert("Email hoặc mật khẩu không đúng, vui lòng thử lại!");
    }
});
=======
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
        // LƯU TRẠNG THÁI ĐĂNG NHẬP
        localStorage.setItem('isLoggedIn', 'true');
        
        // GHÉP HỌ VÀ TÊN THÀNH FULLNAME
        const fullname = `${storedUser.firstName} ${storedUser.lastName}`;
        
        // LƯU THÔNG TIN NGƯỜI DÙNG ĐỂ TỰ ĐỘNG ĐIỀN
        localStorage.setItem('userFullname', fullname);
        localStorage.setItem('userPhone', storedUser.phone);
        localStorage.setItem('userEmail', storedUser.email);
        localStorage.setItem('userAddress', storedUser.address);
        
        console.log('=== ĐĂNG NHẬP THÀNH CÔNG ===');
        console.log('Fullname:', fullname);
        console.log('Phone:', storedUser.phone);
        console.log('Address:', storedUser.address);
        
        alert("Đăng nhập thành công!");
        
        // Kiểm tra xem có đang từ trang thanhtoan không
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            window.location.href = returnUrl;
        } else {
            window.location.href = "index.html"; // chuyển về trang chủ
        }
    } else {
        alert("Email hoặc mật khẩu không đúng, vui lòng thử lại!");
    }
});
>>>>>>> d7489afe35c11a07a6fb7ea04adef051ff3c2cc5

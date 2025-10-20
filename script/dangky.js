<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 99c300991fa7dd002c17ed4da51ab2b3553a04c7
// HÀM VIẾT HOA CHỮ CÁI ĐẦU
function capitalizeWords(str) {
    return str.split(' ').map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

// HÀM VIẾT HOA ĐỊA CHỈ (theo format: số nhà, đường, phường, quận, tỉnh)
function capitalizeAddress(address) {
    return address.split(',').map(part => {
        return part.trim().split(' ').map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }).join(', ');
}

document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    let firstName = document.getElementById("first-name").value.trim();
    let lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    let address = document.getElementById("address").value.trim();
    
    // VALIDATION MẬT KHẨU
    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }
    
    // VALIDATION SỐ ĐIỆN THOẠI
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("Số điện thoại phải có 10 số và bắt đầu bằng 0!");
        return;
    }
    
    // VALIDATION ĐỊA CHỈ (nếu có nhập)
    if (address) {
        const addressParts = address.split(',').map(part => part.trim()).filter(part => part.length > 0);
        if (addressParts.length < 4) {
            alert("Địa chỉ phải bao gồm: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố");
            return;
        }
        // VIẾT HOA CHỮ CÁI ĐẦU CỦA ĐỊA CHỈ
        address = capitalizeAddress(address);
    }
    
    // VIẾT HOA CHỮ CÁI ĐẦU CỦA HỌ VÀ TÊN
    firstName = capitalizeWords(firstName);
    lastName = capitalizeWords(lastName);
    
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
    
    console.log('=== ĐĂNG KÝ THÀNH CÔNG ===');
    console.log('User data:', user);
    
    alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
    window.location.href = "dangnhap.html";
});
<<<<<<< HEAD
=======
=======
// HÀM VIẾT HOA CHỮ CÁI ĐẦU
function capitalizeWords(str) {
    return str.split(' ').map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

// HÀM VIẾT HOA ĐỊA CHỈ (theo format: số nhà, đường, phường, quận, tỉnh)
function capitalizeAddress(address) {
    return address.split(',').map(part => {
        return part.trim().split(' ').map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }).join(', ');
}

document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    let firstName = document.getElementById("first-name").value.trim();
    let lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    let address = document.getElementById("address").value.trim();
    
    // VALIDATION MẬT KHẨU
    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }
    
    // VALIDATION SỐ ĐIỆN THOẠI
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("Số điện thoại phải có 10 số và bắt đầu bằng 0!");
        return;
    }
    
    // VALIDATION ĐỊA CHỈ (nếu có nhập)
    if (address) {
        const addressParts = address.split(',').map(part => part.trim()).filter(part => part.length > 0);
        if (addressParts.length < 4) {
            alert("Địa chỉ phải bao gồm: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố");
            return;
        }
        // VIẾT HOA CHỮ CÁI ĐẦU CỦA ĐỊA CHỈ
        address = capitalizeAddress(address);
    }
    
    // VIẾT HOA CHỮ CÁI ĐẦU CỦA HỌ VÀ TÊN
    firstName = capitalizeWords(firstName);
    lastName = capitalizeWords(lastName);
    
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
    
    console.log('=== ĐĂNG KÝ THÀNH CÔNG ===');
    console.log('User data:', user);
    
    alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
    window.location.href = "dangnhap.html";
});
>>>>>>> d7489afe35c11a07a6fb7ea04adef051ff3c2cc5
>>>>>>> 99c300991fa7dd002c17ed4da51ab2b3553a04c7

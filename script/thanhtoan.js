document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    if (!isLoggedIn) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        document.getElementById('fullname').value = localStorage.getItem('userFullname') || '';
        document.getElementById('name').value = localStorage.getItem('userPhone') || '';
        document.getElementById('address').value = localStorage.getItem('userAddress') || '';
    }

    // Load cart từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');

    // Xử lý duplication: Gộp các sản phẩm có cùng id
    const uniqueCart = [];
    const seenIds = new Set();
    cart.forEach(item => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueCart.push({ ...item, quantity: item.quantity || 1 });
        } else {
            // Nếu đã tồn tại, tăng quantity cho item đã có
            const existing = uniqueCart.find(i => i.id === item.id);
            if (existing) existing.quantity += (item.quantity || 1);
        }
    });

    // Hiển thị sản phẩm (chỉ 1 lần cho mỗi id)
    orderItems.innerHTML = ''; // Xóa nội dung cũ
    let subtotal = 0;
    
    uniqueCart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        const itemTotal = item.price * (item.quantity || 1);
        itemDiv.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}">
            <span>${item.name} x${item.quantity || 1}</span>
            <span>${itemTotal.toLocaleString()}đ</span>
        `;
        orderItems.appendChild(itemDiv);
        subtotal += itemTotal;
    });

    // Nếu cart rỗng, thêm 1 sản phẩm mẫu
    if (uniqueCart.length === 0) {
        const defaultItem = { 
            id: 'default-1',
            name: "Cải kale (Xanh) Organic 300gr", 
            price: 35000, 
            quantity: 1, 
            image: "https://via.placeholder.com/50" 
        };
        uniqueCart.push(defaultItem);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${defaultItem.image}" alt="${defaultItem.name}">
            <span>${defaultItem.name} x${defaultItem.quantity}</span>
            <span>${(defaultItem.price * defaultItem.quantity).toLocaleString()}đ</span>
        `;
        orderItems.appendChild(itemDiv);
        subtotal = defaultItem.price * defaultItem.quantity;
    }

    // HÀM TÍNH PHÍ VẬN CHUYỂN
    function calculateShipping(address) {
        const addressUpper = address.toUpperCase();
        if (addressUpper.includes('HCM') || addressUpper.includes('TPHCM')) {
            return 0;
        }
        return 30000;
    }

    // HÀM VIẾT HOA CHỮ CÁI ĐẦU
    function capitalizeAddress(address) {
        return address.split(',').map(part => {
            return part.trim().split(' ').map(word => {
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
        }).join(', ');
    }

    // Tính phí vận chuyển ban đầu
    let shipping = 0;
    const total = subtotal + shipping;
    
    // Cập nhật hiển thị tổng tiền
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
    document.getElementById('total').textContent = (subtotal + shipping).toLocaleString() + 'đ';

    // CẬP NHẬT PHÍ VẬN CHUYỂN KHI NGƯỜI DÙNG NHẬP ĐỊA CHỈ
    const addressInput = document.getElementById('address');
    addressInput.addEventListener('input', function() {
        const address = this.value.trim();
        if (address) {
            shipping = calculateShipping(address);
            document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
            document.getElementById('total').textContent = (subtotal + shipping).toLocaleString() + 'đ';
        }
    });

    // Validation (giữ nguyên logic cũ + thêm validation địa chỉ)
    const inputs = {
        fullname: document.getElementById('fullname'),
        name: document.getElementById('name'),
        address: document.getElementById('address')
    };
    const errors = {
        fullname: document.getElementById('fullname-error'),
        name: document.getElementById('name-error'),
        address: document.getElementById('address-error')
    };

    function validateInputs() {
        let isValid = true;
        const fullname = inputs.fullname.value.trim();
        if (!fullname || fullname.split(/\s+/).filter(word => word.length > 0).length < 2) {
            inputs.fullname.classList.add('error-border');
            errors.fullname.textContent = !fullname ? 'Vui lòng nhập họ tên' : 'Vui lòng nhập họ tên với ít nhất 2 từ';
            errors.fullname.style.visibility = 'visible';
            isValid = false;
        } else {
            inputs.fullname.classList.remove('error-border');
            errors.fullname.style.visibility = 'hidden';
        }

        const phone = inputs.name.value.trim();
        const phoneRegex = /^0\d{9}$/;
        if (!phone || !phoneRegex.test(phone)) {
            inputs.name.classList.add('error-border');
            errors.name.textContent = !phone ? 'Vui lòng nhập số điện thoại' : 'Vui lòng nhập số điện thoại 10 số bắt đầu bằng 0';
            errors.name.style.visibility = 'visible';
            isValid = false;
        } else {
            inputs.name.classList.remove('error-border');
            errors.name.style.visibility = 'hidden';
        }

        // VALIDATION ĐỊA CHỈ
        const address = inputs.address.value.trim();
        if (!address) {
            inputs.address.classList.add('error-border');
            errors.address.textContent = 'Vui lòng nhập địa chỉ';
            errors.address.style.visibility = 'visible';
            isValid = false;
        } else {
            // Kiểm tra định dạng địa chỉ: phải có ít nhất 4 phần cách nhau bởi dấu phẩy
            const addressParts = address.split(',').map(part => part.trim()).filter(part => part.length > 0);
            if (addressParts.length < 4) {
                inputs.address.classList.add('error-border');
                errors.address.textContent = 'Địa chỉ phải bao gồm: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố';
                errors.address.style.visibility = 'visible';
                isValid = false;
            } else {
                inputs.address.classList.remove('error-border');
                errors.address.style.visibility = 'hidden';
            }
        }

        return isValid;
    }

    Object.values(inputs).forEach(input => {
        input.addEventListener('input', validateInputs);
    });

    const bankRadio = document.getElementById('bank');
    const generateQRButton = document.getElementById('generateQR');
    const qrSection = document.getElementById('qrSection');
    if (bankRadio) {
        bankRadio.addEventListener('change', () => {
            generateQRButton.style.display = bankRadio.checked ? 'block' : 'none';
            qrSection.style.display = 'none';
        });
    }
    if (generateQRButton) {
        generateQRButton.addEventListener('click', () => {
            qrSection.style.display = 'block';
        });
    }

    const placeOrderButton = document.getElementById('placeOrder');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function() {
            if (validateInputs()) {
                const fullname = document.getElementById('fullname').value;
                const name = document.getElementById('name').value;
                let address = document.getElementById('address').value.trim();
                
                // VIẾT HOA CHỮ CÁI ĐẦU CỦA ĐỊA CHỈ
                address = capitalizeAddress(address);
                
                // Tính lại phí vận chuyển cuối cùng
                shipping = calculateShipping(address);
                const finalTotal = subtotal + shipping;
                
                // Lưu thông tin khách hàng
                localStorage.setItem('userFullname', fullname);
                localStorage.setItem('userPhone', name);
                localStorage.setItem('userAddress', address);
                
                // MERGE CART MỘT LẦN NỮA ĐỂ ĐẢM BẢO KHÔNG CÒN DUPLICATE
                const finalCart = mergeDuplicateItems(uniqueCart);
                
                // LƯU CART ĐÃ MERGE VÀO LOCALSTORAGE
                localStorage.setItem('cart', JSON.stringify(finalCart));
                
                // LƯU THÔNG TIN GIÁ VÀO LOCALSTORAGE
                localStorage.setItem('orderSubtotal', subtotal.toString());
                localStorage.setItem('orderShipping', shipping.toString());
                localStorage.setItem('orderTotal', finalTotal.toString());
                
                // DEBUG: Log trước khi chuyển trang
                console.log('=== BEFORE REDIRECT ===');
                console.log('Final Cart:', finalCart);
                console.log('Address (capitalized):', address);
                console.log('Saved Subtotal:', localStorage.getItem('orderSubtotal'));
                console.log('Saved Shipping:', localStorage.getItem('orderShipping'));
                console.log('Saved Total:', localStorage.getItem('orderTotal'));
                
                alert('Đơn hàng được tạo thành công!');
                window.location.href = 'chitiethoadon.html';
            }
        });
    }
});

// Hàm merge duplicate items
function mergeDuplicateItems(cart) {
    const merged = {};
    cart.forEach(item => {
        if (merged[item.id]) {
            merged[item.id].quantity += parseInt(item.quantity) || 1;
        } else {
            merged[item.id] = { ...item, quantity: parseInt(item.quantity) || 1 };
        }
    });
    return Object.values(merged);
}

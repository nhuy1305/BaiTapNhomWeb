
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
            uniqueCart.push(item);
        } else {
            // Nếu đã tồn tại, tăng quantity cho item đã có
            const existing = uniqueCart.find(i => i.id === item.id);
            if (existing) existing.quantity += item.quantity || 1;
        }
    });

    // Hiển thị sản phẩm (chỉ 1 lần cho mỗi id)
    orderItems.innerHTML = ''; // Xóa nội dung cũ
    let subtotal = 0;
    uniqueCart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}">
            <span>${item.name} x${item.quantity || 1}</span>
            <span>${(item.price * (item.quantity || 1)).toLocaleString()}đ</span>
        `;
        orderItems.appendChild(itemDiv);
        subtotal += item.price * (item.quantity || 1);
    });

    // Nếu cart rỗng, thêm 1 sản phẩm mẫu
    if (uniqueCart.length === 0) {
        const defaultItem = { name: "Cải kale (Xanh) Organic 300gr", price: 35000, quantity: 1, image: "https://via.placeholder.com/50" };
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

    // Cập nhật tổng tiền
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('total').textContent = subtotal.toLocaleString() + 'đ';

    // Validation (giữ nguyên logic cũ)
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

        if (!inputs.address.value.trim()) {
            inputs.address.classList.add('error-border');
            errors.address.textContent = 'Vui lòng nhập địa chỉ';
            errors.address.style.visibility = 'visible';
            isValid = false;
        } else {
            inputs.address.classList.remove('error-border');
            errors.address.style.visibility = 'hidden';
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
                const address = document.getElementById('address').value;
                localStorage.setItem('userFullname', fullname);
                localStorage.setItem('userPhone', name);
                localStorage.setItem('userAddress', address);
                alert('Đặt hàng thành công!');
                window.location.href = 'chitiethoadon.html';
            }
        });
    }
});

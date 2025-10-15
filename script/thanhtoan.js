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

    // Clear cart nếu rỗng hoặc test, chỉ giữ 1 sản phẩm mẫu nếu chưa có
    if (cart.length === 0) {
        cart = [{ name: "Cải kale (Xanh) Organic 300gr", price: 35000, quantity: 1, image: "https://via.placeholder.com/50" }]; // 1 sản phẩm mẫu như cũ
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Hiển thị chỉ 1 sản phẩm đầu tiên (fix duplication)
    const firstItem = cart[0]; // Chỉ lấy sản phẩm đầu tiên
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    itemDiv.innerHTML = `
        <img src="${firstItem.image || 'https://via.placeholder.com/50'}" alt="${firstItem.name}">
        <span>${firstItem.name} x${firstItem.quantity}</span>
        <span>${(firstItem.price * firstItem.quantity).toLocaleString()}đ</span>
    `;
    orderItems.appendChild(itemDiv);

    // Tính tổng tiền (chỉ từ 1 sản phẩm)
    const subtotal = firstItem.price * firstItem.quantity;
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('total').textContent = subtotal.toLocaleString() + 'đ';

    // Validation
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

        // Họ tên (ít nhất 2 từ)
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

        // Số điện thoại (10 số, bắt đầu bằng 0)
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

        // Địa chỉ (không để trống)
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

    // Realtime validation
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', validateInputs);
    });

    // Phương thức thanh toán
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

    // Đặt hàng
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

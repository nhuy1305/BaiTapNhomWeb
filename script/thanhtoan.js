document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    if (!isLoggedIn) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        const userPhone = localStorage.getItem('userPhone') || '';
        const userEmail = localStorage.getItem('userEmail') || '';
        const userAddress = localStorage.getItem('userAddress') || '';
        document.getElementById('fullname').value = localStorage.getItem('userFullname') || '';
        document.getElementById('name').value = userPhone;
        document.getElementById('address').value = userAddress;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Merge duplicate items trước khi hiển thị (phòng hờ cart cũ bị lỗi)
    cart = mergeDuplicateItems(cart);

    const orderItems = document.getElementById('order-items');
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}">
            <span>${item.name} x${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()}đ</span>
        `;
        orderItems.appendChild(itemDiv);
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('total').textContent = subtotal.toLocaleString() + 'đ';

    // ... (giữ nguyên phần validation, payment, placeOrder như cũ)

    // Đặt hàng
    document.getElementById('placeOrder').addEventListener('click', function() {
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
});

// Hàm mới: Merge duplicate items dựa trên id
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

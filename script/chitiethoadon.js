document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderPhone = localStorage.getItem('userPhone') || 'Chưa có thông tin';
    const orderEmail = localStorage.getItem('userEmail') || 'Chưa có thông tin';
    const orderAddress = localStorage.getItem('userAddress') || 'Chưa có thông tin';

    // Merge duplicate items trước khi hiển thị
    cart = mergeDuplicateItems(cart);

    // Hiển thị thông tin khách hàng
    document.getElementById('order-phone').textContent = orderPhone;
    document.getElementById('order-email').textContent = orderEmail;
    document.getElementById('order-address').textContent = orderAddress;

    // Hiển thị danh sách sản phẩm
    const orderItemList = document.getElementById('order-item-list');
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}"> ${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString()}đ</td>
            <td>${(item.price * item.quantity).toLocaleString()}đ</td>
        `;
        orderItemList.appendChild(row);
    });

    // Tính tổng tiền
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    const shipping = 0; // Có thể thay bằng phí vận chuyển thực tế
    document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
    document.getElementById('total').textContent = (subtotal + shipping).toLocaleString() + 'đ';

    // Thiết lập ngày đặt hàng
    const orderDate = new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    document.getElementById('order-date').textContent = orderDate;

    // Xóa giỏ hàng sau khi hiển thị
    localStorage.removeItem('cart');
    document.getElementById('cart-count').textContent = '0';
});

// Hàm merge duplicate items (tương tự thanhtoan.js)
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

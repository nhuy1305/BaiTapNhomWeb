document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderPhone = localStorage.getItem('userPhone') || 'Chưa có thông tin';
    const orderEmail = localStorage.getItem('userEmail') || `user_${orderPhone.replace(/[^0-9]/g, '')}@rausachonline.com`; // Tạo email giả lập
    const orderAddress = localStorage.getItem('userAddress') || 'Chưa có thông tin';

    // Gộp các sản phẩm trùng lặp
    const uniqueCart = [];
    const seenIds = new Set();
    cart.forEach(item => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueCart.push(item);
        } else {
            const existing = uniqueCart.find(i => i.id === item.id);
            if (existing) existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
        }
    });

    // Hiển thị thông tin khách hàng
    document.getElementById('order-phone').textContent = orderPhone;
    document.getElementById('order-email').textContent = orderEmail;
    document.getElementById('order-address').textContent = orderAddress;

    // Hiển thị danh sách sản phẩm
    const orderItemList = document.getElementById('order-item-list');
    let subtotal = 0;
    uniqueCart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}"> ${item.name}</td>
            <td>${item.quantity || 1}</td>
            <td>${item.price.toLocaleString()}đ</td>
            <td>${(item.price * (item.quantity || 1)).toLocaleString()}đ</td>
        `;
        orderItemList.appendChild(row);
        subtotal += item.price * (item.quantity || 1);
    });

    // Tính tổng tiền
    const shipping = 0; // Có thể thay bằng phí vận chuyển thực tế
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
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

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== CHITIETHOADON.JS START ===');

    // === BƯỚC 1: KIỂM TRA ĐĂNG NHẬP ===
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Vui lòng đăng nhập để xem chi tiết đơn hàng!");
        window.location.href = "dangnhap.html";
        return;
    }

    // === BƯỚC 2: LẤY ĐƠN HÀNG CỦA USER ===
    const userOrdersKey = `orders_${currentUser.id}`;
    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

    if (userOrders.length === 0) {
        alert("Không tìm thấy đơn hàng nào!");
        window.location.href = "donhang.html";
        return;
    }

    // Lấy đơn hàng mới nhất
    const latestOrder = userOrders[userOrders.length - 1];

    // === BƯỚC 3: HIỂN THỊ THÔNG TIN KHÁCH HÀNG ===
    document.getElementById('order-phone').textContent = currentUser.phone || 'Chưa có';
    document.getElementById('order-email').textContent = currentUser.email || 'Chưa có';
    document.getElementById('order-address').textContent = latestOrder.address || 'Chưa có';

    // === BƯỚC 4: HIỂN THỊ SẢN PHẨM ===
    const orderItemList = document.getElementById('order-item-list');
    orderItemList.innerHTML = ''; // Xóa nội dung cũ

    if (latestOrder.items && latestOrder.items.length > 0) {
        latestOrder.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${item.image || 'https://via.placeholder.com/50'}" 
                         alt="${item.name}" 
                         style="width:50px; height:50px; object-fit:cover; margin-right:10px; vertical-align:middle;">
                    ${item.name}
                </td>
                <td style="text-align:center;">${item.quantity}</td>
                <td>${parseInt(item.price).toLocaleString()}đ</td>
                <td>${(parseInt(item.price) * parseInt(item.quantity)).toLocaleString()}đ</td>
            `;
            orderItemList.appendChild(row);
        });
    } else {
        orderItemList.innerHTML = '<tr><td colspan="4">Không có sản phẩm</td></tr>';
    }

    // === BƯỚC 5: HIỂN THỊ GIÁ TIỀN ===
    const subtotal = parseInt(localStorage.getItem('orderSubtotal')) || 0;
    const shipping = parseInt(localStorage.getItem('orderShipping')) || 0;
    const discount = parseInt(localStorage.getItem('orderDiscount')) || 0;
    const total = latestOrder.total || (subtotal + shipping - discount);

    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
    document.getElementById('discount').textContent = discount.toLocaleString() + 'đ';
    document.getElementById('total').textContent = total.toLocaleString() + 'đ';

    // === BƯỚC 6: HIỂN THỊ NGÀY VÀ TRẠNG THÁI ===
    document.getElementById('order-date').textContent = latestOrder.date || new Date().toLocaleDateString("vi-VN");
    document.getElementById('order-status').textContent = latestOrder.delivery || 'Đang xử lý';

    console.log('=== ĐƠN HÀNG HIỂN THỊ THÀNH CÔNG ===', latestOrder);

    // === BƯỚC 7: XÓA DỮ LIỆU TẠM SAU KHI HIỂN THỊ ===
    setTimeout(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem('orderSubtotal');
        localStorage.removeItem('orderShipping');
        localStorage.removeItem('orderDiscount');
        localStorage.removeItem('orderTotal');

        // Cập nhật lại số lượng giỏ hàng
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
        console.log('Đã xóa dữ liệu tạm trong localStorage');
    }, 500);
});

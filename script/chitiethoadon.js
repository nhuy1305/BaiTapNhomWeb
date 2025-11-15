document.addEventListener('DOMContentLoaded', () => {
    console.log('=== CHITIETHOADON.JS LOADED ===');

    // === BƯỚC 1: KIỂM TRA ĐĂNG NHẬP ===
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Vui lòng đăng nhập để xem chi tiết đơn hàng!");
        window.location.href = "dangnhap.html";
        return;
    }

    // === BƯỚC 2: LẤY ĐƠN HÀNG TỪ LOCALSTORAGE ===
    const userOrdersKey = `orders_${currentUser.id}`;
    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

    console.log("User ID:", currentUser.id);
    console.log("Orders key:", userOrdersKey);
    console.log("All orders:", userOrders);

    if (!userOrders || userOrders.length === 0) {
        alert("Không tìm thấy đơn hàng nào! Vui lòng đặt hàng lại.");
        window.location.href = "thanhtoan.html";
        return;
    }

    // === BƯỚC 3: LẤY ĐƠN HÀNG MỚI NHẤT ===
    const latestOrder = userOrders[userOrders.length - 1];
    console.log("Latest order:", latestOrder);

    // === BƯỚC 4: LẤY THÔNG TIN TỪ LOCALSTORAGE (GIÁ, GIỎ HÀNG) ===
    const orderSubtotal = parseInt(localStorage.getItem('orderSubtotal')) || 0;
    const orderShipping = parseInt(localStorage.getItem('orderShipping')) || 0;
    const orderDiscount = parseInt(localStorage.getItem('orderDiscount')) || 0;
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // === BƯỚC 5: HIỂN THỊ THÔNG TIN KHÁCH HÀNG ===
    document.getElementById('order-phone').textContent = currentUser.phone || 'Chưa có';
    document.getElementById('order-email').textContent = currentUser.email || 'Chưa có';
    document.getElementById('order-address').textContent = latestOrder.address || 'Chưa có';

    // === BƯỚC 6: HIỂN THỊ SẢN PHẨM ===
    const orderItemList = document.getElementById('order-item-list');
    orderItemList.innerHTML = '';

    let displayItems = [];

    // Ưu tiên lấy từ latestOrder.items (nếu có)
    if (latestOrder.items && latestOrder.items.length > 0) {
        displayItems = latestOrder.items;
    } 
    // Nếu không có → lấy từ giỏ hàng tạm (fallback)
    else if (savedCart.length > 0) {
        displayItems = savedCart;
    } 
    // Nếu vẫn không có → báo lỗi
    else {
        orderItemList.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Không có sản phẩm trong đơn hàng!</td></tr>';
        return;
    }

    displayItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${item.image || 'https://via.placeholder.com/50'}" 
                     alt="${item.name}" 
                     style="width:50px; height:50px; object-fit:cover; margin-right:10px; vertical-align:middle;">
                ${item.name || 'Sản phẩm'}
            </td>
            <td style="text-align:center;">${item.quantity || 1}</td>
            <td>${parseInt(item.price || 0).toLocaleString()}đ</td>
            <td>${(parseInt(item.price || 0) * parseInt(item.quantity || 1)).toLocaleString()}đ</td>
        `;
        orderItemList.appendChild(row);
    });

    // === BƯỚC 7: HIỂN THỊ GIÁ TIỀN ===
    const subtotal = orderSubtotal > 0 ? orderSubtotal : displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = orderShipping;
    const discount = orderDiscount;
    const total = latestOrder.total || (subtotal + shipping - discount);

    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
    document.getElementById('discount').textContent = discount.toLocaleString() + 'đ';
    document.getElementById('total').textContent = total.toLocaleString() + 'đ';

    // === BƯỚC 8: HIỂN THỊ NGÀY & TRẠNG THÁI ===
    document.getElementById('order-date').textContent = latestOrder.date || new Date().toLocaleDateString("vi-VN");
    document.getElementById('order-status').textContent = latestOrder.delivery || 'Đang xử lý';

    console.log('=== ĐƠN HÀNG ĐÃ HIỂN THỊ THÀNH CÔNG ===');

    // === BƯỚC 9: XÓA DỮ LIỆU TẠM SAU 1 GIÂY (ĐỂ TRÁNH XÓA SỚM) ===
    setTimeout(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem('orderSubtotal');
        localStorage.removeItem('orderShipping');
        localStorage.removeItem('orderDiscount');
        localStorage.removeItem('orderTotal');

        // Cập nhật icon giỏ hàng
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = '0';

        console.log('Đã dọn dẹp localStorage tạm');
    }, 1000);
});

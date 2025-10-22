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
    
    // LẤY GIÁ TỪ LOCALSTORAGE - SỬA ĐỂ ĐẢM BẢO LẤY ĐÚNG GIÁ TRỊ
    let subtotal = localStorage.getItem('orderSubtotal');
    let shipping = localStorage.getItem('orderShipping');
    let total = localStorage.getItem('orderTotal');
    
    // Nếu không có trong localStorage, tính lại
    if (!subtotal || subtotal === 'null' || subtotal === '0') {
        subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else {
        subtotal = parseInt(subtotal);
    }
    
    if (!shipping || shipping === 'null') {
        shipping = 0;
    } else {
        shipping = parseInt(shipping);
    }
    
    if (!total || total === 'null' || total === '0') {
        total = subtotal + shipping;
    } else {
        total = parseInt(total);
    }
    
    // Hiển thị giá tiền
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
    document.getElementById('total').textContent = total.toLocaleString() + 'đ';
    
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
    
    // === Hiển thị thông tin giảm giá (nếu có) ===

    try {
      const discount = parseFloat(localStorage.getItem("orderDiscount")) || 0;
      const discountEl = document.getElementById("discount");
      if (discountEl) {
        discountEl.textContent = discount.toLocaleString() + "đ";
      }
    } catch (e) {
      // nếu có lỗi, không làm gián đoạn hiển thị các phần khác
      console.warn('Không thể đọc orderDiscount từ localStorage:', e);
    }

    localStorage.removeItem('cart');
    localStorage.removeItem('orderSubtotal');
    localStorage.removeItem('orderShipping');
    localStorage.removeItem('orderTotal');

    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
});

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

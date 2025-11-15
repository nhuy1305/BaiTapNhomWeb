document.addEventListener('DOMContentLoaded', () => {
    console.log('=== CHITIETHOADON.JS START ===');
    
    // Lấy thông tin giá từ localStorage NGAY LẬP TỨC
    const orderSubtotal = localStorage.getItem('orderSubtotal');
    const orderShipping = localStorage.getItem('orderShipping');
    const orderDiscount = localStorage.getItem('orderDiscount'); // ✅ Lấy discount
    const orderTotal = localStorage.getItem('orderTotal');
    
    console.log('Raw Subtotal:', orderSubtotal);
    console.log('Raw Shipping:', orderShipping);
    console.log('Raw Discount:', orderDiscount); // ✅ Log discount
    console.log('Raw Total:', orderTotal);
    
    const orderPhone = localStorage.getItem('userPhone') || 'Chưa có thông tin';
    const orderEmail = localStorage.getItem('userEmail') || 'Chưa có thông tin';
    const orderAddress = localStorage.getItem('userAddress') || 'Chưa có thông tin';
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart from localStorage:', cart);
    console.log('Cart length:', cart.length);
    
    console.log('Cart to display:', cart);
    
    document.getElementById('order-phone').textContent = orderPhone;
    document.getElementById('order-email').textContent = orderEmail;
    document.getElementById('order-address').textContent = orderAddress;
    
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
    
    // XỬ LÝ GIÁ TIỀN
    let subtotal = 0;
    let shipping = 0;
    let discount = 0; // ✅ Thêm discount
    let total = 0;
    
    if (orderSubtotal && orderSubtotal !== 'null' && orderSubtotal !== 'undefined') {
        subtotal = parseInt(orderSubtotal);
        console.log('Subtotal parsed:', subtotal);
    } else {
        subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('Subtotal calculated:', subtotal);
    }
    
    if (orderShipping && orderShipping !== 'null' && orderShipping !== 'undefined') {
        shipping = parseInt(orderShipping);
        console.log('Shipping parsed:', shipping);
    } else {
        shipping = 0;
        console.log('Shipping default:', shipping);
    }
    
    // ✅ XỬ LÝ DISCOUNT
    if (orderDiscount && orderDiscount !== 'null' && orderDiscount !== 'undefined') {
        discount = parseInt(orderDiscount);
        console.log('Discount parsed:', discount);
    } else {
        discount = 0;
        console.log('Discount default:', discount);
    }
    
    if (orderTotal && orderTotal !== 'null' && orderTotal !== 'undefined') {
        total = parseInt(orderTotal);
        console.log('Total parsed:', total);
    } else {
        total = subtotal + shipping - discount; // ✅ Tính có discount
        console.log('Total calculated:', total);
    }
    
    // Hiển thị giá tiền
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount'); // ✅ Element discount
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString() + 'đ';
        console.log('Displayed Subtotal:', subtotalElement.textContent);
    }
    
    if (shippingElement) {
        shippingElement.textContent = shipping.toLocaleString() + 'đ';
        console.log('Displayed Shipping:', shippingElement.textContent);
    }
    
    // ✅ HIỂN THỊ DISCOUNT
    if (discountElement) {
        discountElement.textContent = discount.toLocaleString() + 'đ';
        console.log('Displayed Discount:', discountElement.textContent);
    }
    
    if (totalElement) {
        totalElement.textContent = total.toLocaleString() + 'đ';
        console.log('Displayed Total:', totalElement.textContent);
    }
    
    const orderDate = new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    document.getElementById('order-date').textContent = orderDate;
    
    console.log('=== CHITIETHOADON.JS END ===');
    
    // XÓA SAU KHI ĐÃ HIỂN THỊ XONG
    setTimeout(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem('orderSubtotal');
        localStorage.removeItem('orderShipping');
        localStorage.removeItem('orderDiscount'); // ✅ Xóa discount
        localStorage.removeItem('orderTotal');
        console.log('LocalStorage cleared');
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
    }, 500);
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

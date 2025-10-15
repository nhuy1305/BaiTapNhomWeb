document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông tin sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productName = decodeURIComponent(urlParams.get('name'));
    const productPrice = parseInt(urlParams.get('price')) || 0;
    const productImage = decodeURIComponent(urlParams.get('image'));

    // Hiển thị thông tin sản phẩm
    document.getElementById('product-name-breadcrumb').textContent = productName;
    document.getElementById('product-name').textContent = productName;
    document.getElementById('product-price').textContent = productPrice.toLocaleString('vi-VN') + 'đ';
    document.getElementById('product-image').src = productImage;

    // Xử lý số lượng
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');

    decreaseBtn.addEventListener('click', () => {
        if (quantityInput.value > 1) quantityInput.value--;
    });

    increaseBtn.addEventListener('click', () => {
        quantityInput.value++;
    });

    // Thêm vào giỏ hàng
    const addToCartBtn = document.getElementById('add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value) || 1;
        addToCart(productId, productName, productPrice, productImage, quantity);
        alert('Đã thêm vào giỏ hàng!');
    });

    // Mua ngay
    const buyNowBtn = document.getElementById('buy-now');
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value) || 1;
        addToCart(productId, productName, productPrice, productImage, quantity);
        window.location.href = 'thanhtoan.html';
    });
});

// Hàm addToCart (sửa để merge nếu tồn tại)
function addToCart(id, name, price, image, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity = (parseInt(existingItem.quantity) || 0) + quantity;  // Tăng quantity nếu tồn tại
    } else {
        cart.push({ id, name, price, image, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();  // Cập nhật số lượng giỏ (nếu có hàm này từ main.js)
}

// Hàm cập nhật số lượng giỏ (copy từ main.js nếu cần)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = totalItems;
}

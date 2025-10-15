document.addEventListener("DOMContentLoaded", () => {
  // === Hàm gộp sản phẩm trùng lặp ===
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

  // === Hàm hiển thị giỏ hàng trong trang THANHTOAN ===
  function renderCart() {
    const cartContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = mergeDuplicateItems(cart);

    if (!cartContainer) return;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Giỏ hàng của bạn trống.</p>";
      subtotalElement.textContent = "0đ";
      totalElement.textContent = "0đ";
      return;
    }

    cartContainer.innerHTML = cart
      .map(
        item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <p>${item.name}</p>
            <p>SL: ${item.quantity}</p>
            <p>Giá: ${item.price.toLocaleString()}đ</p>
          </div>
        </div>
      `
      )
      .join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    subtotalElement.textContent = `${subtotal.toLocaleString()}đ`;
    totalElement.textContent = `${total.toLocaleString()}đ`;

    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);
  }

  // === Hàm tạo mã QR ===
  function generateQRCode(total) {
    const qrContainer = document.getElementById("qrCode");
    if (!qrContainer) return;

    const bankInfo = `Thanh toán đơn hàng tổng: ${total.toLocaleString()}đ`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      bankInfo
    )}`;

    qrContainer.innerHTML = `<img src="${qrURL}" alt="QR thanh toán">`;
  }

  // === Khi người dùng nhấn ĐẶT HÀNG ===
  const placeOrderBtn = document.getElementById("placeOrder");

  placeOrderBtn?.addEventListener("click", () => {
    const fullname = document.getElementById("fullname")?.value.trim();
    const phone = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();

    if (!fullname || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    cart = mergeDuplicateItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Lưu thông tin khách hàng
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userEmail", email || "Chưa có thông tin");
    localStorage.setItem("userAddress", address);

    // Tính tổng tiền
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;
    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);

    // Hiện thông báo (1 lần)
    if (!sessionStorage.getItem("orderCreated")) {
      alert("Đơn hàng được tạo thành công!");
      sessionStorage.setItem("orderCreated", "true");
    }

    // Chuyển sang chi tiết hóa đơn
    window.location.href = "chitiethoadon.html";
  });

  // Gọi render khi load trang
  renderCart();

  // Hiển thị QR
  const total = parseFloat(localStorage.getItem("orderTotal")) || 0;
  generateQRCode(total);
});


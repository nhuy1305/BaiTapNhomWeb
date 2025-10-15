document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cart-items");
  const subtotalElem = document.getElementById("subtotal");
  const shippingElem = document.getElementById("shipping");
  const totalElem = document.getElementById("total");
  const placeOrderBtn = document.getElementById("placeOrder");

  // Hàm gộp sản phẩm trùng
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

  // Hiển thị giỏ hàng
  function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = mergeDuplicateItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    cartList.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("cart-item");
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      li.innerHTML = `
        <div class="item-info">
          <img src="${item.image || "https://via.placeholder.com/50"}" alt="${item.name}">
          <span>${item.name}</span>
        </div>
        <div class="item-price">
          <span>${item.quantity} x ${item.price.toLocaleString()}đ</span>
          <span>= ${(itemTotal).toLocaleString()}đ</span>
        </div>
      `;
      cartList.appendChild(li);
    });

    const shipping = 0;
    const total = subtotal + shipping;

    subtotalElem.textContent = subtotal.toLocaleString() + "đ";
    shippingElem.textContent = shipping.toLocaleString() + "đ";
    totalElem.textContent = total.toLocaleString() + "đ";

    // Lưu để dùng cho trang chi tiết hóa đơn
    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);
  }

  renderCart();

  // Sự kiện đặt hàng
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

    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userEmail", email || "Không có");
    localStorage.setItem("userAddress", address);

    // Hiện thông báo (chỉ 1 lần / phiên)
    if (!sessionStorage.getItem("orderCreated")) {
      alert("Đơn hàng được tạo thành công!");
      sessionStorage.setItem("orderCreated", "true");
    }

    // Chuyển sang trang chi tiết hóa đơn
    window.location.href = "chitiethoadon.html";
  });
});

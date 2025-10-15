
document.addEventListener("DOMContentLoaded", () => {
  // Helper: merge duplicates
  function mergeDuplicateItems(cart) {
    const merged = {};
    cart.forEach(item => {
      const id = String(item.id || item.name || Math.random());
      if (merged[id]) {
        merged[id].quantity = (parseInt(merged[id].quantity) || 0) + (parseInt(item.quantity) || 1);
      } else {
        merged[id] = { ...item, id, quantity: parseInt(item.quantity) || 1 };
      }
    });
    return Object.values(merged);
  }

  // Elements we will update
  const orderItemsContainer = document.getElementById("order-items"); // phần "Đơn hàng" bên thanhtoan.html
  const subtotalElem = document.getElementById("subtotal");
  const shippingElem = document.getElementById("shipping");
  const totalElem = document.getElementById("total");

  // Modal/cart modal elements (nếu có)
  const cartModalItemsContainer = document.getElementById("cart-items"); // modal
  const cartCountElem = document.getElementById("cart-count");

  // Lấy cart, gộp trùng, render cả 2 nơi (order và modal)
  function renderCartAndSummary() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = mergeDuplicateItems(cart);
    // Lưu lại cart đã gộp để các trang khác dùng
    localStorage.setItem("cart", JSON.stringify(cart));

    // Tính subtotal
    let subtotal = 0;
    cart.forEach(item => {
      const qty = parseInt(item.quantity) || 1;
      const p = Number(item.price) || 0;
      subtotal += p * qty;
    });

    const shipping = 0;
    const total = subtotal + shipping;

    // Render phần "Đơn hàng" trên trang thanh toán
    if (orderItemsContainer) {
      orderItemsContainer.innerHTML = ""; // xóa cũ
      if (cart.length === 0) {
        orderItemsContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống</p>";
      } else {
        cart.forEach(item => {
          const qty = parseInt(item.quantity) || 1;
          const price = Number(item.price) || 0;
          const itemTotal = price * qty;
          const div = document.createElement("div");
          div.className = "order-item";
          div.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px">
              <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${(item.name||'Sản phẩm')}" style="width:50px;height:50px;object-fit:cover;border-radius:8px">
              <div>
                <div style="font-weight:600">${item.name || 'Sản phẩm'}</div>
                <div style="color:#777;font-size:14px">${(price).toLocaleString()}đ x ${qty}</div>
              </div>
            </div>
            <div style="font-weight:700">${(itemTotal).toLocaleString()}đ</div>
          `;
          orderItemsContainer.appendChild(div);
        });
      }
    }

    // Render modal cart (nếu có)
    if (cartModalItemsContainer) {
      cartModalItemsContainer.innerHTML = "";
      if (cart.length === 0) {
        cartModalItemsContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống</p>";
      } else {
        cart.forEach((item, idx) => {
          const qty = parseInt(item.quantity) || 1;
          const price = Number(item.price) || 0;
          const itemTotal = price * qty;
          const itemDiv = document.createElement("div");
          itemDiv.className = "cart-item";
          itemDiv.style.display = "flex";
          itemDiv.style.justifyContent = "space-between";
          itemDiv.style.alignItems = "center";
          itemDiv.style.gap = "12px";
          itemDiv.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px">
              <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name || 'Sản phẩm'}" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
              <div>
                <div style="font-weight:600">${item.name || 'Sản phẩm'}</div>
                <div style="font-size:14px;color:#777">${(price).toLocaleString()}đ</div>
              </div>
            </div>
            <div style="text-align:right">
              <div>${qty} x ${(price).toLocaleString()}đ</div>
              <div style="font-weight:700;margin-top:6px">${(itemTotal).toLocaleString()}đ</div>
            </div>
          `;
          cartModalItemsContainer.appendChild(itemDiv);
        });
      }
    }

    // Cập nhật các ô subtotal/shipping/total trên thanhtoan
    if (subtotalElem) subtotalElem.textContent = subtotal.toLocaleString() + "đ";
    if (shippingElem) shippingElem.textContent = shipping.toLocaleString() + "đ";
    if (totalElem) totalElem.textContent = total.toLocaleString() + "đ";

    // Cập nhật cart-count (nếu có)
    if (cartCountElem) {
      const count = cart.reduce((s, i) => s + (parseInt(i.quantity) || 1), 0);
      cartCountElem.textContent = count;
    }

    // Lưu tổng tiền để trang chi tiết hóa đơn dùng
    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);
  }

  // Chạy render lần đầu
  renderCartAndSummary();

  // Validation (giữ nguyên logic validate đã có trước nếu muốn)
  function validateInputs() {
    // tạm đơn giản: kiểm fullname, phone, address tồn tại
    const fullname = document.getElementById("fullname")?.value.trim();
    const phone = document.getElementById("name")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    if (!fullname || !phone || !address) return false;
    return true;
  }

  // Xử lý nút đặt hàng
  const placeOrderBtn = document.getElementById("placeOrder");
  placeOrderBtn?.addEventListener("click", () => {
    // validate
    if (!validateInputs()) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart || cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    // Gộp và lưu cart
    cart = mergeDuplicateItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Lưu thông tin người dùng để chitiethoadon lấy
    const fullname = document.getElementById("fullname")?.value || "";
    const phone = document.getElementById("name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const address = document.getElementById("address")?.value || "";

    localStorage.setItem("userFullname", fullname);
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userEmail", email || "Không có");
    localStorage.setItem("userAddress", address);

    // Lưu tổng tiền (đã lưu trong renderCartAndSummary, nhưng đảm bảo lại)
    const subtotal = parseInt(localStorage.getItem("orderSubtotal")) || 0;
    const total = parseInt(localStorage.getItem("orderTotal")) || subtotal;
    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);

    // Hiện thông báo 1 lần / session
    if (!sessionStorage.getItem("orderCreated")) {
      alert("Đơn hàng được tạo thành công!");
      sessionStorage.setItem("orderCreated", "true");
    }

    // Điều hướng sang chi tiết hóa đơn
    window.location.href = "chitiethoadon.html";
  });

  // Nếu cần support: khi thay đổi giỏ (bởi các nút +/-) — gọi renderCartAndSummary() lại.
  // (nếu nhóm có các actions tăng giảm số lượng, nhớ gọi renderCartAndSummary() sau cập nhật)
});

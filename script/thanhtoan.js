document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cart-items");
  const subtotalElem = document.getElementById("subtotal");
  const shippingElem = document.getElementById("shipping");
  const totalElem = document.getElementById("total");
  const placeOrderBtn = document.getElementById("placeOrder");

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
        <div class="item-info" style="display:flex; align-items:center; gap:10px;">
          <img src="${item.image || "https://via.placeholder.com/60"}" 
               alt="${item.name}" 
               style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
          <span>${item.name}</span>
        </div>
        <div class="item-price" style="text-align:right;">
          <span>${item.quantity} x ${item.price.toLocaleString()}đ</span><br>
          <strong>${(itemTotal).toLocaleString()}đ</strong>
        </div>
      `;
      cartList.appendChild(li);
    });

    const shipping = 0;
    const total = subtotal + shipping;

    subtotalElem.textContent = subtotal.toLocaleString() + "đ";
    shippingElem.textContent = shipping.toLocaleString() + "đ";
    totalElem.textContent = total.toLocaleString() + "đ";

    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);
  }

  renderCart();

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
    localStorage.setItem("userEmail", email || "Không có thông tin");
    localStorage.setItem("userAddress", address);

    if (!sessionStorage.getItem("orderCreated")) {
      alert("Đơn hàng được tạo thành công!");
      sessionStorage.setItem("orderCreated", "true");
    }

    window.location.href = "chitiethoadon.html";
  });
});


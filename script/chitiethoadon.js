document.addEventListener("DOMContentLoaded", () => {
  const orderItemList = document.getElementById("order-item-list");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderPhone = localStorage.getItem("userPhone") || "Chưa có";
  const orderEmail = localStorage.getItem("userEmail") || "Chưa có";
  const orderAddress = localStorage.getItem("userAddress") || "Chưa có";

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

  cart = mergeDuplicateItems(cart);

  document.getElementById("order-phone").textContent = orderPhone;
  document.getElementById("order-email").textContent = orderEmail;
  document.getElementById("order-address").textContent = orderAddress;

  orderItemList.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image || "https://via.placeholder.com/50"}" alt="${item.name}"> ${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()}đ</td>
      <td>${(item.price * item.quantity).toLocaleString()}đ</td>
    `;
    orderItemList.appendChild(row);
  });

  // Lấy tổng tiền từ localStorage (đồng bộ với trang thanh toán)
  const subtotal = parseInt(localStorage.getItem("orderSubtotal")) || 0;
  const total = parseInt(localStorage.getItem("orderTotal")) || subtotal;
  const shipping = 0;

  document.getElementById("subtotal").textContent = subtotal.toLocaleString() + "đ";
  document.getElementById("shipping").textContent = shipping.toLocaleString() + "đ";
  document.getElementById("total").textContent = total.toLocaleString() + "đ";

  const orderDate = new Date().toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false
  });
  document.getElementById("order-date").textContent = orderDate;

  // Xóa giỏ hàng sau khi hiển thị
  localStorage.removeItem("cart");
  document.getElementById("cart-count").textContent = "0";
});


document.addEventListener("DOMContentLoaded", () => {
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

  const orderItemList = document.getElementById("order-item-list");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = mergeDuplicateItems(cart);

  // Thông tin khách
  const orderPhone = localStorage.getItem("userPhone") || "Chưa có thông tin";
  const orderEmail = localStorage.getItem("userEmail") || "Chưa có thông tin";
  const orderAddress = localStorage.getItem("userAddress") || "Chưa có thông tin";

  document.getElementById("order-phone").textContent = orderPhone;
  document.getElementById("order-email").textContent = orderEmail;
  document.getElementById("order-address").textContent = orderAddress;

  // Hiển thị list có ảnh
  if (orderItemList) {
    orderItemList.innerHTML = "";
    if (cart.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4">Không có sản phẩm</td>`;
      orderItemList.appendChild(tr);
    } else {
      cart.forEach(item => {
        const qty = parseInt(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="display:flex;align-items:center;gap:12px">
            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name || 'Sản phẩm'}" style="width:50px;height:50px;object-fit:cover;border-radius:8px">
            <span>${item.name || ''}</span>
          </td>
          <td style="text-align:center">${qty}</td>
          <td>${price.toLocaleString()}đ</td>
          <td>${(price * qty).toLocaleString()}đ</td>
        `;
        orderItemList.appendChild(row);
      });
    }
  }

  // Lấy tổng từ localStorage (đồng bộ với thanhtoan)
  const subtotal = Number(localStorage.getItem("orderSubtotal")) || cart.reduce((s,i) => s + (Number(i.price)||0) * (Number(i.quantity)||1), 0);
  const shipping = 0;
  const total = Number(localStorage.getItem("orderTotal")) || subtotal + shipping;

  document.getElementById("subtotal").textContent = subtotal.toLocaleString() + "đ";
  document.getElementById("shipping").textContent = shipping.toLocaleString() + "đ";
  document.getElementById("total").textContent = total.toLocaleString() + "đ";

  // Ngày đặt
  const orderDate = new Date().toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false
  });
  document.getElementById("order-date").textContent = orderDate;

  // Sau khi đã hiển thị, xóa giỏ hàng (nếu muốn)
  // LƯU Ý: nếu muốn giữ lịch sử cart cho mục khác, comment dòng dưới
  localStorage.removeItem("cart");
  // cập nhật cart-count nếu có header
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) cartCountElem.textContent = "0";
});

document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("orderList");
  const cusName = document.getElementById("cusName");
  const cusPhone = document.getElementById("cusPhone");
  const cusEmail = document.getElementById("cusEmail");
  const cusAddress = document.getElementById("cusAddress");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  // Hiển thị thông tin khách hàng
  cusName.textContent = localStorage.getItem("userFullname") || "Khách hàng";
  cusPhone.textContent = localStorage.getItem("userPhone") || "Không có";
  cusEmail.textContent = localStorage.getItem("userEmail") || "Không có";
  cusAddress.textContent = localStorage.getItem("userAddress") || "Không có";
  // Nếu không có đơn hàng
  if (orders.length === 0) {
    orderList.innerHTML = `
      <tr><td colspan="6" style="text-align:center; padding:20px;">Chưa có đơn hàng nào được ghi nhận.</td></tr>
    `;
    return;
  }
  // Hiển thị đơn hàng
  orderList.innerHTML = orders
    .map(
      (o) => `
        <tr>
          <td>${o.id}</td>
          <td>${o.date}</td>
          <td>${o.address}</td>
          <td style="color:#4caf50; font-weight:bold;">${parseFloat(o.total).toLocaleString()}đ</td>
          <td><span class="status-payment partial">${o.payment}</span></td>
          <td><span class="status-delivery waiting">${o.delivery}</span></td>
        </tr>
      `
    )
    .join("");
});

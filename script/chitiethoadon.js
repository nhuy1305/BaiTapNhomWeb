
document.addEventListener("DOMContentLoaded", () => {
  const phone = localStorage.getItem("userPhone") || "Không có";
  const email = localStorage.getItem("userEmail") || "Không có";
  const address = localStorage.getItem("userAddress") || "Không có";
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  document.getElementById("cusPhone").textContent = phone;
  document.getElementById("cusEmail").textContent = email;
  document.getElementById("cusAddress").textContent = address;

  const tbody = document.getElementById("orderItems");
  const totalElement = document.getElementById("orderTotal");

  if (!tbody || !totalElement) return;

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Không có sản phẩm</td></tr>`;
    totalElement.textContent = "0đ";
    return;
  }

  tbody.innerHTML = cart
    .map(
      item => `
      <tr>
        <td style="display:flex;align-items:center;gap:10px;">
          <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
          ${item.name}
        </td>
        <td>${item.quantity}</td>
        <td>${item.price.toLocaleString()}đ</td>
        <td>${(item.price * item.quantity).toLocaleString()}đ</td>
      </tr>
    `
    )
    .join("");

  const total = parseFloat(localStorage.getItem("orderTotal")) || 0;
  totalElement.textContent = `${total.toLocaleString()}đ`;
});

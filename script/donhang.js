// === TOÀN BỘ donhang.js ===
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Vui lòng đăng nhập!");
        window.location.href = "dangnhap.html";
        return;
    }

    const orderList = document.getElementById("orderList");
    const cusName = document.getElementById("cusName");
    const cusPhone = document.getElementById("cusPhone");
    const cusEmail = document.getElementById("cusEmail");
    const cusAddress = document.getElementById("cusAddress");

    // Hiển thị thông tin user
    cusName.textContent = currentUser.fullname || "Khách hàng";
    cusPhone.textContent = currentUser.phone || "Không có";
    cusEmail.textContent = currentUser.email || "Không có";
    cusAddress.textContent = currentUser.address || "Không có";

    // Lấy đơn hàng của user
    const userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];

    if (userOrders.length === 0) {
        orderList.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">Chưa có đơn hàng nào.</td></tr>`;
        return;
    }

    orderList.innerHTML = userOrders.map(o => `
        <tr>
            <td><a href="chitiethoadon.html" style="color:blue;">${o.id}</a></td>
            <td>${o.date}</td>
            <td>${o.address}</td>
            <td style="color:#4caf50; font-weight:bold;">${parseFloat(o.total).toLocaleString()}đ</td>
            <td><span class="status-payment">${o.payment}</span></td>
            <td><span class="status-delivery">${o.delivery}</span></td>
        </tr>
    `).join("");
});

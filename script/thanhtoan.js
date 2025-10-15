document.addEventListener("DOMContentLoaded", () => {
  // Gộp sản phẩm trùng lặp
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

  const placeOrderBtn = document.getElementById("placeOrder");

  placeOrderBtn?.addEventListener("click", () => {
    const fullname = document.getElementById("fullname")?.value.trim();
    const phone = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();

    // Kiểm tra thông tin bắt buộc
    if (!fullname || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }

    // Lấy giỏ hàng
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    // Gộp sản phẩm trùng
    cart = mergeDuplicateItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Lưu thông tin khách hàng
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userEmail", email || "Không có");
    localStorage.setItem("userAddress", address);

    // Tính tổng tiền và lưu lại để hiển thị trong trang chitiethoadon
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0; // có thể thay đổi nếu cần
    const total = subtotal + shipping;

    localStorage.setItem("orderSubtotal", subtotal);
    localStorage.setItem("orderTotal", total);

    // Hiện thông báo (chỉ 1 lần / phiên)
    if (!sessionStorage.getItem("orderCreated")) {
      alert("Đơn hàng được tạo thành công!");
      sessionStorage.setItem("orderCreated", "true");
    }

    // Chuyển sang trang chi tiết hóa đơn
    window.location.href = "chitiethoadon.html";
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.querySelector(".cart-count");
  const addButtons = document.querySelectorAll(".add-btn");
  let count = 0;

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      count++;
      cartCount.textContent = count;

      // Hiệu ứng khi thêm vào giỏ
      btn.classList.add("added");
      btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';
      }, 1200);
    });
  });
});

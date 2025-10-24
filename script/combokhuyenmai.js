<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 99c300991fa7dd002c17ed4da51ab2b3553a04c7
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
<<<<<<< HEAD
=======
=======
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
>>>>>>> d7489afe35c11a07a6fb7ea04adef051ff3c2cc5
>>>>>>> 99c300991fa7dd002c17ed4da51ab2b3553a04c7

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCount = document.getElementById("cart-count");
const closeModal = document.querySelector(".close-modal");
const continueShopping = document.getElementById("continue-shopping");
const checkoutBtn = document.getElementById("checkout");

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

function displayCart() {
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Giỏ hàng của bạn đang trống</p>";
    cartTotalPrice.textContent = "0đ";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
      </div>
      <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-index="${index}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
          <button class="quantity-btn increase" data-index="${index}">+</button>
      </div>
      <div class="cart-item-total">${formatPrice(itemTotal)}</div>
      <div class="cart-item-remove" data-index="${index}">
          <i class="fas fa-trash"></i>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  cartTotalPrice.textContent = formatPrice(total);

  document.querySelectorAll(".decrease").forEach((btn) =>
    btn.addEventListener("click", () => decreaseQuantity(parseInt(btn.dataset.index)))
  );
  document.querySelectorAll(".increase").forEach((btn) =>
    btn.addEventListener("click", () => increaseQuantity(parseInt(btn.dataset.index)))
  );
  document.querySelectorAll(".quantity-input").forEach((input) =>
    input.addEventListener("change", () =>
      updateQuantity(parseInt(input.dataset.index), parseInt(input.value))
    )
  );
  document.querySelectorAll(".cart-item-remove").forEach((btn) =>
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.index)))
  );
}

function addToCart(productId, name, price, image) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function updateQuantity(index, quantity) {
  if (quantity > 0) {
    cart[index].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}


function addCartButtons() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const productId = card.getAttribute("data-id");
    const productName = card.querySelector(".product-name")?.textContent.trim() || "";

    const productPriceText = card.querySelector(".product-price")?.childNodes[0].textContent.trim() || "0";
    const productPrice = Number(productPriceText.replace(/[^\d]/g, "")) || 0;

    const productImage = card.querySelector("img")?.src || "";

    card.addEventListener("click", function (e) {
      if (!e.target.closest(".add-to-cart")) {
        window.location.href = `chitietsanpham.html?id=${productId}&name=${encodeURIComponent(
          productName
        )}&price=${productPrice}&image=${encodeURIComponent(productImage)}`;
      }
    });

    if (!card.querySelector(".add-to-cart")) {
      const addToCartBtn = document.createElement("button");
      addToCartBtn.className = "add-to-cart btn btn-primary";
      addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';

      addToCartBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        addToCart(productId, productName, productPrice, productImage);

        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Đã thêm!';
        addToCartBtn.style.backgroundColor = "#4CAF50";

        setTimeout(() => {
          addToCartBtn.innerHTML = originalText;
          addToCartBtn.style.backgroundColor = "";
        }, 1500);
      });

      const infoDiv = card.querySelector(".product-info");
      if (infoDiv) infoDiv.appendChild(addToCartBtn);
      else card.appendChild(addToCartBtn);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  addCartButtons();
  updateCartCount();
  displayCart();

  cartIcon?.addEventListener("click", () => (cartModal.style.display = "flex"));
  closeModal?.addEventListener("click", () => (cartModal.style.display = "none"));
  continueShopping?.addEventListener("click", () => (cartModal.style.display = "none"));
  window.addEventListener("click", (event) => {
    if (event.target === cartModal) cartModal.style.display = "none";
  });

  checkoutBtn?.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    alert("Chưa làm chức năng thanh toán!");
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    displayCart();
  });

  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".search-bar button");

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll(".product-card");
    products.forEach((product) => {
      const productName = product.querySelector(".product-name")?.textContent.toLowerCase() || "";
      product.style.display = productName.includes(searchTerm) ? "block" : "none";
    });
  }

  searchInput?.addEventListener("input", performSearch);
  searchButton?.addEventListener("click", performSearch);
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCount = document.getElementById("cart-count");
const closeModal = document.querySelector(".close-modal");
const continueShopping = document.getElementById("continue-shopping");
const checkoutBtn = document.getElementById("checkout");

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const productName = decodeURIComponent(urlParams.get("name"));

const productPrice = parsePriceFromURL(urlParams.get("price"));
const productImage = decodeURIComponent(urlParams.get("image"));

function parsePriceFromURL(priceString) {
  return parseInt(
    priceString.replace("đ", "").replace(/\./g, "").replace(/,/g, "")
  );
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
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
                    <img src="${item.image}" alt="${
      item.name
    }" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(
                          item.price
                        )}</div>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <input type="number" class="quantity-input" value="${
                      item.quantity
                    }" min="1" data-index="${index}">
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

  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      decreaseQuantity(index);
    });
  });

  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      increaseQuantity(index);
    });
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const index = parseInt(this.getAttribute("data-index"));
      updateQuantity(index, parseInt(this.value));
    });
  });

  document.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      removeFromCart(index);
    });
  });
}

function addToCart(productId, name, price, image, quantity = 1) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: price,
      image: image,
      quantity: quantity,
    });
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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("product-name").textContent = productName;
  document.getElementById("product-name-breadcrumb").textContent = productName;
  document.getElementById("product-image").src = productImage;
  document.getElementById("product-image").alt = productName;

  let originalPrice, discountPercent;

  if (productId === "1") {
    originalPrice = Math.round(productPrice / 0.9);
    discountPercent = 10;
  } else if (productId === "2") {
    originalPrice = Math.round(productPrice / 0.85);
    discountPercent = 15;
  } else {
    originalPrice = Math.round(productPrice / 0.9);
    discountPercent = 10;
  }

  document.getElementById("product-price").innerHTML = `
            ${formatPrice(productPrice)}
            <span class="product-original-price">${formatPrice(
              originalPrice
            )}</span>
            <span class="product-badge">Giảm ${discountPercent}%</span>
        `;

  updateCartCount();
  displayCart();

  cartIcon.addEventListener("click", function () {
    cartModal.style.display = "flex";
  });

  closeModal.addEventListener("click", function () {
    cartModal.style.display = "none";
  });

  continueShopping.addEventListener("click", function () {
    cartModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    alert("Đã thanh toán thành công!");
  });

  const quantityInput = document.getElementById("product-quantity");
  const decreaseBtn = document.getElementById("decrease-quantity");
  const increaseBtn = document.getElementById("increase-quantity");

  decreaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });

  document.getElementById("add-to-cart").addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, productName, productPrice, productImage, quantity);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  });

  document.getElementById("buy-now").addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, productName, productPrice, productImage, quantity);
    cartModal.style.display = "flex";
  });
});


document.getElementById('checkout').addEventListener('click', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        window.location.href = 'checkout.html';
    } else {
        window.location.href = 'dangnhap.html';
    }
});

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
  const totalItems = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  if (cartCount) cartCount.textContent = totalItems;
}

function displayCart() {
  if (!cartItems || !cartTotalPrice) return;
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Giỏ hàng của bạn đang trống</p>";
    cartTotalPrice.textContent = "0đ";
    return;
  }

  cart.forEach((item, index) => {
    const priceNum = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    const itemTotal = priceNum * qty;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.image || ''}" alt="${item.name || ''}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name || ''}</div>
          <div class="cart-item-price">${formatPrice(priceNum)}</div>
        </div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn decrease" data-index="${index}">-</button>
        <input type="number" class="quantity-input" value="${qty}" min="1" data-index="${index}">
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

  document.querySelectorAll(".decrease").forEach(btn =>
    btn.addEventListener("click", () => decreaseQuantity(parseInt(btn.dataset.index)))
  );
  document.querySelectorAll(".increase").forEach(btn =>
    btn.addEventListener("click", () => increaseQuantity(parseInt(btn.dataset.index)))
  );
  document.querySelectorAll(".quantity-input").forEach(input =>
    input.addEventListener("change", () =>
      updateQuantity(parseInt(input.dataset.index), parseInt(input.value) || 1)
    )
  );
  document.querySelectorAll(".cart-item-remove").forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.index)))
  );
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
}

function parsePrice(priceText) {
  if (!priceText) return 0;

  const m = String(priceText).match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)/);
  let candidate = m ? m[0] : (String(priceText).match(/\d+/) || [""])[0];

  candidate = candidate.replace(/[^\d]/g, "");
  return candidate ? parseInt(candidate, 10) : 0;
}

function addToCart(productId, name, price, image) {
  const id = String(productId);
  const priceNum = Number(price) || 0;
  const existingItem = cart.find(item => String(item.id) === id);
  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
  } else {
    cart.push({ id, name, price: priceNum, image, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function decreaseQuantity(index) {
  if (!cart[index]) return;
  if (cart[index].quantity > 1) {
    cart[index].quantity = Number(cart[index].quantity) - 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function increaseQuantity(index) {
  if (!cart[index]) return;
  cart[index].quantity = Number(cart[index].quantity) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function updateQuantity(index, quantity) {
  if (!cart[index]) return;
  quantity = Number(quantity) || 1;
  if (quantity > 0) {
    cart[index].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function removeFromCart(index) {
  if (!cart[index]) return;
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  displayCart();

  cartIcon?.addEventListener("click", () => (cartModal.style.display = "flex"));
  closeModal?.addEventListener("click", () => (cartModal.style.display = "none"));
  continueShopping?.addEventListener("click", () => (cartModal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
  });

  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
    } else {
      alert("Chưa làm chức năng thanh toán!");
      cart = [];
      localStorage.removeItem("cart");
      updateCartCount();
      displayCart();
    }
  });


  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const productId = card.getAttribute("data-id");
    const productName = card.querySelector(".product-name")?.textContent?.trim() || "Sản phẩm";


    const priceElement = card.querySelector(".product-price");
    let productPriceText = "0";
    if (priceElement) {
      const firstTextNode = Array.from(priceElement.childNodes).find(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
      );
      productPriceText = firstTextNode ? firstTextNode.textContent.trim() : priceElement.textContent.trim();
    }

    const productPrice = parsePrice(productPriceText);
    const productImage = card.querySelector("img")?.src || "";

    console.log("PRODUCT", productName, "raw:", productPriceText, "parsed:", productPrice);

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".add-to-cart")) {
        window.location.href = `chitietsanpham.html?id=${encodeURIComponent(productId)}&name=${encodeURIComponent(productName)}&price=${productPrice}&image=${encodeURIComponent(productImage)}`;
      }
    });

    let productInfo = card.querySelector(".product-info");
    if (!productInfo) {
      productInfo = document.createElement("div");
      productInfo.className = "product-info";
      card.appendChild(productInfo);
    }

    if (!card.querySelector(".add-to-cart")) {
      const addToCartBtn = document.createElement("button");
      addToCartBtn.className = "add-to-cart btn btn-primary";
      addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(productId, productName, productPrice, productImage);
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      });
      productInfo.appendChild(addToCartBtn);
    }
  });


  const searchInput = document.querySelector(".search-bar input");
  searchInput?.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach((product) => {
      const productName = product.querySelector(".product-name")?.textContent.toLowerCase() || "";
      product.style.display = productName.includes(searchTerm) ? "block" : "none";
    });
  });
});

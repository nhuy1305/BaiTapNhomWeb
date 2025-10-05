document.addEventListener("DOMContentLoaded", function () {
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
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    if (cartCount) cartCount.textContent = totalItems;
  }

  function formatPrice(price) {
    const clean = Number(price) || 0;
    return clean.toLocaleString("vi-VN") + "đ";
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
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image || ""}" alt="${item.name || ""}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name || ""}</div>
            <div class="cart-item-price">${formatPrice(item.price || 0)}</div>
          </div>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-index="${index}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity || 1}" min="1" data-index="${index}">
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
        updateQuantity(parseInt(input.dataset.index), parseInt(input.value) || 1)
      )
    );
    document.querySelectorAll(".cart-item-remove").forEach((btn) =>
      btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.index)))
    );
  }

  
  function addToCart(productId, name, price, image) {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      cart.push({ id: productId, name, price: Number(price) || 0, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }

  function decreaseQuantity(index) {
    if (!cart[index]) return;
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      displayCart();
    }
  }

  function increaseQuantity(index) {
    if (!cart[index]) return;
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }

  function updateQuantity(index, quantity) {
    if (!cart[index]) return;
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

 
  function addCartButtons() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card, idx) => {
      const productId = card.getAttribute("data-id") || String(idx);
      const productName = card.querySelector(".product-name")?.textContent.trim() || "Sản phẩm";

    
      let priceText = "";
      const priceContainer = card.querySelector(".product-price");
      const originalPrice = priceContainer?.querySelector(".product-original-price");
      const badge = priceContainer?.querySelector(".product-badge");

      if (badge && badge.textContent.trim() === "Mới") {
       
        if (originalPrice) originalPrice.remove();
        priceText = priceContainer?.childNodes[0]?.textContent.trim() || "0";
      } else {
      
        priceText = priceContainer?.childNodes[0]?.textContent.trim() || "0";
      }

      const cleanPrice = Number(priceText.replace(/[^\d]/g, "")) || 0;
      const productImage = card.querySelector("img")?.src || "";

     
      if (!card.dataset.detailAttached) {
        card.addEventListener("click", function (e) {
          if (!e.target.closest(".add-to-cart")) {
            const url = `chitietsanpham.html?id=${encodeURIComponent(productId)}&name=${encodeURIComponent(
              productName
            )}&price=${cleanPrice}&image=${encodeURIComponent(productImage)}`;
            window.location.href = url;
          }
        });
        card.dataset.detailAttached = "1";
      }

    
      if (!card.querySelector(".add-to-cart")) {
        const addToCartBtn = document.createElement("button");
        addToCartBtn.className = "add-to-cart btn btn-primary";
        addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';

        addToCartBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          addToCart(productId, productName, cleanPrice, productImage);

          const originalText = addToCartBtn.innerHTML;
          addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Đã thêm!';
          addToCartBtn.style.backgroundColor = "#4CAF50";
          setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.style.backgroundColor = "";
          }, 1200);
        });

        const infoDiv = card.querySelector(".product-info") || card;
        infoDiv.appendChild(addToCartBtn);
      }
    });
  }

 
  addCartButtons();
  updateCartCount();
  displayCart();

  cartIcon?.addEventListener("click", () => (cartModal.style.display = "flex"));
  closeModal?.addEventListener("click", () => (cartModal.style.display = "none"));
  continueShopping?.addEventListener("click", () => (cartModal.style.display = "none"));
  window.addEventListener("click", (event) => {
    if (cartModal && event.target === cartModal) cartModal.style.display = "none";
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
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach((product) => {
      const productName =
        product.querySelector(".product-name")?.textContent.toLowerCase() || "";
      product.style.display = productName.includes(searchTerm) ? "block" : "none";
    });
  }

  searchInput?.addEventListener("input", performSearch);
  searchButton?.addEventListener("click", performSearch);
});

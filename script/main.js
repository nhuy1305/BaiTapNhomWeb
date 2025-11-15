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
  // Gộp sản phẩm trùng id
  const uniqueCart = [];
  const seenIds = new Set();
  cart.forEach(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueCart.push(item);
    } else {
      const existing = uniqueCart.find(i => i.id === item.id);
      if (existing) existing.quantity += item.quantity || 1;
    }
  });
  uniqueCart.forEach((item, index) => {
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
    existingItem.quantity = (Number(existingItem.quantity) || 0) + 1; // Tăng quantity nếu trùng
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
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1); // Xóa nếu quantity = 1
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
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
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "thanhtoan.html";
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

function renderUserArea() {
    const userArea = document.getElementById('user-area');
    if (!userArea) return;
  
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
    if (isLoggedIn) {
        const fullname = localStorage.getItem('userFullname') || 'Người dùng';
        userArea.innerHTML = `
            <div class="user-name" id="user-name" style="cursor: pointer;">
                <i class="fas fa-user-circle"></i> Xin chào, ${fullname}
            </div>
        `;
        
        // Thêm event listener sau khi tạo element
        const userName = document.getElementById('user-name');
        if (userName) {
            userName.addEventListener('click', openProfile);
        }
    } else {
        userArea.innerHTML = `
            <a href="dangnhap.html"><i class="fas fa-user"></i> Đăng nhập</a>
            <a href="dangky.html"><i class="fas fa-user-plus"></i> Đăng ký</a>
        `;
    }
}
  
function openProfile() {
    const modal = document.getElementById('profile-modal');
    if (!modal) {
        console.error("Không tìm thấy #profile-modal");
        return;
    }
  
    // Lấy thông tin từ localStorage
    const fullname = localStorage.getItem('userFullname') || 'Chưa cập nhật';
    const email = localStorage.getItem('userEmail') || 'Chưa cập nhật';
    const phone = localStorage.getItem('userPhone') || 'Chưa cập nhật';
    const address = localStorage.getItem('userAddress') || 'Chưa cập nhật';
    
    // Cập nhật nội dung
    const pFullname = document.getElementById('p-fullname');
    const pEmail = document.getElementById('p-email');
    const pPhone = document.getElementById('p-phone');
    const pAddress = document.getElementById('p-address');
    
    if (pFullname) pFullname.textContent = fullname;
    if (pEmail) pEmail.textContent = email;
    if (pPhone) pPhone.textContent = phone;
    if (pAddress) pAddress.textContent = address;
  
    // Hiển thị modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}
  
function closeProfile() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}
  
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userFullname');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userAddress');
        alert('Đã đăng xuất thành công!');
        window.location.href = 'index.html';
    }
}

// ===== KHỞI TẠO KHI TRANG LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== COMMON.JS LOADED ===');
    
    // Render user area
    renderUserArea();
  
    // Xử lý nút đóng popup
    const closeBtn = document.getElementById('close-profile');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProfile);
    }
  
    // Xử lý nút đăng xuất
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }
  
    // Xử lý nút "Đơn hàng của tôi"
    const btnMyOrders = document.getElementById('btn-my-orders');
    if (btnMyOrders) {
        btnMyOrders.addEventListener('click', () => {
            closeProfile();
            window.location.href = 'donhang.html';
        });
    }
  
    // Click bên ngoài popup để đóng
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProfile();
            }
        });
    }
    
    console.log('User area initialized');
});

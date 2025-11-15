document.addEventListener('DOMContentLoaded', () => {
    console.log('=== THANHTOAN.JS LOADED ===');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    
    if (!isLoggedIn) {
        loginLink.style.display = 'block';
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.setItem('returnUrl', 'thanhtoan.html');
            window.location.href = 'dangnhap.html';
        });
    } else {
        loginLink.style.display = 'none';
        const fullnameInput = document.getElementById('fullname');
        const phoneInput = document.getElementById('name');
        const addressInput = document.getElementById('address');
        
        fullnameInput.value = localStorage.getItem('userFullname') || '';
        phoneInput.value = localStorage.getItem('userPhone') || '';
        addressInput.value = localStorage.getItem('userAddress') || '';
        
        if (addressInput.value) {
            const address = addressInput.value.trim();
            const shipping = calculateShipping(address);
            document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
            
            const subtotalText = document.getElementById('subtotal').textContent;
            const subtotal = parseInt(subtotalText.replace(/[.,đ]/g, '')) || 0;
            document.getElementById('total').textContent = (subtotal + shipping).toLocaleString() + 'đ';
        }
    }
    
    function calculateShipping(address) {
        const addressUpper = address.toUpperCase();
        if (addressUpper.includes('HCM') || addressUpper.includes('TPHCM')) {
            return 0;
        }
        return 30000;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');

    const uniqueCart = [];
    const seenIds = new Set();
    cart.forEach(item => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueCart.push({ ...item, quantity: item.quantity || 1 });
        } else {
            const existing = uniqueCart.find(i => i.id === item.id);
            if (existing) existing.quantity += (item.quantity || 1);
        }
    });

    orderItems.innerHTML = '';
    let subtotal = 0;
    
    uniqueCart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        const itemTotal = item.price * (item.quantity || 1);
        itemDiv.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}">
            <span>${item.name} x${item.quantity || 1}</span>
            <span>${itemTotal.toLocaleString()}đ</span>
        `;
        orderItems.appendChild(itemDiv);
        subtotal += itemTotal;
    });

    if (uniqueCart.length === 0) {
        const defaultItem = { 
            id: 'default-1',
            name: "Cải kale (Xanh) Organic 300gr", 
            price: 35000, 
            quantity: 1, 
            image: "https://via.placeholder.com/50" 
        };
        uniqueCart.push(defaultItem);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${defaultItem.image}" alt="${defaultItem.name}">
            <span>${defaultItem.name} x${defaultItem.quantity}</span>
            <span>${(defaultItem.price * defaultItem.quantity).toLocaleString()}đ</span>
        `;
        orderItems.appendChild(itemDiv);
        subtotal = defaultItem.price * defaultItem.quantity;
    }

    function capitalizeAddress(address) {
        return address.split(',').map(part => {
            return part.trim().split(' ').map(word => {
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
        }).join(', ');
    }

    // TÍNH PHÍ VẬN CHUYỂN BAN ĐẦU (nếu đã có địa chỉ)
    let shipping = 0;
    const currentAddress = document.getElementById('address').value.trim();
    if (currentAddress) {
        shipping = calculateShipping(currentAddress);
        console.log('Initial shipping calculated:', shipping, 'for address:', currentAddress);
    }
    let discount = 0;
    
    // CẬP NHẬT HIỂN THỊ GIÁ TIỀN (bao gồm shipping đã tính)
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + 'đ';
    document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
    document.getElementById('total').textContent = (subtotal + shipping).toLocaleString() + 'đ';

    console.log('Initial prices:', {
        subtotal,
        shipping,
        total: subtotal + shipping
    });

    const addressInput = document.getElementById('address');
    addressInput.addEventListener('input', function() {
        const address = this.value.trim();
        if (address) {
            shipping = calculateShipping(address);
            document.getElementById('shipping').textContent = shipping.toLocaleString() + 'đ';
            const finalTotal = subtotal + shipping - discount;
            document.getElementById('total').textContent = finalTotal.toLocaleString() + 'đ';
        }
    });

    const inputs = {
        fullname: document.getElementById('fullname'),
        name: document.getElementById('name'),
        address: document.getElementById('address')
    };
    const errors = {
        fullname: document.getElementById('fullname-error'),
        name: document.getElementById('name-error'),
        address: document.getElementById('address-error')
    };

    function validateInputs() {
        let isValid = true;
        const fullname = inputs.fullname.value.trim();
        if (!fullname || fullname.split(/\s+/).filter(word => word.length > 0).length < 2) {
            inputs.fullname.classList.add('error-border');
            errors.fullname.textContent = !fullname ? 'Vui lòng nhập họ tên' : 'Vui lòng nhập họ tên với ít nhất 2 từ';
            errors.fullname.style.visibility = 'visible';
            isValid = false;
        } else {
            inputs.fullname.classList.remove('error-border');
            errors.fullname.style.visibility = 'hidden';
        }

        const phone = inputs.name.value.trim();
        const phoneRegex = /^0\d{9}$/;
        if (!phone || !phoneRegex.test(phone)) {
            inputs.name.classList.add('error-border');
            errors.name.textContent = !phone ? 'Vui lòng nhập số điện thoại' : 'Vui lòng nhập số điện thoại 10 số bắt đầu bằng 0';
            errors.name.style.visibility = 'visible';
            isValid = false;
        } else {
            inputs.name.classList.remove('error-border');
            errors.name.style.visibility = 'hidden';
        }

        const address = inputs.address.value.trim();
        if (!address) {
            inputs.address.classList.add('error-border');
            errors.address.textContent = 'Vui lòng nhập địa chỉ';
            errors.address.style.visibility = 'visible';
            isValid = false;
        } else {
            const addressParts = address.split(',').map(part => part.trim()).filter(part => part.length > 0);
            if (addressParts.length < 4) {
                inputs.address.classList.add('error-border');
                errors.address.textContent = 'Địa chỉ phải bao gồm: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố';
                errors.address.style.visibility = 'visible';
                isValid = false;
            } else {
                inputs.address.classList.remove('error-border');
                errors.address.style.visibility = 'hidden';
            }
        }

        return isValid;
    }

    Object.values(inputs).forEach(input => {
        input.addEventListener('input', validateInputs);
    });

    const bankRadio = document.getElementById('bank');
    const generateQRButton = document.getElementById('generateQR');
    const qrSection = document.getElementById('qrSection');
    if (bankRadio) {
        bankRadio.addEventListener('change', () => {
            generateQRButton.style.display = bankRadio.checked ? 'block' : 'none';
            qrSection.style.display = 'none';
        });
    }
    if (generateQRButton) {
        generateQRButton.addEventListener('click', () => {
            qrSection.style.display = 'block';
        });
    }

    const placeOrderButton = document.getElementById('placeOrder');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function() {
            console.log('=== PLACE ORDER CLICKED ===');
            
            if (validateInputs()) {
                console.log('Validation passed');
                
                const fullname = document.getElementById('fullname').value;
                const name = document.getElementById('name').value;
                let address = document.getElementById('address').value.trim();
                
                address = capitalizeAddress(address);
                shipping = calculateShipping(address);
                const finalTotal = subtotal + shipping - discount;
                
                console.log('Final calculation:', {
                    subtotal,
                    shipping,
                    discount,
                    finalTotal
                });
                
                localStorage.setItem('userFullname', fullname);
                localStorage.setItem('userPhone', name);
                localStorage.setItem('userAddress', address);
                
                const finalCart = mergeDuplicateItems(uniqueCart);
                localStorage.setItem('cart', JSON.stringify(finalCart));
                
                localStorage.setItem('orderSubtotal', subtotal.toString());
                localStorage.setItem('orderShipping', shipping.toString());
                localStorage.setItem('orderDiscount', discount.toString());
                localStorage.setItem('orderTotal', finalTotal.toString());
                
                // Kiểm tra phương thức thanh toán
                const paymentRadios = document.querySelectorAll('input[name="payment"]');
                console.log('Payment radios found:', paymentRadios.length);
                
                const selectedPayment = document.querySelector('input[name="payment"]:checked');
                console.log('Selected payment:', selectedPayment ? selectedPayment.value : 'NONE');
                
                const paymentStatus = (selectedPayment && selectedPayment.value === 'bank') 
                    ? 'Đã thanh toán' 
                    : 'Chưa thanh toán';
                
                console.log('Payment status:', paymentStatus);
                
                // ✅ LẤY EMAIL VÀ TẠO KEY RIÊNG CHO USER
                const userEmail = localStorage.getItem('userEmail') || 'guest';
                const ordersKey = `orders_${userEmail}`;
                
                // ✅ LẤY ĐƠN HÀNG CỦA USER NÀY
                let existingOrders = JSON.parse(localStorage.getItem(ordersKey)) || [];
                
                const newOrder = {
                    id: "#HD" + Math.floor(Math.random() * 10000),
                    date: new Date().toLocaleDateString("vi-VN"),
                    address: address,
                    total: finalTotal,
                    payment: paymentStatus,
                    delivery: "Chưa giao hàng"
                };
                
                console.log('New order:', newOrder);
                
                existingOrders.push(newOrder);
                
                // ✅ LƯU VÀO KEY RIÊNG CỦA USER
                localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
                localStorage.setItem("userFullname", fullname);
                
                console.log('Order saved to:', ordersKey);
                console.log('Order saved to localStorage');
                
                alert("Đơn hàng được tạo thành công!");
                
                console.log('Redirecting to chitiethoadon.html...');
                window.location.href = "chitiethoadon.html";
            } else {
                console.log('Validation FAILED');
            }
        });
    } else {
        console.error('❌ Không tìm thấy nút "Đặt hàng" (placeOrder)');
    }

    // XỬ LÝ VOUCHER
    const applyVoucherBtn = document.getElementById("applyVoucher");
    
    if (applyVoucherBtn) {
        console.log('✅ Found applyVoucher button');
        applyVoucherBtn.addEventListener('click', function() {
            console.log('Apply voucher clicked');
            
            const voucherInput = document.getElementById("discount") || document.getElementById("voucher");
            const code = voucherInput ? voucherInput.value.trim().toUpperCase() : '';
            const msg = document.getElementById("voucher-message");
            
            // ✅ LẤY ĐƠN HÀNG CỦA USER HIỆN TẠI
            const userEmail = localStorage.getItem('userEmail') || 'guest';
            const ordersKey = `orders_${userEmail}`;
            const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
            
            const today = new Date();
            const day = today.getDay();
            const todayDate = today.toLocaleDateString("vi-VN");

            let voucherDiscount = 0;
            let message = "";

            if (!code) {
                if (msg) {
                    msg.textContent = "❌ Vui lòng nhập mã voucher.";
                    msg.style.color = "red";
                }
                return;
            }

            if (code === "KHMOI") {
                if (orders.length === 0) {
                    voucherDiscount = subtotal * 0.3;
                    message = "✅ Áp dụng KHMOI: giảm 30% cho khách hàng mới.";
                } else {
                    message = "❌ Voucher chỉ dành cho khách hàng mới.";
                }
            } else if (code === "T5NUAGIA") {
                if (day === 4) {
                    voucherDiscount = Math.min(subtotal * 0.5, 150000);
                    message = "✅ Áp dụng T5NUAGIA: giảm 50% tối đa 150.000đ.";
                } else {
                    message = "❌ Voucher chỉ áp dụng vào Thứ Năm.";
                }
            } else if (code === "SHIP0Đ") {
                const todayOrders = orders.filter(o => o.date === todayDate);
                if (todayOrders.length >= 1) {
                    voucherDiscount = shipping;
                    message = "✅ Áp dụng SHIP0Đ: miễn phí vận chuyển.";
                } else {
                    message = "❌ Voucher chỉ áp dụng khi bạn đã có 1 đơn trong hôm nay.";
                }
            } else {
                message = "❌ Mã voucher không hợp lệ.";
            }

            if (voucherDiscount > 0) {
                discount = voucherDiscount;
                const finalTotal = subtotal + shipping - discount;
                document.getElementById("total").textContent = finalTotal.toLocaleString() + "đ";
                
                console.log('Voucher applied:', {
                    code,
                    discount,
                    finalTotal
                });
                
                if (msg) msg.style.color = "green";
            } else {
                if (msg) msg.style.color = "red";
            }

            if (msg) msg.textContent = message;
        });
    } else {
        console.warn('⚠️ Không tìm thấy nút "applyVoucher"');
    }
});

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

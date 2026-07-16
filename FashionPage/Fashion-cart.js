// fashion-cart.js - Fashion Page-er jonno Cart Logic Script

(function () {

    let cart = JSON.parse(localStorage.getItem('omart_cart')) || [];

    function toggleCart() {
        const cartSlider = document.getElementById('cart-slider');
        const cartBackdrop = document.getElementById('cart-backdrop');
        
        if (cartSlider) cartSlider.classList.toggle('active');
        if (cartBackdrop) cartBackdrop.classList.toggle('active');
    }

    const checkoutBtn = document.getElementById('checkout-btn-id');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Proceeding to Checkout!');
        });
    }

    document.addEventListener('click', function (e) {

        if (e.target.closest('.cart-section')) {
            e.preventDefault();
            toggleCart();
        }
        
        if (e.target.closest('#cart-close-id') || e.target.closest('#cart-backdrop')) {
            toggleCart();
        }

        if (e.target.closest('.add-to-cart .btn')) {
            const productContainer = e.target.closest('.fashion-product-container');
            if (!productContainer) return;

            const titleElement = productContainer.querySelector('.fashion-product-details p');
            const priceElement = productContainer.querySelector('.fashion-product-ratings h4');
            const imgElement = productContainer.querySelector('.fashion-product-offer img');

            if (!titleElement || !priceElement || !imgElement) return;

            const title = titleElement.innerText.split(' - ')[0].trim(); 
            const price = parseFloat(priceElement.innerText.replace(/[^0-9.]/g, '')) || 0;
            const thumbnail = imgElement.src;

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ title, price, thumbnail, quantity: 1 });
            }

            updateCartUI();
            toggleCart();
        }
    });


    function updateCartUI() {
        localStorage.setItem('omart_cart', JSON.stringify(cart));

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const navBtn = document.querySelector('.cart-section .nav-btn');
        if (navBtn) {
            let badge = document.getElementById('nav-cart-count');
            if (!badge) {
                badge = document.createElement('span');
                badge.id = 'nav-cart-count';
                navBtn.style.position = 'relative';
                navBtn.appendChild(badge);
            }
            badge.innerText = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-block' : 'none'; // কার্ট খালি হলে ব্যাজ হাইড থাকবে
        }

        const cartCountTitle = document.getElementById('cart-count-title');
        const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
        
        if (cartCountTitle) cartCountTitle.innerText = totalItems;
        if (cartSubtotalPrice) cartSubtotalPrice.innerText = `${totalPrice.toFixed(2)} TK`;

        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding:40px 0; color:#888;">Your cart is empty!</p>`;
            return;
        }

        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>${item.price} TK</p>
                    <div class="quantity-controls">
                        <button class="q-minus" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="q-plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete-item-btn" data-index="${index}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }

    const itemsContainer = document.getElementById('cart-items-container');
    if (itemsContainer) {
        itemsContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;

            const index = parseInt(btn.getAttribute('data-index'));
            if (isNaN(index)) return;

            if (btn.classList.contains('q-plus')) {
                cart[index].quantity += 1;
            } else if (btn.classList.contains('q-minus')) {
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) cart.splice(index, 1);
            } else if (btn.classList.contains('delete-item-btn')) {
                cart.splice(index, 1);
            }

            updateCartUI();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCartUI);
    } else {
        updateCartUI();
    }
})();
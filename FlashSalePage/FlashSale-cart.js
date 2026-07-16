// cart.js

(function () {
    let cart = JSON.parse(localStorage.getItem('omart_cart')) || [];

    function toggleCart() {
        document.getElementById('cart-slider').classList.toggle('active');
        document.getElementById('cart-backdrop').classList.toggle('active');
    }

    const checkoutBtn = document.getElementById('checkout-btn-id');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
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
            const productContainer = e.target.closest('.flash-sale-product-container');
            if (!productContainer) return;

            const titleFull = productContainer.querySelector('.flash-sale-product-details p').innerText;
            const title = titleFull.split(' - ')[0];
            const priceText = productContainer.querySelector('.flash-sale-product-ratings h4').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const thumbnail = productContainer.querySelector('.flash-sale-product-offer img').src;

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
        }

        document.getElementById('cart-count-title').innerText = totalItems;
        document.getElementById('cart-subtotal-price').innerText = `${totalPrice} TK`;

        const container = document.getElementById('cart-items-container');
        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding:40px 0; color:#888;">Your cart is empty!</p>`;
            return;
        }

        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.thumbnail}">
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

    setTimeout(updateCartUI, 500);
})();
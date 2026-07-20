// Function to switch main product image via thumbnails
function changeImage(element) {
    document.getElementById('main-product-image').src = element.src;
    let thumbnails = document.querySelectorAll('.thumb-img');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// Function to select product color variant
function selectColor(element) {
    let colors = document.querySelectorAll('.color-dot');
    colors.forEach(color => color.classList.remove('selected'));
    element.classList.add('selected');
}

// Function to select product size variant
function selectSize(element) {
    let sizes = document.querySelectorAll('.size-btn');
    sizes.forEach(size => size.classList.remove('selected'));
    element.classList.add('selected');
}

// Function to increase/decrease quantity counter
function updateQuantity(change) {
    let qtyInput = document.getElementById('qty-count');
    let currentQty = parseInt(qtyInput.value);
    let newQty = currentQty + change;
    if (newQty >= 1) {
        qtyInput.value = newQty;
    }
}

// Action for Add to Cart
function addToCart() {
    let qty = document.getElementById('qty-count').value;
    alert(qty + ' product(s) successfully added to your cart!');
}

// Action for Buy Now
function buyNow() {
    let qty = document.getElementById('qty-count').value;
    alert('Proceeding directly to checkout with ' + qty + ' item(s)...');
}

// ১. URL থেকে আইডি বের করা
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// ২. আইডি পাওয়া গেলে DummyJSON থেকে প্রোডাক্টের স্পেসিফিক ডেটা আনা
if (productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            displayProductDetails(product);
        })
        .catch(err => console.error("Error fetching product:", err));
} else {
    console.log("No product ID found in the URL. Redirect bypassed.");
}

// ৩. ডিটেইলস পেজের HTML-এ ডেটা পুশ করা
function displayProductDetails(product) {
    // ছবি পরিবর্তন
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) mainImg.src = product.thumbnail;
    
    // ডাইনামিক থাম্বনেইল গ্যালারি
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    if (thumbnailContainer && product.images) {
        thumbnailContainer.innerHTML = '';
        product.images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.className = `thumb-img ${index === 0 ? 'active' : ''}`;
            img.src = imgUrl;
            img.alt = `${product.title} view ${index + 1}`;
            img.onclick = function() { changeImage(this); };
            thumbnailContainer.appendChild(img);
        });
    }
    
    // টাইটেল, BRAND, প্রাইস এবং ডেসক্রিপশন
    const halfPriceInBDT = Math.round(product.price * 60);
    
    document.querySelector('.product-title').innerText = product.title;
    document.querySelector('.brand-name').innerText = product.brand || "Premium Quality";
    document.querySelector('.price-tag').innerText = `${halfPriceInBDT} Tk`;
    document.querySelector('.product-desc').innerText = product.description;

    // --- ডাইনামিক কালার অপশন (.color-pickers) ---
    const colorContainer = document.querySelector('.color-pickers');
    if (colorContainer) {
        colorContainer.innerHTML = '';
        const availableColors = product.colors || ["#3b82f6", "#ec4899", "#10b981"];
        availableColors.forEach((color, index) => {
            const colorDot = document.createElement('div');
            colorDot.className = `color-dot ${index === 0 ? 'selected' : ''}`;
            colorDot.style.backgroundColor = color;
            colorDot.onclick = function() { selectColor(this); };
            colorContainer.appendChild(colorDot);
        });
    }

    // --- ডাইনামিক সাইজ অপশন (.size-pickers) ---
    const sizeContainer = document.querySelector('.size-pickers');
    if (sizeContainer) {
        sizeContainer.innerHTML = '';
        const availableSizes = product.sizes || ["M", "L", "XL"];
        availableSizes.forEach((size, index) => {
            const sizeBtn = document.createElement('button');
            sizeBtn.className = `size-btn ${index === 0 ? 'selected' : ''}`;
            sizeBtn.innerText = size;
            sizeBtn.onclick = function() { selectSize(this); };
            sizeContainer.appendChild(sizeBtn);
        });
    }

    // স্পেসিফিকেশন টেবিল আপডেট করা
    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        specsTable.innerHTML = `
            <tr>
                <td class="specs-label">Category</td>
                <td class="specs-value">${product.category.toUpperCase()}</td>
            </tr>
            <tr>
                <td class="specs-label">Stock Status</td>
                <td class="specs-value">${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</td>
            </tr>
            <tr>
                <td class="specs-label">Rating</td>
                <td class="specs-value">${product.rating} / 5</td>
            </tr>
            <tr>
                <td class="specs-label">Warranty</td>
                <td class="specs-value">${product.warrantyInformation || '6 Months Warranty'}</td>
            </tr>
        `;
    }

    // --- ডাইনামিক কাস্টমার রিভিউ সেকশন (.reviews-container) ---
    const reviewsContainer = document.querySelector('.reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '';
        
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.innerText = 'Customer Reviews';
        reviewsContainer.appendChild(title);
        
        if (product.reviews && product.reviews.length > 0) {
            // শুধুমাত্র ৩, ৪ এবং ৫ স্টারের ভালো রিভিউগুলো ফিল্টার করা হলো
            const goodReviews = product.reviews.filter(review => review.rating && Number(review.rating) > 2);

            if (goodReviews.length > 0) {
                goodReviews.forEach(review => {
                    const card = document.createElement('div');
                    card.className = 'review-card';

                    const info = document.createElement('div');
                    info.className = 'reviewer-info';

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'reviewer-name';
                    
                    let stars = '';
                    for (let i = 1; i <= 5; i++) {
                        stars += i <= review.rating ? '★' : '☆';
                    }
                    nameSpan.innerHTML = `${review.reviewerName} <span class="review-stars">${stars}</span>`;

                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'review-date';
                    dateSpan.innerText = new Date(review.date).toLocaleDateString();

                    info.appendChild(nameSpan);
                    info.appendChild(dateSpan);

                    const text = document.createElement('p');
                    text.className = 'review-text';

                    // API এর খারাপ বা সাধারণ কমেন্টগুলোকে চমৎকার ও প্রফেশনাল কমেন্টে রূপান্তর করার লজিক
                    let customizedComment = review.comment;
                    const lowerComment = review.comment.toLowerCase();

                    if (review.rating === 5) {
                        if (lowerComment.includes('bad') || lowerComment.includes('unhappy') || lowerComment.includes('disappointed') || lowerComment.includes('waste')) {
                            customizedComment = "Absolutely amazing product! The quality exceeded my expectations. Highly recommended!";
                        } else {
                            customizedComment = "Highly recommended! Premium quality and super fast delivery. Completely satisfied.";
                        }
                    } else if (review.rating === 4) {
                        if (lowerComment.includes('bad') || lowerComment.includes('unhappy') || lowerComment.includes('disappointed')) {
                            customizedComment = "Great product and excellent value for money. Packaging could be slightly better, but overall happy.";
                        } else {
                            customizedComment = "Very good product. Satisfied with the purchase and would buy again.";
                        }
                    } else if (review.rating === 3) {
                        customizedComment = "Decent product for the price. It does the job well enough.";
                    }

                    text.innerText = customizedComment;

                    card.appendChild(info);
                    card.appendChild(text);
                    reviewsContainer.appendChild(card);
                });
            } else {
                const noReview = document.createElement('p');
                noReview.className = 'no-reviews-text';
                noReview.innerText = 'No reviews available for this product.';
                reviewsContainer.appendChild(noReview);
            }
        } else {
            const noReview = document.createElement('p');
            noReview.className = 'no-reviews-text';
            noReview.innerText = 'No reviews available for this product.';
            reviewsContainer.appendChild(noReview);
        }
    }
}
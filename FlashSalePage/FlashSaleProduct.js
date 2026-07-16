// FlashSaleProduct.js

document.addEventListener('DOMContentLoaded', () => {
    const flashSaleSection = document.getElementById('flash-sale-section');
    const searchInput = document.querySelector('.search-input'); 

    let allProducts = [];

    async function loadFlashSaleProducts() {
        try {
            const response = await fetch('https://dummyjson.com/products?limit=30&skip=16');
            if (!response.ok) throw new Error('Flash sale data load failed!');

            const data = await response.json();
            allProducts = data.products;
            
            renderProducts(allProducts);

        } catch (error) {
            console.error('Error loading flash sale:', error);
            if (flashSaleSection) {
                flashSaleSection.innerHTML = `<p style="color: red; padding: 20px; text-align:center; width:100%;">ফ্ল্যাশ সেল প্রোডাক্ট লোড করা সম্ভব হয়নি।</p>`;
            }
        }
    }

    function renderProducts(products) {
        if (!flashSaleSection) return;

        if (products.length === 0) {
            flashSaleSection.innerHTML = `<p style="padding: 20px; color: white; text-align:center; width:100%;">দুঃখিত, কোনো প্রোডাক্ট পাওয়া যায়নি!</p>`;
            return;
        }

        flashSaleSection.innerHTML = products.map(product => {
            
            let rating = product.rating;
            const integerPart = Math.floor(rating);
            const decimalPart = rating - integerPart;

            if (decimalPart > 0.5) {
                rating = integerPart + 0.5;
            } else {
                rating = parseFloat(rating.toFixed(1)); 
            }

            const floorRating = Math.floor(rating);
            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < floorRating) {
                    starsHTML += '<i class="fa-solid fa-star icon1"></i>';
                } else if (i === floorRating && (rating % 1) >= 0.5) {
                    starsHTML += '<i class="fa-solid fa-star-half-stroke icon1"></i>';
                } else {
                    starsHTML += '<i class="fa-regular fa-star icon1"></i>';
                }
            }

            const originalPrice = product.price;
            const discountPercentage = product.discountPercentage;
            
            const discountedPriceInUSD = originalPrice - (originalPrice * (discountPercentage / 100));
            
            const finalPriceInBDT = Math.round(discountedPriceInUSD * 60);

            return `
                <div class="flash-sale-product-container">

                    <div class="flash-sale-product-offer">
                        <p class="flex"> <i class="fa-solid fa-fire-flame-curved"></i> Flash Sale</p>
                        <span class="flex">${Math.round(discountPercentage)}% off</span>
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>

                    <div class="flash-sale-product-details">
                        <p>${product.title} - ${product.description.substring(0, 40)}...</p>
                    </div>

                    <div class="flash-sale-product-ratings flex">
                        <div class="product-ratings flex">
                            ${starsHTML}
                            <p>${rating}</p>
                        </div>
                        <h4>Price : ${finalPriceInBDT} TK</h4>
                    </div>

                    <div class="add-to-cart flex">
                        <button class="btn">
                            <h4>Add to cart</h4>
                        </button>
                    </div>

                </div>
            `;
        }).join('');
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === "") {
                renderProducts(allProducts);
                return;
            }

            const filteredProducts = allProducts.filter(p => 
                p.title.toLowerCase().includes(searchTerm) || 
                p.category.toLowerCase().includes(searchTerm) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
            
            renderProducts(filteredProducts);
        });
    }

    loadFlashSaleProducts();
});



// FashionProduct.js

document.addEventListener('DOMContentLoaded', () => {
    const fashionSection = document.getElementById('fashion-section');
    const searchInput = document.querySelector('.search-input'); 

    let allFashionProducts = [];

    async function loadFashionProducts() {
        try {
            const response = await fetch('https://dummyjson.com/products?limit=0');
            if (!response.ok) throw new Error('Fashion data load failed!');

            const data = await response.json();
            
            const fashionCategories = [
                'mens-shirts', 'mens-shoes', 'shirts', 'tops',
                'womens-dresses', 'womens-shoes', 'womens-bags', 
                'watches', 'sunglasses', 'jewellery'
            ];

            allFashionProducts = data.products
                .filter(product => fashionCategories.includes(product.category))
                .slice(0, 32); 

            renderProducts(allFashionProducts);

        } catch (error) {
            console.error('Error loading fashion products:', error);
            if (fashionSection) {
                fashionSection.innerHTML = `<p style="color: red; padding: 20px; text-align:center; width:100%;">ফ্যাশন প্রোডাক্ট লোড করা সম্ভব হয়নি।</p>`;
            }
        }
    }

    function renderProducts(products) {
        if (!fashionSection) return;

        if (products.length === 0) {
            fashionSection.innerHTML = `<p style="padding: 20px; color: black; text-align:center; width:100%;">দুঃখিত, কোনো প্রোডাক্ট পাওয়া যায়নি!</p>`;
            return;
        }

        fashionSection.innerHTML = products.map(product => {
            
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
            const finalPriceInBDT = Math.round(discountedPriceInUSD * 120);

            return `
                <div class="fashion-product-container">
                
                    <div class="fashion-product-offer">
                        <p class="flex"> <i class="fa-solid fa-fire-flame-curved"></i>Hot deal</p>
                        <span class="flex">${Math.round(discountPercentage)}% off</span>
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>

                    <div class="fashion-product-details">
                        <p>${product.title} - ${product.description.substring(0, 50)}...</p>
                    </div>

                    <div class="fashion-product-ratings flex">
                        <div class="product-ratings flex">
                            ${starsHTML}
                            <p>${rating}</p>
                        </div>
                        <h4>Price : ${finalPriceInBDT} TK</h4>
                    </div>

                    <div class="add-to-cart flex">
                        <button class="btn">
                            <h4>shop now</h4>
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
                renderProducts(allFashionProducts);
                return;
            }

            const filteredProducts = allFashionProducts.filter(p => 
                p.title.toLowerCase().includes(searchTerm) || 
                p.category.toLowerCase().includes(searchTerm) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
            
            renderProducts(filteredProducts);
        });
    }

    loadFashionProducts();
});
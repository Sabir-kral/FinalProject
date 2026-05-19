document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products-container");
    const categoryList = document.getElementById("category-list");
    const searchInput = document.getElementById("input");
    const searchBtn = document.getElementById("search-btn");
    const sortSelect = document.getElementById("sort-select");
    const refreshButton = document.getElementById("refreshButton");
    const ratingContainer = document.getElementById("rating-filter");

    let allProducts = [];
    let currentFilters = { name: "", category: "all", rating: 0 };

    /**
     * 1. Səbət sayını yeniləyən Qlobal Funksiya
     * Bunu window obyektinə bağlayırıq ki, hər yerdən əlçatan olsun.
     */
    window.updateCartCount = async function () {
        const userData = JSON.parse(localStorage.getItem("activeUser"));
        if (!userData) {
            document.getElementById("cart-count").innerText = "0";
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/cart/my-cart", {
                headers: { "Authorization": `Bearer ${userData.accessToken}` }
            });
            if (response.ok) {
                const cartItems = await response.json();
                // Bütün məhsulların miqdarını (quantity) cəmləyirik
                const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                const cartBadge = document.getElementById("cart-count");
                if (cartBadge) cartBadge.innerText = totalCount;
            }
        } catch (error) {
            console.error("Səbət sayğacı yenilənmədi:", error);
        }
    };

    // 2. Məlumatları Backend-dən gətir
    async function loadInitialData() {
        try {
            // Səhifə açılan kimi sayğacı və məhsulları yüklə
            await window.updateCartCount();
            
            const userData = JSON.parse(localStorage.getItem("activeUser"));
            const headers = userData ? { "Authorization": `Bearer ${userData.accessToken}` } : {};
            const response = await fetch("http://localhost:8080/api/products/all", { headers });
            
            if (!response.ok) throw new Error("Məhsullar yüklənmədi");
            allProducts = await response.json();
            
            await fetchCategories();
            applyFilters();
        } catch (error) {
            console.error("Yükləmə xətası:", error);
        }
    }

    // 3. Kateqoriyaları gətir
    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:8080/api/categories");
            const categories = await response.json();
            if (categoryList) {
                categoryList.innerHTML = '<li data-category="all" class="active">All Categories</li>' + 
                    categories.map(c => `<li data-category="${c.name}">${c.name}</li>`).join("");

                categoryList.querySelectorAll("li").forEach(li => {
                    li.addEventListener("click", () => {
                        categoryList.querySelectorAll("li").forEach(el => el.classList.remove("active"));
                        li.classList.add("active");
                        currentFilters.category = li.getAttribute("data-category");
                        applyFilters();
                    });
                });
            }
        } catch (error) {
            console.error("Kateqoriya xətası:", error);
        }
    }

    // 4. Reytinq düymələri
    if (ratingContainer) {
        ratingContainer.querySelectorAll(".rate-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const selectedRate = parseInt(btn.getAttribute("data-rate"));
                if (currentFilters.rating === selectedRate) {
                    currentFilters.rating = 0;
                    btn.style.color = ""; 
                } else {
                    currentFilters.rating = selectedRate;
                    ratingContainer.querySelectorAll(".rate-item").forEach(b => b.style.color = "");
                    btn.style.color = "gold"; 
                }
                applyFilters();
            });
        });
    }

    // 5. Filtrləri tətbiq et
    function applyFilters() {
        let filtered = [...allProducts];

        if (currentFilters.name) {
            filtered = filtered.filter(p => 
                (p.brand + " " + p.model).toLowerCase().includes(currentFilters.name.toLowerCase())
            );
        }

        if (currentFilters.category !== "all") {
            filtered = filtered.filter(p => (p.categoryName || p.category?.name) === currentFilters.category);
        }

        if (currentFilters.rating > 0) {
            filtered = filtered.filter(p => Math.floor(parseFloat(p.rating) || 0) === currentFilters.rating);
        }

        if (sortSelect.value === "price_asc") filtered.sort((a, b) => a.price - b.price);
        else if (sortSelect.value === "price_desc") filtered.sort((a, b) => b.price - a.price);

        renderProducts(filtered);
    }

    // 6. Məhsulları ekrana çıxar
    function renderProducts(data) {
        if (!productsContainer) return;
        if (data.length === 0) {
            productsContainer.innerHTML = '<p style="padding:20px;">Məhsul tapılmadı.</p>';
            return;
        }

        productsContainer.innerHTML = data.map(d => {
            const imgPath = d.image && d.image !== "string" 
                ? `http://localhost:8080/uploads/${d.image}` 
                : "https://placehold.co/200x250?text=No+Photo";
            
            const rating = Math.max(0, Math.min(5, Math.floor(d.rating || 0)));
            
            return `
                <div class="product-card" onclick="goToProduct(${d.id})">
                    <div class="product-image">
                        <img src="${imgPath}" onerror="this.src='https://placehold.co/200x250?text=Error'">
                    </div>
                    <div class="product-info">
                        <h4>${d.brand} ${d.model}</h4>
                        <div class="stars">${"★".repeat(rating)}${"☆".repeat(5-rating)}</div>
                        <p class="price">${d.price} AZN</p>
                        <button class="add-to-cart-btn" onclick="addToCart(event, ${d.id})">
                            Add to cart
                        </button>
                    </div>
                </div>`;
        }).join("");
    }

    // Event Listeners
    searchInput?.addEventListener("input", e => { currentFilters.name = e.target.value; applyFilters(); });
    searchBtn?.addEventListener("click", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);
    refreshButton?.addEventListener("click", () => { 
        currentFilters = { name: "", category: "all", rating: 0 };
        location.reload(); 
    });

    loadInitialData();
});

/**
 * Qlobal funksiyalar (DOMContentLoaded xaricində)
 */
window.goToProduct = function(id) {
    localStorage.setItem("selectedProductId", id);
    window.location.href = "../productİnfo/product.html"; 
};

window.addToCart = async function(event, productId) {
    event.stopPropagation();
    const userData = JSON.parse(localStorage.getItem("activeUser"));
    if (!userData) { alert("Zəhmət olmasa giriş edin!"); return; }

    const btn = event.currentTarget;
    try {
        const response = await fetch(`http://localhost:8080/api/cart/add/${productId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${userData.accessToken}` }
        });
        
        if (response.ok) {
            btn.innerText = "Əlavə edildi!";
            btn.style.backgroundColor = "#28a745"; 
            
            // Səbət sayını dərhal yeniləyirik
            await window.updateCartCount(); 
            
            setTimeout(() => {
                btn.innerText = "Add to cart";
                btn.style.backgroundColor = ""; 
            }, 2000);
        }
    } catch (e) { 
        console.error("Səbətə əlavə edilərkən xəta:", e); 
    }
};

window.openCart = function() {
    window.location.href = "../cart/cart.html";
};
document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products-container");
    const categoryList = document.getElementById("category-list");
    const searchInput = document.getElementById("input");
    const sortSelect = document.getElementById("sort-select");
    const ratingFilter = document.getElementById("rating-filter");
    const refreshButton = document.getElementById("refreshButton");

    let allProducts = [];
    let currentFilters = { name: "", category: "all", rating: 0 };

    async function loadInitialData() {
        try {
            const userData = JSON.parse(localStorage.getItem("activeUser"));
            const headers = userData ? { "Authorization": `Bearer ${userData.accessToken}` } : {};
            const response = await fetch("http://localhost:8080/api/products/all", { headers });
            
            if (!response.ok) throw new Error("Mehsullar yuklenmedi");
            allProducts = await response.json();
            fetchCategories(); 
            applyFilters();
        } catch (error) {
            console.error("Xeta:", error);
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:8080/api/categories");
            const categories = await response.json();
            if (categoryList) {
                categoryList.innerHTML = '<li data-category="all" class="active">All Categories</li>' + 
                    categories.map(c => `<li data-category="${c.name}">${c.name}</li>`).join("");
            }
        } catch (error) {
            console.error("Kateqoriya xetasi:", error);
        }
    }

    window.goToProduct = function(id) {
        if (!id) return;
        localStorage.setItem("selectedProductId", id);
        window.location.href = "../productİnfo/product.html"; 
    };

    window.addToCart = async function(event, productId) {
        event.stopPropagation();
        const userData = JSON.parse(localStorage.getItem("activeUser"));
        
        if (!userData || !userData.accessToken) {
            alert("Sebete mehsul elave etmek ucun giris etmelisiniz!");
            window.location.href = "../signUp.html";
            return;
        }

        const btn = event.currentTarget; 

        try {
            const response = await fetch(`http://localhost:8080/api/cart/add/${productId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${userData.accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i> Elave edildi';
                btn.classList.add("added-success");
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.classList.remove("added-success");
                }, 2000);
            } else {
                alert("Xeta bas verdi (Status: " + response.status + ")");
            }
        } catch (error) {
            console.error("Cart error:", error);
        }
    };
    function open(){
        window.location.href = "../cart/cart.html"
    }

    function applyFilters() {
        let filtered = [...allProducts];
        if (currentFilters.name) {
            filtered = filtered.filter(p => (p.brand + " " + p.model).toLowerCase().includes(currentFilters.name.toLowerCase()));
        }
        if (currentFilters.category !== "all") {
            filtered = filtered.filter(p => p.categoryName === currentFilters.category);
        }
        if (currentFilters.rating > 0) {
            filtered = filtered.filter(p => p.rating === currentFilters.rating);
        }
        if (sortSelect.value === "price_asc") filtered.sort((a, b) => a.price - b.price);
        else if (sortSelect.value === "price_desc") filtered.sort((a, b) => b.price - a.price);

        renderProducts(filtered);
    }

    function renderProducts(data) {
        if (!productsContainer) return;
        productsContainer.innerHTML = data.map(d => {
            const imgPath = d.image && d.image !== "string" ? `http://localhost:8080/uploads/${d.image}` : "https://placehold.co/200x250/222/white?text=No+Photo";
            const rating = Math.max(0, Math.min(5, d.rating || 0));
            return `
                <div class="product-card" onclick="goToProduct(${d.id})">
                    <div class="product-image">
                        <img src="${imgPath}" onerror="this.src='https://placehold.co/200x250/222/white?text=Sehv'">
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

    
    searchInput?.addEventListener("input", e => { currentFilters.name = e.target.value; applyFilters(); });
    sortSelect?.addEventListener("change", applyFilters);
    refreshButton?.addEventListener("click", () => { location.reload(); });
    loadInitialData();
});
document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products-container");
    const categoryList = document.getElementById("category-list");
    const searchInput = document.getElementById("input");

    let allProducts = [];
    let currentFilters = { name: "", category: "all" };

    async function loadInitialData() {
        try {
            const response = await fetch("http://localhost:8080/api/products/all");
            allProducts = await response.json();
            fetchCategories(); 
            applyFilters();
        } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    }

    window.goToProduct = function(id) {
        localStorage.setItem("selectedProductId", id);
        window.location.href = "../productİnfo/product.html"; 
    };

    function applyFilters() {
        let filtered = allProducts.filter(p => {
            const matchName = (p.brand + p.model).toLowerCase().includes(currentFilters.name.toLowerCase());
            const matchCat = currentFilters.category === "all" || p.categoryName === currentFilters.category;
            return matchName && matchCat;
        });
        renderProducts(filtered);
    }

    function renderProducts(data) {
        if (!productsContainer) return;
        productsContainer.innerHTML = data.map(d => {
            const imgPath = (d.image && d.image !== "string") ? `http://localhost:8080/uploads/${d.image}` : "https://placehold.co/200x250/222/white?text=No+Photo";
            return `
                <div class="product-card" onclick="goToProduct(${d.id})">
                    <div class="product-image">
                        <img src="${imgPath}" onerror="this.src='https://placehold.co/200x250/222/white?text=Səhv'">
                    </div>
                    <div class="product-info">
                        <h4>${d.brand} ${d.model}</h4>
                        <p class="price">${d.price} AZN</p>
                        <button class="add-to-cart-btn">Səbətə at</button>
                    </div>
                </div>`;
        }).join("");
    }

    categoryList?.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            currentFilters.category = e.target.getAttribute("data-category");
            document.querySelectorAll("#category-list li").forEach(li => li.classList.remove("active"));
            e.target.classList.add("active");
            applyFilters();
        }
    });

    searchInput?.addEventListener("input", (e) => {
        currentFilters.name = e.target.value;
        applyFilters();
    });

    loadInitialData();
});
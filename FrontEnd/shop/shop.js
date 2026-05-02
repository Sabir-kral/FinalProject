
document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products-container");
    const cartCount = document.getElementById("cart-count");
    const categoryList = document.getElementById("category-list");
    const searchInputs = document.querySelectorAll(".search-box");
    const cartBtn = document.getElementById("cart-btn");
    const sortOptions = document.getElementById("sort-options");
    const refreshButton = document.getElementById("refreshButton");

    let user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) {
        alert("Please log in first.");
        window.location.href = "../login/login.html";
        return;
    }

    let cartKey = `cart_${user.username}`;
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    function updateCartCount() {
        cartCount.innerText = cart.length;
    }

    function getCategories() {
        let categories = new Set(["All"]);
        products.forEach(product => categories.add(product.category));
        return [...categories];
    }

    function updateCategoryList() {
        categoryList.innerHTML = "";
        getCategories().forEach(category => {
            let li = document.createElement("li");
            li.innerText = category;
            li.dataset.category = category;
            li.addEventListener("click", function () {
                renderProducts(category, 0, "", sortOptions.value);
            });
            categoryList.appendChild(li);
        });
    }

    function renderProducts(filterCategory = "All", filterRating = 0, searchQuery = "", sortBy = "default") {
        productsContainer.innerHTML = "";

        let filteredProducts = products.filter(product => {
            return (filterCategory === "All" || product.category === filterCategory) &&
                   (filterRating === 0 || product.rating == filterRating) &&
                   (searchQuery === "" || product.model.toLowerCase().includes(searchQuery.toLowerCase()));
        });

        if (sortBy === "price-low") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating-high") {
            filteredProducts.sort((a, b) => b.rating - a.rating);
        }

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = "<p>No products found.</p>";
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img class="img" id="${product.id}" src="${product.image}" alt="${product.model}">
                <h3>${product.brand} ${product.model}</h3>
                <p>${product.price} $</p>
                <p>⭐ ${product.rating}/5</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productCard.style.height = "400px";

            productCard.querySelector(".add-to-cart").addEventListener("click", function () {
                addToCart(product);
            });

            productsContainer.appendChild(productCard);
        });
    }

    function addToCart(product) {
       
      
        let user = JSON.parse(localStorage.getItem("activeUser"));
        if (!user) return;
    
        let cartKey = `cart_${user.username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        let existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
           
        } else {

            product.quantity = 1;
            cart.push(product);
            location.reload();
       
        }
        updateCartCount();
        localStorage.setItem(cartKey, JSON.stringify(cart));
       
    }
    

    document.querySelectorAll("#rating-filter button").forEach(ratingBtn => {
        ratingBtn.addEventListener("click", function () {
            let rating = parseInt(this.dataset.rating);
            renderProducts("All", rating, searchInputs[0]?.value || "", sortOptions.value);
        });
    });

    searchInputs.forEach(input => {
        input.addEventListener("input", function () {
            renderProducts("All", 0, this.value, sortOptions.value);
        });
    });

    sortOptions.addEventListener("change", function () {
        renderProducts("All", 0, searchInputs[0]?.value || "", this.value);
    });

    cartBtn.addEventListener("click", function () {
        window.location.href = "../cart/cart.html";
    });

    categoryList.addEventListener("click", function (event) {
        if (event.target.dataset.category) {
            renderProducts(event.target.dataset.category, 0, searchInputs[0]?.value || "", sortOptions.value);
        }
    });

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("img")) {
            let id = event.target.id;
            let mehsul = products.find(product => product.id == id);

            if (mehsul) {
                let product = {
                    brand: mehsul.brand,
                    model: mehsul.model,
                    category: mehsul.category,
                    description: mehsul.description,
                    price: mehsul.price,
                    rating: mehsul.rating,
                    image: mehsul.image
                };
                localStorage.setItem("product-about", JSON.stringify(product));
                window.location.href = "../productİnfo/product.html";
            }
        }
    });

    if (refreshButton) {
        refreshButton.addEventListener("click", function() {
            location.reload();
        });
    }

    updateCartCount();
    updateCategoryList();
    renderProducts();
});
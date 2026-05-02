document.addEventListener("DOMContentLoaded", function () {
    let product = JSON.parse(localStorage.getItem("product-about"));

    if (!product) {
        alert("No product found!");
        window.location.href = "index.html"; 
        return;
    }

    document.querySelector(".product-image img").src = product.image;
    document.querySelector(".product-image img").alt = product.model;
    document.querySelector(".product-info h2").innerText = `${product.brand} ${product.model}`;
    document.querySelector(".rating").innerHTML = `⭐⭐⭐⭐☆ (${product.rating} Reviews) | <span class="stock">In Stock</span>`;
    document.querySelector(".price").innerText = `$${product.price}`;
    document.querySelector(".description").innerText = product.description;

    document.querySelector(".add-to-cart").addEventListener("click", function () {
        let user = JSON.parse(localStorage.getItem("users"));
        if (!user) {
            alert("Please log in first!");
            window.open("./login.html")
            return;
        }

        let cartKey = `cart_${user.username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        let existingProduct = cart.find(item => item.model === product.model);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert("Product added to cart!");
    });
});
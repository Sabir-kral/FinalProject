document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    let user = JSON.parse(localStorage.getItem("activeUser"));
    let userProductsKey = `products_${user.username}`;
    let products = JSON.parse(localStorage.getItem(userProductsKey)) || [];
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert("Məhsul tapılmadı!");
        window.location.href = "../userProducts/userProducts.html";
        return;
    }
    document.getElementById("brand").value = product.brand;
    document.getElementById("model").value = product.model;
    document.getElementById("category").value = product.category;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;
    document.getElementById("rating").value = product.rating;
    document.getElementById("imageUrl").value = product.image;
    document.getElementById("preview").src = product.image;
    document.getElementById("editProductForm").addEventListener("submit", function (event) {
        event.preventDefault();
        product.brand = document.getElementById("brand").value;
        product.model = document.getElementById("model").value;
        product.category = document.getElementById("category").value;
        product.description = document.getElementById("description").value;
        product.price = document.getElementById("price").value;
        product.rating = document.getElementById("rating").value;
        product.image = document.getElementById("imageUrl").value;
        localStorage.setItem(userProductsKey, JSON.stringify(products));  
        localStorage.setItem("products", JSON.stringify(products));  
        alert("Məhsul uğurla yeniləndi!");
        window.location.href = "../products.html";
    });
});


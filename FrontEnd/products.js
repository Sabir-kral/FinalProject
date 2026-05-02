document.addEventListener("DOMContentLoaded", function () {
    const productTable = document.getElementById("product-table");

    let user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) {
        alert("İstifadəçi daxil olmayıb!");
        // window.location.href = "login.html";
        return;
    }

    let userProductsKey = `products_${user.username}`;
    let productList = JSON.parse(localStorage.getItem(userProductsKey)) || [];
    let products = JSON.parse(localStorage.getItem("products")) ;

    function renderProducts() {
        productTable.innerHTML = ""; 

        productList.forEach((product) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.brand}</td>
                <td>${product.model}</td>
                <td>${product.category}</td>
                <td><img src="${product.image}" width="50"></td>
                <td>${product.price} $</td>
                <td>${product.rating}/5</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Redaktə</button>
                    <button class="delete-btn" data-id="${product.id}">Sil</button>
                </td>
            `;

            productTable.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", function () {
                const productId = parseInt(this.dataset.id);
                deleteProduct(productId);
            });
        });

        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", function () {
                const productId = parseInt(this.dataset.id);
                localStorage.setItem("editProductId", productId);
                editProduct(productId);
            });
        });
    }

    function deleteProduct(id) {
        productList = productList.filter((product) => product.id !== id);
        products = productList.filter((product) => product.id !== id);
        localStorage.setItem(userProductsKey, JSON.stringify(productList));
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    }

    function editProduct(productId) {
        window.location.href = `./editProduct/edit.html?id=${productId}`;
    }

    renderProducts();
});

document.addEventListener("DOMContentLoaded", function () {
    const productTable = document.getElementById("product-table");

    let user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) {
        alert("İstifadəçi daxil olmayıb!");
        
        return;
    }



    async function renderProducts() {
        productTable.innerHTML = ""; 
        const user = localStorage.getItem("activeUser")
        const token = JSON.parse(user)?.accessToken;
        const response = await fetch("http:
            headers:{"Authorization": "Bearer " + token}
        })


            const data = await response.json();
            document.getElementById("products").innerHTML = data.map(d=>{
                    `
                <td>ID:${d.id}</td>
                <td>Brend:${d.brand}</td>
                <td>Model:${d.model}</td>
                <td>Kateqoriya:${d.category}</td>
                <td>Şəkil:<img src="${d.image}" width="50"></td>
                <td>Qiymət:${d.price} $</td>
                <td>Reytinq:${d.rating}/5</td>
                <td>Əməliyyatlar:</td>
                <td>
                    <button class="edit-btn" data-id="${d.id}">Redaktə</button>
                    <button class="delete-btn" data-id="${d.id}">Sil</button>
                </td>
            `
            }).join("") 



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

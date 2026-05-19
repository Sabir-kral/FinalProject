document.addEventListener("DOMContentLoaded", function () {
    const productTable = document.getElementById("product-table");

    let user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) {
        alert("İstifadəçi daxil olmayıb!");
        window.location.href = "/login.html";
        return;
    }

    async function renderProducts() {
        const token = user.accessToken;

        try {
            // Sənin my-products endpoint-in
            const response = await fetch("http://localhost:8080/api/products/my-products", {
                headers: { "Authorization": "Bearer " + token }
            });

            if (!response.ok) throw new Error("Məlumat alınmadı");

            const data = await response.json();

            productTable.innerHTML = data.map(d => {
                // ŞƏKİL YOLU DÜZƏLİŞİ:
                // Əgər d.image sadəcə fayl adıdırsa (məs: bmw.jpg), server yolunu əvvəlinə əlavə edirik
                const imageUrl = d.image && d.image !== "string" 
                    ? `http://localhost:8080/uploads/${d.image}` 
                    : "https://via.placeholder.com/50?text=No+Image";

                // KATEQORİYA ADI DÜZƏLİŞİ:
                const catName = d.categoryName || (d.category ? d.category.name : "Təyin edilməyib");

                return `
                <tr>
                    <td>${d.id}</td>
                    <td>${d.brand || '---'}</td>
                    <td>${d.model || '---'}</td>
                    <td>${catName}</td>
                    <td>
                        <img src="${imageUrl}" 
                             width="50" height="50" 
                             style="object-fit: cover; border-radius: 4px;"
                             onerror="this.src='https://via.placeholder.com/50?text=Error'">
                    </td>
                    <td>${d.price} $</td>
                    <td>${d.rating ? d.rating + '/5' : '0/5'}</td>
                    <td>
                        <button class="edit-btn" data-id="${d.id}" style="background:#28a745; color:white; border:none; padding:5px; cursor:pointer;">Redaktə</button>
                        <button class="delete-btn" data-id="${d.id}" style="background:#dc3545; color:white; border:none; padding:5px; cursor:pointer;">Sil</button>
                    </td>
                </tr>
                `;
            }).join("");

            attachEventListeners();

        } catch (error) {
            console.error("Xəta:", error);
            productTable.innerHTML = "<tr><td colspan='8'>Məhsul yüklənərkən xəta baş verdi.</td></tr>";
        }
    }

    function attachEventListeners() {
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.onclick = function () {
                const productId = this.dataset.id;
                if (confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) {
                    deleteProduct(productId);
                }
            };
        });

        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.onclick = function () {
                const productId = this.dataset.id;
                window.location.href = `../editProduct/edit.html?id=${productId}`;
            };
        });
    }

    async function deleteProduct(id) {
        const token = user.accessToken;
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            if (response.ok) {
                alert("Məhsul silindi!");
                renderProducts(); 
            } else {
                alert("Silinmə zamanı xəta baş verdi.");
            }
        } catch (error) {
            console.error("Xəta:", error);
        }
    }

    renderProducts();
});
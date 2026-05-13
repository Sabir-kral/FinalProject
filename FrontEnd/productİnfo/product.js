document.addEventListener("DOMContentLoaded", async function () {
    const productId = localStorage.getItem("selectedProductId");
    const userData = JSON.parse(localStorage.getItem("activeUser"));


    if (!productId) {
        alert("Məhsul seçilməyib!");
        window.location.href = "../shop/shop.html";
        return;
    }


    async function loadProductDetails() {
        try {
            const headers = userData ? { "Authorization": `Bearer ${userData.accessToken}` } : {};
            const response = await fetch(`http://localhost:8080/api/products/${productId}`, { headers });

            if (!response.ok) throw new Error("Məhsul məlumatları tapılmadı");

            const p = await response.json();


            const imgElement = document.getElementById("bir"); 
            if (imgElement) {
                imgElement.src = p.image && p.image !== "string" 
                    ? `http://localhost:8080/uploads/${p.image}` 
                    : "https://placehold.co/400x400?text=No+Photo";
            }

            document.querySelector(".product-info h2").innerText = `${p.brand} ${p.model}`;
            document.querySelector(".price").innerText = `${p.price} AZN`;
            document.querySelector(".description").innerText = p.description || "Bu məhsul haqqında əlavə məlumat daxil edilməyib.";


            const cartBtn = document.querySelector(".add-to-cart");
            if (cartBtn) {
                cartBtn.onclick = (e) => window.addToCart(e, productId);
            }

        } catch (error) {
            console.error("Xəta:", error);

        }
    }


    window.addToCart = async function (event, id) {

        if (event) event.stopPropagation();

        if (!userData || !userData.accessToken) {
            alert("Səbətə məhsul əlavə etmək üçün giriş etməlisiniz!");
            window.location.href = "../signUp.html";
            return;
        }

        const btn = event ? event.currentTarget : document.querySelector(".add-to-cart");

        try {
            const response = await fetch(`http://localhost:8080/api/cart/add/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${userData.accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const originalContent = btn.innerHTML;
                btn.innerHTML = "✅ Səbətə əlavə edildi";
                btn.style.backgroundColor = "#4caf50"; 
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.backgroundColor = ""; 
                }, 2000);
            } else {
                const errorData = await response.text();
                alert("Xəta: " + errorData);
            }
        } catch (error) {
            console.error("Cart error:", error);
            alert("Sərvərlə əlaqə kəsildi.");
        }
    };


    loadProductDetails();
});z
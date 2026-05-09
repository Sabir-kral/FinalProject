document.addEventListener("DOMContentLoaded", async function () {
    const productId = localStorage.getItem("selectedProductId");
    if (!productId) {
        window.location.href = "../shop/shop.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!response.ok) throw new Error("Məhsul tapılmadı");
        const p = await response.json();

        document.getElementById("bir").src = p.image && p.image !== "string" 
            ? `http://localhost:8080/uploads/${p.image}` 
            : "https://placehold.co/400x400";
        
        document.querySelector(".product-info h2").innerText = `${p.brand} ${p.model}`;
        document.querySelector(".price").innerText = `${p.price} AZN`;
        document.querySelector(".description").innerText = p.description || "Məlumat yoxdur.";
        
    } catch (error) {
        console.error(error);
        alert("Məhsul yüklənərkən xəta oldu.");
    }
});
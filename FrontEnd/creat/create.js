document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const previewImage = document.getElementById("preview-image");
    const imageUrlInput = document.getElementById("image-url");

    let user = JSON.parse(localStorage.getItem("activeUser"));

    if (!user) {
        alert("İstifadəçi daxil olmayıb!");
        return;
    }

    let userProductsKey = `products_${user.username}`;
    let allProductsKey = "products";

    let userProducts = JSON.parse(localStorage.getItem(userProductsKey)) || [];
    let allProducts = JSON.parse(localStorage.getItem(allProductsKey)) || [];
    imageUrlInput.addEventListener("input", () => {
        const url = imageUrlInput.value;
        if (url) {
            previewImage.src = url;
            previewImage.style.display = "block";
        } else {
            previewImage.style.display = "none";
        }
    });
    const inputs = productForm.querySelectorAll("input[required], textarea[required], select[required]");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            updateInputBorder(input);
        });
        updateInputBorder(input);
    });

    function updateInputBorder(input) {
        if (input.checkValidity()) {
            input.style.border = "2px solid green";
        } else {
            input.style.border = "2px solid red";
        }
    }
    productForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let allValid = true;

        inputs.forEach(input => {
            updateInputBorder(input);
            if (!input.checkValidity()) {
                allValid = false;
            }
        });

        if (!allValid) {
            alert("Zəhmət olmasa, bütün sahələri düzgün doldurun.");
            return;
        }

        const newProduct = {
            id: allProducts.length + 1,
            brand: document.getElementById("brand").value,
            model: document.getElementById("model").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            rating: document.getElementById("rating").value,
            image: document.getElementById("image-url").value,
            owner: user.username
        };
        const newProduct1 = { ...newProduct, id: userProducts.length + 1 };

        userProducts.push(newProduct1);
        localStorage.setItem(userProductsKey, JSON.stringify(userProducts));

        allProducts.push(newProduct);
        localStorage.setItem(allProductsKey, JSON.stringify(allProducts));

        alert("Məhsul uğurla əlavə olundu!");
        productForm.reset();
        previewImage.style.display = "none";
        inputs.forEach(input => updateInputBorder(input));
        window.location.href = "../products.html"
    });
});



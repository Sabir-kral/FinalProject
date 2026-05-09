function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('preview-image');
        if (output) {
            output.src = reader.result;
            output.style.display = 'block';
        }
    };
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

async function create(event) {
    event.preventDefault();
    const fileInput = document.getElementById("image-file");
    const resultDiv = document.getElementById("result");

    if (!fileInput || fileInput.files.length === 0) {
        alert("Zəhmət olmasa şəkil seçin!");
        return;
    }

    try {
        resultDiv.innerText = "Yüklənir...";
        

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        const fileResponse = await fetch("http://localhost:8080/api/files/upload", {
            method: "POST",
            body: formData
        });

        if (!fileResponse.ok) throw new Error("Şəkil yüklənə bilmədi.");
        const uploadedImageName = await fileResponse.text();


        const requestData = {
            brand: document.getElementById("brand").value,
            model: document.getElementById("model").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value) || 0,
            rating: parseInt(document.getElementById("rating").value) || 0,
            categoryName: document.getElementById("category").value,
            image: uploadedImageName 
        };

        const response = await fetch("http://localhost:8080/api/products/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            alert("Məhsul uğurla əlavə edildi!");
            window.location.href = "../shop/shop.html";
        } else {
            const err = await response.text();
            alert("Xəta: " + err);
        }
    } catch (error) {
        resultDiv.style.color = "red";
        resultDiv.innerText = error.message;
    }
}
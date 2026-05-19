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

    const userDataString = localStorage.getItem("activeUser");
    if (!userDataString) {
        alert("Sizin giriş icazəniz yoxdur. Zəhmət olmasa login olun.");
        return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData.accessToken; 

    const fileInput = document.getElementById("image-file");
    const resultDiv = document.getElementById("result");

    if (!fileInput || fileInput.files.length === 0) {
        alert("Zəhmət olmasa şəkil seçin!");
        return;
    }

    try {
        resultDiv.innerText = "Yüklənir...";
        resultDiv.style.color = "blue";

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        const fileResponse = await fetch("http://localhost:8080/api/files/upload", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
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
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
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
// İnputların rəngini dəyişən funksiya


// Şəkil önizləmə
function setupInputValidation() {
    // HTML-də formun ID-si "product-form" olduğu üçün onu burda düzəltdik
    const form = document.getElementById("product-form");
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach(input => {
        const checkValue = () => {
            // Şəkil seçmə inputu (file) üçün border məntiqi previewImage-dədir
            if (input.type === "file") return;

            if (input.value.trim() !== "") {
                input.style.border = "2px solid green";
                input.style.outline = "none"; // Qara çərçivəni itirmək üçün
            } else {
                input.style.border = "2px solid red";
                input.style.outline = "none";
            }
        };

        // Hadisələri dinləyirik
        input.addEventListener("input", checkValue);
        input.addEventListener("change", checkValue);
        input.addEventListener("blur", checkValue);

        // Səhifə açılan kimi mövcud vəziyyəti yoxla
        checkValue();
    });
}

// Şəkil önizləmə və onun borderi
function previewImage(event) {
    const reader = new FileReader();
    const fileInput = document.getElementById("image-file");
    
    reader.onload = function() {
        const output = document.getElementById('preview-image');
        if (output) {
            output.src = reader.result;
            output.style.display = 'block';
            // Şəkil uğurla seçilibsə yaşıl et
            fileInput.style.border = "2px solid green";
        }
    };
    
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    } else {
        fileInput.style.border = "2px solid red";
    }
}

// Səhifə yüklənəndə funksiyanı işə salırıq
document.addEventListener("DOMContentLoaded", setupInputValidation);

// Məhsul yaratma funksiyan (create) eyni qala bilər, 
// sadəcə yuxarıdakı setupInputValidation-u əlavə etməyin kifayətdir.
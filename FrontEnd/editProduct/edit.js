document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const userData = JSON.parse(localStorage.getItem("activeUser"));

    // İstifadəçi və ya ID yoxdursa geri yönləndir
    if (!userData || !productId) {
        window.location.href = "../products.html";
        return;
    }

    const token = userData.accessToken;
    let currentImageName = ""; 

    // --- 1. MÖVCUD MƏLUMATLARI VƏ ŞƏKLİ GETİRİB AYARLAMAQ ---
    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("Bu məhsula baxmağa səlahiyyətiniz çatmır (403 Forbidden).");
            }
            throw new Error("Məhsul tapılmadı.");
        }
        
        const product = await response.json();

        // HTML elementlərini doldururuq
        const brandEl = document.getElementById("brand");
        const modelEl = document.getElementById("model");
        const catEl = document.getElementById("category");
        const descEl = document.getElementById("description");
        const priceEl = document.getElementById("price");
        const ratEl = document.getElementById("rating");

        if(brandEl) brandEl.value = product.brand || "";
        if(modelEl) modelEl.value = product.model || "";
        if(catEl) catEl.value = product.categoryName || product.category?.name || "";
        if(descEl) descEl.value = product.description || "";
        if(priceEl) priceEl.value = product.price || "";
        if(ratEl) ratEl.value = product.rating || "";
        
        // Şəklin adını yadda saxlayırıq (Dəyişdirilməzsə backend-ə göndərmək üçün)
        currentImageName = product.image || "";

        // ŞƏKİL AYARLAMA HİSSƏSİ
        const preview = document.getElementById("preview");
        if (preview) {
            if (product.image && product.image.trim() !== "") {
                // admin.js faylındakı düzgün şəkil oxuma endpoint-indən çağırırıq
                preview.src = `http://localhost:8080/api/files/${product.image}`;
                preview.style.display = "block";
                
                // HTML-də qalan köhnə səhv onerror funksiyalarını sıfırlayırıq
                preview.onerror = function() {
                    console.error("Şəkil serverdən yüklənə bilmədi: " + preview.src);
                    preview.style.display = "none";
                };
            } else {
                preview.style.display = "none";
            }
        }

    } catch (error) {
        console.error(error);
        alert("Xəta: " + error.message);
    }

    // Giriş sahələrinin rəng tənzimləməsi
    setupInputValidation();

    const fileInput = document.getElementById("imageFile");
    if (fileInput) {
        fileInput.addEventListener("change", previewImage);
    }

    // --- 2. YENİLƏMƏ (PUT) SORĞUSUNUN GÖNDƏRİLMƏSİ ---
    const form = document.getElementById("editProductForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            try {
                // admin.js panelində olduğu kimi bütöv FormData yaradırıq
                const formData = new FormData();
                
                // Parametrləri tək-tək əlavə edirik (Backend-dəki @ModelAttribute və ya param adları ilə eyni)
                formData.append("brand", document.getElementById("brand")?.value || "");
                formData.append("model", document.getElementById("model")?.value || "");
                formData.append("description", document.getElementById("description")?.value || "");
                formData.append("price", parseFloat(document.getElementById("price")?.value || 0));
                formData.append("rating", parseInt(document.getElementById("rating")?.value || 5));
                formData.append("categoryName", document.getElementById("category")?.value || "");

                // Şəkil yoxlaması: Əgər yeni şəkil seçilibsə, faylı göndər
                if (fileInput && fileInput.files.length > 0) {
                    formData.append("imageFile", fileInput.files[0]);
                } else {
                    // Əgər yeni şəkil seçilməyibsə, mövcud şəklin adını string olaraq göndər
                    formData.append("image", currentImageName);
                }

                // Vahid admin.js-də işləyən endpoint-ə sorğu atırıq
                const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                    method: "PUT",
                    headers: { 
                        "Authorization": "Bearer " + token 
                        // QEYD: Content-Type yazmırıq! Brauzer FormData üçün boundary özü qoyur.
                    },
                    body: formData
                });

                if (response.ok) {
                    alert("Məhsul və şəkil uğurla yeniləndi!");
                    window.location.href = "../products.html";
                } else if (response.status === 403) {
                    alert("Xəta 403: Bu məhsulu redaktə etməyə icazəniz yoxdur! (Məhsulun sahibi deyilsiniz və ya rolunuz yenilənməyib. Çıxış edib yenidən daxil olun!)");
                } else {
                    const errText = await response.text();
                    alert(`Yeniləmə zamanı xəta baş verdi! Status: ${response.status}\nMəlumat: ${errText}`);
                }
            } catch (error) {
                alert("Sorğu göndərilərkən xəta yarandı: " + error.message);
            }
        });
    }
});

// Giriş sahələrinin validasiyası (Yaşıl / Qırmızı çərçivə)
function setupInputValidation() {
    const form = document.getElementById("editProductForm");
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
        const checkValue = () => {
            if (input.type === "file") return;
            if (input.value.trim() !== "") {
                input.style.border = "2px solid green";
            } else {
                input.style.border = "2px solid red";
            }
        };
        input.addEventListener("input", checkValue);
        input.addEventListener("blur", checkValue);
        checkValue();
    });
}

// Yeni şəkil seçiləndə ekranda anında önizləmə edilməsi
function previewImage(event) {
    const reader = new FileReader();
    const fileInput = document.getElementById("imageFile");
    const output = document.getElementById('preview');
    
    reader.onload = function() {
        if (output) {
            output.src = reader.result;
            output.style.display = 'block';
            if (fileInput) fileInput.style.border = "2px solid green";
        }
    };
    
    if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    } else {
        if (fileInput) fileInput.style.border = "2px solid red";
    }
}
async function getUser() {
    const userData = localStorage.getItem("activeUser");
    
    if (!userData) {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = "İstifadəçi Giriş Etməyib";
        return;
    }

    const token = JSON.parse(userData)?.accessToken;

    try {
        const response = await fetch("http://localhost:8080/api/customers/profile", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) {
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerText = "Server Error və ya Token etibarsızdır";
            return;
        }

        const data = await response.json();
        
        document.querySelector(".names").innerText = `name: ${data.name}`;
        document.querySelector(".surname").innerText = `surname: ${data.surname}`;
        document.querySelector(".username").innerText = `username: ${data.username}`;
        document.querySelector(".email").innerText = `email: ${data.email}`;
        
        document.querySelector(".name").innerText = data.name;

    } catch (error) {
        console.error("Xəta:", error);
        document.getElementById("result").innerText = "Bağlantı xətası!";
    }
}

// --- UPDATE PROFILE (Dinamik inputları 'result' divinə append edir) ---
async function updateProfile() {
    const userData = localStorage.getItem("activeUser");
    if (!userData) return alert("Giriş etməmisiniz!");
    const token = JSON.parse(userData)?.accessToken;

    try {
        // Cari məlumatları götürürük ki inputların içinə dolduraq
        const res = await fetch("http://localhost:8080/api/customers/profile", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) return alert("Profil məlumatları alınmadı!");
        const data = await res.json();

        const resultContainer = document.getElementById("result");
        resultContainer.innerHTML = ""; // Hər ehtimala qarşı təmizləyirik

        // append olunacaq forma teqləri
        const formHtml = `
            <div id="update-form-container" style="margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; color: #222; max-width: 400px;">
                <h4 style="margin-top:0; color:#333;">Profili Yenilə</h4>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight:bold; size:14px;">Ad:</label><br>
                    <input type="text" id="up-name" value="${data.name || ''}" style="width:100%; padding:6px; margin-top:4px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight:bold; size:14px;">Soyad:</label><br>
                    <input type="text" id="up-surname" value="${data.surname || ''}" style="width:100%; padding:6px; margin-top:4px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight:bold; size:14px;">İstifadəçi adı (Username):</label><br>
                    <input type="text" id="up-username" value="${data.username || ''}" style="width:100%; padding:6px; margin-top:4px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight:bold; size:14px;">Email:</label><br>
                    <input type="email" id="up-email" value="${data.email || ''}" style="width:100%; padding:6px; margin-top:4px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="font-weight:bold; size:14px;">Yeni Şifrə (Dəyişmək istəmirsinizsə boş buraxın):</label><br>
                    <input type="password" id="up-password" placeholder="Yeni şifrə..." style="width:100%; padding:6px; margin-top:4px; border:1px solid #ccc; border-radius:4px;">
                </div>
                <div style="display:flex; gap:10px;">
                    <button type="button" onclick="saveProfileChanges()" style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight:bold;">Yadda Saxla</button>
                    <button type="button" onclick="document.getElementById('update-form-container').remove()" style="background: #6c757d; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">Ləğv Et</button>
                </div>
            </div>
        `;
        
        // Elementi "result" divinə append edirik
        resultContainer.innerHTML = formHtml;

    } catch (error) {
        console.error("Xəta:", error);
        alert("Məlumat yüklənərkən xəta yarandı.");
    }
}

// --- Profil Dəyişikliklərini Serverə Göndərən Köməkçi Metod ---
async function saveProfileChanges() {
    const userData = localStorage.getItem("activeUser");
    const parsedUser = JSON.parse(userData);
    const token = parsedUser?.accessToken;

    const updatedData = {
        name: document.getElementById("up-name").value,
        surname: document.getElementById("up-surname").value,
        username: document.getElementById("up-username").value,
        email: document.getElementById("up-email").value,
        password: document.getElementById("up-password").value || null
    };

    try {
        const response = await fetch("http://localhost:8080/api/customers/profile", {
            method: "PUT",
            headers: { 
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Profiliniz uğurla yeniləndi!");
            
            // LocalStorage-də olan köhnə username parametrini təzələyirik
            parsedUser.username = updatedData.username;
            localStorage.setItem("activeUser", JSON.stringify(parsedUser));

            // Formu bağlayıb əsas görünüşü yenidən yükləyirik
            document.getElementById("update-form-container").remove();
            getUser(); 
        } else {
            alert("Məlumatlar yenilənmədi. Giriş parametrlərini yoxlayın.");
        }
    } catch (error) {
        console.error("Xəta:", error);
        alert("Bağlantı xətası!");
    }
}

// --- DELETE PROFILE (Hesabı Sil) ---
async function deleteProfile() {
    if (!confirm("Hesabınızı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz!")) {
        return;
    }

    const userData = localStorage.getItem("activeUser");
    if (!userData) return;
    const token = JSON.parse(userData)?.accessToken;

    try {
        const response = await fetch("http://localhost:8080/api/customers/profile", {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (response.ok) {
            alert("Hesabınız silindi.");
            localStorage.removeItem("activeUser");
            window.location.href = "./index.html";
        } else {
            alert("Silinmə zamanı xəta baş verdi. Sistem idarəçisi ilə əlaqə saxlayın.");
        }
    } catch (error) {
        console.error("Xəta:", error);
        alert("Şəbəkə bağlantısı xətası!");
    }
}

window.onload = getUser;

function out() {
    document.querySelector(".bi-person").style.display = "none"
    localStorage.removeItem("activeUser");
    document.querySelector(".name").style.display = "none";
    document.querySelector(".logOut").style.display = "none";
    document.querySelector(".logIn").style.display = "inline";
    
    window.location.href = "./index.html";
}

function opens() {
    window.open("./login.html")
}

function openss() {
    window.open("./user.html")
}

function cart() {
    window.open("./cart/cart.html");
}
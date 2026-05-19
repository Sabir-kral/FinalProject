document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    const API_URL = "http://localhost:8080/api";
    const token = user?.accessToken;

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // --- Authorization Helper ---
    async function authorizedFetch(url, options = {}) {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers
        };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 403) {
            alert("Səlahiyyətiniz çatmır!");
            return null;
        }
        return response;
    }

    // --- Naviqasiya ---
    window.showSection = function(section) {
        document.getElementById("main-content").style.display = "block";
        document.getElementById("details-view").style.display = "none";
        document.getElementById("edit-view").style.display = "none";
        
        document.querySelectorAll(".admin-section").forEach(s => s.style.display = "none");
        const target = document.getElementById(`${section}-section`);
        if (target) target.style.display = "block";

        if (section === 'products') loadProducts();
        if (section === 'users') loadUsers();
        if (section === 'contacts') loadContacts();
    }

    // --- 1. Məhsullar ---
    async function loadProducts() {
        const res = await authorizedFetch(`${API_URL}/products/all`);
        if (!res) return;
        const data = await res.json();
        document.getElementById("product-list").innerHTML = data.map(i => `
            <tr>
                <td>${i.id}</td>
                <td><img src="${API_URL}/files/${i.image}" width="40" height="40" style="border-radius:5px;"></td>
                <td onclick="viewDetail('products', ${i.id})" style="cursor:pointer; color:cyan; text-decoration:underline">${i.brand}</td>
                <td>${i.price} $</td>
                <td>
                    <button onclick="openEdit('products', ${i.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteItem('products', ${i.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join("");
    }

    // --- 2. İstifadəçilər ---
    async function loadUsers() {
        const res = await authorizedFetch(`${API_URL}/customers/admin/all`);
        if (!res) return;
        const data = await res.json();
        document.getElementById("user-list").innerHTML = data.map(u => `
            <tr>
                <td>${u.id}</td>
                <td onclick="viewDetail('customers', ${u.id})" style="cursor:pointer; color:cyan; text-decoration:underline">${u.username}</td>
                <td>${u.email}</td>
                <td>${u.role || 'USER'}</td>
                <td>
                    <button onclick="openEdit('customers', ${u.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteItem('customers', ${u.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join("");
    }

    // --- 3. Kontaktlar ---
    async function loadContacts() {
        const res = await authorizedFetch(`${API_URL}/contact/all`);
        if (!res) return;
        const data = await res.json();
        document.getElementById("contact-list").innerHTML = data.map(c => `
            <tr>
                <td>${c.id}</td>
                <td onclick="viewDetail('contact', ${c.id})" style="cursor:pointer; color:cyan; text-decoration:underline">${c.name}</td>
                <td>${c.email}</td>
                <td><button class="delete-btn" onclick="deleteItem('contact', ${c.id})"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join("");
    }

    // --- 4. FindById (Details View) ---
    window.viewDetail = async function(type, id) {
        let url = (type === 'customers') ? `${API_URL}/customers/admin/all` : `${API_URL}/${type}/${id}`;
        const res = await authorizedFetch(url);
        if (!res) return;
        let data = await res.json();
        if (Array.isArray(data)) data = data.find(i => i.id == id);

        document.getElementById("main-content").style.display = "none";
        const detailsView = document.getElementById("details-view");
        detailsView.style.display = "block";

        let html = `<div class="exclusive-card">
            <h2 style="color:#ff4d4d; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:20px;">
                <i class="fas fa-search"></i> Məlumat Detalları
            </h2>`;
        
        for (let key in data) {
            if (["password", "subject", "authorities"].includes(key)) continue;
            if (key === "image") {
                html += `<div style="text-align:center; margin-bottom:20px;">
                            <img src="${API_URL}/files/${data[key]}" style="width:180px; border:2px solid #ff4d4d; border-radius:10px;">
                         </div>`;
            } else {
                html += `<div class="exclusive-field"><strong>${key.toUpperCase()}:</strong> <span>${data[key]}</span></div>`;
            }
        }
        html += `<button onclick="goBack()" class="cancel-btn" style="width:100%; margin-top:20px; background:#444; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer;">Geri</button></div>`;
        document.getElementById("details-content").innerHTML = html;
    };

    // --- 5. Dinamik EDIT (Fayl Yükləmə Bölməsi və Customer Alanları Tam Yaradıldı) ---
    window.openEdit = async function(type, id) {
        let url = (type === 'customers') ? `${API_URL}/customers/admin/all` : `${API_URL}/${type}/${id}`;
        const res = await authorizedFetch(url);
        if (!res) return;
        let data = await res.json();
        if (Array.isArray(data)) data = data.find(i => i.id == id);

        document.getElementById("main-content").style.display = "none";
        const editView = document.getElementById("edit-view");
        editView.style.display = "block";

        let formHtml = `<div class="exclusive-card">
            <h2 style="color:#28a745; margin-bottom:25px; text-align:center;"><i class="fas fa-user-edit"></i> REDAKTƏ ET (ID: ${id})</h2>
            <form id="dynamic-edit-form" enctype="multipart/form-data">`;

        if (type === 'customers') {
            formHtml += `
                <div class="edit-input-group">
                    <label>İstifadəçi Adı (Username)</label>
                    <input type="text" name="username" value="${data.username || ''}" required>
                </div>
                <div class="edit-input-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${data.email || ''}" required>
                </div>
                <div class="edit-input-group">
                    <label>Ad (Name)</label>
                    <input type="text" name="name" value="${data.name || ''}">
                </div>
                <div class="edit-input-group">
                    <label>Soyad (Surname)</label>
                    <input type="text" name="surname" value="${data.surname || ''}">
                </div>
                <div class="edit-input-group">
                    <label>Yeni Şifrə (Dəyişmək istəmirsinizsə boş buraxın)</label>
                    <input type="password" name="password" placeholder="Yeni şifrə daxil edin...">
                </div>`;
        } else if (type === 'products') {
            formHtml += `
                <div class="edit-input-group">
                    <label>Brend / Ad (Brand)</label>
                    <input type="text" name="brand" value="${data.brand || ''}" required>
                </div>
                <div class="edit-input-group">
                    <label>Qiymət (Price)</label>
                    <input type="number" step="0.01" name="price" value="${data.price || ''}" required>
                </div>
                <div class="edit-input-group">
                    <label>Məhsul Şəkli (Dəyişmək istəmirsinizsə boş buraxın)</label>
                    <input type="file" name="imageFile" accept="image/*" style="padding:10px; background:#222; border-radius:5px; width:100%;">
                </div>`;
                
            for (let key in data) {
                if (["id", "image", "brand", "price", "authorities", "user"].includes(key)) continue;
                formHtml += `
                    <div class="edit-input-group">
                        <label>${key}</label>
                        <input type="text" name="${key}" value="${data[key] || ''}">
                    </div>`;
            }
        } else {
            for (let key in data) {
                if (["id", "image", "authorities", "password", "subject", "role", "user"].includes(key)) continue;
                formHtml += `
                    <div class="edit-input-group">
                        <label>${key}</label>
                        <input type="text" name="${key}" value="${data[key] || ''}">
                    </div>`;
            }
        }

        formHtml += `
            <div style="display:flex; gap:10px; margin-top:25px;">
                <button type="button" onclick="saveUpdate('${type}', ${id})" style="flex:2; background:#28a745; color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer;">YADDA SAXLA</button>
                <button type="button" onclick="goBack()" style="flex:1; background:#444; color:white; border:none; padding:14px; border-radius:8px; cursor:pointer;">LƏĞV ET</button>
            </div>
        </form></div>`;
        
        editView.innerHTML = formHtml;
    };

    // --- 6. Save Update (Fayl Ötürülməsi İnteqrasiya Olundu) ---
    window.saveUpdate = async function(type, id) {
        const formElement = document.getElementById("dynamic-edit-form");
        let updateUrl = (type === 'customers') ? `${API_URL}/customers/admin/${id}` : `${API_URL}/${type}/${id}`;
        
        if (type === 'products') {
            const formData = new FormData(formElement);
            
            // Multipart sorğularda custom fetch istifadə edilir (Boundary avtomatik brauzer tərəfindən qoyulsun deyə)
            const response = await fetch(updateUrl, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (response.status === 403) { alert("Səlahiyyətiniz çatmır!"); return; }
            if (response.ok) {
                alert("Məhsul və şəkil uğurla yeniləndi!");
                showSection('products');
            }
        } else {
            const formData = new FormData(formElement);
            const body = Object.fromEntries(formData.entries());
            
            const res = await authorizedFetch(updateUrl, {
                method: "PUT",
                body: JSON.stringify(body)
            });

            if (res && res.ok) {
                alert("Uğurla yeniləndi!");
                showSection(type === 'customers' ? 'users' : type);
            }
        }
    };

    // --- 7. Delete (Spesifik Admin URL İnteqrasiyası) ---
    window.deleteItem = async function(type, id) {
        if (!confirm("Həqiqətən silmək istəyirsiniz?")) return;
        
        let deleteUrl = (type === 'customers') ? `${API_URL}/customers/admin/${id}` : `${API_URL}/${type}/${id}`;

        const res = await authorizedFetch(deleteUrl, { method: "DELETE" });
        if (res && res.ok) {
            alert("Silindi!");
            
            if (type === 'products') {
                loadProducts();
            } else if (type === 'customers') {
                loadUsers();
            } else if (type === 'contact' || type === 'contacts') {
                loadContacts();
            }
        }
    };

    window.goBack = function() {
        document.getElementById("main-content").style.display = "block";
        document.getElementById("details-view").style.display = "none";
        document.getElementById("edit-view").style.display = "none";
    }

    showSection('products');
});

function logOut(){
    localStorage.removeItem("activeUser");
    window.location.href = "login.html";
}
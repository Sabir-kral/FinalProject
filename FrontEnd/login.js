async function login(event) {
    event.preventDefault()

    const username = document.getElementById("input");
    const password = document.getElementById("inputIki");

    const request = {
        username:username.value,
        password:password.value
    }
    const response = await fetch("http:
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(request)
    });
    const data = await response.json();

    if(response.ok) {
        const userData = {
        username: document.getElementById("input").value, 
        accessToken: data.accessToken,
        roles:data.roles
    };
    localStorage.setItem("activeUser", JSON.stringify(userData));
        document.getElementById("result").style.color = "green";
        document.getElementById("result").innerText = "succesfully logined";
        setInterval(() => {
            window.location.href = "index.html"
        }, 3000);
     } else{
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = data.message;
        }
    
}